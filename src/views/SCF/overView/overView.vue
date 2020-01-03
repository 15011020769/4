<template>
  <div class="wrap">
    <div class="topOverView">
      <span>{{ $t('SCF.total.gl') }}</span>
    </div>
    <div class="mainContainer">
      <div class="contentTop">
        <el-row>
          <el-col :span="6">
            <div class="modelList">
              <p>{{ $t('SCF.total.hssl') }}</p>
              <p>
                <span>{{topList.number}}</span>
                <span>个</span>
              </p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>{{ $t('SCF.total.bydys') }}</p>
              <p>
                <span>{{topList.invokecount}}</span>
                <span>次</span>
              </p>
              <p>{{ $t('SCF.total.zrdys') }}{{topList.yinvokecount}}次</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>{{ $t('SCF.total.byzyl') }}</p>
              <p>
                <span>{{topList.gbs}}</span>
                <span>GBs</span>
              </p>
              <p>{{ $t('SCF.total.zrzyl') }}{{topList.ygbs}}GBs</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>{{ $t('SCF.total.bycll') }}</p>
              <p>
                <span>{{topList.outflow}}</span>
                <span>GB</span>
              </p>
              <p>{{ $t('SCF.total.zrcll') }}{{topList.youtflow}}GB</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="modelchart">
        <!-- <h3>{{ $t('SCF.total.sytj') }}</h3> -->
        <!-- <div>
          <el-button class="addressName" readonly="readonly" v-model="addressIpt">{{ $t('SCF.total.zgtb') }}</el-button>
          <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        </div> -->
        <div class="chartShowCon">
          <div class="chartShowTit">
            <el-button-group>
              <el-button @click="btnClick(1)" :class="{'addColor':type=='1'}">
                {{ $t('SCF.total.dycs') }}
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(2)" :class="{'addColor':type=='2'}">
                {{ $t('SCF.total.wwcll') }}
                <span>(KB)</span>
              </el-button>
              <el-button @click="btnClick(3)" :class="{'addColor':type=='3'}">
                {{ $t('SCF.total.yxnc') }}
                <span>(MB)</span>
              </el-button>
              <el-button @click="btnClick(4)" :class="{'addColor':type=='4'}">
                {{ $t('SCF.total.yxsj') }}
                <span>(ms)</span>
              </el-button>
              <el-button @click="btnClick(5)" :class="{'addColor':type=='5'}">
                {{ $t('SCF.total.cwcs') }}
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(6)" :class="{'addColor':type=='6'}">
                {{ $t('SCF.total.bfzxgs') }}
                <span>(个)</span>
              </el-button>
              <el-button @click="btnClick(7)" :class="{'addColor':type=='7'}">
                {{ $t('SCF.total.sxcs') }}
                <span>(次)</span>
              </el-button>
            </el-button-group>
          </div>
          <!-- <div class="chartTable">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
              class="funDataTable">
              <el-table-column prop="DataPoints" width="550">
                <template slot-scope="scope">
                  <p v-if="scope.row.DataPoints[0].Values.length==0">{{ $t('CVM.clBload.zwsj') }}</p>
                  <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
                    <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                      :opData="scope.row.DataPoints[0].Values" :scale="3" :period="period" :xdata="false"></echart-line>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="FunctionName" label="函数名"></el-table-column>
              <el-table-column prop="Namespace" label="命名空间"></el-table-column>
              <el-table-column prop="dataNum" label="数据指标"></el-table-column>
            </el-table>
          </div> -->
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
    LIST_VERSION,
    ALL_CITY
  } from "@/constants";
  export default {
    data() {
      return {
        addressIpt: localStorage.getItem('regionv3'),
        topList: {
          number: "",
          gbs: "",
          invokecount: "",
          outflow: "",
          ygbs: "",
          yinvokecount: "",
          youtflow: ""
        },
        type: "1",
        value: "",
        newData: "调用次数",
        //统计图下的列表
        tableData: [{
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
        ]
      };
    },
    components: {
      echartLine,
      XTimeX
    },
    created() {
      this.GetOverView();
      this.GetUserMonthUsage();
      this.GetUserYesterdayUsage();
    },
    methods: {
      //函数数量
      GetOverView() {
        let params = {
          Action: "GetFunctionTotalNum",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
        };
        this.axios.post(OVER_VIEW, params).then(res => {
          console.log(res)
          this.topList.number = res.Response.FunctionTotalNum;
        });
      },
      //本月调用数、本月资源量、本月输出量
      GetUserMonthUsage() {
        let params = {
          Action: "GetUserMonthUsage",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
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
          Region: localStorage.getItem('regionv2')
        };
        this.axios.post(USER_YESTERDAY_USAGE, params).then(res => {
          this.topList.ygbs = res.Response.Gbs;
          this.topList.yinvokecount = res.Response.InvokeCount;
          this.topList.youtflow = res.Response.Outflow;
        });
      },
      //获取数据
      GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2];
        this.tableData = [];
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
  };

</script>

<style scoped lang="scss">
  .wrap>>>.btn-style {
    margin-left: 0;
  }

  .wrap>>>input,
  .wrap>>>button {
    height: 30px;
    border-radius: 0;
    font-size: 12px;
  }

  .wrap>>>button {
    padding: 0 15px;
    box-sizing: border-box;
  }

  .chartShowCon>>>button {
    background: transparent;
  }

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
