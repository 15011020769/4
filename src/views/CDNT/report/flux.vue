<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.9')}}<span style="color:#bbb;fontSize:12px;">(GB)</span></span></h3>
      <i class="el-icon-download icon" @click="exportEchart(type)"/>
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="billing">{{$t('CDNT.report.20')}}</el-radio-button>
      <el-radio-button label="origin">{{$t('CDNT.report.21')}}</el-radio-button>
    </el-radio-group>
    <echart-line
      :xAxis="xAxisCurBill"
      :series1="serCurBill"
      :series2="serLastBill"
      :legendText="legendBill"
      :tooltip="tooltip"
      :color="color"
      v-if="type=='billing'"
    />
    <echart-line
      :xAxis="xAxisCurOrigin"
      :series1="serCurOrigin"
      :series2="serLastOrigin"
      :legendText="legendOrigin"
      :tooltip="tooltip"
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
      xAxisCurBill: [], // 计费流量x轴
      serCurBill: [], // 当前计费流量
      serLastBill: [], // 上一周期计费流量
      xAxisCurOrigin: [], // 回源流量x轴
      serCurOrigin: [], // 当前回源流量宽
      serLastOrigin: [], // 上一周期回源流量
      legendBill: ['當前計費流量', '上一週期計費流量'],
      legendOrigin: ['當前回源流量', '上一週期回源流量'],
      exportCurBill: [], // 导出表格中当前计费流量
      exportLastBill: [], // 导出表格上一周期计费流量
      exportCurOrigin: [], // 导出表格当前回源流量
      exportLastOrigin: [], // 导出表格上一周期回源流量
      color: ['#006eff', '#29cc85', "#FF584C"],
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          let relVal = params[0].name;
          params.forEach(v => {
            relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + "GB";
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
      
      let name=''
      let data = [
        ['統計專案', projectName || '全部專案'],
        ['統計域名', domainName || '全部域名'],
        ['報表類型', type],
        ['開始時間', times[0]],
        ['結束時間', times[1]],
        [], 
      ]
      if (type1 === 'billing') {
        data.push(['時間', '當前計費流量（B）', '上一週期計費流量（B）'])
        name="billing_traffic_trend"
        this.xAxisCurBill.forEach((item,index) => {
          data.push([
            item,
            this.exportCurBill[index],
            this.exportLastBill[index]
          ])
        })
      } else {
        data.push(['時間', '當前回源流量（B）', '上一週期回源流量（B）'])
        name="traffic_trend"
        this.xAxisCurOrigin.forEach((item,index) => {
          data.push([
            item,
            this.exportCurOrigin[index],
            this.exportLastOrigin[index]
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
        params1.Domain = domainName
        params2.Domain = domainName
      }
      if(this.type === 'billing') {
        this.getCurBillData(params1)
        this.getLastBillData(params2)
      } else {
        this.getCureOriginData(params1)
        this.getCureLastData(params2)
      }
    },
    // 当前计费流量
    getCurBillData(params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: "flux"
      })
        .then(({ Response: { Data } }) => {
          const curBillArr = []
          const xAxisArr = []
          const exportBill = []
          if (Data && Data.length) {
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curBillArr.push((item.Value / 1e9).toFixed(2) === '0.00' ? 0 : (item.Value / 1e9).toFixed(2))
              exportBill.push(item.Value)
            })
          }
          this.xAxisCurBill = xAxisArr
          this.serCurBill = curBillArr
          this.exportCurBill = exportBill // 导出流量单位为B
        })
    },
    // 上一周期计费流量
    getLastBillData(params) {
      this.axios.post('cdn2/DescribeBillingData', {
        ...params,
        Metric: "flux"
      })
        .then(({ Response: { Data } }) => {
          const lastBillArr = []
          const exportBill = []
          if (Data && Data.length) {
            const res = Data[0].BillingData[0].DetailData
            res && res.map((item) => {
              lastBillArr.push((item.Value / 1e9).toFixed(2) === '0.00' ? 0 : (item.Value / 1e9).toFixed(2))
              exportBill.push(item.Value)
            })
          }
          this.serLastBill = lastBillArr
          this.exportLastBill = exportBill
        })
    },
    // 当前回源流量
    getCureOriginData(params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: "flux"
      })
        .then(({ Response: { Data } }) => {
          const curOriginArr = []
          const xAxisArr = []
          const exportOrigin = []
          if (Data && Data.length) {
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              xAxisArr.push(item.Time)
              curOriginArr.push((item.Value / 1e9).toFixed(2) === '0.00' ? 0 : (item.Value / 1e9).toFixed(2))
              exportOrigin.push(item.Value)
            })
          }
          this.xAxisCurOrigin = xAxisArr
          this.serCurOrigin = curOriginArr
          this.exportCurOrigin = exportOrigin
        })
    },
    // 上一周期回源流量
    getCureLastData(params) {
      this.axios.post('cdn2/DescribeOriginData', {
        ...params,
        Metric: "flux"
      })
        .then(({ Response: { Data } }) => {
          const lastOriginArr = []
          const exportOrigin = []
          if (Data && Data.length) {
            const res = Data[0].OriginData[0].DetailData
            res && res.map((item) => {
              lastOriginArr.push((item.Value / 1e9).toFixed(2) === '0.00' ? 0 : (item.Value / 1e9).toFixed(2))
              exportOrigin.push(item.Value)
            })
          }
          this.serLastOrigin = lastOriginArr
          this.exportLastOrigin = exportOrigin
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