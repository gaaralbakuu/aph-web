<template>
  <div class="trainingManage-container">
    <div class="component">
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

      <el-dialog :visible.sync="showObj.coverDialog" :title="$l.preview">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit='fill'>
      </el-dialog>

      <!-- 选择考试dialog -->
      <el-dialog :visible.sync="showObj.selectExam" @open='getExamList' :title="$l.bindExam" width="75%">
        <div class="examSelect-dialog">
          <el-form inline label-width="60px">
            <el-form-item :label="$l.collegeFilter">
              <el-select v-model="examObj.query.college_id" @change="getExamList">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.titleFilter">
              <el-input v-model="examObj.query.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="selectMultipleItemToDetail">{{$l.batchAdd}}</el-button>
              <el-button type="success" @click="getExamList">{{ $l.search }}</el-button>
            </el-form-item>
          </el-form>

          <el-table ref="examDialogTable" :data="examObj.list" tooltip-effect="dark" style="width: 100%"
            highlight-current-row highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
            :max-height="cssObj.tableMaxHeight" show-overflow-tooltip @selection-change="examSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="50" :label='$l.serialNumber'></el-table-column>
            <el-table-column :label="$l.examName" prop="name_label"></el-table-column>
            <el-table-column :label="$l.passingScore" prop="pass_score"></el-table-column>
            <el-table-column :label="$l.maxAttempts" prop="max_reply_num"></el-table-column>
            <el-table-column :label="$l.examDuration" prop="test_duration"></el-table-column>
            <el-table-column :label="$l.startTime" prop="start_time"></el-table-column>
            <el-table-column :label="$l.endTime" prop="end_time"></el-table-column>
            <el-table-column :label="$l.enableStatus" prop="is_valid"></el-table-column>
            <el-table-column :label="$l.actions" fixed="right">
              <template slot-scope="scope">
                <el-button class="text-green" type='text' @click="previewDetail(scope.row)">{{$l.preview}}</el-button>
                <el-button type='text' @click="selectItemToDetail(scope.row)">{{$l.select}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="showObj.selectCourse" :title="$l.addCourse" width="75%" @open='getCourseList'
        class="lessonList-dialog">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="courseObj.query.college_id" @change="getCourseList" clearable>
              <el-option :label="$l.publicCourses" value=""></el-option>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.name">
            <el-input v-model="courseObj.query.name" clearable @clear='getCourseList'
              @keyup.native.enter="getCourseList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.status">
            <div class="frcc">
              <el-select v-model="courseObj.query.is_valid" @change="getCourseList" style="width: 100px;">
                <el-option :label="$l.all" value=""></el-option>
                <el-option :label="$l.enable" value="Y"></el-option>
                <el-option :label="$l.disable" value="N"></el-option>
              </el-select>
              <el-button type="success" @click="getCourseList" style="margin-left:20px ;">{{$l.search}}</el-button>
              <el-button type="primary" plain @click="selectMultipleItemToDetail"
                style="margin-left:20px ;">{{$l.batchAdd}}</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-table ref="courseDialogTable" :data="courseObj.list" tooltip-effect="dark" style="width: 100%"
          @selection-change="courseSelectionChange" highlight-current-row highlight-selection-row stripe
          :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
          :row-style="{height:'100px',fontSize:'14px'}">

          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" width="50" :label='$l.serialNumber'>
          </el-table-column>
          <el-table-column :label="$l.cover" prop="thumbnail_path">
            <template slot-scope="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" @click="coverPreview($api.videoServer+'/'+ scope.row.thumbnail_path)"
                  :src="$api.videoServer+'/'+ scope.row.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{$l.noCover}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$l.courseName" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.courseDescription" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$l.affiliation" prop="org_id">
          </el-table-column>
          <el-table-column :label="$l.courseCredit" prop="score"></el-table-column>
          <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
          <el-table-column :label="$l.actions" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="selectItemToDetail(scope.row)">{{$l.add}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="lessonList-pagenation">
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
            :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="courseObj.total" style="float: right;">
          </el-pagination>
        </div>
      </el-dialog>

      <!-- 新增或修改培训班以及配套资源 -->
      <el-drawer class="drawer-container" direction='btt' :visible.sync="showObj.trainingShow" :wrapperClosable='false'
        size="92%">
        <div slot='title' class="title">{{$l.manageTraining}}</div>
        <el-tabs ref='tabs' type="border-card" class="form-container" @tab-click="swiperTab"
          v-model="showObj.activeTabName">
          <el-tab-pane :label="$l.basicInfo" name="data">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="$l.cover" required v-if="trainingObj.form.id">
                <div class="modifyCover">
                  <div class="cover">
                    <img class="auto-img" :src="$api.videoServer+'/'+ trainingObj.form.oldthumbnail_path" height="150px" />
                    <div class="cover-oprate">
                      <i class="el-icon-zoom-in iconZoom"
                        @click="coverPreview($api.videoServer+'/'+ trainingObj.form.oldthumbnail_path)"></i>
                    </div>
                  </div>
                  <div class="change"><i class="el-icon-right"></i></div>
                  <div>
                    <div v-if="coverObj.imageUrl==''" class="cover">
                      <div class="plus-icon" @click="coverSelect('upload')">
                        <i class="el-icon-upload" style="font-size: 30px;"></i>
                        <div>
                          {{$l.selectNewCover}}
                        </div>
                      </div>
                    </div>
                    <div v-else class="cover">
                      <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                      <div class="cover-oprate">
                        <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                        <i class="el-icon-folder-opened iconRefresh" @click="coverSelect('upload')"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$l.cover" required v-else>
                <div v-if="coverObj.imageUrl==''" class="cover">
                  <div class="plus-icon" @click="coverSelect('upload')">
                    <i class="el-icon-upload" style="font-size: 30px;"></i>
                    <div>
                      {{$l.selectCover}}
                    </div>
                  </div>
                </div>
                <div v-else class="cover">
                  <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                  <div class="cover-oprate">
                    <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)" :alt='$l.preview'></i>
                    <i class="el-icon-folder-opened iconZoom" @click="coverSelect('upload')"></i>
                  </div>
                </div>
              </el-form-item>
              <el-row :gutter="24">
                <el-col :span='12'>
                  <el-form-item :label="$l.startTime" required>
                    <el-date-picker v-model="trainingObj.form.start_date" type="datetime" :placeholder="$l.startTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="$l.endTime" required>
                    <el-date-picker v-model="trainingObj.form.end_date" type="datetime" :placeholder="$l.endTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="$l.belongingCollege" required>
                    <el-select v-model="trainingObj.form.college_id" :placeholder="$l.selectCollege" style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                        :value="i.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="$l.participants" required>
                    <el-input v-model.number="trainingObj.form.person_num"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$l.simplifiedTitle" required>
                <el-input v-model="trainingObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="$l.traditionalTitle">
                <el-input v-model="trainingObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="$l.englishTitle">
                <el-input v-model="trainingObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="$l.vietnameseTitle">
                <el-input v-model="trainingObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="$l.description" required>
                <el-input v-model="trainingObj.form.description" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$l.resources" name='detail'>
            <div style="float: right;margin-bottom: 10px;">
              <el-button type="primary" plain @click="showObj.selectCourse = true">{{$l.addCourse}}</el-button>
              <el-button type="success" plain @click="showObj.selectExam = true">{{$l.addExam}}</el-button>
              <el-button type="danger" plain @click="removeMultipleItemFormDetail">{{$l.batchRemove}}</el-button>
            </div>
            <el-table ref="detailTable" class="draggable-table-detail" :data="tableObj.detail" row-key='bind_id'
              tooltip-effect="dark" style="width: 100%" highlight-current-row highlight-selection-row stripe
              :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
              :row-style="{height:'90px',fontSize:'14px'}" @selection-change="detailSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="name_label" :label="$l.name">
              </el-table-column>
              <el-table-column prop="type" :label="$l.type">
                <template slot-scope="scope">
                  {{scope.row.type==1?$l.exam:$l.courseName}}
                </template>
              </el-table-column>
              <el-table-column prop="is_must" :label="$l.required">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.is_must" :active-value="1" :inactive-value="0">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column :label="$l.actions" fixed="right">
                <template slot-scope="scope">
                  <el-button class="text-green" type='text' @click="previewDetail(scope.row)">{{$l.preview}}</el-button>
                  <el-button class="text-red" type="text" @click="removeItemFormDetail(scope.$index)">{{$l.remove}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <div class="buttonBar">
          <el-button type="primary" @click="handleSubmit">{{$l.submit}}</el-button>
          <el-button type="danger" @click="showObj.trainingShow = false">{{$l.close}}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="pageBody-filter">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="trainingObj.query.college_id" :placeholder="$l.publicResources" @change="getTrainingList"
              :clearable="isAdmin">
              <el-option v-if="isAdmin" :label="$l.allColleges" value=""></el-option>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.name">
            <el-input v-model="trainingObj.query.name" clearable @clear='getTrainingList'
              @keyup.native.enter="getTrainingList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="trainingObj.query.is_valid" @change="getTrainingList" style="width: 100px;">
              <el-option :label="$l.all" value=""></el-option>
              <el-option :label="$l.enable" value="Y"></el-option>
              <el-option :label="$l.disable" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getTrainingList">{{$l.search}}</el-button></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="addTraining">{{$l.createNew}}</el-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <el-Table :data='trainingObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
          highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
          :row-style="{height:'60px',fontSize:'14px'}">
          <el-table-column type="index" width="50" :label='$l.serialNumber'>
          </el-table-column>
          <el-table-column :label="$l.simplifiedTitle" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.description" prop="description"></el-table-column>
          <el-table-column :label="$l.startTime" prop="start_date"></el-table-column>
          <el-table-column :label="$l.endTime" prop="end_date"></el-table-column>
          <el-table-column :label="$l.enableStatus" prop="is_valid"></el-table-column>
          <el-table-column :label="$l.actions" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="modifyTraining(scope.row)">{{$l.manage}}</el-button>
              <el-button v-if="scope.row.is_valid=='N'" type='text' style="color: seagreen;"
                @click="modifyStatus(scope.row)">{{$l.enable}}</el-button>
              <el-button v-else type='text' style="color: red;" @click="modifyStatus(scope.row)">{{$l.disable}}</el-button>
            </template>
          </el-table-column>
        </el-Table>
      </div>

      <div class="trainingManage-pagenation">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="trainingObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="trainingObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="trainingObj.total" style="float: right;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  import Sortable from 'sortablejs'
  export default {
    name: 'videoAdminPlan',
    data() {
      return {
        coverObj: {
          needUpload: false,
          dialogImageUrl: "",
          imageUrl: "",
          file: ""
        },
        showObj: {
          activeTabName: 'data',
          selectCourse: false,
          selectExam: false,
          trainingShow: false,
          coverDialog: false,
          initSortable: false
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
        tableObj: {
          detail: [], //培训的资源，上传时会使用到
          detailSelection: [], //用户勾选的培训的资源
          courseSelection: [], //用户勾选的课程
          examSelection: [], //用户勾选的考试
        },
        publicCodeObj: {
          collegeList: []
        },
        trainingObj: {
          query: {
            college_id: "",
            page: 1,
            pageSize: 10,
            name: "",
            is_valid: ''
          },
          form: {
            id: "",
            name_zh: "",
            name_en: "",
            name_vi: "",
            name_tw: "",
            college_id: "",
            thumbnail_path: '',
            oldthumbnail_path: '',
            description: "",
            person_num: "",
            start_date: "",
            end_date: "",
            detail: [],
            is_valid: "Y",
            rec_status: 1,
          },
          list: []
        },

        courseObj: {
          query: {
            search_type: 1,
            catalog_id: "",
            college_id: "",
            name: "",
            description: "",
            tag_id: [],
            page: 1,
            pageSize: 10,
            is_valid: '',
            is_his:0
          },
          total: 0,
          list: []
        },

        examObj: {
          query: {
            college_id:'',
            name:'',
            page: 1,
            pageSize: 12
          },
          total: 0,
          list: []
        },
      }
    },
    computed: {
      ...mapGetters(['isAdmin']),
    },

    methods: {
      /*********   视频封面  start   *********/

      coverSelect(filed) {
        this.$refs.coverInput.click()
      },

      coverPreview(url) {
        if (!url) return
        this.coverObj.dialogImageUrl = url
        this.showObj.coverDialog = true
      },

      uploadCoverChange(e) {
        let file = e.target.files[0]
        if (!file) return;
        // 使用 FileReader 读取文件
        let reader = new FileReader();
        reader.onload = (r) => {
          this.coverObj.imageUrl = r.target.result; // 将读取的结果赋值给 imageUrl
        };
        reader.readAsDataURL(file); // 读取文件为 Data URL
        this.coverObj.file = file
        this.coverObj.needUpload = true
      },

      uploadCover(next) {
        //上传封面
        let formData = new FormData();
        formData.append('formFile', this.coverObj.file);
        this.$request(this.$api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
          .then(r => {
            if (r.httpCode == 200 && r.data.url) {
              this.trainingObj.form.thumbnail_path = r.data.url
              this.coverObj = {
                needUpload: false,
                dialogImageUrl: "",
                imageUrl: "",
                file: "",
              }
              this.$refs.coverInput.value = ''; //清空文件选择的内容
              this.submitTraining()
            }
          })
          .catch(e => {
            // this.uploadStatus = e.message
          })
      },

      /*********   视频封面  end   *********/

      async previewDetail(i) {
        if (i.type === '0' || i.type === 0) {
          let routeUrl = this.$router.resolve({
            name: 'play',
            query: {
              course_primary_id: i.bind_id,
              // is_his:1
            }
          }).href;
          // 使用 window.open 打开新窗口
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
          // 使用window.open打开新标签页
          window.open(url, '_blank');
        }

      },

      getExamList() {
        this.$request(this.$api.videoServer + '/Video/VideoExam/getExamList', this.examObj.query)
          .then(r => {
            this.examObj.list = r.data.list
          })
          .catch(e => {
            console.log(e);
          })
      },

      getCourseList() {
        this.courseObj.query.is_public = ""
        if (!this.isAdmin) {
          if (this.courseObj.query.college_id == '') {
            this.courseObj.query.is_public = 1
          }
        }
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', this.courseObj.query, 'post')
          .then(r => {
            this.courseObj.list = r.data.list
            this.courseObj.total = r.data.total
            this.showObj.addOrModifyCourse = false
          })
          .catch(e => {
            console.log(e);
          })
      },

      selectItemToDetail(data) {

        if (this.tableObj.detail.some(i => i.bind_id === data.id)) {
          this.$message.error(this.$l.examExists)
        } else {
          this.$set(data, 'is_must', 0)
          this.$set(data, 'bind_id', data.id)
          this.$set(data, 'type', this.showObj.selectCourse ? 0 : 1)
          this.$set(data, 'id', '')
          this.tableObj.detail.push(data)
        }
      },

      selectMultipleItemToDetail() {
        let selectCourse = this.showObj.selectCourse ? true : false
        let idSet = new Set(this.tableObj.detail.map(i => i.bind_id))

        if (selectCourse) {
          this.tableObj.courseSelection.forEach(i => {
            if (!idSet.has(i.id)) {
              this.$set(i, 'is_must', 0)
              this.$set(i, 'type', 0) //资源类型，0是课程，1是考试
              this.$set(i, 'bind_id', i.id)
              this.$set(i, 'id', '')
              this.tableObj.detail.push(i)
            }
          })
          this.$refs.courseDialogTable.clearSelection();
          this.showObj.selectCourse = false
        } else {
          this.tableObj.examSelection.forEach(i => {
            if (!idSet.has(i.id)) {
              this.$set(i, 'is_must', 0)
              this.$set(i, 'type', 1) //资源类型，0是课程，1是考试
              this.$set(i, 'bind_id', i.id)
              this.$set(i, 'id', '')
              this.tableObj.detail.push(i)
            }
          })
          this.$refs.examDialogTable.clearSelection();
          this.showObj.selectExam = false
        }
        this.$message({
          type: 'success',
          message: this.$l.addedSuccess
        })
      },

      removeItemFormDetail(index) {
        this.tableObj.detail.splice(index, 1)
      },

      removeMultipleItemFormDetail() {
        let idsToDelete = this.tableObj.detailSelection.map(item => item.id); // 假设每行有一个唯一的id属性
        this.tableObj.detail = this.tableObj.detail.filter(item => !idsToDelete.includes(item.id));
        this.$refs.detailTable.clearSelection();
      },

      courseSelectionChange(val) {
        this.tableObj.courseSelection = val
      },

      examSelectionChange(val) {
        this.tableObj.examSelection = val
      },

      detailSelectionChange(val) {
        this.tableObj.detailSelection = val
      },

      swiperTab(v) {
        if (v.name == 'detail') {
          if (this.showObj.initSortable == false) {
            const tbodyVideo = document.querySelector(".draggable-table-detail .el-table__body-wrapper tbody");
            new Sortable(tbodyVideo, {
              animation: 150,
              // 需要在odEnd方法中处理原始eltable数据，使原始数据与显示数据保持顺序一致
              onEnd: ({
                newIndex,
                oldIndex
              }) => {
                let temp = _.cloneDeep(this.tableObj.detail)
                let targetRow = this.tableObj.detail[oldIndex];
                temp.splice(oldIndex, 1);
                temp.splice(newIndex, 0, targetRow);
                this.$nextTick(() => {
                  this.$set(this.tableObj, 'detail', temp)
                })
              },
            });
            this.showObj.initSortable = true
          }
        }

      },

      updateTableMaxHeight() {
        //返回表格最大高度
        const container = this.$refs.tableContainer;
        if (container) {
          this.cssObj.tableMaxHeight = container.clientHeight + 'px';
        }
      },

      handleSizeChange(i) {
        this.trainingObj.query.pageSize = i
        this.getTrainingList()
      },

      handlePageChange(i) {
        this.trainingObj.query.page = i
        this.getTrainingList()
      },

      addTraining() {
        this.trainingObj.form = {
            college_id: "",
            id: "",
            name_zh: "",
            name_en: "",
            name_vi: "",
            name_tw: "",
            description: "",
            person_num: "",
            start_date: "",
            end_date: "",
            is_valid: "Y",
            is_valid: "Y",
            rec_status: 1,
            detail: []
          },
          this.tableObj.detail = []
        this.showObj.trainingShow = true
      },

      modifyTraining(data) {
        this.coverObj = {
          needUpload: false,
          dialogImageUrl: "",
          imageUrl: "",
          file: { //选择的视频文件信息
            name: ''
          },
        }
        this.$request(this.$api.videoServer + '/Video/VideoTrain/getTrainDetil', {
          id: data.id
        }).then(r => {
          this.trainingObj.form = r.data
          this.tableObj.detail = r.data.detail
          if (r.data.thumbnail_path) {
            this.trainingObj.form.oldthumbnail_path = r.data.thumbnail_path
          }
          this.showObj.trainingShow = true
        })
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

        this.$prompt(this.$l.confirmDisable.replace('{oprate}', oprate).replace('{name}', i.name_label), {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: this.$l.inputError,
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel
          }).then(() => {
            this.$request(this.$api.videoServer + '/Video/VideoTrain/ModifyTrainStatus', {
              key: i.id,
              value: value
            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message: this.$l.operationSuccess
              })
              this.getTrainingList()
            })
          })
          .catch(() => {})
      },

      handleSubmit() {
        if (this.trainingObj.form.id == '' && !this.coverObj.needUpload) {
          return this.$message({
            type: 'info',
            message: this.$l.noCoverSelected
          })
        }
        if (this.trainingObj.form.college_id == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noCollegeSelected
          })
        }
        if (this.trainingObj.form.start_date == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noStartTime
          })
        }
        if (this.trainingObj.form.end_date == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noEndTime
          })
        }
        if (this.trainingObj.form.person_num == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noParticipants
          })
        }
        if (this.trainingObj.form.name_zh == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noSimplifiedTitle
          })
        }
        if (this.trainingObj.form.description == '') {
          return this.$message({
            type: 'info',
            message: this.$l.noDescription
          })
        }
        if (this.coverObj.needUpload) {
          this.uploadCover()
        } else {
          this.submitTraining()
        }
      },

      submitTraining() {
        let detail = []
        if (this.tableObj.detail.length > 0) {
          this.tableObj.detail.forEach((i, index) => {
            if (i.id == '') {
              this.$set(i, 'train_id', this.trainingObj.id)
            }
            detail.push({
              id: i.id,
              train_id: i.train_id,
              bind_id: i.bind_id,
              type: i.type,
              is_must: i.is_must,
              sort: index,
              is_valid: 'Y',
              rec_status: 1,
            })
          })
        }

        this.$set(this.trainingObj.form, 'detail', detail)

        this.$request(this.$api.videoServer + '/Video/VideoTrain/addOrModifyTrain', this.trainingObj.form, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.submitSuccess
              })
              this.showObj.trainingShow = false
              this.getTrainingList()
            }
          })
          .catch(e => {})
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
                  message: this.$l.noData
                })
              }
            }
          })
          .catch(e => {})
      },

      getCollegeList() {
        // 根据页面路由获取管理学院
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
            if (!this.isAdmin) {
              this.trainingObj.query.college_id = r.data[0].id
              this.examObj.query.college_id = r.data[0].id
            }
            this.getTrainingList()
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },
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
    },
  }
</script>


<style lang="scss">
  .modifyCover {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .change {
      text-align: center;
      color: #409fee;
      font-size: 50px;

    }
  }

  .cover {
    position: relative;
    width: 260px;
    height: 150px;
    display: flex;
    align-items: center;

    .auto-img {
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
      cursor: pointer;
    }

    &:hover {
      .cover-oprate {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: rgba(167, 167, 167, 0.7);
        color: white;
        font-size: 30px;

        .iconZoom {
          margin-top: 15%;

          &:hover {
            color: #409fee;
          }
        }

        .iconRefresh {
          margin-top: 15%;

          &:hover {
            color: #00aa7f;
          }
        }
      }
    }

    .plus-icon {
      width: 140px;
      height: 140px;
      border: 2px dotted #ccc;
      border-radius: 5px;
      color: #999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #409fee;
      }
    }

    .cover-oprate {
      display: none;



    }
  }

  .trainingManage-container {
    width: 100%;
    height: 100%;

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
        padding: 14px;
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
