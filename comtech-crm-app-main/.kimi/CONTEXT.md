# CONTEXT - ต้องอ่านก่อนทำงานทุกครั้ง

## ⚠️ CRITICAL RULES (ห้ามทำผิดเด็ดขาด)

### 1. FOLDER STRUCTURE (สำคัญที่สุด)
```
/mnt/okcomputer/                    ← ROOT (ห้ามสร้างอะไรที่นี่!)
└── comtech-crm/                    ← อนุญาตให้มีแค่นี้
    └── comtech-crm-app-main/       ← ทำงานที่นี่เท่านั้น
        ├── .kimi/                  ← เก็บไฟล์นี้ + tasks.md
        ├── app/
        ├── i18n/
        └── ...
```

**❌ ห้ามสร้างที่ ROOT:**
- `.current_page.txt`
- `.store`
- `.todo.jsonl`
- `deploy/`
- `output/`
- `upload/` (ยกเว้นรูปจาก user)
- อื่นๆ ทั้งหมด

### 2. GIT WORKFLOW (ต้องทำตามลำดับ)
```
1. cd /mnt/okcomputer/comtech-crm/comtech-crm-app-main
2. git pull origin approve          ← ต้อง pull ก่อน!
3. ทำงาน...
4. git add .
5. git commit -m "message"
6. git push origin approve          ← ห้ามใช้ --force!
```

**❌ ห้าม:** `git push --force` หรือ `git push -f`

### 3. BEFORE STARTING (ต้องทำก่อนเริ่ม)
- [ ] อ่านไฟล์นี้ (CONTEXT.md)
- [ ] อ่าน tasks.md
- [ ] Pull โค้ดล่าสุด
- [ ] รู้ว่าต้องทำอะไร

### 4. BEFORE PUSHING (ต้องทำก่อน push)
- [ ] Test รันไม่มี error
- [ ] Update tasks.md
- [ ] Commit แล้ว
- [ ] ไม่ใช้ --force

---

## 📋 PROJECT INFO

### Repository
- **GitHub:** https://github.com/Ruttanachote/comtech-crm
- **Branch:** `approve`
- **Working folder:** `comtech-crm-app-main/`

### Tech Stack
- Nuxt 4 + Vue 3
- @nuxt/ui v4 (ใช้ไม่ได้ → ใช้ native)
- Pinia (stores)
- i18n (TH/EN)

### Known Issues
1. **UButton/UModal ไม่ทำงาน** → ใช้ native HTML/CSS แทน
2. **ต้อง install dependencies** → รัน `pnpm install` บนเครื่อง user

---

## 🎯 APPROVAL SYSTEM

### Pages
- `/approvals` - List page
- `/approvals/:id` - Detail page

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

### i18n Files
- `en.approval.json`
- `th.approval.json`

---

## 📝 CHECKLIST ก่อน PUSH

```
☐ อยู่ใน /mnt/okcomputer/comtech-crm/comtech-crm-app-main/
☐ ไม่มีไฟล์/โฟลเดอร์ที่ root /mnt/okcomputer/
☐ Pull ล่าสุดแล้ว
☐ Test รันไม่มี error
☐ Update tasks.md แล้ว
☐ Commit แล้ว
☐ ไม่ใช้ --force
```

---

## 🔗 QUICK LINKS

- Figma Design: https://data-excel-25664879.figma.site/
- GitHub: https://github.com/Ruttanachote/comtech-crm/tree/approve

---

**อ่านจบแล้ว? เริ่มทำงานได้!** ✅
