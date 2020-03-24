 <!-- 命名空间 -->
<template>
  <div >
    <subTitle title='Namespace'  />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" @click="goNamespaceCreate" type="primary">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch 
          exportData
          refreshData
          :inputPlaceholder="$t('TKE.myMirror.qsrmc')"
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
        :data="list"
        v-loading="loadShow"
        style="width: 100%"
        id="exportTable">
        <el-table-column
          :label="$t('TKE.overview.mc')"
          >
          <template slot-scope="scope">
            <span @click="goNamespaceDetail(scope.row.metadata.name)" class="tke-text-link" >{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.overview.zt')"
          >
          <template slot-scope="scope">
              <span class="text-green">{{scope.row.status.phase}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="描述"
          >
          <template slot-scope="scope">
              <span>{{scope.row.metadata.annotations?scope.row.metadata.annotations.description:'-'}}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          :label="$t('TKE.overview.cjsj')"
          >
          <template slot-scope="scope">
              <span>{{scope.row.addTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button size="small" type="text" :disabled="scope.row.isDelete?true:false" @click="deleteNameSpace(scope.row)">{{$t('TKE.overview.sc')}}</el-button>
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="showNameSpaceModal" width="35%">
      <p style="color:#444;font-weight:bolder;">{{$t('TKE.overview.qdsc')}}Namespace：{{nameSpaceName}}嗎？</p>
      <p style="color:#e54545">{{$t('TKE.subList.scmmkj')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelete()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="showNameSpaceModal = false">取 消</el-button>
      </span>
    </el-dialog>  
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import moment from 'moment';
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyNamespace",
  data() {
    return {
      clusterId: '',//集群id
      searchInput: "", //输入的搜索关键字
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],//全选数据数组
      showNameSpaceModal: false,//是否显示删除框
      nameSpaceName: {},//命名空间名称
    };
  },
 
 created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.getNameSpaceList();
    this.getNameSpaceTotal();
  },
  methods: {
    //获取命名空间列表数据
    getNameSpaceList () {
      this.loadShow = true;
      const param = {
        Method: "GET",
        Path: "/api/v1/namespaces?limit="+this.pageSize,
        // Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      if(this.searchInput !== '') {
        param.Path = '/api/v1/namespaces?fieldSelector=metadata.name='+ this.searchInput;
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.list = [];
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log("sss",response.items,"items");
          if(response.items.length > 0) {
            response.items.map(o => {
              o.addTime = moment(o.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
              if(o.metadata.name === 'default' || o.metadata.name.indexOf('kube-') === 0) {
                o.isDelete = true
              } else {
                o.isDelete = false
              }
            });
            this.list = response.items;
            // this.total = response.items.length;
          }
        } else {
          this.list = [];
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
    getNameSpaceTotal () {
      this.loadShow = true;
      const param = {
        Method: "GET",
        // Path: "/api/v1/namespaces?limit="+this.pageSize,
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      if(this.searchInput !== '') {
        param.Path = '/api/v1/namespaces?fieldSelector=metadata.name='+ this.searchInput;
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.total = 0;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log("sss",response.items,"items");
          if(response.items.length > 0) {
            this.total = response.items.length;
          }
        } else {
          this.list = [];
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
    //打开删除命名空间弹窗
    deleteNameSpace(row) {
      this.showNameSpaceModal = true;
      this.nameSpaceName = row.metadata.name;
    },
    //删除命名空间
    async submitDelete () {
      this.loadShow = true;
      const param = {
        Method: "DELETE",
        Path: "/api/v1/namespaces/"+this.nameSpaceName,
        Version: "2018-05-25",
        RequestBody: {"propagationPolicy": "Background", "gracePeriodSeconds": 0},
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.getNameSpaceList();
          this.loadShow = false;
          this.showNameSpaceModal = false;
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
    },
    // 新建Namespace
    goNamespaceCreate(){
      this.$router.push({
          name: "namespaceCreate",
          query: {
            clusterId: this.clusterId
          }
      });
    },

    // 详情
    goNamespaceDetail(name){
      this.$router.push({
          name: "namespaceDetail",
          query: {
            clusterId: this.clusterId,
            name: name
          }
      });
    },

    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val){
      this.searchInput = val;
      this.getNameSpaceList();
    },
    //刷新数据
    refreshList(){
      this.getNameSpaceList();
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
          this.$t("tke-spaceList") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      // this.loadShow = true;
      // const param = {
      //   Method: "GET",
      //   Path: "/api/v1/namespaces?limit="+this.pageSize+"&continue=" + 
      //     btoa(JSON.stringify({v:"meta.k8s.io/v1",rv:90778097,start: this.list[this.list.length - 1].metadata.name+"\u0000"})),
      //   Version: "2018-05-25",
      //   ClusterName: this.clusterId
      // }
      // if(this.searchInput !== '') {
      //   param.Path = '/api/v1/namespaces?fieldSelector=metadata.name='+ this.searchInput;
      // }
      // this.axios.post(POINT_REQUEST, param).then(res => {
      //   if (res.Response.Error === undefined) {
      //     this.list = [];
      //     this.loadShow = false;
      //     let response = JSON.parse(res.Response.ResponseBody);
      //     console.log("sss",response.items,"items");
      //     if(response.items.length > 0) {
      //       response.items.map(o => {
      //         o.addTime = moment(o.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
      //         if(o.metadata.name === 'default' || o.metadata.name.indexOf('kube-') === 0) {
      //           o.isDelete = true
      //         } else {
      //           o.isDelete = false
      //         }
      //       });
      //       this.list = response.items;
      //     }
      //   } else {
      //     this.list = [];
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
      // this.getNameSpaceList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.getNameSpaceList();
    },

  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
.tke-grid >>> .el-input__inner,
.tke-grid >>> .el-button {
  border-radius: 0;
}
</style>


