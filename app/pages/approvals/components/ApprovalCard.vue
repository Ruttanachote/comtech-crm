<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <!-- Top Row: Doc Number + Priority Badge + Actions -->
    <div class="flex items-start justify-between mb-3">
      <!-- Left: Document Number -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-mono text-gray-500">{{ document.documentNumber }}</span>
      </div>

      <!-- Right: Priority Badge + Actions -->
      <div class="flex items-center gap-2">
        <!-- Priority Badge -->
        <span
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="priorityClass"
        >
          <UIcon :name="priorityIcon" class="w-3.5 h-3.5" />
          {{ priorityLabel }}
        </span>

        <!-- Action Buttons (only for pending) -->
        <template v-if="document.status === 'pending' && !isLoadingAction">
          <UButton
            color="gray"
            variant="outline"
            size="sm"
            :disabled="isLoadingAction"
            @click="$emit('reject', document)"
          >
            {{ t('approval.card.actions.reject') }}
          </UButton>
          <UButton
            color="primary"
            size="sm"
            :loading="isLoadingAction"
            @click="$emit('approve', document)"
          >
            {{ t('approval.card.actions.approve') }}
          </UButton>
        </template>

        <!-- More Options -->
        <UDropdown
          :items="menuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal"
            size="sm"
          />
        </UDropdown>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-base font-semibold text-gray-900 mb-3 line-clamp-1">
      {{ document.title }}
    </h3>

    <!-- Info Row -->
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <!-- Customer -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">{{ t('approval.card.customer') }}</span>
        <span class="font-medium text-gray-900">{{ document.customerName }}</span>
      </div>

      <!-- Separator -->
      <span class="text-gray-300">|</span>

      <!-- Value -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">{{ t('approval.card.value') }}</span>
        <span class="font-medium text-gray-900">{{ formattedValue }}</span>
      </div>

      <!-- Separator -->
      <span class="text-gray-300">|</span>

      <!-- Sender -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">{{ t('approval.card.sender') }}</span>
        <span class="font-medium text-gray-900">{{ document.sender.name }}</span>
      </div>

      <!-- Separator -->
      <span class="text-gray-300">|</span>

      <!-- Waiting At -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">{{ t('approval.card.waitingAt') }}</span>
        <span class="font-medium text-gray-900">{{ stepLabel }}</span>
        <span class="text-gray-400">•</span>
        <span class="text-gray-500">{{ daysAgoText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument, ApprovalPriority } from '~/types/approval.type'
import { getPriorityConfig, getStepConfig, formatCurrency } from '~/data/mock/approval.mock'

interface Props {
  document: ApprovalDocument
  isLoadingAction?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  approve: [document: ApprovalDocument]
  reject: [document: ApprovalDocument]
  view: [document: ApprovalDocument]
}>()

const { t, locale } = useI18n()

// Priority config
const priorityConfig = computed(() => getPriorityConfig(props.document.priority))

const priorityClass = computed(() => {
  const classes: Record<string, string> = {
    urgent: 'bg-amber-50 text-amber-700 border border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    low: 'bg-gray-50 text-gray-700 border border-gray-200'
  }
  return classes[props.document.priority] || classes.medium
})

const priorityIcon = computed(() => {
  const icons: Record<string, string> = {
    urgent: 'i-heroicons-exclamation-triangle',
    medium: 'i-heroicons-clock',
    low: 'i-heroicons-arrow-down'
  }
  return icons[props.document.priority] || 'i-heroicons-clock'
})

const priorityLabel = computed(() => {
  return locale.value === 'th' ? priorityConfig.value.label : priorityConfig.value.labelEn
})

// Step config
const stepConfig = computed(() => getStepConfig(props.document.currentStep))
const stepLabel = computed(() => {
  return locale.value === 'th' ? stepConfig.value.label : stepConfig.value.labelEn
})

// Formatted value
const formattedValue = computed(() => {
  return formatCurrency(props.document.value, props.document.currency)
})

// Days ago text
const daysAgoText = computed(() => {
  const days = props.document.daysPending
  if (days === 0) return t('approval.card.today')
  if (days === 1) return t('approval.card.yesterday')
  return t('approval.card.daysAgo', { days })
})

// Menu items for dropdown
const menuItems = computed(() => [
  [
    {
      label: t('approval.card.actions.view'),
      icon: 'i-heroicons-eye',
      click: () => emit('view', props.document)
    }
  ]
])
</script>
