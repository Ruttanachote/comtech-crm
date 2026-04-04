<template>
  <div
    class="w-full rounded-md ring ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
  >
    <VueDatePicker
      v-model="dateValue"
      date-picker
      :time-config="{ enableTimePicker: enableTime }"
      :formats="{ input: format }"
      :placeholder="placeholder"
      :allowed-dates="allowedDates"
      color="secondary"
      teleport="body"
      auto-apply
      @update:model-value="onDateUpdate"
      class="w-full rounded-md ring ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary z-20"
    />
  </div>
</template>

<script setup lang="ts">
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import { computed, ref, watch } from 'vue';

  interface Props {
    enableTime?: boolean;
    isDark?: boolean;
    placeholder?: string;
    modelValue?: Date | null;
    autoSearch?: boolean;
    format?: string;
    allowedDates?: Date[] | undefined;
  }

  const props = withDefaults(defineProps<Props>(), {
    enableTime: false,
    isDark: false,
    placeholder: 'Select date',
    modelValue: null,
    autoSearch: true,
    format: 'dd/MM/yyyy',
    allowedDates: undefined,
  });

  const dateValue = ref<Date | null>(props.modelValue);

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Date | null): void;
    (e: 'search', value: Date | null): void;
  }>();

  // ซิงค์ค่าจากภายนอกเข้ามา (เหลือแค่ตัวเดียว และให้ทำทันที)
  watch(
    () => props.modelValue,
    (newValue) => {
      dateValue.value = newValue;
    },
    { immediate: true }
  );

  const format = computed(() => {
    let f = props.format;
    f = f.replace(/DD/g, 'dd');
    f = f.replace(/YYYY/g, 'yyyy');

    if (!/(DD|dd)/.test(props.format ?? '')) {
      f = 'dd/MM/yyyy';
    }
    return f;
  });

  const allowedDates = computed(() => {
    if (!props.allowedDates) return undefined;
    return props.allowedDates.map((d) => new Date(d));
  });

  function coerceToDate(v: unknown): Date | null {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v as string);
  }

  // Emit เฉพาะเมื่อเลือกครบคู่เท่านั้น เพื่อกันเคส [start, null]
  function onDateUpdate(val: Date | null) {
    if (!val) {
      dateValue.value = null;
      emit('update:modelValue', null);
      if (props.autoSearch) emit('search', null);
      return;
    }
    const date = coerceToDate(val);

    if (!date) {
      dateValue.value = null;
      return;
    }

    dateValue.value = date;
    emit('update:modelValue', date);
    if (props.autoSearch) emit('search', date);
  }
</script>
