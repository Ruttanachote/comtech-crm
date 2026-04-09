<script setup lang="ts">
  interface BreadcrumbItem {
    label: string;
    to: string;
  }

  const props = defineProps<{
    items: BreadcrumbItem[];
  }>();
</script>

<template>
  <div>
    <UBreadcrumb color="secondary" :items="props.items" />
  </div>
</template>
