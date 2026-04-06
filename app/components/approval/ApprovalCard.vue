<template>
  <div 
    class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    :class="{ 'border-l-4 border-l-red-500': isUrgent }"
  >
    <div class="p-5">
      <!-- Header: Document Number & Priority -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-gray-900">{{ approval.documentNumber }}</span>
          <UBadge
            v-if="isUrgent"
            color="red"
            variant="soft"
            size="sm"
            class="font-medium"
          >
            <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
            {{ t('approval.priority.urgent') }}
          </UBadge>
          <UBadge
            v-else-if="approval.priority === 'medium'"
            color="amber"
            variant="soft"
            size="sm"
            class="font-medium"
          >
            <UIcon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
            {{ t('approval.priority.medium') }}
          </UBadge>
        </div>
        <span class="text-xs text-gray-400">{{ daysWaitingText }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ approval.title }}
      </h3>

      <!-- Customer -->
      <p class="text-sm text-gray-600 mb-4">{{ approval.customer.name }}</p>

      <!-- Info Row -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
        <!-- Value -->
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-banknotes" class="w-4 h-4" />
          <span class="font-medium text-gray-900">{{ formatValue }}</span>
        </div>

        <!-- Sender -->
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-user" class="w-4 h-4" />
          <span>{{ approval.sender.name }}</span>
        </div>

        <!-- Current Step -->
        <div class="flex items-center gap-1">
          <span class="text-gray-400">|</span>
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          <span>{{ currentStepText }}</span>
          <span class="text-gray-400">•</span>
          <span>{{ daysWaiting }} {{ t('approval.list.daysWaiting') }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <UButton
          color="gray"
          variant="soft"
          size="sm"
          @click="$emit('reject', approval.id)"
        >
          {{ t('approval.list.actions.reject') }}
        </UButton>
        <UButton
          color="emerald"
          variant="solid"
          size="sm"
          @click="$emit('approve', approval.id)"
        >
          {{ t('approval.list.actions.approve') }}
        </UButton>
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          square
          @click="$emit('view', approval.id)"
        >
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5" />
        </UButton>
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
