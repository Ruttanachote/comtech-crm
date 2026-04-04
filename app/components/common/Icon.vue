<template>
  <UIcon :name="name" :class="[sizeClass, colorClass]" />
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  size?: string | number; // Tailwind class (e.g., 'w-5 h-5') or number
  color?: string; // Tailwind class (e.g., 'text-red-500')
}>();

const sizeClass = computed(() => {
  if (!props.size) return 'w-5 h-5';
  if (typeof props.size === 'number') return `w-[${props.size}px] h-[${props.size}px]`;
  return props.size; // Assume it's a tailwind class if string
});

const colorClass = computed(() => props.color || '');
</script>