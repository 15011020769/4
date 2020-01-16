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
          :data="list"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <span @click="goConfigmapDetail()" class="tke-text-link">ccas</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Labels"
            >
            <template slot-scope="scope">
               <p>-</p>
            </template>
          </el-table-column>

          <el-table-column
            prop=""
            label="创建时间"
            >
            <template slot-scope="scope">
              <p>2020-01-10<br>14:16:37</p>
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
import { ALL_CITY } from "@/constants";
export default {
  name: "colonyConfigConfigmap",
  data() {
    return {
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
      multipleSelection: [],
      
      //搜索下拉框
      searchOptions: [
        {
          value: "default",
          label: "default"
        },
        {
          value: "kube-system",
          label: "kube-system"
        },
        {
          value: "kube-public",
          label: "kube-public"
        }
        
      ],
      searchType: "default", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
  },
  methods: {
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
    goConfigmapDetail(){
      this.$router.push({
          name: "configmapDetail",
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

