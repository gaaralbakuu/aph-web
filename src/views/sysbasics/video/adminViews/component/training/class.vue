<template>
  <div class="trainingManage-container">
    <div class="component">
      <el-drawer class="drawer-container" :visible.sync="showObj.classShow" :wrapperClosable='false' size="40%">
        <div slot='title' class="title">{{$l.createClass}}</div>
        <div class="form-container">
          <div class="form">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="$l.college" required>
                <el-select v-model="classObj.form.college_id" requird style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.simplifiedChineseTitle" required>
                <el-input v-model="classObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="$l.traditionalChineseTitle">
                <el-input v-model="classObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="$l.englishTitle">
                <el-input v-model="classObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="$l.vietnameseTitle">
                <el-input v-model="classObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingContent" required>
                <el-input v-model="classObj.form.train_content"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingObjective" required>
                <el-input v-model="classObj.form.train_target"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingTarget" required>
                <el-input v-model="classObj.form.train_object"></el-input>
              </el-form-item>
              <el-form-item :label="$l.affiliatedPlan" required>
                <el-input v-model="classObj.form.train_name_label" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectTraining=true"
                      style="background-color: #67C23A;color: white;">{{$l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$l.classTeacher" required>
                <el-input v-model="classObj.form.teacher_name" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectUser = true"
                      style="background-color: #67C23A;color: white;">{{$l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$l.startTime" required>
                <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="$l.selectStartTime"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$l.endTime" required>
                <el-date-picker v-model="classObj.form.end_date" type="datetime" :placeholder="$l.selectEndTime"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="buttonBar">
            <el-button type="primary" @click="handleSubmit">{{$l.submit}}</el-button>
            <el-button type="danger" @click="showObj.classShow = false">{{$l.close}}</el-button>
          </div>
        </div>
      </el-drawer>

      <el-dialog class="examRecord-dialog" :title="$l.examRecord" :visible.sync="showObj.recordDialog" width="50%">
        <el-form :inline="true">
          <el-form-item :label="$l.studentBarcode">
            <el-input v-model="examObj.recordQuery.userid" :placeholder="$l.pleaseInput"
              @keyup.native.enter="getExamRecord" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getExamRecord">{{$l.search}}</el-button>
          </el-form-item>
        </el-form>
        <a-table :dataSource="examObj.record" :scroll="{ y: 350 }" style="width: 100%">
          <a-table-column :title="$l.serialNumber" type="index"></a-table-column>
          <a-table-column :title="$l.examTime" dataIndex="create_time">
          </a-table-column>
          <a-table-column :title="$l.studentName" dataIndex="create_user">
          </a-table-column>
          <a-table-column :title="$l.score" dataIndex="score">
          </a-table-column>
          <a-table-column :title="$l.operation" :width="150" align="center" fixed="right">
            <template slot-scope="text, record, index">
              <a-button class="text-green" type="link" size="small" @click="reviewExam(record)">{{$l.viewDetails}}</a-button>
              <a-button type="link" size="small" @click="readExam(record)">{{$l.correctPapers}}</a-button>
            </template>
          </a-table-column>
        </a-table>
        <a-pagination @showSizeChange="handleRecordSizeChange" @change="handleRecordPageChange"
          :current="examObj.recordQuery.page" :pageSizeOptions="[5,10, 15, 30, 50,100]"
          :pageSize="examObj.recordQuery.pageSize" :showSizeChanger="true" :showQuickJumper="true" :showTotal="(total, range) => `共 ${total} 条`"
          :total="examObj.recordTotal" style="float: right;">
        </a-pagination>
        <div slot="footer">
          <el-button type="primary" @click="showObj.recordDialog = false">{{$l.close}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.courseDialog" width="70%">
        <a-table :dataSource='learningObj.unfinishCourse' style="width: 100%">
          <a-table-column :title='$l.serialNumber' type="index" :width="50"></a-table-column>
          <a-table-column :title="$l.name" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="$l.description" dataIndex="description"></a-table-column>
        </a-table>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.examDialog" width="70%">
        <a-table :dataSource='learningObj.unfinishExam' style="width: 100%">
          <a-table-column :title='$l.serialNumber' type="index" :width="50"></a-table-column>
          <a-table-column :title="$l.name" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="$l.passScore" dataIndex="pass_score"></a-table-column>
          <a-table-column :title="$l.maxAttempts" dataIndex="max_reply_num"></a-table-column>
          <a-table-column :title="$l.examDuration" dataIndex="test_duration"></a-table-column>
          <a-table-column :title="$l.startTime" dataIndex="start_time"></a-table-column>
          <a-table-column :title="$l.endTime" dataIndex="end_time"></a-table-column>
        </a-table>
      </el-dialog>

      <!-- 选择培训dialog -->
      <el-dialog :visible.sync="showObj.selectTraining" @open='getTrainingList' :title="$l.selectTraining" width="75%">
        <div class="pageBody-filter">
          <el-form inline>
            <el-form-item :label="$l.college">
              <el-select v-model="trainingObj.query.college_id" @change="getTrainingList"
                :placeholder="$l.pleaseSelectCollege" :clearable="isAdmin">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.trainingName">
              <el-input v-model="trainingObj.query.name" clearable @clear='getTrainingList'
                @keyup.native.enter="getTrainingList"></el-input>
            </el-form-item>
            <el-form-item :label="$l.status">
              <el-select v-model="trainingObj.query.is_valid" @change="getTrainingList" style="width: 100px;">
                <el-option :label="$l.all" value=""></el-option>
                <el-option :label="$l.enabled" value="Y"></el-option>
                <el-option :label="$l.disabled" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item> <el-button type="success" @click="getTrainingList">{{$l.search}}</el-button></el-form-item>
          </el-form>
        </div>

        <div class="tableContainer" ref="tableContainer">
          <a-table :dataSource='trainingObj.list' style="width: 100%">
            <a-table-column :title='$l.serialNumber' type="index" :width="50">
            </a-table-column>
            <a-table-column :title="$l.simplifiedChinese" dataIndex="name_zh"></a-table-column>
            <a-table-column :title="$l.college" dataIndex="college_id">
              <template slot-scope="text, record, index">
                {{returnCollegeLabel(record.college_id)}}
              </template>
            </a-table-column>
            <a-table-column :title="$l.startTime" dataIndex="start_date"></a-table-column>
            <a-table-column :title="$l.endTime" dataIndex="end_date"></a-table-column>
            <a-table-column :title="$l.status" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="$l.operation" fixed="right">
              <template slot-scope="text, record, index">
                <a-button type='link' @click="selectTraining(record)">{{$l.select}}</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </el-dialog>

      <!-- 选择用户dialog -->
      <el-dialog :visible="showObj.selectUser" @open="getUserList" width="75%" :show-close="false">
        <el-form inline>
          <el-form-item :label="$l.userInfo">
            <el-input v-model="userObj.query.queryString" clearable @clear='getUserList'
              @keyup.native.enter="getUserList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="userObj.query.status" @change="getUserList">
              <el-option :label="$l.all" value=""></el-option>
              <el-option :label="$l.enabled" value="0"></el-option>
              <el-option :label="$l.disabled" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getUserList">{{$l.search}}</el-button></el-form-item>
        </el-form>
        <div class="tableContainer" ref="tableContainer">
          <a-table :dataSource='userObj.list' :scroll="{ y: 400 }" style="width: 100%">
            <a-table-column :title='$l.serialNumber' type="index" :width="50">
            </a-table-column>
            <a-table-column :title="$l.jobNumber" dataIndex="userid"></a-table-column>
            <a-table-column :title="$l.name" dataIndex="username"></a-table-column>
            <a-table-column :title="$l.department" dataIndex="department_t"></a-table-column>
            <a-table-column :title="$l.position" dataIndex="work_name"></a-table-column>
            <a-table-column :title="$l.status" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="$l.operation" fixed="right">
              <template slot-scope="text, record, index">
                <a-button type='link' @click="selectUser(record)">{{$l.select}}</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
        <div
          style="width: 100%;display: flex;align-items: center;height: 50px;justify-content: flex-end;padding-right: 20px;">
          <el-button type="danger" plain @click="showObj.selectUser = false">{{$l.close}}</el-button>
        </div>
      </el-dialog>

      <!-- 新增或修改课程以及配套资源 -->
      <el-drawer class="drawer-container" direction='btt' :visible.sync="showObj.modifyClass" :wrapperClosable='false'
        size="95%">
        <div slot='title' class="title">{{$l.manageClass}}</div>
        <el-tabs type="border-card" class="form-container" @tab-click="tabClick" v-model="showObj.activeTabName">
          <el-tab-pane :label="$l.basicInfo" name="data">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="$l.college">
                <el-select v-model="classObj.form.college_id" requird style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.simplifiedChineseTitle">
                <el-input v-model="classObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="$l.traditionalChineseTitle">
                <el-input v-model="classObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="$l.englishTitle">
                <el-input v-model="classObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="$l.vietnameseTitle">
                <el-input v-model="classObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingContent">
                <el-input v-model="classObj.form.train_content"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingObjective">
                <el-input v-model="classObj.form.train_target"></el-input>
              </el-form-item>
              <el-form-item :label="$l.trainingTarget">
                <el-input v-model="classObj.form.train_object"></el-input>
              </el-form-item>
              <el-form-item :label="$l.affiliatedPlan">
                <el-input v-model="classObj.form.train_name_label" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectTraining=true"
                      style="background-color: #67C23A;color: white;">{{$l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$l.classTeacher">
                <el-input v-model="classObj.form.teacher_name" disabled>
                  <template slot="append">
                    <el-button @click="showObj.selectUser = true"
                      style="background-color: #67C23A;color: white;">{{$l.select}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$l.startTime">
                    <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="$l.selectStartTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$l.endTime">
                    <el-date-picker v-model="classObj.form.end_date" type="datetime" :placeholder="$l.selectEndTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="display: flex;justify-content: center;">
              <el-button type="primary" @click="handleSubmit" style="width: 100px;">{{$l.update}}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$l.taskList" name='task'>
            <a-table :dataSource="classObj.taskList" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title="$l.serialNumber" type="index" :width="55"></a-table-column>
              <a-table-column :title="$l.name" dataIndex="name_label"></a-table-column>
              <a-table-column :title="$l.type" dataIndex="type">
                <template slot-scope="text, record, index">
                  {{record.type==1?$l.exam:$l.course}}
                </template>
              </a-table-column>
              <a-table-column :title="$l.required" dataIndex="is_must">
                <template slot-scope="text, record, index">
                  {{record.is_must==1?$l.required:$l.elective}}
                </template>
              </a-table-column>
              <a-table-column :title="$l.operation" fixed="right">
                <template slot-scope="text, record, index">
                  <a-button class="text-green" type='link' @click="previewDetail(record)">{{$l.preview}}</a-button>
                  <a-button v-show="record.type==1" type='link' @click="getExamRecord(record)">{{$l.statistics}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
          <el-tab-pane :label="$l.classStudents" name="student">
            <div style="margin-bottom: 10px;display: flex;justify-content: space-between;">
              <div>
                <el-form inline>
                  <el-form-item :label="$l.name">
                    <el-input v-model="studentObj.query.user_name"></el-input>
                  </el-form-item>
                  <el-form-item :label="$l.status">
                    <el-select v-model="studentObj.query.is_valid">
                      <el-option :label="$l.all" value=""></el-option>
                      <el-option :label="$l.enabled" value="Y"></el-option>
                      <el-option :label="$l.disabled" value="N"></el-option>
                    </el-select>
                    <el-button type="primary" @click="getClassmate(class_id)">{{$l.search}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-button type="primary" plain @click="showObj.selectStudent = true">{{$l.addStudents}}</el-button>
              </div>
            </div>
            <a-table :dataSource="studentObj.classmateList" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title="$l.serialNumber" type="index" :width="55"></a-table-column>
              <a-table-column :title="$l.barcode" dataIndex="userId"></a-table-column>
              <a-table-column :title="$l.name" dataIndex="userName"></a-table-column>
              <a-table-column :title="$l.department" dataIndex="department"></a-table-column>
              <a-table-column :title="$l.position" dataIndex="workName"></a-table-column>
              <a-table-column :title="$l.status" dataIndex="is_valid"></a-table-column>
              <a-table-column :title="$l.operation" fixed="right">
                <template slot-scope="text, record, index">
                  <a-button type='link' :class="record.is_valid=='Y'?'text-red':'text-green'" @click="toggleStudentStatus(record)">{{record.is_valid=='Y'?$l.disable:$l.enable}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
          <el-tab-pane :label="$l.completionStatus" name="status" v-if='class_id!=""'>
            <a-table :dataSource='learningObj.list' :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
              <a-table-column :title='$l.serialNumber' type="index" :width="50"></a-table-column>
              <a-table-column :title="$l.jobNumber" dataIndex="userid"></a-table-column>
              <a-table-column :title="$l.name" dataIndex="name_t"></a-table-column>
              <a-table-column :title="$l.department" dataIndex="dept_no"></a-table-column>
              <a-table-column :title="$l.departmentName" dataIndex="department_t"></a-table-column>
              <a-table-column :title="$l.courseCount" dataIndex="course_num">
                <template slot-scope="text, record, index">
                  <div class='total-num'>
                    {{record.course_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="$l.completedCourses" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkCourse(record.finsh_course_List,$l.completedCourses)" class='finish-num'>
                    {{record.finsh_course_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="$l.unfinishedCourses" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkCourse(record.no_finsh_course_List,$l.unfinishedCourses)" class='unfinish-num'>
                    {{record.no_finsh_course_List.length}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="$l.examCount" dataIndex="exam_num">
                <template slot-scope="text, record, index">
                  <div class='total-num'>
                    {{record.exam_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="$l.completedExams" dataIndex="finsh_exam_num">
                <template slot-scope="text, record, index">
                  <div @click="checkExam([...record.finsh_course_exam_List,...record.finsh_train_exam_List],$l.completedExams)" class='finish-num'>
                    {{record.finsh_exam_num}}
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="$l.unfinishedExams" dataIndex="finsh_course_num">
                <template slot-scope="text, record, index">
                  <div @click="checkExam([...record.no_finsh_course_exam_List,...record.no_finsh_train_exam_List],$l.unfinishedExams)" class='unfinish-num'>
                    {{record.no_finsh_course_exam_List.length + record.no_finsh_train_exam_List.length}}
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
        </el-tabs>
        <div class="buttonBar">
          <el-button type="danger" @click="showObj.modifyClass = false">{{$l.close}}</el-button>
        </div>
      </el-drawer>

      <chooseUser :visible.sync="showObj.selectStudent" :useridList.sync="studentObj.setClassmateList"
        @submmit="submmitClassmate"></chooseUser>
    </div>

    <div class="pageBody">
      <div class="pageBody-filter">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="classObj.query.college_id" @change="getClassList" :placeholder="$l.pleaseSelectCollege"
              :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.className">
            <el-input v-model="classObj.query.name" clearable @clear='getClassList'
              @keyup.native.enter="getClassList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="classObj.query.is_valid" @change="getClassList">
              <el-option :label="$l.all" value=""></el-option>
              <el-option :label="$l.enabled" value="Y"></el-option>
              <el-option :label="$l.disabled" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getClassList">{{$l.search}}</el-button></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="addClass">{{$l.create}}</el-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <a-table :dataSource='classObj.list' :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%">
          <a-table-column :title='$l.serialNumber' type="index" :width="50">
          </a-table-column>
          <a-table-column :title="$l.simplifiedChinese" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="$l.college" dataIndex="college_id">
            <template slot-scope="text, record, index">
              {{returnCollegeLabel(record.college_id)}}
            </template>
          </a-table-column>
          <a-table-column :title="$l.affiliatedPlan" dataIndex="train_name_label"></a-table-column>
          <a-table-column :title="$l.trainingContent" dataIndex="train_content"></a-table-column>
          <a-table-column :title="$l.trainingObjective" dataIndex="train_target"></a-table-column>
          <a-table-column :title="$l.trainingTarget" dataIndex="train_object"></a-table-column>
          <a-table-column :title="$l.classTeacher" dataIndex="class_teacher">
            <template slot-scope="text, record, index">
              <div v-if="record.class_teacher"> {{record.tearcher[0].name_t}}</div>
            </template>
          </a-table-column>
          <a-table-column :title="$l.startTime" dataIndex="start_date"></a-table-column>
          <a-table-column :title="$l.endTime" dataIndex="end_date"></a-table-column>
          <a-table-column :title="$l.status" dataIndex="is_valid"></a-table-column>
          <a-table-column :title="$l.operation" fixed="right">
            <template slot-scope="text, record, index">
              <a-button type='link' @click="modifyClass(record)">{{$l.manage}}</a-button>
              <a-button v-if="record.is_valid=='N'" type='link' style="color: seagreen;" @click="modifyStatus(record)">{{$l.enable}}</a-button>
              <a-button v-else type='link' style="color: red;" @click="modifyStatus(record)">{{$l.disable}}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>

      <div class="trainingManage-pagenation">
        <a-pagination @showSizeChange="handleSizeChange" @change="handlePageChange"
          :current="classObj.query.page" :pageSizeOptions="[5,10, 15, 30, 50,100]" :pageSize="classObj.query.pageSize"
          :showSizeChanger="true" :showQuickJumper="true" :showTotal="(total, range) => `共 ${total} 条`"
          :total="classObj.total" style="float: right;">
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import {
    mapGetters
  } from 'vuex'

  import chooseUser from '@/views/_common/ChooseUser.vue'
  export default {
    name: 'videoAdminClass',
    components: {
      chooseUser
    },
    data() {
      return {
        class_id: '',
        train_id: '',
        showObj: {
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
        },
        cssObj: {
          tableMaxHeight: '500px',
          headerRowStyle: {
            background: '#f2f4f9',
            color: '#505050',
            fontSize: '14px',
            height: '50px'
          }
        },
        trainingObj: {
          query: {
            college_id: "",
            page: 1,
            pageSize: 10,
            name: "",
            is_valid: ''
          },
          list: []
        },
        userObj: {
          query: {
            page: 1,
            size: 10,
            queryString: "",
            status: '0'
          },
          list: [],
        },
        studentObj: {
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
        },
        classObj: {
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
          list: []
        },
        publicCodeObj: {
          collegeList: [],
        },
        learningObj: {
          query: {
            page: 1,
            pageSize: 15
          },
          total: 0,
          list: [],
          unfinishCourse: [],
          unfinishExam: []
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
        }
      }
    },

    computed: {
      ...mapGetters(['isAdmin']),
    },

    methods: {
      tabClick(v) {
        if (v.name == 'status') {
          this.getLearningStatus(this.class_id)
        } else if (v.name == 'student') {
          this.getClassmate(this.class_id)
        } else if (v.name == 'task') {
          this.getTaskList(this.train_id)
        }
      },

      checkCourse(v, label) {
        this.showObj.courseAndExamDialogTitle = label
        if (v.length > 0) {
          this.learningObj.unfinishCourse = v
          this.showObj.courseDialog = true
        } else {
          this.$message.info(this.$l.tempNoData)
        }
      },

      checkExam(v, label) {
        this.showObj.courseAndExamDialogTitle = label
        if (v.length > 0) {
          this.learningObj.unfinishExam = v
          this.showObj.examDialog = true
        } else {
          this.$message.info(this.$l.tempNoData)
        }
      },

      getLearningStatus(id) {
        this.$request(this.$api.videoServer + '/Video/VideoAnalyze/getClassUserTrainLearingInfo', {
            ...this.learningObj.query,
            class_id: id
          }, 'post')
          .then(r => {
            this.learningObj.total = r.data.total
            this.learningObj.list = r.data.list
          })
      },

      async previewDetail(i) {
        if (i.type === '0' || i.type === 0) {
          let routeUrl = this.$router.resolve({
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
            let res = await this.$request(this.$api.videoServer + '/Video/VideoExam/getExamList', {
              id: i.bind_id,
            })
            questionnaire_id = res.data.list[0].questionnaire_id
          }

          let url = this.$router.resolve({
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
      },

      getCollegeList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
            if (!this.isAdmin) {
              this.classObj.query.college_id = this.publicCodeObj.collegeList[0].id
              this.trainingObj.query.college_id = this.publicCodeObj.collegeList[0].id
            }
            this.getClassList()
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      submmitClassmate() {
        let postData = []
        if (this.studentObj.setClassmateList.length == 0) {
          return this.$message.error(this.$l.addUserCannotBeEmpty)
        }

        this.studentObj.setClassmateList.forEach(e => {
          let j = {
            id: "",
            userid: e,
            class_id: this.class_id,
            train_id: this.train_id,
            is_valid: "Y",
            rec_status: 1
          }
          postData.push(j)
        })
        this.$request(this.$api.videoServer + '/Video/VideoTrain/setUserIntoTrain', postData, 'post')
          .then(r => {
            this.getClassmate(this.class_id)
          })
          .catch(e => {
            console.log(e);
          })
      },

      toggleStudentStatus(user) {
        this.$confirm(user.is_valid === 'Y' ? this.$l.confirmDisable : this.$l.confirmEnable, this.$l.tip, {
          confirmButtonText: this.$l.confirm,
          cancelButtonText: this.$l.cancel,
          type: 'warning',
          center: true
        }).then(() => {
          let j = {
            id: user.id,
            userid: user.userId,
            class_id: this.class_id,
            train_id: this.train_id,
            is_valid: user.is_valid == 'Y' ? 'N' : 'Y',
            rec_status: 1
          }
          this.$request(this.$api.videoServer + '/Video/VideoTrain/setUserIntoTrain', [j], 'post')
            .then(r => {
              this.getClassmate(this.class_id)
              this.$message({
                type: 'success',
                message: user.is_valid === 'Y' ? this.$l.disableSuccess : this.$l.enableSuccess
              });
            })
            .catch(e => {
              console.log(e);
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.operationCanceled
          });
        });
      },

      returnCollegeLabel(college_id) {
        let college = this.publicCodeObj.collegeList.find(i => i.id == college_id)
        if (college) {
          return college.name_label
        } else {
          return ""
        }
      },

      getClassmate(cid) {
        if (cid) {
          this.studentObj.query.class_id = cid
        }
        this.$request(this.$api.videoServer + '/Video/VideoTrain/getClassUser', this.studentObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.studentObj.classmateList = r.data.list
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      selectTraining(data) {
        this.classObj.form.college_id = data.college_id
        this.classObj.form.train_name_label = data.name_label
        this.classObj.form.train_id = data.train_id
        this.showObj.selectTraining = false
      },

      getTaskList(id) {
        this.$request(this.$api.videoServer + '/Video/VideoTrain/ShowTrainDetil', {
          train_id: id
        }).then(r => {
          this.classObj.taskList = r.data.detail
        })
      },

      handleRecordSizeChange(i) {
        this.examObj.recordQuery.pageSize = i
        this.getExamRecord()
      },

      handleRecordPageChange(i) {
        this.examObj.recordQuery.page = i
        this.getExamRecord()
      },

      reviewExam(data) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            train_id: this.train_id,
            class_id: this.class_id,
            course_id: '',
            exam_id: data.id,
            questionnaire_id: data.questionnaire_id,
            reply_id: data.id,
            mode: 'review'
          }
        }).href;
        window.open(url, '_blank');
      },

      previewExam(id) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            train_id: this.train_id,
            class_id: this.class_id,
            course_id: '',
            exam_id: '',
            questionnaire_id: id,
            mode: 'preview'
          }
        }).href;
        window.open(url, '_blank');
      },

      readExam(data) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            train_id: this.train_id,
            class_id: this.class_id,
            course_id: '',
            exam_id: data.id,
            questionnaire_id: data.questionnaire_id,
            reply_id: data.id,
            mode: 'read'
          }
        }).href;
        window.open(url, '_blank');
      },

      getExamRecord(data) {
        let exam = data.detail.find(i => {
          return i.exam != null
        }).exam

        if (exam) {
          this.examObj.recordQuery.exam_id = exam.id
          this.examObj.recordQuery.questionnaire_id = exam.questionnaire_id
        }

        this.$request(this.$api.videoServer + '/Video/VideoExam/getAnswerList', {
          ...this.examObj.recordQuery,
          class_id: this.class_id,
          train_id: this.train_id
        }).then(r => {
          this.examObj.record = r.data.list
          this.examObj.recordTotal = r.data.total
          this.showObj.recordDialog = true
        })
      },

      getTrainingList() {
        this.$request(this.$api.videoServer + '/Video/VideoTrain/getlist', this.trainingObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.trainingObj.list = r.data.list
              this.trainingObj.total = r.data.total
              if (r.data.total == 0) {
                this.$message({
                  type: 'info',
                  message: this.$l.tempNoData
                })
              }
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      getUserList() {
        this.$request(this.$api.videoServer + '/Platform/user/getlist', this.userObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.userObj.list = r.data.list
              this.userObj.total = r.data.total
              if (r.data.total == 0) {
                this.$message({
                  type: 'info',
                  message: this.$l.tempNoData
                })
              }
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      selectUser(data) {
        this.classObj.form.class_teachers[0] = data.userid
        this.classObj.form.teacher_name = data.username
        this.showObj.selectUser = false
      },

      updateTableMaxHeight() {
        const container = this.$refs.tableContainer;
        if (container) {
          this.cssObj.tableMaxHeight = container.clientHeight + 'px';
        }
      },

      handleSizeChange() {
        // 分页大小变化处理
      },

      handlePageChange() {
        // 页码变化处理
      },

      addClass() {
        this.classObj.form = {
          college_id:'',
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
        this.showObj.classShow = true
      },

      modifyClass(data) {
        this.classObj.form = Object.assign(this.classObj.form, data)
        this.classObj.form.teacher_name = data.tearcher[0].name_t
        this.classObj.form.class_teachers = [data.tearcher[0].userid]

        this.class_id = data.id
        this.train_id = data.train_id
        this.showObj.modifyClass = true

        if (this.showObj.activeTabName == 'student') {
          this.getClassmate(this.class_id)
        } else if (this.showObj.activeTabName == 'status') {
          this.getLearningStatus(this.class_id)
        }
      },

      modifyStatus(i) {
        let currentStatus = i.is_valid
        let value
        let oprate
        if (currentStatus == 'N') {
          value = 'Y'
          oprate = this.$l.enable
        } else {
          value = 'N'
          oprate = this.$l.disable
        }

        this.$prompt(
          `${this.$l.confirmOperation}${oprate}《${i.name_zh||i.name_tw||i.name_en||i.name_vi}》？${this.$l.inputYToConfirm}`, {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: this.$l.inputValidationFailed,
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel
          }).then(() => {
          this.$request(this.$api.videoServer + '/Video/VideoTrain/ModifyClassStatus', {
            key: i.id,
            value: value
          }, 'post').then(r => {
            this.$message({
              type: 'success',
              message: this.$l.operationSuccess
            })
            this.getClassList()
          })
        }).catch(() => {
          console.log(this.$l.operationCanceled);
        })
      },

      handleSubmit() {
        // Validation cho các trường required
        const validationErrors = []

        // Kiểm tra college_id (required)
        if (!this.classObj.form.college_id) {
          validationErrors.push(this.$l.collegeRequired)
        }

        // Kiểm tra name_zh (required)
        if (!this.classObj.form.name_zh || this.classObj.form.name_zh.trim() === '') {
          validationErrors.push(this.$l.simplifiedChineseTitleRequired)
        }

        // Kiểm tra train_content (required)
        if (!this.classObj.form.train_content || this.classObj.form.train_content.trim() === '') {
          validationErrors.push(this.$l.trainingContentRequired)
        }

        // Kiểm tra train_target (required)
        if (!this.classObj.form.train_target || this.classObj.form.train_target.trim() === '') {
          validationErrors.push(this.$l.trainingObjectiveRequired)
        }

        // Kiểm tra train_object (required)
        if (!this.classObj.form.train_object || this.classObj.form.train_object.trim() === '') {
          validationErrors.push(this.$l.trainingTargetRequired)
        }

        // Kiểm tra train_id thông qua train_name_label (required)
        if (!this.classObj.form.train_id || !this.classObj.form.train_name_label) {
          validationErrors.push(this.$l.affiliatedPlanRequired)
        }

        // Kiểm tra class_teachers (required)
        if (!this.classObj.form.class_teachers || !this.classObj.form.class_teachers[0] || !this.classObj.form.teacher_name) {
          validationErrors.push(this.$l.classTeacherRequired)
        }

        // Kiểm tra start_date (required)
        if (!this.classObj.form.start_date) {
          validationErrors.push(this.$l.startTimeRequired)
        }

        // Kiểm tra end_date (required)
        if (!this.classObj.form.end_date) {
          validationErrors.push(this.$l.endTimeRequired)
        }

        // Nếu có lỗi validation, hiển thị thông báo và dừng
        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.join('<br>')
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: errorMessage,
            duration: 5000
          })
          return
        }

        // Nếu validation thành công, tiếp tục submit
        this.$request(this.$api.videoServer + '/Video/VideoTrain/addOrModifyClass', this.classObj.form, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.submitSuccess
              })
              this.showObj.classShow = false
              this.getClassList()
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      getClassList() {
        this.$request(this.$api.videoServer + '/Video/VideoTrain/getClass', this.classObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.classObj.list = r.data.list
              this.classObj.total = r.data.total
              if (r.data.total == 0) {
                this.$message({
                  type: 'info',
                  message: this.$l.tempNoData
                })
              }
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    },

    mounted() {
      this.getCollegeList()
      window.addEventListener('resize', this.updateTableMaxHeight);
      this.$nextTick(() => {
        this.updateTableMaxHeight();
      })
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.updateTableMaxHeight);
    }
  }
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
