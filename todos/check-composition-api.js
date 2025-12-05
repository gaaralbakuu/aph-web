const fs = require('fs');
const path = require('path');

// Đọc danh sách file
const fileListPath = 'g:\\APH_Workspace\\VueJS\\aph-web\\todos\\all_vue_files_temp.txt';
const fileContent = fs.readFileSync(fileListPath, 'utf8');
const files = fileContent.split('\n').filter(line => line.trim().endsWith('.vue'));

const notConvertedFiles = [];
const convertedFiles = [];
const errors = [];

console.log(`Đang kiểm tra ${files.length} tệp Vue...\n`);

files.forEach((filePath, index) => {
  const trimmedPath = filePath.trim();
  if (!trimmedPath) return;

  try {
    if (!fs.existsSync(trimmedPath)) {
      errors.push(`File không tồn tại: ${trimmedPath}`);
      return;
    }

    const content = fs.readFileSync(trimmedPath, 'utf8');
    
    // Kiểm tra xem có sử dụng <script setup> không
    const hasScriptSetup = /<script\s+setup/.test(content);
    
    // Cũng kiểm tra setup() function trong Options API
    const hasSetupFunction = /setup\s*\(/.test(content);
    
    if (hasScriptSetup) {
      convertedFiles.push(trimmedPath);
    } else {
      notConvertedFiles.push(trimmedPath);
    }

    // Hiển thị tiến độ
    if ((index + 1) % 20 === 0) {
      console.log(`Đã kiểm tra: ${index + 1}/${files.length}`);
    }
  } catch (error) {
    errors.push(`Lỗi đọc file ${trimmedPath}: ${error.message}`);
  }
});

console.log('\n=== KẾT QUẢ THỐNG KÊ ===\n');
console.log(`Tổng số tệp Vue: ${files.length}`);
console.log(`Đã chuyển đổi sang Composition API (script setup): ${convertedFiles.length}`);
console.log(`Chưa chuyển đổi (Options API): ${notConvertedFiles.length}`);
if (errors.length > 0) {
  console.log(`Lỗi: ${errors.length}`);
}

// Lưu kết quả
const resultPath = 'g:\\APH_Workspace\\VueJS\\aph-web\\todos\\composition-api-status.txt';
let result = `=== THỐNG KÊ CHUYỂN ĐỔI COMPOSITION API ===
Ngày: ${new Date().toLocaleString('vi-VN')}

TỔNG QUAN:
- Tổng số tệp Vue: ${files.length}
- Đã chuyển đổi (script setup): ${convertedFiles.length}
- Chưa chuyển đổi (Options API): ${notConvertedFiles.length}
- Tỷ lệ hoàn thành: ${((convertedFiles.length / files.length) * 100).toFixed(2)}%

`;

if (notConvertedFiles.length > 0) {
  result += `\n=== DANH SÁCH ${notConvertedFiles.length} TỆP CHƯA CHUYỂN ĐỔI ===\n\n`;
  notConvertedFiles.forEach((file, index) => {
    // Chỉ lấy đường dẫn tương đối từ src
    const relativePath = file.replace('g:\\APH_Workspace\\VueJS\\aph-web\\src\\', '');
    result += `${index + 1}. ${relativePath}\n`;
  });
}

if (convertedFiles.length > 0) {
  result += `\n\n=== DANH SÁCH ${convertedFiles.length} TỆP ĐÃ CHUYỂN ĐỔI ===\n\n`;
  convertedFiles.forEach((file, index) => {
    const relativePath = file.replace('g:\\APH_Workspace\\VueJS\\aph-web\\src\\', '');
    result += `${index + 1}. ${relativePath}\n`;
  });
}

if (errors.length > 0) {
  result += `\n\n=== LỖI (${errors.length}) ===\n\n`;
  errors.forEach((error, index) => {
    result += `${index + 1}. ${error}\n`;
  });
}

fs.writeFileSync(resultPath, result, 'utf8');
console.log(`\nĐã lưu kết quả vào: ${resultPath}`);

// Tạo file riêng cho danh sách chưa chuyển đổi (dễ sử dụng)
const notConvertedPath = 'g:\\APH_Workspace\\VueJS\\aph-web\\todos\\not-converted-to-composition-api.txt';
const notConvertedList = notConvertedFiles.map(file => 
  file.replace('g:\\APH_Workspace\\VueJS\\aph-web\\src\\', '')
).join('\n');
fs.writeFileSync(notConvertedPath, notConvertedList, 'utf8');
console.log(`Đã lưu danh sách chưa chuyển đổi vào: ${notConvertedPath}`);
