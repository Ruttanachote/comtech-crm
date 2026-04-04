/**
 * Notification Composable
 * จัดการ Logic สำหรับระบบแจ้งเตือน
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '~/stores/notification.store'
import { notificationService } from '~/services/notification.service'
import { mockNotificationResponse } from '~/data/mock/notification.mock'
import type { Notification, NotificationWebSocketMessage } from '~/types/notification.type'

export function useNotification() {
  const store = useNotificationStore()
  const unsubscribeMessage = ref<(() => void) | null>(null)
  const unsubscribeConnection = ref<(() => void) | null>(null)

  // ============ Load Data ============

  /**
   * โหลดรายการแจ้งเตือน
   */
  const loadNotifications = async (page: number = 1) => {
    store.setLoading(true)
    store.setError(null)

    try {
      // ใช้ Mock Data สำหรับการทดสอบ
      // ใน Production ให้ใช้: const response = await notificationService.getNotifications(page)
      const response = mockNotificationResponse
      
      if (page === 1) {
        store.setNotifications(response)
      } else {
        store.appendNotifications(response)
      }
    } catch (error) {
      store.setError('Failed to load notifications')
      console.error('Error loading notifications:', error)
    } finally {
      store.setLoading(false)
    }
  }

  /**
   * โหลดเพิ่ม (Pagination)
   */
  const loadMore = async () => {
    if (store.isLoading || !store.hasMore) return
    await loadNotifications(store.currentPage + 1)
  }

  // ============ Actions ============

  /**
   * ทำเครื่องหมายว่าอ่านแล้ว
   */
  const markAsRead = async (notificationId: string) => {
    try {
      // ใน Production ให้ใช้: await notificationService.markAsRead(notificationId)
      store.markAsRead(notificationId)
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  /**
   * ทำเครื่องหมายว่าอ่านทั้งหมด
   */
  const markAllAsRead = async () => {
    try {
      // ใน Production ให้ใช้: await notificationService.markAllAsRead()
      store.markAllAsRead()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  /**
   * ลบการแจ้งเตือน
   */
  const deleteNotification = async (notificationId: string) => {
    try {
      // ใน Production ให้ใช้: await notificationService.deleteNotification(notificationId)
      store.removeNotification(notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // ============ WebSocket ============

  /**
   * เริ่มการเชื่อมต่อ WebSocket
   */
  const connectWebSocket = (userId?: string) => {
    // ลงทะเบียน handlers
    unsubscribeMessage.value = notificationService.onMessage(handleWebSocketMessage)
    unsubscribeConnection.value = notificationService.onConnectionChange(handleConnectionChange)

    // เชื่อมต่อ
    notificationService.connect(userId)
  }

  /**
   * ตัดการเชื่อมต่อ WebSocket
   */
  const disconnectWebSocket = () => {
    notificationService.disconnect()
    
    // ยกเลิกการลงทะเบียน handlers
    if (unsubscribeMessage.value) {
      unsubscribeMessage.value()
      unsubscribeMessage.value = null
    }
    if (unsubscribeConnection.value) {
      unsubscribeConnection.value()
      unsubscribeConnection.value = null
    }
  }

  /**
   * จัดการข้อความจาก WebSocket
   */
  const handleWebSocketMessage = (message: NotificationWebSocketMessage) => {
    switch (message.type) {
      case 'notification':
        store.addNotification(message.data as Notification)
        break
      case 'markAsRead':
        store.markAsRead(message.data as string)
        break
      case 'markAllAsRead':
        store.markAllAsRead()
        break
      case 'delete':
        store.removeNotification(message.data as string)
        break
    }
  }

  /**
   * จัดการการเปลี่ยนแปลงการเชื่อมต่อ
   */
  const handleConnectionChange = (connected: boolean) => {
    store.setWebSocketStatus(connected)
  }

  // ============ Lifecycle ============

  onMounted(() => {
    loadNotifications()
    // connectWebSocket() // Uncomment เมื่อพร้อมใช้ WebSocket
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    // Store
    store,
    notifications: store.filteredNotifications,
    unreadCount: store.getUnreadCount,
    totalCount: store.getTotalCount,
    isLoading: store.getIsLoading,
    isPanelOpen: store.getIsPanelOpen,
    activeTab: store.getActiveTab,
    isWebSocketConnected: store.getWebSocketStatus,

    // Actions
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    togglePanel: store.togglePanel,
    openPanel: store.openPanel,
    closePanel: store.closePanel,
    setActiveTab: store.setActiveTab,
    connectWebSocket,
    disconnectWebSocket
  }
}
