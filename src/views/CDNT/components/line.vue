<template>
  <div ref="line_dv" style="width: 100%;height: 400px;"></div>
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
    isShowPeak: {
      type: Boolean,
      default: false
    },
    peak: {
      type: Number,
    },
    color: {
      type: Array,
      default: () => []
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
    series1: {
      type: Array,
      default: () => []
    },
    series2: {
      type: Array,
      default: () => []
    },
    legendText: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    isShowPeak(val) {
      this.isShowPeak = val
      this.echart();
    },
    peak(val) {
      this.peak = val
      this.echart()
    },
    tooltip(val) {
      this.tooltip = val
      this.echart();
    },
    xAxis(val) {
      this.xAxis = val;
      this.echart();
    },
    series1(val) {
      this.series1 = val;
      this.echart();
    },
     series2(val) {
      this.series2 = val;
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
      let that = this
      myChart.setOption({
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '6%',
          containLabel: true
        },
        tooltip: this.tooltip,
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
            data: this.series1,
            type: "line",
            smooth: true,
            symbol: "none",
            markLine: {
              symbol:"none",
              data: this.isShowPeak ? [{
                yAxis: this.peak,
                lineStyle: {color: 'red'}
              }] : '',
              label: {
                normal: {
                  show: true,
                  position: 'middle',
                  color: '#000',
                  formatter: function (params) {
                    let  str = "峰值寬頻:" + that.peak + "Mbps";                                            
                      return str
                  },
                }
              },
            },
            itemStyle: {
              normal: {
                color: this.color[0],
                lineStyle:{
                  width:2//设置线条粗细
                }
              }
            }
          },
          {
            name: this.legendText[1],
            data: this.series2,
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                color: this.color[1],
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