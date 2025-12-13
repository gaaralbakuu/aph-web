<template>
  <div class="trainingManage-container">
    <div class="component">
      <el-drawer class="drawer-container" :visible.sync="showObj.classShow" :wrapperClosable='false' size="40%">
        <div slot='title' class="title">{{l.createClass}}</div>
        <div class="form-container">
          <div class="form">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="l.college" required>
                <el-select v-model="classObj.form.college_id" requird style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.simplifiedChineseTitle" required>
                <el-input v-model="classObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="l.traditionalChineseTitle">
                <el-input v-model="classObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="l.englishTitle">
                <el-input v-model="classObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="l.vietnameseTitle">
                <el-input v-model="classObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingContent" required>
                <el-input v-model="classObj.form.train_content"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingObjective" required>
                <el-input v-model="classObj.form.train_target"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingTarget" required>
                <el-input v-model="classObj.form.train_object"></el-input>
              </el-form-item>
              <el-form-item :label="l.affiliatedPlan" required>
                <el-input v-model="classObj.form.train_name_label" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectTraining=true"
                      style="background-color: #67C23A;color: white;">{{l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="l.classTeacher" required>
                <el-input v-model="classObj.form.teacher_name" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectUser = true"
                      style="background-color: #67C23A;color: white;">{{l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="l.startTime" required>
                <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="l.selectStartTime"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="l.endTime" required>
                <el-date-picker v-model="classObj.form.end_date" type="datetime" :placeholder="l.selectEndTime"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="buttonBar">
            <el-button type="primary" @click="handleSubmit">{{l.submit}}</el-button>
            <el-button type="danger" @click="showObj.classShow = false">{{l.close}}</el-button>
          </div>
        </div>
      </el-drawer>

      <el-dialog class="examRecord-dialog" :title="l.examRecord" :visible.sync="showObj.recordDialog" width="50%">
        <el-form :inline="true">
          <el-form-item :label="l.studentBarcode">
            <el-input v-model="examObj.recordQuery.userid" :placeholder="l.pleaseInput"
              @keyup.native.enter="getExamRecord" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getExamRecord">{{l.search}}</el-button>
          </el-form-item>
        </el-form>
        <a-table :dataSource="examObj.record" :scroll="{ y: 350 }" style="width: 100%">
          <a-table-column :title="l.serialNumber" type="index"></a-table-column>
          <a-table-column :title="l.examTime" dataIndex="create_time">
          </a-table-column>
          <a-table-column :title="l.studentName" dataIndex="create_user">
          </a-table-column>
          <a-table-column :title="l.score" dataIndex="score">
          </a-table-column>
          <a-table-column :title="l.operation" :width="150" align="center" fixed="right">
            <template slot-scope="text, record, index">
              <a-button class="text-green" type="link" size="small" @click="reviewExam(record)">{{l.viewDetails}}</a-button>
              <a-button type="link" size="small" @click="readExam(record)">{{l.correctPapers}}</a-button>
            </template>
          </a-table-column>
        </a-table>
        <a-pagination @showSizeChange="handleRecordSizeChange" @change="handleRecordPageChange"
          :current="examObj.recordQuery.page" :pageSizeOptions="['5','10', '15', '30', '50','100']"
          :pageSize="examObj.recordQuery.pageSize" :showSizeChanger="true" :showQuickJumper="true" :showTotal="(total, range) => `共 ${total} 条`"
          :total="examObj.recordTotal" style="float: right;">
        </a-pagination>
        <div slot="footer">
          <el-button type="primary" @click="showObj.recordDialog = false">{{l.close}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.courseDialog" width="70%">
        <a-table :dataSource='learningObj.unfinishCourse' style="width: 100%">
          <a-table-column :title='l.serialNumber' type="index" :width="50"></a-table-column>
          <a-table-column :title="l.name" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="l.description" dataIndex="description"></a-table-column>
        </a-table>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.examDialog" width="70%">
        <a-table :dataSource='learningObj.unfinishExam' style="width: 100%">
          <a-table-column :title='l.serialNumber' type="index" :width="50"></a-table-column>
          <a-table-column :title="l.name" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="l.passScore" dataIndex="pass_score"></a-table-column>
          <a-table-column :title="l.maxAttempts" dataIndex="max_reply_num"></a-table-column>
          <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
          <a-table-column :title="l.startTime" dataIndex="start_time"></a-table-column>
          <a-table-column :title="l.endTime" dataIndex="end_time"></a-table-column>
        </a-table>
      </el-dialog>

      <!-- 选择培训dialog -->
      <el-dialog :visible.sync="showObj.selectTraining" @open='getTrainingList' :title="l.selectTraining" width="75%">
        <div class="pageBody-filter">
          <el-form inline>
            <el-form-item :label="l.college">
              <el-select v-model="trainingObj.query.college_id" @change="getTrainingList"
                :placeholder="l.pleaseSelectCollege" :clearable="isAdmin">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.trainingName">
              <el-input v-model="trainingObj.query.name" clearable @clear='getTrainingList'
                @keyup.native.enter="getTrainingList"></el-input>
            </el-form-item>
            <el-form-item :label="l.status">
              <el-select v-model="trainingObj.query.is_valid" @change="getTrainingList" style="width: 100px;">
                <el-option :label="l.all" value=""></el-option>
                <el-option :label="l.enabled" value="Y"></el-option>
                <el-option :label="l.disabled" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item> <el-button type="success" @click="getTrainingList">{{l.search}}</el-button></el-form-item>
          </el-form>
        </div>

        <div class="tableContainer" ref="tableContainer">
          <a-table :dataSource='trainingObj.list' style="width: 100%">
            <a-table-column :title='l.serialNumber' type="index" :width="50">
            </a-table-column>
            <a-table-column :title="l.simplifiedChinese" dataIndex="name_zh"></a-table-column>
            <a-table-column :title="l.college" dataIndex="college_id">
              <template slot-scope="text, record, index">
                {{returnCollegeLabel(record.college_id)}}
              </template>
            </a-table-column>
            <a-table-column :title="l.startTime" dataIndex="start_date"></a-table-column>
            <a-table-column :title="l.endTime" dataIndex="end_date"></a-table-column>
            <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="l.operation" fixed="right">
              <template slot-scope="text, record, index">
                <a-button type='link' @click="selectTraining(record)">{{l.select}}</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </el-dialog>

      <!-- 选择用户dialog -->
      <el-dialog :visible="showObj.selectUser" @open="getUserList" width="75%" :show-close="false">
        <el-form inline>
          <el-form-item :label="l.userInfo">
            <el-input v-model="userObj.query.queryString" clearable @clear='getUserList'
              @keyup.native.enter="getUserList"></el-input>
          </el-form-item>
          <el-form-item :label="l.status">
            <el-select v-model="userObj.query.status" @change="getUserList">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.enabled" value="0"></el-option>
              <el-option :label="l.disabled" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getUserList">{{l.search}}</el-button></el-form-item>
        </el-form>
        <div class="tableContainer" ref="tableContainer">
          <a-table :dataSource='userObj.list' :scroll="{ y: 400 }" style="width: 100%">
            <a-table-column :title='l.serialNumber' type="index" :width="50">
            </a-table-column>
            <a-table-column :title="l.jobNumber" dataIndex="userid"></a-table-column>
            <a-table-column :title="l.name" dataIndex="username"></a-table-column>
            <a-table-column :title="l.department" dataIndex="department_t"></a-table-column>
            <a-table-column :title="l.position" dataIndex="work_name"></a-table-column>
            <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="l.operation" fixed="right">
              <template slot-scope="text, record, index">
                <a-button type='link' @click="selectUser(record)">{{l.select}}</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
        <div
          style="width: 100%;display: flex;align-items: center;height: 50px;justify-content: flex-end;padding-right: 20px;">
          <el-button type="danger" plain @click="showObj.selectUser = false">{{l.close}}</el-button>
        </div>
      </el-dialog>

      <!-- 新增或修改课程以及配套资源 -->
      <el-drawer class="drawer-container" direction='btt' :visible.sync="showObj.modifyClass" :wrapperClosable='false'
        size="95%">
        <div slot='title' class="title">{{l.manageClass}}</div>
        <el-tabs type="border-card" class="form-container" @tab-click="tabClick" v-model="showObj.activeTabName">
          <el-tab-pane :label="l.basicInfo" name="data">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="l.college">
                <el-select v-model="classObj.form.college_id" requird style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.simplifiedChineseTitle">
                <el-input v-model="classObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="l.traditionalChineseTitle">
                <el-input v-model="classObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="l.englishTitle">
                <el-input v-model="classObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="l.vietnameseTitle">
                <el-input v-model="classObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingContent">
                <el-input v-model="classObj.form.train_content"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingObjective">
                <el-input v-model="classObj.form.train_target"></el-input>
              </el-form-item>
              <el-form-item :label="l.trainingTarget">
                <el-input v-model="classObj.form.train_object"></el-input>
              </el-form-item>
              <el-form-item :label="l.affiliatedPlan">
                <el-input v-model="classObj.form.train_name_label" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectTraining=true"
                      style="background-color: #67C23A;color: white;">{{l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="l.classTeacher">
                <el-input v-model="classObj.form.teacher_name" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectUser = true"
                      style="background-color: #67C23A;color: white;">{{l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="l.startTime">
                    <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="l.selectStartTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="l.endTime">
                    <el-date-picker v-model="classObj.form.end_date" type="datetime" :placeholder="l.selectEndTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="display: flex;justify-content: center;">
              <el-button type="primary" @click="handleSubmit" style="width: 100px;">{{l.update}}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="l.taskList" name='task'>
            <a-table :dataSource="classObj.taskList" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title="l.serialNumber" type="index" :width="55"></a-table-column>
              <a-table-column :title="l.name" dataIndex="name_label"></a-table-column>
              <a-table-column :title="l.type" dataIndex="type">
                <template slot-scope="text, record, index">
                  {{record.type==1?l.exam:l.course}}
                </template>
              </a-table-column>
              <a-table-column :title="l.required" dataIndex="is_must">
                <template slot-scope="text, record, index">
                  {{record.is_must==1?l.required:l.elective}}
                </template>
              </a-table-column>
              <a-table-column :title="l.operation" fixed="right">
                <template slot-scope="text, record, index">
                  <a-button class="text-green" type='link' @click="previewDetail(record)">{{l.preview}}</a-button>
                  <a-button v-show="record.type==1" type='link' @click="getExamRecord(record)">{{l.statistics}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
          <el-tab-pane :label="l.classStudents" name="student">
            <div style="margin-bottom: 10px;display: flex;justify-content: space-between;">
              <div>
                <el-form inline>
                  <el-form-item :label="l.name">
                    <el-input v-model="studentObj.query.user_name"></el-input>
                  </el-form-item>
                  <el-form-item :label="l.status">
                    <el-select v-model="studentObj.query.is_valid">
                      <el-option :label="l.all" value=""></el-option>
                      <el-option :label="l.enabled" value="Y"></el-option>
                      <el-option :label="l.disabled" value="N"></el-option>
                    </el-select>
                    <el-button type="primary" @click="getClassmate(class_id)">{{l.search}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-button type="primary" plain @click="showObj.selectStudent = true">{{l.addStudents}}</el-button>
              </div>
            </div>
            <a-table :dataSource="studentObj.classmateList" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title="l.serialNumber" type="index" :width="55"></a-table-column>
              <a-table-column :title="l.barcode" dataIndex="userId"></a-table-column>
              <a-table-column :title="l.name" dataIndex="userName"></a-table-column>
              <a-table-column :title="l.department" dataIndex="department"></a-table-column>
              <a-table-column :title="l.position" dataIndex="workName"></a-table-column>
              <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
              <a-table-column :title="l.operation" fixed="right">
                <template slot-scope="text, record, index">
                  <a-button type='link' :class="record.is_valid=='Y'?'text-red':'text-green'" @click="toggleStudentStatus(record)">{{record.is_valid=='Y'?l.disable:l.enable}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
          <el-tab-pane :label="l.completionStatus" name="status" v-if='class_id!=""'>
            <a-table :dataSource='learningObj.list' :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title='l.serialNumber' type="index" :width="50"></a-table-column>
              <a-table-column :title="l.jobNumber" dataIndex="userid"></a-table-column>
              <a-table-column :title="l.name" dataIndex="name_t"></a-table-column>
              <a-table-column :title="l.department" dataIndex="dept_no"></a-table-column>
              <a-table-column :title="l.departmentName" dataIndex="department_t"></a-table-column>
              <a-table-column :title="l.courseCount" dataIndex="course_num">
                <template slot-scope="text, record, index">
                  <div class='total-num'>
                    {{record.course_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.completedCourses" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkCourse(record.finsh_course_List,l.completedCourses)" class='finish-num'>
                    {{record.finsh_course_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.unfinishedCourses" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkCourse(record.no_finsh_course_List,l.unfinishedCourses)" class='unfinish-num'>
                    {{record.no_finsh_course_List.length}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.examCount" dataIndex="exam_num">
                <template slot-scope="text, record, index">
                  <div class='total-num'>
                    {{record.exam_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.completedExams" dataIndex="finsh_exam_num">
                <template slot-scope="text, record, index">
                  <div @click="checkExam([...record.finsh_course_exam_List,...record.finsh_train_exam_List],l.completedExams)" class='finish-num'>
                    {{record.finsh_exam_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.unfinishedExams" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkExam([...record.no_finsh_course_exam_List,...record.no_finsh_train_exam_List],l.unfinishedExams)" class='unfinish-num'>
                    {{record.no_finsh_course_exam_List.length + record.no_finsh_train_exam_List.length}}
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
        </el-tabs>
        <div class="buttonBar">
          <el-button type="danger" @click="showObj.modifyClass = false">{{l.close}}</el-button>
        </div>
      </el-drawer>

      <chooseUser :visible.sync="showObj.selectStudent" :useridList.sync="studentObj.setClassmateList"
        @submmit="submmitClassmate"></chooseUser>
    </div>

    <div class="pageBody">
      <div class="pageBody-filter">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="classObj.query.college_id" @change="getClassList" :placeholder="l.pleaseSelectCollege"
              :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.className">
            <el-input v-model="classObj.query.name" clearable @clear='getClassList'
              @keyup.native.enter="getClassList"></el-input>
          </el-form-item>
          <el-form-item :label="l.status">
            <el-select v-model="classObj.query.is_valid" @change="getClassList">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.enabled" value="Y"></el-option>
              <el-option :label="l.disabled" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getClassList">{{l.search}}</el-button></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="addClass">{{l.create}}</el-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <a-table :dataSource='classObj.list' :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
          <a-table-column :title='l.serialNumber' type="index" :width="50">
          </a-table-column>
          <a-table-column :title="l.simplifiedChinese" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="l.college" dataIndex="college_id">
            <template slot-scope="text, record, index">
              {{returnCollegeLabel(record.college_id)}}
            </template>
          </a-table-column>
          <a-table-column :title="l.affiliatedPlan" dataIndex="train_name_label"></a-table-column>
          <a-table-column :title="l.trainingContent" dataIndex="train_content"></a-table-column>
          <a-table-column :title="l.trainingObjective" dataIndex="train_target"></a-table-column>
          <a-table-column :title="l.trainingTarget" dataIndex="train_object"></a-table-column>
          <a-table-column :title="l.classTeacher" dataIndex="class_teacher">
            <template slot-scope="text, record, index">
              <div v-if="record.class_teacher"> {{record.tearcher[0].name_t}}</div>
            </template>
          </a-table-column>
          <a-table-column :title="l.startTime" dataIndex="start_date"></a-table-column>
          <a-table-column :title="l.endTime" dataIndex="end_date"></a-table-column>
          <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
          <a-table-column :title="l.operation" fixed="right">
            <template slot-scope="text, record, index">
              <a-button type='link' @click="modifyClass(record)">{{l.manage}}</a-button>
              <a-button v-if="record.is_valid=='N'" type='link' style="color: seagreen;" @click="modifyStatus(record)">{{l.enable}}</a-button>
              <a-button v-else type='link' style="color: red;" @click="modifyStatus(record)">{{l.disable}}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>

      <div class="trainingManage-pagenation">
        <a-pagination @showSizeChange="handleSizeChange" @change="handlePageChange"
          :current="classObj.query.page" :pageSizeOptions="['5','10', '15', '30', '50','100']" :pageSize="classObj.query.pageSize"
          :showSizeChanger="true" :showQuickJumper="true" :showTotal="(total, range) => `共 ${total} 条`"
          :total="classObj.total" style="float: right;">
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import chooseUser from '@/views/_common/ChooseUser.vue'
import Sortable from 'sortablejs'

const instance = getCurrentInstance()
const { $request, $message, $prompt, $confirm } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminClass')
const queryClient = useQueryClient()

// State
const class_id = ref('')
const train_id = ref('')

const showObj = reactive({
  selectUser: false,
  activeTabName: 'data',
  selectCourse: false,
  selectTraining: false,
  classShow: false,
  coverDialog: false,
  initSortable: false,
  modifyClass: false,
  selectStudent: false,
  chooseUser: false,
  courseDialog: false,
  examDialog: false,
  recordDialog: false,
  courseAndExamDialogTitle: ''
})

const cssObj = reactive({
  tableMaxHeight: '500px',
  headerRowStyle: {
    background: '#f2f4f9',
    color: '#505050',
    fontSize: '14px',
    height: '50px'
  }
})

const trainingObj = reactive({
  query: {
    college_id: "",
    page: 1,
    pageSize: 10,
    name: "",
    is_valid: ''
  },
  list: [],
  total: 0
})

const userObj = reactive({
  query: {
    page: 1,
    size: 10,
    queryString: "",
    status: '0'
  },
  list: [],
  total: 0
})

const studentObj = reactive({
  query: {
    page: 1,
    size: 10,
    user_name: "",
    user_id: "",
    is_valid: 'Y',
    class_id: ''
  },
  setClassmateList: [],
  classmateList: [],
})

const classObj = reactive({
  taskList: [],
  query: {
    page: 1,
    pageSize: 10,
    name: "",
    train_id: '',
    college_id: "",
    is_valid: ''
  },
  form: {
    id: "",
    college_id: "",
    train_name_label: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    start_date: "",
    end_date: "",
    is_valid: "Y",
    rec_status: 1,
    class_teachers: [""],
    tearcher: [{
      name_t: ''
    }],
    teacher_name: '',
    train_content: "",
    train_target: "",
    train_object: "",
  },
  list: [],
  total: 0
})

const publicCodeObj = reactive({
  collegeList: [],
})

const learningObj = reactive({
  query: {
    page: 1,
    pageSize: 15
  },
  total: 0,
  list: [],
  unfinishCourse: [],
  unfinishExam: []
})

const examObj = reactive({
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
    questionnaire_id: "",
    exam_name_zh: "",
    name_zh: "",
    name_tw: "",
    name_vi: "",
    name_en: "",
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
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

// Queries
const { data: collegeListData, refetch: refetchCollege } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path
  })
})

watch(() => collegeListData.value, (newVal) => {
  if (newVal) {
    publicCodeObj.collegeList = newVal.data
    if (!isAdmin.value && publicCodeObj.collegeList.length > 0) {
      classObj.query.college_id = publicCodeObj.collegeList[0].id
      trainingObj.query.college_id = publicCodeObj.collegeList[0].id
    }
    refetchClassList()
  }
})

const { data: classListData, refetch: refetchClassList } = useQuery({
  queryKey: ['classList', classObj.query],
  queryFn: () => $request(api.videoServer + '/Video/VideoTrain/getClass', classObj.query),
  enabled: false // Triggered manually or after college list
})

watch(() => classListData.value, (newVal) => {
  if (newVal && newVal.httpCode == 200) {
    classObj.list = newVal.data.list
    classObj.total = newVal.data.total
    if (newVal.data.total == 0) {
      $message.info(l.tempNoData)
    }
  }
})

const { data: trainingListData, refetch: refetchTrainingList } = useQuery({
  queryKey: ['trainingList', trainingObj.query],
  queryFn: () => $request(api.videoServer + '/Video/VideoTrain/getlist', trainingObj.query),
  enabled: false
})

watch(() => trainingListData.value, (newVal) => {
  if (newVal && newVal.httpCode == 200) {
    trainingObj.list = newVal.data.list
    trainingObj.total = newVal.data.total
    if (newVal.data.total == 0) {
      $message.info(l.tempNoData)
    }
  }
})

const { data: userListData, refetch: refetchUserList } = useQuery({
  queryKey: ['userList', userObj.query],
  queryFn: () => $request(api.videoServer + '/Platform/user/getlist', userObj.query),
  enabled: false
})

watch(() => userListData.value, (newVal) => {
  if (newVal && newVal.httpCode == 200) {
    userObj.list = newVal.data.list
    userObj.total = newVal.data.total
    if (newVal.data.total == 0) {
      $message.info(l.tempNoData)
    }
  }
})

// Mutations and other Logic

const getLearningStatus = (id) => {
  $request(api.videoServer + '/Video/VideoAnalyze/getClassUserTrainLearingInfo', {
    ...learningObj.query,
    class_id: id
  }, 'post').then(r => {
    learningObj.total = r.data.total
    learningObj.list = r.data.list
  })
}

const getClassmate = (cid) => {
  if (cid) {
    studentObj.query.class_id = cid
  }
  $request(api.videoServer + '/Video/VideoTrain/getClassUser', studentObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        studentObj.classmateList = r.data.list
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const getTaskList = (id) => {
  $request(api.videoServer + '/Video/VideoTrain/ShowTrainDetil', {
    train_id: id
  }).then(r => {
    classObj.taskList = r.data.detail
  })
}

const getExamRecord = (data) => {
  if (data) {
    let exam = null
    if (data.detail) {
      exam = data.detail.find(i => i.exam != null)?.exam
    }

    if (exam) {
      examObj.recordQuery.exam_id = exam.id
      examObj.recordQuery.questionnaire_id = exam.questionnaire_id
    }
  }

  $request(api.videoServer + '/Video/VideoExam/getAnswerList', {
    ...examObj.recordQuery,
    class_id: class_id.value,
    train_id: train_id.value
  }).then(r => {
    examObj.record = r.data.list
    examObj.recordTotal = r.data.total
    showObj.recordDialog = true
  })
}

const submitClassMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoTrain/addOrModifyClass', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      showObj.classShow = false
      refetchClassList()
    }
  }
})

const modifyStatusMutation = useMutation({
  mutationFn: ({ key, value }) => $request(api.videoServer + '/Video/VideoTrain/ModifyClassStatus', { key, value }, 'post'),
  onSuccess: () => {
    $message.success(l.operationSuccess)
    refetchClassList()
  }
})

const toggleStudentStatusMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoTrain/setUserIntoTrain', data, 'post'),
  onSuccess: (r, variables) => {
    getClassmate(class_id.value)
    const isEnable = variables[0].is_valid === 'Y' // if we sent Y, it is now enabled
    // Wait, the logic in original was: is_valid: user.is_valid == 'Y' ? 'N' : 'Y'
    // So if sent Y, it means enabled.
    $message.success(isEnable ? l.enableSuccess : l.disableSuccess)
  }
})

const submitClassmateMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoTrain/setUserIntoTrain', data, 'post'),
  onSuccess: () => {
    getClassmate(class_id.value)
  }
})

// Functions
const tabClick = (v) => {
  if (v.name == 'status') {
    getLearningStatus(class_id.value)
  } else if (v.name == 'student') {
    getClassmate(class_id.value)
  } else if (v.name == 'task') {
    getTaskList(train_id.value)
  }
}

const checkCourse = (v, label) => {
  showObj.courseAndExamDialogTitle = label
  if (v.length > 0) {
    learningObj.unfinishCourse = v
    showObj.courseDialog = true
  } else {
    $message.info(l.tempNoData)
  }
}

const checkExam = (v, label) => {
  showObj.courseAndExamDialogTitle = label
  if (v.length > 0) {
    learningObj.unfinishExam = v
    showObj.examDialog = true
  } else {
    $message.info(l.tempNoData)
  }
}

const previewDetail = async (i) => {
  if (i.type === '0' || i.type === 0) {
    let routeUrl = router.resolve({
      name: 'play',
      query: {
        course_id: i.bind_id,
      }
    }).href;
    window.open(routeUrl, '_blank');
  } else {
    let questionnaire_id
    if (i.questionnaire_id) {
      questionnaire_id = i.questionnaire_id
    } else {
      let res = await $request(api.videoServer + '/Video/VideoExam/getExamList', {
        id: i.bind_id,
      })
      questionnaire_id = res.data.list[0].questionnaire_id
    }

    let url = router.resolve({
      name: 'examDetail',
      query: {
        train_id: "",
        course_id: '',
        exam_id: '',
        questionnaire_id: questionnaire_id,
        mode: 'preview'
      }
    }).href;
    window.open(url, '_blank');
  }
}

const getCollegeList = () => {
  refetchCollege()
}

const submmitClassmate = () => {
  let postData = []
  if (studentObj.setClassmateList.length == 0) {
    return $message.error(l.addUserCannotBeEmpty)
  }

  studentObj.setClassmateList.forEach(e => {
    let j = {
      id: "",
      userid: e,
      class_id: class_id.value,
      train_id: train_id.value,
      is_valid: "Y",
      rec_status: 1
    }
    postData.push(j)
  })
  submitClassmateMutation.mutate(postData)
}

const toggleStudentStatus = (user) => {
  $confirm(user.is_valid === 'Y' ? l.confirmDisable : l.confirmEnable, l.tip, {
    confirmButtonText: l.confirm,
    cancelButtonText: l.cancel,
    type: 'warning',
    center: true
  }).then(() => {
    let j = {
      id: user.id,
      userid: user.userId,
      class_id: class_id.value,
      train_id: train_id.value,
      is_valid: user.is_valid == 'Y' ? 'N' : 'Y',
      rec_status: 1
    }
    toggleStudentStatusMutation.mutate([j])
  }).catch(() => {
    $message.info(l.operationCanceled)
  });
}

const returnCollegeLabel = (college_id) => {
  let college = publicCodeObj.collegeList.find(i => i.id == college_id)
  if (college) {
    return college.name_label
  } else {
    return ""
  }
}

const selectTraining = (data) => {
  classObj.form.college_id = data.college_id
  classObj.form.train_name_label = data.name_label
  classObj.form.train_id = data.train_id
  showObj.selectTraining = false
}

const handleRecordSizeChange = (i) => {
  examObj.recordQuery.pageSize = i
  getExamRecord()
}

const handleRecordPageChange = (i) => {
  examObj.recordQuery.page = i
  getExamRecord()
}

const reviewExam = (data) => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: train_id.value,
      class_id: class_id.value,
      course_id: '',
      exam_id: data.id,
      questionnaire_id: data.questionnaire_id,
      reply_id: data.id,
      mode: 'review'
    }
  }).href;
  window.open(url, '_blank');
}

const readExam = (data) => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: train_id.value,
      class_id: class_id.value,
      course_id: '',
      exam_id: data.id,
      questionnaire_id: data.questionnaire_id,
      reply_id: data.id,
      mode: 'read'
    }
  }).href;
  window.open(url, '_blank');
}

const getTrainingList = () => {
  refetchTrainingList()
}

const getUserList = () => {
  refetchUserList()
}

const selectUser = (data) => {
  classObj.form.class_teachers[0] = data.userid
  classObj.form.teacher_name = data.username
  showObj.selectUser = false
}

const updateTableMaxHeight = () => {
  const container = instance.refs.tableContainer;
  if (container) {
    cssObj.tableMaxHeight = container.clientHeight + 'px';
  }
}

const handleSizeChange = (val) => {
  classObj.query.pageSize = val
  refetchClassList()
}

const handlePageChange = (val) => {
  classObj.query.page = val
  refetchClassList()
}

const addClass = () => {
  classObj.form = {
    college_id: '',
    id: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    start_date: "",
    end_date: "",
    is_valid: "Y",
    class_teachers: [''],
    rec_status: 1
  }
  showObj.classShow = true
}

const modifyClass = (data) => {
  Object.assign(classObj.form, data)
  classObj.form.teacher_name = data.tearcher[0].name_t
  classObj.form.class_teachers = [data.tearcher[0].userid]

  class_id.value = data.id
  train_id.value = data.train_id
  showObj.modifyClass = true

  if (showObj.activeTabName == 'student') {
    getClassmate(class_id.value)
  } else if (showObj.activeTabName == 'status') {
    getLearningStatus(class_id.value)
  }
}

const modifyStatus = (i) => {
  let currentStatus = i.is_valid
  let value
  let oprate
  if (currentStatus == 'N') {
    value = 'Y'
    oprate = l.enable
  } else {
    value = 'N'
    oprate = l.disable
  }

  $prompt(
    `${l.confirmOperation}${oprate}《${i.name_zh || i.name_tw || i.name_en || i.name_vi}》？${l.inputYToConfirm}`, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.inputValidationFailed,
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel
    }).then(() => {
    modifyStatusMutation.mutate({ key: i.id, value: value })
  }).catch(() => {
    console.log(l.operationCanceled);
  })
}

const getClassList = () => {
  refetchClassList()
}

const handleSubmit = () => {
  const validationErrors = []

  if (!classObj.form.college_id) validationErrors.push(l.collegeRequired)
  if (!classObj.form.name_zh || classObj.form.name_zh.trim() === '') validationErrors.push(l.simplifiedChineseTitleRequired)
  if (!classObj.form.train_content || classObj.form.train_content.trim() === '') validationErrors.push(l.trainingContentRequired)
  if (!classObj.form.train_target || classObj.form.train_target.trim() === '') validationErrors.push(l.trainingObjectiveRequired)
  if (!classObj.form.train_object || classObj.form.train_object.trim() === '') validationErrors.push(l.trainingTargetRequired)
  if (!classObj.form.train_id || !classObj.form.train_name_label) validationErrors.push(l.affiliatedPlanRequired)
  if (!classObj.form.class_teachers || !classObj.form.class_teachers[0] || !classObj.form.teacher_name) validationErrors.push(l.classTeacherRequired)
  if (!classObj.form.start_date) validationErrors.push(l.startTimeRequired)
  if (!classObj.form.end_date) validationErrors.push(l.endTimeRequired)

  if (validationErrors.length > 0) {
    const errorMessage = validationErrors.join('<br>')
    $message({
      type: 'error',
      dangerouslyUseHTMLString: true,
      message: errorMessage,
      duration: 5000
    })
    return
  }

  submitClassMutation.mutate(classObj.form)
}

onMounted(() => {
  window.addEventListener('resize', updateTableMaxHeight);
  nextTick(() => {
    updateTableMaxHeight();
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableMaxHeight);
})
</script>

<style>
.trainingManage-container {
  width: 100%;
  height: 100%;
}
.trainingManage-container .total-num {
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
}
.trainingManage-container .unfinish-num {
  color: #0055ff;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
}
.trainingManage-container .finish-num {
  color: #00aa00;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
}
.trainingManage-container .lessonList-dialog .img {
  width: 100%;
  height: 80px;
}
.trainingManage-container .lessonList-dialog .img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.trainingManage-container .lessonList-dialog .lessonList-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.trainingManage-container .drawer-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.trainingManage-container .drawer-container .form-container {
  width: 95%;
  height: 90%;
  margin: 0 auto;
  background-color: #fff;
}
.trainingManage-container .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 25px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.trainingManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
}
.trainingManage-container .pageBody .pageBody-filter {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  height: 60px;
  padding: 15px;
}
.trainingManage-container .pageBody .tableContainer {
  width: 100%;
  height: calc(100% - 110px);
}
.trainingManage-container .pageBody .trainingManage-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
