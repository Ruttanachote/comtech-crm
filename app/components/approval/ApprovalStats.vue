<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
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
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
