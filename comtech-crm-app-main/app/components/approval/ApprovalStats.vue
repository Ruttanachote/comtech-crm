<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

    <!-- Total -->
    <div
      class="rounded-xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-shadow cursor-pointer
             bg-white border-gray-200
             dark:bg-blue-900 dark:border-blue-700"
      :class="{ 'ring-2 ring-blue-500': selectedFilter === 'all' }"
      @click="setFilter('all')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-blue-200">
            {{ t('approval.stats.total') }}
          </p>
          <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ stats?.total || 0 }}
          </p>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    bg-blue-100 dark:bg-blue-700/60">
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-100" />
        </div>
      </div>
    </div>

    <!-- Pending -->
    <div
      class="rounded-xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-shadow cursor-pointer
             bg-white border-gray-200
             dark:bg-amber-900 dark:border-amber-700"
      :class="{ 'ring-2 ring-amber-500': selectedFilter === 'pending' }"
      @click="setFilter('pending')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-amber-200">
            {{ t('approval.stats.pending') }}
          </p>
          <p class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-white mt-1">
            {{ stats?.pending || 0 }}
          </p>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    bg-amber-100 dark:bg-amber-700/60">
          <UIcon name="i-heroicons-clock" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-100" />
        </div>
      </div>
    </div>

    <!-- Approved -->
    <div
      class="rounded-xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-shadow cursor-pointer
             bg-white border-gray-200
             dark:bg-emerald-900 dark:border-emerald-700"
      :class="{ 'ring-2 ring-emerald-500': selectedFilter === 'approved' }"
      @click="setFilter('approved')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-emerald-200">
            {{ t('approval.stats.approved') }}
          </p>
          <p class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-white mt-1">
            {{ stats?.approved || 0 }}
          </p>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    bg-emerald-100 dark:bg-emerald-700/60">
          <UIcon name="i-heroicons-check-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-100" />
        </div>
      </div>
    </div>

    <!-- Rejected -->
    <div
      class="rounded-xl p-4 sm:p-5 border shadow-sm hover:shadow-md transition-shadow cursor-pointer
             bg-white border-gray-200
             dark:bg-red-900 dark:border-red-700"
      :class="{ 'ring-2 ring-red-500': selectedFilter === 'rejected' }"
      @click="setFilter('rejected')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-red-200">
            {{ t('approval.stats.rejected') }}
          </p>
          <p class="text-xl sm:text-2xl font-bold text-red-600 dark:text-white mt-1">
            {{ stats?.rejected || 0 }}
          </p>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    bg-red-100 dark:bg-red-700/60">
          <UIcon name="i-heroicons-x-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-100" />
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
