<template>
  <div v-if="approval" class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <!-- Back Button -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="mb-4 -ml-2"
            @click="$emit('back')"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            {{ t('approval.detail.backToList') }}
          </UButton>

          <!-- Title & ID -->
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-xl font-bold text-gray-900">{{ approval.title }}</h1>
            <UBadge
              :color="statusColor"
              variant="soft"
              size="sm"
            >
              {{ statusText }}
            </UBadge>
          </div>

          <!-- Document Number -->
          <p class="text-sm text-gray-500">
            {{ t('approval.fields.approvalCode') }}: {{ approval.documentNumber }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="soft"
            @click="scrollToActivity"
          >
            <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-2" />
            {{ t('approval.detail.activity') }}
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            @click="$emit('download')"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
            {{ t('approval.detail.download') }}
          </UButton>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <!-- Total Value -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.totalValue') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatValue }}</p>
        </div>

        <!-- Customer -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.list.customer') }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ approval.customer.name }}</p>
        </div>

        <!-- Business Unit -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.businessUnit') }}</p>
          <p class="text-base text-gray-900">{{ approval.businessUnit || '-' }}</p>
        </div>

        <!-- Service Type -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.serviceType') }}</p>
          <p class="text-base text-gray-900">{{ approval.serviceType || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Contract Details -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        {{ t('approval.detail.contractDetails') }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Contract Type -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.contractType') }}</p>
          <p class="text-base font-medium text-gray-900">{{ approval.contractType || '-' }}</p>
        </div>

        <!-- Duration -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.duration') }}</p>
          <p class="text-base font-medium text-gray-900">{{ approval.contractDuration || '-' }}</p>
        </div>

        <!-- Start Date -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.startDate') }}</p>
          <p class="text-base font-medium text-gray-900">{{ formatDate(approval.startDate) }}</p>
        </div>

        <!-- End Date -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.endDate') }}</p>
          <p class="text-base font-medium text-gray-900">{{ formatDate(approval.endDate) }}</p>
        </div>

        <!-- Payment Terms -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.fields.paymentTerms') }}</p>
          <p class="text-base font-medium text-gray-900">{{ approval.paymentTerms || '-' }}</p>
        </div>

        <!-- Priority -->
        <div>
          <p class="text-sm text-gray-500 mb-1">{{ t('approval.filters.priority') }}</p>
          <UBadge
            :color="priorityColor"
            variant="soft"
            size="sm"
          >
            {{ priorityText }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Workflow -->
      <ApprovalTimeline :steps="approval.workflow" />

      <!-- Right Column: Documents & Activity -->
      <div class="space-y-6">
        <ApprovalDocuments
          :documents="approval.documents"
          :approval-id="approval.id"
        />
        <ApprovalComments :activities="approval.activities" />
      </div>
    </div>

    <!-- Action Section -->
    <ApprovalActions
      v-if="approval.status === 'pending'"
      :current-user-role="currentUserRole"
      :loading="actionLoading"
      @approve="$emit('approve', $event)"
      @reject="$emit('reject', $event)"
      @request-more-info="$emit('requestMoreInfo', $event)"
    />
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="space-y-6">
    <USkeleton class="h-48 w-full" />
    <USkeleton class="h-64 w-full" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <USkeleton class="h-96 w-full" />
      <USkeleton class="h-96 w-full" />
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="text-center py-12">
    <UIcon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      {{ t('approval.notFound.title') }}
    </h3>
    <p class="text-sm text-gray-500 mb-4">
      {{ t('approval.notFound.description') }}
    </p>
    <UButton color="primary" @click="$emit('back')">
      {{ t('approval.detail.backToList') }}
    </UButton>
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

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'download'): void
  (e: 'approve', data: { comment: string; attachments: File[] }): void
  (e: 'reject', data: { comment: string; attachments: File[] }): void
  (e: 'requestMoreInfo', data: { comment: string; attachments: File[] }): void
}>()

// Scroll to activity section
function scrollToActivity() {
  const activitySection = document.querySelector('.activity-section')
  if (activitySection) {
    activitySection.scrollIntoView({ behavior: 'smooth' })
  }
}

const { t, locale } = useI18n()

// Computed
const formatValue = computed(() => {
  if (!props.approval) return '-'
  return new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: props.approval.currency || 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.approval.value)
})

const statusColor = computed(() => {
  switch (props.approval?.status) {
    case 'approved':
      return 'emerald'
    case 'rejected':
      return 'red'
    case 'pending':
      return 'amber'
    default:
      return 'gray'
  }
})

const statusText = computed(() => {
  if (!props.approval) return ''
  return t(`approval.status.${props.approval.status}`)
})

const priorityColor = computed(() => {
  switch (props.approval?.priority) {
    case 'urgent':
      return 'red'
    case 'high':
      return 'orange'
    case 'medium':
      return 'amber'
    case 'low':
      return 'gray'
    default:
      return 'gray'
  }
})

const priorityText = computed(() => {
  if (!props.approval) return ''
  return t(`approval.priority.${props.approval.priority}`)
})

// Methods
function formatDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
