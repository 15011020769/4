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
    series3: {
      type: Array,
      default: () => []
    },
    legendText: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tooltip(val) {
      console.log(val)
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
     series3(val) {
      this.series3 = val;
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
          left: '4%',
          right: '6%',
          bottom: '10%',
          top: '14%',
          containLabel: true
        },
        tooltip: this.tooltip,
        // tooltip: {
        //   trigger: 'axis',
        //   formatter(params) {
        //     var relVal = params[0].name;  
        //     for (var i = 0, l = params.length; i < l; i++) {
        //       if(params[i].seriesName == "上行頻寬" || params[i].seriesName == "下行帶寬") {
        //         relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value+"bps";
        //       }
        //       relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value+"次";
        //     }
        //     return relVal;  
        //   }
        // },
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
          {
            name: this.legendText[2],
            data: this.series3,
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                color: this.color[2],
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