# Notification Module

โมดูลการแจ้งเตือน (Notification System) แบบ Real-time ด้วย WebSocket

## โครงสร้างไฟล์

```
app/components/notification/
├── NotificationDropdown.vue   # Dropdown หลักสำหรับแสดงการแจ้งเตือน
├── NotificationBell.vue       # ไอคอนกระดิ่งพร้อม Badge
├── NotificationPanel.vue      # Panel แสดงรายการแจ้งเตือน
├── NotificationItem.vue       # รายการแจ้งเตือนแต่ละรายการ
├── NotificationIcon.vue       # ไอคอนประเภทการแจ้งเตือน
└── README.md                  # เอกสารนี้
```

## Components

### NotificationDropdown.vue
- **Component หลัก** ที่รวมทุกอย่างไว้
- ประกอบด้วย:
  - NotificationBell (ไอคอนกระดิ่ง)
  - NotificationPanel (panel แสดงรายการ)
- รองรับการคลิกนอกพื้นที่เพื่อปิด

### NotificationBell.vue
- ไอคอนกระดิ่ง
- Badge แสดงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
- Animation เมื่อมีการแจ้งเตือนใหม่

### NotificationPanel.vue
- Panel แสดงรายการการแจ้งเตือน
- Tabs: **All** / **Unread**
- ปุ่ม "Mark all as read"
- Empty state

### NotificationItem.vue
- แสดงข้อมูลการแจ้งเตือนแต่ละรายการ:
  - Icon (ตามประเภท)
  - Title
  - Message
  - Time (เวลาที่ผ่านมา)
  - Priority indicator
- รองรับการคลิกเพื่ออ่าน
- รองรับการลบ

### NotificationIcon.vue
- ไอคอนตามประเภทการแจ้งเตือน:
  - `task` - งาน
  - `approval` - การอนุมัติ
  - `system` - ระบบ
  - `message` - ข้อความ
  - `alert` - แจ้งเตือน

## การใช้งาน

```vue
<template>
  <NotificationDropdown />
</template>
```

หรือใช้ใน Header:

```vue
<template>
  <header>
    <NotificationDropdown />
  </header>
</template>
```

## Features

- ✅ Real-time notifications via WebSocket
- ✅ Badge count for unread notifications
- ✅ Tab filtering (All / Unread)
- ✅ Mark as read (single / all)
- ✅ Delete notifications
- ✅ Priority levels (High/Medium/Low)
- ✅ Time ago formatting
- ✅ i18n support (TH/EN)
- ✅ Responsive design
- ✅ Click outside to close

## WebSocket Events

```typescript
// Client → Server
{ type: 'subscribe', userId: string }
{ type: 'markAsRead', notificationId: string }
{ type: 'markAllAsRead', userId: string }
{ type: 'delete', notificationId: string }

// Server → Client
{ type: 'notification', data: Notification }
{ type: 'unreadCount', count: number }
```

## Types

```typescript
interface Notification {
  id: string
  type: 'task' | 'approval' | 'system' | 'message' | 'alert'
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  read: boolean
  createdAt: string
  link?: string
}
```

## Data Flow

```
NotificationDropdown.vue
    ↓
useNotification() composable
    ↓
notification.store.ts (Pinia)
    ↓
notification.service.ts (WebSocket + API)
    ↓
WebSocket Server / notification.mock.ts
```

## Related Files

- `app/composables/useNotification.ts`
- `app/stores/notification.store.ts`
- `app/services/notification.service.ts`
- `app/types/notification.type.ts`
- `app/data/mock/notification.mock.ts`
- `server/websocket/notification.server.ts`
- `i18n/locales/en.notifications.json`
- `i18n/locales/th.notifications.json`
