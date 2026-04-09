<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[240px]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="localFilters.search"
          type="text"
          :placeholder="t('approval.filters.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          @input="emitUpdate"
        />
      </div>

      <!-- Status Dropdown -->
      <div class="relative dropdown-container">
        <button
          @click="toggleDropdown('status')"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          :class="{ 'border-emerald-500 ring-2 ring-emerald-100': localFilters.status !== 'all' }"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ statusLabel }}</span>
          <svg 
            class="w-4 h-4 text-gray-400 transition-transform" 
            :class="{ 'rotate-180': openDropdown === 'status' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div 
          v-if="openDropdown === 'status'" 
          class="dropdown-menu absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style="z-index: 9999;"
        >
          <button
            v-for="option in statusOptions"
            :key="option.value"
            type="button"
            @click="selectFilter('status', option.value)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            :class="localFilters.status === option.value ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'"
          >
            <svg v-if="localFilters.status === option.value" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="w-4"></span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Type Dropdown -->
      <div class="relative dropdown-container">
        <button
          @click="toggleDropdown('type')"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          :class="{ 'border-emerald-500 ring-2 ring-emerald-100': localFilters.type !== 'all' }"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{{ typeLabel }}</span>
          <svg 
            class="w-4 h-4 text-gray-400 transition-transform" 
            :class="{ 'rotate-180': openDropdown === 'type' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div 
          v-if="openDropdown === 'type'" 
          class="dropdown-menu absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style="z-index: 9999;"
        >
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            @click="selectFilter('type', option.value)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            :class="localFilters.type === option.value ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'"
          >
            <svg v-if="localFilters.type === option.value" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="w-4"></span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Priority Dropdown -->
      <div class="relative dropdown-container">
        <button
          @click="toggleDropdown('priority')"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          :class="{ 'border-emerald-500 ring-2 ring-emerald-100': localFilters.priority !== 'all' }"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{{ priorityLabel }}</span>
          <svg 
            class="w-4 h-4 text-gray-400 transition-transform" 
            :class="{ 'rotate-180': openDropdown === 'priority' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div 
          v-if="openDropdown === 'priority'" 
          class="dropdown-menu absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style="z-index: 9999;"
        >
          <button
            v-for="option in priorityOptions"
            :key="option.value"
            type="button"
            @click="selectFilter('priority', option.value)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            :class="localFilters.priority === option.value ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'"
          >
            <svg v-if="localFilters.priority === option.value" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="w-4"></span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Sort Dropdown -->
      <div class="relative dropdown-container">
        <button
          @click="toggleDropdown('sort')"
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span>{{ sortLabel }}</span>
          <svg 
            class="w-4 h-4 text-gray-400 transition-transform" 
            :class="{ 'rotate-180': openDropdown === 'sort' }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div 
          v-if="openDropdown === 'sort'" 
          class="dropdown-menu absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style="z-index: 9999;"
        >
          <button
            v-for="option in sortOptions"
            :key="option.value"
            type="button"
            @click="selectFilter('sort', option.value)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            :class="localFilters.sort === option.value ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'"
          >
            <svg v-if="localFilters.sort === option.value" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="w-4"></span>
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <span class="text-xs text-gray-500">{{ t('approval.filters.active') }}:</span>
      <div class="flex flex-wrap gap-2">
        <span
          v-if="localFilters.status !== 'all'"
          class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
        >
          {{ statusLabel }}
          <button @click="clearFilter('status')" class="hover:text-emerald-900">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span
          v-if="localFilters.type !== 'all'"
          class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
        >
          {{ typeLabel }}
          <button @click="clearFilter('type')" class="hover:text-emerald-900">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <span
          v-if="localFilters.priority !== 'all'"
          class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
        >
          {{ priorityLabel }}
          <button @click="clearFilter('priority')" class="hover:text-emerald-900">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
      <button
        @click="clearAllFilters"
        class="text-xs text-gray-500 hover:text-gray-700 underline ml-auto"
      >
        {{ t('approval.filters.clearAll') }}
      </button>
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

// Dropdown state
const openDropdown = ref<string | null>(null)

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.search = newFilters.search || ''
  localFilters.status = newFilters.status || 'all'
  localFilters.type = newFilters.type || 'all'
  localFilters.priority = newFilters.priority || 'all'
  localFilters.sort = newFilters.sort || 'newest'
}, { deep: true })

// Click outside handler - using mousedown to catch before click
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  
  // Find closest dropdown container
  const dropdownContainer = target.closest('.dropdown-container')
  
  // If click is outside all dropdown containers, close
  if (!dropdownContainer) {
    openDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Options
const statusOptions = computed(() => [
  { value: 'all', label: t('approval.filters.status.all') },
  { value: 'pending', label: t('approval.filters.status.pending') },
  { value: 'approved', label: t('approval.filters.status.approved') },
  { value: 'rejected', label: t('approval.filters.status.rejected') }
])

const typeOptions = computed(() => [
  { value: 'all', label: t('approval.filters.type.all') },
  { value: 'quotation', label: t('approval.filters.type.quotation') },
  { value: 'invoice', label: t('approval.filters.type.invoice') },
  { value: 'purchase', label: t('approval.filters.type.purchase') },
  { value: 'expense', label: t('approval.filters.type.expense') }
])

const priorityOptions = computed(() => [
  { value: 'all', label: t('approval.filters.priority.all') },
  { value: 'urgent', label: t('approval.filters.priority.urgent') },
  { value: 'high', label: t('approval.filters.priority.high') },
  { value: 'medium', label: t('approval.filters.priority.medium') },
  { value: 'low', label: t('approval.filters.priority.low') }
])

const sortOptions = computed(() => [
  { value: 'newest', label: t('approval.filters.sort.newest') },
  { value: 'oldest', label: t('approval.filters.sort.oldest') },
  { value: 'value_high', label: t('approval.filters.sort.valueHigh') },
  { value: 'value_low', label: t('approval.filters.sort.valueLow') },
  { value: 'priority', label: t('approval.filters.sort.priority') }
])

// Labels
const statusLabel = computed(() => {
  const option = statusOptions.value.find(o => o.value === localFilters.status)
  return option?.label || t('approval.filters.status.label')
})

const typeLabel = computed(() => {
  const option = typeOptions.value.find(o => o.value === localFilters.type)
  return option?.label || t('approval.filters.type.label')
})

const priorityLabel = computed(() => {
  const option = priorityOptions.value.find(o => o.value === localFilters.priority)
  return option?.label || t('approval.filters.priority.label')
})

const sortLabel = computed(() => {
  const option = sortOptions.value.find(o => o.value === localFilters.sort)
  return option?.label || t('approval.filters.sort.label')
})

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return localFilters.status !== 'all' || 
         localFilters.type !== 'all' || 
         localFilters.priority !== 'all'
})

// Methods
function toggleDropdown(name: string) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function selectFilter(key: keyof ApprovalFilters, value: string) {
  localFilters[key] = value as any
  openDropdown.value = null
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
