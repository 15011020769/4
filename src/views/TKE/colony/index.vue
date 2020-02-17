<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <h2 class="header-title">集群管理</h2>
          <el-button size="small">台湾台北</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button @click="goColonyCreate" size="small" type="primary"
            >新建</el-button
          >
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <tkeSearch
            exportData
            inputPlaceholder="请输入名称搜索"
            :typeSelect="false"
            :typeOptions="searchOptions"
            :searchInput="searchInput"
            :typeValue="searchSelect"
            @changeType="changeType"
            @changeInput="changeSearchInput"
            @clickSearch="clickSearch"
            @exportExcel="exportExcel"
          >
          </tkeSearch>
        </div>
      </div>

      <!-- 数据列表展示 -->
      <div class="tke-card mt10">
        <el-table
          :data="list"
          v-loading="loadShow"
          style="width: 100%"
          id="exportTable"
        >
          <el-table-column label="ID/名称">
            <template slot-scope="scope">
              <span
                :class="[
                  scope.row.ClusterStatus == 'Running' ? 'tke-text-link' : ''
                ]"
                @click="
                  scope.row.ClusterStatus == 'Running'
                    ? goColonySub(scope.row.ClusterId)
                    : ''
                "
                >{{ scope.row.ClusterId }}</span
              >
              <p class="stk-editor-name">
                <span>{{ scope.row.ClusterName }}</span>
                <i
                  class="el-icon-edit tke-icon"
                  @click="showEditNameDlg(scope.row)"
                  v-if="scope.row.ClusterStatus == 'Running'"
                ></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="" label="监控">
            <template slot-scope="scope">
              <i
                class="icon-chart"
                @click="
                  scope.row.ClusterStatus == 'Running'
                    ? goColonySub(scope.row.ClusterId)
                    : ''
                "
              ></i>
              <span class="tag-danger">未配告警</span>
            </template>
          </el-table-column>
          <el-table-column prop="ClusterVersion" label="kubernetes版本">
          </el-table-column>
          <el-table-column prop="address" label="类型/状态">
            <template slot-scope="scope">
              <span v-if="scope.row.ClusterType == 'MANAGED_CLUSTER'"
                >托管集群</span
              >
              <span v-else>独立部署</span>
              (<span
                v-if="scope.row.ClusterStatus == 'Running'"
                class="text-green"
                >运行中</span
              >
              <span
                v-else-if="scope.row.ClusterStatus == 'Creating'"
                class="text-green"
                >创建中</span
              >
              <span v-else class="text-red">异常</span>)
            </template>
          </el-table-column>
          <el-table-column prop="nodeTotal" label="节点数">
            <template slot-scope="scope">
              <a href="javascript:;" @click="NodeTotal(scope.row.ClusterId)"
                >{{ scope.row.ClusterNodeNum }}台</a
              >
              (<span
                class="text-red"
                v-if="listStatusArr[scope.$index] == 'PartialAbnormal'"
                >部分异常
              </span>
              <span
                class="text-green"
                v-else-if="listStatusArr[scope.$index] == 'AllNormal'"
                >全部正常</span
              >)
              <el-popover
                width="50"
                trigger="hover"
                placement="top"
                v-if="listStatusArr[scope.$index] == 'PartialAbnormal'"
              >
                <div class="node-popover">
                  <p>
                    创建中：{{ listStatus[scope.$index].ClusterInitNodeNum }}台
                  </p>
                  <p>
                    运行中：{{
                      listStatus[scope.$index].ClusterRunningNodeNum
                    }}台
                  </p>
                  <p>
                    异常：{{ listStatus[scope.$index].ClusterFailedNodeNum }}台
                  </p>
                </div>
                <i class="el-icon-warning-outline" slot="reference"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="已分配/总配置">
            <template slot-scope="scope">
              <p>CPU: -/-</p>
              <p>内存: -/-</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <span
                @click="ConfigWarn"
                class="tke-text-link"
                v-if="scope.row.ClusterStatus == 'Running'"
                >配置告警</span
              >
              <span class="tke-text-link tke-text-link-dis" v-else
                >配置告警</span
              >
              <span
                @click="goAddExist(scope.row.ClusterId)"
                v-if="scope.row.ClusterStatus == 'Running'"
                class="tke-text-link ml10"
                >添加已有节点</span
              >
              <span v-else class="tke-text-link ml10 tke-text-link-dis"
                >添加已有节点</span
              >
              <el-dropdown class="ml10 tke-dropdown">
                <span class="el-dropdown-link ">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="a"
                    v-if="scope.row.ClusterStatus == 'Running'"
                    ><span
                      class="tke-text-link"
                      @click="ViewCluster(scope.row.ClusterId)"
                      >查看集群凭证</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item command="a" v-else
                    ><span class="tke-text-link tke-text-link-dis"
                      >查看集群凭证</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    command="b"
                    v-if="scope.row.ClusterStatus == 'Running'"
                    ><span
                      class="tke-text-link"
                      @click="goExpand(scope.row.ClusterId)"
                      >新建节点</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item command="b" v-else
                    ><span class="tke-text-link tke-text-link-dis"
                      >新建节点</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item command="c"
                    ><span class="tke-text-link" href="#"
                      >删除</span
                    ></el-dropdown-item
                  >
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
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑集群名称弹窗 -->
    <el-dialog
      title="编辑集群名称"
      :visible.sync="editNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <el-form label-width="80px">
          <el-form-item label="原名称">
            <p>集群测试</p>
          </el-form-item>
          <el-form-item label="新名称">
            <el-input
              size="small"
              placeholder="请输入新名称"
              v-model="editSearchVal"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setColonyName">提交</el-button>
        <el-button @click="editNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import HeadCom from "@/components/public/Head";
// import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import {
  ALL_CITY,
  TKE_COLONY_LIST,
  TKE_COLONY_STATUS,
  TKE_COLONY_DES,
  TKE_COLONY_DELETE
} from "@/constants";
export default {
  name: "colony",
  data() {
    return {
      loadShow: true, // 加载是否显示
      list: [], // 集群列表
      listStatus: [], // 集群列表节点数状态
      listStatusArr: [], // 集群列表节点数状态
      editClusterId: "",
      editSearchVal: "", // 编辑名称
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      searchSelect: "",
      searchInput: "",
      editNameDialogVisible: false,
      loading: true, // 表格加载
      btnload: true, // 地域按钮加载状态
      region: "", // 地区
      // tableData: [], //表格数据
      // 搜索下拉框
      searchOptions: [
        {
          value: "name",
          label: "名称"
        },
        {
          value: "tag",
          label: "标签"
        }
      ],
      search: "", // 搜索
      searchInput: "",
      searchValue: "" // inp输入的值
      // 分页
    };
  },
  components: {
    Loading,
    tkeSearch
  },
  created() {
    this._region();
    this.getColonyList();
  },
  mounted() {},
  methods: {
    // 获取集群列表
    async getColonyList() {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25",
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      if (this.searchInput !== "") {
        params["Filters.0.Name"] = "ClusterName";
        params["Filters.0.Values.0"] = this.searchInput;
      }
      const res = await this.axios.post(TKE_COLONY_LIST, params);
      if (res.Response.Error === undefined) {
        if (res.Response.Clusters.length > 0) {
          let ids = [];
          res.Response.Clusters = res.Response.Clusters.map(item => {
            ids.push(item.ClusterId);
            return item;
          });
          this.total = res.Response.TotalCount;
        }
        this.list = res.Response.Clusters;
        this.getColonyStatus();
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          InternalError: "内部错误",
          "InternalError.CamNoAuth": "没有权限。",
          "InternalError.Db": "db错误。",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
          "InternalError.QuotaMaxClsLimit": "超过配额限制。",
          "InternalError.QuotaMaxNodLimit": "超过配额限制。",
          InvalidParameter: "参数错误",
          "InvalidParameter.Param": "参数错误。",
          LimitExceeded: "超过配额限制",
          ResourceNotFound: "资源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    // 获取集群列表状态(不对外单独提供文档,所以无法实现)
    getColonyStatus() {
      let params = {
        Version: "2018-05-25"
      };
      if (this.searchInput !== "") {
        for (var i in this.list) {
          params["ClusterIds." + i] = this.list[i].ClusterId;
        }
      }

      this.axios.post(TKE_COLONY_STATUS, params).then(res => {
        this.listStatus = res.Response.ClusterStatusSet;
        this.listStatusArr = [];
        for (var i in this.listStatus) {
          this.listStatusArr.push(this.listStatus[i].ClusterInstanceState);
        }
      });
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
    // 修改集群名称
    setColonyName(row) {
      const param = {
        Version: "2018-05-25",
        ClusterId: this.editClusterId,
        ClusterName: this.editSearchVal
      };
      this.axios.post(TKE_COLONY_DES, param).then(res => {
        this.editNameDialogVisible = false;

        this.loadShow = true;
        this.getColonyList();
      });
    },
    // 创建集群跳转
    goColonyCreate() {
      this.$router.push({
        name: "clusterCreate",
        query: {}
      });
    },
    // 查看详情跳转
    goColonySub(id) {
      // scope.row.ClusterType=='MANAGED_CLUSTER'
      this.$router.push({
        name: "colonyResourceDeployment",
        query: {
          clusterId: id
        }
      });
    },
    // 节点数跳转
    NodeTotal(id) {
      this.$router.push({
        name: "colonyNodeManageNode",
        query: {
          clusterId: id
        }
      });
    },
    // 配置警告
    ConfigWarn() {
      this.$router.push({
        name: "warnings"
      });
    },
    // 查看集权凭证
    ViewCluster(id) {
      this.$router.push({
        name: "colonyBasic",
        query: {
          clusterId: id
        }
      });
    },
    // 编辑集群弹窗相关
    showEditNameDlg(row) {
      this.editNameDialogVisible = true;
      this.editClusterId = row.ClusterId;
    },
    // 新建节点跳转
    goExpand(id) {
      this.$router.push({
        name: "clusterExpand",
        query: {
          clusterId: id
        }
      });
    },
    // 添加已有节点跳转呢
    goAddExist(id) {
      this.$router.push({
        name: "clusterAddExist",
        query: {
          clusterId: id
        }
      });
    },
    // 获取地域
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
        this.btnload = false;
      });
    },
    // 监听搜索条件的值
    changeType(val) {
      this.searchSelect = val;
      console.log(this.searchSelect);
    },
    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      if (val === "") {
        this.getColonyList();
      }
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getColonyList();
    },
    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
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
          this.$t("tke-clusterList") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

<style lang="scss" scoped>
//
.node-popover {
  font-size: 12px;
  color: #000;
  p {
    line-height: 20px;
  }
}
.el-icon-warning-outline {
  font-size: 14px;
  font-weight: 700;
  color: #444;
  position: relative;
  top: 2px;
}
// 弹窗相关
.tag-danger {
  display: inline-block;
  background-color: #ff9d00;
  color: #fff;
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
  vertical-align: top;
  margin-left: 5px;
}
.el-dialog__footer .dialog-footer {
  display: block;
  text-align: center;
}
.tke-text-link-dis {
  color: #bbb;
  cursor: not-allowed;
}
</style>
