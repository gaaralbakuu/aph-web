#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script phát hiện các file Vue chưa convert sang Composition API
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Set

class VueFileAnalyzer:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.total_vue_files = 0
        self.script_setup_files = 0
        self.define_component_files = 0
        self.options_api_files = []
        
    def is_vue_file(self, filepath: Path) -> bool:
        return filepath.suffix == '.vue'
    
    def read_file_safe(self, filepath: Path) -> str:
        encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
        return ""
    
    def extract_script_content(self, content: str) -> str:
        """Trích xuất nội dung trong <script> tag"""
        script_match = re.search(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
        if script_match:
            return script_match.group(1)
        return ""
    
    def extract_template_content(self, content: str) -> str:
        """Trích xuất nội dung trong <template> tag"""
        template_match = re.search(r'<template[^>]*>(.*?)</template>', content, re.DOTALL)
        if template_match:
            return template_match.group(1)
        return ""
    
    def get_component_name_from_path(self, filepath: Path) -> str:
        """Lấy tên component từ tên file (bỏ .vue)"""
        return filepath.stem
    
    def is_recursive_component(self, content: str, filepath: Path) -> bool:
        """Kiểm tra component có tự gọi chính nó không"""
        template = self.extract_template_content(content)
        component_name = self.get_component_name_from_path(filepath)
        
        # Kiểm tra PascalCase và kebab-case
        pascal_pattern = f'<{component_name}[\\s/>]'
        kebab_name = re.sub(r'(?<!^)(?=[A-Z])', '-', component_name).lower()
        kebab_pattern = f'<{kebab_name}[\\s/>]'
        
        return bool(re.search(pascal_pattern, template, re.IGNORECASE) or 
                   re.search(kebab_pattern, template, re.IGNORECASE))
    
    def detect_global_properties_usage(self, script_content: str) -> Dict[str, bool]:
        """Phát hiện việc sử dụng this.$router, this.$route, this.$store"""
        return {
            'router': bool(re.search(r'this\.\$router', script_content)),
            'route': bool(re.search(r'this\.\$route', script_content)),
            'store': bool(re.search(r'this\.\$store', script_content)),
        }
    
    def analyze_file(self, filepath: Path) -> Dict:
        """Phân tích một file Vue"""
        content = self.read_file_safe(filepath)
        script_content = self.extract_script_content(content)
        
        result = {
            'path': filepath,
            'relative_path': filepath.relative_to(self.project_root),
            'is_options_api': False,
            'is_script_setup': False,
            'is_define_component': False,
            'is_recursive': False,
            'uses_router': False,
            'uses_route': False,
            'uses_store': False,
            'options_features': []
        }
        
        # Kiểm tra <script setup>
        if '<script setup>' in content or '<script setup ' in content:
            result['is_script_setup'] = True
            return result
        
        # Kiểm tra defineComponent
        if 'defineComponent' in script_content:
            result['is_define_component'] = True
            return result
        
        # Kiểm tra Options API
        if 'export default {' not in script_content:
            return result
        
        # Kiểm tra các keyword Options API
        options_keywords = {
            'data()': r'data\s*\(\s*\)',
            'methods:': r'methods\s*:',
            'computed:': r'computed\s*:',
            'watch:': r'watch\s*:',
            'props:': r'props\s*:',
            'name:': r'name\s*:',
            'this.': r'this\.',
        }
        
        found_features = []
        for feature, pattern in options_keywords.items():
            if re.search(pattern, script_content):
                found_features.append(feature)
        
        # Chỉ đánh dấu là Options API nếu có ít nhất 1 feature
        if found_features:
            result['is_options_api'] = True
            result['options_features'] = found_features
            
            # Kiểm tra recursive component
            result['is_recursive'] = self.is_recursive_component(content, filepath)
            
            # Kiểm tra global properties
            global_props = self.detect_global_properties_usage(script_content)
            result['uses_router'] = global_props['router']
            result['uses_route'] = global_props['route']
            result['uses_store'] = global_props['store']
        
        return result
    
    def scan_project(self) -> List[Dict]:
        """Quét toàn bộ project"""
        print(f"🔍 Đang quét project: {self.project_root}\n")
        
        for root, dirs, files in os.walk(self.project_root):
            # Bỏ qua node_modules, dist, .git
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.git', '__pycache__']]
            
            for file in files:
                filepath = Path(root) / file
                
                if not self.is_vue_file(filepath):
                    continue
                
                self.total_vue_files += 1
                result = self.analyze_file(filepath)
                
                if result['is_script_setup']:
                    self.script_setup_files += 1
                elif result['is_define_component']:
                    self.define_component_files += 1
                elif result['is_options_api']:
                    self.options_api_files.append(result)
        
        return self.options_api_files
    
    def print_report(self):
        """In báo cáo"""
        # Sort theo alphabet
        sorted_files = sorted(self.options_api_files, key=lambda x: str(x['relative_path']))
        
        print("\n" + "="*80)
        print("📊 THỐNG KÊ TỔNG QUAN")
        print("="*80)
        print(f"📁 Tổng số file .vue: {self.total_vue_files}")
        print(f"✅ File dùng <script setup>: {self.script_setup_files}")
        print(f"✅ File dùng defineComponent: {self.define_component_files}")
        print(f"⚠️  File dùng Options API: {len(self.options_api_files)}")
        
        converted = self.script_setup_files + self.define_component_files
        if self.total_vue_files > 0:
            percent = (converted / self.total_vue_files) * 100
            print(f"📈 Tỉ lệ đã convert: {percent:.1f}%")
        
        if not sorted_files:
            print("\n✨ Tất cả file đã được convert sang Composition API!")
            return
        
        print("\n" + "="*80)
        print("⚠️  DANH SÁCH FILE CHƯA CONVERT (Options API)")
        print("="*80)
        
        for i, file_info in enumerate(sorted_files, 1):
            rel_path = file_info['relative_path']
            print(f"\n{i}. {rel_path}")
            
            # Hiển thị các features Options API được sử dụng
            features = file_info['options_features']
            if features:
                print(f"   📌 Features: {', '.join(features)}")
            
            # Hiển thị flags đặc biệt
            flags = []
            if file_info['is_recursive']:
                flags.append("🔄 RECURSIVE")
            if file_info['uses_router']:
                flags.append("🔀 this.$router")
            if file_info['uses_route']:
                flags.append("🛣️ this.$route")
            if file_info['uses_store']:
                flags.append("🏪 this.$store")
            
            if flags:
                print(f"   🚩 Flags: {' | '.join(flags)}")
        
        print("\n" + "="*80)
        print("📋 CHÚ THÍCH")
        print("="*80)
        print("🔄 RECURSIVE    - Component tự gọi chính nó trong template")
        print("🔀 this.$router - Cần import { useRouter } from 'vue-router'")
        print("🛣️ this.$route  - Cần import { useRoute } from 'vue-router'")
        print("🏪 this.$store  - Cần chuyển sang Pinia hoặc dùng useStore")
        print("="*80)
        
        # Xuất file danh sách
        output_file = self.project_root / 'OPTIONS_API_FILES.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("DANH SÁCH FILE CHƯA CONVERT SANG COMPOSITION API\n")
            f.write("="*80 + "\n\n")
            for file_info in sorted_files:
                f.write(f"{file_info['relative_path']}\n")
        
        print(f"\n💾 Đã lưu danh sách vào: {output_file}")


def main():
    # Lấy thư mục hiện tại làm project root
    project_root = os.getcwd()
    
    analyzer = VueFileAnalyzer(project_root)
    analyzer.scan_project()
    analyzer.print_report()


if __name__ == '__main__':
    main()
