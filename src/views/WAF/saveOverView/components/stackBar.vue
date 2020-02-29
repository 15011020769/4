<template>
  <div ref="bar_dv" style="width: 100%;height: 200px;"></div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  name: "myChart",
  data() {
    return {};
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.bar_dv).resize;
  },
  props: {
    // color: {
    //   type: String,
    //   default: "#2d70f6"
    // },
    // tooltip: {
    //   type: Object,
    //   default: function() {
    //     return {trigger: 'axis'}
    //   }
    // },
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
    legendText(val) {
      this.legendText = val;
      this.echart();
    }
  },
  methods: {
    echart() {
      var myChart = this.$echarts.init(this.$refs.bar_dv)
      myChart.setOption({
        color: ["#006eff"],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',       // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter(val) {
            return val.name + '<br/>' + val.marker + val.seriesName + ':' + val.data
          },
        },
        legend: {
          data: this.legendText,
          bottom: 0,
          icon: 'rect',
          padding: [50, 0 , 0, 0]
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLabel: {
            color: '#606060',
            fontSize: 11,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#C0D0E0'
            }
          },
          data:
            this.xAxis
        },
        yAxis: {
          type: "value",
          splitLine:{show: false},
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#606060',
            fontSize: 10,
            verticalAlign: 'top'
          }
        },
        series: [
          {
            name: this.legendText,
            data: this.series,
            type: "bar",
            smooth: true,
            symbol: "none",
            barWidth: 20,
            // barMaxWidth: 30
            itemStyle: {        //上方显示数值
              normal: {
                  label: {
                      show: true, //开启显示
                      position: 'top', //在上方显示
                      textStyle: { //数值样式
                          color: 'black',
                          fontSize: 11
                      }
                  }
              }
            }
          },
        ]
      });
    }
  }
};

</script>