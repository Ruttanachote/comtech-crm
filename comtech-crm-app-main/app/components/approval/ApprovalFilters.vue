<template>
  <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
    <!-- Search Input -->
    <div class="relative flex-1 max-w-md">
      <UIcon 
        name="i-heroicons-magnifying-glass" 
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
      />
      <UInput
        v-model="searchQuery"
        :placeholder="t('approval.searchPlaceholder')"
        class="pl-10"
        size="md"
        @update:model-value="debouncedSearch"
      />
      <UButton
        v-if="searchQuery"
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark"
        size="xs"
        class="absolute right-2 top-1/2 -translate-y-1/2"
        @click="clearSearch"
      />
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <!-- Status Filter -->
      <UDropdown
        :items="statusItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="gray"
          variant="outline"
          size="md"
          :class="{ 'border-primary-500 text-primary-700': filters.status !== 'all' }"
        >
          <UIcon name="i-heroicons-funnel" class="w-4 h-4 mr-1.5" />
          {{ t('approval.filters.status') }}
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1.5" />
        </UButton>
      </UDropdown>

      <!-- Type Filter -->
      <UDropdown
        :items="typeItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="gray"
          variant="outline"
          size="md"
          :class="{ 'border-primary-500 text-primary-700': filters.type !== 'all' }"
        >
          <UIcon name="i-heroicons-tag" class="w-4 h-4 mr-1.5" />
          {{ t('approval.filters.type') }}
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1.5" />
        </UButton>
      </UDropdown>

      <!-- Priority Filter -->
      <UDropdown
        :items="priorityItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="gray"
          variant="outline"
          size="md"
          :class="{ 'border-primary-500 text-primary-700': filters.priority !== 'all' }"
        >
          <UIcon name="i-heroicons-flag" class="w-4 h-4 mr-1.5" />
          {{ t('approval.filters.priority') }}
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1.5" />
        </UButton>
      </UDropdown>

      <!-- Sort -->
      <UDropdown
        :items="sortItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="gray"
          variant="outline"
          size="md"
        >
          <UIcon name="i-heroicons-arrows-up-down" class="w-4 h-4 mr-1.5" />
          {{ t('approval.filters.sort') }}
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1.5" />
        </UButton>
      </UDropdown>

      <!-- Clear Filters -->
      <UButton
        v-if="hasActiveFilters"
        color="gray"
        variant="ghost"
        size="md"
        icon="i-heroicons-x-mark"
        @click="clearAllFilters"
      >
        {{ t('approval.filters.clearAll') }}
      </UButton>

      <div class="w-px h-6 bg-gray-200 mx-1 hidden lg:block" />

      <!-- Export Button -->
      <UDropdown
        :items="exportItems"
        :popper="{ placement: 'bottom-end' }"
      >
        <UButton
          color="gray"
          variant="outline"
          size="md"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-1.5" />
          {{ t('approval.export.title') }}
        </UButton>
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalFilters, ApprovalStatus, ApprovalPriority, ApprovalType } from '~/types/approval.type'
import { priorityConfigs, statusConfigs } from '~/data/mock/approval.mock'

interface Props {
  filters: ApprovalFilters
  hasActiveFilters: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: ApprovalFilters]
  'clear-filters': []
  'export': [format: 'excel' | 'csv']
}>()

const { t, locale } = useI18n()

// Search
const searchQuery = ref(props.filters.search)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const debouncedSearch = (value: string) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('update:filters', { ...props.filters, search: value })
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:filters', { ...props.filters, search: '' })
}

// Status items
const statusItems = computed(() => [
  [
    {
      label: t('approval.status.all'),
      icon: props.filters.status === 'all' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('status', 'all' as ApprovalStatus)
    },
    ...statusConfigs.filter(s => s.key !== 'all').map(status => ({
      label: locale.value === 'th' ? status.label : status.labelEn,
      icon: props.filters.status === status.key ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('status', status.key as ApprovalStatus)
    }))
  ]
])

// Type items
const typeItems = computed(() => [
  [
    {
      label: t('approval.type.all'),
      icon: props.filters.type === 'all' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'all' as ApprovalType)
    },
    {
      label: t('approval.type.freight'),
      icon: props.filters.type === 'freight' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'freight' as ApprovalType)
    },
    {
      label: t('approval.type.warehousing'),
      icon: props.filters.type === 'warehousing' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'warehousing' as ApprovalType)
    },
    {
      label: t('approval.type.transport'),
      icon: props.filters.type === 'transport' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'transport' as ApprovalType)
    },
    {
      label: t('approval.type.shipping'),
      icon: props.filters.type === 'shipping' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'shipping' as ApprovalType)
    },
    {
      label: t('approval.type.logistics'),
      icon: props.filters.type === 'logistics' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'logistics' as ApprovalType)
    },
    {
      label: t('approval.type.other'),
      icon: props.filters.type === 'other' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('type', 'other' as ApprovalType)
    }
  ]
])

// Priority items
const priorityItems = computed(() => [
  [
    {
      label: t('approval.priority.all'),
      icon: props.filters.priority === 'all' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('priority', 'all' as ApprovalPriority)
    },
    ...priorityConfigs.map(priority => ({
      label: locale.value === 'th' ? priority.label : priority.labelEn,
      icon: props.filters.priority === priority.key ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('priority', priority.key as ApprovalPriority)
    }))
  ]
])

// Sort items
const sortItems = computed(() => [
  [
    {
      label: t('approval.sort.newest'),
      icon: props.filters.sortBy === 'newest' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('sortBy', 'newest')
    },
    {
      label: t('approval.sort.oldest'),
      icon: props.filters.sortBy === 'oldest' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('sortBy', 'oldest')
    },
    {
      label: t('approval.sort.valueHigh'),
      icon: props.filters.sortBy === 'value_high' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('sortBy', 'value_high')
    },
    {
      label: t('approval.sort.valueLow'),
      icon: props.filters.sortBy === 'value_low' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('sortBy', 'value_low')
    },
    {
      label: t('approval.sort.priority'),
      icon: props.filters.sortBy === 'priority' ? 'i-heroicons-check' : undefined,
      click: () => updateFilter('sortBy', 'priority')
    }
  ]
])

// Export items
const exportItems = computed(() => [
  [
    {
      label: t('approval.export.excel'),
      icon: 'i-heroicons-document',
      click: () => emit('export', 'excel')
    },
    {
      label: t('approval.export.csv'),
      icon: 'i-heroicons-table-cells',
      click: () => emit('export', 'csv')
    }
  ]
])

// Update filter
const updateFilter = (key: keyof ApprovalFilters, value: any) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  emit('clear-filters')
}
</script>
