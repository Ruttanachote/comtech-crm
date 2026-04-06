<script setup lang="ts">
  import type { PropType } from 'vue';

  interface PipelineStage {
    name: string;
    count: number;
    color: string;
  }

  const props = defineProps({
    stages: {
      type: Array as PropType<PipelineStage[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['stageClick']);

  const defaultColors = [
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-green-500',
    'bg-red-500',
  ];

  const getStageColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;
    return defaultColors[index % defaultColors.length];
  };
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <CommonLoader />
    </div>

    <!-- Pipeline -->
    <div v-else class="flex items-center overflow-x-auto pb-4">
      <div
        v-for="(stage, index) in stages"
        :key="stage.name"
        class="flex items-center flex-shrink-0"
      >
        <!-- Stage Card -->
        <div
          class="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-w-[100px] cursor-pointer hover:shadow-md transition-shadow"
          @click="$emit('stageClick', stage)"
        >
          <!-- Count Badge -->
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2',
              getStageColor(index, stage.color),
            ]"
          >
            {{ stage.count }}
          </div>
          
          <!-- Stage Name -->
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {{ stage.name }}
          </span>
        </div>

        <!-- Arrow (except last item) -->
        <div
          v-if="index < stages.length - 1"
          class="flex-shrink-0 px-2"
        >
          <CommonIcon
            name="i-lucide-chevron-right"
            class="text-gray-400"
            size="w-6 h-6"
          />
        </div>
      </div>
    </div>
  </div>
</template>
