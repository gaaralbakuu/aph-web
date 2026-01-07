#!/usr/bin/env python3
"""
Script để tự động replace $l và $c thành l và c trong template Vue
Tránh lỗi Vue 3 proxy trap khi sử dụng $ prefix
"""

import os
import re
from pathlib import Path

# Thư mục gốc của dự án
ROOT_DIR = Path(__file__).parent.parent / 'src' / 'views'

def fix_template_file(file_path):
    """
    Đọc file Vue và replace $l. -> l. và $c. -> c. trong template
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace trong template:
        # {{ $l.xxx }} -> {{ l.xxx }}
        # {{ $c.xxx }} -> {{ c.xxx }}
        # :title="$l.xxx" -> :title="l.xxx"
        # v-if="$l.xxx" -> v-if="l.xxx"
        # etc.
        
        # Pattern 1: {{ $l. hoặc {{ $c.
        content = re.sub(r'\{\{\s*\$l\.', '{{ l.', content)
        content = re.sub(r'\{\{\s*\$c\.', '{{ c.', content)
        
        # Pattern 2: trong attributes (có thể có hoặc không có dấu ngoặc kép)
        # :label="$l.xxx" -> :label="l.xxx"
        # :title='$l.xxx' -> :title='l.xxx'
        content = re.sub(r'(["\'])\$l\.', r'\1l.', content)
        content = re.sub(r'(["\'])\$c\.', r'\1c.', content)
        
        # Pattern 3: trong directives không có quotes (ít gặp nhưng có thể có)
        # v-if="$l.xxx" đã được cover ở pattern 2
        
        # Pattern 4: trong interpolation với spaces
        # {{  $l.xxx  }} -> {{  l.xxx  }}
        content = re.sub(r'\$l\.', 'l.', content)
        content = re.sub(r'\$c\.', 'c.', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, file_path
        return False, None
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False, None

def main():
    """
    Scan tất cả file .vue trong src/views và fix
    """
    vue_files = list(ROOT_DIR.rglob('*.vue'))
    print(f"Found {len(vue_files)} Vue files in {ROOT_DIR}")
    
    fixed_files = []
    for vue_file in vue_files:
        changed, file_path = fix_template_file(vue_file)
        if changed:
            fixed_files.append(file_path)
    
    print(f"\n✅ Fixed {len(fixed_files)} files:")
    for f in fixed_files:
        print(f"  - {f.relative_to(ROOT_DIR.parent.parent)}")
    
    if not fixed_files:
        print("✅ No files needed fixing!")

if __name__ == '__main__':
    main()
