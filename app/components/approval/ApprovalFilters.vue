<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search Input -->
      <UInput
        v-model="localFilters.search"
        :placeholder="t('approval.filters.searchPlaceholder')"
        icon="i-lucide-search"
        class="flex-1 min-w-[240px]"
        @update:model-value="emitUpdate"
      />

      <!-- Status Dropdown -->
      <UDropdownMenu
        :items="statusItems"
        :content="{ align: 'start', side: 'bottom' }"
      >
        <UButton
          variant="outline"
          color="neutral"
          :class="{ 'ring-2 ring-emerald-500 ring-offset-2': localFilters.status !== 'all' }"
        >
          <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
          <span>{{ statusLabel }}</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
        </UButton>
      </UDropdownMenu>

      <!-- Type Dropdown -->
      <UDropdownMenu
        :items="typeItems"
        :content="{ align: 'start', side: 'bottom' }"
      >
        <UButton
          variant="outline"
          color="neutral"
          :class="{ 'ring-2 ring-emerald-500 ring-offset-2': localFilters.type !== 'all' }"
        >
          <UIcon name="i-lucide-file-text" class="w-4 h-4" />
          <span>{{ typeLabel }}</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
        </UButton>
      </UDropdownMenu>

      <!-- Priority Dropdown -->
      <UDropdownMenu
        :items="priorityItems"
        :content="{ align: 'start', side: 'bottom' }"
      >
        <UButton
          variant="outline"
          color="neutral"
          :class="{ 'ring-2 ring-emerald-500 ring-offset-2': localFilters.priority !== 'all' }"
        >
          <UIcon name="i-lucide-zap" class="w-4 h-4" />
          <span>{{ priorityLabel }}</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
        </UButton>
      </UDropdownMenu>

      <!-- Sort Dropdown -->
      <UDropdownMenu
        :items="sortItems"
        :content="{ align: 'end', side: 'bottom' }"
      >
        <UButton
          variant="outline"
          color="neutral"
        >
          <UIcon name="i-lucide-arrow-up-down" class="w-4 h-4" />
          <span>{{ sortLabel }}</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
        </UButton>
      </UDropdownMenu>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <span class="text-xs text-gray-500">{{ t('approval.filters.active') }}:</span>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-if="localFilters.status !== 'all'"
          color="success"
          variant="subtle"
          class="cursor-pointer"
          @click="clearFilter('status')"
        >
          {{ statusLabel }}
          <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
        </UBadge>
        <UBadge
          v-if="localFilters.type !== 'all'"
          color="success"
          variant="subtle"
          class="cursor-pointer"
          @click="clearFilter('type')"
        >
          {{ typeLabel }}
          <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
        </UBadge>
        <UBadge
          v-if="localFilters.priority !== 'all'"
          color="success"
          variant="subtle"
          class="cursor-pointer"
          @click="clearFilter('priority')"
        >
          {{ priorityLabel }}
          <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
        </UBadge>
      </div>
      <UButton
        variant="link"
        color="neutral"
        class="ml-auto text-xs"
        @click="clearAllFilters"
      >
        {{ t('approval.filters.clearAll') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalFilters } from '~/types/approval.type'

interface Props {
  filters: ApprovalFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update', filters: ApprovalFilters): void
}>()

const { t } = useI18n()

// Local state for filters
const localFilters = reactive<ApprovalFilters>({
  search: props.filters.search || '',
  status: props.filters.status || 'all',
  type: props.filters.type || 'all',
  priority: props.filters.priority || 'all',
  sort: props.filters.sort || 'newest'
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.search = newFilters.search || ''
  localFilters.status = newFilters.status || 'all'
  localFilters.type = newFilters.type || 'all'
  localFilters.priority = newFilters.priority || 'all'
  localFilters.sort = newFilters.sort || 'newest'
}, { deep: true })

// Dropdown items with onClick handlers (v3 uses onClick not click)
const statusItems = computed(() => [
  { label: t('approval.filters.status.all'), onClick: () => selectFilter('status', 'all') },
  { label: t('approval.filters.status.pending'), onClick: () => selectFilter('status', 'pending') },
  { label: t('approval.filters.status.approved'), onClick: () => selectFilter('status', 'approved') },
  { label: t('approval.filters.status.rejected'), onClick: () => selectFilter('status', 'rejected') }
])

const typeItems = computed(() => [
  { label: t('approval.filters.type.all'), onClick: () => selectFilter('type', 'all') },
  { label: t('approval.filters.type.quotation'), onClick: () => selectFilter('type', 'quotation') },
  { label: t('approval.filters.type.invoice'), onClick: () => selectFilter('type', 'invoice') },
  { label: t('approval.filters.type.purchase'), onClick: () => selectFilter('type', 'purchase') },
  { label: t('approval.filters.type.expense'), onClick: () => selectFilter('type', 'expense') }
])

const priorityItems = computed(() => [
  { label: t('approval.filters.priority.all'), onClick: () => selectFilter('priority', 'all') },
  { label: t('approval.filters.priority.urgent'), onClick: () => selectFilter('priority', 'urgent') },
  { label: t('approval.filters.priority.high'), onClick: () => selectFilter('priority', 'high') },
  { label: t('approval.filters.priority.medium'), onClick: () => selectFilter('priority', 'medium') },
  { label: t('approval.filters.priority.low'), onClick: () => selectFilter('priority', 'low') }
])

const sortItems = computed(() => [
  { label: t('approval.filters.sort.newest'), onClick: () => selectFilter('sort', 'newest') },
  { label: t('approval.filters.sort.oldest'), onClick: () => selectFilter('sort', 'oldest') },
  { label: t('approval.filters.sort.valueHigh'), onClick: () => selectFilter('sort', 'value_high') },
  { label: t('approval.filters.sort.valueLow'), onClick: () => selectFilter('sort', 'value_low') },
  { label: t('approval.filters.sort.priority'), onClick: () => selectFilter('sort', 'priority') }
])

// Labels
const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    all: t('approval.filters.status.label'),
    pending: t('approval.filters.status.pending'),
    approved: t('approval.filters.status.approved'),
    rejected: t('approval.filters.status.rejected')
  }
  return labels[localFilters.status || 'all']
})

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    all: t('approval.filters.type.label'),
    quotation: t('approval.filters.type.quotation'),
    invoice: t('approval.filters.type.invoice'),
    purchase: t('approval.filters.type.purchase'),
    expense: t('approval.filters.type.expense')
  }
  return labels[localFilters.type || 'all']
})

const priorityLabel = computed(() => {
  const labels: Record<string, string> = {
    all: t('approval.filters.priority.label'),
    urgent: t('approval.filters.priority.urgent'),
    high: t('approval.filters.priority.high'),
    medium: t('approval.filters.priority.medium'),
    low: t('approval.filters.priority.low')
  }
  return labels[localFilters.priority || 'all']
})

const sortLabel = computed(() => {
  const labels: Record<string, string> = {
    newest: t('approval.filters.sort.label'),
    oldest: t('approval.filters.sort.oldest'),
    value_high: t('approval.filters.sort.valueHigh'),
    value_low: t('approval.filters.sort.valueLow'),
    priority: t('approval.filters.sort.priority')
  }
  return labels[localFilters.sort || 'newest']
})

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return localFilters.status !== 'all' || 
         localFilters.type !== 'all' || 
         localFilters.priority !== 'all'
})

// Methods
function selectFilter(key: keyof ApprovalFilters, value: string) {
  localFilters[key] = value as any
  emitUpdate()
}

function clearFilter(key: keyof ApprovalFilters) {
  localFilters[key] = 'all' as any
  emitUpdate()
}

function clearAllFilters() {
  localFilters.status = 'all'
  localFilters.type = 'all'
  localFilters.priority = 'all'
  localFilters.search = ''
  emitUpdate()
}

function emitUpdate() {
  emit('update', { ...localFilters })
}
</script>
