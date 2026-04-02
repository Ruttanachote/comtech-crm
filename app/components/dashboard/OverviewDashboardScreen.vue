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

const { overviewStats, overviewProjectData, overviewRevenueData, overviewPipeline, overviewLoading } = useDashboard()

// Format numbers
const formatNumber = (num: number) => new Intl.NumberFormat('th-TH').format(num)
const formatCurrency = (num: number) => {
  if (num >= 1000000) return `฿${(num / 1000000).toFixed(0)}M`
  return `฿${formatNumber(num)}`
}
</script>

<template>
  <div v-if="overviewLoading" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  
  <div v-else class="space-y-6">
    <!-- Stats Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <!-- ISSUE Count -->
      <div class="rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4 text-center">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">ISSUE</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Count</p>
        <p class="mt-2 text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatNumber(overviewStats?.issueCount || 245) }}
        </p>
      </div>

      <!-- WIN Count -->
      <div class="rounded-xl border border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 p-4 text-center">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">WIN</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Count</p>
        <p class="mt-2 text-2xl md:text-3xl font-bold text-orange-500 dark:text-orange-400">
          {{ formatNumber(overviewStats?.winCount || 182) }}
        </p>
        <p class="text-xs mt-1 text-orange-500">(74.1%)</p>
      </div>

      <!-- ISSUE Value -->
      <div class="rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4 text-center">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">ISSUE</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Value</p>
        <p class="mt-2 text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatCurrency(overviewStats?.issueValue || 1250000000) }}
        </p>
      </div>

      <!-- WIN Value -->
      <div class="rounded-xl border border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 p-4 text-center">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">WIN</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Value</p>
        <p class="mt-2 text-2xl md:text-3xl font-bold text-orange-500 dark:text-orange-400">
          {{ formatCurrency(overviewStats?.winValue || 980000000) }}
        </p>
        <p class="text-xs mt-1 text-orange-500">(78.4%)</p>
      </div>

      <!-- Actual Revenue -->
      <div class="rounded-xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 p-4 text-center">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Actual</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Revenue</p>
        <p class="mt-2 text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatCurrency(overviewStats?.actualRevenue || 875000000) }}
        </p>
        <p class="text-xs mt-1 text-emerald-600">(89.3%)</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Number of Project Chart -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Number of Project
        </h3>
        <div class="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data="overviewProjectData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
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

      <!-- REVENUE Chart -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          REVENUE
        </h3>
        <div class="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data="overviewRevenueData" margin="{ top: 10, right: 30, left: 0, bottom: 0 }">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick="{ fontSize: 12 }" stroke="#9ca3af" />
              <YAxis tick="{ fontSize: 12 }" stroke="#9ca3af" />
              <Tooltip 
                contentStyle="{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }"
                itemStyle="{ fontSize: '12px' }"
              />
              <Legend wrapperStyle="{ fontSize: '12px', paddingTop: '10px' }" />
              <Bar dataKey="issue" name="Issue" fill="#3b82f6" radius="[2, 2, 0, 0]" barSize="15" />
              <Bar dataKey="win" name="Win" fill="#f97316" radius="[2, 2, 0, 0]" barSize="15" />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius="[2, 2, 0, 0]" barSize="15" />
              <Bar dataKey="lastYear" name="Last Year" fill="#9ca3af" radius="[2, 2, 0, 0]" barSize="15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <!-- Sales Pipeline Status -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Sales Pipeline Status
      </h3>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div
          v-for="stage in overviewPipeline"
          :key="stage.stage"
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
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stage.stage }}</p>
          <p class="mt-3 text-3xl font-bold" :class="{
            'text-gray-700 dark:text-gray-300': stage.color === 'gray',
            'text-blue-600 dark:text-blue-400': stage.color === 'blue',
            'text-yellow-600 dark:text-yellow-400': stage.color === 'yellow',
            'text-orange-500 dark:text-orange-400': stage.color === 'orange',
            'text-emerald-600 dark:text-emerald-400': stage.color === 'green',
            'text-rose-600 dark:text-rose-400': stage.color === 'red',
          }">{{ stage.count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
