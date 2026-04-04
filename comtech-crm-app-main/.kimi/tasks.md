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
- [x] Create Profile Dropdown Component
  - [x] Create Types (profile.type.ts)
  - [x] Create Pinia Store (profile.store.ts)
  - [x] Create Service (profile.service.ts)
  - [x] Create Mock Data (profile.mock.ts)
  - [x] Create i18n (en.profile.json, th.profile.json)
  - [x] Create Component (ProfileDropdown.vue)
  - [x] Create Composable (useProfile.ts)
  - [x] Update AppHeaderMenu.vue to use ProfileDropdown
  - [x] Create MicrosoftCalendarModal with full Microsoft Sync UI
- [x] Create Approvals Module
  - [x] Create Types (approval.type.ts)
  - [x] Create Pinia Store (approval.store.ts)
  - [x] Create Service (approval.service.ts)
  - [x] Create Mock Data (approval.mock.ts)
  - [x] Create i18n (en.approval.json, th.approval.json)
  - [x] Create Components (ApprovalStats, ApprovalCard, ApprovalList, ApprovalFilters, ApprovalConfirmModal)
  - [x] Create Composable (useApproval.ts)
  - [x] Create Page (approvals/index.vue)
  - [x] Create Plugin (approval.ts)
  - [x] Update nuxt.config.ts with approval i18n files

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

### 2025-04-04 (MISTAKE & FIX)
- **Status**: 🔴 ERROR → 🟢 FIXED
- **Mistake**: Push ไฟล์ผิดที่ (ไปที่ root แทน `comtech-crm-app-main/`)
- **Impact**: ไฟล์ notification ไปอยู่ที่ `/app/`, `/i18n/`, `/server/` แทนที่จะเป็น `/comtech-crm-app-main/...`
- **Cause**: 
  - ไม่ตรวจสอบ path ก่อน push
  - ไม่ได้ Pull ก่อนทำงาน
  - ใช้ GitHub API โดยไม่ระบุ path prefix
- **Fix**:
  - สร้าง tree ใหม่โดยข้ามไฟล์ที่ผิด
  - เพิ่มไฟล์ใหม่ด้วย path ที่ถูกต้อง (`comtech-crm-app-main/...`)
  - Commit: `a7d88bd` - fix: Move notification files to correct location
- **Lesson Learned**:
  - ✅ ตรวจสอบ path ทุกครั้งก่อน push
  - ✅ Pull ก่อน Push เสมอ
  - ✅ ตรวจสอบผลลัพธ์หลัง push ที่ GitHub
  - ✅ ทุกไฟล์ต้องอยู่ใน `comtech-crm-app-main/`

### 2025-04-04 (Profile Dropdown)
- **Status**: 🟢 Completed
- **Feature**: Profile Dropdown Component
- **Files Created**:
  - `app/types/profile.type.ts` - TypeScript types (UserProfile, ExternalConnection)
  - `app/stores/profile.store.ts` - Pinia store for profile state
  - `app/services/profile.service.ts` - API service for profile
  - `app/data/mock/profile.mock.ts` - Mock user data and connections
  - `app/composables/useProfile.ts` - Profile composable
  - `app/components/profile/ProfileDropdown.vue` - Main component
  - `app/components/profile/MicrosoftCalendarModal.vue` - Microsoft Sync modal
  - `i18n/locales/en.profile.json` - English translations
  - `i18n/locales/th.profile.json` - Thai translations
- **Files Updated**:
  - `nuxt.config.ts` - Added profile i18n files
  - `app/layouts/AppHeaderMenu.vue` - Replaced old profile with ProfileDropdown
- **Design Features** (matching Figma):
  - Large avatar with user initials (SA)
  - User name, email, and role badge
  - Microsoft Calendar connection (Not connected) - opens modal
  - System Settings menu item
  - Sign out button (red color with icon)
- **MicrosoftCalendarModal Features**:
  - Back button with "Microsoft Sync" title
  - Outlook / Office 365 card with info icon
  - Description about syncing calendar events
  - "Connect Microsoft Account" button
- **Commit**: `a32ba80` - fix: Use modal with Microsoft Sync UI instead of separate page

### 2025-04-05 (Approvals Module)
- **Status**: 🟢 Completed
- **Feature**: Approvals Module (อนุมัติเอกสาร)
- **Files Created**:
  - `app/types/approval.type.ts` - TypeScript types (ApprovalDocument, ApprovalStats, ApprovalFilters)
  - `app/stores/approval.store.ts` - Pinia store for approval state
  - `app/services/approval.service.ts` - API service for approvals
  - `app/data/mock/approval.mock.ts` - Mock approval documents and stats
  - `app/composables/useApproval.ts` - Approval composable
  - `app/components/approval/ApprovalStats.vue` - Stats cards component
  - `app/components/approval/ApprovalCard.vue` - Individual approval card
  - `app/components/approval/ApprovalList.vue` - List with pagination
  - `app/components/approval/ApprovalFilters.vue` - Filter bar component
  - `app/components/approval/ApprovalConfirmModal.vue` - Confirm approve/reject modal
  - `app/pages/approvals/index.vue` - Main approvals page
  - `app/plugins/approval.ts` - Approval service plugin
  - `i18n/locales/en.approval.json` - English translations
  - `i18n/locales/th.approval.json` - Thai translations
- **Files Updated**:
  - `nuxt.config.ts` - Added approval i18n files
  - `.kimi/tasks.md` - Updated task checklist
- **Design Features** (matching Figma 100%):
  - Stats cards: All, Pending, Approved, Rejected with click-to-filter
  - Document cards with document number, priority badge (ด่วน/ปานกลาง)
  - Customer info, value (มูลค่า), sender (ผู้ส่ง), waiting at (รออนุมัติที่)
  - Days pending indicator
  - Approve/Reject action buttons
  - Filter bar with search, status, type, priority, sort
  - Export functionality (Excel/CSV)
  - Pagination with page size selector
  - Detail modal with full document info
  - Confirm modal for approve/reject actions
- **Features**:
  - Full CRUD operations via Pinia store
  - Filter by status, type, priority
  - Search by document number, title, customer
  - Sort by newest, oldest, value, priority
  - i18n support (TH/EN)
  - Responsive design
  - Toast notifications for actions

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

#### ⚠️ MANDATORY: Pull Before Push
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main

# 1. PULL ก่อนเสมอ (ห้ามลืม!)
git pull origin layout

# 2. ตรวจสอบว่าไฟล์อยู่ถูกที่ (ต้องอยู่ใน comtech-crm-app-main/)
ls /mnt/okcomputer/comtech-crm/comtech-crm-app-main/

# 3. Add และ Commit
git add .
git commit -m "descriptive message"

# 4. Push
git push origin layout

# 5. ตรวจสอบผลลัพธ์ที่ GitHub
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
