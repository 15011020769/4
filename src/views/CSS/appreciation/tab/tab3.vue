<template>
  <div class="wrap">
    <h3>录制任务个数{{StartTIme}} 到 {{EndTIme}}（单位：个）</h3>
    <Echart />
    <div class="table">
      <h3>近30天消费量</h3>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        height="450"
        v-loading="loading"
      >
        <el-table-column prop="StreamName" label="月份"></el-table-column>
        <el-table-column prop="StartTime" label="录制任务数量（个）"></el-table-column>
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
import Echart from "../components/echarts";
import { CSS_CODE } from "@/constants";
import moment from "moment";
export default {
  name: "tab2",
  data() {
    return {
      tableData: [], //表格数据
      current: 1, //页数
      pageSize: 10, //每页数量
      totalItems: 0, //总条数
      loading: true //加载状态
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
        StartDayTime: moment(this.StartTIme).format("YYYYMMDD"),
        EndDayTime: moment(this.EndTIme).format("YYYYMMDD"),
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