<template>
  <div class="appreciation-wrap">
    <Header title="增值功能" />
    <div class="topSelect">
      <el-button-group>
        <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">今天</el-button>
        <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">昨天</el-button>
        <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">近7天</el-button>
        <el-button @click="checkTime(4)" :class="selBtn=='4'?'addStyleBtn':''">近30天</el-button>
      </el-button-group>
      <el-date-picker
        ref="mypicker"
        v-model="dateTimeValue"
        type="datetimerange"
        class="timeValue"
        range-separator="至"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        @change="changeTimeValue"
        :picker-options="pickerOptions"
        :clearable= false
      ></el-date-picker>
      <el-button style="margin-left:20px;" type="primary">{{region}}</el-button>
      <el-button style="margin-left:20px;" type="primary" @click="search">{{$t('CSS.appreciation.0')}}</el-button>
    </div>
    <div class="appreciation-main">
      <div class="tab-box">
        <dl
          v-for="(item,index) in tab"
          :key="index"
          :class="tabIndex == index ? 'active' : ''"
          @click="tabClick(index)"
        >
          <dt>{{item.name}}</dt>
          <dd>{{item.value}}</dd>
        </dl>
      </div>
      <div class="main">
        <Tab1 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 0" ref="tab1" />
        <Tab2 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 1" ref="tab2" />
        <Tab3 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 2" ref="tab3" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Header from "@/components/public/Head";
// import XTimeX from "@/components/public/TimeN";
import { ALL_CITY, CSS_SCREEN, CSS_RECORDSTREAM, CSS_CODECHARTS } from "@/constants";
import Tab1 from "./tab/tab1";
import Tab2 from "./tab/tab2";
import Tab3 from "./tab/tab3";
export default {
  name: "appreciation",
  data() {
    let vue = this
    return {
      value: 1, // 时间组件默认选中值
      region: '台灣台北', // 地域
      tabIndex: 0, // tab默认选中值
      // tab内容
      tab: [
        {
          name: '截圖纍計值',
          value: 0
        },
        {
          name: '轉碼總時長',
          value: 0
        },
        {
          name: '錄製峰值',
          value: 0
        }
      ],
      StartTIme: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      EndTIme: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      dateTimeValue: [moment().startOf('day'), moment()], // 日期绑定
      selBtn: 1, // 默认选中今天按钮
      pickerOptions: {
        disabledDate(time) {
          let timeOptionRange = vue.timeOptionRange;
          if(timeOptionRange){
            return moment(timeOptionRange).diff(time, 'days') > 30
            || moment(time).diff(timeOptionRange, 'days') > 30
            || time > moment()
            || time < moment().startOf('years')
          }
          return time > moment() || time < moment().startOf('years')
        },
        onPick(time){
          if(time.minDate && !time.maxDate){
              vue.timeOptionRange = time.minDate;
          }
          if(time.maxDate){
              vue.timeOptionRange = null;
          }
        }
      }
    };
  },
  components: {
    Header,
    Tab1,
    Tab2,
    Tab3
  },
  created () {
    this.getCity()
    this.getScreens()
    this.getPeaks()
    this.getDurations()
  },
  methods: {
    //查询
    search() {
      this.getScreens()
      this.getPeaks()
      this.getDurations()
      if (this.tabIndex == 0) {
        this.getScreens()
        this.$nextTick(() => {
          this.$refs.tab1.getCharts()
        })
      } else if (this.tabIndex == 1) {
        this.getDurations()
        this.$nextTick(() => {
          this.$refs.tab2.getCharts()
        })
      } else if (this.tabIndex == 2) {
        this.getPeaks()
        this.$nextTick(() => {
          this.$refs.tab3.getCharts()
        })
      }
    },
    // 时间点击事件
    checkTime (val) {
      let times = [moment().startOf('day'), moment()] // 默认今天
      this.selBtn = val
      switch (val) {
        case 2:
          times = [moment().subtract(24, 'hours'), moment().subtract(24, 'hours').endOf('day')]
          break
        case 3:
          times = [moment().subtract(6, 'days'), moment().endOf('day')]
          break
        case 4:
          times = [moment().subtract(29, 'days'), moment().endOf('day')]
          break
        default:
          break
      }
      times[0] = times[0].startOf('day')
      this.$refs.mypicker.userInput = null
      this.dateTimeValue = times
      this.StartTIme = moment(this.dateTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTIme = moment(this.dateTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    changeTimeValue () {
      this.selBtn = 0
      this.StartTIme = moment(this.dateTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTIme = moment(this.dateTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取城市
    getCity () {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone
      })
    },
    // tab切换
    tabClick (index) {
      this.tabIndex = index
    },
    getScreens () {
      let totalScreen = 0
      const params = {
        Version: '2018-08-01',
        Granularity: 'Minute',
        Zone: "Oversea",
        StartTime: moment(this.StartTIme).utc().format(),
        EndTime: moment(this.EndTIme).utc().format()
      }
      this.axios.post(CSS_SCREEN, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          res.Response.DataInfoList.map(v => {
            totalScreen += v.Num
          })
          this.tab[0].value = totalScreen
        }
      })
    },
    getPeaks () {
      const params = {
        Version: "2018-08-01",
        StartTime : moment(this.StartTIme).format('YYYY-MM-DD HH:mm:ss'),
        EndTime : moment(this.EndTIme).format('YYYY-MM-DD HH:mm:ss'),
        MainlandOrOversea: "Oversea",
        LiveType: "NormalLive",
      };
      this.axios.post(CSS_RECORDSTREAM, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          this.tab[2].value = Math.max(...res.Response.DataInfoList.map(item => item.Num))
        }
      })
    },
    getDurations () {
      const params = {
        Version: '2018-08-01',
        StartTime: moment(this.StartTIme).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment(this.EndTIme).format('YYYY-MM-DD HH:mm:ss')
      }
      let total = 0
      this.axios.post(CSS_CODECHARTS, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          res.Response.DataInfoList.map(v => {
            total += v.Duration
          })
          this.tab[1].value = total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.appreciation-wrap >>> .el-button,
.appreciation-wrap >>> .el-input__inner,
.appreciation-wrap >>> .el-range-input {
  height: 30px;
  border-radius: 0;
  line-height: 30px;
  padding-top: 0;
  overflow: hidden;
}
.appreciation-wrap >>> .el-range-input {
  margin-top: 5px;
}
 ::v-deep .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    border-radius: 0;
  }
.appreciation-wrap {
  .seek {
    display: flex;
    align-items: center;
  }
  .appreciation-main {
    margin: 20px;
    padding: 10px 0;
    box-sizing: border-box;
    background: white;

    .main {
      padding: 0 20px 20px 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }

    .tab-box {
      display: flex;
      dl {
        flex: 1;
        padding: 0 20px;
        box-sizing: border-box;
        border-right: 1px #ccc solid;

        cursor: pointer;
        dt {
          font-size: 14px;
          font-weight: bold;
          border-top: 2px white solid;
          padding-top: 20px;
          box-sizing: border-box;
        }

        dd {
          font-size: 34px;
          margin-top: 15px;
          padding-bottom: 20px;
          box-sizing: border-box;
        }
      }
      dl:nth-last-child(1) {
        border-right: 0;
      }
      .active {
        color: #006eff;
        dt {
          border-top: 2px #006eff solid;
        }
      }
    }
  }
  .topSelect {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    box-sizing: border-box;
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
          line-height: 22px !important;
      }
      ::v-deep .el-range-input {
        width: 43%;
      }
      ::v-deep .el-range-separator {
        line-height: 30px !important;
        height: 30px;
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
  button {
    height: 30px;
    line-height: 6px;
    border-radius: 0;
  }
  .timeValue {
    border-left: none;
    width: 380px;
    font-size: 12px !important;
  }
</style>
