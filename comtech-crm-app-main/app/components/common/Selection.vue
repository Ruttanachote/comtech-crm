<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
    selected: {
      type: null,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Select an item',
    },
  });

  const emit = defineEmits(['update:value']);

  const localSelected = ref(props.selected === '' ? null : props.selected);

  watch(
    () => props.selected,
    (newValue) => {
      localSelected.value = newValue;
    }
  );

  const handleChange = (value: any) => {
    localSelected.value = value;
    emit('update:value', value);
  };
</script>
<template>
  <div>
    <USelect
      :options="props.items"
      v-model="localSelected"
      :placeholder="props.placeholder"
      :key="localSelected"
      class="w-full"
      @update:model-value="handleChange"
      color="secondary"
      :ui="{
        content: 'dark:bg-white dark:text-black',
      }"
    />
  </div>
</template>
