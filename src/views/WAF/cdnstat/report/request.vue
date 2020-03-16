<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>请求数<span style="color:#bbb;fontSize:12px;">(次)</span></h3>
      <i class="el-icon-download icon" />
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
          Data[0].CdnData[0].DetailData.map((item) => {
            xAxisArr.push(item.Time)
            currentArr.push(item.Value)
          })
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
          Data[0].CdnData[0].DetailData.map((item) => {
            lastCycleArr.push(item.Value)
          })
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