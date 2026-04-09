# COMTECH CRM - Project Memory

## ⚠️ CRITICAL RULES - DO NOT BREAK

### 1. Folder Structure (SACRED)
```
/mnt/okcomputer/
└── comtech-crm/                    ← ONLY THIS FOLDER ALLOWED
    └── comtech-crm-app-main/       ← Project code here
        ├── .kimi/                  ← Task tracking
        ├── app/
        ├── i18n/
        └── ...
```

**❌ NEVER CREATE:**
- `.current_page.txt`
- `.store`
- `.todo.jsonl`
- `deploy/`
- `output/`
- Any other folders at `/mnt/okcomputer/` root

### 2. Git Rules
- ✅ `git pull origin approve` - Before starting
- ✅ `git commit -m "message"` - After changes
- ✅ `git push origin approve` - To push
- ❌ **NEVER** `git push --force` or `git push -f`

### 3. Working Directory
```bash
cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
```

### 4. Install Dependencies (On Your Machine)
```bash
cd C:\Users\nui-j\Desktop\CRM\comtech-crm\comtech-crm-app-main
pnpm install
pnpm dev
```

---

## 📁 Project Structure

```
comtech-crm-app-main/
├── .kimi/                          ← Task & memory files
│   ├── tasks.md
│   └── memory.md                   ← This file
├── app/
│   ├── components/approval/        ← 9 approval components
│   ├── pages/approvals/            ← /approvals routes
│   ├── types/approval.type.ts
│   ├── stores/approval.store.ts
│   ├── services/approval.service.ts
│   └── data/mock/approval.mock.ts
├── i18n/locales/
│   ├── en.approval.json
│   └── th.approval.json
└── nuxt.config.ts
```

---

## 🎯 Approval System Features

### Pages
- `/approvals` - List page with stats, filters, cards
- `/approvals/:id` - Detail page with workflow, actions

### Components (9)
1. ApprovalStats.vue
2. ApprovalCard.vue
3. ApprovalList.vue
4. ApprovalFilters.vue
5. ApprovalTimeline.vue
6. ApprovalActions.vue
7. ApprovalComments.vue
8. ApprovalDocuments.vue
9. ApprovalDetail.vue

### Known Issues
- UButton/UModal from @nuxt/ui v4 not working → Using native HTML/CSS
- Need `pnpm install` on local machine to run

---

## 🔗 GitHub
- **Repository:** https://github.com/Ruttanachote/comtech-crm
- **Branch:** `approve`
- **Working folder:** `comtech-crm-app-main/`

---

## 📝 Last Updated
2025-04-09 - Fixed root folder structure
