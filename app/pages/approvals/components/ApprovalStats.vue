<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- All -->
    <button
      class="flex items-center gap-3 p-4 bg-white rounded-xl border transition-all text-left"
      :class="filters.status === 'all' 
        ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/30' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'"
      @click="selectStatus('all')"
    >
      <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ t('approval.stats.all') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.all }}</p>
      </div>
    </button>

    <!-- Pending -->
    <button
      class="flex items-center gap-3 p-4 bg-white rounded-xl border transition-all text-left"
      :class="filters.status === 'pending' 
        ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/30' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'"
      @click="selectStatus('pending')"
    >
      <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ t('approval.stats.pending') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
      </div>
    </button>

    <!-- Approved -->
    <button
      class="flex items-center gap-3 p-4 bg-white rounded-xl border transition-all text-left"
      :class="filters.status === 'approved' 
        ? 'border-green-500 ring-1 ring-green-500 bg-green-50/30' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'"
      @click="selectStatus('approved')"
    >
      <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
        <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ t('approval.stats.approved') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.approved }}</p>
      </div>
    </button>

    <!-- Rejected -->
    <button
      class="flex items-center gap-3 p-4 bg-white rounded-xl border transition-all text-left"
      :class="filters.status === 'rejected' 
        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'"
      @click="selectStatus('rejected')"
    >
      <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
        <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-red-600" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ t('approval.stats.rejected') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalStats as StatsType, ApprovalFilters } from '~/types/approval.type'

interface Props {
  stats: StatsType
  filters: ApprovalFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ApprovalFilters]
}>()

const { t } = useI18n()

const selectStatus = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
  emit('update:filters', { ...props.filters, status })
}
</script>
