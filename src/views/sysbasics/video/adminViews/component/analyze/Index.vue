<template>
  <div class="platform-container">
    <div class="platform-filter">
      <el-form inline>
        <el-form-item :label="l.timeLabel">
          <el-date-picker value-format="yyyy/MM" format='yyyy年MM月' v-model="queryMonth" type="month" :clearable="false"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="platform-content">
      <div class="login">
        <div class="item">
          <div class="l_label" style="color: #9f8254;background-color: #faebcc;">{{ l.totalStudyTime }}</div>
          <div class="l_value" style="color: #8a6d47;">{{ formatSecondsToTime(platformData.totalTime) }}</div>
        </div>
        <div class="item">
          <div class="l_label" style="color: #d67171;background-color: #f2dede;">{{ l.averageStudyTime }}</div>
          <div class="l_value" style="color: #ad5988;">{{ formatSecondsToTime(platformData.averageTime) }}</div>
        </div>
        <div class="item">
          <div class="l_label" style="color: #608598;background-color: #d9edf7;">{{ l.totalStudents }}</div>
          <div class="l_value" style="color: #46779a;">{{ platformData.loginPerson }}</div>
        </div>
        <div class="item">
          <div class="l_label" style="color: #3c763d;background-color: #e6fcdd;">{{ l.totalSessions }}</div>
          <div class="l_value" style="color: #517e41;">{{ platformData.loginCount }}</div>
        </div>
      </div>
      <div class="barChart" id="dayChart"></div>
      <div class="barChart" id="monthChart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue';
import * as echarts from 'echarts';
import { useLocalI18n } from '@/composables/useLocalI18n';

const { l, c } = useLocalI18n('videoAdminAnalyzePlatform');
const { proxy } = getCurrentInstance();

const queryMonth = ref('');
const dateObj = reactive({
  year: 0,
  month: 0,
  maxDate: 0
});
const platformData = reactive({
  totalTime: 0,
  averageTime: 0,
  loginPerson: 0,
  loginCount: 0
});

const dayChartOption = reactive({
  title: {
    text: l.dailyStudy,
    x: "center",
    top: 10
  },
  grid: {
    left: '3%',
    right: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    },
    formatter: (params) => {
      const data = params[0];
      const seconds = data.value[1];

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      let formattedTime = '';
      if (hours > 0) {
        formattedTime += hours+l.hours;
      }
      if (minutes > 0 || hours > 0) {
        formattedTime += minutes+l.mins;
      }
      formattedTime += secs+l.seconds;

      return `${data.name}<br/>${l.totalStudyTime}: ${formattedTime}`;
    }
  },
  xAxis: {
    type: "category"
  },
  yAxis: [{
    type: 'value',
    name: l.timeLabel,
    position: 'left',
  }],
  dataZoom: [{
    type: "slider",
  }],
  dataset: {
    source: [
      ["Date", "PlayTime"]
    ]
  },
  series: [{
    type: "bar",
    yAxisIndex: 0
  }]
});

const monthChartOption = reactive({
  title: {
    text: l.monthlyStudy,
    x: "center",
    top: 10
  },
  grid: {
    left: '3%',
    right: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    },
    formatter: (params) => {
      const data = params[0];
      const seconds = data.value[1];

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      let formattedTime = '';
      if (hours > 0) {
        formattedTime += hours+l.hours;
      }
      if (minutes > 0 || hours > 0) {
        formattedTime += minutes+l.mins;
      }
      formattedTime += secs+l.seconds;

      return `${data.name}<br/>${l.totalStudyTime}: ${formattedTime}`;
    }
  },
  xAxis: {
    type: "category"
  },
  yAxis: [{
    type: 'value',
    name: l.timeLabel,
    position: 'left',
  }],
  dataZoom: [{
    type: "slider",
  }],
  dataset: {
    source: [
      ["Date", "PlayTime"]
    ]
  },
  series: [{
    type: "bar",
    yAxisIndex: 0
  }]
});

watch(queryMonth, (newVal, oldVal) => {
  if (newVal) {
    dateObj.year = Number(newVal.split('/')[0]);
    dateObj.month = Number(newVal.split('/')[1]);
    dateObj.maxDate = new Date(dateObj.year, dateObj.month, 0).getDate();
    getMonthLearningTime();
    getDayChartData();

    let oldYear = oldVal ? Number(oldVal.split('/')[0]) : 0;
    if (dateObj.year !== oldYear) {
      getMonthChartData();
    }
  }
});

const initQueryMonth = () => {
  const date = new Date();
  dateObj.year = date.getFullYear();
  dateObj.month = date.getMonth() + 1;
  dateObj.maxDate = new Date(dateObj.year, dateObj.month, 0).getDate();
  queryMonth.value = `${dateObj.year}/${String(dateObj.month).padStart(2, '0')}`;
};

const getMonthLearningTime = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/AnalyzeLearnTime', {
    analyze_type: 1,
    start_date: queryMonth.value + '/01',
    end_date: queryMonth.value + '/' + dateObj.maxDate,
    page: 1,
    pageSize: 999
  }).then(r => {
    if (r.status && r.data.length > 0) {
      platformData.totalTime = r.data[0].TotalPlayTime;
      getLoginNumber(0);
      getLoginNumber(1);
    } else {
      platformData.totalTime = 0;
      platformData.averageTime = 0;
      platformData.loginPerson = 0;
      platformData.loginCount = 0;
    }
  });
};

const getDayChartData = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/AnalyzeLearnTime', {
    analyze_type: 0,
    start_date: queryMonth.value + '/01',
    end_date: queryMonth.value + '/' + dateObj.maxDate,
    page: 1,
    pageSize: 999
  }).then(r => {
    if (r.status) {
      dayChartOption.dataset.source = [["Date", "PlayTime"]];
      if (r.data.length > 0) {
        r.data.forEach(i => {
          dayChartOption.dataset.source.push([i.Date, i.TotalPlayTime]);
        });
      }
      initDayChart();
    }
  });
};

const getMonthChartData = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/AnalyzeLearnTime', {
    analyze_type: 1,
    start_date: dateObj.year + '/01/01',
    end_date: dateObj.year + '/12/31',
    page: 1,
    pageSize: 999
  }).then(r => {
    if (r.status) {
      monthChartOption.dataset.source = [["Date", "PlayTime"]];
      if (r.data.length > 0) {
        r.data.forEach(i => {
          monthChartOption.dataset.source.push([i.Date, i.TotalPlayTime]);
        });
      }
      initMonthChart();
    }
  });
};

const getLoginNumber = (type) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/AnalyzeNumber', {
    analyze_type: type,
    start_date: queryMonth.value + '/01',
    end_date: queryMonth.value + '/' + dateObj.maxDate,
  }).then(r => {
    if (r.status) {
      if (type === 0) {
        platformData.loginPerson = r.data.num;
      }
      if (type === 1) {
        platformData.loginCount = r.data.num;
        platformData.averageTime = parseInt(platformData.totalTime / r.data.num);
      }
    }
  });
};

const initDayChart = () => {
  const myChart = echarts.init(document.getElementById("dayChart"));
  myChart.clear();
  // 动态更新标题和 y 轴名称
  dayChartOption.title.text = `${dateObj.month}${l.month}${l.dailyStudy}`;
  dayChartOption.yAxis[0].name = l.timeLabel;
  myChart.setOption(dayChartOption);
};

const initMonthChart = () => {
  const myChart = echarts.init(document.getElementById("monthChart"));
  myChart.clear();
  // 动态更新标题和 y 轴名称
  monthChartOption.title.text = `${dateObj.year}${l.year}${l.monthlyStudy}`;
  monthChartOption.yAxis[0].name = l.timeLabel;
  myChart.setOption(monthChartOption);
};

const formatSecondsToTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '0分0秒';
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}小时${mins}分${secs}秒`;
  } else {
    return `${mins}分${secs}秒`;
  }
};

onMounted(() => {
  initQueryMonth();
});
</script>

<style scoped>
.platform-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.platform-container .platform-filter {
  width: 100%;
  height: 60px;
  padding: 14px;
  border-bottom: 1px #ddd solid;
  display: flex;
  justify-content: space-between;
  background-color: white;
}
.platform-container .platform-content {
  padding: 20px;
}
.platform-container .platform-content .login {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.platform-container .platform-content .login .item {
  width: 23%;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #efefef;
}
.platform-container .platform-content .login .item .l_label {
  text-indent: 1em;
  height: 50px;
  line-height: 50px;
}
.platform-container .platform-content .login .item .l_value {
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  text-align: center;
}
.platform-container .platform-content .barChart {
  width: 100%;
  height: 500px;
  background-color: white;
  margin-top: 40px;
}
</style>
