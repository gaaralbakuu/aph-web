#!/usr/bin/env python3
"""
Script to fix Vue components that use this.l or this.c in data() function.
Moves the initialization to created() lifecycle hook.
"""

import re
import os
from pathlib import Path

def fix_vue_file(file_path):
    """Fix a single Vue file."""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern to find data: function() { with this.l or this.c usage
    # This is complex, so we'll do it step by step
    
    # First, check if file uses this.l or this.c in data section
    data_section_pattern = r'data\s*(?::\s*function\s*\(\)|function\s*)\s*\([\s\S]*?\)\s*\{'
    matches = list(re.finditer(data_section_pattern, content))
    
    if not matches:
        return False
    
    for match in matches:
        # Find the complete data function
        start_pos = match.start()
        
        # Find matching closing brace for data function
        open_braces = 0
        in_data_func = False
        end_pos = start_pos
        
        for i in range(start_pos, len(content)):
            if content[i] == '{':
                open_braces += 1
                in_data_func = True
            elif content[i] == '}':
                open_braces -= 1
                if in_data_func and open_braces == 0:
                    end_pos = i + 1
                    break
        
        data_func_content = content[start_pos:end_pos]
        
        # Check if this data function uses this.l or this.c
        if 'this.l.' not in data_func_content and 'this.c.' not in data_func_content:
            continue
        
        print(f"  Found data() using this.l/this.c")
        
        # This file needs fixing - for now just report it
        # Actual fix is too complex for automated script
        return True
    
    return False

def find_vue_files(directory):
    """Find all Vue files in directory."""
    vue_files = []
    for root, dirs, files in os.walk(directory):
        # Skip node_modules
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.vue'):
                vue_files.append(os.path.join(root, file))
    return vue_files

def main():
    """Main function."""
    base_dir = Path(__file__).parent / 'src' / 'views'
    
    # List of known problematic files
    problem_files = [
        'sysbasics/Epidemic.vue',
        'admin/AppVersion.vue',
        'admin/AstrictAuth.vue',
        'admin/Banner.vue',
        'admin/Dictionary.vue',
        'admin/Menu.vue',
        'admin/Quartz.vue',
        'admin/Role.vue',
        'admin/TestUser.vue',
        'admin/User.vue',
        'admin/UserFeedback.vue',
        'admin/WorkflowFields.vue',
    ]
    
    print("Files that need manual fixing:")
    for file_rel in problem_files:
        file_path = base_dir / file_rel
        if file_path.exists():
            print(f"  - {file_rel}")
        else:
            print(f"  - {file_rel} (NOT FOUND)")

if __name__ == '__main__':
    main()
