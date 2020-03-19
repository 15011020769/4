<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <el-col :span="8" v-loading="fluxLoading">
        <p class="title">总流量</p>
        <p class="number">
          {{ Math.ceil(flux[0]) === flux[0] ? flux[0] : flux[0].toFixed(2)
          }}<span class="unit"> {{ flux[1] }}</span>
        </p>
        <p class="info">
          <i class="el-icon-top" v-if="fluxChain > 0" />
          <i class="el-icon-bottom" v-if="fluxChain < 0" />
          {{ fluxChain !== 0 ? fluxChain : "-" }}%（{{ type }}环比）
        </p>
      </el-col>
      <el-col :span="8" v-loading="fluxHitRateLoading">
        <p class="title">平均流量命中率</p>
        <p class="number">{{ fluxHitRate }}<span class="unit"> %</span></p>
        <p class="info">
          <i class="el-icon-top" v-if="fluxHitRateChain > 0" />
          <i class="el-icon-bottom" v-if="fluxHitRateChain < 0" />
          {{ fluxHitRateChain !== 0 ? fluxHitRateChain : "-" }}%（{{
            type
          }}环比）
        </p>
      </el-col>
      <el-col :span="8" v-loading="requestLoading">
        <p class="title">请求数</p>
        <p class="number">{{ request }}</p>
        <p class="info">
          <i class="el-icon-top" v-if="requestChain > 0" />
          <i class="el-icon-bottom" v-if="requestChain < 0" />
          {{ requestChain !== 0 ? requestChain : "-" }}%（{{ type }}环比）
        </p>
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
  data () {
    return {
      fluxHitRate: 0,
      flux: [0, 'B'],
      fluxChain: 0,
      fluxHitRateChain: 0,
      request: 0,
      requestChain: 0,
      chainStartTime: '',
      chainEndTime: '',
      fluxLoading: true,
      fluxHitRateLoading: true,
      requestLoading: true
    }
  },
  watch: {
    params: {
      handler () {
        this.init()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    type () {
      if (this.params.interval === 'hour') {
        return '周'
      }
      if (this.params.interval === 'day') {
        return '月'
      }
      return '日'
    }
  },
  methods: {
    init () {
      const { projectId, domainName, interval, times } = this.params

      const params = {
        Version: '2018-06-06',
        StartTime: times[0],
        EndTime: times[1],
        Area: 'overseas',
        Interval: interval
      }
      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }
      let unit = 'd'
      if (interval === '5min') {
      } else if (interval === 'hour') {
        unit = 'week'
      } else {
        unit = 'month'
      }
      this.chainStartTime = moment(times[0]).subtract(1, unit).format('YYYY-MM-DD HH:mm:ss')
      this.chainEndTime = moment(times[1]).subtract(1, unit).format('YYYY-MM-DD HH:mm:ss')
      this.getFluxHitRate(params)
      this.getFlux(params)
      this.getRequest(params)
    },
    getFlux (params) {
      this.fluxLoading = true
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: 'flux'
      })
        .then(({ Response }) => {
          let flux = 0
          if (Response.Data && Response.Data.length) {
            flux = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          this.flux = this.fluxStr(flux)
          this.getFluxChain(params, flux)
        })
    },
    getFluxChain (params, flux) {
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        StartTime: this.chainStartTime,
        EndTime: this.chainEndTime,
        Metric: 'flux'
      })
        .then(({ Response }) => {
          let lastFlux = 0
          if (Response.Data && Response.Data.length) {
            lastFlux = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          let fluxChain
          if (lastFlux !== 0) {
            fluxChain = (flux - lastFlux) / lastFlux * 100
          } else {
            fluxChain = 0
          }
          if (Math.ceil(fluxChain) !== fluxChain) {
            fluxChain = fluxChain.toFixed(2)
          }
          this.fluxChain = fluxChain
          this.fluxLoading = false
        })
    },
    getFluxHitRate (params) {
      this.fluxHitRateLoading = true
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: 'fluxHitRate'
      })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            this.fluxHitRate = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          this.getFluxHitRateChain(params)
        })
    },
    getFluxHitRateChain (params) {
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        StartTime: this.chainStartTime,
        EndTime: this.chainEndTime,
        Metric: 'fluxHitRate'
      })
        .then(({ Response }) => {
          let lastFluxHitRate = 0
          if (Response.Data && Response.Data.length) {
            lastFluxHitRate = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          let fluxHitRateChain
          if (lastFluxHitRate !== 0) {
            fluxHitRateChain = (this.fluxHitRate - lastFluxHitRate) / lastFluxHitRate * 100
          } else {
            fluxHitRateChain = 0
          }
          if (Math.ceil(fluxHitRateChain) !== fluxHitRateChain) {
            fluxHitRateChain = fluxHitRateChain.toFixed(2)
          }
          this.fluxHitRateChain = fluxHitRateChain
          this.fluxHitRateLoading = false
        })
    },
    getRequest (params) {
      this.requestLoading = true
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: 'request'
      })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            this.request = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          this.getRequestChain(params)
        })
    },
    getRequestChain (params) {
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        StartTime: this.chainStartTime,
        EndTime: this.chainEndTime,
        Metric: 'request'
      })
        .then(({ Response }) => {
          let lastRequest = 0
          if (Response.Data && Response.Data.length) {
            lastRequest = Response.Data[0].CdnData[0].SummarizedData.Value
          }
          let requestChain
          if (lastRequest !== 0) {
            requestChain = (this.request - lastRequest) / lastRequest * 100
          } else {
            requestChain = 0
          }
          if (Math.ceil(requestChain) !== requestChain) {
            requestChain = requestChain.toFixed(2)
          }
          this.requestChain = requestChain
          this.requestLoading = false
        })
    },
    fluxStr (v) {
      if (v > 1e12) {
        return [v / 1e12, 'TB']
      }
      if (v > 1e9) {
        return [v / 1e9, 'GB']
      }
      if (v > 1e6) {
        return [v / 1e6, 'MB']
      }
      if (v > 1e3) {
        return [v / 1e3, 'KB']
      }
      return [v, 'B']
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
.info {
  font-size: 12px;
  color: #888;
  margin-top: -6px;
}
.el-icon-bottom {
  font-size: 16px;
  font-weight: bold;
  color: rgb(87, 187, 102);
}
.el-icon-top {
  font-size: 16px;
  font-weight: bold;
  color: rgb(212, 82, 76);
}
</style>
