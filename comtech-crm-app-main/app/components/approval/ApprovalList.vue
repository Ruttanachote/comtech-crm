<template>
  <div class="space-y-3">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="documents.length === 0" 
      class="flex flex-col items-center justify-center py-16 px-4"
    >
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <UIcon name="i-heroicons-inbox" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        {{ t('approval.empty.title') }}
      </h3>
      <p class="text-sm text-gray-500 text-center max-w-sm mb-4">
        {{ t('approval.empty.description') }}
      </p>
      <UButton
        v-if="hasActiveFilters"
        color="primary"
        variant="soft"
        @click="$emit('clear-filters')"
      >
        {{ t('approval.empty.clearFilters') }}
      </UButton>
    </div>

    <!-- Document List -->
    <template v-else>
      <ApprovalCard
        v-for="document in documents"
        :key="document.id"
        :document="document"
        :is-selected="selectedDocument?.id === document.id"
        :is-loading-action="isLoadingAction"
        @approve="$emit('approve', $event)"
        @reject="$emit('reject', $event)"
        @view="$emit('view', $event)"
      />

      <!-- Pagination -->
      <div 
        v-if="pagination.totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200"
      >
        <!-- Page Size Selector -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>{{ t('approval.pagination.showing', { 
            from: (pagination.page - 1) * pagination.limit + 1,
            to: Math.min(pagination.page * pagination.limit, pagination.total),
            total: pagination.total 
          }) }}</span>
          <USelect
            v-model="pageSize"
            :options="[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 }
            ]"
            option-attribute="label"
            value-attribute="value"
            size="xs"
            class="w-20"
          />
          <span>{{ t('approval.pagination.perPage') }}</span>
        </div>

        <!-- Page Navigation -->
        <div class="flex items-center gap-1">
          <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-left"
            :disabled="pagination.page === 1"
            @click="goToPage(pagination.page - 1)"
          />
          
          <template v-for="page in visiblePages" :key="page">
            <UButton
              v-if="page !== '...'"
              :color="pagination.page === page ? 'primary' : 'gray'"
              :variant="pagination.page === page ? 'solid' : 'ghost'"
              size="sm"
              class="min-w-[36px]"
              @click="goToPage(page as number)"
            >
              {{ page }}
            </UButton>
            <span v-else class="px-2 text-gray-400">...</span>
          </template>
          
          <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-right"
            :disabled="pagination.page === pagination.totalPages"
            @click="goToPage(pagination.page + 1)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument, ApprovalPagination } from '~/types/approval.type'

interface Props {
  documents: ApprovalDocument[]
  isLoading: boolean
  isLoadingAction: boolean
  pagination: ApprovalPagination
  selectedDocument: ApprovalDocument | null
  hasActiveFilters: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  approve: [document: ApprovalDocument]
  reject: [document: ApprovalDocument]
  view: [document: ApprovalDocument]
  'update:page': [page: number]
  'update:limit': [limit: number]
  'clear-filters': []
}>()

const { t } = useI18n()

// Page size
const pageSize = computed({
  get: () => props.pagination.limit,
  set: (value) => emit('update:limit', value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const total = props.pagination.totalPages
  const current = props.pagination.page
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.pagination.totalPages) {
    emit('update:page', page)
  }
}
</script>
