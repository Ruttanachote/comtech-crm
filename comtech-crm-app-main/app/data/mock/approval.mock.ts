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
  ApprovalStatus,
  ApprovalStep,
} from '~/types/approval.type'

// ============================================
// Workflow Builder Helper
// ============================================

function buildWorkflow(
  status: ApprovalStatus,
  currentStepId: ApprovalStep,
  submittedAt: string,
  senderName: string,
): WorkflowStep[] {
  const baseCompletedBy = [senderName, 'Michael Park', 'Finance Manager', 'Legal Team', 'CEO']
  const baseSteps = [
    { id: 'submitted' as ApprovalStep, name: 'Submitted', nameTh: 'ส่งเอกสาร', order: 1, assignedTo: senderName },
    { id: 'sales_manager' as ApprovalStep, name: 'Sales Manager', nameTh: 'ผู้จัดการฝ่ายขาย', order: 2, assignedTo: 'Michael Park' },
    { id: 'finance_review' as ApprovalStep, name: 'Finance Review', nameTh: 'ตรวจสอบทางการเงิน', order: 3, assignedTo: 'Finance Manager' },
    { id: 'legal_compliance' as ApprovalStep, name: 'Legal & Compliance', nameTh: 'กฎหมายและการปฏิบัติตาม', order: 4, assignedTo: 'Legal Team' },
    { id: 'final_approval' as ApprovalStep, name: 'Final Approval', nameTh: 'อนุมัติขั้นสุดท้าย', order: 5, assignedTo: 'CEO' },
  ]

  const submitTime = new Date(submittedAt).getTime()

  if (status === 'approved') {
    return baseSteps.map((step, i) => ({
      ...step,
      status: 'completed' as const,
      completedAt: new Date(submitTime + i * 2 * 24 * 60 * 60 * 1000).toISOString(),
      completedBy: baseCompletedBy[i],
    }))
  }

  const currentOrder = baseSteps.find(s => s.id === currentStepId)?.order ?? 1
  return baseSteps.map((step, i) => {
    if (step.order < currentOrder) {
      return {
        ...step,
        status: 'completed' as const,
        completedAt: new Date(submitTime + i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: baseCompletedBy[i],
      }
    }
    if (step.order === currentOrder) {
      return { ...step, status: 'current' as const }
    }
    return { ...step, status: 'pending' as const }
  })
}

// ============================================
// Shared Documents & Comments Templates
// ============================================

const sharedDocuments: ApprovalDocument[] = [
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
// Approval List Items (19 items — all cases)
// ============================================

export const mockApprovalItems: ApprovalItem[] = [

  // ─── PENDING ────────────────────────────────────────────────
  {
    id: 'apr-001',
    documentNumber: 'APR-2024-1205',
    title: 'International Freight Agreement - Global Freight Solutions',
    description: 'Master service agreement for international freight services',
    type: 'contract',
    priority: 'urgent',
    status: 'pending',
    customer: { id: 'cust-001', name: 'Global Freight Solutions Inc.', logo: '/logos/global-freight.png' },
    value: 2450000,
    currency: 'THB',
    sender: { id: 'user-1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', department: 'Sales' },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-10T08:00:00Z',
    daysWaiting: 3,
    tags: ['freight', 'international'],
  },
  {
    id: 'apr-002',
    documentNumber: 'APR-2024-1198',
    title: 'Warehousing Services Quotation - Pacific Trade Corp',
    description: 'Quotation for warehousing and storage services',
    type: 'quotation',
    priority: 'medium',
    status: 'pending',
    customer: { id: 'cust-002', name: 'Pacific Trade Corp', logo: '/logos/pacific-trade.png' },
    value: 185000,
    currency: 'THB',
    sender: { id: 'user-3', name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael', department: 'Sales' },
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
    title: 'Multi-Modal Transport Contract - Tech Innovations Ltd',
    description: 'Multi-modal transportation services contract',
    type: 'contract',
    priority: 'medium',
    status: 'pending',
    customer: { id: 'cust-003', name: 'Tech Innovations Ltd', logo: '/logos/tech-innovations.png' },
    value: 780000,
    currency: 'THB',
    sender: { id: 'user-4', name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?u=lisa', department: 'Sales' },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'ผู้จัดการฝ่ายขาย',
    submittedAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    daysWaiting: 20,
    tags: ['multimodal', 'transport'],
  },
  {
    id: 'apr-004',
    documentNumber: 'APR-2024-1165',
    title: 'Expedited Shipping Quotation - North American Traders',
    description: 'Quotation for expedited shipping services',
    type: 'quotation',
    priority: 'high',
    status: 'pending',
    customer: { id: 'cust-004', name: 'North American Traders', logo: '/logos/nat.png' },
    value: 520000,
    currency: 'THB',
    sender: { id: 'user-5', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', department: 'Sales' },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-11-12T09:00:00Z',
    updatedAt: '2024-11-12T09:00:00Z',
    daysWaiting: 28,
    tags: ['expedited', 'shipping'],
  },
  {
    id: 'apr-005',
    documentNumber: 'APR-2024-1156',
    title: 'Cold Chain Logistics Contract - Fresh Foods Inc',
    description: 'Cold chain logistics and temperature-controlled transport',
    type: 'contract',
    priority: 'low',
    status: 'pending',
    customer: { id: 'cust-005', name: 'Fresh Foods Inc', logo: '/logos/fresh-foods.png' },
    value: 320000,
    currency: 'THB',
    sender: { id: 'user-6', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david', department: 'Sales' },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'ผู้จัดการฝ่ายขาย',
    submittedAt: '2024-11-10T11:00:00Z',
    updatedAt: '2024-11-10T11:00:00Z',
    daysWaiting: 30,
    tags: ['coldchain', 'food', 'temperature'],
  },
  {
    id: 'apr-006',
    documentNumber: 'APR-2024-1212',
    title: 'IT Infrastructure Services Invoice - DataTech Solutions',
    description: 'Invoice for IT infrastructure setup and maintenance',
    type: 'invoice',
    priority: 'high',
    status: 'pending',
    customer: { id: 'cust-006', name: 'DataTech Solutions', logo: '/logos/datatech.png' },
    value: 1250000,
    currency: 'THB',
    sender: { id: 'user-1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', department: 'Sales' },
    currentStep: 'legal_compliance',
    currentStepName: 'Legal & Compliance',
    currentStepNameTh: 'กฎหมายและการปฏิบัติตาม',
    submittedAt: '2024-12-08T09:00:00Z',
    updatedAt: '2024-12-08T09:00:00Z',
    daysWaiting: 5,
    tags: ['invoice', 'IT'],
  },
  {
    id: 'apr-007',
    documentNumber: 'APR-2024-1210',
    title: 'Heavy Equipment Purchase Order - Machinery Corp',
    description: 'Purchase order for warehouse heavy equipment',
    type: 'purchase_order',
    priority: 'urgent',
    status: 'pending',
    customer: { id: 'cust-007', name: 'Machinery Corp', logo: '/logos/machinery.png' },
    value: 3800000,
    currency: 'THB',
    sender: { id: 'user-3', name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael', department: 'Procurement' },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-12-09T08:30:00Z',
    updatedAt: '2024-12-09T08:30:00Z',
    daysWaiting: 4,
    tags: ['equipment', 'purchase'],
  },
  {
    id: 'apr-008',
    documentNumber: 'APR-2024-1215',
    title: 'Q4 Training Program Expense - HR Department',
    description: 'Staff training and development expense claim',
    type: 'expense',
    priority: 'low',
    status: 'pending',
    customer: { id: 'cust-008', name: 'HR Department', logo: '/logos/hr.png' },
    value: 95000,
    currency: 'THB',
    sender: { id: 'user-4', name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?u=lisa', department: 'HR' },
    currentStep: 'submitted',
    currentStepName: 'Submitted',
    currentStepNameTh: 'ส่งเอกสาร',
    submittedAt: '2024-12-12T11:00:00Z',
    updatedAt: '2024-12-12T11:00:00Z',
    daysWaiting: 1,
    tags: ['expense', 'training'],
  },
  {
    id: 'apr-009',
    documentNumber: 'APR-2024-1208',
    title: 'Partner Discount Agreement - EastAsia Logistics',
    description: 'Volume discount agreement for long-term partnership',
    type: 'discount',
    priority: 'medium',
    status: 'pending',
    customer: { id: 'cust-009', name: 'EastAsia Logistics', logo: '/logos/eastasia.png' },
    value: 450000,
    currency: 'THB',
    sender: { id: 'user-5', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', department: 'Sales' },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'ผู้จัดการฝ่ายขาย',
    submittedAt: '2024-12-07T10:00:00Z',
    updatedAt: '2024-12-07T10:00:00Z',
    daysWaiting: 6,
    tags: ['discount', 'partnership'],
  },

  // ─── APPROVED ───────────────────────────────────────────────
  {
    id: 'apr-010',
    documentNumber: 'APR-2024-1101',
    title: 'Air Freight Service Contract - SkyBridge Cargo',
    description: 'Annual air freight service agreement',
    type: 'contract',
    priority: 'high',
    status: 'approved',
    customer: { id: 'cust-010', name: 'SkyBridge Cargo', logo: '/logos/skybridge.png' },
    value: 1800000,
    currency: 'THB',
    sender: { id: 'user-6', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david', department: 'Sales' },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    daysWaiting: 0,
    tags: ['air', 'freight'],
  },
  {
    id: 'apr-011',
    documentNumber: 'APR-2024-1088',
    title: 'Sea Freight Quotation - OceanLink Trading',
    description: 'Competitive quotation for sea freight routes',
    type: 'quotation',
    priority: 'medium',
    status: 'approved',
    customer: { id: 'cust-011', name: 'OceanLink Trading', logo: '/logos/oceanlink.png' },
    value: 650000,
    currency: 'THB',
    sender: { id: 'user-1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', department: 'Sales' },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-10-20T10:00:00Z',
    updatedAt: '2024-11-05T16:00:00Z',
    daysWaiting: 0,
    tags: ['sea', 'freight'],
  },
  {
    id: 'apr-012',
    documentNumber: 'APR-2024-1130',
    title: 'Customs Clearance Invoice - BorderPro Services',
    description: 'Invoice for customs clearance services Q4',
    type: 'invoice',
    priority: 'low',
    status: 'approved',
    customer: { id: 'cust-012', name: 'BorderPro Services', logo: '/logos/borderpro.png' },
    value: 120000,
    currency: 'THB',
    sender: { id: 'user-3', name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael', department: 'Operations' },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-11-25T09:00:00Z',
    updatedAt: '2024-12-03T11:00:00Z',
    daysWaiting: 0,
    tags: ['customs', 'invoice'],
  },
  {
    id: 'apr-013',
    documentNumber: 'APR-2024-1145',
    title: 'Forklift Purchase Order - Industrial Supply Co.',
    description: 'Purchase of 3 forklifts for warehouse expansion',
    type: 'purchase_order',
    priority: 'medium',
    status: 'approved',
    customer: { id: 'cust-013', name: 'Industrial Supply Co.', logo: '/logos/industrial.png' },
    value: 860000,
    currency: 'THB',
    sender: { id: 'user-4', name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?u=lisa', department: 'Procurement' },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-11-18T10:00:00Z',
    updatedAt: '2024-11-28T15:00:00Z',
    daysWaiting: 0,
    tags: ['purchase', 'warehouse'],
  },
  {
    id: 'apr-014',
    documentNumber: 'APR-2024-1160',
    title: 'Bangkok Summit Conference Expense - Events Team',
    description: 'Business conference attendance and accommodation',
    type: 'expense',
    priority: 'low',
    status: 'approved',
    customer: { id: 'cust-014', name: 'Events Team', logo: '/logos/events.png' },
    value: 78000,
    currency: 'THB',
    sender: { id: 'user-5', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', department: 'Marketing' },
    currentStep: 'final_approval',
    currentStepName: 'Final Approval',
    currentStepNameTh: 'อนุมัติขั้นสุดท้าย',
    submittedAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-08T12:00:00Z',
    daysWaiting: 0,
    tags: ['expense', 'conference'],
  },

  // ─── REJECTED ───────────────────────────────────────────────
  {
    id: 'apr-015',
    documentNumber: 'APR-2024-1115',
    title: 'Premium Freight Contract - Overbudget Logistics',
    description: 'Contract rejected due to pricing exceeding budget threshold',
    type: 'contract',
    priority: 'high',
    status: 'rejected',
    customer: { id: 'cust-015', name: 'Premium Logistics Ltd', logo: '/logos/premium.png' },
    value: 4500000,
    currency: 'THB',
    sender: { id: 'user-6', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david', department: 'Sales' },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-18T10:30:00Z',
    daysWaiting: 0,
    tags: ['rejected', 'overbudget'],
  },
  {
    id: 'apr-016',
    documentNumber: 'APR-2024-1122',
    title: 'Revised Shipping Quotation - Fast Freight Co.',
    description: 'Quotation rejected - rates not competitive',
    type: 'quotation',
    priority: 'medium',
    status: 'rejected',
    customer: { id: 'cust-016', name: 'Fast Freight Co.', logo: '/logos/fastfreight.png' },
    value: 290000,
    currency: 'THB',
    sender: { id: 'user-1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', department: 'Sales' },
    currentStep: 'sales_manager',
    currentStepName: 'Sales Manager',
    currentStepNameTh: 'ผู้จัดการฝ่ายขาย',
    submittedAt: '2024-11-28T10:00:00Z',
    updatedAt: '2024-12-02T14:00:00Z',
    daysWaiting: 0,
    tags: ['rejected', 'shipping'],
  },
  {
    id: 'apr-017',
    documentNumber: 'APR-2024-1214',
    title: 'Duplicate Customs Invoice - Border Services Ltd.',
    description: 'Invoice rejected - duplicate of APR-2024-1130',
    type: 'invoice',
    priority: 'low',
    status: 'rejected',
    customer: { id: 'cust-017', name: 'Border Services Ltd.', logo: '/logos/border.png' },
    value: 45000,
    currency: 'THB',
    sender: { id: 'user-3', name: 'Michael Park', avatar: 'https://i.pravatar.cc/150?u=michael', department: 'Operations' },
    currentStep: 'submitted',
    currentStepName: 'Submitted',
    currentStepNameTh: 'ส่งเอกสาร',
    submittedAt: '2024-12-11T08:00:00Z',
    updatedAt: '2024-12-11T16:00:00Z',
    daysWaiting: 0,
    tags: ['rejected', 'duplicate'],
  },

  // ─── REQUEST MORE INFO ───────────────────────────────────────
  {
    id: 'apr-018',
    documentNumber: 'APR-2024-1207',
    title: 'Long-haul Rail Transport Contract - TransRail Corp',
    description: 'Complex multi-year rail transport agreement pending clarification',
    type: 'contract',
    priority: 'urgent',
    status: 'request_more_info',
    customer: { id: 'cust-018', name: 'TransRail Corp', logo: '/logos/transrail.png' },
    value: 2100000,
    currency: 'THB',
    sender: { id: 'user-5', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', department: 'Sales' },
    currentStep: 'legal_compliance',
    currentStepName: 'Legal & Compliance',
    currentStepNameTh: 'กฎหมายและการปฏิบัติตาม',
    submittedAt: '2024-12-06T09:00:00Z',
    updatedAt: '2024-12-10T11:00:00Z',
    daysWaiting: 7,
    tags: ['rail', 'contract'],
  },
  {
    id: 'apr-019',
    documentNumber: 'APR-2024-1203',
    title: 'Annual Freight Rate Quotation - Pacific Carriers',
    description: 'Annual rate card requiring financial justification documents',
    type: 'quotation',
    priority: 'high',
    status: 'request_more_info',
    customer: { id: 'cust-019', name: 'Pacific Carriers', logo: '/logos/pacific-carriers.png' },
    value: 890000,
    currency: 'THB',
    sender: { id: 'user-4', name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/150?u=lisa', department: 'Sales' },
    currentStep: 'finance_review',
    currentStepName: 'Finance Review',
    currentStepNameTh: 'ตรวจสอบทางการเงิน',
    submittedAt: '2024-12-04T10:00:00Z',
    updatedAt: '2024-12-09T09:30:00Z',
    daysWaiting: 9,
    tags: ['quotation', 'annual'],
  },
]

// ============================================
// Dynamic Stats (computed from items)
// ============================================

export function getMockApprovalStats(): ApprovalStats {
  return {
    total: mockApprovalItems.length,
    pending: mockApprovalItems.filter(i => i.status === 'pending').length,
    approved: mockApprovalItems.filter(i => i.status === 'approved').length,
    rejected: mockApprovalItems.filter(i => i.status === 'rejected').length,
  }
}

// ============================================
// Workflow Steps (for ApprovalCard popup)
// ============================================

export const mockWorkflowSteps: WorkflowStep[] = [
  { id: 'submitted', name: 'Submitted', nameTh: 'ส่งเอกสาร', order: 1, status: 'completed', completedAt: '2024-12-12T10:30:00Z', completedBy: 'Sarah Chen', assignedTo: 'Sarah Chen' },
  { id: 'sales_manager', name: 'Sales Manager', nameTh: 'ผู้จัดการฝ่ายขาย', order: 2, status: 'completed', completedAt: '2024-12-13T14:15:00Z', completedBy: 'Michael Park', assignedTo: 'Michael Park' },
  { id: 'finance_review', name: 'Finance Review', nameTh: 'ตรวจสอบทางการเงิน', order: 3, status: 'current', assignedTo: 'Finance Manager' },
  { id: 'legal_compliance', name: 'Legal & Compliance', nameTh: 'กฎหมายและการปฏิบัติตาม', order: 4, status: 'pending', assignedTo: 'Legal Team' },
  { id: 'final_approval', name: 'Final Approval', nameTh: 'อนุมัติขั้นสุดท้าย', order: 5, status: 'pending', assignedTo: 'CEO' },
]

// ============================================
// Shared Activity & Comment templates
// ============================================

const baseActivities: ApprovalActivity[] = [
  {
    id: 'act-1',
    action: 'submitted',
    user: { id: 'user-1', name: 'Sarah Chen', role: 'Sales Representative', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    timestamp: '2024-12-12T10:30:00Z',
    step: 'submitted',
  },
  {
    id: 'act-2',
    action: 'approved',
    user: { id: 'user-2', name: 'Michael Park', role: 'Sales Manager', avatar: 'https://i.pravatar.cc/150?u=michael' },
    comment: 'Deal terms look good, pricing is competitive.',
    timestamp: '2024-12-13T14:15:00Z',
    step: 'sales_manager',
  },
]

const baseComments: ApprovalComment[] = [
  {
    id: 'cmt-1',
    user: { id: 'user-2', name: 'Michael Park', role: 'Sales Manager', avatar: 'https://i.pravatar.cc/150?u=michael' },
    content: 'Deal terms look good, pricing is competitive.',
    createdAt: '2024-12-13T14:15:00Z',
  },
]

// ============================================
// Approval Details (Full Data)
// ============================================

export const mockApprovalDetails: ApprovalDetail[] = mockApprovalItems.map(item => ({
  ...item,
  contractType: 'Master Service',
  contractDuration: '24 months',
  startDate: '2025-01-01',
  endDate: '2026-12-31',
  paymentTerms: 'Net 30',
  businessUnit: 'Air Freight',
  serviceType: 'International',
  workflow: buildWorkflow(item.status, item.currentStep, item.submittedAt, item.sender.name),
  activities: [...baseActivities],
  documents: [...sharedDocuments],
  comments: [...baseComments],
  nextApprovers: item.status === 'pending'
    ? [{ id: 'user-7', name: 'Finance Manager', role: 'Finance Manager', avatar: 'https://i.pravatar.cc/150?u=finance' }]
    : [],
}))

// ============================================
// Helper Functions
// ============================================

export function getMockApprovalById(id: string): ApprovalDetail | undefined {
  return mockApprovalDetails.find(approval => approval.id === id)
}

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export function getMockApprovalList(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    status?: string
    type?: string
    priority?: string
    search?: string
    sortBy?: string
  }
): {
  items: ApprovalItem[]
  total: number
  page: number
  pageSize: number
  stats: ApprovalStats
} {
  let filtered = [...mockApprovalItems]

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

  const sortBy = filters?.sortBy || 'date_new_old'
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date_new_old':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      case 'date_old_new':
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      case 'value':
        return b.value - a.value
      case 'priority':
        return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    }
  })

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filtered.slice(start, end)

  return {
    items: paginated,
    total: filtered.length,
    page,
    pageSize,
    stats: getMockApprovalStats(),
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

  const newActivity: ApprovalActivity = {
    id: `act-${Date.now()}`,
    action: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'request_more_info',
    user: currentUser,
    comment,
    timestamp: now,
    step: approval.currentStep,
  }

  approval.activities.unshift(newActivity)

  if (action === 'approve') {
    const currentStepIndex = approval.workflow.findIndex(s => s.status === 'current')
    if (currentStepIndex >= 0) {
      const currentStep = approval.workflow[currentStepIndex]!
      currentStep.status = 'completed'
      currentStep.completedAt = now
      currentStep.completedBy = currentUser.name

      if (currentStepIndex < approval.workflow.length - 1) {
        const nextStep = approval.workflow[currentStepIndex + 1]!
        nextStep.status = 'current'
        approval.currentStep = nextStep.id
        approval.currentStepName = nextStep.name
        approval.currentStepNameTh = nextStep.nameTh ?? nextStep.name
        approval.status = 'pending'
      } else {
        approval.status = 'approved'
      }
    }
  } else if (action === 'reject') {
    approval.status = 'rejected'
  } else {
    approval.status = 'request_more_info'
  }

  approval.updatedAt = now

  // Sync status back to mockApprovalItems so list reflects the change
  const itemIndex = mockApprovalItems.findIndex(i => i.id === id)
  if (itemIndex !== -1) {
    const existing = mockApprovalItems[itemIndex]!
    mockApprovalItems[itemIndex] = {
      ...existing,
      status: approval.status,
      currentStep: approval.currentStep,
      currentStepName: approval.currentStepName,
      currentStepNameTh: approval.currentStepNameTh,
      updatedAt: now,
    }
  }

  return approval
}
