<template>
  <el-container style="height: 100%; width: 100%">
    <div class="videoLayout-wrapper">
      <div class="navi">
        <div class="copyright">
          <img src="@/assets/logo.png" />
          <div style="text-align: center">
            <div class="systemName">{{ platformName[lang] }}</div>
            <div class="collageName" v-if="collageList.data">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ selectedCollage.name_label }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in collageList.data" :key="index" :command="item">{{ item.name_label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="menu-wrapper" v-if="menu.length > 0">
          <div v-for="i in menu" :key="i.menu_id">
            <router-link v-show="!i.resource_path.includes('http')" class="menu" :to="i.resource_path">{{ i.name_label }}</router-link>
            <a v-show="i.resource_path.includes('http')" class="menu" :href="i.resource_path" target="_blank">{{ i.name_label }}</a>
          </div>
        </div>
        <div class="menu-wrapper" v-else></div>

        <div class="right-menu">
          <lang-select class="lang-select" />
          <el-dropdown trigger="click" class="avatar-container">
            <div class="avatar-wrapper">
              <img src="@/assets/default_avatar.png" />
              <div>
                <label>{{ user.userId }}</label>
                <div>{{ user.userName }}</div>
              </div>
              <svg-icon icon-class="more" style="transform: scale(2); margin-left: 5px" />
              <!-- <i class="el-icon-more-outline" style="transform: rotate(90deg) scale(2);"></i> -->
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="adminEntryMenu != null">
                <router-link :to="adminEntryMenu.resource_path" style="color: dimgrey">{{ $c.videoAdminHome }}</router-link>
              </el-dropdown-item>
              <el-dropdown-item :divided="adminEntryMenu != null">
                <router-link to="/home/welcome" style="color: dimgrey">{{ $c.videoUserHome }}</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div @click="logout">{{ $c.logOut }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="router-view">
        <router-view></router-view>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import LangSelect from '@/views/layout/components/LangSelect.vue'
import { localSet, localGet } from '@/utils/auth'
export default {
  name: 'videoLayout',
  components: {
    LangSelect,
  },
  data() {
    return {
      adminEntryMenu: null,
      menu: [],
      collageList: {
        form: {
          page: 1,
          pageSize: 15,
        },
        data: [],
      },
      selectedCollage: {
        name_label: '',
      }, // 存储当前选中的学院
      platformName: {
        'vi-VN': 'Học tập trực tuyến E+', // Đã cập nhật giá trị tiếng Việt
        'en-US': 'E + learning',
        'zh-CN': '万邦线上学习平台',
        'zh-TW': '萬邦線上學習平臺',
      },
      lang: localGet('lang'),
    }
  },
  computed: {
    ...mapGetters(['user', 'videoMenu', 'college_id']),
  },
  methods: {
    ...mapMutations(['SET_ISADMIN', 'SET_VIDEOMENU', 'SET_COLLEGE_ID']),
    isAdministrator() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getUserIsManager', {
        userid: '',
      }).then((r) => {
        if (r.data == false) {
        } else {
          this.SET_ISADMIN(r.data.is_super)
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    getCollegeList() {
      this.$request(this.$api.videoServer + '/Video/VideoCollege/getMyCollege', {
        ...this.collageList.form,
        userid: this.user.userId,
      })
        .then((r) => {
          this.collageList.data = r.data.list
          // 初始化时设置第一个学院为默认选中项
          if (this.collageList.data.length > 0) {
            let is_all = this.collageList.data.find((i) => i.is_all == '1')
            if (is_all) {
              this.handleCommand(is_all)
            } else {
              this.handleCommand(this.collageList.data[0])
            }
          }
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },
    handleCommand(command) {
      this.selectedCollage = command
      this.SET_COLLEGE_ID(command.id)
    },

    getMyMenu() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getMyMenu', {
        userid: '',
        college: '',
        is_manager: '',
        is_marge: true,
      }).then((r) => {
        if (r.data.length > 0) {
          this.SET_VIDEOMENU(this.simplifyMenuData(r.data))
          let temp = this.videoMenu.find((i) => {
            return i.resource_path == 'WEB_HOME' && i.resource_type == 'navigator'
          })
          this.$set(this, 'menu', temp.children)
          console.log(temp.children)
          let tempEntry = this.findFirstManagerMenu(this.videoMenu)
          if (tempEntry) {
            this.$set(this, 'adminEntryMenu', tempEntry)
            this.isAdministrator()
          }
        } else {
          this.SET_VIDEOMENU([])
        }
      })
    },

    simplifyMenuData(menuArray) {
      return menuArray.map((item) => this.simplifyMenuItem(item))
    },

    simplifyMenuItem(item) {
      const simplifiedItem = {
        name_label: item.name_label,
        children: Array.isArray(item.children) ? this.simplifyMenuData(item.children) : [], // 如果有子项则递归简化
        menu_id: item.menu_id,
        resource_path: item.resource_path,
        resource_type: item.resource_type,
        menu_seq: item.menu_seq,
        is_show: item.is_show,
        is_valid: item.is_valid,
        is_manager: item.is_manager,
      }

      // 移除值为 undefined 或 null 的属性（可选）
      /* Object.keys(simplifiedItem).forEach(key =>
          (simplifiedItem[key] === undefined || simplifiedItem[key] === null) && delete simplifiedItem[key]); */

      return simplifiedItem
    },

    findFirstManagerMenu(menuItems) {
      for (let item of menuItems) {
        // 检查当前项是否符合要求
        if (item.resource_type === 'menu' && item.is_manager === 'Y') {
          return item
        }
        // 如果当前项有子菜单，则递归查找子菜单
        if (item.children && item.children.length > 0) {
          const foundItem = this.findFirstManagerMenu(item.children)
          if (foundItem) return foundItem
        }
      }
      return null // 如果没有找到符合条件的菜单项
    },

    getPlatformName() {
      this.$request(this.$api.baseUrl + '/Platform/param/getparametervalue', {
        type: 'VideoSystem',
        name: 'platformName',
      }).then((r) => {
        if (r.data.length > 0) {
          this.platformName = JSON.parse(r.data[0].param_value)
        }
      })
    },
  },
  mounted() {
    this.getPlatformName()
    this.getCollegeList()
    if (this.videoMenu.length == 0) {
      //判断是否有菜单,没有向后端请求用户菜单
      this.getMyMenu()
    } else {
      //有菜单生成用户首页顶部导航栏
      let temp = this.videoMenu.find((i) => {
        return i.resource_path == 'home' && i.resource_type == 'navigator'
      })
      if (temp) {
        this.$set(this, 'menu', temp.children)
        //看看是否存在后台管理员的菜单,有的话设置并显示后台管理进口,请求是否为超级管理员
        let tempEntry = this.findFirstManagerMenu(this.videoMenu)
        if (tempEntry) {
          this.$set(this, 'adminEntryMenu', tempEntry)
          this.isAdministrator()
        }
      } else {
        this.getMyMenu()
      }
    }
  },
}
</script>

<style scoped>
@charset "UTF-8";
.videoLayout-wrapper {
  display: block;
  width: 100%;
  height: 100%;
}
.videoLayout-wrapper .navi {
  width: 100%;
  min-width: 1000px;
  height: 100px;
  padding: 0px 1%;
  background-color: white;
  display: flex;
  position: fixed;
  z-index: 99;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.15);
  /* 辅助阴影 */
}
.videoLayout-wrapper .navi .copyright {
  width: max-content;
  min-width: 280px;
  display: flex;
  align-items: center;
  align-self: center;
  margin-right: 20px;
}
.videoLayout-wrapper .navi .copyright img {
  width: 80px;
  height: 80px;
}
.videoLayout-wrapper .navi .copyright .systemName {
  margin-left: 16px;
  font-size: 24px;
  min-width: 8em;
}
.videoLayout-wrapper .navi .copyright .collageName {
  margin-top: 8px;
  font-size: 16px;
  min-width: 8em;
}
.videoLayout-wrapper .navi .menu-wrapper {
  flex: 1;
  display: flex;
  align-self: center;
  font-size: 20px;
  white-space: nowrap;
}
.videoLayout-wrapper .navi .menu-wrapper .menu {
  margin: 0 20px;
  color: #000;
}
.videoLayout-wrapper .navi .menu-wrapper .router-link-active {
  color: #3994d5;
}
.videoLayout-wrapper .navi .right-menu {
  white-space: nowrap;
  width: 20%;
  align-self: center;
  cursor: pointer;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}
.videoLayout-wrapper .navi .right-menu .lang-select {
  margin-right: 20px;
  align-self: center;
}
.videoLayout-wrapper .navi .right-menu .avatar-container .avatar-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.videoLayout-wrapper .navi .right-menu .avatar-container .avatar-wrapper img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.videoLayout-wrapper .router-view {
  width: 100%;
  height: 100%;
  padding-top: 100px;
}
</style>
