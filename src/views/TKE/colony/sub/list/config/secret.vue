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
          typeLabel="命名空间"
          :typeOptions="searchOptions"
          :typeValue="searchType"
          inputPlaceholder="请输入关键词搜索"
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
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span @click="goSecretDetail()" class="tke-text-link">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="类型">
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

        <el-table-column prop label="创建时间">
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
            <span class="tke-text-link">编辑YAML</span>
            <span class="tke-text-link ml10" @click="deleteNameSpace(scope.row)">删除</span>
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

      <el-dialog title="删除资源" :visible.sync="showNameSpaceModal" width="35%">
        <p style="color:#444;font-weight:bolder;">您确定要删除Secret：{{nameSpaceName}}吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">确 定</el-button>
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
export default {
  name: "colonyConfigSecret",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      showNameSpaceModal: false, //是否显示删除框
      nameSpaceName: "",
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
      // Method: "GET"
      // Path: "/api/v1/namespaces/default/secrets?limit=20"
      // Version: "2018-05-25"
      // ClusterName: "cls-a7rua9ae"
      var params = {
        Method: "GET",
        Path:
          "/api/v1/namespaces/" +
          this.searchType +
          "/secrets?&limit=" +
          this.pageSize,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
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
    getColonyList() {},
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
          console.log(mes);
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
            duration: 2000
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
    // 详情
    goSecretDetail() {
      console.log(this.$route)
      this.$router.push({
        name: "secretDetail",
        query: {
          clusterId: this.clusterId
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
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    //刷新数据
    refreshList() {
      this.getData();
    },
    // 导出表格
    exportExcel() {
      // console.log("exportExcel...");
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
      this.pageIndex = val - 1;
      this.getColonyList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getColonyList();
    },
    //打开删除
    deleteNameSpace(row) {
      this.showNameSpaceModal = true;
      this.nameSpaceName = row.metadata.name;
    },
    //删除命名空间
    async submitDelete() {
      console.log("正在开发");
      this.loadShow = true;
      const param = {
        Method: "DELETE",
        Path: "/api/v1/namespaces/" + this.nameSpaceName,
        Version: "2018-05-25",
        RequestBody: { propagationPolicy: "Background", gracePeriodSeconds: 0 },
        ClusterName: this.clusterId
      };
      // this.axios.post(POINT_REQUEST, param).then(res => {
      //   if (res.Response.Error === undefined) {
      //     this.getNameSpaceList();
      //     this.loadShow = false;
      //     this.showNameSpaceModal = false;
      //   } else {
      //     this.loadShow = false;
      //     let ErrTips = {

      //     };
      //     let ErrOr = Object.assign(ErrorTips, ErrTips);
      //     this.$message({
      //       message: ErrOr[res.Response.Error.Code],
      //       type: "error",
      //       showClose: true,
      //       duration: 0
      //     });
      //   }
      // });
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

