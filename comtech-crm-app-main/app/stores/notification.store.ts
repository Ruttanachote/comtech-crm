/**
 * Notification Store (Pinia)
 * จัดการ State สำหรับระบบแจ้งเตือน
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationFilter,
  NotificationTab,
  NotificationResponse
} from '~/types/notification.type'

export const useNotificationStore = defineStore('notification', () => {
  // ============ State ============
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeTab = ref<NotificationTab>('all')
  const isPanelOpen = ref(false)
  const unreadCount = ref(0)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const hasMore = ref(false)
  const isWebSocketConnected = ref(false)

  // ============ Getters ============
  
  // แจ้งเตือนทั้งหมด
  const allNotifications = computed(() => notifications.value)
  
  // แจ้งเตือนที่ยังไม่ได้อ่าน
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => n.status === 'unread')
  )
  
  // แจ้งเตือนที่กรองตาม Tab
  const filteredNotifications = computed(() => {
    if (activeTab.value === 'unread') {
      return unreadNotifications.value
    }
    return notifications.value
  })
  
  // จำนวนแจ้งเตือนที่ยังไม่ได้อ่าน
  const getUnreadCount = computed(() => unreadCount.value)
  
  // จำนวนแจ้งเตือนทั้งหมด
  const getTotalCount = computed(() => totalCount.value)
  
  // สถานะการโหลด
  const getIsLoading = computed(() => isLoading.value)
  
  // สถานะการเชื่อมต่อ WebSocket
  const getWebSocketStatus = computed(() => isWebSocketConnected.value)
  
  // สถานะ Panel
  const getIsPanelOpen = computed(() => isPanelOpen.value)
  
  // Tab ที่เลือก
  const getActiveTab = computed(() => activeTab.value)

  // ============ Actions ============
  
  // เปิด/ปิด Panel
  const togglePanel = () => {
    isPanelOpen.value = !isPanelOpen.value
  }
  
  const openPanel = () => {
    isPanelOpen.value = true
  }
  
  const closePanel = () => {
    isPanelOpen.value = false
  }
  
  // เปลี่ยน Tab
  const setActiveTab = (tab: NotificationTab) => {
    activeTab.value = tab
  }
  
  // ตั้งค่า Notifications
  const setNotifications = (data: NotificationResponse) => {
    notifications.value = data.notifications
    unreadCount.value = data.unreadCount
    totalCount.value = data.totalCount
    hasMore.value = data.pagination.hasMore
    currentPage.value = data.pagination.page
  }
  
  // เพิ่ม Notification ใหม่
  const addNotification = (notification: Notification) => {
    notifications.value.unshift(notification)
    if (notification.status === 'unread') {
      unreadCount.value++
    }
    totalCount.value++
  }
  
  // ทำเครื่องหมายว่าอ่านแล้ว
  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && notification.status === 'unread') {
      notification.status = 'read'
      notification.readAt = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }
  
  // ทำเครื่องหมายว่าอ่านทั้งหมด
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      if (notification.status === 'unread') {
        notification.status = 'read'
        notification.readAt = new Date().toISOString()
      }
    })
    unreadCount.value = 0
  }
  
  // ลบ Notification
  const removeNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (notification.status === 'unread') {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
      totalCount.value = Math.max(0, totalCount.value - 1)
    }
  }
  
  // ล้าง Notifications
  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
    totalCount.value = 0
    hasMore.value = false
    currentPage.value = 1
  }
  
  // ตั้งค่าสถานะ Loading
  const setLoading = (status: boolean) => {
    isLoading.value = status
  }
  
  // ตั้งค่าข้อผิดพลาด
  const setError = (message: string | null) => {
    error.value = message
  }
  
  // ตั้งค่าสถานะ WebSocket
  const setWebSocketStatus = (status: boolean) => {
    isWebSocketConnected.value = status
  }
  
  // โหลดเพิ่ม (Pagination)
  const appendNotifications = (data: NotificationResponse) => {
    notifications.value.push(...data.notifications)
    hasMore.value = data.pagination.hasMore
    currentPage.value = data.pagination.page
  }

  return {
    // State
    notifications,
    isLoading,
    error,
    activeTab,
    isPanelOpen,
    unreadCount,
    totalCount,
    currentPage,
    hasMore,
    isWebSocketConnected,
    
    // Getters
    allNotifications,
    unreadNotifications,
    filteredNotifications,
    getUnreadCount,
    getTotalCount,
    getIsLoading,
    getWebSocketStatus,
    getIsPanelOpen,
    getActiveTab,
    
    // Actions
    togglePanel,
    openPanel,
    closePanel,
    setActiveTab,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    setLoading,
    setError,
    setWebSocketStatus,
    appendNotifications
  }
})
