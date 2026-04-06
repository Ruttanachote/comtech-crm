<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('approval.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ t('approval.subtitle') }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <UButton
          color="gray"
          variant="soft"
          square
          @click="showHistory = true"
        >
          <UIcon name="i-heroicons-clock" class="w-5 h-5" />
        </UButton>
        <UButton
          color="gray"
          variant="soft"
          @click="handleExport"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
          {{ t('common.export') }}
        </UButton>
      </div>
    </div>

    <!-- Stats -->
    <ApprovalStats
      :stats="store.currentStats"
      :selected-filter="store.filters.status || 'all'"
      @filter="handleStatFilter"
    />

    <!-- Filters -->
    <ApprovalFilters
      :filters="store.filters"
      @update:filters="store.updateFilters"
      @clear="store.resetFilters"
      @export="handleExport"
    />

    <!-- List -->
    <ApprovalList
      :items="store.allItems"
      :loading="store.loading"
      :page="store.page"
      :page-size="store.pageSize"
      :total="store.total"
      :has-filters="store.activeFiltersCount > 0"
      @approve="handleApprove"
      @reject="handleReject"
      @view="handleView"
      @page-change="store.setPage"
      @page-size-change="store.setPageSize"
      @clear-filters="store.resetFilters"
    />

    <!-- Approve Modal -->
    <UModal v-model="showApproveModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-500" />
            <h3 class="text-lg font-semibold">{{ t('approval.messages.confirmApprove') }}</h3>
          </div>
        </template>

        <p class="text-gray-600 mb-4">
          {{ t('approval.messages.confirmApproveMessage') }}
        </p>

        <UTextarea
          v-model="actionComment"
          :placeholder="t('approval.detail.actions.commentPlaceholder')"
          rows="3"
          class="mb-4"
        />

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="showApproveModal = false"
            >
              {{ t('common.cancel') }}
            </UButton>
            <UButton
              color="emerald"
              :loading="store.isActionLoading"
              @click="confirmApprove"
            >
              {{ t('approval.list.actions.approve') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Reject Modal -->
    <UModal v-model="showRejectModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-red-500" />
            <h3 class="text-lg font-semibold">{{ t('approval.messages.confirmReject') }}</h3>
          </div>
        </template>

        <p class="text-gray-600 mb-4">
          {{ t('approval.messages.confirmRejectMessage') }}
        </p>

        <UTextarea
          v-model="actionComment"
          :placeholder="t('approval.detail.actions.commentPlaceholder')"
          rows="3"
          class="mb-4"
        />

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="showRejectModal = false"
            >
              {{ t('common.cancel') }}
            </UButton>
            <UButton
              color="red"
              :loading="store.isActionLoading"
              @click="confirmReject"
            >
              {{ t('approval.list.actions.reject') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- History Modal -->
    <UModal v-model="showHistory" :ui="{ width: 'lg' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ t('approval.history.title') }}</h3>
              <p class="text-sm text-gray-500">{{ t('approval.history.subtitle') }}</p>
            </div>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              @click="showHistory = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </UButton>
          </div>
        </template>

        <!-- Activity Count -->
        <div class="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-900">{{ t('approval.history.title') }}</span>
          <UBadge color="primary" variant="soft" size="sm">{{ recentActivities.length }}</UBadge>
          <span class="text-sm text-gray-500">{{ t('approval.history.items') }}</span>
        </div>

        <!-- Activity List -->
        <div class="max-h-96 overflow-y-auto space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex gap-3"
          >
            <!-- Avatar -->
            <UAvatar
              :src="activity.user.avatar"
              :alt="activity.user.name"
              size="sm"
            />

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-xs text-gray-400">{{ formatDateTime(activity.timestamp) }}</span>
              </div>
              <div class="flex items-center gap-2 mb-1">
                <UBadge
                  :color="getActivityColor(activity.action)"
                  variant="soft"
                  size="xs"
                >
                  {{ t(`approval.activity.${activity.action}`) }}
                </UBadge>
                <span class="text-sm font-medium text-gray-900">Approval Request</span>
              </div>
              <p class="text-sm text-gray-600">{{ activity.comment || t('approval.history.noDescription') }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.user.name }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { useApprovalStore } from '~/stores/approval.store'
import ApprovalStats from '~/components/approval/ApprovalStats.vue'
import ApprovalFilters from '~/components/approval/ApprovalFilters.vue'
import ApprovalList from '~/components/approval/ApprovalList.vue'

definePageMeta({
  layout: 'default',
})

const { t, locale } = useI18n()
const router = useRouter()
const store = useApprovalStore()
const toast = useToast()

// State
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showHistory = ref(false)
const selectedApprovalId = ref<string | null>(null)
const actionComment = ref('')

// Mock activities for history modal (from approval.mock.ts)
const recentActivities = computed(() => [
  {
    id: 'act-1',
    action: 'forwarded',
    user: { name: 'System', avatar: 'https://i.pravatar.cc/150?u=system' },
    timestamp: '2024-12-16T14:25:00Z',
    comment: 'Forwarded to Finance Review stage',
  },
  {
    id: 'act-2',
    action: 'approved',
    user: { name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael' },
    timestamp: '2024-12-16T14:20:00Z',
    comment: 'Approved by Sales Manager - Stage 1 completed',
  },
  {
    id: 'act-3',
    action: 'submitted',
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    timestamp: '2024-12-15T10:30:00Z',
    comment: 'Submitted contract approval for International Freight Agreement',
  },
  {
    id: 'act-4',
    action: 'submitted',
    user: { name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael' },
    timestamp: '2024-12-10T09:15:00Z',
    comment: 'Submitted quotation approval for Warehousing Services',
  },
  {
    id: 'act-5',
    action: 'approved',
    user: { name: 'Finance Manager', avatar: 'https://i.pravatar.cc/150?u=finance' },
    timestamp: '2024-12-06T16:45:00Z',
    comment: 'Approved Sea Freight Contract - Finance Review completed',
  },
])

// Helper functions
function formatDateTime(date: string): string {
  return new Date(date).toLocaleString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActivityColor(action: string): string {
  switch (action) {
    case 'approved':
      return 'emerald'
    case 'rejected':
      return 'red'
    case 'forwarded':
      return 'blue'
    case 'submitted':
      return 'amber'
    default:
      return 'gray'
  }
}

// Fetch data on mount
onMounted(async () => {
  await store.fetchStats()
  await store.fetchList()
})

// Watch for filter changes
watch(() => store.filters, async () => {
  await store.fetchList(1, store.pageSize)
}, { deep: true })

// Methods
function handleStatFilter(status: string) {
  store.updateFilters({ status: status as any })
}

function handleView(id: string) {
  router.push(`/approvals/${id}`)
}

function handleApprove(id: string) {
  selectedApprovalId.value = id
  actionComment.value = ''
  showApproveModal.value = true
}

function handleReject(id: string) {
  selectedApprovalId.value = id
  actionComment.value = ''
  showRejectModal.value = true
}

async function confirmApprove() {
  if (!selectedApprovalId.value) return

  const result = await store.approveDocument(selectedApprovalId.value, {
    comment: actionComment.value,
  })

  if (result.success) {
    toast.add({
      title: t('common.success'),
      description: t('approval.messages.approveSuccess'),
      color: 'green',
    })
    showApproveModal.value = false
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}

async function confirmReject() {
  if (!selectedApprovalId.value) return

  const result = await store.rejectDocument(selectedApprovalId.value, {
    comment: actionComment.value,
  })

  if (result.success) {
    toast.add({
      title: t('common.success'),
      description: t('approval.messages.rejectSuccess'),
      color: 'green',
    })
    showRejectModal.value = false
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}

function handleExport() {
  // TODO: Implement export functionality
  toast.add({
    title: t('common.info'),
    description: t('common.comingSoon'),
    color: 'blue',
  })
}
</script>
