<template>
  <div>
    <div class="topHeader">
      <span>BOT 详情</span>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="概览" name="overview"></el-tab-pane>
        <el-tab-pane label="未知类型" name="ub"></el-tab-pane>
        <el-tab-pane label="自定义类型" name="ucb"></el-tab-pane>
        <el-tab-pane label="公开类型" name="tcb"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { DESCRIBE_HOSTS, DESCRIBE_BOT_STATUS } from '@/constants'
import overView from './component/botdetail/overView'
import Ub from './component/botdetail/ub'
import Ucb from './component/botdetail/ucb'
import Tcb from './component/botdetail/tcb'
export default {
  data () {
    return {
      tipShow: true, //提示文字
      selBtn: 3, // 默认选中今天按钮
      dateTimeValue: [moment().startOf("day"), moment().endOf("day")], // 日期绑定
      domainValue: "", // 域名绑定
      activeName: "overview", // 默认选中概览页
      options: [],
      routerParams: "overview",
      tableDataBegin: [],
    }
  },
  components: {
    overView,
    Ub,
    Ucb,
    Tcb
  },
  mounted() {
    this.getDescribeHost()
  },
  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    handleTabClick(tab, event) {
      this.routerParams = tab.name
    },
    // 获取防护域名列表
    getDescribeHost(bot='') {
      let params = {
        Version: '2018-01-25',
        Search: this.iptDomain,
        'Item.FlowMode': 0,
        'Item.Status': bot
      } 
      this.loadShow=true;
      this.axios.post(DESCRIBE_HOSTS, params).then(data => {
        this.loadShow=false;
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.tableDataBegin = data.Response.HostList
          this.getBotStatus()
        }
      })
    },
    // 查询bot开关
    getBotStatus() {
      let params = {
        Version: '2018-01-25',
        Category: 'bot'
      }
      this.axios.post(DESCRIBE_BOT_STATUS, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          const botArr = data.Response.Data.Res
          let tempArr = []
          let arr = []
          this.tableDataBegin.forEach(item => {
            let temp = botArr.find(_item => _item.Domain === item.Domain)
            tempArr.push(temp)
          })
          tempArr.map((v) => {
            if(v.Status == 1) {
              arr.push(v)
            }
          })
          this.options = arr
          this.domainValue = this.options[0].Domain;
        }
      })
    },
    //时间点击事件
    checkTime(val) {
      let times = [moment().startOf("day"), moment()] // 默认今天
      this.selBtn = val
      switch (val) {
        case 1:
          times = [moment().subtract(1, "hours"), moment()]
          break;
        case 2:
          times = [moment().subtract(6, "hours"), moment()]
          break;
        case 4:
          times = [moment().subtract(24, "hours").startOf("day"), moment().subtract(24, "hours")]
          break;
        case 5:
          times = [moment().subtract(7, "days").startOf("day"), moment()]
          break;
        default:
          break;
      }
      times[1] = times[1].endOf('day')
      this.dateTimeValue = times
      this.startTime = moment(this.dateTimeValue[0]).utc().valueOf()
      this.endTime = moment(this.dateTimeValue[1]).utc().valueOf()
      this.$nextTick(() => {
        // this.getBotDomainStat()
      })
    },
    changeTimeValue(val) {
      this.selBtn = 0
      this.startTime = moment(val[0]).utc().valueOf()
      this.endTime = moment(val[1]).utc().valueOf()
      this.$nextTick(() => {
        // this.getBotDomainStat()
      })
    },
  }
}

</script>
<style lang='scss' scoped>
.topHeader {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px 20px 0 20px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-right: 20px;
  }
}
.wrapper {
  width: 100%;
  padding: 20px;
   button {
    height: 30px;
    line-height: 6px;
    border-radius: 0;
  }
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      margin-left: 10px;
      right: 20px;
    }
  }
  .topSelect {
    ::v-deep .el-range__icon {
        line-height: 22px;
    }
    ::v-deep .el-range-separator {
      line-height: 22px;
      width: 7%;
    }
    ::v-deep .el-select {
      margin-right: 10px;
    }
    button {
      padding: 0 20px;
    }
    .addStyleBtn {
      background-color: #006eff !important;
      color: #fff;
    }
  }
}
</style>
