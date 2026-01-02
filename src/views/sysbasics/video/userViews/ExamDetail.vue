<template>
  <div class="examDetail-container">
    <div class="page-body" v-show='exam.questions.length'>
      <div class="examingContent">
        <div class="left">
          <div class="title">
            {{exam.name_label}}
          </div>
          <div class="content">
            <!-- <div class="type">
              单选题（共20分）
            </div> -->
            <div class="question">
              <div class="q_left">
                <span class="currentIndex">{{flagObj.currentIndex+1}}</span>
                <span> / {{exam.questions.length}}</span>
              </div>
              <div class="q_right">
                <div class="q_title">
                  {{currentQuestion.name_label}}
                </div>
                <div class="q_type">
                  {{returnPublicObjLabel(currentQuestion.question_type,'value','label','question_type')}}({{currentQuestion.score}}{{$l.point}})
                </div>
                <div class="q_options-box">
                  <div v-if="currentQuestion.question_type===0">
                    <el-input class="custom_disabled" :disabled="params.mode=='read'||params.mode=='review'"
                      @input="fillinChange" v-model="replyObj.questions[flagObj.currentIndex].check" type="textarea"
                      :rows="6"></el-input>
                  </div>
                  <el-checkbox-group class="custom_disabled" :disabled="params.mode=='read'||params.mode=='review'"
                    v-model="replyObj.questions[flagObj.currentIndex].check"
                    v-else-if="currentQuestion.question_type===2" @input="checkBoxChange">
                    <div class="q_options" v-for="i in currentQuestion.options" :key="i.id">
                      <el-checkbox :label="i.id" :name="i.id">{{i.name_label}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <el-radio-group class="custom_disabled" :disabled="params.mode=='read'||params.mode=='review'"
                    v-model="replyObj.questions[flagObj.currentIndex].check" v-else @input="radioChange">
                    <div class="q_options" v-for="i in currentQuestion.options" :key="i.id">
                      <el-radio :label="i.id" :value="i.id">{{i.name_label}}</el-radio>
                    </div>
                  </el-radio-group>
                </div>
                <div class="q_anwser" v-show="params.mode=='review'||params.mode=='read'">
                  <div class="score">{{$l.yourScore}}： <span
                      style="color: #409fee;">{{replyObj.questions[flagObj.currentIndex].real_score}}</span></div>
                  <div class="anwser">{{$l.yourAnswer}}： <span
                      style="color: #409fee;">{{replyObj.questions[flagObj.currentIndex].answer}}</span></div>
                  <div class="anwser">{{$l.realAnswer}}： <span
                      style="color: #409fee;">{{replyObj.questions[flagObj.currentIndex].realAnswer}}</span></div>
                </div>

                <div class="q_score" v-if="params.mode=='read'">
                  <div class="anwser">{{$l.modifyScore}}：
                    <span style="color: #409fee;"><el-input
                        v-model.number="modifyScoreObj.detail[flagObj.currentIndex].score"></el-input></span>
                  </div>
                  <div class="anwser">{{$l.modifyRemark}}：
                    <span style="color: #409fee;"><el-input
                        v-model="modifyScoreObj.detail[flagObj.currentIndex].remark"></el-input></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="next">
            <el-button type="primary" plain :disabled='flagObj.currentIndex==0'
              @click="flagObj.currentIndex--">{{$l.previousQuestion}}</el-button>
            <el-button type="primary" :disabled='flagObj.currentIndex==(exam.questions.length-1)'
              @click="flagObj.currentIndex++">{{$l.nextQuestion}}</el-button>
          </div>
        </div>

        <div class="right">
          <div class="result" v-show="params.mode=='review'||params.mode=='read'">
            <div class="item">
              <div style="font-size: 26px;">{{params.score}}</div>
              <div>
                <el-button type="success" plain>{{$l.qualified}}</el-button>
              </div>
            </div>
            <div class="item">
              <div>{{$l.answerSheet}}</div>
              <div>{{$l.examinee }}{{$l.examinee }}：{{user.userName}}</div>
            </div>
          </div>

          <div class="result" v-show="params.mode=='preview'">
            <!-- <div class="item">
            可能会有倒计时
              <div style="font-size: 26px;">100</div>
              <div>
                <el-button type="success" plain>合格</el-button>
              </div>
            </div> -->
            <div class="item">
              <div>{{$l.answerSheet}}</div>
              <div>{{$l.examinee }}：{{user.userName}}</div>
            </div>
          </div>


          <div class="examcard">
            <div class="desc">-{{$l.totalQuestions}} {{exam.questions.length}} {{$l.totalQuestionsLast}}，{{$l.totalScore}} {{exam.total_score}} 分-</div>
            <div v-show="params.mode=='review'||params.mode=='read'">
              <div class="num">
                <div class="num-item"><span>{{examNum.correct}}</span>{{$l.correct}}</div>
                <div class="num-item"><span>{{examNum.error}}</span>{{$l.error}}</div>
                <div class="num-item"><span>{{examNum.half}}</span>{{$l.half}}</div>
              </div>
              <div class="card">
                <div class="num" @click="flagObj.currentIndex = index" v-for="(i,index) in replyObj.questions"
                  :key="i.id" :style="{
                  color:'white',
                  backgroundColor:i.real_score==0?'orangered':(i.real_score==i.score?'limegreen':'orange')
                }">
                  <span>{{index+1}}</span>
                </div>
              </div>
            </div>
            <div v-show="params.mode=='preview'||params.mode=='exam'">
              <div class="num">
                <div class="num-item"><span>{{examNum.done}}</span>{{$l.done}}</div>
                <div class="num-item"><span>{{examNum.todo}}</span>{{$l.todo}}</div>
              </div>
              <div class="card">
                <div class="num" @click="flagObj.currentIndex = index" v-for="(i,index) in replyObj.questions"
                  :key="i.id" :style="{
                  color:flagObj.currentIndex==index?'white': (i.check.length?'white':'black'),
                  backgroundColor:flagObj.currentIndex==index?'#409fee':(i.check.length?'#00aa00':'#ddd')
                }">
                  <span>{{index+1}}</span>
                </div>
              </div>
            </div>

            <!-- <el-collapse v-model="activeNames">
              <el-collapse-item title="单选(共20分)" name="1">
                <div class="card">
                  <div class="num" v-for="i in 10" :key="i"><span>{{i}}</span></div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="多选(共60分)" name="2">
                <div class="card">
                  <div class="num" v-for="i in 20" :key="i"><span>{{10+i}}</span></div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="判断(共20分)" name="3">
                <div class="card">
                  <div class="num" v-for="i in 10" :key="i"><span>{{30+i}}</span></div>
                </div>
              </el-collapse-item>
            </el-collapse> -->
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="btn">
        <el-button type="primary" v-show="params.mode=='review'||params.mode=='preview'"
          @click="closeTab">{{$l.close}}</el-button>
        <el-button type="danger" v-show="params.mode=='read'" @click="submitModifyScore">{{$l.modifyScore}}</el-button>
        <el-button type="primary" v-show="params.mode=='exam'" @click="submitQuestionnaire"
          :disabled="examNum.todo>0||flagObj.submitted">{{$l.submit}}</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  import api from "@/api/index.js"
  export default {
    name: 'videoUserExamDetail',
    data() {
      return {
        api: api,
        modifyScoreObj: {
          reply_id: "",
          questionnaire_id: "",
          detail: [{
            score: ''
          }]
        },
        params: {
          class_id:'',
          exam_id: '', //必要参数
          train_id:"",
          course_id:'',
          questionnaire_id: '',
          reply_id: '',
          mode: '',
          score: 0
        },
        flagObj: {
          currentIndex: 0,
          submitted:false
        },
        publicCodeObj: {
          question_type: [{
              label: this.$l.fillIn,
              value: 0
            },
            {
              label: this.$l.radio,
              value: 1
            },
            {
              label: this.$l.checkbox,
              value: 2
            },
            {
              label: this.$l.judge,
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
        activeNames: '',
        exam: {
          total_score: 0,
          name_label: '',
          questions: [{
            name_label: '',
          }]
        },
        replyObj: {
          exam_id: "",
          train_id:"",
          course_id:"",
          questionnaire_id: "",
          class_id:"",
          questions: [{
            id: "",
            question_id: "",
            questionnaire_id: "",
            score: "",
            options: [{
              id: '',
              question_id: '',
              value: ''
            }],
            check: '',
            answer: '',
            realAnswer: ''
          }]
        },
        examNum: {
          done: 0,
          todo: 0,
          correct: 0,
          error: 0,
          half: 0
        }
      }
    },
    computed: {
      ...mapGetters(['user']),
      currentQuestion() {
        //计算出当前作答的题目，方便页面展示和方法操作
        return this.exam.questions[this.flagObj.currentIndex]
      },
    },
    methods: {
      closeTab() {
        this.$confirm(this.$l.closeTab, this.$l.prompt, {
          confirmButtonText: this.$l.close,
          cancelButtonText: this.$c.cancel,
          type: 'warning'
        }).then(() => {
          window.close()
        }).catch(() => {

        });
      },

      fillinChange(text) {
        if (text !== '') {
          this.replyObj.questions[this.flagObj.currentIndex].options = [{
            id: this.currentQuestion.options[0].id,
            question_id: this.currentQuestion.question_id,
            value: text
          }]
        } else {
          this.replyObj.questions[this.flagObj.currentIndex].options = []
        }
        this.returnExamNum()
      },

      //将用户作答的选项根据结果回填replyObj的questions数组对应元素中
      checkBoxChange(array) {
        let options = []
        array.forEach(v => {
          let selectedOption = this.currentQuestion.options.find(i => i.id == v)
          options.push({
            id: selectedOption.id,
            question_id: selectedOption.pid,
            value: selectedOption.id
          })
        })
        this.replyObj.questions[this.flagObj.currentIndex].options = options
        this.returnExamNum()
      },

      //将用户作答的选项根据结果回填replyObj的questions数组对应元素中
      radioChange(v) {
        let selectedOption = this.currentQuestion.options.find(i => i.id == v)
        this.replyObj.questions[this.flagObj.currentIndex].options = [{
          id: selectedOption.id,
          question_id: selectedOption.pid,
          value: selectedOption.id
        }]
        this.returnExamNum()
      },

      returnExamNum() {
        let done = 0
        let todo = 0
        this.replyObj.questions.forEach(i => {
          if (i.check.length > 0) {
            done++
          } else {
            todo++
          }
        })
        this.examNum = {
          done,
          todo
        }
      },

      //返回label
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

      //获取试卷题目并设置回传后端的replyObj结构
      getQuestionnaire(qid) {
        this.$request(this.api.baseUrl + '/Video/VideoExam/getQuestionnaire', {
            id: qid
          }, 'post')
          .then(r => {

            let replyObj = {
              exam_id: this.params.exam_id,
              train_id:this.params.no_primary_train_id,
              course_primary_id:this.params.course_id,
              questionnaire_id: qid,
              class_id:this.params.class_id,
              questions: []
            }
            let total_score = 0
            r.data.questions.forEach(i => {
              total_score += i.score

              if (i.question_type == 2) {
                replyObj.questions.push({
                  id: i.id,
                  question_id: i.question_id,
                  questionnaire_id: i.questionnaire_id,
                  score: i.score,
                  options: [],
                  check: []
                })
              } else {
                replyObj.questions.push({
                  id: i.id,
                  question_id: i.question_id,
                  questionnaire_id: i.questionnaire_id,
                  score: i.score,
                  options: [],
                  check: ''
                })
              }
            })
            this.replyObj = replyObj
            this.exam = r.data
            this.exam.total_score = total_score
            this.returnExamNum()
          })
      },

      submitQuestionnaire() {
        if (this.examNum.todo > 0) {
          return this.$message.error(`${this.$l.stillHave}${this.examNum.todo}${this.$l.toSubmit}`)
        }
        this.$request(this.api.baseUrl + '/Video/VideoExam/ReplyQuestionnaire', this.replyObj, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.submissionSuccess
              })
              this.flagObj.submitted = true
            }
          })
      },

      submitModifyScore() {
        let postData = {
          reply_id: this.params.reply_id,
          questionnaire_id: this.params.questionnaire_id,
          detail: this.modifyScoreObj.detail.filter(i => i.score !== '')
        }
        if (postData.length == 0) {
          return this.$message.error(this.$l.plsInputSCore)
        }
        this.$request(this.$api.videoServer + "/Video/VideoExam/modifyScore", postData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.modifySucceess
              })
            }
            console.log(r);
          })

      },

      getAnswerDetail(reply_id) {
        this.$request(this.$api.videoServer + '/Video/VideoExam/getAnswerDetail?reply_id=' + reply_id)
          .then(r => {
            let correct = 0
            let error = 0
            let half = 0
            let total_score = 0
            let totalRealScore = 0
            let replyObj = {
              questionnaire_id: this.params.questionnaire_id,
              questions: []
            }
            let modifyScoreObj = {
              reply_id: reply_id,
              questionnaire_id: this.params.questionnaire_id,
              detail: []
            }
            r.data.questions.forEach(i => {
              total_score += i.score
              totalRealScore += i.real_score


              modifyScoreObj.detail.push({
                question_id: i.question_id,
                score: "",
                remark: ""
              })
              if (i.real_score == i.score) {
                correct++
              } else if (i.real_score == 0) {
                error++
              } else {
                half++
              }
              if (i.question_type == 0) {
                let selected = i.options[0].value
                let realAnswer = this.$l.noStandardAnswer
                replyObj.questions.push({
                  id: i.id,
                  score: i.score,
                  real_score: i.real_score,
                  check: selected,
                  answer: selected,
                  realAnswer: realAnswer
                })
              } else if (i.question_type == 2) {
                let selected = []
                let answer = []
                let realAnswer = []
                i.options.forEach(o => {
                  if (o.value == o.id) {
                    selected.push(o.value)
                    answer.push(o.name_label)
                  }
                  if (o.is_correct) {
                    realAnswer.push(o.name_label)
                  }
                })
                replyObj.questions.push({
                  id: i.id,
                  score: i.score,
                  real_score: i.real_score,
                  check: selected,
                  answer: answer,
                  realAnswer: realAnswer
                })
              } else if (i.question_type == 1 || i.question_type == 3) {
                let selected = i.options.find(o => {
                  return o.value == o.id
                })
                let realAnswer = i.options.find(o => {
                  return o.is_correct == true
                }).name_label
                replyObj.questions.push({
                  id: i.id,
                  score: i.score,
                  real_score: i.real_score,
                  check: selected ? selected.value : '',
                  answer: selected ? selected.name_label : '',
                  realAnswer: realAnswer
                })
              }
            })
            this.params.score = totalRealScore
            this.modifyScoreObj = modifyScoreObj
            this.replyObj = replyObj
            this.exam = r.data
            this.exam.total_score = total_score
            this.examNum.correct = correct
            this.examNum.error = error
            this.examNum.half = half
          })
      }
    },
    mounted() {
      if (this.$route.params.questionnaire_id) {
        this.params = Object.assign(this.params,this.$route.params)
      } else {
        this.params = Object.assign(this.params,this.$route.query)
      }

      if (this.params.mode == 'exam' || this.params.mode == 'preview') {
        this.getQuestionnaire(this.params.questionnaire_id)
      } else {
        this.getAnswerDetail(this.params.reply_id)
      }
    }
  }
</script>

<style scoped>
.custom_disabled {
  width: 100%;
}
.custom_disabled ::v-deep .el-radio .el-radio__label {
  color: #606266 !important;
}
.custom_disabled ::v-deep .el-radio .el-radio__input {
  margin-bottom: px(5);
}
.custom_disabled ::v-deep .el-radio .el-radio__input.is-checked .el-radio__inner {
  background-color: #409fee;
  border-color: #409fee;
}
.custom_disabled ::v-deep .el-radio .el-radio__input.is-checked .el-radio__inner::after {
  background-color: #fff;
}
.custom_disabled ::v-deep .el-radio .el-radio__input .el-radio__inner {
  /* &:hover{
          border-color:hsl(216, 92%, 51%);
      } */
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__label {
  color: #606266 !important;
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__input {
  margin-bottom: px(5);
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #409fee;
  border-color: #409fee;
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #ffffff;
}
.custom_disabled ::v-deep .el-textarea__inner {
  background-color: white;
  color: #606266;
  border-color: #babfc5;
}

.examDetail-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.examDetail-container .page-body {
  position: fixed;
  top: 0px;
  left: 15%;
  width: 70%;
  min-width: 1000px !important;
  height: calc(100% - 60px);
  padding: 20px;
}
.examDetail-container .page-body .examingContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.examDetail-container .page-body .examingContent .left {
  width: 70%;
  height: 100%;
  background-color: white;
}
.examDetail-container .page-body .examingContent .left .title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding: 0 10px;
  font-size: 24px;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}
.examDetail-container .page-body .examingContent .left .content {
  width: 100%;
  height: calc(100% - 140px);
  padding: 30px;
  border-bottom: 1px solid #f5f5f5;
}
.examDetail-container .page-body .examingContent .left .content .type {
  height: 50px;
  font-size: 20px;
}
.examDetail-container .page-body .examingContent .left .content .question {
  height: calc(100% - 50px);
  display: flex;
}
.examDetail-container .page-body .examingContent .left .content .question .q_left {
  width: 5em;
  height: 100%;
  padding-right: 1em;
}
.examDetail-container .page-body .examingContent .left .content .question .q_left .currentIndex {
  font-size: 24px;
  color: #409fee;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right {
  padding: 5px;
  flex-grow: 1;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_title {
  font-size: 18px;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_type {
  margin: 20px 0px;
  color: darkgray;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_options {
  margin: 10px 0px;
  font-size: 16px;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_anwser,
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_score {
  width: 100%;
  font-size: 16px;
  padding: 25px;
  background-color: #f8f9fb;
  border-radius: 10px;
  border: 1px solid #e4ecfb;
  margin-top: 20px;
}
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_anwser .anwser,
.examDetail-container .page-body .examingContent .left .content .question .q_right .q_score .anwser {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.examDetail-container .page-body .examingContent .left .next {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.examDetail-container .page-body .examingContent .right {
  width: 27%;
  height: 100%;
  background-color: white;
  padding: 10px 25px;
}
.examDetail-container .page-body .examingContent .right .result {
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
}
.examDetail-container .page-body .examingContent .right .result .item {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.examDetail-container .page-body .examingContent .right .examcard {
  width: 100%;
  height: 100%;
}
.examDetail-container .page-body .examingContent .right .examcard .desc {
  width: 100%;
  text-align: center;
  padding: 30px 0px;
}
.examDetail-container .page-body .examingContent .right .examcard .num {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 40px;
  cursor: pointer;
}
.examDetail-container .page-body .examingContent .right .examcard .num .num-item span {
  font-size: 20px;
  padding-right: 5px;
}
.examDetail-container .page-body .examingContent .right .examcard .num .num-item:nth-child(1) span {
  color: limegreen;
}
.examDetail-container .page-body .examingContent .right .examcard .num .num-item:nth-child(2) span {
  color: orangered;
}
.examDetail-container .page-body .examingContent .right .examcard .num .num-item:nth-child(3) span {
  color: orange;
}
.examDetail-container .page-body .examingContent .right .examcard .card {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.examDetail-container .page-body .examingContent .right .examcard .card .num {
  margin: 5px;
  width: 32px;
  height: 32px;
  font-size: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.examDetail-container .bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  padding: 0 20%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
