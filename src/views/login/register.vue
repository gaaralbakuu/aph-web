<template>
  <div>
    <div class="bg" :style="{ 'background-image': 'url(' + background + ')' }"></div>
    <div class="login-container">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules">
        <div class="title-container">
          <h1>{{flag==1?l.name:'忘记密码'}}</h1>
          <!-- <p>{{ company }}</p> -->
        </div>
        <el-form-item prop="uid">
          <div class="flex">
            <el-input class="flex1" v-model="registerForm.uid" :placeholder="l.uid" @change="getUserByUid" type="text">
            </el-input>
            <el-button class="ml-5" plain type="success" :loading="getUserLoading" @click="getUserByUid">
              {{c.confirm}}</el-button>
          </div>
        </el-form-item>

        <div v-show="showVcode">
          <div class="flex flex-center" style="margin-bottom:10px;">
            <div>{{ l.phoneRest }}</div>
            <div class="flex1"></div>
            <div>{{ phone }}</div>
            <el-input class="phone-rest" v-model="registerForm.phoneRest" type="text">
            </el-input>
          </div>

          <el-form-item prop="vcode">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-input v-model="registerForm.vcode" :placeholder="l.vcode" type="text">
                </el-input>
              </el-col>
              <el-col :span="14">
                <el-button style="width: 100%" plain type="primary" :loading="sendVerCodeLoading"
                  v-show="!sendVerCodeFlag" @click="sendVerCode">{{l.sendVcode}}</el-button>
                <el-button style="width: 100%" plain type="primary" v-show="sendVerCodeFlag"
                  @click="sendVerCodeFlag = false">{{l.sendVcodeAgain }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <div v-show="showVcode && showPassArea">
          <el-form-item prop="password">
            <el-input :disabled="!showVcode" :type="passwordType" v-model="registerForm.password"
              :placeholder="l.password1" auto-complete="on" @focus="focusFlag1 = true" @blur="focusFlag1 = false">
              <template #suffix>
                <div class="svg-container pointer" @click="showPwd">
                  <SvgIcon :icon-class="eyeClass" />
                </div>
              </template>
            </el-input>
            <!-- <div v-if="focusFlag1">
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{l.passwordValidate1}}
              </div>
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{l.passwordValidate2}}
              </div>
            </div> -->
          </el-form-item>
          <!-- <el-form-item prop="password2">
            <el-input :disabled="!showVcode" @focus="focusFlag2 = true" @blur="focusFlag2 = false" :type="passwordType"
              v-model="registerForm.password2" :placeholder="l.password2" name="password" auto-complete="on">
              <template #suffix>
                <div class="svg-container" @click="showPwd">
                  <SvgIcon :icon-class="eyeClass" />
                </div>
              </template>
            </el-input>
            <div v-if="focusFlag2">
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{l.passwordValidate1}}
              </div>
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{l.passwordValidate2}}
              </div>
            </div>
          </el-form-item> -->
        </div>

        <el-button size="medium" :disabled="!showVcode" :loading="loading" type="primary"
          style="width: 100%; margin-top: 20px; margin-bottom: 30px" @click.prevent="register">{{flag==1?l.register:l.forgetButton}}
        </el-button>
        <div style="text-align:right;margin-bottom:10px">
          <!-- <el-link :underline="false" @click="register" type="primary" style="font-size:12px">忘记密码</el-link> -->
          <el-link :underline="false" @click="goBack" type="primary" style="font-size:12px">{{l.goBack}}</el-link>
        </div>
        <div class="copyright">
          <span>© 2018~{{ currentYear }} {{ copyright }}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, reactive, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useLocalI18n } from '@/composables/useLocalI18n'

import bg from '@/assets/bg.jpg'
import con from '@/config'

// defineOptions({ name: 'loginRegister' })

const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request } = instance.proxy
const { l, c } = useLocalI18n('loginRegister')

const flag = ref('')
const focusFlag1 = ref(false)
const focusFlag2 = ref(false)
const pageLoading = ref(false)
const sendVerCodeFlag = ref(false)
const sendVerCodeLoading = ref(false)
const getUserLoading = ref(false)
const showVcode = ref(false)
const showPassArea = ref(false)
const passwordType = ref('password')
const loading = ref(false)
const redirect = ref(undefined)
const phone = ref('')
const registerFormRef = ref(null)

const registerForm = reactive({
  uid: '',
  password: '',
  phoneRest: '',
  vcode: '',
})

const currentYear = dayjs().year()
const copyright = con.system.copyright
const sysname = con.system.name
const company = ref(con.system.company)
const background = bg
const api = instance.proxy?.$api?.auth || ''

const validatePass1 = (rule, value, callback) => {
  if (!value) {
    callback(new Error(l.value?.passwordValidate3 || 'Mật khẩu không được để trống'))
  } else {
    if (value.length < 6) callback(new Error(l.value?.passwordValidate1 || 'Mật khẩu phải có ít nhất 6 ký tự'))
    if (!/^[\da-z~.!@#$%^&*]+$/i.test(value))
      callback(new Error(l.value?.passwordValidate2 || 'Mật khẩu chứa ký tự không hợp lệ'))
  }
  callback()
}

const registerRules = reactive({
  uid: [
    {
      required: true,
      message: instance.proxy?.$t?.('login')?.usernameValidate || 'Vui lòng nhập tên đăng nhập',
      trigger: 'blur',
    },
  ],
  password: [{ validator: validatePass1, trigger: 'blur' }],
  phoneRest: [
    {
      required: true,
      message: l.value?.phoneRestValidate || 'Vui lòng nhập phần còn lại của số điện thoại',
      trigger: 'blur',
    },
  ],
  vcode: [
    {
      required: true,
      message: l.value?.vcodeValidate || 'Vui lòng nhập mã xác thực',
      trigger: 'blur',
    },
  ],
})

const eyeClass = computed(() => (passwordType.value ? 'eye-close' : 'eye-open'))

const getUserByUid = () => {
  if (!registerForm.uid) return false
  getUserLoading.value = true
  $request(api + 'getUserByUid', { uid: registerForm.uid, flag: flag.value })
    .then((r) => {
      phone.value = r.data.instel
      showVcode.value = true
      getUserLoading.value = false
    })
    .catch(() => {
      getUserLoading.value = false
    })
}

const sendVerCode = () => {
  if (!registerForm.uid || !phone.value || !registerForm.phoneRest) return false
  sendVerCodeLoading.value = true
  $request(api + 'sendVerCode', {
    uid: registerForm.uid,
    flag: flag.value,
    phone: phone.value + registerForm.phoneRest,
  })
    .then((r) => {
      sendVerCodeFlag.value = true
      sendVerCodeLoading.value = false
      showPassArea.value = true
      ElMessage({
        message: l.value?.sendVcodeSuccess || 'Gửi mã xác thực thành công',
        type: 'success',
      })
    })
    .catch(() => {
      sendVerCodeFlag.value = false
      sendVerCodeLoading.value = false
      showPassArea.value = true
    })
}

const getCompany = () => {
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
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
}

const register = () => {
  if (!showVcode.value) {
    ElMessage({
      message: l.value?.uid || 'Vui lòng nhập tên đăng nhập',
      type: 'error',
    })
  }
  registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      $request(api + 'register', { ...registerForm, flag: flag.value }, 'post')
        .then((r) => {
          loading.value = false
          if (r.status) {
            ElMessage({
              message: flag.value == 1 ? l.value?.success : c.value?.success,
              type: 'success',
            })
            setTimeout((v) => {
              router.push({ path: '/login' })
            }, 3000)
          }
        })
        .catch(() => {
          loading.value = false
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const goBack = () => {
  history.back()
}

// Watch route
watch(
  () => route.params,
  (params) => {
    flag.value = params.flag
  },
  { immediate: true }
)

watch(
  () => route.query,
  (query) => {
    redirect.value = query && query.redirect
  },
  { immediate: true }
)

onMounted(() => {
  flag.value = route.params.flag
})
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
  transform: translate(-50%, -50%);
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

.passwordText {
  font-size: 12px;
  line-height: 1.5;
}

.phone-rest {
  margin-left: 3px;
  width: 60px;
}

.phone-rest >>> .el-input__inner {
  font-size: 14px;
  padding: 0 3px;
}
</style>
