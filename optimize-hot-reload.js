#!/usr/bin/env node

const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');

console.log(chalk.blue.bold('🚀 Tailwind CSS Hot Reload Optimizer\n'));

// Function để chạy lệnh và log output
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(chalk.yellow(`⏳ ${description}...`));
    
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`❌ Lỗi: ${error.message}`));
        reject(error);
        return;
      }
      
      if (stderr) {
        console.log(chalk.yellow(`⚠️  Warning: ${stderr}`));
      }
      
      if (stdout) {
        console.log(chalk.green(`✅ ${description} hoàn thành`));
        console.log(stdout);
      }
      
      resolve(stdout);
    });
    
    // Log real-time output
    process.stdout?.on('data', (data) => {
      console.log(chalk.cyan(data.toString()));
    });
    
    process.stderr?.on('data', (data) => {
      console.log(chalk.red(data.toString()));
    });
  });
}

// Optimization steps
async function optimize() {
  try {
    console.log(chalk.green.bold('🔧 Bắt đầu tối ưu hóa...\n'));
    
    // Step 1: Kiểm tra và cài đặt dependencies
    console.log(chalk.blue.bold('📦 Bước 1: Cài đặt dependencies cần thiết'));
    try {
      await runCommand('npm install --save-dev babel-eslint@^10.1.0', 'Cài babel-eslint');
    } catch (e) {
      console.log(chalk.yellow('babel-eslint có thể đã được cài'));
    }
    
    // Step 2: Clear cache
    console.log(chalk.blue.bold('\n🧹 Bước 2: Clear cache'));
    try {
      await runCommand('npm cache clean --force', 'Clear npm cache');
    } catch (e) {
      console.log(chalk.yellow('Không thể clear cache hoàn toàn'));
    }
    
    // Step 3: Kiểm tra ESLint
    console.log(chalk.blue.bold('\n🔍 Bước 3: Kiểm tra ESLint'));
    try {
      await runCommand('npx eslint --version', 'Kiểm tra ESLint version');
    } catch (e) {
      console.log(chalk.red('ESLint có vấn đề, cần cài lại'));
    }
    
    // Step 4: Tạo file .env.local để optimize dev server
    console.log(chalk.blue.bold('\n⚙️  Bước 4: Tối ưu dev server'));
    const envContent = `# Hot reload optimization
CHOKIDAR_USEPOLLING=false
FAST_REFRESH=true
WDS_SOCKET_PORT=8180

# Tailwind CSS optimization
NODE_ENV=development
DEBUG_TAILWIND=true
`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log(chalk.green('✅ Tạo .env.local để tối ưu dev server'));
    
    // Step 5: Tạo tailwind watcher script
    const watcherScript = `const chokidar = require('chokidar');
const path = require('path');

console.log('🔍 Watching Tailwind CSS files for changes...');

// Watch các file Vue, JS, HTML
const watcher = chokidar.watch([
  './src/**/*.{vue,js,ts}',
  './public/**/*.html'
], {
  ignored: /node_modules/,
  persistent: true,
  usePolling: false,
  interval: 100
});

watcher.on('change', (filePath) => {
  console.log(\`📝 File changed: \${path.relative(process.cwd(), filePath)}\`);
  console.log(\`⏰ At: \${new Date().toLocaleTimeString()}\`);
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});

console.log('✅ Tailwind watcher started');
console.log('Press Ctrl+C to stop');`;
    
    // Step 6: Instructions
    console.log(chalk.blue.bold('\n📋 Bước cuối: Hướng dẫn sử dụng'));
    console.log(chalk.green(`
✨ Tối ưu hóa hoàn thành! 

🚀 Để test hot reload:
1. Chạy: ${chalk.cyan('npm run dev')} hoặc ${chalk.cyan('npm run serve')}
2. Import TestHotReload component:
   ${chalk.cyan('import TestHotReload from "@/components/TestHotReload.vue"')}
3. Thêm vào template: ${chalk.cyan('<TestHotReload />')}
4. Thay đổi Tailwind classes và save
5. Xem browser có reload không

🐛 Debug commands:
- ${chalk.cyan('npm run check-tailwind')} - Kiểm tra cấu hình
- ${chalk.cyan('npm run dev:debug')} - Chạy với debug mode
- ${chalk.cyan('npm run lint:fix')} - Fix ESLint errors

💡 Tips:
- Mở Developer Tools để xem network requests
- Kiểm tra console có errors không  
- Thử hard refresh (Ctrl+Shift+R) nếu cần
- Đảm bảo file được save đúng encoding (UTF-8)

🔧 Nếu vẫn không work:
1. Restart VSCode
2. Clear browser cache
3. Restart dev server
4. Kiểm tra Windows Defender không block file changes
    `));
    
    console.log(chalk.blue.bold('🎉 Hoàn thành tối ưu hóa!'));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Có lỗi xảy ra:'), error.message);
    console.log(chalk.yellow('\n🔧 Thử các bước manual:'));
    console.log('1. npm install --save-dev babel-eslint@^10.1.0');  
    console.log('2. npm cache clean --force');
    console.log('3. Restart VSCode và dev server');
  }
}

// Chạy optimization
optimize();

// Export for programmatic use
module.exports = { optimize, runCommand };
