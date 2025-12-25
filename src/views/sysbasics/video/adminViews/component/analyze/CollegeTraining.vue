<template>
  <div class="college-container">
    <div class="college-filter">
      <el-form inline>
        <el-form-item :label="l.time">
          <el-date-picker value-format="yyyy/MM" v-model="queryMonth" type="daterange"
            :clearable="false"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="college-content">
      <div class="upper">
        <div class="barChart" id="barChart"></div>
      </div>
      <div class="bottom">
        <el-table :data="collegeObj.list" highlight-current-row :row-class-name="tableRowClassName">
          <el-table-column prop="name_label" :label="l.collegeName"></el-table-column>
          <el-table-column prop="train_num" :label="l.trainingCount"></el-table-column>
          <el-table-column prop="class_num" :label="l.classCount"></el-table-column>
          <el-table-column prop="going_class_num" :label="l.ongoingClassCount"></el-table-column>
          <el-table-column prop="finished_num" :label="l.finishedClassCount"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue';
import * as echarts from 'echarts';
import { useLocalI18n } from '@/composables/useLocalI18n';

const { l, c } = useLocalI18n('videoAnalyzeCollegeTraining');
const { proxy } = getCurrentInstance();

const queryMonth = ref('');
const collegeObj = reactive({
  list: []
});

const barChartOption = reactive({
  title: {
    text: l.title,
    x: 'center',
    top: 10
  },
  grid: {
    left: '3%',
    right: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category'
  },
  yAxis: [{
      type: 'value',
      name: l.classCount,
      position: 'left'
    },
    {
      type: 'value',
      name: l.classCount,
      position: 'right'
    }
  ],
  dataZoom: [{
    type: 'slider'
  }],
  dataset: {
    source: [
      [l.collegeName, l.trainingCount, l.classCount, l.ongoingClassCount, l.finishedClassCount]
    ]
  },
  series: [{
      type: 'bar',
      yAxisIndex: 0
    },
    {
      type: 'bar',
      yAxisIndex: 1
    },
    {
      type: 'bar',
      yAxisIndex: 1
    },
    {
      type: 'bar',
      yAxisIndex: 1
    }
  ]
});

watch(queryMonth, (newVal) => {
  if (newVal) {
    getCollegeData();
  }
});

const initQueryMonth = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let maxDate = new Date(year, month, 0).getDate();
  queryMonth.value = [`${year}/01/01`, `${year}/${month}/${maxDate}`];
};

const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 === 0 ? '' : 'warning-row';
};

const getCollegeData = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/GetCollegeTrainAnalyze', {
    college_id: '',
    start_date: queryMonth.value[0],
    end_date: queryMonth.value[1],
    page: 1,
    pageSize: 999
  }).then(r => {
    if (r.status && r.data.length > 0) {
      collegeObj.list = r.data;
      barChartOption.dataset.source = [
        [l.collegeName, l.trainingCount, l.classCount, l.ongoingClassCount, l.finishedClassCount]
      ];
      r.data.forEach(i => {
        barChartOption.dataset.source.push([
          i.name_label,
          i.train_num,
          i.class_num,
          i.going_class_num,
          i.finished_num
        ]);
      });
      initDayChart();
    } else {
      collegeObj.list = [];
      barChartOption.dataset.source = [
        [l.collegeName, l.trainingCount, l.classCount, l.ongoingClassCount, l.finishedClassCount]
      ];
    }
  });
};

const initDayChart = () => {
  const myChart = echarts.init(document.getElementById('barChart'));
  myChart.clear();
  // 动态更新标题和 y 轴名称
  barChartOption.title.text = l.title;
  barChartOption.yAxis[0].name = l.classCount;
  barChartOption.yAxis[1].name = l.classCount;
  myChart.setOption(barChartOption);
};

onMounted(() => {
  initQueryMonth();
});
</script>

<style scoped>
.college-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.college-container .college-filter {
  width: 100%;
  height: 60px;
  padding: 14px;
  border-bottom: 1px #ddd solid;
  display: flex;
  justify-content: space-between;
  background-color: white;
}
.college-container .college-content {
  padding: 20px;
}
.college-container .college-content .upper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 500px;
}
.college-container .college-content .upper .barChart {
  width: 100%;
  height: 100%;
  background-color: white;
}
.college-container .college-content .bottom {
  margin-top: 40px;
}
</style>
