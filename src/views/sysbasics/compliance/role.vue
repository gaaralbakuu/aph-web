<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row :gutter="7">
      <el-col :span="7">
        <el-button
          v-show="showAuth.m_add"
          class="fr"
          style="margin-right: 20px"
          type="primary"
          @click="createItem"
          >{{ $l.createItem }}
        </el-button>
        <div
          v-show="showAuth.m_search"
          class="filter-container"
          style="margin-right: 20px"
        >
          <el-input
            style="width: 250px"
            :placeholder="$l.search"
            clearable
            prefix-icon="el-icon-search"
            class="filter-item"
            @keyup.enter.native="research"
            @clear="research"
            v-model="query.queryString"
          >
          </el-input>
        </div>
        <div class="roleBox">
          <z-table
            :list="list"
            :tableProps="tableProps"
            :columns="columns"
            @row-click="getChildrenTree"
            @editItem="editItem"
            @deleteItem="deleteItem"
          >
            <template v-slot:operation="v">
              <a
                v-show="showAuth.m_updata"
                href="#"
                class="text-blue"
                @click.prevent="editItem(v.row, v.$index)"
                >{{ $c.edit }}</a
              >&nbsp;
              <a
                v-show="showAuth.m_del"
                href="#"
                class="text-red"
                @click.prevent="deleteItem(v.row, v.$index)"
                >{{ $c.delete }}</a
              >
            </template>
          </z-table>
          <z-pagination
            :pagination="pagination"
            :total="total"
            :page.sync="query.page"
            :limit.sync="query.size"
            @change="getList"
          ></z-pagination>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="userBox">
          <div style="min-height: 36px" v-if="currentDataId">
            <div
              class="flex flex-center"
              style="font-size: 12px; margin-bottom: 10px"
            >
              <span
                ><b>{{ $l.allocatedAccount }}</b></span
              >
              <div class="flex1"></div>
              <el-input
                v-show="showAuth.m_search"
                style="display: inline-block; width: 120px"
                suffix-icon="el-icon-search"
                size="mini"
                clearable
                v-model="userQuery.queryString"
                @change="researchUser"
              >
              </el-input>
              <el-button
                v-show="showAuth.m_add"
                style="margin-right: 20px"
                class="ml-5"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                circle
                plain
                @click="addUserClick"
              >
              </el-button>
            </div>
          </div>
          <div v-if="currentDataId">
            <z-table
              :list="userList"
              :tableProps="userTableProps"
              :columns="userColumns"
            >
              <template v-slot:operation="v">
                <a
                  href="#"
                  class="text-red"
                  v-show="showAuth.m_del"
                  @click.prevent="deleteUserRoleItem(v.row, v.$index)"
                  >{{ $c.delete }}</a
                >
              </template>
            </z-table>
            <z-pagination
              :small="true"
              :pagination="userPagination"
              :total="userTotal"
              :page.sync="userQuery.page"
              :limit.sync="userQuery.size"
              @change="getUserList"
            >
            </z-pagination>
          </div>
        </div>
      </el-col>

      <el-col :span="11">
        <div style="min-height: 36px">
          <div
            style="
              display: inline-block;
              width: 120px;
              font-size: 12px;
              padding-top: 10px;
            "
            v-if="currentDataId"
          >
            <b> {{ $l.selectedMemnu }}</b>
          </div>
          <el-button
            v-show="showAuth.m_updata"
            type="success"
            style="float: right"
            v-if="currentDataId && menuCheckChange"
            :loading="saveMenuLoading"
            @click="saveRoleMenu"
          >
            {{ $l.save }}
          </el-button>
        </div>
        <div
          v-if="currentDataId"
          style="border: #f4f4f4 solid 1px; padding: 10px 0"
        >
          <el-tree
            :data="treeData"
            node-key="menu_id"
            :default-expand-all="false"
            :show-checkbox="true"
            ref="tree"
            :default-checked-keys="menuIds"
            :expand-on-click-node="false"
            @check-change="menuCheckChange = true"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span style="font-weight: bold"
                >{{ data.menu_name_label }}&nbsp;&nbsp;[{{
                  data.resource_type
                }}]
              </span>
              <span v-show="showAuth.m_updata">
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_add == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_add1"
                  :active-text="$c.m_add"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_del == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_del1"
                  :active-text="$c.m_del"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_updata == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_updata1"
                  :active-text="$c.m_updata"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_search == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_search1"
                  :active-text="$c.m_search"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_import == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_import1"
                  :active-text="$c.m_import"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_export == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_export1"
                  :active-text="$c.m_export"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_upload == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_upload1"
                  :active-text="$c.m_upload"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_audit == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_audit1"
                  :active-text="$c.m_audit"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
                <el-switch
                  :width="27"
                  @change="menuCheckChange = true"
                  v-show="data.m_print == 'Y' && data.resource_type != 'MENU'"
                  v-model="data.m_print1"
                  :active-text="$c.m_print"
                  active-value="Y"
                  inactive-value="N"
                >
                </el-switch>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
    </el-row>

    <z-form-dialog
      :name="name"
      :data="data"
      :formProps="formProps"
      :fields="fields"
      @submmit="submmit"
      :submmitLoading="submmitLoading"
      :visible.sync="editFormVisible"
    ></z-form-dialog>
    <!-- <el-dialog :visible.sync="editFormVisible">
        <el-form>
          <el-form-item label="角色名称">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色说明">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色类型">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog> -->
    <chooseUser
      :visible.sync="addUserDialogShow"
      :useridList.sync="addUsers"
      @submmit="submmitAddUser"
    ></chooseUser>
    <!-- <el-dialog :title="$l.batchAddUser" :visible.sync="addUserDialogShow" width="40%">
			<el-form label-width="100px">
				<el-form-item :label="$l.addUserLabel">
					<el-input type="textarea" :placeholder="$l.addUserPlaceholder" v-model="addUsers"
						style="width: 80%">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addUserDialogShow = false">{{$c.cancel}}</el-button>
				<el-button type="primary" @click="submmitAddUser" :loading="submitAddUserLoading">{{$c.confirm}}
				</el-button>
			</span>
		</el-dialog> -->
  </div>
</template>

<script>
import { arrayToObject, dateTools } from '@/utils'
import {
  _,
  api,
  zTable,
  zPagination,
  zFormDialog,
  initFuncs,
} from '@/views/_common'
import chooseUser from '@/views/_common/chooseUser.vue'

const emptyData = {}
export default {
  name: 'adminRole',
  components: {
    zTable,
    zFormDialog,
    zPagination,
    chooseUser,
  },
  data: function () {
    return {
      api: api.role,
      apiMenu: api.menu,
      name: this.$l.title,
      userAuth: null, //保存用户操作权限
      showAuth: {
        //用于权限控制，搭配v-show控制界面上的操作按钮是否展示
        m_search: false,
        m_add: false,
        m_del: false,
        m_updata: false,
        m_import: false,
        m_export: false,
        m_upload: false,
        m_audit: false,
        m_print: false,
      },
      columns: [
        {
          title: this.$l.role_id,
          key: 'role_id',
        },
        {
          title: this.$l.role_name,
          key: 'role_name',
        },
        {
          title: this.$l.role_desc,
          key: 'role_desc',
        },
      ],
      fields: [
        {
          title: this.$l.role_name,
          key: 'role_name',
          required: true,
        },
        {
          title: this.$l.role_desc,
          key: 'role_desc',
          required: true,
        },
      ],
      tableProps: {
        border: true,
        opsColWith: 100,
        highlightCurrentRow: true,
      },
      formProps: {
        dialogWidth: '70%',
        labelWidth: '140px',
      },
      query: {
        params: {},
        size: 15,
        page: 1,
        role_type: 'cis',
      },
      pagination: {
        // 分页组件配置 如不需分页，可以把pagination设置为null
        layout: 'prev, pager, next, jumper, ->, total, sizes',
      },
      pageLoading: false,
      submmitLoading: false,
      saveMenuLoading: false,
      saveEmpLoading: false,
      list: [],
      total: 0,
      data: {
        role_desc: '',
        role_name: '',
        role_type: 'cis',
      },
      editFormVisible: false,
      currentDataId: 0,
      treeData: [],
      menuData: [],
      empData: [],
      menuIds: [],
      menuCheckChange: false,
      empCheckChange: false,
      userColumns: [
        {
          title: this.$l.userid,
          key: 'userid',
        },
        {
          title: this.$l.username,
          key: 'username',
        },
        {
          title: this.$l.department,
          key: 'department_t',
        },
      ],
      userTableProps: {
        border: true,
        opsColWith: 60,
        highlightCurrentRow: true,
      },
      userQuery: {
        queryString: '',
        size: 15,
        page: 1,
        role_type: 'cis',
      },
      userPagination: {
        layout: 'prev, pager, next, jumper, ->, total, sizes',
      },
      userList: [],
      userTotal: 0,
      addUserDialogShow: false,
      addUsers: [],
      submitAddUserLoading: false,
    }
  },
  methods: {
    ...initFuncs,
    getList() {
      if (this.userAuth && this.userAuth.m_search == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.pageLoading = true
      this.$request(this.api + 'getlist', this.query)
        .then((r) => {
          this.pageLoading = false
          this.list = r.data.list
          this.total = r.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    getOptions() {
      if (this.userAuth && this.userAuth.m_search == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.$request(this.$api.menu + 'getcisMenulist')
        .then((r) => {
          //生成树结构
          var tmp = {
            0: {
              children: [],
            },
          }
          r.data.forEach((i) => {
            tmp[i.menu_id] = Object.assign({}, i, {
              children: [],
              m_search1: null,
              m_add1: null,
              m_del1: null,
              m_updata1: null,
              m_import1: null,
              m_export1: null,
              m_upload1: null,
              m_audit1: null,
              m_print1: null,
            })
          })

					console.log(tmp)

          for (let key in tmp) {
            var parentTmp = tmp[tmp[key].parent_id]
            if (parentTmp) {
              parentTmp.children.push(tmp[key])
            }
          }
          this.menuData = tmp['0'].children
        })
        .catch(() => {})
    },

    research() {
      if (this.userAuth.m_search == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.query.page = 1
      this.total = 0
      this.list = []
      this.getList()
    },

    createItem() {
      if (this.userAuth.m_add == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.data = {
        ...emptyData,
      }
      this.editFormVisible = true
    },

    editItem(v) {
      if (this.userAuth.m_updata == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.pageLoading = true
      this.$request(this.api + 'getbyid', {
        id: v.id,
      })
        .then((r) => {
          this.pageLoading = false
          this.data = r.data[0]
          this.editFormVisible = true
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    deleteItem(v) {
      if (this.userAuth.m_del == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm)
        .then(() => {
          this.pageLoading = true
          this.$request(this.api + 'delete/' + v.id, {}, 'post')
            .then((r) => {
              this.pageLoading = false
              this.$message({
                message: this.$c.success,
                type: 'success',
              })
              this.currentDataId = 0
              this.getList()
            })
            .catch(() => {
              this.pageLoading = false
            })
        })
        .catch(() => {
          return
        })
    },

    getChildrenTree: function (row) {
      if (this.userAuth.m_search == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.currentDataId = row ? row.role_id : 0
      this.menuCheckChange = false
      this.empCheckChange = false
      this.menuIds = []
      this.refreshTree()
    },

    saveRoleMenu: function () {
      this.saveMenuLoading = true
      //得到被选择了的菜单节点，然后通过数组map方法得到要上传的数据结构，再上传
      var nodes = this.$refs.tree.getCheckedNodes()

			console.log(nodes)
      // var arr = _.map(nodes, (i) => i.menu_id)
      var arr = _.map(nodes, (i) => {
        return {
          menu_id: i.menu_id,
          m_search: i.m_search1,
          m_add: i.m_add1,
          m_del: i.m_del1,
          m_updata: i.m_updata1,
          m_import: i.m_import1,
          m_export: i.m_export1,
          m_upload: i.m_upload1,
          m_audit: i.m_audit1,
          m_print: i.m_print1,
        }
      })

      // return
      this.$request(
        this.api + 'setMenus',
        {
          rid: this.currentDataId,
          menus: arr,
        },
        'post'
      )
        .then((r) => {
          this.submmitLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.saveMenuLoading = false
          this.menuCheckChange = false
          this.refreshTree()
        })
        .catch(() => {
          this.saveMenuLoading = false
        })
    },

    refreshTree: function () {
      this.treeData = []
      if (this.currentDataId) {
        this.pageLoading = true
        this.$request(this.api + 'getMenuAndEmp/' + this.currentDataId)
          .then((r) => {
            this.menuObj = r.data.menuids
            //将角色权限添（如	x.m_add1 = y.m_add,）加到treeData上
            this.treeData = _.cloneDeep(this.menuData)
						console.log(this.treeData)
            this.treeData.forEach((i) => {
              i.children.forEach((x) => {
                this.menuObj.forEach((y) => {
                  if (x.menu_id == y.menu_id) {
                    ;(x.m_search1 = y.m_search),
                      (x.m_add1 = y.m_add),
                      (x.m_del1 = y.m_del),
                      (x.m_updata1 = y.m_updata),
                      (x.m_import1 = y.m_import),
                      (x.m_export1 = y.m_export),
                      (x.m_upload1 = y.m_upload),
                      (x.m_audit1 = y.m_audit),
                      (x.m_print1 = y.m_print)
                  }
                })
              })
            })
            //菜单树选择勾选需要menuIds
            this.menuIds = _.map(r.data.menuids, (i) => i.menu_id)
            this.pageLoading = false
          })
          .catch(() => {
            this.pageLoading = false
          })
        this.researchUser()
      }
    },

    submmit: function () {
      this.submmitLoading = true
      // let url = this.api + (this.data.id ? 'update' : 'add')
      let url = this.api + 'add'
      if (!this.data.role_id)
        this.data.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
      this.$set(this.data, 'role_type', 'cis')
      this.$request(url, this.data, 'post')
        .then((r) => {
          this.submmitLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.editFormVisible = false
          this.getList()
        })
        .catch(() => {
          this.submmitLoading = false
        })
    },

    researchUser() {
      this.userQuery.page = 1
      this.getUserList()
    },

    getUserList() {
      if (this.userAuth && this.userAuth.m_search == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.$request(this.$api.user + 'getroleuserpage/', {
        ...this.userQuery,
        role_id: this.currentDataId,
      })
        .then((r) => {
          this.userList = r.data.list
          this.userTotal = r.data.total
        })
        .catch(() => {})
    },

    addUserClick() {
      if (this.userAuth.m_add == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.addUserDialogShow = true
    },

    submmitAddUser() {
      if (this.addUsers.length == 0)
        return this.$message.error(this.$l.addUserIsEmpty)
      // let user_ids = this.addUsers.replace('，', ',').split(',')  //原方法是通过切分字符串方法得到数组，现在通过组件直接获取数组
      this.submitAddUserLoading = true
      this.$request(
        this.api + 'batchadduser/',
        {
          role_id: this.currentDataId,
          user_ids: this.addUsers,
        },
        'post'
      )
        .then((r) => {
          this.$message.success(this.$c.success)
          this.addUserDialogShow = false
          this.submitAddUserLoading = false
          this.addUsers = []
          this.getUserList()
        })
        .catch(() => {
          this.submitAddUserLoading = false
        })
    },

    deleteUserRoleItem(row) {
      if (this.userAuth.m_del == 'N') {
        return this.$message({
          message: this.$c.authError,
          type: 'error',
        })
      }
      this.$confirm(this.$l.removeUserFromRole)
        .then((r) => {
          this.$request(
            this.api + 'deleteroleuser/' + row.id,
            {
              id: row.id,
            },
            'post'
          )
            .then((r) => {
              this.$message.success(this.$c.success)
              this.getUserList()
            })
            .catch(() => {})
        })
        .catch((e) => {})
    },

    getUserAuth() {
      this.$request(this.$api.checkMenuAuth, {
        resourcepath: this.$route.name,
      })
        .then((r) => {
          this.userAuth = r.data[0]
        })
        .catch(() => {})
    },
  },
  created: function () {
    this.getList()
    this.getOptions()

		this.getUserAuth()

    // this.userAuth = {
    //   m_add: 'Y',
    //   m_search: 'Y',
    //   m_del: 'Y',
    //   m_updata: 'Y',
    //   m_import: 'Y',
    //   m_export: 'Y',
    //   m_upload: 'Y',
    //   m_audit: 'Y',
    //   m_print: 'Y',
    // }
  },
  watch: {
    userAuth: {
      deep: true,
      handler(newV) {
        this.showAuth.m_add = newV.m_add == 'Y' ? true : false
        this.showAuth.m_search = newV.m_search == 'Y' ? true : false
        this.showAuth.m_del = newV.m_del == 'Y' ? true : false
        this.showAuth.m_updata = newV.m_updata == 'Y' ? true : false
        this.showAuth.m_import = newV.m_import == 'Y' ? true : false
        this.showAuth.m_export = newV.m_export == 'Y' ? true : false
        this.showAuth.m_upload = newV.m_upload == 'Y' ? true : false
        this.showAuth.m_audit = newV.m_audit == 'Y' ? true : false
        this.showAuth.m_print = newV.m_print == 'Y' ? true : false
      },
    },
  },
}
</script>

<style scoped>
/* .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}

.operaSpan {
  opacity: 1;
}

.operaSpan:hover {
  opacity: 1;
}

.topBox {
  display: block;
  width: 100%;
  height: 35px;
} */
</style>
