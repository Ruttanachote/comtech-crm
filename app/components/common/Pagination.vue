<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  const emit = defineEmits<{
    'update:page': [number, number];
  }>();

  const props = withDefaults(
    defineProps<{
      total?: number;
      dataLength?: number;
      itemsPerPage?: number;
      page?: number;
      showItemsPerPage?: boolean;
      itemsPerPageOptions?: Array<{ label: string; value: number }>;
    }>(),
    {
      total: 0,
      itemsPerPage: 10,
      page: 1,
      activeColor: 'secondary',
      showItemsPerPage: true,
      itemsPerPageOptions: () => [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
      ],
    }
  );

  const itemsPerPageLocal = ref<number>(props.itemsPerPage ?? 10);
  const pageLocal = ref<number>(props.page ?? 1);

  watch(itemsPerPageLocal, (val) => {
    pageLocal.value = 1;
    emit('update:page', pageLocal.value, val);
  });

  watch(pageLocal, (val) => {
    emit('update:page', val, itemsPerPageLocal.value);
  });
</script>

<template>
  <div class="flex justify-end items-center gap-2">
    <UPagination
      :total="props.total"
      :page-count="itemsPerPageLocal"
      :page="pageLocal"
      @update:page="pageLocal = $event"
      :active-color="'secondary'"
    />
    <div v-if="props.showItemsPerPage" class="flex justify-end">
      <USelect
        :model-value="itemsPerPageLocal"
        @update:model-value="itemsPerPageLocal = $event"
        :items="props.itemsPerPageOptions"
        :title="'Items per page'"
        class="w-24"
        color="secondary"
      />
    </div>
  </div>
</template>
