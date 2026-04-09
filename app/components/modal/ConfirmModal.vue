<script setup lang="ts">
  import Button from '~/components/common/Button.vue';
  import { Color } from '~/types/color';

  const UModal = resolveComponent('UModal');

  const props = defineProps<{
    title: string;
    description: string;
    open: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
  }>();
</script>

<template>
  <UModal :open="props.open" :close="{ onClick: () => emit('cancel') }">
    <template #title>
      <h2>{{ props.title }}</h2>
    </template>
    <template #body>
      <p class="text-center font-semibold">{{ props.description }}</p>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <Button
          label="Confirm"
          @click="emit('confirm')"
          variant="subtle"
          :color="Color.SECONDARY"
        />
        <Button label="Cancel" @click="emit('cancel')" variant="subtle" :color="Color.ERROR" />
      </div>
    </template>
  </UModal>
</template>
