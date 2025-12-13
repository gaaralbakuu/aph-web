<template>
  <div class="questionManage-container">
    <div class="component">
      <el-drawer class="drawer" :visible.sync="showObj.catalogDrawer" :wrapperClosable="false" size="50%">
        <div slot="title" class="title">{{ l.catalogDrawerTitle }}</div>
        <div class="form">
          <el-form label-width="90px" size="medium">
            <el-form-item :label="l.college">
              <el-select v-model="catalogObj.form.college_id" :placeholder="l.selectCollege" style="width: 100%" @change="catalogCollegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.parentCatalog">
              <el-cascader v-model="catalogObj.form.pid" :options="publicCodeObj.catalogList" clearable :placeholder="l.defaultRootCatalog" style="width: 100%" :props="catalogObj.cascaderProps"></el-cascader>
            </el-form-item>
            <el-form-item :label="l.nameZh">
              <el-input v-model="catalogObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameTw">
              <el-input v-model="catalogObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameEn">
              <el-input v-model="catalogObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameVi">
              <el-input v-model="catalogObj.form.name_vi"></el-input>
            </el-form-item>

            <el-form-item :label="l.catalogDescription">
              <el-input v-model="catalogObj.form.description" type="textarea" :placeholder="l.inputCatalogDescription" :rows="4"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitCatalog">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.catalogDrawer = false">{{ l.close }}</el-button>
        </div>
      </el-drawer>

      <el-drawer class="drawer" :visible.sync="showObj.questionDrawer" :wrapperClosable="false" size="60%">
        <div slot="title" class="title">{{ l.questionDrawerTitle }}</div>
        <div class="form">
          <el-form label-width="5em" size="medium">
            <el-form-item :label="l.college">
              <el-select v-model="questionObj.form.college_id" :placeholder="l.selectQuestionCollege" style="width: 100%" @change="questionCollegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.questionCategory">
              <el-cascader v-model="questionObj.form.question_category_id" :options="publicCodeObj.catalogList" clearable :placeholder="l.defaultRootCatalog" :props="catalogObj.cascaderProps" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item :label="l.nameZh">
              <el-input v-model="questionObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameTw">
              <el-input v-model="questionObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameEn">
              <el-input v-model="questionObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.nameVi">
              <el-input v-model="questionObj.form.name_vi"></el-input>
            </el-form-item>
            <el-row type="flex">
              <el-col :span="8">
                <el-form-item :label="l.questionType">
                  <el-select v-model="questionObj.form.question_type" style="width: 95%" @change="question_typeChange">
                    <el-option v-for="i in publicCodeObj.question_type" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="l.publishStatus">
                  <el-select v-model="questionObj.form.question_status" style="width: 95%">
                    <el-option v-for="i in publicCodeObj.question_status" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="l.difficultyLevel">
                  <el-select v-model="questionObj.form.difficulty_level" style="width: 95%">
                    <el-option v-for="i in 10" :key="i" :label="i" :value="i"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="options">
              <div v-if="questionObj.form.question_type === 0" class="text">
                <el-input type="textarea" :rows="2" :placeholder="l.inputContent"></el-input>
              </div>
              <div v-else-if="questionObj.form.question_type == 1 || questionObj.form.question_type == 2" class="radio-box">
                <div class="option-card" v-for="(i, index) in templateObj.radio" :key="index">
                  <div class="oprate">
                    <div>{{ l.option }} {{ index + 1 }}</div>
                    <div style="font-size: 24px">
                      <i style="color: red" class="el-icon-remove-outline" @click="removeOption(index, 'radio')"></i>
                      <i v-show="index + 1 == templateObj.radio.length" style="color: #409fee" class="el-icon-circle-plus-outline" @click="addOption"></i>
                    </div>
                  </div>
                  <el-form label-width="60px" size="medium">
                    <el-row :gutter="10">
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_zh">
                            <template slot="prepend">{{ l.zh }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_en">
                            <template slot="prepend">{{ l.en }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_vi">
                            <template slot="prepend">{{ l.vi }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_tw">
                            <template slot="prepend">{{ l.tw }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="input-box">
                          <el-switch v-model="i.is_correct" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ccc" :active-text="l.correctAnswer"></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <div v-else-if="questionObj.form.question_type == 3" class="judge">
                <div class="option-card" v-for="(i, index) in templateObj.judge" :key="index">
                  <div class="oprate">
                    <div>{{ l.option }} {{ index + 1 }}</div>
                  </div>
                  <el-form label-width="60px" size="medium">
                    <el-row :gutter="10">
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_zh">
                            <template slot="prepend">{{ l.zh }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_en">
                            <template slot="prepend">{{ l.en }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_vi">
                            <template slot="prepend">{{ l.vi }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_tw">
                            <template slot="prepend">{{ l.tw }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="input-box">
                          <el-switch v-model="i.is_correct" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ccc" :active-text="l.correctAnswer"></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitQuestion">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.questionDrawer = false">{{ l.close }}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="questionFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="l.college">
            <el-select v-model="college_id" :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.titleFilter">
            <el-input v-model="questionObj.query.name"></el-input>
          </el-form-item>
          <el-form-item :label="l.questionType">
            <el-select v-model="questionObj.query.question_type" @change="getQuestionList" clearable style="width: 100px">
              <el-option :label="l.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_type" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.statusFilter">
            <el-select v-model="questionObj.query.question_status" @change="getQuestionList" clearable style="width: 100px">
              <el-option :label="l.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_status" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionList">{{ l.search }}</el-button>
            <el-button type="primary" @click="addQuestion">{{ l.createQuestion }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="questionContent">
        <div class="catalogList">
          <div class="catalogFilter">
            <el-row :gutter="10">
              <el-col :span="20">
                <el-input v-model="filterCatalogText" :placeholder="l.filterCatalog">
                  <el-select v-model="catalogObj.query.is_valid" slot="prepend" :placeholder="l.status" style="width: 6em" @change="getCatalogList">
                    <el-option :label="l.all" value=""></el-option>
                    <el-option :label="l.enableFilter" value="Y"></el-option>
                    <el-option :label="l.disableFilter" value="N"></el-option>
                  </el-select>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addCatalog">{{ l.add }}</el-button>
              </el-col>
            </el-row>
          </div>
          <el-tree ref="catalogTree" node-key="id" :expand-on-click-node="false" :accordion="true" :default-expand-all="true" :data="catalogObj.list" :filter-node-method="filterCatalog">
            <div class="custom-catalog-tree" slot-scope="{ node, data }">
              <div class="catalogItem" @click="clickQuestionCatalog(data.id)">
                <div class="name">{{ data.name_label }}</div>
                <div class="btn">
                  <span class="edit" @click.stop="editCatalog(data)">{{ l.edit }}</span>
                  <span v-if="data.is_valid == 'Y'" class="disable" @click.stop="modifyCatalogStatus(data)">{{ l.disable }}</span>
                  <span v-else class="enable" @click.stop="modifyCatalogStatus(data)">{{ l.enable }}</span>
                </div>
              </div>
            </div>
          </el-tree>
        </div>
        <div class="questionList">
          <div ref="tableContainer" style="height: calc(100% - 40px)">
          <a-table :dataSource="questionObj.list" :columns="tableColumns" :scroll="{ y: cssObj.tableMaxHeight }" rowKey="id" :pagination="false">
            <template slot="question_type" slot-scope="text, record">
              {{ returnPublicObjLabel(record.question_type, 'value', 'label', 'question_type') }}
            </template>
            <template slot="question_status" slot-scope="text, record">
              {{ returnPublicObjLabel(record.question_status, 'value', 'label', 'question_status') }}
            </template>
            <template slot="actions" slot-scope="text, record">
              <el-button type="text" @click="editQuestion(record)">{{ l.edit }}</el-button>
              <el-button v-if="record.is_valid == 'Y'" type="text" style="color: #ff0000" @click="toggleQuestionStatus(record)">{{ l.disable }}</el-button>
              <el-button v-else class="text-green" type="text" @click="toggleQuestionStatus(record)">{{ l.enable }}</el-button>
            </template>
          </a-table>
        </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="questionObj.query.page" :page-sizes="[5, 10, 15, 30, 50, 100]" :page-size="questionObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="questionObj.total" style="float: right"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import { assignObject } from '@/utils'

const instance = getCurrentInstance()
const { $request, $message, $prompt } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminQuestion')
const queryClient = useQueryClient()

// State
const college_id = ref(null)
const filterCatalogText = ref('')
const showObj = reactive({
  catalogDrawer: false,
  questionDrawer: false,
})

const templateObj = reactive({
  radio: [],
  fillin: [{ id: '' }],
  judge: [],
})

const publicCodeObj = reactive({
  catalogList: [],
  collegeList: [],
  question_type: [
    { label: l.fillInBlank, value: 0 },
    { label: l.singleChoice, value: 1 },
    { label: l.multipleChoice, value: 2 },
    { label: l.judgement, value: 3 },
  ],
  question_status: [
    { label: l.unpublished, value: 0 },
    { label: l.published, value: 1 },
  ],
})

const cssObj = reactive({
  tableMaxHeight: '500px',
  popoverWidth: '600px',
})

const questionObj = reactive({
  query: {
    id: '',
    name: '',
    question_status: '',
    question_type: '',
    question_category_id: '',
    page: 1,
    pageSize: 15,
  },
  form: {
    id: '',
    college_id: '',
    question_id: '',
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    question_type: '',
    difficulty_level: '',
    question_status: '',
    question_category_id: '',
    is_valid: '',
    rec_status: '',
    version: '',
    options: [],
  },
  list: [],
  total: 0,
})

const catalogObj = reactive({
  cascaderProps: {
    expandTrigger: 'hover',
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'name_label',
  },
  query: {
    is_valid: '',
  },
  form: {
    id: '',
    college_id: '',
    pid: '',
    pname: '',
    sort: '',
    name_zh: '',
    name_tw: '',
    name_vi: '',
    name_en: '',
    description: '',
    is_valid: '',
    rec_status: '',
  },
  list: [],
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

const tableColumns = computed(() => {
  return [
    {
      title: l.serialNumber,
      dataIndex: 'index',
      key: 'index',
      width: 50,
      customRender: (text, record, index) => index + 1
    },
    {
      title: l.question,
      dataIndex: 'name_label',
      key: 'name_label'
    },
    {
      title: l.difficulty,
      dataIndex: 'difficulty_level',
      key: 'difficulty_level'
    },
    {
      title: l.questionTypeColumn,
      dataIndex: 'question_type',
      key: 'question_type',
      scopedSlots: { customRender: 'question_type' }
    },
    {
      title: l.publishStatusColumn,
      dataIndex: 'question_status',
      key: 'question_status',
      scopedSlots: { customRender: 'question_status' }
    },
    {
      title: l.status,
      dataIndex: 'is_valid',
      key: 'is_valid',
      customRender: (text) => text == 'Y' ? l.enableStatus : l.disableStatus
    },
    {
      title: l.actions,
      key: 'actions',
      fixed: 'right',
      scopedSlots: { customRender: 'actions' }
    }
  ]
})

// Queries
const { data: collegeListData, refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  })
})

watch(() => collegeListData.value, (newVal) => {
  if (newVal) {
    publicCodeObj.collegeList = newVal.data
    college_id.value = newVal.data[0].id
  }
})

const { data: questionListData, refetch: refetchQuestionList } = useQuery({
  queryKey: ['questionList', questionObj.query, college_id],
  queryFn: () => $request(api.videoServer + '/Video/VideoExam/getQuestionList', {
    ...questionObj.query,
    college_id: college_id.value,
  }),
  enabled: false
})

watch(() => questionListData.value, (newVal) => {
  if (newVal) {
    questionObj.list = newVal.data.list
    questionObj.total = newVal.data.total
    updateTableMaxHeight()
  }
})

const { data: catalogListData, refetch: refetchCatalogList } = useQuery({
  queryKey: ['catalogList', catalogObj.query, college_id],
  queryFn: () => $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    ...catalogObj.query,
    college_id: college_id.value,
  }),
  enabled: false
})

watch(() => catalogListData.value, (newVal) => {
  if (newVal) {
    catalogObj.list = newVal.data
  }
})

// Use watch for college_id changes to trigger refetches and reset query
watch(college_id, (n, o) => {
  questionObj.query.question_category_id = ''
  if (n) {
    refetchQuestionList()
    refetchCatalogList()
  }
})

watch(filterCatalogText, (val) => {
  instance.refs.catalogTree.filter(val)
})

// Mutations
const submitCatalogMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoExam/addQuestionCatagory', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      setTimeout(() => {
        showObj.catalogDrawer = false
        refetchCatalogList()
      }, 1500)
    }
  }
})

const modifyCatalogStatusMutation = useMutation({
  mutationFn: ({ key, value }) => $request(api.videoServer + '/Video/VideoExam/DeleteOrRecoveryCatagoryById', {
    key, value
  }, 'post'),
  onSuccess: () => {
    $message.success(l.modifySuccess)
    refetchCatalogList()
  }
})

const submitQuestionMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoExam/addQuestion', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      setTimeout(() => {
        showObj.questionDrawer = false
        refetchQuestionList()
      }, 1500)
    }
  }
})

const toggleQuestionStatusMutation = useMutation({
  mutationFn: ({ id, value }) => $request(api.videoServer + '/Video/VideoExam/toggleQuestionStatus', {
    id, value
  }, 'post'),
  onSuccess: () => {
    $message.success(l.modifySuccess)
    refetchQuestionList()
  }
})

// Functions
const updateTableMaxHeight = () => {
  nextTick(() => {
    const container = instance.refs.tableContainer
    if (container) {
      cssObj.tableMaxHeight = container.clientHeight + 'px'
    }
  })
}

const handleSizeChange = (i) => {
  questionObj.query.pageSize = i
  refetchQuestionList()
}

const handlePageChange = (i) => {
  questionObj.query.page = i
  refetchQuestionList()
}

const question_typeChange = (v) => {
  if (v == 1 || v == 2) {
    if (templateObj.radio.length == 0) {
      addOption()
    }
  } else if (v == 3) {
    if (templateObj.judge.length == 0) {
      templateObj.judge = [
        {
          id: '',
          option_id: '',
          pid: '',
          name_zh: '正确',
          name_tw: '正確',
          name_en: 'True',
          name_vi: 'Đúng',
          is_correct: false,
          sort: '',
          is_valid: 'Y',
          rec_status: 1,
        },
        {
          id: '',
          option_id: '',
          pid: '',
          name_zh: '错误',
          name_tw: '錯誤',
          name_en: 'False',
          name_vi: 'Sai',
          is_correct: false,
          sort: '',
          is_valid: 'Y',
          rec_status: 1,
        },
      ]
    }
  }
}

const clickQuestionCatalog = (id) => {
  questionObj.query.question_category_id = id
  refetchQuestionList()
}

const addOption = () => {
  if (questionObj.form.question_type === 0) {
    templateObj.fillin.push({
      id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1,
    })
  } else if (questionObj.form.question_type === 3) {
    templateObj.judge.push({
      id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1,
    })
  } else {
    templateObj.radio.push({
      id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1,
    })
  }
}

const removeOption = (i, filed) => {
  templateObj[filed].splice(i, 1)
  if (templateObj[filed].length == 0) {
    addOption()
  }
}

const catalogCollegeChange = (v) => {
  catalogObj.form.pid = ''
  getCatalogListById(v)
}

const filterCatalog = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

const addCatalog = () => {
  catalogObj.form = {
    id: '', pid: '', pname: '', sort: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', description: '', is_valid: 'Y', rec_status: 1, college_id: college_id.value,
  }
  showObj.catalogDrawer = true
}

const editCatalog = (data) => {
  assignObject(catalogObj.form, data)
  getCatalogListById(data.college_id)
  showObj.catalogDrawer = true
}

const modifyCatalogStatus = (data) => {
  let msg
  let status
  if (data.is_valid == 'Y') {
    msg = l.disableCatalogConfirm.replace('{name}', data.name_label)
    status = 'N'
  } else {
    msg = l.enableCatalogConfirm.replace('{name}', data.name_label)
    status = 'Y'
  }
  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.inputError,
    confirmButtonText: l.confirm,
    cancelButtonText: l.cancel,
  }).then(() => {
    modifyCatalogStatusMutation.mutate({ key: data.id, value: status })
  }).catch(() => {
    console.log('取消操作')
  })
}

const submitCatalog = () => {
  if (catalogObj.form.college_id == '') {
    return $message.error(l.pleaseSelectCollege)
  }
  if (catalogObj.form.name_zh == '') {
    return $message.error(l.pleaseInputNameZh)
  }
  if (catalogObj.form.pid == '') {
    catalogObj.form.pid == '0'
  }
  submitCatalogMutation.mutate(catalogObj.form)
}

const getCatalogList = () => {
  refetchCatalogList()
}

const getCatalogListById = (id) => {
  $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    ...catalogObj.query,
    college_id: id,
  }).then((r) => {
    publicCodeObj.catalogList = r.data
  }).catch((e) => {
    console.log(e)
  })
}

const questionCollegeChange = (v) => {
  questionObj.query.question_category_id = ''
  getCatalogListById(v)
}

const addQuestion = () => {
  for (let key in templateObj) {
    if (templateObj.hasOwnProperty(key)) {
      templateObj[key] = []
    }
  }
  for (let key in questionObj.form) {
    if (questionObj.form.hasOwnProperty(key)) {
      questionObj.form[key] = ''
    }
  }
  Object.assign(questionObj.form, {
    is_valid: 'Y',
    rec_status: 1,
    college_id: college_id.value,
  })
  getCatalogListById(college_id.value)
  showObj.questionDrawer = true
}

const editQuestion = (data) => {
  assignObject(questionObj.form, data)
  getCatalogListById(data.college_id)
  if (questionObj.form.question_type === 0) {
    templateObj.fillin = data.options
  } else if (questionObj.form.question_type === 3) {
    templateObj.judge = data.options
  } else {
    templateObj.radio = data.options
  }
  showObj.questionDrawer = true
}

const submitQuestion = () => {
  if (questionObj.form.college_id == '') {
    return $message.error(l.pleaseSelectCollege)
  }

  if (questionObj.form.question_type === 0) {
    questionObj.form.options = [{ id: '' }]
  } else if (questionObj.form.question_type === 3) {
    questionObj.form.options = templateObj.judge
  } else {
    questionObj.form.options = templateObj.radio
  }

  submitQuestionMutation.mutate(questionObj.form)
}

const toggleQuestionStatus = (data) => {
  let message
  let value
  if (data.is_valid == 'Y') {
    message = l.disableQuestionConfirm.replace('{name}', data.name_label)
    value = 'N'
  } else {
    message = l.enableQuestionConfirm.replace('{name}', data.name_label)
    value = 'Y'
  }

  $prompt(message, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.inputError,
    confirmButtonText: l.confirm,
    cancelButtonText: l.cancel,
  }).then(() => {
    toggleQuestionStatusMutation.mutate({ id: data.id, value })
  }).catch((err) => {
    if (err && err !== 'cancel' && err !== 'close') {
      console.error(err)
    } else {
      console.log('取消操作')
    }
  })
}

const getQuestionList = () => {
  refetchQuestionList()
}

const returnPublicObjLabel = (inputValue, key, outputValue, filed) => {
  let item = publicCodeObj[filed].find((i) => {
    return i[key] == inputValue
  })
  if (item) {
    return item[outputValue]
  } else {
    return inputValue
  }
}

const getCollegeList = () => {
  refetchCollegeList()
}

onMounted(() => {
  getCollegeList()
})
</script>

<style>
.questionManage-container {
  width: 100%;
  height: 100%;
}
.questionManage-container .component .drawer .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.questionManage-container .component .drawer .form {
  width: 95%;
  margin: 0 auto;
}
.questionManage-container .component .drawer .form .options {
  width: 100%;
  height: auto;
  min-height: 100px;
  margin-bottom: 100px;
}
.questionManage-container .component .drawer .form .options .radio-box,
.questionManage-container .component .drawer .form .options .judge {
  width: 100%;
}
.questionManage-container .component .drawer .form .options .radio-box .option-card,
.questionManage-container .component .drawer .form .options .judge .option-card {
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 5px 10px;
  margin-bottom: 20px;
}
.questionManage-container .component .drawer .form .options .radio-box .option-card .oprate,
.questionManage-container .component .drawer .form .options .judge .option-card .oprate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 5px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}
.questionManage-container .component .drawer .form .options .radio-box .option-card .input-box,
.questionManage-container .component .drawer .form .options .judge .option-card .input-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.questionManage-container .component .drawer .buttonBar {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.questionManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.questionManage-container .pageBody .questionFilter {
  width: 100%;
  height: 60px;
  padding: 15px;
  white-space: nowrap;
  background-color: white;
  float: right;
  border-bottom: 1px #eee solid;
}
.questionManage-container .pageBody .questionContent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}
.questionManage-container .pageBody .questionContent .catalogList {
  width: 25%;
  height: 100%;
  padding: 10px;
  background-color: #f7f7f7;
}
.questionManage-container .pageBody .questionContent .catalogList .catalogFilter {
  margin-bottom: 20px;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree {
  width: 100%;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem .name {
  font-size: 16px;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem .btn {
  padding-right: 10px;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem .btn .edit {
  color: #409fee;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem .btn .disable {
  color: #f56c6c;
}
.questionManage-container .pageBody .questionContent .catalogList .custom-catalog-tree .catalogItem .btn .enable {
  color: #67c23a;
}
.questionManage-container .pageBody .questionContent .questionList {
  width: 75%;
  height: 100%;
  padding: 5px;
  background-color: white;
}
</style>
