<template>
  <div class="topicDetail-container">
    <div class="page-body">
      <div class="topic-info">
        <div class="cover">
          <img :src="logoImage" width="100px" />
        </div>
        <div class="info">
          <div class="title">
            <span>{{topic.title_label}}</span>
          </div>
          <div class="create">
            <span>{{$l.create_time}}：{{topic.create_time}}</span><span></span>
          </div>
        </div>
      </div>
      <div class="activity-container">
        <div class="left">
          <div class="title-label">
            {{$l.content}}
          </div>
          <!-- <div class="filter">
            <el-form :inline="true">
              <el-form-item label="活动名称">
                <el-input v-model="query.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="query.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="query.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div> -->
          <div class="activity">
            <div v-if="topic.detail.length>0">
              <div class="topic-item" v-for="(item, index) in topic.detail" :key="index">
                <div class="cover">
                  <img style="width: 100px;height: auto;" :src="$api.videoServer + '/' + item.thumbnail_path"  />
                </div>
                <div class="content">
                  <div class="course-name">{{ item.course_name_label }}</div>
                  <div class="course-desc">
                    <span>{{ item.description }}</span>
                  </div>
                </div>
                <div class="btn-right">
                  <el-button type="primary" round @click="toPlayPageTag(item)">{{$l.study}}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  import logoImage from '@/assets/logo.png'
  
  export default {
    name: "videoUserTopicDetail",
    data() {
      return {
        logoImage,
        topic: {
          title_label: '',
          detail: []
        }
      }
    },

    computed: {
      ...mapGetters(['college_id'])
    },

    methods: {
      getTopicDetailById(id) {
        this.$request(this.$api.videoServer + '/Video/VideoPageTag/getlist', {
            id: id,
            page: 1,
            pageSize: 10
          })
          .then(r => {

            if (r.status && r.data.total > 0) {
              this.topic = r.data.list[0]
            }
          })
      },

      toPlayPageTag(data) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: data.course_primary_id,
            topic_id:data.pid
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      },

    },

    mounted() {
      if (this.$route.query.topic_id) {
        this.getTopicDetailById(this.$route.query.topic_id)
      }
    }
  }
</script>

<style scoped>
.goToExam {
  margin: 5px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.goToExam .detail {
  padding-left: 10px;
  width: calc(100% - 150px);
  white-space: nowrap;
  overflow: hidden;
}
.goToExam .detail .num {
  margin: 0 2px;
  font-size: 16px;
  font-weight: bold;
}
.goToExam .goToExam-btn {
  width: 150px;
  text-align: center;
}
.goToExam .goToExam-btn .go {
  z-index: 6000;
  border: none;
}
.goToExam .goToExam-btn .go:hover {
  border: none;
}

.topicDetail-container {
  width: 100%;
  background-color: #fafafa;
}
.topicDetail-container .page-body {
  width: 75%;
  margin: 0 auto;
  padding: 25px;
  min-width: 1000px;
}
.topicDetail-container .page-body .topic-info {
  width: 100%;
  height: 150px;
  padding: 25px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid #dadada;
  border-radius: 5px;
}
.topicDetail-container .page-body .topic-info .cover {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.topicDetail-container .page-body .topic-info .info {
  flex-grow: 1;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.topicDetail-container .page-body .topic-info .info .title {
  font-size: 40px;
  font-weight: bold;
}
.topicDetail-container .page-body .topic-info .info .create {
  color: #666;
}
.topicDetail-container .page-body .activity-container {
  width: 100%;
  min-height: calc(100vh - 180px);
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  overflow-y: auto;
}
.topicDetail-container .page-body .activity-container .left {
  width: 100%;
  min-height: 100%;
  border: 1px solid #dadada;
  border-radius: 5px;
  background-color: white;
}
.topicDetail-container .page-body .activity-container .left .title-label {
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #dadada;
}
.topicDetail-container .page-body .activity-container .left .filter {
  width: 100%;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.topicDetail-container .page-body .activity-container .left .activity {
  width: 95%;
  margin: 0 auto;
  padding: 10px;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item {
  width: 100%;
  height: 100px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px #eee solid;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item:hover {
  background-color: aliceblue;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .cover {
  width: 100px;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .content {
  width: calc(100% - 250px);
  height: 100%;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .content .course-name {
  height: 50%;
  line-height: 40px;
  font-size: 20px;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .content .course-desc {
  height: 50%;
  color: #999999;
  text-align: left;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .content .status {
  color: #999999;
}
.topicDetail-container .page-body .activity-container .left .activity .topic-item .btn-right {
  text-align: center;
  width: 100px;
}
</style>
