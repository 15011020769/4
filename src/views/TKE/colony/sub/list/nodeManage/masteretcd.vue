 <!-- Master&Etcd列表 -->
<template>
  <div >
    <subTitle title='Master&Etcd列表'  />
    <!-- 新建、搜索相关操作 -->
    <div class="tke-action">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button size="small" disabled="">监控</el-button>
        </div>
        <!-- 右侧 -->
        <!-- <div class="grid-right">
          <el-input placeholder="请输入内容" size="small"  class="tke-search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <i class="el-icon-download tke-download"></i>
        </div> -->
      </div>
    </div>

    <!-- 数据列表展示 -->
      <div class="tke-card">
        <el-table
          :data="list"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="ID/节点名"
            >
            <template slot-scope="scope">
              <span class="tke-text-link" >ins-8czy2x5q</span>
              <p>as-test02</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="状态"
            >
            <template slot-scope="scope">
               <span v-if="scope.row.status===true" class="text-green">健康</span>
               <span v-else class="text-red">异常</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="类型"
            >
            <template slot-scope="scope">
             <p>-</p>
            </template>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="可用区"
            >
            <template slot-scope="scope">
              <el-tooltip effect="light" content="台北一区" placement="top">
                <span>台北一区</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="主机类型">
            <template slot-scope="scope">
             <p>-</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
             width="200"
            label="配置">
            <template slot-scope="scope">
              标准型S3 <br>
              1核 , 1GB , 1 Mbps<br>
              系统盘: 50GB 高性能云硬盘<br>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="IP地址">
            <template slot-scope="scope">
              <p>175.97.134.163</p>
              <p>10.209.64.102</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="已分配/总资源">
            <template slot-scope="scope">
              <p>CPU: -/-</p>
              <p>内存: -/-</p>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            prop=""
            label="计费模式">
            <template slot-scope="scope">
              <p>按量计费-竞价</p>
              <p>2020-01-08 09:40:34创建</p>
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
import Loading from "@/components/public/Loading";
import { ALL_CITY } from "@/constants";
export default {
  name: "colonyNodeManageMasteretcd",
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
    
    };
  },
  components: {
    subTitle,
    Loading
  },
  created() {

  },
  methods: {
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
  }
};
</script>

<style lang="scss" scoped>


</style>

