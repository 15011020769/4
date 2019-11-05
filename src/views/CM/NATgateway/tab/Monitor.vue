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
            <!-- <span style="font-size:12px;font-weight:bolder;">
            {{scope.row.Name}}
              <el-popover
                placement="bottom-start"
                title=""
                width="200"
                trigger="hover">
                <p>{{scope.row.Name}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span> -->
            <p>CPU利用率</p>
          </template>
        </el-table-column>

        <el-table-column prop="Y"
          width="600">
          <template slot-scope="scope">
            <div class='echart'>
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
            <p>{{scope.row.max}}</p>
            <p>{{scope.row.max1}}</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p>{{scope.row.min}}</p>
            <p>{{scope.row.min1}}</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <p>{{scope.row.avg}}</p>
            <p>{{scope.row.avg1}}</p>

          </template>
        </el-table-column>

        <el-table-column prop="">
          <template slot-scope="scope">
            <i class="el-icon-menu i-font"
              @click="Modality(scope.row.dataPoints)"></i>
            <i class="el-icon-download i-font"></i>

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
import axios from 'axios'
import XTimeX from '@/components/TimeX'
import echartLine from '@/components/echars-line'
import { CVM_MONITOR } from '@/constants'
export default {
  data () {
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
      jingData: []
    }
  },
  components: {
    echartLine,
    XTimeX
  },
  created () {},
  methods: {
    GetDat (data) {
      this.period = data[0]
      this.timeData = data[1]
      this.Start_End = data[2]
      this.value = data[3]
      const metricNArr = [
        'cpu_usage',
        'cpu_loadavg',
        'mem_used',
        'mem_usage',
        'tcp_curr_estab'
      ]
      this.tableData = []
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i])
      }
      this.getdata()
    },
    Obtain (metricN) {
      const param = {
        Region: this.$cookie.get('regionv1'),
        namespace: 'qce/cvm',
        metricName: metricN,
        'dimensions.0.name': 'unInstanceId',
        'dimensions.0.value': this.ID,
        period: this.period,
        startTime: this.Start_End.StartTIme,
        endTime: this.Start_End.EndTIme
      }
      this.axios.post(CVM_MONITOR, param).then((data) => {
        this.tableData.push(data)
      })
    },
    // 模拟获取数据
    getdata () {
      axios
        .get(
          'http://localhost:5566/test.json'
          // {
          //   headers: {
          //     uuid: this.$cookie.get('uuid'),
          //   },
          // },
        )
        .then(({ data }) => {
          this.jingData = data.employees
          console.log(this.jingData)
          console.log(this.tableData[0])
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
  }
}
</script>

<style  scoped lang="scss">
.Monitor {
  height: 1800px;
  background: #ffffff;
  margin-top: 20px;
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
      /deep/.el-input {
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
/deep/.echart-wh {
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
    /deep/.el-input {
      width: 100px !important;
      border: none;
    }
  }
}
.box-table {
  width: 100%;
}
/deep/.i-font {
  font-size: 36px;
}
/deep/.el-button--small {
  font-size: 14px !important;
}
</style>
