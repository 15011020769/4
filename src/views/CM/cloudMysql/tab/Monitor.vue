<template>
  <div class="Monitor">
    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    <div class="box-dis p-style">
      <p>
        <i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值
      </p>
      <p>
        <el-button type="text">导出数据</el-button>
      </p>
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop width="200">
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
            <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
            <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line
                id="diskEchearrts-line"
                :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values"
                :scale="3"
                :period="period"
                :xdata="false"
              ></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb">Max:</p>
            <span>{{scope.row.DataPoints[0].Values|CMMax}}</span>
            <span>{{scope.row.symbol}}</span>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb">Min:</p>
            <span>{{scope.row.DataPoints[0].Values|CMMin}}</span>
            <span>{{scope.row.symbol}}</span>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb">Avg:</p>
            <span>{{scope.row.DataPoints[0].Values|CMAvg}}</span>
            <span>{{scope.row.symbol}}</span>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p>
              <i
                class="el-icon-menu i-font"
                style="font-size:26px;"
                @click="Modality(scope.row.MetricName)"
              ></i>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog
        title="集群健康状态"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        <echart-line
          id="diskEchearrts-line"
          class="echart-wh"
          :time="timeData | UpTime"
          :opData="jingData"
          :period="period"
          :xdata="true"
        ></echart-line>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import XTimeX from "@/components/public/TimeXK";
import echartLine from "@/components/public/echars-line";
import { All_MONITOR } from "@/constants";
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
        "个",
        "个",
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
        "个",
        "%",
        "%",
        "次/秒",
        "次/秒",
        "个",
        "个",
        "次/秒",
        "次/秒",
        "次/秒",
        "次/秒",
        "次/秒",
        "个",
        "个",
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
        "个",
        "个",
        "次/秒",
        "次/秒",
        "次/秒",
        "次/秒",
        "个",
        "个",
        "个",
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
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/CDB",
        MetricName: metricN,
        "Instances.0.Dimensions.0.Name": "InstanceId",
        "Instances.0.Dimensions.0.Value": this.ID,
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      this.axios.post(All_MONITOR, param).then(data => {
        data.Response.symbol = symbol;
        this.tableData.push(data.Response);
      });
    },
    getModality(MetricName) {
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/CVM",
        MetricName: MetricName,
        "Instances.0.Dimensions.0.Name": "InstanceId",
        "Instances.0.Dimensions.0.Value": this.ID,
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      this.axios.post(All_MONITOR, param).then(data => {
        this.timeData = data.Response.DataPoints[0].Timestamps;
        this.jingData = data.Response.DataPoints[0].Values;
      });
    },
    // 模态框
    Modality(MetricName) {
      this.MetricName = MetricName;
      this.dialogVisible = true;
      this.getModality(this.MetricName);
    },
    handleClose(done) {
      done();
    }
  },
  filters: {
    UpName(value) {
      if (value === "CPUUseRate") {
        return (value = "CPU利用率");
      }
      if (value === "MemoryUseRate") {
        return (value = "内存利用率");
      }
      if (value === "MemoryUse") {
        return (value = "内存占用");
      }
      if (value === "VolumeRate") {
        return (value = "磁盘使用率");
      }
      if (value === "RealCapacity") {
        return (value = "磁盘使用空间（仅包含数据空间使用量）");
      }
      if (value === "Capacity") {
        return (value = "	磁盘占用空间（包含数据及日志空间使用量）");
      }
      if (value === "BytesSent") {
        return (value = "内网出流量");
      }
      if (value === "BytesReceived") {
        return (value = "	内网入流量");
      }
      if (value === "QPS") {
        return (value = "每秒执行操作数");
      }
      if (value === "TPS") {
        return (value = "每秒执行事务数");
      }
      if (value === "MaxConnections") {
        return (value = "最大连接数");
      }
      if (value === "ThreadsConnected") {
        return (value = "当前打开连接数");
      }
      if (value === "ConnectionUseRate") {
        return (value = "连接数利用率");
      }
      if (value === "SlowQueries") {
        return (value = "慢查询数");
      }
      if (value === "SelectScan") {
        return (value = "全表扫描数");
      }
      if (value === "SelectCount") {
        return (value = "查询数");
      }
      if (value === "ComUpdate") {
        return (value = "更新数");
      }
      if (value === "ComDelete") {
        return (value = "删除数");
      }
      if (value === "ComInsert") {
        return (value = "插入数");
      }
      if (value === "ComReplace") {
        return (value = "覆盖数");
      }
      if (value === "Queries") {
        return (value = "总请求数");
      }
      if (value === "QueryRate") {
        return (value = "查询使用率");
      }
      if (value === "CreatedTmpTables") {
        return (value = "临时表数量");
      }
      if (value === "TableLocksWaited") {
        return (value = "等待表锁次数");
      }
      if (value === "InnodbCacheUseRate") {
        return (value = "innodb缓存使用率");
      }
      if (value === "InnodbCacheHitRate") {
        return (value = "innodb缓存命中率");
      }
      if (value === "InnodbOsFileReads") {
        return (value = "innodb读磁盘数量");
      }
      if (value === "InnodbOsFileWrites") {
        return (value = "innodb写磁盘数量");
      }
      if (value === "InnodbOsFsyncs") {
        return (value = "innodb fsync数量");
      }
      if (value === "InnodbNumOpenFiles") {
        return (value = "当前InnoDB打开表的数量");
      }
      if (value === "KeyCacheUseRate") {
        return (value = "myisam缓存使用率");
      }
      if (value === "KeyCacheHitRate") {
        return (value = "myisam缓存命中率");
      }
      if (value === "ComCommit") {
        return (value = "提交数");
      }
      if (value === "ComRollback") {
        return (value = "回滚数");
      }
      if (value === "ThreadsCreated") {
        return (value = "已创建的线程数");
      }
      if (value === "ThreadsRunning") {
        return (value = "运行的线程数");
      }
      if (value === "CreatedTmpDiskTables") {
        return (value = "磁盘临时表数量");
      }
      if (value === "CreatedTmpFiles") {
        return (value = "临时文件数量");
      }
      if (value === "HandlerReadRndNext") {
        return (value = "读下一行请求数");
      }
      if (value === "HandlerRollback") {
        return (value = "内部回滚数");
      }
      if (value === "HandlerCommit") {
        return (value = "内部提交数");
      }
      if (value === "InnodbBufferPoolPagesFree") {
        return (value = "InnoDB空页数");
      }
      if (value === "InnodbBufferPoolPagesTotal") {
        return (value = "InnoDB总页数");
      }
      if (value === "InnodbBufferPoolReadRequests") {
        return (value = "InnoDB逻辑读");
      }
      if (value === "InnodbBufferPoolReads") {
        return (value = "InnoDB物理读");
      }
      if (value === "InnodbDataReads") {
        return (value = "InnoDB总读取量");
      }
      if (value === "InnodbDataRead") {
        return (value = "InnoDB读取量");
      }
      if (value === "InnodbDataWrites") {
        return (value = "	InnoDB总写入量");
      }
      if (value === "InnodbDataWritten") {
        return (value = "InnoDB写入量");
      }
      if (value === "InnodbRowsDeleted") {
        return (value = "InnoDB行删除量");
      }
      if (value === "InnodbRowsInserted") {
        return (value = "InnoDB行插入量");
      }
      if (value === "InnodbRowsUpdated") {
        return (value = "InnoDB行更新量");
      }
      if (value === "InnodbRowsRead") {
        return (value = "	InnoDB行读取量");
      }
      if (value === "InnodbRowLockTimeAvg") {
        return (value = "InnoDB平均获取行锁时间");
      }
      if (value === "InnodbRowLockWaits") {
        return (value = "InnoDB等待行锁次数");
      }
      if (value === "KeyBlocksUnused") {
        return (value = "键缓存内未使用的块数量");
      }
      if (value === "KeyBlocksUsed") {
        return (value = "	键缓存内使用的块数量");
      }
      if (value === "KeyReadRequests") {
        return (value = "键缓存读取数据块次数");
      }
      if (value === "KeyReads") {
        return (value = "硬盘读取数据块次数");
      }
      if (value === "KeyWriteRequests") {
        return (value = "数据块写入键缓冲次数");
      }
      if (value === "KeyWrites") {
        return (value = "数据块写入磁盘次数");
      }
      if (value === "OpenedTables") {
        return (value = "已经打开的表数");
      }
      if (value === "TableLocksImmediate") {
        return (value = "立即释放的表锁数");
      }
      if (value === "OpenFiles") {
        return (value = "打开文件总数");
      }
      if (value === "LogCapacity") {
        return (value = "日志使用量");
      }
      if (value === "SlaveIoRunning") {
        return (value = "IO线程状态");
      }
      if (value === "SlaveSqlRunning") {
        return (value = "SQL线程状态");
      }
      if (value === "MasterSlaveSyncDistance") {
        return (value = "主从延迟距离");
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
