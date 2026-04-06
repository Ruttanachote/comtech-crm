// Dashboard Types - Matching Figma Design

// ============================================
// Overview Dashboard Types
// ============================================

export interface OverviewStats {
  issueCount: number
  winCount: number
  issueValue: number
  winValue: number
  actualRevenue: number
  issueCountPercent?: number
  winCountPercent?: number
  issueValuePercent?: number
  winValuePercent?: number
  actualRevenuePercent?: number
}

export interface ProjectData {
  month: string
  issue: number
  win: number
  lastYear: number
}

export interface RevenueData {
  month: string
  issue: number
  win: number
  actual: number
  lastYear: number
}

export interface PipelineStage {
  stage: string
  count: number
  color: string
}

export interface OverviewDashboardData {
  stats: OverviewStats
  projectData: ProjectData[]
  revenueData: RevenueData[]
  pipelineStatus: PipelineStage[]
}

// ============================================
// HCP Dashboard Types
// ============================================

export interface HCPRevenueData {
  month: string
  actual25: number
  plan26: number
}

export interface HCPProfitData {
  month: string
  actual24: number
  actual25: number
  plan26: number
}

export type DashboardColor =
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'pink'
  | 'orange' | 'red' | 'rose'
  | 'green' | 'emerald' | 'teal' | 'cyan'
  | 'yellow' | 'gray'

export interface YTDSummary {
  label: string
  sublabel: string
  value: string
  target: string
  progress: number
  color: DashboardColor
}

export interface FinancialMetric {
  label: string
  value: string
  plan2026: string
  actual2025: string
  change: string
  status: string
  statusColor: DashboardColor
}

export interface HCPDashboardData {
  status: string
  title: string
  description: string
  note: string
  revenueData: HCPRevenueData[]
  profitData: HCPProfitData[]
  revenueSummary: {
    plan: string
    actual: string
    diff: string
    percent: string
    isPositive: boolean
  }
  profitSummary: {
    plan: string
    actual: string
    diff: string
    percent: string
    isPositive: boolean
  }
  ytdSummary: YTDSummary[]
  financialMetrics: FinancialMetric[]
}

// ============================================
// Executive Dashboard Types
// ============================================

export interface KPICard {
  label: string
  sublabel: string
  value: string
  subtext?: string
  color: string
}

export interface DealData {
  month: string
  issue: number
  win: number
  lastYear: number
}

export interface ExecutiveRevenueData {
  month: string
  actual25: number
  plan26: number
  cumulative: number
}

export interface ProfitTrendData {
  month: string
  actual24: number
  actual25: number
  plan26: number
}

export interface AchievementProgress {
  label: string
  target: string
  progress: number
  color: DashboardColor
}

export interface PipelineStatus {
  name: string
  count: number
  rate?: string
  color: string
}

export interface ExecutiveMetric {
  label: string
  value: string
  plan2026: string
  actual2025: string
  change: string
  status: string
  statusColor: DashboardColor
}

export interface ExecutiveDashboardData {
  lastUpdated: string
  kpiCards: KPICard[]
  dealsData: DealData[]
  revenueData: ExecutiveRevenueData[]
  profitTrendData: ProfitTrendData[]
  revenueSummary: {
    actual: string
    plan: string
    diff: string
    percent: string
  }
  profitSummary: {
    actual: string
    plan: string
    diff: string
    percent: string
  }
  achievementProgress: AchievementProgress[]
  pipelineStatus: PipelineStatus[]
  financialMetrics: ExecutiveMetric[]
}

// ============================================
// Common Types
// ============================================

export interface DashboardFilters {
  timeRange: '7' | '30' | '90'
  startDate?: string
  endDate?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export type DashboardTab = 'overview' | 'hcp' | 'executive'
