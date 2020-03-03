<template>
  <div ref="line_dv" style="width: 100%;height: 300px;"></div>
</template>

<script>
import moment from 'moment'
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
      xAxisLineFlow: [], // bot流量折线图
      seriesLineFlowBot: [], // BOT请求趋势折线图
      seriesLineFlowTotal: [], // BOT请求趋势折线图
      legendTextLineFlow: ['总请求', 'BOT请求'],
      colorLine: ["#006eff", "#FF584C",],
    };
  },
  mounted() {
    this.getBotFlow(this.domain)
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.line_dv).resize;
  },
  props: {
    domain: {
      type: String,
    },
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    dateTimeValue: {
      type: Array,
      default: () => []
    },
    selBtn: {
      type: Number
    }
  },
  watch: {
    domain(val) {
      this.getBotFlow(val)
      this.echart()
    },
    startTime(val) {
      this.startTime = val
      this.getBotFlow(this.domain)
      this.echart()
    },
    endTime(val) {
      this.endTime = val
      this.getBotFlow(this.domain)
      this.echart()
    },
    dateTimeValue(val) {
      this.dateTimeValue = val
      this.getBotFlow(this.domain)
      this.echart()
    },
    seriesLineFlowTotal(val) {
      this.seriesLineFlowTotal = val
      this.echart()
    },
    seriesLineFlowBot(val) {
      this.seriesLineFlowBot = val
      this.echart()
    },
    xAxisLineFlow(val) {
      this.xAxisLineFlow = val
      this.echart()
    },
  },
  methods: {
    // 获取Bot_V2 Bot流量统计
    getBotFlow(domain) {
      let axixArr = []
      // 获取业务攻击趋势参数获取时间值
      const paramsPeakPoints = {
        Version: '2018-01-25',
        FromTime: moment(this.dateTimeValue[0]).format("YYYY-MM-DD HH:mm:ss"),
        ToTime: moment(this.dateTimeValue[1]).format("YYYY-MM-DD HH:mm:ss"),
      }
     const params = {
        Version: "2018-01-25",
        StartTs: this.startTime,
        EndTs: this.endTime,
        Stride: 2,
        Domain: domain,
      }
      const Granularity = moment(this.endTime).diff(moment(this.startTime), 'days')
      // if(moment(this.endTime).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
      if(this.selBtn == 1 ||this.selBtn == 2 || this.selBtn == 3 ) {
        // 当选中时间有当天时，需将bot值控制在当前时间而不是23:59:59
        params["EndTs"] = moment().utc().valueOf()
        paramsPeakPoints["FromTime"] = moment(this.dateTimeValue[0]).format("YYYY-MM-DD HH:mm:00")
      }
      if (Granularity >= 7) {
        params["Stride"] = 1440
      } else if(Granularity > 0 && Granularity < 7) {
        params["Stride"] = 60
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, paramsPeakPoints).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.forEach((v, index) => {
              if(Granularity == 0) {
                if( (index%2) == 0) {
                  axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
                } 
              } else {
                axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
              }
            })
            this.xAxisLineFlow = axixArr
        })
      }).then(() => {
        this.axios.post(DESCRIBE_BOT_STATISTIC_POINTS, params).then((resp) => {
          this.generalRespHandler(resp, ({PointsBot, PointsTotal}) => {
            this.seriesLineFlowBot = PointsBot
            this.seriesLineFlowTotal = PointsTotal
          }, {}, '',(error) => {
            this.seriesLineFlowBot = []
            this.seriesLineFlowTotal = []
          })
        })
      })
    },
    echart() {
      var myChart = this.$echarts.init(this.$refs.line_dv)
      let that = this
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
            data: this.legendTextLineFlow,
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
            this.xAxisLineFlow
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
            name: this.legendTextLineFlow[0],
            type: "line",
            data: this.seriesLineFlowTotal,
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                color: this.colorLine[0],
                lineStyle:{
                  width:2//设置线条粗细
                }
              }
            }
          },
          {
            name: this.legendTextLineFlow[1],
            data: this.seriesLineFlowBot,
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                color: this.colorLine[1],
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