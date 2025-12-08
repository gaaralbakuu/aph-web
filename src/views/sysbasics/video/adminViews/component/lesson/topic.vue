<template>
  <div class="recommendation-container">
    <div class="components">
      <el-drawer class="drawer-container" :visible.sync="showObj.topicShow" :wrapperClosable='false' size="50%">
        <div slot='title' class="title">{{ $l.editTopic }}</div>
        <div class="form-container">
          <el-form label-width="80px" size="medium">
            <el-form-item :label="$l.selectCollege">
              <el-select v-model="topicObj.form.college_id" :placeholder="$l.selectCollege" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.selectType">
              <el-select v-model="topicObj.form.type" :placeholder="$l.selectType" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.type" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.selectPage">
              <el-select v-model="topicObj.form.page" :placeholder="$l.selectPage" style="width: 100%;">
                <el-option :label="$l.notShow" value=""></el-option>
                <el-option v-for="i in publicCodeObj.page" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.titleZh">
              <el-input v-model="topicObj.form.title_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.titleTw">
              <el-input v-model="topicObj.form.title_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.titleEn">
              <el-input v-model="topicObj.form.title_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.titleVi">
              <el-input v-model="topicObj.form.title_vi"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitTopic">{{ $l.submit }}</el-button>
          <el-button type="danger" @click="showObj.topicShow = false">{{ $l.cancel }}</el-button>
        </div>
      </el-drawer>

      <el-dialog :visible.sync="showObj.courseDialog" @open='getCourseList' width="60%"
        :title="$l.addCourseDialogTitle">
        <div class="CourseSelect-dialog">
          <el-form inline>
            <el-form-item :label="$l.selectCollege">
              <el-select v-model="courseObj.query.college_id" :placeholder="$l.publicCourseTip" clearable>
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.keywordSearch">
              <el-input :placeholder="$l.keywordSearch" v-model="courseObj.query.name" clearable @clear='getCourseList'
                @keyup.native.enter="getCourseList"></el-input>
            </el-form-item>
            <el-form-item :label="$l.courseType">
              <el-select v-model="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
                style="width: 100px;" @change="getCourseList">
                <el-option :label="$l.all" value=""></el-option>
                <el-option :label="$l.public" :value="1"></el-option>
                <el-option :label="$l.private" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCourseList">{{ $l.search }}</el-button>
              <el-button type="success" :disabled="courseObj.selectedList.length==0"
                @click="addMultipleCourseToTopic">{{ $l.batchAdd }}</el-button>
            </el-form-item>
          </el-form>
          <a-table ref="toBeAddedTable" class='video-table' :dataSource="courseObj.list" rowKey="id" bordered :scroll="{ y: 500 }" :rowSelection="{ onChange: handleSelectionChange }">
            <a-table-column :title="$c.ordinal" width="50">
              <template slot-scope="text, record, index">{{ index + 1 }}</template>
            </a-table-column>
            <a-table-column :title="$l.cover">
              <template slot-scope="text, record">
                <div class="img" v-if="record.thumbnail_path">
                  <img class="auto-img" :src="$api.videoServer+'/'+ record.thumbnail_path" />
                </div>
                <div v-else style="text-align: center;width: 100%;">
                  <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                  <div>{{ $l.noCover }}</div>
                </div>
              </template>
            </a-table-column>
            <a-table-column :title="$l.name" dataIndex="name_zh"></a-table-column>
            <a-table-column :title="$l.description" dataIndex="description"></a-table-column>
            <a-table-column :title="$l.belongCollege">
              <template slot-scope="text, record">
                {{returnPublicObjLabel(record.college_id,'id','name_label','allCollegeList')}}
              </template>
            </a-table-column>
            <a-table-column :title="$l.action" width="120" fixed="right">
              <template slot-scope="text, record">
                <a-button type="link" style="color: green;" @click="toPlay(record.id)">{{ $l.preview }}</a-button>
                <a-button type="link" @click="addSingleCourseToTopic(record)">{{ $l.select }}</a-button>
              </template>
            </a-table-column>
          </a-table>
          <el-pagination @size-change="handleCourseSizeChange" @current-change="handleCoursePageChange"
            :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="courseObj.total" style="float: right;">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button style="width: 8em;" type="primary" plain
            @click="showObj.courseDialog = false">{{ $l.close }}</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="recommendation-filter">
      <el-form inline>
        <el-form-item :label="$l.selectManageCollege">
          <el-select v-model="topicObj.query.college_id" :placeholder="$l.selectManageCollege" @change="getTopicList"
            :clearable="isAdmin">
            <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
              :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$l.displayPage">
          <el-select v-model="topicObj.query.web_page" :placeholder="$l.selectPage" @change="getTopicList"
            style="width: 100px;">
            <el-option :label="$l.all" value=""></el-option>
            <el-option v-for="i in publicCodeObj.page" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$l.status">
          <el-select v-model="topicObj.query.is_valid" style="width: 100px;">
            <el-option :label="$l.all" value=""></el-option>
            <el-option :label="$l.enable" value="Y"></el-option>
            <el-option :label="$l.disable" value="N"></el-option>
          </el-select>
          <el-button type="success" @click="getTopicList" style="margin-left:20px ;">{{ $l.search }}</el-button>
          <el-button type="primary" @click="addTopic" style="margin-left:20px ;">{{ $l.newTopic }}</el-button>
        </el-form-item>
      </el-form>

      <div v-show="detailObj.currentId" style="height: 51px;">
        <el-button v-show="detailObj.list.length!=topicObj.form.detail.length" type="success" style="margin-left:20px ;"
          @click="updateDetailList">{{ $l.updateList }}</el-button>
        <el-button type="primary" @click="showObj.courseDialog = true"
          style="margin-left:20px ;">{{ $l.bindCourse }}</el-button>
      </div>
    </div>

    <div class="recommendation-pageBody">
      <div style="width: 38%;">
        <a-table ref="topicTable" :dataSource="topicObj.list" rowKey="id" bordered @rowClick="getDetailList">
          <a-table-column :title="$c.ordinal" width="50">
            <template slot-scope="text, record, index">{{ index + 1 }}</template>
          </a-table-column>
          <a-table-column :title="$l.topicName" dataIndex="title_label"></a-table-column>
          <a-table-column :title="$l.lastModifier" dataIndex="modify_user"></a-table-column>
          <a-table-column :title="$l.displayPage" dataIndex="page"></a-table-column>
          <a-table-column :title="$l.isEnabled" dataIndex="is_valid" width="80"></a-table-column>
          <a-table-column :title="$l.action" width="120" fixed="right">
            <template slot-scope="text, record">
              <a-button type="link" @click="editTopic(record)">{{ $l.edit }}</a-button>
              <a-button v-if="record.is_valid=='Y'" type="link" style="color: red;" @click="modifyTopicStatus(record)">{{ $l.disableAction }}</a-button>
              <a-button v-if="record.is_valid=='N'" type="link" style="color: green;" @click="modifyTopicStatus(record)">{{ $l.enableAction }}</a-button>
            </template>
          </a-table-column>
        </a-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="topicObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="topicObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="topicObj.total" style="float: right;">
        </el-pagination>
      </div>
      <div style="width: 60%;">
        <a-table ref="topicTable" :dataSource="detailObj.list" rowKey="course_id" bordered>
          <a-table-column :title="$c.ordinal" width="50">
            <template slot-scope="text, record, index">{{ index + 1 }}</template>
          </a-table-column>
          <a-table-column :title="$l.cover">
            <template slot-scope="text, record">
              <div class="img" v-if="record.thumbnail_path">
                <img class="auto-img" :src="$api.videoServer+'/'+ record.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{ $l.noCover }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column :title="$l.courseName" dataIndex="course_name_label"></a-table-column>
          <a-table-column :title="$l.courseDescription" dataIndex="description"></a-table-column>
          <a-table-column :title="$l.isEnabled" dataIndex="is_valid" width="80"></a-table-column>
          <a-table-column :title="$l.action" width="120" fixed="right">
            <template slot-scope="text, record, index">
              <a-button type="link" style="color: green;" @click="toPlay(record.course_primary_id)">{{ $l.preview }}</a-button>
              <a-button type="link" style="color: red;" @click="deleteDetail(index)">{{ $l.remove }}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
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
