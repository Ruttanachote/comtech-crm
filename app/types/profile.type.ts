/**
 * Profile Types
 * กำหนด Type สำหรับระบบโปรไฟล์ผู้ใช้
 */

// ข้อมูลผู้ใช้
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  initials: string
  role: string
  department: string
  phone?: string
  isActive: boolean
}

// การเชื่อมต่อภายนอก
export interface ExternalConnection {
  provider: 'microsoft' | 'google' | 'slack' | 'other'
  name: string
  icon: string
  isConnected: boolean
  connectedAt?: string
  email?: string
}

// เมนูใน profile dropdown
export interface ProfileMenuItem {
  id: string
  label: string
  icon: string
  to?: string
  action?: () => void
  variant?: 'default' | 'danger'
  badge?: string
  subtext?: string
  divider?: boolean
}

// Profile State
export interface ProfileState {
  user: UserProfile | null
  connections: ExternalConnection[]
  isLoading: boolean
  error: string | null
}
