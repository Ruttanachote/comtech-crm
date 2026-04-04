# Dashboard Module

โมดูลแดชบอร์ดสำหรับแสดงภาพรวมข้อมูลและกราฟต่างๆ ของระบบ CRM

## โครงสร้างไฟล์

```
app/components/dashboard/
├── DashboardScreen.vue           # หน้าหลักแดชบอร์ด (Tab Navigation)
├── OverviewDashboardScreen.vue   # แท็บ Overview (สถิติและกราฟทั่วไป)
├── HCPDashboardScreen.vue        # แท็บ HCP (Healthcare Professional Dashboard)
├── ExecutiveDashboardScreen.vue  # แท็บ Executive (สำหรับผู้บริหาร)
└── README.md                     # เอกสารนี้
```

## Components

### DashboardScreen.vue
- **หน้าหลัก** ของแดชบอร์ด
- มี Tab Navigation: Overview, HCP, Executive
- มี Time Range Selector (7, 30, 90 วัน)
- ใช้ `useDashboard()` composable

### OverviewDashboardScreen.vue
- แสดงสถิติสำคัญ: Issue Count, Win Count, Issue Value, Win Value, Actual Revenue
- กราฟแท่ง: Number of Projects, Revenue
- Sales Pipeline Status (Leads → Closed Won/Lost)

### HCPDashboardScreen.vue
- แดชบอร์ดสำหรับ Healthcare Professional
- กราฟ Revenue และ Net Profit
- YTD Summary Cards with Donut Charts
- Financial Metrics Cards

### ExecutiveDashboardScreen.vue
- แดชบอร์ดสำหรับผู้บริหาร (ยังไม่มีข้อมูล)

## การใช้งาน

```vue
<template>
  <DashboardScreen />
</template>
```

## Dependencies

- `useDashboard()` - Composable สำหรับจัดการ state และ data
- `apexchart` - สำหรับแสดงกราฟ
- i18n - รองรับภาษาไทย/อังกฤษ

## Data Flow

```
DashboardScreen.vue
    ↓ (เลือก Tab)
OverviewDashboardScreen.vue / HCPDashboardScreen.vue / ExecutiveDashboardScreen.vue
    ↓ (เรียกใช้)
useDashboard() composable
    ↓ (ดึงข้อมูล)
dashboard.store.ts
    ↓ (เรียก API)
dashboard.service.ts
```

## Related Files

- `app/composables/useDashboard.ts`
- `app/stores/dashboard.store.ts`
- `app/services/dashboard.service.ts`
- `app/types/dashboard/index.ts`
- `app/data/mock/dashboard.mock.ts`
- `i18n/locales/en.dashboard.json`
- `i18n/locales/th.dashboard.json`
