<template>
  <div ref="lesssonCatalogue-container" class="lesssonCatalogue-container">

    <el-dialog :visible.sync="showObj.selectCourse" @open='getCourseList' width="90%" top='7vh'
      :title="$l.addCourseToCatalogue">
      <div class="CourseSelect-dialog">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form inline>
              <el-form-item :label="$l.college">
                <el-select v-model="courseObj.query.college_id" @change="getCourseList"
                  :placeholder="$l.emptyIsPublicCourse" clearable>
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$l.title">
                <el-input :placeholder="$l.keyword" v-model="courseObj.query.name" clearable @clear='getCourseList'
                  @keyup.native.enter="getCourseList"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getCourseList">{{$l.search}}</el-button>
                <el-button type="success" @click="multipleAdd">{{$l.multipleAdd}}</el-button>
              </el-form-item>
            </el-form>

            <el-table ref="toBeAddedTable" class='video-table' :data="courseObj.courseList" tooltip-effect="dark"
              row-key="id" highlight-current-row highlight-selection-row stripe border max-height="500px"
              @selection-change="handleSelectionChangeToBeAdded">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" width="50" label='No'>
              </el-table-column>
              <el-table-column prop="thumbnail_path" :label="$l.cover">
                <template slot-scope="scope">
                  <div class="img" v-if="scope.row.thumbnail_path">
                    <img class="auto-img" :src="api.baseUrl+'/'+ scope.row.thumbnail_path" />
                  </div>
                  <div v-else style="text-align: center;width: 100%;">
                    <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                    <div>{{$l.noCover}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name_zh" :label="$l.title">
              </el-table-column>
              <el-table-column prop="description" :label="$l.desc">
              </el-table-column>
              <el-table-column :label="$c.operation" width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="addCourse(scope.row)">{{$l.select}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-form inline>
              <el-form-item :label="$l.toBeAddedList">
                <el-button type="danger" @click="multipleRemove">{{$l.multipleRemove}}</el-button>
              </el-form-item>
            </el-form>

            <el-table ref="toBeRemovedTable" :data="courseObj.form" tooltip-effect="dark"
              style="width: 95%;margin: 0 auto;" highlight-current-row highlight-selection-row stripe border
              @selection-change="handleSelectionChangeToBeRemoved">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" width="50" label='No'>
              </el-table-column>
              <el-table-column :label="$l.cover" prop="thumbnail_path">
                <template slot-scope="scope">
                  <div class="img" v-if="scope.row.thumbnail_path">
                    <img class="auto-img" :src="api.baseUrl+'/'+ scope.row.thumbnail_path" />
                  </div>
                  <div v-else style="text-align: center;width: 100%;">
                    <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                    <div>{{$l.noCover}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$l.title" prop="name_zh"></el-table-column>
              <el-table-column :label="$l.desc" prop="description" show-overflow-tooltip></el-table-column>
              <el-table-column :label="$l.score" prop="score"></el-table-column>
              <el-table-column :label="$c.operation" width="80">
                <template slot-scope="scope">
                  <el-button type='text' @click="removeCourse(scope.$index)">{{$l.remove}}111</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>


        <!-- <el-pagination @size-change="handleVideoSizeChange" @current-change="handleVideoPageChange"
          :current-page="videoListObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="videoListObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="videoListObj.total" style="float: right;">
        </el-pagination> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindCourseToCatalog">{{$l.submit}}</el-button>
        <el-button type="primary" plain @click="cancelBindCourse">{{$l.giveup}}</el-button>
      </div>
    </el-dialog>

    <el-drawer class="drawer-container" :visible.sync="showObj.course_show" :wrapperClosable='false' size="85%"
      direction='btt'>
      <div slot='title' class="title">
        <div>{{$l.courseManage}}</div>
        <div class="title-btn">
          <el-button type="primary" size="small" @click="beforeOpenCourseDialog">{{$l.addCourse}}</el-button>
        </div>
      </div>
      <div class="form-container">
        <el-table ref="multipleTable" :data="courseObj.list" tooltip-effect="dark" row-key="id"
          style="width: 95%;margin: 0 auto;" highlight-current-row highlight-selection-row stripe border>
          <el-table-column type="index" width="50" label='No'>
          </el-table-column>
          <el-table-column :label="$l.cover" prop="thumbnail_path">
            <template slot-scope="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" :src="api.baseUrl+'/'+ scope.row.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{$l.noCover}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$l.title" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.desc" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$l.score" prop="score"></el-table-column>
          <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
          <el-table-column :label="$c.operation">
            <template slot-scope="scope">
              <el-button type='text' @click="toggleCourseStatus(scope.row)">{{$l.remove}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="buttonBar">
          <el-button type="primary" plain @click="showObj.course_show= false">{{$c.close}}</el-button>
        </div>
      </div>

    </el-drawer>

    <el-drawer class="drawer-container" :visible.sync="showObj.catalog_show" :wrapperClosable='true' size="40%"
      :before-close="getCatalogList">
      <div slot='title' class="title">{{$l.addOrEditCatalogue}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.name_zh" required>
              <el-input v-model="catalogObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.name_tw">
              <el-input v-model="catalogObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.name_en">
              <el-input v-model="catalogObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.name_vi">
              <el-input v-model="catalogObj.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="$l.belongCollege" required>
              <el-select v-model="catalogObj.form.college_id" style="width: 100%;" @change="collegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.parentCatalogue" v-show="catalogObj.form.college_id">
              <el-cascader v-model="catalogObj.form.pid" :options="catalogObj.list" clearable
                :placeholder="$l.emptyIsRootCatalogue" style="width: 100%;" :props="catalogObj.cascaderProps">
              </el-cascader>
            </el-form-item>
          </el-form>

        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitCatalog">{{$l.submit}}</el-button>
          <el-button type="danger" @click="showObj.catalog_show = false">{{$l.giveup}}</el-button>
        </div>
      </div>
    </el-drawer>

    <div style="display: flex;justify-content: space-around;height: 100%;">
      <div style="width: 30%;height: 100%;">
        <div class="org_filter" style="display: flex;height: 60px;padding: 14px 0px;">
          <el-input :placeholder="$l.keyword" v-model="filterOrgText"></el-input>
          <el-button type="success" @click="getCollegeList" style="margin-left: 10px;">{{$l.refresh}}</el-button>
        </div>
        <el-tree class="org-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true"
          :data="publicCodeObj.collegeList" :filter-node-method="filterOrg">
          <div class="org-tree-node" slot-scope="{ node, data }" @click="clickCollege(data.id)">
            <span> {{ data.name_label }}</span>
          </div>
        </el-tree>
      </div>
      <div class="catalogBox">
        <div class="catalog_filter">
          <el-select v-model="catalogObj.query.is_valid" @change="getCatalogList">
            <el-option :label="$c.all" value=""></el-option>
            <el-option :label="$c.enable" value="Y"></el-option>
            <el-option :label="$c.disable" value="N"></el-option>
          </el-select>
          <el-input :placeholder="$l.keyword" v-model="filterCatalogText"></el-input>

          <el-button type="success" @click="getCatalogList" style="margin-left: 10px;">{{$l.refresh}}</el-button>
          <el-button type="primary" @click="addCatalog" style="margin-left: 10px;">{{$l.addCatalog}}</el-button>
        </div>
        <div class="catalog-tree">
          <el-tree ref="catalogTree" node-key="id" :accordion="true" :default-expand-all="true" :data="catalogObj.data"
            :filter-node-method="filterCatalog"
            :empty-text='catalogObj.query.college_id?$l.emptyCatalogue:$l.plsSelectCollegeToManage'>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name_label }}</span>
              <span class="opera-button">
                <el-button class="text-green" type="text"
                  @click.prevent.stop="addCatalog(data)">{{$l.addChildCatalog}}</el-button>
                <el-button type="text" @click.prevent.stop="editCatalog(data)">{{$c.edit}}</el-button>
                <el-button class="text-green" type="text" v-show="data.is_valid=='N'"
                  @click.prevent.stop="modifyCatalogStatus(data)">{{$c.enable}}</el-button>
                <el-button class="text-red" type="text" v-show="data.is_valid=='Y'"
                  @click.prevent.stop="modifyCatalogStatus(data)">{{$c.disable}}</el-button>
                <el-button class="text-yellow" type="text" @click="getCourseListById(data.id)">{{$l.manage}}</el-button>
              </span>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    api
  } from '@/views/_common';

  export default {
    name: 'videoAdminCatalogue',
    data() {
      return {
        api: api,
        multipleSelectionObj: {
          toBeAdded: [],
          toBeRemoved: []
        },
        showObj: {
          org_show: false,
          catalog_show: false,
          course_show: false,
          selectCourse: false
        },
        filterOrgText: '',
        filterCatalogText: '',

        publicCodeObj: {
          collegeList: []
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
          list: [],
          query: {
            college_id: "",
            is_valid: ''
          },
          form: {
            id: "",
            pid: "",
            college_id: "",
            name_zh: "",
            name_en: "",
            name_tw: "",
            sort: 0
          },

        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        courseObj: {
          currentIndex: '',
          catalog_id: '',
          query: {
            page: 1,
            pageSize: 10,
            college_id: "",
            is_public: "",
            // catalog_id: "",
            name: "",
            is_his: 0
          },
          form: [],
          total: 0,
          list: [],
          courseList: []
        }
      };
    },
    watch: {
      filterOrgText(val) {
        this.$refs.orgTree.filter(val);
      },

      filterCatalogText(val) {
        this.$refs.catalogTree.filter(val);
      }
    },

    methods: {
      collegeChange(v) {
        this.catalogObj.form.pid = ''
        this.getCatalogListById(v)
      },

      clickCollege(id) {
        this.catalogObj.query.college_id = id
        this.getCatalogList()
      },

      handleSelectionChangeToBeAdded(val) {
        this.multipleSelectionObj.toBeAdded = val
      },

      handleSelectionChangeToBeRemoved(val) {
        this.multipleSelectionObj.toBeRemoved = val
      },

      multipleAdd() {
        let allVideoArray = this.courseObj.list.concat(this.courseObj.form)
        let videoIdSet = new Set(allVideoArray.map(i => i.id))
        this.multipleSelectionObj.toBeAdded.forEach(i => {
          if (!videoIdSet.has(i.id)) {
            this.courseObj.form.push(i)
          }
        })
        this.$refs.toBeAddedTable.clearSelection();
        this.$message({
          type: 'success',
          message: this.$l.addToListSuccess
        })
      },

      multipleRemove() {
        let idsToDelete = this.multipleSelectionObj.toBeRemoved.map(item => item.id); // 假设每行有一个唯一的id属性
        this.courseObj.form = this.courseObj.form.filter(item => !idsToDelete.includes(item.id));
        // 如果有需要，还可以重置选中状态
        this.$refs.toBeRemovedTable.clearSelection();
      },


      filterOrg(value, data) {
        if (!value) return true;
        return data.name_label.indexOf(value) !== -1;
      },

      filterCatalog(value, data) {
        if (!value) return true;
        return data.name_label.indexOf(value) !== -1;
      },



      getCollegeList() {
        // 根据页面路由获取管理学院
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
            resource_path: this.$route.path
          })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },

      getCatalogList() {
        if (this.catalogObj.query.college_id) {
          this.$request(this.api.baseUrl + '/Video/VideoCourseCatalog/getCatalogList', this.catalogObj.query)
            .then(r => {
              this.catalogObj.data = r.data
              this.showObj.catalog_show = false
            })
        } else {
          this.showObj.catalog_show = false
        }
      },

      getCatalogListById(id) {
        this.$request(this.api.baseUrl + '/Video/VideoCourseCatalog/getCatalogList', {
            college_id: id,
            is_valid: this.catalogObj.query.is_valid
          })
          .then(r => {
            this.catalogObj.list = r.data
          })
      },

      async addCatalog(data) {
        if (this.catalogObj.list.length == 0) {
          await this.getCatalogListById(data.college_id)
        }
        this.catalogObj.form = Object.assign(this.catalogObj.form, {
          id: "",
          pid: data ? data.id : "",
          college_id: data ? data.college_id : "",
          name_zh: "",
          name_en: "",
          name_tw: "",
        })
        this.showObj.catalog_show = true
        this.$forceUpdate()
      },

      editCatalog(data) {
        this.catalogObj.form = Object.assign(this.catalogObj.form, data)
        this.showObj.catalog_show = true
      },

      modifyCatalogStatus(i) {
        let msg
        let status
        if (i.is_valid == 'Y') {
          msg = this.$l.disable + '《' + i.name_label + '》？' + this.confirmTips
          status = 'N'
        } else {
          msg = this.$l.enable + '《' + i.name_label + '》？' + this.confirmTips
          status = 'Y'
        }
        this.$prompt(msg, {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: this.$l.inputErrorMessage,
            confirmButtonText: this.$l.confirmText,
            cancelButtonText: this.$l.cancelText
          }).then(() => {
            this.$request(this.api.baseUrl + '/Video/VideoCourseCatalog/changeCatalogIsValid', {
              key: i.id,
              value: status,
              remark: ''

            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message: this.$l.oprateSuccess
              })
              this.getCatalogList()
            })
          })
          .catch(() => {
            console.log('取消操作');
          })
      },

      submitCatalog() {
        if (!this.catalogObj.form.college_id) {
          return this.$message.error(this.$l.plsSelectBelongCollege)
        }

        if (!this.catalogObj.form.name_zh) {
          return this.$message.error(this.$l.plsInputName_zh)
        }

        this.$request(this.api.baseUrl + '/Video/VideoCourseCatalog/addOrModifyCatalog', this.catalogObj.form, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.oprateSuccess
              })
              let timer = setTimeout(() => {
                this.showObj.catalog_show = false
                this.getCatalogList()
                clearTimeout(timer)
              }, 1500)
            }
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
            this.courseObj.courseList = r.data.list
            this.courseObj.total = r.data.total
            // this.showObj.course_show = true
          })
      },

      getCourseListById(id) {
        if (id) {
          this.courseObj.catalog_id = id
        }
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
            page: 1,
            pageSize: 10,
            catalog_id: id,
            is_his: 0
          }, 'post')
          .then(r => {
            this.courseObj.list = r.data.list
            // this.courseObj.total = r.data.total
            this.showObj.course_show = true
          })
      },

      addCourse(data) {
        if (this.courseObj.list.some(i => i.id === data.id)) {
          this.$message.error(this.$l.alreadyExistedInCatalogue)
        } else {
          if (this.courseObj.form.some(i => i.id === data.id)) {
            this.$message.error(this.$l.alreadyExistedInToBeAddedList)
          } else {
            this.courseObj.form.push(data)
          }
        }
      },

      removeCourse(i) {
        this.courseObj.form.splice(i, 1)
      },

      beforeOpenCourseDialog() {
        this.courseObj.form = []
        this.showObj.selectCourse = true
      },

      bindCourseToCatalog() {
        let postData = []
        this.courseObj.form.forEach(i => {
          postData.push({
            id: "",
            catalog_id: this.courseObj.catalog_id,
            course_id: i.course_id
          })
        })
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/addCourseToCatalog', postData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.oprateSuccess
              })
              let timer = setTimeout(() => {
                this.courseObj.form = []
                this.showObj.selectCourse = false
                this.getCourseListById(this.courseObj.catalog_id)
                clearTimeout(timer)
              }, 1500)
            }
          })
      },

      cancelBindCourse() {
        this.showObj.selectCourse = false
      },

      openSelectCourse(index) {
        this.courseObj.currentIndex = index
        this.showObj.selectCourse = true
      },




      toggleCourseStatus(data) {
        let msg
        let value
        if (data.is_valid == 'Y') {
          value = 'N'
          msg = `您确定要禁用当前目录下《${data.name_zh}》这张课程吗？请输入Y后再次确认操作`
        } else {
          value = 'Y'
          msg = `您确定要启用当前目录下《${data.name_zh}》这张课程吗？请输入Y后再次确认操作`
        }
        this.$prompt(msg, {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: '输入验证信息错误',
            confirmButtonText: "确认",
            cancelButtonText: "取消"
          }).then(() => {

            this.$request(this.api.baseUrl + '/Video/VideoCourseCatalog/deleteCourseFromCatalog', {
              course_id: data.course_id,
              catalog_id: this.courseObj.catalog_id,
              is_valid: value
            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message: this.$l.oprateSuccess
              })
              this.getCourseListById(this.courseObj.catalog_id)
            })
          })
          .catch(() => {
            console.log('取消操作');
          })
      }


    },
    mounted() {
      this.getCollegeList()
      // this.getCatalogList()


    }
  };
</script>

<style lang="scss">
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

  .catalogBox {
    width: 65%;
    height: 100%;
    max-height: 100%;

    .catalog_filter {
      display: flex;
      height: 60px;
      padding: 14px 0px;
    }

    .catalog-tree {
      height: calc(100% - 60px);
      max-height: calc(100% - 60px);
      overflow: scroll;
    }
  }

  .custom-tree-node {
    width: 95%;
    height: 40px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;


  }



  .lesssonCatalogue-container {
    width: 100%;
    height: 100%;

    .drawer-container {

      //视频上传抽屉样式
      .title {
        padding: 0px 20px 10px 20px;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
      }

      .form-container {
        width: 100%;
        height: 95%;
        margin: 0 auto;
        background-color: #fff;

        .form {
          width: 90%;
          margin: 0 auto;
        }

        .buttonBar {
          width: 100%;
          height: 60px;
          margin: 0 auto;
          padding: 0 30px;
          position: absolute;
          bottom: 0px;
          border-top: 1px solid #ccc;
          float: right;
          display: flex;
          justify-content: end;
          align-items: center;
        }
      }
    }

    .org-tree-node {
      width: 85%;
      height: 40px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
