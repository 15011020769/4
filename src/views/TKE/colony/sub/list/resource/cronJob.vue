 <!--工作负载- CronJob -->
<template>
  <div>
    <subTitle title="CronJob" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goWorkloadCreate('CronJob')" size="small" type="primary">新建</el-button>
        <!-- <el-button size="small">监控</el-button> -->
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <!-- <tkeSearch
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
        ></tkeSearch> -->
        <tkeSearch
          typeSelect
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
    <div class="tke-card mt10" style="margin-top:12px;">
      <el-table
        :data="list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)"
        v-loading="loadShow"
        id="exportTable"
        style="width: 100%"
      >
        <el-table-column :label="$t('TKE.overview.mc')">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goCronJobDetail(scope.row)">{{scope.row.metadata.name}}</span>
            <!-- <span>{{scope.row.metadata.name}}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.subList.zxcl')">
          <template slot-scope="scope">
            <span>{{scope.row.spec.schedule}}</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.subList.bxd')">
          <template slot-scope="scope">
            <span>{{scope.row.spec.jobTemplate.spec.parallelism || '-'}}</span>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('TKE.subList.cfcs')">
          <template slot-scope="scope">
            <span>{{scope.row.spec.jobTemplate.spec.completions || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goPodConfigUpdate(scope.row)">更新Pod配置</span>
            <span class="tke-text-link ml10" @click="goUpdateTactics(scope.row)">{{$t('TKE.subList.gxddcl')}}</span>
            <el-dropdown class="tke-dropdown" trigger="click">
              <span class="el-dropdown-link ml10" style="cursor:pointer">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="c">
                 <el-tooltip  v-if="searchType=='kube-system'"   class="item" effect="light" :content="$t('TKE.subList.dqbkbj')" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >{{$t('TKE.overview.bj')}}YAML</el-button>
                  </el-tooltip>
                   <span
                    class="tke-text-link"
                     v-else
                     @click="goUpdateYaml(scope.row)"
                  >{{$t('TKE.overview.bj')}}YAML</span>
                </el-dropdown-item>
                <el-dropdown-item command="d">
                  <el-tooltip  v-if="searchType=='kube-system'"   class="item" effect="light" :content="$t('TKE.subList.dqbkcz')" placement="right">
                   <el-button
                    type="text"
                    class="notuse"
                    >{{$t('TKE.overview.sc')}}</el-button>
                  </el-tooltip>
                  <span
                    v-else
                    class="tke-text-link"
                   @click="deleteDeployment(scope.row)"
                  >{{$t('TKE.overview.sc')}}</span>
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
      <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="isShowDeleteModal" width="35%">
        <p style="font-weight: bolder;color: #444;">{{$t('TKE.overview.qdsc')}}Deployment：{{deploymentName}}嗎？</p>
        <p style="color:#e54545;">{{$t('TKE.subList.gwxsy')}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">{{$t('TKE.overview.qd')}}</el-button>
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
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, TKE_COLONY_QUERY,POINT_REQUEST } from "@/constants";
export default {
  name: "colonyResourceCronJob",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      multipleSelection: [],

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

    this.getData();
  },
  methods: {
    async getData() {
      await this.nameSpaceList();
      await this.listData();
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
   //更新pod配置
    goPodConfigUpdate(rowData) {
      this.$router.push({
        name: "podCronjobUpdate",
        query: {
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
           workload:'cronjobs'
        }
      });
       sessionStorage.setItem('namespace',rowData.metadata.namespace)
    },
    //更新调度策略
    goUpdateTactics(rowData){
       this.$router.push({
        name:'updateCronjobStrategy',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
          workload:'cronjobs'
        }
      })
      sessionStorage.setItem('namespace',rowData.metadata.namespace)
    },
    //编辑Yaml
    goUpdateYaml(rowData){
      this.$router.push({
        name:'updateCronJob',
        query:{
          clusterId: this.clusterId,
          name: rowData.metadata.name,
          spaceName:rowData.metadata.namespace,
          rowData:rowData,
          workload:'cronjobs'
        }
      })
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
        Path: `/apis/batch/v1beta1/namespaces/${this.searchType}/cronjobs/${this.deploymentName}`,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({ propagationPolicy: "Background" }),
        ClusterName: this.clusterId
      };
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.isShowDeleteModal = false;
          this.$message({
                type: "success",
                message: "刪除成功",
                duration: 0,
                showClose: true
            });
          this.listData();
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
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
      this.searchType = val;
      this.listData();
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val) {
      this.pageIndex = 1;
      this.searchInput = val;
      this.listData();
    },
    //重新整理数据
    refreshList() {
      this.listData();
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

    //跳转详情
    goCronJobDetail(rowData) {
      this.$router.push({
        name: "cronJobDetail",
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          rowData: rowData
        }
      });
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      // this.getColonyList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.getColonyList();
    },
    //命名空间选项
    async nameSpaceList() {
      if (this.clusterId) {
        var params = {
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces",
          Version: "2018-05-25"
        };
        await this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error == undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            var nameList = [];
            data.items.forEach(item => {
              nameList.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.searchOptions = nameList;
            this.searchType = nameList[0].value;
          }
        });
      }
    },
    async listData() {
      this.loadShow=true;
      // var params = {
      //   ClusterName: this.clusterId,
      //   Method: "GET",
      //   Path:
      //     "/apis/batch/v1beta1/namespaces/" +
      //     this.searchType +
      //     "/cronjobs?fieldSelector=metadata.name=" +
      //     this.searchInput,
      //   Version: "2018-05-25"
      // };

      let params = {};
      if (this.searchInput === "") {
        params = {
          Method: "GET",
          Version: "2018-05-25",
          ClusterName: this.clusterId,
          Path:
            "/apis/batch/v1beta1/namespaces/" +
            this.searchType +
            "/cronjobs?limit=100",
        };
      } else {
        params = {
          Method: "GET",
          Path:
            "/apis/batch/v1beta1/namespaces/" +
            this.searchType +
            "/cronjobs?fieldSelector=metadata.name=" +
            this.searchInput,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
      }
      await this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        this.list = [];
        if (res.Response.Error == undefined) {
          var data = JSON.parse(res.Response.ResponseBody);
          this.loadShow=false
          this.list = data.items;
          this.total = data.items.length;
        }else{
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
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
</style>

