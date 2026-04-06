<script setup lang="ts">
  const props = defineProps({
    value: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    size: {
      type: String,
      required: false,
      default: 'md',
    },
    customProgressColor: {
      type: String,
      required: false,
      default: null,
    },
  });
</script>

<template>
  <div>
    <UProgress
      v-model="props.value"
      :max="props.max"
      :color="props.color"
      :size="props.size"
      :ui="{
        indicator: props.customProgressColor,
      }"
    />
  </div>
</template>
