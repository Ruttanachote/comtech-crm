# Comtech CRM - Development Guide

## Project Overview

This is a comprehensive CRM system with:
- **Frontend**: Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeORM + MySQL + Redis
- **Authentication**: Keycloak

## Architecture

### Frontend Structure
```
comtech-crm-app-main/
├── app/
│   ├── components/         # Vue components
│   │   └── dashboard/      # Dashboard components
│   ├── composables/        # Vue composables
│   │   └── useDashboard.ts # Dashboard composable
│   ├── data/
│   │   └── mock/           # Mock data
│   ├── layouts/            # Nuxt layouts
│   ├── pages/              # Nuxt pages
│   ├── services/           # API services
│   ├── stores/             # Pinia stores
│   └── types/              # TypeScript types
├── nuxt.config.ts
└── package.json
```

### Backend Structure
```
comtech-crm-api-main/
├── src/
│   ├── modules/            # Feature modules
│   ├── entities/           # TypeORM entities
│   └── main.ts
└── package.json
```

## Dashboard Architecture

### State Management (Pinia)
```typescript
// stores/dashboard.store.ts
const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    activeTab: 'overview',
    filters: { timeRange: '30' },
    overviewData: null,
    hcpData: null,
    executiveData: null,
  }),
  // ... getters and actions
})
```

### Composable Pattern
```typescript
// composables/useDashboard.ts
export function useDashboard() {
  const store = useDashboardStore()
  
  // Reactive state
  const activeTab = computed(() => store.activeTab)
  const overviewData = computed(() => store.overviewData)
  
  // Actions
  const setTab = (tab) => store.setActiveTab(tab)
  const refresh = () => store.refreshCurrentTab()
  
  // Auto-fetch on tab change
  watch(() => store.activeTab, fetchDataForTab)
  
  return { activeTab, overviewData, setTab, refresh }
}
```

### Service Layer
```typescript
// services/dashboard.service.ts
class DashboardService {
  async getOverviewData(filters?) {
    // Returns mock data in development
    // Returns API data in production
  }
}
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/overview?timeRange=30`
- `GET /api/dashboard/hcp?timeRange=30`
- `GET /api/dashboard/executive?timeRange=30`

## Development Workflow

1. **Start services**: `docker-compose up -d`
2. **View logs**: `docker-compose logs -f`
3. **Make changes**: Edit files in `comtech-crm-app-main/`
4. **Hot reload**: Changes apply automatically
5. **Test**: Visit http://localhost:3000

## Mock Data

Mock data is stored in `app/data/mock/dashboard.mock.ts` and matches the Figma design 100%.

To use real API:
1. Set `NUXT_PUBLIC_USE_MOCK=false` in `.env`
2. Ensure backend is running

## Keycloak Integration

Keycloak is used for authentication. Configure in `.env`:
```
KEYCLOAK_URL=https://sso.clicksbiz.com/
KEYCLOAK_REALM=SCGJWD-Portal
KEYCLOAK_CLIENT_ID=DynamicAppDev
```
