<template>
  <el-card style="height: 630px">
    <el-row type="flex" class="header" justify="space-between">
      <h3>TOP10 URL</h3>
      <i class="el-icon-download icon" @click="exportTable(type)" />
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="used">使用量</el-radio-button>
      <el-radio-button label="request">请求数</el-radio-button>
    </el-radio-group>
    <el-table :data="fluxTableData" v-if="type == 'used'" v-loading="loading">
      <el-table-column prop="Name" label="URL"></el-table-column>
      <el-table-column prop="Value" label="流量">
        <template slot-scope="scope">
          {{ fluxStr(scope.row.Value) }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="RequestTableData"
      v-if="type == 'request'"
      v-loading="loading"
    >
      <el-table-column prop="Name" label="URL"></el-table-column>
      <el-table-column prop="Value" label="请求数">
        <template slot-scope="scope">
          {{ scope.row.Value }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import moment from "moment";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  props: {
    params: Object
  },
  data() {
    return {
      type: "used",
      fluxTableData: [],
      RequestTableData: [],
      loading: true
    };
  },
  watch: {
    params: {
      handler() {
        this.init();
      },
      immediate: true,
      deep: true
    },
    type(val) {
      this.init();
    }
  },
  filters: {
    formatValue(value) {
      if (value >= 1000) {
        value = (value / 1000).toFixed(2) + "KB";
      } else {
        value = value + "B";
      }
      return value;
    }
  },
  methods: {
    fixed(v) {
      return Math.ceil(v) !== v ? v.toFixed(2) : v;
    },
    fluxStr(v) {
      if (v > 1e12) {
        return [v / 1e12, "TB"].join("");
      }
      if (v > 1e9) {
        return [v / 1e9, "GB"].join("");
      }
      if (v > 1e6) {
        return [v / 1e6, "MB"].join("");
      }
      if (v > 1e3) {
        return [this.fixed(v / 1e3), "KB"].join("");
      }
      return [v, "B"].join("");
    },
    exportTable(type1) {
      const { projectName, domainName, type, times, interval } = this.params;
      let fileName;
      const start = times[0].split(" ")[0];
      const end = times[1].split(" ")[0];
      let data = [
        ["统计项目", projectName || "全部项目"],
        ["统计域名", domainName || "全部域名"],
        ["报表类型", type],
        ["开始时间", times[0]],
        ["结束时间", times[1]],
        []
      ];
      let name;
      if (type1 == "used") {
        data.push(["URL", "流量（B）"]);
        name = "flux";
        this.fluxTableData.map(item => {
          data.push([item.Name, item.Value]);
        });
      } else {
        data.push(["URL", "请求数（次）"]);
        name = "request";
        this.RequestTableData.map(item => {
          data.push([item.Name, item.Value]);
        });
      }
      if (interval === "5min") {
        // 日报
        fileName = `1300561189-overseas-${start}_${name}_top10_urls.xlsx`;
      } else {
        fileName = `1300561189-overseas-${start}-${end}_${name}_top10_urls.xlsx`;
      }
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${name}_top10_urls`);
      XLSX.writeFile(wb, fileName);
    },
    init() {
      const { projectId, domainName, interval, times } = this.params;

      const params = {
        Version: "2018-06-06",
        StartTime: times[0],
        EndTime: times[1],
        Area: "overseas"
      };
      if (projectId) {
        params.Project = projectId;
      }
      if (domainName) {
        params["Domains.0"] = domainName;
      }
      if (this.type === "used") {
        this.getFluxTopData(params);
      } else {
        this.getRequestTopData(params);
      }
    },
    getFluxTopData(params) {
      this.loading = true;
      let detailData = [];
      this.axios
        .post("cdn2/ListTopData", {
          ...params,
          Metric: "url",
          Filter: "flux"
        })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            detailData = Response.Data[0].DetailData;
          }
          this.fluxTableData = detailData;
          this.loading = false;
        });
    },
    getRequestTopData(params) {
      this.loading = true;
      let res = [];
      this.axios
        .post("cdn2/ListTopData", {
          ...params,
          Metric: "url",
          Filter: "request"
        })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            res = Response.Data[0].DetailData;
          }
          this.RequestTableData = res;
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
.icon {
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
</style>
