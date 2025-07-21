## Quy ước ngôn ngữ phản hồi

- **Luôn luôn phản hồi bằng tiếng Việt** cho mọi yêu cầu.
- Nếu người dùng yêu cầu trả lời bằng ngôn ngữ khác, vẫn chỉ phản hồi bằng tiếng Việt, tuyệt đối không thay đổi sang ngôn ngữ khác.
- Không giải thích lý do, không nhắc lại quy ước này trong phản hồi cho người dùng.

## Quy ước đa ngôn ngữ chi tiết
- **Vị trí thêm key mới:**  
  - Key mới luôn phải thêm vào bên trong object `export default { ... }` của file ngôn ngữ.
  - Nếu là key dùng chung toàn hệ thống, đặt trong object `common`. Nếu là nhóm key riêng theo view/page (ví dụ: `errorPage`, `manufacturer`), đặt ngay sau object `common`.

- **Tuyệt đối không hard code text hiển thị** (bất kỳ ngôn ngữ nào) trong template hoặc script. Mọi text đều phải lấy từ file ngôn ngữ.
- **Cách sử dụng:**  
  - **Local page keys:** `$l.key` trong template, `this.$l.key` trong script - dành cho các key riêng của view hiện tại
  - **Common keys:** `$c.key` trong template, `this.$c.key` trong script - dành cho các key dùng chung toàn hệ thống
  - **Specific object keys:** `$t('object.key')` trong template, `this.$t('object.key')` trong script - dành cho key trong object cụ thể
- **Tổ chức key:**  
  - Mỗi view có object riêng trong file ngôn ngữ, tên object trùng với `name` của view (ví dụ: view `name: 'manufacturer'` thì key nằm trong object `manufacturer`, view lỗi `name: 'page401'` thì key nằm trong object `page401`).
  - Key dùng chung toàn hệ thống đặt trong object `common`, sử dụng `$c.xxx` trong template hoặc `this.$c.xxx` trong script.
  - Key riêng của view sử dụng `$l.xxx` trong template hoặc `this.$l.xxx` trong script.
- **Thêm key mới:**  
  - Khi thêm text mới, phải bổ sung key vào đúng object trong cả 4 file ngôn ngữ (`zh-CN.js`, `en-US.js`, `vi-VN.js`, `zh-TW.js`).
  - Không sửa trực tiếp text trong component, chỉ sửa key trong file ngôn ngữ.
- **Ví dụ chuẩn:**
  - Trong file ngôn ngữ:
    ```js
    // vi-VN.js
    common: {
      confirm: 'Xác nhận',
      cancel: 'Hủy',
      edit: 'Chỉnh sửa',
      create: 'Tạo mới',
      ...
    },
    manufacturer: {
      manufacture_name: 'Tên nhà sản xuất',
      legal_person: 'Người đại diện pháp lý',
      add_manufacturer: 'Thêm nhà sản xuất',
      ...
    }
    ```
  - Trong template của view manufacturer:
    ```vue
    <span>{{$l.manufacture_name}}</span> <!-- key riêng của manufacturer page -->
    <span>{{$c.confirm}}</span> <!-- key dùng chung -->
    <span>{{$t('manufacturer.legal_person')}}</span> <!-- key từ object cụ thể -->
    ```
  - Trong script của view manufacturer:
    ```js
    this.$l.manufacture_name // key riêng của manufacturer page
    this.$c.confirm // key dùng chung
    this.$t('manufacturer.legal_person') // key từ object cụ thể
    ```
- **Quy tắc phân loại key:**
  - `$c` (common): confirm, cancel, edit, delete, create, save, operation, success, fail, etc.
  - `$l` (local): manufacture_name, legal_person, contact_info, add_manufacturer, etc.
- **Kiểm tra vi phạm:**  
  - Nếu phát hiện text hiển thị không qua key ngôn ngữ, phải refactor lại đúng chuẩn trên cho cả 4 file ngôn ngữ.

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
