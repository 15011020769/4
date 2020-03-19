<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>访问用户区域分布</h3>
      <i class="el-icon-download icon" />
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
          :data="domainsList"
          v-loading="loading"
          :empty-text="t('暂无数据', 'WAF.zwsj')"
        >
          <el-table-column prop="name" label="用户所在区域"></el-table-column>
          <el-table-column v-if="type == 'flux'" prop="value" label="流量">
          </el-table-column>
          <el-table-column v-if="type == 'flux'" prop="ratio" label="流量占比">
            <template slot-scope="scope">
              {{ ((scope.row.Value / totalNumber) * 100).toFixed(2) + "%" }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="type == 'request'"
            prop="Value"
            label="访问次数"
          ></el-table-column>
        </el-table>
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination> -->

        <!-- <analyslist
          :domainsList="domainsList"
          :loading="loading"
          :total="total"
          :trafficOrVisits="type"
        ></analyslist> -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import moment from 'moment'

import { LIST_TOP_DATA, DESCRIBE_HOSTS } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { COUNTRY_MAP } from '../../components/constants'
import { flatObj } from '@/utils'
import echartMap from '../../components/worldMap'
import type from '@/views/CM/CM_assembly/product_type'
import Header from '@/components/public/Head'
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
      domainsList: [],
      package: [],
      type: 'flux',
      AreaTypeData: this.params,
      loading: true,
      total: 0,
      seriesMap: [],
      totalNumber: 1,
      COUNTRY_MAP

    }
  },
  watch: {
    params: {
      handler () {
        this.init()
      },
      immediate: true,
      deep: true
    },

    totalNumber () {
      this.getData()
    },
    AreaTypeData () {
      this.getData()
    }

  },

  created () {
    this.getData()
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
        console.log([v, 'B'].join(''), '[v,')
        return [v, 'B'].join('')
      }
    },

    YymmddFormat (newDate) {
      let Month = newDate.getMonth() + 1
      Month = Month >= 10 ? Month : '0' + Month
      let d = newDate.getDate()
      d = d >= 10 ? d : '0' + d
      let h = newDate.getHours()
      h = h >= 10 ? h : '0' + h
      let m = newDate.getMinutes()
      m = m >= 10 ? m : '0' + m
      let s = newDate.getSeconds()
      s = s >= 10 ? s : '0' + s
      return [
        [newDate.getFullYear(), Month, d].join('-'), [h, m, s].join(':')
      ].join(' ')
    },
    init () {
      const { projectId, domainName, AreaType, times } = this.params

      const params = {
        AreaType: AreaType,
        StartTime: (times[0].format === undefined) ? this.YymmddFormat(times[0]) : times[0].format('YYYY-MM-DD HH:mm:ss'),
        EndTime: (times[1].format === undefined) ? this.YymmddFormat(times[1]) : times[1].format('YYYY-MM-DD HH:mm:ss')

      }

      if (projectId) {
        params.Project = projectId
      }
      if (domainName) {
        params['Domains1.0'] = domainName
      }

      this.getData(params)
    },
    // 获取数据
    getData (params) {
      this.loading = true
      const regionsArr = []
      let total = 1
      this.axios.post(LIST_TOP_DATA,
        { ...params,
          Area: 'overseas',
          Version: '2018-06-06',
          Metric: 'District',
          Filter: this.type
        })
        .then(resp => {
          let res = resp.Response.Data[0].DetailData
          console.log(res, 'res')
          this.$nextTick(function () {
            this.domainsList = resp.Response.Data[0].DetailData
            if (resp.Response.Data[0].DetailData.length != 0) {
              resp.Response.Data[0].DetailData.forEach(item => {
                total += item.Value
                if (this.type === 'flux') {
                  if (item.Value > 1e12) {
                    item.value = item.Value / 1e12 + 'TB'
                  } else if (item.Value > 1e9) {
                    item.value = item.Value / 1e9 + 'GB'
                  } else if (item.Value > 1e6) {
                    item.value = item.Value / 1e6 + 'MB'
                  } else if (item.Value > 1e3) {
                    item.value = item.Value / 1e3 + 'KB'
                  } else {
                    item.value = item.Value + 'B'
                  }
                }
                item.name = this.COUNTRY_MAP[item.Name]
              })
            }

            this.totalNumber = total
          })
          res && res.map((v) => {
            if (this.type === 'flux') {
              regionsArr.push({
                name: this.COUNTRY_MAP[v.Name],
                value: (v.Value / this.totalNumber * 100).toFixed(2)
              })
            } else {
              regionsArr.push({
                name: this.COUNTRY_MAP[v.Name],
                value: v.Value
              })
            }
          })
          this.seriesMap = regionsArr
        }).then(() => {
          this.loading = false
        })
    },
    changeRadio (val) {
      this.loading = true
      this.getData()
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
.box-left {
  // border: 1px solid #ebeef5;
}
.box-right {
  // border-top: 1px solid #ebeef5;
}
</style>
