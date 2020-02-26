<!--  -->
<template>
  <div>
    <div class="topHeader">
      <span>BOT 概览</span>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="timeList">
        <el-button-group class="buttonDateCheck">
          <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">近1小时</el-button>
          <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">近6小时</el-button>
          <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">今天</el-button>
          <el-button @click="checkTime(4)" :class="selBtn=='4'?'addStyleBtn':''">昨天</el-button>
          <el-button @click="checkTime(5)" :class="selBtn=='5'?'addStyleBtn':''">近7天</el-button>
        </el-button-group>
        <el-date-picker
          v-model="dateTimeValue"
          type="datetimerange"
          class="timeValue"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable= false
          @change="changeTimeValue"
        ></el-date-picker>
      </div>
      <div class="showChart">
        <el-row>
          <h3 class="topfont">
            <!-- {{t('攻击趋势', 'WAF.gjqs')}} -->
            BOT 记录数 域名 TOP {{topValue}}
          </h3>
          排名：<el-select
            v-model="topValue"
            filterable
            class="selectDomin"
            default-first-option
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-row>
        <Bar
          :xAxis="xAxisBotIp"
          :series="seriesBotIp"
          :legendText="legendTextBarIp"
          v-if="xAxisBotIp.length == 0 ? false : true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { DESCRIBE_BOT_AGGREGATE_DOMAINSTAT } from '@/constants'
import Bar from '../components/bar'
export default {
  data () {
    return {
      tipShow: true,
      selBtn: 3,
      dateTimeValue: [moment().startOf("day"), moment().endOf("day")], // 日期绑定
      startTime: moment().startOf("day").utc().valueOf(),
      endTime: moment().endOf("day").utc().valueOf(),
      seriesBotIp: [],
      xAxisBotIp: [],
      legendTextBarIp: "Bot记录",
      topValue: "5",
      options: [{
          value: '5',
          label: 'TOP5'
        }, {
          value: '6',
          label: 'TOP6'
        }, {
          value: '7',
          label: 'TOP7'
        }, {
          value: '8',
          label: 'TOP8'
        }, {
          value: '9',
          label: 'TOP9'
        }, {
          value: '10',
          label: 'TOP10'
        }
        ]
    }
  },
  components: {
    Bar,
  },
  watch: {
    dateTimeValue() {
    }
  },
  mounted() {
    this.getBotDomainStat()
  },
  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    // 获取BOT 记录数 域名 TOP N
    getBotDomainStat() {
      const params = {
        Version: "2018-01-25",
        StartTs: this.startTime,
        EndTs: this.endTime,
        TopNums: 6,
      }
      this.axios.post(DESCRIBE_BOT_AGGREGATE_DOMAINSTAT, params).then((resp) => {
        let arrIp = []
        let arrIpCount = []
        this.generalRespHandler(resp, ({Data}) => {
          Data.map(v => {
            arrIp.push(v.Key)
            arrIpCount.push(v.Value)
          })
          this.seriesBotIp = arrIpCount
          this.xAxisBotIp = arrIp
        })
      })
    },
    //时间点击事件
    checkTime(val) {
      let times = [moment().subtract(7, "days").startOf("day"), moment()]
      this.selBtn = val
      switch (val) {
        case 1:
          times = [moment().subtract(1, "hours"), moment()]
          break;
        case 2:
          times = [moment().subtract(6, "hours"), moment()]
          break;
        case 3:
          times = [moment().startOf("day"), moment()]
          break;
        case 4:
          times = [moment().subtract(24, "hours").startOf("day"), moment().subtract(24, "hours")]
          break;
        default:
          break;
      }
      times[1] = times[1].endOf('day')
      this.dateTimeValue = times
    },
    changeTimeValue(val) {
      this.selBtn = 0
      this.startTime = moment(val[0]).utc().valueOf()
      this.endTime = moment(val[1]).utc().valueOf()
      this.$nextTick(() => {
        this.getBotDomainStat()
      })
    },
    
  }
}

</script>
<style lang='scss' scoped>
.topHeader {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
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
    line-height: 28px;
    border-radius: 0;
  }
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  ::v-deep .el-row {
    display: flex;
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
  .timeList {
    .buttonDateCheck {
      float: left;
      button {
        padding: 0 20px;
      }
      .addStyleBtn {
        background-color: #006eff !important;
        color: #fff;
      }
    }
    .timeValue {
      ::v-deep .el-range__icon {
        line-height: 22px;
      }
      ::v-deep .el-range-separator {
        line-height: 22px;
        width: 7%;
      }
    }
  }
  .showChart {
    width: 100%;
    height: 378px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 30px;
    .topfont {
      margin-bottom: 20px;
      flex: 1;
    }
  }
}
</style>
