<template>
  <div class="wrap">
    <p class="down">
      <el-row>
        <h3 style="font-size: 14px;font-weight: 700;">錄製任務個數{{StartTIme}} 到 {{EndTIme}}（單位：個）</h3>
      </el-row>
      <el-row class="iconBtn">
        <i class="el-icon-download" @click="exportEchart"></i>
      </el-row>
    </p>
    <Echart :xAxis="xAxis" :series="series" :legendText="legendText" />
    <div class="table">
      <h3>月度消費量</h3>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column prop="time" label="月份"></el-table-column>
        <el-table-column prop="num" label="錄製任務數量（個）"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="exportTable(scope)">{{$t('CSS.appreciation.12')}}</el-button>
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
import moment from "moment";
import XLSX from 'xlsx'
import Echart from "../../components/line";;
import { CSS_CODE, CSS_RECORDSTREAM } from "@/constants";
export default {
  name: "tab2",
  data() {
    return {
      tableData: [], //表格数据
      current: 1, //页数
      pageSize: 10, //每页数量
      totalItems: 0, //总条数
      loading: true, //加载状态
      xAxis: [],
      series: [],
      legendText: '錄製任務個數',
      start: moment(this.StartTIme).format('YYYY-MM-DD HH:mm:ss'),
      line_json: [],
      table_json: []
    };
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
  // watch: {
  //   start(val) {
  //     this.start = val;
  //     this.init()
  //   }
  // },
  created() {
    this.init();
    this.getCharts()
  },
  methods: {
    exportEchart() {
      const ws = XLSX.utils.json_to_sheet(this.line_json);/* 新建空workbook，然后加入worksheet */
      const wb = XLSX.utils.book_new();/*新建book*/
      XLSX.utils.book_append_sheet(wb, ws, "統計數據");/* 生成xlsx文件(book,sheet数据,sheet命名) */
      XLSX.writeFile(wb, "統計數據.csv");/*写文件(book,xlsx文件名称)*/
    },
    exportTable(scope) {
      let temp = []
      let sheetArr = []
      temp = this.table_json.filter(item => {
        return item.Time.substring(0,7) == scope.row.time
      })
      temp.forEach(v => {
        if(v.Num !== 0) {
          sheetArr.push({"時間": v.Time, "數目": v.Num})
        }
      })
      if (!sheetArr.length) {
        sheetArr=[{"時間": '', "數目": ''}]
      }
      const ws = XLSX.utils.json_to_sheet(sheetArr)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "錄製任務個數詳情")
      XLSX.writeFile(wb, "錄製任務個數詳情.csv")
    },
    //分页
    handleCurrentChange(val) {
      this.current = val;
      this.init();
    },
    //获取表格数据
    init() {
      this.loading = true;
      let arrTotal = [];
      let arrDetail = [];
      for (let i = 0 ; i < 5; i++) {
        const params = {
          Version: "2018-08-01",
          MainlandOrOversea: "Oversea",
          LiveType: "NormalLive",
        };
        params.StartTime =  moment().subtract(i, "months").startOf("months").format('YYYY-MM-DD HH:mm:ss')
        params.EndTime = moment().subtract(i, "months").endOf("months").format('YYYY-MM-DD HH:mm:ss')
        this.axios.post(CSS_RECORDSTREAM, params).then(res => {
          if (res.Response.Error) {
            this.$message.error(res.Response.Error.Message);
          } else {
            arrTotal.push(res.Response.DataInfoList)
            arrDetail = arrTotal.reduce(function (a, b) { return a.concat(b)})
            this.table_json = arrDetail
            let obj = arrDetail
            var mon = [];
            for (var i = 0; i < obj.length; i++) {
                var repeat = false;
                  for (var j = 0; j < mon.length; j++) {
                    if (mon[j].time == obj[i].Time.substring(0,7)) {
                        repeat = true
                        break
                    }
                  }
                  if (!repeat) {
                    mon.push({time: obj[i].Time.substring(0,7)})
                  }
              }
              var monvalue = [];
              var one = 0;
              for(var j = 0; j < mon.length; j++){
                var one = 0;
                var totalNum = [];
              for(var i = 0; i < obj.length; i++){
                  if(obj[i].Time.substring(0,7) == mon[j].time){
                    totalNum.push(obj[i].Num)
                    one = Math.max(...totalNum)
                  }
                }
              monvalue.push({num: one});
              }
              var json_arr = [];
              for (var i = 0; i < mon.length; i++){
                json_arr.push(Object.assign(mon[i],monvalue[i]));
              }
            this.tableData = json_arr.sort((a, b) => moment(b.time) - moment(a.time));
            this.totalItems = json_arr.length;
          }
          this.loading = false;
        });
      }
    },
    getCharts() {
      this.loading = true;
      const axixArr = []
      const seriesArr = []
      const params = {
        Version: "2018-08-01",
        StartTime : moment(this.StartTIme).format('YYYY-MM-DD HH:mm:ss'),
        EndTime : moment(this.EndTIme).format('YYYY-MM-DD HH:mm:ss'),
        MainlandOrOversea: "Oversea",
        LiveType: "NormalLive",
      };
      let numArr = []
      this.axios.post(CSS_RECORDSTREAM, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          res.Response.DataInfoList.map(v => {
            axixArr.push(v.Time)
            seriesArr.push(v.Num)
            numArr.push({Time: v.Time, Name: "录制", "RecordPeakTime": v.Num})
          })
          this.xAxis = axixArr
          this.series = seriesArr
          this.line_json = numArr
        }
        this.loading = false;
      });
    }
  }
};
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
