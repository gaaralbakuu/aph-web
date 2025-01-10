<template>
  <div>
    <div class="bg" :style="{ 'background-image': 'url(' + background + ')' }"></div>
    <div class="login-container">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
        <div class="title-container">
          <h1>{{flag==1?$l.name:'忘记密码'}}</h1>
          <!-- <p>{{ company }}</p> -->
        </div>
        <el-form-item prop="uid">
          <div class="flex">
            <el-input class="flex1" v-model="registerForm.uid" :placeholder="$l.uid" @change="getUserByUid" type="text">
            </el-input>
            <el-button class="ml-5" plain type="success" :loading="getUserLoading" @click="getUserByUid">
              {{$c.confirm}}</el-button>
          </div>
        </el-form-item>

        <div v-show="showVcode">
          <div class="flex flex-center" style="margin-bottom:10px;">
            <div>{{ $l.phoneRest }}</div>
            <div class="flex1"></div>
            <div>{{ phone }}</div>
            <el-input class="phone-rest" v-model="registerForm.phoneRest" type="text">
            </el-input>
          </div>

          <el-form-item prop="vcode">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-input v-model="registerForm.vcode" :placeholder="$l.vcode" type="text">
                </el-input>
              </el-col>
              <el-col :span="14">
                <el-button style="width: 100%" plain type="primary" :loading="sendVerCodeLoading"
                  v-show="!sendVerCodeFlag" @click="sendVerCode">{{$l.sendVcode}}</el-button>
                <el-button style="width: 100%" plain type="primary" v-show="sendVerCodeFlag"
                  @click="sendVerCodeFlag = false">{{$l.sendVcodeAgain }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <div v-show="showVcode && showPassArea">
          <el-form-item prop="password">
            <el-input :disabled="!showVcode" :type="passwordType" v-model="registerForm.password"
              :placeholder="$l.password1" auto-complete="on" @focus="focusFlag1 = true" @blur="focusFlag1 = false">
              <template slot="suffix">
                <div class="svg-container pointer" @click="showPwd">
                  <svg-icon :icon-class="eyeClass" />
                </div>
              </template>
            </el-input>
            <!-- <div v-if="focusFlag1">
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{$l.passwordValidate1}}
              </div>
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{$l.passwordValidate2}}
              </div>
            </div> -->
          </el-form-item>
          <!-- <el-form-item prop="password2">
            <el-input :disabled="!showVcode" @focus="focusFlag2 = true" @blur="focusFlag2 = false" :type="passwordType"
              v-model="registerForm.password2" :placeholder="$l.password2" name="password" auto-complete="on">
              <template slot="suffix">
                <div class="svg-container" @click="showPwd">
                  <svg-icon :icon-class="eyeClass" />
                </div>
              </template>
            </el-input>
            <div v-if="focusFlag2">
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{$l.passwordValidate1}}
              </div>
              <div class="passwordText">
                <i class="el-icon-warning" style="color: #e6a23c"></i>{{$l.passwordValidate2}}
              </div>
            </div>
          </el-form-item> -->
        </div>

        <el-button size="medium" :disabled="!showVcode" :loading="loading" type="primary"
          style="width: 100%; margin-top: 20px; margin-bottom: 30px" @click.prevent="register">{{flag==1?$l.register:$l.forgetButton}}
        </el-button>
        <div style="text-align:right;margin-bottom:10px">
          <!-- <el-link :underline="false" @click="register" type="primary" style="font-size:12px">忘记密码</el-link> -->
          <el-link :underline="false" @click="goBack" type="primary" style="font-size:12px">{{$l.goBack}}</el-link>
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
  name: 'loginRegister',
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$l.passwordValidate3))
      } else {
        if (value.length < 6) callback(new Error(this.$l.passwordValidate1))
        if (!/^[\da-z~.!@#$%^&*]+$/i.test(value))
          callback(new Error(this.$l.passwordValidate2))
      }
      callback()
    }
    // var validatePass2 = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error(this.$l.passwordValidate3))
    //   } else {
    //     if (value != this.registerForm.password1) {
    //       callback(new Error(this.$l.passwordValidate4))
    //     }
    //   }
    //   callback()
    // }
    return {
      flag:'',
      focusFlag1: false,
      focusFlag2: false,
      pageLoading: false,
      sendVerCodeFlag: false,
      sendVerCodeLoading: false,
      getUserLoading: false,
      api: this.$api.auth,
      showVcode: false,
      showPassArea: false,
      registerForm: {
        uid: '',
        password: '',
        //password2: '',
        phoneRest: '',
        vcode: '',
      },
      phone: '',
      registerRules: {
        uid: [
          {
            required: true,
            message: this.$t('login').usernameValidate,
            trigger: 'blur',
          },
        ],
        password: [{ validator: validatePass1, trigger: 'blur' }],
        // password2: [{ validator: validatePass2, trigger: 'blur' }],
        phoneRest: [
          {
            required: true,
            message: this.$l.phoneRestValidate,
            trigger: 'blur',
          },
        ],
        vcode: [
          {
            required: true,
            message: this.$l.vcodeValidate,
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
    getUserByUid() {
      if (!this.registerForm.uid) return false
      this.getUserLoading = true
      this.$request(this.api + 'getUserByUid', { uid: this.registerForm.uid,flag: this.flag })
        .then((r) => {
          this.phone = r.data.instel
          this.showVcode = true
          this.getUserLoading = false
        })
        .catch(() => {
          this.getUserLoading = false
        })
    },

    sendVerCode() {
      if (!this.registerForm.uid || !this.phone || !this.registerForm.phoneRest)
        return false
      this.sendVerCodeLoading = true
      this.$request(this.api + 'sendVerCode', {
        uid: this.registerForm.uid,
        flag: this.flag,
        phone: this.phone + this.registerForm.phoneRest,
      })
        .then((r) => {
          this.sendVerCodeFlag = true
          this.sendVerCodeLoading = false
          this.showPassArea = true
          this.$message({
                  message: this.$l.sendVcodeSuccess,
                  type: 'success',
                })
        })
        .catch(() => {
          this.sendVerCodeFlag = false
          this.sendVerCodeLoading = false
          this.showPassArea = true
        })
    },

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
    register() {
      if (!this.showVcode) {
        this.$message({
          message: this.$l.uid,
          type: 'error',
        })
      }
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          //this.registerForm.password2 = this.registerForm.password1
          this.$request(this.api + 'register', {...this.registerForm,flag: this.flag}, 'post')
            .then((r) => {
              this.loading = false
              if (r.status) {
                this.$message({
                  message:this.flag==1? this.$l.success:this.$c.success,
                  type: 'success',
                })
                setTimeout((v) => {
                  this.$router.push({ path: '/login' })
                }, 3000)
              }
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
    goBack(){
      history.back()
    }
  },
  computed: {
    loginLang() {
      return this.$t('login')
    },
    eyeClass: function () {
      return this.passwordType ? 'eye-close' : 'eye-open'
    },
  },
  created: function () {
    this.flag = this.$route.params.flag
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
