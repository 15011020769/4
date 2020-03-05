<template>
  <div ref="pie_dv" style="width: 100%;height: 240px;"></div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import {
    DESCRIBE_BOT_AGGREGATE_DOMAINSTAT,
    DESCRIBE_BOT_TYPE_STAT,
    DESCRIBE_BOT_ACTION_STAT,
    DESCRIBE_BOT_STATISTIC_POINTS,
    DESCRIBE_PEAK_POINTS,
  } from '@/constants'
export default {
  name: "myChart",
  data() {
    return {
      seriesPieAction: [], // BOT类型饼图
      colorPie: ['#ff9d00', '#e54545', '#2277da', '#f5736e'],
      legendTextPieAction: ['验证码', '拦截', '监控', '重定向'],
    };
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.pie_dv).resize;
    this.getBotAction(this.domain)
  },
  props: {
    domain: String,
    startTime: Number,
    endTime: Number
  },
  watch: {
    domain(val) {
      this.domain = val
      this.getBotAction(val)
    },
    startTime(val) {
      this.startTime = val
    },
    endTime(val) {
      this.endTime = val
    },
    seriesPieAction(val) {
      this.seriesPieAction = val
      this.echart()
    }
  },
  methods: {
    // Bot_V2 获取bot动作统计
    getBotAction(domain) {
     const params = {
        Version: "2018-01-25",
        StartTs: this.startTime,
        EndTs: this.endTime,
        Domain: domain,
      }
      this.axios.post(DESCRIBE_BOT_ACTION_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPieAction, 0, {value: Response.Captcha, name: '验证码'})
          this.$set(this.seriesPieAction, 1, {value: Response.Intercept, name: '拦截'})
          this.$set(this.seriesPieAction, 2, {value: Response.Monitor, name: '监控'})
          this.$set(this.seriesPieAction, 3, {value: Response.Redirect, name: '重定向'})
        }, {}, '', (error) => {
          this.seriesPieAction = []
        })
      })
    },
    echart() {
      let that = this
      var myChart = this.$echarts.init(this.$refs.pie_dv)
      myChart.setOption({
        color: this.colorPie,
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
            data: this.legendTextPieAction,
            orient: 'vertical',
            left: '60%',
            y: 'center',
            icon: "circle",
            textStyle:{
              color: '#333333',
              fontWeight: 'bold',
            },
            formatter(name){
              let total = 0
              let arrdetail = []
              that.seriesPieAction.map(v => {
                total += Number(v.value)
              })
              that.seriesPieAction.map(v => {
                if (name == v.name) {
                  arrdetail.push(
                    v.name + ' '+v.value + '次,  ' + '占比' + (v.value/total*100).toFixed(1) + '%'
                  )
                }
              })
             return arrdetail.join('\n')
            },
        },
        series: [
          {
            name: "",
            data: this.seriesPieAction,
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