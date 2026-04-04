<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="p-4 lg:p-6 max-w-7xl mx-auto">
      <!-- Header with Clock Icon and Export Button -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <!-- Clock Icon -->
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-amber-600" />
          </div>
          <!-- Title & Subtitle -->
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
              {{ t('approval.title') }}
            </h1>
            <p class="text-sm text-gray-500">
              {{ t('approval.subtitle') }}
            </p>
          </div>
        </div>

        <!-- Export Button -->
        <UDropdown
          :items="exportItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-arrow-down-tray"
            size="md"
          >
            {{ t('approval.export.title') }}
          </UButton>
        </UDropdown>
      </div>

      <!-- Stats Cards -->
      <ApprovalStats
        :stats="stats"
        :filters="filters"
        class="mb-6"
        @update:filters="setFilters"
      />

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <ApprovalFilters
          :filters="filters"
          :has-active-filters="hasActiveFilters"
          @update:filters="setFilters"
          @clear-filters="resetFilters"
        />
      </div>

      <!-- Approval List -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
        <ApprovalList
          :documents="documents"
          :is-loading="isLoading"
          :is-loading-action="isLoadingAction"
          :pagination="pagination"
          :has-active-filters="hasActiveFilters"
          @approve="handleApprove"
          @reject="handleReject"
          @view="handleView"
          @update:page="setPage"
          @update:limit="setLimit"
          @clear-filters="resetFilters"
        />
      </div>
    </div>

    <!-- Confirm Modal -->
    <ApprovalConfirmModal
      v-model="showConfirmModal"
      :action="pendingAction"
      :document="selectedDocumentForAction"
      :is-loading="isLoadingAction"
      @confirm="handleConfirmAction"
    />

    <!-- Detail Modal -->
    <UModal
      v-model="showDetailModal"
      :ui="{
        width: 'lg:max-w-3xl',
        padding: 'p-0'
      }"
    >
      <div v-if="selectedDocument" class="p-6">
        <!-- Modal Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-mono text-gray-500">{{ selectedDocument.documentNumber }}</span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                :class="priorityClass"
              >
                <UIcon :name="priorityIcon" class="w-3.5 h-3.5" />
                {{ priorityLabel }}
              </span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedDocument.title }}</h2>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            @click="showDetailModal = false"
          />
        </div>

        <!-- Document Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.customer') }}</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedDocument.customerName }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.value') }}</p>
            <p class="text-sm font-medium text-gray-900">{{ formattedValue }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.sender') }}</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedDocument.sender.name }}</p>
            <p class="text-xs text-gray-500">{{ selectedDocument.sender.department }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">{{ t('approval.card.waitingAt') }}</p>
            <p class="text-sm font-medium text-gray-900">{{ stepLabel }}</p>
            <p class="text-xs text-gray-500">{{ daysAgoText }}</p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="selectedDocument.description" class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-2">{{ t('approval.detail.information') }}</h3>
          <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            {{ selectedDocument.description }}
          </p>
        </div>

        <!-- Attachments -->
        <div v-if="selectedDocument.attachments?.length" class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-2">{{ t('approval.detail.attachments') }}</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="attachment in selectedDocument.attachments"
              :key="attachment"
              class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm"
            >
              <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-400" />
              <span class="text-gray-700">{{ attachment }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="selectedDocument.status === 'pending'" class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <UButton
            color="gray"
            variant="outline"
            :loading="isLoadingAction"
            @click="handleReject(selectedDocument)"
          >
            {{ t('approval.card.actions.reject') }}
          </UButton>
          <UButton
            color="primary"
            :loading="isLoadingAction"
            @click="handleApprove(selectedDocument)"
          >
            {{ t('approval.card.actions.approve') }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument, ApprovalFilters } from '~/types/approval.type'
import { getPriorityConfig, getStepConfig, formatCurrency } from '~/data/mock/approval.mock'
import ApprovalStats from './components/ApprovalStats.vue'
import ApprovalFilters from './components/ApprovalFilters.vue'
import ApprovalList from './components/ApprovalList.vue'
import ApprovalConfirmModal from './components/ApprovalConfirmModal.vue'

// Page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Composables
const { t, locale } = useI18n()
const approval = useApproval()
const toast = useToast()

// Destructure from composable
const { 
  documents, 
  stats, 
  isLoading, 
  isLoadingAction, 
  filters, 
  hasActiveFilters, 
  pagination,
  fetchApprovals,
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  approveDocument,
  rejectDocument
} = approval

// Local state
const showConfirmModal = ref(false)
const showDetailModal = ref(false)
const pendingAction = ref<'approve' | 'reject' | null>(null)
const selectedDocument = ref<ApprovalDocument | null>(null)
const selectedDocumentForAction = ref<ApprovalDocument | null>(null)

// Export items
const exportItems = computed(() => [
  [
    {
      label: t('approval.export.excel'),
      icon: 'i-heroicons-document-spreadsheet',
      click: () => handleExport('excel')
    },
    {
      label: t('approval.export.csv'),
      icon: 'i-heroicons-document-text',
      click: () => handleExport('csv')
    }
  ]
])

// Computed for detail modal
const priorityConfig = computed(() => 
  selectedDocument.value ? getPriorityConfig(selectedDocument.value.priority) : null
)
const priorityClass = computed(() => {
  if (!selectedDocument.value) return ''
  const classes: Record<string, string> = {
    urgent: 'bg-amber-50 text-amber-700 border border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    low: 'bg-gray-50 text-gray-700 border border-gray-200'
  }
  return classes[selectedDocument.value.priority] || classes.medium
})
const priorityIcon = computed(() => priorityConfig.value?.icon || 'i-heroicons-clock')
const priorityLabel = computed(() => {
  if (!priorityConfig.value) return ''
  return locale.value === 'th' ? priorityConfig.value.label : priorityConfig.value.labelEn
})

const stepConfig = computed(() => 
  selectedDocument.value ? getStepConfig(selectedDocument.value.currentStep) : null
)
const stepLabel = computed(() => {
  if (!stepConfig.value) return ''
  return locale.value === 'th' ? stepConfig.value.label : stepConfig.value.labelEn
})

const formattedValue = computed(() => {
  if (!selectedDocument.value) return ''
  return formatCurrency(selectedDocument.value.value, selectedDocument.value.currency)
})

const daysAgoText = computed(() => {
  if (!selectedDocument.value) return ''
  const days = selectedDocument.value.daysPending
  if (days === 0) return t('approval.card.today')
  if (days === 1) return t('approval.card.yesterday')
  return t('approval.card.daysAgo', { days })
})

// Watchers
watch(filters, () => {
  fetchApprovals()
}, { deep: true })

watch(() => pagination.page, () => {
  fetchApprovals()
})

watch(() => pagination.limit, () => {
  fetchApprovals()
})

// Handlers
const handleApprove = (document: ApprovalDocument) => {
  selectedDocumentForAction.value = document
  pendingAction.value = 'approve'
  showConfirmModal.value = true
}

const handleReject = (document: ApprovalDocument) => {
  selectedDocumentForAction.value = document
  pendingAction.value = 'reject'
  showConfirmModal.value = true
}

const handleView = (document: ApprovalDocument) => {
  selectedDocument.value = document
  showDetailModal.value = true
}

const handleConfirmAction = async (comment: string) => {
  if (!selectedDocumentForAction.value || !pendingAction.value) return
  
  const documentId = selectedDocumentForAction.value.id
  let result
  
  if (pendingAction.value === 'approve') {
    result = await approveDocument(documentId, comment)
  } else {
    result = await rejectDocument(documentId, comment)
  }
  
  if (result.success) {
    showConfirmModal.value = false
    selectedDocumentForAction.value = null
    pendingAction.value = null
    
    // Close detail modal if open
    if (showDetailModal.value) {
      showDetailModal.value = false
      selectedDocument.value = null
    }
  }
}

const handleExport = async (format: 'excel' | 'csv') => {
  try {
    const { $approvalService } = useNuxtApp()
    const blob = await $approvalService.exportApprovals(format, filters.value)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `approvals_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.add({
      title: t('approval.export.success'),
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    toast.add({
      title: t('approval.export.error'),
      description: t('approval.errors.actionFailed'),
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}

// Initial fetch
onMounted(() => {
  fetchApprovals()
})
</script>
