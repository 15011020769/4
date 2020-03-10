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
            <el-button
              @click="checkTime(1)"
              :class="thisType == '1' ? 'addStyleBtn' : ''"
              >今天</el-button
            >
            <el-button
              @click="checkTime(2)"
              :class="thisType == '2' ? 'addStyleBtn' : ''"
              >昨天</el-button
            >
            <el-button
              @click="checkTime(3)"
              :class="thisType == '3' ? 'addStyleBtn' : ''"
              >近7天</el-button
            >
          </el-button-group>
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            class="dateTimeValue"
            :clearable="false"
            @change="changeTimeValue"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')"
          ></el-date-picker>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-download" @click="dialogDownloadVisible = true"></i>
          <i class="el-icon-refresh" @click="id += 1"></i>
          <i class="el-icon-setting" @click="openSetDialog"></i>
        </el-row>
      </p>
      <component
        class="comp"
        v-for="comp in showModules"
        :is="comp"
        :times="[startTime, endTime]"
        :domain="selectValue"
        :showModules="showModules"
        :id="id"
      />
    </div>
    <DownLoadImg
      :dialogDownloadVisible="dialogDownloadVisible"
      @imgSaveMethod="saveImg"
      @onCancel="onCancel"
    />
    <el-dialog
      :title="t('自定义展示模板', 'WAF.zdyzsmb')"
      :visible.sync="dialogSetVisible"
      width="40%"
    >
      <div>
        <el-checkbox-group v-model="showModulesCopy" class="module">
          <el-checkbox
            border
            v-for="(m, index) in allModule"
            :key="m.name"
            :label="m.name"
          >
            {{ m.value }}
            <div
              :class="
                `move ${
                  index === 0 || index === allModule.length - 1 ? 'alone' : ''
                }`
              "
            >
              <i
                class="el-icon-caret-top"
                @click.prevent="up(index)"
                v-if="index !== 0"
              ></i>
              <i
                class="el-icon-caret-bottom"
                @click.prevent="down(index)"
                v-if="index !== allModule.length - 1"
              ></i>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModuleDisplaySet">保存</el-button>
        <el-button @click="cancelModuleDisplaySet">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import html2canvas from 'html2canvas'
import DownLoadImg from '../components/downLoadImg'
import overview from './model/overview'
import peakTrend from './model/peakTrend'
import serverStatus from './model/serverStatus'
import requestTypePrecent from './model/requestTypePrecent'
import responsePage from './model/responsePage'
import { BUSINESS_SHOWMODULE_KEY } from '../../constants'
import {
  DESCRIBE_HOSTS,
  DESCRIBE_PEAK_VALUE,
  DESCRIBE_PEAK_POINTS,
  DESCRIBE_PIECHART,
  DESCRIBE_HISTOGRAM
} from '@/constants'
import { flatObj } from '@/utils'
export default {
  data () {
    return {
      options: [], // 默认下拉选项
      dateTimeValue: [(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')), (moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))], // 日期绑定
      // dateTimeValue: [], //日期绑定
      selectValue: '', // 域名下拉菜单
      thisType: '1', // 按钮默认选中
      endTime: moment(new Date()).endOf('days').format('YYYY-MM-DD HH:mm:ss'),
      startTime: moment(new Date()).startOf('days').format('YYYY-MM-DD 00:00:00'),
      dialogDownloadVisible: false,
      dialogSetVisible: false,
      allModuleCopy: [
        { name: 'overview', value: this.t('带宽峰值、请求峰值', 'WAF.dkfzqqfz') },
        { name: 'peakTrend', value: this.t('业务请求趋势', 'WAF.ywqqqs') },
        { name: 'serverStatus', value: this.t('服务器响应状态 & 浏览器类型', 'WAF.fwqxyztllq') },
        { name: 'requestTypePrecent', value: this.t('请求来源地域TOP5 & 请求来源IP TOP5', 'WAF.qqlydqqip') },
        { name: 'responsePage', value: this.t('响应时间最慢页面TOP5 & 页面访问次数TOP5', 'WAF.xysjzmymfw') }
      ],
      allModule: [], // 所有组件
      showModules: [], // 显示的组件
      showModulesCopy: [], // 复制显示组件
      id: 0 // 用于父组件点击查询
    }
  },
  components: {
    DownLoadImg,
    overview,
    peakTrend,
    serverStatus,
    requestTypePrecent,
    responsePage
  },
  mounted () {
    const allModuleCopy = JSON.parse(JSON.stringify(this.allModuleCopy))
    let showModules = localStorage.getItem(BUSINESS_SHOWMODULE_KEY)
    if (showModules) {
      showModules = JSON.parse(showModules)
    } else {
      showModules = ['overview', 'peakTrend']
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
    this.getDominList()
  },
  watch: {
    showModulesCopy (val, oldVal) {
      if (val.length === 1) {
        this.$message({
          message: this.t('至少选择2个', 'WAF.zsxz2g'),
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.showModulesCopy = [...oldVal]
      }
    }
    // showModules(val, oldVal) {
    //   if (val.length === 1) {
    //     this.$message({
    //       message: this.t('至少选择2个', 'WAF.zsxz2g'),
    //       type: 'error',
    //       showClose: true,
    //       duration: 0
    //     })
    //     this.showModules = [...oldVal]
    //   }
    // }
  },
  methods: {
    openSetDialog () {
      this.dialogSetVisible = true
      this.showModulesCopy = [...this.showModules]
    },
    up (i) {
      this.allModule[i] = this.allModule.splice(i - 1, 1, this.allModule[i])[0]
    },
    down (i) {
      this.allModule[i] = this.allModule.splice(i + 1, 1, this.allModule[i])[0]
    },
    saveModuleDisplaySet () {
      this.dialogSetVisible = false
      const moduleNames = this.allModule.map(m => m.name) // 获取所有模块名称
      this.showModules = [...this.showModulesCopy]
      this.showModules = moduleNames.filter(name => this.showModules.includes(name))
      localStorage.setItem(BUSINESS_SHOWMODULE_KEY, JSON.stringify(this.showModules))
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 0
      })
    },
    cancelModuleDisplaySet () {
      this.dialogSetVisible = false
      this.showModulesCopy = [...this.showModules]
    },
    // 获取域名列表
    getDominList () {
      this.axios.post(DESCRIBE_HOSTS, {
        Version: '2018-01-25'
      }).then(({ Response }) => {
        if (Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        } else {
          this.options = Response.HostList
        }
      })
    },
    saveImg (type) {
      this.html2canvas_2(type)
    },
    onCancel () {
      this.dialogDownloadVisible = false
    },
    //  // 获取请求来源地址和ip柱状图、响应时间最慢和页面访问次数top5
    // getAccessIp(type) {
    //   const params = {
    //     Version: '2018-01-25',
    //     FromTime: this.startTime,
    //     ToTime: this.endTime,
    //     Host: "all",
    //     Edition: "clb-waf",
    //     QueryField: type,
    //     Source: "access",
    //   }
    //   if (this.selectValue != "") {
    //     params["Host"] = this.selectValue
    //   }
    //   this.axios.post(DESCRIBE_HISTOGRAM, params).then((resp) => {
    //     let ipArrCount = []
    //     let ipArr = []
    //     let localArr = []
    //     let localArrCount = []
    //     let artArrCount = []
    //     let artArr = []
    //     let urlArrCount = []
    //     let urlArr = []
    //     if (type == "ip") {
    //       this.generalRespHandler(resp, ({Histogram}) => {
    //         Histogram && Histogram.map(v => {
    //           ipArrCount.push(v.count)
    //           ipArr.push(v.ip)
    //         })
    //         this.xAxisBarIp = ipArr
    //         this.seriesBarIp = ipArrCount
    //       })
    //     } else if(type == "local") {
    //       this.generalRespHandler(resp, ({Histogram}) => {
    //         Histogram && Histogram.map(v => {
    //           localArrCount.push(v.count)
    //           localArr.push(v.local)
    //         })
    //         this.xAxisBarLocal = localArr
    //         this.seriesBarLocal = localArrCount
    //       })
    //     } else if(type == "art") {
    //       this.generalRespHandler(resp, ({Histogram}) => {
    //         Histogram && Histogram.map(v => {
    //           artArrCount.push(v.count)
    //           artArr.push(v.url)
    //         })
    //         this.xAxisBarArt = artArr
    //         this.seriesBarArt = artArrCount
    //       })
    //     } else if(type == "url") {
    //       this.generalRespHandler(resp, ({Histogram}) => {
    //         Histogram && Histogram.map(v => {
    //           urlArrCount.push(v.count)
    //           urlArr.push(v.url)
    //         })
    //         this.xAxisBarUrl = urlArr
    //         this.seriesBarUrl = urlArrCount
    //       })
    //     }
    //   })
    // },
    // 时间点击事件
    checkTime (type) {
      this.thisType = type
      var ipt1 = document.querySelector('.dateTimeValue input:nth-child(2)')
      var ipt2 = document.querySelector('.dateTimeValue input:nth-child(4)')
      const end = new Date()
      const start = new Date()
      if (type == '1') {
        start.setTime(start.getTime())
        end.setTime(end.getTime())
      } else if (type == '2') {
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        end.setTime(end.getTime() - 3600 * 1000 * 24)
      } else if (type == '3') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        end.setTime(end.getTime())
      }
      ipt1.value = moment(start).format('YYYY-MM-DD')
      ipt2.value = moment(end).format('YYYY-MM-DD')
      this.startTime = moment(start).startOf('days').format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(end).endOf('days').format('YYYY-MM-DD HH:mm:ss')
    },
    changeTimeValue () {
      this.thisType = 0
      this.startTime = moment(this.dateTimeValue[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment(this.dateTimeValue[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss')
    },
    html2canvas_2 (imgtype) {
      // 获取截取区域的高度和宽度
      const h = this.$refs.wrapperContent.offsetHeight
      const w = this.$refs.wrapperContent.offsetWidth
      const canvas = document.createElement('canvas')
      canvas.width = w * 2
      canvas.height = h * 2
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      canvas.style.color = 'chartreuse'
      const context = canvas.getContext('2d')
      context.scale(2, 2)
      html2canvas(this.$refs.wrapperContent, {
        allowTaint: true
        // taintTest: false,
        // canvas: canvas,
      }).then(function (canvas) {
        // const type = 'png';
        // const type = 'jpeg';
        const type = imgtype
        let imgData = canvas.toDataURL(type)
        const _fixType = function (type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg')
          const r = type.match(/png|jpeg|bmp|gif/)[0]
          return 'image/' + r
        }
        imgData = imgData.replace(_fixType(type), 'image/octet-stream')
        /**
           * 在本地进行文件保存
           * @param  {String} data     要保存到本地的图片数据
           * @param  {String} filename 文件名
           */
        const saveFile = function (data, filename) {
          const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = data
          save_link.download = filename
          const event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          save_link.dispatchEvent(event)
        }
        const filename = 'dashboard' + (new Date()).getTime() + '.' + type
        saveFile(imgData, filename)
      })
    }
    // 图表
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
::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0px;
}
.empty {
  height: 200px;
  width: 100%;
  line-height: 200px;
  text-align: center;
  font-weight: bold;
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
          color: #29cc85;
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
      div {
        width: 100%;
      }
    }
  }
}
.comp {
  margin-top: 20px;
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
</style>
