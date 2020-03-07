 <!--工作负载- Deployment -->
<template>
  <div>
    <subTitle title="Deployment" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goWorkloadCreate('deployment')" size="small" type="primary">新建</el-button>
        <el-button size="small" @click="toMonitor">监控</el-button>
      </div>

      <!-- 右侧 -->
      <div class="grid-right">
        <div>
          <span style="margin-right:10px;">命名空间</span>
          <el-select
            size="mini"
            v-model="nameSpaceName"
            placeholder="请选择"
            @change="changNameSpace"
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
        @selection-change="handleSelectionChange"
        :data="list"
        v-loading="loadShow"
        id="exportTable"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span
              @click="goDeploymentDetail(scope.row)"
              class="tke-text-link"
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
            <span>{{scope.row.status && scope.row.status.readyReplicas || 0}}/{{scope.row.status && scope.row.status.replicas || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goPodUpdate(scope.row)">更新Pod数量</span>
             <el-tooltip  v-if="nameSpaceName=='kube-system'"   class="item" effect="light" content="当前Namespace下的不可进行此操作" placement="right">
                   <el-button
                    type="text"
                    class="notuse ml10"
                    >更新Pod配置</el-button>
                  </el-tooltip>
            <span class="tke-text-link ml10" v-else @click="goPodConfigUpdate(scope.row)">更新Pod配置</span>
            <el-dropdown class="tke-dropdown"  trigger="click">
              <span class="el-dropdown-link ml10" style="cursor:pointer">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item command="a">
                  <span class="tke-text-link" @click="redeployment(scope.row)">重新部署</span>
                </el-dropdown-item>
                <el-dropdown-item command="a">
                  <el-tooltip  v-if="nameSpaceName=='kube-system'"   class="item" effect="light" content="当前Namespace下的不可进行此操作" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >设置更新策略</el-button>
                  </el-tooltip>
                  <span v-else class="tke-text-link" @click="goSetUpdateTactics(scope.row)">设置更新策略</span>
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <el-tooltip  v-if="nameSpaceName=='kube-system'"   class="item" effect="light" content="当前Namespace下的不可进行此操作" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >更新调度策略</el-button>
                  </el-tooltip>

                  <span v-else  class="tke-text-link"  @click="goUpdateTactics(scope.row)">更新调度策略</span>
                </el-dropdown-item>
                <el-dropdown-item command="c">
                   <el-tooltip  v-if="nameSpaceName=='kube-system'"   class="item" effect="light" content="当前Namespace下的资源不可编辑YAML,如需查看YAML,请前往详情页" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >编辑YAML</el-button>
                  </el-tooltip>
                   <el-button
                    type="text"
                     v-else
                     @click="goUpdateYaml(scope.row)"
                  >编辑YAML</el-button>
                </el-dropdown-item>
                <el-dropdown-item command="c">
                  <el-tooltip  v-if="nameSpaceName=='kube-system'"   class="item" effect="light" content="当前Namespace下的不可进行此操作" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >删除</el-button>
                  </el-tooltip>
                  <el-button
                    v-else
                    type="text"
                    @click="deleteDeployment(scope.row)"
                  >删除</el-button>
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
    <el-dialog title="重新部署" :visible.sync="isShowRedeployment" width="35%">
      <p style="font-weight: bolder;color: #444;">您确定要重新部署Deployment：{{deploymentName}}吗？</p>
      <p>重新部署将重新从镜像仓库拉取镜像更新服务</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRedeployment()">确 定</el-button>
        <el-button @click="isShowRedeployment = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除资源" :visible.sync="isShowDeleteModal" width="35%">
      <p style="font-weight: bolder;color: #444;">您确定要删除Deployment：{{deploymentName}}吗？</p>
      <p style="color:#e54545;">该Workload下所有Pods将一并销毁，销毁后不可恢复，请谨慎操作。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelete()">确 定</el-button>
        <el-button @click="isShowDeleteModal = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyResourceDeployment",
  data() {
    return {
      tit: "工作负载监控",
      loadShow: false, //加载是否显示
      clusterId: "", //集群id
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [], //选择的内容
      flag: false, //是否开启抽屉
      searchOptions: [], //命名空间列表
      nameSpaceName: "", //选中的命名空间名称
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
      isShowRedeployment: false, //是否打开重新部署modal
      isShowDeleteModal: false, //是否打开删除弹窗
      deploymentName: "" //资源名称
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.getNameSpaceList();
  },
  methods: {
    toMonitor() {
      //跳转监控页面
      this.$router.push({
        name: "colonyOpenMonitor",
        query: {
          title: this.tit + "(deployment)"
        }
      });
    },
    //启动时获取命名空间列表数据
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
          if(sessionStorage.getItem('namespace')){
            this.nameSpaceName=sessionStorage.getItem('namespace')
          }else{
            this.nameSpaceName = nameSpace.metadata.name;
          }

          this.searchOptions = response.items;
          this.loadShow = true;
          let params = {};
          if (this.searchInput === "") {
            params = {
              Method: "GET",
              Path:
                "/apis/apps/v1beta2/namespaces/" +
                nameSpace.metadata.name +
                "/deployments?limit=" +
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
                "/deployments?fieldSelector=metadata.name=" +
                this.searchInput,
              Version: "2018-05-25",
              ClusterName: this.clusterId
            };
          }
          await this.axios.post(POINT_REQUEST, params).then(res => {
            if (res.Response.Error === undefined) {
              this.loadShow = false;
              let response = JSON.parse(res.Response.ResponseBody);
              this.list = response.items;
              console.log(response.items)
              this.total = response.items.length;
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

    //获取列表数据
    async getDeploymentList() {
      this.loadShow = true;
      let params = {};
      if (this.searchInput === "") {
        params = {
          Method: "GET",
          Path:
            "/apis/apps/v1beta2/namespaces/" +
            this.nameSpaceName +
            "/deployments?limit=" +
            this.pageSize,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      } else {
        params = {
          Method: "GET",
          Path:
            "/apis/apps/v1beta2/namespaces/" +
            this.nameSpaceName +
            "/deployments?fieldSelector=metadata.name=" +
            this.searchInput,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      }

      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log(response)
          if (response.items.length > 0) {
            response.items.map(deployment => {
              (deployment.k8sApp =
                deployment.metadata.labels && deployment.metadata.labels.k8s),
                (deployment.qcloudApp =
                  deployment.metadata.labels &&
                  deployment.metadata.labels.qcloud);
            });
          }
          this.list = response.items;
          this.total = response.items.length;
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

    //选择命名空间
    changNameSpace() {
      this.getDeploymentList();
    },

    // 新建
    goWorkloadCreate(type) {
      this.$router.push({
        name: "workloadCreate",
        query: {
          type: type,
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          nameSpaceList: this.searchOptions
        }
      });
    },
     // 详情.
    goDeploymentDetail(rowData) {
      console.log(rowData)
      this.$router.push({
        name: "deploymentDetail",
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          rowData: rowData
        }
      });
    },

    //更新pod
    goPodUpdate(rowData) {
      console.log(rowData)
      this.$router.push({
        name: "podUpdate",
        query: {
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace
        }
      });
      sessionStorage.setItem('namespace',rowData.metadata.namespace)
    },
    //更新pod配置
    goPodConfigUpdate(rowData) {
      this.$router.push({
        name: "podConfigUpdate",
        query: {
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace
        }
      });
    },
    //设置更新策略
    goSetUpdateTactics(rowData){
      this.$router.push({
        name:'setStrategy',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
        }
      })
    },
    //更新调度策略
    goUpdateTactics(rowData){
       this.$router.push({
        name:'updateStrategy',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
        }
      })
    },
    //编辑Yaml
    goUpdateYaml(rowData){
      this.$router.push({
        name:'updateYamlWorkLoad',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
          rowData:rowData
        }
      })
    },
    //是否打开重新部署弹窗
    redeployment(rowData) {
      this.isShowRedeployment = true;
      this.deploymentName = rowData.metadata.name;
    },

    //是否打开删除弹窗
    deleteDeployment(rowData) {
      this.isShowDeleteModal = true;
      this.deploymentName = rowData.metadata.name;
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
      this.getDeploymentList();
    },
    //刷新数据
    refreshList() {
      this.getDeploymentList();
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
      this.getDeploymentList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDeploymentList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //重新部署
    async submitRedeployment() {
      this.loadShow = true;
      let time = new Date().getTime().toString();
      let params = {
        Method: "PATCH",
        Path:
          "/apis/apps/v1beta2/namespaces/" +
          this.nameSpaceName +
          "/deployments/" +
          this.deploymentName,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({
          spec: {
            template: {
              metadata: { labels: { "qcloud-redeploy-timestamp": time } }
            }
          }
        }),
        ContentType: "application/strategic-merge-patch+json",
        ClusterName: this.clusterId
      };

      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.isShowRedeployment = false;
          this.getDeploymentList();
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
    //删除资源
    async submitDelete() {
      this.loadShow = true;
      let params = {
        Method: "DELETE",
        Path:
          "/apis/apps/v1beta2/namespaces/" +
          this.nameSpaceName +
          "/deployments/" +
          this.deploymentName,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({ propagationPolicy: "Background" }),
        ClusterName: this.clusterId
      };
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.isShowDeleteModal = false;
          this.getDeploymentList();
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
  watch:{
    nameSpaceName(val){
       this.getDeploymentList();
    }
  },
  components: {
    subTitle,
    tkeSearch,
    Loading,
  }
};
</script>

<style lang="scss" scoped>
.grid-right{
  height: 39px;
  display: flex;
  align-items: center;
}
.grid-right >>> .el-input__inner{
  height: 32px;
}
.tke-search{
  margin-bottom:5px;
}
.tke-grid >>> .el-input__inner,
.tke-grid >>> .el-button {
  border-radius: 0;
}
.notuse{
  color: #C0C4CC;
  cursor: not-allowed;
}
</style>

