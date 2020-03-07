<template>
  <div class="wrap">
    <h3>
      併發連接數趨勢
      <span style="color:#bbb;">(單位:MB)</span>
    </h3>
    <Echart color="#e54545" :xAxis="xAxis" :series="series" v-loading="loading" />
    <div class="table">
      <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%;margin-top:20px;"
        height="450"
        v-loading="loading"
      >
        <el-table-column prop="Time" label="時間點"></el-table-column>
        <el-table-column prop="Online" label="併發連接數"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;條</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Echart from "../components/echarts";
import { CSS_PLAY, CSS_MBPS } from "@/constants";
import moment from "moment";
export default {
  name: "tab4",
  data() {
    return {
      DataInfoList: [],
      //图表数据
      xAxis: [],
      series: [],
      tableData: [], //表格数据
      currpage: 1, //页数
      pagesize: 10, //每页数量
      totalItems: 0, //总条数
      loading: true //加载状态
    };
  },
  components: {
    Echart
  },
  props: {
    StartTIme: String,
    EndTIme: String,
    domain: Array
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
    //获取表格数据
    init() {
      this.loading = true;
      const params = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:MM:SS"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:MM:SS")
      };
      const param = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:MM:SS"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:MM:SS")
      };
      var Granularity =
        moment(this.EndTIme).format("YYYYMMDD") -
        moment(this.StartTIme).format("YYYYMMDD");
      if (Granularity < 6) {
        param["Granularity"] = 60;
      } else {
        param["Granularity"] = 1440;
      }
      this.axios
        .post(CSS_MBPS, param)
        .then(res => {
          if (res.Response.Error) {
            this.$message.error(res.Response.Error.Message);
          } else {
            this.DataInfoList = res.Response.DataInfoList;
          }
        })
        .then(() => {
          this.axios.post(CSS_PLAY, params).then(res => {
            if (res.Response.Error) {
              if (
                res.Response.Error.Message ==
                "EndTime minus StartTime should smaller than 86400 s"
              ) {
                this.$message.error("該模式暫不支持查詢一天之外的數據");
              } else {
                this.$message.error(res.Response.Error.Message);
              }
            } else {
              var data = [];
              res.Response.DataInfoList[0].DetailInfoList.forEach(
                (item, index) => {
                  for (var i = 0; i < this.DataInfoList.length; i++) {
                    if (item.Time == this.DataInfoList[i].Time) {
                      data.push(item);
                    }
                  }
                }
              );
              this.tableData = data;
              this.totalItems = data.length;
              //图表数据
              var xAxis = [];
              var series = [];
              res.Response.DataInfoList[0].DetailInfoList.forEach(item => {
                xAxis.push(item.Time);
                series.push(item.Online);
              });
              this.xAxis = xAxis;
              this.series = series;
            }
            this.loading = false;
          });
        });
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
</style>
