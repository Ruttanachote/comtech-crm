<script setup lang="ts">
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts'
import { useDashboard } from '~/composables/useDashboard'

const { hcpData, hcpLoading, hcpRevenueData, hcpProfitData, hcpYTDSummary, hcpFinancialMetrics } = useDashboard()
</script>

<template>
  <div v-if="hcpLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  
  <div v-else class="space-y-6">
    <!-- Status Header -->
    <div class="flex flex-col gap-3">
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 w-fit">
        Status: {{ hcpData?.status || '10 Feb 2026' }}
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
          Revenue (MB)
        </h3>
        <div class="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data="hcpRevenueData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick="{ fontSize: 12 }" stroke="#9ca3af" />
              <YAxis tick="{ fontSize: 12 }" stroke="#9ca3af" />
              <Tooltip 
                contentStyle="{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }"
                itemStyle="{ fontSize: '12px' }"
              />
              <Legend wrapperStyle="{ fontSize: '12px', paddingTop: '10px' }" />
              <Bar dataKey="actual25" name="Actual 25" fill="#2563eb" radius="[4, 4, 0, 0]" />
              <Bar dataKey="plan26" name="Plan 26" fill="#93c5fd" radius="[4, 4, 0, 0]" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <!-- Summary -->
        <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
          <p class="text-sm font-medium text-red-600 dark:text-red-400">P: 18 MB, A: 10.4 MB</p>
          <p class="text-sm text-red-500 dark:text-red-400">Lower than plan (1.45) MB (12%)</p>
        </div>
      </div>

      <!-- Net Profit Chart -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-sm md:text-base font-semibold text-green-600 dark:text-green-400 text-center mb-4">
          Net Profit (MB)
        </h3>
        <div class="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data="hcpProfitData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick="{ fontSize: 12 }" stroke="#9ca3af" />
              <YAxis tick="{ fontSize: 12 }" stroke="#9ca3af" domain="[-1, 1]" />
              <Tooltip 
                contentStyle="{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }"
                itemStyle="{ fontSize: '12px' }"
              />
              <Legend wrapperStyle="{ fontSize: '12px', paddingTop: '10px' }" />
              <Line type="monotone" dataKey="actual24" name="Actual 24" stroke="#3b82f6" strokeWidth="2" dot="{ r: 3 }" />
              <Line type="monotone" dataKey="actual25" name="Actual 25" stroke="#ef4444" strokeWidth="2" dot="{ r: 3 }" />
              <Line type="monotone" dataKey="plan26" name="Plan 26" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 5" dot="{ r: 3 }" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <!-- Summary -->
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <p class="text-sm font-medium text-green-600 dark:text-green-400">P: 0.1 MB, A: 0.2 MB</p>
          <p class="text-sm text-green-500 dark:text-green-400">Better than plan 0.05 MB (33%)</p>
        </div>
      </div>
    </div>

    <!-- YTD Summary Cards with Donut Charts -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="item in hcpYTDSummary"
        :key="item.label + item.sublabel"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ item.sublabel }}</p>
        <!-- Donut Chart -->
        <div class="relative w-24 h-24 mx-auto mb-3">
          <svg viewBox="0 0 36 36" class="w-full h-full">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="4" />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="item.color === 'blue' ? '#3b82f6' : item.color === 'orange' ? '#f97316' : '#22c55e'"
              stroke-width="4"
              :stroke-dasharray="`${item.progress}, 100`"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-lg font-bold" :class="{
              'text-blue-600': item.color === 'blue',
              'text-orange-500': item.color === 'orange',
              'text-green-600': item.color === 'green',
            }">{{ item.value }}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400">YTD Plan 2025:</p>
        <p class="text-base font-semibold text-gray-700 dark:text-gray-300">{{ item.target }}</p>
      </div>
    </div>

    <!-- Detailed Financial Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div
        v-for="metric in hcpFinancialMetrics"
        :key="metric.label"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ metric.label }}</p>
        <p class="text-xl md:text-2xl font-bold" :class="{
          'text-blue-600': metric.statusColor === 'blue',
          'text-green-600': metric.statusColor === 'green',
          'text-red-600': metric.statusColor === 'red',
        }">{{ metric.value }}</p>
        <div class="mt-2 space-y-0.5 text-xs text-left">
          <p class="text-gray-400">Plan 2026: {{ metric.plan2026 }}</p>
          <p class="text-gray-400">Actual 2025: {{ metric.actual2025 }}</p>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span class="text-xs" :class="{
            'text-red-500': metric.statusColor === 'red',
            'text-green-500': metric.statusColor === 'green',
            'text-blue-500': metric.statusColor === 'blue',
          }">{{ metric.change }}</span>
          <span class="px-2 py-0.5 rounded text-xs font-medium" :class="{
            'bg-red-100 text-red-700': metric.statusColor === 'red',
            'bg-green-100 text-green-700': metric.statusColor === 'green',
            'bg-blue-100 text-blue-700': metric.statusColor === 'blue',
          }">{{ metric.status }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Note -->
    <p class="text-xs text-gray-500 dark:text-gray-500">
      *2026 figure is deviated from the system budget due to BIM Allocation (2MiB/year) & not including estimated headcount increased (approx. 150MB/year)
    </p>
  </div>
</template>
