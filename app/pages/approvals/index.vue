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
          color="neutral"
          variant="soft"
          icon="i-lucide-history"
          @click="showHistory = true"
        />
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-download"
          @click="handleExport"
        >
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
    <div class="mt-6">
      <ApprovalFilters
        :filters="store.filters"
        @update="store.updateFilters"
      />
    </div>

    <!-- List -->
    <div class="mt-6">
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
    </div>

    <!-- Approve Modal -->
    <UModal v-model:open="showApproveModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-emerald-500" />
            <h3 class="text-lg font-semibold">{{ t('approval.messages.confirmApprove') }}</h3>
          </div>
          <p class="text-gray-600 mb-4">{{ t('approval.messages.confirmApproveMessage') }}</p>
          <UTextarea
            v-model="actionComment"
            :placeholder="t('approval.detail.actions.commentPlaceholder')"
            rows="3"
            class="mb-4"
          />
          <div class="flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="soft"
              @click="showApproveModal = false"
            >
              {{ t('common.cancel') }}
            </UButton>
            <UButton
              color="success"
              :loading="store.isActionLoading"
              @click="confirmApprove"
            >
              {{ t('approval.list.actions.approve') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Reject Modal -->
    <UModal v-model:open="showRejectModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-x-circle" class="w-6 h-6 text-red-500" />
            <h3 class="text-lg font-semibold">{{ t('approval.messages.confirmReject') }}</h3>
          </div>
          <p class="text-gray-600 mb-4">{{ t('approval.messages.confirmRejectMessage') }}</p>
          <UTextarea
            v-model="actionComment"
            :placeholder="t('approval.detail.actions.commentPlaceholder')"
            rows="3"
            class="mb-4"
          />
          <div class="flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="soft"
              @click="showRejectModal = false"
            >
              {{ t('common.cancel') }}
            </UButton>
            <UButton
              color="error"
              :loading="store.isActionLoading"
              @click="confirmReject"
            >
              {{ t('approval.list.actions.reject') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- History Modal -->
    <UModal v-model:open="showHistory">
      <template #content>
        <div class="max-h-[80vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ t('approval.history.title') }}</h3>
              <p class="text-sm text-gray-500">{{ t('approval.history.subtitle') }}</p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              @click="showHistory = false"
            />
          </div>

          <!-- Activity Count -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <span class="text-sm font-medium text-gray-900">{{ t('approval.history.title') }}</span>
            <UBadge color="blue" size="sm">{{ recentActivities.length }}</UBadge>
            <span class="text-sm text-gray-500">{{ t('approval.history.items') }}</span>
          </div>

          <!-- Activity List -->
          <div class="overflow-y-auto p-4 space-y-4 max-h-96">
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
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs text-gray-400">{{ formatDateTime(activity.timestamp) }}</span>
                </div>
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <UBadge
                    :color="getActivityBadgeColor(activity.action)"
                    size="sm"
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
        </div>
      </template>
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

// Mock activities for history modal
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
      color: 'success',
    })
    showApproveModal.value = false
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'error',
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
      color: 'success',
    })
    showRejectModal.value = false
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'error',
    })
  }
}

function handleExport() {
  toast.add({
    title: t('common.info'),
    description: t('common.comingSoon'),
    color: 'info',
  })
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActivityBadgeColor(action: string): string {
  switch (action) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    case 'forwarded':
      return 'info'
    case 'submitted':
      return 'warning'
    default:
      return 'neutral'
  }
}
</script>
