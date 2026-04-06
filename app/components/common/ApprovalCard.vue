<script setup lang="ts">
  import type { PropType } from 'vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: '฿',
    },
    sender: {
      type: Object as PropType<{
        name: string;
        avatar?: string;
        initials?: string;
      }>,
      required: true,
    },
    status: {
      type: String as PropType<'pending' | 'approved' | 'rejected'>,
      default: 'pending',
    },
    priority: {
      type: String as PropType<'urgent' | 'medium' | 'low'>,
      default: 'medium',
    },
    waitingAt: {
      type: String,
      required: true,
    },
    daysWaiting: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['approve', 'reject', 'click']);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH').format(value);
  };

  const getPriorityIcon = () => {
    switch (props.priority) {
      case 'urgent':
        return 'i-lucide-alert-triangle';
      case 'medium':
        return 'i-lucide-clock';
      default:
        return 'i-lucide-minus';
    }
  };

  const getPriorityColor = () => {
    switch (props.priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getPriorityLabel = () => {
    switch (props.priority) {
      case 'urgent':
        return 'ด่วน';
      case 'medium':
        return 'ปานกลาง';
      default:
        return 'ต่ำ';
    }
  };
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
    @click="$emit('click')"
  >
    <!-- Header: ID & Priority -->
    <div class="flex items-start justify-between mb-3">
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ id }}
      </span>
      <div
        :class="[
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
          getPriorityColor(),
        ]"
      >
        <CommonIcon :name="getPriorityIcon()" size="w-3.5 h-3.5" />
        {{ getPriorityLabel() }}
      </div>
    </div>

    <!-- Title -->
    <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
      {{ title }}
    </h3>

    <!-- Customer -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      {{ customer }}
    </p>

    <!-- Divider -->
    <div class="border-t border-gray-100 dark:border-gray-700 my-4"></div>

    <!-- Info Grid -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <!-- Value -->
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">มูลค่า</p>
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ currency }} {{ formatCurrency(value) }}
        </p>
      </div>

      <!-- Sender -->
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ผู้ส่ง</p>
        <div class="flex items-center gap-2">
          <UAvatar
            :src="sender.avatar"
            :alt="sender.name"
            :text="sender.initials"
            size="xs"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">
            {{ sender.name }}
          </span>
        </div>
      </div>

      <!-- Waiting At -->
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">รออนุมัติที่</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ waitingAt }}
        </p>
        <p class="text-xs text-gray-400 mt-0.5">
          • {{ daysWaiting }} วันที่ผ่านมา
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <CommonButton
        variant="outline"
        color="neutral"
        size="sm"
        :label="$t('approval.reject')"
        :loading="loading"
        @click.stop="$emit('reject')"
      />
      <CommonButton
        variant="solid"
        color="primary"
        size="sm"
        :label="$t('approval.approve')"
        :loading="loading"
        @click.stop="$emit('approve')"
      />
    </div>
  </div>
</template>
