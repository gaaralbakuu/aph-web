<template>
  <div>
    <div class="bg" :style="{ 'background-image': 'url(' + background + ')' }"></div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <div class="title-container">
          <h1>{{ sysname }}</h1>
          <p>{{ company }}</p>
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :placeholder="$l.username" name="username" type="text"
            auto-complete="on">
            <template slot="suffix">
              <div class="svg-container">
                <svg-icon icon-class="user" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$l.password" name="password"
            auto-complete="on" @keyup.enter.native="validateCode">
            <template slot="suffix">
              <div class="svg-container pointer" @click="showPwd">
                <svg-icon :icon-class="eyeClass" />
              </div>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-show="identify.codeShow">
          <div class="code-wrapper">
            <el-input v-model="loginForm.code" :placeholder="$l.code" name="code" type="text"
              :maxlength="identify.maxLength"></el-input>
            <div class="login-code" :title="$l.captchaRefresh" @click="refreshCaptcha">
              <img v-if="identify.image" :src="identify.image" class="captcha-image" :alt="$l.captchaAlt" />
            </div>
          </div>
        </el-form-item>

        <el-button :loading="loading" type="primary" round style="width: 100%; margin-top: 20px; margin-bottom: 30px"
          @click.native.prevent="validateCode">{{ $l.login }}
        </el-button>
        <div style="text-align:right;margin-bottom:30px">
          <el-link :underline="false"  @click="register(2)" type="primary" style="font-size:12px;float:left">{{$l.forgetPass}}</el-link>
          <!-- <el-link :underline="false" @click="register" type="primary" style="font-size:12px">忘记密码</el-link> -->
          <el-link :underline="false"  @click="register(1)" type="primary" style="font-size:12px;float:right">{{$l.register}}</el-link>
          <div style="clear:both"></div>
        </div>
        <div class="copyright">
          <span>© 2018~{{ currentYear }} {{ copyright }}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import bg from '@/assets/bg.jpg'
import con from '@/config'

export default {
  name: 'loginIndex',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        captchaId: '',
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
      identify: {
        codeShow: false,
        image: '',
        captchaId: '',
        expiresAt: null,
        maxLength: 6,
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
              this.hideCaptcha()
              this.loginForm.code = ''
              this.$message({
                message: this.$l.success,
                type: 'success',
              })
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
              this.ensureCaptcha(true)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register(type) {
      this.$router.push({ name: 'loginRegister',params:{flag:type}})
    },
    hideCaptcha() {
      this.identify.codeShow = false
      this.identify.image = ''
      this.identify.captchaId = ''
      this.identify.expiresAt = null
      this.loginForm.captchaId = ''
      this.loginForm.code = ''
    },
    async ensureCaptcha(force = false) {
      this.identify.codeShow = true
      const needRefresh =
        force ||
        !this.identify.captchaId ||
        !this.identify.image ||
        this.isCaptchaExpired()

      if (needRefresh) {
        await this.refreshCaptcha()
      }
    },
    async refreshCaptcha() {
      try {
        const res = await this.$request(this.$api.authCaptcha)
        if (res && res.status) {
          this.identify.image = res.data.image
          this.identify.captchaId = res.data.id
          this.identify.expiresAt = res.data.expiresAt
          this.loginForm.captchaId = res.data.id
          this.loginForm.code = ''
        }
      } catch (error) {
        this.$message({
          message: this.$l.captchaLoadFailed,
          type: 'error',
        })
      }
    },
    validateCode() {
      if (this.identify.codeShow && !this.loginForm.code) {
        this.$message({
          message: this.$l.code,
          type: 'error',
        })
        return
      }
      this.handleLogin()
    },
    async getCodeLength() {
      try {
        const r = await this.$request(this.$api.param + 'getparametervalue', {
          type: 'AppSettings',
          name: 'verificationCodeLength',
        })
        const length = parseInt(r?.data?.[0]?.param_value, 10)
        if (!Number.isNaN(length) && length > 0) {
          this.identify.maxLength = length
        }
      } catch (error) {
        console.error(error)
      }
    },
    isCaptchaExpired() {
      if (!this.identify.expiresAt) {
        return true
      }
      return dayjs().isAfter(dayjs(this.identify.expiresAt))
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
  async created() {
    await this.getCodeLength()
  },
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

.code-wrapper {
  display: flex;
  align-items: center;
}

.login-code {
  margin-left: 5px;
  cursor: pointer;
  line-height: 0;
}

.captcha-image {
  height: 32px;
  display: block;
}
</style>
