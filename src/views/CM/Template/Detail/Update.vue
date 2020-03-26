<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card">
      <el-table :data="transLogData">
        <el-table-column prop label="變更時間">
          <span>{{upTime( this.information.updateTime)}}</span>
        </el-table-column>
        <el-table-column prop label="修改人">
          <template slot-scope="scope">
            <span>{{scope.row.LastEditUin}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最後修改">
          <span class="text" @click="showDelDialog=true">查看變更後詳情</span>
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
      <p style="color:#444;font-weight:800;margin-bottom:30px">變更後詳情</p>
      <h4 class="title-text">基本訊息</h4>
      <el-form>
        <el-form-item label="範本名稱">
          <span class="text">{{information.groupName}}</span>
        </el-form-item>
        <el-form-item label="策略類型">
          <span class="text">{{information.showName | ViewName}}</span>
        </el-form-item>
        <el-form-item label="最後修改人">
          <span class="text">{{information.lastEditUin}}</span>
        </el-form-item>
        <el-form-item label="最後修改時間">
          <!-- formatDate -->
          <span class="text">{{upTime(information.updateTime)}}</span>
          <!-- <span class="text">{{information.updateTime|formatDate}}</span> -->
        </el-form-item>
      </el-form>
      <hr style="margin-bottom:20px;color:#ddd"/>
      <h4 class="title-text">告警觸發條件</h4>
      <p class="text-color1">指標告警(任意)</p>
      <p class="text-color2" v-for="(it) in IndexAlarm" :key="it.metricShowName">
        {{ `${it.metricShowName}${it.calcType}${it.calcValue}${it.unit},持續${it.continueTime/60}分鍾,${it.alarm}` }}
      </p>
      <p class="text-color1" v-if="EventAlarm&&EventAlarm.length">事件告警</p>
      <p class="text-color2" v-for="(it) in EventAlarm" :key="it.eventShowName">
        {{ `${it.eventShowName},不重複告警` }}
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
                item.alarm = '不重複告警'
              } else if (item.alarmNotifyType == 1) {
                item.alarm = '按週期指數遞增重複告警'
              } else if (anp > 0 && time1 < 30) {
                item.alarm = `按${time1}分鍾重複告警`
              } else if (anp > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小時重複告警`
              } else {
                item.alarm = '按1天重複告警'
              }
            })
            this.information.groupName = it.groupName// 基本信息數據
            this.information.lastEditUin = it.lastEditUin
            this.information.showName = it.viewName
            this.information.updateTime = it.updateTime
            this.IndexAlarm = it.conditionsConfig// 指標告警數據
            this.EventAlarm = it.eventConfig// 事件告警數據
          })
          if (msg) {
            this.transLogData = msg
          }
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {
            'FailedOperation': '操作失敗。',
            'InternalError': '內部錯誤。',
            'InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameterParam': '參數錯誤。',
            'InvalidParameterValue': '無效的參數值。',
            'LimitExceeded': '超過配額限制。',
            'MissingParameter': '缺少參數錯誤。',
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
          return '雲伺服器'
        } else if (val === 'BS') {
          return '雲硬碟'
        } else if (val === 'VPN_GW') {
          return 'VPN網關'
        } else if (val === 'vpn_tunnel') {
          return 'VPN通道'
        } else if (val === 'nat_tc_stat') {
          return 'NAT網關'
        } else if (val === 'DC_GW') {
          return '專線網關'
        } else if (val === 'cdb_detail') {
          return 'MYSQL'
        } else if (val === 'REDIS-CLUSTER') {
          return 'Redis'
        } else if (val === 'dcchannel') {
          return '專用通道'
        } else if (val === 'dcline') {
          return '物理專線'
        } else if (val === 'COS') {
          return '物件存儲'
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
