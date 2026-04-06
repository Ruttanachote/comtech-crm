<script setup lang="ts">
  import type { PropType } from 'vue';
  import type { ButtonProps } from '@nuxt/ui';

  const emit = defineEmits(['click']);
  const props = defineProps({
    label: {
      type: String,
      required: false,
    },
    class: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String as PropType<ButtonProps['color']>,
      required: false,
      default: 'primary',
    },
    size: {
      type: String as PropType<ButtonProps['size']>,
      required: false,
      default: 'md',
    },
    variant: {
      type: String as PropType<ButtonProps['variant']>,
      required: false,
      default: 'solid',
    },
    icon: {
      type: String,
      required: false,
    },
    ui: {
      type: Object as PropType<ButtonProps['ui']>,
      required: false,
    },
  });

  const onClick = (event: MouseEvent) => {
    emit('click', event);
  };
</script>

<template>
  <UButton
    :class="props.class"
    :color="props.color"
    :variant="props.variant"
    :icon="props.icon"
    :disabled="props.disabled"
    :loading="props.loading"
    :ui="{
      base: 'cursor-pointer justify-center dark:text-white w-full md:w-auto transition-all duration-200 hover:shadow-md active:scale-[0.98]',
      ...props.ui,
    }"
    :size="props.size"
    @click="onClick"
  >
    <!-- If Slot is provided, use it -->
    <slot v-if="$slots.default" />
    <!-- If Slot is not provided, use the label -->
    <span v-else>{{ label }}</span>
  </UButton>
</template>
