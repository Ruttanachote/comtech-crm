# COMTECH CRM - Task Management

## Current Tasks

### 🟢 Completed
- [x] Create and push new branch "layout"

### 🔴 Pending
- [ ] Review all existing components
- [ ] Review all pages functionality
- [ ] Check API services integration
- [ ] Verify authentication flow

### 🟡 In Progress
- [ ] None

### 🟢 Completed
- [x] Clone repository
- [x] Analyze project structure
- [x] Create memory.md with full project documentation
- [x] Create tasks.md for task tracking
- [x] Create git-workflow.sh for automation
- [x] Create .kimi folder structure
- [x] Setup correct folder structure: `comtech-crm/comtech-crm-app-main/`
- [x] Add force push warning to all files
- [x] Document folder protection rules
- [x] Finalize folder structure: `comtech-crm/comtech-crm-app-main/`
- [x] Create setup-git-and-push.sh script for layout branch
- [x] Create Notification System with WebSocket
  - [x] Create Types (notification.type.ts)
  - [x] Create Pinia Store (notification.store.ts)
  - [x] Create Service (notification.service.ts)
  - [x] Create Mock Data (notification.mock.ts)
  - [x] Create i18n (en.notifications.json, th.notifications.json)
  - [x] Create Components (NotificationDropdown, NotificationBell, NotificationPanel, NotificationItem, NotificationIcon)
  - [x] Create Composable (useNotification.ts)
  - [x] Create WebSocket Server (notification.server.ts)
  - [x] Create README.md for notification system

---

## Task History

### 2025-04-04
- **Status**: 🟢 Completed
- **Tasks**:
  - Cloned repository from GitHub
  - Analyzed project structure
  - Created memory.md for project reference
  - Created tasks.md for task tracking
  - Created git-workflow.sh for automation
  - Created push-to-github.sh as alternative
  - Created .gitignore file
  - Documented tech stack and configuration
  - Setup correct folder structure: `comtech-crm/comtech-crm-app-main/`
  - Added force push prohibition warnings
  - Added folder protection rules
  - Finalized correct folder structure: `comtech-crm/comtech-crm-app-main/`
  - Created setup-git-and-push.sh for layout branch push
  - Created branch "layout" on GitHub

### 2025-04-04 (Branch Creation)
- **Status**: 🟢 Completed
- **Branch**: `layout`
- **URL**: https://github.com/Ruttanachote/comtech-crm/tree/layout
- **Tasks**:
  - Created new branch "layout" from main
  - Branch ready for development

### 2025-04-04 (Notification System)
- **Status**: 🟢 Completed
- **Feature**: Notification System with WebSocket
- **Files Created**:
  - `app/types/notification.type.ts` - TypeScript types
  - `app/stores/notification.store.ts` - Pinia store
  - `app/services/notification.service.ts` - API & WebSocket service
  - `app/data/mock/notification.mock.ts` - Mock data
  - `i18n/locales/en.notifications.json` - English translations
  - `i18n/locales/th.notifications.json` - Thai translations
  - `app/composables/useNotification.ts` - Composable
  - `app/components/notification/NotificationDropdown.vue` - Main component
  - `app/components/notification/NotificationBell.vue` - Bell icon
  - `app/components/notification/NotificationPanel.vue` - Notification panel
  - `app/components/notification/NotificationItem.vue` - Notification item
  - `app/components/notification/NotificationIcon.vue` - Type icon
  - `app/components/notification/README.md` - Documentation
  - `server/websocket/notification.server.ts` - WebSocket server
- **Features**:
  - Real-time notifications via WebSocket
  - Badge count for unread notifications
  - Tab filtering (All / Unread)
  - Mark as read (single / all)
  - Delete notifications
  - Priority levels (High/Medium/Low)
  - Time ago formatting
  - i18n support (TH/EN)
  - Responsive design

---

## How to Use This File

### Adding a New Task
```markdown
### [YYYY-MM-DD]
- **Status**: 🔴 Pending / 🟡 In Progress / 🟢 Completed
- **Tasks**:
  - [ ] Task description
```

### Updating Task Status
1. Move task between sections (Pending → In Progress → Completed)
2. Update checkbox: `[ ]` → `[x]`
3. Add completion date

### Git Workflow Reminder

#### 📍 WORKING DIRECTORY (ห้ามเปลี่ยน!)
```
/mnt/okcomputer/comtech-crm/comtech-crm-app-main/
```

#### Before Starting Work
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
git pull origin main
```

#### After Completing Work
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
git add .
git commit -m "descriptive message"
git push origin main
```

#### Working with Branches
```bash
# Create and switch to new branch
git checkout -b layout

# Push branch to remote
git push origin layout

# Pull from branch
git pull origin layout
```

#### ⚠️ NEVER DO THIS:
```bash
# git push --force  ❌ FORBIDDEN!
# git push -f       ❌ FORBIDDEN!
```

---

## Quick Reference

### Project Location
```
/mnt/okcomputer/comtech-crm/comtech-crm-app-main/
```
⚠️ **ห้ามลบหรือเปลี่ยนชื่อ `comtech-crm` และ `comtech-crm-app-main`**

### Development Server
```bash
pnpm dev
```

### Type Check
```bash
pnpm typecheck
```

### Format Code
```bash
pnpm format
```

---

## Notes
- Always read `memory.md` before starting work
- Update this file after completing each task
- Follow the established code style
- Support both EN and TH languages