<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom>-->
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <h2 class="header-title">集群管理</h2>
          <el-button size="small" type="primary">{{
            $t("TKE.overview.zgtb")
          }}</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid">
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
            :inputPlaceholder="$t('TKE.colony.qsrmcss')"
            :typeSelect="false"
            :typeOptions="searchOptions"
            :searchInput="searchInput"
            :typeValue="searchSelect"
            @changeType="changeType"
            @changeInput="changeSearchInput"
            @clickSearch="clickSearch"
            @exportExcel="exportExcel"
          ></tkeSearch>
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
          <el-table-column :label="$t('TKE.overview.idmc')">
            <template slot-scope="scope">
              <span
                :class="[
                  scope.row.ClusterStatus == 'Running' ? 'tke-text-link' : ''
                ]"
                @click="
                  scope.row.ClusterStatus == 'Running'
                    ? goColonySub(scope.row)
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
          <el-table-column prop :label="$t('TKE.colony.jk')">
            <template slot-scope="scope">
              <i
                class="icon-chart"
                @click="
                  scope.row.ClusterStatus == 'Running'
                    ? goMonitor(scope.row)
                    : ''
                "
              ></i>
              <span class="tag-danger">未配告警</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ClusterVersion"
            label="kubernetes版本"
          ></el-table-column>
          <el-table-column :label="$t('TKE.colony.lxzt')">
            <template slot-scope="scope">
              <span v-if="scope.row.ClusterType == 'MANAGED_CLUSTER'">{{
                $t("TKE.colony.tgjq")
              }}</span>
              <span v-else>{{ $t("TKE.colony.dlbs") }}</span>
              (
              <span
                v-if="scope.row.ClusterStatus == 'Running'"
                class="text-green"
                >{{ $t("TKE.colony.yxz") }}</span
              >
              <span
                v-else-if="scope.row.ClusterStatus == 'Creating'"
                class="text-orange"
                >{{ $t("TKE.colony.cjz") }} <i class="el-icon-loading"></i
              ></span>
              <span v-else class="text-red">{{ $t("TKE.overview.yc") }}</span
              >)
            </template>
          </el-table-column>
          <el-table-column :label="$t('TKE.colony.jds')">
            <template slot-scope="scope">
              <div class="node-total">
                <div
                  v-if="scope.row.ClusterStatus != 'Creating'"
                  class="node-content"
                >
                  <a href="javascript:;" @click="NodeTotal(scope.row)"
                    >{{ scope.row.ClusterNodeNum }}台</a
                  >
                  <div
                    style="display: flex;"
                    v-if="scope.row.ClusterNodeNum > 0"
                  >
                    (
                    <div v-if="scope.row.ClusterInitNodeNum == 0" class="box">
                      <span
                        class="text-green"
                        v-if="scope.row.ClusterInstanceState == 'AllNormal'"
                        >全部正常</span
                      >
                      <p
                        v-else-if="
                          scope.row.ClusterInstanceState == 'AllAbnormal'
                        "
                      >
                        <span
                          class="text-green"
                          v-if="
                            scope.row.ClusterClosedNodeNum != 0 ||
                              scope.row.ClusterClosingNodeNum != 0
                          "
                          >全部正常</span
                        >
                        <span class="text-red" v-else>{{
                          $t("TKE.colony.qbyc")
                        }}</span>
                      </p>
                      <span class="text-red" v-else>{{
                        $t("TKE.colony.bfyc")
                      }}</span>
                    </div>
                    <span v-else class="text-orange"> 正在創建</span>
                    )

                    <el-popover
                      width="50"
                      trigger="hover"
                      placement="top"
                      v-if="scope.row.ClusterInstanceState != 'AllNormal'"
                    >
                      <div class="node-popover">
                        <p>
                          {{ $t("TKE.colony.cjz") }}：{{
                            scope.row.ClusterInitNodeNum
                          }}台
                        </p>
                        <p>
                          {{ $t("TKE.colony.yxz") }}：{{
                            scope.row.ClusterRunningNodeNum
                          }}台
                        </p>
                        <p>
                          {{ $t("TKE.overview.yc") }}：{{
                            scope.row.ClusterFailedNodeNum
                          }}台
                        </p>
                        <p>
                          {{ $t("TKE.colony.ygj") }}：{{
                            scope.row.ClusterClosedNodeNum
                          }}台
                        </p>
                        <p>
                          {{ $t("TKE.colony.gjz") }}：{{
                            scope.row.ClusterClosingNodeNum
                          }}台
                        </p>
                      </div>
                      <i class="el-icon-warning-outline" slot="reference"></i>
                    </el-popover>
                  </div>
                </div>
                <p v-else>
                  <span style="color:#bbb;"
                    >{{ scope.row.ClusterNodeNum }}台</span
                  >
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="$t('TKE.colony.yfpzpz')">
            <template slot-scope="scope">
              <p>CPU: -/{{ scope.row.root }}核</p>
              <p>{{ $t("TKE.overview.ncun") }}: -/-GB</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <!-- <span
                @click="ConfigWarn"
                class="tke-text-link"
                v-if="scope.row.ClusterStatus == 'Running'"
                >配置告警</span
              >
              <span class="tke-text-link tke-text-link-dis" v-else
                >配置告警</span
              > -->
              <span
                @click="goAddExist(scope.row)"
                v-if="scope.row.ClusterStatus == 'Running'"
                class="tke-text-link ml10"
                >{{ $t("TKE.colony.tjyyjd") }}</span
              >
              <span v-else class="tke-text-link ml10  tke-text-link-dis">{{
                $t("TKE.colony.tjyyjd")
              }}</span>
              <el-dropdown class="ml10 tke-dropdown">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="a"
                    v-if="scope.row.ClusterStatus == 'Running'"
                  >
                    <span
                      class="tke-text-link tke-text-links"
                      @click="ViewCluster(scope.row.ClusterId)"
                      >{{ $t("TKE.colony.ckjqpz") }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item command="a" v-else>
                    <span
                      class="tke-text-link tke-text-link-dis tke-text-links"
                      >{{ $t("TKE.colony.ckjqpz") }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="b"
                    v-if="scope.row.ClusterStatus == 'Running'"
                  >
                    <span
                      class="tke-text-link tke-text-links"
                      @click="goExpand(scope.row.ClusterId)"
                      >{{ $t("TKE.colony.xjjd") }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item command="b" v-else>
                    <span
                      class="tke-text-link tke-text-link-dis tke-text-links"
                      >{{ $t("TKE.colony.xjjd") }}</span
                    >
                  </el-dropdown-item>

                  <el-dropdown-item
                    command="c"
                    v-if="scope.row.ClusterStatus == 'Running'"
                  >
                    <span
                      class="tke-text-link tke-text-links"
                      href="javascript:;"
                      @click="Delete(scope.row)"
                      >{{ $t("TKE.overview.sc") }}</span
                    > </el-dropdown-item
                  ><el-dropdown-item command="b" v-else>
                    <span
                      class="tke-text-link tke-text-link-dis tke-text-links"
                      >{{ $t("TKE.overview.sc") }}</span
                    >
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
      </div>
    </div>

    <!-- 编辑集群名称弹窗 -->
    <el-dialog
      :title="$t('TKE.colony.bjjqmc')"
      :visible.sync="editNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <el-form label-width="80px">
          <el-form-item :label="$t('TKE.colony.ymc')">
            <p>{{ oldnName }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.xmc')">
            <el-input
              size="small"
              :placeholder="$t('TKE.colony.qsrxmc')"
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

    <!-- 删除 -->
    <el-dialog
      :title="$t('TKE.colony.scjq')"
      v-loading="deleteLoadShow"
      :visible.sync="deleteDialogVisible"
      width="550px"
      custom-class="tke-dialog tke-delete-dialog"
    >
      <div class="content">
        <p>
          {{ $t("TKE.colony.qdyscjq") }}"{{ deleteID }}（{{ deleteName }}）"嗎？
        </p>
        <p>
          {{ $t("TKE.colony.gjqyy") }}{{ deteleNodeNum + deteleMaterNodeNum
          }}{{ $t("TKE.colony.qz") }} <span>0台</span
          >{{ $t("TKE.colony.bnbyjd") }}
          <a href="javascript:;" @click="DetailsShow">{{
            $t("TKE.overview.ckxq")
          }}</a>
          <i class="el-icon-caret-bottom" v-if="!detailsShow"></i>
          <i class="el-icon-caret-top" v-if="detailsShow"></i>
        </p>
        <div
          class="delete-table tke-card tke-formpanel-wrap"
          v-if="detaleTableData_ETCD.length !== 0 && detailsShow"
        >
          <el-table :data="detaleTableData_ETCD" style="width: 100%">
            <el-table-column label="ID" width="180">
              <template slot-scope="scope">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="100">
              <template slot-scope="scope">
                <p
                  v-if="scope.row.InstanceState === 'running'"
                  class="text-green"
                >
                  健康
                </p>
                <p
                  v-else-if="scope.row.InstanceState === 'initializing'"
                  class="text-orange"
                >
                  {{ $t("TKE.colony.cjz") }}
                </p>
                <p v-else class="text-red">{{ $t("TKE.overview.yc") }}</p>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template>
                <p>Master&Etcd，{{ $t("TKE.colony.bkyc") }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="delete-table tke-card tke-formpanel-wrap"
          v-if="detailsShow"
        >
          <el-table :data="detaleTableData" style="width: 100%">
            <el-table-column label="ID" width="180">
              <template slot-scope="scope">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="180">
              <template slot-scope="scope">
                <p
                  v-if="scope.row.InstanceState === 'running'"
                  class="text-green"
                >
                  健康
                </p>
                <p
                  v-else-if="scope.row.InstanceState === 'initializing'"
                  class="text-orange"
                >
                  {{ $t("TKE.colony.cjz") }}
                </p>
                <p v-else class="text-red">{{ $t("TKE.overview.yc") }}</p>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template>
                <p>{{ $t("TKE.colony.kycbxh") }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detele-destruction">
          <p>
            {{ $t("TKE.colony.ymyx") }}
          </p>
          <p>
            {{ $t("TKE.colony.kxzsfxh") }}
          </p>
          <el-checkbox v-model="deteleCheck">{{
            $t("TKE.colony.xhjdbbf")
          }}</el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setColonyDelete">提交</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
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
  TKE_COLONY_DELETE,
  TKE_DELETE_XS,
  TKE_EXIST_NODES,
  JOB_ID,
  MOMITOR_TKE
} from "@/constants";
export default {
  name: "colony",
  data() {
    return {
      loadShow: true, // 加载是否显示
      list: [], // 集群列表
      list1: [], // 集群列表
      JobId: "",
      listStatus: [], // 集群列表节点数状态
      listStatusArr: [], // 集群列表节点数状态
      editClusterId: "",
      oldnName: "",
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
          label: "名稱"
        },
        {
          value: "tag",
          label: "標籤"
        }
      ],
      search: "", // 搜索
      searchInput: "",
      searchValue: "", // inp输入的值
      // 分页
      deleteDialogVisible: false, // 删除
      deleteID: "",
      deleteName: "",
      deteleNodeNum: "",
      deteleMaterNodeNum: "",
      detailsShow: true,
      InstanceName: [],
      detaleTableData: [],
      detaleTableData_ETCD: [],
      deteleCheck: true,
      deleteLoadShow: true,
      oldnName: ""
    };
  },
  components: {
    Loading,
    tkeSearch
  },
  created() {
    this._region();
    this.getColonyList();
    this.getColonyStatus();
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
          let params = {
            Version: "2018-05-25"
          };
          if (res.Response.Clusters.length > 0) {
            for (var i in res.Response.Clusters) {
              params["ClusterIds." + i] = res.Response.Clusters[i].ClusterId;
            }
          }
          await this.axios.post(TKE_COLONY_STATUS, params).then(res1 => {
            this.listStatus = res1.Response.ClusterStatusSet;
            let status = res1.Response.ClusterStatusSet;
            res.Response.Clusters.map(cluster => {
              for (var i in status) {
                if (cluster.ClusterId === status[i].ClusterId) {
                  cluster.status = status[i].ClusterState;
                  cluster.ClusterInstanceState = status[i].ClusterInstanceState;
                  cluster.ClusterBMonitor = status[i].ClusterBMonitor;
                  cluster.ClusterInitNodeNum = status[i].ClusterInitNodeNum;
                  cluster.ClusterRunningNodeNum =
                    status[i].ClusterRunningNodeNum;
                  cluster.ClusterFailedNodeNum = status[i].ClusterFailedNodeNum;
                  cluster.ClusterClosedNodeNum = status[i].ClusterClosedNodeNum;
                  cluster.ClusterClosingNodeNum =
                    status[i].ClusterClosingNodeNum;
                }
              }
              return cluster;
            });
          });
          this.list1 = res.Response.Clusters;
          this.total = res.Response.TotalCount;
        }
        // this.getColonyStatus();

        let _data = {
          EndTime: new Date().getTime(),
          Limit: 65535,
          Module: "/front/v1",
          NamespaceName: "k8s_cluster",
          Offset: 0,
          Order: "desc",
          OrderBy: "timestamp",
          StartTime: new Date().getTime() - 1 * 60 * 60 * 1000,
          Version: "2019-06-06"
        };
        let ClusterIdArr = [];
        for (let i in this.list1) {
          ClusterIdArr.push(this.list1[i].ClusterId);
        }
        _data["Conditions.0"] = JSON.stringify([
          "tke_cluster_instance_id",
          "in",
          ClusterIdArr
        ]);
        _data["Fields.0"] = "avg(k8s_cluster_cpu_core_total)";
        _data["Fields.1"] = "avg(k8s_cluster_memory_total)";
        _data["Fields.2"] = "avg(k8s_cluster_rate_cpu_core_request_cluster)";
        _data["Fields.3"] = "avg(k8s_cluster_rate_mem_request_bytes_cluster)";
        _data["GroupBys.0"] = "timestamp(60s)";
        _data["GroupBys.1"] = "tke_cluster_instance_id";
        await this.axios.post(JOB_ID, _data).then(res => {
          this.JobId = res.Response.JobId;
        });
        let _datas = {
          Version: "2019-06-06",
          JobId: this.JobId,
          // JobId: "36asom5trrq8use7",
          Module: "/front/v1"
        };
        await this.axios.post(MOMITOR_TKE, _datas).then(res => {
          if (JSON.parse(res.Response.Data).length !== 0) {
            let _Data = JSON.parse(res.Response.Data).splice(
              0,
              this.list1.length
            );
            console.log(_Data);
            for (let j in this.list1) {
              for (let k in _Data) {
                if (this.list1[j].ClusterId === _Data[k][1]) {
                  if (_Data[k][2]) {
                    this.list1[j]["root"] = _Data[k][2].toFixed(2);
                  } else {
                    this.list1[j]["root"] = 0;
                  }
                }
              }
            }
          }
          this.list = this.list1;
          console.log("list", this.list);
        });
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          InternalError: "內部錯誤",
          "InternalError.CamNoAuth": "沒有權限。",
          "InternalError.Db": "db錯誤。",
          "InternalError.DbAffectivedRows": "DB錯誤",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
          "InternalError.QuotaMaxClsLimit": "超過配額限制。",
          "InternalError.QuotaMaxNodLimit": "超過配額限制。",
          InvalidParameter: "參數錯誤",
          "InvalidParameter.Param": "參數錯誤",
          LimitExceeded: "超過配額限制",
          ResourceNotFound: "資源不存在"
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
    async getColonyStatus() {
      let list = this.list;
      let params = {
        Version: "2018-05-25"
      };
      if (list.length > 0) {
        for (var i in list) {
          params["ClusterIds." + i] = list[i].ClusterId;
        }
      }

      await this.axios.post(TKE_COLONY_STATUS, params).then(res => {
        this.listStatus = res.Response.ClusterStatusSet;
        this.listStatusArr = [];
        let status = res.Response.ClusterStatusSet;
        list.map(cluster => {
          for (var i in status) {
            if (cluster.ClusterId === status[i].ClusterId) {
              cluster.ClusterState = status[i].ClusterState;
              cluster.ClusterInstanceState = status[i].ClusterInstanceState;
              cluster.ClusterBMonitor = status[i].ClusterBMonitor;
              cluster.ClusterInitNodeNum = status[i].ClusterInitNodeNum;
              cluster.ClusterRunningNodeNum = status[i].ClusterRunningNodeNum;
              cluster.ClusterFailedNodeNum = status[i].ClusterFailedNodeNum;
              cluster.ClusterClosedNodeNum = status[i].ClusterClosedNodeNum;
              cluster.ClusterClosingNodeNum = status[i].ClusterClosingNodeNum;
            }
          }
          return cluster;
        });
        this.list = list;
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
        this.searchInput = "";
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
    goColonySub(row) {
      // scope.row.ClusterType=='MANAGED_CLUSTER'
      this.$router.push({
        name: "colonyResourceDeployment",
        query: {
          clusterId: row.ClusterId,
          ProjectId: row.ProjectId
        }
      });
    },
    // 节点数跳转
    NodeTotal(row) {
      this.$router.push({
        name: "colonyNodeManageNode",
        query: {
          clusterId: row.ClusterId,
          ProjectId: row.ProjectId
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
      console.log(row);
      this.oldnName = row.ClusterName;
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
    // 删除
    Delete(row) {
      console.log(row);
      this.deleteDialogVisible = true;
      this.deleteID = row.ClusterId;
      this.deleteName = row.ClusterName;
      this.deteleNodeNum = row.ClusterNodeNum;
      this.deteleMaterNodeNum = row.ClusterMaterNodeNum;
      this.DeleteTable(row);
    },
    async DeleteTable(row) {
      let params = {
        Version: "2018-05-25",
        ClusterId: row.ClusterId
      };
      await this.axios.post(TKE_DELETE_XS, params).then(res => {
        if (res.Response.Error === undefined) {
          var _detaleTableData = res.Response.InstanceSet;

          let params = {
            Version: "2017-03-12",
            Limit: 20
          };
          for (var i in _detaleTableData) {
            params["InstanceIds." + i] = _detaleTableData[i].InstanceId;
          }
          this.axios.post(TKE_EXIST_NODES, params).then(res => {
            if (res.Response.Error === undefined) {
              let _detaleTableData_2 = res.Response.InstanceSet.reverse();
              for (let i in _detaleTableData) {
                for (let j in _detaleTableData_2) {
                  if (
                    _detaleTableData[i].InstanceId ===
                    _detaleTableData_2[j].InstanceId
                  ) {
                    _detaleTableData[i]["InstanceName"] =
                      _detaleTableData_2[j].InstanceName;
                  }
                }
              }
              this.detaleTableData = _detaleTableData.reverse();
              this.deleteLoadShow = true;
            } else {
              this.deleteLoadShow = false;
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
      let data = {
        Version: "2018-05-25",
        ClusterId: row.ClusterId,
        InstanceRole: "MASTER_ETCD"
      };
      await this.axios.post(TKE_DELETE_XS, data).then(res => {
        if (res.Response.Error === undefined) {
          var _detaleTableData_ETCD = res.Response.InstanceSet;
          let params = {
            Version: "2017-03-12",
            Limit: 20
          };
          for (let i in _detaleTableData_ETCD) {
            params["InstanceIds." + i] = _detaleTableData_ETCD[i].InstanceId;
          }
          this.axios.post(TKE_EXIST_NODES, params).then(res => {
            if (res.Response.Error === undefined) {
              let _detaleTableData_2ETCD = res.Response.InstanceSet;
              for (let i in _detaleTableData_ETCD) {
                for (let j in _detaleTableData_2ETCD) {
                  if (
                    _detaleTableData_ETCD[i].InstanceId ===
                    _detaleTableData_2ETCD[j].InstanceId
                  ) {
                    _detaleTableData_ETCD[i]["InstanceName"] =
                      _detaleTableData_2ETCD[j].InstanceName;
                  }
                }
              }
              this.detaleTableData_ETCD = _detaleTableData_ETCD.reverse();
              console.log(
                "this.detaleTableData_ETCD",
                this.detaleTableData_ETCD
              );
              this.deleteLoadShow = false;
            } else {
              this.deleteLoadShow = false;
              let ErrTips = {
                FailedOperation: "操作失敗",
                InternalError: "內部錯誤",
                "InternalError.Param": "Param。",
                "InternalError.PublicClusterOpNotSupport":
                  "集群不支持當前操作。",
                InvalidParameter: "參數錯誤",
                ResourceNotFound: "資源不存在",
                ResourceUnavailable: "資源不存在"
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
    // 查看详情
    DetailsShow() {
      this.detailsShow = !this.detailsShow;
    },
    // 确定删除
    setColonyDelete() {
      let params = {
        Version: "2018-05-25",
        ClusterId: this.deleteID
      };
      if (this.deteleCheck === true) {
        params["InstanceDeleteMode"] = "terminate";
      } else {
        params["InstanceDeleteMode"] = "retain";
      }
      this.axios.post(TKE_COLONY_DELETE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.deleteDialogVisible = false;
          this.getColonyList();
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗",
            InternalError: "內部錯誤",
            "InternalError.Param": "Param。",
            "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
            InvalidParameter: "參數錯誤",
            ResourceNotFound: "資源不存在",
            ResourceUnavailable: "資源不存在"
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
    },
    // 添加已有节点跳转呢
    goAddExist(row) {
      this.$router.push({
        name: "clusterAddExist",
        query: {
          clusterId: row.ClusterId,
          ProjectId: row.ProjectId
        }
      });
    },
    //跳转监控页面
    goMonitor(cluster) {
      this.$router.push({
        name: "colonyMonitor",
        query: {
          clusterId: cluster.ClusterId,
          name: cluster.ClusterName
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
.el-dropdown-link {
  cursor: pointer;
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
.tke-text-links {
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
// 删除
.tke-delete-dialog {
  .el-dialog__header {
    padding: 25px 25px 0px 25px;
    margin-bottom: 10px;
  }
  .el-dialog__title {
    font-weight: 700;
    margin-bottom: 14px;
    display: inline-block;
    font-size: 14px;
    line-height: 26px;
    color: #000;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 20px;
    font-weight: 700;
    margin-top: 8px;
  }
  .el-dialog__body {
    padding: 0px 25px 25px 25px;
  }
  .content {
    & > p {
      color: #444;
      font-size: 14px;
      &:nth-of-type(1) {
        font-weight: 600;
      }
      &:nth-of-type(2) {
        & > span {
          color: #ff9d00;
          font-weight: 700;
        }
        & > a {
          color: #409eff;
          &:hover {
            text-decoration: underline;
          }
        }
        i {
          color: #888;
        }
      }
    }
    .delete-table {
      margin: 10px 0px;

      .el-table th {
        padding: 10px 0;
      }
      .el-table th > .cell {
        color: #888;
        font-size: 12px;
        font-weight: 700;
      }
      tbody {
        .el-table td {
          padding: 14px 0px;
        }
      }
    }
    .detele-destruction {
      p {
        color: #ababab;
        font-size: 12px;
      }
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        border-radius: 0px;
      }
      .el-checkbox__label {
        padding-left: 5px;
        margin-left: 0px;
        color: #444;
        font-size: 12px;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background: #409eff;
        border-color: #409eff;
      }
      .el-checkbox__inner::after {
        height: 9px;
        left: 5px;
      }
    }
  }
}
.text-green {
  color: #0abf5b;
}
.text-orange {
  color: #ff9d00;
}
.text-red {
  color: #e1504a;
}
.node-total {
  display: flex;
  .node-content {
    display: flex;

    .box {
      display: flex;
    }
  }
}
</style>
