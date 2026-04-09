<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ t('approval.detail.documents') }}
    </h3>

    <!-- Document List -->
    <div v-if="documents.length > 0" class="space-y-3">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center gap-3">
          <!-- File Icon -->
          <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-red-600" />
          </div>

          <!-- File Info -->
          <div>
            <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
            <p class="text-xs text-gray-500">
              {{ doc.size }} • {{ t('approval.fields.uploaded') }} {{ formatDate(doc.uploadedAt) }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="previewDocument(doc)"
          >
            <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="downloadDocument(doc)"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <UIcon name="i-heroicons-document" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">{{ t('approval.messages.noDocuments') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'

interface Props {
  documents: ApprovalDocument[]
  approvalId: string
}

const props = defineProps<Props>()

const { t, locale } = useI18n()
const toast = useToast()

// Methods
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function previewDocument(doc: ApprovalDocument) {
  // Open document in new tab
  window.open(doc.url, '_blank')
}

async function downloadDocument(doc: ApprovalDocument) {
  try {
    // In real implementation, call service
    // const blob = await approvalService.downloadDocument(props.approvalId, doc.id)
    
    // For now, create a mock download
    const link = document.createElement('a')
    link.href = doc.url
    link.download = doc.name
    link.click()

    toast.add({
      title: t('common.success'),
      description: t('approval.messages.downloadSuccess'),
      color: 'green',
    })
  } catch (error) {
    toast.add({
      title: t('common.error'),
      description: t('approval.messages.downloadError'),
      color: 'red',
    })
  }
}
</script>
