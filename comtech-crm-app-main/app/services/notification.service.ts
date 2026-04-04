/**
 * Notification Service
 * จัดการ API Calls และ WebSocket Connection
 */
import type {
  Notification,
  NotificationResponse,
  NotificationFilter,
  NotificationWebSocketMessage
} from '~/types/notification.type'

// API Base URL
const API_BASE_URL = '/api/notifications'

// WebSocket URL
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws/notifications'

export class NotificationService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 3000
  private messageHandlers: ((message: NotificationWebSocketMessage) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  // ============ HTTP API Methods ============

  /**
   * ดึงรายการแจ้งเตือนทั้งหมด
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filter?: NotificationFilter
  ): Promise<NotificationResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })

    if (filter?.status) params.append('status', filter.status)
    if (filter?.type) params.append('type', filter.type)
    if (filter?.priority) params.append('priority', filter.priority)

    const response = await fetch(`${API_BASE_URL}?${params}`)
    if (!response.ok) throw new Error('Failed to fetch notifications')
    return response.json()
  }

  /**
   * ดึงจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน
   */
  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/unread-count`)
    if (!response.ok) throw new Error('Failed to fetch unread count')
    const data = await response.json()
    return data.count
  }

  /**
   * ทำเครื่องหมายว่าอ่านแล้ว
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to mark as read')
  }

  /**
   * ทำเครื่องหมายว่าอ่านทั้งหมด
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to mark all as read')
  }

  /**
   * ลบการแจ้งเตือน
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete notification')
  }

  /**
   * ลบการแจ้งเตือนทั้งหมด
   */
  async deleteAllNotifications(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete all notifications')
  }

  // ============ WebSocket Methods ============

  /**
   * เชื่อมต่อ WebSocket
   */
  connect(userId?: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }

    const url = userId ? `${WS_URL}?userId=${userId}` : WS_URL
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      this.notifyConnectionHandlers(true)
    }

    this.ws.onmessage = (event) => {
      try {
        const message: NotificationWebSocketMessage = JSON.parse(event.data)
        this.notifyMessageHandlers(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.notifyConnectionHandlers(false)
      this.attemptReconnect(userId)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  /**
   * ตัดการเชื่อมต่อ WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * พยายามเชื่อมต่อใหม่
   */
  private attemptReconnect(userId?: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.connect(userId)
    }, this.reconnectInterval)
  }

  /**
   * ส่งข้อความผ่าน WebSocket
   */
  sendMessage(message: NotificationWebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  /**
   * ลงทะเบียน handler สำหรับข้อความ
   */
  onMessage(handler: (message: NotificationWebSocketMessage) => void): () => void {
    this.messageHandlers.push(handler)
    return () => {
      const index = this.messageHandlers.indexOf(handler)
      if (index !== -1) {
        this.messageHandlers.splice(index, 1)
      }
    }
  }

  /**
   * ลงทะเบียน handler สำหรับการเชื่อมต่อ
   */
  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler)
    return () => {
      const index = this.connectionHandlers.indexOf(handler)
      if (index !== -1) {
        this.connectionHandlers.splice(index, 1)
      }
    }
  }

  /**
   * แจ้ง handlers เกี่ยวกับข้อความใหม่
   */
  private notifyMessageHandlers(message: NotificationWebSocketMessage): void {
    this.messageHandlers.forEach(handler => handler(message))
  }

  /**
   * แจ้ง handlers เกี่ยวกับการเปลี่ยนแปลงการเชื่อมต่อ
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected))
  }

  /**
   * ตรวจสอบสถานะการเชื่อมต่อ
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
