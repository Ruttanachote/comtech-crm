<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    open?: boolean;
    src?: string | null;
    fullscreen?: boolean;
    closeLabel?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
  }>();

  const isOpen = computed({
    get: () => props.open ?? false,
    set: (value) => emit('update:open', value),
  });

  const handleClose = () => {
    isOpen.value = false;
    emit('close');
  };
</script>

<template>
  <UModal v-model="isOpen" :fullscreen="fullscreen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        content: 'p-0 sm:p-0',
      }"
    >
      <div class="relative w-full h-full flex items-center justify-center bg-black/90 min-h-[80vh]">
        <img
          v-if="src"
          :src="src"
          alt="Preview Image"
          class="max-w-full max-h-screen object-contain"
        />
        <div v-else class="text-white">No image source</div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <CommonButton :label="closeLabel || 'Close'" color="error" @click="handleClose" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
