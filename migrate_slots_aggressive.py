import os
import re

def migrate_slots_aggressive(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Handle <template slot="foo"> -> <template #foo>
    new_content = re.sub(r'<template\s+slot="([^"]*)"', r'<template #\1', content)

    # 2. Handle <something slot="foo"> -> <template #foo><something>...</template>
    # This is tricky because we need to find the closing tag.
    # For now, let's target specific common ones or use a simple replacement if it's on a component.
    
    # Simple replacement for common Element Plus slots on non-template tags
    # <el-button slot="append"> -> <template #append><el-button>
    
    # Let's try to find tags that have slot="..." and wrap them.
    # regex to find <TAG slot="NAME">...</TAG>
    # This is rough but covers many common cases.
    pattern = r'<([a-zA-Z0-9-]+)\s+([^>]*?)slot="([^"]*)"([^>]*?)>(.*?)</\1>'
    # We want to transform to <template #NAME><TAG ATTRS>...</TAG></template>
    def wrap_slot(match):
        tag = match.group(1)
        attrs_before = match.group(2).strip()
        name = match.group(3)
        attrs_after = match.group(4).strip()
        inner = match.group(5)
        
        attrs = (attrs_before + " " + attrs_after).strip()
        if attrs:
            return f'<template #{name}><{tag} {attrs}>{inner}</{tag}></template>'
        else:
            return f'<template #{name}><{tag}>{inner}</{tag}></template>'

    # Run it a few times for nested slots if any (though rare)
    processed_content = re.sub(pattern, wrap_slot, new_content, flags=re.DOTALL)
    
    # Also handle self-closing tags with slots: <TAG slot="NAME" />
    pattern_self = r'<([a-zA-Z0-9-]+)\s+([^>]*?)slot="([^"]*)"([^>]*?)\s*/>'
    def wrap_slot_self(match):
        tag = match.group(1)
        attrs_before = match.group(2).strip()
        name = match.group(3)
        attrs_after = match.group(4).strip()
        attrs = (attrs_before + " " + attrs_after).strip()
        if attrs:
            return f'<template #{name}><{tag} {attrs} /></template>'
        else:
            return f'<template #{name}><{tag} /></template>'
    
    processed_content = re.sub(pattern_self, wrap_slot_self, processed_content)

    if content != processed_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(processed_content)
        print(f"Migrated slots in: {file_path}")

def walk_and_migrate(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.vue'):
                migrate_slots_aggressive(os.path.join(root, file))

if __name__ == "__main__":
    walk_and_migrate('src')
