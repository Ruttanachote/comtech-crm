# Notification System

ระบบแจ้งเตือนสำหรับ COMTECH CRM พร้อมรองรับ WebSocket สำหรับ Real-time updates

## โครงสร้างไฟล์

```
app/
├── components/notification/
│   ├── NotificationDropdown.vue    # Component หลัก
│   ├── NotificationBell.vue        # ไอคอนกระดิ่ง
│   ├── NotificationPanel.vue       # กล่องแจ้งเตือน
│   ├── NotificationItem.vue        # รายการแจ้งเตือน
│   ├── NotificationIcon.vue        # ไอคอนตามประเภท
│   └── README.md                   # เอกสารนี้
├── composables/
│   └── useNotification.ts          # Composable สำหรับจัดการ notifications
├── stores/
│   └── notification.store.ts       # Pinia store
├── services/
│   └── notification.service.ts     # API & WebSocket service
├── types/
│   └── notification.type.ts        # TypeScript types
└── data/mock/
    └── notification.mock.ts        # Mock data

i18n/locales/
├── en.notifications.json           # ภาษาอังกฤษ
└── th.notifications.json           # ภาษาไทย

server/websocket/
└── notification.server.ts          # WebSocket server สำหรับทดสอบ
```

## การใช้งาน

### 1. ใส่ Component ใน Header

```vue
<template>
  <header>
    <!-- ... other header items ... -->
    <NotificationDropdown />
  </header>
</template>

<script setup>
import NotificationDropdown from '~/components/notification/NotificationDropdown.vue'
</script>
```

### 2. เริ่ม WebSocket Server (สำหรับทดสอบ)

```bash
# ติดตั้ง dependencies
npm install ws

# รัน WebSocket server
npx tsx server/websocket/notification.server.ts
```

### 3. ตั้งค่า Environment Variables

```env
# .env
VITE_WS_URL=ws://localhost:3001/ws/notifications
```

## Features

### ประเภทการแจ้งเตือน
- **Approval** - การอนุมัติ
- **Task** - งาน
- **Deal** - ดีล
- **Comment** - ความคิดเห็น
- **Customer** - ลูกค้า
- **System** - ระบบ
- **Quotation** - ใบเสนอราคา

### ฟีเจอร์
- ✅ แสดงจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน (Badge)
- ✅ แยก Tab ระหว่าง "ทั้งหมด" และ "ยังไม่ได้อ่าน"
- ✅ ทำเครื่องหมายว่าอ่านแล้ว (รายการเดียว / ทั้งหมด)
- ✅ ลบการแจ้งเตือน
- ✅ แสดงระดับความสำคัญ (สูง/ปานกลาง/ต่ำ)
- ✅ แสดงเวลาที่ผ่านมา (Just now, 5 minutes ago, etc.)
- ✅ WebSocket Real-time updates
- ✅ รองรับ i18n (ไทย/อังกฤษ)
- ✅ Responsive design

## API Endpoints

```
GET    /api/notifications          # ดึงรายการแจ้งเตือน
GET    /api/notifications/unread-count  # ดึงจำนวนที่ยังไม่ได้อ่าน
POST   /api/notifications/:id/read      # ทำเครื่องหมายว่าอ่านแล้ว
POST   /api/notifications/mark-all-read # ทำเครื่องหมายว่าอ่านทั้งหมด
DELETE /api/notifications/:id           # ลบการแจ้งเตือน
DELETE /api/notifications               # ลบทั้งหมด
```

## WebSocket Events

### Client → Server
```typescript
// Mark as read
{ type: 'markAsRead', data: 'notification-id', timestamp: '...' }

// Mark all as read
{ type: 'markAllAsRead', data: [], timestamp: '...' }

// Delete notification
{ type: 'delete', data: 'notification-id', timestamp: '...' }
```

### Server → Client
```typescript
// New notification
{ type: 'notification', data: Notification, timestamp: '...' }

// Mark as read confirmation
{ type: 'markAsRead', data: 'notification-id', timestamp: '...' }

// Mark all as read confirmation
{ type: 'markAllAsRead', data: [], timestamp: '...' }

// Delete confirmation
{ type: 'delete', data: 'notification-id', timestamp: '...' }
```

## การปรับแต่ง

### เพิ่มประเภทการแจ้งเตือนใหม่

1. เพิ่มใน `types/notification.type.ts`:
```typescript
export enum NotificationType {
  // ... existing types
  NEW_TYPE = 'newType'
}
```

2. เพิ่มไอคอนใน `components/notification/NotificationIcon.vue`:
```typescript
[NotificationType.NEW_TYPE]: {
  icon: 'i-heroicons-icon-name',
  bgColor: '#...',
  iconColor: '#...'
}
```

3. เพิ่มข้อความใน i18n files

## ข้อควรระวัง

- ใน Production ควรใช้ HTTPS/WSS
- ควรมีการ Authentication สำหรับ WebSocket
- ควรมีการจำกัดจำนวน notifications ที่เก็บไว้
- ควรมีการจัดการ rate limiting สำหรับ API
