<script setup lang="ts">
  import type { PropType } from 'vue';

  interface KanbanItem {
    id: string;
    title: string;
    subtitle?: string;
    tags?: string[];
    assignee?: {
      name: string;
      initials: string;
      avatar?: string;
    };
    dueDate?: string;
    dueTime?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: string;
    type?: string;
    customer?: string;
  }

  interface KanbanColumn {
    id: string;
    title: string;
    count: number;
    color: string;
    items: KanbanItem[];
  }

  const props = defineProps({
    columns: {
      type: Array as PropType<KanbanColumn[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['dragStart', 'dragEnd', 'itemClick', 'addItem']);

  const draggedItem = ref<KanbanItem | null>(null);
  const draggedFromColumn = ref<string>('');
  const dragOverColumn = ref<string>('');

  const onDragStart = (item: KanbanItem, columnId: string) => {
    draggedItem.value = item;
    draggedFromColumn.value = columnId;
    emit('dragStart', { item, columnId });
  };

  const onDragOver = (columnId: string) => {
    dragOverColumn.value = columnId;
  };

  const onDragLeave = () => {
    dragOverColumn.value = '';
  };

  const onDrop = (columnId: string) => {
    if (draggedItem.value && draggedFromColumn.value !== columnId) {
      emit('dragEnd', {
        item: draggedItem.value,
        fromColumn: draggedFromColumn.value,
        toColumn: columnId,
      });
    }
    draggedItem.value = null;
    draggedFromColumn.value = '';
    dragOverColumn.value = '';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'ด่วน';
      case 'medium':
        return 'ปานกลาง';
      case 'low':
        return 'ต่ำ';
      default:
        return '';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'done':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };
</script>

<template>
  <div class="w-full overflow-x-auto">
    <div class="flex gap-4 min-w-max pb-4">
      <!-- Columns -->
      <div
        v-for="column in columns"
        :key="column.id"
        class="w-80 flex-shrink-0"
        :class="{
          'ring-2 ring-blue-400 ring-offset-2': dragOverColumn === column.id,
        }"
        @dragover.prevent="onDragOver(column.id)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(column.id)"
      >
        <!-- Column Header -->
        <div
          class="flex items-center justify-between p-3 rounded-t-lg"
          :class="column.color"
        >
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm">{{ column.title }}</span>
            <CommonBadge
              :label="String(column.count)"
              size="sm"
              variant="solid"
              color="gray"
            />
          </div>
          <CommonButton
            variant="ghost"
            size="xs"
            icon="i-lucide-plus"
            @click="$emit('addItem', column.id)"
          />
        </div>

        <!-- Column Body -->
        <div
          class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg min-h-[200px] space-y-3"
        >
          <!-- Items -->
          <div
            v-for="item in column.items"
            :key="item.id"
            draggable="true"
            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow"
            @dragstart="onDragStart(item, column.id)"
            @click="$emit('itemClick', item)"
          >
            <!-- Priority Badge -->
            <div v-if="item.priority || item.status" class="mb-2">
              <span
                :class="[
                  'text-xs font-medium px-2 py-1 rounded-full',
                  item.status ? getStatusColor(item.status) : getPriorityColor(item.priority),
                ]"
              >
                {{ item.status === 'overdue' ? 'เกินกำหนด' : item.status === 'done' ? 'เสร็จสิ้น' : getPriorityLabel(item.priority) }}
              </span>
            </div>

            <!-- Title -->
            <h4 class="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
              {{ item.title }}
            </h4>

            <!-- Subtitle -->
            <p v-if="item.subtitle" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ item.subtitle }}
            </p>

            <!-- Date & Time -->
            <div v-if="item.dueDate" class="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <CommonIcon name="i-lucide-calendar" size="w-4 h-4" />
              <span>{{ formatDate(item.dueDate) }}</span>
              <span v-if="item.dueTime">• {{ item.dueTime }}</span>
            </div>

            <!-- Type & Customer -->
            <div v-if="item.type || item.customer" class="flex flex-wrap gap-2 mb-3">
              <span
                v-if="item.type"
                class="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded"
              >
                {{ item.type }}
              </span>
            </div>

            <p v-if="item.customer" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ item.customer }}
            </p>

            <!-- Assignee -->
            <div v-if="item.assignee" class="flex items-center gap-2">
              <UAvatar
                :src="item.assignee.avatar"
                :alt="item.assignee.name"
                :text="item.assignee.initials"
                size="xs"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ item.assignee.name }}
              </span>
            </div>
          </div>

          <!-- Add Card Button -->
          <button
            class="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            @click="$emit('addItem', column.id)"
          >
            <span class="flex items-center justify-center gap-1">
              <CommonIcon name="i-lucide-plus" size="w-4 h-4" />
              Add a card
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
