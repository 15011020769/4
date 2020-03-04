<!--  -->
<template>
  <div>
    <div class="topHeader">
      <span>{{t('BOT 概览', 'WAF.botgl')}}</span>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">{{t('BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多', 'WAF.botxwgl')}}</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="timeList">
        <el-button-group class="buttonDateCheck">
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
      </div>
      <div class="showChart">
        <el-row>
          <h3 class="topfont">
            {{t('BOT 记录数 域名 TOP', 'WAF.botjls')}}
            {{topValue}}
          </h3>
          <div>
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
          </div>
        </el-row>
        <Bar
          :xAxis="xAxisBotIp"
          :series="seriesBotIp"
          :legendText="legendTextBarIp"
          v-if="xAxisBotIp.length == 0 ? false : true"
        />
        <div class="empty" v-else>{{t('暂无数据', 'WAF.zwsj')}}</div>
      </div>
      <div class="botDetail" v-for="(item, index) in domainStat">
        <div class="botDetailCon">
          <p class="detailTop">
            <span>{{index+1}}&nbsp;&nbsp;</span>
            <el-button type="text" size="mini">{{item.Key}}</el-button>
            <el-button type="text" size="mini">{{item.Value}}</el-button>
          </p>
          <div class="detailbottom">
            <el-row class="bitPie">
              <el-col :sapn="12">
                <h3>
                  {{t('BOT 类型', 'WAF.botlx')}}
                </h3>
                <PieType
                  :domain="item.Key"
                  :startTime="startTime"
                  :endTime="endTime"
                />
              </el-col>
              <el-col :sapn="12">
                <h3>
                  {{t('BOT 动作', 'WAF.botdz')}}
                </h3>
                <PieAction
                  :domain="item.Key"
                  :startTime="startTime"
                  :endTime="endTime"
                />
              </el-col>
            </el-row>
            <h3>
              {{t('BOT 请求趋势', 'WAF.botqqqs')}}
            </h3>
            <ELine
              :domain="item.Key"
              :startTime="startTime"
              :endTime="endTime"
              :selBtn="selBtn"
              :dateTimeValue="dateTimeValue"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
    DESCRIBE_BOT_AGGREGATE_DOMAINSTAT,
    DESCRIBE_BOT_TYPE_STAT,
    DESCRIBE_BOT_ACTION_STAT,
    DESCRIBE_BOT_STATISTIC_POINTS,
    DESCRIBE_PEAK_POINTS,
  } from '@/constants'
import Bar from '../components/bar'
import PieType from '../components/pieType'
import PieAction from '../components/pieAction'
import ELine from '../components/lineBot'
export default {
  data () {
    return {
      tipShow: true, // 显示提示文字
      selBtn: 3, // 默认选中今天
      dateTimeValue: [moment().startOf("day"), moment().endOf("day")], // 日期绑定
      startTime: moment().startOf("day").utc().valueOf(), // 时间戳
      endTime: moment().endOf("day").utc().valueOf(), // 时间戳
      seriesBotIp: [], // BOT记录数域名TopN柱状图
      xAxisBotIp: [], // 域名数组
      legendTextBarIp: "Bot记录", // 柱状图legend
      topValue: 5, // 下拉默认选中top5
      domainStat: [],
      options: [{
          value: 5,
          label: 'TOP5'
        }, {
          value: 6,
          label: 'TOP6'
        }, {
          value: 7,
          label: 'TOP7'
        }, {
          value: 8,
          label: 'TOP8'
        }, {
          value: 9,
          label: 'TOP9'
        }, {
          value: 10,
          label: 'TOP10'
        }
      ],
    }
  },
  components: {
    Bar,
    PieType,
    PieAction,
    ELine,
  },
  watch: {
    dateTimeValue(val, oldVal) {
      if(val.join() !== oldVal.join()) {
        this.getBotDomainStat()
      }
    },
    topValue() {
      this.getBotDomainStat()
    },
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
        TopNums: this.topValue,
      }
      this.axios.post(DESCRIBE_BOT_AGGREGATE_DOMAINSTAT, params).then((resp) => {
        let arrIp = []
        let arrIpCount = []
        this.generalRespHandler(resp, ({Data}) => {
          // this.domainStat = Data.concat({Value: 10,Key: "ddd.dhycloud.com"})
          // this.domainStat = Data.concat(Data)
          this.domainStat = Data
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
      let times = [moment().startOf("day"), moment()]
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
    margin: 30px 0 20px 0;
    .topfont {
      margin-bottom: 20px;
      flex: 1;
    }
    .empty {
      height: 300px;
      width: 100%;
      line-height: 300px;
      text-align: center;
      font-weight: bold
    }
  }
  .botDetail {
    height: 680px;
    width: 100%;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    .botDetailCon {
      height: 640px;
      border: 1px solid #E5E5E5;
      .detailTop {
        font-size: 14px;
        padding: 10px;
        background-color: #f2f2f2
      }
      .detailbottom {
        padding: 10px;
        .bitPie {
          height: 260px;
          // background: pink;
        }
      }
    }
  }
}
</style>
