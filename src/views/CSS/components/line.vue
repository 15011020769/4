<template>
  <div id="myChart" style="width: 100%;height: 400px;"></div>
</template>

<script>
export default {
  name: "myChart",
  data() {
    return {};
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(document.getElementById("myChart")).resize;
  },
  props: {
    color: {
      type: String,
      default: "#2d70f6"
    },
    tooltip: {
      type: Object,
      default: function() {
        return {trigger: 'axis'}
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
      type: String,
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
    legendText() {
      this.legendText = val;
      this.echart();
    }
  },
  methods: {
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
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    echart() {
      var myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        color: this.color,
        tooltip: this.tooltip,
        legend: {
          data: [this.legendText],
          bottom: 0,
          orient: 'vertical',
          x: 'left',
        },
        xAxis: {
          type: "category",
          axisLabel: {
            color: '#B0B0B0',
            fontSize: 10,
          },
          axisTick: {
            lineStyle: {
              color: '#B0B0B0',
            }
          },
          axisLine: {
            lineStyle: {
              color: '#B0B0B0'
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
            color: '#B0B0B0',
            fontSize: 10,
            verticalAlign: 'top'
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
                lineStyle:{
                  width:3//设置线条粗细
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