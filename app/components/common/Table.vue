<script setup lang="ts">
  const props = defineProps<{
    data: any[];
    columns: any[];
  }>();
</script>

<template>
  <UTable :data="props.data" :columns="props.columns" />
</template>
