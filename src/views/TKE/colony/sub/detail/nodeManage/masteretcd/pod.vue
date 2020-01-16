 <!-- Master&Etcd-pod管理 -->
<template>
  <div class="colony-main">
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" >监控</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch 
          typeSelect 
          typeLabel='资源属性' 
          :typeOptions='searchOptions'
          :typeValue='searchType' 
          inputPlaceholder='请输入关键词搜索'
          :searchInput='searchInput'

          @changeType="changeSearchType"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
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
        <el-table-column type="expand" prop="container">
          <template slot-scope="scope">
            <el-table border :data="scope.row.container" >
                <el-table-column prop="" label="容器名称" >
                  <template slot-scope="scope">
                    <span>ccs-log-collector</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="容器ID" >
                  <template slot-scope="scope">
                    <span>19112ce7e468a63b5ab4f1ca1f561f8fda57ad5603930d491b514398a25ffe6b</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="镜像版本号" >
                  <template slot-scope="scope">
                    <span>tpeccr.ccs.tencentyun.com/library/ip-masq-agent:latest</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="CPU Request" >
                  <template slot-scope="scope">
                    <span>0.3核</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="CPU Limit" >
                  <template slot-scope="scope">
                    <span>无限制</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="内存 Request" >
                  <template slot-scope="scope">
                    <span>无限制</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="内存 Limit" >
                  <template slot-scope="scope">
                    <span>无限制</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="重启次数" >
                  <template slot-scope="scope">
                    <span>0 次</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="状态" >
                  <template slot-scope="scope">
                    <span class="text-green">Running</span>
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="实例名称"
          >
          <template slot-scope="scope">
            <span class="tke-text-link">ip-masq-agent-7jdzn</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          >
          <template slot-scope="scope">
              <span class="text-green">Running</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例所在节点IP"
          >
          <template slot-scope="scope">
              <span>10.0.128.8</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例IP"
          >
          <template slot-scope="scope">
            <span>172.16.1.4</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="CPU Request"
          >
          <template slot-scope="scope">
            <span>0.25 核</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="内存 Request"
          >
          <template slot-scope="scope">
            <span>256 M</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="命名空间"
          >
          <template slot-scope="scope">
            <span>kube-system</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="所属工作负载"
          >
          <template slot-scope="scope">
            <p>asss</p>
            <p>Deployment</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="创建时间"
          >
          <template slot-scope="scope">
            <p>2020-01-10</p>
            <p>14:15:49</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="重启次数"
          >
          <template slot-scope="scope">
            <span>0 次</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <span class="tke-text-link">销毁重建</span>
            <span class="tke-text-link ml10">远程登录</span>
          </template>
        </el-table-column>
      </el-table>
      

      <!-- 分页 -->
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
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "masteretcdDetailPod",
  data() {
    return {
      loadShow: false, //加载是否显示
      list:[
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
      ], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],

       //搜索下拉框
      searchOptions: [
        {
          value: "podname",
          label: "Pod名称"
        },
        {
          value: "status",
          label: "状态"
        },
        {
          value: "namespace",
          label: "命名空间"
        }
        
      ],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
  components: {
    tkeSearch,
    Loading
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
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
  }
};
</script>

<style lang="scss" scoped>


</style>

