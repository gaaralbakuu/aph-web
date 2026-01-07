<template>
  <div class="learning-container">
    <!-- <div class="learning-filter">
      <div class="filter-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <div>{{ l.demand}}：<b style="color: #409fee;">{{showObj.demand}}</b><i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <template #dropdown><el-dropdown-menu>
            <el-dropdown-item v-for="(item,index) in paramsObj.demand" :key="index" :divided="index>0"
              :command="'demand-'+item.value+'-'+item.label">
              {{item.label}}
            </el-dropdown-item>
          </el-dropdown-menu></template>
        </el-dropdown>
      </div>
      <div class="filter-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <div>{{ l.type}}：<b style="color: #409fee;">{{showObj.type}}</b><i class="el-icon-arrow-down el-icon--right"></i></div>
          <template #dropdown><el-dropdown-menu>
            <el-dropdown-item v-for="(item,index) in paramsObj.type" :key="index" :divided="index>0"
              :command="'type-'+item.value+'-'+item.label">
              {{item.label}}
            </el-dropdown-item>
          </el-dropdown-menu></template>
        </el-dropdown>
      </div>
      <div class="filter-item" @click="query.timeSortingDsec = !query.timeSortingDsec">
        {{ l.time}} <i :class="query.timeSortingDsec?'el-icon-bottom':'el-icon-top'"
          style="color: #409fee;font-weight: 800;"></i>
      </div>
    </div> -->

    <el-menu class="horizontal-menu" :default-active="showObj.activeName" mode="horizontal" @select="handleSelect"
      active-text-color="#409fee">
      <el-menu-item index="first">{{ c.all}}</el-menu-item>
      <!-- <el-menu-item index="second">{{ l.notStart}}</el-menu-item> -->
      <!-- <el-menu-item index="third">{{ l.onGoing}}</el-menu-item> -->
      <!-- <el-menu-item index="six">{{ l.notComplete}}</el-menu-item> -->
      <!-- <el-menu-item index="fourth">{{ l.completed}}</el-menu-item> -->
      <!-- <el-menu-item index="five">{{ l.historyCompleted}}</el-menu-item> -->
    </el-menu>


    <div class="learning-content">
      <div class="learning-item" v-for="(item,index) in hislist" :key="index">
        <div class="cover">
          <img class="auto-img" :src="$api.videoServer+'/'+item.video_thumbnail_path" height="100px">
        </div>
        <div class="content">
          <div class="course-name">
            {{item.video_name_label}}
          </div>
          <div class="course-info">
            {{ l.source}}:{{item.course_name_label}}
          </div>

          <!-- <div class="course-info">
            <span>来源：自主注册</span><span>|</span><span>上次学习时间：2024-09-19 16:59</span>
          </div> -->
        </div>
        <div class="progress">
          <div class="status">
            {{secondsToMinutes(item.max_progress)==secondsToMinutes(item.duration)? l.learning:l.learnedCompletly}}
          </div>
          <div class="duration">
            {{secondsToMinutes(item.max_progress)+' / '+ secondsToMinutes(item.duration)}}
          </div>
        </div>
        <div class="btn-right">
          <el-button type="primary" round @click="btnClick(item)">{{ l.goStudy}}</el-button>
        </div>
        <!-- <div class="delete">
          <i class="el-icon-delete"></i>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'videoUserHistory',
    data() {
      return {
        hislist: [],
        showObj: {
          activeName: 'first',
          demand: this.c.all,
          type: this.c.all,
        },
        query: {
          demand: "",
          type: "",
          timeSortingDsec: true
        },
        paramsObj: {
          demand: [{
              value: "all",
              label: this.c.all
            },
            {
              value: "Y",
              label: this.l.compulsory
            },
            {
              value: "N",
              label: this.l.elective
            }
          ],
          type: [{
              value: "all",
              label: this.c.all
            },
            {
              value: "course",
              label: this.l.course
            },
            {
              value: "topic",
              label: this.l.topic
            }
          ],
        }
      };
    },
    methods: {
      handleSelect(tab) {
        console.log(tab);
      },
      handleCommand(command) {
        let [filed, value, label] = command.split('-')
        this.query[filed] = value
        this.showObj[filed] = label
      },
      btnClick(data) {
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: data.course_primary_id,
            video_id: data.video_id
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      },

      secondsToMinutes(seconds) {
        // 确保输入是数值并且是非负数
        if (typeof seconds !== 'number' || seconds < 0) {
          throw new Error('Invalid input, please provide a non-negative number.');
        }
        seconds = seconds.toFixed(0)
        // 计算分钟数和剩余秒数
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        // 格式化输出，确保秒数总是两位数
        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
      },

      getMyPlayHis() {
        this.$request(this.$api.videoServer + "/Video/VideoAnalyze/getMyPlayHis", {
          page: 1,
          pageSize: 999
        }).then(r => {
          this.hislist = r.data.list.filter(i => i.max_progress != 0)
          this.hislist.forEach(e => {
            const percentValue = +((e.max_progress / e.duration) * 100).toFixed(0);
            this.$set(e, "percent", percentValue)
            const allTime = this.secondsToMinutes(e.duration)
            const max_progress = this.secondsToMinutes(e.max_progress)
            this.$set(e, "show_time", max_progress + '/' + allTime)
          })
        }).catch((e) => {})
      },
    },


    mounted() {
      this.getMyPlayHis()
    }
  };
</script>

<style scoped>
.learning-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
}
.learning-container .learning-filter {
  position: absolute;
  z-index: 10;
  width: 40%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 40px;
  right: 0;
}
.learning-container .learning-filter .filter-item {
  margin: 0 15px;
  cursor: pointer;
  white-space: nowrap;
}
.learning-container .learning-content {
  height: calc(100% - 50px);
  width: 100%;
  padding: 20px;
  overflow: scroll;
}
.learning-container .learning-content .learning-item {
  width: 100%;
  height: 120px;
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #b4b4b4;
}
.learning-container .learning-content .learning-item:hover {
  background-color: aliceblue;
}
.learning-container .learning-content .learning-item:hover .delete {
  width: 50px;
  font-size: 20px;
  visibility: visible;
}
.learning-container .learning-content .learning-item:hover .delete:hover {
  color: red;
  cursor: pointer;
}
.learning-container .learning-content .learning-item .cover {
  width: 200px;
  height: 100%;
}
.learning-container .learning-content .learning-item .cover .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.learning-container .learning-content .learning-item .content {
  flex-grow: 1;
  height: 100%;
}
.learning-container .learning-content .learning-item .content .course-name {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}
.learning-container .learning-content .learning-item .content .course-info {
  height: 50px;
  line-height: 50px;
  color: #999999;
}
.learning-container .learning-content .learning-item .progress {
  width: 180px;
  height: 100%;
  padding: 20px;
  text-align: right;
  font-weight: bold;
}
.learning-container .learning-content .learning-item .progress .status {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: seagreen;
}
.learning-container .learning-content .learning-item .progress .duration {
  height: 30px;
  line-height: 30px;
  color: #333333;
}
.learning-container .learning-content .learning-item .btn-right {
  text-align: center;
  width: 100px;
}
.learning-container .learning-content .learning-item .delete {
  width: 50px;
  visibility: hidden;
}
</style>
