 <!--存储 - StorageClass -->
<template>
  <div>
    <subTitle title="StorageClass" />
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goScCreate()" size="small" type="primary">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          refreshData
          exportData
          :inputPlaceholder="$t('TKE.storage.qsrgjcss')"
          :searchInput="searchInput"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh="refreshList"
          @exportExcel="exportExcel"
        ></tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10" >
      <el-table :data="list" v-loading="loadShow" style="width: 100%" id="exportTable">
        <el-table-column prop="metadata" :label="$t('TKE.overview.mc')">
          <template slot-scope="scope">
            <span @click="goScDetail(scope.row)" class="tke-text-link">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="provisioner" :label="$t('TKE.overview.ly')">
          <template slot-scope="scope">
            <p>{{scope.row.provisioner}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="parameters" :label="$t('TKE.storage.yplx')">
          <template slot-scope="scope">
            <span>{{scope.row.parameters.type|parameterss}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="parameters" :label="$t('TKE.storage.jfms')" width="100">
          <template slot-scope="scope">
            <p>{{scope.row.parameters.paymode|paymodes}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="reclaimPolicy" label="回收策略" width="100">
          <template slot-scope="scope">
            <p>{{scope.row.reclaimPolicy}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="metadata" :label="$t('TKE.overview.cjsj')">
          <template slot-scope="scope">
            <p>{{scope.row.metadata.creationTimestamp|creationTimestamps}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="editYaml(scope.row)">{{$t('TKE.overview.bj')}}YAML</span>
            <span class="tke-text-link ml10" @click="deleteOne(scope.row)">{{$t('TKE.overview.sc')}}</span>
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
      <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="centerDialogVisible" width="30%">
        <span>{{$t('TKE.storage.nqdysc')}}StorageClass：{{deleteName}}{{$t('TKE.myMirror.ma')}}？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DeleteList()">{{$t('TKE.overview.qd')}}</el-button>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyStorageSc",
  data() {
    return {
      loadShow: true, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      centerDialogVisible: false,
      searchInput: "", //输入的搜索关键字
      deleteName: ""
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.GetList();
  },
  watch: {
    searchInput(val) {
      if (val === "") {
        this.loadShow = true;
        this.GetList();
      }
    }
  },
  methods: {
    // 新建
    goScCreate() {
      this.$router.push({
        name: "scCreate",
        query: {
          clusterId: this.clusterId
        }
      });
    },

    // 详情
    goScDetail(row) {
      this.$router.push({
        name: "scDetail",
        query: {
          clusterId: this.clusterId,
          resourceIns: row.metadata.name
        }
      });
    },
    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.loadShow = true;
      this.SearchList();
      // this.GetList()
    },
    //重新整理数据
    refreshList() {
      this.loadShow = true;
      this.GetList();
    },
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
          this.$t("tke sc") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      // this.getColonyList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadShow = true;
      this.GetList();
      // this.getColonyList();
    },
    deleteOne(row) {
      this.deleteName = row.metadata.name;
      this.centerDialogVisible = true;
    },
    // 跳转Yaml
    editYaml(row) {
      this.$router.push({
        name: "scUpdate",
        query: {
          clusterId: this.$route.query.clusterId,
          resourceIns: row.metadata.name
        }
      });
    },
    // 获取列表
    GetList() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/apis/storage.k8s.io/v1/storageclasses?limit=" + this.pageSize,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    // 查询列表
    SearchList() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path:
          "/apis/storage.k8s.io/v1/storageclasses?fieldSelector=metadata.name=" +
          this.searchInput,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    // 删除列表
    DeleteList() {
      this.centerDialogVisible = false;
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "DELETE",
        Path: "/apis/storage.k8s.io/v1/storageclasses/" + this.deleteName,
        RequestBody: { propagationPolicy: "Background" },
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          //  this.list = mes.items;
          this.loadShow = true;
          this.GetList();
          this.$message({
            message: this.$t('TKE.myMirror.sccg'),
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    }
  },
  filters: {
    parameterss: function(value) {
      if (value == "CLOUD_PREMIUM") {
        return "高性能雲硬碟";
      } else if (value == "CLOUD_SSD") {
        return "SSD雲硬碟";
      } else {
        return "普通雲硬碟";
      }
    },
    paymodes: function(value) {
      if (value == "POSTPAID") {
        return "按量計費";
      } else if (value == "PREPAID") {
        return "包年包月";
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
    }
  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
</style>

