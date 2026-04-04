# Approval Module

โมดูลอนุมัติเอกสาร (Document Approval) สำหรับจัดการและติดตามการอนุมัติเอกสารต่างๆ

## โครงสร้างไฟล์

```
app/components/approval/
├── ApprovalStats.vue         # สถิติการอนุมัติ (All/Pending/Approved/Rejected)
├── ApprovalCard.vue          # การ์ดแสดงข้อมูลเอกสารแต่ละรายการ
├── ApprovalList.vue          # รายการเอกสารพร้อม Pagination
├── ApprovalFilters.vue       # แถบกรองและค้นหา
├── ApprovalConfirmModal.vue  # Modal ยืนยันการอนุมัติ/ปฏิเสธ
└── README.md                 # เอกสารนี้
```

## Components

### ApprovalStats.vue
- แสดงสถิติการอนุมัติ 4 ประเภท:
  - **All** (ทั้งหมด)
  - **Pending** (รอดำเนินการ)
  - **Approved** (อนุมัติแล้ว)
  - **Rejected** (ปฏิเสธ)
- คลิกที่แต่ละการ์ดเพื่อกรองข้อมูล

### ApprovalCard.vue
- แสดงข้อมูลเอกสาร:
  - Document Number (เลขที่เอกสาร)
  - Priority Badge (ด่วน/ปานกลาง/ต่ำ)
  - Title (ชื่อเอกสาร)
  - Customer (ลูกค้า)
  - Value (มูลค่า)
  - Sender (ผู้ส่ง)
  - Waiting At (รออนุมัติที่)
  - Days Pending (จำนวนวันที่รอ)
- ปุ่ม **อนุมัติ** และ **ปฏิเสธ**

### ApprovalList.vue
- แสดงรายการ ApprovalCard
- Pagination (แบ่งหน้า)
- Empty state (เมื่อไม่มีข้อมูล)

### ApprovalFilters.vue
- Search (ค้นหา)
- Status Filter (กรองตามสถานะ)
- Type Filter (กรองตามประเภท)
- Priority Filter (กรองตามความสำคัญ)
- Sort (เรียงลำดับ)
- Export (ส่งออก Excel/CSV)

### ApprovalConfirmModal.vue
- Modal ยืนยันการอนุมัติ/ปฏิเสธ
- ช่องกรอก Comment (ความคิดเห็น)

## การใช้งาน

```vue
<template>
  <div>
    <ApprovalStats v-model:filters="filters" :stats="stats" />
    <ApprovalFilters
      v-model:filters="filters"
      :has-active-filters="hasActiveFilters"
      @clear-filters="resetFilters"
      @export="handleExport"
    />
    <ApprovalList
      :documents="documents"
      :is-loading="isLoading"
      @approve="handleApprove"
      @reject="handleReject"
    />
    <ApprovalConfirmModal
      v-model="showConfirmModal"
      :action="pendingAction"
      :document="selectedDocument"
      @confirm="handleConfirm"
    />
  </div>
</template>
```

## Data Flow

```
approvals/index.vue (Page)
    ↓
useApproval() composable
    ↓
approval.store.ts (Pinia)
    ↓
approval.service.ts (API)
    ↓
approval.mock.ts (Mock Data)
```

## Types

```typescript
interface ApprovalDocument {
  id: string
  documentNumber: string
  title: string
  customerName: string
  value: number
  priority: 'urgent' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  sender: { name: string, department: string }
  currentStep: string
  daysPending: number
}
```

## Related Files

- `app/pages/approvals/index.vue` - หน้าหลัก
- `app/composables/useApproval.ts`
- `app/stores/approval.store.ts`
- `app/services/approval.service.ts`
- `app/types/approval.type.ts`
- `app/data/mock/approval.mock.ts`
- `i18n/locales/en.approval.json`
- `i18n/locales/th.approval.json`
