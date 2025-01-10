<template>
  <el-pagination style="margin-top: 5px;" :small="small" v-if="pagination" :current-page.sync="currentPage"
    :page-size.sync="pageSize" :total="total" v-bind="pagination" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>
</template>

<script>
export default {
  name: 'z-pagination',
  props: {
    pagination: {
      type: Object,
      default: null
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('change', { page: this.currentPage, limit: val })
    },
    handleCurrentChange (val) {
      this.$emit('change', { page: val, limit: this.pageSize })
    }
  }
}
</script>
