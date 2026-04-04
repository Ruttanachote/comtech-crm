// useDashboard Composable - Main entry point for Dashboard functionality
import { useDashboardStore } from '~/stores/dashboard.store'
import type { DashboardTab, DashboardFilters } from '~/types/dashboard'

// ============================================
// useDashboard Composable
// ============================================

export function useDashboard() {
  const store = useDashboardStore()
  
  // ============================================
  // Reactive State (from store)
  // ============================================
  
  const activeTab = computed(() => store.activeTab)
  const filters = computed(() => store.filters)
  const isLoading = computed(() => store.isLoading)
  const lastUpdated = computed(() => store.lastUpdated)
  
  // ============================================
  // Overview Data (from store)
  // ============================================
  
  const overviewData = computed(() => store.overviewData)
  const overviewLoading = computed(() => store.overviewLoading)
  const overviewError = computed(() => store.overviewError)
  const overviewStats = computed(() => store.overviewStats)
  const overviewProjectData = computed(() => store.overviewProjectData)
  const overviewRevenueData = computed(() => store.overviewRevenueData)
  const overviewPipeline = computed(() => store.overviewPipeline)
  
  // ============================================
  // HCP Data (from store)
  // ============================================
  
  const hcpData = computed(() => store.hcpData)
  const hcpLoading = computed(() => store.hcpLoading)
  const hcpError = computed(() => store.hcpError)
  const hcpRevenueData = computed(() => store.hcpRevenueData)
  const hcpProfitData = computed(() => store.hcpProfitData)
  const hcpYTDSummary = computed(() => store.hcpYTDSummary)
  const hcpFinancialMetrics = computed(() => store.hcpFinancialMetrics)
  
  // ============================================
  // Executive Data (from store)
  // ============================================
  
  const executiveData = computed(() => store.executiveData)
  const executiveLoading = computed(() => store.executiveLoading)
  const executiveError = computed(() => store.executiveError)
  const executiveKPICards = computed(() => store.executiveKPICards)
  const executiveDealsData = computed(() => store.executiveDealsData)
  const executiveRevenueData = computed(() => store.executiveRevenueData)
  const executiveProfitTrend = computed(() => store.executiveProfitTrend)
  const executiveAchievement = computed(() => store.executiveAchievement)
  const executivePipeline = computed(() => store.executivePipeline)
  const executiveMetrics = computed(() => store.executiveMetrics)
  
  // ============================================
  // Current Tab Data (dynamic based on active tab)
  // ============================================
  
  const currentTabData = computed(() => store.currentTabData)
  const currentTabLoading = computed(() => store.currentTabLoading)
  const currentTabError = computed(() => store.currentTabError)
  
  // ============================================
  // Actions
  // ============================================
  
  /**
   * Set active tab
   */
  function setTab(tab: DashboardTab) {
    store.setActiveTab(tab)
  }
  
  /**
   * Set filters
   */
  function setFilters(newFilters: Partial<DashboardFilters>) {
    store.setFilters(newFilters)
  }
  
  /**
   * Set time range
   */
  function setTimeRange(timeRange: DashboardFilters['timeRange']) {
    store.setTimeRange(timeRange)
  }
  
  // ============================================
  // Fetch Actions
  // ============================================
  
  /**
   * Fetch Overview data
   */
  async function fetchOverview() {
    await store.fetchOverviewData()
  }
  
  /**
   * Fetch HCP data
   */
  async function fetchHCP() {
    await store.fetchHCPData()
  }
  
  /**
   * Fetch Executive data
   */
  async function fetchExecutive() {
    await store.fetchExecutiveData()
  }
  
  /**
   * Fetch all dashboard data
   */
  async function fetchAll() {
    await store.fetchAllData()
  }
  
  /**
   * Refresh current tab data
   */
  async function refresh() {
    await store.refreshCurrentTab()
  }
  
  // ============================================
  // Auto-fetch on tab change
  // ============================================
  
  /**
   * Watch for tab changes and auto-fetch data
   */
  function watchTabChange() {
    watch(
      () => store.activeTab,
      async (newTab) => {
        switch (newTab) {
          case 'overview':
            if (!store.overviewData) {
              await store.fetchOverviewData()
            }
            break
          case 'hcp':
            if (!store.hcpData) {
              await store.fetchHCPData()
            }
            break
          case 'executive':
            if (!store.executiveData) {
              await store.fetchExecutiveData()
            }
            break
        }
      },
      { immediate: true }
    )
  }
  
  /**
   * Watch for filter changes and auto-refresh data
   */
  function watchFilterChange() {
    watch(
      () => store.filters,
      async () => {
        await store.refreshCurrentTab()
      },
      { deep: true }
    )
  }
  
  // ============================================
  // Lifecycle
  // ============================================
  
  /**
   * Initialize dashboard - call this in component setup
   */
  function initialize() {
    // Watch for tab and filter changes
    watchTabChange()
    watchFilterChange()
    
    // Fetch initial data for current tab
    store.refreshCurrentTab()
  }
  
  /**
   * Cleanup on component unmount
   */
  function cleanup() {
    // Optional: clear data if needed
    // store.clearAllData()
  }
  
  // ============================================
  // Utility Functions
  // ============================================
  
  /**
   * Format currency value
   */
  function formatCurrency(value: number, currency: string = 'THB'): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  /**
   * Format number with commas
   */
  function formatNumber(value: number): string {
    return new Intl.NumberFormat('th-TH').format(value)
  }
  
  /**
   * Format percentage
   */
  function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`
  }
  
  /**
   * Format date
   */
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  // ============================================
  // Return
  // ============================================
  
  return {
    // State
    activeTab,
    filters,
    isLoading,
    lastUpdated,
    
    // Overview
    overviewData,
    overviewLoading,
    overviewError,
    overviewStats,
    overviewProjectData,
    overviewRevenueData,
    overviewPipeline,
    
    // HCP
    hcpData,
    hcpLoading,
    hcpError,
    hcpRevenueData,
    hcpProfitData,
    hcpYTDSummary,
    hcpFinancialMetrics,
    
    // Executive
    executiveData,
    executiveLoading,
    executiveError,
    executiveKPICards,
    executiveDealsData,
    executiveRevenueData,
    executiveProfitTrend,
    executiveAchievement,
    executivePipeline,
    executiveMetrics,
    
    // Current Tab
    currentTabData,
    currentTabLoading,
    currentTabError,
    
    // Actions
    setTab,
    setFilters,
    setTimeRange,
    fetchOverview,
    fetchHCP,
    fetchExecutive,
    fetchAll,
    refresh,
    
    // Lifecycle
    initialize,
    cleanup,
    
    // Utilities
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  }
}

// ============================================
// Export composable
// ============================================

export default useDashboard
