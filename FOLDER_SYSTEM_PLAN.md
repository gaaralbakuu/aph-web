# 📁 Kế Hoạch Chuyển Đổi: Từ Main Header → Hệ Thống Thư Mục 1 Cấp

## 🎯 Mục Tiêu
Chuyển đổi từ hệ thống cột "Main Header" đơn giản thành **hệ thống thư mục 1 cấp** với khả năng:
- Tạo/sửa/xóa thư mục
- Click vào thư mục → hiển thị danh sách file trong thư mục đó
- Quản lý file theo từng thư mục riêng biệt

---

## 🗃️ Database Schema Changes

### 1. Tạo bảng `cis_c_folders` (Thư mục)
```sql
CREATE TABLE cis_c_folders (
    id VARCHAR(36) PRIMARY KEY,
    folder_name VARCHAR(200) NOT NULL COMMENT 'Tên thư mục',
    folder_description TEXT NULL COMMENT 'Mô tả thư mục',
    folder_color VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'Màu sắc thư mục (hex)',
    folder_icon VARCHAR(50) DEFAULT 'fa-folder' COMMENT 'Icon thư mục',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    is_valid CHAR(1) DEFAULT 'Y' COMMENT 'Trạng thái (Y/N)',
    create_user VARCHAR(50) NULL,
    create_dept VARCHAR(50) NULL,
    create_time DATETIME NULL,
    modify_user VARCHAR(50) NULL,
    modify_dept VARCHAR(50) NULL,
    modify_time DATETIME NULL,
    INDEX idx_folder_name (folder_name),
    INDEX idx_display_order (display_order),
    INDEX idx_is_valid (is_valid)
) COMMENT='Bảng quản lý thư mục tài liệu';
```

### 2. Sửa bảng `cis_c_attachments`
```sql
-- Thay thế cột main_header bằng folder_id
ALTER TABLE cis_c_attachments 
DROP COLUMN main_header;

ALTER TABLE cis_c_attachments 
ADD COLUMN folder_id VARCHAR(36) NULL COMMENT 'ID thư mục chứa file',
ADD INDEX idx_folder_id (folder_id),
ADD FOREIGN KEY fk_attachment_folder (folder_id) REFERENCES cis_c_folders(id) ON DELETE SET NULL;
```

### 3. Tạo thư mục mặc định
```sql
INSERT INTO cis_c_folders (id, folder_name, folder_description, folder_color, folder_icon, display_order, is_valid, create_time) 
VALUES 
('default-folder-001', 'Tài liệu chung', 'Thư mục mặc định cho các tài liệu chung', '#6B7280', 'fa-folder-o', 0, 'Y', NOW()),
('default-folder-002', 'Hướng dẫn', 'Thư mục chứa các tài liệu hướng dẫn', '#3B82F6', 'fa-book', 1, 'Y', NOW()),
('default-folder-003', 'Biểu mẫu', 'Thư mục chứa các biểu mẫu, template', '#10B981', 'fa-file-text-o', 2, 'Y', NOW());
```

---

## 🎨 Frontend UI/UX Design

### 1. Layout Mới - Folder Tree + File List
```
┌─────────────────────────────────────────────────────────────┐
│  📁 Quản lý Tài liệu Hướng dẫn & Liên hệ SEA               │
├─────────────────┬───────────────────────────────────────────┤
│ 🗂️ THƯU MỤC     │ 📄 DANH SÁCH FILE                        │
│                 │                                           │
│ [+] Tạo thư mục │ 🔍 Tìm kiếm trong thư mục: [Hướng dẫn]   │
│                 │ [+] Thêm file                             │
│ 📁 Tài liệu chung (3) │                                     │
│ 📚 Hướng dẫn (5)   ◄── │ ┌─────────────────────────────────┐ │
│ 📋 Biểu mẫu (2)        │ │ STT │ Tên file      │ Loại │...│ │
│ 🔧 Quy trình (1)       │ │  1  │ Manual.pdf    │ PDF  │...│ │
│                        │ │  2  │ Guide.docx    │ DOCX │...│ │
│ 🗑️ Thùng rác (0)      │ │  3  │ Tutorial.pdf  │ PDF  │...│ │
│                        │ └─────────────────────────────────┘ │
├────────────────────────┼───────────────────────────────────────┤
│ 👥 LIÊN HỆ SEA         │ Pagination: [1] [2] [3] ... [10]     │
│ [+] Thêm liên hệ       │                                       │
│ Danh sách liên hệ...   │                                       │
└────────────────────────┴───────────────────────────────────────┘
```

### 2. Folder Management Features
- **Tạo thư mục**: Dialog với tên, mô tả, màu sắc, icon
- **Sửa thư mục**: Inline edit hoặc dialog
- **Xóa thư mục**: Xác nhận + chuyển file về thư mục mặc định
- **Drag & Drop**: Kéo thả file giữa các thư mục
- **Folder Context Menu**: Right-click → Sửa/Xóa/Thuộc tính

---

## 🔧 Backend API Changes

### 1. Folder Management APIs

#### `FoldersController.cs`
```csharp
[Route("Compliance/folders")]
public class FoldersController : ControllerCommon
{
    // GET: Lấy danh sách thư mục
    [HttpGet("getFolders")]
    public ApiRes<List<CisCFolders>> getFolders()

    // POST: Tạo thư mục mới
    [HttpPost("createFolder")]
    public ApiRes<CisCFolders> createFolder([FromBody] CreateFolderDto dto)

    // PUT: Sửa thư mục
    [HttpPut("updateFolder")]
    public ApiRes updateFolder([FromBody] UpdateFolderDto dto)

    // DELETE: Xóa thư mục
    [HttpDelete("deleteFolder/{id}")]
    public ApiRes deleteFolder(string id)

    // POST: Sắp xếp thư mục
    [HttpPost("reorderFolders")]
    public ApiRes reorderFolders([FromBody] List<FolderOrderDto> orders)
}
```

### 2. Modified Attachment APIs

#### Cập nhật `ComplianceAttachmentsController.cs`
```csharp
// Thêm folder_id vào upload
[HttpPost("uploadAttachment")]
public ApiRes<List<CisCAttachments>> uploadAttachment([FromForm] ManufacturerAttachmentDto dto)

// Lấy file theo folder
[HttpGet("getFilesByFolder/{folderId}")]
public ApiRes<PagedResult<AttachmentVo>> getFilesByFolder(string folderId, [FromQuery] PageDto page)

// Chuyển file giữa các folder
[HttpPost("moveFileToFolder")]
public ApiRes moveFileToFolder([FromBody] MoveFileDto dto)
```

### 3. New DTOs & Entities

#### `CisCFolders.cs`
```csharp
[SugarTable("cis_c_folders")]
public class CisCFolders : BaseEntity
{
    [SugarColumn(IsPrimaryKey = true)]
    public string id { get; set; }
    public string folder_name { get; set; }
    public string folder_description { get; set; }
    public string folder_color { get; set; }
    public string folder_icon { get; set; }
    public int display_order { get; set; }
    // Inherit: is_valid, create_user, create_time, modify_user, modify_time
}
```

#### `FolderDto.cs`
```csharp
public class CreateFolderDto
{
    public string folder_name { get; set; }
    public string folder_description { get; set; }
    public string folder_color { get; set; } = "#3B82F6";
    public string folder_icon { get; set; } = "fa-folder";
}

public class UpdateFolderDto : CreateFolderDto
{
    public string id { get; set; }
}

public class FolderOrderDto
{
    public string id { get; set; }
    public int display_order { get; set; }
}

public class MoveFileDto
{
    public string fileId { get; set; }
    public string targetFolderId { get; set; }
}
```

---

## 🌐 Frontend Implementation Plan

### 1. Vue Components Structure
```
📁 src/views/sysbasics/compliance/
├── shareInformation.vue (Main Container)
├── components/
│   ├── FolderTree.vue (Folder sidebar)
│   ├── FolderManager.vue (CRUD folders)
│   ├── FileList.vue (File grid/list)
│   ├── FileUpload.vue (Upload with folder selection)
│   └── FileMove.vue (Drag & drop handler)
```

### 2. Key Features Implementation

#### Folder Tree Component
- Tree view với icon, tên, số lượng file
- Highlight folder đang chọn
- Context menu (right-click)
- Drag & drop support

#### File List Component  
- Grid/List view toggle
- Filter by file type, date
- Bulk operations (move, delete)
- File preview

#### Upload Dialog
- Folder selection dropdown
- Batch upload
- Progress indicator

### 3. State Management (Vuex)
```javascript
// store/modules/folderManagement.js
export default {
  state: {
    folders: [],
    selectedFolder: null,
    files: [],
    loading: false
  },
  mutations: {
    SET_FOLDERS, SET_SELECTED_FOLDER, SET_FILES, etc.
  },
  actions: {
    fetchFolders, createFolder, updateFolder, deleteFolder,
    fetchFilesByFolder, uploadFile, moveFile, etc.
  }
}
```

---

## 🔄 Migration Plan

### Phase 1: Database Migration (1 ngày)
1. ✅ Backup database
2. 🔄 Tạo bảng `cis_c_folders`
3. 🔄 Insert default folders
4. 🔄 Migrate existing data từ `main_header` → `folder_id`
5. 🔄 Drop column `main_header`

### Phase 2: Backend Development (2-3 ngày)
1. 🔄 Tạo `FoldersController` & APIs
2. 🔄 Cập nhật `ComplianceAttachmentsService`
3. 🔄 Tạo DTOs & Entities
4. 🔄 Unit testing

### Phase 3: Frontend Development (3-4 ngày)
1. 🔄 Tạo Folder Tree component
2. 🔄 Cập nhật File List component
3. 🔄 Folder CRUD dialogs
4. 🔄 Drag & drop functionality
5. 🔄 Integration testing

### Phase 4: Testing & Polish (1-2 ngày)
1. 🔄 End-to-end testing
2. 🔄 UI/UX refinements
3. 🔄 Performance optimization
4. 🔄 Documentation

---

## 🎨 UI Mockups & Colors

### Folder Icons & Colors
- 📁 **Tài liệu chung**: `#6B7280` (Gray)
- 📚 **Hướng dẫn**: `#3B82F6` (Blue)  
- 📋 **Biểu mẫu**: `#10B981` (Green)
- 🔧 **Quy trình**: `#F59E0B` (Orange)
- 🗑️ **Thùng rác**: `#EF4444` (Red)

### Responsive Design
- **Desktop**: Sidebar + Main content (70/30 split)
- **Tablet**: Collapsible sidebar
- **Mobile**: Tab navigation (Folders/Files)

---

## 🔍 Benefits of This Approach

### ✅ User Experience
- **Tổ chức tốt hơn**: File được nhóm theo chủ đề
- **Tìm kiếm dễ dàng**: Filter theo thư mục
- **Trực quan**: Tree view với icon màu sắc

### ✅ Technical Benefits  
- **Scalable**: Dễ mở rộng thêm level
- **Performance**: Query theo folder hiệu quả hơn
- **Maintainable**: Code tách biệt rõ ràng

### ✅ Business Value
- **Quản lý hiệu quả**: Admin dễ phân loại tài liệu
- **User-friendly**: User dễ tìm thấy tài liệu cần thiết
- **Professional**: Giao diện chuyên nghiệp hơn

---

## 📋 Implementation Checklist

### Database
- [ ] Create `cis_c_folders` table
- [ ] Insert default folders
- [ ] Migrate data from `main_header` to `folder_id`
- [ ] Drop `main_header` column
- [ ] Add foreign key constraints

### Backend
- [ ] `CisCFolders` entity
- [ ] `FoldersController` with CRUD APIs
- [ ] Update `ComplianceAttachmentsService`
- [ ] Folder DTOs (Create, Update, Order, Move)
- [ ] Unit tests for new APIs

### Frontend
- [ ] Language keys for folder management
- [ ] `FolderTree.vue` component
- [ ] `FolderManager.vue` component  
- [ ] Update `FileList.vue` with folder filter
- [ ] Update upload dialog with folder selection
- [ ] Drag & drop functionality
- [ ] Vuex store for folder management
- [ ] Integration with existing APIs

### Testing
- [ ] API testing with Postman
- [ ] Frontend component testing
- [ ] End-to-end user flow testing
- [ ] Performance testing
- [ ] Cross-browser compatibility

---

## 💰 Estimated Timeline: **7-10 ngày**

**Có phê duyệt kế hoạch này không? Tôi sẽ bắt đầu implementation theo từng phase!** 🚀
