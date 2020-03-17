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
          'BytesReceived': '内网入流量',
          'BytesSent': '内网出流量',
          'Capacity': '磁盘占用空间',
          'ComCommit': '提交数',
          'ComDelete': '删除数',
          'ComInsert': '插入数',
          'ComReplace': '覆盖数',
          'ComRollback': '回滚数',
          'ComUpdate': '更新数',
          'ConnectionUseRate': '连接数利用率',
          'CpuUseRate': 'CPU利用率',
          'CreatedTmpDiskTables': '磁盘临时表数量',
          'CreatedTmpFiles': '临时文件数量',
          'CreatedTmpTables': '临时表数量',
          'HandlerCommit': '内部提交数',
          'HandlerReadRndNext': '读下一行请求数',
          'HandlerRollback': '内部回滚数',
          'InnodbBufferPoolPagesFree': 'InnoDB空页数',
          'InnodbBufferPoolPagesTotal': 'InnoDB总页数',
          'InnodbBufferPoolReads': 'InnoDB物理读',
          'InnodbBufferPoolReadRequests': 'InnoDB逻辑读',
          'InnodbCacheHitRate': 'innodb缓存命中率',
          'InnodbCacheUseRate': 'innodb缓存使用率',
          'InnodbDataRead': 'InnoDB读取量',
          'InnodbDataReads': 'InnoDB总读取量',
          'InnodbDataWrites': 'InnoDB总写入量',
          'InnodbDataWritten': 'InnoDB写入量',
          'InnodbNumOpenFiles': '当前InnoDB打开表的数量',
          'InnodbOsFileReads': 'innodb读磁盘数量',
          'InnodbOsFileWrites': 'innodb写磁盘数量',
          'InnodbOsFsyncs': 'innodb fsync数量',
          'InnodbRowsDeleted': 'InnoDB行删除量',
          'InnodbRowsInserted': 'InnoDB行插入量',
          'InnodbRowsRead': 'InnoDB行读取量',
          'InnodbRowsUpdated': 'InnoDB行更新量',
          'InnodbRowLockTimeAvg': 'InnoDB平均获取行锁时间',
          'InnodbRowLockWaits': 'InnoDB等待行锁次数',
          'KeyBlocksUnused': '键缓存内未使用的块数量',
          'KeyBlocksUsed': '键缓存内使用的块数量',
          'KeyCacheHitRate': 'myisam缓存命中率',
          'KeyCacheUseRate': 'myisam缓存使用率',
          'KeyReads': '硬盘读取数据块次数',
          'KeyReadRequests': '键缓存读取数据块次数',
          'KeyWrites': '数据块写入磁盘次数',
          'KeyWriteRequests': '数据块写入键缓冲次数',
          'LogCapacity': '日志使用量',
          'MasterSlaveSyncDistance': '主从延迟距离',
          'MaxConnections': '最大连接数',
          'MemoryUse': '内存占用',
          'MemoryUseRate': '内存利用率',
          'OpenedTables': '已经打开的表数',
          'OpenFiles': '打开文件总数',
          'QcacheFreeBlocks': '查询缓存空闲块',
          'QcacheFreeMemory': '缓存中空闲内存量',
          'QcacheHits': '缓存命中次数',
          'QcacheHitRate': '查询缓存命中率',
          'QcacheInserts': '缓存写入次数',
          'QcacheLowmemPrunes': '因内存不足删除缓存次数',
          'QcacheNotCached': '查询未被缓存次数',
          'QcacheQueriesInCache': '以注册到缓存内的查询数',
          'QcacheTotalBlocks': '查询缓存内的总块数',
          'QcacheUseRate': '查询缓存使用率',
          'Qps': '每秒执行操作数',
          'Queries': '总请求数',
          'QueryRate': '查询使用率',
          'RealCapacity': '磁盘使用空间',
          'SecondsBehindMaster': '主从延迟时间',
          'SelectCount': '查询数',
          'SelectScan': '全表扫描数',
          'SlaveIoRunning': 'IO线程状态',
          'SlaveSqlRunning': 'SQL线程状态',
          'SlowQueries': '慢查询数',
          'TableLocksImmediate': '立即释放的表锁数',
          'TableLocksWaited': '等待表锁次数',
          'ThreadsConnected': '当前打开连接数',
          'ThreadsCreated': '已创建的线程数',
          'ThreadsRunning': '运行的线程数',
          'Tps': '每秒执行事务数',
          'VolumeRate': '磁盘使用率',
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
          'InnodbBufferPoolPagesFree': '个',
          'InnodbBufferPoolPagesTotal': '个',
          'InnodbBufferPoolReads': '次/秒',
          'InnodbBufferPoolReadRequests': '次/秒',
          'InnodbCacheHitRate': '%',
          'InnodbCacheUseRate': '%',
          'InnodbDataRead': 'Byte/秒',
          'InnodbDataReads': '次/秒',
          'InnodbDataWrites': '次/秒',
          'InnodbDataWritten': 'Byte/秒',
          'InnodbNumOpenFiles': '个',
          'InnodbOsFileReads': '次/秒',
          'InnodbOsFileWrites': '次/秒',
          'InnodbOsFsyncs': '次/秒',
          'InnodbRowsDeleted': '次/秒',
          'InnodbRowsInserted': '次/秒',
          'InnodbRowsRead': '次/秒',
          'InnodbRowsUpdated': '次/秒',
          'InnodbRowLockTimeAvg': '毫秒',
          'InnodbRowLockWaits': '次/秒',
          'KeyBlocksUnused': '个',
          'KeyBlocksUsed': '个',
          'KeyCacheHitRate': '%',
          'KeyCacheUseRate': '%',
          'KeyReads': '次/秒',
          'KeyReadRequests': '次/秒',
          'KeyWrites': '次/秒',
          'KeyWriteRequests': '次/秒',
          'LogCapacity': 'MB',
          'MasterSlaveSyncDistance': 'MB',
          'MaxConnections': '个',
          'MemoryUse': 'MB',
          'MemoryUseRate': '%',
          'OpenedTables': '个',
          'OpenFiles': '个',
          'QcacheFreeBlocks': '块',
          'QcacheFreeMemory': 'MB',
          'QcacheHits': '次/秒',
          'QcacheHitRate': '%',
          'QcacheInserts': '次/秒',
          'QcacheLowmemPrunes': '次/秒',
          'QcacheNotCached': '次/秒',
          'QcacheQueriesInCache': '次/秒',
          'QcacheTotalBlocks': '块',
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
          'TableLocksImmediate': '个',
          'TableLocksWaited': '次/秒',
          'ThreadsConnected': '个',
          'ThreadsCreated': '个',
          'ThreadsRunning': '个',
          'Tps': '次/秒',
          'VolumeRate': '%',
        },
        Tips: {
          'BytesReceived': '内网入流量',
          'BytesSent': '内网出流量',
          'Capacity': '磁盘占用空间（包含数据及日志空间使用量）',
          'ComCommit': '提交数',
          'ComDelete': '删除数',
          'ComInsert': '插入数',
          'ComReplace': '覆盖数',
          'ComRollback': '回滚数',
          'ComUpdate': '更新数',
          'ConnectionUseRate': '连接数利用率',
          'CpuUseRate': 'CPU利用率',
          'CreatedTmpDiskTables': '磁盘临时表数量',
          'CreatedTmpFiles': '临时文件数量',
          'CreatedTmpTables': '临时表数量',
          'HandlerCommit': '内部提交数',
          'HandlerReadRndNext': '读下一行请求数',
          'HandlerRollback': '内部回滚数',
          'InnodbBufferPoolPagesFree': 'InnoDB空页数',
          'InnodbBufferPoolPagesTotal': 'InnoDB总页数',
          'InnodbBufferPoolReads': 'InnoDB物理读',
          'InnodbBufferPoolReadRequests': 'InnoDB逻辑读',
          'InnodbCacheHitRate': 'innodb缓存命中率',
          'InnodbCacheUseRate': 'innodb缓存使用率',
          'InnodbDataRead': 'InnoDB读取量',
          'InnodbDataReads': 'InnoDB总读取量',
          'InnodbDataWrites': 'InnoDB总写入量',
          'InnodbDataWritten': 'InnoDB写入量',
          'InnodbNumOpenFiles': '当前InnoDB打开表的数量',
          'InnodbOsFileReads': 'innodb读磁盘数量',
          'InnodbOsFileWrites': 'innodb写磁盘数量',
          'InnodbOsFsyncs': 'innodb fsync数量',
          'InnodbRowsDeleted': 'InnoDB行删除量',
          'InnodbRowsInserted': 'InnoDB行插入量',
          'InnodbRowsRead': 'InnoDB行读取量',
          'InnodbRowsUpdated': 'InnoDB行更新量',
          'InnodbRowLockTimeAvg': 'InnoDB平均获取行锁时间',
          'InnodbRowLockWaits': 'InnoDB等待行锁次数',
          'KeyBlocksUnused': '键缓存内未使用的块数量',
          'KeyBlocksUsed': '键缓存内使用的块数量',
          'KeyCacheHitRate': 'myisam缓存命中率',
          'KeyCacheUseRate': 'myisam缓存使用率',
          'KeyReads': '硬盘读取数据块次数',
          'KeyReadRequests': '键缓存读取数据块次数',
          'KeyWrites': '数据块写入磁盘次数',
          'KeyWriteRequests': '数据块写入键缓冲次数',
          'LogCapacity': '日志使用量',
          'MasterSlaveSyncDistance': '主从延迟距离',
          'MaxConnections': '最大连接数',
          'MemoryUse': '内存占用',
          'MemoryUseRate': '内存利用率',
          'OpenedTables': '已经打开的表数',
          'OpenFiles': '打开文件总数',
          'QcacheFreeBlocks': '查询缓存空闲块',
          'QcacheFreeMemory': '缓存中空闲内存量',
          'QcacheHits': '缓存命中次数',
          'QcacheHitRate': '查询缓存命中率',
          'QcacheInserts': '缓存写入次数',
          'QcacheLowmemPrunes': '因内存不足删除缓存次数',
          'QcacheNotCached': '查询未被缓存次数',
          'QcacheQueriesInCache': '以注册到缓存内的查询数',
          'QcacheTotalBlocks': '查询缓存内的总块数',
          'QcacheUseRate': '查询缓存使用率',
          'Qps': '每秒执行操作数',
          'Queries': '总请求数',
          'QueryRate': '查询使用率',
          'RealCapacity': '磁盘使用空间（仅包含数据空间使用量）',
          'SecondsBehindMaster': '主从延迟时间',
          'SelectCount': '查询数',
          'SelectScan': '全表扫描数',
          'SlaveIoRunning': 'IO线程状态',
          'SlaveSqlRunning': 'SQL线程状态',
          'SlowQueries': '慢查询数',
          'TableLocksImmediate': '立即释放的表锁数',
          'TableLocksWaited': '等待表锁次数',
          'ThreadsConnected': '当前打开连接数',
          'ThreadsCreated': '已创建的线程数',
          'ThreadsRunning': '运行的线程数',
          'Tps': '每秒执行事务数',
          'VolumeRate': '磁盘使用率',
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
          Namespace: 'QCE/CDB'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.MonitorData = []
            this.BaseListK = []
            this.BaseList.forEach(item => {
              if (item.Period.indexOf(Number(this.Period)) !== -1) {
                this.BaseListK.push(item)
                setTimeout(() => {
                  this._GetMonitorData(item.MetricName)
                }, 500);
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
