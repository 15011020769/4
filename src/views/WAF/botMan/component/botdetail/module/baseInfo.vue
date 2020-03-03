<template>
  <div class="wrapper_info">
    <div class="firstShow">
      <h3>
        <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
        访问趋势
        <span style="color:#bbb;">(最长3天统计数据)</span>
      </h3>
      <ELine
        :xAxis="xAxisBotPoints"
        :series1="seriesBotPoints"
        :legendText="legendTextBotPoints"
        :color="colorLine"
      />
    </div>
    <el-row class="secondShow">
      <el-col :span="8" class="pieShow">
        <h3 class="topfont">
          <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
          返回响应码占比
        </h3>
        <EPie
          :series="seriesPieStatus"
          :color="colorPie"
          :legendText="legendTextPieStatus"
          :radius="['40%', '55%']"
          :left="'50%'"
        />
      </el-col>
      <el-col :span="8" class="pieShow">
        <h3 class="topfont">
          <!-- {{t('攻击类型占比', 'WAF.gjlxzb')}} -->
          请求方法占比
        </h3>
        <EPie
          :series="seriesPieMethod"
          :color="colorPieMethod"
          :legendText="legendTextPieMethod"
          :radius="['37%', '50%']"
          :left="'50%'"
        />
      </el-col>
      <el-col :span="8" class="pieShow">
        <h3 class="topfont">
          <!-- {{t('攻击类型占比', 'WAF.gjlxzb')}} -->
          HTTP协议版本占比
        </h3>
        <EPie
          :series="seriesPieProtocal"
          :color="colorPie"
          :legendText="legendTextPieProtocal"
          :radius="['40%', '55%']"
          :left="'50%'"
        />
      </el-col>
    </el-row>
    <el-row class="thirdShow">
      <el-col :span="8" class="wrapperCol" v-if="recordDetail.length">
        <h3 class="botTitle">
        <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
          会话基础信息
        </h3>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话总次数</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].nums}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话平均速度</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.avg_speed}}次/分钟</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话窗口速度</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.win_speed}}次/分钟</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话起始时间</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].start_ts | formatMillisecond}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">最新检测时间</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].timestamp | formatMillisecond}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话存在Robots.txt</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_robots_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话持续时间</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].session_duration | formatSessionDuration}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">敏感接口访问</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.sensitive_request_flag ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">会话发生在凌晨</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_in_wee_hours ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">时序行为异常指数</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_variance}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">时序熵异常指数</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_CCE}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">AI模型检出</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.AI_abnormal_flag ? '是' : '否'}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            BOT 基础信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">BOT类型</span></el-col>
          <el-col :span="14"><span class="rightFont">{{botType[recordDetail[0].bot_type]}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">BOT得分</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].score.total}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">策略名称</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].rule_name}}</span></el-col>
        </el-row>
         <el-row type="flex">
          <el-col :span="10"><span class="leftFont">动作</span></el-col>
          <el-col :span="14">
            <span class="rightFont">
              {{action[recordDetail[0].action]}}&nbsp;截止时间{{recordDetail[0].valid_ts | formatSecond }}
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">异常特征</span></el-col>
          <el-col :span="14">
            <span class="rightFont">
              <p v-for="item in recordDetail[0].bot_feature">{{item}}</p>
            </span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="wrapperCol" v-if="recordDetail.length">
        <el-row>
          <h3 class="botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            IP基础信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">访问源IP</span></el-col>
          <el-col :span="14">
            <span class="rightFont">{{this.$route.query.SrcIp}}
              <el-button type="text" size="mini" @click="addBW">
                添加黑白名单
              </el-button>
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">黑白名单属性</span></el-col>
          <el-col :span="14">
            <span v-if="ipInfo.length">
              <span class="addRed">{{currentNameFilter(ipInfo[0].Category)}}</span>
              截止时间{{ipInfo[0].ValidTs | formatSecond}}
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP类型</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.ip_type}}?</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP运营商</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.province}}&nbsp;{{recordDetail[0].ip_info.operator}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP地区</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.country}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP所有者</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.detail == "" ? "空" : recordDetail[0].ip_info.detail}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">经度</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.longitude}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">维度</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.dimensionality}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            UA信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA种类</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA类型</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.ua_analyze_res.ua_type}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA随机性指数</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_kind_random_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">出现最多的UA</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_max}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">公开BOT伪造</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_not_match_ip ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            其他HTTP头部信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept-Language存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_language_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept-Encoding存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_encoding_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Connection存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.connection_exist ? "是" : "否"}}</span></el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="wrapperCol" v-if="recordDetail.length">
        <el-row>
          <h3 class="botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            请求参数信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">URL重复比</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_analyze_res.req_url_repeat_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">URL种类</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_url_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">请求最多的URL</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_max_url}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">请求最多的参数</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_max_query}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">参数重复比</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_analyze_res.req_query_repeat_rate}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            COOKIE信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE重复比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_repeat == null ? "null" : recordDetail[0].stat.cookie_analyze_res.cookie_repeat}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE种类</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">出现最多的COOKIE</span></el-col>
          <el-col :span="14"><span class="rightFont">
            {{recordDetail[0].stat.cookie_analyze_res.cookie_max == "" ? "空" : recordDetail[0].stat.cookie_analyze_res.cookie_max}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE滥用</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_abuse ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            Referer信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_exist ? "是" : "否"}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer重复比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_repeat == null ? "null" : recordDetail[0].stat.refer_analyze_res.refer_repeat}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer种类</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">出现最多的Referer</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_max == "" ? "空" : recordDetail[0].stat.refer_analyze_res.refer_max}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer滥用</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_abuse ? "是" : "否"}}</span></el-col>
        </el-row>
      </el-col>
    </el-row>
    <template v-if="addBWmodel">
      <addBlackWhite :isShow="addBWmodel" @closeModel="closeModel" :ipInfo="ipInfo[0]"/>
    </template>
    <!-- <template :v-if="addBWmodel">
      <addBlackWhite @closeModel="closeModel" :isShow="addBWmodel" :ipInfo="Object.assign(ipInfo[0], { Domain: "global" })"/>
    </template> -->
  </div>
</template>

<script>
import moment from 'moment'
import ELine from '../../../../saveOverView/components/line'
import EPie from '../../../../components/pie'
import addBlackWhite from './addBlackWhite'
import {
  DESCRIBE_BOT_RECORD_POINTS,
  DESCRIBE_BOT_RECORD_ITEMS,
  DESCRIBE_BOT_RECORD_DETAIL,
  DESCRIBE_PEAK_POINTS,
  DESCRIBE_ACTIONED
} from '@/constants'
export default {
  data () {
    return {
      xAxisBotPoints: [],
      seriesBotPoints: [],
      legendTextBotPoints: ['事件数量'],
      colorLine: ["#006eff"],
      recordDetail: [],
      botType: {
        UCB: "用户自定义类型"
      },
      action: {'intercept': '拦截', 'monitor': '监控'},
      seriesPieStatus: [], // 返回响应码占比饼图
      legendTextPieStatus: [], // 返回响应码占比饼图
      colorPie: ["#47a986", "#51b1ce"],
      seriesPieMethod: [], // 请求方法占比
      legendTextPieMethod: [], // 请求方法占比
      colorPieMethod: ["#51b1ce", "#038b5b"],
      seriesPieProtocal: [], // HTTP协议版本占比
      legendTextPieProtocal: [], // HTTP协议版本占比
      addBWmodel: false, // 添加黑白名单弹框
      ipInfo: [], // 保存编辑信息,
      SrcIp: "",
      Id: "",
      domain: ""
    }
  },
  components: {
    ELine,
    EPie,
    addBlackWhite,
  },
  created() {
    this.SrcIp = this.$route.query.SrcIp
    this.Id = this.$route.query.Id
    this.domain = this.$route.query.domain
  },
  mounted() {
    this.getBotRecordPoints()
    this.getbb()
    this.getBotRecordDetail()
    this.getActioned()
  },
  filters: {
    formatMillisecond(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss")
    },
    formatSecond(val) {
      return moment.unix(val).format("YYYY-MM-DD HH:mm:ss")
    },
    formatSessionDuration(row) {
      const value = row * 60
      let secondTime = parseInt(value);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if(secondTime > 60) {
        minuteTime = parseInt(secondTime / 60); 
        secondTime = parseInt(secondTime % 60); 
        if(minuteTime > 60) {
            hourTime = parseInt(minuteTime / 60);   
            minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = "" + parseInt(secondTime) + "秒";
      if(minuteTime > 0) {
          result = "" + parseInt(minuteTime) + "分" + result;
      }
      if(hourTime > 0) {
          result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
  },
  methods: {
    //添加黑白名单按钮
    addBW(){
      this.addBWmodel=true;
    },
      //关闭
    closeModel(isShow){
      this.addBWmodel = false
      if (isShow === 'refresh') {
        this.getActioned()
      }
    },
    // 获取黑白名单列表
    getActioned() {
      let params = {
        Version: '2018-01-25',
        Domain: this.domain,
        Ip: this.SrcIp,
      }
      this.axios.post(DESCRIBE_ACTIONED, params).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          this.ipInfo = Data.Res
          console.log(Data)
        })
      })
    },
    currentNameFilter(text) {
      if (text === 'whiteIp') {
        return this.t('白名单', 'WAF.bmd')
      }
      return this.t('黑名单', 'WAF.hmd')
    },
    getBotRecordPoints() {
      // 获取业务攻击趋势参数获取时间值
      const paramsPeakPoints = {
        Version: '2018-01-25',
        FromTime: moment(1583125380941).format("YYYY-MM-DD HH:mm:ss"),
        ToTime: moment(1583133229738).format("YYYY-MM-DD HH:mm:ss"),
      }
      const params = {
        Version: "2018-01-25",
        StartTs: 1583125380941,
        EndTs: 1583133229738,
        Stride: 2,
        Domain: this.$route.query.domain,
        Id: this.$route.query.domain + this.$route.query.SrcIp,
        // Id: "waf.dhycloud.com43.227.136.148"
      }
      let axixArr = []
      this.axios.post(DESCRIBE_PEAK_POINTS, paramsPeakPoints).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.forEach((v, index) => {
            if( (index%2) == 0) {
              axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
            }
          })
            this.xAxisBotPoints = axixArr
        })
      })
      this.axios.post(DESCRIBE_BOT_RECORD_POINTS, params).then((resp) => {
        this.generalRespHandler(resp, ({PointsTotal}) => {
          this.seriesBotPoints = PointsTotal
        })
      })
    },
    getbb() {
      const params = {
        Version: "2018-01-25",
        Domain: this.$route.query.domain,
        Id: this.$route.query.Id
      }
      this.axios.post(DESCRIBE_BOT_RECORD_ITEMS, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          console.log(Response)
        })
      })
    },
    getBotRecordDetail() {
      const params = {
        Version: "2018-01-25",
        Domain: this.$route.query.domain,
        Id: this.$route.query.Id
      }
      let statusArr = []
      let methodArr = []
      let protocalArr = []
      this.axios.post(DESCRIBE_BOT_RECORD_DETAIL, params).then((resp) => {
        this.generalRespHandler(resp, ({Res}) => {
          console.log(JSON.parse(Res[0]))
          this.recordDetail.push(JSON.parse(Res[0]))
          const statusTemp = this.recordDetail[0].stat.status
          const methodTemp = this.recordDetail[0].stat.method
          const protocalTemp = this.recordDetail[0].stat.protocal
          for (let i in statusTemp) {
            statusArr.push({
              name: i,
              value: statusTemp[i]
            })
            this.legendTextPieStatus.push(i)
          }
          for (let i in methodTemp) {
            methodArr.push({
              name: i,
              value: methodTemp[i]
            })
            this.legendTextPieMethod.push(i)
          }
          for (let i in protocalTemp) {
            protocalArr.push({
              name: i,
              value: protocalTemp[i]
            })
            this.legendTextPieProtocal.push(i)
          }
          let a = statusArr.pop()
          let b = methodArr.pop()
          let c = protocalArr.pop()
          this.seriesPieStatus = statusArr
          this.seriesPieMethod = methodArr
          this.seriesPieProtocal = protocalArr
        })
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.wrapper_info {
  .firstShow {
    padding: 20px;
    width: 100%;
    height: 358px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  }
  .secondShow {
    width: 100%;
    height: 288px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .pieShow {
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
  .thirdShow {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .wrapperCol {
      padding-left: 10px;
      padding-right: 10px;
      .leftFont {
        font-size: 12px;
        color: #888;
        line-height: 30px;
      }
      .rightFont {
        font-size: 12px;
        color: black;
        display: table-cell;
        word-break: break-all;
        line-height: 30px;
      }
      .addRed {
        font-size: 12px;
        color: red;
        display: table-cell;
        word-break: break-all;
        line-height: 30px;
      }
      .topTitle {
        margin-top: 20px;
      }
      .botTitle {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
