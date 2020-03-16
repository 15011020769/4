<template>
  <el-card style="height: 630px">
    <el-row type="flex" class="header" justify="space-between">
      <h3>TOP10 URL</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="used">使用量</el-radio-button>
      <el-radio-button label="request">请求数</el-radio-button>
    </el-radio-group>
    <el-table
      :data="fluxTableData"
      v-if="type == 'used'"
      v-loading='loading'
    >
      <el-table-column prop="Name" label="URL"></el-table-column>
      <el-table-column prop="Value" label="流量">  
        <template slot-scope="scope">
          {{fluxStr(scope.row.Value)}}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="RequestTableData"
      v-if="type == 'request'"
      v-loading='loading'
    >
      <el-table-column prop="Name" label="URL"></el-table-column>
      <el-table-column prop="Value" label="请求数">
        <template slot-scope="scope">
          {{scope.row.Value}}
        </template>
      </el-table-column>
    </el-table>
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
      type: 'used',
      fluxTableData: [],
      RequestTableData: [],
      loading: true,
    }
  },
  watch: {
    params: {
      handler() {
        this.init()
      },
      immediate: true,
      deep: true,
    },
    type(val) {
      this.init()
    }
  },
  filters: {
    formatValue(value) {
      if(value >= 1000) {
        value = (value / 1000).toFixed(2) + 'KB'
      } else {
        value = value + 'B'
      }
      return value
    }
  },
  methods: {
    fixed(v) {
      return Math.ceil(v) !== v ? v.toFixed(2) : v
    },
    fluxStr(v) {
      if (v > 1e12) {
        return [v / 1e12, 'TB'].join('')
      }
      if (v > 1e9) {
        return [v / 1e9, 'GB'].join('')
      }
      if (v > 1e6) {
        return [v / 1e6, 'MB'].join('')
      }
      if (v > 1e3) {
        return [this.fixed(v / 1e3), 'KB'].join('')
      }
      return [v, 'B'].join('')
    },
    init() {
      const { projectId, domainName, interval, times } = this.params
      
      const params = {
        Version: "2018-06-06",
        StartTime: times[0],
        EndTime: times[1],
        Area: "overseas",
      }
      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }
      if(this.type === 'used') {
        this.getFluxTopData(params)
      } else {
        this.getRequestTopData(params)
      }
    },
    getFluxTopData(params) {
      this.loading = true
      this.axios.post('cdn2/ListTopData', {
        ...params,
        Metric: "url",
        Filter: "flux",
      })
        .then(({ Response }) => {
          this.fluxTableData = Response.Data[0].DetailData
          this.loading = false
        })
    },
    getRequestTopData(params) {
      this.loading = true
      this.axios.post('cdn2/ListTopData', {
        ...params,
        Metric: "url",
        Filter: "request",
      })
        .then(({ Response }) => {
          this.RequestTableData = Response.Data[0].DetailData
          this.loading = false
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