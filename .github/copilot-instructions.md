````instructions
Dưới đây là quy tắc chi tiết để chuyển đổi component Vue 2 (Options API) sang Vue 3 Composition API cho đường dẫn `aph-web\src\views\sysbasics\video`. Quy tắc này đảm bảo tuân thủ các quy ước dự án (đa ngôn ngữ, không hard code text), giữ nguyên logic UI và tương thích với Element-UI. Giả sử dự án sẽ nâng cấp lên Vue 3 để hỗ trợ Composition API.

## Quy tắc chuyển đổi sang Vue 3 Composition API

### 🎯 Nguyên tắc chung
- Chuyển đổi từ Options API (data, methods, computed, watch, lifecycle hooks) sang Composition API (setup function, reactive, computed, watch, onMounted, etc.).
- Giữ nguyên logic UI và tương thích với Element-UI.
- Tuân thủ quy ước đa ngôn ngữ: không hard code text, sử dụng hệ thống đa ngôn ngữ.

### 🔄 Sử dụng TanStack Query
- Khi chuyển đổi component có API calls (fetch data, mutations), kiểm tra và sử dụng TanStack Query (Vue Query) thay vì Axios trực tiếp hoặc Vuex actions.
- TanStack Query giúp quản lý state server, caching, background refetching, optimistic updates.
- Ví dụ: Thay vì `this.$request()` trong methods, sử dụng `useQuery` hoặc `useMutation` trong setup function.
- Cài đặt TanStack Query nếu chưa có: `npm install @tanstack/vue-query`.

### 🌐 Sử dụng đa ngôn ngữ trong Composition API
- Thay vì `$l.key` trong template và `this.$l.key` trong script, sử dụng hook `useLocalI18n`.
- Cú pháp: `const { l } = useLocalI18n('componentName')`
- Trong đó, `componentName` là giá trị của `name` trong `export default` của Vue 2 component.
- Ví dụ cho component có `name: 'videoUserHome'`:
  ```js
  import { useLocalI18n } from '@/composables/useLocalI18n' // Giả sử có composable này

  export default {
    setup() {
      const { l } = useLocalI18n('videoUserHome')
      
      // Sử dụng l.key thay vì $l.key
      const title = computed(() => l.value.title)
      
      return {
        title
      }
    }
  }
  ```
- Trong template: `{{ l.title }}` thay vì `{{ $l.title }}`.

### 📋 Quy trình chuyển đổi
1. **Xác định component name**: Từ `name: 'xxxxx'` trong Vue 2.
2. **Chuyển setup function**: Di chuyển logic từ data, methods, computed, watch vào setup().
3. **Sử dụng reactive/computed**: Thay data bằng reactive, computed bằng computed.
4. **Lifecycle hooks**: onMounted, onUnmounted, etc.
5. **API calls**: Chuyển sang TanStack Query nếu phù hợp.
6. **Đa ngôn ngữ**: Sử dụng `useLocalI18n('componentName')` và `l.key`.
7. **Kiểm tra tương thích**: Đảm bảo Element-UI vẫn hoạt động, logic UI không thay đổi.

### ⚠️ Lưu ý đặc biệt
- Đối với component `videoUserHome`, đảm bảo `name: 'videoUserHome'` trong export default.
- Khi sử dụng TanStack Query, cấu hình query keys phù hợp để tránh conflicts.
- Nếu component không có API calls, có thể không cần TanStack Query.

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

- Đây là dự án dashboard quản trị front-end sử dụng Vue 2.x + Element-UI, kết hợp Vuex, Vue Router, Axios, ES2015+.
- Kiến trúc dạng module: `src/api` (định nghĩa API), `src/components` (UI dùng chung), `src/views` (các trang), `src/router` (định tuyến), `src/store` (Vuex modules), `src/utils` (hàm tiện ích).
- Layout chính quản lý qua `src/views/layout/Layout.vue`, hầu hết các trang là con của layout này. Các trang login, 404... dùng layout riêng.
- Định tuyến chia thành `constantRoutes` (luôn tải, ví dụ login, 404) và `asyncRoutes` (tải động dựa trên quyền/role từ backend).
- Các endpoint API định nghĩa ở `src/api/index.js`, truy cập qua `this.$api` trong component. Mọi request dùng wrapper Axios tùy chỉnh ở `src/utils/request.js`.
- Đa ngôn ngữ qua `src/lang` dùng vue-i18n. Thêm key mới vào file JS tương ứng.

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

- **Icon:** Đặt SVG vào `src/icons/svg/` và dùng `<svg-icon icon-class="name" />`. Có thể dùng FontAwesome qua `<i class="fa fa-xxx" />`.
- **Mẫu API:** Dùng `this.$request(url, params, method)` cho mọi HTTP call. Hiển thị lỗi toàn cục trừ khi đặt `donotAutoShowError`.
- **Quyền truy cập/route guard:** Xem `src/router/permission.js` để hiểu cách load route động và phân quyền. Thông tin user và quyền được lấy sau đăng nhập để sinh route phù hợp.
- **Quản lý state:** Vuex module trong `src/store/modules/`. Dùng action cho logic bất đồng bộ, mutation cho thay đổi state.
- **Đa ngôn ngữ:** Tuyệt đối không được hard code ngôn ngữ/text hiển thị trong template hoặc script. Luôn sử dụng `$l.key` trong template, và thêm key mới vào file tương ứng trong `src/lang/`.

## 📝 Lưu ý khi sửa đổi code

### ⚠️ Trước khi sửa đổi bất kỳ component nào:
1. **Đọc kỹ quy tắc chuyển đổi Composition API**: Đảm bảo component đã được chuyển đổi từ Options API sang Composition API (script setup) nếu phù hợp, nhưng vẫn tương thích với Vue 2 (sử dụng `getCurrentInstance()` cho global properties như `$route`, `$router`, `$api`).
2. **Kiểm tra đa ngôn ngữ**: 
   - Tuyệt đối không hard code text trong template hoặc script.
   - Sử dụng `useLocalI18n('componentName')` trong Composition API để lấy `l` (local keys) và `c` (common keys).
   - Nếu thêm text mới, cập nhật đồng thời cả 4 file ngôn ngữ: `vi-VN.js`, `en-US.js`, `zh-CN.js`, `zh-TW.js`.
3. **API calls**: Ưu tiên sử dụng TanStack Query (`useQuery`, `useMutation`) thay vì `store.dispatch('request')` nếu component đã chuyển sang Composition API.
4. **Tương thích Element-UI**: Đảm bảo sử dụng Element-UI thay vì Element Plus, import đúng như `{ Message as ElMessage }` từ 'element-ui'.
5. **Kiểm tra lỗi**: Sau khi sửa đổi, chạy `npm run serve` và kiểm tra console/log để đảm bảo không có lỗi syntax hoặc runtime.

### 🔄 Quy trình sửa đổi:
- Nếu sửa đổi logic: Đảm bảo giữ nguyên UI behavior và tương thích với Vue 2.
- Nếu thêm feature: Tuân thủ quy tắc đa ngôn ngữ và Composition API.
- Nếu refactor: Ưu tiên chuyển sang Composition API nếu chưa, nhưng test kỹ để tránh break changes.

### 🚨 Lưu ý quan trọng:
- Mọi thay đổi phải được test trên dev server trước khi commit.
- Nếu gặp vấn đề với Composition API trong Vue 2, tham khảo ví dụ từ file `Play.vue` đã chuyển đổi.
- Luôn commit theo quy ước dự án và update documentation nếu cần.

---

Để biết thêm chi tiết, xem `README.md` hoặc hỏi ví dụ workflow cụ thể.
````
