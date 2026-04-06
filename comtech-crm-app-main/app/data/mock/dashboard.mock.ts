// Mock Data for Dashboard - Matching Figma Design 100%
import type {
  OverviewDashboardData,
  HCPDashboardData,
  ExecutiveDashboardData,
} from '~/types/dashboard'

// ============================================
// Overview Dashboard Mock Data
// ============================================

export const mockOverviewData: OverviewDashboardData = {
  stats: {
    issueCount: 245,
    winCount: 182,
    issueValue: 1250000000,
    winValue: 980000000,
    actualRevenue: 875000000,
    winCountPercent: 74.1,
    winValuePercent: 78.4,
    actualRevenuePercent: 89.3,
  },
  projectData: [
    { month: 'Jan', issue: 22, win: 18, lastYear: 78 },
    { month: 'Feb', issue: 18, win: 14, lastYear: 74 },
    { month: 'Mar', issue: 32, win: 22, lastYear: 82 },
    { month: 'Apr', issue: 28, win: 20, lastYear: 86 },
    { month: 'May', issue: 38, win: 28, lastYear: 92 },
    { month: 'Jun', issue: 25, win: 18, lastYear: 78 },
    { month: 'Jul', issue: 28, win: 22, lastYear: 86 },
    { month: 'Aug', issue: 26, win: 20, lastYear: 82 },
    { month: 'Sep', issue: 33, win: 28, lastYear: 90 },
    { month: 'Oct', issue: 22, win: 16, lastYear: 74 },
    { month: 'Nov', issue: 18, win: 14, lastYear: 70 },
    { month: 'Dec', issue: 16, win: 12, lastYear: 68 },
  ],
  revenueData: [
    { month: 'Jan', issue: 950, win: 700, actual: 650, lastYear: 850 },
    { month: 'Feb', issue: 900, win: 650, actual: 600, lastYear: 800 },
    { month: 'Mar', issue: 1050, win: 800, actual: 750, lastYear: 950 },
    { month: 'Apr', issue: 950, win: 750, actual: 700, lastYear: 900 },
    { month: 'May', issue: 1300, win: 1000, actual: 950, lastYear: 1050 },
    { month: 'Jun', issue: 1100, win: 850, actual: 800, lastYear: 900 },
    { month: 'Jul', issue: 1150, win: 900, actual: 850, lastYear: 950 },
    { month: 'Aug', issue: 1050, win: 800, actual: 750, lastYear: 900 },
    { month: 'Sep', issue: 1400, win: 1050, actual: 1000, lastYear: 1100 },
    { month: 'Oct', issue: 950, win: 700, actual: 650, lastYear: 850 },
    { month: 'Nov', issue: 900, win: 650, actual: 600, lastYear: 800 },
    { month: 'Dec', issue: 850, win: 600, actual: 550, lastYear: 750 },
  ],
  pipelineStatus: [
    { stage: 'Leads', count: 45, color: 'gray' },
    { stage: 'Qualified', count: 32, color: 'blue' },
    { stage: 'Proposal', count: 28, color: 'yellow' },
    { stage: 'Negotiation', count: 18, color: 'orange' },
    { stage: 'Closed Won', count: 15, color: 'green' },
    { stage: 'Closed Lost', count: 8, color: 'red' },
  ],
}

// ============================================
// HCP Dashboard Mock Data
// ============================================

export const mockHCPData: HCPDashboardData = {
  status: '10 Feb 2026',
  title: 'Financial Projection',
  description: 'Revenue is below plan as newly onboarded customers are small accounts, coupled with fewer working days in January.',
  note: 'The net profit shown below differs from accounting figures due to prior-year bonus accrual reversals and operating expense adjustments.',
  revenueData: [
    { month: '1', actual25: 10.5, plan26: 11.0 },
    { month: '2', actual25: 8.2, plan26: 9.0 },
    { month: '3', actual25: 9.1, plan26: 10.0 },
    { month: '4', actual25: 10.0, plan26: 11.0 },
    { month: '5', actual25: 11.5, plan26: 12.0 },
    { month: '6', actual25: 12.8, plan26: 13.0 },
    { month: '7', actual25: 13.2, plan26: 14.0 },
    { month: '8', actual25: 12.5, plan26: 13.5 },
    { month: '9', actual25: 14.0, plan26: 14.5 },
    { month: '10', actual25: 15.2, plan26: 15.5 },
    { month: '11', actual25: 15.8, plan26: 16.0 },
    { month: '12', actual25: 16.2, plan26: 16.5 },
  ],
  profitData: [
    { month: '1', actual24: 0.15, actual25: 0.18, plan26: 0.10 },
    { month: '2', actual24: 0.12, actual25: -0.05, plan26: 0.12 },
    { month: '3', actual24: 0.18, actual25: -0.12, plan26: 0.15 },
    { month: '4', actual24: 0.22, actual25: -0.08, plan26: 0.18 },
    { month: '5', actual24: 0.25, actual25: 0.05, plan26: 0.22 },
    { month: '6', actual24: 0.28, actual25: 0.15, plan26: 0.25 },
    { month: '7', actual24: 0.32, actual25: 0.35, plan26: 0.28 },
    { month: '8', actual24: 0.35, actual25: 0.55, plan26: 0.30 },
    { month: '9', actual24: 0.38, actual25: 0.58, plan26: 0.32 },
    { month: '10', actual24: 0.42, actual25: 0.60, plan26: 0.35 },
    { month: '11', actual24: 0.45, actual25: 0.62, plan26: 0.38 },
    { month: '12', actual24: 0.48, actual25: 0.65, plan26: 0.40 },
  ],
  revenueSummary: {
    plan: '18 MB',
    actual: '10.4 MB',
    diff: '(1.45) MB',
    percent: '12%',
    isPositive: false,
  },
  profitSummary: {
    plan: '0.1 MB',
    actual: '0.2 MB',
    diff: '0.05 MB',
    percent: '33%',
    isPositive: true,
  },
  ytdSummary: [
    { label: '% Revenue', sublabel: 'Achievement', value: '6%', target: '11.8 MB', progress: 6, color: 'blue' as const },
    { label: '% Expense', sublabel: 'Incurred', value: '6%', target: '11.7 MB', progress: 6, color: 'orange' as const },
    { label: '% Profit', sublabel: 'Achievement', value: '9%', target: '0.14 MB', progress: 9, color: 'green' as const },
  ],
  financialMetrics: [
    { label: 'REVENUE', value: '10.37', plan2026: '175 MB', actual2025: '121.4 MB', change: '-41%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'COST (VC + FOH)', value: '(9.95)', plan2026: '(166.36) MB', actual2025: '(117.3) MB', change: '+6%', status: '📈 Above', statusColor: 'green' as const },
    { label: 'GROSS PROFIT %', value: '4.4%', plan2026: '4.93%', actual2025: '3.3%', change: '-0.53%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'ADMIN', value: '(0.23)', plan2026: '(4.18) MB', actual2025: '(1.7) MB', change: 'Below Budget', status: '✅ Good', statusColor: 'green' as const },
    { label: 'NET PROFIT', value: '0.19', plan2026: '4.45 MB', actual2025: '2.1 MB', change: '-96%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'NET PROFIT %', value: '1.8%', plan2026: '2.54%', actual2025: '1.75%', change: 'On Track', status: '➡️ Track', statusColor: 'blue' as const },
  ],
}

// ============================================
// Executive Dashboard Mock Data
// ============================================

export const mockExecutiveData: ExecutiveDashboardData = {
  lastUpdated: '20 Feb 2026',
  kpiCards: [
    { label: 'ISSUE', sublabel: 'Count', value: '245', color: 'blue' },
    { label: 'WIN', sublabel: 'Count', value: '182', color: 'orange' },
    { label: 'WIN RATE', sublabel: '%', value: '74.3%', color: 'green' },
    { label: 'REVENUE', sublabel: 'YTD', value: '10.37M', color: 'blue' },
    { label: 'COST', sublabel: 'YTD', value: '9.95M', color: 'red' },
    { label: 'GROSS', sublabel: 'Profit', value: '0.42M', subtext: '(4.4%)', color: 'orange' },
    { label: 'NET', sublabel: 'Profit', value: '0.19M', color: 'green' },
    { label: 'NPM', sublabel: '%', value: '1.8%', color: 'blue' },
  ],
  dealsData: [
    { month: 'Jan', issue: 22, win: 18, lastYear: 78 },
    { month: 'Feb', issue: 18, win: 14, lastYear: 74 },
    { month: 'Mar', issue: 32, win: 22, lastYear: 82 },
    { month: 'Apr', issue: 28, win: 20, lastYear: 86 },
    { month: 'May', issue: 38, win: 28, lastYear: 92 },
    { month: 'Jun', issue: 25, win: 18, lastYear: 78 },
    { month: 'Jul', issue: 28, win: 22, lastYear: 86 },
    { month: 'Aug', issue: 26, win: 20, lastYear: 82 },
    { month: 'Sep', issue: 33, win: 28, lastYear: 90 },
    { month: 'Oct', issue: 22, win: 16, lastYear: 74 },
    { month: 'Nov', issue: 18, win: 14, lastYear: 70 },
    { month: 'Dec', issue: 16, win: 12, lastYear: 68 },
  ],
  revenueData: [
    { month: 'Jan', actual25: 12, plan26: 15, cumulative: 12 },
    { month: 'Feb', actual25: 10, plan26: 18, cumulative: 22 },
    { month: 'Mar', actual25: 14, plan26: 22, cumulative: 36 },
    { month: 'Apr', actual25: 16, plan26: 26, cumulative: 52 },
    { month: 'May', actual25: 18, plan26: 30, cumulative: 70 },
    { month: 'Jun', actual25: 20, plan26: 35, cumulative: 90 },
    { month: 'Jul', actual25: 22, plan26: 40, cumulative: 112 },
    { month: 'Aug', actual25: 24, plan26: 45, cumulative: 136 },
    { month: 'Sep', actual25: 26, plan26: 50, cumulative: 162 },
    { month: 'Oct', actual25: 28, plan26: 55, cumulative: 190 },
    { month: 'Nov', actual25: 30, plan26: 60, cumulative: 220 },
    { month: 'Dec', actual25: 32, plan26: 65, cumulative: 252 },
  ],
  profitTrendData: [
    { month: '1', actual24: 0.15, actual25: 0.18, plan26: 0.10 },
    { month: '2', actual24: 0.12, actual25: -0.05, plan26: 0.12 },
    { month: '3', actual24: 0.18, actual25: -0.12, plan26: 0.15 },
    { month: '4', actual24: 0.22, actual25: -0.08, plan26: 0.18 },
    { month: '5', actual24: 0.25, actual25: 0.05, plan26: 0.22 },
    { month: '6', actual24: 0.28, actual25: 0.15, plan26: 0.25 },
    { month: '7', actual24: 0.32, actual25: 0.35, plan26: 0.28 },
    { month: '8', actual24: 0.35, actual25: 0.55, plan26: 0.30 },
    { month: '9', actual24: 0.38, actual25: 0.58, plan26: 0.32 },
    { month: '10', actual24: 0.42, actual25: 0.60, plan26: 0.35 },
    { month: '11', actual24: 0.45, actual25: 0.62, plan26: 0.38 },
    { month: '12', actual24: 0.48, actual25: 0.65, plan26: 0.40 },
  ],
  revenueSummary: {
    actual: '10.4 MB',
    plan: '11.8 MB',
    diff: '1.4 MB',
    percent: '12%',
  },
  profitSummary: {
    actual: '0.2 MB',
    plan: '0.1 MB',
    diff: '0.1 MB',
    percent: '100%',
  },
  achievementProgress: [
    { label: 'Revenue Achievement', target: '11.8 MB', progress: 88, color: 'blue' as const },
    { label: 'Expense Incurred', target: '11.7 MB', progress: 85, color: 'orange' as const },
    { label: 'Profit Achievement', target: '0.14 MB', progress: 136, color: 'green' as const },
  ],
  pipelineStatus: [
    { name: 'Leads', count: 45, rate: '71.1%', color: 'gray' },
    { name: 'Qualified', count: 32, rate: '87.5%', color: 'blue' },
    { name: 'Proposal', count: 28, rate: '64.3%', color: 'yellow' },
    { name: 'Negotiation', count: 18, rate: '83.3%', color: 'orange' },
    { name: 'Closed Won', count: 15, rate: '65.2%', color: 'green' },
    { name: 'Closed Lost', count: 8, color: 'red' },
  ],
  financialMetrics: [
    { label: 'REVENUE', value: '10.37 MB', plan2026: '175 MB', actual2025: '121.4 MB', change: '-41%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'COST (VC + FOH)', value: '(9.95) MB', plan2026: '(166.36) MB', actual2025: '(117.3) MB', change: '+6%', status: '📈 Above', statusColor: 'green' as const },
    { label: 'GROSS PROFIT %', value: '4.4%', plan2026: '4.93%', actual2025: '3.3%', change: '-0.53%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'ADMIN', value: '(0.23) MB', plan2026: '(4.18) MB', actual2025: '(1.7) MB', change: 'Below Budget', status: '✅ Good', statusColor: 'green' as const },
    { label: 'NET PROFIT', value: '0.19 MB', plan2026: '4.45 MB', actual2025: '2.1 MB', change: '-96%', status: '⚠️ Below', statusColor: 'red' as const },
    { label: 'NET PROFIT %', value: '1.8%', plan2026: '2.54%', actual2025: '1.75%', change: 'On Track', status: '➡️ Track', statusColor: 'blue' as const },
  ],
}
