<template>
  <div
    class="rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    :class="{
      // pending
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700': approval.status === 'pending',
      'border-l-4 border-l-red-500': approval.status === 'pending' && isUrgent,
      // approved
      'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700 border-l-4 border-l-emerald-500': approval.status === 'approved',
      // rejected
      'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 border-l-4 border-l-red-500': approval.status === 'rejected',
      // request_more_info
      'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 border-l-4 border-l-amber-400': approval.status === 'request_more_info',
    }"
  >
    <div class="px-4 py-3 sm:px-5 sm:py-4">
      <!-- Mobile + Desktop layout -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

        <!-- Left: Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
            :class="{
              'text-emerald-700 dark:text-emerald-300': approval.status === 'approved',
              'text-red-700 dark:text-red-300': approval.status === 'rejected',
              'text-amber-700 dark:text-amber-300': approval.status === 'request_more_info',
            }"
          >{{ approval.documentNumber }}</span>
            <!-- Urgent badge shown inline with doc number on mobile -->
            <UBadge v-if="isUrgent" color="error" variant="soft" size="sm" class="sm:hidden">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
              {{ t('approval.priority.urgent') }}
            </UBadge>
          </div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {{ approval.title }}
          </h3>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ t('approval.list.customer') }} <span class="font-medium text-gray-700 dark:text-gray-200">{{ approval.customer.name }}</span></span>
            <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
            <span>{{ t('approval.fields.totalValue') }} <span class="font-semibold text-gray-900 dark:text-white">{{ formatValue }}</span></span>
            <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
            <span>{{ t('approval.list.sender') }} <span class="font-medium text-gray-700 dark:text-gray-200">{{ approval.sender.name }}</span></span>
            <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ t('approval.list.waitingAt') }} <span class="font-medium text-gray-700 dark:text-gray-200">{{ currentStepText }}</span> • {{ daysWaiting }} {{ t('approval.list.daysWaiting') }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions (varies by status) -->
        <div class="flex items-center gap-2 shrink-0 flex-wrap">

          <!-- ── PENDING: action buttons ── -->
          <template v-if="approval.status === 'pending'">
            <UBadge v-if="isUrgent" color="error" variant="soft" size="sm" class="hidden sm:inline-flex">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-3 h-3 mr-1" />
              {{ t('approval.priority.urgent') }}
            </UBadge>
            <UButton color="error" variant="solid" size="sm" class="cursor-pointer text-white" @click.stop="$emit('reject', approval.id)">
              {{ t('approval.list.actions.reject') }}
            </UButton>
            <UButton color="success" variant="solid" size="sm" class="cursor-pointer text-white" @click.stop="$emit('approve', approval.id)">
              {{ t('approval.list.actions.approve') }}
            </UButton>
            <UDropdownMenu :items="moreOptions" :content="{ align: 'end' }">
              <UButton color="neutral" variant="ghost" size="sm" square class="cursor-pointer" @click.stop>
                <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5" />
              </UButton>
            </UDropdownMenu>
          </template>

          <!-- ── APPROVED ── -->
          <template v-else-if="approval.status === 'approved'">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
              {{ t('approval.status.approved') }}
            </span>
            <UButton color="neutral" variant="ghost" size="sm" class="cursor-pointer" @click.stop="$emit('view', approval.id)">
              <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
              {{ t('approval.list.actions.view') }}
            </UButton>
          </template>

          <!-- ── REJECTED ── -->
          <template v-else-if="approval.status === 'rejected'">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              <UIcon name="i-heroicons-x-circle" class="w-3.5 h-3.5" />
              {{ t('approval.status.rejected') }}
            </span>
            <UButton color="neutral" variant="ghost" size="sm" class="cursor-pointer" @click.stop="$emit('view', approval.id)">
              <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
              {{ t('approval.list.actions.view') }}
            </UButton>
          </template>

          <!-- ── REQUEST MORE INFO ── -->
          <template v-else>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              <UIcon name="i-heroicons-question-mark-circle" class="w-3.5 h-3.5" />
              {{ t('approval.status.request_more_info') }}
            </span>
            <UButton color="neutral" variant="ghost" size="sm" class="cursor-pointer" @click.stop="$emit('view', approval.id)">
              <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-1" />
              {{ t('approval.list.actions.view') }}
            </UButton>
          </template>

        </div>
      </div>
    </div>

    <!-- Workflow History Modal -->
    <Teleport to="body">
      <div v-if="showWorkflow" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showWorkflow = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showWorkflow = false" />
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm">
          <!-- Header -->
          <div class="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ t('approval.list.actions.history') }}</h3>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">{{ approval.documentNumber }}</p>
            </div>
            <button class="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer -mt-0.5" @click="showWorkflow = false">
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          </div>

          <!-- Workflow Steps -->
          <div class="px-5 py-5">
            <div class="relative">
              <!-- Connector line segments -->
              <div
                v-for="(step, idx) in workflowSteps.slice(0, -1)"
                :key="`line-${step.id}`"
                class="absolute w-0.5 left-3.75"
                :style="{ top: `${idx * 72 + 32}px`, height: '40px' }"
                :class="step.status === 'completed' ? 'bg-green-400 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-600'"
              />

              <div class="space-y-0">
                <div v-for="step in workflowSteps" :key="step.id" class="relative flex items-start gap-3 pb-0" style="min-height: 72px;">
                  <!-- Circle indicator -->
                  <div class="shrink-0 mt-0.5">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                      :class="{
                        'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200 dark:shadow-green-900': step.status === 'completed',
                        'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900 ring-4 ring-blue-100 dark:ring-blue-900': step.status === 'current',
                        'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500': step.status === 'pending',
                      }"
                    >
                      <UIcon v-if="step.status === 'completed'" name="i-heroicons-check" class="w-4 h-4" />
                      <span v-else-if="step.status === 'current'" class="w-2 h-2 rounded-full bg-white" />
                      <span v-else class="text-xs font-semibold">{{ step.order }}</span>
                    </div>
                  </div>

                  <!-- Content card -->
                  <div
                    class="flex-1 rounded-xl px-3 py-2.5 min-w-0"
                    :class="{
                      'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800': step.status === 'completed',
                      'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700': step.status === 'current',
                      'bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600': step.status === 'pending',
                    }"
                  >
                    <!-- Name row -->
                    <div class="flex items-center justify-between gap-2">
                      <p
                        class="text-sm font-semibold leading-tight"
                        :class="{
                          'text-green-800 dark:text-green-300': step.status === 'completed',
                          'text-blue-700 dark:text-blue-300': step.status === 'current',
                          'text-gray-400 dark:text-gray-500': step.status === 'pending',
                        }"
                      >
                        {{ locale === 'th' ? step.nameTh : step.name }}
                      </p>
                      <!-- Status chip -->
                      <span
                        class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200': step.status === 'completed',
                          'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200': step.status === 'current' && approval.status === 'rejected',
                          'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200': step.status === 'current' && approval.status !== 'rejected',
                          'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400': step.status === 'pending',
                        }"
                      >
                        <span v-if="step.status === 'completed'">{{ locale === 'th' ? 'ผ่านแล้ว' : 'Done' }}</span>
                        <span v-else-if="step.status === 'current' && approval.status === 'rejected'">{{ locale === 'th' ? 'ปฏิเสธ' : 'Rejected' }}</span>
                        <span v-else-if="step.status === 'current'">{{ locale === 'th' ? 'กำลังดำเนินการ' : 'In Progress' }}</span>
                        <span v-else>{{ locale === 'th' ? 'รอ' : 'Pending' }}</span>
                      </span>
                    </div>

                    <!-- Person + date row -->
                    <div class="mt-1 flex items-center gap-3 text-xs flex-wrap">
                      <span
                        class="flex items-center gap-1"
                        :class="{
                          'text-green-600 dark:text-green-400': step.status === 'completed',
                          'text-blue-600 dark:text-blue-400': step.status === 'current',
                          'text-gray-400 dark:text-gray-500': step.status === 'pending',
                        }"
                      >
                        <UIcon name="i-heroicons-user-circle" class="w-3.5 h-3.5" />
                        <span v-if="step.completedBy">{{ step.completedBy }}</span>
                        <span v-else-if="step.assignedTo">{{ step.assignedTo }}</span>
                        <span v-else>—</span>
                      </span>
                      <span v-if="step.completedAt" class="flex items-center gap-1 text-green-500 dark:text-green-400">
                        <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                        {{ formatStepDate(step.completedAt) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalItem, WorkflowStep } from '~/types/approval.type'
import { mockWorkflowSteps } from '~/data/mock/approval.mock'

interface Props {
  approval: ApprovalItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'approve', id: string): void
  (e: 'reject', id: string): void
  (e: 'view', id: string): void
}>()

const { t, locale } = useI18n()

const showWorkflow = ref(false)

const isUrgent = computed(() => props.approval.priority === 'urgent')
const daysWaiting = computed(() => props.approval.daysWaiting)

// Derive workflow status from item status + currentStep
const workflowSteps = computed<WorkflowStep[]>(() => {
  if (props.approval.status === 'approved') {
    return mockWorkflowSteps.map(step => ({ ...step, status: 'completed' as const }))
  }
  const currentOrder = mockWorkflowSteps.find(s => s.id === props.approval.currentStep)?.order ?? 0
  return mockWorkflowSteps.map(step => ({
    ...step,
    status: step.order < currentOrder
      ? 'completed' as const
      : step.order === currentOrder
        ? 'current' as const
        : 'pending' as const,
  }))
})

const moreOptions = computed(() => [
  {
    label: t('approval.list.actions.history'),
    icon: 'i-heroicons-clock',
    onSelect: () => { showWorkflow.value = true },
  },
  {
    label: t('approval.list.actions.view'),
    icon: 'i-heroicons-document-text',
    onSelect: () => emit('view', props.approval.id),
  },
])

const formatValue = computed(() => {
  return new Intl.NumberFormat(locale.value === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: props.approval.currency || 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.approval.value)
})

const currentStepText = computed(() => {
  return locale.value === 'th'
    ? props.approval.currentStepNameTh
    : props.approval.currentStepName
})

function formatStepDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat(locale.value === 'th' ? 'th-TH' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
