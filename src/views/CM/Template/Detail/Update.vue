<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card">
      <el-table :data="transLogData">
        <el-table-column prop label="变更时间">
          <template slot-scope="scope">
            <span>{{upTime(scope.row.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="修改人">
          <template slot-scope="scope">
            <span>{{scope.row.LastEditUin}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改">
          <span class="text" @click="showDelDialog=true">查看变更后详情</span>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination
          :page-size="pagesize"
          :current-page="currpage"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 查看变更后详情弹窗 -->
    <el-dialog class="dil" :visible.sync="showDelDialog" width="50%">
      <p style="color:#444;font-weight:800;margin-bottom:30px">变更后详情</p>
      <h4 class="title-text">基本信息</h4>
      <el-form>
        <el-form-item label="模板名称">
          <span class="text">{{information.groupName}}</span>
        </el-form-item>
        <el-form-item label="策略类型">
          <span class="text">{{information.showName | ViewName}}</span>
        </el-form-item>
        <el-form-item label="最后修改人">
          <span class="text">{{information.lastEditUin}}</span>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <span class="text">{{upTime(information.updateTime)}}</span>
        </el-form-item>
      </el-form>
      <hr style="margin-bottom:20px;color:#ddd"/>
      <h4 class="title-text">告警触发条件</h4>
      <p class="text-color1">指标告警(任意)</p>
      <p class="text-color2" v-for="(it) in IndexAlarm" :key="it.metricShowName">
        {{ `${it.metricShowName}${it.calcType}${it.calcValue}${it.unit},持续${it.continueTime/60}分钟,${it.alarm}` }}
      </p>
      <p class="text-color1" v-if="EventAlarm&&EventAlarm.length">事件告警</p>
      <p class="text-color2" v-for="(it) in EventAlarm" :key="it.eventShowName">
        {{ `${it.eventShowName},不重复告警` }}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { GET_DESCRIBETRANSLOG } from '@/constants/CM-yhs.js'
import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共错误码
import moment from 'moment'
export default {
  name: 'templateUpdate',
  data () {
    return {
      loadShow: false, // 加载显示
      showDelDialog: false, // 是否显示弹框
      transLogData: [], // 全部数据
      information: {}, // 基本信息
      IndexAlarm: [], // 指标告警
      EventAlarm: [], // 事件告警
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      groudId: '',
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
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
    // 获取日志数据
    async getTransLog () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        ModuleId: 1,
        DId: this.groudId
        // limit: 20,
        // offset: 0
      }
      await this.axios.post(GET_DESCRIBETRANSLOG, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.List
          this.TotalCount = res.Response.Total
          msg.forEach(ele => {
            if (!ele.LogData) return
            let it = JSON.parse(ele.LogData)
            it.conditionsConfig.forEach((item, i) => { // 遍历指标告警数组处理需要显示的数据
              let ct = Number(item.calcType)
              let anp = Number(item.alarmNotifyPeriod)
              item.calcType = this.SymbolList[ct - 1]
              let time1 = anp / 60
              let time2 = anp / (60 * 60)
              if (anp == 0 && item.alarmNotifyType == 0) {
                item.alarm = '不重复告警'
              } else if (item.alarmNotifyType == 1) {
                item.alarm = '按周期指数递增重复告警'
              } else if (anp > 0 && time1 < 30) {
                item.alarm = `按${time1}分钟重复告警`
              } else if (anp > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小时重复告警`
              } else {
                item.alarm = '按1天重复告警'
              }
            })
            this.information.groupName = it.groupName// 基本信息数据
            this.information.lastEditUin = it.lastEditUin
            this.information.showName = it.viewName
            this.information.updateTime = it.updateTime
            this.IndexAlarm = it.conditionsConfig// 指标告警数据
            this.EventAlarm = it.eventConfig// 事件告警数据
          })
          if (msg) {
            this.transLogData = msg
          }
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {
            'FailedOperation': '操作失败。',
            'InternalError': '内部错误。',
            'InvalidParameter': '参数错误。',
            'InvalidParameter.InvalidParameter': '参数错误。',
            'InvalidParameter.InvalidParameterParam': '参数错误。',
            'InvalidParameterValue': '无效的参数值。',
            'LimitExceeded': '超过配额限制。',
            'MissingParameter': '缺少参数错误。',
            'UnsupportedOperation': '操作不支持。'
          }
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
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
      this.getTransLog()
    },
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    }
  },
  filters:{
    ViewName (val) {
      if (val) {
        if (val === 'cvm_device') {
          return '云服务器'
        } else if (val === 'BS') {
          return '云硬盘'
        } else if (val === 'VPN_GW') {
          return 'VPN网关'
        } else if (val === 'vpn_tunnel') {
          return 'VPN通道'
        } else if (val === 'nat_tc_stat') {
          return 'NAT网关'
        } else if (val === 'DC_GW') {
          return '专线网关'
        } else if (val === 'cdb_detail') {
          return 'MYSQL'
        } else if (val === 'REDIS-CLUSTER') {
          return 'Redis'
        } else if (val === 'dcchannel') {
          return '专用通道'
        } else if (val === 'dcline') {
          return '物理专线'
        } else if (val === 'COS') {
          return '对象存储'
        }
      }
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
.Right-style {
      display: flex;
      justify-content: flex-end;

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
    line-height: 32px;
  }
}
</style>
