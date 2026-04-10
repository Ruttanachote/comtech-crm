<template>
  <div class="space-y-3">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-20 w-full" />
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('approval.empty.title') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {{ t('approval.empty.description') }}
      </p>
      <UButton
        v-if="hasFilters"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        @click="$emit('clearFilters')"
      >
        {{ t('approval.empty.button') }}
      </UButton>
    </div>

    <!-- List -->
    <template v-else>
      <ApprovalCard
        v-for="approval in items"
        :key="approval.id"
        :approval="approval"
        @approve="$emit('approve', $event)"
        @reject="$emit('reject', $event)"
        @view="$emit('view', $event)"
      />

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 mt-2">
        <!-- Total info -->
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
          {{ paginationText }}
        </p>

        <!-- Page controls -->
        <div class="flex items-center justify-center gap-1">
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            :class="page === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'"
            :disabled="page === 1"
            @click="page > 1 && $emit('pageChange', page - 1)"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
          </button>

          <button
            v-for="p in pageNumbers"
            :key="p"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="p === page
              ? 'bg-primary-500 text-white'
              : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            @click="$emit('pageChange', p)"
          >
            {{ p }}
          </button>

          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            :class="page >= totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'"
            :disabled="page >= totalPages"
            @click="page < totalPages && $emit('pageChange', page + 1)"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Page size -->
        <div class="flex justify-center sm:justify-end">
          <USelect
            v-model="localPageSize"
            :items="pageSizeOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="w-28"
            @update:model-value="(val) => $emit('pageSizeChange', val)"
          />
        </div>
      </div>
    </template>
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

const localPageSize = ref(props.pageSize)

watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = props.page
  const delta = 2
  const pages: number[] = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }
  return pages
})

const paginationText = computed(() => {
  const start = (props.page - 1) * props.pageSize + 1
  const end = Math.min(props.page * props.pageSize, props.total)
  return `${start}-${end} ${t('approval.actions.of')} ${props.total}`
})

const pageSizeOptions = computed(() => [
  { label: '5 / ' + t('approval.actions.page'), value: 5 },
  { label: '10 / ' + t('approval.actions.page'), value: 10 },
  { label: '20 / ' + t('approval.actions.page'), value: 20 },
  { label: '50 / ' + t('approval.actions.page'), value: 50 },
])
</script>
