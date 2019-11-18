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
                <p>{{scope.row.metricName | UpTitle(value)}}</p>
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
            <div class='echart'  v-if="scope.row.dataPoints[0]!==null">
              <echart-line id="diskEchearrts-line"
                :time='timeData'
                :opData='scope.row.dataPoints'
                :unit='diskUnit'
                :title="diskTitle"
                :scale=3
                :period=period
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
          :unit='diskUnit'
           :period=period
          :title="diskTitle"
          :xdata=true>
        </echart-line>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import XTimeX from '@/components/TimeX';
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
      jingData: [],
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
      const metricNArr = [
        'cpu_usage',
        'cpu_loadavg',
        'mem_used',
        'mem_usage',
        'tcp_curr_estab',
      ];
      this.tableData = [];
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i]);
      }

      console.log(this.tableData);
    },
    Obtain(metricN) {
      const param = {
        Region: this.$cookie.get('regionv1'),
        namespace: 'qce/cvm',
        metricName: metricN,
        'dimensions.0.name': 'unInstanceId',
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
      if (value === 'tcp_curr_estab') {
        return (value = 'TCP连接数');
      }
      if (value === 'cpu_usage') {
        return (value = 'CPU使用率');
      }
      if (value === 'cpu_loadavg') {
        return (value = 'CPU平均负载');
      }
      if (value === 'mem_used') {
        return (value = '内存使用量');
      }
      if (value === 'mem_usage') {
        return (value = '内存利用率');
      }
    },
    UpTitle(value) {
      if (value === 'tcp_curr_estab') {
        return (value = '处于 ESTABLISHED 状态的 TCP 连接数量，依赖监控组件安装采集');
      }
      if (value === 'cpu_usage') {
        return (value = 'CPU利用率是通过CVM子机内部监控组件采集上报，数据更加精准');
      }
      if (value === 'cpu_loadavg') {
        return (value = '1分钟内CPU平均负载，取 /proc/loadavg 第一列数据（windows操作系统无此指标），依赖监控组件安装采集');
      }
      if (value === 'mem_used') {
        return (value = '使用的内存量，不包括系统缓存和缓存区占用内存，依赖监控组件安装采集');
      }
      if (value === 'mem_usage') {
        return (value = '用户实际使用的内存量与总内存量之比，不包括缓冲区与系统缓存占用的内存');
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
