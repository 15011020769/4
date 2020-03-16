<template>
  <div ref="pie_dv" style="width: 100%;height: 400px;"></div>
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
    totalNumber: {
      type: Number,
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
    series(val) {
      this.series = val;
      this.echart();
    },
    legendText(val) {
      this.legendText = val;
      this.echart();
    },
    totalNumber(val) {
      this.totalNumber = val
      this.echart()
    } 
  },
  methods: {
    echart() {
      let that = this
      var myChart = this.$echarts.init(this.$refs.pie_dv)
      myChart.setOption({
        color: this.color,
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter(params) {
            let res='<div><p>'+params.name+'</p></div>' +
            '<p>' + params.name + ': ' + params.percent.toFixed(2) + '% ' + params.value+ '次' + '</p>'
            return res
          }
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
            center: ['50%', '50%'],
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter() {
                  return '错误码总数' + '\r\n' +  that.totalNumber + '次'
                },
                textStyle: {
                  color: '#333333',
                  fontSize: 14,
                  lineHeight: 25,
                }
              },
               emphasis: {
                  show: true,
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