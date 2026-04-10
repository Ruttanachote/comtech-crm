// Approval Service
// Handles all API calls related to approval workflow

import type {
  ApprovalItem,
  ApprovalDetail,
  ApprovalStats,
  ApprovalListResponse,
  ApprovalActionRequest,
  ApprovalActionResponse,
  ApprovalFilters,
} from '~/types/approval.type'

import {
  getMockApprovalStats,
  getMockApprovalById,
  getMockApprovalList,
  updateMockApprovalStatus,
} from '~/data/mock/approval.mock'

// ============================================
// Configuration
// ============================================

const USE_MOCK = true // Set to false when API is ready
const API_BASE = '/api/approvals'

// ============================================
// Helper Functions
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency || 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDaysWaiting(date: string): number {
  const submitted = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - submitted.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// ============================================
// Approval Service
// ============================================

export const approvalService = {
  // ============================================
  // Get Approval Statistics
  // ============================================
  async getStats(): Promise<ApprovalStats> {
    if (USE_MOCK) {
      await delay(300)
      return getMockApprovalStats()
    }

    const response = await fetch(`${API_BASE}/stats`)
    if (!response.ok) throw new Error('Failed to fetch approval stats')
    return response.json()
  },

  // ============================================
  // Get Approval List
  // ============================================
  async getList(
    page: number = 1,
    pageSize: number = 10,
    filters?: ApprovalFilters
  ): Promise<ApprovalListResponse> {
    if (USE_MOCK) {
      await delay(500)
      return getMockApprovalList(page, pageSize, filters)
    }

    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status)
    }
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type)
    }
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority)
    }
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy)
    }

    const response = await fetch(`${API_BASE}?${params}`)
    if (!response.ok) throw new Error('Failed to fetch approval list')
    return response.json()
  },

  // ============================================
  // Get Approval Detail
  // ============================================
  async getById(id: string): Promise<ApprovalDetail | null> {
    if (USE_MOCK) {
      await delay(400)
      const approval = getMockApprovalById(id)
      return approval || null
    }

    const response = await fetch(`${API_BASE}/${id}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch approval detail')
    return response.json()
  },

  // ============================================
  // Approve Document
  // ============================================
  async approve(
    id: string,
    data?: { comment?: string; attachments?: File[] }
  ): Promise<ApprovalActionResponse> {
    if (USE_MOCK) {
      await delay(600)
      const updated = updateMockApprovalStatus(id, 'approve', data?.comment)
      if (updated) {
        return {
          success: true,
          message: 'Document approved successfully',
          approval: updated,
        }
      }
      return {
        success: false,
        message: 'Approval not found',
      }
    }

    const formData = new FormData()
    if (data?.comment) formData.append('comment', data.comment)
    if (data?.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file)
      })
    }

    const response = await fetch(`${API_BASE}/${id}/approve`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to approve document')
    return response.json()
  },

  // ============================================
  // Reject Document
  // ============================================
  async reject(
    id: string,
    data?: { comment?: string; attachments?: File[] }
  ): Promise<ApprovalActionResponse> {
    if (USE_MOCK) {
      await delay(600)
      const updated = updateMockApprovalStatus(id, 'reject', data?.comment)
      if (updated) {
        return {
          success: true,
          message: 'Document rejected successfully',
          approval: updated,
        }
      }
      return {
        success: false,
        message: 'Approval not found',
      }
    }

    const formData = new FormData()
    if (data?.comment) formData.append('comment', data.comment)
    if (data?.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file)
      })
    }

    const response = await fetch(`${API_BASE}/${id}/reject`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to reject document')
    return response.json()
  },

  // ============================================
  // Request More Info
  // ============================================
  async requestMoreInfo(
    id: string,
    data?: { comment?: string; attachments?: File[] }
  ): Promise<ApprovalActionResponse> {
    if (USE_MOCK) {
      await delay(600)
      const updated = updateMockApprovalStatus(id, 'request_more_info', data?.comment)
      if (updated) {
        return {
          success: true,
          message: 'Request for more info sent successfully',
          approval: updated,
        }
      }
      return {
        success: false,
        message: 'Approval not found',
      }
    }

    const formData = new FormData()
    if (data?.comment) formData.append('comment', data.comment)
    if (data?.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file)
      })
    }

    const response = await fetch(`${API_BASE}/${id}/request-more-info`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to request more info')
    return response.json()
  },

  // ============================================
  // Download Document
  // ============================================
  async downloadDocument(approvalId: string, documentId: string): Promise<Blob> {
    if (USE_MOCK) {
      await delay(300)
      // Return a mock PDF blob
      const mockContent = 'Mock PDF content'
      return new Blob([mockContent], { type: 'application/pdf' })
    }

    const response = await fetch(
      `${API_BASE}/${approvalId}/documents/${documentId}/download`
    )
    if (!response.ok) throw new Error('Failed to download document')
    return response.blob()
  },

  // ============================================
  // Add Comment
  // ============================================
  async addComment(
    id: string,
    comment: string,
    attachments?: File[]
  ): Promise<ApprovalDetail | null> {
    if (USE_MOCK) {
      await delay(400)
      const approval = getMockApprovalById(id)
      if (approval) {
        const newComment = {
          id: `cmt-${Date.now()}`,
          user: {
            id: 'current-user',
            name: 'Current User',
            role: 'Finance Manager',
            avatar: 'https://i.pravatar.cc/150?u=current',
          },
          content: comment,
          createdAt: new Date().toISOString(),
        }
        approval.comments = [newComment, ...(approval.comments ?? [])]
        return approval
      }
      return null
    }

    const formData = new FormData()
    formData.append('comment', comment)
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file)
      })
    }

    const response = await fetch(`${API_BASE}/${id}/comments`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to add comment')
    return response.json()
  },
}

// ============================================
// Export individual functions for convenience
// ============================================

export const {
  getStats: getApprovalStats,
  getList: getApprovalList,
  getById: getApprovalById,
  approve: approveDocument,
  reject: rejectDocument,
  requestMoreInfo: requestMoreInfoDocument,
  downloadDocument: downloadApprovalDocument,
  addComment: addApprovalComment,
} = approvalService
