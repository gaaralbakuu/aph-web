const fs = require('fs');
const path = require('path');

console.log('🔍 Kiểm tra cấu hình Tailwind CSS Hot Reload...\n');

// Kiểm tra các file cấu hình
const checks = [
  {
    name: 'tailwind.config.js',
    path: './tailwind.config.js',
    validator: (content) => {
      if (content.includes('content:') || content.includes('purge:')) {
        console.log('✅ Tailwind config có content/purge paths');
        if (content.includes('mode: \'jit\'')) {
          console.log('⚠️  Đang dùng JIT mode cũ, nên dùng Tailwind 3+ hoặc cấu hình mới');
        }
        return true;
      }
      console.log('❌ Tailwind config thiếu content paths');
      return false;
    }
  },
  {
    name: 'postcss.config.js',
    path: './postcss.config.js',
    validator: (content) => {
      if (content.includes('tailwindcss') && content.includes('autoprefixer')) {
        console.log('✅ PostCSS config có Tailwind và Autoprefixer');
        if (content.includes('postcss7-compat')) {
          console.log('⚠️  Đang dùng postcss7-compat (legacy), nên upgrade lên PostCSS 8+');
        }
        return true;
      }
      console.log('❌ PostCSS config thiếu Tailwind hoặc Autoprefixer');
      return false;
    }
  },
  {
    name: 'vue.config.js',
    path: './vue.config.js',
    validator: (content) => {
      if (content.includes('devServer')) {
        console.log('✅ Vue config có devServer');
        if (content.includes('hot:') && content.includes('liveReload:')) {
          console.log('✅ DevServer có hot reload enabled');
        } else {
          console.log('⚠️  DevServer thiếu hot reload config');
        }
        if (content.includes('watchOptions')) {
          console.log('✅ DevServer có watchOptions');
        } else {
          console.log('⚠️  DevServer thiếu watchOptions (có thể cần cho file watching)');
        }
        return true;
      }
      console.log('❌ Vue config thiếu devServer');
      return false;
    }
  },
  {
    name: 'src/assets/css/tailwind.css',
    path: './src/assets/css/tailwind.css',
    validator: (content) => {
      const requiredImports = ['@tailwind base', '@tailwind components', '@tailwind utilities'];
      const hasAll = requiredImports.every(imp => content.includes(imp));
      if (hasAll) {
        console.log('✅ Tailwind CSS base file có đầy đủ imports');
        return true;
      }
      console.log('❌ Tailwind CSS base file thiếu imports:', 
        requiredImports.filter(imp => !content.includes(imp)));
      return false;
    }
  }
];

let allPassed = true;

checks.forEach(check => {
  console.log(`\n📁 Kiểm tra ${check.name}...`);
  try {
    if (fs.existsSync(check.path)) {
      const content = fs.readFileSync(check.path, 'utf8');
      const passed = check.validator(content);
      if (!passed) allPassed = false;
    } else {
      console.log(`❌ File ${check.name} không tồn tại`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ Lỗi đọc file ${check.name}:`, error.message);
    allPassed = false;
  }
});

// Kiểm tra package.json dependencies
console.log('\n📦 Kiểm tra dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Kiểm tra Tailwind version
  if (deps.tailwindcss) {
    const version = deps.tailwindcss.replace(/[\^~]/, '');
    console.log(`✅ Tailwind CSS version: ${version}`);
    if (version.startsWith('2.')) {
      console.log('⚠️  Đang dùng Tailwind 2, nên upgrade lên 3+ để có JIT mode tốt hơn');
    }
  }
  
  // Kiểm tra PostCSS compatibility
  if (deps['@tailwindcss/postcss7-compat']) {
    console.log('⚠️  Đang dùng postcss7-compat, nên upgrade lên PostCSS 8+');
  }
  
  // Kiểm tra Vue CLI version
  if (deps['@vue/cli-service']) {
    console.log(`✅ Vue CLI Service version: ${deps['@vue/cli-service']}`);
  }
  
} catch (error) {
  console.log('❌ Lỗi đọc package.json:', error.message);
  allPassed = false;
}

// Kết luận và đưa ra khuyến nghị
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ Tất cả kiểm tra đều PASS!');
  console.log('\n🚀 Hướng dẫn test hot reload:');
  console.log('1. Chạy: npm run serve');
  console.log('2. Mở browser và dev tools');
  console.log('3. Thêm class Tailwind vào element (vd: bg-red-500)');
  console.log('4. Save file và xem có hot reload không');
} else {
  console.log('❌ Có một số vấn đề cần khắc phục');
  console.log('\n🔧 Khuyến nghị khắc phục:');
  console.log('1. Upgrade dependencies:');
  console.log('   npm install tailwindcss@latest postcss@latest autoprefixer@latest');
  console.log('2. Cài thêm babel-eslint:');
  console.log('   npm install --save-dev babel-eslint@^10.1.0');
  console.log('3. Restart dev server sau khi cập nhật config');
  console.log('4. Clear browser cache nếu cần');
}

console.log('\n💡 Các tips khác:');
console.log('- Đảm bảo không có CSS cache ở browser');
console.log('- Kiểm tra console có error không');
console.log('- Thử refresh hard (Ctrl+Shift+R)');
console.log('- Kiểm tra file được save đúng path không');

// Test script để kiểm tra Tailwind classes
console.log('\n🧪 Tạo file test...');
const testComponent = `<template>
  <div class="test-hot-reload p-4 bg-blue-500 text-white rounded-lg">
    <h1 class="text-2xl font-bold">Test Tailwind Hot Reload</h1>
    <p class="mt-2">Thay đổi class bg-blue-500 thành bg-red-500 và save để test</p>
    <button class="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded">
      Test Button
    </button>
  </div>
</template>

<script>
export default {
  name: 'TestHotReload'
}
</script>`;

try {
  fs.writeFileSync('./src/components/TestHotReload.vue', testComponent);
  console.log('✅ Tạo TestHotReload.vue thành công');
  console.log('   Import vào component để test hot reload');
} catch (error) {
  console.log('❌ Lỗi tạo test component:', error.message);
}
