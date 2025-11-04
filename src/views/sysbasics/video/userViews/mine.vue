<template>
  <div class="mine-container">
    <div class="page-body">
      <div class="user-info">
        <div class="user-left">
          <img src="@/assets/default_avatar.png" class="user-avatar" />
          <div class="infos">
            <div class="name">
              {{ user.userName + '(' + user.userId + ')' }}
            </div>
            <div class="dept">{{$l.dept}}:{{ user.department }}</div>
            <div class="post">{{$l.post}}:{{ user.workName }}</div>
          </div>
        </div>
        <div class="user-right">
          <div class="item">
            <div class="value">
              <a href="#">{{(analyLearninfo.month_play_time/60/60).toFixed(2)}}</a>
            </div>
            <div class="desc">{{$l.monthlyDuration}}</div>
          </div>
          <div class="item">
            <div class="value">
              <a href="#">{{analyLearninfo.score? analyLearninfo.score:0}}</a>
            </div>
            <div class="desc">{{$l.totallyScore}}</div>
          </div>
          <div class="item">
            <div class="value">
              <a href="#">{{(analyLearninfo.play_time/60/60).toFixed(2)}}</a>
            </div>
            <div class="desc">{{$l.totallyDuration}}</div>
          </div>
          <!-- <div class="item">
            <div class="value">
              <a href="#">144</a>
            </div>
            <div class="desc">累计积分</div>
          </div> -->
        </div>
      </div>
      <div class="content">
        <div class="navigation">
          <el-menu default-active="0" unique-opened>
            <!-- <el-menu-item v-for="(i,index) in navigation" :key="index" :index="i.value">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">
                <router-link :to="i.to">{{i.label}}</router-link>
              </span>
            </el-menu-item> -->
            <router-link
              :to="i.to"
              v-for="(i, index) in navigation"
              :key="index"
            >
              <el-menu-item :index="i.value">
                <i class="el-icon-notebook-2"></i>
                <span slot="title">
                  {{ i.label }}
                </span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </div>
        <div class="router_wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'videoUserMine',
  data() {
    return {
      analyLearninfo:{
        month_play_time:0,
        score:0,
        play_time:0
      },
      navigation: [
        {
          label: this.$l.training,
          value: '0',
          to: '/videoLayout/mine/training',
        },
        {
          label: this.$l.favorite,
          value: '1',
          to: '/videoLayout/mine/favorite',
        },
        {
          label: this.$l.history,
          value: '2',
          to: '/videoLayout/mine/history',
        },
      ],
    }
  },

  computed: {
    ...mapGetters(['user']),
  },

  methods: {
    getLearningInfo(){
      this.$request(this.$api.videoServer+'/Video/VideoAnalyze/analyLearninfo')
      .then(r=>{
        this.analyLearninfo = r.data
      })
    },
  },

  mounted() {
    this.getLearningInfo()
  },
}
</script>

<style scoped>
.mine-container {
  width: 100%;
  background-color: #efefef;
}
.mine-container .page-body {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}
.mine-container .page-body .user-info {
  width: 100%;
  height: 200px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  padding: 20px;
}
.mine-container .page-body .user-info .user-left {
  height: 100%;
  display: flex;
  align-items: center;
}
.mine-container .page-body .user-info .user-left .user-avatar {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.mine-container .page-body .user-info .user-left .infos div {
  margin-top: 5px;
  font-size: 16px;
}
.mine-container .page-body .user-info .user-left .infos .name {
  font-size: 30px;
}
.mine-container .page-body .user-info .user-right {
  width: 50%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
}
.mine-container .page-body .user-info .user-right .item {
  text-align: center;
  width: 20%;
}
.mine-container .page-body .user-info .user-right .item .value {
  font-size: 24px;
}
.mine-container .page-body .user-info .user-right .item .desc {
  margin-top: 10px;
}
.mine-container .page-body .content {
  width: 100%;
  height: calc(100vh - 150px);
  background-color: white;
  margin-top: 30px;
  border-radius: 10px;
  display: flex;
}
.mine-container .page-body .content .navigation {
  border-radius: 10px;
  width: 15%;
  min-width: 200px;
  flex-grow: 1;
  padding: 10px;
  height: 100%;
}
.mine-container .page-body .content .router_wrapper {
  width: 85%;
  background-color: white;
  height: 100%;
  border-radius: 10px;
}
</style>
