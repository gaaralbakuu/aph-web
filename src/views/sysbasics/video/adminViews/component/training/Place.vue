<template>
  <div>
    <el-drawer class="drawer-container" v-model:visible="showObj.add_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <template #title><div class="title">{{l.addTrainingPlace}}</div></template>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.chineseName" required>
              <el-input v-model="addTrainPlaceList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="addTrainPlaceList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="addTrainPlaceList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="addTrainPlaceList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.location" required>
              <el-input v-model="addTrainPlaceList.list.place"></el-input>
            </el-form-item>
            <el-form-item :label="l.capacity">
              <el-input v-model="addTrainPlaceList.list.people_number"></el-input>
            </el-form-item>
            <el-form-item :label="l.equipmentDetails">
              <el-checkbox :indeterminate="addTrainPlaceList.isIndeterminate" v-model="addTrainPlaceList.checkAll"
                @change="addHandleCheckAllChange">{{l.selectAll}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="addTrainPlaceList.checkedEquipment" @change="addHandleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in equipmentOptions" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submmitAddLecturer">{{l.submit}}</el-button>
          <el-button type="danger" @click="showObj.add_show = false">{{l.close}}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer class="drawer-container" v-model:visible="showObj.edit_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <template #title><div class="title">{{l.editTrainingPlace}}</div></template>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.chineseName" required>
              <el-input v-model="editTrainPlaceList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="editTrainPlaceList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="editTrainPlaceList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="editTrainPlaceList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.location" required>
              <el-input v-model="editTrainPlaceList.list.place"></el-input>
            </el-form-item>
            <el-form-item :label="l.capacity">
              <el-input v-model="editTrainPlaceList.list.people_number"></el-input>
            </el-form-item>
            <el-form-item :label="l.equipmentDetails">
              <el-checkbox :indeterminate="editTrainPlaceList.isIndeterminate" v-model="editTrainPlaceList.checkAll"
                @change="editHandleCheckAllChange">{{l.selectAll}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="editTrainPlaceList.checkedEquipment" @change="editHandleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in equipmentOptions" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
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
          <el-input :placeholder="l.inputKeywordFilter" v-model="trainPlaceList.form.name" clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="l.location">
          <el-input :placeholder="l.inputKeywordFilter" v-model="trainPlaceList.form.place" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="trainPlaceList.form.is_valid" :placeholder="l.pleaseSelect" clearable style="width: 120px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getTrainPlaceList">{{l.search}}</el-button>
        </el-form-item>
        <el-button type="primary" class="fr" @click="addLecturer">{{l.create}}</el-button>
      </el-form>
    </div>
    <div style="height: calc(100% - 60px);">
      <a-table :dataSource="trainPlaceList.data" :columns="tableColumns" :scroll="{ y: 720 }" ref="userTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <el-button @click="editLecturer(record)" type="text" size="small">{{ l.edit }}</el-button>
            <el-button v-if="record.is_valid == 'Y'" @click="deleteLecturer(record)" type="text" size="small" style="color: red">{{ l.disable }}</el-button>
            <el-button v-else @click="deleteLecturer(record)" type="text" size="small" style="color: rgb(58, 188, 19)">{{ l.enable }}</el-button>
          </template>
        </template>
      </a-table>

      <z-pagination :pagination="pagination" :total="trainPlaceList.total" v-model:page="trainPlaceList.form.page"
        v-model:limit="trainPlaceList.form.pageSize" @change="getTrainPlaceList">
      </z-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { zPagination, _ } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminPlace')
const { proxy } = getCurrentInstance()

const equipmentOptions = computed(() => [l.computer, l.projector, l.microphone, l.soundSystem, l.whiteboard])

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

const trainPlaceList = reactive({
  total: 0,
  data: [],
  form: {
    is_valid: 'Y',
    page: 1,
    pageSize: 15,
    name: '',
    place: ''
  },
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
    title: l.name,
    key: 'name_zh',
  },
  {
    title: l.location,
    key: 'place',
  },
  {
    title: l.equipmentDetails,
    key: 'equipment',
  },
  {
    title: l.capacity,
    key: 'people_number',
    width: 100,
  },
  {
    title: l.status,
    key: 'is_valid',
    width: 100,
  },
  {
    title: l.modifiedBy,
    key: 'modify_user',
    width: 100,
  },
  {
    title: l.modifiedDepartment,
    key: 'modify_dept',
    width: 120,
  },
  {
    title: l.modifiedTime,
    key: 'modify_time',
    width: 150,
  },
])

const tableColumns = computed(() => {
  return [
    {
      title: l.serialNumber,
      dataIndex: 'index',
      key: 'index',
      customRender: (text, record, index) => index + 1
    },
    ...columns.value.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
      width: col.width
    })),
    {
      title: l.operation,
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'operation' }
    }
  ]
})

const addTrainPlaceList = reactive({
  list: {},
  checkAll: false,
  isIndeterminate: true,
  checkedEquipment: [],
})

const editTrainPlaceList = reactive({
  list: {},
  checkAll: false,
  isIndeterminate: true,
  checkedEquipment: [],
})

const getTrainPlaceList = () => {
  proxy.$request(
      proxy.$api.videoServer + '/Video/VideoTrain/getTrainPlace',
      trainPlaceList.form
    )
    .then((r) => {
      trainPlaceList.data = r.data.list
      trainPlaceList.total = r.data.total
      showObj.add_show = false
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const addHandleCheckAllChange = (val) => {
  addTrainPlaceList.checkedEquipment = val ? equipmentOptions.value : [];
  addTrainPlaceList.isIndeterminate = false;
}

const addHandleCheckedCitiesChange = (value) => {
  let checkedCount = value.length;
  addTrainPlaceList.checkAll = checkedCount === equipmentOptions.value.length;
  addTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < equipmentOptions.value.length;
}

const addLecturer = () => {
  showObj.add_show = true
}

const submmitAddLecturer = () => {
  addTrainPlaceList.list.equipment = addTrainPlaceList.checkedEquipment
  if (!addTrainPlaceList.list.name_zh)
    return proxy.$message.error(l.nameCannotBeEmpty)
  if (!addTrainPlaceList.list.place)
    return proxy.$message.error(l.locationCannotBeEmpty)

  proxy.$request(
      proxy.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
      addTrainPlaceList.list,
      'post'
    )
    .then((r) => {
      proxy.$message.success(l.operationSuccess)
      addTrainPlaceList.list = {}
      addTrainPlaceList.checkedEquipment = []
      getTrainPlaceList()
      showObj.add_show = false
    })
    .catch(() => {})
}

const editHandleCheckAllChange = (val) => {
  editTrainPlaceList.checkedEquipment = val ? equipmentOptions.value : [];
  editTrainPlaceList.isIndeterminate = false;
}

const editHandleCheckedCitiesChange = (value) => {
  let checkedCount = value.length;
  editTrainPlaceList.checkAll = checkedCount === equipmentOptions.value.length;
  editTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < equipmentOptions.value.length;
}

const editLecturer = (row) => {
  editTrainPlaceList.list = _.cloneDeep(row)
  editTrainPlaceList.checkedEquipment = editTrainPlaceList.list.equipment?.split(";") || []
  showObj.edit_show = true
}

const submmitEditLecturer = () => {
  editTrainPlaceList.list.equipment = editTrainPlaceList.checkedEquipment
  proxy.$confirm(l.confirmModify, l.trainingPlaceManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(
          proxy.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
          editTrainPlaceList.list,
          'post'
        )
        .then((r) => {
          proxy.$message.success(l.operationSuccess)
          getTrainPlaceList()
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
  let item = _.cloneDeep(row)
  item.equipment = item.equipment.split(";")
  item.is_valid = item.is_valid == "Y" ? "N" : "Y"
  proxy.$confirm(l.confirmStatusChange, l.trainingPlaceManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(
          proxy.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
          item,
          'post'
        )
        .then((r) => {
          proxy.$message.success(l.operationSuccess)
          getTrainPlaceList()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: l.operationFailed,
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
  getTrainPlaceList()
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
