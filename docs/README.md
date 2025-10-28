# 📚 Documentation - Hướng dẫn ghi lỗi và fix bugs

## 🎯 Mục đích
Hệ thống này giúp:
- Ghi lại lịch sử sửa lỗi một cách có tổ chức
- Theo dõi tiến độ sửa lỗi
- Tạo báo cáo thống kê
- Đảm bảo tính minh bạch trong quá trình phát triển

## 📁 Cấu trúc thư mục docs/

```
docs/
├── CHANGELOG.md          # Lịch sử chi tiết các thay đổi
├── BUG_TRACKER.md        # Theo dõi lỗi theo danh mục
├── README.md            # Hướng dẫn sử dụng (file này)
└── templates/           # Templates cho các loại tài liệu
```

## 📝 Quy trình ghi lỗi

### 1. Khi phát hiện lỗi
1. Tạo issue trên GitHub (nếu có)
2. Ghi lại thông tin lỗi vào `BUG_TRACKER.md`
3. Phân loại lỗi theo danh mục

### 2. Khi sửa lỗi
1. Sửa code và test
2. Cập nhật `BUG_TRACKER.md` với trạng thái "Đã sửa"
3. Thêm chi tiết vào `CHANGELOG.md`
4. Commit với message rõ ràng

### 3. Sau khi deploy
1. Cập nhật ngày deploy trong cả 2 file
2. Đánh dấu hoàn thành trong `BUG_TRACKER.md`

## 📋 Template commit message

```
fix: [BUG-ID] - Mô tả ngắn gọn lỗi

- Chi tiết lỗi đã sửa
- Giải pháp áp dụng
- Files đã thay đổi
```

### Ví dụ:
```
fix: BUG-001 - DeserializeData overload 5 arguments

- Thêm overload mới cho DeserializeData với 5 tham số
- Đồng bộ logic với VideoApiSourceCode
- Files: Apache.Uniapp.Core/Helpers/DbContext.cs
```

## 🏷️ Quy ước đặt tên

### ID lỗi
- Format: `BUG-XXX` (XXX là số thứ tự)
- Ví dụ: BUG-001, BUG-002, etc.

### Phân loại lỗi
- **API**: Lỗi liên quan đến backend API
- **UI**: Lỗi giao diện người dùng
- **Database**: Lỗi cơ sở dữ liệu
- **Other**: Lỗi khác

### Mức độ lỗi
- **Critical**: Lỗi nghiêm trọng, ảnh hưởng đến toàn hệ thống
- **High**: Lỗi quan trọng, ảnh hưởng đến chức năng chính
- **Medium**: Lỗi trung bình, ảnh hưởng đến trải nghiệm
- **Low**: Lỗi nhỏ, không ảnh hưởng nghiêm trọng

## 📊 Báo cáo thống kê

### Hàng tháng
- Cập nhật thống kê trong `BUG_TRACKER.md`
- Phân tích xu hướng lỗi
- Đề xuất cải thiện chất lượng code

### Hàng quý
- Tổng hợp báo cáo chi tiết
- Phân tích root cause
- Lập kế hoạch cải thiện

## 🔧 Best Practices

### 1. Ghi lỗi ngay khi phát hiện
- Không để tích tụ lỗi
- Ghi chi tiết để dễ debug sau này

### 2. Commit message rõ ràng
- Mô tả chính xác lỗi đã sửa
- Liên kết với BUG-ID
- Ghi files đã thay đổi

### 3. Test kỹ trước khi commit
- Test trên local
- Test các case edge
- Kiểm tra không gây regression

### 4. Cập nhật documentation
- CHANGELOG.md ngay sau khi sửa
- BUG_TRACKER.md để theo dõi trạng thái

## 📞 Liên hệ

Nếu có câu hỏi về hệ thống ghi lỗi, hãy liên hệ:
- **Team Lead**: [Tên]
- **Tech Lead**: [Tên]
- **QA Lead**: [Tên]

---

*Hệ thống này được thiết kế để cải thiện chất lượng code và tăng tính minh bạch trong quá trình phát triển.*
