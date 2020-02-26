<template>
  <div>
    <div class="wrapperContent" ref="wrapperContent">
      <p class="down">
        <el-row class="timeListTop newClear">
          <el-select
            v-model="selectValue"
            filterable
            class="selectDomin"
            default-first-option
            @change="handleDomin"
          >
            <el-option value="" label="ALL"></el-option>
            <el-option
              v-for="item in options"
              :key="item.DomainId"
              :label="item.Domain"
              :value="item.Domain"
            ></el-option>
          </el-select>
          <el-button-group class="buttonDateCheck">
            <el-button @click="checkTime(1)" :class="thisType=='1'?'addStyleBtn':''">今天</el-button>
            <el-button @click="checkTime(2)" :class="thisType=='2'?'addStyleBtn':''">昨天</el-button>
            <el-button @click="checkTime(3)" :class="thisType=='3'?'addStyleBtn':''">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            class="dateTimeValue"
            @change="changeTimeValue"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-download" @click="dialogDownloadVisible = true"></i>
          <i class="el-icon-refresh"></i>
          <i class="el-icon-setting" @click="dialogSetVisible = true"></i>
        </el-row>
      </p>
      <component class="comp" v-for="comp in showModules" :is="comp" :times="[startTime, endTime]" :domain="selectValue" />
      <!-- 1
      
      1
      2
      
      2
      3
      
      3
      4
      
      4
      5
      
      5 -->
    </div>
    <DownLoadImg
      :dialogDownloadVisible = dialogDownloadVisible
      @imgSaveMethod = "saveImg"
      @onCancel = "onCancel"
    />
    <el-dialog
      title="自定义展示模板"
      :visible.sync="dialogSetVisible"
      width="40%"
    >
      <div>
        <el-checkbox-group v-model="showModules" class="module">
          <el-checkbox border v-for="(m, index) in allModule" :key="m.name" :label="m.name">
            {{m.value}}
            <div :class="`move ${index === 0 || index === (allModule.length - 1) ? 'alone' : ''}`">
              <i class="el-icon-caret-top" @click.prevent="up(index)" v-if="index !== 0"></i>
              <i class="el-icon-caret-bottom" @click.prevent="down(index)" v-if="index !== (allModule.length - 1)"></i>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModuleDisplaySet">保存</el-button>
        <el-button @click="dialogSetVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import html2canvas from "html2canvas"
import ELine from "../components/line"
import EBar from "../components/bar"
import EPie from "../components/pie"
import EMap from '../components/worldMap'
import attackType from "../components/attackType"
import DownLoadImg from '../components/downLoadImg'
import AttackDistribution from './safeoverview/attackDistribution'
import AttackSource from './safeoverview/attackSource'
import AttackTypePrecent from './safeoverview/attackTypePrecent'
import Business from './safeoverview/business'
import Overview from './safeoverview/overview'
import { SAFE_OVERVIEW_SHOWMODULE_KEY } from '../../constants'
import {
  DESCRIBE_HOSTS,
  DESCRIBE_PEAK_VALUE,
  DESCRIBE_PEAK_POINTS,
  DESCRIBE_ATTACK_TYPE,
  DESCRIBE_ATTACK_WORLD_MAP,
  DESCRIBE_ATTACK_COUNT,
  DESCRIBE_REQUEST_COUNT,
  DESCRIBE_HISTOGRAM,
  DESCRIBE_BOT_COUNT,
  DESCRIBE_BOT_POINTS
  } from '@/constants'
import { flatObj } from '@/utils'
export default {
  data() {
    return {
      options: [], //默认下拉选项
      dateTimeValue: [(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")), (moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))], //日期绑定
      selectValue: "", //域名下拉菜单
      thisType: "1", //按钮默认选中
      webAttack: 0,
      ccRequest: 0,
      botRequest: 0,
      endTime: moment(new Date()).endOf("days").format("YYYY-MM-DD HH:mm:ss"),
      startTime: moment(new Date()).startOf("days").format("YYYY-MM-DD 00:00:00"),
      host: "",
      xAxis1: [],
      color: ["#FF584C", "#FF9D00", "#006eff"],
      series1: [],
      series2: [],
      series3: [],
      legendText1: ['WEB攻击次数', 'CC攻击次数', 'BOT请求次数'],
      legendText2: ['WEB攻击次数', 'CC攻击次数'],
      seriesBarLocal: [],
      xAxisBarLocal: [],
      seriesBarIp: [],
      xAxisBarIp: [],
      legendTextBarIp: "次数",
      dialogDownloadVisible: false,
      dialogSetVisible: false,
      allModuleCopy: [
        { name: 'overview', value: 'WEB攻击拦截、CC拦截、BOT请求、DNS劫持区域数' },
        { name: 'business', value: '业务请求趋势' },
        { name: 'attackSource', value: '攻击来源地域TOP5 & 攻击来源IP TOP5' },
        { name: 'attackTypePrecent', value: '访问类型占比 & 攻击类型占比' },
        { name: 'attackDistribution', value: '攻击来源区域分布' },
      ],
      allModule: [],
      showModules: [],
      testcomponent: 'Overview',
      colorPie: ['#006eff', '#434348', '#74BD48', "#F7A35C"],
      legendTextPie: ['正常访问', 'WEB攻击次数', 'CC攻击次数', ''],
      seriesPie: [
        {value: 0, name: '正常访问'},
        {value: 0, name: 'WEB攻击次数'},
        {value: 0, name: 'CC攻击次数'},
        {value: 0, name: ''},
      ],
      seriesPieAttack: [],
      legendTextPieAttack: [],
      seriesMap: [{
              name: '中国',
              value: 2
            },]
    };
  },
  components: {
    ELine,
    EBar,
    EPie,
    EMap,
    DownLoadImg,
    attackType,
    Overview,
    Business,
    AttackTypePrecent,
    AttackSource,
    AttackDistribution,
  },
  mounted () {

    const allModuleCopy = JSON.parse(JSON.stringify(this.allModuleCopy))
    let showModules = localStorage.getItem(SAFE_OVERVIEW_SHOWMODULE_KEY)
    if (showModules) {
      showModules = JSON.parse(showModules)
    } else {
      showModules = ['overview', 'business']
    }

    this.showModules = showModules

    let i = showModules.length - 1
    allModuleCopy.forEach(mm => {
      if (showModules.includes(mm.name)) {
        mm.index = showModules.indexOf(mm.name)
      } else {
        mm.index = ++i
      }
    })
    allModuleCopy.sort((a, b) => a.index - b.index)

    this.allModule = allModuleCopy
    // this.getDominList();
    // this.getPeakValue();
    // this.getPeakPoints();
    // this.getAttackType();
    // this.getWebAttack();
    // this.getNormalRequest();
    // this.getAttackIp("ip");
    // this.getAttackIp("local");  
    // this.getAttackWorldMap();
　},
  watch: {
    selectValue() {
      // this.getPeakValue();
      // this.getPeakPoints();
      // this.getAttackType();
      // this.getNormalRequest();
      // this.getWebAttack();
      // this.getAttackIp("ip");
      // this.getAttackIp("local");
      // this.getAttackWorldMap();
    },
    showModules(val, oldVal) {
      if (val.length === 1) {
        this.$message({
          message: this.t('至少选择2个', 'WAF.zsxz2g'),
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.showModules = [...oldVal]
      }
    },
  },
  methods: {
    up(i) {
      this.allModule[i] = this.allModule.splice(i-1, 1, this.allModule[i])[0]
    },
    down(i) {
      this.allModule[i] = this.allModule.splice(i+1, 1, this.allModule[i])[0]
    },
    saveModuleDisplaySet() {
      this.dialogSetVisible = false
      const moduleNames = this.allModule.map(m => m.name)
      this.showModules = moduleNames.filter(name => this.showModules.includes(name))
      localStorage.setItem(SAFE_OVERVIEW_SHOWMODULE_KEY, JSON.stringify(this.showModules))
    },
    //获取域名列表
    getDominList() {
      this.axios.post(DESCRIBE_HOSTS, {
        Version: '2018-01-25'
      }).then(({ Response }) => {
        if (Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.options = Response.HostList
        }
      })
    },
    handleDomin(val) {
      this.host = val
    },
    saveImg(type) {
      this.html2canvas_2(type)
    },
    onCancel() {
      this.dialogDownloadVisible = false
    },
    // 获取业务攻击趋势
    getPeakPoints() {
      const axixArr = []
      const series1Arr = []
      const series2Arr = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      if (this.selectValue != "") {
        params["Domain"] = this.selectValue
        this.getBotPoints()
      } else {
        this.series3 = []
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, params).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
            Points.map((v) => {
              axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
              series1Arr.push(v.Attack)
              series2Arr.push(v.Cc)
            })
            this.xAxis1 = axixArr
            this.series1 = series1Arr
            this.series2 = series2Arr
        })
      })
    },
    // 获取业务攻击峰值
    getPeakValue() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      if (this.selectValue != "") {
        params["Domain"] = this.selectValue
        this.getBotCount()
      } else {
        this.botRequest = 0
        this.$set(this.seriesPie, 3, {value: 0, name: ''},)
      }
      this.axios.post(DESCRIBE_PEAK_VALUE, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.webAttack = Response.Attack
          this.ccRequest = Response.Cc
          this.$set(this.seriesPie, 2, {value: `${Response.Cc}`, name: 'CC攻击次数'},)
        })
      })
    },
    // 查询bot数量
    getBotCount() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Edition: "clb-waf",
        Host: this.selectValue
      }
      this.axios.post(DESCRIBE_BOT_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.botRequest = Response.Count
          this.$set(this.seriesPie, 3, {value: `${Response.Count}`, name: 'Bot请求次数'})
          this.$set(this.legendTextPie, 3, 'Bot请求次数')
          console.log(this.seriesPie)
        })
      })
    },
    // 查询Bot趋势
    getBotPoints() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Edition: "clb-waf",
        Host: this.selectValue
      }
      this.axios.post(DESCRIBE_BOT_POINTS, params).then((resp) => {
        this.generalRespHandler(resp, ({Points}) => {
          this.series3 = Points
        })
      })
    },
    // 获取正常访问次数
    getNormalRequest() {
      const params =  {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      if (this.selectValue != "") {
        params["Domain"] = this.selectValue
      }
      this.axios.post(DESCRIBE_REQUEST_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPie, 0, {value: `${Response.Count}`, name: '正常访问'},)
        })
      })
    },
    // 获取web攻击次数
    getWebAttack() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        QueryField: "web",
        Mode: 0,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      this.axios.post(DESCRIBE_ATTACK_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPie, 1, {value: `${Response.Count}`, name: 'WEB攻击次数'},)
        })
      })
    },
    // 查询TOP N攻击类型饼图
    getAttackType() {
      let typeArr = []
      let typeLegend = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      this.axios.post(DESCRIBE_ATTACK_TYPE, params).then((resp) => {
        this.generalRespHandler(resp, ({Piechart}) => {
          Piechart && Piechart.map(v => {
            typeArr.push({value:v.Count, name: v.Type, })
            typeLegend.push(v.Type)
          })
          this.seriesPieAttack = typeArr
          this.legendTextPieAttack = typeLegend    
        })
      })
    },
    // 获取攻击来源地址和ip柱状图
    getAttackIp(type) {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Host: "all",
        Edition: "clb-waf",
        QueryField: type,
        Source: "attack",
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      this.axios.post(DESCRIBE_HISTOGRAM, params).then((resp) => {
        let ipArrCount = []
        let ipArr = []
        let localArr = []
        let localArrCount = []
        if (type == "ip") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              ipArrCount.push(v.count)
              ipArr.push(v.ip)
            })
            this.xAxisBarIp = ipArr
            this.seriesBarIp = ipArrCount
          })
        } else if(type == "local") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              localArrCount.push(v.count)
              localArr.push(v.local)
            })
            this.xAxisBarLocal = localArr
            this.seriesBarLocal = localArrCount
          })
        }
      })
    },
    // 获取攻击城市分布
    getAttackWorldMap() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      this.axios.post(DESCRIBE_ATTACK_WORLD_MAP, params).then((resp) => {
        this.generalRespHandler(resp, (res) => {
            console.log(res)
          })
      })
    },
    // getPeakValue() {
    //   const params = {
    //     Version: '2018-01-25',
    //     intf: "peak_points",
    //     data: {
    //       fromTime: this.startTime,
    //       toTime: this.endTime,
    //     },
    //     edition: "clb-waf",
    //   }
    //   this.axios.post(WAF_INTERFACE, flatObj(params)).then((res) => {
    //     console.log(res)
    //   })
    // },
    //时间点击事件
    checkTime(type) {
      this.thisType = type;
      var ipt1 = document.querySelector(".dateTimeValue input:nth-child(2)");
      var ipt2 = document.querySelector(".dateTimeValue input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (type == "1") {
        start.setTime(start.getTime());
        end.setTime(end.getTime());
      } else if (type == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
      } else if (type == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        end.setTime(end.getTime());
      }
      ipt1.value = moment(start).format("YYYY-MM-DD");
      ipt2.value = moment(end).format("YYYY-MM-DD");
      this.startTime = moment(start).startOf("days").format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(end).endOf("days").format("YYYY-MM-DD HH:mm:ss");
      // this.$nextTick(() => {
      //   this.getPeakPoints();
      //   this.getPeakValue();
      //   this.getNormalRequest();
      //   this.getAttackType();
      //   this.getAttackIp("ip");
      //   this.getAttackIp("local");
      //   this.getAttackWorldMap();
      //   this.getWebAttack()
      // })
    },
    changeTimeValue() {
      this.thisType = 0
      this.startTime = moment(this.dateTimeValue[0]).startOf("days").format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(this.dateTimeValue[1]).endOf("days").format("YYYY-MM-DD HH:mm:ss");
      // this.$nextTick(() => {
      //   this.getPeakPoints();
      //   this.getPeakValue();
      //   this.getNormalRequest();
      //   this.getAttackType();
      //   this.getAttackIp("ip");
      //   this.getAttackIp("local");
      //   this.getAttackWorldMap();
      //   this.getWebAttack()
      // })
    },
    html2canvas_2(imgtype) {
      //获取截取区域的高度和宽度
      const h = this.$refs.wrapperContent.offsetHeight
      const w = this.$refs.wrapperContent.offsetWidth
      const canvas = document.createElement("canvas");
      canvas.width = w * 2;
      canvas.height = h * 2;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.style.color = "chartreuse"
      const context = canvas.getContext("2d")
      context.scale(2,2)				
      html2canvas(this.$refs.wrapperContent, { 
        allowTaint: true,
        // taintTest: false,
        // canvas: canvas,
      }).then(	function(canvas) {
          const type = imgtype
          let imgData = canvas.toDataURL(type);
          const _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            const r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
          };
          imgData = imgData.replace(_fixType(type), 'image/octet-stream');
          /**
           * 在本地进行文件保存
           * @param  {String} data     要保存到本地的图片数据
           * @param  {String} filename 文件名
           */
          const saveFile = function(data, filename) {
          const save_link =document.createElementNS('http://www.w3.org/1999/xhtml', 'a'); 
            save_link.href = data;
            save_link.download = filename;
            const event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          };
          const filename = 'dashboard' + (new Date()).getTime() + '.' + type;
          saveFile(imgData, filename);
        })
			},
    //图表
  }
}
</script>
<style lang="scss" scoped>

::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #ccc;
}
::v-deep .el-checkbox {
  width: 100%;
  margin-top: 20px;
  border-radius: 0px;
  margin-left: 0px;
}
::v-deep .el-checkbox.is-bordered+.el-checkbox.is-bordered {
  margin-left: 0px;
}
.empty {
  height: 200px;
  width: 100%;
  line-height: 200px;
  text-align: center;
  font-weight: bold
}
.wrapperContent {
  padding: 0 20px 20px;
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .newClear:after {
    content: "";
    display: inline-block;
    clear: both;
  }
  button {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .down {
    width: 100%;
    height: 30px;
    margin: 5px 0 10px 0;
    display: flex;
    justify-content: space-between;
    .timeListTop {
      margin-bottom: 12px;
      .selectDomin {
        margin-right: 10px;
        float: left;
      }
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
      .dateTimeValue {
        ::v-deep .el-range__icon {
          line-height: 26px;
        }
        ::v-deep .el-range-separator {
          line-height: 26px;
          width: 7%;
        }
      }
    }
    .iconBtn {
      font-size: 16px;
      color: #888;
      display: flex;
      align-items: center;
      > i {
        margin: 0 10px;
        font-weight: 600;
      }
      i:hover {
        cursor: pointer;
      }
    }
  }
  .contentNum {
    width: 100%;
    height: 110px;
    padding: 15px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .rowContain {
      text-align: center;
      p:nth-child(1) {
        margin-bottom: 16px;
        font-size: 14px;
        span:nth-child(1) {
          font-size: 36px;
        }
        span.red {
          color: #e1504a;
        }
        span.oarnge {
          color: #ff9d00;
        }
        span.blue {
          color: #006eff;
        }
      }
    }
  }
  .echartsShowfirst {
    width: 100%;
    height: 378px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .topfont{
      padding-left: 20px;
    }
  }
  .echartsShowSecond {
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
  }
  // .echartsShowThird {
  //   width: 100%;
  //   height: 258px;
  //   padding: 20px 0;
  //   box-sizing: border-box;
  //   background-color: #fff;
  //   box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  //   margin-top: 20px;
  //   .topfont{
  //     padding-left: 20px;
  //   }
  // }
  .echartsShowFour {
    width: 100%;
    height: 658px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
  }
}
.module {
  label {
    cursor: default;
  }
}
.move {
  position: absolute;
  right: 10px;
  top: 5px;
  display: flex;
  flex-direction: column;
  i {
    cursor: pointer;
  }
}
.alone.move {
  top: 13px;
}
.message_img {
  color: #007e3b;
  border: 1px solid #9ce4bc;
  background-color: #e6f8ee;
  padding: 10px 30px 10px 20px;
  margin-bottom: 20px;
}
.label_img {
  display: inline-block;
  padding-right: 20px;
}
.comp {
  margin-top: 20px;
}
</style>