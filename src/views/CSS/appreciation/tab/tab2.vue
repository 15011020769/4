<template>
  <div class="wrap">
    <p class="down">
      <el-row>
        <h3 style="font-size: 14px;font-weight: 700;">转码时长{{StartTIme}} 到 {{EndTIme}}（单位：分钟）</h3>
      </el-row>
      <el-row class="iconBtn">
        <i class="el-icon-download"></i>
      </el-row>
    </p>
    <Echart :xAxis="xAxis" :series="series" :legendText="legendText" v-loading="loading" />
    <div class="table">
      <h3>近30天消费量</h3>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        v-loading="loading"
      >
        <el-table-column prop="StreamName" label="StreamName"></el-table-column>
        <el-table-column prop="StartTime" label="开始转码时间"></el-table-column>
        <el-table-column prop="EndTime" label="结束转码时间"></el-table-column>
        <el-table-column prop="Duration" label="转码时长（分钟）"></el-table-column>
        <el-table-column prop="ModuleCodec" label="编码方式"></el-table-column>
        <el-table-column prop="Bitrate" label="码率（Kbps）"></el-table-column>
        <el-table-column prop="Type" label="类型"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
        <el-pagination
          :page-size="pageSize"
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
import { CSS_CODE, CSS_CODECHARTS } from "@/constants";
import moment from "moment";
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
      legendText: '转码时长'
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
  created() {
    this.init();
    this.getCharts();
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.current = val;
      this.init();
    },
    //获取表格数据
    init() {
      this.loading = true;
      const params = {
        Version: "2018-08-01",
        StartDayTime: moment().subtract(31, 'days').format("YYYYMMDD"),
        EndDayTime: moment().format("YYYYMMDD"),
        PageSize: this.pageSize,
        PageNum: this.current
      };
      this.axios.post(CSS_CODE, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          this.tableData = res.Response.DataInfoList;
          this.totalItems = res.Response.TotalNum;
        }
        this.loading = false;
      });
    },
    // 获取图表数据
    getCharts() {
      this.loading = true;
      const axixArr = []
      const seriesArr = []
      const params = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
      };
      this.axios.post(CSS_CODECHARTS, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          res.Response.DataInfoList.map(v => {
            axixArr.push(v.Time)
            seriesArr.push(v.Duration)
          })
          this.xAxis = axixArr
          this.series = seriesArr
        }
        this.loading = false;
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