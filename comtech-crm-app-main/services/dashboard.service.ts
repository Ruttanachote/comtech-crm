// Dashboard Service - API Calls
import type {
  OverviewDashboardData,
  HCPDashboardData,
  ExecutiveDashboardData,
  DashboardFilters,
  ApiResponse,
} from '~/types/dashboard'

// Import mock data for development
import {
  mockOverviewData,
  mockHCPData,
  mockExecutiveData,
} from '~/data/mock/dashboard.mock'

// ============================================
// API Endpoints Configuration
// ============================================

const API_ENDPOINTS = {
  overview: '/api/dashboard/overview',
  hcp: '/api/dashboard/hcp',
  executive: '/api/dashboard/executive',
}

// ============================================
// Dashboard Service Class
// ============================================

export class DashboardService {
  private baseURL: string
  private useMock: boolean

  constructor() {
    // Get base URL from runtime config
    const config = useRuntimeConfig()
    this.baseURL = config.public.apiBaseUrl || 'http://localhost:3001'
    
    // Use mock data in development mode
    this.useMock = process.env.NODE_ENV === 'development' || config.public.useMock === 'true'
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    }
    catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // ============================================
  // Overview Dashboard API
  // ============================================

  /**
   * Get Overview Dashboard Data
   * GET /api/dashboard/overview
   */
  async getOverviewData(filters?: DashboardFilters): Promise<ApiResponse<OverviewDashboardData>> {
    // Use mock data in development
    if (this.useMock) {
      await this.simulateDelay(500)
      return {
        success: true,
        data: mockOverviewData,
      }
    }

    const queryParams = filters ? this.buildQueryParams(filters) : ''
    return this.fetch<OverviewDashboardData>(`${API_ENDPOINTS.overview}${queryParams}`)
  }

  // ============================================
  // HCP Dashboard API
  // ============================================

  /**
   * Get HCP Dashboard Data
   * GET /api/dashboard/hcp
   */
  async getHCPData(filters?: DashboardFilters): Promise<ApiResponse<HCPDashboardData>> {
    // Use mock data in development
    if (this.useMock) {
      await this.simulateDelay(600)
      return {
        success: true,
        data: mockHCPData,
      }
    }

    const queryParams = filters ? this.buildQueryParams(filters) : ''
    return this.fetch<HCPDashboardData>(`${API_ENDPOINTS.hcp}${queryParams}`)
  }

  // ============================================
  // Executive Dashboard API
  // ============================================

  /**
   * Get Executive Dashboard Data
   * GET /api/dashboard/executive
   */
  async getExecutiveData(filters?: DashboardFilters): Promise<ApiResponse<ExecutiveDashboardData>> {
    // Use mock data in development
    if (this.useMock) {
      await this.simulateDelay(700)
      return {
        success: true,
        data: mockExecutiveData,
      }
    }

    const queryParams = filters ? this.buildQueryParams(filters) : ''
    return this.fetch<ExecutiveDashboardData>(`${API_ENDPOINTS.executive}${queryParams}`)
  }

  // ============================================
  // Utility Methods
  // ============================================

  private buildQueryParams(filters: DashboardFilters): string {
    const params = new URLSearchParams()
    
    if (filters.timeRange) {
      params.append('timeRange', filters.timeRange)
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate)
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate)
    }
    
    return params.toString() ? `?${params.toString()}` : ''
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ============================================
// Export singleton instance
// ============================================

export const dashboardService = new DashboardService()

// ============================================
// Export composable for easy access
// ============================================

export function useDashboardService() {
  return dashboardService
}
