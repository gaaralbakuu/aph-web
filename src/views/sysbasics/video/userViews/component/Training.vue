<template>
  <div class="learning-container">
    <!-- <div class="learning-filter">
      <div class="filter-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <div><b style="color: #409fee;">{{showObj.type}}</b><i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <template #dropdown><el-dropdown-menu>
            <el-dropdown-item v-for="(item,index) in paramsObj.type" :key="index" :divided="index>0"
              :command="'type-'+item.value+'-'+item.label">
              {{item.label}}
            </el-dropdown-item>
          </el-dropdown-menu></template>
        </el-dropdown>
      </div>
      <div class="filter-item">
        <el-dropdown trigger="click" @command="handleCommand">
          <div><b style="color: #409fee;">{{showObj.urgent}}</b><i class="el-icon-arrow-down el-icon--right"></i></div>
          <template #dropdown><el-dropdown-menu>
            <el-dropdown-item v-for="(item,index) in paramsObj.urgent" :key="index" :divided="index>0"
              :command="'urgent-'+item.value+'-'+item.label">
              {{item.label}}
            </el-dropdown-item>
          </el-dropdown-menu></template>
        </el-dropdown>
      </div>
    </div> -->

    <el-menu class="horizontal-menu" :default-active="showObj.activeName" mode="horizontal" @select="handleSelect"
      active-text-color="#409fee">
      <el-menu-item index="first">{{ c.all}}</el-menu-item>
     <!-- <el-menu-item index="first">{{ l.notComplete}}</el-menu-item>
      <el-menu-item index="second">{{ l.completed}}</el-menu-item>
      <el-menu-item index="third">{{ l.expired}}</el-menu-item>
      <el-menu-item index="four">{{ l.historyCompleted}}</el-menu-item> -->
    </el-menu>

    <div class="learning-content">
      <div class="learning-item" v-for="(item,index) in trainingObj.list" :key="index">
        <div class="cover">
          <img class="auto-img" :src="$api.videoServer+'/'+item.thumbnail_path" height="100px">
        </div>
        <div class="content">
          <div class="course-name">
            {{item.name_zh}}
          </div>
          <div class="course-info">
            <span>{{ l.introduce}}：{{item.description}}</span>
          </div>
          <div class="status">
            {{ l.trainTime}}：{{item.start_date.substr(0,10) + ' - ' + item.end_date.substr(0,10)}}
          </div>
        </div>
        <div class="btn-right">
          <el-button type="primary"  round @click="checkDetail(item)">{{ l.check}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'videoUserTraining',
    data() {
      return {
        showObj: {
          activeName: 'first',
          type: this.c.all,
          urgent: this.l.urgent
        },
        trainingObj: {
          query: {
            page: 1,
            pageSize: 10,
            name: "",
            is_valid: ''
          },

          list: []
        },
        query: {
          timeSortingDsec: true
        },
        paramsObj: {
          urgent: [{
              label: this.l.urgent,
              value: "urgent"
            },
            {
              label: this.l.newest,
              value: "newest"
            }
          ],
          type: [{
              label: this.c.all,
              value: "all"
            },
            {
              label:this.l.course,
              value: "course"
            },
            {
              label: this.l.topic,
              value: "topic"
            },
            {
              label: this.l.training,
              value: "training"
            },
            {
              label: this.l.exam,
              value: "exam"
            },
          ]
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
      checkDetail(v) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'trainingDetail',
          query: {
            id: v.id,
            class_id:v.class_id
          }
        }).href;
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank');
      },
      getTrainingList() {
        this.$request(this.$api.videoServer + '/Video/VideoTrain/getMyTrain', {
            page: 1,
            pageSize: 999
          })
          .then(r => {
            if (r.httpCode == 200) {
              this.trainingObj.list = r.data.list
              this.trainingObj.total = r.data.total
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

    },
    mounted() {
      this.getTrainingList()
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
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
.learning-container .learning-content .learning-item .content .course-info {
  height: 40px;
  line-height: 40px;
  color: #999999;
}
.learning-container .learning-content .learning-item .content .status {
  color: #999999;
}
.learning-container .learning-content .learning-item .btn-right {
  text-align: center;
  width: 100px;
}
</style>
