/**
 * Profile Mock Data
 * ข้อมูลตัวอย่างสำหรับโปรไฟล์ผู้ใช้
 */
import type { UserProfile, ExternalConnection } from '~/types/profile.type'

// ข้อมูลผู้ใช้ตัวอย่าง
export const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'Sales',
  email: 'sales@onelink.com',
  initials: 'SA',
  role: 'Sales Support',
  department: 'Sales',
  phone: '+66 81 234 5678',
  isActive: true
}

// การเชื่อมต่อภายนอก
export const mockConnections: ExternalConnection[] = [
  {
    provider: 'microsoft',
    name: 'Microsoft Calendar',
    icon: 'i-microsoft',
    isConnected: false,
    email: undefined
  },
  {
    provider: 'google',
    name: 'Google Calendar',
    icon: 'i-google',
    isConnected: false,
    email: undefined
  },
  {
    provider: 'slack',
    name: 'Slack',
    icon: 'i-slack',
    isConnected: false,
    email: undefined
  }
]

// Mock API Handlers
export const profileMockHandlers = {
  // GET /api/profile/me
  getCurrentUser: (): UserProfile => mockUserProfile,

  // GET /api/profile/connections
  getConnections: (): ExternalConnection[] => mockConnections,

  // POST /api/profile/connect/microsoft
  connectMicrosoft: (): { authUrl: string } => ({
    authUrl: 'https://login.microsoftonline.com/oauth2/authorize'
  }),

  // DELETE /api/profile/connect/microsoft
  disconnectMicrosoft: (): { success: boolean } => ({
    success: true
  }),

  // PATCH /api/profile/:id
  updateUser: (userId: string, updates: Partial<UserProfile>): UserProfile => ({
    ...mockUserProfile,
    ...updates
  })
}
