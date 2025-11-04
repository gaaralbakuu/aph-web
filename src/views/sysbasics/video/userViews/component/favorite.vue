<template>
  <div class="learning-container">
    <div class="learning-filter">
      <!-- <div class="filter-item" @click="query.timeSortingDsec = !query.timeSortingDsec">
        收藏学习时间
        <i :class="query.timeSortingDsec ? 'el-icon-bottom' : 'el-icon-top'" style="color: #409fee; font-weight: 800"
          @click="sortClick"></i>
      </div> -->
    </div>

    <el-menu class="horizontal-menu" :default-active="showObj.activeName" mode="horizontal" @select="handleSelect"
      active-text-color="#409fee">
      <el-menu-item index="first">{{$c.all}}</el-menu-item>
      <!-- <el-menu-item index="second">课程</el-menu-item> -->
      <!-- <el-menu-item index="third">专题</el-menu-item> -->
    </el-menu>

    <div class="learning-content">
      <div class="learning-item" v-for="(item, index) in favoriteList.list" :key="index">
        <div class="cover">
          <img class="auto-img" :src="$api.videoServer + '/' + item.thumbnail_path" height="100px" />
        </div>
        <div class="content">
          <div class="course-name">{{ item.name_label }}</div>
          <div class="course-info">
            <span>{{ item.description }}</span><!-- <span>|</span><span>上次学习时间：2024-09-19 16:59</span> -->
          </div>
        </div>
        <!-- <div class="progress">
          <div class="status">学习中假</div>
          <div class="duration">10:36假</div>
        </div> -->

        <div class="delete">
          <i class="el-icon-delete" @click="deleteClick(item, index)"></i>
        </div>
        <div class="btn-right">
          <el-button type="primary" round @click="btnClick(item)">{{$l.goStudy}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'videoUserFavorite',
    data() {
      return {
        showObj: {
          activeName: 'first',
        },
        query: {
          timeSortingDsec: true,
        },
        favoriteList: {
          total: 0,
          page: 1,
          pageSize: 15,
          list: [],
        },
      }
    },
    methods: {
      getlist() {
        this.$request(this.$api.videoServer + '/Video/Favorite/getlist', {
          page: this.favoriteList.page,
          pageSize: this.favoriteList.pageSize,
        }).then((r) => {
          // this.favoriteList.list = r.data.list
          this.favoriteList.list = Array.from(
            new Map(r.data.list.map((item) => [item.id, item])).values()
          )

          this.favoriteList.total = r.data.total
          console.log(r)
        })
      },
      handleSelect(tab) {
        console.log(tab)
      },
      btnClick(item) {
        // 获取目标路由的完整 URL
        let routeUrl = this.$router.resolve({
          name: 'videoPlay',
          query: {
            course_primary_id: item.id,
          },
        }).href
        // 使用 window.open 打开新窗口
        window.open(routeUrl, '_blank')
      },
      deleteClick(item, index) {
        let courseObj = {
          course_id: item.course_id,
        }
        this.$confirm(this.$l.deleteTips, this.$l.myCollection, {
          confirmButtonText: this.$c.confirm,
          cancelButtonText: this.$c.cancel,
          type: 'warning',
        }).then(() => {
          this.$request(
              this.$api.videoServer + '/Video/Favorite/addOrRemoveFavorite',
              courseObj,
              'post'
            )
            .then((r) => {
              console.log(r)
              this.getlist()
            })
            .catch(() => {})
        })
      },
      sortClick() {
        console.log('aaa')
        this.favoriteList.list = this.favoriteList.list.sort(
          (a, b) => a.create_time - b.create_time
        )
      },
    },
    mounted() {
      this.getlist()
    },
  }
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
  width: 100px;
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
