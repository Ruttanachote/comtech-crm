<script setup lang="ts">
import OverviewDashboardScreen from './OverviewDashboardScreen.vue'
import HCPDashboardScreen from './HCPDashboardScreen.vue'
import ExecutiveDashboardScreen from './ExecutiveDashboardScreen.vue'
import type { DashboardTab } from '~/types/dashboard'

const { activeTab, setTab, setTimeRange, initialize } = useDashboard()
const { t, locale, setLocale } = useI18n()

const timeRange = ref<'7' | '30' | '90'>('30')

const timeRanges = computed(() => [
  { label: t('dashboard.time_range.last_7_days'), value: '7' as const },
  { label: t('dashboard.time_range.last_30_days'), value: '30' as const },
  { label: t('dashboard.time_range.last_90_days'), value: '90' as const },
])

const tabs = computed<{ id: DashboardTab; label: string; icon: string }[]>(() => [
  { id: 'overview', label: t('dashboard.tabs.overview'), icon: 'i-lucide-bar-chart-3' },
  { id: 'hcp', label: t('dashboard.tabs.hcp'), icon: 'i-lucide-pie-chart' },
  { id: 'executive', label: t('dashboard.tabs.executive'), icon: 'i-lucide-trending-up' },
])

const subtitle = computed(() => {
  switch (activeTab.value) {
    case 'overview': return t('dashboard.subtitles.overview')
    case 'hcp': return t('dashboard.subtitles.hcp')
    case 'executive': return t('dashboard.subtitles.executive')
    default: return ''
  }
})

watch(timeRange, (val) => setTimeRange(val))

onMounted(() => initialize())
</script>

<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('dashboard.title') }}
        </h1>
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ subtitle }}
        </p>
      </div>

      <!-- Controls: Language + Time Range -->
      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <!-- Language Toggle -->
        <!-- <div class="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5 gap-0.5">
          <button
            @click="setLocale('en')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
            :class="locale === 'en'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'"
          >
            {{ t('dashboard.lang.en') }}
          </button>
          <button
            @click="setLocale('th')"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
            :class="locale === 'th'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'"
          >
            {{ t('dashboard.lang.th') }}
          </button>
        </div> -->

        <!-- Time Range Selector -->
        <div class="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5 gap-0.5">
          <button
            v-for="option in timeRanges"
            :key="option.value"
            @click="timeRange = option.value"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap"
            :class="timeRange === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Tabs -->
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
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div>
      <OverviewDashboardScreen v-if="activeTab === 'overview'" />
      <HCPDashboardScreen v-else-if="activeTab === 'hcp'" />
      <ExecutiveDashboardScreen v-else-if="activeTab === 'executive'" />
    </div>
  </div>
</template>
