/**
 * Profile Service
 * จัดการ API Calls สำหรับข้อมูลผู้ใช้และการเชื่อมต่อ
 */
import type { UserProfile, ExternalConnection } from '~/types/profile.type'

// API Base URL
const API_BASE_URL = '/api/profile'

export class ProfileService {
  /**
   * ดึงข้อมูลผู้ใช้ปัจจุบัน
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/me`)
    if (!response.ok) throw new Error('Failed to fetch user profile')
    return response.json()
  }

  /**
   * อัปเดตข้อมูลผู้ใช้
   */
  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update user profile')
    return response.json()
  }

  /**
   * ดึงรายการการเชื่อมต่อภายนอก
   */
  async getConnections(): Promise<ExternalConnection[]> {
    const response = await fetch(`${API_BASE_URL}/connections`)
    if (!response.ok) throw new Error('Failed to fetch connections')
    return response.json()
  }

  /**
   * เชื่อมต่อกับ Microsoft
   */
  async connectMicrosoft(): Promise<{ authUrl: string }> {
    const response = await fetch(`${API_BASE_URL}/connect/microsoft`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to initiate Microsoft connection')
    return response.json()
  }

  /**
   * ยกเลิกการเชื่อมต่อ Microsoft
   */
  async disconnectMicrosoft(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/connect/microsoft`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to disconnect Microsoft')
  }

  /**
   * อัปโหลดรูปโปรไฟล์
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${API_BASE_URL}/avatar`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) throw new Error('Failed to upload avatar')
    return response.json()
  }

  /**
   * เปลี่ยนรหัสผ่าน
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    })
    if (!response.ok) throw new Error('Failed to change password')
  }
}

// Export singleton instance
export const profileService = new ProfileService()
