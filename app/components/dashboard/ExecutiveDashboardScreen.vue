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

const { 
  executiveData, 
  executiveLoading, 
  executiveKPICards, 
  executiveDealsData, 
  executiveRevenueData,
  executiveProfitTrend,
  executiveAchievement,
  executivePipeline,
  executiveMetrics 
} = useDashboard()
</script>

<template>
  <div v-if="executiveLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  
  <div v-else class="space-y-6">
    <!-- Last Updated & Badge -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 w-fit">
        Executive Dashboard - Full Business Overview
      </span>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Last Updated: {{ executiveData?.lastUpdated || '20 Feb 2026' }}
      </p>
    </div>

    <!-- Key Performance Indicators -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">
        Key Performance Indicators
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div
          v-for="kpi in executiveKPICards"
          :key="kpi.label + kpi.sublabel"
          class="rounded-xl border p-3 text-center"
          :class="{
            'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800': kpi.color === 'blue',
            'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800': kpi.color === 'orange',
            'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800': kpi.color === 'green',
            'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800': kpi.color === 'red',
          }"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ kpi.sublabel }}</p>
          <p class="mt-1 text-lg md:text-xl font-bold" :class="{
            'text-blue-600 dark:text-blue-400': kpi.color === 'blue',
            'text-orange-500 dark:text-orange-400': kpi.color === 'orange',
            'text-emerald-600 dark:text-emerald-400': kpi.color === 'green',
            'text-rose-600 dark:text-rose-400': kpi.color === 'red',
          }">{{ kpi.value }}</p>
          <p v-if="kpi.subtext" class="text-xs text-gray-500">{{ kpi.subtext }}</p>
        </div>
      </div>
    </div>

    <!-- Sales & Revenue Analysis -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">
        Sales & Revenue Analysis
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Number of Deals -->
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Number of Deals</h4>
          <div class="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data="executiveDealsData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick="{ fontSize: 12 }" stroke="#9ca3af" />
                <YAxis tick="{ fontSize: 12 }" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle="{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }"
                  itemStyle="{ fontSize: '12px' }"
                />
                <Legend wrapperStyle="{ fontSize: '12px', paddingTop: '10px' }" />
                <Bar dataKey="issue" name="Issue" fill="#3b82f6" radius="[4, 4, 0, 0]" />
                <Bar dataKey="win" name="Win" fill="#f97316" radius="[4, 4, 0, 0]" />
                <Line type="monotone" dataKey="lastYear" name="Last Year" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 5" dot="{ r: 3 }" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <!-- Revenue (Actual vs Plan) -->
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Revenue (Actual vs Plan)</h4>
          <div class="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data="executiveRevenueData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick="{ fontSize: 12 }" stroke="#9ca3af" />
                <YAxis tick="{ fontSize: 12 }" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle="{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }"
                  itemStyle="{ fontSize: '12px' }"
                />
                <Legend wrapperStyle="{ fontSize: '12px', paddingTop: '10px' }" />
                <Bar dataKey="actual25" name="Actual 25" fill="#3b82f6" radius="[2, 2, 0, 0]" barSize="12" />
                <Bar dataKey="plan26" name="Plan 26" fill="#93c5fd" radius="[2, 2, 0, 0]" barSize="12" />
                <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#ef4444" strokeWidth="2" dot="{ r: 3 }" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <!-- Summary -->
          <div class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <p class="text-xs md:text-sm text-red-600 dark:text-red-400">Actual: 10.4 MB vs Plan: 11.8 MB</p>
            <p class="text-xs text-red-500 dark:text-red-400">⚠️ Below Plan by 1.4 MB (12%)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profitability Analysis -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">
        Profitability Analysis
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Net Profit Trend -->
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Net Profit Trend</h4>
          <div class="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data="executiveProfitTrend" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
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
          <div class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <p class="text-xs md:text-sm text-green-600 dark:text-green-400">Actual: 0.2 MB vs Plan: 0.1 MB</p>
            <p class="text-xs text-green-500 dark:text-green-400">✅ Above Plan by 0.1 MB (100%)</p>
          </div>
        </div>

        <!-- Achievement Progress (YTD) -->
        <div>
          <h4 class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Achievement Progress (YTD)</h4>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="item in executiveAchievement" :key="item.label" class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ item.label }}</p>
              <!-- Donut Chart -->
              <div class="relative w-20 h-20 mx-auto">
                <svg viewBox="0 0 36 36" class="w-full h-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="4" />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    :stroke="item.color === 'blue' ? '#3b82f6' : item.color === 'orange' ? '#f97316' : '#22c55e'"
                    stroke-width="4"
                    :stroke-dasharray="`${Math.min(item.progress, 100) * 0.6}, 100`"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300">{{ item.progress }}%</span>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-2">Target: {{ item.target }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Pipeline Status -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">
        Sales Pipeline Status
      </h3>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div
          v-for="stage in executivePipeline"
          :key="stage.name"
          class="rounded-xl border p-4 text-center"
          :class="{
            'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700': stage.color === 'gray',
            'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800': stage.color === 'blue',
            'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800': stage.color === 'yellow',
            'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800': stage.color === 'orange',
            'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800': stage.color === 'green',
            'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800': stage.color === 'red',
          }"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ stage.name }}</p>
          <p class="text-2xl md:text-3xl font-bold" :class="{
            'text-gray-700 dark:text-gray-300': stage.color === 'gray',
            'text-blue-600 dark:text-blue-400': stage.color === 'blue',
            'text-yellow-600 dark:text-yellow-400': stage.color === 'yellow',
            'text-orange-500 dark:text-orange-400': stage.color === 'orange',
            'text-emerald-600 dark:text-emerald-400': stage.color === 'green',
            'text-rose-600 dark:text-rose-400': stage.color === 'red',
          }">{{ stage.count }}</p>
          <p v-if="stage.rate" class="text-xs mt-1 text-gray-400">→ {{ stage.rate }}</p>
        </div>
      </div>
    </div>

    <!-- Detailed Financial Metrics -->
    <div>
      <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-4">
        Detailed Financial Metrics
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="metric in executiveMetrics"
          :key="metric.label"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ metric.label }}</p>
          <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
          <div class="mt-2 space-y-0.5 text-xs">
            <p class="text-gray-400">Plan 2026: {{ metric.plan2026 }}</p>
            <p class="text-gray-400">Actual 2025: {{ metric.actual2025 }}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
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
    </div>
  </div>
</template>
