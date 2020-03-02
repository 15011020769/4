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
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]'></echart-line>
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
        tableData: [], // 组合数据
        available: [
          'AccOuttraffic',
          'BaseCpuUsage',
          'Cpuloadavg15m',
          'Cpuloadavg5m',
          'CpuLoadavg',
          'CpuUsage',
          'DiskIoAwait',
          'DiskReadIops',
          'DiskReadTrafficNew',
          'DiskSvctm',
          'DiskUtil',
          'DiskWriteTrafficNew',
          'LanInpkg',
          'LanIntraffic',
          'LanOutpkg',
          'LanOuttraffic',
          'MemUsage',
          'MemUsed',
          'TcpCurrEstab',
          'WanInpkg',
          'WanIntraffic',
          'WanOutpkg',
          'WanOuttraffic'
        ], //可用指标
        disName: {
          'LanOuttraffic': '内网出带宽',
          'LanIntraffic': '内网入带宽',
          'LanOutpkg': '内网出包量',
          'LanInpkg': '内网入包量 ',
          'WanOuttraffic': '外网出带宽',
          'WanIntraffic': '外网入带宽 ',
          'AccOuttraffic': '外网出流量',
          'WanOutpkg': '外网出包量',
          'WanInpkg': '外网入包量',
          'CpuUsage': 'CPU使用率',
          'CpuLoadavg': 'CPU平均负载',
          'MemUsed': '内存使用量',
          'MemUsage': '内存利用率',
          'TcpCurrEstab': 'TCP连接数',
          'BaseCpuUsage': '基础CPU使用率',
          'Cpuloadavg15m': 'CPU平均负载',
          'Cpuloadavg5m': 'CPU平均负载',
          'DiskIoAwait': 'IO Await',
          'DiskReadIops': '读IOPS',
          'DiskReadTrafficNew': '读流量',
          'DiskSvctm': 'IO Svctm',
          'DiskUtil': 'IO %util',
          'DiskWriteTrafficNew': '写流量',
        },
        Company: {
          'LanOuttraffic': 'Mbps',
          'LanIntraffic': 'Mbps',
          'LanOutpkg': '个/s',
          'LanInpkg': '个/s ',
          'WanOuttraffic': 'Mbps',
          'WanIntraffic': 'Mbps ',
          'AccOuttraffic': '个/s',
          'WanOutpkg': '个/s',
          'WanInpkg': '个/s',
          'CpuUsage': '%',
          'CpuLoadavg': '',
          'MemUsed': 'MB',
          'MemUsage': '%',
          'TcpCurrEstab': '个',
          'BaseCpuUsage': '%',
          'Cpuloadavg15m': '',
          'Cpuloadavg5m': '',
          'DiskIoAwait': 'ms',
          'DiskReadIops': '个',
          'DiskReadTrafficNew': 'KB/s',
          'DiskSvctm': 'ms',
          'DiskUtil': 'ms',
          'DiskWriteTrafficNew': 'KB/s',
        },
        Tips: {
          'AccOuttraffic': '外网网卡的平均每秒出流量',
          'BaseCpuUsage': ' 基础CPU使用率通过宿主机采集上报，无须安装监控组件即可查看数据，子机高负载情况下仍可持续采集上报数据',
          'Cpuloadavg15m': '15分钟内CPU平均负载，取 /proc/loadavg 第三列数据（windows操作系统无此指标），依赖监控组件安装采集',
          'Cpuloadavg5m': ' 5分钟内CPU平均负载，取 /proc/loadavg 第二列数据（windows操作系统无此指标），依赖监控组件安装采集',
          'CpuLoadavg': '1分钟内CPU平均负载，取 /proc/loadavg 第一列数据（windows操作系统无此指标），依赖监控组件安装采集',
          'CpuUsage': 'CPU利用率是通过CVM子机内部监控组件采集上报，数据更加精准',
          'DiskIoAwait': ' 磁盘分区I/O平均每次操作的等待时间',
          'DiskReadIops': '磁盘分区平均每秒读次数',
          'DiskReadTrafficNew': '平均每秒从磁盘读到内存的数据量',
          'DiskSvctm': '磁盘分区平均每次I/O操作所花的时间',
          'DiskUtil': '磁盘分区有IO操作的时间与总时间的百分比',
          'DiskWriteTrafficNew': '平均每秒从内存写到磁盘的数据量',
          'LanInpkg': '内网网卡的平均每秒入包量',
          'LanIntraffic': '内网网卡的平均每秒入流量',
          'LanOutpkg': '内网网卡的平均每秒出包量',
          'LanOuttraffic': '内网网卡的平均每秒出流量',
          'MemUsage': '用户实际使用的内存量与总内存量之比，不包括缓冲区与系统缓存占用的内存',
          'MemUsed': ' 使用的内存量，不包括系统缓存和缓存区占用内存，依赖监控组件安装采集',
          'TcpCurrEstab': '处于 ESTABLISHED 状态的 TCP 连接数量，依赖监控组件安装采集',
          'WanInpkg': '外网平均每秒入包量',
          'WanIntraffic': '外网平均每秒入流量',
          'WanOutpkg': '外网平均每秒出包量',
          'WanOuttraffic': '外网平均每秒出流量，最小粒度数据为10秒总流量/10秒 计算得出'
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
          Namespace: 'QCE/CVM'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.MonitorData = []
            this.BaseListK = []
            this.BaseList.forEach(item => {
              this.available.forEach(element => {
                if (item.MetricName === element) {
                  if (item.Period.indexOf(Number(this.Period)) !== -1) {
                    this.BaseListK.push(item)
                    this._GetMonitorData(item.MetricName)
                  }
                }
              });

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
