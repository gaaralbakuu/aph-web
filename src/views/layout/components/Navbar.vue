<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="l.navbarScreenfull" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>
                {{ l.navbarDashboard }}
              </el-dropdown-item>
            </router-link>
            <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
              <el-dropdown-item>
                {{$t('navbar.github')}}
              </el-dropdown-item>
            </a> -->
            <el-dropdown-item divided>
              <span @click="passwordFormVisible = true" style="display:block;">{{ l.navbarChangePassword }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{ l.navbarLogOut }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Password Change Dialog -->
    <el-dialog :title="l.navbarChangePassword" v-model="passwordFormVisible" width="30%">
      <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordFormRef" label-width="120px">
        <el-form-item :label="l.navbarOldPassword" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="l.navbarNewPassword" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="l.navbarConfirmPassword" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPasswordForm">{{ l.submit }}</el-button>
          <el-button @click="resetPasswordForm">{{ l.reset }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-menu>
</template>

<script setup>
import { computed, reactive, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { ElMessage } from 'element-plus'

import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import userAvatarImg from '@/assets/user.png'

const store = useStore()
const router = useRouter()
const { proxy } = getCurrentInstance()
const { l } = useLocalI18n()

// Data
const passwordFormVisible = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordFormRef = ref(null)

const sidebar = computed(() => store.getters.sidebar)
const avatar = computed(() => {
  const userAvatar = store.getters.avatar
  if (userAvatar && userAvatar !== '' && userAvatar !== 'null') {
    return userAvatar
  }
  return userAvatarImg
})

// Validators
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(l.value.navbarPasswordValidate))
  } else {
    if (passwordForm.confirmPassword !== '') {
      if (passwordFormRef.value) passwordFormRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(l.value.navbarPasswordAgainValidate))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error(l.value.navbarPasswordNotMatch))
  } else {
    callback()
  }
}

const passwordRules = reactive({
  oldPassword: [{ required: true, trigger: 'blur', message: l.value?.navbarOldPasswordValidate || 'Required' }],
  newPassword: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
})

// Methods
const toggleSideBar = () => {
  store.dispatch('toggleSideBar')
}

const logout = () => {
  store.dispatch('LogOut').then(() => {
    location.reload() // In order to re-instantiate the vue-router object to avoid bugs
  })
}

const submitPasswordForm = () => {
  if (!passwordFormRef.value) return
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      proxy.$request(proxy.$api.adminUser + 'changePassword', passwordForm, 'POST').then(() => {
        ElMessage.success(l.value.success || 'Success')
        passwordFormVisible.value = false
        logout()
      })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const resetPasswordForm = () => {
  if (passwordFormRef.value) passwordFormRef.value.resetFields()
}
</script>

<style rel="stylesheet/scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
}
.hamburger-container {
  line-height: 58px;
  height: 50px;
  float: left;
  padding: 0 10px;
}
.breadcrumb-container {
  float: left;
}
.errLog-container {
  display: inline-block;
  vertical-align: top;
}
.right-menu {
  float: right;
  height: 100%;
}
.right-menu:focus {
  outline: none;
}
.right-menu-item {
  display: inline-block;
  margin: 0 8px;
}
.screenfull {
  height: 20px;
}
.international {
  vertical-align: top;
}
.avatar-container {
  height: 50px;
  margin-right: 30px;
}
.avatar-container .avatar-wrapper {
  cursor: pointer;
  margin-top: 5px;
  position: relative;
}
.avatar-container .avatar-wrapper .user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.avatar-container .avatar-wrapper .el-icon-caret-bottom {
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
</style>
