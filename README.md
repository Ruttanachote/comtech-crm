# Comtech CRM

A comprehensive CRM system built with Nuxt 4 (Frontend) and NestJS (Backend).

## Project Structure

```
comtech-crm/
├── comtech-crm-app-main/     # Frontend (Nuxt 4 + Vue 3 + TypeScript)
├── comtech-crm-api-main/     # Backend (NestJS + TypeORM)
├── docker-compose.yml         # Docker orchestration
├── run.sh                     # Quick start script
└── setup.sh                   # Setup script
```

## Quick Start

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Manual Setup

#### Backend
```bash
cd comtech-crm-api-main
pnpm install
pnpm run start:dev
```

#### Frontend
```bash
cd comtech-crm-app-main
pnpm install
pnpm run dev
```

## Services

| Service  | Port | Description          |
|----------|------|---------------------|
| Frontend | 3000 | Nuxt 4 Application  |
| API      | 3001 | NestJS API          |
| MySQL    | 3306 | Database            |
| Redis    | 6379 | Cache               |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
NODE_ENV=development
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=comtech_crm
MYSQL_USER=comtech
MYSQL_PASSWORD=comtech123
KEYCLOAK_URL=https://sso.clicksbiz.com/
KEYCLOAK_REALM=SCGJWD-Portal
KEYCLOAK_CLIENT_ID=DynamicAppDev
```

## Dashboard Features

- **Overview**: Business metrics, project charts, revenue analysis
- **HCP**: Healthcare Professional dashboard with financial projections
- **Executive**: Full business overview with KPIs and pipeline status

## Tech Stack

### Frontend
- Nuxt 4
- Vue 3 + TypeScript
- Tailwind CSS
- Recharts (Charts)
- Pinia (State Management)

### Backend
- NestJS
- TypeORM
- MySQL
- Redis
- Keycloak (Authentication)

## License

MIT
