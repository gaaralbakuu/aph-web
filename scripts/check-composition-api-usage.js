const fs = require('fs');
const path = require('path');

/**
 * Script để kiểm tra các Vue file sử dụng Composition API hay Options API
 * Generate report vào folder todos
 */

const viewsDir = path.join(__dirname, '../src/views');
const todosDir = path.join(__dirname, '../todos');

// Đảm bảo folder todos tồn tại
if (!fs.existsSync(todosDir)) {
  fs.mkdirSync(todosDir, { recursive: true });
}

const results = {
  total: 0,
  compositionApi: [],
  optionsApi: [],
  hybrid: [],
  invalid: [],
};

/**
 * Kiểm tra xem file Vue có sử dụng script setup (Composition API)
 * @param {string} content - Nội dung file Vue
 * @returns {string} - 'composition', 'options', 'hybrid', hoặc 'invalid'
 */
function checkApiType(content) {
  // Kiểm tra xem file có tag <script setup> không
  const hasScriptSetup = /<script\s+setup[>\s]/i.test(content);
  
  // Kiểm tra xem file có tag <script> thông thường không
  const hasScriptTag = /<script[^>]*>[^]*?<\/script>/i.test(content);
  
  // Kiểm tra nội dung script để xác định loại API
  const scriptMatch = content.match(/<script[^>]*>([^]*?)<\/script>/i);
  if (!scriptMatch) {
    return 'invalid';
  }
  
  const scriptContent = scriptMatch[1];
  
  // Kiểm tra các pattern của Options API
  const hasOptionsApi = /\b(data|methods|computed|watch|lifecycle|mounted|created|beforeCreate|beforeMount|beforeUpdate|beforeUnmount|updated|unmounted)\s*\(|export\s+default\s*\{[^}]*(data|methods|computed|watch)\s*:/i.test(scriptContent);
  
  // Kiểm tra các pattern của Composition API
  const hasCompositionApi = /\b(ref|reactive|computed|watch|onMounted|onUnmounted|onBeforeMount|onBeforeUpdate|onBeforeUnmount|onUpdated|onActivated|onDeactivated|onErrorCaptured|getCurrentInstance|useContext)\s*\(/i.test(scriptContent);
  
  if (hasScriptSetup) {
    return 'composition';
  }
  
  if (hasCompositionApi && hasOptionsApi) {
    return 'hybrid';
  }
  
  if (hasCompositionApi) {
    return 'composition';
  }
  
  if (hasOptionsApi) {
    return 'options';
  }
  
  // Nếu không tìm thấy pattern nào, dùng heuristic dựa trên file size
  // File chỉ import và export mà không có logic thực tế
  if (scriptContent.trim().length < 100) {
    return 'composition'; // Giả sử là composition vì quá nhỏ
  }
  
  return 'invalid';
}

/**
 * Đệ quy tìm tất cả file .vue trong folder
 * @param {string} dir - Đường dẫn folder
 * @returns {string[]} - Mảng đường dẫn file .vue
 */
function findVueFiles(dir) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Đệ quy vào folder
        files.push(...findVueFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.vue')) {
        files.push(fullPath);
      }
    });
  } catch (error) {
    console.error(`Lỗi khi đọc folder ${dir}:`, error.message);
  }
  
  return files;
}

// Tìm tất cả file .vue
const vueFiles = findVueFiles(viewsDir);
results.total = vueFiles.length;

console.log(`\n📁 Bắt đầu kiểm tra ${vueFiles.length} file Vue...`);

// Kiểm tra từng file
vueFiles.forEach((filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const apiType = checkApiType(content);
    const relativePath = path.relative(viewsDir, filePath);
    
    const fileInfo = {
      path: relativePath,
      fullPath: filePath,
      type: apiType,
    };
    
    switch (apiType) {
      case 'composition':
        results.compositionApi.push(fileInfo);
        break;
      case 'options':
        results.optionsApi.push(fileInfo);
        break;
      case 'hybrid':
        results.hybrid.push(fileInfo);
        break;
      default:
        results.invalid.push(fileInfo);
    }
  } catch (error) {
    console.error(`Lỗi khi xử lý file ${filePath}:`, error.message);
    results.invalid.push({
      path: path.relative(viewsDir, filePath),
      fullPath: filePath,
      error: error.message,
    });
  }
});

// Sắp xếp danh sách
results.compositionApi.sort((a, b) => a.path.localeCompare(b.path));
results.optionsApi.sort((a, b) => a.path.localeCompare(b.path));
results.hybrid.sort((a, b) => a.path.localeCompare(b.path));
results.invalid.sort((a, b) => a.path.localeCompare(b.path));

// Tạo báo cáo chi tiết
const reportDate = new Date().toLocaleString('vi-VN');
const summary = `
╔════════════════════════════════════════════════════════════════════════════════╗
║                       BÁO CÁO KIỂM TRA VUE API USAGE                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

Ngày tạo báo cáo: ${reportDate}
Tổng số file Vue: ${results.total}

📊 THỐNG KÊ TỔNG QUÁT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Composition API (script setup):  ${results.compositionApi.length} file (${((results.compositionApi.length / results.total) * 100).toFixed(1)}%)
  ⚙️  Options API:                    ${results.optionsApi.length} file (${((results.optionsApi.length / results.total) * 100).toFixed(1)}%)
  🔄 Hybrid (cả hai loại):           ${results.hybrid.length} file (${((results.hybrid.length / results.total) * 100).toFixed(1)}%)
  ❌ Invalid/không xác định:          ${results.invalid.length} file (${((results.invalid.length / results.total) * 100).toFixed(1)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

let detailedReport = summary;

// Chi tiết Composition API
if (results.compositionApi.length > 0) {
  detailedReport += `\n\n✅ COMPOSITION API (script setup) - ${results.compositionApi.length} file\n`;
  detailedReport += '━'.repeat(88) + '\n';
  results.compositionApi.forEach((file, index) => {
    detailedReport += `${index + 1}. ${file.path}\n`;
  });
}

// Chi tiết Options API
if (results.optionsApi.length > 0) {
  detailedReport += `\n\n⚙️  OPTIONS API - ${results.optionsApi.length} file\n`;
  detailedReport += '━'.repeat(88) + '\n';
  results.optionsApi.forEach((file, index) => {
    detailedReport += `${index + 1}. ${file.path}\n`;
  });
}

// Chi tiết Hybrid
if (results.hybrid.length > 0) {
  detailedReport += `\n\n🔄 HYBRID API (cả Composition và Options) - ${results.hybrid.length} file\n`;
  detailedReport += '━'.repeat(88) + '\n';
  detailedReport += '⚠️  Các file này nên được refactor để sử dụng API duy nhất\n';
  results.hybrid.forEach((file, index) => {
    detailedReport += `${index + 1}. ${file.path}\n`;
  });
}

// Chi tiết Invalid
if (results.invalid.length > 0) {
  detailedReport += `\n\n❌ INVALID/KHÔNG XÁC ĐỊNH - ${results.invalid.length} file\n`;
  detailedReport += '━'.repeat(88) + '\n';
  results.invalid.forEach((file, index) => {
    detailedReport += `${index + 1}. ${file.path}`;
    if (file.error) {
      detailedReport += ` (Lỗi: ${file.error})`;
    }
    detailedReport += '\n';
  });
}

// Thêm khuyến nghị
detailedReport += `\n\n💡 KHUYẾN NGHỊ\n`;
detailedReport += '━'.repeat(88) + '\n';
detailedReport += `1. Ưu tiên chuyển đổi ${results.optionsApi.length} file Options API sang Composition API\n`;
detailedReport += `2. Refactor ${results.hybrid.length} file Hybrid để sử dụng một API duy nhất\n`;
detailedReport += `3. Kiểm tra lại ${results.invalid.length} file Invalid\n`;
detailedReport += '\n';

// Lưu báo cáo chi tiết
const reportPath = path.join(todosDir, 'vue-api-usage-report.txt');
fs.writeFileSync(reportPath, detailedReport, 'utf-8');
console.log(`\n✅ Báo cáo chi tiết đã lưu vào: ${reportPath}`);

// Tạo file JSON chi tiết cho phân tích thêm
const jsonReport = {
  timestamp: new Date().toISOString(),
  summary: {
    total: results.total,
    compositionApi: results.compositionApi.length,
    optionsApi: results.optionsApi.length,
    hybrid: results.hybrid.length,
    invalid: results.invalid.length,
    percentages: {
      compositionApi: ((results.compositionApi.length / results.total) * 100).toFixed(1),
      optionsApi: ((results.optionsApi.length / results.total) * 100).toFixed(1),
      hybrid: ((results.hybrid.length / results.total) * 100).toFixed(1),
      invalid: ((results.invalid.length / results.total) * 100).toFixed(1),
    },
  },
  details: {
    compositionApi: results.compositionApi,
    optionsApi: results.optionsApi,
    hybrid: results.hybrid,
    invalid: results.invalid,
  },
};

const jsonReportPath = path.join(todosDir, 'vue-api-usage-report.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReport, null, 2), 'utf-8');
console.log(`✅ Báo cáo JSON đã lưu vào: ${jsonReportPath}`);

// In tóm tắt ra console
console.log(summary);
console.log(`\n📈 Tóm tắt:`);
console.log(`   • Composition API: ${results.compositionApi.length}/${results.total} (${((results.compositionApi.length / results.total) * 100).toFixed(1)}%)`);
console.log(`   • Options API: ${results.optionsApi.length}/${results.total} (${((results.optionsApi.length / results.total) * 100).toFixed(1)}%)`);
console.log(`   • Hybrid: ${results.hybrid.length}/${results.total} (${((results.hybrid.length / results.total) * 100).toFixed(1)}%)`);
console.log(`   • Invalid: ${results.invalid.length}/${results.total} (${((results.invalid.length / results.total) * 100).toFixed(1)}%)`);
console.log(`\n✨ Hoàn tất! Kiểm tra folder todos để xem báo cáo chi tiết.\n`);
