<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-40 w-full bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ t('approval.empty.title') }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ t('approval.empty.description') }}
      </p>
      <button
        v-if="hasFilters"
        class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
        @click="$emit('clearFilters')"
      >
        {{ t('approval.empty.button') }}
      </button>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <ApprovalCard
        v-for="approval in items"
        :key="approval.id"
        :approval="approval"
        @approve="$emit('approve', $event)"
        @reject="$emit('reject', $event)"
        @view="$emit('view', $event)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="items.length > 0 && total > pageSize" class="flex items-center justify-between pt-4">
      <div class="text-sm text-gray-500">
        {{ paginationText }}
      </div>
      <div class="flex items-center gap-2">
        <button
          class="p-2 rounded-lg transition-colors"
          :class="page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
          :disabled="page === 1"
          @click="$emit('pageChange', page - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="text-sm text-gray-600">
          {{ page }} / {{ totalPages }}
        </span>
        
        <button
          class="p-2 rounded-lg transition-colors"
          :class="page >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
          :disabled="page >= totalPages"
          @click="$emit('pageChange', page + 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Page Size Selector -->
      <div class="relative">
        <select
          v-model="localPageSize"
          class="w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          @change="$emit('pageSizeChange', Number($event.target.value))"
        >
          <option v-for="option in pageSizeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalItem } from '~/types/approval.type'
import ApprovalCard from './ApprovalCard.vue'

interface Props {
  items: ApprovalItem[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  hasFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasFilters: false,
})

const emit = defineEmits<{
  (e: 'approve', id: string): void
  (e: 'reject', id: string): void
  (e: 'view', id: string): void
  (e: 'pageChange', page: number): void
  (e: 'pageSizeChange', pageSize: number): void
  (e: 'clearFilters'): void
}>()

const { t } = useI18n()

// Local state
const localPageSize = ref(props.pageSize)

// Watch for external changes
watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})

// Computed
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const paginationText = computed(() => {
  const start = (props.page - 1) * props.pageSize + 1
  const end = Math.min(props.page * props.pageSize, props.total)
  return `${start}-${end} ${t('common.of')} ${props.total}`
})

const pageSizeOptions = computed(() => [
  { label: `5 / ${t('common.page')}`, value: 5 },
  { label: `10 / ${t('common.page')}`, value: 10 },
  { label: `20 / ${t('common.page')}`, value: 20 },
  { label: `50 / ${t('common.page')}`, value: 50 },
])
</script>
