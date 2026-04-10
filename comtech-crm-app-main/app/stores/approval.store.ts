// Approval Store - Pinia
// Manages approval state and actions

import { defineStore } from 'pinia'
import { approvalService } from '~/services/approval.service'
import type {
  ApprovalItem,
  ApprovalDetail,
  ApprovalStats,
  ApprovalFilters,
  ApprovalActionResponse,
} from '~/types/approval.type'

// ============================================
// Store State Interface
// ============================================

interface ApprovalState {
  // List
  items: ApprovalItem[]
  loading: boolean
  error: string | null
  
  // Pagination
  page: number
  pageSize: number
  total: number
  
  // Filters
  filters: ApprovalFilters
  
  // Stats
  stats: ApprovalStats | null
  statsLoading: boolean
  
  // Detail
  selectedApproval: ApprovalDetail | null
  detailLoading: boolean
  
  // Actions
  actionLoading: 'approve' | 'reject' | 'requestMoreInfo' | null
  
  // Last updated
  lastUpdated: string | null
}

// ============================================
// Approval Store
// ============================================

export const useApprovalStore = defineStore('approval', {
  state: (): ApprovalState => ({
    // List
    items: [],
    loading: false,
    error: null,
    
    // Pagination
    page: 1,
    pageSize: 5,
    total: 0,
    
    // Filters
    filters: {
      status: 'all',
      type: 'all',
      priority: 'all',
      search: '',
      sortBy: 'date_new_old',
    },

    // Stats
    stats: null,
    statsLoading: false,
    
    // Detail
    selectedApproval: null,
    detailLoading: false,
    
    // Actions
    actionLoading: null,
    
    // Last updated
    lastUpdated: null,
  }),

  // ============================================
  // Getters
  // ============================================

  getters: {
    // Get all items
    allItems: (state): ApprovalItem[] => state.items,
    
    // Get selected approval
    currentApproval: (state): ApprovalDetail | null => state.selectedApproval,
    
    // Get stats
    currentStats: (state): ApprovalStats | null => state.stats,
    
    // Get pending count
    pendingCount: (state): number => state.stats?.pending || 0,
    
    // Get approved count
    approvedCount: (state): number => state.stats?.approved || 0,
    
    // Get rejected count
    rejectedCount: (state): number => state.stats?.rejected || 0,
    
    // Get total count
    totalCount: (state): number => state.stats?.total || 0,
    
    // Check if loading
    isLoading: (state): boolean => state.loading || state.statsLoading,
    
    // Check if detail loading
    isDetailLoading: (state): boolean => state.detailLoading,
    
    // Check if action loading
    isActionLoading: (state): boolean => !!state.actionLoading,
    
    // Get filter label
    filterLabel: (state) => (key: keyof ApprovalFilters): string => {
      const value = state.filters[key]
      if (value === 'all' || !value) return 'All'
      return String(value)
    },
    
    // Get active filters count
    activeFiltersCount: (state): number => {
      let count = 0
      if (state.filters.status && state.filters.status !== 'all') count++
      if (state.filters.type && state.filters.type !== 'all') count++
      if (state.filters.priority && state.filters.priority !== 'all') count++
      if (state.filters.search) count++
      return count
    },
  },

  // ============================================
  // Actions
  // ============================================

  actions: {
    // ============================================
    // Fetch Approval Stats
    // ============================================
    async fetchStats(): Promise<void> {
      this.statsLoading = true
      
      try {
        const stats = await approvalService.getStats()
        this.stats = stats
        this.lastUpdated = new Date().toISOString()
      } catch (error) {
        console.error('Error fetching approval stats:', error)
        this.error = 'Failed to load approval statistics'
      } finally {
        this.statsLoading = false
      }
    },

    // ============================================
    // Fetch Approval List
    // ============================================
    async fetchList(
      page: number = 1,
      pageSize: number = 5,
      filters?: ApprovalFilters
    ): Promise<void> {
      this.loading = true
      this.error = null
      
      try {
        const mergedFilters = { ...this.filters, ...filters }
        const response = await approvalService.getList(page, pageSize, mergedFilters)
        
        this.items = response.items
        this.total = response.total
        this.page = response.page
        this.pageSize = response.pageSize
        
        // Update stats if provided
        if (response.stats) {
          this.stats = response.stats
        }
        
        this.lastUpdated = new Date().toISOString()
      } catch (error) {
        console.error('Error fetching approval list:', error)
        this.error = 'Failed to load approval list'
        this.items = []
      } finally {
        this.loading = false
      }
    },

    // ============================================
    // Fetch Approval Detail
    // ============================================
    async fetchDetail(id: string): Promise<ApprovalDetail | null> {
      this.detailLoading = true
      
      try {
        const approval = await approvalService.getById(id)
        this.selectedApproval = approval
        return approval
      } catch (error) {
        console.error('Error fetching approval detail:', error)
        this.error = 'Failed to load approval detail'
        return null
      } finally {
        this.detailLoading = false
      }
    },

    // ============================================
    // Set Selected Approval
    // ============================================
    setSelectedApproval(approval: ApprovalDetail | null): void {
      this.selectedApproval = approval
    },

    // ============================================
    // Update Filters
    // ============================================
    updateFilters(filters: Partial<ApprovalFilters>): void {
      this.filters = { ...this.filters, ...filters }
      // Reset to first page when filters change
      this.page = 1
    },

    // ============================================
    // Reset Filters
    // ============================================
    resetFilters(): void {
      this.filters = {
        status: 'all',
        type: 'all',
        priority: 'all',
        search: '',
        sortBy: 'date_new_old',
      }
      this.page = 1
    },

    // ============================================
    // Set Page
    // ============================================
    setPage(page: number): void {
      this.page = page
    },

    // ============================================
    // Set Page Size
    // ============================================
    setPageSize(pageSize: number): void {
      this.pageSize = pageSize
      this.page = 1
    },

    // ============================================
    // Approve Document
    // ============================================
    async approveDocument(
      id: string,
      data?: { comment?: string; attachments?: File[] }
    ): Promise<ApprovalActionResponse> {
      this.actionLoading = 'approve'
      
      try {
        const result = await approvalService.approve(id, data)
        
        if (result.success && result.approval) {
          // Update in list
          const index = this.items.findIndex(item => item.id === id)
          if (index !== -1) {
            this.items[index] = { ...this.items[index], ...result.approval }
          }
          
          // Update selected approval
          if (this.selectedApproval?.id === id) {
            this.selectedApproval = result.approval
          }
          
          // Refresh stats
          await this.fetchStats()
        }
        
        return result
      } catch (error) {
        console.error('Error approving document:', error)
        return {
          success: false,
          message: 'Failed to approve document',
        }
      } finally {
        this.actionLoading = null
      }
    },

    // ============================================
    // Reject Document
    // ============================================
    async rejectDocument(
      id: string,
      data?: { comment?: string; attachments?: File[] }
    ): Promise<ApprovalActionResponse> {
      this.actionLoading = 'reject'
      
      try {
        const result = await approvalService.reject(id, data)
        
        if (result.success && result.approval) {
          // Update in list
          const index = this.items.findIndex(item => item.id === id)
          if (index !== -1) {
            this.items[index] = { ...this.items[index], ...result.approval }
          }
          
          // Update selected approval
          if (this.selectedApproval?.id === id) {
            this.selectedApproval = result.approval
          }
          
          // Refresh stats
          await this.fetchStats()
        }
        
        return result
      } catch (error) {
        console.error('Error rejecting document:', error)
        return {
          success: false,
          message: 'Failed to reject document',
        }
      } finally {
        this.actionLoading = null
      }
    },

    // ============================================
    // Request More Info
    // ============================================
    async requestMoreInfo(
      id: string,
      data?: { comment?: string; attachments?: File[] }
    ): Promise<ApprovalActionResponse> {
      this.actionLoading = 'requestMoreInfo'
      
      try {
        const result = await approvalService.requestMoreInfo(id, data)
        
        if (result.success && result.approval) {
          // Update in list
          const index = this.items.findIndex(item => item.id === id)
          if (index !== -1) {
            this.items[index] = { ...this.items[index], ...result.approval }
          }
          
          // Update selected approval
          if (this.selectedApproval?.id === id) {
            this.selectedApproval = result.approval
          }
          
          // Refresh stats
          await this.fetchStats()
        }
        
        return result
      } catch (error) {
        console.error('Error requesting more info:', error)
        return {
          success: false,
          message: 'Failed to request more info',
        }
      } finally {
        this.actionLoading = null
      }
    },

    // ============================================
    // Add Comment
    // ============================================
    async addComment(
      id: string,
      comment: string,
      attachments?: File[]
    ): Promise<boolean> {
      try {
        const updated = await approvalService.addComment(id, comment, attachments)
        
        if (updated) {
          // Update selected approval
          if (this.selectedApproval?.id === id) {
            this.selectedApproval = updated
          }
          return true
        }
        
        return false
      } catch (error) {
        console.error('Error adding comment:', error)
        return false
      }
    },

    // ============================================
    // Refresh Data
    // ============================================
    async refresh(): Promise<void> {
      await Promise.all([
        this.fetchStats(),
        this.fetchList(this.page, this.pageSize),
      ])
    },

    // ============================================
    // Clear Error
    // ============================================
    clearError(): void {
      this.error = null
    },

    // ============================================
    // Clear Selection
    // ============================================
    clearSelection(): void {
      this.selectedApproval = null
    },
  },
})
