<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.10')}}<span style="color:#bbb;fontSize:12px;">(Mbps)</span></h3>
      <i class="el-icon-download icon" @click="exportEchart(type)"/>
    </el-row>
    <el-row type="flex" class="header" justify="space-between">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="billing">{{$t('CDNT.report.14')}}</el-radio-button>
        <el-radio-button label="origin">{{$t('CDNT.report.15')}}</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="peak">{{$t('CDNT.report.16')}}</el-checkbox>
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
  data () {
    return {
      type: 'billing',
      peak: false,
      xAxisCurBill: [], // $t('CDNT.report.14')x轴
      serCurBill: [], // 当前$t('CDNT.report.14')
      serLastBill: [], // 上一周期$t('CDNT.report.14')
      xAxisCurOrigin: [], // 回源寬頻x轴
      serCurOrigin: [], // 当前回源寬頻
      serLastOrigin: [], // 上一周期回源寬頻
      legendBill: ['当前計費寬頻', '上一周期計費寬頻'],
      legendOrigin: ['当前回源寬頻', '上一周期回源寬頻'],
      curBillMax: 0,
      lastBillMax: 0,
      curOriginMax: 0,
      color: ['#006eff', '#29cc85', '#FF584C'],
      tooltip: {
        trigger: 'axis',
        formatter (params) {
          let relVal = params[0].name
          params.forEach(v => {
            relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + 'Mbps'
          })
          return relVal
        }
      }
    }
  },
  components: {
    echartLine
  },
  watch: {
    params: {
      handler () {
        this.init()
      },
      immediate: true,
      deep: true
    },
    type () {
      this.init()
    }
  },
  methods: {
    exportEchart (type1) {
      const { projectName, domainName, type, times, interval } = this.params
      let fileName
      const start = times[0].split(' ')[0]
      const end = times[1].split(' ')[0]
      let data = [
        ['統計項目', projectName || '全部項目'],
        ['統計域名', domainName || '全部域名'],
        ['報表類型', type],
        ['開始時間', times[0]],
        ['結束時間', times[1]],
        []
      ]
      let name = ''
      if (type1 == 'billing') {
        data.push(
          ['峰值寬頻', this.curBillMax + 'Mbps'],
          [],
          ['時間', '當前計費流量（bps）', '上一週期計費流量（bps）']
        )

        name="billing_bandwidth_trend"
        this.xAxisCurBill.forEach((item,index) => {

          data.push([
            item,
            this.serCurBill[index],
            this.serLastBill[index]
          ])
        })
      } else {
        data.push(
          ['峰值寬頻', this.curOriginMax + 'Mbps'],
          [],
          ['時間', '當前回源流量（bps）', '上一週期回源流量（bps）']
        )
        name = 'bandwidth_trend'
        this.xAxisCurOrigin.forEach((item, index) => {
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
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, name)
      XLSX.writeFile(wb, fileName)
    },
    init () {
      const { projectId, domainName, interval, times } = this.params
      let timeType = 'days'
      if (interval == '5min') {
        timeType = 'days'
      } else if (interval == 'hour') {
        timeType = 'weeks'
      } else {
        timeType = 'months'
      }
      const params1 = {
        Version: '2018-06-06',
        StartTime: times[0],
        EndTime: times[1],
        Area: 'overseas',
        Interval: interval
      }
      const params2 = {
        Version: '2018-06-06',
        StartTime: moment(times[0]).subtract(1, timeType).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment(times[1]).subtract(1, timeType).format('YYYY-MM-DD HH:mm:ss'),
        Area: 'overseas',
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
      if (this.type === 'billing') {
        this.getCurBillData(params1)
        this.getLastBillData(params2)
      } else {
        this.getCureOriginData(params1)
        this.getCureLastData(params2)
      }
    },
    // 当前$t('CDNT.report.14')
    getCurBillData (params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: 'bandwidth'
      })
        .then(({ Response: { Data } }) => {
          const curBillArr = []
          const xAxisArr = []
          if (Data && Data.length) {
            const curMax = Data[0].BillingData[0].SummarizedData.Value
            this.curBillMax = Number((curMax / 1e6).toFixed(2) === '0.00' ? 0 : (curMax / 1e6).toFixed(2))
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curBillArr.push((item.Value / 1e6).toFixed(2) === '0.00' ? 0 : (item.Value / 1e6).toFixed(2))
            })
          }
          this.xAxisCurBill = xAxisArr
          this.serCurBill = curBillArr
        })
    },
    // 上一周期$t('CDNT.report.14')
    getLastBillData (params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: 'bandwidth'
      })
        .then(({ Response: { Data } }) => {
          const lastBillArr = []
          if (Data && Data.length) {
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              lastBillArr.push((item.Value / 1e6).toFixed(2) === '0.00' ? 0 : (item.Value / 1e6).toFixed(2))
            })
          }
          this.serLastBill = lastBillArr
        })
    },
    // 当前回源寬頻
    getCureOriginData (params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: 'bandwidth'
      })
        .then(({ Response: { Data } }) => {
          const curOriginArr = []
          const xAxisArr = []
          if (Data && Data.length) {
            const curMax = Data[0].OriginData[0].SummarizedData.Value
            this.curOriginMax = Number((curMax / 1e6).toFixed(2) === '0.00' ? 0 : (curMax / 1e6).toFixed(2))
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curOriginArr.push((item.Value / 1e6).toFixed(2) === '0.00' ? 0 : (item.Value / 1e6).toFixed(2))
            })
          }
          this.xAxisCurOrigin = xAxisArr
          this.serCurOrigin = curOriginArr
        })
    },
    // 上一周期回源寬頻
    getCureLastData (params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: 'bandwidth'
      })
        .then(({ Response: { Data } }) => {
          const lastOriginArr = []
          if (Data && Data.length) {
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              lastOriginArr.push((item.Value / 1e6).toFixed(2) === '0.00' ? 0 : (item.Value / 1e6).toFixed(2))
            })
          }
          this.serLastOrigin = lastOriginArr
        })
    }
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
