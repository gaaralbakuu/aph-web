<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem" style="margin-left: 5px">
      {{ c.create }}
    </el-button>
    <el-button :loading="sortLoading" v-if="indexFlag" class="fr" @click="updateDetailSort" type="success" plain>
      {{ c.saveIndex }}
    </el-button>
    <div class="filter-container">
      <el-input style="width: 200px" :placeholder="l.search" clearable prefix-icon="el-icon-search" class="filter-item" @keyup.enter="getList" @clear="getList" v-model="query.queryString.str"></el-input>
      <el-select v-model="query.queryString.status" class="filter-item" clearable :placeholder="l.statusPd" @change="getList">
        <el-option :label="c.enabled" value="1"></el-option>
        <el-option :label="c.disabled" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="success" plain @click="getList">{{ c.queryButton }}</el-button>
    </div>
    <z-table ref="dragTable" :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ c.edit }}</a>
        &nbsp;
        <a href="#" v-if="v.row.status == 2" class="text-green" @click.prevent="deleteItem(v.row, 1)">{{ c.enable }}</a>
        <a href="#" v-if="v.row.status == 1" class="text-red" @click.prevent="deleteItem(v.row, 2)">{{ c.disable }}</a>
      </template>
    </z-table>
    <z-pagination :pagination="pagination" :total="total" v-model:page="query.page" v-model:limit="query.size" @change="getList"></z-pagination>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit" :submmitLoading="submmitLoading" v-model:visible="editFormVisible"></z-form-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import Sortable from 'sortablejs'
import { _, api, defaultConfig, initFuncs, zFormDialog, zPagination, zTable } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminBanner') // Assuming 'adminBanner' based on component name

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  initData: {
    file: [],
    empnopz: 'N',
    orgidpz: 'N',
    deptnopz: 'N',
    otherspz: 'N',
    status: '1',
  },
})

const pageLoading = ref(false)
const sortLoading = ref(false)
const indexFlag = ref(false)
const submmitLoading = ref(false)
const editFormVisible = ref(false)
const sortable = ref(null)
const dragTable = ref(null)

const name = computed(() => l.value.title)
const query = reactive({
  queryString: {},
  size: 15,
  page: 1,
})
const list = ref([])
const total = ref(0)
const data = reactive({}) // Will be initialized in createItem or editItem

const status = computed(() => ({
  1: c.value.enabled,
  2: c.value.disabled,
}))

const statusClass = reactive({
  2: 'bg-red',
  1: 'bg-green',
})

const pagination = reactive(config.pagination || {})
const tableProps = reactive(config.tableProps || {})
const formProps = reactive(config.formProps || {})

// Helper functions for formatters
const formatStatus = (row) => {
  if (row == '1') {
    return c.value.enabled
  } else if (row == '2') {
    return c.value.disabled
  }
}

const formatYN = (row) => {
  return row // Placeholder if needed
}

const columns = computed(() => [
  {
    title: l.value.name,
    key: 'name',
    width: 200,
  },
  {
    title: l.value.description,
    key: 'description',
  },
  {
    title: l.value.link,
    key: 'link',
  },
  {
    title: l.value.file_name,
    key: 'file_name',
  },
  {
    title: l.value.file_url,
    key: 'file_url',
  },
  {
    title: l.value.status,
    key: 'status',
    formatter: formatStatus,
    width: 70,
  },
  {
    title: c.value.modify_user,
    key: 'modify_user',
    width: 100,
  },
  {
    title: c.value.modify_time,
    key: 'modify_time',
    width: 140,
  },
])

// Define methods first to use in fields
const addImg = (v, list) => {
  console.log(data)
  if (!data.file) data.file = []
  data.file.push(v[0])
}

const deleteImg = (i, list) => {
  data.file_id = ''
  data.file = []
}

const fields = computed(() => [
  {
    title: l.value.name,
    key: 'name',
    required: true,
  },
  {
    title: l.value.description,
    key: 'description',
  },
  {
    title: l.value.link,
    key: 'link',
  },
  {
    title: l.value.upload,
    key: 'file',
    name: 'imgUploader',
    props: {
      showCount: false,
      maxCount: 1,
    },
    events: {
      addImg: addImg,
      deleteImg: deleteImg,
    },
  },
  {
    title: l.value.isEnable,
    key: 'status',
    span: 8,
    name: 'switch',
    props: {
      inactiveValue: '2',
      activeValue: '1',
    },
  },
  {
    title: l.value.begdate,
    key: 'begdate',
    span: 24,
    name: 'date',
    props: {
      type: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },
  },
  {
    title: l.value.enddate,
    key: 'enddate',
    span: 24,
    name: 'date',
    props: {
      type: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },
  },
])

const setSort = () => {
  // Using template ref 'dragTable' which refers to z-table component
  // z-table might expose $el or we need to find the element
  // Since ref is on z-table, we might need to access its internal table
  // Assuming z-table renders an el-table or similar
  const el = proxy.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
  sortable.value = Sortable.create(el, {
    ghostClass: 'sortable-ghost',
    setData: function (dataTransfer) {
      dataTransfer.setData('Text', '')
    },
    onEnd: (evt) => {
      var tmp = list.value[evt.oldIndex]
      list.value[evt.oldIndex] = list.value[evt.newIndex]
      list.value[evt.newIndex] = tmp
      indexFlag.value = true
    },
  })
}

const getList = (e) => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAuth/getBannerList', {
      queryString: {
        ...query.queryString,
      },
      page: query.page,
      size: query.size,
    })
    .then((r) => {
      pageLoading.value = false
      list.value = r.data.list
      total.value = r.data.total // Assuming total is returned
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const deleteItem = (e, is_valid) => {
  proxy.$confirm(c.value.cfmDelete, c.value.oprConfirm).then(() => {
    pageLoading.value = true
    let url = proxy.$api.baseUrl + '/Compliance/complianceAuth/DeleteOrRecoveryBannerById'

    proxy
      .$request(
        url,
        {
          key: e.id,
          value: is_valid,
        },
        'post'
      )
      .then((r) => {
        pageLoading.value = false
        proxy.$message({
          message: c.value.success,
          type: 'success',
        })
        getList()
      })
      .catch(() => {
        pageLoading.value = false
      })
  })
}

const createItem = () => {
  Object.assign(data, _.cloneDeep(config.initData))
  editFormVisible.value = true
}

const formatAfterGet = (data) => {
  data.status = data.status.toString()
  return data
}

const editItem = (v) => {
  Object.assign(data, _.cloneDeep(config.initData))
  pageLoading.value = true
  let url = api.baseUrl + '/Compliance/complianceAuth/getBannerByid'
  if (config.apiSingle) {
    url = config.apiSingle
  }
  proxy
    .$request(url, {
      id: v.id,
    })
    .then((r) => {
      pageLoading.value = false
      Object.assign(data, formatAfterGet(r.data || {}))
      editFormVisible.value = true
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const submmit = () => {
  submmitLoading.value = true

  let formData = new FormData()
  if (data.file && data.file[0]) {
    formData.append('file', data.file[0])
  }

  formData.append('model', JSON.stringify(data))
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAuth/CreateOrModifyBanner', formData, 'post')
    .then((r) => {
      submmitLoading.value = false
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      editFormVisible.value = false
      getList()
    })
    .catch(() => {
      submmitLoading.value = false
    })
}

const updateDetailSort = () => {
  sortLoading.value = true
  let listSortIds = list.value.map((v) => {
    return v.id
  })
  proxy
    .$request(api.baseUrl + 'updateSeq', listSortIds, 'post')
    .then((r) => {
      sortLoading.value = false
      getList()
    })
    .catch((e) => {
      sortLoading.value = false
    })
}

const getFieldConfig = (fields, key) => {
  return fields.find((f) => f.key === key)
}

const autopzChange = () => {
  if (data.autopz == 'Y') {
    getFieldConfig(fields.value, 'begdate').props.disabled = false
    getFieldConfig(fields.value, 'enddate').props.disabled = false
  } else {
    getFieldConfig(fields.value, 'begdate').props.disabled = true
    getFieldConfig(fields.value, 'enddate').props.disabled = true
    data.begdate = null
    data.enddate = null
  }
}

onMounted(() => {
  getList()
})
</script>
<style scoped></style>
