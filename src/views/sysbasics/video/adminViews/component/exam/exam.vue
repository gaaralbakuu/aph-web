<template>
  <div class="examManage-container">
    <div class="component">

      <el-drawer class="drawer" :visible.sync="showObj.examDrawer" :wrapperClosable='false' size="60%">
        <div slot='title' class="title">{{ $l.editExam }}</div>
        <div class="form">
          <el-form label-width="5em" size="medium">
            <el-form-item :label="$l.belongCollege">
              <el-select v-model="examObj.form.college_id" :placeholder="$l.pleaseSelectCollege" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.chineseName">
              <el-input v-model="examObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="examObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="examObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.vietnameseName">
              <el-input v-model="examObj.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="$l.bindQuestionnaire">
              <el-input v-model="examObj.form.exam_name_zh" disabled>
                <template slot="append">
                  <el-button @click="showObj.questionnaireDialog=true"
                    style="background-color: #67C23A;color: white;">{{ $l.select }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$l.startTime">
                  <el-date-picker v-model="examObj.form.start_time" type="datetime"
                    :placeholder="$l.chooseStartTime" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$l.endTime">
                  <el-date-picker v-model="examObj.form.end_time" type="datetime"
                    :placeholder="$l.chooseEndTime" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="$l.maxAnswerTimes">
              <el-input v-model.number="examObj.form.max_reply_num"></el-input>
            </el-form-item>
            <el-form-item :label="$l.passScore">
              <el-input v-model.number="examObj.form.pass_score"></el-input>
            </el-form-item>
            <el-form-item :label="$l.examDuration">
              <el-input v-model="examObj.form.test_duration"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitExam">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.examDrawer=false">{{ $l.close }}</el-button>
        </div>
      </el-drawer>

      <el-dialog :visible.sync="showObj.questionnaireDialog" @open='getQuestionnaireList' width="60%">
        <el-form inline label-width="60px">
          <el-form-item :label="$l.collegeFilter">
            <el-select v-model="questionnaireObj.query.college_id" @change="getQuestionnaireList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.titleFilter">
            <el-input v-model="questionnaireObj.query.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionnaireList">{{ $l.search }}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="questionnaireTable" :data="questionnaireObj.list" tooltip-effect="dark" style="width: 100%"
          highlight-current-row highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
          :max-height="cssObj.tableMaxHeight" show-overflow-tooltip>
          <el-table-column type="index" width="50" label='No'></el-table-column>
          <el-table-column :label="$l.nameZhColumn" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.nameTwColumn" prop="name_tw"></el-table-column>
          <el-table-column :label="$l.nameEnColumn" prop="name_en"></el-table-column>
          <el-table-column :label="$l.nameViColumn" prop="name_vi"></el-table-column>
          <el-table-column :label="$l.createTimeColumn" prop="create_time"></el-table-column>
          <el-table-column :label="$l.updateTimeColumn" prop="modify_time"></el-table-column>
          <el-table-column :label="$l.statusColumn" prop="is_valid">
            <template slot-scope="scope">
              {{ scope.row.is_valid == 'Y' ? $l.statusEnabled : $l.statusDisabled }}
            </template>
          </el-table-column>
          <el-table-column :label="$l.operationColumn" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' class="text-green" @click="selectQueertionnarire(scope.row)">{{ $l.chooseButton }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <div class="pageBody">
      <div class="examFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="$l.collegeFilter">
            <el-select v-model="college_id" :clearable="isAdmin" @change="getExamList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.titleFilter">
            <el-input v-model="examObj.query.name" clearable @clear='getExamList'
              @keyup.native.enter="getExamList"></el-input>
          </el-form-item>
          <!-- <el-form-item label="题型">
            <el-select v-model="examObj.query.question_type">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_type" :key='i.value' :label="i.label"
                :value="i.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item :label="$l.filterStatus">
            <el-select v-model="examObj.query.is_valid" style="width: 100px;" @change="getExamList">
              <el-option :label="$l.allStatusOption" value=""></el-option>
              <el-option :label="$l.enabledStatusOption" value="Y"></el-option>
              <el-option :label="$l.disabledStatusOption" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getExamList">{{ $l.search }}</el-button>
            <el-button type="primary" @click="addExam">{{ $l.newExamButton }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="examContent">
        <div class="examList">
          <div ref="tableContainer" style="height:calc(100% - 40px);">
            <el-table ref="examTable" :data="examObj.list" tooltip-effect="dark" style="width: 100%"
              highlight-current-row highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
              :max-height="cssObj.tableMaxHeight" show-overflow-tooltip>
              <!-- <el-table-column type="selection" width="55"></el-table-column> -->
              <el-table-column type="index" width="50" label='No'></el-table-column>
              <el-table-column :label="$l.examNameColumn" prop="name_label"></el-table-column>
              <!-- <el-table-column :label="$l.nameZhColumn" prop="name_zh"></el-table-column> -->
              <!-- <el-table-column :label="$l.nameTwColumn" prop="name_tw"></el-table-column> -->
              <!-- <el-table-column :label="$l.nameEnColumn" prop="name_en"></el-table-column> -->
              <el-table-column :label="$l.passScoreColumn" prop="pass_score"></el-table-column>
              <el-table-column :label="$l.maxReplyNumColumn" prop="max_reply_num"></el-table-column>
              <el-table-column :label="$l.testDurationColumn" prop="test_duration"></el-table-column>
              <el-table-column :label="$l.startTimeColumn" prop="start_time"></el-table-column>
              <el-table-column :label="$l.endTimeColumn" prop="end_time"></el-table-column>
              <el-table-column :label="$l.isValidColumn" prop="is_valid"></el-table-column>
              <el-table-column :label="$l.operationColumn" fixed="right" width="180">
                <template slot-scope="scope">
                  <el-button class="text-yellow" type='text'
                    @click="previewExam(scope.row.questionnaire_id)">{{ $l.previewButton }}</el-button>
                  <el-button type='text' @click="editExam(scope.row)">{{ $l.editButton }}</el-button>
                  <el-button class="text-red" v-if="scope.row.is_valid=='Y'" type='text'
                    @click="toggleExamStatus(scope.row)">{{ $l.disableButton }}</el-button>
                  <el-button class="text-green" v-else type='text'
                    @click="toggleExamStatus(scope.row)">{{ $l.enableButton }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
            :current-page="examObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="examObj.query.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="examObj.total" style="float: right;">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    assignObject
  } from '@/utils'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'videoAdminExam',
    data() {
      return {
  college_id: null,
  showObj: {
    questionnaireDialog: false,
    examDrawer: false,
    recordDialog: false
  },
  questionnaireObj: {
    query: {
      page: 1,
      pageSize: 12,
      college_id: '',
      name: ''
    },
    list: []
  },
  publicCodeObj: {
    collegeList: [],
    question_type: [
      {
        label: this.$l.blankQuestion,
        value: 0
      },
      {
        label: this.$l.singleChoiceQuestion,
        value: 1
      },
      {
        label: this.$l.multipleChoiceQuestion,
        value: 2
      },
      {
        label: this.$l.trueFalseQuestion,
        value: 3
      }
    ],
    question_status: [
      {
        label: this.$l.notPublished,
        value: 0
      },
      {
        label: this.$l.published,
        value: 1
      }
    ]
  },
  cssObj: {
    tableMaxHeight: '500px',
    popoverWidth: "600px",
    headerRowStyle: {
      background: '#f2f4f9',
      color: '#505050',
      fontSize: '14px',
      height: '50px'
    }
  },

  currentExam: {
    id: '',
    questionnaire_id: '',
    max_reply_num: 0
  },
  examObj: {
    query: {
      page: 1,
      pageSize: 15,
      is_valid: "",
    },
    recordQuery: {
      userid: '',
      exam_id: '',
      questionnaire_id: '',
      page: 1,
      pageSize: 15,
    },
    form: {
      id: "",
      college_id:'',
      questionnaire_id: "",
      exam_name_zh: "",
      name_zh: "",
      name_tw: "",
      name_en: "",
      name_vi: "",
      start_time: "",
      end_time: "",
      max_reply_num: "",
      pass_score: "",
      test_duration: ""
    },
    list: [],
    record: [],
    total: 0,
    recordTotal: 0
  },
}
    },

    computed: {
      ...mapGetters(['isAdmin']),
    },

    methods: {
  getCollegeList() {
    // 根据页面路由获取管理学院
    this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
        resource_path: this.$route.path
      })
      .then((r) => {
        this.publicCodeObj.collegeList = r.data
        this.college_id = r.data[0].id
        this.questionnaireObj.query.college_id = this.college_id
        this.getExamList()
      })
      .catch((e) => {
        this.$message.error(e.message)
      })
  },

  handleSizeChange(i) {
    this.examObj.query.pageSize = i
    this.getExamList()
  },

  handlePageChange(i) {
    this.examObj.query.page = i
    this.getExamList()
  },

  selectQueertionnarire(data) {
    this.examObj.form.questionnaire_id = data.id
    this.examObj.form.exam_name_zh = data.name_zh
    this.showObj.questionnaireDialog = false
  },

  /*************    试题start    **************/

  addExam() {
    for (let key in this.examObj.form) {
      if (this.examObj.form.hasOwnProperty(key)) {
        this.examObj.form[key] = '';
      }
    }
    this.showObj.examDrawer = true
  },

  editExam(data) {
    assignObject(this.examObj.form, data)
    this.showObj.examDrawer = true
  },

  toggleExamStatus(data) {
    let msg
    let value
    if (data.is_valid == 'Y') {
      msg = this.$l.disableConfirmMessage.replace('{name}', data.name_zh)
      value = 'N'
    } else {
      msg = this.$l.enableConfirmMessage.replace('{name}', data.name_zh)
      value = 'Y'
    }

    this.$prompt(msg, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: this.$l.inputValidationFailed,
        confirmButtonText: this.$l.confirmButtonText,
        cancelButtonText: this.$l.cancelButtonText
      }).then(() => {
        this.$request(this.$api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryExamById', {
          key: data.id,
          value: value
        }, 'post').then(r => {
          this.$message({
            type: 'success',
            message: this.$l.operationSuccess
          })
          this.getExamList()
        })
      })
      .catch(() => {
        console.log('cancel');
      })
  },

  previewExam(id) {
    let url = this.$router.resolve({
      name: 'examDetail',
      query: {
        train_id: "",
        course_id: '',
        exam_id: '',
        questionnaire_id: id,
        mode: 'preview'
      }
    }).href;
    window.open(url, '_blank');
  },

  submitExam() {
    if (this.examObj.form.name_zh == '') {
      return this.$message.error(this.$l.pleaseEnterExamName)
    }
    if (this.examObj.form.questionnaire_id == '') {
      return this.$message.error(this.$l.pleaseBindQuestionnaire)
    }

    this.$request(this.$api.baseUrl + '/Video/VideoExam/addExam', this.examObj.form, 'post')
      .then(r => {
        if (r.httpCode == 200) {
          this.$message({
            type: 'success',
            message: this.$l.submitSuccess
          })
          let timer = setTimeout(() => {
            this.showObj.examDrawer = false
            this.getExamList()
            clearTimeout(timer)
          }, 1500)
        }
      })
  },

  getExamList() {
    this.$request(this.$api.baseUrl + '/Video/VideoExam/getExamList', {
        ...this.examObj.query,
        college_id: this.college_id
      })
      .then(r => {
        this.examObj.list = r.data.list
        this.examObj.total = r.data.total
        const container = this.$refs.tableContainer;
        if (container) {
          this.cssObj.tableMaxHeight = container.clientHeight + 'px';
        }
      })
      .catch(e => {
        console.log(e);
      })
  },

  getQuestionnaireList() {
    this.$request(this.$api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
      ...this.questionnaireObj.query,
    })
      .then(r => {
        this.questionnaireObj.list = r.data.list
      })
      .catch(e => {
        console.log(e);
      })
  },

  /*************    试题end    **************/
  /*************    工具函数start    **************/

  //根据真实值返回显示值
  returnPublicObjLabel(inputValue, key, outputValue, filed) {
    let item = this.publicCodeObj[filed].find(i => {
      return i[key] == inputValue
    })
    if (item) {
      return item[outputValue]
    } else {
      return inputValue
    }
  }

  /*************    工具函数end    **************/
},
    mounted() {
      this.getCollegeList()
    }
  }
</script>


<style>
.examManage-container {
  width: 100%;
  height: 100%;
}
.examManage-container .component .drawer .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.examManage-container .component .drawer .form {
  width: 95%;
  margin: 0 auto;
}
.examManage-container .component .drawer .buttonBar {
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
.examManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.examManage-container .pageBody .examFilter {
  width: 100%;
  height: 60px;
  padding: 15px 0px;
  white-space: nowrap;
  background-color: white;
  float: right;
  border-bottom: 1px #eee solid;
}
.examManage-container .pageBody .examContent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}
.examManage-container .pageBody .examContent .examList {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: white;
}
</style>
