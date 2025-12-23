<template>
  <div>
    <el-drawer class="drawer-container" :visible.sync="showObj.add_show" :wrapperClosable="false" size="40%"
      :before-close="getLecturerList">
      <div slot="title" class="title">{{l.addLecturer}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.cardNumber" required>
              <el-input v-model="addLecturerList.list.ic_card"></el-input>
            </el-form-item>
            <el-form-item :label="l.chineseName" required>
              <el-input v-model="addLecturerList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="addLecturerList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="addLecturerList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="addLecturerList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.gender" required>
              <el-radio v-model="addLecturerList.list.sex" label="1">{{l.male}}</el-radio>
              <el-radio v-model="addLecturerList.list.sex" label="0">{{l.female}}</el-radio>
            </el-form-item>
            <el-form-item :label="l.birthday" required>
              <el-date-picker v-model="addLecturerList.list.birthday" type="date" :placeholder="l.selectDate"
                style="width: 100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="l.phoneNumber" required>
              <el-input v-model="addLecturerList.list.phone"></el-input>
            </el-form-item>
            <el-form-item :label="l.country">
              <el-input v-model="addLecturerList.list.country"></el-input>
            </el-form-item>
            <el-form-item :label="l.address">
              <el-input v-model="addLecturerList.list.address"></el-input>
            </el-form-item>
            <el-form-item :label="l.email">
              <el-input v-model="addLecturerList.list.email"></el-input>
            </el-form-item>
            <el-form-item :label="l.company">
              <el-input v-model="addLecturerList.list.company"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submmitAddLecturer">{{l.submit}}</el-button>
          <el-button type="danger" @click="showObj.add_show = false">{{l.close}}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer class="drawer-container" :visible.sync="showObj.edit_show" :wrapperClosable="false" size="40%"
      :before-close="getLecturerList">
      <div slot="title" class="title">{{l.editLecturer}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.chineseName" required>
              <el-input v-model="editLecturerList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="editLecturerList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="editLecturerList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="editLecturerList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.gender">
              <el-radio v-model="editLecturerList.list.sex" label="1">{{l.male}}</el-radio>
              <el-radio v-model="editLecturerList.list.sex" label="0">{{l.female}}</el-radio>
            </el-form-item>
            <el-form-item :label="l.birthday">
              <el-date-picker v-model="editLecturerList.list.birthday" type="date" :placeholder="l.selectDate"
                style="width: 100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="l.phoneNumber">
              <el-input v-model="editLecturerList.list.phone"></el-input>
            </el-form-item>
            <el-form-item :label="l.country">
              <el-input v-model="editLecturerList.list.country"></el-input>
            </el-form-item>
            <el-form-item :label="l.address">
              <el-input v-model="editLecturerList.list.address"></el-input>
            </el-form-item>
            <el-form-item :label="l.email">
              <el-input v-model="editLecturerList.list.email"></el-input>
            </el-form-item>
            <el-form-item :label="l.company">
              <el-input v-model="editLecturerList.list.company"></el-input>
            </el-form-item>
            <el-form-item :label="l.cardNumber">
              <el-input v-model="editLecturerList.list.ic_card"></el-input>
            </el-form-item>
          </el-form>
          <div class="buttonBar">
            <el-button type="primary" @click="submmitEditLecturer">{{l.submit}}</el-button>
            <el-button type="danger" @click="showObj.edit_show = false">{{l.close}}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <div style="width: 100%;height: 60px;padding: 15px;background-color: white;border-bottom: 1px #eee solid;">
      <el-form :model="from" inline>
        <el-form-item :label="l.name">
          <el-input :placeholder="l.inputKeywordFilter" v-model="lecturerList.form.name" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="lecturerList.form.is_valid" :placeholder="l.pleaseSelect" clearable style="width: 100px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getLecturerList">{{l.search}}</el-button>
        </el-form-item>
        <el-button type="primary" class="fr" @click="addLecturer">{{l.create}}</el-button>
      </el-form>
    </div>
    <div style="height: calc(100% - 60px);">
      <a-table :dataSource="lecturerList.data" :columns="columns" :scroll="{ y: 720 }">
        <template slot="operation" slot-scope="text, record">
          <a-button @click="editLecturer(record)" type="link" size="small">{{l.edit}}</a-button>
          <a-button @click="deleteLecturer(record)" type="link" size="small" style="color: red">
            {{l.delete}}</a-button>
        </template>
      </a-table>

      <z-pagination :pagination="pagination" :total="lecturerList.total" :page.sync="lecturerList.form.page"
        :limit.sync="lecturerList.form.pageSize" @change="getLecturerList">
      </z-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { api, zPagination, _ } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminLecturer')
const { proxy } = getCurrentInstance()

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

const from = reactive({})

const showObj = reactive({
  add_show: false,
  edit_show: false,
})

const lecturerList = reactive({
  total: 0,
  data: [],
  form: {
    is_valid: 'Y',
    page: 1,
    pageSize: 15,
    name: ''
  }
})

const options = computed(() => [
  {
    value: 'Y',
    label: l.enabled,
  },
  {
    value: 'N',
    label: l.disabled,
  },
])

const columns = computed(() => [
  {
      title: l.cardNumber,
      dataIndex: 'ic_card',
      width: 60,
    },
    {
      title: l.name,
      dataIndex: 'name_zh',
      width: 140,
    },
    {
      title: l.gender,
      dataIndex: 'sex',
      width: 100,
    },
    {
      title: l.birthday,
      dataIndex: 'birthday',
      width: 180,
    },
    {
      title: l.phoneNumber,
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: l.country,
      dataIndex: 'country',
      width: 140,
    },
    {
      title: l.address,
      dataIndex: 'address',
      width: 260,
    },
    {
      title: l.company,
      dataIndex: 'company',
      width: 260,
    },
    {
      title: l.email,
      dataIndex: 'email',
      width: 230,
    },
    {
      title: l.operation,
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'operation' },
    },
])

const addLecturerList = reactive({
  list: {},
})

const editLecturerList = reactive({
  list: {},
})

const getLecturerList = () => {
  proxy.$request(
      api.baseUrl + '/Video/VideoLecturer/getlist',
      lecturerList.form
    )
    .then((r) => {
      lecturerList.data = r.data.list
      lecturerList.total = r.data.total
      showObj.add_show = false
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const addLecturer = () => {
  showObj.add_show = true
}

const submmitAddLecturer = () => {
  if (!addLecturerList.list.name_zh)
    return proxy.$message.error(l.nameCannotBeEmpty)
  if (!addLecturerList.list.sex)
    return proxy.$message.error(l.genderCannotBeEmpty)
  if (!addLecturerList.list.phone)
    return proxy.$message.error(l.phoneCannotBeEmpty)
  if (!addLecturerList.list.ic_card)
    return proxy.$message.error(l.cardNumberCannotBeEmpty)

  proxy.$request(
      api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
      addLecturerList.list,
      'post'
    )
    .then((r) => {
      proxy.$message.success(l.operationSuccess)
      addLecturerList.list = {}
      showObj.add_show = false
      getLecturerList()
    })
    .catch(() => {})
}

const editLecturer = (row) => {
  editLecturerList.list = _.cloneDeep(row)
  showObj.edit_show = true
}

const submmitEditLecturer = () => {
  proxy.$confirm(l.confirmModify, l.lecturerManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(
          api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
          editLecturerList.list,
          'post'
        )
        .then((r) => {
          proxy.$message.success(l.operationSuccess)
          getLecturerList()
          showObj.edit_show = false
        })
        .catch(() => {})
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.operationCanceled,
      })
    })
}

const deleteLecturer = (row) => {
  row.is_valid = 'N'
  proxy.$confirm(l.confirmDelete, l.lecturerManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(
          api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
          row,
          'post'
        )
        .then((r) => {
          proxy.$message.success(l.operationSuccess)
          getLecturerList()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: l.deleteFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.operationCanceled,
      })
    })
}

onMounted(() => {
  getLecturerList()
})
</script>

<style>
.drawer-container .title {
  padding: 0px 20px 10px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.drawer-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  background-color: #fff;
}
.drawer-container .form-container .form {
  width: 90%;
  margin: 0 auto;
}
.drawer-container .form-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 30px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
