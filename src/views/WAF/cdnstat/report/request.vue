<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>请求数<span style="color:#bbb;fontSize:12px;">(次)</span></h3>
      <i class="el-icon-download icon" @click="exportEchart"/>
    </el-row>
    <echart-line
      :xAxis="xAxisCurrent"
      :series1="seriesCurrent"
      :series2="seriesLastCycle"
      :legendText="legendText"
      :tooltip="tooltip"
      :color="color"
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
      seriesCurrent: [],
      seriesLastCycle: [],
      xAxisCurrent: [],
      legendText: ['当前请求数', '上一周期请求数'],
      color: ['#006eff', '#29cc85', "#FF584C"],
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          let relVal = params[0].name;
          params.forEach(v => {
            relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + "次";
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
    }
  },
  methods: {
    exportEchart() {
      const { projectName, domainName, type, times, interval } = this.params
      let fileName
      const start = times[0].split(' ')[0]
      const end = times[1].split(' ')[0]
      if (interval === '5min') { // 日报
        fileName = `${start}_request_trend.xlsx`
      } else {
        fileName = `${start}-${end}_request_trend.xlsx`
      }
      let data = [
        ['统计项目', projectName || '全部项目'],
        ['统计域名', domainName || '全部域名'],
        ['报表类型', type],
        ['开始时间', times[0]],
        ['结束时间', times[1]],
        [],
        ['时间', '当前请求数（次）', '上一次请求数（次）']
      ]
      this.xAxisCurrent.map((item, index) => {
        data.push([
          item,
          this.seriesCurrent[index],
          this.seriesLastCycle[index]
        ])
      })
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'request_trend');
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
      this.getCurrentData(params1)
      this.getLastCycleData(params2)
    },
    getCurrentData(params) {
      const xAxisArr = []
      const currentArr = []
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: "request",
      })
        .then(({ Response: { Data }}) => {
          if (Data && Data.length) {
            Data[0].CdnData[0].DetailData.map((item) => {
              xAxisArr.push(item.Time)
              currentArr.push(item.Value)
            })
          }
          this.seriesCurrent = currentArr
          this.xAxisCurrent = xAxisArr
        })
    },
    getLastCycleData(params) {
      const lastCycleArr = []
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: "request",
      })
        .then(({ Response: { Data } }) => {
          if (Response.Data && Response.Data.length) {
            Data[0].CdnData[0].DetailData.map((item) => {
              lastCycleArr.push(item.Value)
            })
          }
          this.seriesLastCycle = lastCycleArr
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