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
            <el-tab-pane name="mem_duration">
              <template slot="label">
                <p>
                  <span class="menu1">资源使用量</span>
                  <span class="menu2">(MBms)</span>
                </p>
              </template>
              <div v-if="MetricName==='mem_duration'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">资源使用量</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-tab-pane>
            <el-tab-pane name="invocation">
              <template slot="label">
                <p>
                  <span class="menu1">调用次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='invocation'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">调用次数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="out_flow">
              <template slot="label">
                <p>
                  <span class="menu1">外网出流量</span>
                  <span class="menu2">(KB)</span>
                </p>
              </template>
              <div v-if="MetricName==='out_flow'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">外网出流量</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="error">
              <template slot="label">
                <p>
                  <span class="menu1">错误次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='error'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">错误次数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane name="concurrent_executions">
              <template slot="label">
                <p>
                  <span class="menu1">并发执行个数</span>
                  <span class="menu2">(个)</span>
                </p>
              </template>
              <div v-if="MetricName==='concurrent_executions'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">并发执行个数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane> -->
            <el-tab-pane name="throttle">
              <template slot="label">
                <p>
                  <span class="menu1">受限次数</span>
                  <span class="menu2">(次)</span>
                </p>
              </template>
              <div v-if="MetricName==='throttle'">
                <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                  v-on:switchData="GetDat" />
                <p class="title">受限次数</p>
                <el-table :data="tableData" style="width: 750px" v-loading='tabload'>
                  <el-table-column>
                    <template slot-scope="scope">
                      <p v-if="scope.row.DataPoints[0].Points.length==0">{{$t('SCF.total.zwsj')}}</p>
                      <div v-if="scope.row.DataPoints[0].Points.length!=0">
                        <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                          :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                          :MetricName='disName[scope.row.MetricName]'></echart-line>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="top10">
          <div class="title">
            <p>函数资源使用量 TOP 10 统计</p>
            <p class="shua">刷新</p>
          </div>
          <div>
            <el-table :data="TopArr" style="width: 100%">
              <el-table-column prop="" label="函数名">
              </el-table-column>
              <el-table-column prop="" label="命名空间">
              </el-table-column>
              <el-table-column prop="" label="数据指标">
              </el-table-column>
            </el-table>
          </div>
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
    TOP_LIST
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
        MetricName: 'mem_duration',
        //统计图下的列表
        tableData: [],
        disName: {
          'Duration': '運行時間',
          'invocation': '調用次數',
          'error': '調用錯誤次數',
          'mem_duration': '時間記憶體',
          'out_flow': '外網出流量',
          'throttle': '函數運行受限次數',
          'ConcurrentExecutions': '并发执行错误'
        },
        TopArr: [] //top10列表
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
      // this._GetTop()
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
        this.tabload = true
        this.Period = data[0]
        this.Time = data[1]
        this._GetMonitorData()
      },
      //获取监控数据
      _GetMonitorData() {
        let parms = {
          Version: '2017-03-12',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'qce/scf_v2',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: this.MetricName,
          'Dimensions.0.appid': localStorage.getItem('appid'),
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          this.tableData = []
          if (data.Response.Error == undefined) {
            data.Response.DataPoints[0].Values = this.GetX(data.Response.StartTime, data.Response.EndTime,
              data.Response.Period)
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
      GetX(startDate, endDate, space) {
        if (!endDate) {
          endDate = new Date();
        } else {
          endDate = new Date(endDate);
        }
        if (!startDate) {
          startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        } else {
          startDate = new Date(startDate);
        }
        if (!space) {
          space = 600 * 1000;
        } else {
          space = space * 1000;
        }
        var endTime = endDate.getTime();
        var startTime = startDate.getTime();
        var mod = endTime - startTime;
        var dateArray = [];
        // 加入结束时间
        var a = new Date();
        a.setTime(endTime);
        a = this.nowtime(a);
        dateArray.push(a);
        while (mod - space >= space) {
          var d = new Date();
          d.setTime(endTime - space);
          d = this.nowtime(d);
          dateArray.push(d);
          mod = mod - space;
          endTime = endTime - space;
        }
        // 加入开始时间
        var a = new Date();
        a.setTime(startTime);
        a = this.nowtime(a);
        dateArray.push(a);
        var xAxis = dateArray.reverse()
        return xAxis;
      },
      nowtime(dt) {
        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" +
            dt.getDate() :
            dt.getDate()) + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (dt
            .getMinutes() < 10 ? "0" +
            dt.getMinutes() : dt.getMinutes()) + ":" + (dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt
            .getSeconds()));
      },

      //获取top10列表
      _GetTop() {
        let parms = {
          Version: '2018-07-24',
          MetricName: "mem_duration",
          Region: 'ap-guangzhou',
          Namespace: "qce/scf_v2",
          Time: "2020-03-21 00:00:00",
          Period: 86400,
          Module: 'monitor',
          'Dimensions.0': JSON.stringify({
            appid: localStorage.getItem('appid')
          })
        }
        this.axios.post(TOP_LIST, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.TopArr = JSON.parse(data.Response.ObjList)
            console.log(this.TopArr)
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
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

    .top10 {
      margin-top: 50px;

      .title {
        font-weight: bold;
        display: flex;

        .shua {
          padding-left: 20px;
          color: #006eff;
          cursor: pointer;
        }
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
