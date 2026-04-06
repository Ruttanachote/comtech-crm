<script setup lang="ts">
  import type { PropType } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    change: {
      type: Number,
      default: null,
    },
    changeLabel: {
      type: String,
      default: '',
    },
    trend: {
      type: String as PropType<'up' | 'down' | 'neutral'>,
      default: 'neutral',
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String as PropType<'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray'>,
      default: 'blue',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    gray: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  const trendIcon = computed(() => {
    if (props.trend === 'up') return 'i-lucide-trending-up';
    if (props.trend === 'down') return 'i-lucide-trending-down';
    return 'i-lucide-minus';
  });

  const trendColor = computed(() => {
    if (props.trend === 'up') return 'text-emerald-600';
    if (props.trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  });
</script>

<template>
  <CommonCard
    :is-loading="loading"
    :is-background="false"
    body="p-5"
    class="h-full"
  >
    <div class="flex items-start justify-between">
      <!-- Left: Content -->
      <div class="flex-1">
        <!-- Title -->
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {{ title }}
        </p>
        
        <!-- Value -->
        <div class="flex items-baseline gap-1">
          <span v-if="prefix" class="text-lg text-gray-500">{{ prefix }}</span>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ value }}
          </span>
          <span v-if="suffix" class="text-lg text-gray-500">{{ suffix }}</span>
        </div>
        
        <!-- Change Indicator -->
        <div v-if="change !== null" class="flex items-center gap-1 mt-2">
          <CommonIcon
            :name="trendIcon"
            :class="trendColor"
            size="w-4 h-4"
          />
          <span :class="['text-sm font-medium', trendColor]">
            {{ change }}%
          </span>
          <span v-if="changeLabel" class="text-sm text-gray-500">
            {{ changeLabel }}
          </span>
        </div>
      </div>
      
      <!-- Right: Icon -->
      <div
        v-if="icon"
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          colorClasses[color],
        ]"
      >
        <CommonIcon :name="icon" size="w-6 h-6" />
      </div>
    </div>
  </CommonCard>
</template>
