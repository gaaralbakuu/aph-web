<template>
  <div>
    <el-drawer class="drawer-container" :visible.sync="showObj.add_show" :wrapperClosable="false" size="40%"
      :before-close="getLecturerList">
      <div slot="title" class="title">{{$l.addLecturer}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.cardNumber" required>
              <el-input v-model="addLecturerList.list.ic_card"></el-input>
            </el-form-item>
            <el-form-item :label="$l.chineseName" required>
              <el-input v-model="addLecturerList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="addLecturerList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="addLecturerList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.gender" required>
              <el-radio v-model="addLecturerList.list.sex" label="1">{{$l.male}}</el-radio>
              <el-radio v-model="addLecturerList.list.sex" label="0">{{$l.female}}</el-radio>
            </el-form-item>
            <el-form-item :label="$l.birthday" required>
              <el-date-picker v-model="addLecturerList.list.birthday" type="date" :placeholder="$l.selectDate"
                style="width: 100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$l.phoneNumber" required>
              <el-input v-model="addLecturerList.list.phone"></el-input>
            </el-form-item>
            <el-form-item :label="$l.country">
              <el-input v-model="addLecturerList.list.country"></el-input>
            </el-form-item>
            <el-form-item :label="$l.address">
              <el-input v-model="addLecturerList.list.address"></el-input>
            </el-form-item>
            <el-form-item :label="$l.email">
              <el-input v-model="addLecturerList.list.email"></el-input>
            </el-form-item>
            <el-form-item :label="$l.company">
              <el-input v-model="addLecturerList.list.company"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submmitAddLecturer">{{$l.submit}}</el-button>
          <el-button type="danger" @click="showObj.add_show = false">{{$l.close}}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer class="drawer-container" :visible.sync="showObj.edit_show" :wrapperClosable="false" size="40%"
      :before-close="getLecturerList">
      <div slot="title" class="title">{{$l.editLecturer}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.chineseName" required>
              <el-input v-model="editLecturerList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="editLecturerList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="editLecturerList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.gender">
              <el-radio v-model="editLecturerList.list.sex" label="1">{{$l.male}}</el-radio>
              <el-radio v-model="editLecturerList.list.sex" label="0">{{$l.female}}</el-radio>
            </el-form-item>
            <el-form-item :label="$l.birthday">
              <el-date-picker v-model="editLecturerList.list.birthday" type="date" :placeholder="$l.selectDate"
                style="width: 100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$l.phoneNumber">
              <el-input v-model="editLecturerList.list.phone"></el-input>
            </el-form-item>
            <el-form-item :label="$l.country">
              <el-input v-model="editLecturerList.list.country"></el-input>
            </el-form-item>
            <el-form-item :label="$l.address">
              <el-input v-model="editLecturerList.list.address"></el-input>
            </el-form-item>
            <el-form-item :label="$l.email">
              <el-input v-model="editLecturerList.list.email"></el-input>
            </el-form-item>
            <el-form-item :label="$l.company">
              <el-input v-model="editLecturerList.list.company"></el-input>
            </el-form-item>
            <el-form-item :label="$l.cardNumber">
              <el-input v-model="editLecturerList.list.ic_card"></el-input>
            </el-form-item>
          </el-form>
          <div class="buttonBar">
            <el-button type="primary" @click="submmitEditLecturer">{{$l.submit}}</el-button>
            <el-button type="danger" @click="showObj.edit_show = false">{{$l.close}}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <div style="width: 100%;height: 60px;padding: 15px;background-color: white;border-bottom: 1px #eee solid;">
      <el-form :model="from" inline>
        <el-form-item :label="$l.name">
          <el-input :placeholder="$l.inputKeywordFilter" v-model="lecturerList.form.name" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="lecturerList.form.is_valid" :placeholder="$l.pleaseSelect" clearable style="width: 100px">
            <el-option v-for="item in lecturerList.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getLecturerList">{{$l.search}}</el-button>
        </el-form-item>
        <el-button type="primary" class="fr" @click="addLecturer">{{$l.create}}</el-button>
      </el-form>
    </div>
    <div style="height: calc(100% - 60px);">
      <el-table :data="lecturerList.data" style="width: 100%" max-height="720px" ref="userTable">
        <el-table-column v-for="(item, index) in lecturerList.columns" :key="index" :prop="item.key" :label="item.title"
          :width="item.width">
        </el-table-column>
        <el-table-column fixed="right" :label="$l.operation" width="100">
          <template slot-scope="scope">
            <el-button @click="editLecturer(scope.row)" type="text" size="small">{{$l.edit}}</el-button>
            <el-button @click="deleteLecturer(scope.row)" type="text" size="small" style="color: red">
              {{$l.delete}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <z-pagination :pagination="pagination" :total="lecturerList.total" :page.sync="lecturerList.form.page"
        :limit.sync="lecturerList.form.pageSize" @change="getLecturerList">
      </z-pagination>
    </div>
  </div>
</template>

<script>
  import {
    api,
    zPagination
  } from '@/views/_common'
  export default {
    name: 'videoAdminLecturer',
    components: {
      zPagination,
    },
    data() {
      return {
        api: api,
        pagination: {
          layout: 'prev, pager, next, jumper, ->, total,sizes',
          pagerCount: 7,
          pageSizes: [10, 15, 20, 30, 40, 50, 100],
        },
        from: {},
        showObj: {
          add_show: false,
          edit_show: false,
        },
        lecturerList: {
          total: 0,
          data: [],
          form: {
            is_valid: 'Y',
            page: 1,
            pageSize: 15,
          },
          options: [{
              value: 'Y',
              label: this.$l.enabled,
            },
            {
              value: 'N',
              label: this.$l.disabled,
            },
          ],
          columns: [{
              title: this.$l.cardNumber,
              key: 'ic_card',
              width: 60,
            },
            {
              title: this.$l.name,
              key: 'name_zh',
              width: 140,
            },
            {
              title: this.$l.gender,
              key: 'sex',
              width: 100,
            },
            {
              title: this.$l.birthday,
              key: 'birthday',
              width: 180,
            },
            {
              title: this.$l.phoneNumber,
              key: 'phone',
              width: 120,
            },
            {
              title: this.$l.country,
              key: 'country',
              width: 140,
            },
            {
              title: this.$l.address,
              key: 'address',
              width: 260,
            },
            {
              title: this.$l.company,
              key: 'company',
              width: 260,
            },
            {
              title: this.$l.email,
              key: 'email',
              width: 230,
            },
          ],
        },
        addLecturerList: {
          list: {},
        },
        editLecturerList: {
          list: {},
        },
      }
    },
    watch: {},

    methods: {
      getLecturerList() {
        this.$request(
            api.baseUrl + '/Video/VideoLecturer/getlist',
            this.lecturerList.form
          )
          .then((r) => {
            this.lecturerList.data = r.data.list
            this.lecturerList.total = r.data.total
            this.showObj.add_show = false
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },
      addLecturer() {
        this.showObj.add_show = true
      },
      submmitAddLecturer() {
        if (!this.addLecturerList.list.name_zh)
          return this.$message.error(this.$l.nameCannotBeEmpty)
        if (!this.addLecturerList.list.sex)
          return this.$message.error(this.$l.genderCannotBeEmpty)
        if (!this.addLecturerList.list.phone)
          return this.$message.error(this.$l.phoneCannotBeEmpty)
        if (!this.addLecturerList.list.ic_card)
          return this.$message.error(this.$l.cardNumberCannotBeEmpty)

        this.$request(
            api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
            this.addLecturerList.list,
            'post'
          )
          .then((r) => {
            this.$message.success(this.$l.operationSuccess)
            this.addLecturerList.list = {}
            this.showObj.add_show = false
            this.getLecturerList()
          })
          .catch(() => {})
      },
      editLecturer(row) {
        this.editLecturerList.list = _.cloneDeep(row)
        this.showObj.edit_show = true
      },
      submmitEditLecturer() {
        this.$confirm(this.$l.confirmModify, this.$l.lecturerManagement, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(
                api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
                this.editLecturerList.list,
                'post'
              )
              .then((r) => {
                this.$message.success(this.$l.operationSuccess)
                this.getLecturerList()
                this.showObj.edit_show = false
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.operationCanceled,
            })
          })
      },
      deleteLecturer(row) {
        row.is_valid = 'N'
        this.$confirm(this.$l.confirmDelete, this.$l.lecturerManagement, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(
                api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
                row,
                'post'
              )
              .then((r) => {
                this.$message.success(this.$l.operationSuccess)
                this.getLecturerList()
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: this.$l.deleteFailed,
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.operationCanceled,
            })
          })
      },
    },
    mounted() {
      this.getLecturerList()
    },
  }
</script>

<style lang="scss">
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
</style>
