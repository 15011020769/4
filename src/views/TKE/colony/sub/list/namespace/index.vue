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
            inputPlaceholder='请输入伸缩组ID'
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
          style="width: 100%">
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <span @click="goNamespaceDetail()" class="tke-text-link" >kube-public</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="状态"
            >
            <template slot-scope="scope">
               <span v-if="scope.row.status===true" class="text-green">Active</span>
               <span v-else class="text-red">Stop</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="描述"
            >
            <template slot-scope="scope">
                <span>-</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="创建时间"
            >
            <template slot-scope="scope">
              <el-tooltip effect="light" content="2020-01-02 14:02:22" placement="top">
                <span>2020-01-02 14:02:22</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <span class="tke-text-link">删除</span>
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
import { ALL_CITY } from "@/constants";
export default {
  name: "colonyNamespace",
  data() {
    return {
      searchInput: "", //输入的搜索关键字
      loadShow: false, //加载是否显示
      list:[
        {
          status:false
        },
        {
          status:true
        }
      ], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: []  
    };
  },
 
 created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
  },
  methods: {
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
    goNamespaceDetail(){
      this.$router.push({
          name: "namespaceDetail",
          query: {
            clusterId: this.clusterId
          }
      });
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


