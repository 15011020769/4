<template>
  <div>
    <div class="dominList">
      <div class="tableList">
        <el-table
          :data="domainsList"
          v-loading="loading"
          :empty-text="t('暂无数据', 'WAF.zwsj')"
        >
          <el-table-column
            prop="DomainId"
            label="用户所在区域"
          ></el-table-column>
          <el-table-column
            v-if="trafficOrVisits == 'flux'"
            prop="DomainId"
            label="流量"
          ></el-table-column>
          <el-table-column
            v-if="trafficOrVisits == 'flux'"
            prop="DomainId"
            label="流量占比"
          ></el-table-column>
          <el-table-column
            v-if="trafficOrVisits == 'request'"
            prop="DomainId"
            label="访问次数"
          ></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_HOSTS } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'

import { flatObj } from '@/utils'
import type from '@/views/CM/CM_assembly/product_type'

export default {
  props: {
    domainsList: Array,
    loading: {
      type: Boolean,
      default () {
        return true
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    trafficOrVisits: {
      type: String,
      default () {
        return ''
      }
    }
  },
  created () {
    console.log(1)
  },
  // mounted () {
  //   console.log(0)
  // },
  data () {
    return {
      abnormal: [4, 5, 6, 9],
      allDomains: [], // 表格数据
      checkedWafs: [],

      ClsStatus: '',
      Status: '',
      // total: 0,
      currentPage: 1,
      pageSize: 20,
      // refresh: false,
      timer: undefined
    }
  },
  computed: {
    domains () {
      return this.domainsList.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    }
  },
  components: {

  },
  watch: {
    // ClsStatus () {
    //   this.getData()
    // },
    // Status () {
    //   this.getData()
    // }
    // refresh (n) {
    //   if (n === true) {
    //     this.timer = setTimeout(() => {
    //       this.getData()
    //     }, 2000)
    //   }
    // }
  },
  beforeRouteLeave (to, from, next) {
    this.timer && clearTimeout(this.timer)
    next()
  },
  mounted () {
    // this.getData()
    console.log(0)
  },
  methods: {

    handleCurrentChange (page) {
      console.log('page')
      this.currentPage = page
    },
    handleSizeChange (size) {
      this.pageSize = size
      console.log('size')
    },

    // 获取数据
    getData () {
      const param = {
        Version: '2018-01-25'
        // Search: this.keyword
      }
      const item = {}
      if (this.Status !== undefined) {
        item.Status = this.Status
      }
      if (this.ClsStatus !== undefined) {
        item.ClsStatus = this.ClsStatus
      }
      if (Object.keys(item).length) {
        param.Item = item
      }
      this.axios.post(DESCRIBE_HOSTS, flatObj(param))
        .then(resp => {
          this.generalRespHandler(resp, ({ HostList, TotalCount }) => {
            const domains = HostList
            let refresh = false
            domains.forEach(domain => {
              domain.StatusBool = !!domain.Status
              domain.ClsStatusBool = !!domain.ClsStatus
              domain.delDialog = false
              if (!refresh && this.abnormal.includes(domain.State)) {
                refresh = true
              }
            })
            this.total = TotalCount
            this.allDomains = domains
            this.refresh = true
          })
        }).then(() => {
          this.loading = false
        })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
