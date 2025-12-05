# Danh sách các file sử dụng el-table của Element UI

## Tóm tắt
Tổng cộng: **21 file** sử dụng `el-table` trong dự án aph-web

---

## Trong aph-web

### Common Components (_common)
1. **Table.vue** - `src/views/_common/Table.vue`
   - Sử dụng: 1 el-table chính cho danh sách dữ liệu
   - Props binding, row-key, column dynamics

2. **chooseUser.vue** - `src/views/_common/chooseUser.vue`
   - Sử dụng: 1 el-table với selection checkbox
   - Column: userid, name, dept

---

### Video User Views
3. **Play4.vue** - `src/views/sysbasics/video/userViews/Play4.vue`
   - Sử dụng: 1 el-table cho danh sách bài exam
   - Column: index, examedTime, examUser, examScore, operation

---

### Video Admin Components
4. **lesson/course.vue** - `src/views/sysbasics/video/adminViews/component/lesson/course.vue`
   - Sử dụng: Có FilePreviews (chưa scan chi tiết)

---

### Compliance (sysbasics/compliance)
5. **ImproveManagement.vue** - `src/views/sysbasics/compliance/ImproveManagement.vue`
   - Sử dụng: 4 el-table
     - form.fileList
     - file.list (file dialog)
     - roleList.list
     - recEmailList.list
   - CSS: .modern-table styling

6. **investigationInfo.vue** - `src/views/sysbasics/compliance/investigationInfo.vue`
   - Sử dụng: Nested el-table columns
     - basicInformation
     - complianceContactInfor
     - latestSeaAudit

---

### Compliance2 (sysbasics/compliance2)
7. **investigation.vue** - `src/views/sysbasics/compliance2/investigation.vue`
   - Sử dụng: 3 el-table (tương tự compliance)
     - editSurvey.fileList
     - checkSurvey.fileList
     - addSurvey.fileList

8. **investigationInfo.vue** - `src/views/sysbasics/compliance2/investigationInfo.vue`
   - Sử dụng: Nested el-table columns (tương tự compliance)

---

## Trong aph-web-t1-subcon

### Common Components (_common)
9. **table.vue** - `src/views/_common/table.vue`
   - Sử dụng: 1 el-table chính (dynamics columns + operations)

10. **chooseUser.vue** - `src/views/_common/chooseUser.vue`
    - Sử dụng: 1 el-table với selection (userid, name, dept)

---

### Compliance (sysbasics/compliance)
11. **investigation.vue** - `src/views/sysbasics/compliance/investigation.vue`
    - Sử dụng: 8 el-table
      - editSurvey.fileList
      - checkSurvey.fileList
      - addSurvey.fileList
      - manufacture.list (2 instances)
      - roleList.list
      - recEmailList.list
      - checkFile.fileList

12. **investigationInfo.vue** - `src/views/sysbasics/compliance/investigationInfo.vue`
    - Sử dụng: Nested el-table columns

---

## Ưu tiên Chuyển đổi

### Mức 1 - Cao (Component tái sử dụng, ảnh hưởng lớn)
- [ ] **Table.vue** (aph-web & aph-web-t1-subcon) - Sử dụng ở nhiều trang
- [ ] **chooseUser.vue** (aph-web & aph-web-t1-subcon) - Component lựa chọn người dùng

### Mức 2 - Trung (Nhiều tables, phức tạp)
- [ ] **ImproveManagement.vue** (aph-web) - 4 tables
- [ ] **investigation.vue** (aph-web-t1-subcon) - 8 tables
- [ ] **investigationInfo.vue** (cả 2 projects) - Nested tables

### Mức 3 - Thấp (Ít bảng, đơn giản)
- [ ] **Play4.vue** (aph-web) - 1 table đơn giản
- [ ] **course.vue** (aph-web) - Có FilePreviews

---

## Ghi chú
- Các file trong aph-web-t1-subcon có cấu trúc tương tự aph-web
- Nhiều tables là dynamic columns từ data array
- Cần giữ nguyên functionality: selection, striped rows, operations column, etc.
- Element-UI tables có CSS styling riêng cần port sang Tailwind

