<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card">
      <el-table :data="transLogData">
        <el-table-column prop label="变更时间">
          <template slot-scope="scope">
            <span>{{upTime(scope.row.logData.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastEditUin" label="修改人"></el-table-column>
        <el-table-column label="最后修改">
          <span class="text" @click="showDelDialog=true">查看变更后详情</span>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog class="dil" :visible.sync="showDelDialog" width="50%">
      <p style="color:#444;font-weight:800;margin-bottom:30px">变更后详情</p>
      <h4 class="title-text">基本信息</h4>
      <el-form>
        <el-form-item label="模板名称">
          <span class="text">{{transLogData[0] && transLogData[0].logData.groupName}}</span>
        </el-form-item>
        <el-form-item label="策略类型">
          <span class="text">{{transLogData[0] && transLogData[0].logData.showName}}</span>
        </el-form-item>
        <el-form-item label="最后修改人">
          <span class="text">{{transLogData[0] && transLogData[0].lastEditUin}}</span>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <span class="text">{{upTime(transLogData[0] && transLogData[0].logData.updateTime)}}</span>
        </el-form-item>
      </el-form>
      <hr style="margin-bottom:20px;color:#ddd"/>
      <h4 class="title-text">告警触发条件 <span @click="openEdit()">编辑</span></h4>
      <p class="text-color1">指标告警(任意)</p>
      <p class="text-color2" v-for="(it) in IndexAlarm" :key="it.metricShowName">
        {{ `${it.metricShowName}>${it.calcValue}${it.unit},持续${it.continueTime}秒,按${it.calcType}天重复告警` }}
      </p>
      <p class="text-color1">事件告警</p>
      <p class="text-color2" v-for="(it) in EventAlarm" :key="it.eventShowName">
        {{ `${it.eventShowName},不重复告警` }}
      </p>
    </el-dialog>
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
      loadShow: false, // 加载显示
      showDelDialog: false, // 是否显示弹框
      transLogData: [],
      IndexAlarm: [], // 指标告警
      EventAlarm: [], // 事件告警
      groudId: ''
    }
  },
  components: {
    Loading
  },
  created () {
    this.groudId = this.$route.params.id
    this.getTransLog()
  },
  methods: {
    async getTransLog () {
      this.loadShow = true
      let params = {
        dId: this.groudId,
        lang: 'zh',
        limit: 20,
        moduleId: 1,
        offset: 0
      }
      await this.axios.post(GET_TRANS_LOG, params).then(res => {
        if (res.codeDesc === 'Success') {
          let msg = res.data.list
          // console.log(res)
          if (msg[0]) {
            this.transLogData = msg
            this.IndexAlarm = msg[0].logData.conditionsConfig
            this.EventAlarm = msg[0].logData.eventConfig
          }
          this.loadShow = false
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
.dil >>> .el-dialog__body{
  padding:0 20px 20px;
}
.dil >>> .el-form-item__label{
  font-size: 12px;
  color: #888;
  line-height: 20px;
}
.dil >>> .el-form-item__content{
  line-height: 20px;
}
.dil{
  .title-text{
    font-size: 14px;
    font-weight: 700;
    color: #000;
    margin-bottom: 20px;
  }
  .text{
    font-size:12px;
    color: #444;
  }
  .text-color1{
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
    line-height: 15px;
  }
  .text-color2{
    font-size: 12px;
    color: #444;
    margin-bottom: 10px;
    line-height: 15px;
  }
}
</style>
