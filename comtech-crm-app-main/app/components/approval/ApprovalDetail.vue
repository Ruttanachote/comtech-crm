<template>
  <div v-if="approval" class="space-y-4">

    <!-- Header Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <!-- Top accent bar based on status -->
      <div class="h-1.5 w-full" :class="headerAccentClass" />

      <div class="p-5 sm:p-6">
        <!-- Back Button -->
        <button
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-5 transition-colors cursor-pointer group"
          @click="$emit('back')"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {{ t('approval.detail.backToList') }}
        </button>

        <!-- Title + Badge row -->
        <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1 min-w-0">
            {{ approval.title }}
          </h1>
          <span
            class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset"
            :class="statusBadgeClass"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass" />
            {{ statusText }}
          </span>
        </div>

        <!-- Document Number -->
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-6">
          <span class="text-gray-500 dark:text-gray-400">{{ t('approval.fields.approvalCode') }}:</span>
          <span class="ml-1.5 font-mono font-medium text-blue-600 dark:text-blue-400">{{ approval.documentNumber }}</span>
        </p>

        <!-- Info Grid: 4 colored metric boxes -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <!-- Total Value -->
          <div class="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-6 h-6 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-banknotes" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <p class="text-xs text-blue-500 dark:text-blue-400 font-medium truncate">{{ t('approval.fields.totalValue') }}</p>
            </div>
            <p class="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 leading-tight truncate">{{ formatValue }}</p>
          </div>

          <!-- Customer -->
          <div class="rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40 p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-building-office-2" class="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <p class="text-xs text-violet-500 dark:text-violet-400 font-medium truncate">{{ t('approval.list.customer') }}</p>
            </div>
            <p class="text-sm font-semibold text-violet-700 dark:text-violet-300 truncate leading-tight">{{ approval.customer.name }}</p>
          </div>

          <!-- Business Unit -->
          <div class="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-squares-2x2" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">{{ t('approval.fields.businessUnit') }}</p>
            </div>
            <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300 truncate leading-tight">{{ approval.businessUnit || '-' }}</p>
          </div>

          <!-- Service Type -->
          <div class="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-6 h-6 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-tag" class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <p class="text-xs text-amber-600 dark:text-amber-400 font-medium truncate">{{ t('approval.fields.serviceType') }}</p>
            </div>
            <p class="text-sm font-semibold text-amber-700 dark:text-amber-300 truncate leading-tight">{{ approval.serviceType || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Horizontal Workflow Stepper -->
    <ApprovalTimeline :steps="approval.workflow" />

    <!-- Contract Details Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5">
      <div class="flex items-center gap-2.5 mb-4">
        <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {{ t('approval.detail.contractDetails') }}
        </h3>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4">
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.fields.contractType') }}</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ approval.contractType || '-' }}</p>
        </div>
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.fields.duration') }}</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ approval.contractDuration || '-' }}</p>
        </div>
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.fields.startDate') }}</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(approval.startDate) }}</p>
        </div>
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.fields.endDate') }}</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(approval.endDate) }}</p>
        </div>
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.fields.paymentTerms') }}</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ approval.paymentTerms || '-' }}</p>
        </div>
        <div class="space-y-0.5">
          <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{{ t('approval.filters.priority') }}</p>
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            :class="priorityBadgeClass"
          >
            <UIcon :name="priorityIcon" class="w-3 h-3" />
            {{ priorityText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Two Column Layout: Document+Activity left / Review right -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left: Documents + Activity -->
      <div class="lg:col-span-2 space-y-4">
        <ApprovalDocuments :documents="approval.documents" :approval-id="approval.id" />
        <ApprovalComments :activities="approval.activities" />
      </div>

      <!-- Right: Review & Approve Panel -->
      <div class="lg:col-span-1">
        <ApprovalActions
          v-if="approval.status === 'pending'"
          :current-user-role="currentUserRole"
          :loading="actionLoading"
          @approve="$emit('approve', $event)"
          @reject="$emit('reject', $event)"
          @request-more-info="$emit('requestMoreInfo', $event)"
        />

        <!-- Non-pending: result summary -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="h-1.5 w-full" :class="resultAccentClass" />
          <div
            class="px-5 py-4 flex items-center gap-3"
            :class="resultBannerBg"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="resultIconBg">
              <UIcon :name="resultIcon" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ resultTitle }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ t('approval.fields.decidedBy') }}: <span class="font-medium text-gray-700 dark:text-gray-300">{{ currentUserRole }}</span></p>
            </div>
          </div>

          <div v-if="approval.activities?.length" class="p-5">
            <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium mb-2">{{ t('approval.fields.comment') }}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3.5 leading-relaxed">
              {{ approval.activities[approval.activities.length - 1]?.comment || '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="space-y-4">
    <USkeleton class="h-52 w-full rounded-2xl" />
    <USkeleton class="h-32 w-full rounded-2xl" />
    <USkeleton class="h-40 w-full rounded-2xl" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 space-y-4">
        <USkeleton class="h-64 w-full rounded-2xl" />
        <USkeleton class="h-48 w-full rounded-2xl" />
      </div>
      <USkeleton class="h-80 w-full rounded-2xl" />
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="text-center py-20">
    <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
      <UIcon name="i-heroicons-document-magnifying-glass" class="w-10 h-10 text-gray-300 dark:text-gray-600" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      {{ t('approval.notFound.title') }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
      {{ t('approval.notFound.description') }}
    </p>
    <button
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
      @click="$emit('back')"
    >
      <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
      {{ t('approval.detail.backToList') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDetail } from '~/types/approval.type'
import ApprovalTimeline from './ApprovalTimeline.vue'
import ApprovalDocuments from './ApprovalDocuments.vue'
import ApprovalComments from './ApprovalComments.vue'
import ApprovalActions from './ApprovalActions.vue'

interface Props {
  approval: ApprovalDetail | null
  loading?: boolean
  actionLoading?: string | null
  currentUserRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  actionLoading: null,
  currentUserRole: 'Finance Manager',
})

defineEmits<{
  (e: 'back'): void
  (e: 'approve', data: { comment: string; attachments: File[] }): void
  (e: 'reject', data: { comment: string; attachments: File[] }): void
  (e: 'requestMoreInfo', data: { comment: string; attachments: File[] }): void
}>()

const { t, locale } = useI18n()

const formatValue = computed(() => {
  if (!props.approval) return '-'
  return new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: props.approval.currency || 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.approval.value)
})

const headerAccentClass = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'bg-linear-to-r from-emerald-400 to-emerald-500'
    case 'rejected': return 'bg-linear-to-r from-red-400 to-red-500'
    case 'pending': return 'bg-linear-to-r from-blue-400 to-blue-600'
    default: return 'bg-linear-to-r from-amber-400 to-orange-400'
  }
})

const statusBadgeClass = computed(() => {
  switch (props.approval?.status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/50'
    case 'rejected':
      return 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50'
    case 'pending':
      return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700/50'
    default:
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/50'
  }
})

const statusDotClass = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'bg-emerald-500'
    case 'rejected': return 'bg-red-500'
    case 'pending': return 'bg-blue-500 animate-pulse'
    default: return 'bg-amber-500'
  }
})

const statusText = computed(() => {
  if (!props.approval) return ''
  return t(`approval.status.${props.approval.status}`)
})

const priorityBadgeClass = computed(() => {
  switch (props.approval?.priority) {
    case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    case 'low': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
})

const priorityIcon = computed(() => {
  switch (props.approval?.priority) {
    case 'urgent': return 'i-heroicons-bolt'
    case 'high': return 'i-heroicons-arrow-up'
    case 'medium': return 'i-heroicons-minus'
    case 'low': return 'i-heroicons-arrow-down'
    default: return 'i-heroicons-minus'
  }
})

const priorityText = computed(() => {
  if (!props.approval) return ''
  return t(`approval.priority.${props.approval.priority}`)
})

const resultAccentClass = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'bg-linear-to-r from-emerald-400 to-emerald-500'
    case 'rejected': return 'bg-linear-to-r from-red-400 to-red-500'
    default: return 'bg-linear-to-r from-amber-400 to-orange-400'
  }
})

const resultBannerBg = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'bg-emerald-50 dark:bg-emerald-900/20'
    case 'rejected': return 'bg-red-50 dark:bg-red-900/20'
    default: return 'bg-amber-50 dark:bg-amber-900/20'
  }
})

const resultIconBg = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'bg-emerald-500'
    case 'rejected': return 'bg-red-500'
    default: return 'bg-amber-500'
  }
})

const resultIcon = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return 'i-heroicons-check-circle'
    case 'rejected': return 'i-heroicons-x-circle'
    default: return 'i-heroicons-question-mark-circle'
  }
})

const resultTitle = computed(() => {
  switch (props.approval?.status) {
    case 'approved': return t('approval.messages.approveSuccess')
    case 'rejected': return t('approval.messages.rejectSuccess')
    default: return t('approval.status.request_more_info')
  }
})

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
