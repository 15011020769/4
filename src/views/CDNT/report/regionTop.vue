<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.24')}}</h3>
      <i class="el-icon-download icon" @click="exportEchart" />
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-row class="empty" v-if="seriesMap.length == 0 ? true : false">
          {{$t('CDNT.report.17')}}
        </el-row>
        <echart-map
          :series="seriesMap"
          :total="totalNumber"
          v-loading="loading"
          v-else
        />
      </el-col>
      <el-col :span="8">
        <el-table
          :data="
            tableData.slice((currpage - 1) * pageSize, currpage * pageSize)
          "
          v-loading="loading"
        >
          <el-table-column prop="name" :label="$t('CDNT.report.25')"></el-table-column>
          <el-table-column prop="value" label="消耗量">
            <template slot-scope="scope">
              {{ fluxStr(scope.row.value) }}
            </template>
          </el-table-column>
          <el-table-column label="佔比">
            <template slot-scope="scope">
              {{ totalNumber === 0 ? 0 : fixed((scope.row.value / totalNumber) * 100) }}%
            </template>
          </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{ totalItems }}&nbsp;條</span>
          <el-pagination
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalItems"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import moment from "moment";
import XLSX from "xlsx";
import echartMap from "../components/worldMap";
import { COUNTRY_MAP } from "../components/constants";

export default {
  props: {
    params: Object
  },
  data() {
    let vue = this;
    return {
      seriesMap: [],
      tableData: [], // 表格数据
      COUNTRY_MAP,
      loading: true, // 加载状态
      totalNumber: 1, // 总消耗量
      currpage: 1, // 页数
      pageSize: 6, // 每页数量
      totalItems: 0 // 总条数
    };
  },
  components: {
    echartMap
  },
  filters: {
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
        return [v / 1e3, "KB"].join("");
      }
      return [v, "B"].join("");
    }
  },
  watch: {
    params: {
      handler() {
        this.init();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    exportEchart() {
      const { projectName, domainName, type, times, interval } = this.params;
      let fileName;
      const start = moment(times[0]).format('YYYY-MM-DD');
      const end = moment(times[1]).format('YYYY-MM-DD');
      if (interval === "5min") {
        // 日报
        fileName = `${start}_traffic_distribution.xlsx`;
      } else {
        fileName = `${start}-${end}_traffic_distribution.xlsx`;
      }
      let data = [
        ['統計項目', projectName || '全部項目'],
        ['統計域名', domainName || '全部域名'],
        ['報表類型', type],
        ['開始時間', times[0]],
        ['結束時間', times[1]],
        [],
        ["區域", "消耗量（B）", "佔比（%）"]
      ];
      this.tableData.map(item => {
        data.push([
          item.name,
          item.value,
          ((item.value / this.totalNumber) * 100).toFixed(2)
        ]);
      });
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws);
      XLSX.writeFile(wb, fileName);
    },
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
    init() {
      const {
        projectId,
        type,
        projectName,
        domainName,
        interval,
        times
      } = this.params;

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
      this.getListTopData(params);
    },
    getListTopData(params) {
      this.loading = true;
      const regionsArr = [];
      const tableArr = [];
      let total = 1;
      this.axios
        .post("cdn2/ListTopData", {
          ...params,
          Metric: "District",
          Filter: "flux"
        })
        .then(({ Response }) => {
          if (Response.Data && Response.Data.length) {
            const res = Response.Data[0].DetailData;
            res &&
              res.forEach(v => {
                total += v.Value;
                tableArr.push({
                  name: this.COUNTRY_MAP[v.Name],
                  value: v.Value
                });
              });
            res &&
              res.forEach(v => {
                regionsArr.push({
                  name: this.COUNTRY_MAP[v.Name],
                  value: ((v.Value / total) * 100).toFixed(2)
                });
              });
          }
          this.totalNumber = total;
          this.seriesMap = regionsArr; // 传百分数因为比较的就是百分比
          this.tableData = tableArr;
          this.totalItems = tableArr.length;
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.currpage = val;
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
.Right-style {
  display: flex;
  justify-content: space-between;

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
    line-height: 62px;
  }
  .el-pagination {
    border-bottom: none;
  }
}
.empty {
  height: 480px;
  width: 100%;
  line-height: 480px;
  text-align: center;
  font-weight: bold;
}
</style>
