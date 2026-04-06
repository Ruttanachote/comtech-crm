<template>
  <div class="p-6 max-w-7xl mx-auto">
    <ApprovalDetail
      :approval="store.currentApproval"
      :loading="store.isDetailLoading"
      :action-loading="store.actionLoading"
      current-user-role="Finance Manager"
      @back="handleBack"
      @download="handleDownload"
      @approve="handleApprove"
      @reject="handleReject"
      @request-more-info="handleRequestMoreInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { useApprovalStore } from '~/stores/approval.store'
import ApprovalDetail from '~/components/approval/ApprovalDetail.vue'

interface RouteParams {
  id: string
}

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useApprovalStore()
const toast = useToast()

const approvalId = computed(() => (route.params as RouteParams).id)

// Fetch approval detail on mount
onMounted(async () => {
  if (approvalId.value) {
    await store.fetchDetail(approvalId.value)
  }
})

// Watch for route changes
watch(() => approvalId.value, async (newId) => {
  if (newId) {
    await store.fetchDetail(newId)
  }
})

// Methods
function handleBack() {
  router.push('/approve')
}

function handleDownload() {
  // TODO: Implement download functionality
  toast.add({
    title: t('common.info'),
    description: t('common.comingSoon'),
    color: 'blue',
  })
}

async function handleApprove(data: { comment: string; attachments: File[] }) {
  const result = await store.approveDocument(approvalId.value, data)

  if (result.success) {
    toast.add({
      title: t('common.success'),
      description: t('approval.messages.approveSuccess'),
      color: 'green',
    })
    // Refresh detail
    await store.fetchDetail(approvalId.value)
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}

async function handleReject(data: { comment: string; attachments: File[] }) {
  const result = await store.rejectDocument(approvalId.value, data)

  if (result.success) {
    toast.add({
      title: t('common.success'),
      description: t('approval.messages.rejectSuccess'),
      color: 'green',
    })
    // Refresh detail
    await store.fetchDetail(approvalId.value)
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}

async function handleRequestMoreInfo(data: { comment: string; attachments: File[] }) {
  const result = await store.requestMoreInfo(approvalId.value, data)

  if (result.success) {
    toast.add({
      title: t('common.success'),
      description: t('approval.messages.requestMoreInfoSuccess'),
      color: 'green',
    })
    // Refresh detail
    await store.fetchDetail(approvalId.value)
  } else {
    toast.add({
      title: t('common.error'),
      description: result.message || t('approval.messages.error'),
      color: 'red',
    })
  }
}
</script>
