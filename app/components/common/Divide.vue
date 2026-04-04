<script setup lang="ts">
  const props = defineProps({
    hasText: {
      type: Boolean,
      required: false,
      default: false,
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
  });
</script>

<template>
  <div v-if="!hasText" class="my-2 border-t border-gray-200 dark:border-gray-800"></div>
  <div v-else class="my-2 flex items-center gap-2 w-full">
    <div class="border-t border-gray-200 dark:border-gray-800 grow"></div>
    <span class="text-xs text-gray-500">{{ text }}</span>
    <div class="border-t border-gray-200 dark:border-gray-800 grow"></div>
  </div>
</template>
