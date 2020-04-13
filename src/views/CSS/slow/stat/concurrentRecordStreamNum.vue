<template>
  <el-row>
    <h4>
      並發錄製路數
      <span class="app-live-text-weak">(單位:路)</span>
    </h4>
    <e-line
      :xAxis="timeData"
      :series="series"
      legendText="並發錄製路數"
      :tooltip="{
        trigger: 'axis',
        formatter: '{b}<br/>{a} {c}(路)'
      }"
    />
  </el-row>
</template>

<script>
import ELine from '../../components/line'
import { CSS_CONCURRENT_RECORD_STREAM_NUM } from '@/constants'
import moment from 'moment'

export default {
  props: {
    timeValue: {
      type: Array,
      required: true
    },
    playDomains: {
      type: Array,
      required: false,
      default: undefined
    },
  },
  name: 'fluxbandlimit',
  components: {
    ELine,
  },
  data () {
    return {
      timeData: [],
      series: [],
    }
  },
  methods: {
    // 统计趋势数据
    getTrend () {
      if (this.playDomains.length === 0) {
        this.$message({
          type: 'warning',
          message: '必須選擇域名',
          duration: 0,
          showClose: true,
        })
        return
      }
      let params = {
        Version: '2018-08-01',
        StartTime: moment(this.timeValue[0]).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment(this.timeValue[1]).format('YYYY-MM-DD HH:mm:ss'),
        LiveType: 'SlowLive',
        MainlandOrOversea: 'Oversea',
      }
      this.playDomains.forEach((domain, index) => {
        params[`PushDomains.${index}`] = domain
      })
      this.axios
        .post(CSS_CONCURRENT_RECORD_STREAM_NUM, params)
        .then(({ Response: { DataInfoList } }) => {
          const times = []
          const series = []
          DataInfoList.forEach(item => {
            times.push(item.Time)
            series.push(item.Num)
          })
          this.timeData = times
          this.series = series
        })
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 14px;
}
.app-live-text-weak {
  color: #bbb!important;
}
</style>
