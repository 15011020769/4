<template>
  <div>
    <div class="topHeader">
      <span>{{t('BOT 详情', 'WAF.botxq')}}</span>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="t('概览', 'WAF.gl')" name="overview"></el-tab-pane>
        <el-tab-pane :label="t('未知类型', 'WAF.wzlx')" name="ub"></el-tab-pane>
        <el-tab-pane :label="t('自定义类型', 'WAF.zdylx')" name="ucb"></el-tab-pane>
        <el-tab-pane :label="t('公开类型', 'WAF.gklx')" name="tcb"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">{{t('BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多', 'WAF.botxwgl')}}</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <el-row class="topSelect">
        <el-select
          v-model="domainValue"
          filterable
          popper-class="selectDomin"
          default-first-option
          size="mini"
        >
          <el-option
            v-for="item in options"
            :key="item.Domain"
            :label="item.Domain"
            :value="item.Domain"
          ></el-option>
        </el-select>
        <el-button-group>
          <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">近1小{{t('时', 'WAF.hour')}}</el-button>
          <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">近6小{{t('时', 'WAF.hour')}}</el-button>
          <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">今天</el-button>
          <el-button @click="checkTime(4)" :class="selBtn=='4'?'addStyleBtn':''">昨天</el-button>
          <el-button @click="checkTime(5)" :class="selBtn=='5'?'addStyleBtn':''">近7天</el-button>
        </el-button-group>
        <el-date-picker
          v-model="dateTimeValue"
          type="datetimerange"
          class="timeValue"
          range-separator="至"
          :start-placeholder="t('开始日期', 'WAF.ksrq')"
          :end-placeholder="t('结束日期', 'WAF.jsrq')"
          :clearable= false
          @change="changeTimeValue"
        ></el-date-picker>
        <i class="el-icon-refresh" @click="id+=1" />
        <el-input
          v-model.trim="sourceIp"
          :placeholder="activeName == 'ucb' ? t('请输入源IP或策略名称', 'WAF.qsryipcl') : t('请输入源IP', 'WAF.qsryip')"
          v-if="activeName != 'overview'"
          class="search-input"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" @click="id+=1" />
        </el-input>
      </el-row>
      <over-view
        :domain="domainValue"
        :times="[startTime, endTime]"
        :id="id"
        :selBtn="selBtn"
        v-if="activeName == 'overview'">
      </over-view>
      <Ub
        :domain="domainValue"
        :times="[startTime, endTime]"
        :id="id"
        v-if="activeName == 'ub'"
        :sourceIp="sourceIp">
      </Ub>
      <Ucb
        :domain="domainValue"
        :times="[startTime, endTime]"
        :id="id"
        v-if="activeName == 'ucb'"
        :sourceIp="sourceIp">
      </Ucb>
      <Tcb
        :domain="domainValue"
        :times="[startTime, endTime]"
        :id="id"
        v-if="activeName == 'tcb'"
        :sourceIp="sourceIp">
      </Tcb>
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
      startTime: moment().startOf("days").utc().valueOf(),
      endTime: moment().endOf("days").utc().valueOf(),
      domainValue: "", // 域名绑定
      activeName: "overview", // 默认选中概览页
      options: [],
      tableDataBegin: [],
      sourceIp: "", // 搜索框绑定
      id: 0, // 用于父组件点击查询
    }
  },
  components: {
    overView,
    Ub,
    Ucb,
    Tcb
  },
  watch: {
    activeName() {
      this.sourceIp = ''
    }
  },
  mounted() {
    this.$router.afterEach((to, from, next) => {
        window.scrollTo(0, 0)
    })
    this.getDescribeHost()
  },
  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
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
        }
      }).then(() => {
        if (this.$route.query.domain) {
          this.domainValue = this.$route.query.domain
        } else {
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
    },
    changeTimeValue(val) {
      if (val == null) val = []
      this.selBtn = 0
      this.startTime = moment(val[0]).utc().valueOf()
      this.endTime = moment(val[1]).utc().valueOf()
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
    & > * {
      float: left;
    }
    .selectDomin {
      width: 230px;
    }
    ::v-deep {
      
      flex-wrap: wrap !important;
    }
    ::v-deep .el-button{
      font-size: 12px !important;
    }
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
    ::v-deep .el-input {
      width: 250px;
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
.search-input {
  font-size: 12px;
  float: right !important;
  .el-icon-search {
    cursor: pointer;
  }
  ::v-deep .el-input__suffix {
    top: -4px;
  }
}
.timeValue {
  border-left: none;
  width: 360px;
  font-size: 12px !important;
}
::v-deep .el-date-editor .el-range-input {
  width: 44%;
}
::v-deep .el-range__close-icon {
  display: none;
}
.el-icon-refresh {
  font-size: 18px !important;
  display: inline-block;
  line-height: 30px;
  float: right !important;
  margin-left: 5px;
  cursor: pointer;
}
</style>
