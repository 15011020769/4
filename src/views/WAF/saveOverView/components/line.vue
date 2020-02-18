<template>
  <div ref="line_dv" style="width: 100%;height: 300px;"></div>
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
    window.onresize = this.$echarts.init(this.$refs.line_dv).resize;
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
      type: Array,
      default: () => []
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
      var myChart = this.$echarts.init(this.$refs.line_dv)
      myChart.setOption({
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
            data: this.legendText,
            bottom: 0,
            icon: 'rect',
            padding: [50, 0 , 0, 0]
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
            this.xAxis
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
            name: this.legendText[0],
            data: this.series[0],
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                // color: this.color,
                lineStyle:{
                  width:2//设置线条粗细
                }
              }
            }
          },
          {
            name: this.legendText[1],
            data: this.series[1],
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                // color: this.color,
                lineStyle:{
                  width:2//设置线条粗细
                }
              }
            }
          },
          {
            name: this.legendText[2],
            data: this.series[2],
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                // color: this.color,
                lineStyle:{
                  width:2//设置线条粗细
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