<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('approval.title') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('approval.subtitle') }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          class="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          @click="showHistory = true"
        >
          <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          @click="handleExport"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ t('approval.actions.export') }}</span>
        </button>
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
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @clear-filters="store.resetFilters"
    />

    <!-- Approve Modal -->
    <Teleport to="body">
      <div v-if="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showApproveModal = false" />
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('approval.messages.confirmApprove') }}</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('approval.messages.confirmApproveMessage') }}</p>
          <textarea
            v-model="actionComment"
            :placeholder="t('approval.detail.actions.commentPlaceholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
              @click="showApproveModal = false"
            >
              {{ t('approval.actions.cancel') }}
            </button>
            <button
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              :disabled="store.isActionLoading"
              @click="confirmApprove"
            >
              {{ t('approval.list.actions.approve') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reject Modal -->
    <Teleport to="body">
      <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showRejectModal = false" />
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-red-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('approval.messages.confirmReject') }}</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('approval.messages.confirmRejectMessage') }}</p>
          <textarea
            v-model="actionComment"
            :placeholder="t('approval.detail.actions.commentPlaceholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
              @click="showRejectModal = false"
            >
              {{ t('approval.actions.cancel') }}
            </button>
            <button
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              :disabled="store.isActionLoading"
              @click="confirmReject"
            >
              {{ t('approval.list.actions.reject') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- History Modal -->
    <Teleport to="body">
      <div v-if="showHistory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showHistory = false" />
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('approval.history.title') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('approval.history.subtitle') }}</p>
            </div>
            <button
              class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              @click="showHistory = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <!-- Activity Count -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ t('approval.history.title') }}</span>
            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">{{ recentActivities.length }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('approval.history.items') }}</span>
          </div>

          <!-- Activity List -->
          <div class="overflow-y-auto p-4 space-y-4 max-h-96">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex gap-3">
              <!-- Avatar -->
              <img
                :src="activity.user.avatar"
                :alt="activity.user.name"
                class="w-8 h-8 rounded-full object-cover shrink-0"
              />

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateTime(activity.timestamp) }}</span>
                </div>
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="getActivityBadgeClass(activity.action)"
                  >
                    {{ t(`approval.activity.${activity.action}`) }}
                  </span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Approval Request</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.comment || t('approval.history.noDescription') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ activity.user.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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

// Derive recent activities from loaded store items
const recentActivities = computed(() =>
  store.items
    .slice()
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 10)
    .map((item, index) => ({
      id: `act-${item.id}-${index}`,
      action: item.status === 'pending' ? 'submitted' : item.status,
      user: {
        name: item.sender.name,
        avatar: item.sender.avatar ?? `https://i.pravatar.cc/150?u=${item.sender.id}`,
      },
      timestamp: item.submittedAt,
      comment: item.title,
    }))
)

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
      title: t('approval.messages.success'),
      description: t('approval.messages.approveSuccess'),
      color: 'green',
    })
    showApproveModal.value = false
  } else {
    toast.add({
      title: t('approval.messages.actionError'),
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
      title: t('approval.messages.success'),
      description: t('approval.messages.rejectSuccess'),
      color: 'green',
    })
    showRejectModal.value = false
  } else {
    toast.add({
      title: t('approval.messages.actionError'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}

async function handlePageChange(page: number) {
  store.setPage(page)
  await store.fetchList(page, store.pageSize)
}

async function handlePageSizeChange(size: number) {
  store.setPageSize(size)
  await store.fetchList(1, size)
}

function handleExport() {
  toast.add({
    title: t('approval.messages.success'),
    description: t('approval.messages.comingSoon'),
    color: 'blue',
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

function getActivityBadgeClass(action: string): string {
  switch (action) {
    case 'approved':
      return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
    case 'forwarded':
      return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
    case 'submitted':
      return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
}
</script>
