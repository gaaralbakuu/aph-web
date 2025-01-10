<template>
    <div class="app-container">
        <tip-box :content="content" type="danger"></tip-box>
        <el-button icon="arrow-left" class="pan-back-btn" @click="back">返回</el-button>
    </div>
</template>

<script>
import TipBox from '@/components/TipBox'

export default {
  name: 'page404',
  components: { TipBox },
  data () {
    return {
      content: '页面不存在。请检查您输入的网址是否正确，或与管理员联系。'
    }
  },
  methods: {
    back () {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' }).catch(() => {})
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
