<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Demo Dialog Stack System</h2>
    
    <div class="space-y-4">
      <button 
        @click="openDialog1" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Mở Dialog 1
      </button>
      
      <div class="text-sm text-gray-600">
        <p>• Có thể mở nhiều dialog cùng lúc</p>
        <p>• Nhấn ESC để đóng dialog theo thứ tự LIFO (Last In, First Out)</p>
        <p>• Click overlay chỉ đóng dialog ở top</p>
        <p>• Z-index tự động được quản lý</p>
      </div>
    </div>

    <!-- Dialog 1 -->
    <CustomDialog
      :visible.sync="dialog1Visible"
      title="Dialog 1"
      width="600px"
      dialog-id="demo-dialog-1"
    >
      <template #content>
        <div class="space-y-4">
          <p>Đây là Dialog 1</p>
          <button 
            @click="openDialog2" 
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Mở Dialog 2 từ Dialog 1
          </button>
        </div>
      </template>
      <template #footer>
        <button 
          @click="dialog1Visible = false" 
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Đóng Dialog 1
        </button>
      </template>
    </CustomDialog>

    <!-- Dialog 2 -->
    <CustomDialog
      :visible.sync="dialog2Visible"
      title="Dialog 2"
      width="500px"
      dialog-id="demo-dialog-2"
    >
      <template #content>
        <div class="space-y-4">
          <p>Đây là Dialog 2 (mở từ Dialog 1)</p>
          <button 
            @click="openDialog3" 
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Mở Dialog 3 từ Dialog 2
          </button>
        </div>
      </template>
      <template #footer>
        <button 
          @click="dialog2Visible = false" 
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Đóng Dialog 2
        </button>
      </template>
    </CustomDialog>

    <!-- Dialog 3 -->
    <CustomDialog
      :visible.sync="dialog3Visible"
      title="Dialog 3"
      width="400px"
      dialog-id="demo-dialog-3"
    >
      <template #content>
        <div class="space-y-4">
          <p>Đây là Dialog 3 (mở từ Dialog 2)</p>
          <p class="text-sm text-gray-600">Nhấn ESC để đóng theo thứ tự: Dialog 3 → Dialog 2 → Dialog 1</p>
        </div>
      </template>
      <template #footer>
        <button 
          @click="dialog3Visible = false" 
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Đóng Dialog 3
        </button>
      </template>
    </CustomDialog>

    <!-- Dialog Stack Info -->
    <div class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h3 class="font-semibold mb-2">Dialog Stack Info:</h3>
      <p>Số dialog đang mở: {{ dialogCount }}</p>
      <p v-if="topDialog">Dialog ở top: {{ topDialog.id }}</p>
      <div v-if="dialogStack.length > 0" class="mt-2">
        <p class="font-medium">Stack order (top → bottom):</p>
        <ul class="list-disc list-inside">
          <li v-for="dialog in [...dialogStack].reverse()" :key="dialog.id" class="text-sm">
            {{ dialog.id }} (z-index: {{ dialog.zIndex }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import CustomDialog from '@/views/_common/CustomDialog.vue'

export default {
  name: 'DialogStackDemo',
  components: {
    CustomDialog,
  },
  data() {
    return {
      dialog1Visible: false,
      dialog2Visible: false,
      dialog3Visible: false,
    }
  },
  computed: {
    ...mapGetters('dialogStack', ['dialogStack', 'topDialog', 'dialogCount']),
  },
  methods: {
    openDialog1() {
      this.dialog1Visible = true
    },
    openDialog2() {
      this.dialog2Visible = true
    },
    openDialog3() {
      this.dialog3Visible = true
    },
  },
}
</script>
