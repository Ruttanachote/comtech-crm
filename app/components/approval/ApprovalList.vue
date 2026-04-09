<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-40 w-full" />
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ t('approval.empty.title') }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ t('approval.empty.description') }}
      </p>
      <UButton
        v-if="hasFilters"
        color="primary"
        variant="soft"
        @click="$emit('clearFilters')"
      >
        {{ t('approval.empty.button') }}
      </UButton>
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
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-chevron-left"
          :disabled="page === 1"
          @click="$emit('pageChange', page - 1)"
        />
        
        <span class="text-sm text-gray-600">
          {{ page }} / {{ totalPages }}
        </span>
        
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-chevron-right"
          :disabled="page >= totalPages"
          @click="$emit('pageChange', page + 1)"
        />
      </div>

      <!-- Page Size Selector -->
      <USelect
        v-model="localPageSize"
        :items="pageSizeOptions"
        size="sm"
        class="w-32"
        @update:model-value="$emit('pageSizeChange', $event)"
      />
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
