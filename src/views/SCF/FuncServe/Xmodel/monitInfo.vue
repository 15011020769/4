<template>
  <div class="Monitor">
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
      v-on:switchData="GetDat" />
    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值
      </p>

    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class='span_1'>{{disName[scope.row.MetricName]}}</span>
              <span class='span_2'>{{Company[scope.row.MetricName]}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{Tips[scope.row.MetricName]}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </p>
          </template>
        </el-table-column>

        <el-table-column width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="period" :xdata="false"></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import moment from "moment";
  import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
  import echartLine from "@/components/public/echars-line";
  import {
    ALL_Basics,
    All_MONITOR
  } from '@/constants'
  export default {
    data() {
      return {
        TimeArr: [{
            name: '实时',
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
            name: '近24小时',
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
        functionName: this.$route.query.functionName,
        BaseList: [],
        Period: '', //粒度
        Time: {}, //监控传递时间
        tableData: [], // 获取列表数据
        disName: {
          'Duration': '运行时间',
          'Invocation': '调用次数',
          'Error': '调用错误次数',
          'ConcurrentExecutions': '并发执行次数',
          'ConfigMem': '配置内存',
          'FunctionErrorPercentage': '函数错误率',
          'Http2xx': '正确调用次数',
          'Http432': '资源超过限制',
          'Http433': '函数执行超时',
          'Http434': '内存超过限制',
          'Http4xx': '函数错误次数',
          'Invocation': '函数调用次数',
          'Mem': '运行内存',
          'MemDuration': '时间内存',
          'OutFlow': '外网出流量',
          'ServerErrorPercentage': '平台错误率',
          'Syserr': '系统内部错误次数',
          'Throttle': '函数运行受限次数'

        },
        Company: {
          'Duration': '毫秒(ms)',
          'Invocation': '次',
          'Error': '次',
          'ConcurrentExecutions': '次',
          'ConfigMem': 'MB',
          'FunctionErrorPercentage': '%',
          'Http2xx': '次',
          'Http432': '次',
          'Http433': '次',
          'Http434': '次',
          'Http4xx': '次',
          'Invocation': '次',
          'Mem': 'MB',
          'MemDuration': 'MB/ms',
          'OutFlow': '次',
          'ServerErrorPercentage': '%',
          'Syserr': '次',
          'Throttle': '次'
        },
        Tips: {
          'Duration': '函数运行时间，按粒度（1分鐘、5分鐘）统计求平均值',
          'Invocation': '函数调用次数，按粒度（1分鐘、5分鐘）统计求和',
          'Error': '调用错误次数',
          'ConcurrentExecutions': '并发执行次数',
          'ConfigMem': '配置内存',
          'FunctionErrorPercentage': '函数错误率',
          'Http2xx': '正确调用次数',
          'Http432': '资源超过限制',
          'Http433': '函数执行超时',
          'Http434': '内存超过限制',
          'Http4xx': '函数运行错误次数，按粒度（1分鐘、5分鐘）统计求和',
          'Invocation': '函数调用次数',
          'Mem': '运行内存',
          'MemDuration': '时间内存',
          'OutFlow': '外网出流量',
          'ServerErrorPercentage': '平台错误率',
          'Syserr': '系统内部错误次数',
          'Throttle': '函数运行受限次数'
        },

      }
    },
    components: {
      TimeDropDown,
      echartLine
    },
    methods: {
      GetDat(data) {
        this.Period = data[0]
        this.Time = data[1]
        this._GetBase()
      },
      //获取基础指标详情
      _GetBase() {
        this.tableData = [];
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.BaseList.forEach(item => {
              this._GetMonitorData(item.MetricName)
            });
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //获取监控数据
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'functionName',
          'Instances.0.Dimensions.0.Value': this.functionName,
          'Instances.0.Dimensions.1.Name': 'version',
          'Instances.0.Dimensions.1.Value': '$latest'
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.tableData.push(data.Response);
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
      UpTime(value) {
        let timeArr = [];
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
          timeArr.push(uptime);
        }
        return timeArr;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
    padding: 20px;

    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }

    .box-table {
      .span_1 {
        font-size: 14px;
        font-weight: bold;
        color: black;
      }

      .span_2 {
        font-size: 12px;
        color: #BBBBBB;
      }
    }
  }

</style>
