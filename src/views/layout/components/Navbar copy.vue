<template>
  <div class="navbar">
    <Hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <Breadcrumb class="breadcrumb-container" />
    <div class="flex1"></div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <ErrorLog class="errLog-container right-menu-item" />
        <el-tooltip :content="l.screenfull" effect="dark" placement="bottom">
          <Screenfull class="screenfull right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="l.size" effect="dark" placement="bottom">
          <SizeSelect class="international right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="l.language" effect="dark" placement="bottom">
          <LangSelect class="international right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="l.theme" effect="dark" placement="bottom">
          <ThemePicker class="theme-switch right-menu-item" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatar||default_avatar" class="user-avatar">
          <div class="user-info">
            <label>{{user.userId}}</label>
            <div>{{user.userName}}</div>
          </div>
          <SvgIcon class-name="more-icon" icon-class="more" />
        </div>
        <template #dropdown><el-dropdown-menu>
          <!-- <el-dropdown-item>
            <div @click="toggleAvatarShow">上传头像</div>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <div @click="passwordFormVisible = true">{{ l.changePwd}}</div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="logout">{{ l.logout}}</div>
          </el-dropdown-item>
        </el-dropdown-menu></template>
      </el-dropdown>
    </div>

    <el-dialog :title="l.changePwd" v-model:visible="passwordFormVisible">
      <div style="padding-right: 120px;">
        <!--表单-->
        <el-form :model="pass" :hide-required-asterisk="false" label-width="120px">
          <el-form-item :label="l.oldPwd">
            <el-input type="password" v-model="pass.oldPwd"></el-input>
          </el-form-item>
          <el-form-item :label="l.newPwd1">
            <el-input type="password" v-model="pass.newPwd1"></el-input>
          </el-form-item>
          <el-form-item :label="l.newPwd2">
            <el-input type="password" v-model="pass.newPwd2"></el-input>
          </el-form-item>
        </el-form>
        <!--表单-->
      </div>
      <template #footer><div class="dialog-footer">
        <el-button @click="passwordFormVisible = false">{{ c.cancel}}</el-button>
        <el-button type="primary" @click="submitPass()" :loading="loading">
          {{ c.confirm}}
        </el-button>
      </div></template>
    </el-dialog>

    <my-upload field="img" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail"
      v-model="avatarEditVisitable" :width="120" :height="120" :headers="{'TOKEN':token}" :url="avatarUrl"
      img-format="png">
    </my-upload>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload/upload-2'
import { mapGetters } from 'vuex'

import avatar from '@/assets/default_avatar.png'
import { getToken } from '@/utils/auth'

import Breadcrumb from './Breadcrumb.vue'
import ErrorLog from './ErrorLog.vue'
import Hamburger from './Hamburger.vue'
import LangSelect from './LangSelect.vue'
import Screenfull from './Screenfull.vue'
import SizeSelect from './SizeSelect.vue'
import ThemePicker from './ThemePicker.vue'

const token = getToken()

export default {
  name:'layoutNavbar',
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    myUpload,
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
        this.$message({ message: this.l.pwdCheck, type: 'error' })
        return
      }
      if (this.pass.newPwd1 !== this.pass.newPwd2) {
        this.$message({ message: this.l.pwdNoEqual, type: 'error' })
        return
      }
      this.loading = true
      this.$store
        .dispatch('ChangePass', this.pass)
        .then(() => {
          this.loading = false
          this.$message({
            message: this.l.pwdSuccess,
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
  },
}
</script>

<style rel="stylesheet/scss" scoped>
.navbar {
  height: 50px;
  display: flex;
}
.navbar .hamburger-container {
  height: 100%;
  padding: 0 10px;
  line-height: 50px;
}
.navbar .breadcrumb-container {
  margin-left: 5px;
}
.navbar .right-menu {
  float: right;
  height: 100%;
  display: flex;
  color: #606266;
}
.navbar .right-menu:focus {
  outline: none;
}
.navbar .right-menu .right-menu-item {
  border-top: solid 3px transparent;
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar .right-menu .right-menu-item:hover {
  border-top-color: #409eff;
}
.navbar .right-menu .theme-switch .el-color-picker__trigger {
  border: 0px !important;
  height: 20px;
  width: 20px;
}
.navbar .right-menu .avatar-container {
  width: auto !important;
  padding: 0 5px;
}
.navbar .right-menu .avatar-container .avatar-wrapper {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: flex-end;
}
.navbar .right-menu .avatar-container .avatar-wrapper .user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 5px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .user-info {
  font-size: 12px;
  line-height: 1.5;
  margin-left: 10px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .more-icon {
  font-size: 20px;
}
</style>
