<template>
  <div ref="pie_dv" style="width: 100%;height: 200px;"></div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  name: "myChart",
  data() {
    return {
    };
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.pie_dv).resize;
  },
  props: {
    left: {
      type: String,
      default: '50%',
    },
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
      let that = this
      var myChart = this.$echarts.init(this.$refs.pie_dv)
      myChart.setOption({
        color: this.color,
        grid: {
          left: '2%',
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
            left: this.left,
            y: 'center',
            icon: "circle",
            textStyle:{
              color: '#333333',
              fontWeight: 'bold',
            },
            formatter(name){
              let total = 1
              let arrdetail = []
              that.series.map(v => {
                total += Number(v.value)
              })
              that.series.map(v => {
                if (name == v.name) {
                  if(v.name.length > 31) {
                    arrdetail.push(
                      v.name.substring(0,22)+ '...' + ' ' + v.value + '次,  ' + that.t('占比', 'WAF.zb') + (v.value/total*100).toFixed(1) + '%'
                    )
                  } else {
                     arrdetail.push(
                      v.name + ' ' + v.value + '次,  ' + that.t('占比', 'WAF.zb') + (v.value/total*100).toFixed(1) + '%'
                    )
                  }
                }
              })
             return arrdetail.join('\n')
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