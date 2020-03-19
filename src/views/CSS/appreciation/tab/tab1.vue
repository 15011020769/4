<template>
  <div class="wrap">
    <p class="down">
      <el-row>
        <h3 style="font-size: 14px;font-weight: 700;">{{$t('CSS.appreciation.4')}}{{StartTIme}} 到 {{EndTIme}}{{$t('CSS.appreciation.5')}}</h3>
      </el-row>
      <el-row class="iconBtn">
        <i class="el-icon-download" @click="exportEchart"></i>
      </el-row>
    </p>
    <Echart :xAxis="xAxis" :series="series" :legendText="legendText" v-loading="loading"/>
    <div class="table">
      <h3>月度消費量</h3>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        v-loading="loading"
      >
        <el-table-column prop="time" label="月份"></el-table-column>
        <el-table-column prop="num" :label="$t('CSS.appreciation.13')"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="exportTable(scope)">導出詳情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;條</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import Echart from '../../components/line'
import { CSS_SCREEN } from '@/constants'
export default {
  name: 'tab2',
  data () {
    return {
      tableData: [], // 表格数据
      current: 1, // 页数
      pageSize: 10, // 每页数量
      totalItems: 0, // 总条数
      loading: true, // 加载状态
      xAxis: [],
      series: [],
      legendText: '截圖',
      line_json: [],
      table_json: []
    }
  },
  components: {
    Echart
  },
  props: {
    StartTIme: {
      type: String
    },
    EndTIme: {
      type: String
    }
  },
  created () {
    this.init()
    this.getCharts()
  },
  methods: {
    exportEchart () {
      const ws = XLSX.utils.json_to_sheet(this.line_json)/* 新建空workbook，然后加入worksheet */
      const wb = XLSX.utils.book_new()/* 新建book */
      XLSX.utils.book_append_sheet(wb, ws, '統計數據')/* 生成xlsx文件(book,sheet数据,sheet命名) */
      XLSX.writeFile(wb, '統計數據.csv')/* 写文件(book,xlsx文件名称) */
    },
    exportTable (scope) {
      let temp = []
      let sheetArr = []
      temp = this.table_json.filter(item => {
        return item.Time.substring(0, 7) == scope.row.time
      })
      temp.forEach(v => {
        if (v.Num !== 0) {
          sheetArr.push({ Time: v.Time, ScreenshotCount: v.Num })
        }
      })
      if (!sheetArr.length) {
        sheetArr = [{ Time: '', ScreenshotCount: '' }]
      }
      const ws = XLSX.utils.json_to_sheet(sheetArr)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '截圖詳情')
      XLSX.writeFile(wb, '截圖詳情.csv')
    },
    // 分页
    handleCurrentChange (val) {
      this.current = val
      this.init()
    },
    // 获取表格数据
    init () {
      this.loading = true
      const params = {
        Version: '2018-08-01',
        Granularity: 'Day',
        Zone: 'Oversea',
        StartTime: moment().subtract(6, 'months').endOf('months').utc().format(),
        EndTime: moment().utc().format()
      }
      this.axios.post(CSS_SCREEN, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          res.Response.DataInfoList.map(item => {
            item.Time = moment(item.Time).format('YYYY-MM-DD HH:mm:ss')
          })
          let obj = res.Response.DataInfoList
          this.table_json = res.Response.DataInfoList
          var mon = []
          for (var i = 0; i < obj.length; i++) {
            var repeat = false
            for (var j = 0; j < mon.length; j++) {
              if (mon[j].time == obj[i].Time.substring(0, 7)) {
                repeat = true
                break
              }
            }
            if (!repeat) {
              mon.push({ time: obj[i].Time.substring(0, 7) })
            }
          }
          var monvalue = []
          var one = 0
          for (var j = 0; j < mon.length; j++) {
            var one = 0
            for (var i = 0; i < obj.length; i++) {
              if (obj[i].Time.substring(0, 7) == mon[j].time) {
                one += obj[i].Num
              }
            }
            monvalue.push({ num: one })
          }
          var json_arr = []
          for (var i = 0; i < mon.length; i++) {
            json_arr.push(Object.assign(mon[i], monvalue[i]))
          }
          const brr = json_arr.splice(0, 1)
          this.tableData = json_arr.sort((a, b) => new Date(b.time) - new Date(a.time))
          this.totalItems = json_arr.length
        }
        this.loading = false
      })
    },
    // 获取图表数据
    getCharts () {
      this.loading = true
      const axixArr = []
      const seriesArr = []
      const params = {
        Version: '2018-08-01',
        Granularity: 'Minute',
        Zone: 'Oversea',
        StartTime: moment(this.StartTIme).utc().format(),
        EndTime: moment(this.EndTIme).utc().format()
      }
      let numArr = []
      this.axios.post(CSS_SCREEN, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          res.Response.DataInfoList.map(v => {
            axixArr.push(moment(v.Time).format('YYYY-MM-DD HH:mm:ss'))
            seriesArr.push(v.Num)
            numArr.push({ Time: moment(v.Time).format('YYYY-MM-DD HH:mm:ss'), Name: '截图', 'ScreenshotCount': v.Num })
          })
          this.xAxis = axixArr
          this.series = seriesArr
          this.line_json = numArr
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.wrap {
  .Right-style {
    // display: flex;
    // justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
  }
  .pagstyle {
    padding: 20px;
    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }
  .down {
    width: 100%;
    margin: 30px 0 10px 0;
    display: flex;
    justify-content: space-between;
    .iconBtn {
      font-size: 16px;
      color: #888;
      display: flex;
      align-items: center;
      > i {
        margin: 0 10px;
        font-weight: 600;
      }
      i:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
