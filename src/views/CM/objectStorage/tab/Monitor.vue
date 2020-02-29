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
      <el-table :data="tableData" style="width: 100%" v-loading='TableLoad'>
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
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
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
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import {
    ErrorTips
  } from "@/components/ErrorTips";
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
        ID: this.$route.query.id,
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        disName: {
          '2xxResponse': '2xx状态码',
          '3xxResponse': '3xx状态码',
          '4xxResponse': '4xx状态码',
          '5xxResponse': '5xx状态码',
          'CdnOriginTraffic': 'CDN回源流量',
          'IaReadRequests': '低频存储读请求',
          'IaRetrieval': '低频数据取回',
          'IaWriteRequests': '低频存储写请求',
          'InboundTraffic': '上传流量',
          'InternalTraffic': '内网流量',
          'InternetTraffic': '外网流量',
          'MazIaReadRequests': '多AZ低频存储读请求',
          'MazIaWriteRequests': '多AZ低频存储写请求',
          'MazStdReadRequests': '多AZ标准存储读请求',
          'MazStdWriteRequests': '多AZ标准存储写请求',
          'NlReadRequests': '近线存储读请求',
          'NlRetrieval': '近线数据取回',
          'NlWriteRequests': '近线存储写请求',
          'StdReadRequests': '标准存储读请求',
          'StdRetrieval': '标准数据读取',
          'StdWriteRequests': '标准存储写请求',
        },
        Company: {
          '2xxResponse': '次数',
          '3xxResponse': '次数',
          '4xxResponse': '次数',
          '5xxResponse': '次数',
          'CdnOriginTraffic': '次数',
          'IaReadRequests': '次数',
          'IaRetrieval': '次数',
          'IaWriteRequests': '次数',
          'InboundTraffic': '次数',
          'InternalTraffic': '次数',
          'InternetTraffic': '次数',
          'MazIaReadRequests': '次数',
          'MazIaWriteRequests': '次数',
          'MazStdReadRequests': '次数',
          'MazStdWriteRequests': '次数',
          'NlReadRequests': '次数',
          'NlRetrieval': '次数',
          'NlWriteRequests': '次数',
          'StdReadRequests': '次数',
          'StdRetrieval': '次数',
          'StdWriteRequests': '次数',
        },
        Tips: {
          '2xxResponse': '2xx状态码',
          '3xxResponse': '3xx状态码',
          '4xxResponse': '4xx状态码',
          '5xxResponse': '5xx状态码',
          'CdnOriginTraffic': 'CDN回源流量',
          'IaReadRequests': '低频存储读请求',
          'IaRetrieval': '低频数据取回',
          'IaWriteRequests': '低频存储写请求',
          'InboundTraffic': '上传流量',
          'InternalTraffic': '内网流量',
          'InternetTraffic': '外网流量',
          'MazIaReadRequests': '多AZ低频存储读请求',
          'MazIaWriteRequests': '多AZ低频存储写请求',
          'MazStdReadRequests': '多AZ标准存储读请求',
          'MazStdWriteRequests': '多AZ标准存储写请求',
          'NlReadRequests': '近线存储读请求',
          'NlRetrieval': '近线数据取回',
          'NlWriteRequests': '近线存储写请求',
          'StdReadRequests': '标准存储读请求',
          'StdRetrieval': '标准数据读取',
          'StdWriteRequests': '标准存储写请求',
        },

      }
    },
    components: {
      TimeDropDown,
      echartLine
    },
    watch: {
      MonitorData(val) {
        if (this.MonitorData) {
          this.MonitorData.forEach(element => {
            this.BaseListK.forEach(item => {
              if (item.MetricName === element.MetricName) {
                item.DataPoints = element.DataPoints
              }
            });
          });
          if (this.BaseListK.length == val.length) {
            this.tableData = this.BaseListK
            this.TableLoad = false
          }
        }
      }
    },
    methods: {
      GetDat(data) {
        this.Period = data[0]
        this.Time = data[1]
        this.TableLoad = true
        this._GetBase()
      },
      //获取基础指标详情
      _GetBase() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/COS'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.MonitorData = []
            this.BaseListK = []
            this.BaseList.forEach(item => {
              if (item.Period.indexOf(Number(this.Period)) !== -1) {
                console.log(item.MetricName, item.Meaning.Zh)
                this.BaseListK.push(item)
                this._GetMonitorData(item.MetricName)
              }
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
          Namespace: 'QCE/COS',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'bucket',
          'Instances.0.Dimensions.0.Value': this.ID,
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.MonitorData.push(data.Response);
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
