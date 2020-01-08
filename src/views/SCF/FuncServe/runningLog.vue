<template>
  <div class="contentMain">
    <div class="topChoseTime newClear" style="display:flex;">
      <el-select v-model="logStatus" class="chooseSelect">
        <el-option :label="$t('SCF.total.qbrz')" value="allLog"></el-option>
        <el-option :label="$t('SCF.total.dycg')" value="successLog"></el-option>
        <el-option :label="$t('SCF.total.dysb')" value="errorLog"></el-option>
      </el-select>
      <el-button-group class="bthGroup">
        <el-button @click="thisTime(1)">{{ $t('SCF.total.ss') }}</el-button>
        <el-button @click="thisTime(2)">{{ $t('SCF.total.jxs') }}</el-button>
      </el-button-group>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        :range-separator="$t('SCF.total.z')"
        :start-placeholder="$t('SCF.total.ksrq')"
        :end-placeholder="$t('SCF.total.jsrq')"
        class="timeNode"
        @change="sureDate"
      ></el-date-picker>
      <el-button type="primary" @click="reset">{{ $t('SCF.total.czhi') }}</el-button>
      <div class="topFloatRight" style="margin-left:10px;margin-top:-1px;">
        <el-input v-model="iptSearch" :placeholder="$t('SCF.total.qsrid')" class="rigthSearch" />
        <el-button class="el-icon-search"></el-button>
      </div>
    </div>
    <div class="bottomContent newClear">
      <div class="leftConList">
        <div class="leftConList_in">
          <ul>
            <p v-if="logList.length == 0" class="text-weak">{{ $t('SCF.total.zwrzxx') }}</p>
            <li
              v-for="(item,index) in logList"
              :key="item.id"
              @click="clickLog(index)"
              :class="{'logActive': logIndex == index}"
            >
              <span>{{item.time}}</span>
              <span :class="{successStyle:item.status=='调用成功'}">{{item.status}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="RightShow" v-if="logData && logData.Data&&logData.Data.length != 0">
        <p>{{ $t('SCF.total.qqid') }}：{{logData.Data[logIndex].RequestId}}</p>
        <div class="timeCenterShow">
          <span>{{ $t('SCF.total.sj') }}：</span>
          <span class="marginColor">{{logData.Data[logIndex].StartTime}}</span>
          <span>{{ $t('SCF.total.yxsj') }}：</span>
          <span class="marginColor">{{logData.Data[logIndex].Duration}}</span>
          <span>{{ $t('SCF.total.jfsj') }}:{{logData.Data[logIndex].BillDuration}}</span>
          <span class="marginColor">ms</span>
          <span>{{ $t('SCF.total.zync') }}</span>
          <span class="marginColor">{{logData.Data[logIndex].MemUsage}}mb</span>
        </div>
        <div class="logAndData">
          <div class="dataContent">
            <h1>{{ $t('SCF.total.fhsj') }}：</h1>
            <p>{{logData.Data[logIndex].RetMsg}}</p>
          </div>
          <div class="logContent">
            <h1>{{ $t('SCF.total.rz') }}：</h1>
            <div class="logCodeCont" v-html="logData.Data[logIndex].Log"></div>
          </div>
        </div>
      </div>
      <div class="RightShow" v-if="logData.Data.length == 0">
        <p>{{ $t('SCF.total.qqid') }}：</p>
        <div class="timeCenterShow">
          <span>{{ $t('SCF.total.sj') }}：</span>
          <span class="marginColor"></span>
          <span>{{ $t('SCF.total.yxsj') }}：</span>
          <span class="marginColor"></span>
          <span>{{ $t('SCF.total.jfsj') }}:</span>
          <span class="marginColor">ms</span>
          <span>{{ $t('SCF.total.zync') }}</span>
          <span class="marginColor">mb</span>
        </div>
        <div class="logAndData">
          <div class="dataContent">
            <h1>{{ $t('SCF.total.fhsj') }}：</h1>
            <p></p>
          </div>
          <div class="logContent">
            <h1>{{ $t('SCF.total.rz') }}：</h1>
            <div class="logCodeCont"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { FUN_LOG } from "@/constants";
import moment from "moment";
export default {
  data() {
    return {
      logStatus: "allLog",
      value1: "",
      iptSearch: "",
      logIndex: 0,
      logData: {
        Data: []
      },
      logList: [],
      startTime: "",
      endTime: "",
      timeData:'',
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
      const ETime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
      const start = new Date(ETime).getTime();
      const setTime=new Date()
      if (thisTime == "1") {
         // 1小时前
        const onehoursago = moment(start - 3600000).format(
            "YYYY-MM-DD HH:mm:ss"
          ); //获取1小时前的时间
        setTime.setTime(setTime - 3600 * 1000);
        this.startTime=onehoursago;
       
      } else if (thisTime == "2") {
        setTime.setTime(setTime - 3600 * 1000 * 24);
         // 1天前
        const oneDaysago = moment(start -3600 * 1000 * 24).format(
            "YYYY-MM-DD HH:mm:ss"
          ); //获取1天前的时间
        this.startTime=oneDaysago
      }
      this.endTime=ETime;
      ipt1.value = setTime
        .toLocaleString("chinese", { hour12: false })
        .replace(/\//g, "-");  
      ipt2.value = new Date().toLocaleString("chinese", { hour12: false }).replace(/\//g, "-");
     
      this.searchLogs();
    },
    reset() {
      this.logStatus = "allLog";
      this.value1 = null;
      this.searchLogs();
    },
    searchLogs() {
      let _this = this;
      let params = {
        Action: "GetFunctionLogs",
        Version: "2018-04-16",
        Region: localStorage.getItem("regionv2")
        // Filter:{"filter.RetCode":"is0"},
        // Filter:{RetCode:''}
        // Region: 'ap-guangzhou',//_this.$cookie.get("regionv2")
      };
      if (this.startTime && this.endTime) {
        params.StartTime = this.startTime;
        params.EndTime = this.endTime;
      }
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      console.log("前端发送", params);
      this.axios
        .post(FUN_LOG, params)
        .then(res => {
          console.log("加载数据", res.Response);
          if (res.Response.Data) {
            _this.logData = res.Response;
            res.Response.Data.forEach((element, index) => {
              let obj = {};
              obj.time = element.StartTime;
              obj.status = "调用成功";
              _this.logList.push(obj);
              element.Log = element.Log.replace(/\n/g, "<br/>");
            });
            console.log( _this.logList)
          }
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
      return y + "-" + m + "-" + d + " " + "00" + ":" + "00" + ":" + "00";
    },
    // 选择日期
    sureDate(val, item) {
    
      let _this = this;
      var differentTime=val[1].getTime()-val[0].getTime()
    if(differentTime>0&&differentTime<=3600 * 1000 * 24){
        let params = {
        Action: "GetFunctionLogs",
        Version: "2018-04-16",
        Region: localStorage.getItem("regionv2"),
        // Region: 'ap-guangzhou',//_this.$cookie.get("regionv2"),
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
          console.log(res);
          if(res.Response.Data){
            res.Response.Data.forEach((element, index) => {
              let obj = {};
              obj.time = element.StartTime;
              obj.status = "调用成功";
              _this.logList.push(obj);
              element.Log = element.Log.replace(/\n/g, "<br/>");
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      }else{
        this.$message({
          message: '开始时间与结束时间仅可相差一天,请重新选择',
          type: 'warning'
        });
       
      }
      
    }
  }
};
</script>
<style lang="scss">
.contentMain {
  // margin-bottom: 50px;
  // background: red;
}
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
    background: #fff;
    
    height:730px ;
    margin-bottom: 30px;
    
    .leftConList_in {
      height:690px ;
      overflow-y: scroll;
      border-right: 1px solid #ddd;
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
  }
  .RightShow {
    float: right;
    width: calc(100% - 371px);
    height: 730px;
    
    padding: 10px 20px;
    background: #fff;
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
      padding: 12px 12px 20px;
      overflow: auto;
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
  .successStyle {
    color: #0abf5b;
  }
}
</style>