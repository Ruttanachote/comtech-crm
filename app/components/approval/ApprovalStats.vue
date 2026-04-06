<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Total -->
    <div 
      class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      :class="{ 'ring-2 ring-blue-500': selectedFilter === 'all' }"
      @click="setFilter('all')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ t('approval.stats.total') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats?.total || 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <!-- Pending -->
    <div 
      class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      :class="{ 'ring-2 ring-amber-500': selectedFilter === 'pending' }"
      @click="setFilter('pending')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ t('approval.stats.pending') }}</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ stats?.pending || 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
          <UIcon name="i-heroicons-clock" class="w-6 h-6 text-amber-600" />
        </div>
      </div>
    </div>

    <!-- Approved -->
    <div 
      class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      :class="{ 'ring-2 ring-emerald-500': selectedFilter === 'approved' }"
      @click="setFilter('approved')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ t('approval.stats.approved') }}</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ stats?.approved || 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>

    <!-- Rejected -->
    <div 
      class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      :class="{ 'ring-2 ring-red-500': selectedFilter === 'rejected' }"
      @click="setFilter('rejected')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ t('approval.stats.rejected') }}</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ stats?.rejected || 0 }}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalStats } from '~/types/approval.type'

interface Props {
  stats: ApprovalStats | null
  selectedFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedFilter: 'all',
})

const emit = defineEmits<{
  (e: 'filter', status: string): void
}>()

const { t } = useI18n()

function setFilter(status: string) {
  emit('filter', status)
}
</script>
