<template>
  <div class="flex h-[64px] px-3 items-center justify-between bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <div class="flex gap-3 items-center">
      <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white" @click="toggleScreenfull">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </div>
      <size-select />
      <lang-select />
      <div class="relative group">
        <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div class="absolute right-0 transform w-[240px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 pt-3">
          <div class="bg-white text-black rounded-md shadow dark:bg-[#1a1a1a] dark:text-white flex flex-col py-2 font-medium">
            <div class="flex items-center gap-2 px-5 py-3">
              <div class="rounded-full overflow-hidden w-5 h-5 bg-black text-white flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold">{{ user.userId }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.userName }}</span>
              </div>
            </div>
            <div class="flex flex-col my-1 py-1 border-t border-b border-[#ebebeb] dark:border-gray-600">
              <div @click="navigateTo('/videoAdminLayout/lesson/contentManage')" class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer">{{ $l.adminCourseManage }}</div>
              <div @click="navigateTo('/videoLayout/home')" class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer">{{ $l.viewCourse }}</div>
              <div @click="passwordFormVisible = true" class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer">{{ $l.changePwd }}</div>
            </div>
            <div class="flex flex-col">
              <div @click="logout" class="text-sm hover:bg-gray-100 dark:hover:bg-gray-600 px-5 py-3 cursor-pointer">{{ $l.logout }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CustomDialog :title="$l.changePwd" :visible.sync="passwordFormVisible" :maxWidth="'500px'" :closeOnClickModal="false">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-light text-gray-700 dark:text-gray-300">{{ $l.oldPwd }}</label>
          <el-input type="password" v-model="pass.oldPwd" autocomplete="current-password" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-light text-gray-700 dark:text-gray-300">{{ $l.newPwd1 }}</label>
          <el-input type="password" v-model="pass.newPwd1" autocomplete="new-password" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-light text-gray-700 dark:text-gray-300">{{ $l.newPwd2 }}</label>
          <el-input type="password" v-model="pass.newPwd2" autocomplete="new-password" />
        </div>
        <!--表单-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">{{ $c.cancel }}</el-button>
        <el-button type="primary" @click.native="submitPass()" :loading="loading">
          {{ $c.confirm }}
        </el-button>
      </div>
    </CustomDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import ErrorLog from './ErrorLog'
import Screenfull from './Screenfull'
import SizeSelect from './SizeSelect'
import LangSelect from './LangSelect'
import ThemePicker from './ThemePicker'
import avatar from '@/assets/default_avatar.png'
import myUpload from 'vue-image-crop-upload/upload-2'
import CustomDialog from '../../_common/CustomDialog.vue'
import { getToken } from '@/utils/auth'
import screenfull, { toggle } from 'screenfull'

const token = getToken()

export default {
  name: 'layoutNavbar',
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    myUpload,
    CustomDialog,
  },
  data: function () {
    return {
      default_avatar: avatar,
      pass: {},
      passwordFormVisible: false,
      loading: false,
      avatarEditVisitable: false,
      avatarUrl: this.$api.files + '/single',
      token: token,
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'user', 'device']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    submitPass() {
      if (!this.pass.newPwd1 || !this.pass.newPwd2 || !this.pass.oldPwd) {
        this.$message({ message: this.$l.pwdCheck, type: 'error' })
        return
      }
      if (this.pass.newPwd1 !== this.pass.newPwd2) {
        this.$message({ message: this.$l.pwdNoEqual, type: 'error' })
        return
      }
      this.loading = true
      this.$store
        .dispatch('ChangePass', this.pass)
        .then(() => {
          this.loading = false
          this.$message({
            message: this.$l.pwdSuccess,
            type: 'success',
          })
          this.passwordFormVisible = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    toggleAvatarShow() {
      this.avatarEditVisitable = !this.avatarEditVisitable
    },
    cropUploadSuccess(r) {
      if (r.code === 0) {
        this.$store
          .dispatch('ChangeAvatar', { avatar: r.data.url })
          .then(() => {
            this.$message({ message: '设置头像成功', type: 'success' })
            this.$store.dispatch('GetUserInfo').then().catch()
            this.toggleAvatarShow()
          })
          .catch(() => {
            this.$message({ message: '设置头像失败', type: 'error' })
          })
      } else {
        this.$message({ message: '图片上传失败', type: 'error' })
      }
    },
    cropUploadFail(status) {
      this.$message({ message: '图片上传失败', type: 'error' })
    },
    toggleScreenfull() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'Your browser does not support fullscreen mode',
          type: 'warning',
        })
        return false
      }
      screenfull.toggle()
    },
    navigateTo(path) {
      if (!path) {
        return
      }
      if (this.$route.path === path) {
        return
      }
      this.$router.push({ path }).catch(() => {})
    },
  },
}
</script>
