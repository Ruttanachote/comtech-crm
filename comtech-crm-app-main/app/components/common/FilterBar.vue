<script setup lang="ts">
  import type { PropType } from 'vue';

  interface FilterOption {
    label: string;
    value: string;
  }

  interface Filter {
    id: string;
    label: string;
    type: 'select' | 'date' | 'search' | 'daterange';
    options?: FilterOption[];
    placeholder?: string;
  }

  const props = defineProps({
    filters: {
      type: Array as PropType<Filter[]>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    showClear: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:modelValue', 'clear', 'search']);

  const localFilters = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const hasActiveFilters = computed(() => {
    return Object.values(localFilters.value).some(
      (v) => v !== '' && v !== null && v !== undefined
    );
  });

  const onClear = () => {
    emit('clear');
  };

  const onSearch = () => {
    emit('search', localFilters.value);
  };
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <!-- Search Input (if exists) -->
    <template v-for="filter in filters" :key="filter.id">
      <div v-if="filter.type === 'search'" class="flex-1 min-w-[200px]">
        <UInput
          v-model="localFilters[filter.id]"
          :placeholder="filter.placeholder || $t('common.search')"
          icon="i-lucide-search"
          size="md"
          class="w-full"
        />
      </div>
    </template>

    <!-- Other Filters -->
    <template v-for="filter in filters" :key="filter.id">
      <!-- Select Filter -->
      <div v-if="filter.type === 'select'" class="min-w-[150px]">
        <CommonSelection
          v-model="localFilters[filter.id]"
          :items="filter.options || []"
          :placeholder="filter.label"
          size="md"
        />
      </div>

      <!-- Date Filter -->
      <div v-if="filter.type === 'date'" class="min-w-[150px]">
        <CommonDatePicker
          v-model="localFilters[filter.id]"
          :placeholder="filter.label"
        />
      </div>

      <!-- Date Range Filter -->
      <div v-if="filter.type === 'daterange'" class="min-w-[280px]">
        <CommonDateRangePicker
          v-model:start="localFilters[filter.id + 'Start']"
          v-model:end="localFilters[filter.id + 'End']"
          :placeholder="filter.label"
        />
      </div>
    </template>

    <!-- Actions -->
    <div class="flex items-center gap-2 ml-auto">
      <!-- Clear Button -->
      <CommonButton
        v-if="showClear && hasActiveFilters"
        variant="ghost"
        color="neutral"
        size="md"
        icon="i-lucide-x"
        :label="$t('common.clear')"
        @click="onClear"
      />

      <!-- Search Button -->
      <CommonButton
        variant="solid"
        color="primary"
        size="md"
        icon="i-lucide-search"
        :label="$t('common.search')"
        @click="onSearch"
      />
    </div>
  </div>
</template>
