<script setup lang="ts">
  const props = defineProps({
    class: {
      type: String,
      default: '',
    },
  });
</script>
<template>
  <USkeleton :class="props.class" />
</template>
