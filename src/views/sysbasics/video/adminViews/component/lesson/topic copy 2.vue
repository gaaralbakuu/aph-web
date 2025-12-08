<template>
  <div class="recommendation-container">
    <div class="components">
      <a-drawer class="drawer-container" :visible="showObj.topicShow" :mask-closable="false" width="50%" @close="showObj.topicShow = false">
        <template #title>
          <div class="title">{{ $l.editTopic }}</div>
        </template>
        <div class="form-container">
          <a-form layout="vertical">
            <a-form-item :label="$l.selectCollege">
              <a-select v-model:value="topicObj.form.college_id" :placeholder="$l.selectCollege" style="width: 100%;">
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">
                  {{ i.name_label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$l.selectType">
              <a-select v-model:value="topicObj.form.type" :placeholder="$l.selectType" style="width: 100%;">
                <a-select-option v-for="i in publicCodeObj.type" :key="i.value" :value="i.value">
                  {{ i.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$l.selectPage">
              <a-select v-model:value="topicObj.form.page" :placeholder="$l.selectPage" style="width: 100%;">
                <a-select-option value="">
                  {{ $l.notShow }}
                </a-select-option>
                <a-select-option v-for="i in publicCodeObj.page" :key="i.value" :value="i.value">
                  {{ i.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$l.titleZh">
              <a-input v-model:value="topicObj.form.title_zh"></a-input>
            </a-form-item>
            <a-form-item :label="$l.titleTw">
              <a-input v-model:value="topicObj.form.title_tw"></a-input>
            </a-form-item>
            <a-form-item :label="$l.titleEn">
              <a-input v-model:value="topicObj.form.title_en"></a-input>
            </a-form-item>
            <a-form-item :label="$l.titleVi">
              <a-input v-model:value="topicObj.form.title_vi"></a-input>
            </a-form-item>
          </a-form>
        </div>
        <div class="buttonBar">
          <a-button type="primary" @click="submitTopic">{{ $l.submit }}</a-button>
          <a-button danger @click="showObj.topicShow = false">{{ $l.cancel }}</a-button>
        </div>
      </a-drawer>

      <a-modal :visible="showObj.courseDialog" @ok="showObj.courseDialog = false" @cancel="showObj.courseDialog = false" width="60%" :title="$l.addCourseDialogTitle" :footer="null">
        <div class="CourseSelect-dialog">
          <a-form layout="inline">
            <a-form-item :label="$l.selectCollege">
              <a-select v-model:value="courseObj.query.college_id" :placeholder="$l.publicCourseTip" allow-clear>
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">
                  {{ i.name_label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$l.keywordSearch">
              <a-input :placeholder="$l.keywordSearch" v-model:value="courseObj.query.name" allow-clear @pressEnter="getCourseList"></a-input>
            </a-form-item>
            <a-form-item :label="$l.courseType">
              <a-select v-model:value="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
                style="width: 100px;" @change="getCourseList">
                <a-select-option value="">
                  {{ $l.all }}
                </a-select-option>
                <a-select-option :value="1">
                  {{ $l.public }}
                </a-select-option>
                <a-select-option :value="0">
                  {{ $l.private }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="getCourseList">{{ $l.search }}</a-button>
              <a-button type="primary" :disabled="courseObj.selectedList.length==0"
                @click="addMultipleCourseToTopic" style="background: #52c41a; border-color: #52c41a; margin-left: 8px;">{{ $l.batchAdd }}</a-button>
            </a-form-item>
          </a-form>
          <a-table ref="toBeAddedTable" class='video-table' :data-source="courseObj.list" :columns="courseColumns" :row-key="record => record.id"
            :row-selection="{ selectedRowKeys: courseObj.selectedList.map(i => i.id), onChange: handleSelectionChange }"
            bordered :scroll="{ y: 500 }" :pagination="false" :customRow="customCourseRow"></a-table>
          <a-pagination @change="handleCoursePageChange" @showSizeChange="handleCourseSizeChange"
            :current="courseObj.query.page" :page-size-options="['5','10', '15', '30', '50','100']"
            :page-size="courseObj.query.pageSize" show-size-changer show-quick-jumper
            :total="courseObj.total" style="float: right; margin-top: 16px;" show-total>
          </a-pagination>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <a-button style="width: 8em;" type="primary" ghost
              @click="showObj.courseDialog = false">{{ $l.close }}</a-button>
          </div>
        </template>
      </a-modal>
    </div>
    <div class="recommendation-filter">
      <a-form layout="inline">
        <a-form-item :label="$l.selectManageCollege">
          <a-select v-model:value="topicObj.query.college_id" :placeholder="$l.selectManageCollege" @change="getTopicList"
            :allow-clear="isAdmin">
            <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">
              {{ i.name_label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$l.displayPage">
          <a-select v-model:value="topicObj.query.web_page" :placeholder="$l.selectPage" @change="getTopicList"
            style="width: 100px;">
            <a-select-option value="">
              {{ $l.all }}
            </a-select-option>
            <a-select-option v-for="i in publicCodeObj.page" :key="i.value" :value="i.value">
              {{ i.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$l.status">
          <a-select v-model:value="topicObj.query.is_valid" style="width: 100px;">
            <a-select-option value="">
              {{ $l.all }}
            </a-select-option>
            <a-select-option value="Y">
              {{ $l.enable }}
            </a-select-option>
            <a-select-option value="N">
              {{ $l.disable }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="getTopicList" style="margin-left:20px; background: #52c41a; border-color: #52c41a;">{{ $l.search }}</a-button>
          <a-button type="primary" @click="addTopic" style="margin-left:20px;">{{ $l.newTopic }}</a-button>
        </a-form-item>
      </a-form>

      <div v-show="detailObj.currentId" style="height: 51px;">
        <a-button v-show="detailObj.list.length!=topicObj.form.detail.length" type="primary" style="margin-left:20px; background: #52c41a; border-color: #52c41a;"
          @click="updateDetailList">{{ $l.updateList }}</a-button>
        <a-button type="primary" @click="showObj.courseDialog = true; getCourseList()"
          style="margin-left:20px;">{{ $l.bindCourse }}</a-button>
      </div>
    </div>

    <div class="recommendation-pageBody">
      <div style="width: 38%;">
        <a-table ref="topicTable" :data-source="topicObj.list" :row-key="record => record.id" :columns="topicColumns"
          bordered :scroll="{ y: 500 }" :pagination="false" :customRow="customTopicRow">
        </a-table>
        <a-pagination @change="handlePageChange" @showSizeChange="handleSizeChange"
          :current="topicObj.query.page" :page-size-options="['5','10', '15', '30', '50','100']" :page-size="topicObj.query.pageSize"
          show-size-changer show-quick-jumper :total="topicObj.total" style="float: right; margin-top: 16px;" show-total>
        </a-pagination>
      </div>
      <div style="width: 60%;">
        <a-table ref="detailTable" :data-source="detailObj.list" :row-key="record => record.course_id" :columns="detailColumns"
          bordered :scroll="{ y: 500 }" :pagination="false">
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { h } from 'vue'
  import {
    mapGetters
  } from 'vuex'

  import {
    _
  } from '@/views/_common'
  export default {
    name: 'videoAdminTopic',
    data() {
      return {
        topicObj: {
          query: {
            web_page: "",
            college_id: "",
            type: "",
            page: 1,
            pageSize: 15,
            is_valid: "Y"
          },
          form: {
            id: "",
            college_id: "",
            title_zh: "",
            title_en: "",
            title_tw: "",
            title_vi: "",
            page: "",
            sort: "",
            type: "",
            is_valid: "",
            rec_status: "",
            detail: [{
              id: "",
              course_id: "",
              pid: "",
              title_zh: "",
              title_en: "",
              title_tw: "",
              title_vi: "",
              icon_app: "",
              icon_web: "",
              url: "",
              is_valid: "",
              rec_status: "",
            }]
          },
          list: [],
          total: 0,
        },
        detailObj: {
          currentId: "",
          list: []
        },
        courseObj: {
          query: {
            page: 1,
            pageSize: 10,
            college_id: "",
            is_public: "",
            name: "",
            is_his: 0
          },
          total: 0,
          list: [],
          selectedList: [] //待添加的课程列表
        },
        publicCodeObj: {
          allCollegeList:[],
          collegeList: [],
          type: [{
            label: this.$l.topic,
            value: "topic"
          }],
          page: [{
            label: this.$l.homePage,
            value: "home"
          }]
        },
        showObj: {
          topicShow: false,
          courseDialog: false
        }
      }
    },
    computed: {
      ...mapGetters(['isAdmin']),
      
      topicColumns() {
        return [
          {
            title: this.$c.ordinal,
            key: 'index',
            width: 50,
            customRender: ({ index }) => (this.topicObj.query.page - 1) * this.topicObj.query.pageSize + index + 1
          },
          {
            title: this.$l.topicName,
            dataIndex: 'title_label',
            key: 'title_label'
          },
          {
            title: this.$l.lastModifier,
            dataIndex: 'modify_user',
            key: 'modify_user'
          },
          {
            title: this.$l.displayPage,
            dataIndex: 'page',
            key: 'page'
          },
          {
            title: this.$l.isEnabled,
            dataIndex: 'is_valid',
            key: 'is_valid',
            width: 80
          },
          {
            title: this.$l.action,
            key: 'action',
            width: 120,
            fixed: 'right',
            customRender: ({ record }) => h('div', {}, [
              h('a', { 
                class: 'ant-btn-link', 
                style: 'margin-right: 8px;', 
                onClick: () => this.editTopic(record) 
              }, this.$l.edit),
              record.is_valid === 'Y' ? h('a', { 
                class: 'ant-btn-link', 
                style: 'color: #ff4d4f;', 
                onClick: () => this.modifyTopicStatus(record) 
              }, this.$l.disableAction) : h('a', { 
                class: 'ant-btn-link', 
                style: 'color: #52c41a;', 
                onClick: () => this.modifyTopicStatus(record) 
              }, this.$l.enableAction)
            ])
          }
        ]
      },
      
      detailColumns() {
        return [
          {
            title: this.$c.ordinal,
            key: 'index',
            width: 50,
            customRender: ({ index }) => index + 1
          },
          {
            title: this.$l.cover,
            key: 'thumbnail_path',
            customRender: ({ record }) => {
              if (record.thumbnail_path) {
                return h('div', { class: 'img' }, [
                  h('img', { class: 'auto-img', src: this.$api.videoServer + '/' + record.thumbnail_path })
                ])
              } else {
                return h('div', { style: 'text-align: center;width: 100%;' }, [
                  h('span', { style: 'font-size: 60px; color: #ccc;' }, '🖼️'),
                  h('div', {}, this.$l.noCover)
                ])
              }
            }
          },
          {
            title: this.$l.courseName,
            dataIndex: 'course_name_label',
            key: 'course_name_label'
          },
          {
            title: this.$l.courseDescription,
            dataIndex: 'description',
            key: 'description'
          },
          {
            title: this.$l.isEnabled,
            dataIndex: 'is_valid',
            key: 'is_valid',
            width: 80
          },
          {
            title: this.$l.action,
            key: 'action',
            width: 120,
            fixed: 'right',
            customRender: ({ record, index }) => h('div', {}, [
              h('a', { 
                class: 'ant-btn-link', 
                style: 'color: #67c23a; margin-right: 8px;', 
                onClick: () => this.toPlay(record.course_primary_id) 
              }, this.$l.preview),
              h('a', { 
                class: 'ant-btn-link', 
                style: 'color: #ff4d4f;', 
                onClick: () => this.deleteDetail(index) 
              }, this.$l.remove)
            ])
          }
        ]
      },
      
      courseColumns() {
        return [
          {
            title: this.$c.ordinal,
            key: 'index',
            width: 50,
            customRender: ({ index }) => (this.courseObj.query.page - 1) * this.courseObj.query.pageSize + index + 1
          },
          {
            title: this.$l.cover,
            key: 'thumbnail_path',
            customRender: ({ record }) => {
              if (record.thumbnail_path) {
                return h('div', { class: 'img' }, [
                  h('img', { class: 'auto-img', src: this.$api.videoServer + '/' + record.thumbnail_path })
                ])
              } else {
                return h('div', { style: 'text-align: center;width: 100%;' }, [
                  h('span', { style: 'font-size: 60px; color: #ccc;' }, '🖼️'),
                  h('div', {}, this.$l.noCover)
                ])
              }
            }
          },
          {
            title: this.$l.name,
            dataIndex: 'name_zh',
            key: 'name_zh'
          },
          {
            title: this.$l.description,
            dataIndex: 'description',
            key: 'description'
          },
          {
            title: this.$l.belongCollege,
            key: 'college_id',
            customRender: ({ record }) => this.returnPublicObjLabel(record.college_id, 'id', 'name_label', 'allCollegeList')
          },
          {
            title: this.$l.action,
            key: 'action',
            width: 120,
            fixed: 'right',
            customRender: ({ record }) => h('div', {}, [
              h('a', { 
                class: 'ant-btn-link', 
                style: 'color: #67c23a; margin-right: 8px;', 
                onClick: () => this.toPlay(record.id) 
              }, this.$l.preview),
              h('a', { 
                class: 'ant-btn-link', 
                onClick: () => this.addSingleCourseToTopic(record) 
              }, this.$l.select)
            ])
          }
        ]
      }
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
      }
    },


    methods: {
      customTopicRow(record) {
        return {
          onClick: () => {
            this.getDetailList(record)
          }
        }
      },
      
      customCourseRow(record) {
        return {
          onClick: () => {
            const isSelected = this.courseObj.selectedList.some(item => item.id === record.id)
            let newSelectedList
            if (isSelected) {
              newSelectedList = this.courseObj.selectedList.filter(item => item.id !== record.id)
            } else {
              newSelectedList = [...this.courseObj.selectedList, record]
            }
            this.courseObj.selectedList = newSelectedList
          }
        }
      },
      
      handleSizeChange(i) {
        this.topicObj.query.page = 1
        this.topicObj.query.pageSize = i
        this.getTopicList()
      },

      handlePageChange(i) {
        this.topicObj.query.page = i
        this.getTopicList()
      },

      handleCourseSizeChange(i) {
        this.courseObj.query.page = 1
        this.courseObj.query.pageSize = i
        this.getCourseList()
      },

      handleCoursePageChange(i) {
        this.courseObj.query.page = i
        this.getCourseList()
      },

      getAllCollegeList(){
        this.$request(this.$api.videoServer + '/Video/VideoCollege/getCollegeList', {
            page:1,
            pageSize:9999
          })
          .then((r) => {
            this.publicCodeObj.allCollegeList = r.data.list
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      getCourseList() {
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', this.courseObj.query, 'post')
          .then(r => {
            this.courseObj.list = r.data.list
            this.courseObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },

      getCollegeList() {
        // 根据页面路由获取管理学院
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data

            this.topicObj.query.college_id = this.publicCodeObj.collegeList[0].id
            this.courseObj.query.college_id = this.publicCodeObj.collegeList[0].id

            this.getTopicList()
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      getTopicList() {
        this.$request(this.$api.videoServer + "/Video/VideoPageTag/getlist", this.topicObj.query)
          .then(r => {
            this.topicObj.list = r.data.list
            this.topicObj.total = r.data.total
            if (r.data.total == 0) {
              this.detailObj = {
                currentId: '',
                list: []
              }
            }
          })
      },

      addTopic() {
        this.topicObj.form = {
          id: "",
          college_id: "",
          title_zh: "",
          title_en: "",
          title_tw: "",
          title_vi: "",
          page: "",
          sort: "10",
          type: "topic",
          is_valid: "Y",
          rec_status: 1,
          detail: []
        }
        console.log("addTopic", this.topicObj.form)
        this.showObj.topicShow = true
      },

      editTopic(i) {
        
        console.log("editTopic", i)
        this.topicObj.form = i
        this.showObj.topicShow = true
      },

      modifyTopicStatus(row) {
        let is_valid
        let oprateText
        if (row.is_valid == 'Y') {
          is_valid = "N"
          oprateText = this.$l.confirmDisable
        } else {
          is_valid = "Y"
          oprateText = this.$l.confirmEnable
        }
        this.$confirm(oprateText, this.$l.recommendationTopic, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(
                this.$api.videoServer + '/Video/VideoPageTag/DeleteOrRecoveryById', {
                  key: row.id,
                  value: is_valid
                }, 'post'
              )
              .then((r) => {
                this.$message.success(this.$l.modifySuccess)
                this.getTopicList()
              })
              .catch(() => {
                this.$message.error(this.$l.modifyFailed)
              })
          })
          .catch(() => {
            this.$message.info(this.$l.cancelModify)
          })
      },

      submitTopic() {
        if (!this.topicObj.form.title_zh) {
          return this.$message.error(this.$l.pleaseEnterNameZh)
        }

        if (!this.topicObj.form.college_id) {
          return this.$message.error(this.$l.pleaseSelectCollege)
        }

        console.log(this.topicObj.form)

        this.$request(this.$api.videoServer + "/Video/VideoPageTag/addOrModifyPageTag", this.topicObj.form, 'post')
          .then(r => {
            this.showObj.topicShow = false
            this.getTopicList()
            this.$message({
              type: 'success',
              message: this.$l.submitSuccess
            })
          })
      },

      isCourseIdExists(array, course_id) {
        return array.some(item => item.course_id === course_id);
      },

      addSingleCourseToTopic(i) {
        console.log(this.topicObj.form)
        if (this.isCourseIdExists(this.topicObj.form.detail, i.course_id)) {
          return this.$message({
            type: 'error',
            message: this.$l.courseAlreadyExists
          })
        }
        let course = {
          id: "",
          course_id: i.course_id,
          pid: this.topicObj.form.id,
          title_zh: i.title_zh,
          title_en: i.title_en,
          title_tw: i.title_tw,
          title_vi: i.title_vi,
          icon_app: "",
          icon_web: "",
          url: "",
          is_valid: "Y",
          rec_status: 1,
        }
        this.topicObj.form.detail.push(course)
        this.detailObj.list.push(i)
        this.submitTopic()
      },

      handleSelectionChange(selectedRowKeys, selectedRows) {
        this.courseObj.selectedList = selectedRows
      },

      addMultipleCourseToTopic() {
        if (this.courseObj.selectedList.length > 0) {
          this.courseObj.selectedList.forEach(i => {
            if (!this.isCourseIdExists(this.topicObj.form.detail, i.course_id)) {
              this.topicObj.form.detail.push({
                id: "",
                course_id: i.course_id,
                pid: this.topicObj.form.id,
                title_zh: i.title_zh,
                title_en: i.title_en,
                title_tw: i.title_tw,
                title_vi: i.title_vi,
                icon_app: "",
                icon_web: "",
                url: "",
                is_valid: "Y",
                rec_status: 1,
              })
              this.detailObj.list.push(i)
            }
          })
          this.submitTopic()
        } else {
          this.$message({
            type: 'error',
            message: this.$l.pleaseSelectList
          })
        }
      },

      getDetailList(i) {
        console.log("getDetailList", i)
        this.topicObj.form = {...i, sort: Number(i.sort) }
        this.detailObj.currentId = i.id
        this.detailObj.list = _.cloneDeep(i.detail)
        this.courseObj.selectedList = []
      },

      updateDetailList() {
        let detail = []
        this.detailObj.list.forEach(i => {
          detail.push({
            id: "",
            course_id: i.course_id,
            pid: this.topicObj.form.id,
            title_zh: i.title_zh,
            title_en: i.title_en,
            title_tw: i.title_tw,
            title_vi: i.title_vi,
            icon_app: "",
            icon_web: "",
            url: "",
            is_valid: "Y",
            rec_status: 1,
          })
        })
        this.topicObj.form.detail = _.cloneDeep(detail)
        this.submitTopic()
      },

      deleteDetail(index) {
        this.detailObj.list.splice(index, 1)
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

      toPlay(id) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: id,
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      }
    },

    mounted() {
      this.getAllCollegeList()
      this.getCollegeList()
    }
  };
</script>

<style>
.img {
  width: 80%;
  height: 60px;
}
.img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.recommendation-container {
  width: 100%;
  height: 100%;
}
.recommendation-container .components .drawer-container {
  width: 100%;
  height: 100%;
}
.recommendation-container .components .drawer-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.recommendation-container .components .drawer-container .form-container {
  width: 95%;
  height: 95%;
  margin: 0 auto;
  background-color: #fff;
}
.recommendation-container .components .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
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
.recommendation-container .recommendation-filter {
  width: 100%;
  height: 60px;
  background-color: white;
  padding: 15px 10px 0px 10px;
  border-bottom: 1px #eee solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recommendation-container .recommendation-pageBody {
  width: 100%;
  height: calc(100% - 60px);
  background-color: white;
  display: flex;
  justify-content: space-between;
}
</style>
