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
// Mock Data Filter Utility
// ============================================

/** Map timeRange → number of months to show (from end of year) */
const MONTHS_BY_RANGE: Record<string, number> = {
  '7': 2,
  '30': 6,
  '90': 12,
}

function sliceMonths<T>(arr: T[], months: number): T[] {
  return arr.slice(-months)
}

function scaleStats(stats: typeof mockOverviewData.stats, scale: number) {
  return {
    issueCount:         Math.round(stats.issueCount * scale),
    winCount:           Math.round(stats.winCount * scale),
    issueValue:         Math.round(stats.issueValue * scale),
    winValue:           Math.round(stats.winValue * scale),
    actualRevenue:      Math.round(stats.actualRevenue * scale),
    winCountPercent:    stats.winCountPercent,
    winValuePercent:    stats.winValuePercent,
    actualRevenuePercent: stats.actualRevenuePercent,
  }
}

function filterOverview(filters?: DashboardFilters): typeof mockOverviewData {
  const months = MONTHS_BY_RANGE[filters?.timeRange ?? '90'] ?? 12
  const scale = months / 12
  return {
    ...mockOverviewData,
    stats: scaleStats(mockOverviewData.stats, scale),
    projectData: sliceMonths(mockOverviewData.projectData, months),
    revenueData: sliceMonths(mockOverviewData.revenueData, months),
    pipelineStatus: mockOverviewData.pipelineStatus,
  }
}

function filterHCP(filters?: DashboardFilters): typeof mockHCPData {
  const months = MONTHS_BY_RANGE[filters?.timeRange ?? '90'] ?? 12
  return {
    ...mockHCPData,
    revenueData: sliceMonths(mockHCPData.revenueData, months),
    profitData: sliceMonths(mockHCPData.profitData, months),
  }
}

function filterExecutive(filters?: DashboardFilters): typeof mockExecutiveData {
  const months = MONTHS_BY_RANGE[filters?.timeRange ?? '90'] ?? 12
  const scale = months / 12
  return {
    ...mockExecutiveData,
    kpiCards: mockExecutiveData.kpiCards.map(card => {
      const num = parseFloat(card.value)
      if (!isNaN(num) && !card.value.includes('%')) {
        return { ...card, value: (num * scale).toFixed(num > 10 ? 0 : 2) }
      }
      return card
    }),
    dealsData: sliceMonths(mockExecutiveData.dealsData, months),
    revenueData: sliceMonths(mockExecutiveData.revenueData, months),
    profitTrendData: sliceMonths(mockExecutiveData.profitTrendData, months),
  }
}

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
    this.baseURL = 'http://localhost:3001'
    this.useMock = import.meta.dev
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
      await this.simulateDelay(300)
      return { success: true, data: filterOverview(filters) }
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
      await this.simulateDelay(300)
      return { success: true, data: filterHCP(filters) }
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
      await this.simulateDelay(300)
      return { success: true, data: filterExecutive(filters) }
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
