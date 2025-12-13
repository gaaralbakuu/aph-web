<template>
  <div class="lessonList-container">

    <div class="components">
      <!-- 文件预览 -->
      <FilePreviews :file-url="showObj.fileUrl" :visible="showObj.filePreviews"
        @update:visible="showObj.filePreviews = $event" />

      <input ref="attachmentInput" type="file" @change="uploadattAchmentChange" style="display: none;" />

      <a-modal :visible="showObj.attachment" title="上传附件" width="50%" @cancel="showObj.attachment = false">
        <a-form>
          <a-form-item label="简中名字" required>
            <a-input v-model:value="attachmentObj.file_name_zh"></a-input>
          </a-form-item>
          <a-form-item label="繁中名字">
            <a-input v-model:value="attachmentObj.file_name_tw"></a-input>
          </a-form-item>
          <a-form-item label="英文名字">
            <a-input v-model:value="attachmentObj.file_name_en"></a-input>
          </a-form-item>
          <a-form-item label="越南名字">
            <a-input v-model:value="attachmentObj.file_name_vi"></a-input>
          </a-form-item>
        </a-form>
        <template #footer>
          <a-button @click="showObj.attachment = false">取 消</a-button>
          <a-button type="primary" @click="uploadAttachment">提 交</a-button>
        </template>
      </a-modal>

      <!-- 选择图片input -->
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

      <!-- 预览图片dialog -->
      <a-modal :visible="showObj.coverDialog" :title="l.preview" @cancel="showObj.coverDialog = false">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit='fill'>
      </a-modal>

      <!-- 管理播放中答题dialog -->
      <a-modal :visible="showObj.processQuestion" :title="l.addQuestion" width="75%" @cancel="videoClose">
        <a-row>
          <a-col :span="10">
            <div style="width: 100%;aspect-ratio: 1.8;">
              <videoPlayer ref="videoPlayer" :src="showObj.videoUrl" :markers="manageObj.questionList">
              </videoPlayer>
            </div>
          </a-col>
          <a-col :span="14">
            <div style="float: right;margin-bottom: 10px;">
              <a-button type="primary" ghost @click="flashMarkers">{{l.refreshMarkers}}</a-button>
              <a-button type="primary" @click="getQuestionList">{{l.addQuestion}}</a-button>
              <a-button type="primary" danger @click="removeMultipleQuestion">{{l.multipleRemove}}</a-button>
            </div>
            <a-table ref="questionTable" :dataSource="manageObj.questionList" style="width: 100%"
              :row-selection="{ selectedRowKeys: questionSelectedRowKeys, onChange: questionSelectionChange }"
              :scroll="{ y: 300 }">
              <a-table-column title="No." width="50">
                <template #default="text, record, index">
                  {{ index + 1 }}
                </template>
              </a-table-column>
              <a-table-column :title="l.question" dataIndex="name_label"></a-table-column>
              <a-table-column :title="l.activeTime" dataIndex="time" width="120">
                <template #default="text, record">
                  <a-input-number v-model:value="record.time"></a-input-number>
                </template>
              </a-table-column>
              <a-table-column :title="l.diffcult" dataIndex="difficulty_level" width="80"></a-table-column>
              <a-table-column :title="l.questionType" dataIndex="question_type" width="80">
                <template #default="text">
                  {{returnPublicObjLabel(text,'value','label','question_type')}}
                </template>
              </a-table-column>
              <!-- <a-table-column :title="l.publishStatus" dataIndex="question_status" width="80">
                <template #default="text">
                  {{returnPublicObjLabel(text,'value','label','question_status')}}
                </template>
              </a-table-column> -->
              <!-- <a-table-column :title="l.status" dataIndex="is_valid">
                  <template #default="text">
                    {{text=='Y'?c.enable:c.disable}}
                  </template>
                </a-table-column> -->
              <a-table-column :title="c.operation" width="80" fixed="right">
                <template #default="text, record, index">
                  <a-button type="link" danger
                    @click="removeQuestion(index)">{{c.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-col>


        </a-row>

        <template #footer>
          <a-button @click="showObj.processQuestion = false">{{l.giveup}}</a-button>
          <a-button type="primary" @click="submitProcessQuestion">{{l.submit}}</a-button>
        </template>
      </a-modal>

      <!-- 添加答题dialog -->
      <a-modal :visible="showObj.selectQuestion" :title="l.addQuestion" width="50%" @cancel="showObj.selectQuestion = false">
        <a-form layout="inline" :label-col="{ span: 4 }">
          <a-form-item :label="c.title">
            <a-input v-model:value="questionObj.query.name"></a-input>
          </a-form-item>
          <a-form-item :label="l.questionType">
            <a-select v-model:value="questionObj.query.question_type" @change="getQuestionList" style="width: 100px;">
              <a-select-option value="">{{c.all}}</a-select-option>
              <a-select-option v-for="i in publicCodeObj.question_type" :key='i.value' :value="i.value">{{i.label}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="l.status">
            <a-select v-model:value="questionObj.query.question_status" @change="getQuestionList" style="width: 100px;">
              <a-select-option value="">{{c.all}}</a-select-option>
              <a-select-option v-for="i in publicCodeObj.question_status" :key='i.value' :value="i.value">{{i.label}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" ghost @click="getQuestionList">{{l.search}}</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="selectMultipleQuestion">{{l.multipleAdd}}</a-button>
          </a-form-item>
        </a-form>
        <a-table ref="questionDialogTable" :dataSource="questionObj.list" style="width: 100%"
          :row-selection="{ selectedRowKeys: questionSelectedRowKeys, onChange: questionSelectionChange }"
          :scroll="{ y: 300 }">
          <a-table-column title="No." width="50">
            <template #default="text, record, index">
              {{ index + 1 }}
            </template>
          </a-table-column>
          <a-table-column :title="l.question" dataIndex="name_label"></a-table-column>
          <a-table-column :title="l.diffcult" dataIndex="difficulty_level" width="80"></a-table-column>
          <a-table-column :title="l.questionType" dataIndex="question_type" width="80">
            <template #default="text">
              {{returnPublicObjLabel(text,'value','label','question_type')}}
            </template>
          </a-table-column>
          <a-table-column :title="l.publishStatus" dataIndex="question_status" width="80">
            <template #default="text">
              {{returnPublicObjLabel(text,'value','label','question_status')}}
            </template>
          </a-table-column>
          <!-- <a-table-column :title="l.stastus" dataIndex="is_valid">
              <template #default="text">
                {{text=='Y'?c.enable:c.disable}}
              </template>
            </a-table-column> -->
          <a-table-column :title="c.operation" width="80" fixed="right">
            <template #default="text, record">
              <a-button type="link" @click="selectQuestion(record)">{{l.add}}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-modal>

      <!-- 选择视频dialog -->
      <a-modal :visible="showObj.selectVideo" @after-open='getVideoList' :title="l.addVideo" width="70%" @cancel="showObj.selectVideo = false">
        <div class="videoSelect-dialog">
          <a-form layout="inline">
            <a-form-item :label="l.belongCollege">
              <a-select v-model:value="videoListObj.query.college_id" :placeholder="l.emptyIsPublicCourse" allow-clear>
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="l.title">
              <a-input v-model:value="videoListObj.query.title" allow-clear @clear='getVideoList'
                @keyup.enter="getVideoList"></a-input>
            </a-form-item>
            <a-form-item :label="l.videoType">
              <a-select v-model:value="videoListObj.query.is_public" :disabled="!isAdmin&&videoListObj.query.college_id==''"
                style="width: 100px;" @change="getVideoList">
                <a-select-option value="">{{c.all}}</a-select-option>
                <a-select-option :value="1">{{l.public}}</a-select-option>
                <a-select-option :value="0">{{l.private}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="getVideoList">{{l.search}}</a-button>
              <a-button type="primary" @click="selectMultipleVideo">{{l.multipleAdd}}</a-button>
            </a-form-item>
          </a-form>
          <a-table ref="videoDialogTable" class='video-table' :dataSource="videoListObj.list"
            :row-selection="{ selectedRowKeys: videoSelectedRowKeys, onChange: videoSelectionChange }"
            :scroll="{ y: 500 }" bordered>
            <a-table-column title="No." width="50">
              <template #default="text, record, index">
                {{ index + 1 }}
              </template>
            </a-table-column>
            <a-table-column :title="l.cover" dataIndex="thumbnail_path">
              <template #default="text">
                <img class="auto-img" :src="$api.videoServer+'/'+text" height="50px"
                  @click="coverPreview($api.videoServer+'/'+ text)" />
              </template>
            </a-table-column>
            <a-table-column :title="l.title" dataIndex="title"></a-table-column>
            <a-table-column :title="l.desc" dataIndex="description"></a-table-column>
            <a-table-column :title="l.belongCollege" dataIndex="college_id">
              <template #default="text">
                {{returnPublicObjLabel(text,'id','name_label','allCollegeList')}}
              </template>
            </a-table-column>
            <a-table-column :title="l.duration" dataIndex="duration">
              <template #default="text">
                {{formatDuration(text,true)}}
              </template>
            </a-table-column>
            <a-table-column :title="c.operation" fixed="right">
              <template #default="text, record">
                <a-button type="link" @click="selectVideo(record)">{{l.add}}</a-button>
              </template>
            </a-table-column>
          </a-table>
          <a-pagination @change="handleVideoPageChange" @showSizeChange="handleVideoSizeChange"
            :current="videoListObj.query.page" :pageSizeOptions="['5','10', '15', '30', '50','100']"
            :pageSize="videoListObj.query.pageSize" show-size-changer show-quick-jumper
            :total="videoListObj.total" style="float: right; margin-top: 16px;" />
        </div>
      </a-modal>

      <!-- 选择考试dialog -->
      <a-modal :visible="showObj.selectExam" @after-open='getExamList' :title="l.addExam" width="70%" @cancel="showObj.selectExam = false">
        <div class="videoSelect-dialog">
          <a-form layout="inline" :label-col="{ span: 6 }">
            <a-form-item :label="l.title">
              <a-input v-model:value="examObj.query.name" allow-clear @clear='getExamList'
                @keyup.enter="getExamList"></a-input>
            </a-form-item>
            <a-form-item :label="l.status">
              <a-select v-model:value="examObj.query.is_valid" style="width: 100px;" @change="getExamList">
                <a-select-option value="">{{c.all}}</a-select-option>
                <a-select-option value="Y">{{c.enable}}</a-select-option>
                <a-select-option value="N">{{c.disable}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="getExamList">{{l.search}}</a-button>
              <a-button type="primary" ghost @click="selectMultipleExam">{{l.multipleAdd}}</a-button>
            </a-form-item>
          </a-form>
          <a-table ref="examDialogTable" :dataSource="examObj.list" style="width: 100%"
            :row-selection="{ selectedRowKeys: examSelectedRowKeys, onChange: examSelectionChange }"
            :scroll="{ y: cssObj.tableMaxHeight }">
            <a-table-column title="No." width="50">
              <template #default="text, record, index">
                {{ index + 1 }}
              </template>
            </a-table-column>
            <a-table-column :title="l.title" dataIndex="name_label"></a-table-column>
            <a-table-column :title="l.passScore" dataIndex="pass_score"></a-table-column>
            <a-table-column :title="l.maxReplyNum" dataIndex="max_reply_num"></a-table-column>
            <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
            <a-table-column :title="l.startTime" dataIndex="start_time"></a-table-column>
            <a-table-column :title="l.endTime" dataIndex="end_time"></a-table-column>
            <a-table-column :title="l.statuts" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="c.operation" fixed="right">
              <template #default="text, record">
                <a-button type="link" style="color: green;" @click="previewExam(record)">{{l.preview}}</a-button>
                <a-button type="link" @click="selectExam(record)">{{l.add}}</a-button>
              </template>
            </a-table-column>
          </a-table>
          <a-pagination @change="handleExamPageChange" @showSizeChange="handleExamSizeChange"
            :current="examObj.query.page" :pageSizeOptions="['5','10', '15', '30', '50','100']"
            :pageSize="examObj.query.pageSize" show-size-changer show-quick-jumper
            :total="examObj.total" style="float: right; margin-top: 16px;" />
        </div>
      </a-modal>

      <!-- 新增或修改课程以及配套资源 -->
      <a-drawer class="drawer-container" placement="bottom" :visible="showObj.addOrModifyCourse"
        :mask-closable='false' height="92%" @after-visible-change="getPopoverWidth" @close="showObj.addOrModifyCourse = false">
        <template #title>
          <div class="title">{{l.manageCourse}}</div>
        </template>
        <a-tabs type="card" class="form-container" @change="tabClick" v-model:activeKey="showObj.activeTabName">
          <a-tab-pane :tab="l.basicalInfo" key="data">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-form-item :label="l.cover" v-if="courseObj.newForm.id==''">
                <div v-if="coverObj.imageUrl==''" class="cover">
                  <div class="plus-icon" @click="coverSelect">
                    <i class="el-icon-upload" style="font-size: 30px;"></i>
                    <div>
                      {{l.chooseCover}}
                    </div>
                  </div>
                </div>
                <div v-else class="cover">
                  <a-image :src="coverObj.imageUrl" style="height: 150px;"></a-image>
                  <div class="cover-oprate">
                    <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                    <i class="el-icon-refresh-left iconRefresh" @click="coverSelect"></i>
                  </div>
                </div>
              </a-form-item>
              <a-form-item :label="l.cover" v-else>
                <div class="modifyCover">
                  <div class="cover">
                    <a-image :src="$api.videoServer+'/'+ courseObj.newForm.thumbnail_path"></a-image>
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
                          {{l.chooseCover}}
                        </div>
                      </div>
                    </div>
                    <div v-else class="cover">
                      <a-image :src="coverObj.imageUrl"></a-image>
                      <div class="cover-oprate">
                        <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                        <i class="el-icon-refresh-left iconRefresh" @click="coverSelect"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </a-form-item>
              <a-row v-if="isAdmin">
                <a-col :span="12">
                  <a-form-item :label="l.belongCollege" required>
                    <a-select v-model:value="courseObj.newForm.college_id" :placeholder="l.pleaseSelectCollege"
                      style="width: 100%;" allow-clear>
                      <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <!-- <a-form-item label="组织编码" required>
                    <a-select v-model:value="courseObj.newForm.org_id" style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.org_id" :key="i.id" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item> -->
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.courseType">
                    <a-switch v-model:checked="courseObj.newForm.is_public" :checked-value="1"
                      :un-checked-value="0">
                      <template #checkedChildren>{{l.public}}</template>
                    </a-switch>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-item label="课程学分">
                    <a-input v-model:value="courseObj.newForm.score"></a-input>
                  </a-form-item>
                </a-col> -->
              </a-row>
              <a-row v-else>
                <a-col :span="12">
                  <a-form-item :label="l.belongCollege">
                    <a-select v-model:value="courseObj.newForm.college_id" :placeholder="l.pleaseSelectCollege"
                      style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>



              <a-row>
                <a-col :span="6">
                  <a-form-item :label="l.name_zh" required>
                    <a-input v-model:value="courseObj.newForm.name_zh"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.name_tw">
                    <a-input v-model:value="courseObj.newForm.name_tw"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.name_en">
                    <a-input v-model:value="courseObj.newForm.name_en"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.name_vi">
                    <a-input v-model:value="courseObj.newForm.name_vi"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <a-form-item :label="l.courseCatalog" required>
                    <a-select v-model:value="courseObj.newForm.type" :placeholder="l.courseCatalogPd" style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.courseCatalog" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="l.lecturer" required>
                    <a-select v-model:value="courseObj.newForm.lecturer" :placeholder="l.lecturerPd" style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.lecturer_status" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="l.trainLanguage" required>
                    <a-select v-model:value="courseObj.newForm.language" :placeholder="l.trainLanguagePd"
                      style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.language_type" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <a-form-item :label="l.tag">
                    <a-popover placement="bottom" trigger="click">
                      <template #content>
                        <div class="tag-container" :style="{width: cssObj.popoverWidth}">
                          <div class="tag-title" style="margin-bottom: 10px;">{{l.tagPd}}</div>
                          <a-tag style=" margin: 5px 10px;padding: 0 10px;white-space: nowrap;"
                            v-for="(i,index) in tagObj.list" :key="index" @click="selectTag(i)"
                            :color="selectedTags.includes(i)?'blue':''" :bordered="!selectedTags.includes(i)">{{i.name_label}}</a-tag>
                        </div>
                      </template>
                      <div ref="tagInput" class="tagInput">
                        <div v-if="selectedTags.length>0">
                          <a-tag class="tags" closable v-for="(i,index) in selectedTags" :key="index"
                            @close="selectTag(i)">{{i.name_label}}</a-tag>
                        </div>
                        <div v-else style="margin-left: 1em;color: #aaa;">{{l.chooseTagPd}}</div>
                        <div style="margin-right: 1em;color: #aaa;">
                          <span>{{selectedTags.length}}/5</span>
                          <span><i class="el-icon-arrow-down"></i></span>
                        </div>
                      </div>
                    </a-popover>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="l.applicableGroup" required>
                    <a-input v-model:value="courseObj.newForm.applicable_group"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="l.profit" required>
                    <a-input v-model:value="courseObj.newForm.profit"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item :label="l.desc">
                <a-textarea v-model:value="courseObj.newForm.description" :rows="4"></a-textarea>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane :tab="l.courseVideo" key='video'>
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" @click="showObj.selectVideo = true">{{l.addVideo}}</a-button>
              <a-button type="primary" danger @click="removeMultipleVideo">{{l.multipleRemove}}</a-button>
            </div>
            <a-table ref="videoListTable" class="draggable-table-video" :dataSource="manageObj.selectedVideoList"
              row-key='id' style="width: 100%" 
              :row-selection="{ selectedRowKeys: videoSelectedRowKeys, onChange: videoSelectionChange }"
              :scroll="{ y: cssObj.tableMaxHeight - 130 }"
              :custom-row="() => ({ style: { height: '90px', fontSize: '14px' } })">
              <!-- <a-table-column title="序号" width="50">
                <template #default="text, record, index">
                  {{ index + 1 }}
                </template>
              </a-table-column> -->
              <a-table-column :title="l.cover" dataIndex="thumbnail_path">
                <template #default="text">
                  <img class="auto-img" :src="$api.videoServer+'/'+text" height="80px"
                    @click="coverPreview($api.videoServer+'/'+ text)" />
                </template>
              </a-table-column>
              <a-table-column :title="l.title" dataIndex="title"></a-table-column>
              <a-table-column :title="l.desc" dataIndex="description" :width="400" :ellipsis="true"></a-table-column>
              <a-table-column :title="l.duration" dataIndex="duration">
                <template #default="text">
                  {{formatDuration(text,true)}}
                </template>
              </a-table-column>
              <!-- <a-table-column :title="l.needToLearn">
                <template #default="text, record">
                  <a-input-number v-model:value="record.finish_time" :placeholder="l.needToLearnPd"
                    :max="100" :min="0"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="l.playQuestion" dataIndex="is_process_question">
                <template #default="text, record">
                  <a-switch v-model:checked="record.is_process_question" 
                    :checked-value="true" :un-checked-value="false">
                  </a-switch>
                  <a-button v-show="record.is_process_question" type="link" style="color: green;"
                    @click="openProcessQuestion(record)">{{l.playQuestionManage}}</a-button>
                </template>
              </a-table-column>
              <!-- <a-table-column :title="l.score" dataIndex="score">
                <template #default="text, record">
                  <a-input-number v-model:value="record.score" :placeholder="l.scorePd"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="c.operation" fixed="right">
                <template #default="text, record, index">
                  <a-button v-show="rightCheck(courseObj.newForm)" type="link" danger
                    @click="removeVideo(index)">{{l.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <a-tab-pane :tab="l.courseExam" key="exam">
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" @click="showObj.selectExam = true">{{l.addExam}}</a-button>
              <a-button type="primary" danger @click="removeMultipleExam">{{l.multipleRemove}}</a-button>
            </div>
            <a-table ref="examListTable" class="draggable-table-exam" :dataSource="manageObj.selectedExamList" row-key='id'
              style="width: 100%" 
              :row-selection="{ selectedRowKeys: examSelectedRowKeys, onChange: examSelectionChange }"
              :scroll="{ y: cssObj.tableMaxHeight - 130 }">
              <!-- <a-table-column title="序号" width="50">
                <template #default="text, record, index">
                  {{ index + 1 }}
                </template>
              </a-table-column> -->
              <a-table-column :title="l.title" dataIndex="name_label"></a-table-column>
              <a-table-column :title="l.passScore" dataIndex="pass_score"></a-table-column>
              <a-table-column :title="l.maxReplyNum" dataIndex="max_reply_num"></a-table-column>
              <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
              <a-table-column :title="l.startTime" dataIndex="start_time"></a-table-column>
              <a-table-column :title="l.endTime" dataIndex="end_time"></a-table-column>
              <!-- <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column> -->
              <!-- <a-table-column :title="l.score" dataIndex="score">
                <template #default="text, record">
                  <a-input-number v-model:value="record.score" :placeholder="l.scorePd"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="c.operation" fixed="right">
                <template #default="text, record, index">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <a-button type="link" style="color: green;" @click="previewExam(record)">{{l.preview}}</a-button>
                    <a-button type="link" danger @click="removeExam(index)">{{l.remove}}</a-button>
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <a-tab-pane :tab="l.courseAttachments" key="attachment">
            <div style="float: right;margin-bottom: 10px;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" ghost @click="attachmentWarning">{{l.importantNotice}}</a-button>
              <a-button :disabled='courseObj.newForm.id==""' type="primary"
                @click="attachmentSelect">{{l.addAttachment}}</a-button>
              <a-button :disabled='courseObj.newForm.id==""' type="primary" danger
                @click="removeMultipleAttachment">{{l.batchRemove}}</a-button>
            </div>
            <a-table ref="attachmentsListTable" :dataSource="manageObj.attachmentsList" row-key='id'
              style="width: 100%" 
              :row-selection="{ selectedRowKeys: attachmentSelectedRowKeys, onChange: attachmentSelectionChange }"
              :scroll="{ y: cssObj.tableMaxHeight - 130 }">
              <a-table-column :title="l.simplifiedChineseName" dataIndex="name_zh"></a-table-column>
              <a-table-column :title="l.fileType" dataIndex="file_type" :width="120" :ellipsis="true"></a-table-column>
              <a-table-column :title="l.fileSize" dataIndex="file_size" :width="100" :ellipsis="true">
                <template #default="text">
                  {{formatBytes(text)}}
                </template>
              </a-table-column>
              <!-- <a-table-column title="地址" dataIndex="file_url" ellipsis></a-table-column> -->
              <a-table-column :title="l.operations" fixed="right">
                <template #default="text, record, index">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <a-button type="link" style="color: green;" @click="previewFile(record.file_url)">{{l.preview}}</a-button>
                    <a-button type="link" danger @click="removeAttachment(index)">{{l.remove}}</a-button>
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>

        <div class="buttonBar">
          <a-button v-show="rightCheck(courseObj.newForm)" type="primary"
            @click="handleSubmit">{{l.submit}}</a-button>
          <a-button type="primary" danger @click="showObj.addOrModifyCourse = false">{{l.giveup}}</a-button>
        </div>
      </a-drawer>
    </div>

    <!-- 主界面 -->
    <div class="lessonList-filter">
      <a-form layout="inline">
        <a-form-item :label="l.college">
          <a-select v-model:value="courseObj.query.college_id" @change="getCourseList"
            :placeholder="l.emptyOnlyCanCheckPublic" allow-clear>
            <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="l.title">
          <a-input v-model:value="courseObj.query.name" allow-clear @clear='getCourseList'
            @keyup.enter="getCourseList"></a-input>
        </a-form-item>
        <a-form-item :label="l.desc">
          <a-input v-model:value="courseObj.query.description" allow-clear @clear='getCourseList'
            @keyup.enter="getCourseList"></a-input>
        </a-form-item>

        <!-- <a-form-item :label="l.catalog">
          <a-cascader v-model:value="courseObj.query.catalog_id" :options="catalogObj.data" allow-clear :placeholder="l.emptyIsRootCatalog"
            style="width: 100%;" :field-names="catalogObj.cascaderProps">
          </a-cascader>
        </a-form-item> -->

        <a-form-item :label="l.courseType">
          <a-select v-model:value="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
            style="width: 100px;" @change="getCourseList">
            <a-select-option value="">{{c.all}}</a-select-option>
            <a-select-option :value="1">{{l.public}}</a-select-option>
            <a-select-option :value="0">{{l.private}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="l.status">
          <div class="frcc">
            <a-select v-model:value="courseObj.query.is_valid" @change="getCourseList" style="width: 100px;">
              <a-select-option value="">{{c.all}}</a-select-option>
              <a-select-option value="Y">{{c.enable}}</a-select-option>
              <a-select-option value="N">{{c.disable}}</a-select-option>
            </a-select>
            <a-button type="primary" @click="getCourseList" style="margin-left:20px ;">{{l.search}}</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <div class="lessonList-oprate">
      <a-button type="primary" @click="addCourse">{{l.addCourse}}</a-button>
      <!-- <a-button type="primary">批量发布</a-button> -->
      <!-- <a-button type="primary">批量取消发布</a-button> -->
      <!-- <a-button type="primary">导出课程</a-button> -->
    </div>

    <div class="lessonList-table" ref="tableContainer">
      <a-table ref="multipleTable" :dataSource="courseObj.list" style="width: 100%"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
        :scroll="{ y: cssObj.tableMaxHeight }"
        :custom-row="() => ({ style: { height: '113px', fontSize: '14px' } })">

        <!-- <a-table-column type="selection" width="55"></a-table-column> -->
        <a-table-column title="No." width="50">
          <template #default="text, record, index">
            {{ index + 1 }}
          </template>
        </a-table-column>
        <a-table-column :title="l.cover" dataIndex="thumbnail_path">
          <template #default="text">
            <div class="img" v-if="text">
              <img class="auto-img" @click="coverPreview($api.videoServer+'/'+ text)"
                :src="$api.videoServer+'/'+ text" />
            </div>
            <div v-else style="text-align: center;width: 100%;">
              <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
              <!-- <div>{{l.noCover}}</div> -->
            </div>
          </template>
        </a-table-column>
        <a-table-column :title="l.title" dataIndex="name_zh" :width="250" :ellipsis="true"></a-table-column>
        <a-table-column :title="l.desc" dataIndex="description" :width="250" :ellipsis="true"></a-table-column>
        <a-table-column :title="l.courseCatalog" dataIndex="type">
          <template #default="text">
            {{returnPublicObjLabel(text,'value','label','courseCatalog')}}
          </template>
        </a-table-column>
        <a-table-column :title="l.belongCollege" dataIndex="college_id">
          <template #default="text">
            {{returnPublicObjLabel(text,'id','name_label','allCollegeList')}}
          </template>
        </a-table-column>
        <a-table-column :title="l.score" dataIndex="score" width="100"></a-table-column>
        <a-table-column :title="l.duration" dataIndex="duration" width="100">
          <template #default="text">
            {{formatDuration(text) }}
          </template>
        </a-table-column>
        <a-table-column :title="l.lecturer" dataIndex="lecturer" width="100" :ellipsis="true"">
          <template #default="text">
            {{text==1?l.externalLecturer:l.internalLecturer}}
          </template>
        </a-table-column>
        <!-- <a-table-column title="版本" dataIndex="version"></a-table-column> -->

        <a-table-column :title="l.courseType" dataIndex="is_public" width="100" fixed="right">
          <template #default="text">
            {{text==1?l.public:l.private}}
          </template>
        </a-table-column>

        <!-- <a-table-column title="l.status" dataIndex="is_valid"></a-table-column> -->
        <a-table-column :title="c.operation" width="150" fixed="right">
          <template #default="text, record">
            <a-button v-if="rightCheck(record)==false" type="link" style="color: #67c23a;"
              @click="modifyCourseBinding(record)">{{l.check}}</a-button>
            <a-button v-else-if="rightCheck(record)==true" type="link" style="color: #409fee;"
              @click="modifyCourseBinding(record)">{{l.manage}}</a-button>
            <a-button v-if="record.is_valid=='N'&&rightCheck(record)" type="link" style="color: seagreen;"
              @click="modifyCourseStatus(record)">{{c.enable}}</a-button>
            <a-button v-if="record.is_valid=='Y'&&rightCheck(record)" type="link" style="color: red;"
              @click="modifyCourseStatus(record)">{{c.disable}}</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <div class="lessonList-pagenation">
      <a-pagination @change="handlePageChange" @showSizeChange="handleSizeChange"
        :current="courseObj.query.page" :pageSizeOptions="['5','10', '15', '30', '50','100']" 
        :pageSize="courseObj.query.pageSize" show-size-changer show-quick-jumper
        :total="courseObj.total" style="float: right;" />
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import Sortable from 'sortablejs'
import api from '@/api'
import store from '@/store'
import { useLocalI18n } from '@/composables/useLocalI18n'
import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
import FilePreviews from '@/views/_common/FilePreviews.vue'

// Instance and global properties
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request, $message, $notify, $alert, $prompt } = instance.proxy
const { l, c } = useLocalI18n('videoAdminCourse')
const queryClient = useQueryClient()

// Refs
const multipleTable = ref(null)
const tableContainer = ref(null)
const coverInput = ref(null)
const attachmentInput = ref(null)
const videoPlayerRef = ref(null)
const questionTable = ref(null)
const questionDialogTable = ref(null)
const videoDialogTable = ref(null)
const examDialogTable = ref(null)
const videoListTable = ref(null)
const examListTable = ref(null)
const attachmentsListTable = ref(null)
const tagInput = ref(null)

// Computed
const isAdmin = computed(() => store.getters.isAdmin)

// Reactive data
const selectedRowKeys = ref([])
const questionSelectedRowKeys = ref([])
const videoSelectedRowKeys = ref([])
const examSelectedRowKeys = ref([])
const attachmentSelectedRowKeys = ref([])

const initSortableObj = reactive({
  video: false,
  exam: false
})

const videoListObj = reactive({
  query: {
    is_public: "",
    college_id: "",
    title: "",
    page: 1,
    pageSize: 15
  },
  total: 0,
  list: []
})

const questionObj = reactive({
  video_id: '',
  query: {
    name: '',
    question_status: '',
    question_type: '',
    question_category_id: '',
    id: ''
  },
  list: []
})

const examObj = reactive({
  query: {
    name: "",
    is_valid: "",
    page: 1,
    pageSize: 12
  },
  total: 0,
  list: []
})

const manageObj = reactive({
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
})

const showObj = reactive({
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
})

const catalogObj = reactive({
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
  }
})

const coverObj = reactive({
  dialogImageUrl: "",
  imageUrl: "",
  file: {
    name: ''
  }
})

const attachmentObj = reactive({
  id: '',
  file_name_zh: '',
  file_name_tw: '',
  file_name_en: '',
  file_name_vi: '',
  file: ''
})

const cssObj = reactive({
  tableMaxHeight: '400px',
  popoverWidth: "600px",
  headerRowStyle: {
    background: '#f2f4f9',
    color: '#505050',
    fontSize: '14px',
    height: '50px'
  }
})

const selectedTags = ref([])

const tagObj = reactive({
  query: {
    page: 1,
    pageSize: 9999,
    name: ""
  },
  list: [],
  total: 0
})

const courseObj = reactive({
  newForm: {
    id: "",
    type: '',
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
})

const languageTypeList = ref([])
const courseCatalogList = ref([])

const publicCodeObj = computed(() => {
  return {
    allCollegeList: allCollegeListData.value ? allCollegeListData.value.list : [],
    collegeList: collegeListByPathData.value ? collegeListByPathData.value : [],
    org_id: [],
    language_type: languageTypeList.value,
    courseCatalog: courseCatalogList.value,
    question_type: [
      { label: l.value.fillIn, value: 0 },
      { label: l.value.singleChoice, value: 1 },
      { label: l.value.multipleChoice, value: 2 },
      { label: l.value.judge, value: 3 }
    ],
    question_status: [
      { label: l.value.published, value: 0 },
      { label: l.value.unpublished, value: 1 }
    ],
    lecturer_status: [
      { label: l.value.externalLecturer, value: 0 },
      { label: l.value.internalLecturer, value: 1 }
    ]
  }
})

// TanStack Query - Get Course List
const { data: courseData, refetch: refetchCourseList } = useQuery({
  queryKey: ['courseList', courseObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/getCourseList',
      courseObj.query,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    courseObj.list = data.list
    courseObj.total = data.total
    showObj.addOrModifyCourse = false
  },
  enabled: false
})

// TanStack Query - Get Video List
const { refetch: refetchVideoList } = useQuery({
  queryKey: ['videoList', videoListObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoManage/getVideoList',
      videoListObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    videoListObj.list = data.list
    videoListObj.total = data.total
  },
  enabled: false
})

// TanStack Query - Get Exam List
const { refetch: refetchExamList } = useQuery({
  queryKey: ['examList', examObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoExam/getExamList',
      examObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    examObj.list = data.list
    examObj.total = data.total
  },
  enabled: false
})

// TanStack Query - Get Question List
const { refetch: refetchQuestionList } = useQuery({
  queryKey: ['questionList', questionObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoExam/getQuestionList',
      questionObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    questionObj.list = data.list
    showObj.selectQuestion = true
  },
  enabled: false
})

// TanStack Query - Get Tag List
const { refetch: refetchTagList } = useQuery({
  queryKey: ['tagList', tagObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoTag/getList',
      tagObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.list) {
      tagObj.list = data.list
      tagObj.total = data.total
    }
  },
  enabled: false
})

// TanStack Query - Get All College List
const { data: allCollegeListData, refetch: refetchAllCollegeList } = useQuery({
  queryKey: ['allCollegeList'],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoCollege/getCollegeList',
      { page: 1, pageSize: 9999 }
    )
    return response.data
  }
})

// TanStack Query - Get College List by Path
const { data: collegeListByPathData, refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeListByPath', route.path],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath',
      { resource_path: route.path }
    )
    return response.data
  },
  onError: (error) => {
    $message.error(error.message)
  }
})

watch(() => publicCodeObj.value.collegeList, (newVal) => {
  if (newVal && newVal.length > 0) {
    courseObj.query.college_id = newVal[0].id
    videoListObj.query.college_id = newVal[0].id
    getCourseList()
  }
})

// TanStack Query - Get Attachments
const getAttachmentsMutation = useMutation({
  mutationFn: async (id) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts',
      { course_primary_id: id, page: 1, pageSize: 9999 }
    )
    return response.data
  },
  onSuccess: (data) => {
    manageObj.attachmentsList = data.list || []
  }
})

// TanStack Query - Upload Attachment
const uploadAttachmentMutation = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/uploadAttachment',
      formData,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.id) {
      manageObj.attachmentsList.push({
        id: data.id,
        file_name_zh: attachmentObj.file_name_zh,
        file_name_tw: attachmentObj.file_name_tw,
        file_name_en: attachmentObj.file_name_en,
        file_name_vi: attachmentObj.file_name_vi,
        url: data.url,
        file_size: data.file_size
      })
      $message.success(l.value.operateSuccess)
      showObj.attachment = false
      attachmentObj.id = ''
      attachmentObj.file_name_zh = ''
      attachmentObj.file_name_tw = ''
      attachmentObj.file_name_en = ''
      attachmentObj.file_name_vi = ''
      attachmentObj.file = ''
    }
  }
})

// TanStack Query - Upload Cover
const uploadCoverMutation = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoManage/uploadPicture',
      formData,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.url) {
      courseObj.newForm.thumbnail_path = data.url
      submitCourse()
    }
  }
})

// TanStack Query - Submit Course
const submitCourseMutation = useMutation({
  mutationFn: async (postData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/addOrModifyCourse',
      postData,
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    getCourseList()
    showObj.addOrModifyCourse = false
  }
})

// TanStack Query - Modify Course Status
const modifyCourseStatusMutation = useMutation({
  mutationFn: async ({ id, is_valid }) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/modifyCourseStatus',
      { id, is_valid },
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    getCourseList()
  }
})

// TanStack Query - Submit Process Question
const submitProcessQuestionMutation = useMutation({
  mutationFn: async (postData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoProcessQuestion/addQestionToVideo',
      postData,
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    videoClose()
  }
})

// TanStack Query - Get Binding Question By Id
const getBindingQuestionByIdMutation = useMutation({
  mutationFn: async (id) => {
    const response = await $request(
      api.videoServer + '/Video/VideoProcessQuestion/getList',
      { video_id: id }
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.length > 0) {
      manageObj.questionList = data.map(item => ({
        ...item,
        text: item.name_label
      }))
    } else {
      manageObj.questionList = []
    }
    showObj.processQuestion = true
  }
})

// TanStack Query - Get Course Video and Exam
const getCourseVideoAndExamMutation = useMutation({
  mutationFn: async (courseId) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + courseId
    )
    return response.data
  },
  onSuccess: (data) => {
    manageObj.selectedVideoList = []
    manageObj.selectedExamList = []
    if (data.length > 0) {
      data.forEach(i => {
        if (i.type == 1) {
          manageObj.selectedVideoList.push(i)
        } else if (i.type == 0) {
          manageObj.selectedExamList.push(i)
        }
      })
    }
    showObj.addOrModifyCourse = true
  }
})

// Methods
const previewFile = (url) => {
  showObj.fileUrl = api.videoServer + '/' + url
  showObj.filePreviews = true
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const attachmentWarning = () => {
  $alert(l.value.attachmentWarningMessage)
}

const getAttachments = (id) => {
  manageObj.attachmentsList = []
  getAttachmentsMutation.mutate(id)
}

const attachmentSelect = () => {
  attachmentInput.value.click()
}

const attachmentSelectionChange = (val) => {
  manageObj.attachmentSelection = val
}

const uploadattAchmentChange = (e) => {
  const file = e.target.files[0]
  attachmentObj.file = file
  attachmentObj.file_name_zh = file.name
  showObj.attachment = true
}

const uploadAttachment = () => {
  const formData = new FormData()
  formData.append('id', attachmentObj.id)
  formData.append('file_name_zh', attachmentObj.file_name_zh)
  formData.append('file_name_tw', attachmentObj.file_name_tw)
  formData.append('file_name_en', attachmentObj.file_name_en)
  formData.append('file_name_vi', attachmentObj.file_name_vi)
  formData.append('file', attachmentObj.file)
  uploadAttachmentMutation.mutate(formData)
}

const removeAttachment = (i) => {
  manageObj.attachmentsList.splice(i, 1)
}

const removeMultipleAttachment = () => {
  const idsToDelete = manageObj.attachmentSelection.map(item => item.id)
  manageObj.attachmentsList = manageObj.attachmentsList.filter(item => !idsToDelete.includes(item.id))
  attachmentsListTable.value.clearSelection()
}

const tabClick = (key) => {
  if (key == 'video') {
    if (initSortableObj.video == false) {
      const tbodyVideo = document.querySelector(".draggable-table-video .ant-table-tbody")
      new Sortable(tbodyVideo, {
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          const currRow = manageObj.selectedVideoList.splice(oldIndex, 1)[0]
          manageObj.selectedVideoList.splice(newIndex, 0, currRow)
        }
      })
      initSortableObj.video = true
    }
  } else if (key == 'exam') {
    if (initSortableObj.exam == false) {
      const tbodyExam = document.querySelector(".draggable-table-exam .ant-table-tbody")
      new Sortable(tbodyExam, {
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          const currRow = manageObj.selectedExamList.splice(oldIndex, 1)[0]
          manageObj.selectedExamList.splice(newIndex, 0, currRow)
        }
      })
      initSortableObj.exam = true
    }
  }
}

const handleVideoSizeChange = (i) => {
  videoListObj.query.page = 1
  videoListObj.query.pageSize = i
  getVideoList()
}

const handleVideoPageChange = (i) => {
  videoListObj.query.page = i
  getVideoList()
}

const handleExamSizeChange = (i) => {
  examObj.query.page = 1
  examObj.query.pageSize = i
  getExamList()
}

const handleExamPageChange = (i) => {
  examObj.query.page = i
  getExamList()
}

const videoSelectionChange = (val) => {
  manageObj.videoSelection = val
}

const selectVideo = (data) => {
  data.primary_id = ''
  data.is_process_question = false
  data.finish_time = 100
  if (manageObj.selectedVideoList.some(i => i.id === data.id)) {
    $message.error(l.value.videoAlready)
  } else {
    manageObj.selectedVideoList.push(data)
  }
}

const selectMultipleVideo = () => {
  const videoIdSet = new Set(manageObj.selectedVideoList.map(i => i.id))
  manageObj.videoSelection.forEach(i => {
    if (!videoIdSet.has(i.id)) {
      i.primary_id = ''
      i.is_process_question = false
      i.finish_time = 100
      manageObj.selectedVideoList.push(i)
    }
  })
  videoDialogTable.value.clearSelection()
  $message.success(l.value.operateSuccess)
  showObj.selectVideo = false
}

const removeVideo = (i) => {
  manageObj.selectedVideoList.splice(i, 1)
}

const removeMultipleVideo = () => {
  const idsToDelete = manageObj.videoSelection.map(item => item.id)
  manageObj.selectedVideoList = manageObj.selectedVideoList.filter(item => !idsToDelete.includes(item.id))
  videoListTable.value.clearSelection()
}

const getVideoList = () => {
  refetchVideoList()
}

const examSelectionChange = (val) => {
  manageObj.examSelection = val
}

const selectExam = (data) => {
  data.primary_id = ''
  data.is_process_question = false
  if (manageObj.selectedExamList.some(i => i.id === data.id)) {
    $message.error(l.value.examAlready)
  } else {
    manageObj.selectedExamList.push(data)
  }
}

const selectMultipleExam = () => {
  const examIdSet = new Set(manageObj.selectedExamList.map(i => i.id))
  manageObj.examSelection.forEach(i => {
    if (!examIdSet.has(i.id)) {
      i.primary_id = ''
      i.is_process_question = false
      manageObj.selectedExamList.push(i)
    }
  })
  examDialogTable.value.clearSelection()
  $message.success(l.value.operateSuccess)
  showObj.selectExam = false
}

const removeExam = (i) => {
  manageObj.selectedExamList.splice(i, 1)
}

const removeMultipleExam = () => {
  const idsToDelete = manageObj.examSelection.map(item => item.id)
  manageObj.selectedExamList = manageObj.selectedExamList.filter(item => !idsToDelete.includes(item.id))
  examListTable.value.clearSelection()
}

const getExamList = () => {
  refetchExamList()
}

const previewExam = (i) => {
  const url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: "",
      course_id: '',
      exam_id: '',
      questionnaire_id: i.questionnaire_id,
      mode: 'preview'
    }
  }).href
  window.open(url, '_blank')
}

const videoClose = () => {
  videoPlayerRef.value.onDestroy()
  showObj.processQuestion = false
}

const questionSelectionChange = (val) => {
  manageObj.questionSelection = val
}

const selectQuestion = (data) => {
  data.time = ''
  data.text = data.name_label
  manageObj.questionList.push(data)
}

const selectMultipleQuestion = () => {
  manageObj.questionSelection.forEach(i => {
    i.time = ''
    i.text = i.name_label
  })
  manageObj.questionList = manageObj.questionList.concat(manageObj.questionSelection)
  questionDialogTable.value.clearSelection()
  showObj.selectQuestion = false
}

const removeQuestion = (i) => {
  manageObj.questionList.splice(i, 1)
}

const removeMultipleQuestion = () => {
  const idsToDelete = manageObj.questionSelection.map(item => item.id)
  manageObj.questionList = manageObj.questionList.filter(item => !idsToDelete.includes(item.id))
  questionTable.value.clearSelection()
}

const getQuestionList = () => {
  refetchQuestionList()
}

const getBindingQuestionById = (id) => {
  getBindingQuestionByIdMutation.mutate(id)
}

const openProcessQuestion = (data) => {
  showObj.videoUrl = api.videoServer + data.url
  questionObj.video_id = data.id
  getBindingQuestionById(data.id)
}

const submitProcessQuestion = () => {
  const postData = {
    video_id: questionObj.video_id,
    detail: []
  }

  let emptyIndex = false
  manageObj.questionList.forEach((i, index) => {
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
    return $message.error(l.value.activetimePd.replace('emptyIndex', emptyIndex))
  }

  submitProcessQuestionMutation.mutate(postData)
}

const flashMarkers = () => {
  videoPlayerRef.value.generateMarkers()
}

const modifyCourseBinding = (data) => {
  Object.assign(courseObj.newForm, data)
  courseObj.newForm.lecturer = Number(courseObj.newForm.lecturer)
  selectedTags.value = tagObj.list.filter(aItem => data.tags.some(bItem => bItem.id === aItem.id))

  if (typeof data == 'object') {
    manageObj.currentPrimaryId = data.id
  } else {
    manageObj.currentPrimaryId = data
  }

  getCourseVideoAndExamMutation.mutate(manageObj.currentPrimaryId)
}

const getCatalogList = (oid) => {
  let org_id = ''
  if (typeof oid == 'string') {
    org_id = oid
  }
  $request(api.videoServer + '/Video/VideoCourseCatalog/getCatalogList?org_id=' + org_id)
    .then(r => {
      catalogObj.data = r.data
    })
}

const getTagList = () => {
  refetchTagList()
}

const selectTag = (i) => {
  if (!selectedTags.value.includes(i)) {
    if (selectedTags.value.length >= 5) {
      return $notify.error({
        title: l.value.error,
        message: l.value.most5Tags
      })
    } else {
      selectedTags.value.push(i)
    }
  } else {
    const index = selectedTags.value.indexOf(i)
    selectedTags.value.splice(index, 1)
  }
}

const coverSelect = () => {
  coverInput.value.click()
}

const coverPreview = (url) => {
  if (!url) return
  coverObj.dialogImageUrl = url
  showObj.coverDialog = true
}

const uploadCoverChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result
  }
  reader.readAsDataURL(file)
  coverObj.file = file
}

const uploadCover = () => {
  const formData = new FormData()
  formData.append('formFile', coverObj.file)
  uploadCoverMutation.mutate(formData)
}

const handleSubmit = () => {
  if (manageObj.selectedVideoList.length == 0) {
    return $message.error(l.value.containOneVideoAtleat)
  }
  if (rightCheck(courseObj.newForm, true)) {
    if (coverObj.file.name) {
      uploadCover()
    } else {
      submitCourse()
    }
  }
}

const handleSizeChange = (i) => {
  courseObj.query.pageSize = i
  getCourseList()
}

const handlePageChange = (i) => {
  courseObj.query.page = i
  getCourseList()
}

const addCourse = () => {
  coverObj.dialogImageUrl = ""
  coverObj.imageUrl = ""
  coverObj.file = { name: '' }

  courseObj.newForm = {
    id: "",
    name_zh: "",
    name_tw: "",
    name_en: "",
    name_vi: "",
    description: "",
    college_id: isAdmin.value ? '' : publicCodeObj.value.collegeList[0].id,
    is_public: isAdmin.value ? 1 : 0,
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
  courseObj.currentPrimaryId = ''
  manageObj.selectedVideoList = []
  manageObj.selectedExamList = []
  showObj.addOrModifyCourse = true
}

const modifyCourseStatus = (i) => {
  if (rightCheck(i, true)) {
    const currentStatus = i.is_valid
    let value
    let oprate
    if (currentStatus == 'N') {
      value = 'Y'
      oprate = c.value.enable
    } else {
      value = 'N'
      oprate = c.value.disable
    }

    $prompt(oprate + i.name_label + l.value.confirmTips, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.value.inputErrorMessage,
      confirmButtonText: l.value.confirmText,
      cancelButtonText: l.value.cancelText
    }).then(() => {
      modifyCourseStatusMutation.mutate({ id: i.id, is_valid: value })
    }).catch(() => {
      console.log('取消操作')
    })
  }
}

const rightCheck = (i, toast = false) => {
  if (isAdmin.value) {
    return true
  } else {
    if (publicCodeObj.value.collegeList.some(c => c.id == i.college_id)) {
      return true
    } else {
      if (toast) {
        $message.error(l.value.noRight)
      }
      return false
    }
  }
}

const getCourseList = () => {
  refetchCourseList()
}

const submitCourse = () => {
  const video_exam_list = []
  const attachmentids_list = []

  if (manageObj.selectedVideoList.length > 0) {
    manageObj.selectedVideoList.forEach((i, index) => {
      video_exam_list.push({
        primary_id: i.primary_id,
        type: 1,
        video_id: i.id,
        exam_id: '',
        display_order: index + 1,
        is_process_question: i.is_process_question ? 1 : 0,
        finish_time: i.finish_time || 100,
        score: i.score || 0,
        is_valid: 'Y',
        rec_status: 1
      })
    })
  }

  if (manageObj.selectedExamList.length > 0) {
    manageObj.selectedExamList.forEach((i, index) => {
      video_exam_list.push({
        primary_id: i.primary_id,
        type: 0,
        video_id: '',
        exam_id: i.id,
        display_order: index + 1,
        is_process_question: 0,
        finish_time: 100,
        score: i.score || 0,
        is_valid: 'Y',
        rec_status: 1
      })
    })
  }

  if (manageObj.attachmentsList.length > 0) {
    attachmentids_list.push(...manageObj.attachmentsList.map(i => i.id))
  }

  courseObj.newForm.tag_ids = []
  if (selectedTags.value.length > 0) {
    selectedTags.value.forEach(i => {
      courseObj.newForm.tag_ids.push(i.id)
    })
  }

  if (courseObj.newForm.name_zh === '') {
    return $message.error(l.value.titleError)
  }

  if (courseObj.newForm.college_id === '') {
    return $message.error(l.value.belongCollegeError)
  }

  if (courseObj.newForm.applicable_group === '') {
    return $message.error(l.value.applicableGroupError)
  }

  if (courseObj.newForm.lecturer === '') {
    return $message.error(l.value.lecturerTypeError)
  }

  if (courseObj.newForm.language === '') {
    return $message.error(l.value.languageError)
  }

  if (courseObj.newForm.profit === '') {
    return $message.error(l.value.profitError)
  }

  if (courseObj.newForm.courseCatalog === '') {
    return $message.error(l.value.courseCatalogPd)
  }

  const postData = Object.assign({
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
  }, courseObj.newForm)

  postData.video_exam_list = video_exam_list
  postData.attachmentids_list = attachmentids_list

  submitCourseMutation.mutate(postData)
}

const handleSelectionChange = (val) => {
  courseObj.multipleSelection = val
}

const updateTableMaxHeight = () => {
  const container = tableContainer.value
  if (container) {
    cssObj.tableMaxHeight = container.clientHeight
  }
}

const getPopoverWidth = () => {
  const container = tagInput.value
  if (container) {
    cssObj.popoverWidth = 0.9 * container.clientWidth
  }
}

const formatDuration = (totalSeconds, unit) => {
  if (totalSeconds) {
    const duration = Math.floor(totalSeconds)
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    if (unit) {
      return [
        hours > 0 ? hours.toString().padStart(2, '0') + l.value.hours : '',
        minutes.toString().padStart(2, '0') + l.value.minutes,
        seconds.toString().padStart(2, '0') + l.value.seconds
      ].filter(Boolean).join('')
    } else {
      return [
        hours > 0 ? hours.toString().padStart(2, '0') : '',
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].filter(Boolean).join('')
    }
  } else {
    return ""
  }
}

const formatFinishTimePicker = (totalSeconds) => {
  if (totalSeconds) {
    const duration = Math.floor(totalSeconds)
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    return [
      hours.toString().padStart(2, '0') + ':',
      minutes.toString().padStart(2, '0') + ':',
      seconds.toString().padStart(2, '0')
    ].filter(Boolean).join('')
  } else {
    return ''
  }
}

const formatFinishTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return 0

  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return 0

  const [_, hours, minutes, seconds] = match.map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

const returnPublicObjLabel = (value, key, label, filed) => {
  const item = publicCodeObj.value[filed].find(i => i[key] == value)
  if (item) {
    return item[label]
  } else {
    return value
  }
}

const getAllCollegeList = () => {
  refetchAllCollegeList()
}

const getCollegeList = () => {
  refetchCollegeList()
}

const getLanguage_type = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '121',
    pageSize: 9999
  }).then(r => {
    const list = []
    r.data.list.forEach(j => {
      list.push({
        value: j.code_value,
        label: j.code_name
      })
    })
    languageTypeList.value = list
  }).catch(e => {
    $message.error(e.message)
  })
}

const getCourseCatalog = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '122',
    pageSize: 9999
  }).then(r => {
    const list = []
    r.data.list.forEach(j => {
      list.push({
        value: j.code_value,
        label: j.code_name
      })
    })
    courseCatalogList.value = list
  }).catch(e => {
    $message.error(e.message)
  })
}

// Watchers
watch(() => courseObj.query.college_id, (newVal, oldVal) => {
  if (newVal && oldVal === '') {
    courseObj.query.is_public = ''
  }
  if (!isAdmin.value) {
    if (newVal == '') {
      courseObj.query.is_public = 1
    }
  }
  getCourseList()
})

watch(() => videoListObj.query.college_id, (newVal, oldVal) => {
  if (newVal && oldVal === '') {
    videoListObj.query.is_public = ''
  }
  if (!isAdmin.value) {
    if (newVal == '') {
      videoListObj.query.is_public = 1
    }
  }
  getVideoList()
})

// Lifecycle
onMounted(() => {
  getAllCollegeList()
  getCollegeList()
  getTagList()
  getLanguage_type()
  getCourseCatalog()
  window.addEventListener('resize', updateTableMaxHeight)
  nextTick(() => {
    updateTableMaxHeight()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableMaxHeight)
})
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
