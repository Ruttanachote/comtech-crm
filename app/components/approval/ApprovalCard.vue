<template>
  <div 
    class="group bg-white rounded-xl border border-gray-200 p-4 lg:p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
    :class="{ 'ring-1 ring-primary-500/20 border-primary-300': isSelected }"
  >
    <!-- Header Row -->
    <div class="flex flex-col lg:flex-row lg:items-start gap-4">
      <!-- Left: Document Info -->
      <div class="flex-1 min-w-0">
        <!-- Document Number & Priority -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-semibold text-gray-900 font-mono">
            {{ document.documentNumber }}
          </span>
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            :class="priorityClass"
          >
            <UIcon :name="priorityIcon" class="w-3.5 h-3.5" />
            {{ priorityLabel }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-base font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {{ document.title }}
        </h3>

        <!-- Info Row -->
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <!-- Customer -->
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-gray-700">{{ t('approval.card.customer') }}</span>
            <span>{{ document.customerName }}</span>
          </div>

          <span class="hidden lg:inline text-gray-300">|</span>

          <!-- Value -->
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-banknotes" class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-gray-700">{{ t('approval.card.value') }}</span>
            <span class="font-medium text-gray-900">{{ formattedValue }}</span>
          </div>

          <span class="hidden lg:inline text-gray-300">|</span>

          <!-- Sender -->
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-gray-700">{{ t('approval.card.sender') }}</span>
            <span>{{ document.sender.name }}</span>
          </div>

          <span class="hidden lg:inline text-gray-300">|</span>

          <!-- Waiting At -->
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-gray-400" />
            <span class="font-medium text-gray-700">{{ t('approval.card.waitingAt') }}</span>
            <span>{{ stepLabel }}</span>
            <span class="text-gray-300">•</span>
            <span class="text-gray-500">{{ daysAgoText }}</span>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Reject Button -->
        <UButton
          v-if="document.status === 'pending'"
          color="gray"
          variant="outline"
          size="sm"
          class="min-w-[80px] justify-center"
          :loading="isLoadingAction"
          @click="$emit('reject', document)"
        >
          {{ t('approval.card.actions.reject') }}
        </UButton>

        <!-- Approve Button -->
        <UButton
          v-if="document.status === 'pending'"
          color="primary"
          size="sm"
          class="min-w-[80px] justify-center"
          :loading="isLoadingAction"
          @click="$emit('approve', document)"
        >
          {{ t('approval.card.actions.approve') }}
        </UButton>

        <!-- Status Badge for non-pending -->
        <span
          v-else
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
          :class="statusClass"
        >
          <UIcon :name="statusIcon" class="w-4 h-4" />
          {{ statusLabel }}
        </span>

        <!-- More Options -->
        <UDropdown
          :items="menuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-vertical"
            size="sm"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'
import { getPriorityConfig, getStatusConfig, getStepConfig, formatCurrency } from '~/data/mock/approval.mock'

interface Props {
  document: ApprovalDocument
  isSelected?: boolean
  isLoadingAction?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  approve: [document: ApprovalDocument]
  reject: [document: ApprovalDocument]
  view: [document: ApprovalDocument]
}>()

const { t, locale } = useI18n()

// Priority
const priorityConfig = computed(() => getPriorityConfig(props.document.priority))
const priorityClass = computed(() => {
  const classes: Record<string, string> = {
    urgent: 'bg-amber-50 text-amber-700 border border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    low: 'bg-gray-50 text-gray-700 border border-gray-200'
  }
  return classes[props.document.priority] || classes.medium
})
const priorityIcon = computed(() => priorityConfig.value.icon)
const priorityLabel = computed(() => {
  return locale.value === 'th' ? priorityConfig.value.label : priorityConfig.value.labelEn
})

// Status
const statusConfig = computed(() => getStatusConfig(props.document.status))
const statusClass = computed(() => {
  const classes: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700'
  }
  return classes[props.document.status] || classes.pending
})
const statusIcon = computed(() => {
  const icons: Record<string, string> = {
    pending: 'i-heroicons-clock',
    approved: 'i-heroicons-check-circle',
    rejected: 'i-heroicons-x-circle'
  }
  return icons[props.document.status] || icons.pending
})
const statusLabel = computed(() => {
  return locale.value === 'th' ? statusConfig.value.label : statusConfig.value.labelEn
})

// Step
const stepConfig = computed(() => getStepConfig(props.document.currentStep))
const stepLabel = computed(() => {
  return locale.value === 'th' ? stepConfig.value.label : stepConfig.value.labelEn
})

// Value
const formattedValue = computed(() => {
  return formatCurrency(props.document.value, props.document.currency)
})

// Days ago
const daysAgoText = computed(() => {
  const days = props.document.daysPending
  if (days === 0) return t('approval.card.today')
  if (days === 1) return t('approval.card.yesterday')
  return t('approval.card.daysAgo', { days })
})

// Menu items
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
