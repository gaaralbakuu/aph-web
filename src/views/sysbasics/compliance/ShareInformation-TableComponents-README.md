# Share Information Component - Table Modernization

## Tổng quan

Đã modernize component `shareInformation.vue` theo phong cách của `investigation.vue` bằng cách tạo ra 2 table components riêng biệt để quản lý Help Manual và Contact Information.

## Các files đã được tạo/cập nhật

### 1. Table Components
- `share-help-manual-table.vue` - Component table quản lý Help Manual
- `share-contact-table.vue` - Component table quản lý Contact Information

### 2. Main Component
- `shareInformation.vue` - Component chính đã được cập nhật để sử dụng 2 table components mới

### 3. Language Files
Đã cập nhật các key ngôn ngữ cho tất cả các ngôn ngữ:
- `vi-VN.js` - Tiếng Việt
- `en-US.js` - Tiếng Anh  
- `zh-CN.js` - Tiếng Trung (Giản thể)
- `zh-TW.js` - Tiếng Trung (Phồn thể)

**Đã thêm 2 objects ngôn ngữ riêng cho components:**
- `ShareHelpManualTable` - Keys riêng cho Help Manual Table
- `ShareContactTable` - Keys riêng cho Contact Table

**Language Usage:**
- Component-specific keys: `$t('ShareHelpManualTable.keyName')`
- Global shareInformation keys: `$l.keyName`

## Tính năng chính

### Share Help Manual Table
- **Hiển thị**: Danh sách tài liệu hướng dẫn
- **Columns**: STT, Tên file, Loại file, Ngày tải lên, Mô tả
- **Actions**: Xem, Xóa
- **Features**: 
  - Click vào file name để preview
  - Pagination
  - Empty state với nút thêm
  - Modern UI với icons và hover effects

### Share Contact Table  
- **Hiển thị**: Danh sách người liên hệ SEA
- **Columns**: STT, Tên liên hệ, Email, Điện thoại, Phòng ban, Chức vụ, Trạng thái
- **Actions**: Xem, Sửa, Xóa
- **Features**:
  - Click email/phone để mở ứng dụng tương ứng
  - Status badges với màu sắc
  - Pagination
  - Empty state với nút thêm

## Events và Props

### Props (cho cả 2 table components)
```javascript
{
  data: Array,           // Dữ liệu table
  isLoading: Boolean,    // Trạng thái loading
  showAuth: Object,      // Quyền hiển thị buttons
  page: Object,          // Thông tin phân trang
  total: Number,         // Tổng số records
  pagination: Object     // Cấu hình pagination
}
```

### Events
```javascript
// Help Manual Table
@action="handleHelpManualAction"     // Xử lý actions (view, delete)
@row-click="handleHelpManualRowClick" // Click vào row
@add-click="addClickHelp"            // Click nút thêm
@file-preview="getFilePreview"       // Preview file
@page-change="getList"               // Thay đổi trang

// Contact Table  
@action="handleContactAction"        // Xử lý actions (view, edit, delete)
@row-click="handleContactRowClick"   // Click vào row
@add-click="addClickCis"            // Click nút thêm
@page-change="getCisList"           // Thay đổi trang
```

## Cách sử dụng

### 1. Import components
```javascript
import ShareHelpManualTable from './share-help-manual-table.vue'
import ShareContactTable from './share-contact-table.vue'
```

### 2. Sử dụng trong template
```vue
<ShareHelpManualTable 
  :data="helpManualList.list" 
  :isLoading="pageLoading"
  :showAuth="showAuth"
  :page="{ page: helpManualList.curPage, pageSize: helpManualList.pageSize }"
  :total="helpManualList.total"
  :pagination="pagination"
  @action="handleHelpManualAction"
  @row-click="handleHelpManualRowClick"
  @add-click="addClickHelp"
  @file-preview="getFilePreview"
  @page-change="getList"
/>

<ShareContactTable 
  :data="CisCContacterList.list" 
  :isLoading="pageLoading"
  :showAuth="showAuth"
  :page="{ page: CisCContacterList.curPage, pageSize: CisCContacterList.pageSize }"
  :total="CisCContacterList.total"
  :pagination="pagination"
  @action="handleContactAction"
  @row-click="handleContactRowClick"
  @add-click="addClickCis"
  @page-change="getCisList"
/>
```

### 3. Xử lý events trong methods
```javascript
methods: {
  handleHelpManualAction({ action, row }) {
    if (action === 'view') {
      this.getFilePreview(row.file_url)
    } else if (action === 'delete') {
      this.deleteClick(row, row._index)
    }
  },

  handleContactAction({ action, row }) {
    if (action === 'view') {
      // Xử lý view contact
    } else if (action === 'edit') {
      // Xử lý edit contact  
    } else if (action === 'delete') {
      this.deleteCisClick(row, row._index)
    }
  }
}
```

## Layout và Responsive

- **Desktop**: 2 cột side-by-side (xl:grid-cols-2)
- **Tablet/Mobile**: 1 cột stack (grid-cols-1)
- **Height**: Tables tự động điều chỉnh height với scroll
- **Modern UI**: Rounded corners, shadows, hover effects

## Tính năng tương thích với Investigation

- **Cấu trúc tương tự**: Header, content, pagination
- **Event handling**: Standardized action events
- **Styling**: Consistent với modern table theme
- **Props pattern**: Reusable component pattern
- **Responsive**: Mobile-friendly layout

## Lưu ý

1. **Language Keys**: Đã thêm đầy đủ keys cho 4 ngôn ngữ
2. **Icons**: Sử dụng FontAwesome icons
3. **Accessibility**: Proper ARIA labels và keyboard navigation
4. **Performance**: Optimized rendering với proper event handling
5. **Maintainability**: Modular components dễ maintain và extend

## Phát triển tiếp

Có thể mở rộng thêm:
- Filter/Search functionality
- Sorting capabilities  
- Bulk operations
- Export functionality
- Advanced preview options
