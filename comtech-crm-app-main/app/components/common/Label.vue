<script setup lang="ts">
  const props = defineProps<{
    title: string;
    id: string;
    require?: boolean;
  }>();
</script>

<template>
  <label
    :id="props.id"
    class="text-sm font-medium text-gray-700 whitespace-nowrap sm:w-20 dark:text-gray-300"
  >
    {{ props.title }}
    <span v-if="props.require" class="text-red-500 ml-1">*</span>
    <slot></slot>
  </label>
</template>
