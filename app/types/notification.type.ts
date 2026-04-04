/**
 * Notification Types
 * กำหนด Type สำหรับระบบแจ้งเตือน
 */

// ประเภทของการแจ้งเตือน
export enum NotificationType {
  APPROVAL = 'approval',
  TASK = 'task',
  DEAL = 'deal',
  COMMENT = 'comment',
  CUSTOMER = 'customer',
  SYSTEM = 'system',
  QUOTATION = 'quotation'
}

// ระดับความสำคัญ
export enum NotificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// สถานะการอ่าน
export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread'
}

// Interface หลักสำหรับ Notification
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: string
  readAt?: string
  metadata?: NotificationMetadata
  userId?: string
  avatar?: string
}

// Metadata สำหรับแต่ละประเภท
export interface NotificationMetadata {
  contractId?: string
  taskId?: string
  dealId?: string
  commentId?: string
  customerId?: string
  quotationId?: string
  url?: string
  actionText?: string
}

// Filter Options
export interface NotificationFilter {
  type?: NotificationType
  priority?: NotificationPriority
  status?: NotificationStatus
  startDate?: string
  endDate?: string
}

// Pagination
export interface NotificationPagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Response จาก API
export interface NotificationResponse {
  notifications: Notification[]
  pagination: NotificationPagination
  unreadCount: number
  totalCount: number
}

// WebSocket Message
export interface NotificationWebSocketMessage {
  type: 'notification' | 'markAsRead' | 'markAllAsRead' | 'delete'
  data: Notification | string | string[]
  timestamp: string
}

// Notification Tab
export type NotificationTab = 'all' | 'unread'

// Notification Icon Config
export interface NotificationIconConfig {
  icon: string
  bgColor: string
  iconColor: string
}

// Notification Group
export interface NotificationGroup {
  date: string
  notifications: Notification[]
}
