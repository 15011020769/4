 <!-- 伸缩组列表 -->
<template>
  <div >
    <subTitle title='伸缩组列表'  />
     <!-- 全局配置 -->
    <div class="tke-card tke-formpanel-wrap">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <h4 class="tke-formpanel-title">全局配置</h4>
        </div>
        <!-- 右侧 -->
        <div class="grid-right" style="padding-bottom:20px">
          <span class="tke-text-link">编辑</span>
        </div>
      </div>
      
      <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
        <el-form-item label="自动缩容">
          <div class="tke-form-item_text">已关闭</div>
        </el-form-item>
        <el-form-item label="扩容算法">
          <div class="tke-form-item_text">随机</div>
        </el-form-item>
        
        <el-form-item label="集群规模上限">
          <div class="tke-form-item_text">
            可扩容节点数量受VPC网络、容器网络、TKE集群节点配额、可购买云主机配额限制 <br>
            当前容器网络 172.16.0.0/16 最大支持 1008个节点<br>
            当前地域下集群节点数量上限配额为：5000<br>
            当前地域下按量计费云服务器剩余配额为：100<br>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 新建、搜索相关操作 -->
    <div class="tke-action mt20">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button size="small" type="primary">新建伸缩组</el-button>
          <el-button size="small" disabled="">删除</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <el-input placeholder="请输入内容" size="small"  class="tke-search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <i class="el-icon-download tke-download"></i>
        </div>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card">
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
              <span v-if="scope.row.status===true" class="text-green">已启用</span>
              <span v-else class="text-red">已停用</span>
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
          label="kubernetes版本"
          >
          <template slot-scope="scope">
            <el-tooltip effect="light" content="v1.10.5-tke.6" placement="top">
              <span>v1.10.5-tke.6</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
            width="200"
          label="配置">
          <template slot-scope="scope">
            标准型S3 <br>
            1核 , 1GB , 1 Mbps<br>
            系统盘: 50GB 高性能云硬盘<br>
          </template>
        </el-table-column>
        <el-table-column
        width="120"
          prop="nodeTotal"
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
          prop=""
          label="所属伸缩组">
          <template slot-scope="scope">
            <p>asg-p3mt06kq</p>
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
        <el-table-column
          label="操作"
          width="130"
          >
          <template slot-scope="scope">
            <span class="text-gray">停用</span>
            <span class="tke-text-link ml10">启用</span>
            
            <el-dropdown class=" tke-dropdown" >
              <span class="el-dropdown-link ml10" >更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a"><span class="tke-text-link">调整配置</span></el-dropdown-item>
                <el-dropdown-item command="a"><span class="tke-text-link">删除</span></el-dropdown-item>
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
import Loading from "@/components/public/Loading";
import { ALL_CITY } from "@/constants";
export default {
  name: "colonyHpa",
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
      multipleSelection: []  
    };
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
      // this.pageSize=val;
      this.getColonyList();
    },

    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  components: {
    subTitle,
    Loading
  }
};
</script>

<style lang="scss" scoped>


</style>

