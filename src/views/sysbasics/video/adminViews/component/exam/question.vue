<template>
  <div class="questionManage-container">
    <div class="component">
      <el-drawer class="drawer" :visible.sync="showObj.catalogDrawer" :wrapperClosable="false" size="50%">
        <div slot="title" class="title">{{ $l.catalogDrawerTitle }}</div>
        <div class="form">
          <el-form label-width="90px" size="medium">
            <el-form-item :label="$l.college">
              <el-select v-model="catalogObj.form.college_id" :placeholder="$l.selectCollege" style="width: 100%" @change="catalogCollegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.parentCatalog">
              <el-cascader v-model="catalogObj.form.pid" :options="publicCodeObj.catalogList" clearable :placeholder="$l.defaultRootCatalog" style="width: 100%" :props="catalogObj.cascaderProps"></el-cascader>
            </el-form-item>
            <el-form-item :label="$l.nameZh">
              <el-input v-model="catalogObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameTw">
              <el-input v-model="catalogObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameEn">
              <el-input v-model="catalogObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameVi">
              <el-input v-model="catalogObj.form.name_vi"></el-input>
            </el-form-item>

            <el-form-item :label="$l.catalogDescription">
              <el-input v-model="catalogObj.form.description" type="textarea" :placeholder="$l.inputCatalogDescription" :rows="4"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitCatalog">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.catalogDrawer = false">{{ $l.close }}</el-button>
        </div>
      </el-drawer>

      <el-drawer class="drawer" :visible.sync="showObj.questionDrawer" :wrapperClosable="false" size="60%">
        <div slot="title" class="title">{{ $l.questionDrawerTitle }}</div>
        <div class="form">
          <el-form label-width="5em" size="medium">
            <el-form-item :label="$l.college">
              <el-select v-model="questionObj.form.college_id" :placeholder="$l.selectQuestionCollege" style="width: 100%" @change="questionCollegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.questionCategory">
              <el-cascader v-model="questionObj.form.question_category_id" :options="publicCodeObj.catalogList" clearable :placeholder="$l.defaultRootCatalog" :props="catalogObj.cascaderProps" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item :label="$l.nameZh">
              <el-input v-model="questionObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameTw">
              <el-input v-model="questionObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameEn">
              <el-input v-model="questionObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.nameVi">
              <el-input v-model="questionObj.form.name_vi"></el-input>
            </el-form-item>
            <el-row type="flex">
              <el-col :span="8">
                <el-form-item :label="$l.questionType">
                  <el-select v-model="questionObj.form.question_type" style="width: 95%" @change="question_typeChange">
                    <el-option v-for="i in publicCodeObj.question_type" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$l.publishStatus">
                  <el-select v-model="questionObj.form.question_status" style="width: 95%">
                    <el-option v-for="i in publicCodeObj.question_status" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$l.difficultyLevel">
                  <el-select v-model="questionObj.form.difficulty_level" style="width: 95%">
                    <el-option v-for="i in 10" :key="i" :label="i" :value="i"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="options">
              <div v-if="questionObj.form.question_type === 0" class="text">
                <el-input type="textarea" :rows="2" :placeholder="$l.inputContent"></el-input>
              </div>
              <div v-else-if="questionObj.form.question_type == 1 || questionObj.form.question_type == 2" class="radio-box">
                <div class="option-card" v-for="(i, index) in templateObj.radio" :key="index">
                  <div class="oprate">
                    <div>{{ $l.option }} {{ index + 1 }}</div>
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
                            <template slot="prepend">{{ $l.zh }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_en">
                            <template slot="prepend">{{ $l.en }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_vi">
                            <template slot="prepend">{{ $l.vi }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_tw">
                            <template slot="prepend">{{ $l.tw }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="input-box">
                          <el-switch v-model="i.is_correct" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ccc" :active-text="$l.correctAnswer"></el-switch>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <div v-else-if="questionObj.form.question_type == 3" class="judge">
                <div class="option-card" v-for="(i, index) in templateObj.judge" :key="index">
                  <div class="oprate">
                    <div>{{ $l.option }} {{ index + 1 }}</div>
                  </div>
                  <el-form label-width="60px" size="medium">
                    <el-row :gutter="10">
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_zh">
                            <template slot="prepend">{{ $l.zh }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_en">
                            <template slot="prepend">{{ $l.en }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_vi">
                            <template slot="prepend">{{ $l.vi }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="7">
                        <div class="input-box">
                          <el-input v-model="i.name_tw">
                            <template slot="prepend">{{ $l.tw }}</template>
                          </el-input>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="input-box">
                          <el-switch v-model="i.is_correct" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ccc" :active-text="$l.correctAnswer"></el-switch>
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
          <el-button type="primary" @click="submitQuestion">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.questionDrawer = false">{{ $l.close }}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="questionFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="$l.college">
            <el-select v-model="college_id" :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.titleFilter">
            <el-input v-model="questionObj.query.name"></el-input>
          </el-form-item>
          <el-form-item :label="$l.questionType">
            <el-select v-model="questionObj.query.question_type" @change="getQuestionList" clearable style="width: 100px">
              <el-option :label="$l.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_type" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.statusFilter">
            <el-select v-model="questionObj.query.question_status" @change="getQuestionList" clearable style="width: 100px">
              <el-option :label="$l.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_status" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionList">{{ $l.search }}</el-button>
            <el-button type="primary" @click="addQuestion">{{ $l.createQuestion }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="questionContent">
        <div class="catalogList">
          <div class="catalogFilter">
            <el-row :gutter="10">
              <el-col :span="20">
                <el-input v-model="filterCatalogText" :placeholder="$l.filterCatalog">
                  <el-select v-model="catalogObj.query.is_valid" slot="prepend" :placeholder="$l.status" style="width: 6em" @change="getCatalogList">
                    <el-option :label="$l.all" value=""></el-option>
                    <el-option :label="$l.enableFilter" value="Y"></el-option>
                    <el-option :label="$l.disableFilter" value="N"></el-option>
                  </el-select>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addCatalog">{{ $l.add }}</el-button>
              </el-col>
            </el-row>
          </div>
          <el-tree ref="catalogTree" node-key="id" :expand-on-click-node="false" :accordion="true" :default-expand-all="true" :data="catalogObj.list" :filter-node-method="filterCatalog">
            <div class="custom-catalog-tree" slot-scope="{ node, data }">
              <div class="catalogItem" @click="clickQuestionCatalog(data.id)">
                <div class="name">{{ data.name_label }}</div>
                <div class="btn">
                  <span class="edit" @click.stop="editCatalog(data)">{{ $l.edit }}</span>
                  <span v-if="data.is_valid == 'Y'" class="disable" @click.stop="modifyCatalogStatus(data)">{{ $l.disable }}</span>
                  <span v-else class="enable" @click.stop="modifyCatalogStatus(data)">{{ $l.enable }}</span>
                </div>
              </div>
            </div>
          </el-tree>
        </div>
        <div class="questionList">
          <div ref="tableContainer" style="height: calc(100% - 40px)">
          <a-table :dataSource="questionObj.list" :columns="tableColumns" :scroll="{ y: cssObj.tableMaxHeight }" rowKey="id">
            <template slot="question_type" slot-scope="text, record">
              {{ returnPublicObjLabel(record.question_type, 'value', 'label', 'question_type') }}
            </template>
            <template slot="question_status" slot-scope="text, record">
              {{ returnPublicObjLabel(record.question_status, 'value', 'label', 'question_status') }}
            </template>
            <template slot="actions" slot-scope="text, record">
              <el-button type="text" @click="editQuestion(record)">{{ $l.edit }}</el-button>
              <el-button v-if="record.is_valid == 'Y'" type="text" style="color: #ff0000" @click="toggleQuestionStatus(record)">{{ $l.disable }}</el-button>
              <el-button v-else class="text-green" type="text" @click="toggleQuestionStatus(record)">{{ $l.enable }}</el-button>
            </template>
          </a-table>
        </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="questionObj.query.page" :page-sizes="[5, 10, 15, 30, 50, 100]" :page-size="questionObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="questionObj.total" style="float: right"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { assignObject } from '@/utils'
export default {
  name: 'videoAdminQuestion',
  data() {
    return {
      college_id: null,
      filterCatalogText: '',
      showObj: {
        catalogDrawer: false,
        questionDrawer: false,
      },
      templateObj: {
        radio: [],
        fillin: [
          {
            id: '',
          },
        ],
        judge: [],
      },
      publicCodeObj: {
        catalogList: [],
        collegeList: [],
        question_type: [
          {
            label: this.$l.fillInBlank,
            value: 0,
          },
          {
            label: this.$l.singleChoice,
            value: 1,
          },
          {
            label: this.$l.multipleChoice,
            value: 2,
          },
          {
            label: this.$l.judgement,
            value: 3,
          },
        ],
        question_status: [
          {
            label: this.$l.unpublished,
            value: 0,
          },
          {
            label: this.$l.published,
            value: 1,
          },
        ],
      },
      cssObj: {
        tableMaxHeight: '500px',
        popoverWidth: '600px',
      },
      questionObj: {
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
      },
      catalogObj: {
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
      },
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    tableColumns() {
      return [
        {
          title: this.$l.serialNumber,
          dataIndex: 'index',
          key: 'index',
          width: 50,
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$l.question,
          dataIndex: 'name_label',
          key: 'name_label'
        },
        {
          title: this.$l.difficulty,
          dataIndex: 'difficulty_level',
          key: 'difficulty_level'
        },
        {
          title: this.$l.questionTypeColumn,
          dataIndex: 'question_type',
          key: 'question_type',
          scopedSlots: { customRender: 'question_type' }
        },
        {
          title: this.$l.publishStatusColumn,
          dataIndex: 'question_status',
          key: 'question_status',
          scopedSlots: { customRender: 'question_status' }
        },
        {
          title: this.$l.status,
          dataIndex: 'is_valid',
          key: 'is_valid',
          customRender: (text) => text == 'Y' ? this.$l.enableStatus : this.$l.disableStatus
        },
        {
          title: this.$l.actions,
          key: 'actions',
          fixed: 'right',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },

  watch: {
    filterCatalogText(val) {
      this.$refs.catalogTree.filter(val)
    },
    college_id(n, o) {
      this.questionObj.query.question_category_id = ''
      this.getQuestionList()
      this.getCatalogList()
    },
  },

  methods: {
    updateTableMaxHeight() {
      //返回表格最大高度
      const container = this.$refs.tableContainer
      if (container) {
        this.cssObj.tableMaxHeight = container.clientHeight + 'px'
      }
    },

    handleSizeChange(i) {
      this.questionObj.query.pageSize = i
      this.getQuestionList()
    },

    handlePageChange(i) {
      this.questionObj.query.page = i
      this.getQuestionList()
    },
    /*************    用户行为start    **************/
    //新建修改试题类型时，如果对应选项没有option时自动添加
    question_typeChange(v) {
      if (v == 1 || v == 2) {
        if (this.templateObj.radio.length == 0) {
          this.addOption()
        }
      } else if (v == 3) {
        if (this.templateObj.judge.length == 0) {
          this.templateObj.judge = [
            {
              id: '', //唯一id
              option_id: '', //选项内部标识
              pid: '', //问题的唯一id
              name_zh: '正确',
              name_tw: '正確',
              name_en: 'True',
              name_vi: 'Đúng',
              is_correct: false, //是否为正确答案
              sort: '', //选项的顺序索引（用于排序显示选项）
              is_valid: 'Y', //Y有效，N无效
              rec_status: 1, //0,1,7,99
            },
            {
              id: '', //唯一id
              option_id: '', //选项内部标识
              pid: '', //问题的唯一id
              name_zh: '错误',
              name_tw: '錯誤',
              name_en: 'False',
              name_vi: 'Sai',
              is_correct: false, //是否为正确答案
              sort: '', //选项的顺序索引（用于排序显示选项）
              is_valid: 'Y', //Y有效，N无效
              rec_status: 1, //0,1,7,99
            },
          ]
        }
      }
    },

    //用户点击分类时筛选试题
    clickQuestionCatalog(id) {
      this.questionObj.query.question_category_id = id
      this.getQuestionList()
    },

    //新增选项
    addOption() {
      //判断当前所选的题型，然后往对应数组里添加选项
      if (this.questionObj.form.question_type === 0) {
        this.templateObj.fillin.push({
          id: '', //唯一id
          option_id: '', //选项内部标识
          pid: '', //问题的唯一id
          name_zh: '',
          name_tw: '',
          name_en: '',
          name_vi: '',
          is_correct: false, //是否为正确答案
          sort: '', //选项的顺序索引（用于排序显示选项）
          is_valid: 'Y', //Y有效，N无效
          rec_status: 1, //0,1,7,99
        })
      } else if (this.questionObj.form.question_type === 3) {
        this.templateObj.judge.push({
          id: '', //唯一id
          option_id: '', //选项内部标识
          pid: '', //问题的唯一id
          name_zh: '',
          name_tw: '',
          name_en: '',
          name_vi: '',
          is_correct: false, //是否为正确答案
          sort: '', //选项的顺序索引（用于排序显示选项）
          is_valid: 'Y', //Y有效，N无效
          rec_status: 1, //0,1,7,99
        })
      } else {
        this.templateObj.radio.push({
          id: '', //唯一id
          option_id: '', //选项内部标识
          pid: '', //问题的唯一id
          name_zh: '',
          name_tw: '',
          name_en: '',
          name_vi: '',
          is_correct: false, //是否为正确答案
          sort: '', //选项的顺序索引（用于排序显示选项）
          is_valid: 'Y', //Y有效，N无效
          rec_status: 1, //0,1,7,99
        })
      }
    },

    //删除选项
    removeOption(i, filed) {
      this.templateObj[filed].splice(i, 1)
      if (this.templateObj[filed].length == 0) {
        this.addOption()
      }
    },

    /*************    用户行为end    **************/

    /*************    试题分类start    **************/
    //过滤试题分类
    catalogCollegeChange(v) {
      this.catalogObj.form.pid = ''
      this.getCatalogListById(v)
    },

    filterCatalog(value, data) {
      if (!value) return true
      return data.name_label.indexOf(value) !== -1
    },

    addCatalog() {
      this.catalogObj.form = {
        id: '',
        pid: '',
        pname: '',
        sort: '',
        name_zh: '',
        name_tw: '',
        name_en: '',
        name_vi: '',
        description: '',
        is_valid: 'Y',
        rec_status: 1,
        college_id: this.college_id,
      }
      this.showObj.catalogDrawer = true
    },

    editCatalog(data) {
      console.log(data)
      assignObject(this.catalogObj.form, data)
      this.getCatalogListById(data.college_id)
      this.showObj.catalogDrawer = true
    },

    modifyCatalogStatus(data) {
      let msg
      let status
      if (data.is_valid == 'Y') {
        msg = this.$l.disableCatalogConfirm.replace('{name}', data.name_label)
        status = 'N'
      } else {
        msg = this.$l.enableCatalogConfirm.replace('{name}', data.name_label)
        status = 'Y'
      }
      this.$prompt(msg, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: this.$l.inputError,
        confirmButtonText: this.$l.confirm,
        cancelButtonText: this.$l.cancel,
      })
        .then(() => {
          this.$request(
            this.$api.videoServer + '/Video/VideoExam/DeleteOrRecoveryCatagoryById',
            {
              key: data.id,
              value: status,
            },
            'post'
          ).then((r) => {
            this.$message({
              type: 'success',
              message: this.$l.modifySuccess,
            })
            this.getCatalogList()
          })
        })
        .catch(() => {
          console.log('取消操作')
        })
    },

    submitCatalog() {
      if (this.catalogObj.form.college_id == '') {
        return this.$message.error(this.$l.pleaseSelectCollege)
      }

      if (this.catalogObj.form.name_zh == '') {
        return this.$message.error(this.$l.pleaseInputNameZh)
      }
      if (this.catalogObj.form.pid == '') {
        this.catalogObj.form.pid == '0'
      }
      this.$request(this.$api.videoServer + '/Video/VideoExam/addQuestionCatagory', this.catalogObj.form, 'post')
        .then((r) => {
          if (r.httpCode == 200) {
            this.$message({
              type: 'success',
              message: this.$l.submitSuccess,
            })
            let timer = setTimeout(() => {
              this.showObj.catalogDrawer = false
              this.getCatalogList()
              clearTimeout(timer)
            }, 1500)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getCatalogList() {
      this.$request(this.$api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
        ...this.catalogObj.query,
        college_id: this.college_id,
      })
        .then((r) => {
          this.catalogObj.list = r.data
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getCatalogListById(id) {
      this.$request(this.$api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
        ...this.catalogObj.query,
        college_id: id,
      })
        .then((r) => {
          this.publicCodeObj.catalogList = r.data
        })
        .catch((e) => {
          console.log(e)
        })
    },

    /*************    试题分类end    **************/

    /*************    试题start    **************/

    questionCollegeChange(v) {
      this.questionObj.query.question_category_id = ''
      this.getCatalogListById(v)
    },

    addQuestion() {
      for (let key in this.templateObj) {
        if (this.templateObj.hasOwnProperty(key)) {
          this.templateObj[key] = []
        }
      }
      for (let key in this.questionObj.form) {
        if (this.questionObj.form.hasOwnProperty(key)) {
          this.questionObj.form[key] = ''
        }
      }
      this.questionObj.form = Object.assign(this.questionObj.form, {
        is_valid: 'Y',
        rec_status: 1,
        college_id: this.college_id,
      })
      this.getCatalogListById(this.college_id)
      this.showObj.questionDrawer = true
    },

    editQuestion(data) {
      console.log(data)
      assignObject(this.questionObj.form, data)
      this.getCatalogListById(data.college_id)
      if (this.questionObj.form.question_type === 0) {
        this.$set(this.templateObj, 'fillin', data.options)
      } else if (this.questionObj.form.question_type === 3) {
        this.$set(this.templateObj, 'judge', data.options)
      } else {
        this.$set(this.templateObj, 'radio', data.options)
      }
      this.showObj.questionDrawer = true
    },

    submitQuestion() {
      //判断当前所选的题型，然后往对应数组里添加选项

      if (this.questionObj.form.college_id == '') {
        return this.$message.error(this.$l.pleaseSelectCollege)
      }

      console.log(this.questionObj.form.question_type === 0)
      if (this.questionObj.form.question_type === 0) {
        this.questionObj.form.options = [
          {
            id: '',
          },
        ]
      } else if (this.questionObj.form.question_type === 3) {
        this.$set(this.questionObj.form, 'options', this.templateObj.judge)
      } else {
        this.$set(this.questionObj.form, 'options', this.templateObj.radio)
      }

      this.$request(this.$api.videoServer + '/Video/VideoExam/addQuestion', this.questionObj.form, 'post')
        .then((r) => {
          if (r.httpCode == 200) {
            this.$message({
              type: 'success',
              message: this.$l.submitSuccess,
            })
            let timer = setTimeout(() => {
              this.showObj.questionDrawer = false
              this.getQuestionList()
              clearTimeout(timer)
            }, 1500)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    toggleQuestionStatus(data) {
      let message
      let value
      if (data.is_valid == 'Y') {
        message = this.$l.disableQuestionConfirm.replace('{name}', data.name_label)
        value = 'N'
      } else {
        message = this.$l.enableQuestionConfirm.replace('{name}', data.name_label)
        value = 'Y'
      }

      this.$prompt(message, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: this.$l.inputError,
        confirmButtonText: this.$l.confirm,
        cancelButtonText: this.$l.cancel,
      })
        .then(() => {
          return this.$request(
            this.$api.videoServer + '/Video/VideoExam/toggleQuestionStatus',
            {
              id: data.id,
              value,
            },
            'post'
          )
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$l.modifySuccess,
          })
          this.getQuestionList()
        })
        .catch((err) => {
          if (err && err !== 'cancel' && err !== 'close') {
            console.error(err)
          } else {
            console.log('取消操作')
          }
        })
    },

    getQuestionList() {
      this.$request(this.$api.videoServer + '/Video/VideoExam/getQuestionList', {
        ...this.questionObj.query,
        college_id: this.college_id,
      })
        .then((r) => {
          this.questionObj.list = r.data.list
          this.questionObj.total = r.data.total
          this.updateTableMaxHeight()
        })
        .catch((e) => {
          console.log(e)
        })
    },

    /*************    试题end    **************/
    /*************    工具函数start    **************/

    //根据真实值返回显示值
    returnPublicObjLabel(inputValue, key, outputValue, filed) {
      let item = this.publicCodeObj[filed].find((i) => {
        return i[key] == inputValue
      })
      if (item) {
        return item[outputValue]
      } else {
        return inputValue
      }
    },

    getCollegeList() {
      // 根据页面路由获取管理学院
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
        resource_path: this.$route.path,
      })
        .then((r) => {
          this.publicCodeObj.collegeList = r.data
          this.college_id = r.data[0].id
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },

    /*************    工具函数end    **************/
  },
  mounted() {
    this.getCollegeList()
    // this.getCatalogList()
    // this.getQuestionList()
  },
}
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
