<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

const {
  executiveData,
  executiveLoading,
  executiveKPICards,
  executiveDealsData,
  executiveRevenueData,
  executiveProfitTrend,
  executiveAchievement,
  executivePipeline,
  executiveMetrics,
} = useDashboard()

const dealsChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
  colors: ['#3b82f6', '#f97316', '#a855f7'],
  xaxis: {
    categories: executiveDealsData.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: [
    { seriesName: t('dashboard.overview.issue'), labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
    { seriesName: t('dashboard.overview.issue'), show: false },
    { opposite: true, seriesName: t('dashboard.overview.last_year'), labels: { style: { fontSize: '12px', colors: '#a855f7' } } },
  ],
  stroke: { width: [0, 0, 2], dashArray: [0, 0, 5], curve: 'smooth' as const },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const dealsChartSeries = computed(() => [
  { name: t('dashboard.overview.issue'), type: 'bar', data: executiveDealsData.value.map((d: any) => d.issue) },
  { name: t('dashboard.overview.win'), type: 'bar', data: executiveDealsData.value.map((d: any) => d.win) },
  { name: t('dashboard.overview.last_year'), type: 'line', data: executiveDealsData.value.map((d: any) => d.lastYear) },
])

const revenueChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 2, columnWidth: '55%' } },
  colors: ['#3b82f6', '#93c5fd', '#ef4444'],
  xaxis: {
    categories: executiveRevenueData.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: [
    { seriesName: t('dashboard.executive.actual_25'), labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
    { seriesName: t('dashboard.executive.actual_25'), show: false },
    { opposite: true, seriesName: t('dashboard.executive.cumulative'), labels: { style: { fontSize: '12px', colors: '#ef4444' } } },
  ],
  stroke: { width: [0, 0, 2], curve: 'smooth' as const },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const revenueChartSeries = computed(() => [
  { name: t('dashboard.executive.actual_25'), type: 'bar', data: executiveRevenueData.value.map((d: any) => d.actual25) },
  { name: t('dashboard.executive.plan_26'), type: 'bar', data: executiveRevenueData.value.map((d: any) => d.plan26) },
  { name: t('dashboard.executive.cumulative'), type: 'line', data: executiveRevenueData.value.map((d: any) => d.cumulative) },
])

const profitChartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false } },
  colors: ['#3b82f6', '#ef4444', '#22c55e'],
  xaxis: {
    categories: executiveProfitTrend.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: { labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
  stroke: { width: 2, curve: 'smooth' as const, dashArray: [0, 0, 5] },
  markers: { size: 3 },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const profitChartSeries = computed(() => [
  { name: t('dashboard.executive.actual_24'), data: executiveProfitTrend.value.map((d: any) => d.actual24) },
  { name: t('dashboard.executive.actual_25'), data: executiveProfitTrend.value.map((d: any) => d.actual25) },
  { name: t('dashboard.executive.plan_26'), data: executiveProfitTrend.value.map((d: any) => d.plan26) },
])

const { t } = useI18n()

const colorHex: Record<string, string> = {
  blue: '#3b82f6', indigo: '#6366f1', violet: '#8b5cf6', purple: '#a855f7', pink: '#ec4899',
  orange: '#f97316', red: '#ef4444', rose: '#f43f5e',
  green: '#22c55e', emerald: '#10b981', teal: '#14b8a6', cyan: '#06b6d4',
  yellow: '#eab308', gray: '#9ca3af',
}
const getStrokeColor = (color: string) => colorHex[color] ?? '#3b82f6'
</script>

<template>
  <div v-if="executiveLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>

  <div v-else class="space-y-6">
    <!-- Last Updated & Badge -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 w-fit">
        {{ t('dashboard.executive.badge') }}
      </span>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ t('dashboard.executive.last_updated') }}: {{ executiveData?.lastUpdated || '20 Feb 2026' }}
      </p>
    </div>

    <!-- Key Performance Indicators -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.executive.kpi_title') }}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        <div
          v-for="kpi in executiveKPICards"
          :key="kpi.label + kpi.sublabel"
          class="rounded-2xl border p-3 md:p-4 text-center shadow-sm"
          :class="{
            'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700': kpi.color === 'gray',
            'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800': kpi.color === 'blue',
            'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800': kpi.color === 'indigo',
            'bg-violet-50 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800': kpi.color === 'violet',
            'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800': kpi.color === 'purple',
            'bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-800': kpi.color === 'pink',
            'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800': kpi.color === 'yellow',
            'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800': kpi.color === 'orange',
            'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800': kpi.color === 'red',
            'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800': kpi.color === 'rose',
            'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800': kpi.color === 'green' || kpi.color === 'emerald',
            'bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800': kpi.color === 'teal',
            'bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800': kpi.color === 'cyan',
          }"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ kpi.sublabel }}</p>
          <p class="mt-1 text-lg md:text-xl font-bold" :class="{
            'text-gray-700 dark:text-gray-300': kpi.color === 'gray',
            'text-blue-600 dark:text-blue-400': kpi.color === 'blue',
            'text-indigo-600 dark:text-indigo-400': kpi.color === 'indigo',
            'text-violet-600 dark:text-violet-400': kpi.color === 'violet',
            'text-purple-600 dark:text-purple-400': kpi.color === 'purple',
            'text-pink-600 dark:text-pink-400': kpi.color === 'pink',
            'text-yellow-600 dark:text-yellow-400': kpi.color === 'yellow',
            'text-orange-500 dark:text-orange-400': kpi.color === 'orange',
            'text-red-600 dark:text-red-400': kpi.color === 'red',
            'text-rose-600 dark:text-rose-400': kpi.color === 'rose',
            'text-emerald-600 dark:text-emerald-400': kpi.color === 'green' || kpi.color === 'emerald',
            'text-teal-600 dark:text-teal-400': kpi.color === 'teal',
            'text-cyan-600 dark:text-cyan-400': kpi.color === 'cyan',
          }">{{ kpi.value }}</p>
          <p v-if="kpi.subtext" class="text-xs text-gray-500">{{ kpi.subtext }}</p>
        </div>
      </div>
    </div>

    <!-- Sales & Revenue Analysis -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.executive.sales_revenue') }}</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{{ t('dashboard.executive.number_of_deals') }}</h4>
          <apexchart type="bar" height="224" :options="dealsChartOptions" :series="dealsChartSeries" />
        </div>
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{{ t('dashboard.executive.revenue_vs_plan') }}</h4>
          <apexchart type="bar" height="224" :options="revenueChartOptions" :series="revenueChartSeries" />
          <div class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <p class="text-xs md:text-sm text-red-600 dark:text-red-400">{{ t('dashboard.executive.actual') }}: {{ executiveData?.revenueSummary?.actual }} vs {{ t('dashboard.executive.plan') }}: {{ executiveData?.revenueSummary?.plan }}</p>
            <p class="text-xs text-red-500 dark:text-red-400">{{ t('dashboard.executive.below_plan') }} {{ executiveData?.revenueSummary?.diff }} ({{ executiveData?.revenueSummary?.percent }})</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profitability Analysis -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.executive.profitability') }}</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{{ t('dashboard.executive.profit_trend') }}</h4>
          <apexchart type="line" height="224" :options="profitChartOptions" :series="profitChartSeries" />
          <div class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <p class="text-xs md:text-sm text-green-600 dark:text-green-400">{{ t('dashboard.executive.actual') }}: {{ executiveData?.profitSummary?.actual }} vs {{ t('dashboard.executive.plan') }}: {{ executiveData?.profitSummary?.plan }}</p>
            <p class="text-xs text-green-500 dark:text-green-400">{{ t('dashboard.executive.above_plan') }} {{ executiveData?.profitSummary?.diff }} ({{ executiveData?.profitSummary?.percent }})</p>
          </div>
        </div>
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{{ t('dashboard.executive.achievement') }}</h4>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="item in executiveAchievement" :key="item.label" class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ item.label }}</p>
              <div class="relative w-20 h-20 mx-auto">
                <svg viewBox="0 0 36 36" class="w-full h-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="4" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    :stroke="getStrokeColor(item.color)"
                    stroke-width="4"
                    :stroke-dasharray="`${Math.min(item.progress, 100)}, 100`"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300">{{ item.progress }}%</span>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-2">{{ t('dashboard.executive.target') }}: {{ item.target }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Pipeline Status -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.executive.pipeline_title') }}</h3>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
        <div
          v-for="stage in executivePipeline"
          :key="stage.name"
          class="rounded-2xl border p-3 md:p-4 text-center shadow-sm"
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
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ stage.name }}</p>
          <p class="text-2xl md:text-3xl font-bold" :class="{
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
          <p v-if="stage.rate" class="text-xs mt-1 text-gray-400">{{ stage.rate }}</p>
        </div>
      </div>
    </div>

    <!-- Detailed Financial Metrics -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.executive.financial_metrics') }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="metric in executiveMetrics"
          :key="metric.label"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ metric.label }}</p>
          <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
          <div class="mt-2 space-y-0.5 text-xs">
            <p class="text-gray-400">{{ t('dashboard.executive.plan_2026') }}: {{ metric.plan2026 }}</p>
            <p class="text-gray-400">{{ t('dashboard.executive.actual_2025') }}: {{ metric.actual2025 }}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span class="text-xs" :class="{
              'text-gray-500': metric.statusColor === 'gray',
              'text-blue-500': metric.statusColor === 'blue',
              'text-indigo-500': metric.statusColor === 'indigo',
              'text-violet-500': metric.statusColor === 'violet',
              'text-purple-500': metric.statusColor === 'purple',
              'text-pink-500': metric.statusColor === 'pink',
              'text-yellow-500': metric.statusColor === 'yellow',
              'text-orange-500': metric.statusColor === 'orange',
              'text-red-500': metric.statusColor === 'red',
              'text-rose-500': metric.statusColor === 'rose',
              'text-green-500': metric.statusColor === 'green' || metric.statusColor === 'emerald',
              'text-teal-500': metric.statusColor === 'teal',
              'text-cyan-500': metric.statusColor === 'cyan',
            }">{{ metric.change }}</span>
            <span class="px-2 py-0.5 rounded text-xs font-medium" :class="{
              'bg-gray-100 text-gray-700': metric.statusColor === 'gray',
              'bg-blue-100 text-blue-700': metric.statusColor === 'blue',
              'bg-indigo-100 text-indigo-700': metric.statusColor === 'indigo',
              'bg-violet-100 text-violet-700': metric.statusColor === 'violet',
              'bg-purple-100 text-purple-700': metric.statusColor === 'purple',
              'bg-pink-100 text-pink-700': metric.statusColor === 'pink',
              'bg-yellow-100 text-yellow-700': metric.statusColor === 'yellow',
              'bg-orange-100 text-orange-700': metric.statusColor === 'orange',
              'bg-red-100 text-red-700': metric.statusColor === 'red',
              'bg-rose-100 text-rose-700': metric.statusColor === 'rose',
              'bg-green-100 text-green-700': metric.statusColor === 'green' || metric.statusColor === 'emerald',
              'bg-teal-100 text-teal-700': metric.statusColor === 'teal',
              'bg-cyan-100 text-cyan-700': metric.statusColor === 'cyan',
            }">{{ metric.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
