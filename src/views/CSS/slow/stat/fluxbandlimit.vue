<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="頻寬" name="bandlimit" />
    <el-tab-pane label="流量" name="flux" />
    <h4>
      {{activeTab === 'bandlimit' ? '頻寬' : '流量'}}趨勢
      <span class="app-live-text-weak">(单位:{{activeTab === 'bandlimit' ? 'Mpbs' : 'MB'}})</span>
    </h4>
    <e-line
      :xAxis="timeData"
      :series="series"
      :legendText="activeTab === 'bandlimit' ? '頻寬' : '流量'"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a} {c}${activeTab === 'bandlimit' ? 'Mpbs' : 'MB'}`
      }"
    />
  </el-tabs>
</template>

<script>
import ELine from '../../components/line'
import { CSS_SLOW_MBPS } from '@/constants'
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
      activeTab: 'bandlimit',
      timeData: [],
      series: [],
      bandwidthData: [],
      fluxData: [],
    }
  },
  watch: {
    activeTab () {
      if (this.activeTab === 'bandlimit') {
        this.series = [...this.bandwidthData]
      } else {
        this.series = [...this.fluxData]
      }
    },
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
        'ProvinceNames.0': 'Taiwan'
      }

      this.playDomains.forEach((domain, index) => {
        params[`PlayDomains.${index}`] = domain
      })
      this.axios
        .post(CSS_SLOW_MBPS, params)
        .then(({ Response: { DataInfoList } }) => {
          const times = []
          const bandwidthData = []
          const fluxData = []
          DataInfoList.forEach(item => {
            times.push(item.Time)
            bandwidthData.push(item.Bandwidth)
            fluxData.push(item.Flux)
          })
          this.timeData = times
          this.bandwidthData = bandwidthData
          this.fluxData = fluxData
          if (this.activeTab === 'bandlimit') {
            this.series = bandwidthData
          } else {
            this.series = fluxData
          }
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
