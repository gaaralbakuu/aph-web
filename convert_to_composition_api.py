#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động convert Vue Options API sang Composition API (script setup)
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Optional

class VueCompositionConverter:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self._read_file()
        self.template = ''
        self.script = ''
        self.style = ''
        self.component_name = ''
        
    def _read_file(self) -> str:
        encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
        for encoding in encodings:
            try:
                with open(self.file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
        return ""
    
    def _write_file(self, content: str):
        with open(self.file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def extract_sections(self):
        """Trích xuất template, script, style"""
        # Template
        template_match = re.search(r'(<template[^>]*>.*?</template>)', self.content, re.DOTALL)
        if template_match:
            self.template = template_match.group(1)
        
        # Script
        script_match = re.search(r'<script[^>]*>(.*?)</script>', self.content, re.DOTALL)
        if script_match:
            self.script = script_match.group(1)
        
        # Style
        style_match = re.search(r'(<style[^>]*>.*?</style>)', self.content, re.DOTALL)
        if style_match:
            self.style = style_match.group(1)
        
        # Component name
        name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", self.script)
        if name_match:
            self.component_name = name_match.group(1)
    
    def parse_props(self) -> str:
        """Parse props definition"""
        props_match = re.search(r'props:\s*{([^}]+)}', self.script, re.DOTALL)
        if not props_match:
            return ''
        
        props_content = props_match.group(1)
        # Simple props, không parse chi tiết
        return f"const props = defineProps({{{props_content}}})\n"
    
    def parse_data(self) -> str:
        """Parse data() thành reactive refs"""
        data_match = re.search(r'data\s*\(\s*\)\s*{\s*return\s*{([^}]+)}', self.script, re.DOTALL)
        if not data_match:
            return ''
        
        data_content = data_match.group(1).strip()
        lines = []
        
        for line in data_content.split(','):
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            
            match = re.match(r'(\w+):\s*(.+)', line)
            if match:
                var_name = match.group(1)
                var_value = match.group(2).rstrip(',')
                lines.append(f"const {var_name} = ref({var_value})")
        
        return '\n'.join(lines) + '\n' if lines else ''
    
    def parse_computed(self) -> str:
        """Parse computed properties"""
        computed_match = re.search(r'computed:\s*{([^}]+)}', self.script, re.DOTALL)
        if not computed_match:
            return ''
        
        # Đơn giản hóa: chỉ wrap lại
        computed_content = computed_match.group(1).strip()
        lines = []
        
        # Tìm tất cả computed properties
        prop_matches = re.finditer(r'(\w+)\s*\(\s*\)\s*{([^}]+)}', computed_content, re.DOTALL)
        for match in prop_matches:
            prop_name = match.group(1)
            prop_body = match.group(2).strip()
            lines.append(f"const {prop_name} = computed(() => {{{prop_body}}})")
        
        return '\n'.join(lines) + '\n' if lines else ''
    
    def parse_methods(self) -> str:
        """Parse methods thành functions"""
        methods_match = re.search(r'methods:\s*{([^}]+)}', self.script, re.DOTALL)
        if not methods_match:
            return ''
        
        methods_content = methods_match.group(1).strip()
        
        # Thay thế this. bằng nothing (sẽ xử lý sau)
        # Đơn giản: chỉ chuyển thành const func = () => {}
        lines = []
        func_matches = re.finditer(r'(\w+)\s*\([^)]*\)\s*{', methods_content)
        
        # Quá phức tạp, return raw
        return '// TODO: Convert methods manually\n'
    
    def detect_imports_needed(self) -> List[str]:
        """Phát hiện cần import gì"""
        imports = []
        
        if 'data()' in self.script:
            imports.append('ref')
        if 'computed:' in self.script:
            imports.append('computed')
        if 'watch:' in self.script:
            imports.append('watch')
        if re.search(r'this\.\$route', self.script):
            imports.append('useRoute')
        if re.search(r'this\.\$router', self.script):
            imports.append('useRouter')
        if re.search(r'this\.\$store', self.script):
            imports.append('useStore')
        
        return imports
    
    def generate_composition_script(self) -> str:
        """Tạo script setup mới"""
        imports = self.detect_imports_needed()
        
        script_parts = []
        
        # Vue imports
        vue_imports = [i for i in imports if i in ['ref', 'computed', 'watch', 'onMounted', 'onUnmounted']]
        if vue_imports:
            script_parts.append(f"import {{ {', '.join(vue_imports)} }} from 'vue'")
        
        # Router imports
        if 'useRoute' in imports or 'useRouter' in imports:
            router_imports = [i for i in imports if i in ['useRoute', 'useRouter']]
            script_parts.append(f"import {{ {', '.join(router_imports)} }} from 'vue-router'")
        
        # Store
        if 'useStore' in imports:
            script_parts.append("import { useStore } from 'vuex'")
        
        script_parts.append("")
        
        # Props
        props_code = self.parse_props()
        if props_code:
            script_parts.append(props_code)
        
        # Data
        data_code = self.parse_data()
        if data_code:
            script_parts.append(data_code)
        
        # Computed
        computed_code = self.parse_computed()
        if computed_code:
            script_parts.append(computed_code)
        
        # Methods - để comment
        script_parts.append("// TODO: Convert methods, watch, lifecycle hooks manually")
        
        return '\n'.join(script_parts)
    
    def convert(self) -> bool:
        """Convert file"""
        self.extract_sections()
        
        if '<script setup>' in self.content:
            print(f"⏭️  SKIP: {self.file_path.name} (đã dùng script setup)")
            return False
        
        if 'export default {' not in self.script:
            print(f"⏭️  SKIP: {self.file_path.name} (không phải Options API)")
            return False
        
        # Sinh script mới
        new_script_content = self.generate_composition_script()
        new_script = f"<script setup>\n{new_script_content}\n</script>"
        
        # Ghép lại
        new_content = []
        if self.template:
            new_content.append(self.template)
        new_content.append(new_script)
        if self.style:
            new_content.append(self.style)
        
        final_content = '\n\n'.join(new_content)
        
        # Backup
        backup_path = self.file_path.with_suffix('.vue.bak')
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(self.content)
        
        # Write
        self._write_file(final_content)
        
        print(f"✅ CONVERTED: {self.file_path.name}")
        return True


def convert_file(file_path: str):
    """Convert một file"""
    converter = VueCompositionConverter(file_path)
    return converter.convert()


def main():
    # Đọc danh sách file từ OPTIONS_API_FILES.txt
    options_file = Path('OPTIONS_API_FILES.txt')
    if not options_file.exists():
        print("❌ Không tìm thấy OPTIONS_API_FILES.txt")
        print("Chạy detect_options_api.py trước!")
        return
    
    with open(options_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Lọc ra các dòng chứa đường dẫn file
    file_paths = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('=') and not line.startswith('DANH SÁCH'):
            if line.endswith('.vue'):
                file_paths.append(line)
    
    print(f"📋 Tìm thấy {len(file_paths)} file cần convert\n")
    
    converted_count = 0
    for i, rel_path in enumerate(file_paths, 1):
        print(f"\n[{i}/{len(file_paths)}] Converting: {rel_path}")
        if convert_file(rel_path):
            converted_count += 1
    
    print(f"\n\n{'='*80}")
    print(f"✅ ĐÃ CONVERT: {converted_count}/{len(file_paths)} file")
    print(f"⚠️  LƯU Ý: Cần review và hoàn thiện thủ công:")
    print(f"   - Methods chưa được convert tự động")
    print(f"   - Watch chưa được convert")
    print(f"   - Lifecycle hooks chưa được convert")
    print(f"   - this.$route, this.$router, this.$store cần thay bằng composables")
    print(f"{'='*80}")


if __name__ == '__main__':
    main()
