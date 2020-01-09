 <!-- 伸缩组列表 -->
<template>
  <div >
      <subTitle title='Deployment'  />

      <!-- 新建、搜索相关操作 -->
      <div class="tke-action">
        <div class="tke-grid ">
          <!-- 左侧 -->
          <div class="grid-left">
            <el-button size="small" type="primary">新建</el-button>
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
            >
            </tkeSearch>
          
              
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
            label="名称"
            >
            <template slot-scope="scope">
              <span class="tke-text-link" >kube-public</span>
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
          value: "name",
          label: "名称"
        },
        {
          value: "tag",
          label: "标签"
        },
      ],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {

  },
  methods: {
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

  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
  .tke-search-select{
    width: 100px;
  }
</style>

