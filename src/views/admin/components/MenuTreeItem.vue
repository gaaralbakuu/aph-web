<template>
  <draggable
    :list="modelValue"
    item-key="menu_id"
    group="g1"
    class="pl-4 border-l ml-2"
    @change="onChange"
  >
    <template #item="{ element }">
      <div class="mb-2">
        <div class="flex items-center justify-between p-2 rounded hover:bg-muted/50 border mb-1">
          <div class="flex items-center gap-2 overflow-hidden">
            <span
               class="px-2 py-0.5 rounded text-xs text-white"
               :class="{
                  'bg-blue-500': element.resource_type == 'APP',
                  'bg-green-500': element.resource_type == 'WEB',
                  'bg-yellow-500': element.resource_type == 'MENU',
               }"
            >
               {{ element.resource_type }}
            </span>
            <span class="font-medium truncate">{{ element.menu_name_label }}</span>
            <span class="text-sm text-muted-foreground truncate">{{ element.resource_path }}</span>
          </div>
          <div class="flex gap-2 items-center">
             <Button variant="ghost" size="icon" class="h-6 w-6" @click="$emit('toggle', element)" :title="element.enabled == 1 ? 'Enabled' : 'Disabled'">
                <i v-if="element.enabled == 1" class="fa fa-unlock text-blue-600"></i>
                <i v-else class="fa fa-lock text-gray-400"></i>
             </Button>
             <Button variant="ghost" size="icon" class="h-6 w-6" @click="$emit('edit', element)" title="Edit">
                <i class="fa fa-edit text-blue-600"></i>
             </Button>
             <Button variant="ghost" size="icon" class="h-6 w-6" @click="$emit('add', element)" title="Add Sibling">
                <i class="fa fa-hand-o-right text-green-600"></i>
             </Button>
             <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                @click="$emit('addChild', element)"
                title="Add Child"
                :disabled="element.resource_type != 'MENU'"
                :class="{'opacity-50 cursor-not-allowed': element.resource_type != 'MENU'}"
             >
                <i class="fa fa-hand-o-down text-yellow-600"></i>
             </Button>
             <Button variant="ghost" size="icon" class="h-6 w-6" @click="$emit('remove', element)" title="Delete">
                <i class="fa fa-trash text-red-600"></i>
             </Button>
          </div>
        </div>
        <!-- Recursive Children -->
        <MenuTreeItem
          v-if="element.children && element.children.length"
          :model-value="element.children"
          @update:modelValue="val => updateChildren(element, val)"
          @edit="$emit('edit', $event)"
          @add="$emit('add', $event)"
          @addChild="$emit('addChild', $event)"
          @remove="$emit('remove', $event)"
          @change="$emit('change')"
          @toggle="$emit('toggle', $event)"
        />
      </div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'add', 'addChild', 'remove', 'change', 'toggle'])

const onChange = () => {
  emit('change')
}

const updateChildren = (element, newVal) => {
  element.children = newVal
  emit('update:modelValue', props.modelValue) // Trigger update on parent
  emit('change')
}
</script>

<script>
export default {
  name: 'MenuTreeItem'
}
</script>
