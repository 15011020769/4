<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <el-col :span="8">
        <p class="title">总流量</p>
        <p class="number">10.15<span class="unit"> kb</span></p>
        <p class="info">-%（日环比）</p>
      </el-col>
      <el-col :span="8">
        <p class="title">平均流量命中率</p>
        <p class="number">10.15<span class="unit"> %</span></p>
        <p class="info">-%（日环比）</p>
      </el-col>
      <el-col :span="8">
        <p class="title">请求数</p>
        <p class="number">10.15</p>
        <p class="info">-%（日环比）</p>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    params: Object
  },
  data() {
    return {
    }
  },
  watch: {
    params: {
      handler() {
        this.init()
      },
      immediate: true,
      deep: true,
    }
    // DescribeCdnData
  },
  methods: {
    init() {
      const { projectId, domainName, interval, time } = this.params

      const params = {
        Version: "2018-06-06",
        StartTime: "2020-03-15 00:00:00",
        EndTime: "2020-03-15 23:59:59",
        Area: "overseas",
        Interval: interval
      }
      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }
      this.getFluxHitRate(params)
    },
    getFluxHitRate(params) {
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: "fluxHitRate",
      })
        .then(({ Response }) => {
          console.log(Response.Data[0].CdnData[0].SummarizedData)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  color: #000;
  font-size: 12px;
  font-weight: 700;
}
.number {
  margin-top: 15px;
  font-size: 36px;
}
.unit {
  font-size: 14px;
  color: #000;
}
._info {
  font-size: 12px;
  color: #888;
  margin-top: -6px;
}
</style>