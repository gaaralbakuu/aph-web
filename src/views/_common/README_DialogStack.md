# Dialog Stack System - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống Dialog Stack cho phép quản lý nhiều dialog cùng lúc với khả năng:
- Đóng dialog theo thứ tự LIFO (Last In, First Out) khi nhấn ESC
- Tự động quản lý z-index để dialog mới luôn hiển thị trên top
- Chỉ cho phép tương tác với dialog ở top của stack
- Tự động khóa/mở khóa scroll của body

## Cách Sử Dụng

### 1. Sử dụng cơ bản

```vue
<template>
  <div>
    <button @click="showDialog = true">Mở Dialog</button>
    
    <CustomDialog
      :visible.sync="showDialog"
      title="My Dialog"
      width="600px"
    >
      <template #content>
        <p>Nội dung dialog</p>
      </template>
      <template #footer>
        <button @click="showDialog = false">Đóng</button>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import CustomDialog from '@/views/_common/CustomDialog.vue'

export default {
  components: { CustomDialog },
  data() {
    return {
      showDialog: false
    }
  }
}
</script>
```

### 2. Sử dụng với ID tùy chỉnh

```vue
<CustomDialog
  :visible.sync="showDialog"
  title="My Dialog"
  dialog-id="my-unique-dialog"
>
  <!-- content -->
</CustomDialog>
```

### 3. Mở dialog từ dialog khác

```vue
<template>
  <div>
    <!-- Dialog 1 -->
    <CustomDialog
      :visible.sync="dialog1Visible"
      title="Dialog 1"
      dialog-id="dialog-1"
    >
      <template #content>
        <button @click="dialog2Visible = true">Mở Dialog 2</button>
      </template>
    </CustomDialog>

    <!-- Dialog 2 -->
    <CustomDialog
      :visible.sync="dialog2Visible"
      title="Dialog 2"
      dialog-id="dialog-2"
    >
      <template #content>
        <p>Dialog 2 sẽ hiển thị trên Dialog 1</p>
      </template>
    </CustomDialog>
  </div>
</template>
```

## Props của CustomDialog

| Prop | Type | Default | Mô tả |
|------|------|---------|--------|
| visible | Boolean | false | Trạng thái hiển thị dialog |
| title | String | '' | Tiêu đề dialog |
| width | String | '50%' | Chiều rộng dialog |
| height | String | 'auto' | Chiều cao dialog |
| maxWidth | String | '80vw' | Chiều rộng tối đa |
| customClass | String | '' | Class CSS tùy chỉnh |
| closeOnClickModal | Boolean | true | Cho phép đóng khi click overlay |
| clickOutside | Boolean | true | Cho phép đóng khi click bên ngoài |
| dialogId | String | null | ID duy nhất cho dialog (tự động tạo nếu không cung cấp) |

## Slots

| Slot | Mô tả |
|------|--------|
| default | Nội dung chính của dialog |
| content | Nội dung chính (tương đương default) |
| footer | Footer với các nút action |
| notice | Vùng thông báo ở dưới header |

## Events

| Event | Mô tả |
|-------|--------|
| update:visible | Emit khi dialog được đóng/mở |
| close | Emit khi dialog được đóng |

## Tính Năng Chính

### 1. ESC Key Handling
- Nhấn ESC sẽ đóng dialog ở top của stack
- Các dialog được đóng theo thứ tự LIFO (Last In, First Out)

### 2. Z-Index Management
- Dialog mới luôn có z-index cao hơn dialog cũ
- Z-index được tự động tính toán và quản lý

### 3. Overlay Interaction
- Chỉ có thể tương tác với dialog ở top
- Click overlay chỉ đóng dialog ở top

### 4. Body Scroll Management
- Tự động khóa scroll khi có dialog mở
- Tự động mở khóa scroll khi tất cả dialog đã đóng

## Truy cập Dialog Stack State

Bạn có thể truy cập thông tin về dialog stack thông qua Vuex:

```js
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('dialogStack', [
      'dialogStack',    // Mảng tất cả dialog đang mở
      'topDialog',      // Dialog ở top của stack
      'dialogCount',    // Số lượng dialog đang mở
      'getDialogZIndex' // Function để lấy z-index của dialog
    ])
  }
}
```

## Demo

Xem file `DialogStackDemo.vue` để có ví dụ chi tiết về cách sử dụng hệ thống dialog stack.

## Cách Thức Hoạt Động

### 1. Dialog Stack Store
- Vuex store module `dialogStack` quản lý danh sách các dialog đang mở
- Mỗi dialog có ID duy nhất và z-index được tự động tính toán

### 2. ESC Key Plugin
- Plugin `dialogEscPlugin` được cài đặt globally để lắng nghe phím ESC
- Chỉ có một event listener duy nhất trên toàn bộ ứng dụng
- Tự động đóng dialog ở top của stack khi nhấn ESC

### 3. Dialog Component Integration
- CustomDialog tự động đăng ký/hủy đăng ký với dialog stack
- Quản lý z-index và trạng thái hiển thị
- Chỉ cho phép tương tác với dialog ở top
