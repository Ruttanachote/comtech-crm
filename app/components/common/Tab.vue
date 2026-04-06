<script setup lang="ts">
  import { ref, type PropType } from 'vue';

  const emit = defineEmits(['change']);
  const props = defineProps({
    items: {
      type: Array as PropType<
        {
          label: string;
          value: string;
          default?: boolean;
          content?: string;
        }[]
      >,
      required: true,
    },
    color: { type: String, required: false, default: 'primary' },
  });

  const defaultIndex = props.items.findIndex((item) => item.default);
  const selectedIndex = ref(defaultIndex !== -1 ? defaultIndex : 0);

  const onChange = (index: number) => {
    selectedIndex.value = index;
    const item = props.items[index];
    if (item) {
      emit('change', item.value);
    }
  };
</script>

<template>
  <UTabs
    :items="props.items"
    :model-value="selectedIndex"
    @update:model-value="onChange"
    :ui="{
      list: {
        background: 'bg-gray-100 dark:bg-gray-800',
        marker: {
          background: 'bg-white dark:bg-gray-900 shadow-sm',
        },
      },
    }"
  />
</template>
