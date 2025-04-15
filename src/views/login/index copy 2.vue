<template>
  <div style="height: 100%; width: 100%; overflow: hidden; position: relative; display: flex">
    <div class="bg" style="background: linear-gradient(180deg, rgba(229, 232, 253, 1) 0%, rgba(213, 213, 251, 1) 36%, rgba(208, 196, 246, 1) 51%, rgba(61, 189, 234, 1) 67%, rgba(27, 90, 172, 1) 86%, rgba(0, 50, 113, 1) 100%); z-index: -1;"></div>
    <div style="flex: 1; padding: 60px; display: flex; flex-direction: column;">
      <div>
        <img :src="logo" style="width: 80px; height: 80px;" />
      </div>
      <div style="flex: 1; display: flex; justify-content: space-between;">
        <div></div>
        <div>asd</div>
      </div>
    </div>
  </div>
</template>

<script>
import con from '@/config'
import apache from '@/assets/apache.png'
import dayjs from 'dayjs'

export default {
  name: 'loginIndex',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            message: this.$l.usernameValidate,
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$l.passwordValidate,
            trigger: 'blur',
          },
        ],
      },
      logo: apache,
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      currentYear: dayjs().year(),
      copyright: con.system.copyright,
      sysname: con.system.name,
      company: con.system.company,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    getCompany() {
      this.pageLoading = true
      this.$request(this.$api.siteInfo)
        .then((r) => {
          this.company = r.datas[0].company
          this.description = r.datas[0].system
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              this.$message({
                message: this.$l.success,
                type: 'success',
              })
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register(type) {
      this.$router.push({ name: 'loginRegister', params: { flag: type } })
    },
  },
  computed: {
    loginLang() {
      return this.$t('login')
    },
    eyeClass: function () {
      return this.passwordType ? 'eye-close' : 'eye-open'
    },
  },
  created: function () {},
}
</script>

<style rel="stylesheet/css" scoped lang="css">
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-position: center;
  background-color: #f7f7f7;
  background-size: cover;
  background-attachment: fixed;
}

.login-container {
  background: #ffffff;
  width: 400px;
  min-height: 360px;
  padding: 20px 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -180px;
}

.svg-container {
  width: 25px;
}

.title-container {
  text-align: center;
}

.copyright {
  font-size: 12px;
  color: darkgrey;
  text-align: center;
}
</style>
