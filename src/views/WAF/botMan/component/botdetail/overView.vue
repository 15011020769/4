<template>
  <div class="main_overview">
    <div class="firstShow">
      <h3>
        {{t('请求次数统计', 'WAF.qqcstj')}}
        <span style="color:#bbb;">(次)</span>
      </h3>
      <el-row class="empty" v-if="seriesLineFlowTotal.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
      <ELine
        :xAxis="xAxisLineFlow"
        :series1="seriesLineFlowTotal"
        :series2="seriesLineFlowBot"
        :legendText="legendTextLineFlow"
        :color="colorLine"
        v-loading="loading"
        :tooltip="tooltip"
        v-else
      />
    </div>
    <el-row class="secondShow">
      <el-col :span="12">
        <h3 class="topfont">
          {{t('BOT 动作占比', 'WAF.botdzzb')}}
          <span style="color:#bbb;">(%)</span>
        </h3>
        <el-row class="empty" v-if="seriesPieType.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
        <EPie
          :series="seriesPieType"
          :color="colorPie"
          :legendText="legendTextPieType"
          v-else
          v-loading="loading"
        />
        </el-col>
        <el-col :span="12">
        <h3 class="topfont">
          {{t('BOT 类型占比', 'WAF.botlxzb')}}
          <span style="color:#bbb;">(%)</span>
        </h3>
        <el-row class="empty" v-if="seriesPieAction.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
        <EPie
          :series="seriesPieAction"
          :color="colorPie"
          :legendText="legendTextPieAction"
          v-else
          v-loading="loading"
        />
      </el-col>
    </el-row>
    <div class="thirdShow">
        <el-row type="flex" justify="start">
            <h3 class="topfont">
              {{t('BOT 来源分布', 'WAF.botlyfb')}}
            </h3>
            <el-radio-group v-model="radio" size="small">
              <el-radio-button label="global">全球</el-radio-button>
              <el-radio-button label="china">{{t('全国', 'WAF.qg')}}</el-radio-button>
            </el-radio-group>
            <el-select
              v-model="botType"
              filterable
              default-first-option
              class="selectType"
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
      <world-map
        :series="seriesWorldMap"
        v-if="radio == 'global'"
        v-loading="loading"
        :pieces="pieces"
      />
      <china-map :series="seriesWorldMap" v-else v-loading="loading"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import worldMap from '../../../saveOverView/components/worldMap'
import chinaMap from '../../../components/chinaMap'
import {
    DESCRIBE_BOT_TYPE_STAT,
    DESCRIBE_BOT_ACTION_STAT,
    DESCRIBE_BOT_REGIONS_STAT,
    DESCRIBE_BOT_STATISTIC_POINTS,
    DESCRIBE_PEAK_POINTS,
  } from '@/constants'
import EPie from '../../../saveOverView/components/pie'
import ELine from '../../../saveOverView/components/line'
export default {
  data () {
    return {
      seriesLineFlowBot: [], // bot流量折线图
      seriesLineFlowTotal: [], // bot流量折线图
      xAxisLineFlow: [], // bot流量折线图
      colorLine: ["#006eff", "#FF584C",],
      legendTextLineFlow: [this.t('总请求', 'WAF.zqq'), this.t('BOT 请求', 'WAF.botqq')],
      seriesPieType: [], // bot类型饼图
      seriesPieAction: [], // bot动作饼图
      colorPie: ['#2277da', '#e54545', '#ff9d00', '#f5736e'],
      legendTextPieType: [this.t('公开类型', 'WAF.gklx'), this.t('未知类型', 'WAF.wzlx'), this.t('用户自定义类型', 'WAF.yhzdylx')], // bot类型
      legendTextPieAction: [this.t('验证码', 'WAF.yzm'), this.t('拦截', 'WAF.lj'), this.t('监控', 'WAF.jk'), '重定向'], // bot动作
      seriesWorldMap: [], // 世界地图和中国地图查询值 { name: '中国', value: 2 }
      radio: "global", // 全球/全国绑定值
      botType: "ALL", // bot类型下拉绑定值
      options: [
        {value: 'ALL', label: '全部'},
        {value: 'UCB', label: this.t('自定义类型', 'WAF.zdylx')},
        {value: 'TCB', label: this.t('公开类型', 'WAF.gklx')},
        {value: 'UB', label: this.t('未知类型', 'WAF.wzlx')},
      ],
      loading: true,
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          let relVal = params[0].name;
          params.forEach(v => {
            relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + "次";
          })  
          return relVal;  
        }
      },
      pieces: [
        {gt: 1, lte: 20, label: '1~20',color: '#cfe4ff'},
        {gt: 21, lte: 40, label: '21~40',color: '#a7cdff'},
        {gt: 41, lte: 60, label: '41~60',color: '#76b1ff'},
        {gt: 61, lte: 80, label: '61~80',color: '#3d91fe'},
        {gt: 81, lte: 100, label: '81~100',color: '#016eff'},
      ],
    }
  },
  props: {
    domain: {
      type: String,
      default: "tfc.dhycloud.com"
    },
    times: {
      type: Array,
      defaule: () => []
    },
    selBtn: {
      type: Number
    },
    id: Number,
  },
  components: {
    EPie,
    ELine,
    worldMap,
    chinaMap,
  },
  watch: {
    times(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    id() {
      this.init()
    },
    domain(val) {
      this.init()
    },
    radio(val) {
      this.radio = val
      if(this.domain) {
        this.getBotRegions()
      }
    },
    botType(val) {
      this.botType = val
      if(this.domain) {
        this.getBotRegions()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if(this.domain) {
        this.getBotType()
        this.getBotAction()
        this.getBotRegions()
        this.getBotFlow()  
      } else {
        this.loading = false
      }
    },
    // 获取Bot_V2 Bot流量统计
    getBotFlow() {
      this.loading = true
      let axixArr = []
      // 获取业务攻击趋势参数获取时间值
      const paramsPeakPoints = {
        Version: '2018-01-25',
        FromTime: moment(this.times[0]).format("YYYY-MM-DD HH:mm:ss"),
        ToTime: moment(this.times[1]).format("YYYY-MM-DD HH:mm:ss"),
      }
     const params = {
        Version: "2018-01-25",
        StartTs: this.times[0],
        EndTs: this.times[1],
        Stride: 2,
        Domain: this.domain,
      }
      const Granularity = moment(this.times[1]).diff(moment(this.times[0]), 'days')
      if(this.selBtn == 1 ||this.selBtn == 2 || this.selBtn == 3 ) {
        // 当选中时间有当天时，需将bot值控制在当前时间而不是23:59:59
        params["EndTs"] = moment().utc().valueOf()
        paramsPeakPoints["FromTime"] = moment(this.times[0]).format("YYYY-MM-DD HH:mm:00")
      }
      if (Granularity >= 7) {
        params["Stride"] = 1440
      } else if(Granularity > 0 && Granularity < 7) {
        params["Stride"] = 60
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, paramsPeakPoints).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.forEach((v, index) => {
              if(Granularity == 0) {
                if( (index%2) == 0) {
                  axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
                } 
              } else {
                axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
              }
            })
            this.xAxisLineFlow = axixArr
        })
      }).then(() => {
        this.loading = false
      })
      this.axios.post(DESCRIBE_BOT_STATISTIC_POINTS, params).then((resp) => {
        this.generalRespHandler(resp, ({PointsBot, PointsTotal}) => {
          this.seriesLineFlowBot = PointsBot
          this.seriesLineFlowTotal = PointsTotal
        }, {}, '',(error) => {
          this.seriesLineFlowBot = []
          this.seriesLineFlowTotal = []
        })
      }).then(() => {
        this.loading = false
      })
      // const Granularity = moment(this.times[1]).diff(moment(this.times[0]), 'days')
      // this.axios.post(DESCRIBE_PEAK_POINTS, paramsPeakPoints).then(resp => {
      //   this.generalRespHandler(resp, ({Points}) => {
      //     Points.map((v, index) => {
      //         if(Granularity < 7) {
      //           if( index%2 == 0) {
      //             axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
      //           } 
      //         } else {
      //           axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
      //         }
      //       })
      //       this.xAxisLineFlow = axixArr
      //   })
      // })
      // this.axios.post(DESCRIBE_BOT_STATISTIC_POINTS, params).then((resp) => {
      //   this.generalRespHandler(resp, ({PointsBot, PointsTotal}) => {
      //     this.seriesLineFlowBot = PointsBot
      //     this.seriesLineFlowTotal = PointsTotal
      //   })
      // })
    },
    // 获取Bot_V2 Bot类别统计
    getBotType() {
      this.loading = true
      const params = {
        Version: "2018-01-25",
        StartTs: this.times[0],
        EndTs: this.times[1],
        Domain: this.domain,
      }
      this.axios.post(DESCRIBE_BOT_TYPE_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPieType, 0, {value: Response.TCB, name: this.t('公开类型', 'WAF.gklx')})
          this.$set(this.seriesPieType, 1, {value: Response.UB, name: this.t('未知类型', 'WAF.wzlx')})
          this.$set(this.seriesPieType, 2, {value: Response.UCB, name: this.t('用户自定义类型', 'WAF.yhzdylx')})
        })
      }).then(() => {
        this.loading = false
      })
    },
    // Bot_V2 获取bot动作统计
    getBotAction() {
      this.loading = true
      const params = {
        Version: "2018-01-25",
        StartTs: this.times[0],
        EndTs: this.times[1],
        Domain: this.domain,
      }
      this.axios.post(DESCRIBE_BOT_ACTION_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPieAction, 0, {value: Response.Captcha, name: this.t('验证码', 'WAF.yzm')})
          this.$set(this.seriesPieAction, 1, {value: Response.Intercept, name: this.t('拦截', 'WAF.lj')})
          this.$set(this.seriesPieAction, 2, {value: Response.Monitor, name: this.t('监控', 'WAF.jk')})
          this.$set(this.seriesPieAction, 3, {value: Response.Redirect, name: '重定向'})
        })
      }).then(() => {
        this.loading = false
      })
    },
    // Bot_V2 bot地理纬度统计
    getBotRegions() {
      this.loading = true
      const params = {
        Version: "2018-01-25",
        StartTs: this.times[0],
        EndTs: this.times[1],
        Domain: this.domain,
        Scope: this.radio,
        BotType: this.botType,
      }
      let regionsArr = []
      this.axios.post(DESCRIBE_BOT_REGIONS_STAT, params).then((resp) => {
        this.generalRespHandler(resp, ({Data}) => {
          for(var i in Data) {
            regionsArr.push({
              name: i,
              value: Data[i]
            })
          }
        })
        this.seriesWorldMap = regionsArr
      }).then(() => {
        this.loading = false
      })
    }
  }
}

</script>
<style lang='scss' scoped>
::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #e5e5e5;
}
.main_overview {
  margin-top: 20px;
  .firstShow {
    padding: 20px;
    width: 100%;
    height: 375px;
    background: #fff;
    box-sizing: border-box;
    .empty {
      height: 300px;
      width: 100%;
      line-height: 300px;
      text-align: center;
      font-weight: bold
    }
  }
  .secondShow {
    width: 100%;
    height: 258px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
  .thirdShow {
    ::v-deep .el-radio-button__inner {
      border-radius: 0;
      height: 30px;
    }
    ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #006eff;
    }
    width: 100%;
    height: 658px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
      margin-right: 10px;
      line-height: 30px;
    }
    .selectType {
      margin-left: 10px;
    }
    .empty {
      height: 600px;
      width: 100%;
      line-height: 600px;
      text-align: center;
      font-weight: bold
    }
  }
}
</style>
