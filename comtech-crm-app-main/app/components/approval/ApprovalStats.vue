<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
    <!-- All -->
    <button
      class="relative flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-200 text-left"
      :class="[
        filters.status === 'all' 
          ? 'border-primary-500 shadow-md ring-1 ring-primary-500/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      ]"
      @click="setStatusFilter('all')"
    >
      <div 
        class="flex items-center justify-center w-10 h-10 rounded-lg"
        :class="filters.status === 'all' ? 'bg-primary-50' : 'bg-gray-50'"
      >
        <UIcon 
          name="i-heroicons-document-text" 
          class="w-5 h-5"
          :class="filters.status === 'all' ? 'text-primary-600' : 'text-gray-500'"
        />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">{{ t('approval.stats.all') }}</p>
        <p 
          class="text-xl font-bold"
          :class="filters.status === 'all' ? 'text-primary-600' : 'text-gray-900'"
        >
          {{ stats.all }}
        </p>
      </div>
      <div 
        v-if="filters.status === 'all'"
        class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500"
      />
    </button>

    <!-- Pending -->
    <button
      class="relative flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-200 text-left"
      :class="[
        filters.status === 'pending' 
          ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      ]"
      @click="setStatusFilter('pending')"
    >
      <div 
        class="flex items-center justify-center w-10 h-10 rounded-lg"
        :class="filters.status === 'pending' ? 'bg-amber-50' : 'bg-gray-50'"
      >
        <UIcon 
          name="i-heroicons-clock" 
          class="w-5 h-5"
          :class="filters.status === 'pending' ? 'text-amber-600' : 'text-gray-500'"
        />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">{{ t('approval.stats.pending') }}</p>
        <p 
          class="text-xl font-bold"
          :class="filters.status === 'pending' ? 'text-amber-600' : 'text-gray-900'"
        >
          {{ stats.pending }}
        </p>
      </div>
      <div 
        v-if="filters.status === 'pending'"
        class="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"
      />
    </button>

    <!-- Approved -->
    <button
      class="relative flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-200 text-left"
      :class="[
        filters.status === 'approved' 
          ? 'border-green-500 shadow-md ring-1 ring-green-500/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      ]"
      @click="setStatusFilter('approved')"
    >
      <div 
        class="flex items-center justify-center w-10 h-10 rounded-lg"
        :class="filters.status === 'approved' ? 'bg-green-50' : 'bg-gray-50'"
      >
        <UIcon 
          name="i-heroicons-check-circle" 
          class="w-5 h-5"
          :class="filters.status === 'approved' ? 'text-green-600' : 'text-gray-500'"
        />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">{{ t('approval.stats.approved') }}</p>
        <p 
          class="text-xl font-bold"
          :class="filters.status === 'approved' ? 'text-green-600' : 'text-gray-900'"
        >
          {{ stats.approved }}
        </p>
      </div>
      <div 
        v-if="filters.status === 'approved'"
        class="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500"
      />
    </button>

    <!-- Rejected -->
    <button
      class="relative flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-200 text-left"
      :class="[
        filters.status === 'rejected' 
          ? 'border-red-500 shadow-md ring-1 ring-red-500/20' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      ]"
      @click="setStatusFilter('rejected')"
    >
      <div 
        class="flex items-center justify-center w-10 h-10 rounded-lg"
        :class="filters.status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'"
      >
        <UIcon 
          name="i-heroicons-x-circle" 
          class="w-5 h-5"
          :class="filters.status === 'rejected' ? 'text-red-600' : 'text-gray-500'"
        />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">{{ t('approval.stats.rejected') }}</p>
        <p 
          class="text-xl font-bold"
          :class="filters.status === 'rejected' ? 'text-red-600' : 'text-gray-900'"
        >
          {{ stats.rejected }}
        </p>
      </div>
      <div 
        v-if="filters.status === 'rejected'"
        class="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalStats, ApprovalStatus } from '~/types/approval.type'

interface Props {
  stats: ApprovalStats
  filters: {
    status: ApprovalStatus
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: { status: ApprovalStatus }]
}>()

const { t } = useI18n()

const setStatusFilter = (status: ApprovalStatus) => {
  emit('update:filters', { ...props.filters, status })
}
</script>
