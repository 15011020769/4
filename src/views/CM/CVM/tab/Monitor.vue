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
      <el-table :data="tableData1" style="width: 100%" v-loading='TableLoad'>
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
            name: '实时',
            Time: 'realTime',
            TimeGranularity: [{
                value: "10",
                label: "10秒"
              },
              {
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
        MonitorData1: [], //监控数据
        tableData: [], // 组合数据
        tableData1: [],
        available: [{
            MetricName: 'CpuUsage'
          },
          {
            MetricName: 'CpuLoadavg'
          },
          {
            MetricName: 'BaseCpuUsage'
          },
          {
            MetricName: 'MemUsed'
          },
          {
            MetricName: 'MemUsage'
          },
          {
            MetricName: 'LanOuttraffic'
          },
          {
            MetricName: 'LanIntraffic'
          },
          {
            MetricName: 'LanOutpkg'
          },
          {
            MetricName: 'LanInpkg'
          },
          {
            MetricName: 'TcpCurrEstab'
          },
          {
            MetricName: 'WanOuttraffic'
          },
          {
            MetricName: 'WanIntraffic'
          },
          {
            MetricName: 'WanOutpkg'
          },
          {
            MetricName: 'WanInpkg'
          },
          {
            MetricName: 'AccOuttraffic'
          },
        ], //可用指标
        available1: [{
            MetricName: 'DiskReadTraffic'
          }, {
            MetricName: 'DiskWriteTraffic'
          }, {
            MetricName: 'DiskReadIops'
          },
          {
            MetricName: 'DiskWriteIops'
          },
          {
            MetricName: 'DiskAwait'
          },
          {
            MetricName: 'DiskSvctm'
          },
          {
            MetricName: 'DiskUtil'
          },
        ],
        disName: {
          'LanOuttraffic': '內網出帶寬',
          'LanIntraffic': '內網入帶寬',
          'LanOutpkg': '內網出包量',
          'LanInpkg': '内網入包量 ',
          'WanOuttraffic': '外網出帶寬',
          'WanIntraffic': '外網入帶寬 ',
          'AccOuttraffic': '外網出流量',
          'WanOutpkg': '外網出包量',
          'WanInpkg': '外網入包量',
          'CpuUsage': 'CPU利用率',
          'CpuLoadavg': 'CPU平均負載',
          'MemUsed': '内存使用量',
          'MemUsage': '内存利用率',
          'TcpCurrEstab': 'TCP連接數',
          'BaseCpuUsage': '基礎CPU使用率',
          'DiskAwait': 'IO Await',
          'DiskReadIops': '讀IOPS',
          'DiskReadTraffic': '讀流量',
          'DiskSvctm': 'IO Svctm',
          'DiskUtil': 'IO %util',
          'DiskWriteIops': '寫IOPS',
          'DiskWriteTraffic': '寫流量'
        },
        Company: {
          'LanOuttraffic': 'Mbps',
          'LanIntraffic': 'Mbps',
          'LanOutpkg': '個/s',
          'LanInpkg': '個/s ',
          'WanOuttraffic': 'Mbps',
          'WanIntraffic': 'Mbps ',
          'AccOuttraffic': 'Mbps',
          'WanOutpkg': '個/s',
          'WanInpkg': '個/s',
          'CpuUsage': '%',
          'CpuLoadavg': '',
          'MemUsed': 'MB',
          'MemUsage': '%',
          'TcpCurrEstab': '個',
          'BaseCpuUsage': '%',
          'DiskIoAwait': 'ms',
          'DiskAwait': 'ms',
          'DiskReadIops': '個',
          'DiskReadTraffic': 'KB/s',
          'DiskSvctm': 'ms',
          'DiskUtil': '%',
          'DiskWriteIops': '個',
          'DiskWriteTraffic': 'KB/s'
        },
        Tips: {
          'AccOuttraffic': '外網網卡的平均每秒出流量',
          'BaseCpuUsage': ' 基礎CPU使用率通過宿主機採集上報，無須安裝監控組件即可查看數據，子機高負載情況下仍可持續採集上報數據',
          'CpuLoadavg': '1分钟内CPU平均负载，取 /proc/loadavg 第一列數據（windows操作系統無此指標），依賴監控組件安裝採集',
          'CpuUsage': 'CPU利用率是通過CVM子機內部監控組件採集上報，數據更加精準',
          'DiskIoAwait': ' 磁碟分區I/O平均每次操作的等待時間',
          'DiskSvctm': '磁碟分區平均每次I/O操作所花的時間',
          'DiskUtil': '磁碟分區有IO操作的時間與總時間的百分比',
          'DiskWriteTrafficNew': '平均每秒從內存寫到磁碟的數據量',
          'LanInpkg': '內網網卡的平均每秒入包量',
          'LanIntraffic': '內網網卡的平均每秒入流量',
          'LanOutpkg': '內網網卡的平均每秒出包量',
          'LanOuttraffic': '內網網卡的平均每秒出流量',
          'MemUsage': '用戶實際使用的內存量與總內存量之比，不包括緩衝區與系統緩存佔用的內存',
          'MemUsed': ' 使用的內存量，不包括系統緩存和緩存區佔用內存，依賴監控組件安裝採集',
          'TcpCurrEstab': '處於 ESTABLISHED 狀態的 TCP 連接數量，依賴監控組件安裝採集',
          'WanInpkg': '外網平均每秒入包量',
          'WanIntraffic': '外網平均每秒入流量',
          'WanOutpkg': '外網平均每秒出包量',
          'WanOuttraffic': '外網平均每秒出流量，最小粒度數據為10秒總流量/10秒 計算得出',
          'DiskAwait': '硬碟I / O平均每次操作的等待時間',
          'DiskReadIops': '硬碟平均每秒讀次數',
          'DiskReadTraffic': '平均每秒從硬碟讀到內存的數據量',
          'DiskWriteIops': '硬碟平均每秒寫次數',
          'DiskWriteTraffic': '平均每秒從內存寫到硬碟的數據量'
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
      },
      MonitorData1(val) {
        if (this.MonitorData1) {
          this.MonitorData1.forEach(element => {
            this.BaseListKd.forEach(item => {
              if (item.MetricName === element.MetricName) {
                item.DataPoints = element.DataPoints
              }
            });
          });
          if (this.BaseListKd.length == val.length) {
            this.tableData1 = this.BaseListKd
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
        this._GetBase1()
      },
      //获取基础指标详情
      _GetBase() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/CVM'
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
                }, o * 50);
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
          Namespace: 'QCE/CVM',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'InstanceId',
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
      //获取基础指标详情
      _GetBase1() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/BLOCK_STORAGE'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            let BaseList = res.Response.MetricSet
            this.MonitorData1 = []
            this.BaseListKd = []
            BaseList.forEach(item => {
              this.available1.forEach(element => {
                if (item.MetricName === element.MetricName) {
                  element.data = item
                }
              });
            });
            this.available1.forEach(i => {
              if (i.data.Period.indexOf(Number(this.Period)) !== -1) {
                this.BaseListKd.push(i.data)
              }
            });
            for (let
                k = 0; k < this.BaseListKd.length; k++) {
              let _this = this;
              (function (o) {
                setTimeout(() => {
                  _this._GetMonitorData1(_this.BaseListKd[o].MetricName)
                }, o * 50);
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
      _GetMonitorData1(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/BLOCK_STORAGE',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'diskId',
          'Instances.0.Dimensions.0.Value': this.$route.query.DiskId,
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.MonitorData1.push(data.Response);
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
