<template>
  <div class="wrapper_info">
    <div class="firstShow">
      <h3>
        {{t('访问趋势', 'WAF.fwqs')}}
        <span style="color:#bbb;">{{t('(最长3天统计数据)', 'WAF.zcttjsh')}}</span>
      </h3>
      <ELine
        :xAxis="xAxisBotPoints"
        :series1="seriesBotPoints"
        :legendText="legendTextBotPoints"
        :color="colorLine"
        :tooltip="tooltip"
        v-loading="loading"
      />
    </div>
    <div class="secondShow">
      <el-row >
        <el-col :span="8" class="pieShow">
          <h3 class="topfont">
            {{t('返回响应码占比', 'WAF.fhxymzb')}}
          </h3>
          <EPie
            :series="seriesPieStatus"
            :color="colorPie"
            :legendText="legendTextPieStatus"
            :radius="['40%', '55%']"
            :left="'50%'"
            v-loading="loading"
          />
        </el-col>
        <el-col :span="8" class="pieShow">
          <h3 class="topfont">
            {{t('请求方法占比', 'WAF.qqffzb')}}
          </h3>
          <EPie
            :series="seriesPieMethod"
            :color="colorPieMethod"
            :legendText="legendTextPieMethod"
            :radius="['37%', '50%']"
            :left="'50%'"
            v-loading="loading"
          />
        </el-col>
        <el-col :span="8" class="pieShow">
          <h3 class="topfont">
            {{t('HTTP协议版本占比', 'WAF.httpxybb')}}
          </h3>
          <EPie
            :series="seriesPieProtocal"
            :color="colorPie"
            :legendText="legendTextPieProtocal"
            :radius="['40%', '55%']"
            :left="'50%'"
            v-loading="loading"
          />
        </el-col>
      </el-row>
        <p class="pieTip">{{t('统计数据源为会话前600条数据', 'WAF.tjsjy')}}</p>
    </div>
    <el-row class="thirdShow" v-loading="loading">
      <el-col :span="8" class="wrapperCol" v-if="recordDetail.length">
        <h3 class="botTitle">
          {{t('会话基础信息', 'WAF.hhjcxx')}}
        </h3>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话总次数', 'WAF.hhzcs')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].nums}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话平均速度', 'WAF.hhpjsd')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.avg_speed}}{{t('次/分钟', 'WAF.cfz')}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话窗口速度', 'WAF.hhcksd')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.win_speed}}{{t('次/分钟', 'WAF.cfz')}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话起始时间', 'WAF.hhqssj')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].start_ts | formatMillisecond}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('最新检测时间', 'WAF.zxjcsh')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].timestamp | formatMillisecond}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话存在', 'WAF.hhcz')}}Robots.txt</span></el-col>
          <el-col :span="14">
            <span class="rightFont">
              <!-- {{recordDetail[0].stat.req_analyze_res.req_robots_exist ? "是" : "否"}} -->
              {{recordDetail[0].stat.req_analyze_res.req_robots_exist | fromatValue}}
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话持续时间', 'WAF.hhcxsj')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].session_duration | formatSessionDuration}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('敏感接口访问', 'WAF.mgjkfw')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">
            {{recordDetail[0].stat.sensitive_request_flag | fromatValue}}
          </span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('会话发生在凌晨', 'WAF.hhfszlc')}}</span></el-col>
          <el-col :span="14">
            <span class="rightFont">
              {{recordDetail[0].stat.req_analyze_res.req_in_wee_hours | fromatValue}}
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('时序行为异常指数', 'WAF.sxxwyc')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_variance}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('时序熵异常指数', 'WAF.sxsyc')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_CCE}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('AI模型检出', 'WAF.mxjc')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">
            {{recordDetail[0].stat.AI_abnormal_flag | fromatValue}}
          </span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            BOT {{t('基础信息', 'WAF.jcxx')}}   
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('BOT类型', 'WAF.botlx')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{BOTS_TYPES_CFG[recordDetail[0].bot_type]}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">BOT得分</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].score.total}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{botLabel}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{fromatBOTInfos(recordDetail[0].rule_name)}}</span></el-col>
        </el-row>
         <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('动作', 'WAF.dz')}}</span></el-col>
          <el-col :span="14">
            <span class="rightFont">
              {{UCB_ACTION_LOCAL[recordDetail[0].action]}}&nbsp;
              <span v-if="recordDetail[0].valid_ts">
                {{t('截止时间', 'WAF.jzsh')}}{{recordDetail[0].valid_ts | formatSecond }}
              </span>
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('异常特征', 'WAF.yctz')}}</span></el-col>
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
            IP{{t('基础信息', 'WAF.jcxx')}}  
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('访问源IP', 'WAF.fwyip')}}</span></el-col>
          <el-col :span="14">
            <span class="rightFont">{{this.$route.query.SrcIp}}
              <el-button type="text" size="mini" @click="addBW">
                {{t('添加黑白名单', 'WAF.tjhbmd')}}
              </el-button>
            </span>
          </el-col>
        </el-row>
        <el-row type="flex" v-if="showBlack">
          <el-col :span="10"><span class="leftFont">{{t('黑白名单属性', 'WAF.hbmdsx')}}</span></el-col>
          <el-col :span="14">
            <span v-if="ipInfo.length">
              <span class="addRed">{{currentNameFilter(ipInfo[0].Category)}}</span>
              {{t('截止时间', 'WAF.jzsh')}}{{ipInfo[0].ValidTs | formatSecond}}
            </span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP{{t('类型', 'WAF.lx')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{formatIpType(recordDetail[0].ip_info.ip_type)}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP{{t('运营商', 'WAF.yys')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.province}}&nbsp;{{recordDetail[0].ip_info.operator}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP{{t('地区', 'WAF.dq')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.country}}&nbsp;{{recordDetail[0].ip_info.city ? recordDetail[0].ip_info.city: ""}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">IP所有者</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.detail == "" ? "空" : recordDetail[0].ip_info.detail}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('经度', 'WAF.jd')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].ip_info.longitude}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('维度', 'WAF.wd')}}</span></el-col>
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
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_exist | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA{{t('种类', 'WAF.zl')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA{{t('类型', 'WAF.lx')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{formatUaType(recordDetail[0].stat.ua_analyze_res.ua_type)}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">UA{{t('随机性指数', 'WAF.sjxzs')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_kind_random_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('出现', 'WAF.cx')}}最多的UA</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_analyze_res.ua_max}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('公开BOT伪造', 'WAF.gkbotwz')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.ua_not_match_ip | fromatValue}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
            其他HTTP{{t('头部信息', 'WAF.tbxx')}}
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_exist | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept-Language存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_language_exist | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Accept-Encoding存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.accept_encoding_exist | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Connection存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.http_header.connection_exist | fromatValue}}</span></el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="wrapperCol" v-if="recordDetail.length">
        <el-row>
          <h3 class="botTitle">
            {{t('请求参数信息', 'WAF.qqcsxx')}}
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">URL{{t('重复比', 'WAF.cfb')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_analyze_res.req_url_repeat_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">URL{{t('种类', 'WAF.zl')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_url_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('请求最多', 'WAF.qqzd')}}的URL</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_max_url}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('请求最多的参数', 'WAF.qqzddcs')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.req_analyze_res.req_max_query}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('参数重复比', 'WAF.cscfb')}}</span></el-col>
          <el-col :span="14"><span class="addRed">{{recordDetail[0].stat.req_analyze_res.req_query_repeat_rate}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            COOKIE信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">
            {{recordDetail[0].stat.cookie_analyze_res.cookie_exist | fromatValue}}
          </span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE{{t('重复比', 'WAF.cfb')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_repeat | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE{{t('种类', 'WAF.zl')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('出现', 'WAF.cx')}}最多的COOKIE</span></el-col>
          <el-col :span="14"><span class="rightFont">
            {{recordDetail[0].stat.cookie_analyze_res.cookie_max | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">COOKIE{{t('滥用', 'WAF.lanyong')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.cookie_analyze_res.cookie_abuse | fromatValue}}</span></el-col>
        </el-row>
        <el-row>
          <h3 class="topTitle botTitle">
            Referer信息
          </h3>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer存在性</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_exist | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer存在比</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_valid_rate}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer{{t('重复比', 'WAF.cfb')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_repeat | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer{{t('种类', 'WAF.zl')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_kind}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">{{t('出现', 'WAF.cx')}}最多的Referer</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_max | fromatValue}}</span></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10"><span class="leftFont">Referer{{t('滥用', 'WAF.lanyong')}}</span></el-col>
          <el-col :span="14"><span class="rightFont">{{recordDetail[0].stat.refer_analyze_res.refer_abuse | fromatValue}}</span></el-col>
        </el-row>
      </el-col>
    </el-row>
    <template v-if="addBWmodel">
      <addBlackWhite :isShow="addBWmodel" @closeModel="closeModel" :ipInfo="Object.assign(ipInfo[0], {Domain: this.domain})"/>
    </template>
    <!-- <template :v-if="addBWmodel">
      <addBlackWhite @closeModel="closeModel" :isShow="addBWmodel" :ipInfo="ipInfo[0]" :ipInfo="Object.assign(ipInfo[0], { Domain: "global" })"/>
    </template> -->
  </div>
</template>

<script>
import moment from 'moment'
import ELine from '../../../../saveOverView/components/line'
import EPie from '../../../../components/pie'
import addBlackWhite from './addBlackWhite'
import { ua_type_list,
      UCB_ACTION_LOCAL,
      BOTS_TYPES_CFG,
      scene_flag_list,
      ip_type_list
  } from '../../../../constants'
let that
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
      legendTextBotPoints: [this.t('事件数量', 'WAF.sjsl')],
      colorLine: ["#006eff"],
      recordDetail: [],
      BOTS_TYPES_CFG,
      UCB_ACTION_LOCAL,
      seriesPieStatus: [], // 返回响应码占比饼图
      legendTextPieStatus: [], // 返回响应码占比饼图
      colorPie: ["#47a986", "#51b1ce","#6296c6", "#038b5b"],
      seriesPieMethod: [], // 请求方法占比
      legendTextPieMethod: [], // 请求方法占比
      colorPieMethod: ["#51b1ce", "#038b5b", "#47a986", "#6296c6"],
      seriesPieProtocal: [], // HTTP协议版本占比
      legendTextPieProtocal: [], // HTTP协议版本占比
      addBWmodel: false, // 添加黑白名单弹框
      ipInfo: [], // 保存编辑信息,
      SrcIp: "",
      Id: "",
      domain: "",
      ua_type_list,
      botLabel: this.t('策略名称', 'WAF.clmc'), // bot类型不同,标签名称不同
      scene_flag_list,
      ip_type_list,
      showBlack: true, // 是否显示ip黑白名单属性
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
    }
  },
  components: {
    ELine,
    EPie,
    addBlackWhite,
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.SrcIp = this.$route.query.SrcIp
    this.Id = this.$route.query.Id
    this.domain = this.$route.query.domain
  },
  mounted() {
    this.getBotRecordDetail()
    this.getActioned()
  },
  filters: {
    fromatValue (value) {
      if ("undefined" === typeof value) {
          return "null";
      } else if ("" === value) {
          return "空";
      } else if ("object" === typeof value && !value) { //null
          return "null";
      } else if ("boolean" === typeof value) {//boolean
          return value ? "是" : "否";
      } else if ("number" === typeof value) {//number
          return value + "";
      } else {
          return value;
      }
    },
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
          result = "" + parseInt(hourTime) + "小"+ that.t('时', 'WAF.hour') + result;
      }
      return result;
    },
  },
  methods: {
    fromatBOTInfos(name) {
      if (this.recordDetail[0].bot_type === "UCB") {
        this.botLabel = this.t('策略名称', 'WAF.clmc')
        return name
      } else if (this.recordDetail[0].bot_type === "TCB") {
        this.botLabel = this.t('BOT 分类', 'WAF.botfl')
        return name
      } else if(this.recordDetail[0].bot_type === "UB") {
        this.botLabel = this.t('预测标签', 'WAF.ycbq')
        let label = ""
        this.scene_flag_list.map(v => {
        if(v.value == name) {
            label =  v.label
          }
        })
        return label 
      }
    },
    formatIpType(type) {
      let temp = ""
      this.ip_type_list.map(item => {
        if(item.value == type) {
          temp = item.label
        }
      })
      return temp
    },
    //添加黑白名单按钮
    addBW(){
      this.addBWmodel=true;
    },
      //关闭
    closeModel(isShow){
      this.addBWmodel = false
      this.getActioned()
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
          // console.log(this.ipInfo[0])
          let arr = []
          Data.Res.forEach(item => {
            arr.push(item.Action)
          })
          if (arr.includes(42) || arr.includes(40)){
            this.showBlack = true
          } else {
            this.showBlack = false
          }
        })
      })
    },
    formatUaType(val) {
      let str = ''
      this.ua_type_list.map(v => {
        if (val == v.value) {
          str = v.label
        }
      })
        return str
    },
    currentNameFilter(text) {
      if (text === 'whiteIp') {
        return this.t('白名单', 'WAF.bmd')
      }
      return this.t('黑名单', 'WAF.hmd')
    },
    // BOT记录访问趋势
    getBotRecordPoints() {
      this.loading = true
      // 获取业务攻击趋势参数获取时间值
      const paramsPeakPoints = {
        Version: '2018-01-25',
        FromTime: moment(this.recordDetail[0].start_ts).format("YYYY-MM-DD HH:mm:00"),
        ToTime: moment(this.recordDetail[0].timestamp).format("YYYY-MM-DD HH:mm:ss"),
      }
      const params = {
        Version: "2018-01-25",
        StartTs: this.recordDetail[0].start_ts,
        EndTs: this.recordDetail[0].timestamp,
        Stride: 2,
        Domain: this.domain,
        Id: this.domain + this.SrcIp,
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
      }).then(() => {
        this.loading = false
      })
      this.axios.post(DESCRIBE_BOT_RECORD_POINTS, params).then((resp) => {
        this.generalRespHandler(resp, ({PointsTotal}) => {
          this.seriesBotPoints = PointsTotal
        })
      }).then(() => {
        this.loading = false
      })
    },
    // BOT详情 
    getBotRecordDetail() {
      this.loading = true
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
          this.recordDetail.push(JSON.parse(Res[0])) // 基础信息
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
              name: Number(i) / 10,
              value: protocalTemp[i]
            })
            this.legendTextPieProtocal.push(Number(i) / 10)
          }
          let a = statusArr.pop()
          let b = methodArr.pop()
          let c = protocalArr.pop()
          this.seriesPieStatus = statusArr
          this.seriesPieMethod = methodArr
          this.seriesPieProtocal = protocalArr
        })
      }).then(() => {
        this.getBotRecordPoints()
        this.loading = false
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
    .pieTip {
      color: #bbb;
      text-align: center;
      position: relative;
      bottom: 20px;
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
