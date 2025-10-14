## Quy ước ngôn ngữ phản hồi

- **Luôn luôn phản hồi bằng tiếng Việt** cho mọi yêu cầu.
- Nếu người dùng yêu cầu trả lời bằng ngôn ngữ khác, vẫn chỉ phản hồi bằng tiếng Việt, tuyệt đối không thay đổi sang ngôn ngữ khác.
- Không giải thích lý do, không nhắc lại quy ước này trong phản hồi cho người dùng.

## Quy ước chạy lệnh shell

- Luôn thực thi lệnh bằng `cmd.exe`.
- Tuyệt đối không sử dụng PowerShell/pwsh trong bất kỳ trường hợp nào.

## 🌐 QUY TẮC ĐA NGÔN NGỮ CHẶT CHẼ - TUÂN THỦ NGHIÊM NGẶT

### 🚨 NGUYÊN TẮC TUYỆT ĐỐI
1. **KHÔNG BAO GIỜ hard code text hiển thị** trong template hoặc script (bất kỳ ngôn ngữ nào: tiếng Việt, tiếng Anh, tiếng Trung...)
2. **MỌI text hiển thị phải qua hệ thống đa ngôn ngữ** - không có ngoại lệ
3. **Khi thêm text mới, phải cập nhật đồng thời cả 4 file ngôn ngữ** (`vi-VN.js`, `en-US.js`, `zh-CN.js`, `zh-TW.js`)

### 📍 CẤU TRÚC FILE NGÔN NGỮ BẮT BUỘC
```js
// Tất cả file ngôn ngữ phải tuân theo cấu trúc này:
export default {
  // 1. Object common luôn đứng đầu - chứa key dùng chung
  common: {
    confirm: '...',
    cancel: '...',
    edit: '...',
    delete: '...',
    create: '...',
    save: '...',
    search: '...',
    // ... các key common khác
  },
  
  // 2. Object riêng cho từng view/page (tên = name của component)
  manufacturer: { // component name: 'manufacturer'
    manufacture_name: '...',
    legal_person: '...',
    // ... key riêng của manufacturer
  },
  
  improveManagement: { // component name: 'improveManagement'
    issue_management: '...',
    rectification_info: '...',
    // ... key riêng của improveManagement
  }
  
  // ... các object khác theo tên component
}
```

### 🎯 PHÂN LOẠI VÀ SỬ DỤNG KEY
#### **1. COMMON KEYS ($c) - Key dùng chung toàn hệ thống**
- **Tiêu chí**: Button actions, status, messages dùng ở nhiều nơi
- **Danh sách key common chuẩn**:
  ```js
  common: {
    // Actions
    confirm: 'Xác nhận', cancel: 'Hủy', edit: 'Chỉnh sửa', 
    delete: 'Xóa', create: 'Tạo mới', save: 'Lưu', 
    search: 'Tìm kiếm', reset: 'Đặt lại', submit: 'Gửi',
    view: 'Xem', download: 'Tải xuống', upload: 'Tải lên',
    
    // Status
    success: 'Thành công', fail: 'Thất bại', error: 'Lỗi',
    loading: 'Đang tải...', pending: 'Đang chờ',
    active: 'Hoạt động', inactive: 'Không hoạt động',
    
    // Messages
    no_data: 'Không có dữ liệu', 
    operation_success: 'Thao tác thành công',
    operation_failed: 'Thao tác thất bại',
    confirm_delete: 'Bạn có chắc chắn muốn xóa?',
    
    // Form
    required_field: 'Trường bắt buộc',
    invalid_format: 'Định dạng không hợp lệ',
    please_select: 'Vui lòng chọn',
    please_input: 'Vui lòng nhập'
  }
  ```
- **Cách sử dụng**: `$c.key` trong template, `this.$c.key` trong script

#### **2. LOCAL KEYS ($l) - Key riêng của từng component**
- **Tiêu chí**: Text chỉ dùng trong component hiện tại
- **Quy tắc đặt tên object**: Trùng với `name` của Vue component
- **Ví dụ**:
  ```js
  // Component: name: 'manufacturer'
  manufacturer: {
    manufacture_name: 'Tên nhà sản xuất',
    legal_person: 'Người đại diện pháp lý',
    add_manufacturer: 'Thêm nhà sản xuất',
    manufacturer_list: 'Danh sách nhà sản xuất'
  }
  ```
- **Cách sử dụng**: `$l.key` trong template, `this.$l.key` trong script

#### **3. SPECIFIC OBJECT KEYS ($t) - Key từ object cụ thể**
- **Khi nào dùng**: Cần truy cập key từ object khác ngoài component hiện tại
- **Cách sử dụng**: `$t('objectName.key')` trong template, `this.$t('objectName.key')` trong script

### 🔄 QUY TRÌNH THÊM KEY MỚI - BẮT BUỘC TUÂN THỦ
#### **Bước 1: Xác định loại key**
- Nếu dùng ở nhiều component → Thêm vào `common`
- Nếu chỉ dùng trong 1 component → Thêm vào object của component đó

#### **Bước 2: Kiểm tra tên object component**
```js
// Trong file .vue, tìm phần:
export default {
  name: 'componentName', // ← Tên này phải trùng với object trong file ngôn ngữ
  // ...
}
```

#### **Bước 3: Thêm key vào CẢ 4 FILE ngôn ngữ**
```js
// vi-VN.js
componentName: {
  new_key: 'Text tiếng Việt'
}

// en-US.js  
componentName: {
  new_key: 'English text'
}

// zh-CN.js
componentName: {
  new_key: '简体中文文本'
}

// zh-TW.js
componentName: {
  new_key: '繁體中文文本'
}
```

#### **Bước 4: Sử dụng trong component**
```vue
<template>
  <span>{{ $l.new_key }}</span>
</template>

<script>
export default {
  name: 'componentName',
  methods: {
    showMessage() {
      this.$message.success(this.$l.new_key)
    }
  }
}
</script>
```

### ❌ CÁC VI PHẠM THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC
#### **Vi phạm 1: Hard code text**
```vue
<!-- ❌ SAI -->
<span>Tên nhà sản xuất</span>
<el-button>Lưu</el-button>

<!-- ✅ ĐÚNG -->
<span>{{ $l.manufacture_name }}</span>
<el-button>{{ $c.save }}</el-button>
```

#### **Vi phạm 2: Tên object không trùng với component name**
```js
// ❌ SAI - Component name: 'manufacturer' nhưng object là 'manufacturerPage'
export default {
  name: 'manufacturer'
}

// File ngôn ngữ
manufacturerPage: { // ← Sai, phải là 'manufacturer'
  title: '...'
}

// ✅ ĐÚNG
manufacturer: { // ← Trùng với component name
  title: '...'
}
```

#### **Vi phạm 3: Thêm key không đồng bộ**
```js
// ❌ SAI - Chỉ thêm vào 1-2 file
// vi-VN.js có key mới, nhưng en-US.js không có

// ✅ ĐÚNG - Thêm vào cả 4 file cùng lúc
```

### 🔍 CHECKLIST KIỂM TRA TUÂN THỦ
- [ ] Không có text hard code trong template/script
- [ ] Object name trùng với component name  
- [ ] Key mới đã thêm vào cả 4 file ngôn ngữ
- [ ] Sử dụng đúng $c/$l/$t theo phân loại
- [ ] Key common không trùng lặp với key local
- [ ] Tất cả key đều có translation phù hợp với ngữ cảnh

### 🎨 TEMPLATE CHUẨN CHO COPILOT
Khi được yêu cầu thêm đa ngôn ngữ, luôn làm theo template này:

1. **Phân tích component name**: Tìm `name: 'xxxxx'` trong file .vue
2. **Phân loại key**: common hay local
3. **Thêm key vào 4 file ngôn ngữ đồng thời**:
   - `src/lang/vi-VN.js`
   - `src/lang/en-US.js` 
   - `src/lang/zh-CN.js`
   - `src/lang/zh-TW.js`
4. **Update component sử dụng key mới**
5. **Kiểm tra không còn hard code text**

# Hướng dẫn Copilot cho aph-web

## Tổng quan dự án
- Đây là dự án dashboard quản trị front-end sử dụng Vue 2.x + Element-UI, kết hợp Vuex, Vue Router, Axios, ES2015+ **và TailwindCSS 2**.
- Kiến trúc dạng module: `src/api` (định nghĩa API), `src/components` (UI dùng chung), `src/views` (các trang), `src/router` (định tuyến), `src/store` (Vuex modules), `src/utils` (hàm tiện ích), và `src/styles` (style toàn cục).
- Layout chính quản lý qua `src/views/layout/Layout.vue`, hầu hết các trang là con của layout này. Các trang login, 404... dùng layout riêng.
- Định tuyến chia thành `constantRoutes` (luôn tải, ví dụ login, 404) và `asyncRoutes` (tải động dựa trên quyền/role từ backend).
- Các endpoint API định nghĩa ở `src/api/index.js`, truy cập qua `this.$api` trong component. Mọi request dùng wrapper Axios tùy chỉnh ở `src/utils/request.js`.
- Đa ngôn ngữ qua `src/lang` dùng vue-i18n. Thêm key mới vào file JS tương ứng.
- **Sử dụng TailwindCSS 2:**
  - Đã tích hợp TailwindCSS 2 cho utility-first CSS. Có thể sử dụng class Tailwind trực tiếp trong template để xây dựng layout, spacing, màu sắc, typography, v.v.
  - File cấu hình: `tailwind.config.js`, style import tại `src/assets/css/tailwind.css`.
  - Ưu tiên dùng class Tailwind cho layout, spacing, màu sắc, font, responsive. Chỉ dùng CSS custom khi thật sự cần thiết.
  - Có thể kết hợp class Tailwind với Element-UI để tuỳ biến giao diện.

## Quy trình phát triển
- **Cài đặt phụ thuộc:** `npm install` (ở Trung Quốc dùng `--registry=https://registry.npm.taobao.org` để tăng tốc)
- **Chạy dev server:** `npm run serve`
- **Build production:** `npm run build`
- **File khởi động:** `src/main.js` (mount App.vue, cấu hình router/store)
- **Shell chạy lệnh:** Luôn dùng `cmd.exe` trên Windows để thực thi lệnh. **Tuyệt đối không khởi chạy hoặc đề xuất PowerShell/pwsh** vì môi trường này đã bị chặn.
- **Thêm trang mới:**
  1. Tạo file `.vue` trong `src/views/`.
  2. Thêm route ở `src/router/` (chia module theo tính năng).
  3. Thêm API mới ở `src/api/` nếu cần.


## Quy ước dự án
- **Style component:** Dùng `<style scoped>` trong file `.vue` để tránh ảnh hưởng toàn cục. Style toàn cục đặt ở `src/styles/`.
- **Icon:** Đặt SVG vào `src/icons/svg/` và dùng `<svg-icon icon-class="name" />`. Có thể dùng FontAwesome qua `<i class="fa fa-xxx" />`.
- **Mẫu API:** Dùng `this.$request(url, params, method)` cho mọi HTTP call. Hiển thị lỗi toàn cục trừ khi đặt `donotAutoShowError`.
- **Quyền truy cập/route guard:** Xem `src/router/permission.js` để hiểu cách load route động và phân quyền. Thông tin user và quyền được lấy sau đăng nhập để sinh route phù hợp.
- **Quản lý state:** Vuex module trong `src/store/modules/`. Dùng action cho logic bất đồng bộ, mutation cho thay đổi state.
- **Đa ngôn ngữ:** Tuyệt đối không được hard code ngôn ngữ/text hiển thị trong template hoặc script. Luôn sử dụng `$l.key` trong template, và thêm key mới vào file tương ứng trong `src/lang/`.


## Style Guide - Giao diện OKX Style (Đồng bộ toàn hệ thống)

### 1. Nền & border
- **Nền trắng (`bg-white`) hoặc đen (`dark:bg-black`), border dưới mỏng (`border-b border-gray-100 dark:border-gray-700`).**
- **Các vùng/card/dialog/table đều có border radius lớn (`rounded-lg` hoặc `rounded-xl`), shadow nhẹ (`shadow`, `shadow-lg`).**

### 2. Icon, nút, avatar
- **Icon, nút, avatar đều bo tròn (`rounded-full` hoặc `rounded-md`).**
- **Nút/box chức năng:** `h-10 w-10 flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:scale-105 transition dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727]`
- **Hiệu ứng hover:** Đổi nền, scale nhẹ, chuyển màu mượt.

### 3. Dropdown, dialog, card
- **Dropdown, dialog, card:** `bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg p-6`
- **Menu/dropdown:** `w-[240px]`, padding lớn, border radius lớn, shadow mạnh, tách biệt nền.

### 4. Typography & spacing
- **Font:** Sans-serif, size 14-16px, heading 18-20px, `font-semibold` cho tiêu đề.
- **Spacing:** Sử dụng `gap-3`, `gap-4`, `px-4`, `py-3`, `space-x-3`, `space-y-4` cho bố cục.
- **Label/input:** `font-medium text-gray-700`, input bo tròn, border mỏng, focus border xanh.

### 5. Table, form, section
- **Table:** `rounded-lg shadow`, header đậm, row hover `bg-gray-50`, padding đều.
- **Form:** Input, select, radio, button đều bo tròn, spacing đều, label rõ ràng.
- **Section:** Card hoặc box có shadow, border radius lớn, padding rộng, header section có icon bo tròn màu xanh.

### 6. Responsive
- **Luôn dùng flex, grid, gap, breakpoint Tailwind (`md:`, `lg:`...) cho layout.**
- **Ẩn bớt item trên mobile, ưu tiên icon, nút tròn.**

### 7. Best practice
- **Luôn dùng Tailwind cho layout, spacing, màu sắc, font, hover, shadow.**
- **Không dùng CSS custom trừ khi thật sự cần thiết.**
- **Không hard code text, luôn lấy từ file ngôn ngữ.**
- **Tất cả component phải đồng bộ style với Navbar: bo tròn, shadow, hover, padding rộng, font hiện đại.**

---
- **Backend:** Kết nối API backend cho auth, user, menu, role... (xem `src/api/index.js`).
- **Thư viện bên ngoài:** Sử dụng Element-UI, vue-i18n, FontAwesome, và Axios.

## Ví dụ
- **Thêm endpoint API mới:**
  - Thêm vào `src/api/index.js`:
    ```js
    banner: url + 'platform/banner/'
    ```
- **Thêm chuỗi ngôn ngữ mới:**
  - Sửa `src/lang/zh-CN.js`:
    ```js
    demo: { test: '测试' }
    ```
- **Thêm route mới:**
  - Sửa `src/router/admin.js` (hoặc module liên quan):
    ```js
    { path: '/new', component: () => import('@/views/newpage'), meta: { title: '新页面' } }
    ```

## File/thư mục quan trọng
- `src/views/layout/Layout.vue` — layout chính
- `src/router/` — logic định tuyến và guard
- `src/api/index.js` — endpoint API
- `src/utils/request.js` — wrapper Axios
- `src/lang/` — tài nguyên i18n
- `src/store/` — Vuex modules
- `src/styles/` — style toàn cục

---
Để biết thêm chi tiết, xem `README.md` hoặc hỏi ví dụ workflow cụ thể.
