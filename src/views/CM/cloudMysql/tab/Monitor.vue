<template>
  <div class="Monitor">
    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    <div class="box-dis p-style">
      <p>
        <i class="el-icon-info"></i>{{ $t('CVM.clBload.zs') }}
      </p>
      <!-- <p>
        <el-button type="text">{{ $t('CVM.clBload.dcsj') }}</el-button>
      </p> -->
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop width="200" :empty-text="$t('CVM.clBload.zwsj')">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder;  color:#333;font-weight:600;">
              {{scope.row.MetricName | UpName(value)}}
              <span class="symbol">{{scope.row.symbol}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{scope.row.MetricName | UpName(value)}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="DataPoints" width="600">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{ $t('CVM.clBload.zwsj') }}</p>
            <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
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



        <el-table-column prop>
          <template slot-scope="scope">
            <!-- <p>
              <i class="el-icon-menu i-font" style="font-size:26px;" @click="Modality(scope.row.MetricName)"></i>
            </p> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog :title="$t('CVM.clBload.jqjkzt')" :visible.sync="dialogVisible" width="60%"
        :before-close="handleClose">
        <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        <echart-line id="diskEchearrts-line" class="echart-wh" :time="timeData | UpTime" :opData="jingData"
          :period="period" :xdata="true"></echart-line>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import XTimeX from "@/components/public/TimeXK";
  import echartLine from "@/components/public/echars-line";
  import {
    All_MONITOR
  } from "@/constants";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    data() {
      return {
        ID: this.$route.query.id,
        period: "",
        Start_End: [],
        value: 1,
        dialogVisible: false, // 模态框 （放大后的折线图）
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数
        totalPage: 0, // 表格数据数组长度
        tableData: [], // 获取列表数据
        timeData: [], // 折线图的x轴数据
        jingData: [],
        MetricName: ""
      };
    },
    components: {
      echartLine,
      XTimeX
    },
    created() {},
    methods: {
      //获取数据
      GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2];
        const metricNArr = [
          "CPUUseRate",
          "MemoryUseRate",
          "MemoryUse",
          "VolumeRate",
          "RealCapacity",
          "Capacity",
          "BytesSent",
          "BytesReceived",
          "QPS",
          "TPS",
          "MaxConnections",
          "ThreadsConnected",
          "ConnectionUseRate",
          "SlowQueries",
          "SelectScan",
          "SelectCount",
          "ComUpdate",
          "ComDelete",
          "ComInsert",
          "ComReplace",
          "Queries",
          "QueryRate",
          "CreatedTmpTables",
          "TableLocksWaited",
          "InnodbCacheUseRate",
          "InnodbCacheHitRate",
          "InnodbOsFileReads",
          "InnodbOsFileWrites",
          "InnodbOsFsyncs",
          "InnodbNumOpenFiles",
          "KeyCacheUseRate",
          "KeyCacheHitRate",
          "ComCommit",
          "ComRollback",
          "ThreadsCreated",
          "ThreadsRunning",
          "CreatedTmpDiskTables",
          "CreatedTmpFiles",
          "HandlerReadRndNext",
          "HandlerRollback",
          "HandlerCommit",
          "InnodbBufferPoolPagesFree",
          "InnodbBufferPoolPagesTotal",
          "InnodbBufferPoolReadRequests",
          "InnodbBufferPoolReads",
          "InnodbDataReads",
          "InnodbDataRead",
          "InnodbDataWrites",
          "InnodbDataWritten",
          "InnodbRowsDeleted",
          "InnodbRowsInserted",
          "InnodbRowsUpdated",
          "InnodbRowsRead",
          "InnodbRowLockTimeAvg",
          "InnodbRowLockWaits",
          "KeyBlocksUnused",
          "KeyBlocksUsed",
          "KeyReadRequests",
          "KeyReads",
          "KeyWriteRequests",
          "KeyWrites",
          "OpenedTables",
          "TableLocksImmediate",
          "OpenFiles",
          "LogCapacity",
          "SlaveIoRunning",
          "SlaveSqlRunning",
          "MasterSlaveSyncDistance",
          "SecondsBehindMaster"
        ];
        const symbol = [
          "%",
          "%",
          "MB",
          "%",
          "MB",
          "MB",
          "Byte/秒",
          "Byte/秒",
          "次/秒",
          "次/秒",
          "個",
          "個",
          "%",
          "次/分",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "%",
          "次/秒",
          "次/秒",
          "%",
          "%",
          "次/秒",
          "次/秒",
          "次/秒",
          "個",
          "%",
          "%",
          "次/秒",
          "次/秒",
          "個",
          "個",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "個",
          "個",
          "次/秒",
          "次/秒",
          "次/秒",
          "Byte/秒",
          "次/秒",
          "Byte/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "毫秒",
          "次/秒",
          "個",
          "個",
          "次/秒",
          "次/秒",
          "次/秒",
          "次/秒",
          "個",
          "個",
          "個",
          "MB",
          "-",
          "-",
          "MB",
          "秒"
        ];

        this.tableData = [];
        for (let i = 0; i < metricNArr.length; i++) {
          this.Obtain(metricNArr[i], symbol[i]);
        }

        if (this.MetricName) {
          this.getModality(this.MetricName);
        }
      },
      //
      Obtain(metricN, symbol) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/CDB",
          MetricName: metricN,
          "Instances.0.Dimensions.0.Name": "InstanceId",
          "Instances.0.Dimensions.0.Value": this.ID,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          if (data.Response.Error == undefined) {
            data.Response.symbol = symbol;
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
      getModality(MetricName) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/CVM",
          MetricName: MetricName,
          "Instances.0.Dimensions.0.Name": "InstanceId",
          "Instances.0.Dimensions.0.Value": this.ID,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          if (data.Response.Error == undefined) {
            this.timeData = data.Response.DataPoints[0].Timestamps;
            this.jingData = data.Response.DataPoints[0].Values;
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
      // 模态框
      Modality(MetricName) {
        this.MetricName = MetricName;
        // this.dialogVisible = true;
        this.getModality(this.MetricName);
      },
      handleClose(done) {
        done();
      }
    },
    filters: {
      //文字过滤
      UpName(value) {
        if (value === "CPUUseRate") {
          return (value = "CPU利用率");
        }
        if (value === "MemoryUseRate") {
          return (value = "内存利用率");
        }
        if (value === "MemoryUse") {
          return (value = "內存佔用");
        }
        if (value === "VolumeRate") {
          return (value = "磁碟使用率");
        }
        if (value === "RealCapacity") {
          return (value = "磁碟使用空間（僅包含數據空間使用量）");
        }
        if (value === "Capacity") {
          return (value = "	磁碟佔用空間（包含數據及日誌空間使用量）");
        }
        if (value === "BytesSent") {
          return (value = "内網出流量");
        }
        if (value === "BytesReceived") {
          return (value = "	内網入流量");
        }
        if (value === "QPS") {
          return (value = "每秒執行操作數");
        }
        if (value === "TPS") {
          return (value = "每秒執行事務數");
        }
        if (value === "MaxConnections") {
          return (value = "最大連接數");
        }
        if (value === "ThreadsConnected") {
          return (value = "當前打開連接數");
        }
        if (value === "ConnectionUseRate") {
          return (value = "連接數利用率");
        }
        if (value === "SlowQueries") {
          return (value = "慢查詢數");
        }
        if (value === "SelectScan") {
          return (value = "全表掃描數");
        }
        if (value === "SelectCount") {
          return (value = "查詢數");
        }
        if (value === "ComUpdate") {
          return (value = "更新數");
        }
        if (value === "ComDelete") {
          return (value = "刪除數");
        }
        if (value === "ComInsert") {
          return (value = "插入數");
        }
        if (value === "ComReplace") {
          return (value = "覆蓋數");
        }
        if (value === "Queries") {
          return (value = "總請求數");
        }
        if (value === "QueryRate") {
          return (value = "查詢使用率");
        }
        if (value === "CreatedTmpTables") {
          return (value = "臨時表數量");
        }
        if (value === "TableLocksWaited") {
          return (value = "等待表鎖次數");
        }
        if (value === "InnodbCacheUseRate") {
          return (value = "innodb緩存使用率");
        }
        if (value === "InnodbCacheHitRate") {
          return (value = "innodb緩存命中率");
        }
        if (value === "InnodbOsFileReads") {
          return (value = "innodb讀磁碟數量");
        }
        if (value === "InnodbOsFileWrites") {
          return (value = "innodb寫磁碟數量");
        }
        if (value === "InnodbOsFsyncs") {
          return (value = "innodb fsync數量");
        }
        if (value === "InnodbNumOpenFiles") {
          return (value = "當前InnoDB打開表的數量");
        }
        if (value === "KeyCacheUseRate") {
          return (value = "myisam緩存使用率");
        }
        if (value === "KeyCacheHitRate") {
          return (value = "myisam緩存命中率");
        }
        if (value === "ComCommit") {
          return (value = "提交數");
        }
        if (value === "ComRollback") {
          return (value = "回滾數");
        }
        if (value === "ThreadsCreated") {
          return (value = "已創建的線程數");
        }
        if (value === "ThreadsRunning") {
          return (value = "運行的線程數");
        }
        if (value === "CreatedTmpDiskTables") {
          return (value = "磁碟臨時表數量");
        }
        if (value === "CreatedTmpFiles") {
          return (value = "臨時文件數量");
        }
        if (value === "HandlerReadRndNext") {
          return (value = "讀下一行請求數");
        }
        if (value === "HandlerRollback") {
          return (value = "內部回滾數");
        }
        if (value === "HandlerCommit") {
          return (value = "內部提交數");
        }
        if (value === "InnodbBufferPoolPagesFree") {
          return (value = "InnoDB空頁數");
        }
        if (value === "InnodbBufferPoolPagesTotal") {
          return (value = "InnoDB總頁數");
        }
        if (value === "InnodbBufferPoolReadRequests") {
          return (value = "InnoDB邏輯讀");
        }
        if (value === "InnodbBufferPoolReads") {
          return (value = "InnoDB物理讀");
        }
        if (value === "InnodbDataReads") {
          return (value = "InnoDB總讀取量");
        }
        if (value === "InnodbDataRead") {
          return (value = "InnoDB讀取量");
        }
        if (value === "InnodbDataWrites") {
          return (value = "	InnoDB總寫入量");
        }
        if (value === "InnodbDataWritten") {
          return (value = "InnoDB寫入量");
        }
        if (value === "InnodbRowsDeleted") {
          return (value = "InnoDB行刪除量");
        }
        if (value === "InnodbRowsInserted") {
          return (value = "InnoDB行插入量");
        }
        if (value === "InnodbRowsUpdated") {
          return (value = "InnoDB行更新量");
        }
        if (value === "InnodbRowsRead") {
          return (value = "	InnoDB行讀取量");
        }
        if (value === "InnodbRowLockTimeAvg") {
          return (value = "InnoDB平均獲取行鎖時間");
        }
        if (value === "InnodbRowLockWaits") {
          return (value = "InnoDB等待行鎖次數");
        }
        if (value === "KeyBlocksUnused") {
          return (value = "鍵緩存內未使用的塊數量");
        }
        if (value === "KeyBlocksUsed") {
          return (value = "	鍵緩存內使用的塊數量");
        }
        if (value === "KeyReadRequests") {
          return (value = "鍵緩存讀取數據塊次數");
        }
        if (value === "KeyReads") {
          return (value = "硬碟讀取數據塊次數");
        }
        if (value === "KeyWriteRequests") {
          return (value = "數據塊寫入鍵緩衝次數");
        }
        if (value === "KeyWrites") {
          return (value = "數據塊寫入磁碟次數");
        }
        if (value === "OpenedTables") {
          return (value = "已經打開的表數");
        }
        if (value === "TableLocksImmediate") {
          return (value = "立即釋放的表鎖數");
        }
        if (value === "OpenFiles") {
          return (value = "打開文件總數");
        }
        if (value === "LogCapacity") {
          return (value = "日誌使用量");
        }
        if (value === "SlaveIoRunning") {
          return (value = "IO線程狀態");
        }
        if (value === "SlaveSqlRunning") {
          return (value = "SQL線程狀態");
        }
        if (value === "MasterSlaveSyncDistance") {
          return (value = "主從延遲距離");
        }
        if (value === "SecondsBehindMaster") {
          return (value = "SlaveSqlRunning");
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
    }
  };

</script>

<style scoped lang="scss">
  .symbol {
    color: #bbb;
  }

  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
  }

  .box-dis {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;

    .btn-style {
      margin-left: 20px;
      display: flex;
      line-height: 32px;

      .drop {
        margin-left: 30px;

        span {
          color: #cccccc;
          font-size: 10px;
        }

        ::v-deep.el-input {
          width: 100px !important;
          border: none;
        }
      }
    }

    p:nth-child(1) {
      color: #ccc;
      font-size: 14px;
      margin-left: 30px;
    }

    p:nth-child(2) {
      margin-right: 20px;
    }
  }

  .btn-sty {
    display: flex;
    justify-content: space-between;
  }

  .p-dis {
    display: flex;

    span {
      line-height: 40px;
    }

    .width-date {
      width: 150px;
      margin-left: 20px;
    }
  }

  .margin-row {
    margin-top: 30px;
    margin-left: 55%;
  }

  .dateheight {
    height: 34px;
  }

  ::v-deep.echart-wh {
    width: 100% !important;
    height: 500px !important;
  }

  .btn-style {
    margin-left: 20px;
    display: flex;
    line-height: 32px;

    .drop {
      margin-left: 500px;

      span {
        color: #cccccc;
        font-size: 10px;
      }

      ::v-deep.el-input {
        width: 100px !important;
        border: none;
      }
    }
  }

  .box-table {
    width: 100%;
  }

  ::v-deep.i-font {
    font-size: 36px;
  }

  ::v-deep.el-button--small {
    font-size: 14px !important;
  }

</style>
