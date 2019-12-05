<template>
  <div>
    <div class="contentMain">
      <div class="topChoseTime newClear">
        <el-select v-model="logStatus" class="chooseSelect">
          <el-option label="全部日志" value="allLog"></el-option>
          <el-option label="调用成功" value="successLog"></el-option>
          <el-option label="调用失败" value="errorLog"></el-option>
        </el-select>
        <el-button-group class="bthGroup">
          <el-button @click="thisTime(1)">实时</el-button>
          <el-button @click="thisTime(2)">近24小时</el-button>
        </el-button-group>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="timeNode"
          @change="sureDate"
        ></el-date-picker>
        <el-button type="primary" @click="reset" size="small">重置</el-button>
        <div class="topFloatRight">
          <el-input v-model="iptSearch" placeholder="请输入requestID" class="rigthSearch"/>
          <el-button class="el-icon-search"></el-button>
        </div>
      </div>
      <div class="bottomContent newClear">
        <div class="leftConList">
          <ul>
            <p v-if="logList.length == 0" class="text-weak">暂无日志信息</p>
            <li
              v-for="(item,index) in logList"
              :key="item.id"
              @click="clickLog(index)"
              :class="{'logActive': logIndex == index}"
            >
              <span>{{item.time}}</span>
              <span>{{item.status}}</span>
            </li>
          </ul>
        </div>
        <div class="RightShow" v-if="logData && logData.Data&&logData.Data.length != 0">
          <p>请求ID：{{logData.Data[logIndex].RequestId}}</p>
          <div class="timeCenterShow">
            <span>时间：</span>
            <span class="marginColor">{{logData.Data[logIndex].StartTime}}</span>
            <span>运行时间：</span>
            <span class="marginColor">{{logData.Data[logIndex].Duration}}</span>
            <span>计费时间:{{logData.Data[logIndex].BillDuration}}</span>
            <span class="marginColor">ms</span>
            <span>占用内存</span>
            <span class="marginColor">{{logData.Data[logIndex].MemUsage}}mb</span>
          </div>
          <div class="logAndData">
            <div class="dataContent">
              <h1>返回数据：</h1>
              <p>{{logData.Data[logIndex].RetMsg}}</p>
            </div>
            <div class="logContent">
              <h1>日志：</h1>
              <div class="logCodeCont" v-html="logData.Data[logIndex].Log"></div>
            </div>
          </div>
        </div>
        <div class="RightShow" v-if="logData.Data.length == 0">
          <p>请求ID：</p>
          <div class="timeCenterShow">
            <span>时间：</span>
            <span class="marginColor"></span>
            <span>运行时间：</span>
            <span class="marginColor"></span>
            <span>计费时间:</span>
            <span class="marginColor">ms</span>
            <span>占用内存</span>
            <span class="marginColor">mb</span>
          </div>
          <div class="logAndData">
            <div class="dataContent">
              <h1>返回数据：</h1>
              <p></p>
            </div>
            <div class="logContent">
              <h1>日志：</h1>
              <div class="logCodeCont"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { FUN_LOG } from "@/constants";
export default {
  data() {
    return {
      logStatus: "",
      value1: "",
      iptSearch: "",
      logIndex: 0,
      logData: {
        Data: []
      },
      logList: []
    };
  },
  created() {
    this.searchLogs();
  },
  mounted() {},
  methods: {
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".timeNode input:nth-child(2)");
      var ipt2 = document.querySelector(".timeNode input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisTime == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      }
      ipt1.value = start
        .toLocaleString("chinese", { hour12: false })
        .replace(/\//g, "-");
      ipt2.value = end
        .toLocaleString("chinese", { hour12: false })
        .replace(/\//g, "-");
    },
    reset() {
      this.logStatus = "全部状态";
      this.value1 = null;
      this.searchLogs();
    },
    searchLogs() {
      let _this = this;
      let params = {
        Action: "GetFunctionLogs",
        Version: "2018-04-16",
        Region: _this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios
        .post(FUN_LOG, params)
        .then(res => {
          _this.logData = res.Response;
          console.log(_this.logData);
          res.Response.Data.forEach((element, index) => {
            let obj = {};
            obj.time = element.StartTime;
            obj.status = "调用成功";
            _this.logList.push(obj);
            element.Log = element.Log.replace(/\n/g, "<br/>");
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    clickLog(index) {
      this.logIndex = index;
    },
    formatDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d+ ' '  + '00' + ":" + '00' + ":" + '00';
    },
    // 选择日期
    sureDate(val, item) {
      let _this = this;
      let params = {
        Action: "GetFunctionLogs",
        Version: "2018-04-16",
        Region: _this.$cookie.get("regionv2"),
        StartTime: this.formatDateTime(val[0].getTime()),
        EndTime: this.formatDateTime(val[1].getTime())
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios
        .post(FUN_LOG, params)
        .then(res => {
          _this.logData = res.Response;
          console.log(_this.logData);
          res.Response.Data.forEach((element, index) => {
            let obj = {};
            obj.time = element.StartTime;
            obj.status = "调用成功";
            _this.logList.push(obj);
            element.Log = element.Log.replace(/\n/g, "<br/>");
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss">
.topChoseTime {
  margin-bottom: 12px;
  .chooseSelect {
    margin-right: 10px;
  }
  .bthGroup {
    margin-right: 10px;
  }
  .timeNode {
    margin-right: 10px;
  }
  .topFloatRight {
    float: right;
    .rigthSearch {
      width: 200px;
      input {
        width: 200px;
      }
    }
  }
}
.text-weak {
  color: #bbb !important;
  line-height: 49px;
  padding: 0 20px;
}
.bottomContent {
  min-height: 500px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  width: 100%;
  .leftConList {
    float: left;
    width: 370px;
    border-right: 1px solid #ddd;
    height: 690px;
    overflow-y: scroll;
    ul {
      li {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #ddd;
        font-size: 12px;
        padding: 0 20px;
        span:nth-child(1) {
          margin-right: 110px;
        }
      }
    }
  }
  .RightShow {
    float: right;
    width: calc(100% - 371px);
    min-height: 500px;
    padding: 10px 20px;
    p {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .timeCenterShow {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      margin-bottom: 20px;
      color: #888;
      background-color: rgb(242, 242, 242);
      padding: 0 12px;
      .marginColor {
        color: #000;
        margin-right: 12px;
      }
    }
    .logAndData {
      border-left: 11px solid rgb(210, 231, 247);
      min-height: 600px;
      background-color: rgb(242, 242, 242);
      padding: 12px;
      div {
        h1 {
          font-size: 14px;
          color: rgb(48, 127, 220);
          margin-bottom: 12px;
        }
      }
      .logCodeCont {
        line-height: 24px;
        font-size: 14px;
      }
    }
  }
  .logActive {
    background-color: #e5e5e5;
  }
}
</style>