# Approval System

A comprehensive approval management system for COMTECH CRM, matching the Figma design 100%.

## 📁 File Structure

```
app/
├── components/approval/
│   ├── ApprovalStats.vue          # Statistics cards (total, pending, approved, rejected)
│   ├── ApprovalCard.vue           # Individual approval item card
│   ├── ApprovalList.vue           # List container with pagination
│   ├── ApprovalFilters.vue        # Filter controls (status, type, priority, search)
│   ├── ApprovalTimeline.vue       # Workflow step timeline
│   ├── ApprovalActions.vue        # Action buttons (approve, reject, request more info)
│   ├── ApprovalComments.vue       # Activity history and comments
│   ├── ApprovalDocuments.vue      # Document attachments list
│   ├── ApprovalDetail.vue         # Full detail view component
│   └── README.md                  # This file
├── pages/approve/
│   ├── index.vue                  # Approval list page
│   └── [id].vue                   # Approval detail page
├── types/
│   └── approval.type.ts           # TypeScript type definitions
├── stores/
│   └── approval.store.ts          # Pinia state management
├── services/
│   └── approval.service.ts        # API service layer
└── data/mock/
    └── approval.mock.ts           # Mock data for testing

i18n/locales/
├── en.approval.json               # English translations
└── th.approval.json               # Thai translations
```

## 🎯 Features

### List Page (`/approve`)
- **Statistics Cards**: Show total, pending, approved, rejected counts
- **Filter Controls**: Filter by status, type, priority, search text
- **Approval Cards**: Display approval items with:
  - Document number and priority badge
  - Title and customer name
  - Value, sender, current step
  - Days waiting
  - Quick action buttons (approve/reject)
- **Pagination**: Page navigation with page size selector

### Detail Page (`/approve/:id`)
- **Header**: Title, status badge, document number, download button
- **Info Grid**: Total value, customer, business unit, service type
- **Contract Details**: Contract type, duration, dates, payment terms
- **Workflow Timeline**: Visual step-by-step approval process
- **Documents**: Attached files with preview and download
- **Activity History**: Comments and actions timeline
- **Action Section**: Approve, reject, request more info with comments and attachments

## 🎨 Design

100% matching Figma design:
- Colors: Primary blue (#3B82F6), Success emerald (#10B981), Warning amber (#F59E0B), Danger red (#EF4444)
- Typography: Inter font, consistent sizing
- Spacing: 4px grid system
- Shadows: Subtle elevation
- Border radius: 12px for cards, 8px for buttons

## 📊 Data Structure

### Approval Workflow Steps
1. Submitted
2. Sales Manager
3. Finance Review
4. Legal & Compliance
5. Final Approval

### Approval Status
- `pending` - Waiting for approval
- `approved` - Approved
- `rejected` - Rejected
- `request_more_info` - Requested more information

### Priority Levels
- `urgent` - Red badge
- `high` - Orange badge
- `medium` - Amber badge
- `low` - Gray badge

## 🔧 Usage

### Access the Approval List
```vue
<template>
  <ApprovalList
    :items="store.allItems"
    :loading="store.loading"
    :page="store.page"
    :page-size="store.pageSize"
    :total="store.total"
    @approve="handleApprove"
    @reject="handleReject"
    @view="handleView"
  />
</template>
```

### Access the Approval Detail
```vue
<template>
  <ApprovalDetail
    :approval="store.currentApproval"
    :loading="store.isDetailLoading"
    @back="handleBack"
    @approve="handleApprove"
    @reject="handleReject"
    @request-more-info="handleRequestMoreInfo"
  />
</template>
```

### Using the Store
```typescript
import { useApprovalStore } from '~/stores/approval.store'

const store = useApprovalStore()

// Fetch data
await store.fetchStats()
await store.fetchList()

// Access data
const items = store.allItems
const stats = store.currentStats
const selected = store.currentApproval

// Perform actions
await store.approveDocument(id, { comment: 'Looks good!' })
await store.rejectDocument(id, { comment: 'Need more info' })
```

## 🌍 Internationalization

All text is translatable via i18n files:
- `en.approval.json` - English
- `th.approval.json` - Thai

Keys follow the pattern: `approval.{section}.{key}`

## 🧪 Mock Data

Mock data is available in `app/data/mock/approval.mock.ts` with 5 sample approvals:
- APR-2024-1205 - International Freight Agreement (Urgent)
- APR-2024-1198 - Warehousing Services (Medium)
- APR-2024-1182 - Multi-Modal Transport (Medium)
- APR-2024-1165 - Expedited Shipping (Urgent)
- APR-2024-1156 - Cold Chain Logistics (Urgent)

## 🚀 API Integration

The service layer (`approval.service.ts`) is ready for API integration:
- Set `USE_MOCK = false` to use real API
- All functions return promises
- Error handling included
- File upload support

## 📱 Responsive Design

- Mobile: Single column, stacked layout
- Tablet: 2-column grid
- Desktop: Full layout with side-by-side panels
