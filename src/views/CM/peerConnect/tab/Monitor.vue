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
            <div class='echart'
              v-if="scope.row.dataPoints[0]!==null">
              <echart-line id="diskEchearrts-line"
                :time='timeData'
                :opData='scope.row.dataPoints'
                :unit='diskUnit'
                :title="diskTitle"
                :period=period
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
          :unit='diskUnit'
          :title="diskTitle"
          :period=period
          :xdata=true>
        </echart-line>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import XTimeX from '@/components/TimeXF';
import echartLine from '@/components/echars-line';
import { All_MONITOR } from '@/constants';
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
        'inpkg',
        'inbandwidth',
        'outpkg',
        'outbandwidth',
        'pkgdrop',
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
        namespace: 'qce/pcx',
        metricName: metricN,
        'dimensions.0.name': 'peeringConnectionId',
        'dimensions.0.value': this.ID,
        period: this.period,
        startTime: this.Start_End.StartTIme,
        endTime: this.Start_End.EndTIme,
      };
      this.axios.post(All_MONITOR, param).then((data) => {
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
      if (value === 'inpkg') {
        return (value = '入包量');
      }
      if (value === 'inbandwidth') {
        return (value = '网络入带宽');
      }
      if (value === 'outpkg') {
        return (value = '出包量');
      }
      if (value === 'outbandwidth') {
        return (value = '出带宽使用率');
      }
      if (value === 'pkgdrop') {
        return (value = '丢包率');
      }
    },
    UpTitle(value) {
      if (value === 'inpkg') {
        return (value = '对等连接每秒入包量');
      }
      if (value === 'inbandwidth') {
        return (value = '对等连接入带宽');
      }
      if (value === 'outpkg') {
        return (value = '对等连接每秒出包量');
      }
      if (value === 'outbandwidth') {
        return (value = '对等连接出带宽使用率');
      }
      if (value === 'pkgdrop') {
        return (value = '对等连接因带宽限制丢弃报文与总报文的比率');
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
