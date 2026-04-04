/**
 * Notification Mock Data
 * ข้อมูลตัวอย่างสำหรับระบบแจ้งเตือน
 */
import type { Notification, NotificationResponse } from '~/types/notification.type'
import { NotificationType, NotificationPriority, NotificationStatus } from '~/types/notification.type'

// ข้อมูลแจ้งเตือนตัวอย่าง
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.APPROVAL,
    title: 'Approval Required',
    message: 'Contract APR-2024-1205 needs your approval',
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    metadata: {
      contractId: 'APR-2024-1205',
      url: '/approvals/APR-2024-1205'
    }
  },
  {
    id: '2',
    type: NotificationType.TASK,
    title: 'Task Due Soon',
    message: 'Follow up with Global Freight Solutions - Due in 2 hours',
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    metadata: {
      taskId: 'TASK-2024-089',
      url: '/tasks/TASK-2024-089'
    }
  },
  {
    id: '3',
    type: NotificationType.DEAL,
    title: 'Deal Updated',
    message: 'Deal D-2024-089 moved to Negotiation stage',
    priority: NotificationPriority.MEDIUM,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    metadata: {
      dealId: 'D-2024-089',
      url: '/deals/D-2024-089'
    }
  },
  {
    id: '4',
    type: NotificationType.COMMENT,
    title: 'New Comment',
    message: 'Sarah Chen mentioned you in a comment',
    priority: NotificationPriority.MEDIUM,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    metadata: {
      commentId: 'COMMENT-2024-156',
      url: '/comments/COMMENT-2024-156'
    }
  },
  {
    id: '5',
    type: NotificationType.CUSTOMER,
    title: 'New Customer',
    message: 'Global Tech Industries added to your account',
    priority: NotificationPriority.LOW,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    metadata: {
      customerId: 'CUST-2024-234',
      url: '/customers/CUST-2024-234'
    }
  },
  {
    id: '6',
    type: NotificationType.SYSTEM,
    title: 'System Update',
    message: 'Weekly report is now available for download',
    priority: NotificationPriority.LOW,
    status: NotificationStatus.READ,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    readAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    metadata: {
      url: '/reports/weekly'
    }
  },
  {
    id: '7',
    type: NotificationType.APPROVAL,
    title: 'Approval Completed',
    message: 'Your quotation Q-2024-156 has been approved',
    priority: NotificationPriority.MEDIUM,
    status: NotificationStatus.READ,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    readAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    metadata: {
      quotationId: 'Q-2024-156',
      url: '/quotations/Q-2024-156'
    }
  },
  {
    id: '8',
    type: NotificationType.DEAL,
    title: 'Deal Won',
    message: 'Congratulations! Deal D-2024-075 is closed-won ($2.5M)',
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.READ,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
    readAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    metadata: {
      dealId: 'D-2024-075',
      url: '/deals/D-2024-075'
    }
  }
]

// Mock Response
export const mockNotificationResponse: NotificationResponse = {
  notifications: mockNotifications,
  pagination: {
    page: 1,
    limit: 20,
    total: mockNotifications.length,
    hasMore: false
  },
  unreadCount: mockNotifications.filter(n => n.status === NotificationStatus.UNREAD).length,
  totalCount: mockNotifications.length
}

// Mock Unread Count
export const mockUnreadCount = {
  count: 4
}

// Mock API Handlers
export const notificationMockHandlers = {
  // GET /api/notifications
  getNotifications: (page: number = 1, limit: number = 20) => {
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedNotifications = mockNotifications.slice(start, end)
    
    return {
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: mockNotifications.length,
        hasMore: end < mockNotifications.length
      },
      unreadCount: mockNotifications.filter(n => n.status === NotificationStatus.UNREAD).length,
      totalCount: mockNotifications.length
    }
  },

  // GET /api/notifications/unread-count
  getUnreadCount: () => mockUnreadCount,

  // POST /api/notifications/:id/read
  markAsRead: (notificationId: string) => {
    const notification = mockNotifications.find(n => n.id === notificationId)
    if (notification) {
      notification.status = NotificationStatus.READ
      notification.readAt = new Date().toISOString()
    }
    return { success: true }
  },

  // POST /api/notifications/mark-all-read
  markAllAsRead: () => {
    mockNotifications.forEach(n => {
      if (n.status === NotificationStatus.UNREAD) {
        n.status = NotificationStatus.READ
        n.readAt = new Date().toISOString()
      }
    })
    return { success: true, count: mockNotifications.length }
  },

  // DELETE /api/notifications/:id
  deleteNotification: (notificationId: string) => {
    const index = mockNotifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      mockNotifications.splice(index, 1)
    }
    return { success: true }
  },

  // DELETE /api/notifications
  deleteAllNotifications: () => {
    mockNotifications.length = 0
    return { success: true }
  }
}

// Generate new notification (for WebSocket simulation)
export const generateMockNotification = (): Notification => {
  const types = Object.values(NotificationType)
  const priorities = Object.values(NotificationPriority)
  
  return {
    id: `new-${Date.now()}`,
    type: types[Math.floor(Math.random() * types.length)],
    title: 'New Notification',
    message: 'This is a new real-time notification',
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: NotificationStatus.UNREAD,
    createdAt: new Date().toISOString()
  }
}
