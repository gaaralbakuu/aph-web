<template>
  <div class="trainingManage-container">
    <div class="component">
      <el-drawer class="drawer-container" :visible.sync="showObj.classShow" :wrapperClosable='false' size="40%">
        <div slot='title' class="title">{{$l.createClass}}</div>
        <div class="form-container">
          <div class="form">
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
              <el-form-item :label="$l.startTime">
                <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="$l.selectStartTime"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$l.endTime">
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
        <el-table :data="examObj.record" stripe style="width: 100%" max-height="350px" :empty-text="$l.tempNoData">
          <el-table-column type="index" :label="$l.serialNumber"></el-table-column>
          <el-table-column prop="create_time" :label="$l.examTime">
          </el-table-column>
          <el-table-column prop="create_user" :label="$l.studentName">
          </el-table-column>
          <el-table-column prop="score" :label="$l.score">
          </el-table-column>
          <el-table-column :label="$l.operation" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button class="text-green" type="text" size="mini"
                @click="reviewExam(scope.row)">{{$l.viewDetails}}</el-button>
              <el-button type="text" size="mini" @click="readExam(scope.row)">{{$l.correctPapers}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleRecordSizeChange" @current-change="handleRecordPageChange"
          :current-page="examObj.recordQuery.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="examObj.recordQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="examObj.recordTotal" style="float: right;">
        </el-pagination>
        <div slot="footer">
          <el-button type="primary" @click="showObj.recordDialog = false">{{$l.close}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.courseDialog" width="70%">
        <el-Table :data='learningObj.unfinishCourse' tooltip-effect="dark" style="width: 100%" highlight-current-row
          highlight-selection-row stripe>
          <el-table-column type="index" width="50" :label='$l.serialNumber'></el-table-column>
          <el-table-column :label="$l.name" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.description" prop="description"></el-table-column>
        </el-Table>
      </el-dialog>

      <el-dialog :title="showObj.courseAndExamDialogTitle" :visible.sync="showObj.examDialog" width="70%">
        <el-Table :data='learningObj.unfinishExam' tooltip-effect="dark" style="width: 100%" highlight-current-row
          highlight-selection-row stripe>
          <el-table-column type="index" width="50" :label='$l.serialNumber'></el-table-column>
          <el-table-column :label="$l.name" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.passScore" prop="pass_score"></el-table-column>
          <el-table-column :label="$l.maxAttempts" prop="max_reply_num"></el-table-column>
          <el-table-column :label="$l.examDuration" prop="test_duration"></el-table-column>
          <el-table-column :label="$l.startTime" prop="start_time"></el-table-column>
          <el-table-column :label="$l.endTime" prop="end_time"></el-table-column>
        </el-Table>
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
          <el-Table :data='trainingObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
            highlight-selection-row stripe>
            <el-table-column type="index" width="50" :label='$l.serialNumber'>
            </el-table-column>
            <el-table-column :label="$l.simplifiedChinese" prop="name_zh"></el-table-column>
            <el-table-column :label="$l.college" prop="college_id">
              <template slot-scope="scope">
                {{returnCollegeLabel(scope.row.college_id)}}
              </template>
            </el-table-column>
            <el-table-column :label="$l.startTime" prop="start_date"></el-table-column>
            <el-table-column :label="$l.endTime" prop="end_date"></el-table-column>
            <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
            <el-table-column :label="$l.operation" fixed="right">
              <template slot-scope="scope">
                <el-button type='text' @click="selectTraining(scope.row)">{{$l.select}}</el-button>
              </template>
            </el-table-column>
          </el-Table>
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
          <el-Table :data='userObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
            highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle" max-height="400px"
            :row-style="{height:'60px',fontSize:'14px'}">
            <el-table-column type="index" width="50" :label='$l.serialNumber'>
            </el-table-column>
            <el-table-column :label="$l.jobNumber" prop="userid"></el-table-column>
            <el-table-column :label="$l.name" prop="username"></el-table-column>
            <el-table-column :label="$l.department" prop="department_t"></el-table-column>
            <el-table-column :label="$l.position" prop="work_name"></el-table-column>
            <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
            <el-table-column :label="$l.operation" fixed="right">
              <template slot-scope="scope">
                <el-button type='text' @click="selectUser(scope.row)">{{$l.select}}</el-button>
              </template>
            </el-table-column>
          </el-Table>
        </div>
        <div
          style="width: 100%;display: flex;align-items: center;height: 50px;justify-content: end;padding-right: 20px;">
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
            <el-table :data="classObj.taskList" row-key='bind_id' tooltip-effect="dark" style="width: 100%"
              highlight-current-row highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
              :max-height="cssObj.tableMaxHeight">
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column prop="name_label" :label="$l.name"></el-table-column>
              <el-table-column prop="type" :label="$l.type">
                <template slot-scope="scope">
                  {{scope.row.type==1?$l.exam:$l.course}}
                </template>
              </el-table-column>
              <el-table-column prop="is_must" :label="$l.required">
                <template slot-scope="scope">
                  {{scope.row.is_must==1?$l.required:$l.elective}}
                </template>
              </el-table-column>
              <el-table-column :label="$l.operation" fixed="right">
                <template slot-scope="scope">
                  <el-button class="text-green" type='text' @click="previewDetail(scope.row)">{{$l.preview}}</el-button>
                  <el-button v-show="scope.row.type==1" type='text'
                    @click="getExamRecord(scope.row)">{{$l.statistics}}</el-button>
                </template>
              </el-table-column>
            </el-table>
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
            <el-table ref="examListTable" class="draggable-table-exam" :data="studentObj.classmateList" row-key='id'
              tooltip-effect="dark" style="width: 100%" highlight-current-row highlight-selection-row stripe
              :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight">
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column :label="$l.barcode" prop="userId"></el-table-column>
              <el-table-column :label="$l.name" prop="userName"></el-table-column>
              <el-table-column :label="$l.department" prop="department"></el-table-column>
              <el-table-column :label="$l.position" prop="workName"></el-table-column>
              <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
              <el-table-column :label="$l.operation" fixed="right">
                <template slot-scope="scope">
                  <el-button type='text' :class="scope.row.is_valid=='Y'?'text-red':'text-green'"
                    @click="toggleStudentStatus(scope.row)">{{scope.row.is_valid=='Y'?$l.disable:$l.enable}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$l.completionStatus" name="status" v-if='class_id!=""'>
            <el-Table :data='learningObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
              highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
              :max-height="cssObj.tableMaxHeight" :row-style="{height:'60px',fontSize:'14px'}">
              <el-table-column type="index" width="50" :label='$l.serialNumber'></el-table-column>
              <el-table-column :label="$l.jobNumber" prop="userid"></el-table-column>
              <el-table-column :label="$l.name" prop="name_t"></el-table-column>
              <el-table-column :label="$l.department" prop="dept_no"></el-table-column>
              <el-table-column :label="$l.departmentName" prop="department_t"></el-table-column>
              <el-table-column :label="$l.courseCount" prop="course_num">
                <template slot-scope="scope">
                  <div class='total-num'>
                    {{scope.row.course_num}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.completedCourses" prop="finsh_course_num">
                <template slot-scope="scope">
                  <div @click="checkCourse(scope.row.finsh_course_List,$l.completedCourses)" class='finish-num'>
                    {{scope.row.finsh_course_num}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.unfinishedCourses" prop="finsh_course_num">
                <template slot-scope="scope">
                  <div @click="checkCourse(scope.row.no_finsh_course_List,$l.unfinishedCourses)" class='unfinish-num'>
                    {{scope.row.no_finsh_course_List.length}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.examCount" prop="exam_num">
                <template slot-scope="scope">
                  <div class='total-num'>
                    {{scope.row.exam_num}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.completedExams" prop="finsh_exam_num">
                <template slot-scope="scope">
                  <div
                    @click="checkExam([...scope.row.finsh_course_exam_List,...scope.row.finsh_train_exam_List],$l.completedExams)"
                    class='finish-num'>
                    {{scope.row.finsh_exam_num}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.unfinishedExams" prop="finsh_course_num">
                <template slot-scope="scope">
                  <div
                    @click="checkExam([...scope.row.no_finsh_course_exam_List,...scope.row.no_finsh_train_exam_List],$l.unfinishedExams)"
                    class='unfinish-num'>
                    {{scope.row.no_finsh_course_exam_List.length + scope.row.no_finsh_train_exam_List.length}}
                  </div>
                </template>
              </el-table-column>
            </el-Table>
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
        <el-Table :data='classObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
          highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
          :row-style="{height:'60px',fontSize:'14px'}">
          <el-table-column type="index" width="50" :label='$l.serialNumber'>
          </el-table-column>
          <el-table-column :label="$l.simplifiedChinese" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.college" prop="college_id">
            <template slot-scope="scope">
              {{returnCollegeLabel(scope.row.college_id)}}
            </template>
          </el-table-column>
          <el-table-column :label="$l.affiliatedPlan" prop="train_name_label"></el-table-column>
          <el-table-column :label="$l.trainingContent" prop="train_content"></el-table-column>
          <el-table-column :label="$l.trainingObjective" prop="train_target"></el-table-column>
          <el-table-column :label="$l.trainingTarget" prop="train_object"></el-table-column>
          <el-table-column :label="$l.classTeacher" prop="class_teacher">
            <template slot-scope="scope">
              <div v-if="scope.row.class_teacher"> {{scope.row.tearcher[0].name_t}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$l.startTime" prop="start_date"></el-table-column>
          <el-table-column :label="$l.endTime" prop="end_date"></el-table-column>
          <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
          <el-table-column :label="$l.operation" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="modifyClass(scope.row)">{{$l.manage}}</el-button>
              <el-button v-if="scope.row.is_valid=='N'" type='text' style="color: seagreen;"
                @click="modifyStatus(scope.row)">{{$l.enable}}</el-button>
              <el-button v-else type='text' style="color: red;"
                @click="modifyStatus(scope.row)">{{$l.disable}}</el-button>
            </template>
          </el-table-column>
        </el-Table>
      </div>

      <div class="trainingManage-pagenation">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="classObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="classObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="classObj.total" style="float: right;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import chooseUser from '@/views/_common/chooseUser.vue'
  import Sortable from 'sortablejs'
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
          `${this.$l.confirmOperation}${oprate}《${i.name_zh||i.name_tw||i.name_en}》？${this.$l.inputYToConfirm}`, {
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


<style lang="scss">
  .trainingManage-container {
    width: 100%;
    height: 100%;

    .total-num {
      font-weight: 600;
      font-size: 18px;
      cursor: pointer;
    }

    .unfinish-num {
      color: #0055ff;
      font-weight: 600;
      font-size: 18px;
      cursor: pointer;
    }

    .finish-num {
      color: #00aa00;
      font-weight: 600;
      font-size: 18px;
      cursor: pointer;
    }

    .lessonList-dialog {
      .img {
        width: 100%;
        height: 80px;

        .auto-img {
          position: relative;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
          cursor: pointer;
        }
      }

      .lessonList-pagenation {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }




    .drawer-container {

      .title {
        padding: 20px 0px;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
      }

      .form-container {
        width: 95%;
        height: 90%;
        margin: 0 auto;
        background-color: #fff;
      }

      .buttonBar {
        width: 100%;
        height: 60px;
        margin: 0 auto;
        padding: 0 25px;
        position: absolute;
        bottom: 0px;
        border-top: 1px solid #ccc;
        float: right;
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }

    .pageBody {
      width: 100%;
      min-width: 1000px;
      height: 100%;
      margin: 0 auto;
      // padding: 20px;
      background-color: #fff;

      .pageBody-filter {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        height: 60px;
        padding: 15px;
      }

      .tableContainer {
        width: 100%;
        height: calc(100% - 110px);
      }

      .trainingManage-pagenation {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>
