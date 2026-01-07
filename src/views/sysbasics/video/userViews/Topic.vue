<template>
  <div class="topic-container">
    <div class="topicPage-body">
      <div class="content">
        <div class="topic-wrapper">
          <div class="topic-filter">
            <div style="padding: 15px 0px;">
              <el-form inline label-position="left">
                <el-form-item :label="l.topicName">
                  <el-input v-model="topicObj.query.name" clearable @clear='getTopicList'
                    @keyup.enter="getTopicList"></el-input>
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="getTopicList">{{ c.m_search}}</el-button></el-form-item>
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

          <div class="topic-list">
            <div class="topic" v-for="i in topicObj.list" :key="i.id" @click="toDetailPage(i)">
              <img v-if="i.detail.length>0" class="img" :src="$api.videoServer+'/'+i.detail[0].thumbnail_path" />
              <div v-else class="emptyImg">
                <div class="text">
                  {{ l.noCover}}
                </div>
              </div>
              <div class="info">
                <div class="title">{{i.title_label}}</div>
                <div class="detailBox">
                  <div class="detail">
                    {{ l.contentLeft}} {{i.detail.length}} {{ l.contentRight}}
                  </div>
                  <div class="time">{{ l.latestUpdate}}：{{i.modify_time}}</div>
                </div>
              </div>
            </div>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
            :current-page="topicObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="topicObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="topicObj.total" style="float: right;">
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
    name: "videoUserTopic",
    data() {
      return {
        topicObj: {
          query: {
            college_id: "",
            name: "",
            page: 1,
            pageSize: 15,
            is_valid: 'Y'
          },
          list: [],
          total: 0
        },
        rankList: [{
            label: this.l.latest,
            current: false,
            asc: false
          },
          {
            label: this.l.mostPopular,
            current: false,
            asc: false
          },
          {
            label: this.l.positiveReview,
            current: false,
            asc: false
          },
        ],
      }
    },

    computed: {
      ...mapGetters(['college_id']),
    },

    watch: {
      college_id() {
        this.getTopicList()
      }
    },

    methods: {
      handleSizeChange(i) {
        this.topicObj.query.pageSize = i
        this.getTopicList()
      },

      handlePageChange(i) {
        this.topicObj.query.page = i
        this.getTopicList()
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

      getTopicList() {
        this.$request(this.$api.videoServer + '/Video/VideoPageTag/getlist', {
            ...this.topicObj.query,
            college_id: this.college_id
          })
          .then(r => {
            this.topicObj.list = r.data.list
            // this.topicObj.list = r.data.list.filter(i => i.detail.length != 0)
            this.topicObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },

      toDetailPage(data) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'topicDetail',
          query: {
            topic_id: data.id
          }
        }).href;
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank');
      },
    },

    mounted() {
      if (this.college_id) {
        this.topicObj.query.college_id = this.college_id
      }
      this.getTopicList()
    }
  }
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.topic-container {
  width: 100%;
  min-height: 100%;
  background-color: #f3f4fa;
  padding-top: 20px;
}
.topic-container .topicPage-body {
  width: 80%;
  min-width: 900px;
  height: calc(100vh - 140px);
  margin: 0 auto;
}
.topic-container .topicPage-body .content {
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #f9f9fa;
}
.topic-container .topicPage-body .content .topic-wrapper {
  width: 100%;
  height: 100%;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter {
  width: 100%;
  padding: 0% 2.5%;
  height: 5em;
  display: flex;
  justify-content: space-between;
  background-color: white;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .input {
  height: 4em;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .rank {
  display: flex;
  height: 4em;
  align-items: center;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .rank .item {
  display: flex;
  cursor: pointer;
  border-right: 1px solid #5b5c5e;
  margin: 0 10px;
  padding-right: 20px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .rank .item:last-child {
  border-right: none;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .rank .item .icon-wrapper {
  display: flex;
  flex-direction: column;
  margin-left: 3px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-filter .rank .item .icon-wrapper .icon {
  width: 8px;
  height: 8px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list {
  margin-top: 20px;
  width: 100%;
  height: calc(100% - 120px);
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic {
  width: calc(25% - 20px);
  height: 300px;
  margin: 0px 10px 20px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic:hover {
  transform: translateY(-8px);
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.2);
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic:hover .title {
  color: #2894ff;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .img {
  width: 100%;
  height: 160px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .emptyImg {
  width: 100%;
  height: 160px;
  background-color: #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .info {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .info .title {
  overflow: hidden;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  height: 70px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .info .detailBox {
  height: 50px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .info .detailBox .detail {
  height: 30px;
  font-size: 14px;
}
.topic-container .topicPage-body .content .topic-wrapper .topic-list .topic .info .detailBox .time {
  height: 20px;
}
</style>
