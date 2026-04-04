<script setup lang="ts">
  const props = defineProps({
    isBackground: {
      type: Boolean,
      default: true,
    },
    body: {
      type: String,
      default: 'p-4',
    },
    header: {
      type: String,
      default: '',
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    ui: {
      type: Object,
      default: () => ({}),
    },
  });
</script>
<template>
  <div
    v-if="props.isLoading"
    class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-full min-h-[200px]"
  ></div>
  <UCard
    v-else
    :ui="{
      root: 'h-full flex flex-col dark:ring-white/70',
      header: {
        padding: (!props.isBackground ? '!px-4' : 'px-2') + ' ',
        base:
          (!props.isBackground ? 'bg-none' : 'bg-gray-100 dark:bg-gray-800') +
          ' rounded-t-lg rounded-b-none ' +
          props.header,
      },
      body: {
        base: 'flex-1',
        padding: props.body ?? '',
      },
      ...props.ui,
    }"
  >
    <template #header v-if="$slots.header && props.showHeader">
      <div class="flex flex-col space-y-2">
        <slot name="header" />
        <slot name="detail" v-if="$slots.detail" />
      </div>
    </template>
    <div class="h-full">
      <slot />
    </div>
  </UCard>
</template>
