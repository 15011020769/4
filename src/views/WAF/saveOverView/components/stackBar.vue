<template>
  <div ref="bar_dv" style="width: 100%;height: 250px;"></div>
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
          bottom: '6%',
          top: '14%',
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
          type: "value",
          boundaryGap: true,
          axisLabel: {
            color: '#606060',
            fontSize: 11,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine:{show: false},
        },
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#C0D0E0'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#606060',
            fontSize: 10,
            verticalAlign: 'top',
            interval:0,//横轴信息全部显示
          },
          data:
            this.xAxis
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
                      position: 'right', //在上方显示
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