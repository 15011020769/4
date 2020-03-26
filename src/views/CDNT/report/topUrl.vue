<template>
  <el-card style="height: 650px">
    <el-row type="flex" class="header" justify="space-between">
      <h3>TOP10 URL</h3>
      <i class="el-icon-download icon" @click="exportTable(type)" />
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="used">{{$t('CDNT.report.26')}}</el-radio-button>
      <el-radio-button label="request">{{$t('CDNT.report.11')}}</el-radio-button>
    </el-radio-group>
    <el-table :data="fluxTableData" v-if="type == 'used'" v-loading="loading">
      <el-table-column prop="Name" label="URL"></el-table-column>
      <el-table-column prop="Value" :label="$t('CDNT.report.9')">
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
      <el-table-column prop="Value" :label="$t('CDNT.report.11')">
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
        return [this.fixed(v / 1e12), "TB"].join("");
      }
      if (v > 1e9) {
        return [this.fixed(v / 1e9), "GB"].join("");
      }
      if (v > 1e6) {
        return [this.fixed(v / 1e6), "MB"].join("");
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
        ['統計項目', projectName || '全部項目'],
        ['統計域名', domainName || '全部域名'],
        ['報表類型', type],
        ['開始時間', times[0]],
        ['結束時間', times[1]],
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
        data.push(["URL", "請求數（次）"]);
        name = "request";
        this.RequestTableData.map(item => {
          data.push([item.Name, item.Value]);
        });
      }
      if (interval === "5min") {
        // 日报
        fileName = `${start}_${name}_top10_urls.xlsx`;
      } else {
        fileName = `${start}-${end}_${name}_top10_urls.xlsx`;
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
