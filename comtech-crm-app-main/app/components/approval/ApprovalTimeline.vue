<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">
      {{ t('approval.detail.workflow') }}
    </h3>

    <div class="relative">
      <!-- Vertical Line -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <!-- Steps -->
      <div class="space-y-6">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="relative flex items-start gap-4"
        >
          <!-- Step Indicator -->
          <div
            class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2"
            :class="getStepIndicatorClass(step.status)"
          >
            <template v-if="step.status === 'completed'">
              <UIcon name="i-heroicons-check" class="w-4 h-4" />
            </template>
            <template v-else-if="step.status === 'current'">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </template>
            <template v-else>
              <span class="text-xs">{{ step.order }}</span>
            </template>
          </div>

          <!-- Step Content -->
          <div class="flex-1 pt-1">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="font-medium"
                  :class="getStepTitleClass(step.status)"
                >
                  {{ locale === 'th' ? step.nameTh : step.name }}
                </p>
                <p v-if="step.completedAt" class="text-sm text-gray-500 mt-0.5">
                  {{ formatDateTime(step.completedAt) }}
                </p>
                <p v-else-if="step.status === 'current'" class="text-sm text-amber-600 mt-0.5">
                  {{ t('approval.status.pending') }}
                </p>
              </div>

              <!-- Completed By -->
              <div v-if="step.completedBy" class="flex items-center gap-2">
                <UAvatar
                  :src="`https://i.pravatar.cc/150?u=${step.completedBy}`"
                  :alt="step.completedBy"
                  size="xs"
                />
                <span class="text-sm text-gray-600">{{ step.completedBy }}</span>
              </div>
            </div>
          </div>
        </div>
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

// Methods
function getStepIndicatorClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500 border-emerald-500 text-white'
    case 'current':
      return 'bg-blue-600 border-blue-600'
    default:
      return 'bg-white border-gray-300 text-gray-400'
  }
}

function getStepTitleClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-gray-900'
    case 'current':
      return 'text-blue-600'
    default:
      return 'text-gray-400'
  }
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
