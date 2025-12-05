<template>
  <div class="lessonList-container">

    <div class="components">
      <!-- 文件预览 -->
      <filePreviews :file-url="showObj.fileUrl" :visible="showObj.filePreviews"
        @update:visible="showObj.filePreviews = $event" />

      <input ref="attachmentInput" type="file" @change="uploadattAchmentChange" style="display: none;" />

      <el-dialog :visible.sync="showObj.attachment" title="上传附件" width="50%">
        <el-form>
          <el-form-item label="简中名字" required>
            <el-input v-model="attachmentObj.file_name_zh"></el-input>
          </el-form-item>
          <el-form-item label="繁中名字">
            <el-input v-model="attachmentObj.file_name_tw"></el-input>
          </el-form-item>
          <el-form-item label="英文名字">
            <el-input v-model="attachmentObj.file_name_en"></el-input>
          </el-form-item>
          <el-form-item label="越南名字">
            <el-input v-model="attachmentObj.file_name_vi"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="showObj.attachment = false">取 消</el-button>
          <el-button type="primary" @click="uploadAttachment">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 选择图片input -->
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

      <!-- 预览图片dialog -->
      <el-dialog :visible.sync="showObj.coverDialog" :title="$l.preview">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit='fill'>
      </el-dialog>

      <!-- 管理播放中答题dialog -->
      <el-dialog :visible.sync="showObj.processQuestion" :title="$l.addQuestion" width="75%" :before-close="videoClose">
        <el-row>
          <el-col :span="10">
            <div style="width: 100%;aspect-ratio: 1.8;">
              <videoPlayer ref="videoPlayer" :src="showObj.videoUrl" :markers="manageObj.questionList">
              </videoPlayer>
            </div>
          </el-col>
          <el-col :span="14">
            <div style="float: right;margin-bottom: 10px;">
              <el-button type="success" plain @click="flashMarkers">{{$l.refreshMarkers}}</el-button>
              <el-button type="primary" plain @click="getQuestionList">{{$l.addQuestion}}</el-button>
              <el-button type="danger" plain @click="removeMultipleQuestion">{{$l.multipleRemove}}</el-button>
            </div>
            <el-table ref="questionTable" :data="manageObj.questionList" tooltip-effect="dark" style="width: 100%"
              highlight-current-row highlight-selection-row stripe show-overflow-tooltip
              @selection-change="questionSelectionChange">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="50" label='No.'></el-table-column>
              <el-table-column :label="$l.question" prop="name_label"></el-table-column>
              <el-table-column :label="$l.activeTime" prop="time" width="120">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.time"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$l.diffcult" prop="difficulty_level" width="80"></el-table-column>
              <el-table-column :label="$l.questionType" prop="question_type" width="80">
                <template slot-scope="scope">
                  {{returnPublicObjLabel(scope.row.question_type,'value','label','question_type')}}
                </template>
              </el-table-column>
              <!-- <el-table-column :label="$l.publishStatus" prop="question_status" width="80">
                <template slot-scope="scope">
                  {{returnPublicObjLabel(scope.row.question_status,'value','label','question_status')}}
                </template>
              </el-table-column> -->
              <!-- <el-table-column :label="$l.status" prop="is_valid">
                  <template slot-scope="scope">
                    {{scope.row.is_valid=='Y'?'$c.enable:$c.disable}}
                  </template>
                </el-table-column> -->
              <el-table-column :label="$c.operation" width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button type='text' class="text-red"
                    @click="removeQuestion(scope.$index)">{{$c.remove}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>


        </el-row>

        <div slot="footer" class="">
          <el-button @click="showObj.processQuestion = false">{{$l.giveup}}</el-button>
          <el-button type="primary" @click="submitProcessQuestion">{{$l.submit}}</el-button>
        </div>
      </el-dialog>

      <!-- 添加答题dialog -->
      <el-dialog :visible.sync="showObj.selectQuestion" :title="$l.addQuestion" width="50%">
        <el-form inline label-width="40px">
          <el-form-item :label="$c.title">
            <el-input v-model="questionObj.query.name"></el-input>
          </el-form-item>
          <el-form-item :label="$l.questionType">
            <el-select v-model="questionObj.query.question_type" @change="getQuestionList" style="width: 100px;">
              <el-option :label="$c.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_type" :key='i.value' :label="i.label"
                :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="questionObj.query.question_status" @change="getQuestionList" style="width: 100px;">
              <el-option :label="$c.all" value=""></el-option>
              <el-option v-for="i in publicCodeObj.question_status" :key='i.value' :label="i.label"
                :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getQuestionList">{{$l.search}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" plain @click="selectMultipleQuestion">{{$l.multipleAdd}}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="questionDialogTable" :data="questionObj.list" tooltip-effect="dark" style="width: 100%"
          highlight-current-row highlight-selection-row stripe show-overflow-tooltip
          @selection-change="questionSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" label='No.'></el-table-column>
          <el-table-column :label="$l.question" prop="name_label"></el-table-column>
          <el-table-column :label="$l.diffcult" prop="difficulty_level" width="80"></el-table-column>
          <el-table-column :label="$l.questionType" prop="question_type" width="80">
            <template slot-scope="scope">
              {{returnPublicObjLabel(scope.row.question_type,'value','label','question_type')}}
            </template>
          </el-table-column>
          <el-table-column :label="$l.publishStatus" prop="question_status" width="80">
            <template slot-scope="scope">
              {{returnPublicObjLabel(scope.row.question_status,'value','label','question_status')}}
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$l.stastus" prop="is_valid">
              <template slot-scope="scope">
                {{scope.row.is_valid=='Y'?$c.enable:'$c.disable}}
              </template>
            </el-table-column> -->
          <el-table-column :label="$c.operation" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="selectQuestion(scope.row)">{{$l.add}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 选择视频dialog -->
      <el-dialog :visible.sync="showObj.selectVideo" @open='getVideoList' :title="$l.addVideo" width="70%">
        <div class="videoSelect-dialog">
          <el-form inline>
            <el-form-item :label="$l.belongCollege">
              <el-select v-model="videoListObj.query.college_id" :placeholder="$l.emptyIsPublicCourse" clearable>
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.title">
              <el-input v-model="videoListObj.query.title" clearable @clear='getVideoList'
                @keyup.native.enter="getVideoList"></el-input>
            </el-form-item>
            <el-form-item :label="$l.videoType">
              <el-select v-model="videoListObj.query.is_public" :disabled="!isAdmin&&videoListObj.query.college_id==''"
                style="width: 100px;" @change="getVideoList">
                <el-option :label="$c.all" value=""></el-option>
                <el-option :label="$l.public" :value="1"></el-option>
                <el-option :label="$l.private" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getVideoList">{{$l.search}}</el-button>
              <el-button type="success" @click="selectMultipleVideo">{{$l.multipleAdd}}</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="videoDialogTable" class='video-table' :data="videoListObj.list" tooltip-effect="dark"
            highlight-current-row highlight-selection-row stripe border max-height="500px"
            @selection-change="videoSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="50" label='No.'>
            </el-table-column>
            <el-table-column prop="thumbnail_path" :label="$l.cover">
              <template slot-scope="scope">
                <img class="auto-img" :src="$api.videoServer+'/'+scope.row.thumbnail_path" height="50px"
                  @click="coverPreview($api.videoServer+'/'+ scope.row.thumbnail_path)" />
              </template>
            </el-table-column>
            <el-table-column prop="title" :label="$l.title">
            </el-table-column>
            <el-table-column prop="description" :label="$l.desc">
            </el-table-column>
            <el-table-column :label="$l.belongCollege">
              <template slot-scope="scope">
                {{returnPublicObjLabel(scope.row.college_id,'id','name_label','allCollegeList')}}
              </template>
            </el-table-column>
            <el-table-column :label="$l.duration">
              <template slot-scope="scope">
                {{formatDuration(scope.row.duration,true)}}
              </template>
            </el-table-column>
            <el-table-column :label="$c.operation" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="selectVideo(scope.row)">{{$l.add}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleVideoSizeChange" @current-change="handleVideoPageChange"
            :current-page="videoListObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="videoListObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="videoListObj.total" style="float: right;">
          </el-pagination>
        </div>
      </el-dialog>

      <!-- 选择考试dialog -->
      <el-dialog :visible.sync="showObj.selectExam" @open='getExamList' :title="$l.addExam" width="70%">
        <div class="videoSelect-dialog">
          <el-form inline label-width="60px">
            <el-form-item :label="$l.title">
              <el-input v-model="examObj.query.name" clearable @clear='getExamList'
                @keyup.native.enter="getExamList"></el-input>
            </el-form-item>
            <el-form-item :label="$l.status">
              <el-select v-model="examObj.query.is_valid" style="width: 100px;" @change="getExamList">
                <el-option :label="$c.all" value=""></el-option>
                <el-option :label="$c.enable" value="Y"></el-option>
                <el-option :label="$c.disable" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="getExamList">{{$l.search}}</el-button>
              <el-button type="primary" plain @click="selectMultipleExam">{{$l.multipleAdd}}</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="examDialogTable" :data="examObj.list" tooltip-effect="dark" style="width: 100%"
            highlight-current-row highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle"
            :max-height="cssObj.tableMaxHeight" show-overflow-tooltip @selection-change="examSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="50" label='No.'></el-table-column>
            <el-table-column :label="$l.title" prop="name_label"></el-table-column>
            <el-table-column :label="$l.passScore" prop="pass_score"></el-table-column>
            <el-table-column :label="$l.maxReplyNum" prop="max_reply_num"></el-table-column>
            <el-table-column :label="$l.examDuration" prop="test_duration"></el-table-column>
            <el-table-column :label="$l.startTime" prop="start_time"></el-table-column>
            <el-table-column :label="$l.endTime" prop="end_time"></el-table-column>
            <el-table-column :label="$l.statuts" prop="is_valid"></el-table-column>
            <el-table-column :label="$c.operation" fixed="right">
              <template slot-scope="scope">
                <el-button class="text-green" type='text' @click="previewExam(scope.row)">{{$l.preview}}</el-button>
                <el-button type='text' @click="selectExam(scope.row)">{{$l.add}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleExamSizeChange" @current-change="handleExamPageChange"
            :current-page="examObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="examObj.query.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="examObj.total" style="float: right;">
          </el-pagination>
        </div>
      </el-dialog>

      <!-- 新增或修改课程以及配套资源 -->
      <el-drawer class="drawer-container" direction='btt' :visible.sync="showObj.addOrModifyCourse"
        :wrapperClosable='false' size="92%" @opened="getPopoverWidth">
        <div slot='title' class="title">{{$l.manageCourse}}</div>
        <el-tabs type="border-card" class="form-container" @tab-click="tabClick" v-model="showObj.activeTabName">
          <el-tab-pane :label="$l.basicalInfo" name="data">
            <el-form label-width="100px" size="medium">
              <el-form-item :label="$l.cover" v-if="courseObj.newForm.id==''">
                <div v-if="coverObj.imageUrl==''" class="cover">
                  <div class="plus-icon" @click="coverSelect">
                    <i class="el-icon-upload" style="font-size: 30px;"></i>
                    <div>
                      {{$l.chooseCover}}
                    </div>
                  </div>
                </div>
                <div v-else class="cover">
                  <el-image :src="coverObj.imageUrl" style="height: 150px;"></el-image>
                  <div class="cover-oprate">
                    <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                    <i class="el-icon-refresh-left iconRefresh" @click="coverSelect"></i>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$l.cover" v-else>
                <div class="modifyCover">
                  <div class="cover">
                    <el-image :src="$api.videoServer+'/'+ courseObj.newForm.thumbnail_path"></el-image>
                    <div class="cover-oprate">
                      <i class="el-icon-zoom-in iconZoom"
                        @click="coverPreview($api.videoServer+'/'+ courseObj.newForm.oldthumbnail_path)"></i>
                    </div>
                  </div>
                  <div class="change"><i class="el-icon-right"></i></div>
                  <div>
                    <div v-if="coverObj.imageUrl==''" class="cover">
                      <div class="plus-icon" @click="coverSelect">
                        <i class="el-icon-upload" style="font-size: 30px;"></i>
                        <div>
                          {{$l.chooseCover}}
                        </div>
                      </div>
                    </div>
                    <div v-else class="cover">
                      <el-image :src="coverObj.imageUrl"></el-image>
                      <div class="cover-oprate">
                        <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                        <i class="el-icon-refresh-left iconRefresh" @click="coverSelect"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-row v-if="isAdmin">
                <el-col :span="12">
                  <el-form-item :label="$l.belongCollege" required>
                    <el-select v-model="courseObj.newForm.college_id" :placeholder="$l.pleaseSelectCollege"
                      style="width: 100%;" clearable>
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                        :value="i.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="组织编码" required>
                    <el-select v-model="courseObj.newForm.org_id" style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.org_id" :key="i.id" :label="i.label"
                        :value="i.value"></el-option>
                    </el-select>
                  </el-form-item> -->
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.courseType">
                    <el-switch v-model="courseObj.newForm.is_public" active-color="#13ce66" :active-value="1"
                      :active-text="$l.public" :inactive-value="0">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item label="课程学分">
                    <el-input v-model="courseObj.newForm.score"></el-input>
                  </el-form-item>
                </el-col> -->
              </el-row>
              <el-row v-else>
                <el-col :span="12">
                  <el-form-item :label="$l.belongCollege">
                    <el-select v-model="courseObj.newForm.college_id" :placeholder="$l.pleaseSelectCollege"
                      style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                        :value="i.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>



              <el-row>
                <el-col :span="6">
                  <el-form-item :label="$l.name_zh" required>
                    <el-input v-model="courseObj.newForm.name_zh"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.name_tw">
                    <el-input v-model="courseObj.newForm.name_tw"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.name_en">
                    <el-input v-model="courseObj.newForm.name_en"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.name_vi">
                    <el-input v-model="courseObj.newForm.name_vi"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$l.courseCatalog" required>
                    <el-select v-model="courseObj.newForm.type" :placeholder="$l.courseCatalogPd" style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.courseCatalog" :key="i.value" :label="i.label"
                        :value="i.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$l.lecturer" required>
                    <el-select v-model="courseObj.newForm.lecturer" :placeholder="$l.lecturerPd" style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.lecturer_status" :key="i.value" :label="i.label"
                        :value="i.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$l.trainLanguage" required>
                    <el-select v-model="courseObj.newForm.language" :placeholder="$l.trainLanguagePd"
                      style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.language_type" :key="i.value" :label="i.label"
                        :value="i.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$l.tag">
                    <el-popover placement="bottom" :width.sync="cssObj.popoverWidth" trigger="click">
                      <div class="tag-container">
                        <div class="tag-title" style="margin-bottom: 10px;">{{$l.tagPd}}</div>
                        <el-tag style=" margin: 5px 10px;padding: 0 10px;white-space: nowrap;"
                          v-for="(i,index) in tagObj.list" :key="index" @click="selectTag(i)"
                          :effect="selectedTags.includes(i)?'dark':'plain'">{{i.name_label}}</el-tag>
                      </div>
                      <div ref="tagInput" slot="reference" class="tagInput">
                        <div v-if="selectedTags.length>0">
                          <el-tag class="tags" closable v-for="(i,index) in selectedTags" :key="index"
                            @close="selectTag(i)">{{i.name_label}}</el-tag>
                        </div>
                        <div v-else style="margin-left: 1em;color: #aaa;">{{$l.chooseTagPd}}</div>
                        <div style="margin-right: 1em;color: #aaa;">
                          <span>{{selectedTags.length}}/5</span>
                          <span><i class="el-icon-arrow-down"></i></span>
                        </div>
                      </div>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$l.applicableGroup" required>
                    <el-input v-model="courseObj.newForm.applicable_group"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$l.profit" required>
                    <el-input v-model="courseObj.newForm.profit"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item :label="$l.desc">
                <el-input v-model="courseObj.newForm.description" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$l.courseVideo" name='video'>
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <el-button type="primary" plain @click="showObj.selectVideo = true">{{$l.addVideo}}</el-button>
              <el-button type="danger" plain @click="removeMultipleVideo">{{$l.multipleRemove}}</el-button>
            </div>
            <el-table ref="videoListTable" class="draggable-table-video" :data="manageObj.selectedVideoList"
              row-key='id' tooltip-effect="dark" style="width: 100%" highlight-current-row highlight-selection-row
              stripe :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight - 130"
              :row-style="{height:'90px',fontSize:'14px'}" @selection-change="videoSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <!-- <el-table-column type="index" width="50" label='序号'></el-table-column> -->
              <el-table-column prop="thumbnail_path" :label="$l.cover">
                <template slot-scope="scope">
                  <img class="auto-img" :src="$api.videoServer+'/'+scope.row.thumbnail_path" height="80px"
                    @click="coverPreview($api.videoServer+'/'+ scope.row.thumbnail_path)" />
                </template>
              </el-table-column>
              <el-table-column prop="title" :label="$l.title"></el-table-column>
              <el-table-column prop="description" :label="$l.desc"></el-table-column>
              <el-table-column :label="$l.duration">
                <template slot-scope="scope">
                  {{formatDuration(scope.row.duration,true)}}
                </template>
              </el-table-column>
              <!-- <el-table-column :label="$l.needToLearn">
                <template slot-scope="scope">
                  <el-input type="number" v-model.number="scope.row.finish_time" :placeholder="$l.needToLearnPd"
                    :max="100" :min="0" :maxlength="3" :minlength="0"></el-input>

                </template>
              </el-table-column> -->
              <el-table-column prop="is_process_question" :label="$l.playQuestion">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.is_process_question" active-color="#13ce66" inactive-color="#ccc"
                    :active-value="true" :inactive-value="false">
                  </el-switch>
                  <el-button v-show="scope.row.is_process_question" class="text-green" type="text"
                    @click="openProcessQuestion(scope.row)">{{$l.playQuestionManage}}</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="score" :label="$l.score">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.score" :placeholder="$l.scorePd"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column :label="$c.operation" fixed="right">
                <template slot-scope="scope">
                  <el-button v-show="rightCheck(courseObj.newForm)" class="text-red" type="text"
                    @click="removeVideo(scope.$index)">{{$l.remove}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane :label="$l.courseExam" name="exam">
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <el-button type="primary" plain @click="showObj.selectExam = true">{{$l.addExam}}</el-button>
              <el-button type="danger" plain @click="removeMultipleExam">{{$l.multipleRemove}}</el-button>
            </div>
            <el-table ref="examListTable" class="draggable-table-exam" :data="manageObj.selectedExamList" row-key='id'
              tooltip-effect="dark" style="width: 100%" highlight-current-row highlight-selection-row stripe
              :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight - 130"
              @selection-change="examSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <!-- <el-table-column type="index" width="50" label='序号'></el-table-column> -->
              <el-table-column :label="$l.title" prop="name_label"></el-table-column>
              <el-table-column :label="$l.passScore" prop="pass_score"></el-table-column>
              <el-table-column :label="$l.maxReplyNum" prop="max_reply_num"></el-table-column>
              <el-table-column :label="$l.examDuration" prop="test_duration"></el-table-column>
              <el-table-column :label="$l.startTime" prop="start_time"></el-table-column>
              <el-table-column :label="$l.endTime" prop="end_time"></el-table-column>
              <!-- <el-table-column :label="$l.status" prop="is_valid"></el-table-column> -->
              <!-- <el-table-column prop="score" :label="$l.score">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.score" :placeholder="$l.scorePd"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column :label="$c.operation" fixed="right">
                <template slot-scope="scope">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <el-button class="text-green" type='text' @click="previewExam(scope.row)">{{$l.preview}}</el-button>
                    <el-button class='text-red' type='text' @click="removeExam(scope.$index)">{{$l.remove}}</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane :label="$l.courseAttachments" name="attachment">
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <el-button type="warning" plain @click="attachmentWarning">{{$l.importantNotice}}</el-button>
              <el-button :disabled='courseObj.newForm.id==""' type="primary" plain
                @click="attachmentSelect">{{$l.addAttachment}}</el-button>
              <el-button :disabled='courseObj.newForm.id==""' type="danger" plain
                @click="removeMultipleAttachment">{{$l.batchRemove}}</el-button>
            </div>
            <el-table ref="attachmentsListTable" :data="manageObj.attachmentsList" row-key='id' tooltip-effect="dark"
              style="width: 100%" highlight-current-row highlight-selection-row stripe
              :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight - 130"
              @selection-change="attachmentSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name_zh" :label="$l.simplifiedChineseName"></el-table-column>
              <el-table-column prop="file_type" :label="$l.fileType" show-overflow-tooltip></el-table-column>
              <el-table-column prop="file_size" :label="$l.fileSize" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{formatBytes(scope.row.file_size)}}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="file_url" label="地址" show-overflow-tooltip></el-table-column> -->
              <el-table-column :label="$l.operations" fixed="right">
                <template slot-scope="scope">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <el-button class="text-green" type='text' @click="previewFile(scope.row.file_url)">{{$l.preview}}</el-button>
                    <el-button class='text-red' type='text' @click="removeAttachment(scope.$index)">{{$l.remove}}</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <div class="buttonBar">
          <el-button v-show="rightCheck(courseObj.newForm)" type="primary"
            @click="handleSubmit">{{$l.submit}}</el-button>
          <el-button type="danger" @click="showObj.addOrModifyCourse = false">{{$l.giveup}}</el-button>
        </div>
      </el-drawer>
    </div>

    <!-- 主界面 -->
    <div class="lessonList-filter">
      <el-form inline>
        <el-form-item :label="$l.college">
          <el-select v-model="courseObj.query.college_id" @change="getCourseList"
            :placeholder="$l.emptyOnlyCanCheckPublic" clearable>
            <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
              :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$l.title">
          <el-input v-model="courseObj.query.name" clearable @clear='getCourseList'
            @keyup.native.enter="getCourseList"></el-input>
        </el-form-item>
        <el-form-item :label="$l.desc">
          <el-input v-model="courseObj.query.description" clearable @clear='getCourseList'
            @keyup.native.enter="getCourseList"></el-input>
        </el-form-item>

        <!-- <el-form-item :label="$l.catalog">
          <el-cascader  v-model="courseObj.query.catalog_id" :options="catalogObj.data" clearable :placeholder="$l.emptyIsRootCatalog"
            style="width: 100%;" :props="catalogObj.cascaderProps">
          </el-cascader>
        </el-form-item> -->

        <el-form-item :label="$l.courseType">
          <el-select v-model="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
            style="width: 100px;" @change="getCourseList">
            <el-option :label="$c.all" value=""></el-option>
            <el-option :label="$l.public" :value="1"></el-option>
            <el-option :label="$l.private" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$l.status">
          <div class="frcc">
            <el-select v-model="courseObj.query.is_valid" @change="getCourseList" style="width: 100px;">
              <el-option :label="$c.all" value=""></el-option>
              <el-option :label="$c.enable" value="Y"></el-option>
              <el-option :label="$c.disable" value="N"></el-option>
            </el-select>
            <el-button type="success" @click="getCourseList" style="margin-left:20px ;">{{$l.search}}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="lessonList-oprate">
      <el-button type="primary" plain @click="addCourse">{{$l.addCourse}}</el-button>
      <!-- <el-button type="primary" plain>批量发布</el-button> -->
      <!-- <el-button type="primary" plain>批量取消发布</el-button> -->
      <!-- <el-button type="primary" plain>导出课程</el-button> -->
    </div>

    <div class="lessonList-table" ref="tableContainer">
      <el-table ref="multipleTable" :data="courseObj.list" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" highlight-current-row highlight-selection-row stripe
        :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
        :row-style="{height:'100px',fontSize:'14px'}">

        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="index" width="50" label='No.'></el-table-column>
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
        <el-table-column :label="$l.title" prop="name_zh"></el-table-column>
        <el-table-column :label="$l.desc" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$l.courseCatalog" prop="name_zh">
          <template slot-scope="scope">
            {{returnPublicObjLabel(scope.row.type,'value','label','courseCatalog')}}
          </template>
        </el-table-column>
        <el-table-column :label="$l.belongCollege">
          <template slot-scope="scope">
            {{returnPublicObjLabel(scope.row.college_id,'id','name_label','allCollegeList')}}
          </template>
        </el-table-column>
        <el-table-column :label="$l.score" prop="score" width="100px"></el-table-column>
        <el-table-column :label="$l.duration" width="100px">
          <template slot-scope="scope">
            {{formatDuration(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column :label="$l.lecturer" width="100px">
          <template slot-scope="scope">
            {{scope.row.lecturer==1?$l.externalLecturer:$l.internalLecturer}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="版本" prop="version"></el-table-column> -->

        <el-table-column :label="$l.courseType" width="100px" fixed="right">
          <template slot-scope="scope">
            {{scope.row.is_public==1?$l.public:$l.private}}
          </template>
        </el-table-column>

        <!-- <el-table-column label="$l.status" prop="is_valid"></el-table-column> -->
        <el-table-column :label="$c.operation" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="rightCheck(scope.row)==false" type='text' style="color: #67c23a;"
              @click="modifyCourseBinding(scope.row)">{{$l.check}}</el-button>
            <el-button v-else-if="rightCheck(scope.row)==true" type='text' style="color: #409fee;"
              @click="modifyCourseBinding(scope.row)">{{$l.manage}}</el-button>
            <el-button v-if="scope.row.is_valid=='N'&&rightCheck(scope.row)" type='text' style="color: seagreen;"
              @click="modifyCourseStatus(scope.row)">$c.enable</el-button>
            <el-button v-if="scope.row.is_valid=='Y'&&rightCheck(scope.row)" type='text' style="color: red;"
              @click="modifyCourseStatus(scope.row)">{{$c.disable}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="lessonList-pagenation">
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
        :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="courseObj.query.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="courseObj.total" style="float: right;">
      </el-pagination>
    </div>
  </div>
</template>


<script>
  import Sortable from 'sortablejs'
  import {
    mapGetters
  } from 'vuex'

  import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
  import {
    _
  } from '@/views/_common'
  import filePreviews from '@/views/_common/filePreviews.vue'
  export default {
    name: 'videoAdminCourse',
    components: {
      videoPlayer,
      filePreviews
    },
    data() {
      return {
        initSortableObj: {
          video: false,
          exam: false
        },
        videoListObj: {
          query: {
            is_public: "",
            college_id: "",
            title: "",
            page: 1,
            pageSize: 15
          },
          total: 0,
          list: []
        },
        questionObj: {
          video_id: '',
          query: {
            name: '',
            question_status: '',
            question_type: '',
            question_category_id: '',
            id: ''
          },
          list: []
        },
        examObj: {
          query: {
            name: "",
            is_valid: "",
            page: 1,
            pageSize: 12
          },
          total: 0,
          list: []
        },
        manageObj: {
          currentPrimaryId: '',
          videoList: [],
          videoSelection: [],
          examList: [],
          examSelection: [],
          selectedVideoList: [],
          selectedExamList: [],
          questionList: [],
          questionSelection: [],
          attachmentsList: [],
          attachmentSelection: []
        },
        showObj: {
          videoUrl: '',
          activeTabName: 'data',
          addOrModifyCourse: false,
          coverDialog: false,
          selectVideo: false,
          selectExam: false,
          processQuestion: false,
          selectQuestion: false,
          attachment: false,
          filePreviews: false,
          fileUrl: ""
        },
        catalogObj: {
          cascaderProps: {
            expandTrigger: 'hover',
            checkStrictly: true,
            emitPath: false,
            value: 'id',
            label: 'name_label'
          },
          data: [],
          query: {
            org_id: ''
          },
        },
        coverObj: {
          dialogImageUrl: "",
          imageUrl: "",
          file: { //选择的视频文件信息
            name: ''
          },
        },
        attachmentObj: {
          id: '',
          file_name_zh: '',
          file_name_tw: '',
          file_name_en: '',
          file_name_vi: '',
          file: ''
        },
        cssObj: {
          tableMaxHeight: '400px',
          popoverWidth: "600px",
          headerRowStyle: {
            background: '#f2f4f9',
            color: '#505050',
            fontSize: '14px',
            height: '50px'
          }
        },
        selectedTags: [],
        tagObj: {
          query: {
            page: 1,
            pageSize: 9999,
            name: ""
          },
          list: [],
          total: 0
        },
        courseObj: {

          newForm: {
            id: "",
            type: '', //课程类别
            name_zh: "",
            name_tw: "",
            name_en: "",
            name_vi: "",
            description: "",
            college_id: '',
            is_public: "",
            org_id: "",
            thumbnail_path: "",
            score: "",
            applicable_group: "",
            profit: "",
            lecturer: "",
            language: "",
            tag_ids: [],
            video_exam_list: []
          },

          query: {
            search_type: 1,
            college_id: '',
            is_public: '',
            catalog_id: "",
            name: "",
            description: "",
            tag_id: [],
            page: 1,
            pageSize: 10,
            is_valid: '',
            is_his: 0
          },
          total: 0,
          list: [],
          multipleSelection: []
        },

        publicCodeObj: {
          allCollegeList:[],
          collegeList: [],
          org_id: [],
          language_type: [],
          courseCatalog: [],
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
              label: this.$l.published,
              value: 0
            },
            {
              label: this.$l.unpublished,
              value: 1
            }
          ],
          lecturer_status: [{
              label: this.$l.externalLecturer,
              value: 0
            },
            {
              label: this.$l.internalLecturer,
              value: 1
            }
          ],
        }
      }
    },

    computed: {
      ...mapGetters(['isAdmin']),
    },

    watch: {
      "courseObj.query.college_id"(newVal, oldVal) {
        if (newVal && oldVal === '') {
          this.courseObj.query.is_public = ''
        }
        if (!this.isAdmin) {
          if (newVal == '') {
            this.courseObj.query.is_public = 1
          }
        }
        this.getCourseList()
      },
      "videoListObj.query.college_id"(newVal, oldVal) {
        if (newVal && oldVal === '') {
          this.videoListObj.query.is_public = ''
        }
        if (!this.isAdmin) {
          if (newVal == '') {
            this.videoListObj.query.is_public = 1
          }
        }
        this.getVideoList()
      }
    },


    methods: {
      previewFile(url) {
        this.showObj.fileUrl = this.$api.videoServer + '/' + url
        this.showObj.filePreviews = true
      },
      formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        // 使用toFixed(2)保留两位小数，可根据需求调整
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },

      attachmentWarning() {
        this.$alert(this.$l.attachmentWarningMessage)
      },

      getAttachments(id) {
        this.manageObj.attachmentsList = []
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts', {
            course_primary_id: id,
            page: 1,
            pageSize: 9999
          })
          .then(r => {
            if (r.httpCode == 200) {
              this.manageObj.attachmentsList = r.data.list
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      attachmentSelect() {
        this.$refs.attachmentInput.click()
      },

      attachmentSelectionChange(val) {
        this.manageObj.attachmentSelection = val
      },

      uploadattAchmentChange(e) {
        let file = e.target.files[0]
        this.attachmentObj.file = file
        this.attachmentObj.file_name_zh = file.name
        this.showObj.attachment = true
      },

      uploadAttachment() {
        let formData = new FormData();
        formData.append('id', this.attachmentObj.id);
        formData.append('file_name_zh', this.attachmentObj.file_name_zh);
        formData.append('file_name_tw', this.attachmentObj.file_name_tw);
        formData.append('file_name_en', this.attachmentObj.file_name_en);
        formData.append('file_name_vi', this.attachmentObj.file_name_vi);
        formData.append('file', this.attachmentObj.file);
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/uploadAttachment', formData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.manageObj.attachmentsList.push({
                id: r.data.id,
                file_url: r.data.file_url,
                name_zh: r.data.file_name_zh,
                name_tw: r.data.file_name_tw,
                name_en: r.data.file_name_en,
                name_vi: r.data.file_name_vi,
                name_label: "",
                file_type: r.data.file_type,
                file_size: r.data.file_size,
                file_md5: r.data.file_md5
              })
              this.$refs.attachmentInput.value = ""
              this.attachmentObj = {
                id: '',
                file_name_zh: '',
                file_name_tw: '',
                file_name_en: '',
                file_name_vi: '',
                file: ''
              }
              this.showObj.attachment = false
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      removeAttachment(i) {
        this.manageObj.attachmentsList.splice(i, 1)
      },

      removeMultipleAttachment() {
        let idsToDelete = this.manageObj.attachmentSelection.map(item => item.id); // 假设每行有一个唯一的id属性
        this.manageObj.attachmentsList = this.manageObj.attachmentsList.filter(item => !idsToDelete.includes(item
          .id));
        // 如果有需要，还可以重置选中状态
        this.$refs.attachmentsListTable.clearSelection();
      },

      tabClick(v) {
        if (v.name == 'video') {
          if (this.initSortableObj.video == false) {
            const tbodyVideo = document.querySelector(".draggable-table-video .el-table__body-wrapper tbody");
            new Sortable(tbodyVideo, {
              animation: 150,
              // 需要在odEnd方法中处理原始eltable数据，使原始数据与显示数据保持顺序一致
              onEnd: ({
                newIndex,
                oldIndex
              }) => {
                let temp = _.cloneDeep(this.manageObj.selectedVideoList)
                let targetRow = this.manageObj.selectedVideoList[oldIndex];
                temp.splice(oldIndex, 1);
                temp.splice(newIndex, 0, targetRow);
                this.$nextTick(() => {
                  this.$set(this.manageObj, 'selectedVideoList', temp)
                })
              },
            });
            this.initSortableObj.video = true
          }
        } else if (v.name == 'exam') {
          if (this.initSortableObj.exam == false) {
            const tbodyExam = document.querySelector(".draggable-table-exam .el-table__body-wrapper tbody");
            new Sortable(tbodyExam, {
              animation: 150,
              // 需要在odEnd方法中处理原始eltable数据，使原始数据与显示数据保持顺序一致
              onEnd: ({
                newIndex,
                oldIndex
              }) => {
                let temp = _.cloneDeep(this.manageObj.selectedExamList)
                let targetRow = this.manageObj.selectedExamList[oldIndex];
                temp.splice(oldIndex, 1);
                temp.splice(newIndex, 0, targetRow);
                this.$nextTick(() => {
                  this.$set(this.manageObj, 'selectedExamList', temp)
                })
              },
            });
            this.initSortableObj.exam = true
          }
        }
      },

      handleVideoSizeChange(i) {
        this.videoListObj.query.page = 1
        this.videoListObj.query.pageSize = i
        this.getVideoList()
      },

      handleVideoPageChange(i) {
        this.videoListObj.query.page = i
        this.getVideoList()
      },

      handleExamSizeChange(i) {
        this.examObj.query.page = 1
        this.examObj.query.pageSize = i
        this.getExamList()
      },

      handleExamPageChange(i) {
        this.examObj.query.page = i
        this.getExamList()
      },

      /********  video绑定 start *********/
      videoSelectionChange(val) {
        this.manageObj.videoSelection = val
      },

      selectVideo(data) {
        this.$set(data, 'primary_id', '')
        this.$set(data, 'is_process_question', false)
        this.$set(data, 'finish_time', 100)
        if (this.manageObj.selectedVideoList.some(i => i.id === data.id)) {
          this.$message.error(this.$l.videoAlready)
        } else {
          this.manageObj.selectedVideoList.push(data)
        }
      },

      selectMultipleVideo() {
        let videoIdSet = new Set(this.manageObj.selectedVideoList.map(i => i.id))
        this.manageObj.videoSelection.forEach(i => {
          if (!videoIdSet.has(i.id)) {
            this.$set(i, 'primary_id', '')
            this.$set(i, 'is_process_question', false)
            this.$set(i, 'finish_time', 100)
            this.manageObj.selectedVideoList.push(i)
          }
        })
        this.$refs.videoDialogTable.clearSelection();
        this.$message({
          type: 'success',
          message: this.$l.operateSuccess
        })
        this.showObj.selectVideo = false
      },

      removeVideo(i) {
        this.manageObj.selectedVideoList.splice(i, 1)
      },

      removeMultipleVideo() {
        let idsToDelete = this.manageObj.videoSelection.map(item => item.id); // 假设每行有一个唯一的id属性
        this.manageObj.selectedVideoList = this.manageObj.selectedVideoList.filter(item => !idsToDelete.includes(
          item
          .id));
        // 如果有需要，还可以重置选中状态
        this.$refs.videoListTable.clearSelection();
      },

      getVideoList() {
        this.$request(this.$api.videoServer + '/Video/VideoManage/getVideoList', this.videoListObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.videoListObj.list = r.data.list
              this.videoListObj.total = r.data.total
              if (r.data.total == 0) {
                this.videoListObj.list = []
                // this.$message({
                //   type: 'info',
                //   message: '暂无数据'
                // })
              }
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      /********  video绑定 end *********/


      /********  exam绑定 start *********/
      examSelectionChange(val) {
        this.manageObj.examSelection = val
      },

      selectExam(data) {
        this.$set(data, 'primary_id', '')
        this.$set(data, 'is_process_question', false)
        if (this.manageObj.selectedExamList.some(i => i.id === data.id)) {
          this.$message.error(this.$l.examAlready)
        } else {
          this.manageObj.selectedExamList.push(data)
        }
      },

      selectMultipleExam() {
        let examIdSet = new Set(this.manageObj.selectedExamList.map(i => i.id))
        this.manageObj.examSelection.forEach(i => {
          if (!examIdSet.has(i.id)) {
            this.$set(i, 'primary_id', '')
            this.$set(i, 'is_process_question', false)
            this.manageObj.selectedExamList.push(i)
          }
        })
        this.$refs.examDialogTable.clearSelection();
        this.$message({
          type: 'success',
          message: this.$l.operateSuccess
        })
        this.showObj.selectExam = false
      },

      removeExam(i) {
        this.manageObj.selectedExamList.splice(i, 1)
      },

      removeMultipleExam() {
        let idsToDelete = this.manageObj.examSelection.map(item => item.id); // 假设每行有一个唯一的id属性
        this.manageObj.selectedExamList = this.manageObj.selectedExamList.filter(item => !idsToDelete.includes(item
          .id));
        this.$refs.examListTable.clearSelection();
      },

      getExamList() {
        this.$request(this.$api.videoServer + '/Video/VideoExam/getExamList', this.examObj.query)
          .then(r => {
            this.examObj.list = r.data.list
            this.examObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },

      previewExam(i) {
        // return
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            train_id: "",
            course_id: '',
            exam_id: '',
            questionnaire_id: i.questionnaire_id,
            mode: 'preview'
          }
        }).href;
        // 使用window.open打开新标签页
        window.open(url, '_blank');
      },

      /********  exam绑定  end *********/

      /************      播放中答题绑定   start   *************/
      videoClose() {
        this.$refs.videoPlayer.onDestroy()
        this.showObj.processQuestion = false
      },

      questionSelectionChange(val) {
        this.manageObj.questionSelection = val
      },

      selectQuestion(data) {
        // this.$set(data, 'bind_id', '')
        this.$set(data, 'time', '')
        this.$set(data, 'text', data.name_label)
        this.manageObj.questionList.push(data)
      },

      selectMultipleQuestion() {
        this.manageObj.questionSelection.forEach(i => {
          // i.bind_id = ''
          this.$set(i, 'time', '')
          this.$set(i, 'text', i.name_label)
        })
        this.manageObj.questionList = this.manageObj.questionList.concat(this.manageObj.questionSelection)
        this.$forceUpdate()
        this.$refs.questionDialogTable.clearSelection();
        this.showObj.selectQuestion = false
      },

      removeQuestion(i) {
        this.manageObj.questionList.splice(i, 1)
      },

      removeMultipleQuestion() {
        let idsToDelete = this.manageObj.questionSelection.map(item => item.id); // 假设每行有一个唯一的id属性
        this.manageObj.questionList = this.manageObj.questionList.filter(item => !idsToDelete.includes(item
          .id));
        // 如果有需要，还可以重置选中状态
        this.$refs.questionTable.clearSelection();
      },


      getQuestionList() {
        //全部列表
        this.$request(this.$api.videoServer + '/Video/VideoExam/getQuestionList', this.questionObj.query)
          .then(r => {
            this.questionObj.list = r.data.list
            this.showObj.selectQuestion = true
          })
          .catch(e => {
            console.log(e);
          })
      },

      getBindingQuestionById(id) {
        this.$request(this.$api.videoServer + '/Video/VideoProcessQuestion/getList', {
          video_id: id
        }).then(r => {
          if (r.data.length > 0) {
            let questionsArray = r.data.map(item => {
              // 将 time 属性添加到 question 对象中，并返回更新后的 question 对象
              return {
                bind_id: item.id,
                time: item.time,
                text: item.question.name_label,
                ...item.question
              }
            })
            this.manageObj.questionList = questionsArray
          } else {
            this.manageObj.questionList = []
          }
          this.showObj.processQuestion = true
        })
      },

      openProcessQuestion(data) {
        this.showObj.videoUrl = this.$api.videoServer + data.url
        this.questionObj.video_id = data.id
        this.getBindingQuestionById(data.id)
        this.showObj.processQuestion = true
      },

      submitProcessQuestion() {

        let postData = {
          video_id: this.questionObj.video_id,
          detail: []
        }


        let emptyIndex = false
        this.manageObj.questionList.forEach((i, index) => {
          if (i.time == '') {
            emptyIndex = index + 1
          }
          postData.detail.push({
            question_primary_id: i.id,
            time: i.time,
            is_valid: "Y",
            rec_status: 1
          })
        })
        if (emptyIndex) {
          return this.$message.error(this.$l.activetimePd.replace('emptyIndex', emptyIndex))
        }
        this.$request(this.$api.videoServer + '/Video/VideoProcessQuestion/addQestionToVideo', postData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                message: "提交成功",
                type: this.$l.operateSuccess
              })
              this.showObj.processQuestion = false
            }
          })
      },

      /************      播放中问题绑定   end   *************/

      flashMarkers() {
        this.$refs.videoPlayer.generateMarkers()
      },

      modifyCourseBinding(data) {
        this.courseObj.newForm = Object.assign(this.courseObj.newForm, data)
        this.courseObj.newForm.lecturer = Number(this.courseObj.newForm.lecturer)
        this.selectedTags = this.tagObj.list.filter(aItem => data.tags.some(bItem => bItem.id === aItem.id));
        if (typeof data == 'object') {
          this.manageObj.currentPrimaryId = data.id
        } else {
          this.manageObj.currentPrimaryId = data
        }
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + this
            .manageObj
            .currentPrimaryId)
          .then(r => {
            this.manageObj.selectedVideoList = []
            this.manageObj.selectedExamList = []
            if (r.data.length > 0) {
              r.data.forEach(i => {
                if (i.video) {
                  i.video.primary_id = i.id
                  i.video.score = i.score
                  i.video.finish_time = parseInt(i.finish_time / i.video
                    .duration) //this.formatFinishTimePicker(i.finish_time)
                  this.manageObj.selectedVideoList.push(i.video)
                } else if (i.exam) {
                  i.exam.primary_id = i.id
                  i.exam.score = i.score
                  this.manageObj.selectedExamList.push(i.exam)
                }
              })
            }
            this.showObj.addOrModifyCourse = true
          })
          .catch(e => {
            console.log(e);
          })
      },



      getCatalogList(oid) {
        let org_id = ''
        if (typeof oid == 'string') {
          org_id = oid
        }
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCatalogList?org_id=' + org_id)
          .then(r => {
            this.catalogObj.data = r.data
          })
      },

      /****************  视频标签  *****************/
      getTagList() {
        this.$request(this.$api.videoServer + '/Video/VideoTag/getList', this.tagObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.tagObj.list = r.data.list
              this.tagObj.total = r.data.total
              if (r.data.total == 0) {
                // this.$message({
                //   type: 'info',
                //   message: '暂无数据'
                // })
              }
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      selectTag(i) {
        if (!this.selectedTags.includes(i)) {
          if (this.selectedTags.length >= 5) {
            return this.$notify.error({
              title: 'Tips',
              message: this.$l.most5Tags
            });
          } else {
            this.selectedTags.push(i)
          }
        } else {
          let index = this.selectedTags.indexOf(i)
          this.selectedTags.splice(index, 1)
        }
      },

      /*********   视频封面  start   *********/

      coverSelect() {
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
      },

      uploadCover() {

        //上传封面
        let formData = new FormData();
        formData.append('formFile', this.coverObj.file);
        this.$request(this.$api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
          .then(r => {
            if (r.httpCode == 200 && r.data.url) {
              this.courseObj.newForm.thumbnail_path = r.data.url
              this.coverObj = {
                dialogImageUrl: "",
                imageUrl: "",
                file: "",
              }
              this.submitCourse()
            }
          })
          .catch(e => {
            // this.uploadStatus = e.message
          })
      },

      /*********   视频封面  end   *********/

      handleSubmit() {
        if (this.manageObj.selectedVideoList.length == 0) {
          return this.$message.error(this.$l.containOneVideoAtleat)
        }
        if (this.rightCheck(this.courseObj.newForm, true)) {

          if (this.coverObj.file.name) {
            this.uploadCover()
          } else {
            this.submitCourse()
          }
        }
      },

      getPublic_ORG() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
            queryString: {},
            ruleno: '120',
            pageSize: 9999
          })
          .then(r => {
            this.publicCodeObj.org_id = []
            r.data.list.forEach(i => {
              this.publicCodeObj.org_id.push({
                id: i.id,
                value: parseFloat(i.code_no),
                label: i.name_label
              })
            })
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },

      handleSizeChange(i) {
        this.courseObj.query.pageSize = i
        this.getCourseList()
      },

      handlePageChange(i) {
        this.courseObj.query.page = i
        this.getCourseList()
      },

      addCourse() {
        this.coverObj = {
          dialogImageUrl: "",
          imageUrl: "",
          file: { //选择的视频封面文件信息
            name: ''
          },
        }
        this.courseObj.newForm = {
          id: "",
          name_zh: "",
          name_tw: "",
          name_en: "",
          name_vi: "",
          description: "",
          college_id: this.isAdmin ? '' : this.publicCodeObj.collegeList[0].id,
          is_public: this.isAdmin ? 1 : 0,
          org_id: 200,
          thumbnail_path: "",
          score: "",
          applicable_group: "",
          profit: "",
          lecturer: "",
          language: "",
          tag_ids: [],
          video_exam_list: []
        }
        this.courseObj.currentPrimaryId = ''
        this.manageObj.selectedVideoList = []
        this.manageObj.selectedExamList = []
        this.showObj.addOrModifyCourse = true
      },

      modifyCourseStatus(i) {
        if (this.rightCheck(i, true)) {

          let currentStatus = i.is_valid
          let value
          let oprate
          if (currentStatus == 'N') {
            value = 'Y'
            oprate = this.$c.enable
          } else {
            value = 'N'
            oprate = this.$c.disable
          }

          this.$prompt(oprate + i.name_label + this.$l.confirmTips, {
              type: 'warning',
              inputPattern: /^[Y]{1}$/i,
              inputErrorMessage: this.$l.inputErrorMessage,
              confirmButtonText: this.$l.confirmText,
              cancelButtonText: this.$l.cancelText
            }).then(() => {
              this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/modifyCourseStatus', {
                key: i.id,
                value: value
              }, 'post').then(r => {
                this.$message({
                  type: 'success',
                  message: this.$l.operateSuccess
                })
                this.getCourseList()
              })
            })
            .catch(() => {
              console.log('取消操作');
            })
        }
      },

      rightCheck(i, toast = false) {
        if (this.isAdmin) {
          return true
        } else {
          if (this.publicCodeObj.collegeList.some(c => c.id == i.college_id)) {
            return true
          } else {
            if (toast) {
              this.$message({
                type: "error",
                message: this.$l.noRightToEdit
              })
            }
            return false
          }
        }
      },


      getCourseList() {

        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', this.courseObj.query,
            'post')
          .then(r => {
            this.courseObj.list = r.data.list
            this.courseObj.total = r.data.total
            this.showObj.addOrModifyCourse = false
          })
          .catch(e => {
            console.log(e);
          })
      },



      submitCourse() {
        let video_exam_list = []
        let attachmentids_list = []
        // 下面需要重点处理已存在的视频/试卷的唯一id问题

        if (this.manageObj.selectedVideoList.length > 0) {
          this.manageObj.selectedVideoList.forEach((i, index) => {
            video_exam_list.push({
              id: i.primary_id,
              bind_id: i.id,
              course_id: this.courseObj.currentPrimaryId,
              score: i.score,
              is_process_question: i.is_process_question,
              finish_time: i.finish_time * i.duration,
              type: 0,
              sort: index,
              is_valid: "Y",
              rec_status: 1
            })
          })
        }

        if (this.manageObj.selectedExamList.length > 0) {
          this.manageObj.selectedExamList.forEach((i, index) => {
            video_exam_list.push({
              id: i.primary_id,
              bind_id: i.id,
              course_id: this.courseObj.currentPrimaryId,
              score: i.score,
              is_process_question: false,
              type: 1,
              sort: index + this.manageObj.selectedVideoList.length,
              is_valid: "Y",
              rec_status: 1
            })
          })
        }

        if (this.manageObj.attachmentsList.length > 0) {
          attachmentids_list = this.manageObj.attachmentsList.map(i => i.id)
        }

        this.courseObj.newForm.tag_ids = []
        if (this.selectedTags.length > 0) {
          this.selectedTags.forEach(i => {
            this.courseObj.newForm.tag_ids.push(i.id)
          })
        }

        if (this.courseObj.newForm.name_zh === '') {
          return this.$message.error(this.$l.titleError)
        }

        if (this.courseObj.newForm.college_id === '' ) {
          return this.$message.error(this.$l.belongCollegeError)
        }

        if (this.courseObj.newForm.applicable_group === '') {
          return this.$message.error(this.$l.applicableGroupError)
        }
        if (this.courseObj.newForm.lecturer === '') {
          return this.$message.error(this.$l.lecturerTypeError)
        }
        if (this.courseObj.newForm.language === '') {
          return this.$message.error(this.$l.languageError)
        }
        if (this.courseObj.newForm.profit === '') {
          return this.$message.error(this.$l.profitError)
        }

        if (this.courseObj.newForm.courseCatalog === '') {
          return this.$message.error(this.$l.courseCatalogPd)
        }

        /* if (this.courseObj.newForm.score === '') {
          return this.$message.error('请输入课程学分！')
        } */

        let postData = Object.assign({
          id: "",
          name_zh: "",
          name_tw: "",
          name_en: "",
          name_vi: "",
          description: "",
          college_id: "",
          org_id: "",
          thumbnail_path: "",
          score: "",
          applicable_group: "",
          profit: "",
          lecturer: "",
          language: "",
          tag_ids: [],
          video_exam_list: [],
          attachmentids_list: [],
          is_update_version: 0
        }, this.courseObj.newForm)
        postData.video_exam_list = video_exam_list
        postData.attachmentids_list = attachmentids_list

        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/addOrModifyCourse', postData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.operateSuccess
              })
              let timer = setTimeout(() => {
                this.$refs.coverInput.value = ''; //清空文件选择的内容
                this.getCourseList()
                clearTimeout(timer)
              }, 1500)
            }
          })
          .catch(e => {
            console.log(e);
          })
      },


      handleSelectionChange(val) {
        this.courseObj.multipleSelection = val;
      },

      updateTableMaxHeight() {
        let container = this.$refs.tableContainer;
        if (container) {
          this.cssObj.tableMaxHeight = container.clientHeight;
        }
      },

      getPopoverWidth() {
        let container = this.$refs.tagInput;
        if (container) {
          this.cssObj.popoverWidth = 0.9 * container.clientWidth;
        }
      },

      formatDuration(totalSeconds, unit) {

        if (totalSeconds) {
          let duration = Math.floor(totalSeconds)
          let hours = Math.floor(duration / 3600);
          let minutes = Math.floor((duration % 3600) / 60);
          let seconds = duration % 60;

          if (unit) {
            return [
              hours > 0 ? `${hours+this.$l.hours}` : '',
              minutes.toString().padStart(2, '0') + this.$l.mins,
              seconds.toString().padStart(2, '0') + this.$l.seconds
            ].filter(Boolean).join('');
          } else {
            return [
              hours > 0 ? `${hours}:` : '',
              minutes.toString().padStart(2, '0') + ':',
              seconds.toString().padStart(2, '0')
            ].filter(Boolean).join('');
          }
        } else {
          return ""
        }


      },

      formatFinishTimePicker(totalSeconds) {
        if (totalSeconds) {
          let duration = Math.floor(totalSeconds)
          let hours = Math.floor(duration / 3600);
          let minutes = Math.floor((duration % 3600) / 60);
          let seconds = duration % 60;

          return [
            hours.toString().padStart(2, '0') + ':',
            minutes.toString().padStart(2, '0') + ':',
            seconds.toString().padStart(2, '0')
          ].filter(Boolean).join('');
        } else {
          return ''
        }

      },

      formatFinishTime(timeString) {
        // 检查输入是否为空或无效
        if (!timeString || typeof timeString !== 'string') return 0;

        // 使用正则表达式匹配时间字符串中的小时、分钟和秒
        const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);

        // 如果匹配失败，返回0表示无效的时间字符串
        if (!match) return 0;

        // 解构赋值从匹配结果中提取小时、分钟和秒，并转换为整数
        const [_, hours, minutes, seconds] = match.map(Number);

        // 计算总秒数
        return hours * 3600 + minutes * 60 + seconds;
      },

      //根据真实值返回显示值
      returnPublicObjLabel(value, key, label, filed) {
        let item = this.publicCodeObj[filed].find(i => {
          return i[key] == value
        })
        if (item) {
          return item[label]
        } else {
          return value
        }
      },

      getAllCollegeList(){
        this.$request(this.$api.videoServer + '/Video/VideoCollege/getCollegeList', {
            page:1,
            pageSize:9999
          })
          .then((r) => {
            this.publicCodeObj.allCollegeList = r.data.list
            console.log( this.publicCodeObj.allCollegeList);
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      getCollegeList() {
        // 根据页面路由获取管理学院
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
            this.courseObj.query.college_id = this.publicCodeObj.collegeList[0].id
            this.videoListObj.query.college_id = this.publicCodeObj.collegeList[0].id
            this.getCourseList()
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      getLanguage_type() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
            queryString: {},
            ruleno: '121',
            pageSize: 9999
          })
          .then(r => {
            let list = [];
            r.data.list.forEach(j => {
              list.push({
                label: j.name_label,
                value: j.code_no
              });
            })
            this.publicCodeObj.language_type = list
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },

      getCourseCatalog() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
            queryString: {},
            ruleno: '122',
            pageSize: 9999
          })
          .then(r => {
            let list = [];
            r.data.list.forEach(j => {
              list.push({
                label: j.name_label,
                value: j.code_no
              });
            })
            this.publicCodeObj.courseCatalog = list
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },


    },
    mounted() {
      this.getAllCollegeList()
      this.getCollegeList()
      // this.getCourseList()
      // this.getPublic_ORG()
      this.getTagList()
      this.getLanguage_type()
      this.getCourseCatalog()
      // this.getCatalogList()
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


<style>
.lessonList-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.lessonList-container .videoSelect-dialog {
  width: 100%;
  height: auto;
  max-height: 70vh;
  padding: 10px;
}
.lessonList-container .videoSelect-dialog .video-table {
  width: 100%;
  height: auto;
  max-height: 70vh;
  margin-bottom: 10px;
}
.lessonList-container .drawer-container .title {
  padding: 0px 20px 10px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lessonList-container .drawer-container .form-container {
  width: 95%;
  height: calc(100% - 80px);
  margin: 0 auto;
}
.lessonList-container .drawer-container .form-container .tab-container {
  width: 100%;
  height: 100%;
}
.lessonList-container .drawer-container .form-container .modifyCover {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lessonList-container .drawer-container .form-container .modifyCover .change {
  text-align: center;
  color: #409fee;
  font-size: 50px;
}
.lessonList-container .drawer-container .form-container .cover {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate {
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
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconZoom {
  margin-top: 15%;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconZoom:hover {
  color: #409fee;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconRefresh {
  margin-top: 15%;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconRefresh:hover {
  color: #00aa7f;
}
.lessonList-container .drawer-container .form-container .cover .plus-icon {
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
}
.lessonList-container .drawer-container .form-container .cover .plus-icon:hover {
  color: #409fee;
}
.lessonList-container .drawer-container .form-container .cover .cover-oprate {
  display: none;
}
.lessonList-container .drawer-container .form-container .tags {
  margin: 0 10px;
  padding: 0 10px;
  white-space: nowrap;
}
.lessonList-container .drawer-container .form-container .tagInput {
  width: 100%;
  height: auto;
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.lessonList-container .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  background-color: white;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lessonList-container .lessonList-filter {
  padding: 15px;
  width: 100%;
  min-width: 1000px;
  height: 60px;
  background-color: #f2f4f9;
}
.lessonList-container .lessonList-oprate {
  padding: 10px;
  width: 100%;
  min-width: 1000px;
  height: 50px;
  background-color: #ffffff;
}
.lessonList-container .lessonList-table {
  width: 100%;
  min-width: 1000px;
  height: calc(100% - 160px);
}
.lessonList-container .lessonList-table .img {
  width: 100%;
  height: 80px;
}
.lessonList-container .lessonList-table .img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.lessonList-container .lessonList-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
