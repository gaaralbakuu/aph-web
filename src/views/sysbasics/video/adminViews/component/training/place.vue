<template>
  <div>
    <el-drawer class="drawer-container" :visible.sync="showObj.add_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <div slot="title" class="title">{{l.addTrainingPlace}}</div>
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

    <el-drawer class="drawer-container" :visible.sync="showObj.edit_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <div slot="title" class="title">{{l.editTrainingPlace}}</div>
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
            <el-option v-for="item in trainPlaceList.options" :key="item.value" :label="item.label" :value="item.value">
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
      <a-table :dataSource="trainPlaceList.data" :columns="tableColumns" :scroll="{ y: 720 }" ref="userTable" :rowKey="record => record.id" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <el-button @click="editLecturer(record)" type="text" size="small">{{ l.edit }}</el-button>
          <el-button v-if="record.is_valid == 'Y'" @click="deleteLecturer(record)" type="text" size="small" style="color: red">{{ l.disable }}</el-button>
          <el-button v-else @click="deleteLecturer(record)" type="text" size="small" style="color: rgb(58, 188, 19)">{{ l.enable }}</el-button>
        </template>
      </a-table>

      <z-pagination :pagination="pagination" :total="trainPlaceList.total" :page.sync="trainPlaceList.form.page"
        :limit.sync="trainPlaceList.form.pageSize" @change="getTrainPlaceList">
      </z-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import zPagination from '@/views/_common/Pagination.vue'
import _ from 'lodash'

const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy
const { l, c } = useLocalI18n('videoAdminPlace')
const queryClient = useQueryClient()

// State
const equipmentOptions = [l.computer, l.projector, l.microphone, l.soundSystem, l.whiteboard]

const from = reactive({})

const showObj = reactive({
  add_show: false,
  edit_show: false,
})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
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
  options: [{
      value: 'Y',
      label: l.enabled,
    },
    {
      value: 'N',
      label: l.disabled,
    },
  ],
  columns: [
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
  ],
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

// Computed
const tableColumns = computed(() => {
  return [
    {
      title: l.serialNumber,
      dataIndex: 'index',
      key: 'index',
      customRender: (text, record, index) => index + 1
    },
    ...trainPlaceList.columns.map(col => ({
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

// Queries
const { data: placeData, refetch: refetchPlaceList } = useQuery({
  queryKey: ['placeList', trainPlaceList.form],
  queryFn: () => $request(api.videoServer + '/Video/VideoTrain/getTrainPlace', trainPlaceList.form),
  enabled: false
})

watch(() => placeData.value, (newVal) => {
  if (newVal && newVal.httpCode == 200) {
    trainPlaceList.data = newVal.data.list
    trainPlaceList.total = newVal.data.total
  }
})

// Mutations
const addOrModifyPlaceMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoTrain/addTrainPlace', data, 'post'),
  onSuccess: (r) => {
    $message.success(l.operationSuccess)
    refetchPlaceList()
  }
})

// Functions
const getTrainPlaceList = () => {
  refetchPlaceList()
  showObj.add_show = false
  showObj.edit_show = false
}

const addHandleCheckAllChange = (val) => {
  addTrainPlaceList.checkedEquipment = val ? equipmentOptions : [];
  addTrainPlaceList.isIndeterminate = false;
}

const addHandleCheckedCitiesChange = (value) => {
  let checkedCount = value.length;
  addTrainPlaceList.checkAll = checkedCount === equipmentOptions.length;
  addTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < equipmentOptions.length;
}

const addLecturer = () => {
  addTrainPlaceList.list = {}
  addTrainPlaceList.checkedEquipment = []
  addTrainPlaceList.checkAll = false
  addTrainPlaceList.isIndeterminate = true
  showObj.add_show = true
}

const submmitAddLecturer = () => {
  addTrainPlaceList.list.equipment = addTrainPlaceList.checkedEquipment
  if (!addTrainPlaceList.list.name_zh)
    return $message.error(l.nameCannotBeEmpty)
  if (!addTrainPlaceList.list.place)
    return $message.error(l.locationCannotBeEmpty)

  addOrModifyPlaceMutation.mutate(addTrainPlaceList.list, {
    onSuccess: () => {
      addTrainPlaceList.list = {}
      addTrainPlaceList.checkedEquipment = []
      showObj.add_show = false
    }
  })
}

const editHandleCheckAllChange = (val) => {
  editTrainPlaceList.checkedEquipment = val ? equipmentOptions : [];
  editTrainPlaceList.isIndeterminate = false;
}

const editHandleCheckedCitiesChange = (value) => {
  let checkedCount = value.length;
  editTrainPlaceList.checkAll = checkedCount === equipmentOptions.length;
  editTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < equipmentOptions.length;
}

const editLecturer = (row) => {
  editTrainPlaceList.list = _.cloneDeep(row)
  editTrainPlaceList.checkedEquipment = editTrainPlaceList.list.equipment?.split(";") || []
  showObj.edit_show = true
}

const submmitEditLecturer = () => {
  editTrainPlaceList.list.equipment = editTrainPlaceList.checkedEquipment
  $confirm(l.confirmModify, l.trainingPlaceManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      addOrModifyPlaceMutation.mutate(editTrainPlaceList.list, {
        onSuccess: () => {
          showObj.edit_show = false
        }
      })
    })
    .catch(() => {
      $message.info(l.operationCanceled)
    })
}

const deleteLecturer = (row) => {
  let item = _.cloneDeep(row)
  item.equipment = item.equipment.split(";")
  item.is_valid = item.is_valid == "Y" ? "N" : "Y"
  $confirm(l.confirmStatusChange, l.trainingPlaceManagement, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      addOrModifyPlaceMutation.mutate(item)
    })
    .catch(() => {
      $message.info(l.operationCanceled)
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
