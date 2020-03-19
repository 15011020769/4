/* eslint-disable no-unreachable */
<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>访问用户区域分布</h3>
      <i class="el-icon-download icon" @click="_export" />
    </el-row>
    <el-row type="flex" class="header" justify="space-between">
      <el-radio-group v-model="type" size="small" @change="changeRadio">
        <el-radio-button label="flux">流量</el-radio-button>
        <el-radio-button label="request">访问次数</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-col :span="16" style="padding-right:20px">
        <div class="box-left">
          <el-row class="empty" v-if="seriesMap.length == 0 ? true : false">
            暂无数据
          </el-row>
          <echart-map
            :series="seriesMap"
            :total="totalNumber"
            :trafficOrVisits="type"
            v-loading="loading"
            v-else
          />
        </div>
      </el-col>
      <el-col class="box-right" :span="8">
        <el-table
          :data="tableData.slice((currpage - 1) * pageSize, currpage * pageSize)"
          v-loading="loading"
          :empty-text="t('暂无数据', 'WAF.zwsj')"
        >
          <el-table-column prop="name" label="用户所在区域"></el-table-column>
          <el-table-column v-if="type === 'flux'" prop="value" label="流量">
            <template slot-scope="scope">
              {{ fluxStr(scope.row.value) }}
            </template>
          </el-table-column>
          <el-table-column v-if="type === 'flux'" prop="ratio" label="流量占比">
            <template slot-scope="scope">
              {{ totalNumber === 0 ? 0 : fixed(((scope.row.value / totalNumber) * 100)) }}%
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === 'request'"
            prop="value"
            label="访问次数"
          >
            <template slot-scope="scope">
              {{ scope.row.value }}次
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
import { LIST_TOP_DATA } from '@/constants'
import { COUNTRY_MAP } from '../../components/constants'
import echartMap from '../../components/worldMap'

export default {
  components: {
    echartMap
  },
  props: {
    params: Object,
    AreaType: {
      type: String,
      default: 'server'
    }
  },
  data () {
    return {
      tableData: [],
      type: 'flux',
      loading: true,
      total: 0,
      seriesMap: [],
      totalNumber: 1,
      COUNTRY_MAP,
      pageSize: 6, // 每页数量
      currpage: 1, // 页数
      totalItems: 0,
      fluxData: [],
      requestData: []
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

    fixed (v) {
      return Math.ceil(v) !== v ? v.toFixed(2) : v
    },
    fluxStr (v) {
      if (this.type === 'flux') {
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
      }
    },
    _export () {
      const { projectName, domainName, AreaType, times, interval } = this.params

      const start = moment(times[0]).format('YYYY-MM-DD')
      const end = moment(times[1]).format('YYYY-MM-DD')
      let fileName = start
      if (start !== end) {
        fileName = `${start}-${end}`
      }
      fileName += '_district_detail.xlsx'
      let data = [
        ['开始时间', moment(times[0]).format('YYYY-MM-DD')],
        ['结束时间', moment(times[1]).format('YYYY-MM-DD')],
        ['统计数据类型', AreaType === 'client' ? '客户端地区' : '服务地区'],
        ['统计项目', projectName || '全部项目'],
        ['统计域名', domainName || '全部域名'],
        ['导出时间', moment().format('YYYYMMDDHHmmss')],
        [],
        ['地区', '流量（GB）', '访问次数']
      ]
      const { fluxData, requestData } = this
      const result = fluxData.map((data, i) => {
        return [data.name, (data.value / 1e9).toFixed(2) === '0.00' ? 0 : (data.value / 1e9).toFixed(2), requestData[i].value]
      })

      data = data.concat(result)
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws)
      XLSX.writeFile(wb, fileName)
    },
    init () {
      const {
        projectId,
        projectName,
        domainName,
        interval,
        times,
        AreaType
      } = this.params
      const params = {
        AreaType,
        StartTime: moment(times[0]).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment(times[1]).format('YYYY-MM-DD 23:59:59')
      }

      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains.0'] = domainName
      }

      this.getData(params)
    },
    // 获取数据
    getData (params) {
      this.getFlux(params)
      this.getRequest(params)
    },
    getFlux (params) {
      if (this.type === 'flux') {
        this.loading = true
      }
      let regionsArr = []
      const tableArr = []
      let total = 0
      this.axios.post(LIST_TOP_DATA,
        { ...params,
          Area: 'overseas',
          Version: '2018-06-06',
          Metric: 'District',
          Filter: 'flux'
        })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            const res = Response.Data[0].DetailData
            res &&
              res.forEach(v => {
                total += v.Value
                tableArr.push({
                  name: this.COUNTRY_MAP[v.Name],
                  value: v.Value
                })
              })
            res && res.forEach(v => {
              regionsArr.push({
                name: this.COUNTRY_MAP[v.Name],
                value: ((v.Value / total) * 100).toFixed(2)
              })
            })
          }
          if (this.type === 'flux') {
            this.totalNumber = total
            this.seriesMap = regionsArr // 传百分数因为比较的就是百分比
            this.tableData = tableArr
            this.totalItems = tableArr.length
          }
          this.fluxData = tableArr
          this.loading = false
        }).then(() => {
          this.loading = false
        })
    },
    getRequest (params) {
      if (this.type === 'request') {
        this.loading = true
      }
      const tableArr = []
      let total = 0
      this.axios.post(LIST_TOP_DATA,
        { ...params,
          Area: 'overseas',
          Version: '2018-06-06',
          Metric: 'District',
          Filter: 'request'
        })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            const res = Response.Data[0].DetailData
            res &&
              res.forEach(v => {
                total += v.Value
                tableArr.push({
                  name: this.COUNTRY_MAP[v.Name],
                  value: v.Value
                })
              })
          }
          if (this.type === 'request') {
            this.totalNumber = total
            this.seriesMap = tableArr // 传百分数因为比较的就是百分比
            this.tableData = tableArr
            this.totalItems = tableArr.length
          }
          this.requestData = tableArr
          this.loading = false
        }).then(() => {
          this.loading = false
        })
    },
    changeRadio () {
      this.loading = true
      this.init()
    },
    handleCurrentChange (val) {
      this.currpage = val
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
