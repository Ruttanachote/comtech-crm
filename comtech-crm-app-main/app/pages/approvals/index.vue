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
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-blue-500" />
              <h3 class="text-lg font-semibold">{{ t('approval.detail.activity') }}</h3>
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

        <div class="max-h-96 overflow-y-auto">
          <div v-if="store.allItems.length > 0" class="space-y-4">
            <div
              v-for="item in store.allItems.slice(0, 10)"
              :key="item.id"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-900">{{ item.documentNumber }}</span>
                <UBadge
                  :color="item.status === 'approved' ? 'emerald' : item.status === 'rejected' ? 'red' : 'amber'"
                  variant="soft"
                  size="xs"
                >
                  {{ t(`approval.status.${item.status}`) }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-600 line-clamp-1">{{ item.title }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ item.sender.name }} • {{ item.daysWaiting }} {{ t('approval.list.daysWaiting') }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">{{ t('approval.empty.title') }}</p>
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

const { t } = useI18n()
const router = useRouter()
const store = useApprovalStore()
const toast = useToast()

// State
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showHistory = ref(false)
const selectedApprovalId = ref<string | null>(null)
const actionComment = ref('')

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
