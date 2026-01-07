<template>
    <div class="app-container">
        <tip-box :content="l.noPermissionContent" type="danger"></tip-box>
        <el-button icon="arrow-left" class="pan-back-btn" @click="back">{{ c.back}}</el-button>
    </div>
</template>

<script>
import TipBox from '@/components/TipBox/index.vue'

export default {
  name: 'page401',
  components: { TipBox },
  data () {
    return {}
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
