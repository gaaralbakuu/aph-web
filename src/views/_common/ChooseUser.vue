<template>
  <div>
    <el-dialog
      :title="$l.title"
      :visible.sync="dialogShow"
      width="60%"
      @opened="initData">
      <el-row :gutter="10">
        <!-- <el-col :span="7">
          <el-scrollbar style="height: 550px">
            <el-tree
              :data="department.treeData"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false">
              <div class="custom-tree-node" slot-scope="{ data }">
                <div
                  style="flex: 1; overflow: hidden"
                  @click="getUserByDept(data)">
                  <span
                    class="label"
                    :class="{
                      'bg-green': data.up_dept_no != null,
                      'bg-yellow': data.up_dept_no == null,
                    }">
                    {{ data.up_dept_no == null ? $l.mainDept : $l.levelDept }}
                  </span>
                  <span style="margin-left: 10px" class="text-bold">
                    {{ data.dept_name_label }}
                  </span>
                  <span
                    class="fr"
                    style="
                      margin-left: 10px;
                      font-weight: normal;
                      color: #999999;
                    ">
                    {{ data.dept_no }}
                  </span>
                </div>
              </div>
            </el-tree>
          </el-scrollbar>
        </el-col> -->

        <el-col :span="14">
          <div style="display: flex; flex-direction: column; gap: 4px">
            <div style="font-weight: bold">{{ $l.userList }}</div>
            <div
              style="display: flex; justify-content: space-between; gap: 4px">
              <el-input
                :placeholder="$c.queryPlaceholder"
                v-model="userTable.query.queryString"
                @keyup.enter.native="getUser"
                style="width: 350px"
                clearable>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getUser"></el-button>
              </el-input>
            </div>
          </div>
          <z-table
            :list="userTable.userList"
            :columns="userTable.columns"
            :tableProps="userTable.tableProps">
            <template #operation="{row}">
              <el-button @click="addUser(row)" type="text" size="small">{{ $l.add || 'Add' }}</el-button>
            </template>
          </z-table>
          <z-pagination
            :pagination="userTable.pagination"
            :total="userTable.total"
            :page.sync="userTable.query.page"
            :limit.sync="userTable.query.size"
            @change="getUser(null)"></z-pagination>
        </el-col>

        <el-col :span="10">
          <div style="display: flex; flex-direction: column; gap: 4px">
            <div style="font-weight: bold">{{ $l.selectedList }}</div>
            <div style="display: flex; justify-content: space-between; gap: 4px;">
              <el-input
                :placeholder="$c.queryPlaceholder"
                v-model="selectedObj.queryString"
                @keyup.enter.native="filterUser"
                style="width: 450px"
                clearable
                @clear="reGetList">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="filterUser"></el-button>
              </el-input>
              <el-button type="danger" class="fr" @click="mulDeleteUser">
                {{ $c.delete }}
              </el-button>
            </div>
          </div>
          <z-table
            ref="selectedTable"
            :list="selectedObj.list"
            :columns="selectedObj.columns"
            :tableProps="userTable.tableProps"
            multiSelect
            @selection-change="selectMulChange">
            <template v-slot:operation="v">
              <a
                href="#"
                class="text-red"
                @click.prevent="deleteUser(v.row, v.$index)">
                {{ $c.delete }}&nbsp;
              </a>
            </template>
          </z-table>
        </el-col>
      </el-row>
      <div class="align-r" v-show="operaVisible">
        <el-button @click="dialogShow = false">
          {{ $t('common').cancel }}
        </el-button>
        <el-button type="primary" @click="submmit">
          {{ $t('common').confirm }}
        </el-button>
        <slot name="operation"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { _, zPagination,zTable } from '@/views/_common'
export default {
  name: 'chooseUser',
  components: {
    zTable,
    zPagination,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    operaVisible: {
      type: Boolean,
      default: true,
    },
    list: {
      //用户自己的列表，会被添加到selectedObj.list中
      type: Array,
      default: () => {
        return []
      },
    },
    useridList: {
      //用于后端交互
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      apiUser: this.$api.user,
      apiSydept: this.$api.Sydept,
      filter: false, //是否处于筛选已选择用户标志位
      userTable: {
        //中间用户表格
        userList: [], //保存查询结果
        tableProps: {
          hideOperations: false,
          maxHeight: '500px',
        },
        columns: [
          {
            key: 'userid',
            title: this.$c.userid,
          },
          {
            key: 'username',
            title: this.$c.username,
          },
        ],
        total: 0,
        query: {
          queryString: '',
          page: 1,
          size: 15,
        },
        pagination: {
          layout: 'prev, pager, next, jumper, ->, total, sizes',
        },
      },
      department: {
        treeData: [], //保存树状数据
      },
      selectedObj: {
        //右边已选择用户表格
        list: [], //已选择的列表数据
        useridList: [], //已选择的列表的用户条码数据
        tempList: [], //过滤时对数据进行暂存
        deleteList: [], //过滤时删除的数据
        multipleSelection: [], //保存中间表格被选择的数据
        queryString: null,
        columns: [
          {
            title: this.$c.userid,
            key: 'userid',
            width: 70,
          },
          {
            title: this.$c.username,
            key: 'username',
          },
          // {
          //   title: this.$c.dept,
          //   key: 'department_t',
          // },
        ],
      },
    }
  },

  computed: {
    dialogShow: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },

  methods: {
    generate(arr, key, parentKey, rootId) {
      //生成左侧组织架构树状结构
      const tmp = {}
      tmp[rootId] = {
        children: [],
      }
      arr.forEach((i) => {
        tmp[i[key]] = Object.assign({}, i, {
          children: [],
        })
      })
      arr.forEach((i) => {
        var parentTmp = tmp[tmp[i[key]][parentKey]]
        if (parentTmp) {
          parentTmp.children.push(tmp[i[key]])
        }
        if (tmp[i[key]].up_dept_no == null) {
          //上级部门编号为null，判定为主部门，添加进数组并返回数据
          tmp[rootId].children.push(tmp[i[key]])
        }
      })
      return tmp[rootId].children
    },

    refreshTree() {
      //查询部门列表
      // this.pageLoading = true
      // this.$request(this.apiSydept + 'getlist', {
      //   pageSize: 9999,
      //   queryString: {},
      // })
      //   .then((r) => {
      //     this.department.treeData = this.generate(
      //       r.data.list,
      //       'dept_no',
      //       'up_dept_no',
      //       '0'
      //     )
      //     this.pageLoading = false
      //   })
      //   .catch((e) => {
      //     this.pageLoading = false
      //   })
    },

    getUserByDept(data) {
      //通过部门查询用户列表
      this.userTable.query.queryString = data.dept_name_label
      this.getUser()
    },

    getUser() {
      //查询用户列表
      this.$request(this.apiUser + 'getlist', {
        status: 0,
        ...this.userTable.query,
      })
        .then((res) => {
          this.userTable.userList = res.data.list
          this.userTable.total = res.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    filterUser() {
      if (this.filter && this.selectedObj.queryString == '') {
        this.reGetList()
        return
      }

      //过滤已选择的用户
      if (!this.filter) {
        this.selectedObj.tempList = _.cloneDeep(this.selectedObj.list)
        this.filter = true
      }

      if (isNaN(parseInt(this.selectedObj.queryString))) {
        console.log('过滤用户名')
        this.selectedObj.list = this.selectedObj.list.filter(
          (i) => i.username.indexOf(this.selectedObj.queryString) != -1
        )
      } else {
        console.log('过滤userid')
        this.selectedObj.list = this.selectedObj.list.filter(
          (i) => i.userid.indexOf(this.selectedObj.queryString) != -1
        )
      }
    },

    reGetList() {
      //点击清空按钮，重新获取列表
      console.log('重新获取列表')
      this.filter = false
      for (let k of this.selectedObj.deleteList) {
        this.selectedObj.tempList = this.selectedObj.tempList.filter(
          (item) => item.id != k.id
        )
      }
      this.selectedObj.list = _.cloneDeep(this.selectedObj.tempList)
      this.selectedObj.tempList = []
      this.selectedObj.deleteList = []
    },

    selectMulChange(val) {
      //选中表多选数据
      this.selectedObj.multipleSelection = val
    },

    addUser(row) {
      //把单个用户添加到选中列表
      if (!this.selectedObj.list.find(item => item.userid === row.userid)) {
        this.selectedObj.list.push(row)
      }
    },

    deleteUser(r, i) {
      //删除选中的单个用户
      if (this.filter) {
        this.selectedObj.deleteList.push(r)
      }
      this.selectedObj.list.splice(i, 1)
    },

    mulDeleteUser() {
      //删除选中用户（多条数据）
      for (let k of this.selectedObj.multipleSelection) {
        this.selectedObj.list = this.selectedObj.list.filter(
          (item) => item !== k
        )
        if (this.filter) {
          this.selectedObj.deleteList.push(k)
        }
      }
      console.log(this.selectedObj.deleteList.length)
    },

    generateUseridList() {
      //生成用户已勾选
      this.selectedObj.list.forEach((i) => {
        if (this.selectedObj.useridList.indexOf(i.userid) == -1) {
          this.selectedObj.useridList.unshift(i.userid)
        }
      })
    },

    initData() {
      this.selectedObj.list = this.list
    },

    submmit() {
      this.generateUseridList()
      this.$emit('update:useridList', this.selectedObj.useridList) //更新选择用户组件
      this.$emit('update:list', this.selectedObj.list) //更新选择用户组件
      this.$emit('submmit') //可以触发后续动作，只需传入回调函数
      this.dialogShow = false
    },
  },

  mounted() {
    this.refreshTree()
    this.getUser()
  },
}
</script>

<style scoped>
.el-table .el-table__row td:first-child .cell{
  text-overflow: unset;
}
.el-table .cell {
  white-space: nowrap;
}
</style>
