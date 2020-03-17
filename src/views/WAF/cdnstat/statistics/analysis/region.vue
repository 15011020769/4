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
        <div class="box-left">22</div>
      </el-col>
      <el-col class="box-right" :span="8">
        <analyslist
          :domainsList="domainsList"
          :loading="loading"
          :total="total"
          :trafficOrVisits="type"
        ></analyslist>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import analyslist from '../components/analyslist'
import { DESCRIBE_HOSTS, LIST_TOP_DATA } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'

import { flatObj } from '@/utils'
export default {
  components: {
    analyslist
  },
  data () {
    return {
      domainsList: [],
      package: [],
      type: 'flux',
      loading: true,
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      const param = {
        Area: 'overseas',
        AreaType: 'server',
        EndTime: '2020-03-17 23:59:59',
        Filter: this.type,
        Metric: 'District',
        StartTime: '2020-03-11 00:00:00',
        Version: '2018-06-06'

      }

      this.axios.post(LIST_TOP_DATA, flatObj(param))
        .then(resp => {
          console.log(resp.Response.Data[0].DetailData, 'HostList')
          // this.generalRespHandler(resp, ({ HostList, TotalCount }) => {
          //   this.domainsList = HostList

          //   this.total = TotalCount
          // })
        }).then(() => {
          this.loading = false
        })
    },
    changeRadio () {
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
  border: 1px solid #ebeef5;
}
.box-right {
  border-top: 1px solid #ebeef5;
}
</style>
