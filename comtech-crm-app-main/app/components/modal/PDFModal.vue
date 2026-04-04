<script setup lang="ts">
  import { Color } from '~/types/color';

  const props = defineProps<{
    open: boolean;
    pdfUrl?: string | null;
    pdfFileName?: string | null;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'update:open', value: boolean): void;
  }>();

  const pdfFrame = ref<HTMLIFrameElement | null>(null);

  const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value),
  });

  const handlePrint = () => {
    const iframe = pdfFrame.value;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else if (props.pdfUrl) {
      const win = window.open(props.pdfUrl, '_blank');
      win?.focus();
      win?.print();
    }
  };

  const handleDownload = () => {
    if (!props.pdfUrl) return;
    const link = document.createElement('a');
    link.href = props.pdfUrl;
    link.download = props.pdfFileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<template>
  <UModal v-model="isOpen" :ui="{ content: 'max-w-full' }">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <UIcon name="i-mdi-file-pdf-box" class="w-6 h-6 text-red-600" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">PDF Preview</h3>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="props.pdfFileName" class="text-xs text-gray-500 dark:text-gray-400">
              {{ props.pdfFileName }}
            </span>
            <UButton
              icon="i-mdi-close"
              color="neutral"
              variant="ghost"
              @click="emit('close')"
              aria-label="Close"
            />
          </div>
        </div>
      </template>

      <div class="flex items-center justify-center h-[70vh] bg-white dark:bg-gray-900">
        <iframe
          v-if="props.pdfUrl"
          :src="props.pdfUrl"
          ref="pdfFrame"
          class="w-full h-full border rounded dark:border-gray-700"
        ></iframe>
        <div v-else class="flex items-center justify-center h-full text-gray-500">No PDF</div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 w-full bg-white dark:bg-gray-800">
          <CommonButton label="Print" :color="Color.SECONDARY" @click="handlePrint" />
          <CommonButton :color="Color.SECONDARY" @click="handleDownload">
            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-download" class="w-4 h-4" />
              <span>Download</span>
            </div>
          </CommonButton>
          <CommonButton label="Close" :color="Color.ERROR" @click="emit('close')" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
