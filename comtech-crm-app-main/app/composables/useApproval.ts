/**
 * Approval Composable
 * จัดการ logic สำหรับโมดูลอนุมัติเอกสาร
 */
import type {
  ApprovalDocument,
  ApprovalStats,
  ApprovalFilters,
  ApprovalPriority,
  ApprovalStatus,
  ApprovalType,
  ApprovalStep,
  PriorityConfig,
  StatusConfig,
  StepConfig
} from '~/types/approval.type'
import {
  getPriorityConfig,
  getStatusConfig,
  getStepConfig,
  formatCurrency,
  formatDaysAgo,
  priorityConfigs,
  statusConfigs,
  stepConfigs
} from '~/data/mock/approval.mock'

export interface UseApprovalReturn {
  // Store
  store: ReturnType<typeof useApprovalStore>
  
  // Data
  documents: ComputedRef<ApprovalDocument[]>
  stats: ComputedRef<ApprovalStats>
  selectedDocument: ComputedRef<ApprovalDocument | null>
  
  // Loading states
  isLoading: ComputedRef<boolean>
  isLoadingAction: ComputedRef<boolean>
  
  // Filters
  filters: ComputedRef<ApprovalFilters>
  hasActiveFilters: ComputedRef<boolean>
  
  // Pagination
  pagination: ComputedRef<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>
  
  // Actions
  fetchApprovals: () => Promise<void>
  fetchStats: () => Promise<void>
  fetchDocumentById: (id: string) => Promise<ApprovalDocument | null>
  approveDocument: (documentId: string, comment?: string) => Promise<any>
  rejectDocument: (documentId: string, comment?: string) => Promise<any>
  setFilters: (filters: Partial<ApprovalFilters>) => void
  resetFilters: () => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  
  // UI Actions
  openDetailModal: (document: ApprovalDocument) => void
  closeDetailModal: () => void
  openConfirmModal: (documentId: string, action: 'approve' | 'reject') => void
  closeConfirmModal: () => void
  executePendingAction: () => Promise<any>
  
  // Helpers
  getPriorityConfig: (priority: ApprovalPriority) => PriorityConfig
  getStatusConfig: (status: ApprovalStatus) => StatusConfig
  getStepConfig: (step: ApprovalStep) => StepConfig
  formatCurrency: (value: number, currency?: string) => string
  formatDaysAgo: (days: number) => string
  getPriorityLabel: (priority: ApprovalPriority) => string
  getStatusLabel: (status: ApprovalStatus) => string
  getStepLabel: (step: ApprovalStep) => string
  
  // Configs
  priorityConfigs: PriorityConfig[]
  statusConfigs: StatusConfig[]
  stepConfigs: StepConfig[]
  
  // Type options for filters
  typeOptions: { value: string; label: string }[]
}

export function useApproval(): UseApprovalReturn {
  const { t } = useI18n()
  const store = useApprovalStore()
  const toast = useToast()

  // Computed refs from store
  const documents = computed(() => store.documents)
  const stats = computed(() => store.stats)
  const selectedDocument = computed(() => store.selectedDocument)
  const isLoading = computed(() => store.isLoading)
  const isLoadingAction = computed(() => store.isLoadingAction)
  const filters = computed(() => store.filters)
  const hasActiveFilters = computed(() => store.hasActiveFilters)
  const pagination = computed(() => store.pagination)

  // Actions
  const fetchApprovals = async () => {
    await store.fetchApprovals()
  }

  const fetchStats = async () => {
    await store.fetchStats()
  }

  const fetchDocumentById = async (id: string) => {
    return await store.fetchDocumentById(id)
  }

  const approveDocument = async (documentId: string, comment?: string) => {
    const result = await store.approveDocument(documentId, comment)
    
    if (result.success) {
      toast.add({
        title: t('approval.approveSuccess'),
        description: t('approval.approveSuccessDesc'),
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } else {
      toast.add({
        title: t('approval.approveError'),
        description: result.message,
        color: 'red',
        icon: 'i-heroicons-x-circle'
      })
    }
    
    return result
  }

  const rejectDocument = async (documentId: string, comment?: string) => {
    const result = await store.rejectDocument(documentId, comment)
    
    if (result.success) {
      toast.add({
        title: t('approval.rejectSuccess'),
        description: t('approval.rejectSuccessDesc'),
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } else {
      toast.add({
        title: t('approval.rejectError'),
        description: result.message,
        color: 'red',
        icon: 'i-heroicons-x-circle'
      })
    }
    
    return result
  }

  const setFilters = (newFilters: Partial<ApprovalFilters>) => {
    store.setFilters(newFilters)
  }

  const resetFilters = () => {
    store.resetFilters()
  }

  const setPage = (page: number) => {
    store.setPage(page)
  }

  const setLimit = (limit: number) => {
    store.setLimit(limit)
  }

  // UI Actions
  const openDetailModal = (document: ApprovalDocument) => {
    store.openDetailModal(document)
  }

  const closeDetailModal = () => {
    store.closeDetailModal()
  }

  const openConfirmModal = (documentId: string, action: 'approve' | 'reject') => {
    store.openConfirmModal({ documentId, action })
  }

  const closeConfirmModal = () => {
    store.closeConfirmModal()
  }

  const executePendingAction = async () => {
    return await store.executePendingAction()
  }

  // Helper functions
  const _getPriorityConfig = (priority: ApprovalPriority) => getPriorityConfig(priority)
  const _getStatusConfig = (status: ApprovalStatus) => getStatusConfig(status)
  const _getStepConfig = (step: ApprovalStep) => getStepConfig(step)
  const _formatCurrency = (value: number, currency: string = 'THB') => formatCurrency(value, currency)
  const _formatDaysAgo = (days: number) => formatDaysAgo(days, t)

  const getPriorityLabel = (priority: ApprovalPriority) => {
    const config = getPriorityConfig(priority)
    return t(`approval.priority.${priority}`, config.label)
  }

  const getStatusLabel = (status: ApprovalStatus) => {
    const config = getStatusConfig(status)
    return t(`approval.status.${status}`, config.label)
  }

  const getStepLabel = (step: ApprovalStep) => {
    const config = getStepConfig(step)
    return t(`approval.step.${step}`, config.label)
  }

  // Type options for filters
  const typeOptions = [
    { value: 'all', label: t('approval.type.all', 'ทั้งหมด') },
    { value: 'freight', label: t('approval.type.freight', 'ขนส่งสินค้า') },
    { value: 'warehousing', label: t('approval.type.warehousing', 'คลังสินค้า') },
    { value: 'transport', label: t('approval.type.transport', 'ขนส่ง') },
    { value: 'shipping', label: t('approval.type.shipping', 'การขนส่งทางเรือ') },
    { value: 'logistics', label: t('approval.type.logistics', 'โลจิสติกส์') },
    { value: 'other', label: t('approval.type.other', 'อื่นๆ') }
  ]

  return {
    // Store
    store,
    
    // Data
    documents,
    stats,
    selectedDocument,
    
    // Loading states
    isLoading,
    isLoadingAction,
    
    // Filters
    filters,
    hasActiveFilters,
    
    // Pagination
    pagination,
    
    // Actions
    fetchApprovals,
    fetchStats,
    fetchDocumentById,
    approveDocument,
    rejectDocument,
    setFilters,
    resetFilters,
    setPage,
    setLimit,
    
    // UI Actions
    openDetailModal,
    closeDetailModal,
    openConfirmModal,
    closeConfirmModal,
    executePendingAction,
    
    // Helpers
    getPriorityConfig: _getPriorityConfig,
    getStatusConfig: _getStatusConfig,
    getStepConfig: _getStepConfig,
    formatCurrency: _formatCurrency,
    formatDaysAgo: _formatDaysAgo,
    getPriorityLabel,
    getStatusLabel,
    getStepLabel,
    
    // Configs
    priorityConfigs,
    statusConfigs,
    stepConfigs,
    
    // Type options
    typeOptions
  }
}

// Composable for approval stats only
export function useApprovalStats() {
  const store = useApprovalStore()
  
  return {
    stats: computed(() => store.stats),
    isLoading: computed(() => store.isLoadingStats),
    fetchStats: () => store.fetchStats()
  }
}

// Composable for single approval document
export function useApprovalDocument(documentId: string) {
  const store = useApprovalStore()
  const { t } = useI18n()
  
  const document = computed(() => 
    store.documents.find(d => d.id === documentId) || null
  )
  
  const isLoading = computed(() => store.isLoading)
  
  const refresh = async () => {
    return await store.fetchDocumentById(documentId)
  }
  
  const approve = async (comment?: string) => {
    return await store.approveDocument(documentId, comment)
  }
  
  const reject = async (comment?: string) => {
    return await store.rejectDocument(documentId, comment)
  }
  
  return {
    document,
    isLoading,
    refresh,
    approve,
    reject
  }
}
