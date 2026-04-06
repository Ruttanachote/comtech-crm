<script setup lang="ts">
  import type { PropType } from 'vue';

  interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    formatter?: (value: any, row: any) => string;
  }

  interface TableAction {
    label: string;
    icon: string;
    color?: string;
    onClick: (row: any) => void;
  }

  interface Pagination {
    page: number;
    perPage: number;
    total: number;
  }

  const props = defineProps({
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object as PropType<Pagination>,
      default: null,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<TableAction[]>,
      default: () => [],
    },
    emptyText: {
      type: String,
      default: '',
    },
    rowKey: {
      type: String,
      default: 'id',
    },
  });

  const emit = defineEmits([
    'update:pagination',
    'sort',
    'select',
    'selectAll',
    'rowClick',
  ]);

  const selectedRows = ref<string[]>([]);
  const sortKey = ref('');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  const allSelected = computed(() => {
    return props.data.length > 0 && selectedRows.value.length === props.data.length;
  });

  const someSelected = computed(() => {
    return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length;
  });

  const onSelectAll = () => {
    if (allSelected.value) {
      selectedRows.value = [];
    } else {
      selectedRows.value = props.data.map((row) => row[props.rowKey]);
    }
    emit('selectAll', selectedRows.value);
  };

  const onSelectRow = (row: any) => {
    const key = row[props.rowKey];
    const index = selectedRows.value.indexOf(key);
    if (index > -1) {
      selectedRows.value.splice(index, 1);
    } else {
      selectedRows.value.push(key);
    }
    emit('select', selectedRows.value);
  };

  const onSort = (column: TableColumn) => {
    if (!column.sortable) return;

    if (sortKey.value === column.key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = column.key;
      sortOrder.value = 'asc';
    }

    emit('sort', { key: sortKey.value, order: sortOrder.value });
  };

  const getCellValue = (row: any, column: TableColumn) => {
    const value = row[column.key];
    if (column.formatter) {
      return column.formatter(value, row);
    }
    return value;
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const onPageChange = (page: number) => {
    if (props.pagination) {
      emit('update:pagination', { ...props.pagination, page });
    }
  };

  const onPerPageChange = (perPage: number) => {
    if (props.pagination) {
      emit('update:pagination', { ...props.pagination, perPage, page: 1 });
    }
  };
</script>

<template>
  <div class="w-full">
    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="w-full text-sm text-left">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <!-- Checkbox Column -->
            <th v-if="selectable" class="p-4 w-10">
              <UCheckbox
                :model-value="allSelected"
                :indeterminate="someSelected"
                @change="onSelectAll"
              />
            </th>

            <!-- Columns -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'p-4 font-semibold whitespace-nowrap',
                getAlignClass(column.align),
                column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              :style="column.width ? { width: column.width } : {}"
              @click="onSort(column)"
            >
              <div class="flex items-center gap-1" :class="getAlignClass(column.align)">
                {{ column.label }}
                <span v-if="column.sortable" class="text-gray-400">
                  <CommonIcon
                    v-if="sortKey === column.key"
                    :name="sortOrder === 'asc' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    size="w-4 h-4"
                  />
                  <CommonIcon
                    v-else
                    name="i-lucide-chevrons-up-down"
                    size="w-4 h-4"
                  />
                </span>
              </div>
            </th>

            <!-- Actions Column -->
            <th v-if="actions.length" class="p-4 w-20 text-right">
              {{ $t('common.actions') }}
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Loading State -->
          <tr v-if="loading">
            <td
              :colspan="columns.length + (selectable ? 1 : 0) + (actions.length ? 1 : 0)"
              class="p-8 text-center"
            >
              <CommonLoader />
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="data.length === 0">
            <td
              :colspan="columns.length + (selectable ? 1 : 0) + (actions.length ? 1 : 0)"
              class="p-8 text-center text-gray-500"
            >
              {{ emptyText || $t('common.noData') }}
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="row in data"
            :key="row[rowKey]"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            @click="$emit('rowClick', row)"
          >
            <!-- Checkbox -->
            <td v-if="selectable" class="p-4">
              <UCheckbox
                :model-value="selectedRows.includes(row[rowKey])"
                @change="onSelectRow(row)"
              />
            </td>

            <!-- Cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['p-4', getAlignClass(column.align)]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ getCellValue(row, column) }}
              </slot>
            </td>

            <!-- Actions -->
            <td v-if="actions.length" class="p-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <CommonButton
                  v-for="action in actions"
                  :key="action.label"
                  variant="ghost"
                  size="xs"
                  :icon="action.icon"
                  :color="action.color || 'neutral'"
                  @click.stop="action.onClick(row)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination"
      class="flex items-center justify-between mt-4 px-2"
    >
      <div class="text-sm text-gray-500">
        {{ $t('common.showing') }} {{ (pagination.page - 1) * pagination.perPage + 1 }} -
        {{ Math.min(pagination.page * pagination.perPage, pagination.total) }}
        {{ $t('common.of') }} {{ pagination.total }} {{ $t('common.items') }}
      </div>

      <div class="flex items-center gap-4">
        <!-- Per Page Select -->
        <CommonSelection
          :model-value="pagination.perPage"
          :items="[
            { label: '5 / page', value: 5 },
            { label: '10 / page', value: 10 },
            { label: '20 / page', value: 20 },
            { label: '50 / page', value: 50 },
          ]"
          size="sm"
          @update:model-value="onPerPageChange"
        />

        <!-- Page Navigation -->
        <CommonPagination
          :model-value="pagination.page"
          :page-count="Math.ceil(pagination.total / pagination.perPage)"
          :total="pagination.total"
          @update:model-value="onPageChange"
        />
      </div>
    </div>
  </div>
</template>
