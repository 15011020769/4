<template>
  <div>
    <div class="wrapperContent" ref="wrapperContent">
      <p class="down">
        <el-row class="timeListTop newClear">
          <el-select
            v-model="selectValue"
            filterable
            allow-create
            class="selectDomin"
            default-first-option
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
          <i class="el-icon-setting"></i>
        </el-row>
      </p>
      <div class="contentNum">
        <el-row>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="green">{{upPeakValue}}</span>
                <span>bps</span>
              </p>
              <p>上行带宽峰值</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="oarnge">{{downPeakValue}}</span>
                <span>bps</span>
              </p>
              <p>下行带宽峰值</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="blue">{{qpsRequest}}</span>
                <span>QPS</span>
              </p>
              <p>请求峰值</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row class="echartsShowfirst">
        <h3 class="topfont">
          {{t('业务峰值趋势', 'WAF.ywfzqs')}}
          <span style="color:#bbb;">(次)</span>
        </h3>
        <ELine
          :xAxis="xAxis1"
          :series1="series1"
          :series2="series2"
          :series3="series3"
          :color="color"
          :legendText="legendText1"
        />
      </el-row>
      <el-row class="echartsShowSecond">
        <el-col :span="12">
        <h3 class="topfont">
          {{t('服务器响应状态', 'WAF.fwqxyzt')}}
          <span style="color:#bbb;">(次)</span>
        </h3>
        </el-col>
        <el-col :span="12">
        <h3 class="topfont">
          {{t('浏览器类型', 'WAF.llqlx')}}
          <span style="color:#bbb;">(次)</span>
        </h3>
        <!-- <EBar
          :xAxis="xAxisBar"
          :series="seriesBar"
          :legendText="legendTextBar"
        /> -->
        </el-col>
      </el-row>
      <el-row class="echartsShowThird">
         <el-col :span="12">
          <h3 class="topfont">
            {{t('请求来源地域TOP5', 'WAF.qqlydy')}}
            <span style="color:#bbb;">(%)</span>
          </h3>
          <EBar
            :xAxis="xAxisBarLocal"
            :series="seriesBarLocal"
            :legendText="legendTextBarIp"
            v-if="xAxisBarLocal.length == 0 ? false : true"
          />
          <el-row class="empty" v-else>暂无数据</el-row>
         </el-col>
         <el-col :span="12">
          <h3 class="topfont">
            {{t('请求来源IP TOP5', 'WAF.qqlyip')}}
            <span style="color:#bbb;">(次)</span>
          </h3>
          <EBar
            :xAxis="xAxisBarIp"
            :series="seriesBarIp"
            :legendText="legendTextBarIp"
            v-if="xAxisBarIp.length == 0 ? false : true"
          />
          <el-row class="empty" v-else>暂无数据</el-row>
         </el-col>
      </el-row>
      <el-row class="echartsShowFour">
         <el-col :span="12">
          <h3 class="topfont">
            {{t('响应时间最慢页面TOP5', 'WAF.xysjzmym')}}
            <span style="color:#bbb;">(毫秒)</span>
          </h3>
          <EBar
            :xAxis="xAxisBarArt"
            :series="seriesBarArt"
            :legendText="legendTextBarIp"
            v-if="xAxisBarArt.length == 0 ? false : true"
          />
          <el-row class="empty" v-else>暂无数据</el-row>
         </el-col>
         <el-col :span="12">
          <h3 class="topfont">
            {{t('页面访问次数TOP5', 'WAF.ymfwcs')}}
            <span style="color:#bbb;">(次)</span>
          </h3>
          <EBar
            :xAxis="xAxisBarUrl"
            :series="seriesBarUrl"
            :legendText="legendTextBarIp"
            v-if="xAxisBarArt.length == 0 ? false : true"
          />
          <el-row class="empty" v-else>暂无数据</el-row>
         </el-col>
      </el-row>
    </div>
    <DownLoadImg
      :dialogDownloadVisible = dialogDownloadVisible
      @imgSaveMethod = "saveImg"
      @onCancel = "onCancel"
    />
  </div>
</template>
<script>
import moment from "moment";
import html2canvas from "html2canvas"
import DownLoadImg from '../components/downLoadImg'
import ELine from "../components/line"
import EBar from "../components/bar"
import EPie from "../components/pie"
import {
  DESCRIBE_HOSTS,
  DESCRIBE_PEAK_VALUE,
  DESCRIBE_PEAK_POINTS,
  DESCRIBE_PIECHART,
  DESCRIBE_HISTOGRAM,
} from '@/constants'
import { flatObj } from '@/utils'
export default {
  data() {
    return {
      options: [], //默认下拉选项
      dateTimeValue: [(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")), (moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))], //日期绑定
      // dateTimeValue: [], //日期绑定
      selectValue: "", //域名下拉菜单
      thisType: "1", //按钮默认选中
      endTime: moment(new Date()).endOf("days").format("YYYY-MM-DD HH:mm:ss"),
      startTime: moment(new Date()).startOf("days").format("YYYY-MM-DD 00:00:00"),
      upPeakValue: 0, // 上行峰值
      downPeakValue: 0, // 下行峰值
      qpsRequest: 0, // QPS请求
      xAxis1: [], // 业务攻击趋势
      series1: [], // 业务攻击趋势
      series2: [], // 业务攻击趋势
      series3: [], // 业务攻击趋势
      legendText1: ['QPS', '上行带宽', '下行带宽'], // 业务攻击趋势 
      seriesPieServer: [], // 服务器响应状态
      legendTextPieServer: [], // 服务器响应状态
      seriesPieBrowser: [], // 浏览器类型
      legendTextPieBrowser: [], // 浏览器类型
      seriesBarLocal: [], // 请求来源地域
      xAxisBarLocal: [], // 请求来源地域
      seriesBarIp: [], // 请求来源ip
      xAxisBarIp: [], // 请求来源ip
      xAxisBarArt: [], // 响应时间最慢
      seriesBarArt: [], // 响应时间最慢
      xAxisBarUrl: [], // 页面访问次数
      seriesBarArt: [], // 页面访问次数
      legendTextBarIp: "次数",
      color: ["#006eff", "#29CC85", "#FF9D00"],
      dialogDownloadVisible: false,
    };
  },
  components: {
    DownLoadImg,
    ELine,
    EBar,
    ELine
  },
  mounted () {
    this.getDominList();
    this.getPeakPoints()
    this.getPeakValue();
    this.getPieChart("us");
    this.getPieChart("ua");
    this.getAccessIp("local");
    this.getAccessIp("ip");
    this.getAccessIp("art");
    this.getAccessIp("url");
　},
  watch: {
    selectValue() {
      this.getPeakPoints()
      this.getPeakValue();
      this.getPieChart("us");
      this.getPieChart("ua");
      this.getAccessIp("local");
      this.getAccessIp("ip");
      this.getAccessIp("art");
      this.getAccessIp("url");
    }
  },
  methods: {
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
    saveImg(type) {
      this.html2canvas_2(type)
    },
     onCancel() {
      this.dialogDownloadVisible = false
    },
    // 获取峰值
    getPeakValue() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      if (this.selectValue != "") {
        params["Domain"] = this.selectValue
      }
      this.axios.post(DESCRIBE_PEAK_VALUE, params).then((resp) => {
        this.generalRespHandler(resp, ({Up, Down, Access}) => {
          this.upPeakValue = Up * 8
          this.downPeakValue = Down * 8
          this.qpsRequest = Access
        })
      })
    },
    // 获取业务攻击趋势
    getPeakPoints() {
      const axixArr = []
      const series1Arr = []
      const series2Arr = []
      const series3Arr = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      if (this.selectValue != "") {
        params["Domain"] = this.selectValue
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, params).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.map((v) => {
            axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
            series1Arr.push(v.Access)
            series2Arr.push(v.Up * 8)
            series3Arr.push(v.Down * 8)
          })
          this.xAxis1 = axixArr
          this.series1 = series1Arr
          this.series2 = series2Arr
          this.series3 = series3Arr
        })
      })
    },
    // 获取服务器响应浏览器类型
    getPieChart(type) {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        QueryField: type,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      if (type == "us") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let serverArrCount = []
          let serverArr = []
          this.generalRespHandler(resp, (Response) => {
            console.log(Response)
          })
        })
      } else if (type == "ua") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let browserArrCount = []
          let browserArr = []
          this.generalRespHandler(resp, ({Data: {Piechart}}) => {
            console.log(Piechart)
          })
        })
      }
    },
     // 获取请求来源地址和ip柱状图、响应时间最慢和页面访问次数top5
    getAccessIp(type) {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
        Host: "all",
        Edition: "clb-waf",
        QueryField: type,
        Source: "access",
      }
      if (this.selectValue != "") {
        params["Host"] = this.selectValue
      }
      this.axios.post(DESCRIBE_HISTOGRAM, params).then((resp) => {
        let ipArrCount = []
        let ipArr = []
        let localArr = []
        let localArrCount = []
        let artArrCount = []
        let artArr = []
        let urlArrCount = []
        let urlArr = []
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
        } else if(type == "art") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              artArrCount.push(v.count)
              artArr.push(v.art)
            })
            this.xAxisBarArt = artArr
            this.seriesBarArt = artArrCount
          })
        } else if(type == "url") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              urlArrCount.push(v.count)
              urlArr.push(v.url)
            })
            this.xAxisBarUrl = urlArr
            this.seriesBarUrl = urlArrCount
          })
        }
      })
    },
    // 时间点击事件
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
      this.$nextTick(() => {
        this.getPeakPoints();
        this.getPieChart();
        this.getPieChart("us");
        this.getPieChart("ua");
        this.getAccessIp("local");
        this.getAccessIp("ip");
      })
    },
    changeTimeValue() {
      this.thisType = 0
      this.startTime = moment(this.dateTimeValue[0]).startOf("days").format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(this.dateTimeValue[1]).endOf("days").format("YYYY-MM-DD HH:mm:ss");
      this.$nextTick(() => {
        this.getPeakPoints();
        this.getPieChart();
        this.getPieChart("us");
        this.getPieChart("ua");
        this.getAccessIp("local");
        this.getAccessIp("ip");
      })
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
          // const type = 'png';
          // const type = 'jpeg';
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
};
</script>
<style lang="scss" scoped>

::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #ccc;
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
        span.green {
          color: #29CC85;
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
   .echartsShowThird {
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
  .echartsShowFour {
    width: 100%;
    height: 308px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
  }
  .echartsShow {
    width: 100%;
    height: 378px;
    padding: 15px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    #echarts {
      width: 100%;
      height: 300px;
      div{
        width:100%;
      }
    }
  }
}
</style>