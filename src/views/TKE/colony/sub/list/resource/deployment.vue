 <!--工作负载- Deployment -->
<template>
  <div >
      <subTitle title='Deployment'  />

      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button @click="goWorkloadCreate('deployment')" size="small" type="primary">新建</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <div>
            <span>命名空间</span>
            <el-select size="mini" v-model="nameSpaceName" placeholder="请选择" @change="changNameSpace" style="margin-bottom:5px;">
              <el-option v-for="item in searchOptions" :key="item.metadata.name" :value="item.metadata.name">
              </el-option>
            </el-select>
          </div>
          <tkeSearch 
            refreshData
            exportData
            :typeValue='searchType' 
            inputPlaceholder='请输入关键词搜索'
            :searchInput='searchInput'

            @changeInput="changeSearchInput"
            @clickSearch="clickSearch"
            @refresh='refreshList'
            @exportExcel="exportExcel"
          >
          </tkeSearch>
        </div>
      </div>

      <!-- 数据列表展示 -->
      <div class="tke-card mt10">
        <el-table
          @selection-change="handleSelectionChange"
          :data="list"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <span @click="goDeploymentDetail()" class="tke-text-link">{{scope.row.metadata && scope.row.metadata.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Labels"
            >
            <template slot-scope="scope">
               <span>k8s-app:{{scope.row.k8sApp}}、qcloud-app:{{scope.rowqcloudApp}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Selector"
            >
            <template slot-scope="scope">
                <span><span>k8s-app:{{scope.row.k8sApp}}、qcloud-app:{{scope.rowqcloudApp}}</span></span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="运行/期望Pod数量"
            >
            <template slot-scope="scope">
              <span>0/1</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <span class="tke-text-link" @click="goPodUpdate('number')">更新Pod数量</span>
              <span class="tke-text-link ml10" @click="goPodUpdate('config')">更新Pod配置</span>
              <el-dropdown class=" tke-dropdown" >
                <span class="el-dropdown-link ml10" >
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a"><span class="tke-text-link">重新部署</span></el-dropdown-item>
                  <el-dropdown-item command="a"><span class="tke-text-link">设置更新策略</span></el-dropdown-item>
                  <el-dropdown-item command="b"><span class="tke-text-link" >更新调度策略</span></el-dropdown-item>
                  <el-dropdown-item command="c"><span class="tke-text-link">编辑YAML</span></el-dropdown-item>
                  <el-dropdown-item command="c"><span class="tke-text-link">删除</span></el-dropdown-item>
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
              :total="total">
            </el-pagination>
          </div>
        </div>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import openDrawer from "./components/openDrawer";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyResourceDeployment",
  data() {
    return {
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],
      flag:false,
      searchOptions: [],//命名空间列表
      nameSpaceName: 'default',//选中的命名空间名称
      searchType: "default", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.getNameSpaceList();
    this.getDeploymentList();
  },
  methods: {
    //获取命名空间列表数据
    async getNameSpaceList() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          this.searchOptions = response.items;
          //默认选中第一项
          let nameSpace = response.items[0];
          this.nameSpaceName = nameSpace.metadata.name;
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
    },

    //获取列表数据
    async getDeploymentList() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.nameSpaceName+"/deployments?limit="+this.pageSize,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            response.items.map(deployment => {
              deployment.k8sApp = deployment.metadata.labels && deployment.metadata.labels.k8s,
              deployment.qcloudApp = deployment.metadata.labels && deployment.metadata.labels.qcloud
            });
          }
          console.log(response,"response");
          this.list = response.items;
          this.total = response.items.lenght;
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
    },

    //选择命名空间
    changNameSpace() {
      this.getDeploymentList();
    },

     // 新建
    goWorkloadCreate(type){
      this.$router.push({
          name: "workloadCreate",
          query: {
            type:type,
            clusterId: this.clusterId
          }
      });
    },
    //更新pod
    goPodUpdate(type){
      this.$router.push({
          name: "podUpdate",
          query: {
            type:type,
            clusterId: this.clusterId
          }
      });
    },

     // 详情.
    goDeploymentDetail(){
      this.$router.push({
          name: "deploymentDetail",
          query: {
            clusterId: this.clusterId
          }
      });
    },


    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      console.log(this.searchType)
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput)
    },
    // 点击搜索
    clickSearch(val){
      this.searchInput = val;
      console.log(this.searchInput)
    },
    //刷新数据
    refreshList(){
      console.log('refreshList....')
    },
    // 导出表格
    exportExcel() {
      console.log('exportExcel...')
      /* generate workbook object from table */
      // var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      // var wbout = XLSX.write(wb, {
      //   bookType: "xlsx",
      //   bookSST: true,
      //   type: "array"
      // });
      // try {
      //   FileSaver.saveAs(
      //     new Blob([wbout], {
      //       type: "application/octet-stream"
      //     }),
      //     this.$t("CVM.clBload.fzjh") + ".xlsx"
      //   );
      // } catch (e) {
      //   if (typeof console !== "undefined") console.log(e, wbout);
      // }
      // return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      // this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      // this.getColonyList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }

  },
  components: {
    subTitle,
    tkeSearch,
    Loading,
    openDrawer
  }
};
</script>

<style lang="scss" scoped>
 
</style>

