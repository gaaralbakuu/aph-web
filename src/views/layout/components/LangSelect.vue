<template>
  <div class="relative group">
    <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
      </svg>
    </div>
    <div class="absolute right-0 transform w-[160px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 pt-3">
      <div class="bg-white text-black rounded-md shadow dark:bg-[#1a1a1a] dark:text-white flex flex-col py-2 font-medium">
        <div class="flex flex-col">
          <div v-for="(v, i) in langOptions" :key="i" @click="handleSetLang(v)" class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer" :class="{ 'bg-gray-100 dark:bg-gray-700': v.param_value === curLang }">
            {{ v.param_condition1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLangOptions } from '@/composables/useLangOptions'
import { localSet, localGet } from '@/utils/auth'

export default {
  setup() {
    const { langOptions } = useLangOptions()
    return { langOptions }
  },
  data() {
    return {
      curLang: localGet('lang'),
    }
  },
  methods: {
    handleSetLang(v) {
      if (v.param_value == this.curLang) return
      this.curLang = v.param_value
      localSet('lang', v.param_value)
      location.reload()
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('delAllCachedViews', this.$route)
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath,
        })
      })
    },
  },
}
</script>

<style scoped>
.size-icon {
  font-size: 20px;
  cursor: pointer;
  fill: currentColor;
}
</style>
