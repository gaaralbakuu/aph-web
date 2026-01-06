<template>
  <div class="h-screen flex flex-col items-center" :style="{ 'background-image': 'url(' + background + ')' }">
    <div class="w-[440px] flex-1 flex-col flex justify-between">
      <div></div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="w-full bg-white rounded-lg shadow-lg p-10 flex flex-col gap-8">
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
                    <div>{{ l.username }}</div>
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
                    <div>{{ l.password }}</div>
                  </div>
                  <div class="w-full h-full absolute input-border">
                    <div class="absolute rounded overflow-hidden flex flex-col justify-end items-center" style="inset: -1px">
                      <div class="relative -bottom-[1px] border-b-2 border-solid border-blue-500"></div>
                    </div>
                  </div>
                  <div class="input-eye" @mousedown.prevent @click.stop.prevent="showPwd">
                    <img src="@/assets/eye-close.png" v-show="passwordType === 'password'" :alt="l.password" />
                    <img src="@/assets/eye-open.png" v-show="passwordType === 'text'" :alt="l.password" />
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
                        <div>{{ l.code }}</div>
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
              <div class="login-code" :title="l.captchaRefresh" @click="refreshCaptcha">
                <img v-if="identify.image" :src="identify.image" class="captcha-image" :alt="l.captchaAlt" />
              </div>
            </div>
          </div>
          <div>
            <el-link class="link-forgot" :underline="false" @click="register(2)" type="primary">{{ l.forgetPass }}</el-link>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <el-button :loading="loading" type="primary" round class="button-login" @click.prevent="validateCode">
            {{ l.login }}
          </el-button>
        </div>
        <div class="flex items-center justify-center text-sm">
          <el-link :underline="false" @click="register(1)" type="primary">{{ l.register }}</el-link>
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

<script setup>
import dayjs from 'dayjs'
import { ref, reactive, computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useLocalI18n } from '@/composables/useLocalI18n'

import bg from '@/assets/bg.jpg'
import con from '@/config'

// defineOptions({ name: 'loginIndex' })

const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request } = instance.proxy
const { l, c } = useLocalI18n('loginIndex')

const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  captchaId: '',
})

const loginRules = reactive({
  username: [
    {
      required: true,
      message: l.value?.usernameValidate || 'Vui lòng nhập tên đăng nhập',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: l.value?.passwordValidate || 'Vui lòng nhập mật khẩu',
      trigger: 'blur',
    },
  ],
})

const identify = reactive({
  codeShow: false,
  image: '',
  captchaId: '',
  expiresAt: null,
  maxLength: 6,
})

const passwordType = ref('password')
const loading = ref(false)
const redirect = ref(undefined)
const passwordInput = ref(null)
const loginFormRef = ref(null)

const currentYear = dayjs().year()
const copyright = con.system.copyright
const sysname = con.system.name
const company = ref(con.system.company)
const background = bg

const eyeImage = computed(() => (passwordType.value ? 'eye-close' : 'eye-open'))

const getCompany = () => {
  const pageLoading = ref(false)
  pageLoading.value = true
  $request(instance.proxy.$api.siteInfo)
    .then((r) => {
      company.value = r.datas[0].company
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const showPwd = () => {
  const input = passwordInput.value

  // 🟢 Lưu vị trí con trỏ và scroll trước khi đổi type
  const start = input.selectionStart
  const end = input.selectionEnd
  const scrollLeft = input.scrollLeft

  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }

  // 🟢 Chờ Vue render xong, rồi phục hồi caret
  nextTick(() => {
    input.focus()
    input.setSelectionRange(start, end)
    input.scrollLeft = scrollLeft
  })
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      instance.proxy.$store
        .dispatch('LoginByUsername', loginForm)
        .then(() => {
          loading.value = false
          hideCaptcha()
          loginForm.code = ''
          ElMessage({
            message: l.value?.success || 'Đăng nhập thành công',
            type: 'success',
          })
          router.push({ path: redirect.value || '/' })
        })
        .catch(() => {
          loading.value = false
          ensureCaptcha(true)
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const register = (type) => {
  router.push({ name: 'loginRegister', params: { flag: type } })
}

const hideCaptcha = () => {
  identify.codeShow = false
  identify.image = ''
  identify.captchaId = ''
  identify.expiresAt = null
  loginForm.captchaId = ''
  loginForm.code = ''
}

const isCaptchaExpired = () => {
  if (!identify.expiresAt) {
    return true
  }
  return dayjs().isAfter(dayjs(identify.expiresAt))
}

const ensureCaptcha = async (force = false) => {
  identify.codeShow = true
  const needRefresh = force || !identify.captchaId || !identify.image || isCaptchaExpired()

  if (needRefresh) {
    await refreshCaptcha()
  }
}

const refreshCaptcha = async () => {
  try {
    const res = await $request(instance.proxy.$api.authCaptcha)
    if (res && res.status) {
      identify.image = res.data.image
      identify.captchaId = res.data.id
      identify.expiresAt = res.data.expiresAt
      loginForm.captchaId = res.data.id
      loginForm.code = ''
    }
  } catch (error) {
    ElMessage({
      message: l.value?.captchaLoadFailed || 'Tải captcha thất bại',
      type: 'error',
    })
  }
}

const validateCode = () => {
  if (identify.codeShow && !loginForm.code) {
    ElMessage({
      message: l.value?.codeValidate || 'Vui lòng nhập mã xác thực',
      type: 'error',
    })
    return
  }
  handleLogin()
}

const getCodeLength = async () => {
  try {
    const r = await $request(instance.proxy.$api.param + 'getparametervalue', {
      type: 'AppSettings',
      name: 'verificationCodeLength',
    })
    const length = parseInt(r && r.data && r.data[0] && r.data[0].param_value, 10)
    if (!Number.isNaN(length) && length > 0) {
      identify.maxLength = length
    }
  } catch (error) {
    console.error(error)
  }
}

// Watch route
watch(
  () => route.query,
  (query) => {
    redirect.value = query && query.redirect
  },
  { immediate: true }
)

onMounted(async () => {
  await getCodeLength()
})
</script>

<style>
@reference "@/assets/css/tailwind.css";

.el-form-item--small .el-form-item__error {
  padding-top: 4px;
}

.link-forgot {
  @apply font-semibold;
}
</style>

<style rel="stylesheet/css" scoped>
@reference "@/assets/css/tailwind.css";
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
