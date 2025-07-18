## Quy ước ngôn ngữ phản hồi

- **Luôn luôn phản hồi bằng tiếng Việt** cho mọi yêu cầu.
- Nếu người dùng yêu cầu trả lời bằng ngôn ngữ khác, vẫn chỉ phản hồi bằng tiếng Việt, tuyệt đối không thay đổi sang ngôn ngữ khác.
- Không giải thích lý do, không nhắc lại quy ước này trong phản hồi cho người dùng.

## Quy ước đa ngôn ngữ chi tiết
- **Vị trí thêm key mới:**  
  - Key mới luôn phải thêm vào bên trong object `export default { ... }` của file ngôn ngữ.
  - Nếu là key dùng chung, đặt trong object `common`. Nếu là nhóm key riêng (ví dụ: `errorPage`), đặt ngay sau object `common`.

- **Tuyệt đối không hard code text hiển thị** (bất kỳ ngôn ngữ nào) trong template hoặc script. Mọi text đều phải lấy từ file ngôn ngữ.
- **Cách sử dụng:**  
  - Trong template: dùng `{{$l.key}}` hoặc `{{$t('object.key')}}`  
  - Trong script: dùng `this.$l.key` hoặc `this.$t('object.key')`
- **Tổ chức key:**  
  - Mỗi view có object riêng trong file ngôn ngữ, tên object trùng với `name` của view (ví dụ: view `name: 'shareInformation'` thì key nằm trong object `shareInformation`, view lỗi `name: 'page401'` thì key nằm trong object `page401`, `name: 'page404'` thì key nằm trong object `page404`).
  - Key dùng chung toàn hệ thống đặt trong object `common`, sử dụng `$c.xxx` trong template hoặc `this.$c.xxx` trong script.
- **Thêm key mới:**  
  - Khi thêm text mới, phải bổ sung key vào đúng object trong cả 4 file ngôn ngữ (`zh-CN.js`, `en-US.js`, `vi-VN.js`, `zh-TW.js`).
  - Không sửa trực tiếp text trong component, chỉ sửa key trong file ngôn ngữ.
- **Ví dụ chuẩn:**
  - Trong file ngôn ngữ:
    ```js
    // zh-CN.js
    shareInformation: {
      businessLicense: '营业执照',
      ...
    },
    common: {
      confirm: '确定',
      cancel: '取消',
      ...
    }
    ```
  - Trong template:
    ```vue
    <span>{{$l.businessLicense}}</span> <!-- key theo view -->
    <span>{{$c.confirm}}</span> <!-- key dùng chung -->
    ```
  - Trong script:
    ```js
    this.$l.businessLicense // key theo view
    this.$c.confirm // key dùng chung
    ```
- **Kiểm tra vi phạm:**  
  - Nếu phát hiện text hiển thị không qua key ngôn ngữ, phải refactor lại đúng chuẩn trên cho cả 4 file ngôn ngữ.

# Hướng dẫn Copilot cho aph-web

## Tổng quan dự án
- Đây là dự án dashboard quản trị front-end sử dụng Vue 2.x + Element-UI, kết hợp Vuex, Vue Router, Axios và ES2015+.
- Kiến trúc dạng module: `src/api` (định nghĩa API), `src/components` (UI dùng chung), `src/views` (các trang), `src/router` (định tuyến), `src/store` (Vuex modules), `src/utils` (hàm tiện ích), và `src/styles` (style toàn cục).
- Layout chính quản lý qua `src/views/layout/Layout.vue`, hầu hết các trang là con của layout này. Các trang login, 404... dùng layout riêng.
- Định tuyến chia thành `constantRoutes` (luôn tải, ví dụ login, 404) và `asyncRoutes` (tải động dựa trên quyền/role từ backend).
- Các endpoint API định nghĩa ở `src/api/index.js`, truy cập qua `this.$api` trong component. Mọi request dùng wrapper Axios tùy chỉnh ở `src/utils/request.js`.
- Đa ngôn ngữ qua `src/lang` dùng vue-i18n. Thêm key mới vào file JS tương ứng.

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

## Điểm tích hợp
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
