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
  import TimeDropDown from '@/components/public/TimeDropDown' //引入時間元件
  import echartLine from "@/components/public/echars-line"; //引入圖標元件
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
                value: "5",
                label: "5秒"
              }, {
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
        BaseList: [], //全部指標列表
        BaseListK: [], //用到的指標列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //監控傳遞時間
        MonitorData: [], //監控數據
        tableData: [], // 組合數據
        available: [{
            MetricName: 'SlowQueries'
          },
          {
            MetricName: 'ConnectionUseRate'
          }, {
            MetricName: 'MaxConnections'
          }, {
            MetricName: 'SelectScan'
          }, {
            MetricName: 'SelectCount'
          }, {
            MetricName: 'ComUpdate'
          }, {
            MetricName: 'ComDelete'
          }, {
            MetricName: 'ComInsert'
          }, {
            MetricName: 'ComReplace'
          }, {
            MetricName: 'Queries'
          }, {
            MetricName: 'ThreadsConnected'
          }, {
            MetricName: 'RealCapacity'
          }, {
            MetricName: 'Capacity'
          }, {
            MetricName: 'BytesSent'
          }, {
            MetricName: 'BytesReceived'
          }, {
            MetricName: 'QcacheUseRate'
          }, {
            MetricName: 'QcacheHitRate'
          }, {
            MetricName: 'TableLocksWaited'
          }, {
            MetricName: 'CreatedTmpTables'
          }, {
            MetricName: 'InnodbCacheUseRate'
          }, {
            MetricName: 'InnodbCacheHitRate'
          }, {
            MetricName: 'InnodbOsFileReads'
          }, {
            MetricName: 'InnodbOsFileWrites'
          }, {
            MetricName: 'InnodbOsFsyncs'
          }, {
            MetricName: 'KeyCacheUseRate'
          }, {
            MetricName: 'KeyCacheHitRate'
          }, {
            MetricName: 'VolumeRate'
          }, {
            MetricName: 'QueryRate'
          }, {
            MetricName: 'Qps'
          }, {
            MetricName: 'Tps'
          }, {
            MetricName: 'CpuUseRate'
          }, {
            MetricName: 'MemoryUseRate'
          }
        ],
        disName: {
          'BytesReceived': '內網入流量',
          'BytesSent': '內網出流量',
          'Capacity': '磁盤占用空間',
          'ComCommit': '提交數',
          'ComDelete': '刪除數',
          'ComInsert': '插入數',
          'ComReplace': '涵蓋數',
          'ComRollback': '回滾數',
          'ComUpdate': '更新數',
          'ConnectionUseRate': '連接數利用率',
          'CpuUseRate': 'CPU利用率',
          'CreatedTmpDiskTables': '磁盤臨時表數量',
          'CreatedTmpFiles': '臨時文件數量',
          'CreatedTmpTables': '臨時表數量',
          'HandlerCommit': '內部提交數',
          'HandlerReadRndNext': '讀下壹行請求數',
          'HandlerRollback': '內部回滾數',
          'InnodbBufferPoolPagesFree': 'InnoDB空頁數',
          'InnodbBufferPoolPagesTotal': 'InnoDB總頁數',
          'InnodbBufferPoolReads': 'InnoDB物理讀',
          'InnodbBufferPoolReadRequests': 'InnoDB邏輯讀',
          'InnodbCacheHitRate': 'innodb快取命中率',
          'InnodbCacheUseRate': 'innodb快取使用率',
          'InnodbDataRead': 'InnoDB讀取量',
          'InnodbDataReads': 'InnoDB總讀取量',
          'InnodbDataWrites': 'InnoDB總寫入量',
          'InnodbDataWritten': 'InnoDB寫入量',
          'InnodbNumOpenFiles': '當前InnoDB打開表的數量',
          'InnodbOsFileReads': 'innodb讀磁盤數量',
          'InnodbOsFileWrites': 'innodb寫磁盤數量',
          'InnodbOsFsyncs': 'innodb fsync數量',
          'InnodbRowsDeleted': 'InnoDB行刪除量',
          'InnodbRowsInserted': 'InnoDB行插入量',
          'InnodbRowsRead': 'InnoDB行讀取量',
          'InnodbRowsUpdated': 'InnoDB行更新量',
          'InnodbRowLockTimeAvg': 'InnoDB平均獲取行鎖時間',
          'InnodbRowLockWaits': 'InnoDB等待行鎖次數',
          'KeyBlocksUnused': '鍵快取內未使用的塊數量',
          'KeyBlocksUsed': '鍵快取內使用的塊數量',
          'KeyCacheHitRate': 'myisam快取命中率',
          'KeyCacheUseRate': 'myisam快取使用率',
          'KeyReads': '硬碟讀取數據塊次數',
          'KeyReadRequests': '鍵快取讀取數據塊次數',
          'KeyWrites': '數據塊寫入磁盤次數',
          'KeyWriteRequests': '數據塊寫入鍵緩沖次數',
          'LogCapacity': '日志使用量',
          'MasterSlaveSyncDistance': '主從延遲距離',
          'MaxConnections': '最大連接數',
          'MemoryUse': '記憶體占用',
          'MemoryUseRate': '記憶體利用率',
          'OpenedTables': '已經打開的表數',
          'OpenFiles': '打開文件總數',
          'QcacheFreeBlocks': '查詢快取空閑塊',
          'QcacheFreeMemory': '快取中空閑記憶體量',
          'QcacheHits': '快取命中次數',
          'QcacheHitRate': '快取命中率',
          'QcacheInserts': '快取寫入次數',
          'QcacheLowmemPrunes': '因記憶體不足刪除快取次數',
          'QcacheNotCached': '查詢未被快取次數',
          'QcacheQueriesInCache': '以注冊到快取內的查詢數',
          'QcacheTotalBlocks': '查詢快取內的總塊數',
          'QcacheUseRate': '快取使用率',
          'Qps': '每秒執行操作數',
          'Queries': '總請求數',
          'QueryRate': '查詢使用率',
          'RealCapacity': '磁盤使用空間',
          'SecondsBehindMaster': '主從延遲時間',
          'SelectCount': '查詢數',
          'SelectScan': '全表掃描數',
          'SlaveIoRunning': 'IO執行緒狀態',
          'SlaveSqlRunning': 'SQL執行緒狀態',
          'SlowQueries': '慢查詢數',
          'TableLocksImmediate': '立即釋放的表鎖數',
          'TableLocksWaited': '等待表鎖次數',
          'ThreadsConnected': '當前打開連接數',
          'ThreadsCreated': '已創建的執行緒數',
          'ThreadsRunning': '運行的執行緒數',
          'Tps': '每秒執行事務數',
          'VolumeRate': '磁盤利用率',
        },
        Company: {
          'BytesReceived': 'Byte/秒',
          'BytesSent': 'Byte/秒',
          'Capacity': 'MB',
          'ComCommit': '次/秒',
          'ComDelete': '次/秒',
          'ComInsert': '次/秒',
          'ComReplace': '次/秒',
          'ComRollback': '次/秒',
          'ComUpdate': '次/秒',
          'ConnectionUseRate': '%',
          'CpuUseRate': '%',
          'CreatedTmpDiskTables': '次/秒',
          'CreatedTmpFiles': '次/秒',
          'CreatedTmpTables': '次/秒',
          'HandlerCommit': '次/秒',
          'HandlerReadRndNext': '次/秒',
          'HandlerRollback': '次/秒',
          'InnodbBufferPoolPagesFree': '個',
          'InnodbBufferPoolPagesTotal': '個',
          'InnodbBufferPoolReads': '次/秒',
          'InnodbBufferPoolReadRequests': '次/秒',
          'InnodbCacheHitRate': '%',
          'InnodbCacheUseRate': '%',
          'InnodbDataRead': 'Byte/秒',
          'InnodbDataReads': '次/秒',
          'InnodbDataWrites': '次/秒',
          'InnodbDataWritten': 'Byte/秒',
          'InnodbNumOpenFiles': '個',
          'InnodbOsFileReads': '次/秒',
          'InnodbOsFileWrites': '次/秒',
          'InnodbOsFsyncs': '次/秒',
          'InnodbRowsDeleted': '次/秒',
          'InnodbRowsInserted': '次/秒',
          'InnodbRowsRead': '次/秒',
          'InnodbRowsUpdated': '次/秒',
          'InnodbRowLockTimeAvg': '毫秒',
          'InnodbRowLockWaits': '次/秒',
          'KeyBlocksUnused': '個',
          'KeyBlocksUsed': '個',
          'KeyCacheHitRate': '%',
          'KeyCacheUseRate': '%',
          'KeyReads': '次/秒',
          'KeyReadRequests': '次/秒',
          'KeyWrites': '次/秒',
          'KeyWriteRequests': '次/秒',
          'LogCapacity': 'MB',
          'MasterSlaveSyncDistance': 'MB',
          'MaxConnections': '個',
          'MemoryUse': 'MB',
          'MemoryUseRate': '%',
          'OpenedTables': '個',
          'OpenFiles': '個',
          'QcacheFreeBlocks': '塊',
          'QcacheFreeMemory': 'MB',
          'QcacheHits': '次/秒',
          'QcacheHitRate': '%',
          'QcacheInserts': '次/秒',
          'QcacheLowmemPrunes': '次/秒',
          'QcacheNotCached': '次/秒',
          'QcacheQueriesInCache': '次/秒',
          'QcacheTotalBlocks': '塊',
          'QcacheUseRate': '%',
          'Qps': '次/秒',
          'Queries': '次/秒',
          'QueryRate': '%',
          'RealCapacity': 'MB',
          'SecondsBehindMaster': '秒',
          'SelectCount': '次/秒',
          'SelectScan': '次/秒 ',
          'SlaveIoRunning': '',
          'SlaveSqlRunning': '',
          'SlowQueries': '次/分',
          'TableLocksImmediate': '個',
          'TableLocksWaited': '次/秒',
          'ThreadsConnected': '個',
          'ThreadsCreated': '個',
          'ThreadsRunning': '個',
          'Tps': '次/秒',
          'VolumeRate': '%',
        },
        Tips: {
          'BytesReceived': '內網入流量',
          'BytesSent': '內網出流量',
          'Capacity': '磁盤占用空間（包含數據及日志空間使用量）',
          'ComCommit': '提交數',
          'ComDelete': '刪除數',
          'ComInsert': '插入數',
          'ComReplace': '涵蓋數',
          'ComRollback': '回滾數',
          'ComUpdate': '更新數',
          'ConnectionUseRate': '連接數利用率',
          'CpuUseRate': 'CPU利用率',
          'CreatedTmpDiskTables': '磁盤臨時表數量',
          'CreatedTmpFiles': '臨時文件數量',
          'CreatedTmpTables': '臨時表數量',
          'HandlerCommit': '內部提交數',
          'HandlerReadRndNext': '讀下壹行請求數',
          'HandlerRollback': '內部回滾數',
          'InnodbBufferPoolPagesFree': 'InnoDB空頁數',
          'InnodbBufferPoolPagesTotal': 'InnoDB總頁數',
          'InnodbBufferPoolReads': 'InnoDB物理讀',
          'InnodbBufferPoolReadRequests': 'InnoDB邏輯讀',
          'InnodbCacheHitRate': 'innodb快取命中率',
          'InnodbCacheUseRate': 'innodb快取使用率',
          'InnodbDataRead': 'InnoDB讀取量',
          'InnodbDataReads': 'InnoDB總讀取量',
          'InnodbDataWrites': 'InnoDB總寫入量',
          'InnodbDataWritten': 'InnoDB寫入量',
          'InnodbNumOpenFiles': '當前InnoDB打開表的數量',
          'InnodbOsFileReads': 'innodb讀磁盤數量',
          'InnodbOsFileWrites': 'innodb寫磁盤數量',
          'InnodbOsFsyncs': 'innodb fsync數量',
          'InnodbRowsDeleted': 'InnoDB行刪除量',
          'InnodbRowsInserted': 'InnoDB行插入量',
          'InnodbRowsRead': 'InnoDB行讀取量',
          'InnodbRowsUpdated': 'InnoDB行更新量',
          'InnodbRowLockTimeAvg': 'InnoDB平均獲取行鎖時間',
          'InnodbRowLockWaits': 'InnoDB等待行鎖次數',
          'KeyBlocksUnused': '鍵快取內未使用的塊數量',
          'KeyBlocksUsed': '鍵快取內使用的塊數量',
          'KeyCacheHitRate': 'myisam快取命中率',
          'KeyCacheUseRate': 'myisam快取使用率',
          'KeyReads': '硬碟讀取數據塊次數',
          'KeyReadRequests': '鍵快取讀取數據塊次數',
          'KeyWrites': '數據塊寫入磁盤次數',
          'KeyWriteRequests': '數據塊寫入鍵緩沖次數',
          'LogCapacity': '日志使用量',
          'MasterSlaveSyncDistance': '主從延遲距離',
          'MaxConnections': '最大連接數',
          'MemoryUse': '記憶體占用',
          'MemoryUseRate': '記憶體利用率',
          'OpenedTables': '已經打開的表數',
          'OpenFiles': '打開文件總數',
          'QcacheFreeBlocks': '查詢快取空閑塊',
          'QcacheFreeMemory': '快取中空閑記憶體量',
          'QcacheHits': '快取命中次數',
          'QcacheHitRate': '查詢快取命中率',
          'QcacheInserts': '快取寫入次數',
          'QcacheLowmemPrunes': '因記憶體不足刪除快取次數',
          'QcacheNotCached': '查詢未被快取次數',
          'QcacheQueriesInCache': '以注冊到快取內的查詢數',
          'QcacheTotalBlocks': '查詢快取內的總塊數',
          'QcacheUseRate': '查詢快取使用率',
          'Qps': '每秒執行操作數',
          'Queries': '總請求數',
          'QueryRate': '查詢使用率',
          'RealCapacity': '磁盤使用空間（僅包含數據空間使用量）',
          'SecondsBehindMaster': '主從延遲時間',
          'SelectCount': '查詢數',
          'SelectScan': '全表掃描數',
          'SlaveIoRunning': 'IO執行緒狀態',
          'SlaveSqlRunning': 'SQL執行緒狀態',
          'SlowQueries': '慢查詢數',
          'TableLocksImmediate': '立即釋放的表鎖數',
          'TableLocksWaited': '等待表鎖次數',
          'ThreadsConnected': '當前打開連接數',
          'ThreadsCreated': '已創建的執行緒數',
          'ThreadsRunning': '運行的執行緒數',
          'Tps': '每秒執行事務數',
          'VolumeRate': '磁盤利用率',
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
      Initialization() {

      },
      //獲取基礎指標詳情
      _GetBase() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/CDB'
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
      //獲取監控數據
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/CDB',
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
