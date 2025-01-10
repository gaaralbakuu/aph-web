export let demo = {
  data: function() {
    return {}
  },
  methods: {},
  created() {}
}

export let getLangOptions = {
  data: function() {
    return {
      langOptions: []
    }
  },
  methods: {
    getLangOptions(callback) {
      let url = this.$api.param + 'getbyType'
      this.$request(url, { type: 'AppSettings', name: 'Language' }).then(r => {
        this.langOptions = r.data
        if (callback && typeof callback == 'function') callback(r.data)
      })
    }
  },
  created() {
    this.getLangOptions()
  }
}
