<template>
  <div class="h-screen flex flex-col items-center" :style="{ 'background-image': 'url(' + background + ')' }">
    <div class="w-[440px] flex-1 flex-col flex justify-between">
      <div></div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="w-full bg-white rounded-lg shadow-lg p-10 flex flex-col gap-8">
        <div class="leading-3 text-center">
          <p class="font-black text-2xl text-yellow-500">{{ company }}</p>
          <h1 class="text-lg font-black leading-4 tracking-wide">{{ sysname }}</h1>
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-6">
            <el-form-item prop="username" class="!mb-0">
              <div class="relative h-10 input-virtual">
                <input class="w-full h-full border-none outline-none px-[14px]" placeholder="" v-model="loginForm.username" name="username" type="text" autocomplete="on" @keyup.enter="validateCode" aria-autocomplete="list" />
                <div class="w-full border border-gray-300 border-solid absolute inset-0 rounded pointer-events-none flex items-center">
                  <div class="px-[14px] input-label">
                    <div>{{ $l.username }}</div>
                  </div>
                  <div class="w-full h-full absolute input-border">
                    <div class="absolute rounded overflow-hidden flex flex-col justify-end items-center" style="inset: -1px">
                      <div class="relative -bottom-[1px] border-b-2 border-solid border-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>

            <el-form-item prop="password" class="!mb-0">
              <div class="relative h-10 input-virtual">
                <input class="w-full h-full border-none outline-none px-[14px]" placeholder="" :type="passwordType" v-model="loginForm.password" ref="passwordInput" name="password" autocomplete="on" @keyup.enter="validateCode" />
                <div class="w-full border border-gray-300 border-solid absolute inset-0 rounded pointer-events-none flex items-center">
                  <div class="px-[14px] input-label">
                    <div>{{ $l.password }}</div>
                  </div>
                  <div class="w-full h-full absolute input-border">
                    <div class="absolute rounded overflow-hidden flex flex-col justify-end items-center" style="inset: -1px">
                      <div class="relative -bottom-[1px] border-b-2 border-solid border-blue-500"></div>
                    </div>
                  </div>
                  <div class="input-eye" @mousedown.prevent @click.stop.prevent="showPwd">
                    <img src="@/assets/eye-close.png" v-show="passwordType === 'password'" :alt="$l.password" />
                    <img src="@/assets/eye-open.png" v-show="passwordType === 'text'" :alt="$l.password" />
                  </div>
                </div>
              </div>
            </el-form-item>

            <div class="flex gap-2" v-show="identify.codeShow">
              <el-form-item prop="code" class="!mb-0 flex-1">
                <div class="code-wrapper">
                  <div class="relative h-10 input-virtual flex-1">
                    <input class="w-full h-full border-none outline-none px-[14px]" placeholder="" v-model="loginForm.code" name="code" type="text" :maxlength="identify.maxLength" @keyup.enter="validateCode" />
                    <div class="w-full border border-gray-300 border-solid absolute inset-0 rounded pointer-events-none flex items-center">
                      <div class="px-[14px] input-label">
                        <div>{{ $l.code }}</div>
                      </div>
                      <div class="w-full h-full absolute input-border">
                        <div class="absolute rounded overflow-hidden flex flex-col justify-end items-center" style="inset: -1px">
                          <div class="relative -bottom-[1px] border-b-2 border-solid border-blue-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <div class="login-code" :title="$l.captchaRefresh" @click="refreshCaptcha">
                <img v-if="identify.image" :src="identify.image" class="captcha-image" :alt="$l.captchaAlt" />
              </div>
            </div>
          </div>
          <div>
            <el-link class="link-forgot" :underline="false" @click="register(2)" type="primary">{{ $l.forgetPass }}</el-link>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <el-button :loading="loading" type="primary" round class="button-login" @click.native.prevent="validateCode">
            {{ $l.login }}
          </el-button>
        </div>
        <div class="flex items-center justify-center text-sm">
          <el-link :underline="false" @click="register(1)" type="primary">{{ $l.register }}</el-link>
        </div>
      </el-form>
      <div>
        <div class="text-center text-xs text-gray-500 my-6">
          <span>© 2018~{{ currentYear }} {{ copyright }}</span>
        </div>
      </div>
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
      const input = this.$refs.passwordInput

      // 🟢 Lưu vị trí con trỏ và scroll trước khi đổi type
      const start = input.selectionStart
      const end = input.selectionEnd
      const scrollLeft = input.scrollLeft

      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }

      // 🟢 Chờ Vue render xong, rồi phục hồi caret
      this.$nextTick(() => {
        input.focus()
        input.setSelectionRange(start, end)
        input.scrollLeft = scrollLeft
      })
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
      this.$router.push({ name: 'loginRegister', params: { flag: type } })
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
      const needRefresh = force || !this.identify.captchaId || !this.identify.image || this.isCaptchaExpired()

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
          message: this.$l.codeValidate,
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
        const length = parseInt(r && r.data && r.data[0] && r.data[0].param_value, 10)
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
    eyeImage: function () {
      return this.passwordType ? 'eye-close' : 'eye-open'
    },
  },
  async created() {
    await this.getCodeLength()
  },
}
</script>

<style>
@reference "@/assets/css/main.css";
.el-form-item--small .el-form-item__error {
  padding-top: 4px;
}

.link-forgot {
  @apply font-semibold;
}
</style>

<style rel="stylesheet/css" scoped>
@reference "@/assets/css/main.css";
.login-code {
  /* position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px; */
  /* transform: translateY(-50%); */
  cursor: pointer;
  line-height: 0;
  @apply rounded h-10;
}

.captcha-image {
  height: 100%;
  display: block;
  @apply rounded border border-solid border-gray-400;
}

.input-virtual input:hover + div,
.input-virtual input:focus + div {
  border-color: #c7c7c7;
}

.input-virtual input + div > div.input-eye {
  display: none;
}

.input-virtual input:hover + div > div.input-eye,
.input-virtual input:focus + div > div.input-eye {
  display: block;
  @apply w-4 h-4 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto;
}

.input-virtual input + div > div.input-label > div {
  @apply text-sm relative top-0 left-0;
  color: rgb(112, 112, 112);
  font-size: 14px;
  line-height: 14px;
}

.input-virtual input + div {
  border-bottom-color: rgb(146, 146, 146) !important;
}

.input-virtual input:focus + div > div.input-label > div,
.input-virtual input:not(:placeholder-shown) + div > div.input-label > div {
  @apply -top-5 bg-white px-1 -left-2 transition-all;
  font-size: 10px;
  line-height: 10px;
}

.input-virtual input + div > div.input-border > div > div {
  @apply w-0;
}

.input-virtual input:focus + div > div.input-border > div > div {
  @apply w-full transition-all;
}

input[type='password']::-ms-reveal,
input[type='password']::-ms-clear {
  display: none;
}

.input-virtual input + div > div.input-eye img {
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
}

.button-login {
  @apply w-full h-[38px] text-white rounded transition-colors font-semibold;
  background-color: #0f6cbd;
}

.button-login:hover {
  background-color: #115ea3;
}

.button-login:active {
  background-color: #0c3b5e;
}
</style>
