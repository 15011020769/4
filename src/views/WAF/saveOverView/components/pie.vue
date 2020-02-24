<template>
  <div ref="pie_dv" style="width: 100%;height: 200px;"></div>
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
    window.onresize = this.$echarts.init(this.$refs.pie_dv).resize;
  },
  props: {
    color: {
      type: Array,
      default: () => []
    },
    // tooltip: {
    //   type: Object,
    //   default: function() {
    //     return {trigger: 'axis'}
    //   }
    // },
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
      var myChart = this.$echarts.init(this.$refs.pie_dv)
      myChart.setOption({
        color: this.color,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
            data: this.legendText,
            orient: 'vertical',
            // right: 30,
            left: '60%',
            y: 'center',
            icon: "circle",
            textStyle:{
              color: '#333333',
              fontWeight: 'bold',
            },
        },
        series: [
          {
            name: "",
            data: this.series,
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
          }
        ]
      });
    }
  }
};

</script>