<template>
  <div class="wrap">
    <h3>
      流量趋势
      <span style="color:#bbb;">(单位:MB)</span>
    </h3>
    <Echart
      color="#fa970c"
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
        <el-table-column prop="Time" label="时间点"></el-table-column>
        <el-table-column prop="Request" label="请求数"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
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
import Echart from "../../components/line";
import { CSS_PLAY, CSS_MBPS } from "@/constants";
import moment from "moment";
export default {
  name: "tab3",
  data() {
    return {
      DataInfoList: [],
      //图表数据
      xAxis: [],
      series: [],
      legendText: '请求数',
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
    domain: Array,
    operator: String,
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
    getData(params, arrTotal) {
      let arrDetail = []
      this.axios.post(CSS_PLAY, params).then(res => {
        // console.log(res, 2)
        if (res.Response.Error) {
          if (
            res.Response.Error.Message ==
            "EndTime minus StartTime should smaller than 86400 s"
          ) {
            this.$message.error("该模式暂不支持查询一天之外的数据");
          } else {
            this.$message.error(res.Response.Error.Message);
          }
        } else {
          var data = [];
          console.log(res)
          arrTotal.push(res.Response.DataInfoList[0].DetailInfoList)
          arrDetail = arrTotal.reduce(function (a, b) { return a.concat(b)}).sort((a, b) => moment(a.Time) - moment(b.Time));
          arrDetail.forEach(
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
          arrDetail.forEach(item => {
            xAxis.push(item.Time);
            series.push(item.Request);
          });
          this.xAxis = xAxis;
          this.series = series;
        }
        this.loading = false;
      });
    },
    //获取表格数据
    init() {
      this.loading = true;
      const params = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
        "ProvinceNames.0": "Taiwan",
      };
      if (this.operator) {
        params["IspNames.0"] = this.operator
      }
       if (this.domain.length != 0) {
        this.domain.forEach((item, index) => {
          params["PlayDomains." + index] = item;
        });
      }
      const param = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss")
      };
      var Granularity =
        moment(this.EndTIme).format("YYYYMMDD") -
        moment(this.StartTIme).format("YYYYMMDD");
      if (Granularity < 3) {
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
          if (moment(this.StartTIme).format("YYYY-MM-DD") != moment(this.EndTIme).format("YYYY-MM-DD")) {
            let timeArr = []
            let strArr = {}
            const arrTotal = []
            const diff = moment(this.EndTIme).diff(this.StartTIme, 'days')
            for (var i = 0; i <= diff; i++) {
              const params = {
                Version: "2018-08-01",
                "ProvinceNames.0": "Taiwan",
              };
               if (this.operator) {
                  params["IspNames.0"] = this.operator
                }
              params.StartTime = moment(this.EndTIme).subtract(i, "days").startOf("days").format('YYYY-MM-DD HH:mm:ss')
              params.EndTime = moment(this.EndTIme).subtract(i, "days").endOf("days").format('YYYY-MM-DD HH:mm:ss')
              this.getData(params, arrTotal)
            }
          } else {
            this.axios.post(CSS_PLAY, params).then(res => {
              if (res.Response.Error) {
                if (
                  res.Response.Error.Message ==
                  "EndTime minus StartTime should smaller than 86400 s"
                ) {
                  this.$message.error("该模式暂不支持查询一天之外的数据");
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
                this.tableData.forEach(item => {
                  xAxis.push(item.Time);
                  series.push(item.Request);
                });
                this.xAxis = xAxis;
                this.series = series;
              }
              this.loading = false;
            });
          }
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