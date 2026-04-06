<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      <!-- Search -->
      <div class="flex-1 min-w-[200px]">
        <UInput
          v-model="localSearch"
          :placeholder="t('approval.filters.search')"
          icon="i-heroicons-magnifying-glass"
          size="md"
          @update:model-value="debouncedSearch"
        />
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Filter -->
        <UDropdown
          :items="statusOptions"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="gray"
            variant="soft"
            size="md"
            trailing-icon="i-heroicons-chevron-down"
          >
            {{ t('approval.filters.status') }}
            <span v-if="filters.status && filters.status !== 'all'" class="ml-1 text-primary-600">
              ({{ getStatusLabel(filters.status) }})
            </span>
          </UButton>
        </UDropdown>

        <!-- Type Filter -->
        <UDropdown
          :items="typeOptions"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="gray"
            variant="soft"
            size="md"
            trailing-icon="i-heroicons-chevron-down"
          >
            {{ t('approval.filters.type') }}
            <span v-if="filters.type && filters.type !== 'all'" class="ml-1 text-primary-600">
              ({{ getTypeLabel(filters.type) }})
            </span>
          </UButton>
        </UDropdown>

        <!-- Priority Filter -->
        <UDropdown
          :items="priorityOptions"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="gray"
            variant="soft"
            size="md"
            trailing-icon="i-heroicons-chevron-down"
          >
            {{ t('approval.filters.priority') }}
            <span v-if="filters.priority && filters.priority !== 'all'" class="ml-1 text-primary-600">
              ({{ getPriorityLabel(filters.priority) }})
            </span>
          </UButton>
        </UDropdown>

        <!-- Sort By -->
        <UDropdown
          :items="sortOptions"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            color="gray"
            variant="soft"
            size="md"
            trailing-icon="i-heroicons-chevron-down"
          >
            {{ t('approval.filters.sortBy') }}
          </UButton>
        </UDropdown>

        <!-- Clear Filters -->
        <UButton
          v-if="hasActiveFilters"
          color="red"
          variant="soft"
          size="md"
          @click="clearFilters"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-1" />
          {{ t('common.clear') }}
        </UButton>
      </div>

      <!-- Export Button -->
      <div class="lg:ml-auto">
        <UButton
          color="gray"
          variant="soft"
          size="md"
          @click="$emit('export')"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
          {{ t('common.export') }}
        </UButton>
      </div>
    </div>

    <!-- Active Filters Tags -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
      <span class="text-sm text-gray-500">{{ t('common.activeFilters') }}:</span>
      
      <UBadge
        v-if="filters.status && filters.status !== 'all'"
        color="primary"
        variant="soft"
        size="sm"
        class="cursor-pointer"
        @click="updateFilter('status', 'all')"
      >
        {{ t('approval.filters.status') }}: {{ getStatusLabel(filters.status) }}
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
      </UBadge>

      <UBadge
        v-if="filters.type && filters.type !== 'all'"
        color="primary"
        variant="soft"
        size="sm"
        class="cursor-pointer"
        @click="updateFilter('type', 'all')"
      >
        {{ t('approval.filters.type') }}: {{ getTypeLabel(filters.type) }}
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
      </UBadge>

      <UBadge
        v-if="filters.priority && filters.priority !== 'all'"
        color="primary"
        variant="soft"
        size="sm"
        class="cursor-pointer"
        @click="updateFilter('priority', 'all')"
      >
        {{ t('approval.filters.priority') }}: {{ getPriorityLabel(filters.priority) }}
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
      </UBadge>

      <UBadge
        v-if="filters.search"
        color="primary"
        variant="soft"
        size="sm"
        class="cursor-pointer"
        @click="clearSearch"
      >
        {{ t('common.search') }}: {{ filters.search }}
        <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalFilters, ApprovalStatus, ApprovalType, ApprovalPriority } from '~/types/approval.type'
import debounce from 'lodash/debounce'

interface Props {
  filters: ApprovalFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:filters', filters: ApprovalFilters): void
  (e: 'clear'): void
  (e: 'export'): void
}>()

const { t } = useI18n()

// Local state for search
const localSearch = ref(props.filters.search || '')

// Watch for external filter changes
watch(() => props.filters.search, (newVal) => {
  localSearch.value = newVal || ''
})

// Debounced search
const debouncedSearch = debounce((value: string) => {
  updateFilter('search', value)
}, 300)

// Status options
const statusOptions = computed(() => [
  [{
    label: t('approval.status.pending'),
    click: () => updateFilter('status', 'pending'),
  }],
  [{
    label: t('approval.status.approved'),
    click: () => updateFilter('status', 'approved'),
  }],
  [{
    label: t('approval.status.rejected'),
    click: () => updateFilter('status', 'rejected'),
  }],
  [{
    label: t('common.all'),
    click: () => updateFilter('status', 'all'),
  }],
])

// Type options
const typeOptions = computed(() => [
  [{
    label: t('approval.type.contract'),
    click: () => updateFilter('type', 'contract'),
  }],
  [{
    label: t('approval.type.quotation'),
    click: () => updateFilter('type', 'quotation'),
  }],
  [{
    label: t('approval.type.invoice'),
    click: () => updateFilter('type', 'invoice'),
  }],
  [{
    label: t('approval.type.purchase_order'),
    click: () => updateFilter('type', 'purchase_order'),
  }],
  [{
    label: t('approval.type.expense'),
    click: () => updateFilter('type', 'expense'),
  }],
  [{
    label: t('approval.type.discount'),
    click: () => updateFilter('type', 'discount'),
  }],
  [{
    label: t('common.all'),
    click: () => updateFilter('type', 'all'),
  }],
])

// Priority options
const priorityOptions = computed(() => [
  [{
    label: t('approval.priority.urgent'),
    click: () => updateFilter('priority', 'urgent'),
  }],
  [{
    label: t('approval.priority.high'),
    click: () => updateFilter('priority', 'high'),
  }],
  [{
    label: t('approval.priority.medium'),
    click: () => updateFilter('priority', 'medium'),
  }],
  [{
    label: t('approval.priority.low'),
    click: () => updateFilter('priority', 'low'),
  }],
  [{
    label: t('common.all'),
    click: () => updateFilter('priority', 'all'),
  }],
])

// Sort options
const sortOptions = computed(() => [
  [{
    label: t('common.newest'),
    click: () => updateFilter('sortBy', 'newest'),
  }],
  [{
    label: t('common.oldest'),
    click: () => updateFilter('sortBy', 'oldest'),
  }],
  [{
    label: t('common.priority'),
    click: () => updateFilter('sortBy', 'priority'),
  }],
  [{
    label: t('common.value'),
    click: () => updateFilter('sortBy', 'value'),
  }],
])

// Computed
const hasActiveFilters = computed(() => {
  return (
    (props.filters.status && props.filters.status !== 'all') ||
    (props.filters.type && props.filters.type !== 'all') ||
    (props.filters.priority && props.filters.priority !== 'all') ||
    !!props.filters.search
  )
})

// Methods
function updateFilter(key: keyof ApprovalFilters, value: string) {
  emit('update:filters', { ...props.filters, [key]: value })
}

function clearFilters() {
  localSearch.value = ''
  emit('clear')
}

function clearSearch() {
  localSearch.value = ''
  updateFilter('search', '')
}

function getStatusLabel(status: string): string {
  return t(`approval.status.${status}`)
}

function getTypeLabel(type: string): string {
  return t(`approval.type.${type}`)
}

function getPriorityLabel(priority: string): string {
  return t(`approval.priority.${priority}`)
}
</script>
