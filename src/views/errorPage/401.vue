<template>
    <div class="app-container">
        <tip-box :content="content" type="danger"></tip-box>
        <el-button icon="arrow-left" class="pan-back-btn" @click="back">返回</el-button>
    </div>
</template>

<script>
import TipBox from '@/components/TipBox'

export default {
  name: 'page401',
  components: { TipBox },
  data () {
    return {
      content: '您可能没有权限查看此页面。如有疑问，请与管理员联系。'
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
