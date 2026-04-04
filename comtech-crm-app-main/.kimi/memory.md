# COMTECH CRM - Project Memory

## ⚠️ CRITICAL WARNINGS

### 🚫 FORBIDDEN ACTIONS
- **ห้าม FORCE PUSH เด็ดขาด** - อาจทำให้ประวัติการทำงานหาย
- **ห้ามลบหรือเปลี่ยนชื่อโฟลเดอร์ `comtech-crm` และ `comtech-crm-app-main`** - โครงสร้างนี้ต้องคงที่เสมอ

### 📁 FOLDER STRUCTURE (FIXED)
```
comtech-crm/                    ← Root folder (ห้ามเปลี่ยนชื่อ!)
└── comtech-crm-app-main/       ← Project root (ห้ามเปลี่ยนชื่อ!)
    ├── .kimi/                  ← AI workspace
    ├── app/                    ← Nuxt app
    └── ... (project files)
```

### ❌ LESSONS LEARNED (ข้อผิดพลาดที่ต้องจำ)

#### 2025-04-04 - Push ผิดที่
**ปัญหา**: Push ไฟล์ไปที่ root ของ repository แทนที่จะเป็น `comtech-crm-app-main/`

**ผลกระทบ**:
- ไฟล์ notification ไปอยู่ที่ `/app/`, `/i18n/`, `/server/` แทนที่จะเป็น `/comtech-crm-app-main/app/`
- ต้องแก้ไขโดยการสร้าง commit ใหม่และย้ายไฟล์ไปที่ถูกต้อง

**สาเหตุ**:
- ไม่ตรวจสอบ path ให้ดีก่อน push
- ใช้ GitHub API โดยไม่ระบุ path prefix `comtech-crm-app-main/`

**วิธีแก้ไข**:
- สร้าง tree ใหม่โดยข้ามไฟล์ที่ผิด (app, i18n, server ที่ root)
- เพิ่มไฟล์ใหม่ด้วย path ที่ถูกต้อง (`comtech-crm-app-main/...`)
- สร้าง commit และ update branch reference

**ข้อควรจำ**:
1. **ตรวจสอบ path ทุกครั้ง** ก่อน push - ต้องอยู่ใน `comtech-crm-app-main/`
2. **Pull ก่อน Push เสมอ** - ตรวจสอบว่า local ตรงกับ remote
3. **ตรวจสอบผลลัพธ์หลัง push** - ดูที่ GitHub ว่าไฟล์อยู่ถูกที่
4. **อย่าสร้างไฟล์ที่ root** - ทุกไฟล์ต้องอยู่ใน `comtech-crm-app-main/`

---

## Project Overview
- **Name**: COSMIC CRM
- **Type**: Customer Relationship Management Application
- **Framework**: Nuxt 4 (Vue 3 meta-framework)
- **UI Library**: Nuxt UI + Tailwind CSS v4
- **State Management**: Pinia
- **Authentication**: Nuxt Auth with Keycloak
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Project Path**: `/mnt/okcomputer/comtech-crm/comtech-crm-app-main/`

---

## Tech Stack Details

### Core Framework
- **Nuxt**: ^4.3.0
- **Vue**: 3 (via Nuxt)
- **TypeScript**: ^5.9.3

### UI & Styling
- **Nuxt UI**: ^4.4.0 (Tailwind CSS component library)
- **Tailwind CSS**: ^4.1.18
- **@nuxt/icon**: ^2.2.1 (Iconify integration)
- **@iconify-json/lucide**: ^1.2.87
- **@iconify-json/simple-icons**: ^1.2.68

### State & Data
- **Pinia**: ^3.0.4
- **@pinia/nuxt**: ^0.11.3
- **axios**: ^1.13.4
- **dayjs**: ^1.11.19

### Authentication
- **@sidebase/nuxt-auth**: ^1.2.0
- **keycloak-js**: ^26.2.3

### Internationalization
- **@nuxtjs/i18n**: ^10.2.3
- **Locales**: English (en), Thai (th)
- **Files**: en.json, en.dashboard.json, th.json, th.dashboard.json

### Charts & Visualization
- **apexcharts**: ^5.10.4
- **vue3-apexcharts**: ^1.11.1
- **recharts**: ^3.8.1

### Development Tools
- **ESLint**: ^9.39.2
- **Prettier**: ^3.8.1
- **vue-tsc**: ^3.2.4

---

## Project Structure

```
comtech-crm-app-main/
├── app/                          # Nuxt app directory
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Global styles
│   ├── components/               # Vue components
│   │   ├── auth/                 # Authentication components
│   │   ├── common/               # Common/reusable components
│   │   ├── modal/                # Modal components
│   │   └── popover/              # Popover components
│   ├── composables/              # Vue composables
│   │   ├── i18n.ts               # i18n composable
│   │   ├── useApi.ts             # API composable
│   │   ├── useDashboard.ts       # Dashboard composable
│   │   ├── useHeaderMenu.ts      # Header menu composable
│   │   └── useWindowSize.ts      # Window size composable
│   ├── data/                     # Static data & mocks
│   │   ├── activities.json
│   │   ├── user.json
│   │   └── mock/
│   │       └── dashboard.mock.ts
│   ├── layouts/                  # Nuxt layouts
│   ├── pages/                    # Nuxt pages (auto-routing)
│   │   ├── auth/                 # Authentication pages
│   │   ├── customers/            # Customer management
│   │   │   ├── customers/        # Customers list
│   │   │   ├── leads/            # Leads management
│   │   │   └── my-customers/     # My customers
│   │   ├── dashboard/            # Dashboard
│   │   │   └── components/       # Dashboard components
│   │   ├── todo-list/            # Todo list
│   │   │   └── component/        # Todo components
│   │   └── visits/               # Visits management
│   │       ├── activities/       # Activities
│   │       └── customers/        # Visit customers
│   ├── plugins/                  # Nuxt plugins
│   │   ├── apexcharts.client.ts  # ApexCharts plugin
│   │   └── keycloak.client.ts    # Keycloak plugin
│   ├── services/                 # API services
│   │   ├── tasksService.ts
│   │   └── dashboard.service.ts
│   ├── stores/                   # Pinia stores
│   │   ├── dashboard.store.ts
│   │   ├── useAuthStore.ts
│   │   └── useSystemStore.ts
│   └── types/                    # TypeScript types
│       ├── color.ts
│       └── dashboard/
│           └── index.ts
├── i18n/                         # Internationalization
│   └── locales/
│       ├── en.json
│       ├── en.dashboard.json
│       ├── th.json
│       └── th.dashboard.json
├── public/                       # Static assets
│   └── fonts/
├── server/                       # Server-side code
├── stores/                       # Additional stores
│   ├── useAuthStore.ts
│   ├── useSystemStore.ts
│   └── useTasksStore.ts
├── types/                        # Global types
│   ├── common.type.ts
│   ├── menu.interface.ts
│   └── nuxt.d.ts
├── app.config.ts                 # App configuration
├── app.vue                       # Root component
├── i18n.config.ts                # i18n configuration
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## Color Scheme (from Tailwind Config)

### Primary Colors
- **Primary 50**: #f0fdf4
- **Primary 100**: #dcfce7
- **Primary 200**: #bbf7d0
- **Primary 300**: #86efac
- **Primary 400**: #4ade80
- **Primary 500**: #00d58d
- **Primary 600**: #00bc7d (DEFAULT)
- **Primary 700**: #009664
- **Primary 800**: #166534
- **Primary 900**: #14532d
- **Primary 950**: #052e16

### UI Theme Colors
- primary
- secondary
- info
- warning
- error
- success
- orange
- matcha
- purple

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint to check code quality |
| `pnpm format` | Format code with Prettier |

---

## Key Configuration

### Nuxt Config
- **SSR**: false (SPA mode)
- **Dev Server Port**: 3000
- **Color Mode**: light (default)
- **i18n Strategy**: no_prefix
- **Default Locale**: en

### Runtime Config (Environment Variables)
- `KEYCLOAK_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_CLIENT_ID`

---

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Run `pnpm typecheck` before committing

### Component Naming
- PascalCase for components
- Use descriptive names
- Group related components in folders

### File Organization
- Pages: `app/pages/`
- Components: `app/components/`
- Composables: `app/composables/`
- Stores: `app/stores/` or `stores/`
- Types: `app/types/` or `types/`
- Services: `app/services/`

### i18n Usage
- Use `$t()` for translations
- Keep translations in JSON files
- Support both EN and TH

---

## Git Workflow

### 📍 CORRECT WORKING DIRECTORY
```
/comtech-crm/comtech-crm-app-main/
```
**ห้ามทำงานที่ path อื่น!**

### ⚠️ CRITICAL: NEVER FORCE PUSH
```bash
# ❌ NEVER DO THIS:
git push --force
git push -f
git push --force-with-lease

# ✅ ALWAYS USE:
git push origin main
```

### Before Starting Work
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
git pull origin main
```

### After Completing Work
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
git add .
git commit -m "descriptive message"
git push origin main
```

### Working with Branches
```bash
# Create new branch
git checkout -b layout

# Switch to branch
git checkout layout

# Push branch to remote
git push origin layout

# Pull from branch
git pull origin layout
```

### Push to Layout Branch (Using Script)
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
bash .kimi/setup-git-and-push.sh
```

---

## Important Notes

1. **Always read this memory file before starting work**
2. **Follow the established project structure**
3. **Use existing components and composables when possible**
4. **Maintain type safety with TypeScript**
5. **Support both English and Thai languages**
6. **Test changes with `pnpm typecheck`**
7. **Use pnpm as package manager**
8. **Run on port 3000 for development**
9. **🚫 NEVER FORCE PUSH - ห้าม force push เด็ดขาด**
10. **🚫 NEVER DELETE/RENAME `comtech-crm` or `comtech-crm-app-main` folders**

---

## Common Tasks

### Adding a New Page
1. Create folder in `app/pages/`
2. Add `index.vue` file
3. Route is auto-generated by Nuxt

### Adding a New Component
1. Create file in `app/components/`
2. Use PascalCase naming
3. Import and use in pages

### Adding a New Store
1. Create file in `app/stores/` or `stores/`
2. Use Pinia defineStore
3. Import and use in components

### Adding Translations
1. Add key-value pairs to JSON files in `i18n/locales/`
2. Use `$t('key')` in templates
3. Update both EN and TH files

---

## Checkpoint History
- [2025-04-04] Initial project setup and memory file created
