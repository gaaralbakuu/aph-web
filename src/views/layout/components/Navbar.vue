<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <div class="flex1"></div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item" />
        <el-tooltip :content="$l.screenfull" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="$l.size" effect="dark" placement="bottom">
          <size-select class="international right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="$l.language" effect="dark" placement="bottom">
          <lang-select class="international right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="$l.theme" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatar||default_avatar" class="user-avatar">
          <div class="user-info">
            <label>{{user.userId}}</label>
            <div>{{user.userName}}</div>
          </div>
          <svg-icon class-name="more-icon" icon-class="more" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <div @click="toggleAvatarShow">上传头像</div>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <div @click="passwordFormVisible = true">{{$l.changePwd}}</div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="logout">{{$l.logout}}</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :title="$l.changePwd" :visible.sync="passwordFormVisible">
      <div style="padding-right: 120px;">
        <!--表单-->
        <el-form :model="pass" :hide-required-asterisk="false" label-width="120px">
          <el-form-item :label="$l.oldPwd">
            <el-input type="password" v-model="pass.oldPwd"></el-input>
          </el-form-item>
          <el-form-item :label="$l.newPwd1">
            <el-input type="password" v-model="pass.newPwd1"></el-input>
          </el-form-item>
          <el-form-item :label="$l.newPwd2">
            <el-input type="password" v-model="pass.newPwd2"></el-input>
          </el-form-item>
        </el-form>
        <!--表单-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">{{$c.cancel}}</el-button>
        <el-button type="primary" @click.native="submitPass()" :loading="loading">
          {{$c.confirm}}
        </el-button>
      </div>
    </el-dialog>

    <my-upload field="img" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail"
      v-model="avatarEditVisitable" :width="120" :height="120" :headers="{'TOKEN':token}" :url="avatarUrl"
      img-format="png">
    </my-upload>
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
import { getToken } from '@/utils/auth'

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
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;

  .hamburger-container {
    height: 100%;
    padding: 0 10px;
    line-height: 50px;
  }

  .breadcrumb-container {
    margin-left: 5px;
  }

  .errLog-container {
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    color: #606266;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      border-top: solid 3px transparent;
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-menu-item:hover {
      border-top-color: #409eff;
    }

    .screenfull {
    }

    .theme-switch {
      .el-color-picker__trigger {
        border: 0px !important;
        height: 20px;
        width: 20px;
      }
    }

    .avatar-container {
      width: auto !important;
      padding: 0 5px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: flex-end;
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 5px;
        }

        .user-info {
          font-size: 12px;
          line-height: 1.5;
          margin-left: 10px;
        }

        .more-icon {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
