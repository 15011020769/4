<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>区域流量分布</h3>
      <i class="el-icon-download icon" @click="exportEchart" />
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-row class="empty" v-if="seriesMap.length == 0 ? true : false">
          暂无数据
        </el-row>
        <echart-map
          :series="seriesMap"
          :total="totalNumber"
          v-loading="loading"
          v-else
        />
      </el-col>
      <el-col :span="8">
        <el-table
          :data="
            tableData.slice((currpage - 1) * pageSize, currpage * pageSize)
          "
          v-loading="loading"
        >
          <el-table-column prop="name" label="区域"></el-table-column>
          <el-table-column prop="value" label="消耗量">
            <template slot-scope="scope">
              {{ fluxStr(scope.row.value) }}
            </template>
          </el-table-column>
          <el-table-column label="占比">
            <template slot-scope="scope">
              {{ ((scope.row.value / totalNumber) * 100).toFixed(2) + "%" }}
            </template>
          </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{ totalItems }}&nbsp;條</span>
          <el-pagination
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalItems"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import moment from 'moment'
import XLSX from 'xlsx'
import echartMap from '../components/worldMap'
import { COUNTRY_MAP } from '../components/constants'

export default {
  props: {
    params: Object
  },
  data () {
    let vue = this
    return {
      seriesMap: [],
      tableData: [], // 表格数据
      COUNTRY_MAP,
      loading: true, // 加载状态
      totalNumber: 1, // 总消耗量
      currpage: 1, // 页数
      pageSize: 6, // 每页数量
      totalItems: 0 // 总条数
    }
  },
  components: {
    echartMap
  },
  filters: {
    fluxStr (v) {
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
        return [v / 1e3, 'KB'].join('')
      }
      return [v, 'B'].join('')
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
  methods: {
    exportEchart () {
      let data = [
        ['统计项目', '全部项目'],
        ['统计域名', '全部域名'],
        ['报表类型', '日报'],
        ['开始时间', this.params.times[0]],
        ['结束时间', this.params.times[1]],
        [],
        ['区域', '消耗量（B）', '占比（%）']
      ]
      this.tableData.map(item => {
        data.push([
          item.name,
          item.value,
          (item.value / this.totalNumber * 100).toFixed(2)
        ])
      })
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, `${moment().format('x')}_traffic_distribution`)
      XLSX.writeFile(wb, `${moment().format('x')}_traffic_distribution.xlsx`)
    },
    fixed (v) {
      return Math.ceil(v) !== v ? v.toFixed(2) : v
    },
    fluxStr (v) {
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
    init () {
      const { projectId, domainName, interval, times } = this.params

      const params = {
        Version: '2018-06-06',
        StartTime: times[0],
        EndTime: times[1],
        Area: 'overseas'
      }
      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }
      this.getListTopData(params)
    },
    getListTopData (params) {
      console.log(params, '000====')
      this.loading = true
      const regionsArr = []
      const tableArr = []
      let total = 1
      this.axios.post('cdn2/ListTopData', {
        ...params,
        Metric: 'District',
        Filter: 'flux'
      })
        .then(({ Response }) => {
          const res = Response.Data[0].DetailData
          res && res.map(v => {
            total += v.Value
            tableArr.push({
              name: this.COUNTRY_MAP[v.Name],
              value: v.Value
            })
          })
          this.totalNumber = total
          res && res.map((v) => {
            regionsArr.push({
              name: this.COUNTRY_MAP[v.Name],
              value: (v.Value / this.totalNumber * 100).toFixed(2)
            })
          })
          this.seriesMap = regionsArr // 传百分数因为比较的就是百分比
          this.tableData = tableArr
          this.totalItems = tableArr.length
          this.loading = false
        })
    },
    handleCurrentChange (val) {
      this.currpage = val
      this.getListTopData()
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
.Right-style {
  display: flex;
  justify-content: space-between;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 62px;
  }
  .el-pagination {
    border-bottom: none;
  }
}
.empty {
  height: 480px;
  width: 100%;
  line-height: 480px;
  text-align: center;
  font-weight: bold;
}
</style>
