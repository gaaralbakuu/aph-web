<template>
  <div class="questionnaireManage-container">
    <div class="component">
      <el-dialog :title="$l.addQuestion" :visible.sync="showObj.questionDialog" @open='getQuestionList' width="80%">
        <div class="questionDialog">
          <div class="questionFilter">
            <el-form inline label-width="60px">
              <el-form-item :label="$l.college">
                <el-select v-model="questionObj.query.college_id" @change="questionCollegeChange">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.title">
                <el-input v-model="questionObj.query.name" @keydown.native.enter="getQuestionList"></el-input>
              </el-form-item>
              <el-form-item :label="$l.category">
                <el-cascader clearable style="width: 100%;" v-model="questionObj.query.question_category_id"
                  :options="publicCodeObj.questionCatagory" :props="{
                  label:'name_label',value:'id',checkStrictly:true
                }" :placeholder="$l.catalogRoot" @change="changCatalog"></el-cascader>
              </el-form-item>
              <el-form-item :label="$l.questionType">
                <el-select v-model="questionObj.query.question_type" style="width: 100px;" @change="getQuestionList">
                  <el-option :label="$l.all" value=""></el-option>
                  <el-option v-for="i in publicCodeObj.question_type" :key='i.value' :label="i.label"
                    :value="i.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.status">
                <el-select v-model="questionObj.query.question_status" style="width: 100px;" @change="getQuestionList">
                  <el-option :label="$l.all" value=""></el-option>
                  <el-option v-for="i in publicCodeObj.question_status" :key='i.value' :label="i.label"
                    :value="i.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getQuestionList">{{ $l.search }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="questionContent">
            <div class="questionList">
              <a-table :columns="questionColumns" :dataSource="questionObj.list" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              </a-table>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-drawer class="drawer" :visible.sync="showObj.questionnaireDrawer" :wrapperClosable='false' size="60%"
        @opened='getPopoverWidth'>
        <div slot='title' class="title">{{ $l.editQuestionnaire }}</div>
        <div class="form">

          <el-form label-width="5em" size="medium">
            <el-form-item :label="$l.attachedCollege">
              <el-select v-model="questionnaireObj.form.college_id" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.nameZh">
              <el-input v-model="questionnaireObj.form.name_zh">
              </el-input>
            </el-form-item>
            <el-form-item :label="$l.nameTw">
              <el-input v-model="questionnaireObj.form.name_tw">
              </el-input>
            </el-form-item>
            <el-form-item :label="$l.nameEn">
              <el-input v-model="questionnaireObj.form.name_en">
              </el-input>
            </el-form-item>
            <el-form-item :label="$l.nameVi">
              <el-input v-model="questionnaireObj.form.name_vi">
              </el-input>
            </el-form-item>
            <el-form-item :label="$l.addQuestion">
              <div ref="question_title">
                <el-button type="danger" plain @click="templateObj.question = []">{{ $l.clear }}</el-button>
                <el-button type="primary" plain @click="openDialogQuestion">{{ $l.add }}</el-button>
              </div>
            </el-form-item>
            <div class="questionList">
              <el-form-item v-for="(i,index) in templateObj.question" :key="index" :label="`${$l.question}${index+1}`">
                <div class="questionCard">
                  <div class="questionItem">
                    <el-input v-model="i.name_label" disabled style="width: 50%;">
                      <template slot="prepend">
                        <div class="prepend">
                          {{returnPublicObjLabel(i.question_type,'value','label','question_type')}}
                        </div>
                      </template>
                    </el-input>
                    <el-input v-model.number="i.score" style="width: 20%;">
                      <template slot="prepend">
                        <div class="prepend">
                          {{ $l.correctScore }}
                        </div>
                      </template>
                    </el-input>
                    <div style="width: 20%;display: flex;justify-content: space-between;">
                      <el-button type="danger" :style="{width: cssObj.popoverWidth*0.075+'px'}"
                        @click="deleteQuestionInFrom(index)">{{ $l.delete }}</el-button>
                      <el-popover placement="top-start" :title="i.name_label" :width.sync="cssObj.popoverWidth"
                        :offset="cssObj.popoverWidth*0.3" trigger="click">
                        <div class="options" style=" width: 100%;height: auto;min-height: 100px;">
                          <div v-if="i.question_type===0" class="text">
                            <el-input disabled type="textarea" :rows="2" :placeholder="$l.fillInTheBlank">
                            </el-input>
                          </div>
                          <div v-else class="radio-box" style=" width: 100%;">
                            <div class="option-card" v-for="(o,oIndex) in i.options" :key="oIndex"
                              style="border-radius: 5px;border: 1px solid #ddd; padding: 5px 10px; margin-bottom: 20px;">
                              <div class="oprate"
                                style="display: flex;align-items: center;justify-content: space-between;font-size: 16px;margin-bottom: 5px;border-bottom: 1px solid #ddd;padding-bottom: 5px;">
                                <div>{{ $l.option }}{{oIndex+1}}</div>
                              </div>
                              <el-form label-width="60px" size="medium">
                                <el-row :gutter="10">
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_zh" disabled>
                                        <template slot="prepend">{{ $l.zh }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span="7">
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_en" disabled>
                                        <template slot="prepend">{{ $l.en }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_tw" disabled>
                                        <template slot="prepend">{{ $l.tw }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_vi" disabled>
                                        <template slot="prepend">{{ $l.vi }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='3'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-switch disabled v-model="o.is_correct" :active-value="true"
                                        :inactive-value="false" active-color="#13ce66" inactive-color="#ccc"
                                        :active-text="$l.correctAnswer">
                                      </el-switch>
                                    </div>
                                  </el-col>
                                </el-row>
                              </el-form>
                            </div>
                          </div>
                        </div>
                        <el-button slot="reference" type="success" plain
                          :style="{width: cssObj.popoverWidth*0.075+'px'}">{{ $l.detail }}</el-button>
                      </el-popover>
                    </div>
                  </div>
                  <div v-show="i.question_type==2" class="questionItem_rule"
                    style="width: 100%;margin-top: 10px;display: flex;justify-content: space-between;">
                    <div style="width: 50%;display: flex;">
                      <div class="el-input-group__prepend" style="width: 7em;text-align:center;height: 36px;">
                        {{ $l.missOptionRule }}
                      </div>
                      <el-select v-model="i.rule" style="flex: 1;">
                        <el-option :label="$l.missOptionScore" :value="1"></el-option>
                        <el-option :label="$l.noScoreForMissOrWrong" :value="0"></el-option>
                      </el-select>
                    </div>
                    <el-input :disabled='i.rule!=1' v-model.number="i.rule_score" style="width: 20%;">
                      <template slot="prepend">
                        <div class="prepend" style="width: 4em;">
                          {{ $l.missOptionScore }}
                        </div>
                      </template>
                    </el-input>
                    <div style="width: 20%;"></div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitQuestionnaire">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.questionnaireDrawer=false">{{ $l.close }}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="questionnaireFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="$l.college">
            <el-select v-model="college_id" :clearable="isAdmin" @change="getQuestionnaireList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.title">
            <el-input v-model="questionnaireObj.query.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionnaireList">{{ $l.search }}</el-button>
            <el-button type="primary" @click="addQuestionnaire">{{ $l.newQuestionnaire }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="questionnaireContent">
        <div class="questionnaireList">
          <div ref="tableContainer" style="height:calc(100% - 40px) ;">
            <a-table :columns="questionnaireColumns" :dataSource="questionnaireObj.list" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
            </a-table>
          </div>
          <a-pagination :current.sync="questionnaireObj.query.page" :pageSize.sync="questionnaireObj.query.pageSize" :total="questionnaireObj.total" :pageSizeOptions="['5','10','15','30','50','100']" showSizeChanger @change="handlePageChange" @showSizeChange="handleSizeChange" style="float: right;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  import {
    assignObject
  } from '@/utils'
  export default {
    name: 'videoAdminQuestionnaire',
    data() {
      return {
        college_id: null,
        filterCatalogText: '',
        showObj: {
          questionDialog: false,
          questionnaireDrawer: false
        },
        templateObj: {
          question: []
        },

        publicCodeObj: {
          collegeList: [],
          questionCatagory: [],
          question_type: [{
              label: this.$l.fillBlank,
              value: 0
            },
            {
              label: this.$l.singleChoice,
              value: 1
            },
            {
              label: this.$l.multiChoice,
              value: 2
            },
            {
              label: this.$l.judgment,
              value: 3
            }
          ],
          question_status: [{
              label: this.$l.unpublished,
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
        questionnaireObj: {
          query: {
            page: 1,
            pageSize: 10,
            name: '',
            question_category_id: '',
            question_status: '',
            question_type: '',
          },
          form: {
            id: "",
            college_id: '',
            qid: "",
            name_zh: "",
            name_en: "",
            name_vi: "",
            name_tw: "",
            question: []
          },
          list: [],
          total: 0
        },
        questionObj: {
          list: [],
          total: 0,
          query: {
            college_id:"",
            page: 1,
            pageSize: 10,
            name: '',
            question_category_id: '',
            question_status: '',
            question_type: '',
          },
        }
      }
    },

    watch: {
      filterCatalogText(val) {
        this.$refs.catalogTree.filter(val);
      }
    },

    computed: {
      ...mapGetters(['isAdmin']),
      questionColumns() {
        return [
          { title: this.$l.serialNumber, key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
          { title: this.$l.question, dataIndex: 'name_label', key: 'question' },
          { title: this.$l.difficulty, dataIndex: 'difficulty_level', key: 'difficulty' },
          { title: this.$l.questionType, dataIndex: 'question_type', key: 'questionType', customRender: (text) => this.returnPublicObjLabel(text, 'value', 'label', 'question_type') },
          { title: this.$l.publishStatus, dataIndex: 'question_status', key: 'publishStatus', customRender: (text) => this.returnPublicObjLabel(text, 'value', 'label', 'question_status') },
          { title: this.$l.status, dataIndex: 'is_valid', key: 'status', customRender: (text) => text === 'Y' ? this.$l.enabled : this.$l.disabled },
          { title: this.$l.operation, key: 'operation', fixed: 'right', customRender: (text, record, index) => this.$createElement('a-button', { props: { type: 'text' }, on: { click: () => this.selectQuestion(record) } }, this.$l.select) }
        ]
      },
      questionnaireColumns() {
        return [
          { title: this.$l.serialNumber, key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
          { title: this.$l.nameZh, dataIndex: 'name_zh', key: 'nameZh' },
          { title: this.$l.nameTw, dataIndex: 'name_tw', key: 'nameTw' },
          { title: this.$l.nameEn, dataIndex: 'name_en', key: 'nameEn' },
          { title: this.$l.nameVi, dataIndex: 'name_vi', key: 'nameVi' },
          { title: this.$l.createTime, dataIndex: 'create_time', key: 'createTime' },
          { title: this.$l.updateTime, dataIndex: 'create_time', key: 'updateTime' },
          { title: this.$l.status, dataIndex: 'is_valid', key: 'status', customRender: (text) => text === 'Y' ? this.$l.enabled : this.$l.disabled },
          { title: this.$l.operation, key: 'operation', fixed: 'right', customRender: (text, record, index) => this.$createElement('div', {}, [
            this.$createElement('a-button', { props: { type: 'text' }, attrs: { class: 'text-yellow' }, on: { click: () => this.previewQuestionnaire(record.id) } }, this.$l.preview),
            this.$createElement('a-button', { props: { type: 'text' }, on: { click: () => this.editQuestionnaire(record.id) } }, this.$l.edit),
            record.is_valid === 'Y' ? this.$createElement('a-button', { props: { type: 'text' }, attrs: { class: 'text-red' }, on: { click: () => this.toggleQuestionnaireStatus(record) } }, this.$l.disable) : this.$createElement('a-button', { props: { type: 'text' }, attrs: { class: 'text-green' }, on: { click: () => this.toggleQuestionnaireStatus(record) } }, this.$l.enable)
          ]) }
        ]
      }
    },

    methods: {
      questionCollegeChange(){
        this.questionObj.query.question_category_id = ""
        this.getQuestionList()
        this.getQuestionCatagoryList()
      },

      getCollegeList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
            this.college_id = r.data[0].id
            this.questionObj.query.college_id = this.college_id
            this.getQuestionnaireList()
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      changCatalog(v) {
        this.questionObj.query.question_category_id = v[v.length - 1]
        this.getQuestionList()
      },

      getQuestionCatagoryList() {
        this.$request(this.$api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
          is_valid: '',
          college_id:this.questionObj.query.college_id
        }).then(r => {
          if (r.status) {
            this.publicCodeObj.questionCatagory = r.data
          }
        })
      },

      handleSizeChange(current, size) {
        this.questionnaireObj.query.page = current
        this.questionnaireObj.query.pageSize = size
        this.getQuestionnaireList()
      },

      handlePageChange(page) {
        this.questionnaireObj.query.page = page
        this.getQuestionnaireList()
      },

      deleteQuestionInFrom(index) {
        this.templateObj.question.splice(index, 1)
      },

      getPopoverWidth() {
        let container = this.$refs.question_title;
        if (container) {
          this.cssObj.popoverWidth = container.clientWidth;
        }
      },

      filterCatalog(value, data) {
        if (!value) return true;
        return data.name_label.indexOf(value) !== -1;
      },

      openDialogQuestion() {
        this.showObj.questionDialog = true
        this.getQuestionCatagoryList()
      },

      selectQuestion(data) {
        let temp = {
          id: "",
          questioinnaire_id: "",
          question_id: data.id,
          score: "",
          sort: "",
          rule: 0,
          rule_score: 0,
          name_label: data.name_label,
          question_type: data.question_type,
          options: data.options
        }
        this.templateObj.question.push(temp)
      },

      clickQuestionCatalog(id) {
        this.questionnaireObj.query.question_category_id = id
        this.getQuestionList()
      },

      addQuestionnaire() {
        for (let key in this.questionnaireObj.form) {
          if (this.questionnaireObj.form.hasOwnProperty(key)) {
            this.questionnaireObj.form[key] = '';
          }
        }
        this.templateObj.question = []
        this.showObj.questionnaireDrawer = true
      },

      editQuestionnaire(id) {
        this.$request(this.$api.baseUrl + '/Video/VideoExam/getQuestionnaire', {
            id: id,
            show_answer: true
          }, 'post')
          .then(r => {
            this.questionnaireObj.form = r.data
            this.templateObj.question = r.data.questions
            this.showObj.questionnaireDrawer = true
          })
      },

      toggleQuestionnaireStatus(data) {
        let msg
        let value
        if (data.is_valid == 'Y') {
          value = 'N'
          msg = this.$l.confirmDisable.replace('{name}', data.name_zh)
        } else {
          value = 'Y'
          msg = this.$l.confirmEnable.replace('{name}', data.name_zh)
        }
        this.$prompt(msg, {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: this.$l.inputErrorMessage,
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel
          }).then(() => {
            this.$request(this.$api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryQuestionnaireById', {
              key: data.id,
              value: value
            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message: this.$l.modifySuccess
              })
              this.getQuestionnaireList()
            })
          })
          .catch(() => {
            console.log('取消操作');
          })
      },

      previewQuestionnaire(id) {
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

      submitQuestionnaire() {
        if (this.questionnaireObj.form.college_id == '') {
          return this.$message.error(this.$l.selectCollege)
        }
        if (this.questionnaireObj.form.name_zh == '') {
          return this.$message.error(this.$l.inputNameZh)
        }
        if (this.templateObj.question.length == 0) {
          return this.$message.error(this.$l.addQuestionsToPaper)
        } else {
          this.$set(this.questionnaireObj.form, 'question', this.templateObj.question)
        }
        this.$request(this.$api.baseUrl + '/Video/VideoExam/addOrModifyQuestionnarie', this.questionnaireObj.form,
            'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.submitSuccess
              })
              let timer = setTimeout(() => {
                this.showObj.questionnaireDrawer = false
                this.getQuestionnaireList()
                clearTimeout(timer)
              }, 1500)
            }
          })
      },

      getQuestionnaireList() {
        this.$request(this.$api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
            ...this.questionnaireObj.query,
            college_id: this.college_id
          })
          .then(r => {
            this.questionnaireObj.list = r.data.list
            this.questionnaireObj.total = r.data.total
            let container = this.$refs.tableContainer;
            if (container) {
              this.cssObj.tableMaxHeight = container.clientHeight + 'px';
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      getQuestionList() {
        this.$request(this.$api.baseUrl + '/Video/VideoExam/getQuestionList', {
            ...this.questionObj.query
          })
          .then(r => {
            this.questionObj.list = r.data.list
            this.questionObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },

      returnPublicObjLabel(inputValue, key, outputValue, filed) {
        let item = this.publicCodeObj[filed].find(i => {
          return i[key] == inputValue
        })
        if (item) {
          return item[outputValue]
        } else {
          return inputValue
        }
      },
    },
    mounted() {
      this.getCollegeList()
    }
  }
</script>


<style>
.questionnaireManage-container {
  width: 100%;
  height: 100%;
}
.questionnaireManage-container .component .drawer .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.questionnaireManage-container .component .drawer .form {
  width: 95%;
  margin: 0 auto;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard {
  padding: 0px 0px 20px 0px;
  border-bottom: 1px dashed #ccc;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard .questionItem {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard .questionItem .prepend {
  width: 4em;
  text-align: center;
}
.questionnaireManage-container .component .drawer .buttonBar {
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
.questionnaireManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.questionnaireManage-container .pageBody .questionnaireFilter {
  width: 100%;
  height: 60px;
  padding: 15px 0px;
  white-space: nowrap;
  background-color: white;
  float: right;
  border-bottom: 1px #eee solid;
}
.questionnaireManage-container .pageBody .questionnaireContent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}
.questionnaireManage-container .pageBody .questionnaireContent .questionnaireList {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: white;
}
</style>
