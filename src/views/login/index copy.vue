<template>
  <div>
    <div
      class="bg"
      style="
        background: linear-gradient(
          180deg,
          rgba(229, 232, 253, 1) 0%,
          rgba(213, 213, 251, 1) 36%,
          rgba(208, 196, 246, 1) 51%,
          rgba(61, 189, 234, 1) 67%,
          rgba(27, 90, 172, 1) 86%,
          rgba(0, 50, 113, 1) 100%
        );
      "></div>
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form">
        <div class="title-container">
          <h1>{{ sysname }}</h1>
          <p>{{ company }}</p>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$l.username"
            name="username"
            type="text"
            auto-complete="on">
            <template slot="suffix">
              <div class="svg-container">
                <svg-icon icon-class="user" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :type="passwordType"
            v-model="loginForm.password"
            :placeholder="$l.password"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin">
            <template slot="suffix">
              <div class="svg-container pointer" @click="showPwd">
                <svg-icon :icon-class="eyeClass" />
              </div>
            </template>
          </el-input>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          round
          style="width: 100%; margin-top: 20px; margin-bottom: 30px"
          @click.native.prevent="handleLogin">
          {{ $l.login }}
        </el-button>
        <div style="text-align: right; margin-bottom: 30px">
          <el-link
            :underline="false"
            @click="register(2)"
            type="primary"
            style="font-size: 12px; float: left">
            {{ $l.forgetPass }}
          </el-link>
          <!-- <el-link :underline="false" @click="register" type="primary" style="font-size:12px">忘记密码</el-link> -->
          <el-link
            :underline="false"
            @click="register(1)"
            type="primary"
            style="font-size: 12px; float: right">
            {{ $l.register }}
          </el-link>
          <div style="clear: both"></div>
        </div>
        <div class="copyright">
          <span>© 2018~{{ currentYear }} {{ copyright }}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import con from '@/config'
import bg from '@/assets/bg.jpg'
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
      background: bg,
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
  -webkit-filter: blur(2px);
  -moz-filter: blur(2px);
  -o-filter: blur(2px);
  -ms-filter: blur(2px);
  filter: blur(2px);
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
