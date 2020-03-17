<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>带宽<span style="color:#bbb;fontSize:12px;">(Mbps)</span></h3>
      <i class="el-icon-download icon" @click="exportEchart(type)"/>
    </el-row>
    <el-row type="flex" class="header" justify="space-between">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="billing">计费带宽</el-radio-button>
        <el-radio-button label="origin">回源带宽</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="peak">显示峰值线</el-checkbox>
    </el-row>
    <echart-line
      :xAxis="xAxisCurBill"
      :series1="serCurBill"
      :series2="serLastBill"
      :legendText="legendBill"
      :tooltip="tooltip"
      :color="color"
      :isShowPeak="peak"
      :peak="curBillMax"
      v-if="type=='billing'"
    />
    <echart-line
      :xAxis="xAxisCurOrigin"
      :series1="serCurOrigin"
      :series2="serLastOrigin"
      :legendText="legendOrigin"
      :tooltip="tooltip"
      :isShowPeak="peak"
      :peak="curOriginMax"
      :color="color"
      v-if="type=='origin'"
    />
  </el-card>
</template>
<script>
import moment from 'moment'
import XLSX from 'xlsx'
import echartLine from '../components/line'
export default {
  props: {
    params: Object
  },
  data() {
    return {
      type: 'billing',
      peak: false,
      xAxisCurBill: [], // 计费带宽x轴
      serCurBill: [], // 当前计费带宽
      serLastBill: [], // 上一周期计费带宽
      xAxisCurOrigin: [], // 回源带宽x轴
      serCurOrigin: [], // 当前回源带宽
      serLastOrigin: [], // 上一周期回源带宽
      legendBill: ['当前计费带宽', '上一周期计费带宽'],
      legendOrigin: ['当前回源带宽', '上一周期回源带宽'],
      curBillMax: 0,
      lastBillMax: 0,
      curOriginMax: 0,
      color: ['#006eff', '#29cc85', "#FF584C"],
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          let relVal = params[0].name;
          params.forEach(v => {
            relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + "Mbps";
          })  
          return relVal;  
        }
      },
    }
  },
  components: {
    echartLine
  },
  watch: {
    params: {
      handler() {
        this.init()
      },
      immediate: true,
      deep: true,
    },
    type() {
      this.init()
    }
  },
  methods: {
    exportEchart(type1) {
      const { projectName, domainName, type, times, interval } = this.params
      let fileName
      const start = times[0].split(' ')[0]
      const end = times[1].split(' ')[0]
      let data = [
        ['统计项目', projectName || '全部项目'],
        ['统计域名', domainName || '全部域名'],
        ['报表类型', type],
        ['开始时间', times[0]],
        ['结束时间', times[1]],
        [], 
      ]
      let name=''
      if (type1 == 'billing') {
        data.push(
          ['峰值带宽', this.curBillMax + 'bps'],
          [],
          ['时间', '当前计费流量（bps）', '上一周期计费流量（bps）']
        )
        name="billing_bandwidth"
        this.xAxisCurBill.forEach((item,index) => {
          data.push([
            item,
            this.serCurBill[index],
            this.serLastBill[index]
          ])
        })
      } else {
        data.push(
          ['峰值带宽', this.curOriginMax + 'bps'],
          [],
          ['时间', '当前回源流量（bps）', '上一周期回源流量（bps）']
        )
        name="bandwidth_trend"
        this.xAxisCurOrigin.forEach((item,index) => {
          data.push([
            item,
            this.serCurOrigin[index],
            this.serLastOrigin[index]
          ])
        })
      }

      if (interval === '5min') { // 日报
        fileName = `${start}_${name}.xlsx`
      } else {
        fileName = `${start}-${end}_${name}.xlsx`
      }
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, name);
      XLSX.writeFile(wb, fileName);
    },
    init() {
      const { projectId, domainName, interval, times } = this.params
      let timeType = 'days'
      if(interval == '5min') {
        timeType = 'days'
      } else if(interval == 'hour') {
        timeType = 'weeks'
      } else {
        timeType = 'months'
      }
      const params1 = {
        Version: "2018-06-06",
        StartTime: times[0],
        EndTime: times[1],
        Area: "overseas",
        Interval: interval
      }
      const params2 = {
        Version: "2018-06-06",
        StartTime: moment(times[0]).subtract(1, timeType).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment(times[1]).subtract(1, timeType).format('YYYY-MM-DD HH:mm:ss'),
        Area: "overseas",
        Interval: interval
      }
      if (projectId) {
        params1.Project = projectId
        params2.Project = projectId
      }
      if (domainName) {
        params1['Domains.0'] = domainName
        params2['Domains.0'] = domainName
      }
      if(this.type === 'billing') {
        this.getCurBillData(params1)
        this.getLastBillData(params2)
      } else {
        this.getCureOriginData(params1)
        this.getCureLastData(params2)
      }
    },
    // 当前计费带宽
    getCurBillData(params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: "bandwidth"
      })
        .then(({ Response: { Data } }) => {
          const curBillArr = []
          const xAxisArr = []
          if (Data && Data.length) {
            this.curBillMax = Data[0].BillingData[0].SummarizedData.Value
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curBillArr.push(item.Value)
            })
          }
          this.xAxisCurBill = xAxisArr
          this.serCurBill = curBillArr
        })
    },
    // 上一周期计费带宽
    getLastBillData(params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: "bandwidth"
      })
        .then(({ Response: { Data } }) => {
          const lastBillArr = []
          if (Data && Data.length) {
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              lastBillArr.push(item.Value)
            })
          }
          this.serLastBill = lastBillArr
        })
    },
    // 当前回源带宽
    getCureOriginData(params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: "bandwidth"
      })
        .then(({ Response: { Data } }) => {
          const curOriginArr = []
          const xAxisArr = []
          if (Data && Data.length) {
            this.curOriginMax = Data[0].OriginData[0].SummarizedData.Value
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curOriginArr.push(item.Value)
            })
          }
          this.xAxisCurOrigin = xAxisArr
          this.serCurOrigin = curOriginArr
        })
    },
    // 上一周期回源带宽
    getCureLastData(params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: "bandwidth"
      })
        .then(({ Response: { Data } }) => {
          const lastOriginArr = []
          if (Data && Data.length) {
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              lastOriginArr.push(item.Value)
            })
          }
          this.serLastOrigin = lastOriginArr
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
.icon {
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
</style>