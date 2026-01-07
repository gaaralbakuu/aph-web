#!/usr/bin/env python3
"""
Script to fix all invalid Vue 2 slot/directive syntaxes in Vue 3 project
Converts:
- <template #scope><template v-> to <template #default="scope">
- <template #{...}><template v-> to <template #default="{...}">
- <template #v><template v-> to <template #default="v">
"""

import os
import re
from pathlib import Path

# Định nghĩa root path
ROOT_DIR = Path(r"g:\APH_Workspace\VueJS\aph-web-vue3-jules\src")

def fix_template_syntax(content):
    """Fix all invalid template slot syntaxes"""
    
    # Pattern 1: <template #scope><template v-> ... </template></template>
    # Replace with: <template #default="scope"> ... </template>
    pattern1 = r'<template #scope><template v->(.*?)</template></template>'
    content = re.sub(pattern1, r'<template #default="scope">\1</template>', content, flags=re.DOTALL)
    
    # Pattern 2: <template #v><template v-> ... </template></template>
    # Replace with: <template #default="v"> ... </template>
    pattern2 = r'<template #v><template v->(.*?)</template></template>'
    content = re.sub(pattern2, r'<template #default="v">\1</template>', content, flags=re.DOTALL)
    
    # Pattern 3: <template #{text, record}><template v-> ... </template></template>
    # Replace with: <template #default="{ text, record }"> ... </template>
    pattern3 = r'<template #\{([^}]+)\}><template v->(.*?)</template></template>'
    content = re.sub(pattern3, r'<template #default="{ \1 }">\2</template>', content, flags=re.DOTALL)
    
    return content

def process_file(file_path):
    """Process a single .vue file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Fix syntax
        fixed_content = fix_template_syntax(original_content)
        
        # Only write if content changed
        if fixed_content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all .vue files"""
    vue_files = list(ROOT_DIR.rglob('*.vue'))
    total_files = len(vue_files)
    fixed_count = 0
    
    print(f"Found {total_files} .vue files")
    print("Processing...")
    
    for vue_file in vue_files:
        if process_file(vue_file):
            fixed_count += 1
            print(f"✓ Fixed: {vue_file.relative_to(ROOT_DIR)}")
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Total files scanned: {total_files}")
    print(f"  Files fixed: {fixed_count}")
    print(f"  Files unchanged: {total_files - fixed_count}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
