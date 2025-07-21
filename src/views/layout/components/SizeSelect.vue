<template>
  <div class="relative group">
    <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="M21 14h-5" />
        <path d="M16 16v-3.5a2.5 2.5 0 0 1 5 0V16" />
        <path d="M4.5 13h6" />
        <path d="m3 16 4.5-9 4.5 9" />
      </svg>
    </div>
    <div class="absolute right-0 transform w-[160px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 pt-3">
      <div class="bg-white text-black rounded-md shadow dark:bg-[#1a1a1a] dark:text-white flex flex-col py-2 font-medium">
        <div class="flex flex-col">
          <div class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer" :class="{ 'bg-gray-100 dark:bg-gray-700': size === 'medium' }" @click="handleSetSize('medium')">
            {{ $l.loose }}
          </div>
          <div class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer" :class="{ 'bg-gray-100 dark:bg-gray-700': size === 'small' }" @click="handleSetSize('small')">
            {{ $l.moderate }}
          </div>
          <div class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer" :class="{ 'bg-gray-100 dark:bg-gray-700': size === 'mini' }" @click="handleSetSize('mini')">
            {{ $l.compact }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SizeSelect',
  computed: {
    size() {
      return this.$store.getters.size
    },
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('setSize', size)
      this.refreshView()
      this.$message({
        message: this.$l.switchSuccess,
        type: 'success',
      })
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
    mounted() {
      console.log('asdddddddddddddddddddd', this.$l)
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
