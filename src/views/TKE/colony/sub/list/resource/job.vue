 <!--工作负载- Job -->
<template>
  <div >
      <subTitle title='Job'  />

      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button @click="goWorkloadCreate('job')" size="small" type="primary">新建</el-button>
          <el-button size="small" >监控</el-button>
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
              <span class="tke-text-link">job</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Labels"
            >
            <template slot-scope="scope">
               <span>k8s-app:job、qcloud-app:job</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="Selector"
            >
            <template slot-scope="scope">
                <span>k8s-app:job、qcloud-app:job</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="运行/期望Pod数量"
            >
            <template slot-scope="scope">
              <span>1/1</span>
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
      </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ALL_CITY } from "@/constants";
export default {
  name: "colonyResourceJob",
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

