<template>
  <div>
    <el-row class="empty" v-if="seriesPieType.lenght==0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
    <div ref="pie_dv" style="width: 100%;height: 240px;" v-else></div>
  </div>
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
      seriesPieType: [], // BOT类型饼图
      colorPie: ['#2277da', '#e54545', '#ff9d00', '#f5736e'],
      legendTextPieType: [this.t('公开类型', 'WAF.gklx'), this.t('未知类型', 'WAF.wzlx'), this.t('用户自定义类型', 'WAF.yhzdylx')],
    };
  },
  mounted() {
    this.echart();
    window.onresize = this.$echarts.init(this.$refs.pie_dv).resize;
    this.getBotType(this.domain)
  },
  props: {
    domain: String,
    startTime: Number,
    endTime: Number
  },
  watch: {
    domain(val) {
      this.domain = val
      this.getBotType(val)
      this.echart()
    },
    startTime(val) {
      this.startTime = val
      this.echart()
    },
    endTime(val) {
      this.endTime = val
      this.echart()
    },
    seriesPieType(val, oldVal) {
      this.seriesPieType = val
      this.echart()
    }
  },
  methods: {
    // 获取Bot_V2 Bot类别统计
    getBotType(domain) {
     const params = {
        Version: "2018-01-25",
        StartTs: this.startTime,
        EndTs: this.endTime,
        Domain: domain,
      }
      this.axios.post(DESCRIBE_BOT_TYPE_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.seriesPieType = [
            {value: Response.TCB, name: this.t('公开类型', 'WAF.gklx')},
            {value: Response.UB, name: this.t('未知类型', 'WAF.wzlx')},
            {value: Response.UCB, name: this.t('用户自定义类型', 'WAF.yhzdylx')}
          ]
          // this.$set(this.seriesPieType, 0, {value: Response.TCB, name: '公开类型'})
          // this.$set(this.seriesPieType, 1, {value: Response.UB, name: '未知类型'})
          // this.$set(this.seriesPieType, 2, {value: Response.UCB, name: '用户自定义类型'})
        },{},'', (error) => {
          this.seriesPieType = []
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
            data: this.legendTextPieType,
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
              that.seriesPieType.map(v => {
                total += Number(v.value)
              })
              that.seriesPieType.map(v => {
                if (name == v.name) {
                  arrdetail.push(
                    v.name + ' '+v.value + '次,  ' + that.t('占比', 'WAF.zb') + (v.value/total*100).toFixed(1) + '%'
                  )
                }
              })
             return arrdetail.join('\n')
            },
        },
        series: [
          {
            name: "",
            data: this.seriesPieType,
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
<style lang="scss" scoped>
 .empty {
      height: 240px;
      width: 100%;
      line-height: 240px;
      text-align: center;
      font-weight: bold
    }
</style>