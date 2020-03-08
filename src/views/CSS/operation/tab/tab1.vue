<template>
  <div class="wrap">
    <h3>
      帶寬趨勢
      <span style="color:#bbb;">(單位:Mbps)</span>
    </h3>
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
import Echart from "../../components/line";
import { CSS_MBPS, DESCRIBE_PLAY_STAT_INFOLIST } from "@/constants";
import moment from "moment";
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
      // if (this.operator) {
      //   params1["IspNames.0"] = this.operator
      //   params2["IspNames.0"] = this.operator
      // }
      const Granularity = moment(this.EndTIme).diff(this.StartTIme, 'days')
      if (Granularity < 3) {
        params1["Granularity"] = 60
        params2["Granularity"] = 5
      } else {
        params1["Granularity"] = 1440
        params2["Granularity"] = 60
      }
      // if (this.operator) {
        // params1["IspNames.0"] = this.operator // 运营商暂不做
        // params2["IspNames.0"] = this.operator // 运营商暂不做
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
            res.Response.DataInfoList.forEach(item => {
              xAxis.push(item.Time);
              series.push(item.Bandwidth);
            });
            this.xAxis = xAxis;
            this.series = series;
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
</style>