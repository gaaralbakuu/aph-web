import os
import re
from pathlib import Path

# Path to src directory
src_dir = Path('g:/APH_Workspace/VueJS/aph-web-vue3-jules/src')

# Regex for imports
import_regex = re.compile(r"import\s+(?:.*?\s+from\s+)?['\"](@\/|\.|\.\.\/)([^'\"]+)['\"]")

# Results
results = []

def resolve_path(source_file, import_path):
    if import_path.startswith('@/'):
        base_path = src_dir
        rel_path = import_path[2:]
    else:
        base_path = source_file.parent
        rel_path = import_path
    
    return (base_path / rel_path).resolve()

def check_file_case(path):
    if not path.exists():
        return False
    
    # On Windows, path.exists() is case-insensitive. 
    # To check case, we compare the name in the directory.
    name = path.name
    parent = path.parent
    if not parent.exists():
        return False
    
    actual_names = os.listdir(parent)
    if name not in actual_names:
        # Case mismatch or file doesn't exist
        return False
    return True

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.vue', '.js')):
            source_file = Path(root) / file
            try:
                content = source_file.read_text(encoding='utf-8')
            except Exception:
                continue
                
            lines = content.splitlines()
            for i, line in enumerate(lines):
                match = import_regex.search(line)
                if match:
                    import_path_str = match.group(1) + match.group(2)
                    path_part = match.group(2)
                    
                    # Check if it has an extension
                    has_ext = any(path_part.endswith(ext) for ext in ['.vue', '.js', '.png', '.jpg', '.jpeg', '.scss', '.css', '.svg', '.json'])
                    
                    full_path = resolve_path(source_file, import_path_str)
                    
                    if has_ext:
                        # Even if it has an extension, check if it exists with the correct case
                        if not check_file_case(full_path):
                            if full_path.exists(): # Case mismatch on Windows
                                results.append({
                                    'file': str(source_file.relative_to(src_dir.parent)),
                                    'line': i + 1,
                                    'import': import_path_str,
                                    'issue': 'case mismatch'
                                })
                            else:
                                results.append({
                                    'file': str(source_file.relative_to(src_dir.parent)),
                                    'line': i + 1,
                                    'import': import_path_str,
                                    'issue': 'not found'
                                })
                    else:
                        # Missing extension
                        possible_resolutions = [
                            full_path.with_suffix('.vue'),
                            full_path.with_suffix('.js'),
                            full_path / 'index.vue',
                            full_path / 'index.js'
                        ]
                        
                        found = False
                        for res in possible_resolutions:
                            if res.exists():
                                if check_file_case(res):
                                    results.append({
                                        'file': str(source_file.relative_to(src_dir.parent)),
                                        'line': i + 1,
                                        'import': import_path_str,
                                        'resolved_to': str(res.relative_to(src_dir.parent)),
                                        'issue': 'missing extension or folder index'
                                    })
                                    found = True
                                    break
                                else:
                                    # Case mismatch (e.g. import ./file -> resolved to File.vue)
                                    results.append({
                                        'file': str(source_file.relative_to(src_dir.parent)),
                                        'line': i + 1,
                                        'import': import_path_str,
                                        'resolved_to': str(res.relative_to(src_dir.parent)),
                                        'issue': 'missing extension AND case mismatch'
                                    })
                                    found = True
                                    break
                        
                        if not found:
                             results.append({
                                'file': str(source_file.relative_to(src_dir.parent)),
                                'line': i + 1,
                                'import': import_path_str,
                                'issue': 'not found'
                            })

# Filter out common node_modules or legitimate no-extension imports if any (though regex only looks for local)
# The regex already filters for @/, ./, ../

for r in results:
    print(f"File: {r['file']}:{r['line']}")
    print(f"  Import: {r['import']}")
    if 'resolved_to' in r:
        print(f"  Should be: {r['resolved_to']}")
    print(f"  Issue: {r['issue']}")
    print("-" * 20)
