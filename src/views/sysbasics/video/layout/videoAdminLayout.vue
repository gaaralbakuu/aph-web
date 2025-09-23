<template>
  <el-container style="height: 100%;width: 100%;">
    <div class="videoAdminLayout-wrapper">
      <div class="navi">
        <div class="logo-wrapper">
          <img src="@/assets/logo.png">
        </div>
        <div class="menu-wrapper">
          <div class="menu" v-for="i in navigator" :key="i.to">
            <router-link :class="{'customActive':isPathActive(i.to)}" class="link" :to="i.to">
              {{i.label}}
            </router-link>
          </div>
        </div>
        <el-dropdown trigger="click" class="avatar-container">
          <div class="avatar-wrapper">
            <img src="@/assets/default_avatar.png">
            <div>
              <label>{{user.userId}}</label>
              <div>{{user.userName}}</div>
            </div>
            <svg-icon icon-class="more" style="transform: scale(2);margin-left: 5px;" />
            <!-- <i class="el-icon-more-outline" style="transform: rotate(90deg) scale(2);"></i> -->
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/videoLayout/home" style="color: dimgrey;">{{$c.videoUserHome}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <router-link to="/home/welcome" style="color: dimgrey;">{{$c.apacheHome}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div @click="logout">{{$c.logOut}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </el-container>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "videoAdminLayout",
    data() {
      return {
        navigator: [],
        menuTree: []
      }
    },
    computed: {
      ...mapGetters(['user', 'videoMenu', 'isAdmin']),
    },
    methods: {
      ...mapMutations(['SET_VIDEOMENU', 'SET_ISADMIN']),
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
      },

      generateNavigator(menuArray) {
        return menuArray.reduce((acc, navigator) => {
          if (navigator.resource_type === 'navigator' && !navigator.resource_path.includes('HOME') ) {
            // 查找当前导航下的第一个菜单项(resource_type 为 menu)
            let firstMenuPath = findFirstMenuPath(navigator);
            if (firstMenuPath) {
              acc.push({
                label: navigator.name_label,
                to: firstMenuPath
              });
            }
          }
          return acc;
        }, []);

        function findFirstMenuPath(item) {
          // 如果当前项是菜单，则直接返回其 resource_path
          if (item.resource_type === 'menu') {
            return item.resource_path;
          }

          // 如果有子项，递归查找
          if (item.children && item.children.length > 0) {
            for (let child of item.children) {
              let path = findFirstMenuPath(child);
              if (path) return path; // 找到后立即返回，保证只获取第一个菜单项的路径
            }
          }

          return null;
        }
      },

      isPathActive(path){
        let pathArray = path.split('/')
        let flag = pathArray[0]+'/'+pathArray[1]+'/'+pathArray[2]
        return this.$route.path.startsWith(flag)
      },

      isAdministrator() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getUserIsManager', {
          userid: ''
        }).then(r => {
          if (r.data == false) {} else {
            this.SET_ISADMIN(r.data.is_super)
          }
        })
      },

      getMyMenu() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getMyMenu', {
            userid: "",
            college: "",
            is_manager: "",
            is_marge: true
          })
          .then(r => {
            if (r.data.length > 0) {
              this.menuTree = this.simplifyMenuData(r.data)
              this.navigator = this.generateNavigator(this.menuTree)
              if(!this.isAdmin){
                this.navigator = this.navigator.reverse()
              }
              this.SET_VIDEOMENU(this.menuTree);
            } else {
              this.menuTree = []
              this.navigator = []
              this.SET_VIDEOMENU(this.menuTree);
              this.$router.replace('/404');
            }
          })
      },

      simplifyMenuData(menuArray) {
        return menuArray.map(item => this.simplifyMenuItem(item));
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
          is_valid: item.is_valid
        };

        // 移除值为 undefined 或 null 的属性（可选）
        /* Object.keys(simplifiedItem).forEach(key =>
          (simplifiedItem[key] === undefined || simplifiedItem[key] === null) && delete simplifiedItem[key]); */

        return simplifiedItem;
      },



    },
    mounted() {
      if (this.videoMenu.length == 0) {
        this.getMyMenu()
      } else {
        this.navigator = this.generateNavigator(this.videoMenu)
      }
      if (this.isAdmin === '') {
        this.isAdministrator()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .videoAdminLayout-wrapper {
    width: 100%;
    height: 100%;
    background-color: aliceblue;

    .navi {
      width: 100%;
      min-width: 1200px;
      height: 50px;
      background-color: white;
      border-bottom: 1px solid #e1e1e1;
      display: flex;
      align-items: center;

      .customActive{
        background-color: #409fee;
        color: #fff !important;
      }

      .logo-wrapper {
        width: 15%;
        min-width: 200px;
        height: 100%;
        text-align: center;
        border-right: 1px solid #e1e1e1;
        background-color: white;

        img {
          width: 40px;
          height: 40px;
          margin-top: 5px;
        }
      }

      .menu-wrapper {
        width: 64%;
        height: 100%;
        display: flex;
        align-items: center;
        color: #000;



        .menu {
          display: block;
          width: 120px;
          height: 100%;
          text-align: center;
          // margin: 0px 30px;
          line-height: 50px;

          &:hover {
            background-color: #e1e1e1;
          }

          .link {
            display: block;
            width: 100%;
            min-width: 100px;
            height: 100%;
            color: #000;
          }

          .router-link-active {
            display: block;
            width: 100%;
            min-width: 100px;
            height: 100%;
            background-color: #409fee;
            color: #fff;
          }
        }


      }

      .avatar-container {
        width: 20%;
        // align-self: center;
        cursor: pointer;

        .avatar-wrapper {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          // border-right:1px dotted #3994d5;

          img {
            width: 40px;
            height: 40px;
            // margin-right: 10px;
          }
        }
      }
    }

    .content {
      width: 100%;
      height: calc(100% - 50px);
      display: flex;

      .menu-container {
        width: 15%;
        height: 100%;
        background-color: white;

        .menu-label {
          height: 60px;
          padding: 10px;
          font-size: 28px;
          line-height: 40px;
        }
      }
    }

  }
</style>
