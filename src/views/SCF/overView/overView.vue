<template>
  <div>
    <div class="topOverView">
      <span>概览</span>
    </div>
    <div class="mainContainer">
      <div class="contentTop">
        <el-row>
          <el-col :span="6">
            <div class="modelList">
              <p>函数数量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>个</span>
              </p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月调用数</p>
              <p>
                <span>{{topList.invokecount}}</span>
                <span>次</span>
              </p>
              <p>昨日调用数{{topList.yinvokecount}}次</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月资源量</p>
              <p>
                <span>{{topList.gbs}}</span>
                <span>GBs</span>
              </p>
              <p>昨日资源量{{topList.ygbs}}GBs</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月出流量</p>
              <p>
                <span>{{topList.outflow}}</span>
                <span>GB</span>
              </p>
              <p>昨日出流量{{topList.youtflow}}GB</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="modelchart">
        <h3>使用统计</h3>
        <div>
          <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
          <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        </div>
        <div class="chartShowCon">
          <div class="chartShowTit">
            <el-button-group>
              <el-button @click="btnClick(1)" :class="{'addColor':type=='1'}">
                调用次数
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(2)" :class="{'addColor':type=='2'}">
                外网出流量
                <span>(KB)</span>
              </el-button>
              <el-button @click="btnClick(3)" :class="{'addColor':type=='3'}">
                运行内存
                <span>(MB)</span>
              </el-button>
              <el-button @click="btnClick(4)" :class="{'addColor':type=='4'}">
                运行时间
                <span>(ms)</span>
              </el-button>
              <el-button @click="btnClick(5)" :class="{'addColor':type=='5'}">
                错误次数
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(6)" :class="{'addColor':type=='6'}">
                并发执行个数
                <span>(个)</span>
              </el-button>
              <el-button @click="btnClick(7)" :class="{'addColor':type=='7'}">
                受限次数
                <span>(次)</span>
              </el-button>
            </el-button-group>
          </div>

          <div class="chartNum newClear">
            <span>函数{{newData}}TOP 10统计</span>
            <span>
              <a>刷新</a>
            </span>
          </div>
          <div class="chartTable">
            <!-- <el-table :data="tableData"  ref="multipleTable" class="funDataTable">
            <el-table-column prop="funName" label="函数名"></el-table-column>
            <el-table-column prop="nameSpace" label="命名空间"></el-table-column>
            <el-table-column prop="dataNum" label="数据指标"></el-table-column>
            </el-table>-->
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              class="funDataTable"
            >
              <div class="chartCon" id="echartsShow" ref="chartY">
                <el-table-column prop="DataPoints" width="550">
                  <template slot-scope="scope">
                    <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
                    <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
                      <echart-line
                        id="diskEchearrts-line"
                        :time="scope.row.DataPoints[0].Timestamps | UpTime"
                        :opData="scope.row.DataPoints[0].Values"
                        :scale="3"
                        :period="period"
                        :xdata="false"
                      ></echart-line>
                    </div>
                  </template>
                </el-table-column>
              </div>
              <el-table-column prop="FunctionName" label="函数名"></el-table-column>
              <el-table-column prop="Namespace" label="命名空间"></el-table-column>
              <el-table-column prop="dataNum" label="数据指标"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import XTimeX from "@/components/public/TimeXK";
import echartLine from "@/components/public/echars-line";
import {
  SCF_DETAILS,
  All_MONITOR,
  OVER_VIEW,
  USER_MONTH_USAGE,
  USER_YESTERDAY_USAGE,
  SCF_LIST,
  LIST_VERSION
} from "@/constants";
export default {
  data() {
    return {
      funlistname: [],
      funlistversion: [],
      functionName: this.$route.query.FunctionName,
      addressIpt: "中国台北",
      topList: {
        number: "",
        gbs: "",
        invokecount: "",
        outflow: "",
        number: "",
        ygbs: "",
        yinvokecount: "",
        youtflow: ""
      },
      type: "1",
      value: "",
      valueAddress: "",
      newData: "调用次数",
      value2: "",
      changeColor: "",
      //统计图下的列表
      tableData: [
        {
          funName: "函数名1",
          nameSpace: "命名空间1",
          dataNum: "数据指标1"
        },
        {
          funName: "函数名2",
          nameSpace: "命名空间2",
          dataNum: "数据指标2"
        },
        {
          funName: "函数名3",
          nameSpace: "命名空间2",
          dataNum: "数据指标3"
        }
      ],
      charts: ""
    };
  },
  components: {
    echartLine,
    XTimeX
  },
  methods: {
    //函数数量
    GetOverView() {
      let params = {
        Action: "GetFunctionTotalNum",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2")
      };
      this.axios.post(OVER_VIEW, params).then(res => {
        this.topList.number = res.Response.FunctionTotalNum;
      });
    },
    //本月调用数、本月资源量、本月输出量
    GetUserMonthUsage() {
      let params = {
        Action: "GetUserMonthUsage",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2")
      };
      this.axios.post(USER_MONTH_USAGE, params).then(res => {
        this.topList.gbs = res.Response.Gbs;
        this.topList.invokecount = res.Response.InvokeCount;
        this.topList.outflow = res.Response.Outflow;
      });
    },
    //昨日用户使用
    GetUserYesterdayUsage() {
      let params = {
        Action: "GetUserYesterdayUsage",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2")
      };
      this.axios.post(USER_YESTERDAY_USAGE, params).then(res => {
        this.topList.ygbs = res.Response.Gbs;
        this.topList.yinvokecount = res.Response.InvokeCount;
        this.topList.youtflow = res.Response.Outflow;
      });
    },
    //获取数据
    GetDat(data) {
      console.log(data);
      this.period = data[0];
      this.Start_End = data[1];
      this.value = data[2];

      this.tableData = [];
      // for (let i = 0; i < metricNArr.length; i++) {
      //   this.Obtain(metricNArr[i]);
      // }s
    },
    //
    Obtain(metricN) {
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"), //'ap-guangzhou',
        Namespace: "QCE/SCF_V2",
        MetricName: metricN,
        "Instances.0.Dimensions.0.Name": "functionName",
        "Instances.0.Dimensions.0.Value": this.funlistname[0],
        "Instances.0.Dimensions.1.Name": "version",
        "Instances.0.Dimensions.1.Value": this.funlistversion[0],
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      console.log(param)
      this.axios.post(All_MONITOR, param).then(data => {
        this.tableData = [];
        console.log(data);
        this.tableData.push(data.Response.DataPoints[0].Values);
        // console.log(this.tableData)
      });
    },

    btnClick(clickNode) {
      this.type = clickNode;
      if (clickNode == "1") {
        this.newData = "调用次数";
        var metricNArr = "Invocation";
        this.Obtain(metricNArr);
      } else if (clickNode == "2") {
        this.newData = "外网出流量";
        var metricNArr = "OutFlow";
        this.Obtain(metricNArr);
      } else if (clickNode == "3") {
        this.newData = "运行内存";
        var metricNArr = "Mem";
        this.Obtain(metricNArr);
      } else if (clickNode == "4") {
        this.newData = "运行时间";
        var metricNArr = "Duration";
        this.Obtain(metricNArr);
      } else if (clickNode == "5") {
        this.newData = "错误次数";
        var metricNArr = "Error";
        this.Obtain(metricNArr);
      } else if (clickNode == "6") {
        this.newData = "并发执行个数";
        var metricNArr = "ConcurrentExecutions";
        this.Obtain(metricNArr);
      } else if (clickNode == "7") {
        this.newData = "受限次数";
        var metricNArr = "Throttle";
        this.Obtain(metricNArr);
      }
    },
    list() {
      var vm = this;
      const param = {
        Action: "ListFunctions",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2") //'ap-guangzhou',
      };
      this.axios.post(SCF_LIST, param).then(data => {
        data.Response.Functions.forEach(function(elem, index) {
          vm.funlistname.push(elem.FunctionName);
        });
        vm.typee()



      });
    },
    typee() {
      var vm = this;
      var listname = this.funlistname
      listname.forEach(function(elem) {   
        var param = {
          Action: "ListVersionByFunction",
          Version: "2018-04-16",
          Region: "ap-guangzhou", //'ap-guangzhou',
        };
        param["FunctionName"] = elem
        vm.axios.post(LIST_VERSION, param).then(data => {
          vm.funlistversion.push(data.Response.FunctionVersion[0])     
        });
      });
    }
  },
  filters: {
    UpName(value) {
      if (value === "Duration") {
        return (value = "运行时间");
      }
      if (value === "Invocation") {
        return (value = "调用次数");
      }
      if (value === "Error") {
        return (value = "调用错误次数");
      }
      if (value === "ConcurrentExecutions") {
        return (value = "并发执行次数");
      }
      if (value === "ConfigMem") {
        return (value = "配置内存");
      }
      if (value === "FunctionErrorPercentage") {
        return (value = "函数错误率");
      }
      if (value === "Http2xx") {
        return (value = "正确调用次数");
      }
      if (value === "Http432") {
        return (value = "资源超过限制");
      }
      if (value === "Http433") {
        return (value = "函数执行超时");
      }
      if (value === "Http434") {
        return (value = "内存超过限制");
      }

      if (value === "Http4xx") {
        return (value = "函数错误次数");
      }
      if (value === "Invocation") {
        return (value = "函数调用次数");
      }
      if (value === "Mem") {
        return (value = "运行内存");
      }
      if (value === "MemDuration") {
        return (value = "时间内存");
      }
      if (value === "OutFlow") {
        return (value = "外网出流量");
      }
      if (value === "ServerErrorPercentage") {
        return (value = "平台错误率");
      }
      if (value === "Syserr") {
        return (value = "系统内部错误次数");
      }
      if (value === "Throttle") {
        return (value = "函数运行受限次数");
      }
    },
    UpTime(value) {
      let timeArr = [];
      for (let i = 0; i < value.length; i++) {
        let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
        timeArr.push(uptime);
      }

      return timeArr;
    }
  },
  mounted() {
    this.list();
    
    if (this.tableData == "") {
      document.querySelector(".chartTable").innerHTML = "暂无数据";
    }
    // this.initChart(this.tableData);
    this.GetOverView();
    this.GetUserMonthUsage();
    this.GetUserYesterdayUsage();
  }
};
</script>

<style scoped lang="scss">
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topOverView {
  width: 100%;
  height: 52px;
  background-color: #fff;
  line-height: 52px;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
  span:nth-child(1) {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    float: left;
  }
  span:nth-child(2) {
    font-size: 14px;
    color: #888;
    float: right;
    a {
      color: #888;
    }
  }
}
.mainContainer {
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
}
.contentTop {
  padding: 20px 0;
  width: 100%;
  height: 150px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  div:nth-child(4) {
    div {
      border-right: 0;
    }
  }
}
.modelList {
  padding: 10px 20px;
  border-right: 1px solid #ccc;
  height: 110px;
  p:nth-child(1) {
    color: #000;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  p:nth-child(2) {
    margin-bottom: 8px;
    color: #000;
    span:nth-child(1) {
      font-size: 30px;
    }
  }
  p:nth-child(3) {
    color: #888;
  }
}
.modelchart {
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  padding: 20px;
  h3 {
    line-height: 28px;
  }
}
.selectAddress {
  margin-right: 20px;
}
.newDataTime {
  margin-left: 20px;
}
.chartShowTit {
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  height: 35px;
  line-height: 38px;
  margin-top: 20px;
  button {
    padding: 5px 10px;
    border-bottom: 2px solid transparent;
    margin-right: 20px !important;
    border: none;
    border-radius: 0;
    span {
      font-size: 12px;
      color: #888;
    }
  }
  .addColor {
    border-bottom: 2px solid #006eff;
    background-color: transparent;
    font-weight: 600;
    color: #000;
    span {
      font-weight: 100;
    }
  }
}
.chartCon {
  min-height: 300px;
  // border:1px solid #eaeaea;
}
.chartNum {
  margin-top: 20px;
  margin-bottom: 20px;
  span:nth-child(1) {
    font-weight: 600;
    float: left;
  }
  span:nth-child(2) {
    color: #006eff;
    float: right;
    cursor: pointer;
  }
}
.chartTable {
  min-height: 32px;
  line-height: 32px;
  text-align: left;
  table tbody tr td {
    text-align: left;
  }
}
</style>
