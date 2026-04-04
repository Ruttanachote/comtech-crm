/**
 * Approval Store (Pinia)
 * จัดการสถานะของโมดูลอนุมัติเอกสาร
 */
import { defineStore } from 'pinia'
import type {
  ApprovalDocument,
  ApprovalStats,
  ApprovalFilters,
  ApprovalPagination,
  ApprovalActionRequest,
  ApprovalListResponse,
  ApprovalStatus,
  ApprovalPriority,
  ApprovalType,
  ApprovalStep
} from '~/types/approval.type'

interface ApprovalState {
  // Data
  documents: ApprovalDocument[]
  stats: ApprovalStats
  selectedDocument: ApprovalDocument | null
  
  // Filters
  filters: ApprovalFilters
  
  // Pagination
  pagination: ApprovalPagination
  
  // Loading States
  isLoading: boolean
  isLoadingAction: boolean
  isLoadingStats: boolean
  
  // Error
  error: string | null
  
  // UI State
  viewMode: 'list' | 'grid'
  showDetailModal: boolean
  showConfirmModal: boolean
  pendingAction: ApprovalActionRequest | null
}

export const useApprovalStore = defineStore('approval', {
  state: (): ApprovalState => ({
    documents: [],
    stats: {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    selectedDocument: null,
    filters: {
      status: 'all',
      type: 'all',
      priority: 'all',
      search: '',
      sortBy: 'newest'
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    isLoading: false,
    isLoadingAction: false,
    isLoadingStats: false,
    error: null,
    viewMode: 'list',
    showDetailModal: false,
    showConfirmModal: false,
    pendingAction: null
  }),

  getters: {
    // Get filtered documents
    filteredDocuments: (state): ApprovalDocument[] => {
      let result = [...state.documents]
      
      // Filter by status
      if (state.filters.status !== 'all') {
        result = result.filter(doc => doc.status === state.filters.status)
      }
      
      // Filter by type
      if (state.filters.type !== 'all') {
        result = result.filter(doc => doc.type === state.filters.type)
      }
      
      // Filter by priority
      if (state.filters.priority !== 'all') {
        result = result.filter(doc => doc.priority === state.filters.priority)
      }
      
      // Filter by search
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        result = result.filter(doc => 
          doc.title.toLowerCase().includes(search) ||
          doc.documentNumber.toLowerCase().includes(search) ||
          doc.customerName.toLowerCase().includes(search) ||
          doc.sender.name.toLowerCase().includes(search)
        )
      }
      
      // Sort
      switch (state.filters.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'oldest':
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'value_high':
          result.sort((a, b) => b.value - a.value)
          break
        case 'value_low':
          result.sort((a, b) => a.value - b.value)
          break
        case 'priority':
          const priorityOrder = { urgent: 0, medium: 1, low: 2 }
          result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
          break
      }
      
      return result
    },

    // Get urgent documents count
    urgentCount: (state): number => {
      return state.documents.filter(doc => doc.priority === 'urgent' && doc.status === 'pending').length
    },

    // Get pending documents count
    pendingCount: (state): number => {
      return state.stats.pending
    },

    // Get document by ID
    getDocumentById: (state) => (id: string): ApprovalDocument | undefined => {
      return state.documents.find(doc => doc.id === id)
    },

    // Check if has active filters
    hasActiveFilters: (state): boolean => {
      return state.filters.status !== 'all' || 
             state.filters.type !== 'all' || 
             state.filters.priority !== 'all' || 
             state.filters.search !== ''
    },

    // Get current page documents
    currentPageDocuments: (state): ApprovalDocument[] => {
      const start = (state.pagination.page - 1) * state.pagination.limit
      const end = start + state.pagination.limit
      return state.documents.slice(start, end)
    }
  },

  actions: {
    // Fetch approvals list
    async fetchApprovals() {
      this.isLoading = true
      this.error = null
      
      try {
        const { $approvalService } = useNuxtApp()
        const response = await $approvalService.getApprovals({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters
        })
        
        this.documents = response.documents
        this.stats = response.stats
        this.pagination = response.pagination
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch approvals'
        console.error('Error fetching approvals:', err)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch approval stats only
    async fetchStats() {
      this.isLoadingStats = true
      
      try {
        const { $approvalService } = useNuxtApp()
        const stats = await $approvalService.getStats()
        this.stats = stats
      } catch (err: any) {
        console.error('Error fetching approval stats:', err)
      } finally {
        this.isLoadingStats = false
      }
    },

    // Fetch single approval document
    async fetchDocumentById(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const { $approvalService } = useNuxtApp()
        const document = await $approvalService.getDocumentById(id)
        this.selectedDocument = document
        return document
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch document'
        console.error('Error fetching document:', err)
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Approve document
    async approveDocument(documentId: string, comment?: string) {
      this.isLoadingAction = true
      
      try {
        const { $approvalService } = useNuxtApp()
        const result = await $approvalService.approveDocument(documentId, comment)
        
        if (result.success && result.document) {
          // Update local state
          const index = this.documents.findIndex(doc => doc.id === documentId)
          if (index !== -1) {
            this.documents[index] = result.document
          }
          
          // Update stats
          await this.fetchStats()
        }
        
        return result
      } catch (err: any) {
        console.error('Error approving document:', err)
        return { success: false, message: err.message }
      } finally {
        this.isLoadingAction = false
      }
    },

    // Reject document
    async rejectDocument(documentId: string, comment?: string) {
      this.isLoadingAction = true
      
      try {
        const { $approvalService } = useNuxtApp()
        const result = await $approvalService.rejectDocument(documentId, comment)
        
        if (result.success && result.document) {
          // Update local state
          const index = this.documents.findIndex(doc => doc.id === documentId)
          if (index !== -1) {
            this.documents[index] = result.document
          }
          
          // Update stats
          await this.fetchStats()
        }
        
        return result
      } catch (err: any) {
        console.error('Error rejecting document:', err)
        return { success: false, message: err.message }
      } finally {
        this.isLoadingAction = false
      }
    },

    // Set filters
    setFilters(filters: Partial<ApprovalFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1 // Reset to first page when filters change
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        status: 'all',
        type: 'all',
        priority: 'all',
        search: '',
        sortBy: 'newest'
      }
      this.pagination.page = 1
    },

    // Set pagination
    setPage(page: number) {
      this.pagination.page = page
    },

    setLimit(limit: number) {
      this.pagination.limit = limit
      this.pagination.page = 1
    },

    // Select document
    selectDocument(document: ApprovalDocument | null) {
      this.selectedDocument = document
    },

    // Toggle view mode
    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'
    },

    // Modal controls
    openDetailModal(document: ApprovalDocument) {
      this.selectedDocument = document
      this.showDetailModal = true
    },

    closeDetailModal() {
      this.showDetailModal = false
      this.selectedDocument = null
    },

    openConfirmModal(action: ApprovalActionRequest) {
      this.pendingAction = action
      this.showConfirmModal = true
    },

    closeConfirmModal() {
      this.showConfirmModal = false
      this.pendingAction = null
    },

    // Execute pending action
    async executePendingAction() {
      if (!this.pendingAction) return { success: false, message: 'No pending action' }
      
      const { documentId, action, comment } = this.pendingAction
      
      if (action === 'approve') {
        return await this.approveDocument(documentId, comment)
      } else {
        return await this.rejectDocument(documentId, comment)
      }
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
