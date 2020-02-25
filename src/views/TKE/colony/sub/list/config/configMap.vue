 <!--配置管理 - ConfigMap -->
<template>
  <div >
      <subTitle title='ConfigMap'  />

      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button @click="goConfigmapCreate()" size="small" type="primary">新建</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <tkeSearch 
            typeSelect 
            refreshData
            exportData
            typeLabel='命名空间' 
            :typeOptions='searchOptions'
            :typeValue='searchType' 
            inputPlaceholder='请输入关键词搜索'
            :searchInput='searchInput'

            @changeType="changeSearchType"
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
          :data="list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)"
          id="exportTable"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <span @click="goConfigmapDetail(scope.row)" class="tke-text-link">{{scope.row.metadata.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Labels"
            >
            <template slot-scope="scope">
              <!-- <p v-if="scope.row.metadata.labels">{{scope.row.metadata.labels}}</p> -->
               <p >-</p>
            </template>
          </el-table-column>

          <el-table-column
            prop=""
            label="创建时间"
            >
            <template slot-scope="scope">
              <p>{{timeFormat(scope.row.metadata.creationTimestamp)}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            >
            <template slot-scope="scope">
              <span class="tke-text-link">编辑YAML</span>
              <span class="tke-text-link ml10">删除</span>
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
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import {
     ALL_CITY,
     TKE_COLONY_QUERY
   } from "@/constants";
export default {
  name: "colonyConfigConfigmap",
  data() {
    return {
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:1,
      multipleSelection: [],
      
      //搜索下拉框
      searchOptions: [],
      searchType: "default", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.nameSpaceList();
   this.tableListData();
  },
  methods: {
   
    tableListData(){
      var params={
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces/"+this.searchType+"/configmaps?fieldSelector=metadata.name="+this.searchInput,
          Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
              console.log(data)
              this.list=data.items;
              this.total=data.items.length
        }
      })

    },
    //命名空间选项 
    nameSpaceList() {
         if (this.clusterId) {
           var params = {
             ClusterName: this.clusterId,
             Method: "GET",
             Path: "/api/v1/namespaces",
             Version: "2018-05-25",
           };
           this.axios.post(TKE_COLONY_QUERY, params).then(res => {
             if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
                 var nameList=[];
              data.items.forEach(item => {
                nameList.push({value:item.metadata.name,label:item.metadata.name})
              })
              this.searchOptions=nameList
              this.searchType=nameList[0].value
             }
           })
         }
       },
         // 新建
    goConfigmapCreate(){
      this.$router.push({
          name: "configmapCreate",
          query: {
            clusterId: this.clusterId
          }
      });
    },

     // 详情
    goConfigmapDetail(item){
      console.log(item)

      this.$router.push({
          name: "configmapDetail",
          query: {
            clusterId: this.clusterId,
            name:item.metadata.name,
            np:item.metadata.namespace
          }
      });
    },
    timeFormat(times) {
        var d = new Date(times);
        var n = d.getFullYear();
        var y = d.getMonth() + 1;
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m

        return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      },
    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
       this.tableListData();
      console.log(this.searchType)
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      //  this.tableListData();
      console.log(this.searchInput)
    },
    // 点击搜索
    clickSearch(val){
      this.searchInput = val;
       this.tableListData();
      console.log(this.searchInput)
    },
    //刷新数据
    refreshList(){
      console.log('refreshList....')
       this.tableListData();
    },
    // 导出表格
    exportExcel() {
      console.log('exportExcel...')
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
      this.pageIndex = val-1;
      // this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      // this.getColonyList();
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
 
</style>

