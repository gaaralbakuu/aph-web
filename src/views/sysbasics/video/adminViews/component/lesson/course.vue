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
      <a-modal :visible="showObj.coverDialog" :title="$l.preview" @cancel="showObj.coverDialog = false">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit='fill'>
      </a-modal>

      <!-- 管理播放中答题dialog -->
      <a-modal :visible="showObj.processQuestion" :title="$l.addQuestion" width="75%" @cancel="videoClose">
        <a-row>
          <a-col :span="10">
            <div style="width: 100%;aspect-ratio: 1.8;">
              <videoPlayer ref="videoPlayer" :src="showObj.videoUrl" :markers="manageObj.questionList">
              </videoPlayer>
            </div>
          </a-col>
          <a-col :span="14">
            <div style="float: right;margin-bottom: 10px;">
              <a-button type="primary" ghost @click="flashMarkers">{{$l.refreshMarkers}}</a-button>
              <a-button type="primary" @click="getQuestionList">{{$l.addQuestion}}</a-button>
              <a-button type="primary" danger @click="removeMultipleQuestion">{{$l.multipleRemove}}</a-button>
            </div>
            <a-table ref="questionTable" :dataSource="manageObj.questionList" style="width: 100%"
              :row-selection="{ selectedRowKeys: questionSelectedRowKeys, onChange: questionSelectionChange }"
              :scroll="{ y: 300 }">
              <a-table-column title="No." width="50">
                <template #default="text, record, index">
                  {{ index + 1 }}
                </template>
              </a-table-column>
              <a-table-column :title="$l.question" dataIndex="name_label"></a-table-column>
              <a-table-column :title="$l.activeTime" dataIndex="time" width="120">
                <template #default="text, record">
                  <a-input-number v-model:value="record.time"></a-input-number>
                </template>
              </a-table-column>
              <a-table-column :title="$l.diffcult" dataIndex="difficulty_level" width="80"></a-table-column>
              <a-table-column :title="$l.questionType" dataIndex="question_type" width="80">
                <template #default="text">
                  {{returnPublicObjLabel(text,'value','label','question_type')}}
                </template>
              </a-table-column>
              <!-- <a-table-column :title="$l.publishStatus" dataIndex="question_status" width="80">
                <template #default="text">
                  {{returnPublicObjLabel(text,'value','label','question_status')}}
                </template>
              </a-table-column> -->
              <!-- <a-table-column :title="$l.status" dataIndex="is_valid">
                  <template #default="text">
                    {{text=='Y'?'$c.enable:$c.disable}}
                  </template>
                </a-table-column> -->
              <a-table-column :title="$c.operation" width="80" fixed="right">
                <template #default="text, record, index">
                  <a-button type="link" danger
                    @click="removeQuestion(index)">{{$c.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-col>


        </a-row>

        <template #footer>
          <a-button @click="showObj.processQuestion = false">{{$l.giveup}}</a-button>
          <a-button type="primary" @click="submitProcessQuestion">{{$l.submit}}</a-button>
        </template>
      </a-modal>

      <!-- 添加答题dialog -->
      <a-modal :visible="showObj.selectQuestion" :title="$l.addQuestion" width="50%" @cancel="showObj.selectQuestion = false">
        <a-form layout="inline" :label-col="{ span: 4 }">
          <a-form-item :label="$c.title">
            <a-input v-model:value="questionObj.query.name"></a-input>
          </a-form-item>
          <a-form-item :label="$l.questionType">
            <a-select v-model:value="questionObj.query.question_type" @change="getQuestionList" style="width: 100px;">
              <a-select-option value="">{{$c.all}}</a-select-option>
              <a-select-option v-for="i in publicCodeObj.question_type" :key='i.value' :value="i.value">{{i.label}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$l.status">
            <a-select v-model:value="questionObj.query.question_status" @change="getQuestionList" style="width: 100px;">
              <a-select-option value="">{{$c.all}}</a-select-option>
              <a-select-option v-for="i in publicCodeObj.question_status" :key='i.value' :value="i.value">{{i.label}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" ghost @click="getQuestionList">{{$l.search}}</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="selectMultipleQuestion">{{$l.multipleAdd}}</a-button>
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
          <a-table-column :title="$l.question" dataIndex="name_label"></a-table-column>
          <a-table-column :title="$l.diffcult" dataIndex="difficulty_level" width="80"></a-table-column>
          <a-table-column :title="$l.questionType" dataIndex="question_type" width="80">
            <template #default="text">
              {{returnPublicObjLabel(text,'value','label','question_type')}}
            </template>
          </a-table-column>
          <a-table-column :title="$l.publishStatus" dataIndex="question_status" width="80">
            <template #default="text">
              {{returnPublicObjLabel(text,'value','label','question_status')}}
            </template>
          </a-table-column>
          <!-- <a-table-column :title="$l.stastus" dataIndex="is_valid">
              <template #default="text">
                {{text=='Y'?$c.enable:'$c.disable}}
              </template>
            </a-table-column> -->
          <a-table-column :title="$c.operation" width="80" fixed="right">
            <template #default="text, record">
              <a-button type="link" @click="selectQuestion(record)">{{$l.add}}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-modal>

      <!-- 选择视频dialog -->
      <a-modal :visible="showObj.selectVideo" @after-open='getVideoList' :title="$l.addVideo" width="70%" @cancel="showObj.selectVideo = false">
        <div class="videoSelect-dialog">
          <a-form layout="inline">
            <a-form-item :label="$l.belongCollege">
              <a-select v-model:value="videoListObj.query.college_id" :placeholder="$l.emptyIsPublicCourse" allow-clear>
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$l.title">
              <a-input v-model:value="videoListObj.query.title" allow-clear @clear='getVideoList'
                @keyup.enter="getVideoList"></a-input>
            </a-form-item>
            <a-form-item :label="$l.videoType">
              <a-select v-model:value="videoListObj.query.is_public" :disabled="!isAdmin&&videoListObj.query.college_id==''"
                style="width: 100px;" @change="getVideoList">
                <a-select-option value="">{{$c.all}}</a-select-option>
                <a-select-option :value="1">{{$l.public}}</a-select-option>
                <a-select-option :value="0">{{$l.private}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="getVideoList">{{$l.search}}</a-button>
              <a-button type="primary" @click="selectMultipleVideo">{{$l.multipleAdd}}</a-button>
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
            <a-table-column :title="$l.cover" dataIndex="thumbnail_path">
              <template #default="text">
                <img class="auto-img" :src="$api.videoServer+'/'+text" height="50px"
                  @click="coverPreview($api.videoServer+'/'+ text)" />
              </template>
            </a-table-column>
            <a-table-column :title="$l.title" dataIndex="title"></a-table-column>
            <a-table-column :title="$l.desc" dataIndex="description"></a-table-column>
            <a-table-column :title="$l.belongCollege" dataIndex="college_id">
              <template #default="text">
                {{returnPublicObjLabel(text,'id','name_label','allCollegeList')}}
              </template>
            </a-table-column>
            <a-table-column :title="$l.duration" dataIndex="duration">
              <template #default="text">
                {{formatDuration(text,true)}}
              </template>
            </a-table-column>
            <a-table-column :title="$c.operation" fixed="right">
              <template #default="text, record">
                <a-button type="link" @click="selectVideo(record)">{{$l.add}}</a-button>
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
      <a-modal :visible="showObj.selectExam" @after-open='getExamList' :title="$l.addExam" width="70%" @cancel="showObj.selectExam = false">
        <div class="videoSelect-dialog">
          <a-form layout="inline" :label-col="{ span: 6 }">
            <a-form-item :label="$l.title">
              <a-input v-model:value="examObj.query.name" allow-clear @clear='getExamList'
                @keyup.enter="getExamList"></a-input>
            </a-form-item>
            <a-form-item :label="$l.status">
              <a-select v-model:value="examObj.query.is_valid" style="width: 100px;" @change="getExamList">
                <a-select-option value="">{{$c.all}}</a-select-option>
                <a-select-option value="Y">{{$c.enable}}</a-select-option>
                <a-select-option value="N">{{$c.disable}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="getExamList">{{$l.search}}</a-button>
              <a-button type="primary" ghost @click="selectMultipleExam">{{$l.multipleAdd}}</a-button>
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
            <a-table-column :title="$l.title" dataIndex="name_label"></a-table-column>
            <a-table-column :title="$l.passScore" dataIndex="pass_score"></a-table-column>
            <a-table-column :title="$l.maxReplyNum" dataIndex="max_reply_num"></a-table-column>
            <a-table-column :title="$l.examDuration" dataIndex="test_duration"></a-table-column>
            <a-table-column :title="$l.startTime" dataIndex="start_time"></a-table-column>
            <a-table-column :title="$l.endTime" dataIndex="end_time"></a-table-column>
            <a-table-column :title="$l.statuts" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="$c.operation" fixed="right">
              <template #default="text, record">
                <a-button type="link" style="color: green;" @click="previewExam(record)">{{$l.preview}}</a-button>
                <a-button type="link" @click="selectExam(record)">{{$l.add}}</a-button>
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
          <div class="title">{{$l.manageCourse}}</div>
        </template>
        <a-tabs type="card" class="form-container" @change="tabClick" v-model:activeKey="showObj.activeTabName">
          <a-tab-pane :tab="$l.basicalInfo" key="data">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-form-item :label="$l.cover" v-if="courseObj.newForm.id==''">
                <div v-if="coverObj.imageUrl==''" class="cover">
                  <div class="plus-icon" @click="coverSelect">
                    <i class="el-icon-upload" style="font-size: 30px;"></i>
                    <div>
                      {{$l.chooseCover}}
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
              <a-form-item :label="$l.cover" v-else>
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
                          {{$l.chooseCover}}
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
                  <a-form-item :label="$l.belongCollege" required>
                    <a-select v-model:value="courseObj.newForm.college_id" :placeholder="$l.pleaseSelectCollege"
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
                  <a-form-item :label="$l.courseType">
                    <a-switch v-model:checked="courseObj.newForm.is_public" :checked-value="1"
                      :un-checked-value="0">
                      <template #checkedChildren>{{$l.public}}</template>
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
                  <a-form-item :label="$l.belongCollege">
                    <a-select v-model:value="courseObj.newForm.college_id" :placeholder="$l.pleaseSelectCollege"
                      style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>



              <a-row>
                <a-col :span="6">
                  <a-form-item :label="$l.name_zh" required>
                    <a-input v-model:value="courseObj.newForm.name_zh"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$l.name_tw">
                    <a-input v-model:value="courseObj.newForm.name_tw"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$l.name_en">
                    <a-input v-model:value="courseObj.newForm.name_en"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$l.name_vi">
                    <a-input v-model:value="courseObj.newForm.name_vi"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <a-form-item :label="$l.courseCatalog" required>
                    <a-select v-model:value="courseObj.newForm.type" :placeholder="$l.courseCatalogPd" style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.courseCatalog" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$l.lecturer" required>
                    <a-select v-model:value="courseObj.newForm.lecturer" :placeholder="$l.lecturerPd" style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.lecturer_status" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$l.trainLanguage" required>
                    <a-select v-model:value="courseObj.newForm.language" :placeholder="$l.trainLanguagePd"
                      style="width: 100%;">
                      <a-select-option v-for="i in publicCodeObj.language_type" :key="i.value" :value="i.value">{{i.label}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <a-form-item :label="$l.tag">
                    <a-popover placement="bottom" trigger="click">
                      <template #content>
                        <div class="tag-container" :style="{width: cssObj.popoverWidth}">
                          <div class="tag-title" style="margin-bottom: 10px;">{{$l.tagPd}}</div>
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
                        <div v-else style="margin-left: 1em;color: #aaa;">{{$l.chooseTagPd}}</div>
                        <div style="margin-right: 1em;color: #aaa;">
                          <span>{{selectedTags.length}}/5</span>
                          <span><i class="el-icon-arrow-down"></i></span>
                        </div>
                      </div>
                    </a-popover>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$l.applicableGroup" required>
                    <a-input v-model:value="courseObj.newForm.applicable_group"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="$l.profit" required>
                    <a-input v-model:value="courseObj.newForm.profit"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item :label="$l.desc">
                <a-textarea v-model:value="courseObj.newForm.description" :rows="4"></a-textarea>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane :tab="$l.courseVideo" key='video'>
            <div style="float: right;margin-bottom: 10px; position: relative; z-index: 10;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" @click="showObj.selectVideo = true">{{$l.addVideo}}</a-button>
              <a-button type="primary" danger @click="removeMultipleVideo">{{$l.multipleRemove}}</a-button>
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
              <a-table-column :title="$l.cover" dataIndex="thumbnail_path">
                <template #default="text">
                  <img class="auto-img" :src="$api.videoServer+'/'+text" height="80px"
                    @click="coverPreview($api.videoServer+'/'+ text)" />
                </template>
              </a-table-column>
              <a-table-column :title="$l.title" dataIndex="title"></a-table-column>
              <a-table-column :title="$l.desc" dataIndex="description" :width="400" :ellipsis="true"></a-table-column>
              <a-table-column :title="$l.duration" dataIndex="duration">
                <template #default="text">
                  {{formatDuration(text,true)}}
                </template>
              </a-table-column>
              <!-- <a-table-column :title="$l.needToLearn">
                <template #default="text, record">
                  <a-input-number v-model:value="record.finish_time" :placeholder="$l.needToLearnPd"
                    :max="100" :min="0"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="$l.playQuestion" dataIndex="is_process_question">
                <template #default="text, record">
                  <a-switch v-model:checked="record.is_process_question" 
                    :checked-value="true" :un-checked-value="false">
                  </a-switch>
                  <a-button v-show="record.is_process_question" type="link" style="color: green;"
                    @click="openProcessQuestion(record)">{{$l.playQuestionManage}}</a-button>
                </template>
              </a-table-column>
              <!-- <a-table-column :title="$l.score" dataIndex="score">
                <template #default="text, record">
                  <a-input-number v-model:value="record.score" :placeholder="$l.scorePd"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="$c.operation" fixed="right">
                <template #default="text, record, index">
                  <a-button v-show="rightCheck(courseObj.newForm)" type="link" danger
                    @click="removeVideo(index)">{{$l.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <a-tab-pane :tab="$l.courseExam" key="exam">
            <div style="float: right;margin-bottom: 10px; position: relative; z-index: 10;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" @click="showObj.selectExam = true">{{$l.addExam}}</a-button>
              <a-button type="primary" danger @click="removeMultipleExam">{{$l.multipleRemove}}</a-button>
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
              <a-table-column :title="$l.title" dataIndex="name_label"></a-table-column>
              <a-table-column :title="$l.passScore" dataIndex="pass_score"></a-table-column>
              <a-table-column :title="$l.maxReplyNum" dataIndex="max_reply_num"></a-table-column>
              <a-table-column :title="$l.examDuration" dataIndex="test_duration"></a-table-column>
              <a-table-column :title="$l.startTime" dataIndex="start_time"></a-table-column>
              <a-table-column :title="$l.endTime" dataIndex="end_time"></a-table-column>
              <!-- <a-table-column :title="$l.status" dataIndex="is_valid"></a-table-column> -->
              <!-- <a-table-column :title="$l.score" dataIndex="score">
                <template #default="text, record">
                  <a-input-number v-model:value="record.score" :placeholder="$l.scorePd"></a-input-number>
                </template>
              </a-table-column> -->
              <a-table-column :title="$c.operation" fixed="right">
                <template #default="text, record, index">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <a-button type="link" style="color: green;" @click="previewExam(record)">{{$l.preview}}</a-button>
                    <a-button type="link" danger @click="removeExam(index)">{{$l.remove}}</a-button>
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <a-tab-pane :tab="$l.courseAttachments" key="attachment">
            <div style="float: right;margin-bottom: 10px; position: relative; z-index: 10;" v-show="rightCheck(courseObj.newForm)">
              <a-button type="primary" ghost @click="attachmentWarning">{{$l.importantNotice}}</a-button>
              <a-button :disabled='courseObj.newForm.id==""' type="primary"
                @click="attachmentSelect">{{$l.addAttachment}}</a-button>
              <a-button :disabled='courseObj.newForm.id==""' type="primary" danger
                @click="removeMultipleAttachment">{{$l.batchRemove}}</a-button>
            </div>
            <a-table ref="attachmentsListTable" :dataSource="manageObj.attachmentsList" row-key='id'
              style="width: 100%" 
              :row-selection="{ selectedRowKeys: attachmentSelectedRowKeys, onChange: attachmentSelectionChange }"
              :scroll="{ y: cssObj.tableMaxHeight - 130 }">
              <a-table-column :title="$l.simplifiedChineseName" dataIndex="name_zh"></a-table-column>
              <a-table-column :title="$l.fileType" dataIndex="file_type" :width="120" :ellipsis="true"></a-table-column>
              <a-table-column :title="$l.fileSize" dataIndex="file_size" :width="100" :ellipsis="true">
                <template #default="text">
                  {{formatBytes(text)}}
                </template>
              </a-table-column>
              <!-- <a-table-column title="地址" dataIndex="file_url" ellipsis></a-table-column> -->
              <a-table-column :title="$l.operations" fixed="right">
                <template #default="text, record, index">
                  <div v-show="rightCheck(courseObj.newForm)">
                    <a-button type="link" style="color: green;" @click="previewFile(record.file_url)">{{$l.preview}}</a-button>
                    <a-button type="link" danger @click="removeAttachment(index)">{{$l.remove}}</a-button>
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>

        <div class="buttonBar">
          <a-button v-show="rightCheck(courseObj.newForm)" type="primary"
            @click="handleSubmit">{{$l.submit}}</a-button>
          <a-button type="primary" danger @click="showObj.addOrModifyCourse = false">{{$l.giveup}}</a-button>
        </div>
      </a-drawer>
    </div>

    <!-- 主界面 -->
    <div class="lessonList-filter">
      <a-form layout="inline">
        <a-form-item :label="$l.college">
          <a-select v-model:value="courseObj.query.college_id" @change="getCourseList"
            :placeholder="$l.emptyOnlyCanCheckPublic" allow-clear>
            <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$l.title">
          <a-input v-model:value="courseObj.query.name" allow-clear @clear='getCourseList'
            @keyup.enter="getCourseList"></a-input>
        </a-form-item>
        <a-form-item :label="$l.desc">
          <a-input v-model:value="courseObj.query.description" allow-clear @clear='getCourseList'
            @keyup.enter="getCourseList"></a-input>
        </a-form-item>

        <!-- <a-form-item :label="$l.catalog">
          <a-cascader v-model:value="courseObj.query.catalog_id" :options="catalogObj.data" allow-clear :placeholder="$l.emptyIsRootCatalog"
            style="width: 100%;" :field-names="catalogObj.cascaderProps">
          </a-cascader>
        </a-form-item> -->

        <a-form-item :label="$l.courseType">
          <a-select v-model:value="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
            style="width: 100px;" @change="getCourseList">
            <a-select-option value="">{{$c.all}}</a-select-option>
            <a-select-option :value="1">{{$l.public}}</a-select-option>
            <a-select-option :value="0">{{$l.private}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$l.status">
          <div class="frcc">
            <a-select v-model:value="courseObj.query.is_valid" @change="getCourseList" style="width: 100px;">
              <a-select-option value="">{{$c.all}}</a-select-option>
              <a-select-option value="Y">{{$c.enable}}</a-select-option>
              <a-select-option value="N">{{$c.disable}}</a-select-option>
            </a-select>
            <a-button type="primary" @click="getCourseList" style="margin-left:20px ;">{{$l.search}}</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <div class="lessonList-oprate">
      <a-button type="primary" @click="addCourse">{{$l.addCourse}}</a-button>
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
        <a-table-column :title="$l.cover" dataIndex="thumbnail_path">
          <template #default="text">
            <div class="img" v-if="text">
              <img class="auto-img" @click="coverPreview($api.videoServer+'/'+ text)"
                :src="$api.videoServer+'/'+ text" />
            </div>
            <div v-else style="text-align: center;width: 100%;">
              <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
              <!-- <div>{{$l.noCover}}</div> -->
            </div>
          </template>
        </a-table-column>
        <a-table-column :title="$l.title" dataIndex="name_zh" :width="250" :ellipsis="true"></a-table-column>
        <a-table-column :title="$l.desc" dataIndex="description" :width="250" :ellipsis="true"></a-table-column>
        <a-table-column :title="$l.courseCatalog" dataIndex="type">
          <template #default="text">
            {{returnPublicObjLabel(text,'value','label','courseCatalog')}}
          </template>
        </a-table-column>
        <a-table-column :title="$l.belongCollege" dataIndex="college_id">
          <template #default="text">
            {{returnPublicObjLabel(text,'id','name_label','allCollegeList')}}
          </template>
        </a-table-column>
        <a-table-column :title="$l.score" dataIndex="score" width="100"></a-table-column>
        <a-table-column :title="$l.duration" dataIndex="duration" width="100">
          <template #default="text">
            {{formatDuration(text) }}
          </template>
        </a-table-column>
        <a-table-column :title="$l.lecturer" dataIndex="lecturer" width="100" :ellipsis="true"">
          <template #default="text">
            {{text==1?$l.externalLecturer:$l.internalLecturer}}
          </template>
        </a-table-column>
        <!-- <a-table-column title="版本" dataIndex="version"></a-table-column> -->

        <a-table-column :title="$l.courseType" dataIndex="is_public" width="100" fixed="right">
          <template #default="text">
            {{text==1?$l.public:$l.private}}
          </template>
        </a-table-column>

        <!-- <a-table-column title="$l.status" dataIndex="is_valid"></a-table-column> -->
        <a-table-column :title="$c.operation" width="150" fixed="right">
          <template #default="text, record">
            <a-button v-if="rightCheck(record)==false" type="link" style="color: #67c23a;"
              @click="modifyCourseBinding(record)">{{$l.check}}</a-button>
            <a-button v-else-if="rightCheck(record)==true" type="link" style="color: #409fee;"
              @click="modifyCourseBinding(record)">{{$l.manage}}</a-button>
            <a-button v-if="record.is_valid=='N'&&rightCheck(record)" type="link" style="color: seagreen;"
              @click="modifyCourseStatus(record)">{{$c.enable}}</a-button>
            <a-button v-if="record.is_valid=='Y'&&rightCheck(record)" type="link" style="color: red;"
              @click="modifyCourseStatus(record)">{{$c.disable}}</a-button>
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


<script>
  import Sortable from 'sortablejs'
  import {
    mapGetters
  } from 'vuex'

  import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
  import {
    _
  } from '@/views/_common'
  import FilePreviews from '@/views/_common/FilePreviews.vue'
  export default {
    name: 'videoAdminCourse',
    components: {
      videoPlayer,
      FilePreviews
    },
    data() {
      return {
        // Ant Design table selection support
        selectedRowKeys: [],
        questionSelectedRowKeys: [],
        videoSelectedRowKeys: [],
        examSelectedRowKeys: [],
        attachmentSelectedRowKeys: [],
        
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
