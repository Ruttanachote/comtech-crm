<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('approval.title') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ t('approval.subtitle') }}</p>
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
