// Approval Mock Data
// Based on Figma Design: https://data-excel-25664879.figma.site/

import type {
  ApprovalItem,
  ApprovalDetail,
  ApprovalStats,
  ApprovalActivity,
  WorkflowStep,
  ApprovalDocument,
  ApprovalComment,
} from '~/types/approval.type'

// ============================================
// Approval Statistics
// ============================================
export const mockApprovalStats: ApprovalStats = {
  total: 5,
  pending: 5,
  approved: 0,
  rejected: 0,
}

// ============================================
// Workflow Steps Template
// ============================================
export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: 'submitted',
    name: 'Submitted',
    nameTh: 'ส่งแล้ว',
    order: 1,
    status: 'completed',
    completedAt: '2024-12-12T10:30:00Z',
    completedBy: 'Sarah Chen',
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    nameTh: 'จัดการฝ่ายขาย',
    order: 2,
    status: 'completed',
    completedAt: '2024-12-13T14:15:00Z',
    completedBy: 'Michael Park',
  },
  {
    id: 'finance_review',
    name: 'Finance Review',
    nameTh: 'ตรวจสอบทางการเงิน',
    order: 3,
    status: 'current',
  },
  {
    id: 'legal_compliance',
    name: 'Legal & Compliance',
    nameTh: 'กฎหมายและการปฏิบัติตาม',
    order: 4,
    status: 'pending',
  },
  {
    id: 'final_approval',
    name: 'Final Approval',
    nameTh: 'อนุมัติขั้นสุดท้าย',
    order: 5,
    status: 'pending',
  },
]

// ============================================
// Approval Activities
// ============================================
export const mockActivities: ApprovalActivity[] = [
  {
    id: 'act-1',
    action: 'submitted',
    user: {
      id: 'user-1',
      name: 'Sarah Chen',
      role: 'Sales Representative',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    timestamp: '2024-12-12T10:30:00Z',
    step: 'submitted',
  },
  {
    id: 'act-2',
    action: 'approved',
    user: {
      id: 'user-2',
      name: 'Michael Park',
      role: 'Sales Manager',
      avatar: 'https://i.pravatar.cc/150?u=michael',
    },
    comment: 'Deal terms look good, pricing is competitive.',
    timestamp: '2024-12-13T14:15:00Z',
    step: 'sales_manager',
  },
]

// ============================================
// Approval Documents
// ============================================
export const mockDocuments: ApprovalDocument[] = [
  {
    id: 'doc-1',
    name: 'Master_Service_Agreement_v2.pdf',
    type: 'application/pdf',
    size: '2.4 MB',
    url: '/documents/Master_Service_Agreement_v2.pdf',
    uploadedAt: '2024-12-12T10:30:00Z',
    uploadedBy: 'Sarah Chen',
  },
  {
    id: 'doc-2',
    name: 'Pricing_Schedule_2024.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: '856 KB',
    url: '/documents/Pricing_Schedule_2024.xlsx',
    uploadedAt: '2024-12-12T10:32:00Z',
    uploadedBy: 'Sarah Chen',
  },
]

// ============================================
// Approval Comments
// ============================================
export const mockComments: ApprovalComment[] = [
  {
    id: 'cmt-1',
    user: {
      id: 'user-2',
      name: 'Michael Park',
      role: 'Sales Manager',
      avatar: 'https://i.pravatar.cc/150?u=michael',
    },
    content: 'Deal terms look good, pricing is competitive.',
    createdAt: '2024-12-13T14:15:00Z',
  },
]

// ============================================
// Approval List Items
// ============================================
export const mockApprovalItems: ApprovalItem[] = [
  {
    id: 'apr-001',
    documentNumber: 'APR-2024-1205',
    title: 'International Freight Agreement - Global Freight Solutions',
    description: 'Master service agreement for international freight services',
    type: 'contract',
    priority: 'urgent',
    status: 'pending',
    customer: {
      id: 'cust-001',
      name: 'Global Freight Solutions Inc.',
      logo: '/logos/global-freight.png',
    },
    value: 2450000,
    currency: 'THB',
    sender: {
      id: 'user-1',
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      department: 'Sales',
    },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-10T08:00:00Z',
    daysWaiting: 3,
    tags: ['freight', 'international', 'urgent'],
  },
  {
    id: 'apr-002',
    documentNumber: 'APR-2024-1198',
    title: 'Warehousing Services - Pacific Trade Corp',
    description: 'Warehousing and storage services agreement',
    type: 'contract',
    priority: 'medium',
    status: 'pending',
    customer: {
      id: 'cust-002',
      name: 'Pacific Trade Corp',
      logo: '/logos/pacific-trade.png',
    },
    value: 185000,
    currency: 'THB',
    sender: {
      id: 'user-3',
      name: 'Michael Park',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      department: 'Sales',
    },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-12-05T10:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
    daysWaiting: 8,
    tags: ['warehousing', 'storage'],
  },
  {
    id: 'apr-003',
    documentNumber: 'APR-2024-1182',
    title: 'Multi-Modal Transport - Tech Innovations Ltd',
    description: 'Multi-modal transportation services contract',
    type: 'contract',
    priority: 'medium',
    status: 'pending',
    customer: {
      id: 'cust-003',
      name: 'Tech Innovations Ltd',
      logo: '/logos/tech-innovations.png',
    },
    value: 780000,
    currency: 'THB',
    sender: {
      id: 'user-4',
      name: 'Lisa Anderson',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
      department: 'Sales',
    },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'จัดการฝ่ายขาย',
    submittedAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    daysWaiting: 20,
    tags: ['multimodal', 'transport'],
  },
  {
    id: 'apr-004',
    documentNumber: 'APR-2024-1165',
    title: 'Expedited Shipping - North American Traders',
    description: 'Expedited shipping services agreement',
    type: 'contract',
    priority: 'urgent',
    status: 'pending',
    customer: {
      id: 'cust-004',
      name: 'North American Traders',
      logo: '/logos/nat.png',
    },
    value: 520000,
    currency: 'THB',
    sender: {
      id: 'user-5',
      name: 'Maria Garcia',
      avatar: 'https://i.pravatar.cc/150?u=maria',
      department: 'Sales',
    },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-11-12T09:00:00Z',
    updatedAt: '2024-11-12T09:00:00Z',
    daysWaiting: 28,
    tags: ['expedited', 'shipping', 'urgent'],
  },
  {
    id: 'apr-005',
    documentNumber: 'APR-2024-1156',
    title: 'Cold Chain Logistics - Fresh Foods Inc',
    description: 'Cold chain logistics and temperature-controlled transport',
    type: 'contract',
    priority: 'urgent',
    status: 'pending',
    customer: {
      id: 'cust-005',
      name: 'Fresh Foods Inc',
      logo: '/logos/fresh-foods.png',
    },
    value: 320000,
    currency: 'THB',
    sender: {
      id: 'user-6',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?u=david',
      department: 'Sales',
    },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'จัดการฝ่ายขาย',
    submittedAt: '2024-11-10T11:00:00Z',
    updatedAt: '2024-11-10T11:00:00Z',
    daysWaiting: 30,
    tags: ['coldchain', 'food', 'temperature'],
  },
]

// ============================================
// Approval Details (Full Data)
// ============================================
export const mockApprovalDetails: ApprovalDetail[] = mockApprovalItems.map((item, index) => ({
  ...item,
  contractType: 'Master Service',
  contractDuration: '24 months',
  startDate: '2025-01-01',
  endDate: '2026-12-31',
  paymentTerms: 'Net 30',
  businessUnit: 'Air Freight',
  serviceType: 'International',
  workflow: mockWorkflowSteps.map(step => ({
    ...step,
    status: step.order <= 2 ? 'completed' : step.order === 3 ? 'current' : 'pending',
  })),
  activities: mockActivities,
  documents: mockDocuments,
  comments: mockComments,
  nextApprovers: [
    {
      id: 'user-7',
      name: 'Finance Manager',
      role: 'Finance Manager',
      avatar: 'https://i.pravatar.cc/150?u=finance',
    },
  ],
}))

// ============================================
// Helper Functions
// ============================================

export function getMockApprovalById(id: string): ApprovalDetail | undefined {
  return mockApprovalDetails.find(approval => approval.id === id)
}

export function getMockApprovalList(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    status?: string
    type?: string
    priority?: string
    search?: string
  }
): {
  items: ApprovalItem[]
  total: number
  page: number
  pageSize: number
  stats: ApprovalStats
} {
  let filtered = [...mockApprovalItems]

  // Apply filters
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status)
  }

  if (filters?.type && filters.type !== 'all') {
    filtered = filtered.filter(item => item.type === filters.type)
  }

  if (filters?.priority && filters.priority !== 'all') {
    filtered = filtered.filter(item => item.priority === filters.priority)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.documentNumber.toLowerCase().includes(searchLower) ||
        item.customer.name.toLowerCase().includes(searchLower)
    )
  }

  // Pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filtered.slice(start, end)

  return {
    items: paginated,
    total: filtered.length,
    page,
    pageSize,
    stats: mockApprovalStats,
  }
}

export function updateMockApprovalStatus(
  id: string,
  action: 'approve' | 'reject' | 'request_more_info',
  comment?: string
): ApprovalDetail | undefined {
  const approval = mockApprovalDetails.find(a => a.id === id)
  if (!approval) return undefined

  const now = new Date().toISOString()
  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    role: 'Finance Manager',
    avatar: 'https://i.pravatar.cc/150?u=current',
  }

  // Add activity
  const newActivity: ApprovalActivity = {
    id: `act-${Date.now()}`,
    action: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'request_more_info',
    user: currentUser,
    comment,
    timestamp: now,
    step: approval.currentStep,
  }

  approval.activities.unshift(newActivity)

  // Update status
  if (action === 'approve') {
    approval.status = 'approved'
    // Move to next step
    const currentStepIndex = approval.workflow.findIndex(s => s.status === 'current')
    if (currentStepIndex >= 0 && currentStepIndex < approval.workflow.length - 1) {
      approval.workflow[currentStepIndex].status = 'completed'
      approval.workflow[currentStepIndex].completedAt = now
      approval.workflow[currentStepIndex].completedBy = currentUser.name
      approval.workflow[currentStepIndex + 1].status = 'current'
      approval.currentStep = approval.workflow[currentStepIndex + 1].id
      approval.currentStepName = approval.workflow[currentStepIndex + 1].name
      approval.currentStepNameTh = approval.workflow[currentStepIndex + 1].nameTh
    }
  } else if (action === 'reject') {
    approval.status = 'rejected'
  }

  approval.updatedAt = now

  return approval
}
