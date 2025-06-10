<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{ $l.createItem }}</el-button>
    <div class="filter-container">
      <el-input style="width: 300px" :placeholder="$l.search" clearable prefix-icon="el-icon-search" class="filter-item" @keyup.enter.native="research" @clear="research" v-model="query.queryString"></el-input>
    </div>
    <el-row :gutter="20">
      <el-col :span="7">
        <z-table :list="list" :tableProps="tableProps" :columns="columns" @row-click="getChildrenTree" @editItem="editItem" @deleteItem="deleteItem"></z-table>
        <z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList"></z-pagination>
      </el-col>
      <el-col :span="12">
        <div style="min-height: 36px">
          <div style="display: inline-block; width: 120px; font-size: 12px; padding-top: 10px" v-if="currentDataId">
            {{ $l.selectedMemnu }}
          </div>
          <el-button type="success" style="float: right" v-if="currentDataId && menuCheckChange" :loading="saveMenuLoading" @click="saveRoleMenu">{{ $l.save }}</el-button>
        </div>
        <div v-if="currentDataId" style="border: #f4f4f4 solid 1px; padding: 10px 0">
          <el-tree :data="treeData" node-key="menu_id" :default-expand-all="false" :show-checkbox="true" ref="tree" :default-checked-keys="menuIds" :expand-on-click-node="false" @check-change="menuCheckChange = true">
            <span class="custom-tree-node" slot-scope="{ data }">
              <span style="font-weight: bold">{{ data.menu_name_label }}&nbsp;&nbsp;[{{ data.resource_type }}]</span>
              <span v-show="showAuth.m_updata">
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_add == 'Y' && data.resource_type != 'MENU'" v-model="data.m_add1" :active-text="$c.m_add" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_del == 'Y' && data.resource_type != 'MENU'" v-model="data.m_del1" :active-text="$c.m_del" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_updata == 'Y' && data.resource_type != 'MENU'" v-model="data.m_updata1" :active-text="$c.m_updata" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_search == 'Y' && data.resource_type != 'MENU'" v-model="data.m_search1" :active-text="$c.m_search" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_import == 'Y' && data.resource_type != 'MENU'" v-model="data.m_import1" :active-text="$c.m_import" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_export == 'Y' && data.resource_type != 'MENU'" v-model="data.m_export1" :active-text="$c.m_export" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_upload == 'Y' && data.resource_type != 'MENU'" v-model="data.m_upload1" :active-text="$c.m_upload" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_audit == 'Y' && data.resource_type != 'MENU'" v-model="data.m_audit1" :active-text="$c.m_audit" active-value="Y" inactive-value="N"></el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_print == 'Y' && data.resource_type != 'MENU'" v-model="data.m_print1" :active-text="$c.m_print" active-value="Y" inactive-value="N"></el-switch>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="5">
        <div style="min-height: 36px" v-if="currentDataId">
          <div class="flex flex-center" style="font-size: 12px; margin-bottom: 10px">
            <span>{{ $l.allocatedAccount }}</span>
            <div class="flex1"></div>
            <el-input style="display: inline-block; width: 120px" suffix-icon="el-icon-search" size="mini" clearable v-model="userQuery.queryString" @change="researchUser"></el-input>
            <el-button class="ml-5" size="mini" type="primary" icon="el-icon-plus" circle plain @click="addUserClick"></el-button>
          </div>
          <!-- <el-button type="success" style="float: right;" v-if="currentDataId && empCheckChange"
            :loading="saveEmpLoading" @click="saveRoleEmp">保存更改
          </el-button> -->
        </div>
        <div v-if="currentDataId">
          <!-- <el-tree :data="treeData2" node-key="userid" :default-expand-all="false" :show-checkbox="true" ref="tree2"
            :default-checked-keys="empIds" :expand-on-click-node="false" @check-change="empCheckChange=true">
            <span class="custom-tree-node" slot-scope="{ data }">
              <span style="font-weight: bold">{{ data.userid }}</span>
              <span>{{ data.name }}</span>
            </span>
          </el-tree> -->
          <z-table :list="userList" :tableProps="userTableProps" :columns="userColumns">
            <template v-slot:operation="v">
              <a href="#" class="text-red" @click.prevent="deleteUserRoleItem(v.row, v.$index)">{{ $c.delete }}</a>
            </template>
          </z-table>
          <z-pagination :small="true" :pagination="userPagination" :total="userTotal" :page.sync="userQuery.page" :limit.sync="userQuery.size" @change="getUserList"></z-pagination>
        </div>
      </el-col>
    </el-row>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit" :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
    <el-dialog :title="$l.batchAddUser" :visible.sync="addUserDialogShow" width="40%">
      <el-form label-width="100px">
        <el-form-item :label="$l.addUserLabel">
          <el-input type="textarea" :placeholder="$l.addUserPlaceholder" v-model="addUsers" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogShow = false">{{ $c.cancel }}</el-button>
        <el-button type="primary" @click="submmitAddUser" :loading="submitAddUserLoading">{{ $c.confirm }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { arrayToObject, dateTools } from '@/utils'
import { _, api, zTable, zPagination, zFormDialog } from '@/views/_common'

const emptyData = {}
export default {
  name: 'adminRole',
  components: { zTable, zFormDialog, zPagination },
  data: function () {
    return {
      api: api.role,
      name: this.$l.title,
      columns: [
        { title: this.$l.role_id, key: 'role_id' },
        { title: this.$l.role_name, key: 'role_name' },
        { title: this.$l.role_desc, key: 'role_desc' },
      ],
      fields: [
        { title: this.$l.role_name, key: 'role_name', required: true },
        { title: this.$l.role_desc, key: 'role_desc', required: true },
        { title: this.$l.role_type, key: 'role_type', required: false },
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
        size: 10,
        page: 1,
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
      data: { ...emptyData },
      editFormVisible: false,
      currentDataId: 0,
      treeData: [],
      // treeData2: [],
      menuData: [],
      empData: [],
      menuIds: [],
      // empIds: [],
      menuCheckChange: false,
      empCheckChange: false,
      userColumns: [
        { title: this.$l.userid, key: 'userid' },
        { title: this.$l.username, key: 'username' },
        { title: this.$l.department, key: 'department_t' },
      ],
      userTableProps: {
        border: true,
        opsColWith: 60,
        highlightCurrentRow: true,
      },
      userQuery: {
        queryString: '',
        size: 10,
        page: 1,
      },
      userPagination: {
        layout: 'prev, pager, next',
      },
      userList: [],
      userTotal: 0,
      addUserDialogShow: false,
      addUsers: '',
      submitAddUserLoading: false,

      showAuth: {
        //用于权限控制，搭配v-show控制界面上的操作按钮是否展示
        m_search: true,
        m_add: true,
        m_del: true,
        m_updata: true,
        m_import: true,
        m_export: true,
        m_upload: true,
        m_audit: true,
        m_print: true,
      },
    }
  },
  methods: {
    getList() {
      this.pageLoading = true
      this.$request(this.api + 'getlist', this.query)
        .then((r) => {
          this.pageLoading = false
          this.list = r.data.list
          this.total = r.datas.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    getOptions() {
      this.$request(this.$api.menu + 'getlist')
        .then((r) => {
          //生成树结构
          var tmp = { 0: { children: [] } }
          r.data.forEach((i) => {
            tmp[i.menu_id] = Object.assign({}, i, { children: [] })
          })
          for (let key in tmp) {
            var parentTmp = tmp[tmp[key].parent_id]
            if (parentTmp) {
              parentTmp.children.push(tmp[key])
            }
          }
          this.menuData = tmp['0'].children
        })
        .catch(() => {})
      // this.$request(this.$api.user + 'getlist', { page: 1, size: 9999 })
      //   .then((r) => {
      //     //生成树结构
      //     var emptree = {}
      //     _.forEach(r.data.list, (i) => {
      //       if (!emptree[i.department]) {
      //         emptree[i.department] = {
      //           userid: i.department,
      //           name: '',
      //           type: 'dept',
      //           children: [],
      //         }
      //       }
      //       emptree[i.department].children.push({
      //         userid: i.userid,
      //         name: i.username,
      //         type: 'emp',
      //       })
      //     })
      //     this.empData = Object.values(emptree)
      //   })
      //   .catch(() => {})
    },
    research() {
      this.query.page = 1
      this.total = 0
      this.list = []
      this.getList()
    },
    createItem() {
      this.data = { ...emptyData }
      this.editFormVisible = true
    },
    editItem(v) {
      this.pageLoading = true
      this.$request(this.api + 'getbyid', { id: v.id })
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
      this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm).then(() => {
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
    },
    getChildrenTree: function (row) {
      this.currentDataId = row ? row.role_id : 0
      this.menuCheckChange = false
      this.empCheckChange = false
      this.menuIds = []
      // this.empIds = []
      this.refreshTree()
    },
    saveRoleMenu: function () {
      this.saveMenuLoading = true
      var nodes = this.$refs.tree.getCheckedNodes()

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

      this.$request(this.api + 'setMenus', { rid: this.currentDataId, menus: arr }, 'post')
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
    // saveRoleEmp: function () {
    //   this.saveEmpLoading = true
    //   var nodes = this.$refs.tree2.getCheckedNodes()
    //   var arr = _.map(
    //     _.filter(nodes, (i) => i.type == 'emp'),
    //     (i) => i.userid
    //   )
    //   this.$request(
    //     this.api + 'setUsers',
    //     { rid: this.currentDataId, users: arr },
    //     'post'
    //   )
    //     .then((r) => {
    //       this.submmitLoading = false
    //       this.$message({
    //         message: '操作成功',
    //         type: 'success',
    //       })
    //       this.saveEmpLoading = false
    //       this.empCheckChange = false
    //       this.refreshTree()
    //     })
    //     .catch(() => {
    //       this.saveEmpLoading = false
    //     })
    // },
    refreshTree: function () {
      this.treeData = []
      if (this.currentDataId) {
        this.pageLoading = true
        this.$request(this.api + 'getMenuAndEmp/' + this.currentDataId)
          .then((r) => {
            this.menuObj = r.data.menuids
            this.treeData = _.cloneDeep(this.menuData)

            this.treeData.forEach((i) => {
              i.children.forEach((x) => {
                this.menuObj.forEach((y) => {
                  if (x.menu_id == y.menu_id) {
                    ;(x.m_search1 = y.m_search), (x.m_add1 = y.m_add), (x.m_del1 = y.m_del), (x.m_updata1 = y.m_updata), (x.m_import1 = y.m_import), (x.m_export1 = y.m_export), (x.m_upload1 = y.m_upload), (x.m_audit1 = y.m_audit), (x.m_print1 = y.m_print)
                  }
                })
              })
            })

            this.menuIds = _.map(r.data.menuids, (i) => i.menu_id)
            // this.empIds = r.data.empids
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
      if (!this.data.role_id) this.data.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
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
      this.addUserDialogShow = true
    },
    submmitAddUser() {
      if (!this.addUsers) return this.$message.error(this.$l.addUserIsEmpty)
      let user_ids = this.addUsers.replace('，', ',').split(',')
      this.submitAddUserLoading = true
      this.$request(
        this.api + 'batchadduser/',
        {
          role_id: this.currentDataId,
          user_ids,
        },
        'post'
      )
        .then((r) => {
          this.$message.success(this.$c.success)
          this.addUserDialogShow = false
          this.submitAddUserLoading = false
          this.addUsers = ''
          this.getUserList()
        })
        .catch(() => {
          this.submitAddUserLoading = false
        })
    },
    deleteUserRoleItem(row) {
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
  },
  created: function () {
    this.getList()
    this.getOptions()
  },
  watch: {
    data: function (val) {},
  },
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>
