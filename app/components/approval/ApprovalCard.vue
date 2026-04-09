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
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-amber-500" />
              <span class="text-gray-700">{{ currentStepText }}</span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">{{ daysWaitingText }}</span>
            </div>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Urgent Button -->
          <UButton
            v-if="isUrgent"
            color="warning"
            variant="soft"
            size="sm"
            icon="i-lucide-alert-triangle"
          >
            {{ t('approval.priority.urgent') }}
          </UButton>

          <!-- Medium Priority Button -->
          <UButton
            v-else-if="approval.priority === 'medium'"
            color="warning"
            variant="soft"
            size="sm"
            icon="i-lucide-clock"
          >
            {{ t('approval.priority.medium') }}
          </UButton>

          <!-- Reject Button -->
          <UButton
            color="error"
            variant="outline"
            size="sm"
            icon="i-lucide-x"
            @click="$emit('reject', approval.id)"
          >
            {{ t('approval.list.actions.reject') }}
          </UButton>

          <!-- Approve Button -->
          <UButton
            color="success"
            size="sm"
            icon="i-lucide-check"
            @click="$emit('approve', approval.id)"
          >
            {{ t('approval.list.actions.approve') }}
          </UButton>

          <!-- More Button -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-more-vertical"
            @click="$emit('view', approval.id)"
          />
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
