import os
import re

def migrate_sync(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace :prop.sync="val" with v-model:prop="val"
    new_content = re.sub(r':([a-zA-Z0-9-]+)\.sync=', r'v-model:\1=', content)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Migrated: {file_path}")

def walk_and_migrate(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.vue'):
                migrate_sync(os.path.join(root, file))

if __name__ == "__main__":
    walk_and_migrate('src')
