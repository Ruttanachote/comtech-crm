/**
 * Profile Composable
 * จัดการ Logic สำหรับโปรไฟล์ผู้ใช้
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '~/stores/profile.store'
import { profileService } from '~/services/profile.service'
import { mockUserProfile, mockConnections } from '~/data/mock/profile.mock'
import type { UserProfile, ExternalConnection } from '~/types/profile.type'

export function useProfile() {
  const store = useProfileStore()

  // ============ Load Data ============

  /**
   * โหลดข้อมูลผู้ใช้
   */
  const loadUserProfile = async () => {
    store.setLoading(true)
    store.setError(null)

    try {
      // ใช้ Mock Data สำหรับการทดสอบ
      // ใน Production ให้ใช้: const user = await profileService.getCurrentUser()
      const user = mockUserProfile
      store.setUser(user)
    } catch (error) {
      store.setError('Failed to load user profile')
      console.error('Error loading user profile:', error)
    } finally {
      store.setLoading(false)
    }
  }

  /**
   * โหลดการเชื่อมต่อภายนอก
   */
  const loadConnections = async () => {
    try {
      // ใช้ Mock Data สำหรับการทดสอบ
      // ใน Production ให้ใช้: const connections = await profileService.getConnections()
      const connections = mockConnections
      store.setConnections(connections)
    } catch (error) {
      console.error('Error loading connections:', error)
    }
  }

  // ============ Actions ============

  /**
   * อัปเดตข้อมูลผู้ใช้
   */
  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      // ใน Production ให้ใช้: await profileService.updateUser(store.getUser?.id!, updates)
      store.updateUser(updates)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  /**
   * เชื่อมต่อ Microsoft
   */
  const connectMicrosoft = async () => {
    try {
      // ใน Production ให้ใช้: const { authUrl } = await profileService.connectMicrosoft()
      // window.location.href = authUrl
      console.log('Connecting to Microsoft...')
    } catch (error) {
      console.error('Error connecting to Microsoft:', error)
    }
  }

  /**
   * ยกเลิกการเชื่อมต่อ Microsoft
   */
  const disconnectMicrosoft = async () => {
    try {
      // ใน Production ให้ใช้: await profileService.disconnectMicrosoft()
      store.updateConnection('microsoft', false)
    } catch (error) {
      console.error('Error disconnecting Microsoft:', error)
    }
  }

  /**
   * อัปโหลดรูปโปรไฟล์
   */
  const uploadAvatar = async (file: File) => {
    try {
      // ใน Production ให้ใช้: const { avatarUrl } = await profileService.uploadAvatar(file)
      // store.updateUser({ avatar: avatarUrl })
      console.log('Uploading avatar...', file.name)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  /**
   * ออกจากระบบ
   */
  const signOut = () => {
    store.clearProfile()
    // ใน Production: redirect to login page
  }

  // ============ Lifecycle ============

  onMounted(() => {
    loadUserProfile()
    loadConnections()
  })

  return {
    // Store
    store,
    user: store.getUser,
    userName: store.getUserName,
    userEmail: store.getUserEmail,
    userInitials: store.getUserInitials,
    userRole: store.getUserRole,
    userDepartment: store.getUserDepartment,
    connections: store.getConnections,
    isLoading: store.getIsLoading,
    isDropdownOpen: store.getIsDropdownOpen,

    // Actions
    loadUserProfile,
    loadConnections,
    updateUser,
    connectMicrosoft,
    disconnectMicrosoft,
    uploadAvatar,
    signOut,
    toggleDropdown: store.toggleDropdown,
    openDropdown: store.openDropdown,
    closeDropdown: store.closeDropdown
  }
}
