const fs = require('fs');
const path = require('path');

// Đường dẫn đến file BUG_TRACKER.md
const bugTrackerPath = path.join(__dirname, '..', 'docs', 'BUG_TRACKER.md');

function getNextBugId() {
  try {
    const content = fs.readFileSync(bugTrackerPath, 'utf8');

    // Tìm tất cả BUG-XXX trong file
    const bugMatches = content.match(/BUG-\d+/g) || [];

    if (bugMatches.length === 0) {
      return 'BUG-001';
    }

    // Lấy số lớn nhất
    const numbers = bugMatches.map(match => {
      const num = parseInt(match.replace('BUG-', ''));
      return isNaN(num) ? 0 : num;
    });

    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;

    return `BUG-${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error reading BUG_TRACKER.md:', error);
    return 'BUG-001';
  }
}

// Chạy script
const nextId = getNextBugId();
console.log(`🎯 Next available BUG ID: ${nextId}`);

// Copy to clipboard trên Windows
if (process.platform === 'win32') {
  const { exec } = require('child_process');
  exec(`echo ${nextId} | clip`, (error) => {
    if (!error) {
      console.log('✅ BUG ID đã được copy vào clipboard');
    }
  });
}

module.exports = { getNextBugId };
