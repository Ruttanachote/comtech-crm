// Dashboard Store - Pinia
import { defineStore } from 'pinia'
import { dashboardService } from '~/services/dashboard.service'
import type {
  OverviewDashboardData,
  HCPDashboardData,
  ExecutiveDashboardData,
  DashboardFilters,
  DashboardTab,
} from '~/types/dashboard'

// ============================================
// Store State Interface
// ============================================

interface DashboardState {
  // Active tab
  activeTab: DashboardTab
  
  // Filters
  filters: DashboardFilters
  
  // Overview Data
  overviewData: OverviewDashboardData | null
  overviewLoading: boolean
  overviewError: string | null
  
  // HCP Data
  hcpData: HCPDashboardData | null
  hcpLoading: boolean
  hcpError: string | null
  
  // Executive Data
  executiveData: ExecutiveDashboardData | null
  executiveLoading: boolean
  executiveError: string | null
  
  // Last updated timestamp
  lastUpdated: string | null
}

// ============================================
// Dashboard Store
// ============================================

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    // Active tab
    activeTab: 'overview',
    
    // Filters
    filters: {
      timeRange: '30',
    },
    
    // Overview Data
    overviewData: null,
    overviewLoading: false,
    overviewError: null,
    
    // HCP Data
    hcpData: null,
    hcpLoading: false,
    hcpError: null,
    
    // Executive Data
    executiveData: null,
    executiveLoading: false,
    executiveError: null,
    
    // Last updated
    lastUpdated: null,
  }),

  // ============================================
  // Getters
  // ============================================
  
  getters: {
    // Check if any data is loading
    isLoading: (state): boolean => {
      return state.overviewLoading || state.hcpLoading || state.executiveLoading
    },
    
    // Get current tab data
    currentTabData: (state) => {
      switch (state.activeTab) {
        case 'overview':
          return state.overviewData
        case 'hcp':
          return state.hcpData
        case 'executive':
          return state.executiveData
        default:
          return null
      }
    },
    
    // Get current tab loading state
    currentTabLoading: (state): boolean => {
      switch (state.activeTab) {
        case 'overview':
          return state.overviewLoading
        case 'hcp':
          return state.hcpLoading
        case 'executive':
          return state.executiveLoading
        default:
          return false
      }
    },
    
    // Get current tab error
    currentTabError: (state): string | null => {
      switch (state.activeTab) {
        case 'overview':
          return state.overviewError
        case 'hcp':
          return state.hcpError
        case 'executive':
          return state.executiveError
        default:
          return null
      }
    },
    
    // Overview getters
    overviewStats: (state) => state.overviewData?.stats || null,
    overviewProjectData: (state) => state.overviewData?.projectData || [],
    overviewRevenueData: (state) => state.overviewData?.revenueData || [],
    overviewPipeline: (state) => state.overviewData?.pipelineStatus || [],
    
    // HCP getters
    hcpRevenueData: (state) => state.hcpData?.revenueData || [],
    hcpProfitData: (state) => state.hcpData?.profitData || [],
    hcpYTDSummary: (state) => state.hcpData?.ytdSummary || [],
    hcpFinancialMetrics: (state) => state.hcpData?.financialMetrics || [],
    
    // Executive getters
    executiveKPICards: (state) => state.executiveData?.kpiCards || [],
    executiveDealsData: (state) => state.executiveData?.dealsData || [],
    executiveRevenueData: (state) => state.executiveData?.revenueData || [],
    executiveProfitTrend: (state) => state.executiveData?.profitTrendData || [],
    executiveAchievement: (state) => state.executiveData?.achievementProgress || [],
    executivePipeline: (state) => state.executiveData?.pipelineStatus || [],
    executiveMetrics: (state) => state.executiveData?.financialMetrics || [],
  },

  // ============================================
  // Actions
  // ============================================
  
  actions: {
    // ============================================
    // Tab Management
    // ============================================
    
    setActiveTab(tab: DashboardTab) {
      this.activeTab = tab
    },
    
    // ============================================
    // Filter Management
    // ============================================
    
    setFilters(filters: Partial<DashboardFilters>) {
      this.filters = { ...this.filters, ...filters }
    },
    
    setTimeRange(timeRange: DashboardFilters['timeRange']) {
      this.filters.timeRange = timeRange
    },
    
    // ============================================
    // Fetch Overview Data
    // ============================================
    
    async fetchOverviewData() {
      this.overviewLoading = true
      this.overviewError = null
      
      try {
        const response = await dashboardService.getOverviewData(this.filters)
        
        if (response.success && response.data) {
          this.overviewData = response.data
          this.lastUpdated = new Date().toISOString()
        }
        else {
          this.overviewError = response.message || 'Failed to fetch overview data'
        }
      }
      catch (error) {
        this.overviewError = error instanceof Error ? error.message : 'Unknown error'
      }
      finally {
        this.overviewLoading = false
      }
    },
    
    // ============================================
    // Fetch HCP Data
    // ============================================
    
    async fetchHCPData() {
      this.hcpLoading = true
      this.hcpError = null
      
      try {
        const response = await dashboardService.getHCPData(this.filters)
        
        if (response.success && response.data) {
          this.hcpData = response.data
          this.lastUpdated = new Date().toISOString()
        }
        else {
          this.hcpError = response.message || 'Failed to fetch HCP data'
        }
      }
      catch (error) {
        this.hcpError = error instanceof Error ? error.message : 'Unknown error'
      }
      finally {
        this.hcpLoading = false
      }
    },
    
    // ============================================
    // Fetch Executive Data
    // ============================================
    
    async fetchExecutiveData() {
      this.executiveLoading = true
      this.executiveError = null
      
      try {
        const response = await dashboardService.getExecutiveData(this.filters)
        
        if (response.success && response.data) {
          this.executiveData = response.data
          this.lastUpdated = new Date().toISOString()
        }
        else {
          this.executiveError = response.message || 'Failed to fetch executive data'
        }
      }
      catch (error) {
        this.executiveError = error instanceof Error ? error.message : 'Unknown error'
      }
      finally {
        this.executiveLoading = false
      }
    },
    
    // ============================================
    // Fetch All Data
    // ============================================
    
    async fetchAllData() {
      await Promise.all([
        this.fetchOverviewData(),
        this.fetchHCPData(),
        this.fetchExecutiveData(),
      ])
    },
    
    // ============================================
    // Refresh Current Tab Data
    // ============================================
    
    async refreshCurrentTab() {
      switch (this.activeTab) {
        case 'overview':
          await this.fetchOverviewData()
          break
        case 'hcp':
          await this.fetchHCPData()
          break
        case 'executive':
          await this.fetchExecutiveData()
          break
      }
    },
    
    // ============================================
    // Clear Data
    // ============================================
    
    clearOverviewData() {
      this.overviewData = null
      this.overviewError = null
    },
    
    clearHCPData() {
      this.hcpData = null
      this.hcpError = null
    },
    
    clearExecutiveData() {
      this.executiveData = null
      this.executiveError = null
    },
    
    clearAllData() {
      this.clearOverviewData()
      this.clearHCPData()
      this.clearExecutiveData()
      this.lastUpdated = null
    },
    
    // ============================================
    // Reset Store
    // ============================================
    
    reset() {
      this.$reset()
    },
  },
})
