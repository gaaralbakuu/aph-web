<template>
  <div class="college-container">
    <div class="college-filter">
      <el-form inline>
        <el-form-item :label="$l.time">
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
          <el-table-column prop="name_label" :label="$l.collegeName"></el-table-column>
          <el-table-column prop="train_num" :label="$l.trainingCount"></el-table-column>
          <el-table-column prop="class_num" :label="$l.classCount"></el-table-column>
          <el-table-column prop="going_class_num" :label="$l.ongoingClassCount"></el-table-column>
          <el-table-column prop="finished_num" :label="$l.finishedClassCount"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';

  export default {
    name: 'videoAnalyzeCollegeTraining',
    data() {
      return {
        queryMonth: '',

        collegeObj: {
          list: []
        },

        barChartOption: {
          title: {
            text: this.$l.title,
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
              name: this.$l.classCount,
              position: 'left'
            },
            {
              type: 'value',
              name: this.$l.classCount,
              position: 'right'
            }
          ],
          dataZoom: [{
            type: 'slider'
          }],
          dataset: {
            source: [
              [this.$l.collegeName, this.$l.trainingCount, this.$l.classCount, this.$l.ongoingClassCount, this.$l
                .finishedClassCount
              ]
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
        }
      }
    },

    watch: {
      queryMonth(newVal) {
        if (newVal) {
          this.getCollegeData();
        }
      }
    },

    methods: {
      initQueryMonth() {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let maxDate = new Date(year, month, 0).getDate();
        this.queryMonth = [`${year}/01/01`, `${year}/${month}/${maxDate}`];
      },

      tableRowClassName({
        row,
        rowIndex
      }) {
        return rowIndex % 2 === 0 ? '' : 'warning-row';
      },

      getCollegeData() {
        this.$request(this.$api.videoServer + '/Video/VideoAnalyze/GetCollegeTrainAnalyze', {
          college_id: '',
          start_date: this.queryMonth[0],
          end_date: this.queryMonth[1],
          page: 1,
          pageSize: 999
        }).then(r => {
          if (r.status && r.data.length > 0) {
            this.collegeObj.list = r.data;
            this.barChartOption.dataset.source = [
              [this.$l.collegeName, this.$l.trainingCount, this.$l.classCount, this.$l.ongoingClassCount, this.$l
                .finishedClassCount
              ]
            ];
            r.data.forEach(i => {
              this.barChartOption.dataset.source.push([
                i.name_label,
                i.train_num,
                i.class_num,
                i.going_class_num,
                i.finished_num
              ]);
            });
            this.initDayChart();
          } else {
            this.collegeObj.list = [];
            this.barChartOption.dataset.source = [
              [this.$l.collegeName, this.$l.trainingCount, this.$l.classCount, this.$l.ongoingClassCount, this.$l
                .finishedClassCount
              ]
            ];
          }
        });
      },

      initDayChart() {
        const myChart = echarts.init(document.getElementById('barChart'));
        myChart.clear();
        // 动态更新标题和 y 轴名称
        this.barChartOption.title.text = this.$l.title;
        this.barChartOption.yAxis[0].name = this.$l.classCount;
        this.barChartOption.yAxis[1].name = this.$l.classCount;
        myChart.setOption(this.barChartOption);
      }
    },

    mounted() {
      this.initQueryMonth();
    }
  }
</script>

<style scoped lang="scss">
  .college-container {
    width: 100%;
    height: 100%;
    overflow: auto;

    .college-filter {
      width: 100%;
      height: 60px;
      padding: 14px;
      border-bottom: 1px #ddd solid;
      display: flex;
      justify-content: space-between;
      background-color: white;
    }

    .college-content {
      padding: 20px;

      .upper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 500px;

        .barChart {
          width: 100%;
          height: 100%;
          background-color: white;
        }
      }

      .bottom {
        margin-top: 40px;
      }
    }
  }
</style>
