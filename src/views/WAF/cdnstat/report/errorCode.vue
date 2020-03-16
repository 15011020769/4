<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>错误码</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-row>
      <el-col :span="10">
        <echart-pie
          :series="seriesPieErrorCode"
          :color="colorPie"
          :totalNumber="totalNumber"
          v-loading="loading"
        />
      </el-col>
      <el-col :span="14">
        <el-table
          :data="tableData"
          v-loading="loading"
        >
          <el-table-column prop="Metric" label="错误码"></el-table-column>
          <el-table-column prop="SummarizedData.Value" label="数量(次)"></el-table-column>
          <el-table-column prop="num" label="占比">
            <template slot-scope="scope">
              {{(scope.row.SummarizedData.Value / totalNumber * 100).toFixed(2) + '%'}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import moment from 'moment'
import echartPie from "../components/pie"
export default {
  props: {
    params: Object
  },
  data() {
    return {
      seriesPieErrorCode: [],
      colorPie: ['#006eff', 'rgb(41, 204, 133)', '#434348', '#74BD48', "#F7A35C", '#8D62AE'],
      legendTextPieError: [],
      totalNumber: 1,
      loading: true,
      tableData: [],
    }
  },
  components: {
    echartPie,
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
  mounted() {
    // console.log(this.params)
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
      this.getErrorCode(params)
    },
    getErrorCode(params) {
      this.loading = true
      this.axios.post('cdn2/DescribeCdnData', {
        ...params,
        Metric: "topStatusCode",
      })
        .then(({ Response }) => {
          const errCode = []
          const legendArr = []
          let total = 0
          const tableArr = []
          Response.Data[0].CdnData.map((item) => {
            if(item.Metric.indexOf(4) !== -1 && item.Metric !== '4xx') {
              errCode.push({name: item.Metric, value: item.SummarizedData.Value})
              legendArr.push(item.Metric)
              total += item.SummarizedData.Value
              tableArr.push(item)
            }
          })
          this.seriesPieErrorCode = errCode
          this.legendTextPieError = legendArr
          this.totalNumber = total
          this.tableData = tableArr
        }).then(() => this.loading = false)
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