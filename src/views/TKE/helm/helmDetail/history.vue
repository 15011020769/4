<template>
  <div style="padding:20px;">
    <el-table :data="tableData" style="width: 100%" v-loading="loadShow">
      <el-table-column prop="release" :label="$t('TKE.overview.yym')">
        <template slot-scope="scope">{{scope.row.one.release.name}}</template>
      </el-table-column>
      <el-table-column prop="release" :label="$t('TKE.overview.bsxq')">
        <template
          slot-scope="scope"
        >{{scope.row.one.release.chart.metadata.name}}@{{scope.row.one.release.chart.metadata.version}}</template>
      </el-table-column>
      <el-table-column prop="release" label="描述">
        <template slot-scope="scope">{{scope.row.one.release.info.Description}}</template>
      </el-table-column>
      <el-table-column prop="release" :label="$t('TKE.overview.zt')">
        <template slot-scope="scope">
          <div
            :style="{'color': (scope.row.three=='DEPLOYED' ? '#0abf5b':'')}"
          >{{scope.row.three|codes}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="release" :label="$t('TKE.overview.bbh')">
        <template slot-scope="scope">{{scope.row.two}}</template>
      </el-table-column>
      <el-table-column prop="release" :label="$t('TKE.overview.bssj')">
        <template
          slot-scope="scope"
        >{{scope.row.one.release.info.first_deployed|creationTimestamps}}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <a v-if="scope.$index != 0" style="cursor:pointer" @click="goOut(scope.row.two)">回滾</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { POINT_REQUEST } from "@/constants";
export default {
  data() {
    return {
      tableData: [],
      loadShow: true,
      version: Number
    };
  },
  created() {
    // this.getHelmDetail()
    this.getHelmList();
  },
  methods: {
    // 详情2
    getHelmList() {
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path:
          "/apis/platform.tke/v1/clusters/" +
          this.$route.query.clusterId +
          "/helm/tiller/v2/releases/" +
          this.$route.query.helmName +
          "/content/json?max=10",
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          this.version = JSON.parse(res.Response.ResponseBody).release.version;
          this.tableData = [];
          for (let i = this.version; i > 0; i--) {
            this.tableData.push({
              one: JSON.parse(res.Response.ResponseBody),
              two: i,
              three: i == this.version ? "DEPLOYED" : "SUPERSEDED"
            });
          }
          // this.tableData = JSON.parse(res.Response.ResponseBody)
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 回滚
    goOut(val) {
      this.loadShow = true;
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path:
          "/apis/platform.tke/v1/clusters/" +
          this.$route.query.clusterId +
          "/helm/tiller/v2/releases/" +
          this.$route.query.helmName +
          "/rollback/json?version=" +
          val,
        // "/apis/platform.tke/v1/clusters/cls-lpd4iaww/helm/tiller/v2/releases/asd67/rollback/json?version=7"
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          this.getHelmList();
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  filters: {
    codes: function(value) {
      if (value == "DEPLOYED") {
        return "正常";
      } else if (value == "DELETED") {
        return "已刪除";
      } else if (value == "DELETING") {
        return "正在刪除";
      } else if (value == "SUPERSEDED") {
        return "已廢棄";
      } else if (value == "FAILED") {
        return "異常";
      } else if (value == "UNHEALTHY") {
        return "異常";
      } else {
        return "-";
      }
    },
    creationTimestamps: function(value) {
      var d = new Date(value);
      var n = d.getFullYear();
      var y = d.getMonth() + 1;
      var r = d.getDate();
      var h = d.getHours(); //12
      var m = d.getMinutes(); //12
      var s = d.getSeconds();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;
      return n + "-" + y + "-" + r + " " + h + ":" + m + ":" + s;
    },
    versions: function(val) {
      return val;
    }
  }
};
</script>
