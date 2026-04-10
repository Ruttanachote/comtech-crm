<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sm:p-6">
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-map" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ t('approval.detail.workflow') }}
      </h3>
      <!-- Progress pill -->
      <span class="ml-auto shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        {{ completedCount }}/{{ steps.length }} {{ t('approval.stepper.completed') }}
      </span>
    </div>

    <!-- Horizontal Stepper — scrollable on small screens -->
    <div class="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6 pb-2">
      <div class="flex items-start" :style="`min-width: ${steps.length * 110}px`">
        <template v-for="(step, index) in steps" :key="step.id">
          <!-- Step -->
          <div class="flex flex-col items-center flex-1">
            <!-- Circle with shadow -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 z-10 transition-all duration-300"
              :class="getStepCircleClass(step.status)"
            >
              <template v-if="step.status === 'completed'">
                <UIcon name="i-heroicons-check" class="w-5 h-5" />
              </template>
              <template v-else-if="step.status === 'current'">
                <span class="w-3 h-3 rounded-full bg-white" />
              </template>
              <template v-else>
                <span class="text-xs font-semibold">{{ step.order }}</span>
              </template>
            </div>

            <!-- Step name -->
            <p
              class="text-xs font-semibold text-center mt-2.5 leading-tight px-1"
              :class="getStepLabelClass(step.status)"
            >
              {{ locale === 'th' ? step.nameTh : step.name }}
            </p>

            <!-- Date / Status pill -->
            <div class="mt-1.5 px-1 text-center">
              <span
                v-if="step.completedAt"
                class="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                {{ formatDate(step.completedAt) }}
              </span>
              <span
                v-else-if="step.status === 'current'"
                class="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
              >
                {{ t('approval.stepper.inProgress') }}
              </span>
              <span
                v-else
                class="text-xs text-gray-300 dark:text-gray-600"
              >
                {{ t('approval.stepper.pending') }}
              </span>
            </div>
          </div>

          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            class="h-0.5 mt-5 mx-1 flex-1 rounded-full transition-all duration-300"
            :class="step.status === 'completed'
              ? 'bg-linear-to-r from-emerald-400 to-emerald-300 dark:from-emerald-500 dark:to-emerald-600'
              : 'bg-gray-200 dark:bg-gray-600'"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowStep } from '~/types/approval.type'

interface Props {
  steps: WorkflowStep[]
}

const props = defineProps<Props>()

const { t, locale } = useI18n()

const completedCount = computed(() => props.steps.filter(s => s.status === 'completed').length)

function getStepCircleClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40'
    case 'current':
      return 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40 ring-4 ring-blue-100 dark:ring-blue-900/30'
    default:
      return 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-500 text-gray-400 dark:text-gray-500'
  }
}

function getStepLabelClass(status: string): string {
  switch (status) {
    case 'completed': return 'text-emerald-600 dark:text-emerald-400'
    case 'current': return 'text-blue-600 dark:text-blue-400'
    default: return 'text-gray-400 dark:text-gray-500'
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}
</script>
