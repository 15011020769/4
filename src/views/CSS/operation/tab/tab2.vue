<template>
  <div class="wrap">
    <h3>
      流量趨勢
      <span style="color:#bbb;">(單位:MB)</span>
    </h3>
    <Echart
      color="#0accac"
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
        <el-table-column prop="Flux" label="流量(MB)"></el-table-column>
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
import Echart from "../../components/line";
import { CSS_MBPS } from "@/constants";
import moment from "moment";
export default {
  name: "tab2",
  data() {
    return {
      //图表数据
      xAxis: [],
      series: [],
      legendText: '流量',
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
    domainsData: Array,
    domainCheckedListCopy: Array,
  },
  created() {
    this.init();
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      // this.init();
    },
    //获取表格数据
    init() {
      this.loading = true;
      const params1 = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
      };
      const params2 = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
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
      this.axios.post(CSS_MBPS, params1).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          // 表格数据
          this.tableData = res.Response.DataInfoList;
          this.totalItems = res.Response.DataInfoList.length;
        }
        this.loading = false;
      });
      this.axios.post(CSS_MBPS, params2).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          // 图表数据
          var xAxis = [];
          var series = [];
          res.Response.DataInfoList.forEach(item => {
            xAxis.push(item.Time);
            series.push(item.Flux);
          });
          this.xAxis = xAxis;
          this.series = series;
        }
        this.loading = false;
      });
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
