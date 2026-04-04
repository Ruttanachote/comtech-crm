/**
 * Profile Store (Pinia)
 * จัดการ State สำหรับข้อมูลผู้ใช้และโปรไฟล์
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile, ExternalConnection } from '~/types/profile.type'

export const useProfileStore = defineStore('profile', () => {
  // ============ State ============
  const user = ref<UserProfile | null>(null)
  const connections = ref<ExternalConnection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isDropdownOpen = ref(false)

  // ============ Getters ============
  
  // ข้อมูลผู้ใช้
  const getUser = computed(() => user.value)
  
  // ชื่อผู้ใช้
  const getUserName = computed(() => user.value?.name || '')
  
  // อีเมล
  const getUserEmail = computed(() => user.value?.email || '')
  
  // ตัวอักษรย่อ
  const getUserInitials = computed(() => user.value?.initials || '')
  
  // ตำแหน่ง/แผนก
  const getUserRole = computed(() => user.value?.role || '')
  
  // แผนก
  const getUserDepartment = computed(() => user.value?.department || '')
  
  // รายการการเชื่อมต่อ
  const getConnections = computed(() => connections.value)
  
  // การเชื่อมต่อที่ยังไม่ได้เชื่อม
  const getUnconnectedProviders = computed(() => 
    connections.value.filter(c => !c.isConnected)
  )
  
  // สถานะ dropdown
  const getIsDropdownOpen = computed(() => isDropdownOpen.value)
  
  // สถานะ loading
  const getIsLoading = computed(() => isLoading.value)

  // ============ Actions ============
  
  // ตั้งค่าข้อมูลผู้ใช้
  const setUser = (userData: UserProfile) => {
    user.value = userData
  }
  
  // ตั้งค่าการเชื่อมต่อ
  const setConnections = (data: ExternalConnection[]) => {
    connections.value = data
  }
  
  // อัปเดตการเชื่อมต่อ
  const updateConnection = (provider: string, isConnected: boolean, email?: string) => {
    const connection = connections.value.find(c => c.provider === provider)
    if (connection) {
      connection.isConnected = isConnected
      connection.connectedAt = isConnected ? new Date().toISOString() : undefined
      connection.email = email
    }
  }
  
  // เปิด/ปิด dropdown
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  
  const openDropdown = () => {
    isDropdownOpen.value = true
  }
  
  const closeDropdown = () => {
    isDropdownOpen.value = false
  }
  
  // ตั้งค่าสถานะ loading
  const setLoading = (status: boolean) => {
    isLoading.value = status
  }
  
  // ตั้งค่าข้อผิดพลาด
  const setError = (message: string | null) => {
    error.value = message
  }
  
  // อัปเดตข้อมูลผู้ใช้
  const updateUser = (updates: Partial<UserProfile>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }
  
  // ล้างข้อมูล (logout)
  const clearProfile = () => {
    user.value = null
    connections.value = []
    isDropdownOpen.value = false
  }

  return {
    // State
    user,
    connections,
    isLoading,
    error,
    isDropdownOpen,
    
    // Getters
    getUser,
    getUserName,
    getUserEmail,
    getUserInitials,
    getUserRole,
    getUserDepartment,
    getConnections,
    getUnconnectedProviders,
    getIsDropdownOpen,
    getIsLoading,
    
    // Actions
    setUser,
    setConnections,
    updateConnection,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    setLoading,
    setError,
    updateUser,
    clearProfile
  }
})
