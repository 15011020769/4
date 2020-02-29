 <!--工作负载- DaemonSet -->
<template>
  <div>
    <subTitle title="DaemonSet" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goWorkloadCreate('daemonSet')" size="small" type="primary">新建</el-button>
        <el-button size="small" @click="flag=!flag">监控</el-button>
      </div>
      <!-- 抽屉 -->
      <div class="dra" v-if="flag">
        <openDrawer :flag="flag" title="工作负载监控" @changeFlag="setFlag" @setTime="setTime"></openDrawer>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <div>
          <span>命名空间</span>
          <el-select
            size="mini"
            v-model="searchType"
            placeholder="请选择"
            @change="changeSearchType()"
            style="margin-bottom:5px;"
          >
            <el-option
              v-for="item in searchOptions"
              :key="item.metadata.name"
              :value="item.metadata.name"
            ></el-option>
          </el-select>
        </div>
        <tkeSearch
          refreshData
          exportData
          :typeValue="searchType"
          inputPlaceholder="请输入关键词搜索"
          :searchInput="searchInput"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh="refreshList"
          @exportExcel="exportExcel"
        ></tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        @selection-change="handleSelectionChange"
        v-loading="loadShow"
        id="exportTable"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span
              class="tke-text-link"
              @click="goDaemonSetDetail(scope.row)"
            >{{scope.row.metadata && scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="Labels">
          <template slot-scope="scope">
            <span>{{scope.row.metadata && scope.row.metadata.labels | changeLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="Selector">
          <template slot-scope="scope">
            <span>{{scope.row.spec && scope.row.spec.selector && scope.row.spec.selector.matchLabels | changeSelector}}</span>
          </template>
        </el-table-column>

        <el-table-column prop label="运行/期望Pod数量">
          <template slot-scope="scope">
            <span>{{scope.row.status && scope.row.status.numberReady || 0}}/{{scope.row.status && scope.row.status.desiredNumberScheduled || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goPodUpdate('number',scope.row)">更新Pod数量</span>
            <span class="tke-text-link ml10" @click="goPodUpdate('config')">更新Pod配置</span>
            <el-dropdown class="tke-dropdown">
              <span class="el-dropdown-link ml10">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <span class="tke-text-link">重新部署</span>
                </el-dropdown-item>
                <el-dropdown-item command="a">
                  <span class="tke-text-link">设置更新策略</span>
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <span class="tke-text-link">更新调度策略</span>
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <span class="tke-text-link">编辑YAML</span>
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <span class="tke-text-link">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import openDrawer from "./components/openDrawer";
import moment from "moment";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyResourceDaemonSet",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: "", //集群id
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [], //全选数据
      flag: false, //是否显示抽屉
      searchOptions: [], //命名空间列表
      searchType: "", //下拉选中的值
      searchInput: "" //输入的搜索关键字
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.getNameSpaceList();
  },
  methods: {
    //启动时获取DaemonSet列表数据
    async getNameSpaceList() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      };

      await this.axios.post(POINT_REQUEST, param).then(async res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          //默认选中第一项
          let nameSpace = response.items[0];
          this.searchType = nameSpace.metadata.name;
          this.searchOptions = response.items;
          this.loadShow = true;
          let params = {};
          if (this.searchInput === "") {
            params = {
              Method: "GET",
              Path:
                "/apis/apps/v1beta2/namespaces/" +
                nameSpace.metadata.name +
                "/daemonsets?limit=" +
                this.pageSize,
              Version: "2018-05-25",
              ClusterName: this.clusterId
            };
          } else {
            params = {
              Method: "GET",
              Path:
                "/apis/apps/v1beta2/namespaces/" +
                nameSpace.metadata.name +
                "/daemonsets?fieldSelector=metadata.name=" +
                this.searchInput,
              Version: "2018-05-25",
              ClusterName: this.clusterId
            };
          }
          await this.axios.post(POINT_REQUEST, params).then(res1 => {
            if (res1.Response.Error === undefined) {
              this.loadShow = false;
              let response1 = JSON.parse(res1.Response.ResponseBody);
              if (response1.items.length > 0) {
                response1.items.map(stateful => {
                  stateful.addTime = moment(
                    stateful.metadata.creationTimestamp
                  ).format("YYYY-MM-DD HH:mm:ss");
                });
              }
              this.list = response1.items;
              this.total = response1.items.length;
            } else {
              this.loadShow = false;
              let ErrTips = {};
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res1.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          });
        } else {
          this.loadShow = false;
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
    //获取DaemonSet列表
    async getDaemonSetList() {
      this.loadShow = true;
      let params = {};
      if (this.searchInput === "") {
        params = {
          Method: "GET",
          Path:
            "/apis/apps/v1beta2/namespaces/" +
            this.searchType +
            "/daemonsets?limit=" +
            this.pageSize,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      } else {
        params = {
          Method: "GET",
          Path:
            "/apis/apps/v1beta2/namespaces/" +
            this.searchType +
            "/daemonsets?fieldSelector=metadata.name=" +
            this.searchInput,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      }
      await this.axios.post(POINT_REQUEST, params).then(res1 => {
        if (res1.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res1.Response.ResponseBody);
          this.list = response.items;
          this.total = response.items.length;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res1.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 新建
    goWorkloadCreate(type) {
      this.$router.push({
        name: "workloadCreate",
        query: {
          type: type,
          clusterId: this.clusterId
        }
      });
    },
    //更新pod
    goPodUpdate(type) {
      this.$router.push({
        name: "podUpdate",
        query: {
          type: type,
          clusterId: this.clusterId
        }
      });
    },
    //跳转详情
    goDaemonSetDetail(rowData) {
      this.$router.push({
        name: "daemonSetDetail",
        query: {
          clusterId: this.clusterId,
          spaceName: this.searchType,
          rowData: rowData,
          daemonSetList: this.list
        }
      });
    },
    //选择搜索条件
    changeSearchType(val) {
      this.getDaemonSetList();
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getDaemonSetList();
    },
    //刷新数据
    refreshList() {
      this.getDaemonSetList();
    },
    setFlag(data) {
      this.flag = data;
    },
    setTime(data) {},
    // 导出表格
    exportExcel() {
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          this.$t("tke-nodeList") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.getDaemonSetList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDaemonSetList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  filters: {
    //转换label
    changeLabel(value) {
      if (value) {
        let labels = "";
        for (let i in value) {
          labels += i + " : " + value[i] + "、";
        }
        return labels.substring(0, labels.length - 1);
      } else {
        return "-";
      }
    },
    //转换Selector
    changeSelector(value) {
      if (value) {
        let labels = "";
        for (let i in value) {
          labels += i + " : " + value[i] + "、";
        }
        return labels.substring(0, labels.length - 1);
      } else {
        return "-";
      }
    }
  },
  components: {
    subTitle,
    tkeSearch,
    Loading,
    openDrawer
  }
};
</script>

<style lang="scss" scoped>
</style>

