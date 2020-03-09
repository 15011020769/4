<template>
  <div>
    <el-row style="margin-top: 8px">
      <el-switch
        v-model="toogle"
        active-text="缩放"
        @change="datazoom"
        class="topSwitch"
      >
      </el-switch>
      <el-button @click="reset" size="mini">重置</el-button>
    </el-row>
    <div ref="line_dv" style="width: 100%;height: 400px;"></div>
  </div>
</template>

<script>
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/toolbox";
export default {
  name: "myChart",
  data() {
    return {
      toogle: false,
    };
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.line_dv).resize;
  },
  props: {
    color: {
      type: String,
      default: "#2d70f6"
    },
    tooltip: {
      type: Object,
      default: function() {
        return { trigger: "axis" };
      }
    },
    xAxis: {
      type: Array,
      default: () => []
    },
    series: {
      type: Array,
      default: () => []
    },
    legendText: {
      type: String
    }
  },
  watch: {
    xAxis(val) {
      this.xAxis = val;
      this.echart();
    },
    series(val) {
      this.series = val;
      this.echart();
    },
    legendText(val) {
      this.legendText = val;
      this.echart();
    }
  },
  methods: {
    datazoom() {
      var myChart = this.$echarts.init(this.$refs.line_dv);
      myChart.dispatchAction({
        type: "takeGlobalCursor",
        key: "dataZoomSelect",
        dataZoomSelectActive: this.toogle
      })
      console.log(1111)
    },
    reset() {
      var myChart = this.$echarts.init(this.$refs.line_dv);
      myChart.dispatchAction({
          type: 'restore'
      })
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); // 注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    echart() {
      // var myChart = this.$echarts.init(document.getElementById("myChart"));
      var myChart = this.$echarts.init(this.$refs.line_dv);
      myChart.setOption({
        color: this.color,
        toolbox: {
          left: 26,
          itemGap: 24,
          itemSize: 0,
          iconStyle:{
            normal:{
              // color:'white',//设置颜色
            }
          },
           emphasis:{//触发时
              iconStyle:{
                borderColor:"#006eff"//图形的描边颜色
              }
            },
          feature: {
            dataZoom: {
              show: true,
              yAxisIndex: 'none'
            },
            restore: {
              show: true,
              title: '重置',
            },
          }
        },
        tooltip: this.tooltip,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          top: "6%",
          containLabel: true
        },
        legend: {
          data: [this.legendText],
          bottom: 0,
          icon: "rect"
        },
        xAxis: {
          type: "category",
          axisLabel: {
            color: "#B0B0B0",
            fontSize: 10
          },
          axisTick: {
            lineStyle: {
              color: "#B0B0B0"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#B0B0B0"
            }
          },
          data:
            this.xAxis.length != 0
              ? this.xAxis
              : [
                  this.getDay(4),
                  this.getDay(3),
                  this.getDay(2),
                  this.getDay(1),
                  this.getDay(0)
                ]
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#B0B0B0",
            fontSize: 10,
            verticalAlign: "top"
          }
        },
        series: [
          {
            name: this.legendText,
            data: this.series.length != 0 ? this.series : [0, 0, 0, 0, 0],
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                color: this.color,
                lineStyle: {
                  width: 3 // 设置线条粗细
                }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang='scss' scoped>
::v-deep button {
  padding: 8px 22px;
  &:hover {
    background-color: #f2f2f2;
    border-color: #ddd;
    color: #000;
  }
  &:focus {
    background-color: #f2f2f2;
    border-color: #ddd;
    color: #000;
  }
}
  .topSwitch {
    margin-left:40px;
    margin-right: 20px;
  }
</style>
