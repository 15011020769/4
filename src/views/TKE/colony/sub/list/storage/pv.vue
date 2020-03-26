 <!--存储 - PersistentVolume -->
<template>
  <div>
    <subTitle title="PersistentVolume" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goPvCreate()" size="small" type="primary">新建</el-button>
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
    <div class="tke-card mt10">
      <el-table :data="list" v-loading="loadShow" style="width: 100%" id="exportTable">
        <el-table-column :label="$t('TKE.overview.mc')" prop="metadata">
          <template slot-scope="scope">
            <div @click="goPvDetail(scope.row)" class="tke-text-link">{{scope.row.metadata.name}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="status" :label="$t('TKE.overview.zt')">
          <template slot-scope="scope">
            <p :class="[scope.row.status.phase =='Pending'?'text-red':'text-green']">{{scope.row.status.phase}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="spec" :label="$t('TKE.storage.fwqx')">
          <template slot-scope="scope">
            <p>{{scope.row.spec.accessModes|accessModess}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="spec" label="回收策略">
          <template slot-scope="scope">
            <p>{{scope.row.spec.persistentVolumeReclaimPolicy}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="PVC">
          <template slot-scope="scope">
            <!-- {{scope.row.spec.persistentVolumeReclaimPolicy}} -->
            <p>{{scope.row.spec|claimRefs}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="StorageClass">
          <template slot-scope="scope">
            <div>{{scope.row.spec.storageClassName}}</div>
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
    </div>
    <!-- 删除提示 -->
    <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="centerDialogVisible" width="30%">
      <span>{{$t('TKE.storage.nqdysc')}}PersistentVolume：{{deleteName}}{{$t('TKE.myMirror.ma')}}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeletePersistentVolume()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  name: "colonyStoragePv",
  data() {
    return {
      loadShow: true, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      searchInput: "", //输入的搜索关键字
      deleteName: "",
      centerDialogVisible: false
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.GetPersistentVolume();
  },
  watch: {
    searchInput(val) {
      if (val === "") {
        this.loadShow = true;
        this.GetPersistentVolume();
      }
    }
  },
  methods: {
    // 新建
    goPvCreate() {
      this.$router.push({
        name: "pvCreate",
        query: {
          clusterId: this.clusterId
        }
      });
    },
    // 详情
    goPvDetail(row) {
      this.$router.push({
        name: "pvDetail",
        query: {
          clusterId: this.clusterId,
          resourceIns: row.metadata.name
        }
      });
    },

    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      console.log(this.searchType);
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.loadShow = true;
      this.SearchPersistentVolume();
      // console.log(this.searchInput)
    },
    //重新整理数据
    refreshList() {
      this.loadShow = true;
      this.GetPersistentVolume();
    },
    // 删除
    deleteOne(row) {
      this.deleteName = row.metadata.name;
      this.centerDialogVisible = true;
    },
    // 删除一行数据
    // deleteOne(row){
    //     this.loadShow = true
    //     this.DeletePersistentVolume(row.metadata.name)
    //     this.GetPersistentVolume()
    // },
    // 跳转Yaml
    editYaml(row) {
      this.$router.push({
        name: "pvUpdate",
        query: {
          clusterId: this.$route.query.clusterId,
          resourceIns: row.metadata.name
        }
      });
    },
    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
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
          this.$t("tke_pv") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadShow = true;
      this.GetPersistentVolume();
    },

    // 获取pv列表
    GetPersistentVolume() {
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/api/v1/persistentvolumes?limit=" + this.pageSize,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          let data = JSON.parse(res.Response.ResponseBody);
          console.log(data);
          this.list = data.items;
          console.log(this.list);
          this.total = data.items.length;
          // this.delete = []
          this.loadShow = false;
        } else {
          this.$message({
            message: ErrorTips[res.Response.Error.code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 查询PV
    SearchPersistentVolume() {
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path:
          "/api/v1/persistentvolumes?fieldSelector=metadata.name=" +
          this.searchInput,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          let data = JSON.parse(res.Response.ResponseBody);
          console.log(data);
          this.list = data.items;
          this.loadShow = false;
        } else {
          this.$message({
            message: ErrorTips[res.Response.Error.code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 删除pv
    DeletePersistentVolume() {
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "DELETE",
        Path: "/api/v1/persistentvolumes/" + this.deleteName,
        RequestBody: { propagationPolicy: "Background" },
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          this.loadShow = true;
          this.centerDialogVisible = false;
          this.GetPersistentVolume();
          this.$message({
            message: this.$t('TKE.myMirror.sccg'),
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.$message({
            message: ErrorTips[res.Response.Error.code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  filters: {
    accessModess: function(value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] == "ReadWriteOnce") {
          return "單機讀寫";
        }
      }
    },
    claimRefs: function(value) {
      console.log(value.claimRef);
      if (value.claimRef == "" || value.claimRef == undefined) {
        return "-";
      } else if (value) {
        return value.claimRef.name;
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

