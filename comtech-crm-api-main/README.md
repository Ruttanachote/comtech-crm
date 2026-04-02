# Comtech CRM API

Backend API built with NestJS.

## Setup

```bash
pnpm install
pnpm run start:dev
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/overview` - Overview dashboard data
- `GET /api/dashboard/hcp` - HCP dashboard data
- `GET /api/dashboard/executive` - Executive dashboard data

## Environment Variables

```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=comtech
DB_PASSWORD=comtech123
DB_NAME=comtech_crm
REDIS_HOST=localhost
REDIS_PORT=6379
KEYCLOAK_URL=https://sso.clicksbiz.com/
KEYCLOAK_REALM=SCGJWD-Portal
KEYCLOAK_CLIENT_ID=DynamicAppDev
```
