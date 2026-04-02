<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import OverviewDashboardScreen from './OverviewDashboardScreen.vue'
import HCPDashboardScreen from './HCPDashboardScreen.vue'
import ExecutiveDashboardScreen from './ExecutiveDashboardScreen.vue'
import { useDashboard } from '~/composables/useDashboard'

const { activeTab, setTab, setTimeRange, initialize } = useDashboard()

const timeRange = ref('30')

const timeRanges = [
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
]

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'i-lucide-bar-chart-3' },
  { id: 'hcp', label: 'HCP', icon: 'i-lucide-pie-chart' },
  { id: 'executive', label: 'Executive', icon: 'i-lucide-trending-up' },
]

const activeTabData = computed(() => tabs.find(t => t.id === activeTab.value))

// Watch time range changes
watch(timeRange, (newVal) => {
  setTimeRange(newVal as '7' | '30' | '90')
})

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ activeTabData?.label === 'Overview' ? 'Business overview and key metrics' : 
             activeTabData?.label === 'HCP' ? 'Healthcare Professional Dashboard' : 
             'Executive Dashboard - Full Business Overview' }}
        </p>
      </div>
      
      <!-- Time Range Selector -->
      <USelect
        v-model="timeRange"
        :options="timeRanges"
        option-attribute="label"
        class="w-full sm:w-40"
      />
    </div>

    <!-- Custom Tabs - Matching Figma Design -->
    <div class="inline-flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="setTab(tab.id)"
        class="flex items-center gap-2 px-4 md:px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap"
        :class="[
          activeTab === tab.id
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        <UIcon :name="tab.icon" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ tab.label }}</span>
        <span class="sm:hidden">{{ tab.label.charAt(0) }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4 md:mt-6">
      <OverviewDashboardScreen v-if="activeTab === 'overview'" />
      <HCPDashboardScreen v-else-if="activeTab === 'hcp'" />
      <ExecutiveDashboardScreen v-else-if="activeTab === 'executive'" />
    </div>
  </div>
</template>
