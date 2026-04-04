/**
 * Approval Mock Data
 * ข้อมูลจำลองสำหรับโมดูลอนุมัติเอกสาร
 */
import type {
  ApprovalDocument,
  ApprovalStats,
  PriorityConfig,
  StatusConfig,
  StepConfig
} from '~/types/approval.type'

// Priority Configurations
export const priorityConfigs: PriorityConfig[] = [
  {
    key: 'urgent',
    label: 'ด่วน',
    labelEn: 'Urgent',
    icon: 'i-heroicons-exclamation-triangle',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    key: 'medium',
    label: 'ปานกลาง',
    labelEn: 'Medium',
    icon: 'i-heroicons-clock',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    key: 'low',
    label: 'ต่ำ',
    labelEn: 'Low',
    icon: 'i-heroicons-arrow-down',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
]

// Status Configurations
export const statusConfigs: StatusConfig[] = [
  {
    key: 'all',
    label: 'ทั้งหมด',
    labelEn: 'All',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  },
  {
    key: 'pending',
    label: 'รอดำเนินการ',
    labelEn: 'Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100'
  },
  {
    key: 'approved',
    label: 'อนุมัติ',
    labelEn: 'Approved',
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  {
    key: 'rejected',
    label: 'ปฏิเสธ',
    labelEn: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  }
]

// Step Configurations
export const stepConfigs: StepConfig[] = [
  {
    key: 'finance_review',
    label: 'Finance Review',
    labelEn: 'Finance Review'
  },
  {
    key: 'final_approval',
    label: 'Final Approval',
    labelEn: 'Final Approval'
  },
  {
    key: 'sales_manager',
    label: 'Sales Manager',
    labelEn: 'Sales Manager'
  },
  {
    key: 'operations',
    label: 'Operations',
    labelEn: 'Operations'
  },
  {
    key: 'legal_review',
    label: 'Legal Review',
    labelEn: 'Legal Review'
  }
]

// Mock Approval Documents
export const mockApprovalDocuments: ApprovalDocument[] = [
  {
    id: '1',
    documentNumber: 'APR-2024-1205',
    title: 'International Freight Agreement - Global Freight Solutions',
    description: 'Agreement for international freight services including air and ocean freight for Q1 2024',
    customerName: 'Global Freight Solutions Inc.',
    customerId: 'CUST-001',
    value: 2450000,
    currency: 'THB',
    priority: 'urgent',
    status: 'pending',
    type: 'freight',
    sender: {
      id: 'USER-001',
      name: 'Sarah Chen',
      department: 'Sales'
    },
    currentStep: 'finance_review',
    daysPending: 3,
    createdAt: '2024-12-02T10:30:00Z',
    updatedAt: '2024-12-02T10:30:00Z',
    attachments: ['contract.pdf', 'pricing_sheet.xlsx'],
    history: [
      {
        id: 'HIST-001',
        action: 'submitted',
        actor: { id: 'USER-001', name: 'Sarah Chen' },
        timestamp: '2024-12-02T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    documentNumber: 'APR-2024-1198',
    title: 'Warehousing Services - Pacific Trade Corp',
    description: 'Warehousing and distribution services agreement for 12 months',
    customerName: 'Pacific Trade Corp',
    customerId: 'CUST-002',
    value: 185000,
    currency: 'THB',
    priority: 'medium',
    status: 'pending',
    type: 'warehousing',
    sender: {
      id: 'USER-002',
      name: 'Michael Park',
      department: 'Operations'
    },
    currentStep: 'final_approval',
    daysPending: 8,
    createdAt: '2024-11-27T14:15:00Z',
    updatedAt: '2024-11-27T14:15:00Z',
    attachments: ['service_agreement.pdf'],
    history: [
      {
        id: 'HIST-002',
        action: 'submitted',
        actor: { id: 'USER-002', name: 'Michael Park' },
        timestamp: '2024-11-27T14:15:00Z'
      },
      {
        id: 'HIST-003',
        action: 'approved',
        actor: { id: 'USER-003', name: 'Finance Manager' },
        comment: 'Pricing approved',
        timestamp: '2024-12-03T09:00:00Z'
      }
    ]
  },
  {
    id: '3',
    documentNumber: 'APR-2024-1182',
    title: 'Multi-Modal Transport - Tech Innovations Ltd',
    description: 'Multi-modal transportation services covering road, rail, and sea',
    customerName: 'Tech Innovations Ltd',
    customerId: 'CUST-003',
    value: 780000,
    currency: 'THB',
    priority: 'medium',
    status: 'pending',
    type: 'transport',
    sender: {
      id: 'USER-004',
      name: 'Lisa Anderson',
      department: 'Sales'
    },
    currentStep: 'sales_manager',
    daysPending: 20,
    createdAt: '2024-11-15T11:00:00Z',
    updatedAt: '2024-11-15T11:00:00Z',
    attachments: ['proposal.pdf', 'route_map.pdf'],
    history: [
      {
        id: 'HIST-004',
        action: 'submitted',
        actor: { id: 'USER-004', name: 'Lisa Anderson' },
        timestamp: '2024-11-15T11:00:00Z'
      }
    ]
  },
  {
    id: '4',
    documentNumber: 'APR-2024-1165',
    title: 'Expedited Shipping - North American Traders',
    description: 'Expedited shipping services for time-critical deliveries',
    customerName: 'North American Traders',
    customerId: 'CUST-004',
    value: 520000,
    currency: 'THB',
    priority: 'urgent',
    status: 'pending',
    type: 'shipping',
    sender: {
      id: 'USER-005',
      name: 'Maria Garcia',
      department: 'Sales'
    },
    currentStep: 'finance_review',
    daysPending: 28,
    createdAt: '2024-11-07T16:45:00Z',
    updatedAt: '2024-11-07T16:45:00Z',
    attachments: ['urgent_request.pdf'],
    history: [
      {
        id: 'HIST-005',
        action: 'submitted',
        actor: { id: 'USER-005', name: 'Maria Garcia' },
        timestamp: '2024-11-07T16:45:00Z'
      }
    ]
  },
  {
    id: '5',
    documentNumber: 'APR-2024-1156',
    title: 'Cold Chain Logistics - Fresh Foods Inc',
    description: 'Temperature-controlled logistics services for perishable goods',
    customerName: 'Fresh Foods Inc',
    customerId: 'CUST-005',
    value: 320000,
    currency: 'THB',
    priority: 'urgent',
    status: 'pending',
    type: 'logistics',
    sender: {
      id: 'USER-006',
      name: 'David Kim',
      department: 'Sales'
    },
    currentStep: 'sales_manager',
    daysPending: 30,
    createdAt: '2024-11-05T09:30:00Z',
    updatedAt: '2024-11-05T09:30:00Z',
    attachments: ['cold_chain_specs.pdf', 'temp_requirements.pdf'],
    history: [
      {
        id: 'HIST-006',
        action: 'submitted',
        actor: { id: 'USER-006', name: 'David Kim' },
        timestamp: '2024-11-05T09:30:00Z'
      }
    ]
  },
  {
    id: '6',
    documentNumber: 'APR-2024-1145',
    title: 'Customs Brokerage - Asia Export Co',
    description: 'Customs clearance and brokerage services',
    customerName: 'Asia Export Co',
    customerId: 'CUST-006',
    value: 95000,
    currency: 'THB',
    priority: 'low',
    status: 'approved',
    type: 'other',
    sender: {
      id: 'USER-007',
      name: 'Jennifer Lee',
      department: 'Operations'
    },
    currentStep: 'final_approval',
    daysPending: 0,
    createdAt: '2024-10-28T13:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
    attachments: ['customs_form.pdf'],
    history: [
      {
        id: 'HIST-007',
        action: 'submitted',
        actor: { id: 'USER-007', name: 'Jennifer Lee' },
        timestamp: '2024-10-28T13:00:00Z'
      },
      {
        id: 'HIST-008',
        action: 'approved',
        actor: { id: 'USER-008', name: 'Manager' },
        timestamp: '2024-11-01T10:00:00Z'
      }
    ]
  },
  {
    id: '7',
    documentNumber: 'APR-2024-1132',
    title: 'Project Cargo - Industrial Solutions',
    description: 'Heavy lift and project cargo handling services',
    customerName: 'Industrial Solutions',
    customerId: 'CUST-007',
    value: 1500000,
    currency: 'THB',
    priority: 'medium',
    status: 'rejected',
    type: 'freight',
    sender: {
      id: 'USER-009',
      name: 'Robert Taylor',
      department: 'Sales'
    },
    currentStep: 'finance_review',
    daysPending: 0,
    createdAt: '2024-10-20T11:30:00Z',
    updatedAt: '2024-10-25T14:00:00Z',
    attachments: ['project_specs.pdf'],
    history: [
      {
        id: 'HIST-009',
        action: 'submitted',
        actor: { id: 'USER-009', name: 'Robert Taylor' },
        timestamp: '2024-10-20T11:30:00Z'
      },
      {
        id: 'HIST-010',
        action: 'rejected',
        actor: { id: 'USER-010', name: 'Finance Director' },
        comment: 'Budget exceeded for this quarter',
        timestamp: '2024-10-25T14:00:00Z'
      }
    ]
  },
  {
    id: '8',
    documentNumber: 'APR-2024-1125',
    title: 'Last Mile Delivery - E-Commerce Plus',
    description: 'Last mile delivery services for e-commerce orders',
    customerName: 'E-Commerce Plus',
    customerId: 'CUST-008',
    value: 420000,
    currency: 'THB',
    priority: 'medium',
    status: 'pending',
    type: 'transport',
    sender: {
      id: 'USER-011',
      name: 'Emily Wang',
      department: 'Sales'
    },
    currentStep: 'operations',
    daysPending: 45,
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
    attachments: ['delivery_zones.pdf'],
    history: [
      {
        id: 'HIST-011',
        action: 'submitted',
        actor: { id: 'USER-011', name: 'Emily Wang' },
        timestamp: '2024-10-15T10:00:00Z'
      }
    ]
  }
]

// Mock Stats
export const mockApprovalStats: ApprovalStats = {
  all: 8,
  pending: 5,
  approved: 1,
  rejected: 1
}

// Mock Data Object
export interface ApprovalMockData {
  documents: ApprovalDocument[]
  stats: ApprovalStats
  priorityConfigs: PriorityConfig[]
  statusConfigs: StatusConfig[]
  stepConfigs: StepConfig[]
}

export const approvalMockData: ApprovalMockData = {
  documents: mockApprovalDocuments,
  stats: mockApprovalStats,
  priorityConfigs,
  statusConfigs,
  stepConfigs
}

// Composable for accessing mock data
export function useApprovalMock() {
  return {
    approvalMockData,
    mockApprovalDocuments,
    mockApprovalStats,
    priorityConfigs,
    statusConfigs,
    stepConfigs
  }
}

// Helper functions
export function getPriorityConfig(priority: string): PriorityConfig {
  return priorityConfigs.find(p => p.key === priority) || priorityConfigs[1]
}

export function getStatusConfig(status: string): StatusConfig {
  return statusConfigs.find(s => s.key === status) || statusConfigs[0]
}

export function getStepConfig(step: string): StepConfig {
  return stepConfigs.find(s => s.key === step) || stepConfigs[0]
}

export function formatCurrency(value: number, currency: string = 'THB'): string {
  const symbol = currency === 'THB' ? '฿' : currency
  return `${symbol} ${value.toLocaleString('th-TH')}`
}

export function formatDaysAgo(days: number, t: Function): string {
  if (days === 0) return t('approval.today')
  if (days === 1) return t('approval.yesterday')
  return t('approval.daysAgo', { days })
}
