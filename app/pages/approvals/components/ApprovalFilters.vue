<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Search -->
    <div class="flex-1 min-w-[240px]">
      <UInput
        v-model="localFilters.search"
        :placeholder="t('approval.searchPlaceholder')"
        icon="i-heroicons-magnifying-glass"
        size="md"
        color="gray"
        variant="outline"
        :ui="{
          base: 'w-full',
          rounded: 'rounded-lg',
          padding: { md: 'px-4 py-2' }
        }"
        @update:model-value="updateSearch"
      />
    </div>

    <!-- Status Filter -->
    <USelectMenu
      v-model="localFilters.status"
      :options="statusOptions"
      value-attribute="value"
      option-attribute="label"
      size="md"
      color="gray"
      variant="outline"
      :ui="{
        rounded: 'rounded-lg',
        padding: { md: 'px-4 py-2' }
      }"
      @update:model-value="updateFilter('status', $event)"
    >
      <template #label>
        <span class="text-gray-700">{{ t('approval.filters.status') }}</span>
      </template>
    </USelectMenu>

    <!-- Type Filter -->
    <USelectMenu
      v-model="localFilters.type"
      :options="typeOptions"
      value-attribute="value"
      option-attribute="label"
      size="md"
      color="gray"
      variant="outline"
      :ui="{
        rounded: 'rounded-lg',
        padding: { md: 'px-4 py-2' }
      }"
      @update:model-value="updateFilter('type', $event)"
    >
      <template #label>
        <span class="text-gray-700">{{ t('approval.filters.type') }}</span>
      </template>
    </USelectMenu>

    <!-- Priority Filter -->
    <USelectMenu
      v-model="localFilters.priority"
      :options="priorityOptions"
      value-attribute="value"
      option-attribute="label"
      size="md"
      color="gray"
      variant="outline"
      :ui="{
        rounded: 'rounded-lg',
        padding: { md: 'px-4 py-2' }
      }"
      @update:model-value="updateFilter('priority', $event)"
    >
      <template #label>
        <span class="text-gray-700">{{ t('approval.filters.priority') }}</span>
      </template>
    </USelectMenu>

    <!-- Sort -->
    <USelectMenu
      v-model="localFilters.sortBy"
      :options="sortOptions"
      value-attribute="value"
      option-attribute="label"
      size="md"
      color="gray"
      variant="outline"
      :ui="{
        rounded: 'rounded-lg',
        padding: { md: 'px-4 py-2' }
      }"
      @update:model-value="updateFilter('sortBy', $event)"
    >
      <template #label>
        <span class="text-gray-700">{{ t('approval.filters.sort') }}</span>
      </template>
    </USelectMenu>

    <!-- Clear Filters -->
    <UButton
      v-if="hasActiveFilters"
      color="gray"
      variant="ghost"
      size="sm"
      icon="i-heroicons-x-mark"
      @click="clearFilters"
    >
      {{ t('approval.filters.clearAll') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalFilters, ApprovalStatus, ApprovalPriority, ApprovalType } from '~/types/approval.type'

interface Props {
  filters: ApprovalFilters
  hasActiveFilters: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ApprovalFilters]
  'clear-filters': []
}>()

const { t } = useI18n()

// Local state for filters
const localFilters = reactive<ApprovalFilters>({
  status: props.filters.status,
  type: props.filters.type,
  priority: props.filters.priority,
  search: props.filters.search,
  sortBy: props.filters.sortBy
})

// Sync with props
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// Options
const statusOptions = computed(() => [
  { value: 'all', label: t('approval.status.all') },
  { value: 'pending', label: t('approval.status.pending') },
  { value: 'approved', label: t('approval.status.approved') },
  { value: 'rejected', label: t('approval.status.rejected') }
])

const typeOptions = computed(() => [
  { value: 'all', label: t('approval.type.all') },
  { value: 'freight', label: t('approval.type.freight') },
  { value: 'warehousing', label: t('approval.type.warehousing') },
  { value: 'transport', label: t('approval.type.transport') },
  { value: 'shipping', label: t('approval.type.shipping') },
  { value: 'logistics', label: t('approval.type.logistics') },
  { value: 'other', label: t('approval.type.other') }
])

const priorityOptions = computed(() => [
  { value: 'all', label: t('approval.priority.all') },
  { value: 'urgent', label: t('approval.priority.urgent') },
  { value: 'medium', label: t('approval.priority.medium') },
  { value: 'low', label: t('approval.priority.low') }
])

const sortOptions = computed(() => [
  { value: 'newest', label: t('approval.sort.newest') },
  { value: 'oldest', label: t('approval.sort.oldest') },
  { value: 'valueHigh', label: t('approval.sort.valueHigh') },
  { value: 'valueLow', label: t('approval.sort.valueLow') },
  { value: 'priority', label: t('approval.sort.priority') }
])

// Debounced search update
let searchTimeout: ReturnType<typeof setTimeout>
const updateSearch = (value: string) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('update:filters', { ...props.filters, search: value })
  }, 300)
}

const updateFilter = (key: keyof ApprovalFilters, value: any) => {
  emit('update:filters', { ...props.filters, [key]: value })
}

const clearFilters = () => {
  emit('clear-filters')
}
</script>
