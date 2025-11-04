<template>
  <div class="banner-container">

    <el-dialog :visible.sync="showObj.topic" @open='getTopicList' width="60%" :title="$l.topicDialogTitle">
      <div class="CourseSelect-dialog">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="topicObj.query.college_id" :placeholder="$l.collegePlaceholder" @change="getTopicList"
              :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="topicObj.query.is_valid" style="width: 100px;">
              <el-option :label="$l.all" value=""></el-option>
              <el-option :label="$l.enabled" value="Y"></el-option>
              <el-option :label="$l.disabled" value="N"></el-option>
            </el-select>
            <el-button type="success" @click="getTopicList" style="margin-left:20px ;">{{$l.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="topicTable" :data="topicObj.list" row-key='id' tooltip-effect="dark" highlight-current-row
          highlight-selection-row stripe border>
          <el-table-column type="index" width="50" :label="$l.serialNumber"></el-table-column>
          <el-table-column :label="$l.topicName" prop="title_label"></el-table-column>
          <el-table-column :label="$l.lastModifier" prop="modify_user"></el-table-column>
          <el-table-column :label="$l.lastModifyTime" prop="modify_time"></el-table-column>
          <el-table-column :label="$l.enabled" prop="is_valid" width="80"></el-table-column>
          <el-table-column :label="$l.operation" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="selectTopic(scope.row)">{{$l.edit}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleTopicSizeChange" @current-change="handleTopicPageChange"
          :current-page="topicObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="topicObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="topicObj.total" style="float: right;">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 8em;" type="primary" plain @click="showObj.topic = false">{{$l.close}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showObj.course" @open='getCourseList' width="60%" :title="$l.addToTopic">
      <div class="CourseSelect-dialog">
        <el-form inline>
          <el-form-item :label="$l.college">
            <el-select v-model="courseObj.query.college_id" :placeholder="$l.publicCourse" clearable>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$l.name">
            <el-input :placeholder="$l.keywordSearch" v-model="courseObj.query.name" clearable @clear='getCourseList'
              @keyup.native.enter="getCourseList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.courseType">
            <el-select v-model="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
              style="width: 100px;" @change="getCourseList">
              <el-option :label="$l.all" value=""></el-option>
              <el-option :label="$l.public" :value="1"></el-option>
              <el-option :label="$l.nonPublic" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getCourseList">{{$l.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="toBeAddedTable" class='video-table' :data="courseObj.list" tooltip-effect="dark" row-key="id"
          highlight-current-row highlight-selection-row stripe border max-height="500px">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" width="50" :label="$l.serialNumber">
          </el-table-column>
          <el-table-column prop="thumbnail_path" :label="$l.cover">
            <template slot-scope="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" :src="$api.baseUrl+'/'+ scope.row.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{$l.noCover}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name_zh" :label="$l.name">
          </el-table-column>
          <el-table-column prop="description" :label="$l.description">
          </el-table-column>
          <el-table-column :label="$l.operation" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button class="text-green" type='text' @click="toPlay(scope.row.id)">{{$l.preview}}</el-button>
              <el-button type="text" @click="selectCourse(scope.row)">{{$l.select}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleCourseSizeChange" @current-change="handleCoursePageChange"
          :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="courseObj.total" style="float: right;">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 8em;" type="primary" plain @click="showObj.course = false">{{$l.close}}</el-button>
      </div>
    </el-dialog>

    <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

    <div class="banner-filter">
      <el-form inline>
        <el-form-item :label="$l.name">
          <el-input v-model="query.queryString.str"></el-input>
        </el-form-item>
        <el-form-item :label="$l.status">
          <el-select v-model="query.queryString.status" class="filter-item" clearable @change="getBannerList">
            <el-option :label="$l.enabled" :value="1"></el-option>
            <el-option :label="$l.disabled" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getBannerList">{{$l.search}}</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="addBanner">{{$l.addBanner}}</el-button>
      </div>
    </div>
    <div class="banner-content">
      <el-table :data="bannerList">
        <el-table-column :label="$l.cover">
          <template slot-scope="v">
            <img style="width: 200px;height: 100px;" :src="$api.baseUrl+'/'+v.row.file_url" />
          </template>
        </el-table-column>
        <el-table-column :label="$l.name" prop="name"></el-table-column>
        <el-table-column :label="$l.description" prop="description"></el-table-column>
        <el-table-column :label="$l.jumpLink" prop="link">
          <template slot-scope="v">
            {{v.row.link||$l.noJump}}
          </template>
        </el-table-column>
        <el-table-column :label="$l.status" prop="status">
          <template slot-scope="v">
            {{v.row.status==1?$l.enabled:$l.disabled}}
          </template>
        </el-table-column>
        <el-table-column :label="$l.modify_time" prop="modify_time"></el-table-column>
        <el-table-column :label="$l.modify_user" prop="modify_user"></el-table-column>
        <el-table-column :label="$l.operation" fixed="right">
          <template slot-scope="v">
            <a href="#" class="text-blue" @click.prevent="editItem(v.row)">{{$l.edit}}</a>&nbsp;
            <a href="#" class="text-red" @click.prevent="deleteItem(v.row)">{{$l.delete}}</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="query.page"
        :page-sizes="[5,10, 15, 30, 50,100]" :page-size="query.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="float: right;">
      </el-pagination>
    </div>

    <el-drawer class="drawer-container" :visible.sync="showObj.bannerShow" :wrapperClosable='false' size="40%">
      <div slot='title' class="title">{{$l.bannerManagement}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="60px" size="medium">
            <el-form-item :label="$l.cover" v-if="form.id==''">
              <div v-if="coverObj.imageUrl==''" class="cover">
                <div class="plus-icon" @click="coverSelect('upload')">
                  <i class="el-icon-upload" style="font-size: 30px;"></i>
                  <div>
                    {{$l.select}}
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
            <el-form-item :label="$l.cover" v-else>
              <div class="cover">
                <img class="auto-img" :src="form.file[0]" height="150px" />
              </div>
            </el-form-item>
            <el-form-item :label="$l.name">
              <el-input v-model="form.name" requird></el-input>
            </el-form-item>
            <el-form-item :label="$l.description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item :label="$l.jumpLink">
              <el-select v-model="targetObj.type" style="width: 100%;">
                <el-option :label="$l.noJump" value=""></el-option>
                <el-option :label="$l.topicName" value="topic"></el-option>
                <el-option :label="$l.course" value="course"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.target" v-show="targetObj.type!=''">
              <el-input v-model="targetObj.label" disabled>
                <template slot="append">
                  <el-button @click="openSelectTarget" style="background-color: #67C23A;color: white;">{{$l.select}}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$l.status">
              <el-select v-model="form.status" style="width: 100%;">
                <el-option :label="$l.enabled" :value="1"></el-option>
                <el-option :label="$l.disabled" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.bannerTiming">
              <el-select v-model="form.autopz" style="width: 100%;">
                <el-option :label="$l.yes" value="Y"></el-option>
                <el-option :label="$l.no" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.bannerStartTime" v-show="form.autopz=='Y'">
              <el-date-picker v-model="form.begdate" type="datetime" :placeholder="$l.select"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$l.bannerEndTime" v-show="form.autopz=='Y'">
              <el-date-picker v-model="form.enddate" type="datetime" :placeholder="$l.select"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="buttonBar">
        <el-button type="primary" @click="handleSubmit">{{$l.submit}}</el-button>
        <el-button type="danger" @click="showObj.bannerShow = false">{{$l.close}}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    zTable
  } from '@/views/_common'
  export default {
    name: 'videoAdminBanner',
    components: {
      zTable
    },
    computed: {
      ...mapGetters(['isAdmin']),
    },
    data() {
      return {
        coverObj: {
          dialogImageUrl: "",
          imageUrl: "",
          file: { //选择的视频文件信息
            name: ''
          },
        },
        showObj: {
          bannerShow: false,
          coverDialog: false,
          course: false,
          topic: false,
          calculateMaxheight:500
        },
        targetObj: {
          label: '', //课程或专题名称
          type: '', //跳转类型，topic跳转/videoLayout/topicDetail?topic_id=xxx到；course跳转到/videoLayout/play?course_id=xxx
          target_id: '', //跳转id
        },
        publicCodeObj: {
          collegeList: [],
        },
        topicObj: {
          query: {
            web_page: "",
            college_id: "",
            type: "",
            page: 1,
            pageSize: 15,
            is_valid: "Y"
          },
          list: [],
          total: 0,
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
        query: {
          queryString: {
            str: '',
            status: 1
          },
          type: 'VIDEO',
          size: 15,
          page: 1,
        },
        form: {
          id: '',
          link: '', //跳转地址
          empnopz: "N",
          orgidpz: "N",
          deptnopz: "N",
          otherspz: "N",
          status: "1",
          autopz: "N",
          name: "",
          description: "",
          type: "VIDEO",
          begdate: "",
          enddate: ""
        },
        bannerList: [],
        total: 0,
      }
    },
    methods: {
      openSelectTarget() {
        this.showObj[this.targetObj.type] = true
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

      handleCourseSizeChange(i) {
        this.courseObj.query.page = 1
        this.courseObj.query.pageSize = i
        this.getCourseList()
      },

      handleCoursePageChange(i) {
        this.courseObj.query.page = i
        this.getCourseList()
      },

      toPlay(id) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'play',
          query: {
            course_primary_id: id
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      },

      selectCourse(row) {
        this.targetObj.label = row.name_label
        this.targetObj.target_id = row.id
        this.showObj[this.targetObj.type] = false
      },

      selectTopic(row) {
        this.targetObj.label = row.title_label
        this.targetObj.target_id = row.id
        this.showObj[this.targetObj.type] = false
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

      handleTopicSizeChange(i) {
        this.topicObj.query.page = 1
        this.topicObj.query.pageSize = i
        this.getTopicList()
      },

      handleTopicPageChange(i) {
        this.topicObj.query.page = i
        this.getTopicList()
      },

      handleSizeChange(i) {
        this.query.page = 1
        this.query.size = i
        this.getBannerList()
      },

      handlePageChange(i) {
        this.query.page = i
        this.getBannerList()
      },

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
      },

      getBannerList() {
        this.$request(this.$api.baseUrl + '/Platform/banner/getList', this.query)
          .then(r => {
            this.bannerList = r.data.list
            this.total = r.data.total
          })
      },

      editItem(i) {
        if (i.link) {
          let type = i.link.split('=')[0]
          let id = i.link.split('=')[1]
          if (type.includes('course')) {
            //获取课程信息
            this.$request(this.$api.videoServer + "/Video/VideoCourseCatalog/getCourseList", {
              page: 1,
              pageSize: 15,
              id: id,
              is_his: 0
            }, 'post').then(r => {
              if (r.data.list.length > 0) {
                console.log(r);
                let data = r.data.list[0]
                this.targetObj = {
                  type: 'course',
                  label: data.name_label,
                  target_id: data.id
                }
                this.getBannerInfo(i)
              }
            })
          } else if (type.includes('topic')) {
            //获取专题信息
            this.$request(this.$api.videoServer + '/Video/VideoPageTag/getlist', {
                id: id,
                page: 1,
                pageSize: 10
              })
              .then(r => {
                if (r.status && r.data.total > 0) {
                  let data = r.data.list[0]
                  this.targetObj = {
                    type: 'topic',
                    label: data.title_label,
                    target_id: data.id
                  }
                  this.getBannerInfo(i)
                }
              })
          }
        } else {
          this.targetObj = {
            type: '',
            label: '',
            target_id: ''
          }
          this.getBannerInfo(i)
        }
      },

      getBannerInfo(i) {
        this.$request(this.$api.baseUrl + '/Platform/banner/getbyid', {
            id: i.id
          })
          .then(r => {
            this.form = r.data
            this.showObj.bannerShow = true
          })
          .catch(() => {

          })
      },

      deleteItem(v) {
        this.$confirm(this.$l.deleteConfirm, this.$l.confirm, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(this.$api.baseUrl + '/Platform/banner/delete/' + v.id, {}, "post")
              .then(r => {
                console.log(r);
                this.getBannerList()
              })
              .catch(() => {

              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.deleteCanceled,
            })
          })
      },

      addBanner() {
        this.coverObj = {
            dialogImageUrl: "",
            imageUrl: "",
            file: { //选择的视频文件信息
              name: ''
            },
          },
          this.targetObj = {
            label: "",
            type: '', //跳转类型，topic跳转/videoLayout/topicDetail?topic_id=xxx到；course跳转到/videoLayout/play?course_id=xxx
            target_id: '', //跳转id
          }
        this.form = {
          id: '',
          link: '',
          empnopz: "N",
          orgidpz: "N",
          deptnopz: "N",
          otherspz: "N",
          status: 1,
          autopz: "N",
          name: "",
          description: "",
          type: "VIDEO",
          begdate: "",
          enddate: ""
        }
        this.$refs.coverInput.value = ''
        this.showObj.bannerShow = true
      },

      handleSubmit() {
        if (this.form.name == '') {
          return this.$message.error(this.$l.nameRequired)
        }
        if (this.form.description == '') {
          return this.$message.error(this.$l.descriptionRequired)
        }
        if (this.coverObj.file == '' && this.form.id == '') {
          return this.$message.error(this.$l.coverRequired)
        }
        if (this.form.autopz == 'Y') {
          if (this.form.begdate == '' || this.form.enddate == '') {
            return this.$message.error(this.$l.timeRangeRequired)
          }
        }

        if (this.targetObj.type == 'topic') {
          this.form.link = `topic=${this.targetObj.target_id}`
        } else if (this.targetObj.type == 'course') {
          this.form.link = `course=${this.targetObj.target_id}`
        } else if (this.targetObj.type == '') {
          this.form.link = ''
        }

        let formData = new FormData();
        if (this.form.id) {
          formData.append('file[]', this.form.file)
        } else {
          formData.append('file[]', this.coverObj.file)
        }
        formData.append('model', JSON.stringify(this.form))
        this.$request(this.$api.baseUrl + '/Platform/banner/createormodify', formData, 'post')
          .then((r) => {
            this.$message({
              message: this.$l.success,
              type: 'success',
            })
            this.showObj.bannerShow = false
            this.getBannerList()
          })
          .catch((e) => {
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

          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },
      returnMaxheight() {
        this.showObj.calculateMaxheight = window.innerHeight - 160
      }
    },
    mounted() {
      this.getCollegeList()
      this.getBannerList()

      window.addEventListener('resize', this.returnMaxheight);
      this.$nextTick(()=>{
        this.returnMaxheight()
      })
    },


    beforeDestroy() {
      window.removeEventListener('resize', this.returnMaxheight);
    },
  }
</script>
<style scoped lang="less">
  .img {
    width: 80%;
    height: 60px;

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

  .banner-container {
    width: 100%;
    height: 100%;


    .drawer-container {

      //抽屉样式
      .title {
        padding: 20px 0px;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
      }

      .form-container {
        width: 90%;
        height: 90%;
        margin: 0 auto;
        background-color: #fff;


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
        justify-content: flex-end;
        align-items: center;
      }
    }



    .banner-filter {
      width: 100%;
      height: 60px;
      padding: 14px;
      border-bottom: 1px #ddd solid;
      display: flex;
      justify-content: space-between;
      background-color: white;
    }
  }
</style>
