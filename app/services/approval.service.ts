/**
 * Approval Service
 * บริการจัดการ API สำหรับโมดูลอนุมัติเอกสาร
 */
import type {
  ApprovalDocument,
  ApprovalStats,
  ApprovalFilters,
  ApprovalPagination,
  ApprovalActionRequest,
  ApprovalActionResponse,
  ApprovalListResponse
} from '~/types/approval.type'

export interface GetApprovalsParams {
  page?: number
  limit?: number
  status?: string
  type?: string
  priority?: string
  search?: string
  sortBy?: string
  dateFrom?: string
  dateTo?: string
}

export class ApprovalService {
  private baseUrl: string

  constructor() {
    const config = useRuntimeConfig()
    this.baseUrl = `${config.public.apiBaseUrl}/approvals`
  }

  /**
   * Get approvals list with filters and pagination
   */
  async getApprovals(params: GetApprovalsParams = {}): Promise<ApprovalListResponse> {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      type = 'all',
      priority = 'all',
      search = '',
      sortBy = 'newest'
    } = params

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())
    if (status !== 'all') queryParams.append('status', status)
    if (type !== 'all') queryParams.append('type', type)
    if (priority !== 'all') queryParams.append('priority', priority)
    if (search) queryParams.append('search', search)
    if (sortBy) queryParams.append('sortBy', sortBy)

    try {
      const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching approvals:', error)
      // Return mock data for development
      return this.getMockApprovals(params)
    }
  }

  /**
   * Get approval statistics
   */
  async getStats(): Promise<ApprovalStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching approval stats:', error)
      // Return mock stats for development
      return this.getMockStats()
    }
  }

  /**
   * Get single approval document by ID
   */
  async getDocumentById(id: string): Promise<ApprovalDocument> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching document:', error)
      // Return mock document for development
      return this.getMockDocumentById(id)
    }
  }

  /**
   * Approve a document
   */
  async approveDocument(documentId: string, comment?: string): Promise<ApprovalActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${documentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ comment })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error approving document:', error)
      // Return mock response for development
      return this.getMockActionResponse(documentId, 'approve')
    }
  }

  /**
   * Reject a document
   */
  async rejectDocument(documentId: string, comment?: string): Promise<ApprovalActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${documentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ comment })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error rejecting document:', error)
      // Return mock response for development
      return this.getMockActionResponse(documentId, 'reject')
    }
  }

  /**
   * Export approvals to Excel/CSV
   */
  async exportApprovals(format: 'excel' | 'csv' = 'excel', filters?: ApprovalFilters): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('format', format)
      
      if (filters) {
        if (filters.status !== 'all') queryParams.append('status', filters.status)
        if (filters.type !== 'all') queryParams.append('type', filters.type)
        if (filters.priority !== 'all') queryParams.append('priority', filters.priority)
      }

      const response = await fetch(`${this.baseUrl}/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error exporting approvals:', error)
      throw error
    }
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || ''
    }
    return ''
  }

  // ==================== Mock Data Methods ====================

  private getMockApprovals(params: GetApprovalsParams): ApprovalListResponse {
    const { approvalMockData } = useApprovalMock()
    
    let documents = [...approvalMockData.documents]
    
    // Apply filters
    if (params.status && params.status !== 'all') {
      documents = documents.filter(doc => doc.status === params.status)
    }
    
    if (params.type && params.type !== 'all') {
      documents = documents.filter(doc => doc.type === params.type)
    }
    
    if (params.priority && params.priority !== 'all') {
      documents = documents.filter(doc => doc.priority === params.priority)
    }
    
    if (params.search) {
      const search = params.search.toLowerCase()
      documents = documents.filter(doc => 
        doc.title.toLowerCase().includes(search) ||
        doc.documentNumber.toLowerCase().includes(search) ||
        doc.customerName.toLowerCase().includes(search)
      )
    }
    
    // Apply sorting
    switch (params.sortBy) {
      case 'oldest':
        documents.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'value_high':
        documents.sort((a, b) => b.value - a.value)
        break
      case 'value_low':
        documents.sort((a, b) => a.value - b.value)
        break
      default:
        documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedDocuments = documents.slice(start, end)
    
    return {
      documents: paginatedDocuments,
      stats: approvalMockData.stats,
      pagination: {
        page,
        limit,
        total: documents.length,
        totalPages: Math.ceil(documents.length / limit)
      }
    }
  }

  private getMockStats(): ApprovalStats {
    const { approvalMockData } = useApprovalMock()
    return approvalMockData.stats
  }

  private getMockDocumentById(id: string): ApprovalDocument {
    const { approvalMockData } = useApprovalMock()
    const document = approvalMockData.documents.find(doc => doc.id === id)
    if (!document) {
      throw new Error('Document not found')
    }
    return document
  }

  private getMockActionResponse(documentId: string, action: 'approve' | 'reject'): ApprovalActionResponse {
    const { approvalMockData } = useApprovalMock()
    const document = approvalMockData.documents.find(doc => doc.id === documentId)
    
    if (!document) {
      return {
        success: false,
        message: 'Document not found'
      }
    }
    
    return {
      success: true,
      message: action === 'approve' ? 'Document approved successfully' : 'Document rejected successfully',
      document: {
        ...document,
        status: action === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date().toISOString()
      }
    }
  }
}

// Factory function for Nuxt plugin
export function createApprovalService() {
  return new ApprovalService()
}
