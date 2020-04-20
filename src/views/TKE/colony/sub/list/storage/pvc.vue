 <!--存储 - PersistentVolumeClaim -->
 <template>
  <div>
    <subTitle title="PersistentVolumeClaim" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goPvcCreate()" size="small" type="primary" :disabled="flag">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right" v-if="searchType">
        <tkeSearch
          typeSelect
          refreshData
          exportData
          :typeLabel="$t('TKE.overview.mmkj')"
          :typeOptions="searchOptions"
          :typeValue="searchType"
          :inputPlaceholder="$t('TKE.storage.qsrgjcss')"
          :searchInput="searchInput"
          @changeType="changeSearchType"
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
            <span @click="goPvcDetail(scope.row)" class="tke-text-link">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('TKE.overview.zt')">
          <template slot-scope="scope">
            <span :class="[scope.row.status.phase =='Pending'?'text-red':'text-green']">{{scope.row.status.phase}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Storage">
          <template slot-scope="scope">
            <span>{{scope.row.status|capacitys}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spec" :label="$t('TKE.storage.fwqx')">
          <template slot-scope="scope">
            <p>{{scope.row.spec.accessModes | accessModess}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="StorageClass">
          <template slot-scope="scope">
            <p>{{scope.row.spec.storageClassName}}</p>
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
      <span>{{$t('TKE.storage.nqdysc')}}PersistentVolumeClaim：{{deleteName}}{{$t('TKE.myMirror.ma')}}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteList()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 <script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyStoragePvc",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      datalist: [],//所有列表数据
      total: 0,
      pageSize: 20,
      pageIndex: 0,
      multipleSelection: [],
      //搜索下拉框
      searchOptions: [],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
      centerDialogVisible: false,
      deleteName: "",
      flag: true
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.nameSpaceList();
  },
  watch: {
    searchInput(val) {
      if (val === "") {
        this.loadShow = true;
        this.getList();
      }
    }
  },
  methods: {
    // 新建
    goPvcCreate() {
      this.$router.push({
        name: "pvcCreate",
        query: {
          clusterId: this.clusterId,
          np: this.searchType
        }
      });
    },
    // 详情
    goPvcDetail(row) {
      this.$router.push({
        name: "pvcDetail",
        query: {
          clusterId: this.clusterId,
          np: this.searchType,
          resourceIns: row.metadata.name
        }
      });
    },
    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      this.loadShow = true;
      this.getList();
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
    },
    //重新整理数据
    refreshList() {
      this.loadShow = true;
      this.getList();
    },
    // 跳转Yaml
    editYaml(row) {
      this.$router.push({
        name: "pvcUpdate",
        query: {
          clusterId: this.$route.query.clusterId,
          resourceIns: row.metadata.name,
          np: this.searchType
        }
      });
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
          this.$t("tke pvc") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 分页
    handleCurrentChange(val) {
      let pageIndex = val - 1;
      let list = this.datalist;
      this.list = list.slice(pageIndex * this.pageSize, (pageIndex + 1) * this.pageSize);
      pageIndex += 1;
      this.pageIndex = pageIndex;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 0;
      this.loadShow = true;
      this.getList();
      // this.getColonyList();
    },
    // 删除
    deleteOne(row) {
      this.deleteName = row.metadata.name;
      this.centerDialogVisible = true;
    },

    //命名空间选项
    nameSpaceList() {
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.loadShow = true;
          this.searchType = mes.items[0].metadata.name;
          //  this.list = mes.items;
          this.flag = false;
          this.getList();
          mes.items.forEach(item => {
            this.searchOptions.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
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
    },
    // 获取列表
    getList() {
      var params = {
        Method: "GET",
        Path:
          "/api/v1/namespaces/" +
          this.searchType +
          "/persistentvolumeclaims",
          // ?limit=" + this.pageSize,
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.list = [];
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items.slice(this.pageIndex, this.pageSize);
          this.datalist = mes.items;
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
          "/api/v1/namespaces/" +
          this.searchType +
          "/persistentvolumeclaims?fieldSelector=metadata.name=" +
          this.searchInput,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.list = [];
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;//.slice(this.pageIndex, this.pageSize);
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
    // 删除列表
    DeleteList() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "DELETE",
        Path:
          "/api/v1/namespaces/" +
          this.searchType +
          "/persistentvolumeclaims/" +
          this.deleteName,
        RequestBody: { propagationPolicy: "Background" },
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.loadShow = true;
          this.centerDialogVisible = false;
          this.getList();
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
    capacitys: function(value) {
      if (value.capacity) {
        return value.capacity.storage;
      } else {
        return "-";
      }
    },
    accessModess: function(value) {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] == "ReadWriteOnce") {
            return "單機讀寫";
          }
        }
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
