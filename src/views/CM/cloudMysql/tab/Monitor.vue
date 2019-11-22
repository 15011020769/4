<template>
  <div class='Monitor'>

    <!-- 时间粒度搜素 -->
    <XTimeX v-on:qiehuan="GetDat"
      :classsvalue='value'></XTimeX>

    <div class='box-dis p-style'>
      <p><i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值</p>
      <p>
        <el-button type="text">导出数据</el-button>
      </p>
    </div>
    <div class='box-table'>
      <!-- 表格 -->
      <el-table :data="tableData"
        style="width: 100%">

        <el-table-column prop="">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder;">
              {{scope.row.metricName | UpName(value)}}
              <el-popover placement="bottom-start"
                title=""
                width="200"
                trigger="hover">
                <p>{{scope.row.metricName | UpName(value)}}</p>
                <i class="el-icon-warning"
                  slot="reference"></i>
              </el-popover>
            </span>

          </template>
        </el-table-column>

        <el-table-column prop="dataPoints"
          width="600">
          <template slot-scope="scope">
            <p v-if="scope.row.dataPoints[0]===null"> 暂无数据</p>
            <div class='echart'
              v-if="scope.row.dataPoints[0]!==null">
              <echart-line id="diskEchearrts-line"
                :time='timeData'
                :opData='scope.row.dataPoints'
                :unit='diskUnit'
                :period=period
                :title="diskTitle"
                :scale=3
                :xdata=false>
              </echart-line>
            </div>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p>Max:</p>
            <p>--</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p>Min:</p>
            <p>--</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p>Avg:</p>
            <p>--</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p> <i class="el-icon-menu i-font"
                style="font-size:26px;"
                @click="Modality(scope.row.dataPoints)"></i>
            </p>

          </template>
        </el-table-column>

      </el-table>
      <!-- 模态框 -->
      <el-dialog title="集群健康状态"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
        <XTimeX v-on:qiehuan="GetDat"
          :classsvalue='value'></XTimeX>
        <echart-line id="diskEchearrts-line"
          class="echart-wh"
          :time='timeData'
          :opData='opDiskData'
          :period=period
          :unit='diskUnit'
          :title="diskTitle"
          :xdata=true>
        </echart-line>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import XTimeX from '@/components/TimeX5';
import echartLine from '@/components/echars-line';
import { CVM_MONITOR } from '@/constants';
export default {
  data() {
    return {
      ID: this.$route.query.id,
      period: '',
      Start_End: [],
      value: 1,
      dialogVisible: false, // 模态框 （放大后的折线图）
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      tableData: [], // 获取列表数据
      timeData: [], // 折线图的x轴数据
    };
  },
  components: {
    echartLine,
    XTimeX,
  },
  created() {},
  methods: {
    GetDat(data) {
      this.period = data[0];
      this.timeData = data[1];
      this.Start_End = data[2];
      this.value = data[3];
      // console.log(this.timeData)
      const metricNArr = [
        // 62
        'slow_queries', // 慢查询数
        'max_connections', // 最大连接数
        'select_scan', // 全表扫描数
        'select_count', // 查询数
        'com_update', // 更新数
        'com_delete', // 删除数
        'com_insert', // 插入数
        'com_replace', // 覆盖数
        'queries', // 总请求数
        'threads_connected', // 当前打开连接数
        'real_capacity', // 磁盘使用空间
        'capacity', // 磁盘占用空间
        'bytes_sent', // 内网出流量
        'bytes_received', // 内网入流量
        'qcache_use_rate', // 缓存使用率
        'qcache_hit_rate', // 缓存命中率
        'table_locks_waited', // 等待表锁次数
        'created_tmp_tables', // 临时表数量
        'innodb_cache_use_rate', // innodb缓存使用率
        'innodb_cache_hit_rate', // innodb缓存命中率
        'innodb_os_file_reads', // innodb读磁盘数量
        'innodb_os_file_writes', // innodb写磁盘数量
        'innodb_os_fsyncs', // innodb fsync数量
        'key_cache_use_rate', // myisam缓存使用率
        'key_cache_hit_rate', // myisam缓存命中率
        'volume_rate', // 容量使用率
        'query_rate', // 查询使用率
        'qps', // 每秒执行操作数
        'tps', // 每秒执行事务数
        'cpu_use_rate', // CPU占比
        'memory_use', // 内存占用
        'key_write_requests', // 数据块写入键缓冲次数
        'key_writes', // 数据块写入磁盘次数
        'com_commit', // 提交数
        'handler_commit', // 内部提交数
        'innodb_rows_read', // InnoDB行读取量
        'innodb_row_lock_time_avg', // InnoDB平均获取行锁时间
        'threads_created', // 已创建的线程数
        'opened_tables', // 已经打开的表数
        'threads_running', // 运行的线程数
        'innodb_data_reads', // InnoDB总读取量
        'com_rollback', // 回滚数
        'key_blocks_unused', // 键缓存内未使用的块数量
        'innodb_data_writes', // InnoDB总写入量
        'innodb_buffer_pool_pages_free', // InnoDB空页数
        'innodb_rows_inserted', // InnoDB行插入量
        'created_tmp_files', // 临时文件数量
        'innodb_data_read', // InnoDB读取量
        'innodb_row_lock_waits', // InnoDB等待行锁次数
        'innodb_buffer_pool_read_requests', // InnoDB逻辑读
        'handler_rollback', // 内部回滚数
        'master_slave_sync_distance', // 主从不同步距离
        'handler_read_rnd_next', // 读下一行请求数
        'innodb_rows_updated', // InnoDB行更新量
        'innodb_rows_deleted', // InnoDB行删除量
        'innodb_buffer_pool_pages_total', // InnoDB空页数
        'key_blocks_used', // 键缓存内使用的块数量
        'innodb_data_written', // InnoDB写入量
        'key_read_requests', // 键缓存读取数据块次数
        'innodb_buffer_pool_reads', // InnoDB物理读

        'created_tmp_disk_tables', // 磁盘临时表数量
        'key_reads', // 硬盘读取数据块次数
      ];
      this.tableData = [];
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i]);
      }

      // console.log(this.tableData);
    },
    Obtain(metricN) {
      const param = {
        Region: this.$cookie.get('regionv2'),
        namespace: 'qce/cdb',
        metricName: metricN,
        'dimensions.0.name': 'uInstanceId',
        'dimensions.0.value': this.ID,
        period: this.period,
        startTime: this.Start_End.StartTIme,
        endTime: this.Start_End.EndTIme,
      };
      this.axios.post(CVM_MONITOR, param).then((data) => {
        this.tableData.push(data);
      });
    },

    // 模态框
    Modality(Y) {
      this.dialogVisible = true;
      this.opDiskData = Y;
    },

    handleClose(done) {
      done();
    },
  },
  filters: {
    UpName(value) {
      if (value === 'slow_queries') {
        return (value = '慢查询数');
      }
      if (value === 'max_connections') {
        return (value = '最大连接数');
      }
      if (value === 'select_scan') {
        return (value = '全表扫描数');
      }
      if (value === 'select_count') {
        return (value = '查询数');
      }
      if (value === 'com_update') {
        return (value = '更新数');
      }
      if (value === 'com_delete') {
        return (value = '删除数');
      }
      if (value === 'com_insert') {
        return (value = '插入数');
      }
      if (value === 'com_replace') {
        return (value = '覆盖数');
      }
      if (value === 'queries') {
        return (value = '总请求数');
      }
      if (value === 'threads_connected') {
        return (value = '当前打开连接数');
      }
      if (value === 'created_tmp_tables') {
        return (value = '临时表数量');
      }
      if (value === 'innodb_cache_use_rate') {
        return (value = 'innodb缓存使用率');
      }
      if (value === 'innodb_cache_hit_rate') {
        return (value = 'innodb缓存命中率');
      }
      if (value === 'table_locks_waited') {
        return (value = '等待表锁次数');
      }
      if (value === 'qcache_hit_rate') {
        return (value = '缓存命中率');
      }
      if (value === 'qcache_use_rate') {
        return (value = '缓存使用率');
      }
      if (value === 'bytes_received') {
        return (value = '内网入流量');
      }
      if (value === 'bytes_sent') {
        return (value = '内网入流量');
      }
      if (value === 'capacity') {
        return (value = '磁盘占用空间');
      }
      if (value === 'real_capacity') {
        return (value = '磁盘使用空间');
      }
      if (value === 'cpu_use_rate') {
        return (value = 'CPU占比');
      }
      if (value === 'tps') {
        return (value = '每秒执行事务数');
      }
      if (value === 'qps') {
        return (value = '每秒执行操作数');
      }
      if (value === 'query_rate') {
        return (value = '查询使用率');
      }
      if (value === 'volume_rate') {
        return (value = '容量使用率');
      }
      if (value === 'key_cache_hit_rate') {
        return (value = 'myisam缓存命中率');
      }
      if (value === 'key_cache_use_rate') {
        return (value = 'myisam缓存使用率');
      }
      if (value === 'innodb_os_fsyncs') {
        return (value = 'innodb fsync数量');
      }
      if (value === 'innodb_os_file_writes') {
        return (value = 'innodb写磁盘数量');
      }
      if (value === 'innodb_os_file_reads') {
        return (value = 'innodb读磁盘数量');
      }
      if (value === 'threads_running') {
        return (value = '运行的线程数');
      }
      if (value === 'opened_tables') {
        return (value = '已经打开的表数');
      }
      if (value === 'threads_created') {
        return (value = '已创建的线程数');
      }
      if (value === 'innodb_row_lock_time_avg') {
        return (value = 'InnoDB平均获取行锁时间');
      }
      if (value === 'innodb_rows_read') {
        return (value = 'InnoDB行读取量');
      }
      if (value === 'handler_commit') {
        return (value = '内部提交数');
      }
      if (value === 'com_commit') {
        return (value = '提交数');
      }
      if (value === 'key_writes') {
        return (value = '数据块写入磁盘次数');
      }
      if (value === 'key_write_requests') {
        return (value = '数据块写入键缓冲次数');
      }
      if (value === 'memory_use') {
        return (value = '内存占用');
      }
      if (value === 'innodb_rows_inserted') {
        return (value = 'InnoDB行插入量');
      }
      if (value === 'created_tmp_files') {
        return (value = '临时文件数量');
      }
      if (value === 'innodb_data_read') {
        return (value = 'InnoDB读取量');
      }
      if (value === 'innodb_row_lock_waits') {
        return (value = 'InnoDB等待行锁次数');
      }
      if (value === 'innodb_buffer_pool_read_requests') {
        return (value = 'InnoDB逻辑读');
      }
      if (value === 'innodb_buffer_pool_pages_free') {
        return (value = 'InnoDB空页数');
      }
      if (value === 'innodb_data_writes') {
        return (value = 'InnoDB总写入量');
      }
      if (value === 'key_blocks_unused') {
        return (value = '键缓存内未使用的块数量');
      }
      if (value === 'com_rollback') {
        return (value = '回滚数');
      }
      if (value === 'innodb_data_reads') {
        return (value = 'InnoDB总读取量');
      }
      if (value === 'innodb_buffer_pool_reads') {
        return (value = 'InnoDB物理读');
      }
      if (value === 'key_read_requests') {
        return (value = '键缓存读取数据块次数');
      }
      if (value === 'innodb_data_written') {
        return (value = 'InnoDB写入量');
      }
      if (value === 'key_blocks_used') {
        return (value = '键缓存内使用的块数量');
      }
      if (value === 'innodb_buffer_pool_pages_total') {
        return (value = 'InnoDB空页数');
      }
      if (value === 'innodb_rows_deleted') {
        return (value = 'InnoDB行删除量');
      }
      if (value === 'innodb_rows_updated') {
        return (value = 'InnoDB行更新量');
      }
      if (value === 'handler_read_rnd_next') {
        return (value = '读下一行请求数');
      }
      if (value === 'master_slave_sync_distance') {
        return (value = '主从不同步距离');
      }
      if (value === 'handler_rollback') {
        return (value = '内部回滚数');
      }
      if (value === 'created_tmp_disk_tables') {
        return (value = '磁盘临时表数量');
      }
      if (value === 'key_reads') {
        return (value = '硬盘读取数据块次数');
      }
    },
  },
};
</script>

<style  scoped lang="scss">
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
  width: 1100px !important;
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
