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
            <p v-if="scope.row.DataPoints[0].Values.length==0">暫無數據</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]' :Company='Company[scope.row.MetricName]'></echart-line>
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
        ID: this.$route.query.id,
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        available: [{
            MetricName: 'StdReadRequests'
          },
          {
            MetricName: 'StdWriteRequests'
          },
          {
            MetricName: 'IaReadRequests'
          },
          {
            MetricName: 'IaWriteRequests'
          },
          {
            MetricName: 'NlReadRequests'
          },
          {
            MetricName: 'NlWriteRequests'
          },
          {
            MetricName: 'InboundTraffic'
          },
          {
            MetricName: 'InternalTraffic'
          },
          {
            MetricName: 'InternetTraffic'
          },
          {
            MetricName: 'CdnOriginTraffic'
          },
          {
            MetricName: '2xxResponse'
          },
          {
            MetricName: '3xxResponse'
          },
          {
            MetricName: '4xxResponse'
          },
          {
            MetricName: '5xxResponse'
          },
          {
            MetricName: 'StdRetrieval'
          },
          {
            MetricName: 'IaRetrieval'
          },
          {
            MetricName: 'NlRetrieval'
          },
          {
            MetricName: 'ArcStorage'
          },
          {
            MetricName: 'NelStorage'
          },
          {
            MetricName: 'SiaStorage'
          },
          {
            MetricName: 'StdStorage'
          },

        ], //可用指标
        disName: {
          'NelStorage': '近線儲存儲存空間',
          'SiaStorage': '低頻儲存儲存空間',
          'ArcStorage': '歸檔儲存儲存空間',
          'StdStorage': '標準儲存儲存空間',
          '2xxResponse': '2xx狀態碼',
          '3xxResponse': '3xx狀態碼',
          '4xxResponse': '4xx狀態碼',
          '5xxResponse': '5xx狀態碼',
          'CdnOriginTraffic': 'CDN回源流量',
          'IaReadRequests': '低頻儲存讀請求',
          'IaRetrieval': '低頻數據取回',
          'IaWriteRequests': '低頻儲存寫請求',
          'InboundTraffic': '上傳流量',
          'InternalTraffic': '內網流量',
          'InternetTraffic': '外網流量',
          'NlReadRequests': '近線儲存讀請求',
          'NlRetrieval': '近線數據取回',
          'NlWriteRequests': '近線儲存寫請求',
          'StdReadRequests': '標準儲存讀請求',
          'StdRetrieval': '標準數據讀取',
          'StdWriteRequests': '標準儲存寫請求',
        },
        Company: {
          'NelStorage': '次',
          'SiaStorage': '次',
          '2xxResponse': '次',
          '3xxResponse': '次',
          '4xxResponse': '次',
          '5xxResponse': '次',
          'CdnOriginTraffic': '次',
          'IaReadRequests': '次',
          'IaRetrieval': '次',
          'IaWriteRequests': '次',
          'InboundTraffic': '次',
          'InternalTraffic': '次',
          'InternetTraffic': '次',
          'NlReadRequests': '次',
          'NlRetrieval': '次',
          'NlWriteRequests': '次',
          'StdReadRequests': '次',
          'StdRetrieval': '次',
          'StdWriteRequests': '次',
          'StdStorage': '次',
          'ArcStorage': '次',
        },
        Tips: {
          'NelStorage': '近線儲存儲存空間',
          'SiaStorage': '低頻儲存儲存空間',
          'ArcStorage': '歸檔儲存儲存空間',
          'StdStorage': '標準儲存儲存空間',
          '2xxResponse': '2xx狀態碼',
          '3xxResponse': '3xx狀態碼',
          '4xxResponse': '4xx狀態碼',
          '5xxResponse': '5xx狀態碼',
          'CdnOriginTraffic': 'CDN回源流量',
          'IaReadRequests': '低頻儲存讀請求',
          'IaRetrieval': '低頻數據取回',
          'IaWriteRequests': '低頻儲存寫請求',
          'InboundTraffic': '上傳流量',
          'InternalTraffic': '內網流量',
          'InternetTraffic': '外網流量',
          'NlReadRequests': '近線儲存讀請求',
          'NlRetrieval': '近線數據取回',
          'NlWriteRequests': '近線儲存寫請求',
          'StdReadRequests': '標準儲存讀請求',
          'StdRetrieval': '標準數據讀取',
          'StdWriteRequests': '標準儲存寫請求',
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
              this.available.forEach(element => {
                if (item.MetricName === element.MetricName) {
                  element.data = item
                }
              });
            });
            this.available.forEach(i => {
              if (i.data.Period.indexOf(Number(this.Period)) !== -1) {
                this.BaseListK.push(i.data)
              }
            });
            for (let
                k = 0; k < this.BaseListK.length; k++) {
              let _this = this;
              (function (o) {
                setTimeout(() => {
                  _this._GetMonitorData(_this.BaseListK[o].MetricName)
                }, o * 1000);
              })(k)
            }
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
