<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

const { overviewStats, overviewProjectData, overviewRevenueData, overviewPipeline, overviewLoading } = useDashboard()
const { t } = useI18n()

const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num)
const formatCurrency = (num: number) => {
  if (num >= 1000000) return `฿${(num / 1000000).toFixed(0)}M`
  return `฿${formatNumber(num)}`
}

const projectChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
  colors: ['#3b82f6', '#f97316', '#a855f7'],
  xaxis: {
    categories: overviewProjectData.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: [
    { seriesName: 'Issue', labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
    { seriesName: 'Issue', show: false },
    { opposite: true, seriesName: 'Last Year', labels: { style: { fontSize: '12px', colors: '#a855f7' } } },
  ],
  stroke: { width: [0, 0, 2], dashArray: [0, 0, 5], curve: 'smooth' as const },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const projectChartSeries = computed(() => [
  { name: t('dashboard.overview.issue'), type: 'bar', data: overviewProjectData.value.map((d: any) => d.issue) },
  { name: t('dashboard.overview.win'), type: 'bar', data: overviewProjectData.value.map((d: any) => d.win) },
  { name: t('dashboard.overview.last_year'), type: 'line', data: overviewProjectData.value.map((d: any) => d.lastYear) },
])

const revenueChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 2, columnWidth: '70%' } },
  colors: ['#3b82f6', '#f97316', '#10b981', '#9ca3af'],
  xaxis: {
    categories: overviewRevenueData.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: { labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const revenueChartSeries = computed(() => [
  { name: t('dashboard.overview.issue'), data: overviewRevenueData.value.map((d: any) => d.issue) },
  { name: t('dashboard.overview.win'), data: overviewRevenueData.value.map((d: any) => d.win) },
  { name: t('dashboard.overview.actual'), data: overviewRevenueData.value.map((d: any) => d.actual) },
  { name: t('dashboard.overview.last_year'), data: overviewRevenueData.value.map((d: any) => d.lastYear) },
])
</script>

<template>
  <div v-if="overviewLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>

  <div v-else class="space-y-6">
    <!-- Stats Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
      <div class="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-800 p-4 md:p-5 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-400 dark:text-blue-500">{{ t('dashboard.overview.issue_count') }}</p>
        <p class="mt-3 text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatNumber(overviewStats?.issueCount ?? 245) }}
        </p>
      </div>
      <div class="rounded-2xl border border-orange-100 bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 dark:border-orange-800 p-4 md:p-5 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-orange-400 dark:text-orange-500">{{ t('dashboard.overview.win_count') }}</p>
        <p class="mt-3 text-2xl md:text-3xl font-bold text-orange-500 dark:text-orange-400">
          {{ formatNumber(overviewStats?.winCount ?? 182) }}
        </p>
        <p class="text-xs mt-1.5 font-medium text-orange-400">({{ overviewStats?.winCountPercent ?? 0 }}%)</p>
      </div>
      <div class="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-800 p-4 md:p-5 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-400 dark:text-blue-500">{{ t('dashboard.overview.issue_value') }}</p>
        <p class="mt-3 text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatCurrency(overviewStats?.issueValue ?? 1250000000) }}
        </p>
      </div>
      <div class="rounded-2xl border border-orange-100 bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 dark:border-orange-800 p-4 md:p-5 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-orange-400 dark:text-orange-500">{{ t('dashboard.overview.win_value') }}</p>
        <p class="mt-3 text-xl md:text-2xl font-bold text-orange-500 dark:text-orange-400">
          {{ formatCurrency(overviewStats?.winValue ?? 980000000) }}
        </p>
        <p class="text-xs mt-1.5 font-medium text-orange-400">({{ overviewStats?.winValuePercent ?? 0 }}%)</p>
      </div>
      <div class="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 dark:border-emerald-800 p-4 md:p-5 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-500 dark:text-emerald-500">{{ t('dashboard.overview.actual_revenue') }}</p>
        <p class="mt-3 text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatCurrency(overviewStats?.actualRevenue ?? 875000000) }}
        </p>
        <p class="text-xs mt-1.5 font-medium text-emerald-500">({{ overviewStats?.actualRevenuePercent ?? 0 }}%)</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.overview.number_of_project') }}</h3>
        <apexchart type="bar" height="256" :options="projectChartOptions" :series="projectChartSeries" />
      </div>
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.overview.revenue') }}</h3>
        <apexchart type="bar" height="256" :options="revenueChartOptions" :series="revenueChartSeries" />
      </div>
    </div>

    <!-- Sales Pipeline Status -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.overview.sales_pipeline') }}</h3>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div
          v-for="stage in overviewPipeline"
          :key="stage.stage"
          class="rounded-xl border p-4 text-center"
          :class="{
            'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700': stage.color === 'gray',
            'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800': stage.color === 'blue',
            'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800': stage.color === 'indigo',
            'bg-violet-50 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800': stage.color === 'violet',
            'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800': stage.color === 'purple',
            'bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-800': stage.color === 'pink',
            'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800': stage.color === 'yellow',
            'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800': stage.color === 'orange',
            'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800': stage.color === 'red',
            'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800': stage.color === 'rose',
            'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800': stage.color === 'green' || stage.color === 'emerald',
            'bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800': stage.color === 'teal',
            'bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800': stage.color === 'cyan',
          }"
        >
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stage.stage }}</p>
          <p class="mt-3 text-3xl font-bold" :class="{
            'text-gray-700 dark:text-gray-300': stage.color === 'gray',
            'text-blue-600 dark:text-blue-400': stage.color === 'blue',
            'text-indigo-600 dark:text-indigo-400': stage.color === 'indigo',
            'text-violet-600 dark:text-violet-400': stage.color === 'violet',
            'text-purple-600 dark:text-purple-400': stage.color === 'purple',
            'text-pink-600 dark:text-pink-400': stage.color === 'pink',
            'text-yellow-600 dark:text-yellow-400': stage.color === 'yellow',
            'text-orange-500 dark:text-orange-400': stage.color === 'orange',
            'text-red-600 dark:text-red-400': stage.color === 'red',
            'text-rose-600 dark:text-rose-400': stage.color === 'rose',
            'text-emerald-600 dark:text-emerald-400': stage.color === 'green' || stage.color === 'emerald',
            'text-teal-600 dark:text-teal-400': stage.color === 'teal',
            'text-cyan-600 dark:text-cyan-400': stage.color === 'cyan',
          }">{{ stage.count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
