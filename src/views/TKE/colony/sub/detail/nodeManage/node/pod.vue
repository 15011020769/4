 <!-- 节点-pod管理 -->
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
            <el-table border :data="scope.row.status.containerStatuses" >
                <el-table-column prop="" label="容器名称" >
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="容器ID" >
                  <template slot-scope="scope">
                    <span>{{scope.row.containerID}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="镜像版本号" >
                  <template slot-scope="scope">
                    <span>{{scope.row.imageID}}</span>
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
            <span class="tke-text-link">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          >
          <template slot-scope="scope">
              <span class="text-green">{{scope.row.status.phase}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例所在节点IP"
          >
          <template slot-scope="scope">
              <span>{{scope.row.status.hostIP}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例IP"
          >
          <template slot-scope="scope">
            <span>{{scope.row.status.podIP}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="CPU Request"
          >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="内存 Request"
          >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="命名空间"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata.namespace}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="所属工作负载"
          >
          <template slot-scope="scope">
            <p>{{scope.row.metadata.labels && scope.row.metadata.labels.k8s}}</p>
            <p></p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="创建时间"
          >
          <template slot-scope="scope">
            <p>{{scope.row.addTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="重启次数"
          >
          <template slot-scope="scope">
            <span></span>
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
import moment from 'moment';
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { GET_LINE_LIST } from '@/constants/BILL.js';
export default {
  name: "nodeDetailPod",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: "",
      node: '',
      list:[], //列表
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
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.node = this.$route.query.node;
    this.getPodList();
  },
  methods: {
    //获取列表数据
    getPodList() {
      const param = {
        Method: 'GET',
        Path: '/api/v1/pods?fieldSelector=spec.nodeName='+this.node+'&limit=20',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        let response = JSON.parse(res.Response.ResponseBody);
        if(response.items.length > 0) {
          response.items.map(o => {
            o.addTime = moment(o.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
          });
          this.list = response.items;
        }
        console.log(response,"response");
      })
    },
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

