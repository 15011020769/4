<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>错误码</h3>
      <i class="el-icon-download icon" @click="exportEchart"/>
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
import XLSX from 'xlsx'
import FileSaver from "file-saver";
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
      errcode_json: []
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
      const ws = XLSX.utils.json_to_sheet(this.errcode_json);/* 新建空workbook，然后加入worksheet */
      const wb = XLSX.utils.book_new();/*新建book*/
      XLSX.utils.book_append_sheet(wb, ws, `${moment().format('x')}_error_code`);/* 生成xlsx文件(book,sheet数据,sheet命名) */
      XLSX.writeFile(wb, `${moment().format('x')}_error_code.xlsx`);/*写文件(book,xlsx文件名称)*/
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
          const tempArr = []
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
          this.tableData.map(item => {
            tempArr.push({
              '错误码': item.Metric,
              '数量（次）': item.SummarizedData.Value,
              '占比（%）': (item.SummarizedData.Value / this.totalNumber * 100).toFixed(2)
            })
          })
          this.errcode_json = tempArr
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