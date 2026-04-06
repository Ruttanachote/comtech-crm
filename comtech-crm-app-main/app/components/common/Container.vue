<script setup lang="ts">
  const props = defineProps({
    class: {
      type: String,
      default: '',
    },
  });
</script>

<template>
  <UContainer class="w-full max-w-screen" :class="props.class">
    <slot />
  </UContainer>
</template>
