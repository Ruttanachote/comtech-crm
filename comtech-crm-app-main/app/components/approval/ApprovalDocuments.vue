<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ t('approval.detail.documents') }}
      </h3>
      <span class="text-xs text-gray-400 dark:text-gray-500">{{ documents.length }} {{ t('approval.detail.files') }}</span>
    </div>

    <div v-if="documents.length > 0">
      <!-- Preview Area -->
      <div
        class="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl mb-4 overflow-hidden cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
        @click="openPreview(selectedDoc)"
      >
        <div class="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 dark:bg-gray-700/50">
          <!-- PDF Icon -->
          <div class="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-3">
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate max-w-full px-2">
            {{ selectedDoc?.name || '-' }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {{ selectedDoc?.size }}
          </p>
          <div class="flex items-center gap-1 mt-3 text-xs text-blue-500 dark:text-blue-400">
            <UIcon name="i-heroicons-eye" class="w-3.5 h-3.5" />
            {{ t('approval.detail.clickToPreview') }}
          </div>
        </div>
      </div>

      <!-- Document List -->
      <div class="space-y-2">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer"
          :class="selectedDoc?.id === doc.id
            ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'"
          @click="selectedDoc = doc"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.name }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ doc.size }}</p>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              @click.stop="openPreview(doc)"
            >
              <UIcon name="i-heroicons-eye" class="w-3.5 h-3.5" />
            </button>
            <button
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              @click.stop="downloadDocument(doc)"
            >
              <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl py-10 text-center">
      <UIcon name="i-heroicons-document" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('approval.messages.noDocuments') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'
import { approvalService } from '~/services/approval.service'

interface Props {
  documents: ApprovalDocument[]
  approvalId: string
}

const props = defineProps<Props>()

const { t, locale } = useI18n()
const toast = useToast()

const selectedDoc = ref<ApprovalDocument | null>(props.documents[0] ?? null)

watch(() => props.documents, (docs) => {
  if (docs.length > 0 && !selectedDoc.value) {
    selectedDoc.value = docs[0] ?? null
  }
}, { immediate: true })

function openPreview(doc: ApprovalDocument | null) {
  if (!doc) return
  window.open(doc.url, '_blank')
}

async function downloadDocument(doc: ApprovalDocument) {
  try {
    const blob = await approvalService.downloadDocument(props.approvalId, doc.id)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.name
    link.click()
    URL.revokeObjectURL(url)
    toast.add({ title: t('approval.messages.downloadSuccess'), color: 'green' })
  } catch {
    toast.add({ title: t('approval.messages.downloadError'), color: 'red' })
  }
}
</script>
