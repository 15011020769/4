 <!--配置管理 - Secret -->
<template>
  <div>
    <subTitle title="Secret" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goSecretCreate()" size="small" type="primary">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          typeSelect
          refreshData
          exportData
          :typeLabel="$t('TKE.overview.mmkj')"
          :typeOptions="searchOptions"
          :typeValue="searchType"
          :inputPlaceholder="$t('TKE.subList.qsrgjzss')"
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
        <el-table-column :label="$t('TKE.overview.mc')">
          <template slot-scope="scope">
            <span
              @click="goSecretDetail(scope.row)"
              class="tke-text-link"
            >{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.overview.lx')">
          <template slot-scope="scope">
            <p>{{scope.row.type}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="Labels">
          <template slot-scope="scope">
            <p
              v-if="scope.row.metadata.labels"
            >{{Object.keys(scope.row.metadata.labels).toString()}}:{{Object.values(scope.row.metadata.labels).toString()}}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('TKE.overview.cjsj')">
          <template slot-scope="scope">
            <p>
              {{scope.row.metadata.creationTimestamp.substring(0,10)}}
              <br />
              {{scope.row.metadata.creationTimestamp.substring(11,19)}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="editYaml(scope.row)">{{$t('TKE.overview.bj')}}YAML</span>
            <span class="tke-text-link ml10" @click="deleteNameSpace(scope.row)">{{$t('TKE.overview.sc')}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            :pager-count="7"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="showNameSpaceModal" width="35%">
        <p style="color:#444;font-weight:bolder;">{{$t('TKE.storage.nqdysc')}}Secret：{{nameSpaceName}}嗎？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">{{$t('TKE.overview.qd')}}</el-button>
          <el-button @click="showNameSpaceModal = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ALL_CITY, POINT_REQUEST, TKE_COLONY_QUERY } from "@/constants";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  name: "colonyConfigSecret",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      dataList: [],//所有数据列表
      total: 0,
      pageSize: 20,
      pageIndex: 0,
      multipleSelection: [],
      showNameSpaceModal: false, //是否显示删除框
      nameSpaceName: "",
      useName:"",
      //搜索下拉框
      searchOptions: [],
      searchType: "default", //下拉选中的值
      searchInput: "" //输入的搜索关键字
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.nameSpaceList();
    this.getData();
  },
  methods: {
    getData() {
      this.loadShow = true;
      //获取列表数据
      if (this.searchInput == "") {
        var params = {
          Method: "GET",
          Path:
            "/api/v1/namespaces/" +
            this.searchType + "/secrets",
            // ?&limit=" + this.pageSize,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      } else {
        var params = {
          Method: "GET",
          Path:
            "/api/v1/namespaces/" +
            this.searchType +
            "/secrets?fieldSelector=metadata.name=" +
            this.searchInput,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      }

      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          this.list = [];
          var mes = JSON.parse(res.Response.ResponseBody);
          // this.list = mes.items;
          this.list = mes.items.slice(this.pageIndex, this.pageSize);
          this.dataList = mes.items || [];
          this.total = mes.items.length;
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
    //命名空间选项
    nameSpaceList() {
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.total = mes.items.length;
          mes.items.forEach(item => {
            this.searchOptions.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
          });
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
    // 新建
    goSecretCreate() {
      this.$router.push({
        name: "secretCreate",
        query: {
          clusterId: this.clusterId
        }
      });
    },
    editYaml(item){//编辑
       this.$router.push({
        name: "updateYamlSecret",
        query: {
          clusterId: this.clusterId,
          name: item.metadata.name,
          np: item.metadata.namespace
        }
      });
    },
    // 详情
    goSecretDetail(data) {
      this.$router.push({
        name: "secretDetail",
        query: {
          clusterId: this.clusterId,
          name: data.metadata.name,
          np: data.metadata.namespace
        }
      });
    },
    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      this.getData();
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      if (val === "") {
        this.getData();
      }
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getData();
    },
    //重新整理数据
    refreshList() {
      this.getData();
    },
    // 导出表格
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
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
          this.$t("CVM.clBload.fzjh") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      let pageIndex = val - 1;
      let list = this.dataList;
      this.list = list.slice(pageIndex * this.pageSize, (pageIndex + 1) * this.pageSize);
      pageIndex += 1;
      this.pageIndex = pageIndex;
    },
    handleSizeChange(val) {
      this.pageIndex = 0;
      this.pageSize = val;
      this.getData();
    },
    //打开删除
    deleteNameSpace(row) {
      this.useName=row.metadata.name
      this.showNameSpaceModal = true;
      this.nameSpaceName = row.metadata.name;
    },
    //删除
    async submitDelete() {
      this.loadShow = true;
      const param = {
        Method: "DELETE",
        Path: "/api/v1/namespaces/" + this.searchType+"/secrets/"+this.useName,//default/secrets
        Version: "2018-05-25",
        RequestBody: { propagationPolicy: "Background" },
        ClusterName: this.clusterId
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
           this.getData();
          this.showNameSpaceModal = false;
          this.loadShow = false;
           this.$message({
            message: "刪除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.loadShow = false;
          let ErrTips = {
          };
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
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
</style>

