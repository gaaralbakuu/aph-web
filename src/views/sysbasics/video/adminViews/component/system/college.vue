<template>
  <div ref="lesssonCatalogue-container" class="lesssonCatalogue-container">
    <el-drawer class="drawer-container" :visible.sync="showObj.collegeShow" :wrapperClosable="false" size="40%" :before-close="getCollegeList">
      <div slot="title" class="title">{{ $l.addEditCollege }}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.simplifiedChineseName" required>
              <el-input v-model="collegeList.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="collegeList.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="collegeList.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.vietnameseName">
              <el-input v-model="collegeList.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="$l.allUsers" required>
              <el-switch v-model="collegeList.form.is_all" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitORG">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.collegeShow = false">{{ $l.close }}</el-button>
        </div>
      </div>
    </el-drawer>

    <div style="display: flex; justify-content: space-around">
      <div style="width: 30%">
        <div class="org_filter" style="display: flex; height: 60px; padding: 14px 0px">
          <el-input :placeholder="$l.inputKeywordFilter" v-model="filterOrgText"></el-input>
          <el-button type="success" @click="getCollegeList" style="margin-left: 10px">{{ $l.refresh }}</el-button>
          <el-button type="primary" @click="addORG" style="margin-left: 10px">{{ $l.addCollege }}</el-button>
        </div>
        <el-tree class="org-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true" :data="collegeList.data" :filter-node-method="filterOrg">
          <div class="org-tree-node" slot-scope="{ node, data }" @click="getCollegeUser(data.id)">
            <span>{{ data.name_zh }}</span>
            <span>
              <el-button type="text" @click.prevent="editORG(data)">{{ $l.edit }}</el-button>
            </span>
          </div>
        </el-tree>
      </div>
      <div style="width: 65%">
        <div class="catalog_filter" style="display: flex; height: 60px; padding: 14px 0px">
          <el-select v-model="selectUser.value" :placeholder="$l.pleaseSelect" @change="selectValueChange">
            <el-option v-for="item in selectUser.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input :placeholder="$l.inputKeywordFilter" v-model="filterCatalogText" clearable></el-input>
          <el-button type="success" @click="getCollegeUser" style="margin-left: 10px">{{ $l.refresh }}</el-button>
          <el-button type="primary" @click="addUser" style="margin-left: 10px">{{ $l.addUser }}</el-button>
        </div>
        <el-table :data="collegeUserList.data" style="width: 100%" :max-height="showObj.calculateMaxheight" ref="userTable">
          <el-table-column v-for="(item, index) in collegeUserList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
          <el-table-column fixed="right" :label="$l.operation" width="100">
            <template slot-scope="scope">
              <el-button @click="deleteUesrs(scope.row)" type="text" size="small" style="color: red">{{ $l.delete }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="collegeUserList.total" :page.sync="collegeUserList.query.page" :limit.sync="collegeUserList.query.pageSize" @change="getCollegeUser"></z-pagination>

        <chooseUser :visible.sync="showObj.addUserDialogShow" :useridList.sync="addUsers" @submmit="submmitAddUser"></chooseUser>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { api, zPagination } from '@/views/_common'
import chooseUser from '@/views/_common/chooseUser.vue'
export default {
  name: 'videoAdminCollege',
  components: {
    zPagination,
    chooseUser,
  },
  data() {
    return {
      api: api,
      submitAddUserLoading: false,
      addUsers: [],
      selectUser: {
        list: [],
        value: 'userid',
        options: [
          {
            value: 'userid',
            label: this.$l.userid,
          },
          {
            value: 'name',
            label: this.$l.name,
          },
        ],
      },
      pagination: {
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100],
      },
      showObj: {
        collegeShow: false,
        selectCourse: false,
        addUserDialogShow: false,
        calculateMaxheight: 600,
      },
      filterOrgText: '',
      filterCatalogText: '',
      collegeList: {
        total: 0,
        page: 1,
        pageSize: 15,
        data: [],
        form: {
          rec_status: 1,
          id: '',
          is_all: '',
          name_zh: '',
          name_tw: '',
          name_en: '',
          name_vi: '',
        },
      },
      collegeUserList: {
        total: 0,
        data: [],
        query: {
          college_id: '',
          name: '',
          userid: '',
          is_super: '',
          page: 1,
          pageSize: 15,
        },
        form: {},
        columns: [
          {
            title: this.$l.userid,
            key: 'userid',
          },
          {
            title: this.$l.name,
            key: 'name_t',
          },
          {
            title: this.$l.departmentCode,
            key: 'dept_no',
          },
          {
            title: this.$l.departmentName,
            key: 'department_t',
          },
          {
            title: this.$l.positionCode,
            key: 'work_no',
          },
          {
            title: this.$l.positionName,
            key: 'work_name',
          },
        ],
      },
    }
  },
  watch: {
    filterOrgText(val) {
      this.$refs.orgTree.filter(val)
    },

    filterCatalogText(val) {
      this.collegeUserList.query[this.selectUser.value] = val
      this.getCollegeUser()
    },
  },

  computed: {
    ...mapGetters(['isAdmin']),
  },

  methods: {
    filterOrg(value, data) {
      if (!value) return true
      return data.name_zh.indexOf(value) !== -1
    },

    addORG() {
      this.collegeList.form = Object.assign(this.collegeList.form, {
        id: '',
        is_all: '0',
        name_zh: '',
        name_tw: '',
        name_en: '',
        name_vi: '',
      })
      this.showObj.collegeShow = true
    },

    editORG(data) {
      this.collegeList.form = Object.assign(this.collegeList.form, data)
      this.showObj.collegeShow = true
    },

    submitORG() {
      if (!this.collegeList.form.name_zh) {
        return this.$message.error(this.$l.pleaseInputChineseName)
      }

      this.$request(api.baseUrl + '/Video/VideoCollege/addOrModifyCollege', this.collegeList.form, 'post')
        .then((r) => {
          if (r.httpCode == 200) {
            this.$message({
              type: 'success',
              message: this.$l.submitSuccess,
            })
            let timer = setTimeout(() => {
              this.showObj.collegeShow = false
              this.getCollegeList()
              clearTimeout(timer)
            }, 1500)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getCollegeList() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
        resource_path: this.$route.path,
      })
        .then((r) => {
          this.collegeList.data = r.data
          this.showObj.collegeShow = false
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },

    getCollegeUser(id) {
      let org_id = ''
      if (typeof id == 'string') {
        org_id = id
        this.collegeUserList.query.college_id = org_id
      }
      this.$request(api.baseUrl + '/Video/VideoCollege/getCollegeUser', this.collegeUserList.query).then((r) => {
        this.collegeUserList.data = r.data.list
        this.collegeUserList.total = r.data.total
      })
    },

    submmitAddUser() {
      if (this.addUsers.length == 0) return this.$message.error(this.$l.addUserCannotEmpty)

      let userList = []
      this.addUsers.forEach((e) => {
        let j = {
          userid: e,
          college_id: this.collegeUserList.query.college_id,
          id: '',
        }
        userList.push(j)
      })

      this.submitAddUserLoading = true
      this.$request(api.baseUrl + '/Video/VideoCollege/setUserIntoCollege', userList, 'post')
        .then((r) => {
          this.$message.success(this.$c.success)
          this.addUserDialogShow = false
          this.submitAddUserLoading = false
          this.addUsers = []
          this.getCollegeUser(this.collegeUserList.query.college_id)
        })
        .catch(() => {
          this.submitAddUserLoading = false
        })
    },

    deleteUesrs(row) {
      if (!this.collegeUserList.query.college_id) return this.$message.error(this.$l.pleaseSelectCollegeToDelete)

      const updatedRow = {
        ...row,
        is_valid: 'N',
        college_id: this.collegeUserList.query.college_id,
        is_super: this.collegeUserList.query.is_super,
      }
      let j = [updatedRow]
      this.$confirm(this.$l.confirmAddData, this.$l.dueDiligence, {
        confirmButtonText: this.$l.confirm,
        cancelButtonText: this.$l.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Video/VideoCollege/setUserIntoCollege', j, 'post')
            .then((r) => {
              this.getCollegeUser()
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelDelete,
          })
        })
    },

    selectValueChange(r, i) {
      this.collegeUserList.query.userid = ''
      this.collegeUserList.query.name = ''
      const filterKey = this.selectUser.value
      this.collegeUserList.query[filterKey] = this.filterCatalogText
      this.getCollegeUser()
    },

    addUser(data) {
      if (!this.collegeUserList.query.college_id) return this.$message.error(this.$l.pleaseClickConfirmCollege)
      this.showObj.addUserDialogShow = true
    },
    returnMaxheight() {
      this.showObj.calculateMaxheight = window.innerHeight - 120
    },
  },
  mounted() {
    this.getCollegeList()
    window.addEventListener('resize', this.returnMaxheight)
    this.$nextTick(() => {
      this.returnMaxheight()
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.returnMaxheight)
  },
}
</script>

<style lang="scss">
.img {
  width: 80%;
  height: 60px;

  .auto-img {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
}

.custom-tree-node {
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lesssonCatalogue-container {
  width: 100%;
  height: 100%;

  .drawer-container {
    //视频上传抽屉样式
    .title {
      padding: 0px 20px 10px 20px;
      font-size: 18px;
      font-weight: 600;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }

    .form-container {
      width: 100%;
      height: 95%;
      margin: 0 auto;
      background-color: #fff;

      .form {
        width: 90%;
        margin: 0 auto;
      }

      .buttonBar {
        width: 100%;
        height: 60px;
        margin: 0 auto;
        padding: 0 30px;
        position: absolute;
        bottom: 0px;
        border-top: 1px solid #ccc;
        float: right;
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }
  }

  .org-tree-node {
    width: 85%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
