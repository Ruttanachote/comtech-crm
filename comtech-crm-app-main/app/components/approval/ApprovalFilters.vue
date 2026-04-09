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
        <UDropdownMenu :items="statusOptions" :content="{ align: 'start' }">
          <UButton color="neutral" variant="soft" size="md" trailing-icon="i-heroicons-chevron-down">
            {{ t('approval.filters.status') }}
            <span v-if="filters.status && filters.status !== 'all'" class="ml-1 text-primary-600">
              ({{ getStatusLabel(filters.status) }})
            </span>
          </UButton>
        </UDropdownMenu>

        <!-- Type Filter -->
        <UDropdownMenu :items="typeOptions" :content="{ align: 'start' }">
          <UButton color="neutral" variant="soft" size="md" trailing-icon="i-heroicons-chevron-down">
            {{ t('approval.filters.type') }}
            <span v-if="filters.type && filters.type !== 'all'" class="ml-1 text-primary-600">
              ({{ getTypeLabel(filters.type) }})
            </span>
          </UButton>
        </UDropdownMenu>

        <!-- Priority Filter -->
        <UDropdownMenu key="priority-dropdown" :items="priorityOptions" :content="{ align: 'start' }">
          <UButton color="neutral" variant="soft" size="md" trailing-icon="i-heroicons-chevron-down">
            {{ t('approval.filters.priority') }}
            <span v-if="filters.priority && filters.priority !== 'all'" class="ml-1 text-primary-600">
              ({{ getPriorityLabel(filters.priority) }})
            </span>
          </UButton>
        </UDropdownMenu>

        <!-- Sort By -->
        <UDropdownMenu :items="sortOptions" :content="{ align: 'start' }">
          <UButton color="neutral" variant="soft" size="md" trailing-icon="i-heroicons-chevron-down">
            {{ t('approval.filters.sortBy') }}
          </UButton>
        </UDropdownMenu>

        <!-- Clear Filters -->
        <UButton v-if="hasActiveFilters" color="error" variant="soft" size="md" @click="clearFilters">
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-1" />
          {{ t('common.clear') }}
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
import type { ApprovalFilters } from '~/types/approval.type'

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

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

const localSearch = ref(props.filters.search || '')

watch(() => props.filters.search, (newVal) => {
  localSearch.value = newVal || ''
})

const debouncedSearch = debounce((value: string) => {
  updateFilter('search', value)
}, 300)

const statusOptions = computed(() => [
  { label: t('approval.status.pending'), onSelect: () => updateFilter('status', 'pending') },
  { label: t('approval.status.approved'), onSelect: () => updateFilter('status', 'approved') },
  { label: t('approval.status.rejected'), onSelect: () => updateFilter('status', 'rejected') },
  { label: t('common.all'), onSelect: () => updateFilter('status', 'all') },
])

const typeOptions = computed(() => [
  { label: t('approval.type.contract'), onSelect: () => updateFilter('type', 'contract') },
  { label: t('approval.type.quotation'), onSelect: () => updateFilter('type', 'quotation') },
  { label: t('common.all'), onSelect: () => updateFilter('type', 'all') },
])

const priorityOptions = computed(() => [
  { label: t('approval.priority.high'), onSelect: () => updateFilter('priority', 'high') },
  { label: t('approval.priority.medium'), onSelect: () => updateFilter('priority', 'medium') },
  { label: t('approval.priority.low'), onSelect: () => updateFilter('priority', 'low') },
  { label: t('common.all'), onSelect: () => updateFilter('priority', 'all') },
])

const sortOptions = computed(() => [
  { label: t('common.date_new_old'), onSelect: () => updateFilter('sortBy', 'date_new_old') },
  { label: t('common.date_old_new'), onSelect: () => updateFilter('sortBy', 'date_old_new') },
  { label: t('common.value'), onSelect: () => updateFilter('sortBy', 'value') },
  { label: t('common.priority'), onSelect: () => updateFilter('sortBy', 'priority') },
])

const hasActiveFilters = computed(() => {
  return (
    (props.filters.status && props.filters.status !== 'all') ||
    (props.filters.type && props.filters.type !== 'all') ||
    (props.filters.priority && props.filters.priority !== 'all') ||
    !!props.filters.search
  )
})

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
