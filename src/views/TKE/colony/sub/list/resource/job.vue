 <!--工作负载- Job -->
<template>
  <div>
    <subTitle title="Job" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goWorkloadCreate('Job')" size="small" type="primary">新建</el-button>
        <!-- <el-button size="small" >监控</el-button> -->
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <div>
          <span style="margin-right:10px;">命名空间</span>
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
        <!-- <tkeSearch
          refreshData
          exportData
          :typeValue="searchType"
          inputPlaceholder="请输入关键词搜索"
          :searchInput="searchInput"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh="refreshList"
          @exportExcel="exportExcel"
        ></tkeSearch> -->
        <tkeSearch
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
      <el-table :data="list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)" v-loading="loadShow" id="exportTable" style="width: 100%">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <!-- <span
              class="tke-text-link"
              @click="goJobDetail(scope.row)"
            >{{scope.row.metadata && scope.row.metadata.name}}</span> -->
            <span>{{scope.row.metadata && scope.row.metadata.name}}</span>
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

        <el-table-column prop label="并行度">
          <template slot-scope="scope">
            <span>{{scope.row.spec.parallelism || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column prop label="重复次数">
          <template slot-scope="scope">
            <span>{{scope.row.spec.completions || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-tooltip  v-if="searchType=='kube-system'"   class="item" effect="light" content="当前Namespace下的资源不可编辑YAML,如需查看YAML,请前往详情页" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >编辑YAML</el-button>
                  </el-tooltip>
                   <span
                     v-else
                     class="tke-text-link"
                     @click="goUpdateYaml(scope.row)"
                  >编辑YAML</span>
              <el-tooltip  v-if="searchType=='kube-system'"   class="item" effect="light" content="当前Namespace下的不可进行此操作" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >删除</el-button>
                  </el-tooltip>
                  <span
                    v-else
                    class="tke-text-link ml10"
                    type="text"
                    @click="deleteDeployment(scope.row)"
                  >删除</span>
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
      <el-dialog title="删除资源" :visible.sync="isShowDeleteModal" width="35%">
        <p style="font-weight: bolder;color: #444;">您确定要删除Deployment：{{deploymentName}}吗？</p>
        <p style="color:#e54545;">该Workload下所有Pods将一并销毁，销毁后不可恢复，请谨慎操作。</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">确 定</el-button>
          <el-button @click="isShowDeleteModal = false">取 消</el-button>
        </span>
     </el-dialog>
    </div>
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
  name: "colonyResourceJob",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: "", //集群id
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      multipleSelection: [], //全选数据
      //搜索下拉框
      searchOptions: [],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
      isShowDeleteModal:false,
      deploymentName:'',
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.getNameSpaceList();
  },
  methods: {
    //启动时获取JOB列表数据
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
                "/apis/batch/v1/namespaces/" +
                nameSpace.metadata.name +
                "/jobs?limit=100" ,
              Version: "2018-05-25",
              ClusterName: this.clusterId
            };
          } else {
            params = {
              Method: "GET",
              Path:
                "/apis/batch/v1/namespaces/" +
                nameSpace.metadata.name +
                "/jobs?fieldSelector=metadata.name=" +
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
    //获取StatefulSet列表
    async getJobList() {
      this.loadShow = true;
      let params = {};
      if (this.searchInput === "") {
        params = {
          Method: "GET",
          Path:
            "/apis/batch/v1/namespaces/" +
            this.searchType +
            "/jobs?limit=100", 
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      } else {
        params = {
          Method: "GET",
          Path:
            "/apis/batch/v1/namespaces/" +
            this.searchType +
            "/jobs?fieldSelector=metadata.name=" +
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

    //跳转详情
    goJobDetail(rowData) {
      this.$router.push({
        name: "jobDetail",
        query: {
          clusterId: this.clusterId,
          spaceName: this.searchType,
          rowData: rowData,
          jobList: this.list
        }
      });
    },
     //编辑Yaml
    goUpdateYaml(rowData){
      this.$router.push({
        name:'updateJob',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
          rowData:rowData,
          workload:'jobs'
        }
      })
       sessionStorage.setItem('namespace',rowData.metadata.namespace)
    },
      //是否打开删除弹窗
    deleteDeployment(rowData) {
      this.isShowDeleteModal = true;
      this.deploymentName = rowData.metadata.name;
    },
     //删除资源
    async submitDelete() {
      this.loadShow = true;
      let params = {
        Method: "DELETE",
        Path:
          "/apis/batch/v1/namespaces/" +
          this.searchType +
          "/jobs/" +
          this.deploymentName,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({ propagationPolicy: "Background" }),
        ClusterName: this.clusterId
      };
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
                type: "success",
                message: "删除成功",
                duration: 0,
                showClose: true
            });
          this.loadShow = false;
          this.isShowDeleteModal = false;
          this.getJobList();
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
    //选择搜索条件
    changeSearchType(val) {
      this.getJobList();
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getJobList();
    },
    //刷新数据
    refreshList() {
      this.getJobList();
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
      // this.getJobList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getJobList();
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
    Loading
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
</style>

