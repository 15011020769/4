<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.12')}}</h3>
      <i class="el-icon-download icon" @click="exportEchart"/>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-row class="empty" v-if="seriesPieErrorCode.length == 0 ? true : false">
          {{$t('CDNT.report.17')}}
        </el-row>
        <echart-pie
          :series="seriesPieErrorCode"
          :color="colorPie"
          :totalNumber="totalNumber"
          v-else
          v-loading="loading"
        />
      </el-col>
      <el-col :span="14">
        <el-table
          :data="tableData"
          v-loading="loading"
        >
          <el-table-column prop="Metric" label="$t('CDNT.report.12')"></el-table-column>
          <el-table-column prop="SummarizedData.Value" :label="$t('CDNT.report.18')"></el-table-column>
          <el-table-column prop="num" :label="$t('CDNT.report.19')">
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
import XLSX from 'xlsx'
import echartPie from "../components/pie"
export default {
  props: {
    params: Object
  },
  data() {
    return {
      seriesPieErrorCode: [],
      colorPie: ['#006eff', '#29cc85', '#434348', '#74BD48', "#F7A35C", '#8D62AE'],
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
    exportEchart() {
      const { projectName, domainName, type, times, interval } = this.params
      let fileName
      const start = times[0].split(' ')[0]
      const end = times[1].split(' ')[0]
      if (interval === '5min') { // 日报
        fileName = `${start}_error_code.xlsx`
      } else {
        fileName = `${start}-${end}_error_code.xlsx`
      }
      let data = [
        ['统计项目', projectName || '全部项目'],
        ['统计域名', domainName || '全部域名'],
        ['报表类型', type],
        ['开始时间', times[0]],
        ['结束时间', times[1]],
        [],
        ['错误码', '数量（次）', '占比（%）']
      ]
      this.tableData.map(item => {
        data.push([
          item.Metric,
          item.SummarizedData.Value,
         (item.SummarizedData.Value / this.totalNumber * 100).toFixed(2)
        ])
      })
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'error_code');
      XLSX.writeFile(wb, fileName);
    },
    init() {
      const { projectId, domainName, interval, times } = this.params
      const params = {
        Version: "2018-06-06",
        StartTime: times[0],
        EndTime: times[1],
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
          if (Response.Data && Response.Data.length) {
            Response.Data[0].CdnData.map((item) => {
              if(item.Metric.indexOf(4) !== -1 && item.Metric !== '4xx') {
                errCode.push({name: item.Metric, value: item.SummarizedData.Value})
                legendArr.push(item.Metric)
                total += item.SummarizedData.Value
                tableArr.push(item)
              }
            })
          }
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
 .empty {
  height: 400px;
  width: 100%;
  line-height: 400px;
  text-align: center;
  font-weight: bold
}
</style>