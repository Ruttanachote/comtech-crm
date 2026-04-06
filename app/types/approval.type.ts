// Approval System Types
// Based on Figma Design: https://data-excel-25664879.figma.site/

// ============================================
// Approval Status
// ============================================
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'request_more_info'

// ============================================
// Approval Priority
// ============================================
export type ApprovalPriority = 'urgent' | 'high' | 'medium' | 'low'

// ============================================
// Approval Step/Stage
// ============================================
export type ApprovalStep = 
  | 'submitted'
  | 'sales_manager'
  | 'finance_review'
  | 'legal_compliance'
  | 'final_approval'
  | 'completed'
  | 'rejected'

// ============================================
// Approval Type/Category
// ============================================
export type ApprovalType = 
  | 'contract'
  | 'quotation'
  | 'invoice'
  | 'purchase_order'
  | 'expense'
  | 'discount'
  | 'other'

// ============================================
// Approval Stats
// ============================================
export interface ApprovalStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

// ============================================
// Approval Document
// ============================================
export interface ApprovalDocument {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

// ============================================
// Approval Activity/History
// ============================================
export interface ApprovalActivity {
  id: string
  action: 'submitted' | 'approved' | 'rejected' | 'request_more_info' | 'commented'
  user: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  comment?: string
  timestamp: string
  step?: ApprovalStep
}

// ============================================
// Approval Workflow Step
// ============================================
export interface WorkflowStep {
  id: ApprovalStep
  name: string
  nameTh: string
  order: number
  status: 'completed' | 'current' | 'pending'
  completedAt?: string
  completedBy?: string
}

// ============================================
// Approval Item (List View)
// ============================================
export interface ApprovalItem {
  id: string
  documentNumber: string
  title: string
  description?: string
  type: ApprovalType
  priority: ApprovalPriority
  status: ApprovalStatus
  
  // Customer Info
  customer: {
    id: string
    name: string
    logo?: string
  }
  
  // Financial
  value: number
  currency: string
  
  // Sender/Requester
  sender: {
    id: string
    name: string
    avatar?: string
    department: string
  }
  
  // Current Step
  currentStep: ApprovalStep
  currentStepName: string
  currentStepNameTh: string
  
  // Timestamps
  submittedAt: string
  updatedAt: string
  daysWaiting: number
  
  // Additional
  tags?: string[]
}

// ============================================
// Approval Detail (Full View)
// ============================================
export interface ApprovalDetail extends ApprovalItem {
  // Contract Details
  contractType?: string
  contractDuration?: string
  startDate?: string
  endDate?: string
  paymentTerms?: string
  
  // Business Info
  businessUnit?: string
  serviceType?: string
  
  // Workflow
  workflow: WorkflowStep[]
  
  // Activities/History
  activities: ApprovalActivity[]
  
  // Documents
  documents: ApprovalDocument[]
  
  // Comments
  comments?: ApprovalComment[]
  
  // Next Approvers
  nextApprovers?: {
    id: string
    name: string
    role: string
    avatar?: string
  }[]
}

// ============================================
// Approval Comment
// ============================================
export interface ApprovalComment {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  attachments?: ApprovalDocument[]
  createdAt: string
}

// ============================================
// Approval Filters
// ============================================
export interface ApprovalFilters {
  status?: ApprovalStatus | 'all'
  type?: ApprovalType | 'all'
  priority?: ApprovalPriority | 'all'
  search?: string
  dateRange?: {
    start: string
    end: string
  }
  sortBy?: 'newest' | 'oldest' | 'priority' | 'value'
}

// ============================================
// Approval Action Request
// ============================================
export interface ApprovalActionRequest {
  action: 'approve' | 'reject' | 'request_more_info'
  comment?: string
  attachments?: File[]
}

// ============================================
// Approval Action Response
// ============================================
export interface ApprovalActionResponse {
  success: boolean
  message: string
  approval?: ApprovalDetail
}

// ============================================
// Approval List Response
// ============================================
export interface ApprovalListResponse {
  items: ApprovalItem[]
  total: number
  page: number
  pageSize: number
  stats: ApprovalStats
}

// ============================================
// Approval Form Data (for creating new)
// ============================================
export interface ApprovalFormData {
  title: string
  description?: string
  type: ApprovalType
  customerId: string
  value: number
  currency: string
  documents?: File[]
  approvers?: string[]
}
