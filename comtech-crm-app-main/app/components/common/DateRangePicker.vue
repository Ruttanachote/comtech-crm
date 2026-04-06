<template>
  <div
    class="w-full rounded-md ring ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
  >
    <VueDatePicker
      v-model="dateRange"
      range
      date-picker
      :time-config="{ enableTimePicker: enableTime }"
      :formats="{ input: format }"
      :placeholder="placeholder"
      color="secondary"
      teleport="body"
      multi-calendars
      auto-apply
      @update:model-value="onDateRangeUpdate"
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
    modelValue?: [Date, Date] | null;
    autoSearch?: boolean;
    format?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    enableTime: false,
    isDark: false,
    placeholder: 'Select date range',
    modelValue: null,
    autoSearch: true,
    format: 'dd/MM/yyyy',
  });

  type DateRange = [Date, Date] | null;
  const dateRange = ref<DateRange>(props.modelValue);

  const emit = defineEmits<{
    (e: 'update:modelValue', value: DateRange): void;
    (e: 'search', value: DateRange): void;
  }>();

  // ซิงค์ค่าจากภายนอกเข้ามา (เหลือแค่ตัวเดียว และให้ทำทันที)
  watch(
    () => props.modelValue,
    (newValue) => {
      dateRange.value = newValue;
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

  function coerceToDate(v: unknown): Date | null {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v as string);
  }

  // Emit เฉพาะเมื่อเลือกครบคู่เท่านั้น เพื่อกันเคส [start, null]
  function onDateRangeUpdate(val: [Date, Date] | null) {
    if (!val) {
      dateRange.value = null;
      emit('update:modelValue', null);
      if (props.autoSearch) emit('search', null);
      return;
    }
    const start = coerceToDate(val[0]);
    const end = coerceToDate(val[1]);

    if (!start || !end) {
      // ยังเลือกไม่ครบคู่ -> อัพเดต internal state แต่ไม่ emit ไป parent
      dateRange.value = [start, end] as DateRange;
      return;
    }

    const normalized: [Date, Date] = [start, end];
    dateRange.value = normalized;
    emit('update:modelValue', normalized);
    if (props.autoSearch) emit('search', normalized);
  }
</script>
