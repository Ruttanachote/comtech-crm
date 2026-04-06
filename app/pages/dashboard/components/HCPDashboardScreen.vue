<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

const { hcpData, hcpLoading, hcpRevenueData, hcpProfitData, hcpYTDSummary, hcpFinancialMetrics } = useDashboard()
const { t } = useI18n()

const revenueChartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
  colors: ['#2563eb', '#93c5fd'],
  xaxis: {
    categories: hcpRevenueData.value.map((d: any) => d.month),
    labels: { style: { fontSize: '12px', colors: '#9ca3af' } },
  },
  yaxis: { labels: { style: { fontSize: '12px', colors: '#9ca3af' } } },
  legend: { position: 'bottom' as const, fontSize: '12px' },
  grid: { borderColor: '#e5e7eb' },
  tooltip: { style: { fontSize: '12px' } },
}))

const revenueChartSeries = computed(() => [
  { name: `${t('dashboard.hcp.actual_short')} 25`, data: hcpRevenueData.value.map((d: any) => d.actual25) },
  { name: `${t('dashboard.hcp.plan_short')} 26`, data: hcpRevenueData.value.map((d: any) => d.plan26) },
])

const profitChartOptions = computed(() => ({
  chart: { type: 'line', toolbar: { show: false } },
  colors: ['#3b82f6', '#ef4444', '#22c55e'],
  xaxis: {
    categories: hcpProfitData.value.map((d: any) => d.month),
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
  { name: `${t('dashboard.hcp.actual_short')} 24`, data: hcpProfitData.value.map((d: any) => d.actual24) },
  { name: `${t('dashboard.hcp.actual_short')} 25`, data: hcpProfitData.value.map((d: any) => d.actual25) },
  { name: `${t('dashboard.hcp.plan_short')} 26`, data: hcpProfitData.value.map((d: any) => d.plan26) },
])

const colorHex: Record<string, string> = {
  blue: '#3b82f6', indigo: '#6366f1', violet: '#8b5cf6', purple: '#a855f7', pink: '#ec4899',
  orange: '#f97316', red: '#ef4444', rose: '#f43f5e',
  green: '#22c55e', emerald: '#10b981', teal: '#14b8a6', cyan: '#06b6d4',
  yellow: '#eab308', gray: '#9ca3af',
}
const getStrokeColor = (color: string) => colorHex[color] ?? '#3b82f6'
</script>

<template>
  <div v-if="hcpLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>

  <div v-else class="space-y-6">
    <!-- Status Header -->
    <div class="flex flex-col gap-3">
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 w-fit">
        {{ t('dashboard.hcp.status_label') }}: {{ hcpData?.status || '10 Feb 2026' }}
      </span>
      <h2 class="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
        {{ hcpData?.title || 'Financial Projection' }}
      </h2>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ hcpData?.description || 'Revenue is below plan as newly onboarded customers are small accounts, coupled with fewer working days in January.' }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {{ hcpData?.note || 'The net profit shown below differs from accounting figures due to prior-year bonus accrual reversals and operating expense adjustments.' }}
        </p>
      </div>
    </div>

    <!-- Main Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-sm md:text-base font-semibold text-blue-600 dark:text-blue-400 text-center mb-4">
          {{ t('dashboard.hcp.revenue_chart') }}
        </h3>
        <apexchart type="bar" height="224" :options="revenueChartOptions" :series="revenueChartSeries" />
        <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
          <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ t('dashboard.hcp.plan_short') }}: {{ hcpData?.revenueSummary?.plan }}, {{ t('dashboard.hcp.actual_short') }}: {{ hcpData?.revenueSummary?.actual }}</p>
          <p class="text-sm text-red-500 dark:text-red-400">{{ t('dashboard.hcp.lower_than_plan') }} {{ hcpData?.revenueSummary?.diff }} ({{ hcpData?.revenueSummary?.percent }})</p>
        </div>
      </div>

      <!-- Net Profit Chart -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-sm md:text-base font-semibold text-green-600 dark:text-green-400 text-center mb-4">
          {{ t('dashboard.hcp.profit_chart') }}
        </h3>
        <apexchart type="line" height="224" :options="profitChartOptions" :series="profitChartSeries" />
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <p class="text-sm font-medium text-green-600 dark:text-green-400">{{ t('dashboard.hcp.plan_short') }}: {{ hcpData?.profitSummary?.plan }}, {{ t('dashboard.hcp.actual_short') }}: {{ hcpData?.profitSummary?.actual }}</p>
          <p class="text-sm text-green-500 dark:text-green-400">{{ t('dashboard.hcp.better_than_plan') }} {{ hcpData?.profitSummary?.diff }} ({{ hcpData?.profitSummary?.percent }})</p>
        </div>
      </div>
    </div>

    <!-- YTD Summary Cards with Donut Charts -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <div
        v-for="item in hcpYTDSummary"
        :key="item.label + item.sublabel"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5 text-center shadow-sm"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ item.sublabel }}</p>
        <div class="relative w-24 h-24 mx-auto mb-3">
          <svg viewBox="0 0 36 36" class="w-full h-full">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="4" />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="getStrokeColor(item.color)"
              stroke-width="4"
              :stroke-dasharray="`${item.progress}, 100`"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-lg font-bold" :class="{
              'text-gray-600': item.color === 'gray',
              'text-blue-600': item.color === 'blue',
              'text-indigo-600': item.color === 'indigo',
              'text-violet-600': item.color === 'violet',
              'text-purple-600': item.color === 'purple',
              'text-pink-600': item.color === 'pink',
              'text-yellow-600': item.color === 'yellow',
              'text-orange-500': item.color === 'orange',
              'text-red-600': item.color === 'red',
              'text-rose-600': item.color === 'rose',
              'text-green-600': item.color === 'green' || item.color === 'emerald',
              'text-teal-600': item.color === 'teal',
              'text-cyan-600': item.color === 'cyan',
            }">{{ item.value }}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400">{{ t('dashboard.hcp.ytd_plan') }}:</p>
        <p class="text-base font-semibold text-gray-700 dark:text-gray-300">{{ item.target }}</p>
      </div>
    </div>

    <!-- Detailed Financial Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      <div
        v-for="metric in hcpFinancialMetrics"
        :key="metric.label"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center shadow-sm"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ metric.label }}</p>
        <p class="text-xl md:text-2xl font-bold" :class="{
          'text-gray-700': metric.statusColor === 'gray',
          'text-blue-600': metric.statusColor === 'blue',
          'text-indigo-600': metric.statusColor === 'indigo',
          'text-violet-600': metric.statusColor === 'violet',
          'text-purple-600': metric.statusColor === 'purple',
          'text-pink-600': metric.statusColor === 'pink',
          'text-yellow-600': metric.statusColor === 'yellow',
          'text-orange-500': metric.statusColor === 'orange',
          'text-red-600': metric.statusColor === 'red',
          'text-rose-600': metric.statusColor === 'rose',
          'text-green-600': metric.statusColor === 'green' || metric.statusColor === 'emerald',
          'text-teal-600': metric.statusColor === 'teal',
          'text-cyan-600': metric.statusColor === 'cyan',
        }">{{ metric.value }}</p>
        <div class="mt-2 space-y-0.5 text-xs text-left">
          <p class="text-gray-400">{{ t('dashboard.hcp.plan_2026') }}: {{ metric.plan2026 }}</p>
          <p class="text-gray-400">{{ t('dashboard.hcp.actual_2025') }}: {{ metric.actual2025 }}</p>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
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

    <p class="text-xs text-gray-500 dark:text-gray-500">
      {{ t('dashboard.hcp.note') }}
    </p>
  </div>
</template>
