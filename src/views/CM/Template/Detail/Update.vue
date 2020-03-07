<template>
  <div class='container-min'>
    <el-card class="card">
      <el-table :data="transLogData">
        <el-table-column prop="logData.updateTime" label="变更时间">
          <template slot-scope="scope">
            <span>{{upTime(scope.row.logData.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastEditUin" label="修改人"></el-table-column>
        <el-table-column label="最后修改">
          <span class="text">查看变更后详情</span>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GET_TRANS_LOG } from '@/constants/CM-yhs.js'
import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共错误码
import moment from 'moment'
export default {
  name: 'templateUpdate',
  data () {
    return {
      transLogData: []
    }
  },
  components: {
    Loading
  },
  created () {
    this.getTransLog()
  },
  methods: {
    async getTransLog () {
      let params = {
        dId: '3433360',
        lang: 'zh',
        limit: 20,
        moduleId: 1,
        offset: 0
      }
      await this.axios.post(GET_TRANS_LOG, params).then(res => {
        if (res.codeDesc === 'Success') {
          this.transLogData = res.data.list
          console.log(res)
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    }
  }
}
</script>

<style scoped lang='scss'>
.card{
  .text{
    color: #006eff;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: #006eff;
    }
  }
}
</style>
