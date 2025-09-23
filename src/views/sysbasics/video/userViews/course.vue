<template>
  <div class="branch-container">
    <div class="page-body">
      <div class="navigation">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="2">
            <template slot="title">
              <div class="title-label">{{$l.tag}}：</div>
              <div class="title hide-scrollbar">
                <el-tag class="tags" closable v-for="(i,index) in selectedTags" :key="index"
                  @close="handleClose(index,'selectedTags')">{{i.name_label}}</el-tag>
              </div>
              <div @click.stop='log(1)'>
                <el-tooltip
                  :content="$l.tagTips"
                  placement="top">
                  <el-switch @change="getCourseList" style="white-space: nowrap;margin-right: 1em;"
                    v-model="courseObj.query.search_type" active-color="#13ce66" inactive-color="#ddd" :active-value="0"
                    :inactive-value="1" :active-text="$l.strictMode">
                  </el-switch>
                </el-tooltip>
              </div>
            </template>
            <div class="body">
              <el-tag class="tags" v-for="(i,index) in tagObj.list" :key="index" @click="selectTag(i)"
                :effect="selectedTags.includes(i)?'dark':'plain'">{{i.name_label}}</el-tag>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="content">

        <div class="menu">

          <el-tree ref="catalogTree" icon-class='el-icon-d-arrow-right'	 :expand-on-click-node='false' node-key="id" :accordion="true" :default-expand-all="true" :data="classList">
            <div class="custom-menu-node" slot-scope="{ node, data }" @click.prevent="clickMenu(node,data)">
              <span>{{ data.name_label }}
              </span>
            </div>
          </el-tree>
        </div>

        <div class="video-wrapper">

          <div class="filter_sort">
            <div style="padding: 15px 0px;">
              <el-form inline label-position="left">
                <el-form-item :label="$l.courseName">
                  <el-input v-model="courseObj.query.name" clearable @clear='getCourseList'
                    @keyup.native.enter="getCourseList"></el-input>
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="getCourseList">{{$c.m_search}}</el-button></el-form-item>
              </el-form>

            </div>

            <div class="rank">
             <!-- <div class="item" v-for="(i,index) in rankList" :key="index" @click="clickRank(index)">
                <div :style="{color:i.current?'#409fee':'' }">{{i.label}}</div>
                <div class="icon-wrapper">
                  <i class="icon el-icon-caret-top" :style="{color:i.current?(i.asc==true?'#409fee':''):''}"></i>
                  <i class="icon el-icon-caret-bottom" :style="{color:i.current?(i.asc==true?'':'#409fee'):'' }"></i>
                </div>
              </div> -->
            </div>
          </div>
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item class="item" v-for="(i,index) in breadcrumb" :key="i.value">
                <span class="title" @click="clickBread(i.id,index)">{{i.name_label}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="custom-menu-node" style="background-color: white;">
              <el-button type="primary" plain size="mini" v-show="breadcrumb.length>0" @click="resetMenu">{{$l.reset}}</el-button>
            </div>
          </div>

          <div class="video-list">
            <div class="video" v-for="i in courseObj.list" :key="i.id" @click="toPlayPage(i)">
              <el-image v-if="i.thumbnail_path" class="img" :src="$api.videoServer+'/'+i.thumbnail_path"></el-image>
              <div v-else class="emptyImg">
                <div class="text">
                  {{$l.noCover}}
                </div>
              </div>
              <div class="info">
                <div class="title">{{i.name_label}}</div>
                <div class="desc">
                  {{i.description}}
                </div>
                <div class="views">
                  <span> <i class="far fa-thumbs-up" /> {{i.goodBad_Info.good_count}}</span>
                  <span> <i class="far fa-thumbs-down" /> {{i.goodBad_Info.bad_count}}</span>
                  <!-- <i class="el-icon-view"></i>
                  <span class="view">302</span> -->
                </div>
                <!-- <div class="points">
                  <div>学分:{{i.score}}</div>
                  <div class="line">|</div>
                  <div>学时:2</div>
                </div>
                <div class="stars">
                  <div>
                    <el-rate v-model="value" disabled show-score text-color="#ff9900"
                      score-template="{value}"></el-rate>
                  </div>
                  <div>200</div>
                </div> -->
              </div>
            </div>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
            :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="courseObj.total" style="float: right;">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: "videoUserCourse",
    data() {
      return {
        courseObj: {
          query: {
            college_id: "",
            search_type: 0,
            catalog_id: "",
            name: "",
            description: "",
            tag_id: [],
            page: 1,
            pageSize: 10,
            is_valid: 'Y',
            is_his:0
          },
          list: [],
          total: 0
        },
        tagObj: {
          query: {
            page: 1,
            pageSize: 999,
            name: ""
          },
          list: [],
          total: 0
        },

        value: 3.7,
        activeName: "",
        breadcrumb: [],
        rankList: [{
            label: this.$l.latest,
            current: false,
            asc: false
          },
          {
            label: this.$l.mostPopular,
            current: false,
            asc: false
          },
          {
            label: this.$l.positiveReview,
            current: false,
            asc: false
          },
        ],
        classList: [],
        selectedTags: [],
        tags: [],
        selectedChannels: [],
        channel: [{
            id: 1,
            text: "全部"
          }, {
            id: 2,
            text: "其他"
          },
          {
            id: 3,
            text: "云标签"
          }
        ]
      }
    },

    computed: {
      ...mapGetters(['college_id']),
    },

    watch: {
      selectedTags(val) {
        if (val.length === 1 && val[0].id == '') {
          this.courseObj.query.tag_id = []
        } else if (val.length >= 1 && val[0].id != '') {
          let tagList = []
          val.forEach(i => {
            tagList.push(i.id)
          })
          this.$set(this.courseObj.query, 'tag_id', tagList)
        }
        this.getCourseList()
      },
      college_id(newV) {
        // this.courseObj.query.college_id = newV
        this.getCourseList()
        this.getCatalogList()
      }
    },

    methods: {
      handleSizeChange(i) {
        this.courseObj.query.pageSize = i
        this.getCourseList()
      },

      handlePageChange(i) {
        this.courseObj.query.page = i
        this.getCourseList()
      },

      clickBread(id, index) {
        this.$refs.catalogTree.setCurrentKey(id)
        this.breadcrumb = this.breadcrumb.slice(0, index + 1)
        this.courseObj.query.catalog_id = id
        this.getCourseList()
      },

      getCatalogList() {
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCatalogList', {
            college_id: this.college_id,
            is_valid:'Y'
          })
          .then(r => {
            this.classList = r.data
          })
      },

      getTagList() {
        this.$request(this.$api.videoServer + '/Video/VideoTag/getList', this.tagObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.tagObj.list = r.data.list
              this.tagObj.total = r.data.total
              this.tagObj.list.unshift({
                id: "",
                name_label: this.$c.all
              })
              this.selectTag(this.tagObj.list[0])
              /* if (r.data.total == 0) {
                this.$message({
                  type: 'info',
                  message: '暂无数据'
                })
              } */
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      clickRank(targetIndex) {
        this.rankList.forEach((i, index) => {
          if (index == targetIndex) {
            i.current = true
            i.asc = !i.asc
          } else {
            i.current = false
          }
        })
      },

      handleClose(index, filed) {
        this[filed].splice(index, 1)
        if (this[filed].length == 0) {
          if (filed == 'selectedTags') {
            this.selectTag(this.tagObj.list[0])
          } else {
            this.selectedChannel(this.channel[0])
          }
        }
      },

      selectTag(i) {
        if (!this.selectedTags.includes(i)) {
          if (this.selectedTags.length == 1 && this.selectedTags[0].name_label == "全部") {
            this.selectedTags = []
          }
          if (i.name_label == "全部") {
            this.selectedTags = []
          }

          if (this.selectedTags.length >= 5) {
            this.$message.error(this.$l.mostTagsTips)
          } else {
            this.selectedTags.push(i)
          }
        } else {
          let index = this.selectedTags.indexOf(i)
          this.handleClose(index, "selectedTags")
        }
      },

      selectedChannel(i) {
        if (!this.selectedChannels.includes(i)) {
          if (this.selectedChannels.length == 1 && this.selectedChannels[0].name_label == "全部") {
            this.selectedChannels = []
          }
          if (i.name_label == "全部") {
            this.selectedChannels = []
          }
          this.selectedChannels.push(i)
        } else {
          let index = this.selectedChannels.indexOf(i)
          this.handleClose(index, "selectedChannels")
        }
      },

      resetMenu() {
        this.breadcrumb = []
        this.courseObj.query.catalog_id = ''
        this.$refs.catalogTree.setCurrentKey(null)
        this.getCourseList()
      },

      clickMenu(node, data) {
        this.breadcrumb = []
        this.courseObj.query.catalog_id = data.id
        this.getCourseList()
        this.getNodesByLevel(node)
      },

      getNodesByLevel(node) {
        if (node.level === 1) {
          this.breadcrumb.unshift(node.data);
          return
        } else if (node.level > 1) {
          this.breadcrumb.unshift(node.data);
          this.getNodesByLevel(node.parent)
        }
      },

      getCourseList() {
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
          ...this.courseObj.query,
          college_id:this.college_id
        }, 'post')
          .then(r => {
            this.courseObj.list = r.data.list
            this.courseObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },


      toPlayPage(data) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: data.id
          }
        }).href;
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank');
      },

      log(e) {
        console.log(e);
      }
    },

    mounted() {
      if (this.college_id) {
        this.courseObj.query.college_id = this.college_id
      }
      this.getTagList()
      this.getCatalogList()
      // this.getCourseList()
      this.$nextTick(() => {
        this.selectedChannel(this.channel[0])
      })
    }
  }
</script>

<style lang="scss" scoped>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .branch-container {
    width: 100%;
    min-height: 100%;
    background-color: #f3f4f6;
    padding: 20px 0px;

    .page-body {
      width: 80%;
      min-width: 900px;
      height: 100%;
      margin: 0 auto;
      // overflow-y: scroll;

      .navigation {

        .title-label {
          margin-left: 1em;
          white-space: nowrap;
        }

        .title {
          overflow: hidden;
          width: 100%;
          white-space: nowrap;

          .tags {
            margin: 0 15px;
            padding: 0 10px;
            white-space: nowrap;
          }
        }

        .body {
          display: inline-flex;
          flex-wrap: wrap;

          .tags {
            margin: 5px 10px;
            padding: 0 10px;
            white-space: nowrap;

            &:hover {
              background-color: #ecf5ff;
              color: #409eff;
              cursor: pointer;
            }
          }
        }
      }

      .content {
        width: 100%;
        height:calc(100vh - 230px);
        display: flex;
        margin-top: 40px;
        background-color: #f8f9fa;

        .menu {
          width: 25%;
          height: 100%;
          max-height: 100%;
          overflow: scroll;
          background-color: white;

          .custom-menu-node {
            height: 50px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }

        .video-wrapper {
          width: 75%;
          height: 100%;

          .filter_sort {
            width: 95%;
            height: 4em;
            margin: 0px auto;
            display: flex;
            justify-content: space-between;

            .input {
              height: 4em;

            }

            .rank {
              display: flex;
              height: 4em;
              align-items: center;

              .item {
                display: flex;
                cursor: pointer;
                border-right: 1px solid #5b5c5e;
                margin: 0 10px;
                padding-right: 20px;

                &:last-child {
                  border-right: none;
                }

                .icon-wrapper {
                  display: flex;
                  flex-direction: column;
                  margin-left: 3px;

                  .icon {
                    width: 8px;
                    height: 8px;
                  }
                }
              }
            }
          }

          .breadcrumb {
            width: 95%;
            height: 3em;
            margin: 0px auto;
            display: flex;
            align-items: center;
            // justify-content: space-between;

            .item {
              cursor: pointer;
              font-size: 16px;

              .title {
                color: #969696;
              }

              &:last-child {
                .title {
                  color: #5b5c5e;
                  margin-right: 1em;
                }
              }
            }
          }

          .video-list {
            width: 100%;
            height: calc(100% - 130px);
            max-height:calc(100% - 130px);
            overflow-y: auto;
            display: flex;
            flex-wrap: wrap;
            // background-color: red;
            // justify-content: space-between;

            .video {
              min-width: calc(25% - 30px);
              max-width: calc(25% - 30px);
              height: 360px;
              margin:15px;
              padding: 10px;
              background-color: white;
              border-radius: 5px;
              cursor: pointer;
              transition: transform 0.3s ease-in-out;
              box-shadow: 0px 0px 10px 2px rgba(116, 150, 184, 0.2);

              &:hover {
                .title {
                  color: #2894ff;
                }

                transform: translateY(-15px);
                box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.2);
              }

              .img {
                width: 100%;
                height: 165px;

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

              .emptyImg {
                width: 100%;
                height: 165px;
                background-color: #dddddd;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
              }

              .info {
                width: 100%;
                height: 170px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                  overflow: hidden;
                  -webkit-line-clamp: 3;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 22px;
                  height: 70px;
                  margin-top: 10px;
                }

                .desc {
                  flex: 1;
                  color: #595959;
                  overflow: hidden;
                  -webkit-line-clamp: 3;
                  text-overflow: ellipsis;
                }

                .views {
                  height: 20px;
                  span{
                    margin-right: 10px;
                  }
                  margin-top: 10px;
                  color: #595959;

                  .view {
                    margin-left: 0.5em;
                  }
                }
              }
            }



            /* .video {
              width: calc(25% - 20px);
              height: 360px;
              margin: 0px 10px 20px;
              padding: 10px;
              background-color: white;
              border-radius: 5px;
              cursor: pointer;
              transition: transform 0.3s ease-in-out;

              &:hover {

                .title {
                  color: #2894ff;
                }

                transform: translateY(-8px);
                box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.2);
              }

              .img {
                width: 100%;
                height: 160px;

              }

              .emptyImg {
                width: 100%;
                height: 160px;
                background-color: #dddddd;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
              }

              .info {
                width: 100%;
                height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                  overflow: hidden;
                  -webkit-line-clamp: 3;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 24px;
                  height: 72px;
                }

                .points {
                  height: 25%;
                  display: flex;
                  color: #797979;

                  .line {
                    width: 20px;
                    text-align: center;
                  }
                }

                .stars {
                  height: 25%;
                  display: flex;
                  justify-content: space-between;
                  color: '#797979'
                }
              }
            } */
          }
        }
      }
    }
  }
</style>
