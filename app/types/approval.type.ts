/**
 * Approval Module Type Definitions
 * โมดูลอนุมัติเอกสาร - ประเภทข้อมูล
 */

// Approval Status
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'all'

// Approval Priority
export type ApprovalPriority = 'urgent' | 'medium' | 'low'

// Approval Type/Category
export type ApprovalType = 'freight' | 'warehousing' | 'transport' | 'shipping' | 'logistics' | 'other'

// Approval Step/Stage
export type ApprovalStep = 
  | 'finance_review' 
  | 'final_approval' 
  | 'sales_manager' 
  | 'operations' 
  | 'legal_review'

// Approval Stats
export interface ApprovalStats {
  all: number
  pending: number
  approved: number
  rejected: number
}

// Approval Document
export interface ApprovalDocument {
  id: string
  documentNumber: string
  title: string
  description?: string
  customerName: string
  customerId: string
  value: number
  currency: string
  priority: ApprovalPriority
  status: ApprovalStatus
  type: ApprovalType
  sender: {
    id: string
    name: string
    avatar?: string
    department: string
  }
  currentStep: ApprovalStep
  daysPending: number
  createdAt: string
  updatedAt: string
  attachments?: string[]
  notes?: string
  history?: ApprovalHistoryItem[]
}

// Approval History Item
export interface ApprovalHistoryItem {
  id: string
  action: 'submitted' | 'approved' | 'rejected' | 'commented' | 'forwarded'
  actor: {
    id: string
    name: string
    avatar?: string
  }
  comment?: string
  timestamp: string
}

// Approval Filters
export interface ApprovalFilters {
  status: ApprovalStatus
  type: ApprovalType | 'all'
  priority: ApprovalPriority | 'all'
  search: string
  sortBy: 'newest' | 'oldest' | 'value_high' | 'value_low' | 'priority'
  dateRange?: {
    from?: string
    to?: string
  }
}

// Approval Action Request
export interface ApprovalActionRequest {
  documentId: string
  action: 'approve' | 'reject'
  comment?: string
}

// Approval Action Response
export interface ApprovalActionResponse {
  success: boolean
  message: string
  document?: ApprovalDocument
}

// Pagination
export interface ApprovalPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Approval List Response
export interface ApprovalListResponse {
  documents: ApprovalDocument[]
  stats: ApprovalStats
  pagination: ApprovalPagination
}

// Priority Config
export interface PriorityConfig {
  key: ApprovalPriority
  label: string
  labelEn: string
  icon: string
  color: string
  bgColor: string
}

// Status Config
export interface StatusConfig {
  key: ApprovalStatus
  label: string
  labelEn: string
  color: string
  bgColor: string
}

// Step Config
export interface StepConfig {
  key: ApprovalStep
  label: string
  labelEn: string
}
