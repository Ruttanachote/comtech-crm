# Todo Module

โมดูลจัดการงาน (To-Do List) สำหรับติดตามและบริหารจัดการงานต่างๆ

## โครงสร้างไฟล์

```
app/components/todo/
├── TaskDetailModal.vue   # Modal สำหรับสร้าง/แก้ไขงาน
└── README.md             # เอกสารนี้
```

## Components

### TaskDetailModal.vue
- Modal สำหรับ **สร้างงานใหม่** หรือ **แก้ไขงาน** ที่มีอยู่
- ฟิลด์ที่รับข้อมูล:
  - Task Name (หัวข้องาน) *required
  - Task Type (ประเภทงาน) *required
  - Priority (ความสำคัญ: High/Medium/Low) *required
  - Related Customer (ลูกค้าที่เกี่ยวข้อง)
  - Related Deal (ดีลที่เกี่ยวข้อง)
  - Due Date (กำหนดเสร็จ) *required
  - Reminder (แจ้งเตือน)
  - Owner (ผู้รับผิดชอบ) *required
  - Notes (หมายเหตุ)

## การใช้งาน

```vue
<script setup>
import TaskDetailModal from '~/components/todo/TaskDetailModal.vue'

const isModalOpen = ref(false)
const selectedTask = ref(null)

const handleCreate = () => {
  selectedTask.value = null
  isModalOpen.value = true
}

const handleEdit = (task) => {
  selectedTask.value = task
  isModalOpen.value = true
}
</script>

<template>
  <TaskDetailModal
    :open-modal="isModalOpen"
    :task="selectedTask"
    @close="isModalOpen = false"
    @saved="handleSaved"
  />
</template>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `openModal` | boolean | ✓ | ควบคุมการแสดง/ซ่อน Modal |
| `task` | Task | ✗ | ข้อมูลงานสำหรับแก้ไข (null = สร้างใหม่) |

## Events

| Event | Description |
|-------|-------------|
| `close` | ปิด Modal |
| `saved` | บันทึกสำเร็จ |

## Dependencies

- `useTasksStore` - Pinia store สำหรับจัดการ tasks
- `useToast` - แสดง notifications
- `CommonButton`, `CommonSelection` - UI components

## Related Files

- `app/pages/todo-list/index.vue` - หน้ารายการงานหลัก
- `stores/useTasksStore.ts` - Store สำหรับ tasks
- `i18n/locales/*.json` - ไฟล์ภาษา
