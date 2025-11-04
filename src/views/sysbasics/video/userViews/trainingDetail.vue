<template>
  <div class="trainingDetail-container">
    <el-dialog class="examRecord-dialog" :title="$l.examRecord" :visible.sync="showObj.examDialog" width="50%">
      <el-table :data="examRecord" stripe style="width: 100%" max-height="350px" empty-text=" ">
        <el-table-column type="index" :label="$c.sn"></el-table-column>
        <el-table-column prop="create_time" :label="$l.examedTime"></el-table-column>
        <el-table-column prop="create_user" :label="$l.examUser"></el-table-column>
        <el-table-column prop="score" :label="$l.examScore"></el-table-column>
        <el-table-column :label="$c.operate" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="reviewExam(scope.row)">{{$l.check}}</el-button>
          </template>
        </el-table-column>
        <div slot="append">
          <div class="goToExam">
            <div class="detail">
              {{$l.mostExam}}
              <el-button class="num"
                type="text">{{currentExam.max_reply_num}}</el-button>{{$l.examUnit}}，{{$l.youCanExam}}
              <el-button class="num" type="text" :style="{
                color:currentExam.max_reply_num-examRecord.length<=0?'red':''
              }">{{currentExam.max_reply_num-examRecord.length}}</el-button>{{$l.examUnit}}
            </div>
            <div class="goToExam-btn">
              <el-button class="go" type="text" plain @click="goToExam"
                :disabled="currentExam.max_reply_num-examRecord.length<=0">{{$l.goExam}}</el-button>
            </div>
          </div>
        </div>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="showObj.examDialog = false">{{$c.close}}</el-button>
        <el-button type="success" plain @click="getReplyRecord(currentExam)">{{$l.refresh}}</el-button>
        <el-button type="primary" plain @click="showObj.examDialog = false">{{$c.close}}</el-button>
      </div>
    </el-dialog>

    <div class="page-body">
      <div class="course-info">
        <div class="cover">
          <el-image :src="require('@/assets/logo.png')" fit='cover'></el-image>
        </div>
        <div class="info">
          <div class="title" style="font-size: 28px;font-weight:bold;">
            <span class="status" style="color: skyblue;"><!-- [已结项??] --></span><span>{{trainingInfo.name_label}}</span>
          </div>
          <div class="item">
            <span class="label_text">{{$l.trainTime}}：</span><span class="text">{{trainingInfo.start_date.substr(0,10)}}
              ～ {{trainingInfo.end_date.substr(0,10)}}</span>
          </div>
          <div class="item">
            <span class="label_text">{{$l.implementDept}}：</span><span class="text">{{trainingInfo.create_dept}}</span>
          </div>
          <div class="item">
            <span class="label_text">{{$l.trainNum}}：</span><span class="text">{{trainingInfo.person_num}}</span>
          </div>
          <div class="item">
            <span class="label_text">{{$l.trainDesc}}：</span><span class="text">{{trainingInfo.description}}</span>
          </div>
        </div>
      </div>
      <div class="activity-container">
        <div class="left">
          <div class="title-label">
            {{$l.activityList}}
            {{$l.activityList}} <i class="el-icon-refresh-left text-blue"
              @click="getTrainingDetail(train_primary_id)"></i>
          </div>
          <!-- <div class="filter">
            <el-form :inline="true">
              <el-form-item label="活动名称">
                <el-input v-model="query.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="{{$c.startTime}}">
                <el-date-picker v-model="query.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="{{$c.endTime}}">
                <el-date-picker v-model="query.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div> -->
          <div class="activity">

            <el-collapse class="activity-collapse" v-model="activeNames" v-for="(i,index) in trainingActivity"
              :key="index">
              <el-collapse-item>
                <template slot="title">
                  <div class="collapse-title">{{i.name_label}}</div>
                </template>
                <div v-for="(x,xIndex) in i.detail" :key="xIndex">
                  <div class="video-item" v-show="x.type=='video'&&i.type=='0'">
                    <div class="cover">
                      <el-image height="120px" :src="$api.videoServer+'/'+ x.thumbnail_path"></el-image>
                    </div>
                    <div class="content">
                      <div class="course-name">
                        {{x.title}}
                      </div>
                      <div class="course-desc">
                        <span>{{i.duration}}</span>
                      </div>
                      <div class="course-desc">
                        <span>{{i.description}}</span>
                      </div>
                      <div class="course-desc">
                        <span>{{$c.startTime}}:2024-07-05 09:00</span>
                      </div>
                      <div class="course-desc">
                        <span>{{$c.endTime}}:2024-07-08 09:00</span>
                      </div>
                      <div class="status">
                        {{ i.is_must==1?$l.compulsory:$l.elective}}
                        {{ i.is_must==1?$l.compulsory:$l.elective}} <span :style="{
                          color: i.is_finish?'#00aa00':''
                        }">[{{i.is_finish?'已完成':'未完成'}}]</span>
                      </div>
                    </div>
                    <div class="btn-right">
                      <el-button type="primary" plain @click="goToCourse(x)">{{$l.check}}</el-button>
                    </div>
                  </div>
                  <div class="exam-item" v-show="x.type=='exam'&&i.type=='1'">
                    <!-- <div v-show="x.bind_id==null"> -->
                    <div class="cover">
                      <img src="../assets/exam.png" height="120px">
                    </div>
                    <div class="content">
                      <div class="course-name">
                        {{x.title}}
                      </div>
                      <div class="course-desc">
                        <span>{{$c.startTime}}:{{x.start_time}}</span>
                      </div>
                      <div class="course-desc">
                        <span>{{$c.endTime}}:{{x.end_time}}</span>
                      </div>

                      <div class="status">
                        {{ i.is_must==1?$l.compulsory:$l.elective}}
                        {{ i.is_must==1?$l.compulsory:$l.elective}}<span :style="{
                          color: i.is_finish?'#00aa00':''
                        }">[{{i.is_finish?'已完成':'未完成'}}]</span>
                      </div>
                    </div>
                    <div class="btn-right">
                      <el-button type="primary" plain @click="getReplyRecord(x)">{{$l.check}}</el-button>
                    </div>
                    <!-- </div> -->
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>


        <div class="right">
          <div class="count" style="height: 100%;">
            <div class="title-label">
              {{$l.activityProgress}}
              {{$l.activityProgress}} <i class="el-icon-refresh-left text-blue"
                @click="getLearningStatus(class_id)"></i>
            </div>
            <div class="status">
              <!-- 学习中 -->
            </div>
            <div class="status-box">
              <div class="status-item">
                <div class="status-label">
                  <span>{{$l.activityNum}}</span>
                  <span>{{learningObj.totalTask}}</span>
                </div>
                <div class="content">
                  <div style="width: max-content;">{{$l.activityComplete}}</div>
                  <div style="flex-grow: 1;"> <el-progress
                      :percentage="Math.floor(learningObj.finishTask / learningObj.totalTask)||0"></el-progress></div>
                  <div style="width: max-content;">{{$l.activityComplete}}</div>
                  <div style="flex-grow: 1;"> <el-progress
                      :percentage="Math.floor(learningObj.finishTask / learningObj.totalTask) *100||0"></el-progress>
                  </div>
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <span>{{$l.courseProgress}}</span>
                  <span>{{learningObj.courseNum}}</span>
                </div>
                <div class="content">
                  <div class="">
                    <span>{{$l.completed}}：{{learningObj.finishCourseNum}}</span><span
                      style="margin: 0 20px;">|</span><span>{{$l.uncomplete}}：{{learningObj.unfinishCourseNum}}</span>
                  </div>
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <span>{{$l.examProgress}}</span>
                  <span>{{learningObj.examNum}}</span>
                </div>
                <div class="content">
                  <div class="">
                    <span>{{$l.completed}}：{{learningObj.finishExamNum}}</span><span
                      style="margin: 0 20px;">|</span><span>{{$l.uncomplete}}：{{learningObj.unfinishExamNum}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="count">
            <div class="title-label">
              通知公告
            </div>
            <div class="message-box">
              <span> 暂无消息</span>
            </div>
          </div> -->
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
    name: "videoUserTrainDetail",
    data() {
      return {
        class_id: '',
        no_primary_train_id: '',
        train_primary_id: '',
        trainingInfo: {
          name_label: '',
          description: '',
          person_num: '',
          start_date: '',
          end_date: '',
          create_dept: '',
        },
        trainingActivity: [],
        showObj: {
          examDialog: false
        },
        currentExam: {
          id: '',
          questionnaire_id: '',
          max_reply_num: 0
        },
        examList: [],
        examRecord: [],
        activeNames: "",
        query: {
          name: "",
          startDate: "",
          endDate: ""
        },
        learningObj: {
          query: {
            page: 1,
            pageSize: 15
          },
          total: 0,
          list: [],
          unfinishCourse: [],
          unfinishExam: [],
          totalTask: 0,
          finishTask: 0,
          unfinishTask: 0,
          courseNum: 0,
          finishCourseNum: 0,
          unfinishCourseNum: 0,
          examNum: 0,
          finishExamNum: 0,
          unfinishExamNum: 0,
        }
      }
    },

    computed: {
      ...mapGetters(['user', 'isAdmin'])
    },

    methods: {

      getLearningStatus(id) {
        this.$request(this.$api.videoServer + '/Video/VideoAnalyze/getClassUserTrainLearingInfo', {
            page: 1,
            pageSize: 9999,
            class_id: id,
            userid: [this.user.userId]
          }, 'post')
          .then(r => {
            if (r.data.total > 0) {
              this.learningObj.total = r.data.total
              this.learningObj.list = r.data.list
              this.learningObj.courseNum = r.data.list[0].course_num
              this.learningObj.finishCourseNum = r.data.list[0].finsh_course_num
              this.learningObj.unfinishCourseNum = r.data.list[0].no_finsh_course_List.length
              this.learningObj.unfinishCourse = r.data.list[0].no_finsh_course_List
              this.learningObj.examNum = r.data.list[0].exam_num
              this.learningObj.finishExamNum = r.data.list[0].finsh_exam_num
              this.learningObj.unfinishExamNum = r.data.list[0].no_finsh_exam_List.length
              this.learningObj.unfinishExam = r.data.list[0].no_finsh_exam_List
              let tep = r.data.list[0]
              this.learningObj.courseNum = tep.course_num
              this.learningObj.finishCourseNum = tep.finsh_course_num
              this.learningObj.unfinishCourseNum = tep.no_finsh_course_List.length
              this.learningObj.unfinishCourse = tep.no_finsh_course_List
              this.learningObj.examNum = tep.exam_num
              this.learningObj.finishExamNum = tep.finsh_exam_num
              this.learningObj.unfinishExamNum = tep.no_finsh_course_exam_List.length + tep.no_finsh_course_exam_List
                .length
              this.learningObj.unfinishExam = tep.no_finsh_exam_List
              this.learningObj.totalTask = this.learningObj.courseNum + this.learningObj.examNum
              this.learningObj.unfinishTask = this.learningObj.unfinishCourseNum + this.learningObj.unfinishExamNum
              this.learningObj.finishTask = this.learningObj.totalTask - this.learningObj.unfinishTask
            }
          })
      },

      //跳转课程查看课程
      goToCourse(x) {
        if (x.type == 'video') {
          let routeUrl = this.$router.resolve({
            name: 'play',
            query: {
              train_primary_id: this.train_primary_id,
              no_primary_train_id: this.no_primary_train_id,
              course_primary_id: x.course_primary_id,
              no_primary_course_id: x.course_id,
              // is_his:1 //增加此处参数可能会导致课程查询失败
              train_primary_id: this.train_primary_id,
              no_primary_train_id: this.no_primary_train_id,
              course_primary_id: x.course_primary_id,
              no_primary_course_id: x.course_id,
              class_id:this.class_id
              // is_his:1 //增加此处参数可能会导致课程查询失败
            }
          }).href;
          window.open(routeUrl, '_blank');
        }
      },


      //马上考试
      goToExam() {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            questionnaire_id: this.currentExam.questionnaire_id,
            exam_id: this.currentExam.id, //需要传入有效exam_id
            no_primary_train_id: this.no_primary_train_id,
            train_primary_id: this.train_primary_id,
            course_primary_id: '',
            class_id: this.class_id,
            is_test: false,
            mode: 'exam'
          }
        }).href;
        window.open(url, '_blank');
      },

      //查看考试记录
      getReplyRecord(i) {
        this.currentExam = i
        this.$request(this.$api.videoServer + '/Video/VideoExam/getAnswerList', {
          questionnaire_id: i.questionnaire_id,
          userid: this.user.userId,
          train_id: this.no_primary_train_id,
          train_primary_id: this.train_primary_id,//加了train_primary_id可能会查询不出数据
          course_primary_id:'',//考试 不应该出现课程ID
          exam_id:i.id,
          class_id: this.class_id,
          train_id: this.no_primary_train_id,
          train_primary_id: this.train_primary_id, //加了train_primary_id可能会查询不出数据
          course_primary_id: '', //考试 不应该出现课程ID
          exam_id: i.id,
          class_id: this.class_id,
          page: 1,
          pageSize: 999
        }).then(r => {
          this.examRecord = r.data.list
          this.showObj.examDialog = true
        })
      },

      //查看考试
      reviewExam(data) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            exam_id: this.currentExam.id,
            questionnaire_id: this.currentExam.questionnaire_id,
            reply_id: data.id, //此处为回答记录主键
            mode: 'review'
          }
        }).href;
        window.open(url, '_blank');
      },

      //获取培训任务列表
      getTrainingDetail(id) {
        this.$request(this.$api.videoServer + '/Video/VideoTrain/ShowTrainDetil', {
          id: id
        }).then(r => {
          assignObject(this.trainingInfo, r.data) //获取培训详情
          this.no_primary_train_id = r.data.train_id
          this.train_primary_id = r.data.id
          this.trainingActivity = [] //清空活动章节
          r.data.detail.forEach(i => {
            let temp = {
              id: i.id,
              name_label: i.name_label,
              course_id: i.course_id,
              bind_id: i.bind_id,
              type: i.type,
              is_must: i.is_must,
              is_finish: i.is_finish,
              sort: i.sort,
              detail: []
            }
            i.detail.forEach(x => {
              if (x.video != null) {
                temp.detail.push({
                  type: 'video',
                  course_id: x.no_primary_course_id,
                  course_primary_id:x.course_id,
                  course_id: x.no_primary_course_id,
                  course_primary_id: x.course_id,
                  title: x.video.title,
                  is_process_question: x.video.is_process_question,
                  duration: x.video.duration,
                  url: x.video.url,
                  thumbnail_path: x.video.thumbnail_path,
                  description: x.video.description,
                })
              } else if (x.exam != null) {
                temp.detail.push({
                  type: 'exam',
                  id: x.exam.id,
                  title: x.exam.name_label ? x.exam.name_label : x.exam.name_zh,
                  questionnaire_id: x.exam.questionnaire_id,
                  start_time: x.exam.start_time,
                  end_time: x.exam.end_time,
                  max_reply_num: x.exam.max_reply_num,
                  pass_score: x.exam.pass_score,
                  test_duration: x.exam.test_duration
                })
              }
            })
            this.trainingActivity.push(temp)
          })
        })
      }

    },

    mounted() {
      this.class_id = this.$route.query.class_id
      this.getTrainingDetail(this.$route.query.train_primary_id)
      this.getLearningStatus(this.class_id)
    }
  }
</script>

<style scoped>
.goToExam {
  margin: 5px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.goToExam .detail {
  padding-left: 10px;
  width: calc(100% - 150px);
  white-space: nowrap;
  overflow: hidden;
}
.goToExam .detail .num {
  margin: 0 2px;
  font-size: 16px;
  font-weight: bold;
}
.goToExam .goToExam-btn {
  width: 150px;
  text-align: center;
}
.goToExam .goToExam-btn .go {
  z-index: 6000;
  border: none;
}
.goToExam .goToExam-btn .go:hover {
  border: none;
}

.trainingDetail-container {
  width: 100%;
  background-color: #fafafa;
}
.trainingDetail-container .page-body {
  width: 75%;
  margin: 0 auto;
  padding: 25px;
  min-width: 1000px;
}
.trainingDetail-container .page-body .course-info {
  width: 100%;
  height: 350px;
  padding: 25px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid #dadada;
  border-radius: 5px;
}
.trainingDetail-container .page-body .course-info .cover {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trainingDetail-container .page-body .course-info .info {
  flex-grow: 1;
  height: 100%;
}
.trainingDetail-container .page-body .course-info .info .item {
  width: 100%;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
.trainingDetail-container .page-body .activity-container {
  width: 100%;
  min-height: calc(100vh - 120px);
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
}
.trainingDetail-container .page-body .activity-container .left {
  width: calc(100% - 400px);
  min-height: 100%;
  border: 1px solid #dadada;
  border-radius: 5px;
  background-color: white;
}
.trainingDetail-container .page-body .activity-container .left .title-label {
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #dadada;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainingDetail-container .page-body .activity-container .left .filter {
  width: 100%;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trainingDetail-container .page-body .activity-container .left .activity {
  width: 95%;
  margin: 50px auto;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse {
  margin-bottom: 30px;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .collapse-title {
  width: 100%;
  background-color: #fafafa;
  text-indent: 2em;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item {
  width: 100%;
  height: 140px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item:hover {
  background-color: aliceblue;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .cover {
  width: 200px;
  height: 100%;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .content {
  width: calc(100% - 350px);
  height: 100%;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .content .course-name {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .content .course-desc {
  color: #999999;
  text-align: left;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .content .status {
  color: #999999;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .video-item .btn-right {
  text-align: center;
  width: 100px;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item {
  width: 100%;
  height: 140px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item:hover {
  background-color: aliceblue;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .cover {
  width: 200px;
  height: 100%;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .content {
  width: calc(100% - 350px);
  height: 100%;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .content .course-name {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .content .course-desc {
  color: #999999;
  text-align: left;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .content .status {
  color: #999999;
}
.trainingDetail-container .page-body .activity-container .left .activity .activity-collapse .exam-item .btn-right {
  text-align: center;
  width: 100px;
}
.trainingDetail-container .page-body .activity-container .right {
  width: 400px;
  height: auto;
}
.trainingDetail-container .page-body .activity-container .right .count {
  float: right;
  width: 95%;
  height: max-content;
  background-color: white;
  border: 1px solid #dadada;
  border-radius: 5px;
  padding-bottom: 1px;
  margin-bottom: 30px;
}
.trainingDetail-container .page-body .activity-container .right .count .title-label {
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #dadada;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.trainingDetail-container .page-body .activity-container .right .count .status {
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #409fee;
}
.trainingDetail-container .page-body .activity-container .right .count .status-box {
  width: 95%;
  margin: 0 auto;
}
.trainingDetail-container .page-body .activity-container .right .count .status-box .status-item {
  width: 100%;
  height: 65px;
  margin-bottom: 20px;
  padding: 0 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}
.trainingDetail-container .page-body .activity-container .right .count .status-box .status-item .status-label {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.trainingDetail-container .page-body .activity-container .right .count .status-box .status-item .content {
  width: 100%;
  display: flex;
}
.trainingDetail-container .page-body .activity-container .right .count .message-box {
  width: 90%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
