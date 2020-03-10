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
            <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">今天</el-button>
            <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">昨天</el-button>
            <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            class="dateTimeValue"
            :clearable= false
            @change="changeTimeValue"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')"
          ></el-date-picker>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-download" @click="dialogDownloadVisible = true"></i>
          <i class="el-icon-refresh" @click="id+=1"></i>
          <i class="el-icon-setting" @click="openSetDialog"></i>
        </el-row>
      </p>
      <component
        class="comp"
        v-for="comp in showModules"
        :key="comp"
        :is="comp"
        :times="[startTime, endTime]"
        :domain="selectValue"
        :showModules="showModules"
        :id="id"
      />
    </div>
    <DownLoadImg
      :dialogDownloadVisible = dialogDownloadVisible
      @imgSaveMethod = "saveImg"
      @onCancel = "onCancel"
    />
    <el-dialog
      :title="t('自定义展示模板','WAF.zdyzsmb')"
      :visible.sync="dialogSetVisible"
      width="40%"
    >
      <div>
        <el-checkbox-group v-model="showModulesCopy" class="module">
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
        <el-button @click="cancelModuleDisplaySet">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import html2canvas from "html2canvas"
import DownLoadImg from '../components/downLoadImg'
import AttackDistribution from './safeoverview/attackDistribution'
import AttackSource from './safeoverview/attackSource'
import AttackTypePrecent from './safeoverview/attackTypePrecent'
import Business from './safeoverview/business'
import Overview from './safeoverview/overview'
import { SAFE_OVERVIEW_SHOWMODULE_KEY } from '../../constants'
import { DESCRIBE_HOSTS } from '@/constants'
import { flatObj } from '@/utils'
export default {
  data() {
    return {
      options: [], //默认下拉选项
      dateTimeValue: [moment().startOf("day"), moment().endOf("day")], //日期绑定
      selectValue: "", //域名下拉菜单
      selBtn: 1, // 默认选中今天按钮
      endTime: moment().endOf("days").format("YYYY-MM-DD HH:mm:ss"),
      startTime: moment().startOf("days").format("YYYY-MM-DD HH:mm:ss"),
      host: "",
      dialogDownloadVisible: false,
      dialogSetVisible: false,
      allModuleCopy: [
        { name: 'overview', value: this.t('WEB攻击拦截、CC拦截、BOT请求、DNS劫持区域数', 'WAF.webgjlj')},
        { name: 'business', value: this.t('业务请求趋势', 'WAF.ywqqqs')},
        { name: 'attackSource', value: this.t('攻击来源地域TOP5 & 攻击来源IP TOP5', 'WAF.gjlydyip')},
        { name: 'attackTypePrecent', value: this.t('访问类型占比 & 攻击类型占比', 'WAF.fwlxzbgj')},
        { name: 'attackDistribution', value: this.t('攻击来源区域分布', 'WAF.gjlyqyfb')},
      ],
      allModule: [],
      showModules: [],
      showModulesCopy: [],
      id: 0, // 用于父组件点击查询
    };
  },
  components: {
    DownLoadImg,
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
    this.getDominList();
　},
  watch: {
     showModulesCopy(val, oldVal) {
      if (val.length === 1) {
        this.$message({
          message: this.t('至少选择2个', 'WAF.zsxz2g'),
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.showModulesCopy = [...oldVal]
      }
    },
    // showModules(val, oldVal) {
    //   console.log(val)
    //   if (val.length === 1) {
    //     this.$message({
    //       message: this.t('至少选择2个', 'WAF.zsxz2g'),
    //       type: 'error',
    //       showClose: true,
    //       duration: 0
    //     })
    //     this.showModules = [...oldVal]
    //   }
    // },
  },
  methods: {
    openSetDialog() {
      this.dialogSetVisible = true
      this.showModulesCopy = [...this.showModules]
    },
    up(i) {
      this.allModule[i] = this.allModule.splice(i-1, 1, this.allModule[i])[0]
    },
    down(i) {
      this.allModule[i] = this.allModule.splice(i+1, 1, this.allModule[i])[0]
    },
    cancelModuleDisplaySet() {
      this.dialogSetVisible = false
      this.showModulesCopy = [...this.showModules]
    },
    saveModuleDisplaySet() {
      this.dialogSetVisible = false
      const moduleNames = this.allModule.map(m => m.name) // 获取所有模块名称
      this.showModules = [...this.showModulesCopy]
      this.showModules = moduleNames.filter(name => this.showModules.includes(name))
      localStorage.setItem(SAFE_OVERVIEW_SHOWMODULE_KEY, JSON.stringify(this.showModules))
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 0
      });
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
    //时间点击事件
    checkTime(val) {
      let times = [moment().startOf("day"), moment()] // 默认今天
      this.selBtn = val
      switch (val) {
        case 2:
          times = [moment().subtract(24, "hours").startOf("day"), moment().subtract(24, "hours")]
          break;
        case 3:
          times = [moment().subtract(7, "days").startOf("day"), moment()]
          break;
        default:
          break;
      }
      times[1] = times[1].endOf('day')
      this.dateTimeValue = times
      this.startTime = moment(this.dateTimeValue[0]).format("YYYY-MM-DD HH:mm:ss")
      this.endTime = moment(this.dateTimeValue[1]).format("YYYY-MM-DD HH:mm:ss")
    },
    changeTimeValue() {
      this.selBtn = 0
      this.startTime = moment(this.dateTimeValue[0]).startOf("days").format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(this.dateTimeValue[1]).endOf("days").format("YYYY-MM-DD HH:mm:ss");
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
  }
}
</script>
<style lang="scss" scoped>

::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #e5e5e5;
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
    line-height: 28px;
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
          line-height: 22px;
        }
        ::v-deep .el-range-separator {
          line-height: 22px;
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