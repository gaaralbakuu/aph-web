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
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{ l.navbarLogOut }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useLocalI18n } from '@/composables/useLocalI18n'

import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import userAvatarImg from '@/assets/user.png'

const store = useStore()
const router = useRouter()
const { l } = useLocalI18n()

const sidebar = computed(() => store.getters.sidebar)
const avatar = computed(() => {
  const userAvatar = store.getters.avatar
  if (userAvatar && userAvatar !== '' && userAvatar !== 'null') {
    return userAvatar
  }
  return userAvatarImg
})

const toggleSideBar = () => {
  store.dispatch('toggleSideBar')
}

const logout = () => {
  store.dispatch('LogOut').then(() => {
    location.reload() // In order to re-instantiate the vue-router object to avoid bugs
  })
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
