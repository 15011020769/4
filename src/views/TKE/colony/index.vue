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
      <div class="tke-action">
        <div class="tke-grid ">
          <!-- 左侧 -->
          <div class="grid-left">
            <el-button @click="goColonyCreate"  size="small" type="primary">新建</el-button>
          </div>
          <!-- 右侧 -->
          <div class="grid-right">
            <el-input placeholder="请输入内容" size="small" v-model="searchInput" class="tke-search">
              <el-select class="tke-search-select" v-model="searchSelect" slot="prepend" placeholder="请选择">
                <el-option v-for="option in searchOptions" :label="option.label" :value="option.value"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <i class="el-icon-download tke-download"></i>
          </div>
        </div>
        
      </div>

      <!-- 数据列表展示 -->
      <div class="tke-card">
        <el-table
          :data="list"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="ID/名称"
            >
            <template slot-scope="scope">
              <span class="tke-text-link" @click="goColonySub(scope.row.ClusterId)">{{scope.row.ClusterId}}</span>
              <p class="stk-editor-name">
                <span>{{scope.row.ClusterName}}</span>
                <i class="el-icon-edit tke-icon" @click="showEditNameDlg()"></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="监控"
            >
            <template slot-scope="scope">
               <i class="icon-chart"></i>
               <span class="tag-danger">未配告警</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ClusterVersion"
            label="kubernetes版本"
            >
          </el-table-column>
          <el-table-column
            prop="address"
            label="类型/状态">
            <template slot-scope="scope">
              <span v-if="scope.row.ClusterType=='MANAGED_CLUSTER'">托管集群</span>
              <span v-else>独立部署</span>
              (<span v-if="scope.row.ClusterStatus=='Running'" class="text-green">运行中</span>
              <span v-else class="text-red">已停止</span>)
            </template>
          </el-table-column>
          <el-table-column
            prop="nodeTotal"
            label="节点数">
            <template slot-scope="scope">
              <a href="#">{{scope.row.ClusterNodeNum}}条</a>
               (<span class="text-green">全部正常</span>)
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="已分配/总配置">
            <template slot-scope="scope">
              <p>CPU: -/-</p>
              <p>内存: -/-</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="220">
            <template slot-scope="scope">
              <span class="tke-text-link">配置告警</span>
              <span class="tke-text-link ml10">添加已有节点</span>
              <el-dropdown class="ml10 tke-dropdown" >
                <span class="el-dropdown-link " >
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a"><span class="tke-text-link" @click="goColonySub(scope.row.ClusterId)">查看集群凭证</span></el-dropdown-item>
                  <el-dropdown-item command="b"><span class="tke-text-link" href="#">新建节点</span></el-dropdown-item>
                  <el-dropdown-item command="c"><span class="tke-text-link" href="#">删除</span></el-dropdown-item>
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
      </div>
    </div>

    <!-- 编辑集群名称弹窗 -->
    <el-dialog
      title="编辑集群名称"
      :visible.sync="editNameDialogVisible"
      width="500px"
      custom-class='tke-dialog'
      >
      <div>
        <el-form  label-width="80px" >
          <el-form-item label="原名称">
            <p>集群测试</p>
          </el-form-item>
          <el-form-item label="新名称">
            <el-input size="small" placeholder="请输入新名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editNameDialogVisible = false">提交</el-button>
        <el-button @click="editNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import HeadCom from "@/components/public/Head";
// import SEARCH from "@/components/public/SEARCH";
// import FileSaver from "file-saver";
// import XLSX from "xlsx";
import Loading from "@/components/public/Loading";

import {
    ALL_CITY,
    ALL_PROJECT,
    COLONY_LIST,
    COLONY_STATUS
} from "@/constants";
export default {
  name: "colony",
  data() {
    return {
      loadShow: true, //加载是否显示
      list:[], //集群列表
      total:0,
      pageSize:10,
      pageIndex:0,      



      searchSelect:'',
      searchInput:'',
      editNameDialogVisible:false,
      loading: true, //表格加载
      btnload: true, //地域按钮加载状态
      region: "", //地区
      // tableData: [], //表格数据
      //搜索下拉框
      searchOptions: [
        {
          value: "name",
          label: "名称"
        },
        {
          value: "tag",
          label: "标签"
        },
      ],
      search: "", // 搜索
      searchInput: "",
      searchValue: "", //inp输入的值
      //分页
    };
  },
  components: {
    // HeadCom,
    // SEARCH
    Loading
  },
  created() {
    this._region();
    this.getColonyList();
  },
  mounted() {
   
  },
  methods: {
    // 获取集群列表
    async getColonyList() {
      this.loadShow = true;
      let params = {
        Version:'2018-05-25',
        Limit:this.pageSize,
        Offset:this.pageIndex,
      };
      const res = await this.axios.post(COLONY_LIST, params);
      if(res.Error){
        console.log(res);
        this.loadShow = false;
      }else{
        // console.log(res)
        if(res.Response.Clusters.length>0){
          let ids=[];
          res.Response.Clusters = res.Response.Clusters.map(item => {
              ids.push(item.ClusterId);
              return item;
          })
          this.total = res.Response.TotalCount;
          // console.log(ids);
          // this.getColonyStatus(ids);
        }
        this.list=res.Response.Clusters;
        console.log(this.list)
        this.loadShow = false;
      }
    },
    // 获取集群列表状态(不对外单独提供文档,所以无法实现)
    async getColonyStatus(ids) {
        let params = {
          ClusterIds:ids,
          Version:'2018-05-25'
        };
        const res = await this.axios.post(COLONY_STATUS, params);
        console.log(res);
        return res;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.getColonyList();
    },
    
    // 创建集群跳转
    goColonyCreate(){
       this.$router.push({
          name: "colonyCreate",
          query: {
           
          }
      });
    },
    // 查看详情跳转
    goColonySub(id){
       this.$router.push({
          name: "colonySub",
          query: {
            clusterId: id
          }
      });
    },
    // 编辑集群弹窗相关
    showEditNameDlg(){
      this.editNameDialogVisible=true;
    },
   
   


    //获取列表
    // init() {
    //   this.loading = true;
    //   const params = {
    //     Region: "ap-taipei",
    //     Version: "2018-05-25"
    //   };
    //   this.axios.post("tke2/DescribeClusters", params).then(res => {
    //     console.log(res);
    //     this.loading = false;
    //   });
    // },
    //分页
    
    //获取地域
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
        this.btnload = false;
      });
    },
    //导出表格
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
          new Blob([wbout], { type: "application/octet-stream" }),
          '集群管理' + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //选择搜索条件
    changeValue(val) {
      this.searchValue = val;
    },
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.init();
      }
    },
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.init();
      } else {
        this.$message.error("請輸入正確搜索信息");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.colony-wrap >>> .el-button,
.colony-wrap >>> .el-input__inner {
  height: 30px !important;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.colony-wrap {
  .colony-main {
    padding: 20px;
    box-sizing: border-box;

    .search {
      float: right;
      height: 100%;
    }

    .colony-table {
      background: white;
      margin-top: 10px;
    }
    .page {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
.tke-search-select{
  width: 90px;
}

// 弹窗相关
.tag-danger{
  display: inline-block;
  background-color: #ff9d00;
  color: #fff;
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
  vertical-align: top;
  margin-left: 5px;
}
.el-dialog__footer .dialog-footer{
  display: block;
  text-align: center;
}
</style>

