<template>
  <div 
    class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    :class="{ 'border-l-4 border-l-red-500': isUrgent }"
  >
    <div class="p-5">
      <div class="flex items-start justify-between gap-4">
        <!-- Left Content -->
        <div class="flex-1 min-w-0">
          <!-- Document Number -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-semibold text-gray-500">{{ approval.documentNumber }}</span>
          </div>

          <!-- Title -->
          <h3 class="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
            {{ approval.title }}
          </h3>

          <!-- Customer -->
          <p class="text-sm text-gray-600 mb-3">
            {{ t('approval.list.customer') }} {{ approval.customer.name }}
          </p>

          <!-- Info Row -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <!-- Value -->
            <div class="flex items-center gap-1">
              <span class="text-gray-500">{{ t('approval.list.value') }}</span>
              <span class="font-medium text-emerald-600">{{ formatValue }}</span>
            </div>

            <!-- Sender -->
            <div class="flex items-center gap-1">
              <span class="text-gray-500">{{ t('approval.list.sender') }}</span>
              <span class="text-gray-700">{{ approval.sender.name }}</span>
            </div>

            <!-- Current Step -->
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-gray-700">{{ currentStepText }}</span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">{{ daysWaitingText }}</span>
            </div>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Urgent Button -->
          <button
            v-if="isUrgent"
            class="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ t('approval.priority.urgent') }}
          </button>

          <!-- Medium Priority Button -->
          <button
            v-else-if="approval.priority === 'medium'"
            class="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t('approval.priority.medium') }}
          </button>

          <!-- Reject Button -->
          <button
            @click="$emit('reject', approval.id)"
            class="px-3 py-1.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ t('approval.list.actions.reject') }}
          </button>

          <!-- Approve Button -->
          <button
            @click="$emit('approve', approval.id)"
            class="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ t('approval.list.actions.approve') }}
          </button>

          <!-- More Button -->
          <button
            @click="$emit('view', approval.id)"
            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalItem } from '~/types/approval.type'

interface Props {
  approval: ApprovalItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'approve', id: string): void
  (e: 'reject', id: string): void
  (e: 'view', id: string): void
}>()

const { t, locale } = useI18n()

// Computed
const isUrgent = computed(() => props.approval.priority === 'urgent')

const daysWaiting = computed(() => props.approval.daysWaiting)

const daysWaitingText = computed(() => {
  const days = daysWaiting.value
  if (days === 0) return t('common.today')
  if (days === 1) return t('common.yesterday')
  return `${days} ${t('approval.list.daysWaiting')}`
})

const formatValue = computed(() => {
  return new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: props.approval.currency || 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.approval.value)
})

const currentStepText = computed(() => {
  return locale.value === 'th' 
    ? props.approval.currentStepNameTh 
    : props.approval.currentStepName
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
