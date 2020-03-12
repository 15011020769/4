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
              <p v-loading="loading">
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
        <div class="title">
          <h3>{{ $t('SCF.total.sytj') }}</h3>
          <el-button type="primary" size="small">{{addressIpt}}</el-button>
        </div>
        <div class="content">
          <el-tabs v-model="MetricName" @tab-click="handleClick">
            <el-tab-pane name="MemDuration">
              <template slot="label">
                <p>
                  <span class="menu1">资源使用量</span>
                  <span class="menu2">(MBms)</span>
                </p>
              </template>
              <div v-if="MetricName==='MemDuration'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">资源使用量</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-tab-pane>
            <el-tab-pane name="Invocation">
              <template slot="label">
                <p>
                  <span class="menu1">调用次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='Invocation'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">资源使用量</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="OutFlow">
              <template slot="label">
                <p>
                  <span class="menu1">外网出流量</span>
                  <span class="menu2">(KB)</span>
                </p>
              </template>
              <div v-if="MetricName==='OutFlow'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">外网出流量</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="Error">
              <template slot="label">
                <p>
                  <span class="menu1">错误次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='Error'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">错误次数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="ConcurrentExecutions">
              <template slot="label">
                <p>
                  <span class="menu1">并发执行个数</span>
                  <span class="menu2">(个)</span>
                </p>
              </template>
              <div v-if="MetricName==='ConcurrentExecutions'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">并发执行个数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="Throttle">
              <template slot="label">
                <p>
                  <span class="menu1">受限次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='Throttle'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">受限次数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Values.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                          :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    SCF_DETAILS,
    All_MONITOR,
    OVER_VIEW,
    USER_MONTH_USAGE,
    USER_YESTERDAY_USAGE,
    SCF_LIST,
    ALL_Basics,
    LIST_VERSION,
  } from "@/constants";
  export default {
    data() {
      return {
        showHeader: false,
        FuncList: [], //函数列表
        addressIpt: localStorage.getItem('regionv3'),
        loading: true,
        topList: {
          number: "",
          gbs: "",
          invokecount: "",
          outflow: "",
          ygbs: "",
          yinvokecount: "",
          youtflow: ""
        },
        TimeArr: [{
            name: '實時',
            Time: 'realTime',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              }
            ]
          },
          {
            name: '近24小時',
            Time: 'Nearly_24_hours',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              },
              {
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          },
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          }
        ],
        tabload: true,
        Time: {}, //监控传递时间
        Period: '', //粒度
        MetricName: 'MemDuration',
        //统计图下的列表
        tableData: [],
        disName: {
          'Duration': '運行時間',
          'Invocation': '調用次數',
          'Error': '調用錯誤次數',
          'ConcurrentExecutions': '並發執行次數',
          'ConfigMem': '配置記憶體',
          'FunctionErrorPercentage': '函數錯誤率',
          'Http2xx': '正確調用次數',
          'Http432': '資源超過限制',
          'Http433': '函數執行超時',
          'Http434': '記憶體超過限制',
          'Http4xx': '函數錯誤次數',
          'Invocation': '函數調用次數',
          'Mem': '運行記憶體',
          'MemDuration': '時間記憶體',
          'OutFlow': '外網出流量',
          'ServerErrorPercentage': '平台錯誤率',
          'Syserr': '系統內部錯誤次數',
          'Throttle': '函數運行受限次數'

        },
      };
    },
    components: {
      echartLine,
      TimeDropDown
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
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
        };
        this.axios.post(OVER_VIEW, params).then(res => {
          if (res.Response.FunctionTotalNum) {
            this.topList.number = res.Response.FunctionTotalNum;
            this.loading = false;
          }
        });
      },
      //本月调用数、本月资源量、本月输出量
      GetUserMonthUsage() {
        let params = {
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
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
        };
        this.axios.post(USER_YESTERDAY_USAGE, params).then(res => {
          this.topList.ygbs = res.Response.Gbs;
          this.topList.yinvokecount = res.Response.InvokeCount;
          this.topList.youtflow = res.Response.Outflow;
        });
      },
      handleClick(key, keyPath) {
        this.tabload = true
        this._GetMonitorData()
      },
      GetDat(data) {
        this.Period = data[0]
        this.Time = data[1]
        this._GetMonitorData()
      },
      //获取监控数据
      _GetMonitorData() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: this.MetricName,
          'Instances.0.Dimensions.0.Name': 'functionName',
          'Instances.0.Dimensions.0.Value': 'iai_tiia_deletePod',
          'Instances.0.Dimensions.1.Name': 'version',
          'Instances.0.Dimensions.1.Value': '$ATEST'
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          this.tableData = []
          if (data.Response.Error == undefined) {
            this.tableData.push(data.Response)
            this.tabload = false
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
    },
    filters: {
      UpName(value) {
        if (value === "Duration") {
          return (value = "運行時間");
        }
        if (value === "Invocation") {
          return (value = "調用次數");
        }
        if (value === "Error") {
          return (value = "調用錯誤次數");
        }
        if (value === "ConcurrentExecutions") {
          return (value = "並發執行次數");
        }
        if (value === "ConfigMem") {
          return (value = "配置記憶體");
        }
        if (value === "FunctionErrorPercentage") {
          return (value = "函數錯誤率");
        }
        if (value === "Http2xx") {
          return (value = "正確調用次數");
        }
        if (value === "Http432") {
          return (value = "資源超過限制");
        }
        if (value === "Http433") {
          return (value = "函數執行超時");
        }
        if (value === "Http434") {
          return (value = "內存超過限制");
        }

        if (value === "Http4xx") {
          return (value = "函數錯誤次數");
        }
        if (value === "Invocation") {
          return (value = "函數調用次數");
        }
        if (value === "Mem") {
          return (value = "運行記憶體");
        }
        if (value === "MemDuration") {
          return (value = "時間記憶體");
        }
        if (value === "OutFlow") {
          return (value = "外網出流量");
        }
        if (value === "ServerErrorPercentage") {
          return (value = "平台錯誤率");
        }
        if (value === "Syserr") {
          return (value = "系統內部錯誤次數");
        }
        if (value === "Throttle") {
          return (value = "函數運行受限次數");
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
  .wrap {
    height: 100%;

    .content {

      .menu1 {
        font-weight: bold;
      }

      .menu2 {
        color: #ccc;
      }

      .title {
        margin: 20px 0;
        font-weight: bold;
      }
    }
  }

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

    .title {
      h3 {
        line-height: 30px;
        margin-right: 20px;
      }

      display: flex;
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
