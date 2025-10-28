<template>
  <div class="roleManage-container">
    <div class="pageBody">
      <div class="components">
        <el-drawer class="drawer-container" :visible.sync="showObj.role" :wrapperClosable='false' size="60%">
          <div slot='title' class="title">{{$l.addEditRole}}</div>
          <div class="form-container">
            <el-form label-width="120px" size="medium">
              <el-form-item :label="$l.belongCollege">
                <el-select v-model="roleObj.form.college_id" style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_zh"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.roleName">
                <el-input v-model="roleObj.form.role_name"></el-input>
              </el-form-item>
              <el-form-item :label="$l.roleDescription">
                <el-input v-model="roleObj.form.role_desc"></el-input>
              </el-form-item>
              <el-form-item :label="$l.superPermission">
                <el-select v-model="roleObj.form.is_super" style="width: 100%;">
                  <el-option :label="$l.yes" value="Y"></el-option>
                  <el-option :label="$l.no" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.forAllUsers">
                <el-select v-model="roleObj.form.is_all" style="width: 100%;" :disabled='!isAdmin'>
                  <el-option :label="$l.yes" :value="1"></el-option>
                  <el-option :label="$l.no" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="buttonBar">
            <el-button type="primary" @click="submitRole">{{$l.submit}}</el-button>
            <el-button type="danger" @click="showObj.role = false">{{$l.discard}}</el-button>
          </div>
        </el-drawer>
        <chooseUser :visible.sync="showObj.chooseUser" :useridList.sync="userObj.toBeAddedList" @submmit="submmitUser">
        </chooseUser>
      </div>

      <div class="filter-wrapper">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="roleObj.query.college_id" @change="getRoleList" :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_zh"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.name">
            <el-input clearable v-model="roleObj.query.role_name" @keyup.enter.native="getRoleList"
              @clear="getRoleList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.description">
            <el-input clearable v-model="roleObj.query.role_desc" @keyup.enter.native="getRoleList"
              @clear="getRoleList"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getRoleList">{{$l.search}}</el-button>
          </el-form-item>
        </el-form>
        <div> <el-button type="success" @click="addRole">{{$l.createNewRole}}</el-button>
        </div>
      </div>

      <div class="role-wrapper">
        <div class="role-table">
          <el-table :data="roleObj.list" :row-class-name="tableRowClassName" highlight-current-row border
            @row-click="setCurrentID" :max-height="showObj.calculateMaxheight">
            <el-table-column prop="role_id" :label="$l.roleId"></el-table-column>
            <el-table-column prop="role_name" :label="$l.roleName"></el-table-column>
            <el-table-column prop="role_desc" :label="$l.roleDescription"></el-table-column>
            <el-table-column :label="$l.operation">
              <template slot-scope="scope">
                <el-button type="text" @click="modifyRole(scope.row)">{{$l.edit}}</el-button>
                <el-button type="text" class="text-red" @click="deleteRole(scope.row)">{{$l.delete}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="role-tabs">
          <el-tabs type="border-card" style="width: 100%;">
            <el-tab-pane :label="$l.userManagement">
              <div v-show="roleObj.currentId!=''" class="border-card">
                <div class="roleUser-filter" style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                  <div>
                    <el-input v-model="userObj.query.name" clearable style="width: 250px;"></el-input>
                    <el-button type="success" @click="fliterUserlist(userObj.query.name)">{{$c.queryButton}}</el-button>
                  </div>
                  <el-button type="primary" @click="showObj.chooseUser = true">{{$l.addUser}}</el-button>
                </div>
                <el-table :data="userObj.filterList" :row-class-name="tableRowClassName" highlight-current-row border
                  :max-height="showObj.calculateMaxheight">
                  <el-table-column prop="userid" :label="$l.barcode"></el-table-column>
                  <el-table-column prop="name_t" :label="$l.username"></el-table-column>
                  <el-table-column prop="department_t" :label="$l.department"></el-table-column>
                  <el-table-column :label="$l.operation">
                    <template slot-scope="scope">
                      <el-button type="text" class="text-red" @click="deleteUser(scope.row)">{{$l.delete}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-show="roleObj.currentId==''" class="border-card">{{$l.pleaseSelectRole}}</div>
            </el-tab-pane>
            <el-tab-pane :label="$l.menuManagement">
              <div class="roleMenu-filter" style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                <div style="width: 1px;"></div>
                <el-button type="success" @click="submitMenu">{{$l.saveMenu}}</el-button>
              </div>
              <el-tree class="filter-tree" :data="publicCodeObj.menuList" node-key="menu_id" show-checkbox ref="tree">
                <div class="custom-menu-node" slot-scope="{ node, data }">
                  <span>
                    <el-tag style="text-align: center;" effect="dark" size="mini"
                      :type="data.resource_type=='navigator'?'warning':data.resource_type=='catalogue'?'primary':'success'">{{data.resource_type.substr(0,4).toUpperCase()}}</el-tag>
                  </span>
                  <span style="font-weight: 600;">{{ data[`name_${locale.split('-')[0]}`] }}</span>
                  <span v-show="data.resource_path" style="color: #aaa;">{{ data.resource_path }}</span>
                </div>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import chooseUser from '@/views/_common/chooseUser.vue'
  export default {
    name: 'videoAdminRole',
    components: {
      chooseUser
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'role_name'
        },
        publicCodeObj: {
          org_id: [],
          collegeList: [],
          menuList: []
        },
        showObj: {
          role: false,
          chooseUser: false,
          calculateMaxheight: 500
        },
        userObj: {
          query: {
            role_id: '',
            page: 1,
            pageSize: 9999
          },
          filterList: [], //通过关键字过滤的用户列表
          list: [],
          toBeAddedList: []
        },
        roleObj: {
          currentId: '',
          query: {
            id: "",
            college_id: "",
            role_id: "",
            role_name: '',
            role_desc: "",
            is_super: "",
            is_valid: "Y",
            page: 1,
            pageSize: 9999
          },
          form: {
            id: "",
            org_id: "",
            role_id: "",
            college_id: '',
            role_name: '',
            role_desc: "",
            is_super: "",
            is_all: ''
          },
          list: []
        }
      }
    },

    computed: {
      ...mapGetters(['isAdmin']),
      locale() {
        return this.$i18n.locale
      }
    },



    methods: {
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (rowIndex % 2 == 0) {
          return "";
        } else {
          return "warning-row";
        }
      },

      setCurrentID(row) {
        this.roleObj.currentId = row.role_id
        this.userObj.query.role_id = row.role_id
        this.getUserListByRoleID()
        this.getUserMenuByRoleID()
      },

      getFormattedDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const millisecond = String(now.getMilliseconds()).padStart(3, '0');
        return `r${year}${month}${day}${hour}${minute}${second}${millisecond}`;
      },

      addRole() {
        this.roleObj.form = {
          id: "",
          org_id: "", //组织ID
          role_id: this.getFormattedDateTime(), //菜单ID
          role_name: '',
          role_desc: "",
          is_super: "N",
          is_all: 0
        }
        this.showObj.role = true
      },

      modifyRole(data) {
        this.roleObj.form = Object.assign(this.roleObj.form, data)
        this.showObj.role = true
      },

      deleteRole(data) {
        let postData = {
          role_id: data.role_id,
          is_valid: data.is_valid == 'Y' ? 'N' : 'Y'
        }
        this.$confirm(this.$l.confirmDeleteRole.replace('{name}', data.role_name), this.$l.deleteRoleTitle, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(this.$api.videoServer + '/Video/VideoMenu/deleteRole', postData, 'post')
              .then(r => {
                if (r.status) {
                  this.$message({
                    type: 'success',
                    message: this.$l.deleteSuccess,
                  })
                  this.getRoleList()
                }
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.cancelDelete,
            })
          })
      },

      getRoleList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getRoleDescList', this.roleObj.query)
          .then(r => {
            this.roleObj.list = r.data

            if(this.roleObj.list.length == 0){
              this.userObj.list = []
            }
          })
      },

      getPublic_org_id() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
            queryString: {},
            ruleno: '107',
            pageSize: 9999
          })
          .then(r => {
            let list = [];
            r.data.list.forEach(j => {
              list.push({
                label: j.name_label + "(" + j.code_no + ")",
                value: j.code_no
              });
            })
            this.publicCodeObj.org_id = list
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },

      submitRole() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/addOrModifyRoleDesc', this.roleObj.form, 'post')
          .then(r => {
            if (r.status) {
              this.$message({
                type: 'success',
                message: this.$l.submitSuccess
              })
              this.showObj.role = false
              this.getRoleList()
            }
          })
      },

      removeMenuItemByPath(menuItems, targetPath) {
        for (let i = 0; i < menuItems.length; i++) {
          const item = menuItems[i];
          if (item.resource_path === targetPath) {
            menuItems.splice(i, 1);
            return true;
          }
          if (item.children && item.children.length > 0) {
            const removed = this.removeMenuItemByPath(item.children, targetPath);
            if (removed) return true;
          }
        }
        return false;
      },

      submitMenu() {
        let checkedKeys = this.$refs.tree.getCheckedKeys()
        let postData = {
          role_id: this.roleObj.currentId,
          dtos: []
        }
        if (checkedKeys.length > 0) {
          checkedKeys.forEach(i => {
            postData.dtos.push({
              id: "",
              role_id: this.roleObj.currentId,
              menu_id: i,
              role_type: ""
            })
          })
        }
        this.$request(this.$api.videoServer + "/Video/VideoMenu/addOrModifyRoleMenu", postData, 'post')
          .then(r => {
            if (r.status) {
              this.$message({
                type: 'success',
                message: this.$l.saveSuccess
              })
            }
          })
      },

      getCollegeList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            if (r.status == true && r.data.length > 0) {
              this.publicCodeObj.collegeList = r.data
              if (!this.isAdmin) {
                this.roleObj.query.college_id = r.data[0].id
              }
              this.getRoleList()
            }
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      isUserExist(userId) {
        return this.userObj.list.some(i => i.userid == userId)
      },

      submmitUser() {
        if (this.userObj.toBeAddedList.length == 0) {
          this.showObj.chooseUser = false
        } else {
          let postData = []
          this.userObj.toBeAddedList.forEach(i => {
            if (!this.isUserExist(i)) {
              postData.push({
                id: "",
                is_valid: "Y",
                userid: i,
                org_id: "",
                role_id: this.roleObj.currentId
              })
            }
          })
          if (postData.length > 0) {
            this.$request(this.$api.videoServer + '/Video/VideoMenu/addOrModifyUserRole', postData, 'post')
              .then(r => {
                this.showObj.chooseUser = false
                this.getUserListByRoleID()
              })
          } else {
            this.$message({
              type: 'info',
              message: this.$l.targetUserExist,
            })
          }
        }
      },

      getMenuList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getlist', {
            page: 1,
            pageSize: 9999
          })
          .then(r => {
            this.publicCodeObj.menuList = r.data.list
            if (this.isAdmin == false) {
              let targetPath = '/videoAdminLayout/lesson/menuManage'
              if (this.removeMenuItemByPath(this.publicCodeObj.menuList, targetPath)) {
                console.log('菜单项已成功移除');
              } else {
                console.log('未找到指定路径的菜单项');
              }
            }
          })
      },

      getUserListByRoleID() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getRoleUser', this.userObj.query)
          .then(r => {
            this.userObj.list = r.data
            this.userObj.filterList = r.data
          })
      },

      fliterUserlist(text) {
        if (text == '') {
          this.userObj.filterList = this.userObj.list
        } else {
          this.userObj.filterList = this.userObj.list.filter(user => {
            return user.name_t.includes(text)
          })
        }
      },

      getUserMenuByRoleID() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getRoleMenuList', {
            role_id: this.roleObj.currentId,
            page: 1,
            pageSize: 9999
          })
          .then(r => {
            if (r.data.total > 0) {
              let list = r.data.list.filter(i => i.resource_type == 'menu')
              let keys = list.map(i => i.menu_id)
              this.$refs.tree.setCheckedKeys(keys)
            } else {
              this.$refs.tree.setCheckedKeys([])
            }
          })
      },

      deleteUser(i) {
        this.$confirm(this.$l.confirmDeleteUser.replace('{name}', i.name_t), this.$l.deleteUserTitle, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(this.$api.videoServer + '/Video/VideoMenu/deleteUserFromRoleById', {
              id: i.id
            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message: this.$l.cancelDelete,
              })
              this.getUserListByRoleID()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.cancelDelete,
            })
          })
      },

      returnMaxheight() {
        this.showObj.calculateMaxheight = window.innerHeight - 250
      }
    },
    mounted() {
      this.getCollegeList()
      this.getMenuList()
      window.addEventListener('resize', this.returnMaxheight);
      this.$nextTick(() => {
        this.returnMaxheight();
      })
    },


    beforeDestroy() {
      window.removeEventListener('resize', this.returnMaxheight);
    },
  };
</script>

<style lang="scss">
  .roleManage-container {
    width: 100%;
    height: 100%;

    .pageBody {
      width: 100%;
      margin: 0 auto;

      .drawer-container {
        width: 100%;

        //视频上传抽屉样式
        .title {
          padding: 20px 0px;
          font-size: 18px;
          font-weight: 600;
          border-bottom: 1px solid #ccc;
        }

        .form-container {
          width: 100%;
          height: 95%;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;


        }

        .buttonBar {
          width: 100%;
          height: 60px;
          margin: 0 auto;
          padding: 0 15px;
          position: absolute;
          bottom: 0px;
          border-top: 1px solid #ccc;
          float: right;
          display: flex;
          justify-content: end;
          align-items: center;
        }
      }

      .filter-wrapper {
        height: 60px;
        background-color: white;
        // margin-bottom: 20px;
        padding: 15px 10px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e1e1e1;
        // align-items: center;
      }

      .role-wrapper {
        display: flex;

        .role-table {
          width: 40%;
        }

        .role-tabs {
          flex: 1;
        }
      }


    }
  }
</style>
