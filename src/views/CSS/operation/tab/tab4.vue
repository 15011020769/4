<template>
  <div class="wrap">
    <el-row type="flex" justify="space-between">
      <h3>
        併發連接數趨勢
        <span style="color:#bbb;">(單位:次)</span>
      </h3>
      <p class="iconBtn"><i class="el-icon-download" @click="_export"></i></p>
    </el-row>
    <Echart
      color="#e54545"
      :xAxis="xAxis"
      :series="series"
      :legendText="legendText"
      v-loading="loading"
    />
    <div class="table">
      <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%;margin-top:20px;"
        v-loading="loading"
      >
        <el-table-column prop="Time" label="時間點"></el-table-column>
        <el-table-column prop="Online" label="併發連接數"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currpage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import XLSX from 'xlsx'
import Echart from "../../components/line";
import { CSS_PLAY, DESCRIBE_PLAY_STAT_INFOLIST } from "@/constants";
export default {
  name: "tab4",
  data() {
    return {
      DataInfoList: [],
      //图表数据
      xAxis: [],
      series: [],
      legendText: "併發連接數趨勢",
      tableData: [], //表格数据
      currpage: 1, //页数
      pagesize: 10, //每页数量
      totalItems: 0, //总条数
      loading: true, //加载状态
      json: []
    };
  },
  components: {
    Echart
  },
  props: {
    StartTIme: String,
    EndTIme: String,
    domainsData: Array,
    domainCheckedListCopy: Array,
  },
  created() {
    this.init();
  },
  methods: {
    _export() {
      var ws = XLSX.utils.json_to_sheet(this.json);/* 新建空workbook，然后加入worksheet */
      var wb = XLSX.utils.book_new();/*新建book*/
      XLSX.utils.book_append_sheet(wb, ws, "統計數據");/* 生成xlsx文件(book,sheet数据,sheet命名) */
      XLSX.writeFile(wb, "統計數據.csv");/*写文件(book,xlsx文件名称)*/
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.init();
    },
    //获取表格数据
    init() {
      this.loading = true;
      const params1 = { // 表格
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:MM:SS"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:MM:SS"),
        // "CountryOrAreaNames.0": "Taiwan"
        // MainlandOrOversea: "Mainland"
      };
      const params2 = { // 图表
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:MM:SS"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:MM:SS"),
        // "CountryOrAreaNames.0": "Taiwan"
        // MainlandOrOversea: "Mainland"
      };
      if (this.domainCheckedListCopy.length !== this.domainsData.length) {
        this.domainCheckedListCopy.forEach((item, index) => {
          params1["PlayDomains." + index] = item;
          params2["PlayDomains." + index] = item;
        });
      }
      const Granularity = moment(this.EndTIme).diff(this.StartTIme, "days")
      if (Granularity < 3) {
        params1["Granularity"] = 60;
        params2["Granularity"] = 5;
      } else {
        params1["Granularity"] = 1440;
        params2["Granularity"] = 60;
      }
      this.axios.post(DESCRIBE_PLAY_STAT_INFOLIST, params1)
                .then(res => {
                  if (res.Response.Error) {
                    this.$message({
                      message: res.Response.Error.Message,
                      type: "error",
                      showClose: true,
                      duration: 0
                    })
                  } else {
                    this.tableData = res.Response.DataInfoList;
                    this.totalItems = res.Response.DataInfoList.length;
                  }
                  this.loading = false
                });
      this.axios.post(DESCRIBE_PLAY_STAT_INFOLIST, params2)
                .then(res => {
                  if (res.Response.Error) {
                    this.$message({
                      message: res.Response.Error.Message,
                      type: "error",
                      showClose: true,
                      duration: 0
                    })
                  } else {
                    var xAxis = [];
                    var series = [];
                    let _json = []
                    res.Response.DataInfoList.map(item => {
                      xAxis.push(item.Time)
                      series.push(item.Online)
                      _json.push({"Time": item.Time, "UserOnline": item.Online})
                    })
                    this.xAxis = xAxis
                    this.series = series
                    this.json = _json
                  }
                  this.loading = false
                })
    }
  }
};
</script>

<style scoped lang='scss'>
.wrap {
  .Right-style {
    display: flex;
    justify-content: flex-end;

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
}
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
</style>