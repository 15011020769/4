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
            <p v-if="Cbsparameter.DiskState!=='ATTACHED'">该云硬盘未被挂载，暂无数据</p>
            <p v-else-if="scope.row.dataPoints[0]===null"> 暂无数据</p>
            <div class='echart'
              v-else-if="scope.row.dataPoints[0]!==null">
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
          :period=period
          :title="diskTitle"
          :xdata=true>
        </echart-line>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import XTimeX from '@/components/Tools/TimeX'
import echartLine from '@/components/Tools/echars-line'
export default {
  data () {
    return {
      ID: this.$route.query.id,
      period: '',
      diskTitle: [],
      diskUnit: '',
      opDiskData: [],
      Start_End: [],
      value: 1,
      dialogVisible: false, // 模态框 （放大后的折线图）
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      tableData: [], // 获取列表数据
      timeData: [], // 折线图的x轴数据
      jingData: []
    }
  },
  props: ['CbsDetail'],
  components: {
    echartLine,
    XTimeX
  },
  created () {
    this.Cbsparameter = this.CbsDetail[0]
  },
  methods: {
    GetDat (data) {
      this.period = data[0]
      this.timeData = data[1]
      this.Start_End = data[2]
      this.value = data[3]
      const metricNArr = [
        'disk_read_iops',
        'disk_read_traffic',
        'disk_write_iops',
        'disk_write_traffic',
        'disk_await',
        'disk_svctm',
        'disk_util'
      ]
      this.tableData = []
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i])
      }
    },
    Obtain (metricN) {
      const param = {
        Region: this.$cookie.get('regionv1'),
        namespace: 'qce/block_storage',
        metricName: metricN,
        'dimensions.0.name': diskId,
        'dimensions.0.value': diskId,
        period: this.period,
        startTime: this.Start_End.StartTIme,
        endTime: this.Start_End.EndTIme
      }
      this.axios.post('monitor/GetMonitorData', param).then(data => {
        this.tableData.push(data)
      })
    },

    // 模态框
    Modality (Y) {
      this.dialogVisible = true
      this.opDiskData = Y
    },

    handleClose (done) {
      done()
    }
  },
  filters: {
    UpName (value) {
      if (value === 'disk_read_iops') {
        return (value = '硬盘读 IOPS')
      }
      if (value === 'disk_read_traffic') {
        return (value = '硬盘读流量')
      }
      if (value === 'disk_write_iops') {
        return (value = '硬盘写 IOPS')
      }
      if (value === 'disk_write_traffic') {
        return (value = '硬盘写流量')
      }
      if (value === 'disk_await') {
        return (value = '硬盘 IO 等待时间')
      }
      if (value === 'disk_svctm') {
        return (value = '硬盘 IO 服务时间')
      }
      if (value === 'disk_util') {
        return (value = '硬盘 IO 繁忙比率')
      }
    },
    UpTitle (value) {
      if (value === 'disk_read_iops') {
        return (value = '硬盘平均每秒读次数')
      }
      if (value === 'disk_read_traffic') {
        return (value = '平均每秒从硬盘读到内存的数据量')
      }
      if (value === 'disk_write_iops') {
        return (value = '硬盘平均每秒写次数')
      }
      if (value === 'disk_write_traffic') {
        return (value = '平均每秒从内存写到硬盘的数据量')
      }
      if (value === 'disk_await') {
        return (value = '硬盘I/O平均每次操作的等待时间')
      }
      if (value === 'disk_svctm') {
        return (value = '硬盘平均每次I/O操作所花的时间')
      }
      if (value === 'disk_util') {
        return (value = '硬盘有IO操作的时间与总时间的百分比')
      }
    }
  }
}
</script>

<style  scoped lang="scss">
.Monitor {
  background: #ffffff;

  margin-bottom: 50px;

  // -webkit-box-shadow: 0px 3px 3px #c8c8c8;
  // -moz-box-shadow: 0px 3px 3px #c8c8c8;
  // box-shadow: 0px 3px 3px #c8c8c8;
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
      ::v-deep .el-input {
        width: 100px !important;
        border: none;
      }
    }
  }
  p:nth-child(1) {
    color: #ccc;
    font-size: 14px;

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
::v-deep .echart-wh {
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
    ::v-deep .el-input {
      width: 100px !important;
      border: none;
    }
  }
}
.box-table {
  width: 100%;
}
::v-deep .i-font {
  font-size: 36px;
}
::v-deep .el-button--small {
  font-size: 14px !important;
}
</style>
