export default {
  data: function() {
    return {
      $l: {},
      $c: {}
    }
  },
  beforeCreate() {
    if (this.$options.name) {
      this.$l = this.$t(this.$options.name)
      this.$c = this.$t('common')
    }
  }
}
