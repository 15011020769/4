<template>
  <div class="wrap">
    <el-row type="flex" justify="space-between">
      <h3>
        帶寬趨勢<span style="color:#bbb;">(單位:Mbps)</span>
      </h3>
        <p class="iconBtn"><i class="el-icon-download" @click="_export"></i></p>
    </el-row>
    <Echart :xAxis="xAxis" :series="series" :legendText="legendText" v-loading="loading" />
    <div class="table">
      <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%;margin-top:20px;"
        v-loading="loading"
      >
        <el-table-column prop="Time" label="時間点"></el-table-column>
        <el-table-column prop="Bandwidth" label="帶寬(Mbps)"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <!-- <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;條</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination> -->
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
import { CSS_MBPS, DESCRIBE_PLAY_STAT_INFOLIST } from "@/constants";
export default {
  name: "tab1",
  data() {
    return {
      //图表数据
      xAxis: [],
      series: [],
      legendText: '帶寬',
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
    StartTIme: {
      type: String
    },
    EndTIme: {
      type: String
    },
    domainsData: Array,
    domainCheckedListCopy: Array,
    operator: String
  },
  created() {
    this.init();
  },
  methods: {
    _export() {
      const ws = XLSX.utils.json_to_sheet(this.json);/* 新建空workbook，然后加入worksheet */
      const wb = XLSX.utils.book_new();/*新建book*/
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
      // 腾讯页面中默认选择地区查的是CSS_MBPS，选择地区为台湾后查的DESCRIBE_PLAY_STAT_INFOLIST
      this.loading = true;
      const params1 = { // 表格
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
        "CountryOrAreaNames.0": "Taiwan"
      };
      const params2 = { // 图表
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
        "CountryOrAreaNames.0": "Taiwan" // 直接传台湾
      };
      if (this.domainCheckedListCopy.length !== this.domainsData.length) {
        this.domainCheckedListCopy.forEach((item, index) => {
          params1["PlayDomains." + index] = item;
          params2["PlayDomains." + index] = item;
        });
      }
      
      const Granularity = moment(this.EndTIme).diff(this.StartTIme, 'days')
      if (Granularity < 3) {
        params1["Granularity"] = 60
        params2["Granularity"] = 5
      } else {
        params1["Granularity"] = 1440
        params2["Granularity"] = 60
      }
      // if (this.operator) {
      //   params1["IspNames.0"] = this.operator // 运营商暂不做
      //   params2["IspNames.0"] = this.operator // 运营商暂不做
        this.axios.post(DESCRIBE_PLAY_STAT_INFOLIST, params1).then(res => {
          if (res.Response.Error) {
            this.$message({
              message: res.Response.Error.Message,
              type: "error",
              showClose: true,
              duration: 0
            })
          } else {
            // 表格数据
            this.tableData = res.Response.DataInfoList;
            this.totalItems = res.Response.DataInfoList.length;
          }
          this.loading = false;
        });
        this.axios.post(DESCRIBE_PLAY_STAT_INFOLIST, params2).then(res => {
          if (res.Response.Error) {
            this.$message({
              message: res.Response.Error.Message,
              type: "error",
              showClose: true,
              duration: 0
            })
          } else {
            // 图表数据
            var xAxis = [];
            var series = [];
            let _json = []
            res.Response.DataInfoList.forEach(item => {
              xAxis.push(item.Time);
              series.push(item.Bandwidth);
              _json.push({Time: item.Time, "Bandwidth (Mbps)": item.Bandwidth})
            });
            this.xAxis = xAxis;
            this.series = series;
            this.json = _json
          }
          this.loading = false;
        });
      // } 
      // else {
      //   this.axios.post(CSS_MBPS, params1).then(res => {
      //     if (res.Response.Error) {
      //       this.$message({
      //         message: res.Response.Error.Message,
      //         type: "error",
      //         showClose: true,
      //         duration: 0
      //       })
      //     } else {
      //       // 表格数据
      //       this.tableData = res.Response.DataInfoList;
      //       this.totalItems = res.Response.DataInfoList.length;
      //     }
      //     this.loading = false;
      //   });
      //   this.axios.post(CSS_MBPS, params2).then(res => {
      //     if (res.Response.Error) {
      //       this.$message({
      //         message: res.Response.Error.Message,
      //         type: "error",
      //         showClose: true,
      //         duration: 0
      //       })
      //     } else {
      //       // 图表数据
      //       var xAxis = [];
      //       var series = [];
      //       res.Response.DataInfoList.forEach(item => {
      //         xAxis.push(item.Time);
      //         series.push(item.Bandwidth);
      //       });
      //       this.xAxis = xAxis;
      //       this.series = series;
      //     }
      //     this.loading = false;
      //   });
      // }
    },
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