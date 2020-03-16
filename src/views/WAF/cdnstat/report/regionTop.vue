<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>区域流量分布</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-row>
      <el-col :span="18">
        <echart-map
          :series="seriesMap"
        />
      </el-col>
      <el-col></el-col>
    </el-row>
  </el-card>
</template>
<script>
import moment from 'moment'
import echartMap from '../components/worldMap'

export default {
  props: {
    params: Object
  },
  data() {
    return {
      seriesMap: [],
    }
  },
  components: {
    echartMap,
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

      const params = {
        Version: "2018-06-06",
        StartTime: moment(times[0]).format('YYYY-MM-DD HH:hh:ss'),
        EndTime: moment(times[1]).format('YYYY-MM-DD HH:hh:ss'),
        Area: "overseas",
        Interval: interval
      }
      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }
      // this.getFluxHitRate(params)
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