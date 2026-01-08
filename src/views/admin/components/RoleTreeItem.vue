<template>
  <div class="pl-4">
    <div v-for="item in modelValue" :key="item.menu_id">
      <div class="flex items-center space-x-2 py-1">
         <div class="flex items-center">
            <input
               type="checkbox"
               v-model="item.checked"
               @change="handleChange(item)"
               class="mr-2"
            />
            <span class="font-bold text-sm">{{ item.menu_name_label }}</span>
            <span class="text-xs text-muted-foreground ml-2">[{{ item.resource_type }}]</span>
         </div>

         <div v-if="showAuth.m_updata && item.resource_type != 'MENU' && item.checked" class="flex flex-wrap gap-2 ml-4">
            <div v-if="item.m_add == 'Y'" class="flex items-center space-x-1">
               <input type="checkbox" v-model="item.m_add1" true-value="Y" false-value="N" @change="$emit('change')" />
               <span class="text-xs">{{ 'Add' }}</span>
            </div>
            <div v-if="item.m_del == 'Y'" class="flex items-center space-x-1">
               <input type="checkbox" v-model="item.m_del1" true-value="Y" false-value="N" @change="$emit('change')" />
               <span class="text-xs">{{ 'Del' }}</span>
            </div>
            <div v-if="item.m_updata == 'Y'" class="flex items-center space-x-1">
               <input type="checkbox" v-model="item.m_updata1" true-value="Y" false-value="N" @change="$emit('change')" />
               <span class="text-xs">{{ 'Edit' }}</span>
            </div>
            <div v-if="item.m_search == 'Y'" class="flex items-center space-x-1">
               <input type="checkbox" v-model="item.m_search1" true-value="Y" false-value="N" @change="$emit('change')" />
               <span class="text-xs">{{ 'Search' }}</span>
            </div>
            <!-- Add other permissions similarly -->
         </div>
      </div>

      <RoleTreeItem
         v-if="item.children && item.children.length"
         :model-value="item.children"
         :show-auth="showAuth"
         @update:modelValue="val => updateChildren(item, val)"
         @change="$emit('change')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  showAuth: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (item) => {
   // Cascade check logic if needed (e.g. check children)
   if (item.checked) {
      checkAll(item.children, true)
   } else {
      checkAll(item.children, false)
   }
   emit('change')
}

const checkAll = (nodes, checked) => {
   if (!nodes) return
   nodes.forEach(n => {
      n.checked = checked
      checkAll(n.children, checked)
   })
}

const updateChildren = (item, val) => {
   item.children = val
   emit('update:modelValue', props.modelValue)
}
</script>

<script>
export default {
   name: 'RoleTreeItem'
}
</script>
