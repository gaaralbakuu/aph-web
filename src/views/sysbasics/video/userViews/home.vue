<template>
  <div class="home-container">
    <el-carousel :interval="10000" arrow="always" height="50vh" type="card">
      <el-carousel-item v-for="item in bannerList" :key="item.image">
        <div style="height: 50vh;min-width: 850px;" @click="clickBanner(item)">
          <el-image :src="item.image" fit="cover"></el-image>
          <div
            style="position: absolute;bottom: 0px;font-size: 20px;background-color: rgba(0, 0, 0, 0.3);width: 100%;color: white;line-height: 36px;text-indent: 10px;">
            {{item.name}}
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="page-body">
      <div class="series-wrapper">
        <div class="title-wrapper">
          <div class="title">{{$l.newestCourse}}</div>
          <div class="more" @click="toPage('course')" style="cursor: pointer;">
            {{$l.moreCourse}} <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="playlist" v-if="courseList.length>0">
          <div class="video" v-for="i in courseList" :key="i.id" @click="toPlayPage(i)">
            <div v-if="i.thumbnail_path" class="img">
              <img class="auto-img" :src="$api.videoServer + '/' + i.thumbnail_path" />
            </div>
            <div v-else class="emptyImg">
              <div class="text">{{$c.noCover}}</div>
            </div>
            <div class="info">
              <div class="title">{{ i.name_label }}</div>
              <div class="desc">
                {{i.description}}
              </div>
              <div class="views">
                <span> <i class="far fa-thumbs-up" /> {{i.goodBad_Info.good_count}}</span>
                <span> <i class="far fa-thumbs-down" /> {{i.goodBad_Info.bad_count}}</span>
                <!-- <i class="el-icon-view"></i>
                <span class="view">302</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="playlist-empty" v-else>
          <div>
            {{$l.noCourseTips}}
          </div>
        </div>
      </div>

      <div class="series-wrapper" v-for="(i,index) in subjectList.list" :key="i.id">
        <div v-if="i.detail.length>0">
          <div class="title-wrapper">
            <div class="title">{{ i.title_label }}</div>
            <div class="more" @click="toDetailPage(i)" style="cursor: pointer;">
              {{$l.enterTopic}} <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="playlist">
            <div class="video" v-for="x in i.detail" :key="x.id" @click="toPlayPageTag(x)">
              <div v-if="x.thumbnail_path" class="img">
                <img class="auto-img" :src="$api.videoServer + '/' + x.thumbnail_path" />
              </div>
              <div v-else class="emptyImg">
                <div class="text">{{$c.noCover}}</div>
              </div>
              <div class="info">
                <div class="title">{{ x.course_name_label }}</div>
                <div class="desc">
                  {{x.description}}
                </div>
                <div class="views">
                  <span> <i class="far fa-thumbs-up" /> {{x.goodBad_Info.good_count}}</span>
                  <span> <i class="far fa-thumbs-down" /> {{x.goodBad_Info.bad_count}}</span>
                  <!-- 目前暂无播放次数统计
                  <i class="el-icon-view"></i>
                  <span class="view">302</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="rank-wrpaper">
        <div class="title-wrapper">
          <div class="title">{{$l.rank}}</div>
          <div style="margin-left: 20px;">
            <el-date-picker v-model="queryMonth" type="daterange" range-separator="-" :start-placeholder="$c.startDate"
              :end-placeholder="$c.endDate" value-format='yyyy-MM-dd' @change="changeRankList">
            </el-date-picker>
          </div>
        </div>
        <div class="list">
          <div class="rank">
            <div class="title-wrapper">
              <div class="title">{{$l.courseRank}}</div>
            </div>
            <div class="rank-list" v-show="rankObj.rankingInfos[0].length>0">
              <div class="rank-item" v-for="(i, index) in rankObj.rankingInfos[0]" :key="index">
                <div class="user-info">
                  <div class="index">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="name">
                      {{ i.name_t }}
                    </div>
                    <div class="dept">
                      {{ i.department_t }}
                    </div>
                  </div>
                </div>
                <div class="score">{{i.num||0 }} {{$l.courseUnit}}</div>
              </div>
            </div>
            <div class="rank-list" style="display: flex;align-items: center;"
              v-show="rankObj.rankingInfos[0].length==0">
              <div class="emptyData">
                {{$c.noData}}
              </div>
            </div>
          </div>

          <div class="rank">
            <div class="title-wrapper">
              <div class="title">{{$l.scoreRank}}</div>
            </div>
            <div class="rank-list" v-show="rankObj.rankingInfos[1].length>0">
              <div class="rank-item" v-for="(i, index) in rankObj.rankingInfos[1]" :key="index">
                <div class="user-info">
                  <div class="index">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="name">
                      {{ i.name_t }}
                    </div>
                    <div class="dept">
                      {{ i.department_t }}
                    </div>
                  </div>
                </div>
                <div class="score">{{ i.score||0 }} {{$l.scoreUnit}}</div>
              </div>
            </div>
            <div class="rank-list" style="display: flex;align-items: center;"
              v-show="rankObj.rankingInfos[1].length==0">
              <div class="emptyData">
                {{$c.noData}}
              </div>
            </div>
          </div>

          <div class="rank">
            <div class="title-wrapper">
              <div class="title">{{$l.durationRank}}</div>
            </div>
            <div class="rank-list" v-show="rankObj.rankingInfos[2].length>0">
              <div class="rank-item" v-for="(i, index) in rankObj.rankingInfos[2]" :key="index">
                <div class="user-info">
                  <div class="index">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="name">
                      {{ i.name_t }}
                    </div>
                    <div class="dept">
                      {{ i.department_t }}
                    </div>
                  </div>
                </div>
                <div class="score">{{ Math.floor(i.time/60) ||0}} {{$l.durationUnit}}</div>
              </div>
            </div>
            <div class="rank-list" style="display: flex;align-items: center;"
              v-show="rankObj.rankingInfos[2].length==0">
              <div class="emptyData">
                {{$c.noData}}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style="height: 100px;"></div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'videoUserHome',
    data() {
      return {
        value1: '',
        queryMonth: '',
        bannerList: [],
        courseList: [],
        subjectList: {
          queryObj: {
            is_valid: 'Y',
            page: 1,
            pageSize: 4,
            college_id: ""
          },
          list: [],
        },
        rankObj: {
          query: {
            start_date: "",
            end_date: "",
            page: 1,
            pageSize: 10
          },
          rankingInfos: {
            0: [],
            1: [],
            2: []
          }, // 用于存储不同类型的排行榜信息
        },

      }
    },

    computed: {
      ...mapGetters(['college_id']),
    },

    watch: {
      college_id(newV) {
        this.getCourseList()
        this.getSubjectList()
      }
    },

    methods: {
      extractQueryParamsFromUrl(url) {
        const urlObj = new URL(url, window.location.origin); // 创建 URL 对象
        const queryParams = {};

        // 遍历 URL 的 searchParams，提取所有查询参数
        urlObj.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        return queryParams;
      },

      clickBanner(i) {
        if (i.link) {
          let type = i.link.split('=')[0]
          let id = i.link.split('=')[1]
          if (type.includes('course')) {
            this.toPlayPage({
              id: id
            })
          } else if (type.includes('topic')) {
            this.toDetailPage({
              id: id
            })
          }
        }
      },

      changeRankList(e) {
        this.rankObj.query.start_date = e[0]
        this.rankObj.query.end_date = e[1]
        this.fetchAllRankings()
      },

      toPlayPage(data) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: data.id,
            topic_id: data.pid
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      },
      toPlayPageTag(data) {
        let routeUrl = routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: data.course_primary_id,
            topic_id: data.pid
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
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

      toPage(target) {
        this.$router.push({
          name: target,
        })
      },

      getCourseList() {
        this.$request(
            this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
              college_id: this.college_id,
              page: 1,
              pageSize: 10,
              is_valid: 'Y',
              is_his: 0
            },
            'post'
          )
          .then((r) => {
            this.courseList = r.data.list
          })
          .catch((e) => {
            console.log(e)
          })
      },

      getBanner() {
        this.$request(this.$api.baseUrl + '/Platform/banner/getbanners', {
          status: "1",
          type: 'video',
        }).then((r) => {
          this.bannerList = r.data
        })
      },

      getSubjectList() {
        this.$request(
            this.$api.videoServer + '/Video/VideoPageTag/getlist', {
              web_page:'home',
              is_valid: 'Y',
              page: 1,
              pageSize: 4,
              college_id: this.college_id
            }
          )
          .then((r) => {
            this.subjectList.list = r.data.list.filter(i => i.detail.length != 0)
          })
          .catch((e) => {
            console.log(e)
          })
      },

      getMonthFirstAndLastDay() {
        const now = new Date(); // 当前日期和时间

        // 获取本月的第一天
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        // 获取下个月的第一天，然后回退一天得到本月的最后一天
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // 格式化日期为 YYYY-MM-DD 格式
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // JavaScript的月份是从0开始的
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        return {
          firstDay: formatDate(firstDay),
          lastDay: formatDate(lastDay)
        }
      },

      getRankList(type, cb) {
        if (this.rankObj.query.start_date == '') {
          let date = this.getMonthFirstAndLastDay()
          this.rankObj.query.start_date = date.firstDay
          this.rankObj.query.end_date = date.lastDay
          this.value1 = [this.rankObj.query.start_date, this.rankObj.query.end_date]
          this.queryMonth = [this.rankObj.query.start_date, this.rankObj.query.end_date]
        }
        this.$request(this.$api.videoServer + '/Video/VideoAnalyze/GetRank', {
            ...this.rankObj.query,
            type: type
          })
          .then(r => {
            if (r.status) {
              cb(r)
            } else {
              console.log(r);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      fetchAllRankings() {
        const types = [0, 1, 2]; // 不同的排行榜类型
        types.forEach(type => {
          this.getRankList(type, (r) => {
            // 使用type作为属性名存储数据
            if(r.data===null){
              this.$set(this.rankObj.rankingInfos, type, []);
            }else{
              this.$set(this.rankObj.rankingInfos, type, r.data);
            }
          });
        });
      }
    },

    mounted() {
      this.getBanner()
      this.getCourseList()
      this.getSubjectList()
      this.fetchAllRankings()
    },
  }
</script>

<style scoped>
@charset "UTF-8";
.home-container {
  width: 100%;
  height: 100%;
  background-color: white;
}
.home-container .el-carousel__item h1 {
  color: #475669;
  font-size: 24px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}
.home-container .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.home-container .el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.home-container .page-body {
  width: 70%;
  min-width: 1000px;
  margin: 0 auto;
}
.home-container .page-body .series-wrapper {
  width: 100%;
  margin-top: 80px;
}
.home-container .page-body .series-wrapper .title-wrapper {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.home-container .page-body .series-wrapper .title-wrapper .title {
  font-size: 30px;
  font-weight: 600;
}
.home-container .page-body .series-wrapper .title-wrapper .more:hover {
  color: #409fee;
}
.home-container .page-body .series-wrapper .playlist {
  width: 100%;
  height: 450px;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
}
.home-container .page-body .series-wrapper .playlist::-webkit-scrollbar {
  height: 5px;
  /* 横向滚动条的高度 */
}
.home-container .page-body .series-wrapper .playlist .video {
  min-width: 280px !important;
  max-width: 280px !important;
  height: 360px;
  margin: 30px 15px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0px 0px 10px 2px rgba(116, 150, 184, 0.2);
}
.home-container .page-body .series-wrapper .playlist .video:hover {
  transform: translateY(-15px);
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.2);
}
.home-container .page-body .series-wrapper .playlist .video:hover .title {
  color: #2894ff;
}
.home-container .page-body .series-wrapper .playlist .video .img {
  width: 100%;
  height: 165px;
}
.home-container .page-body .series-wrapper .playlist .video .img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.home-container .page-body .series-wrapper .playlist .video .emptyImg {
  width: 100%;
  height: 165px;
  background-color: #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.home-container .page-body .series-wrapper .playlist .video .info {
  width: 100%;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.home-container .page-body .series-wrapper .playlist .video .info .title {
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
.home-container .page-body .series-wrapper .playlist .video .info .desc {
  flex: 1;
  color: #595959;
  overflow: hidden;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
.home-container .page-body .series-wrapper .playlist .video .info .views {
  height: 20px;
  margin-top: 10px;
  color: #595959;
}
.home-container .page-body .series-wrapper .playlist .video .info .views span {
  margin-right: 10px;
}
.home-container .page-body .series-wrapper .playlist .video .info .views .view {
  margin-left: 0.5em;
}
.home-container .page-body .series-wrapper .playlist-empty {
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #777;
}
.home-container .page-body .rank-wrpaper {
  width: 100%;
  margin-top: 100px;
  padding: 10px;
}
.home-container .page-body .rank-wrpaper .title-wrapper {
  width: 100%;
  height: 60px;
  padding: 20px 0px;
  display: flex;
  align-items: flex-end;
}
.home-container .page-body .rank-wrpaper .title-wrapper .title {
  font-size: 30px;
  font-weight: 600;
}
.home-container .page-body .rank-wrpaper .list {
  display: flex;
  justify-content: space-between;
}
.home-container .page-body .rank-wrpaper .list .rank {
  width: 31%;
  padding-bottom: 20px;
  box-shadow: 0px 0px 10px 2px rgba(116, 150, 184, 0.2);
}
.home-container .page-body .rank-wrpaper .list .rank .title-wrapper {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.home-container .page-body .rank-wrpaper .list .rank .title-wrapper .title {
  font-size: 24px;
  font-weight: 600;
}
.home-container .page-body .rank-wrpaper .list .rank .title-wrapper .more {
  cursor: pointer;
}
.home-container .page-body .rank-wrpaper .list .rank .title-wrapper .more:hover {
  color: #409fee;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list {
  width: 100%;
  min-height: 500px;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .emptyData {
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 24px;
  color: #99a9bf;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item {
  width: 100%;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item:hover {
  background-color: aliceblue;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item:first-child .user-info .index {
  width: 30px;
  height: 30px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  background-color: #a8071a;
  border-radius: 50%;
  text-align: center;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item:nth-child(2) .user-info .index {
  width: 30px;
  height: 30px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  background-color: #f5222d;
  border-radius: 50%;
  text-align: center;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item:nth-child(3) .user-info .index {
  width: 30px;
  height: 30px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  background-color: #fa8c16;
  border-radius: 50%;
  text-align: center;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item .user-info {
  display: flex;
  align-items: center;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item .user-info .index {
  width: 30px;
  height: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #99a9bf;
  text-align: center;
  margin-right: 10px;
}
.home-container .page-body .rank-wrpaper .list .rank .rank-list .rank-item .user-info .name {
  font-size: 20px;
}
</style>
