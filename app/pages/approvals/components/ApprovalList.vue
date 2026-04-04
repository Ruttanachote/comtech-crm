<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="documents.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <UIcon name="i-heroicons-inbox" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        {{ t('approval.empty.title') }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">
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
    <div v-else class="space-y-4">
      <ApprovalCard
        v-for="document in documents"
        :key="document.id"
        :document="document"
        :is-loading-action="isLoadingAction"
        @approve="$emit('approve', $event)"
        @reject="$emit('reject', $event)"
        @view="$emit('view', $event)"
      />

      <!-- Pagination -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">
            {{ t('approval.pagination.showing', { 
              from: (pagination.page - 1) * pagination.limit + 1, 
              to: Math.min(pagination.page * pagination.limit, pagination.total), 
              total: pagination.total 
            }) }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <!-- Per Page Select -->
          <USelect
            v-model="localLimit"
            :options="[
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' }
            ]"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            color="gray"
            variant="outline"
            :ui="{ rounded: 'rounded-lg' }"
            @update:model-value="$emit('update:limit', $event)"
          />
          <span class="text-sm text-gray-500">{{ t('approval.pagination.perPage') }}</span>

          <!-- Page Navigation -->
          <div class="flex items-center gap-1">
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-chevron-left"
              :disabled="pagination.page === 1"
              @click="$emit('update:page', pagination.page - 1)"
            />
            <UButton
              color="primary"
              variant="soft"
              size="sm"
            >
              {{ pagination.page }}
            </UButton>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-chevron-right"
              :disabled="pagination.page >= pagination.totalPages"
              @click="$emit('update:page', pagination.page + 1)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalDocument } from '~/types/approval.type'
import ApprovalCard from './ApprovalCard.vue'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Props {
  documents: ApprovalDocument[]
  isLoading: boolean
  isLoadingAction: boolean
  pagination: Pagination
  hasActiveFilters: boolean
}

defineProps<Props>()
defineEmits<{
  approve: [document: ApprovalDocument]
  reject: [document: ApprovalDocument]
  view: [document: ApprovalDocument]
  'update:page': [page: number]
  'update:limit': [limit: number]
  'clear-filters': []
}>()

const { t } = useI18n()

const localLimit = ref(10)
</script>
