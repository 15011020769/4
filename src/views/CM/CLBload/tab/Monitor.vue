<template>
  <div class='Monitor'>

    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue='value'></XTimeX>
    <div class='box-dis p-style'>
      <p><i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值</p>
      <p>
        <el-button type="text">导出数据</el-button>
      </p>
    </div>
    <div class='box-table'>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" width="130">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder;color:#333;font-weight:600;">
              {{scope.row.MetricName | UpName(value)}}
              <span class="symbol">{{scope.row.symbol}}</span>
              <el-popover placement="bottom-start" title="" width="200" trigger="hover">
                <p>{{scope.row.MetricName | UpTitle(value)}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span>

          </template>
        </el-table-column>

        <el-table-column prop="DataPoints" width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0"> 暂无数据</p>
            <div class='echart' v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time='scope.row.DataPoints[0].Timestamps | UpTime'
                :opData='scope.row.DataPoints[0].Values' :scale=3 :period=period :xdata=false>
              </echart-line>
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



        <el-table-column prop="">
          <template slot-scope="scope">
            <p> <i class="el-icon-menu i-font" style="font-size:26px;" @click="Modality(scope.row.MetricName)"></i>
            </p>

          </template>
        </el-table-column>

      </el-table>
      <!-- 模态框 -->
      <el-dialog title="集群健康状态" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
        <XTimeX v-on:switchData="GetDat" :classsvalue='value'></XTimeX>
        <echart-line id="diskEchearrts-line" class="echart-wh" :time='timeData | UpTime' :opData='jingData'
          :period=period :xdata=true>
        </echart-line>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  import moment from 'moment';
  import XTimeX from '@/components/public/TimeXK';
  import echartLine from '@/components/public/echars-line';
  import {
    All_MONITOR
  } from '@/constants';
  export default {
    data() {
      return {
        vip: this.$route.query.vip,
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
        MetricName: ''
      };
    },
    components: {
      echartLine,
      XTimeX,
    },
    created() {

    },
    methods: {
      GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2]
        const metricNArr = [
          'Connum',
          'NewConn',
          'Intraffic',
          'Outtraffic',
          'Inpkg',
          'Outpkg'
        ];
        const symbol = ["个/分钟", "个/分钟", "Mbps", "Mbps", "个/秒", "个/秒"];
        this.tableData = []
        for (let i = 0; i < metricNArr.length; i++) {
          this.Obtain(metricNArr[i], symbol[i]);
        }
        if (this.MetricName) {
          this.getModality(this.MetricName)
        }
      },
      // 
      Obtain(metricN, symbol) {
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/LB_PUBLIC',
          MetricName: metricN,
          'Instances.0.Dimensions.0.Name': 'vip',
          'Instances.0.Dimensions.0.Value': this.vip,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        this.axios.post(All_MONITOR, param).then((data) => {
          data.Response.symbol = symbol;
          this.tableData.push(data.Response);
        });
      },
      getModality(MetricName) {
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/LB_PUBLIC',
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'vip',
          'Instances.0.Dimensions.0.Value': this.vip,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        this.axios.post(All_MONITOR, param).then((data) => {
          this.timeData = data.Response.DataPoints[0].Timestamps
          this.jingData = data.Response.DataPoints[0].Values
        });
      },
      // 模态框
      Modality(MetricName) {
        this.MetricName = MetricName
        this.dialogVisible = true;
        this.getModality(this.MetricName)
      },
      handleClose(done) {
        done();
      },

    },
    filters: {
      //文字过滤
      UpName(value) {
        if (value === 'Connum') {
          return (value = '当前连接数');
        }
        if (value === 'NewConn') {
          return (value = '新增连接数');
        }
        if (value === 'Intraffic') {
          return (value = '入流量');
        }

        if (value === 'Outtraffic') {
          return (value = ' 出流量');
        }
        if (value === 'Inpkg') {
          return (value = '入包量');
        }
        if (value === 'Outpkg') {
          return (value = '出包量');
        }
        if (value === '') {
          return (value = '');
        }
      },
      UpTitle(value) {
        if (value === 'Connum') {
          return (value = '当前连接数');
        }
        if (value === 'NewConn') {
          return (value = '新增连接数');
        }
        if (value === 'Intraffic') {
          return (value = '入流量');
        }

        if (value === 'Outtraffic') {
          return (value = ' 出流量');
        }
        if (value === 'Inpkg') {
          return (value = '入包量');
        }
        if (value === 'Outpkg') {
          return (value = '出包量');
        }
        if (value === '') {
          return (value = '');
        }
      },
      UpTime(value) {
        let timeArr = []
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          timeArr.push(uptime)
        }

        return timeArr
      }
    },
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
