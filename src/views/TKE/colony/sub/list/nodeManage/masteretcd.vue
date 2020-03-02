 <!-- Master&Etcd列表 -->
<template>
  <div >
    <subTitle :title='tit'  />
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" type="primary" @click='toMonitor'>监控</el-button>
      </div>
      <!-- 右侧 -->
      <!-- <div class="grid-right">
        <el-input placeholder="请输入内容" size="small"  class="tke-search">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <i class="el-icon-download tke-download"></i>
      </div> -->
     
      </div>
   
    <!-- 数据列表展示 -->
      <div class="tke-card mt10">
        <el-table
          :data="list"
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="ID/节点名"
            >
            <template slot-scope="scope">
              <span @click="goMasteretcdDetail(scope.row)" class="tke-text-link" >{{scope.row.InstanceId}}</span>
              <p>{{scope.row.InstanceName}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="状态"
            >
            <template slot-scope="scope">
               <span v-if="scope.row.status===true" class="text-green"></span>
               <span v-else class="text-red"></span>
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
                <span></span>
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
              标准型{{scope.row.InstanceFamily}} <br />
              {{scope.row.CPU}}核 , {{scope.row.Memory}}GB , 1 Mbps<br />
              系统盘: {{scope.row.SystemDisk && scope.row.SystemDisk.DiskSize}}GB 高性能云硬盘<br />
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="IP地址">
            <template slot-scope="scope">
              <p>{{scope.row.PublicIpAddresses && scope.row.PublicIpAddresses[0]}}</p>
              <p>{{scope.row.PrivateIpAddresses && scope.row.PrivateIpAddresses[0]}}</p>
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
              <p></p>
              <p>{{scope.row.addTime}}创建</p>
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
      
     <!-- <el-drawer
        title="我是标题"
        :visible.sync="flag"
        >
            <span>我来啦!</span>
      </el-drawer> -->
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import Loading from "@/components/public/Loading";
import moment from 'moment';
import { NODE_INFO, NODE_LIST, ALL_CITY } from "@/constants";
export default {
  name: "colonyNodeManageMasteretcd",
  data() {
    return {
      tit:"Master&Etcd列表",
      clusterId:'',
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      flag: false,
      DrawerTitle:''
    };
  },
  components: {
    subTitle,
    Loading,
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.getNodeList();
  },
  methods: {
    toMonitor(){
      //跳转监控页面
      this.$router.push({
        name:"colonyOpenMonitor",
        query:{
          title:this.tit
        }
      })
    },
    //获取节点列表
    async getNodeList () {
      this.loadShow = true;
      let params = {
        ClusterId: this.clusterId,
        Offset: this.pageIndex,
        Limit: this.pageSize,
        Version: "2018-05-25",
        InstanceRole: "MASTER_ETCD"
      };
      const res = await this.axios.post(NODE_INFO, params);
      this.loadShow = false;
      let ids = [];
      if (res.Response.InstanceSet.length > 0) {
        res.Response.InstanceSet.map(obj => {
          ids.push(obj.InstanceId);
        });
      }
      let param = {
        Version: "2017-03-12",
        Limit: this.pageSize
      }
      if(ids.length > 0) {
        for(let i = 0; i < ids.length; i++) {
          param['InstanceIds.'+i] = ids[i];
        }
        this.loadShow = true;
        let nodeRes = await this.axios.post(NODE_LIST, param);
        if(nodeRes.Response.Error === undefined) {
          this.loadShow = false;
          if(nodeRes.Response.InstanceSet.length > 0) {
            nodeRes.Response.InstanceSet.map(node => {
              node.addTime = moment(node.CreatedTime).format("YYYY-MM-DD HH:mm:ss");
            });
            this.list = nodeRes.Response.InstanceSet;
          }
          this.total = res.Response.TotalCount;
        } else {
          this.loadShow = false;
          let ErrTips = {
            
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      }
    },
     // 详情
    goMasteretcdDetail(row){
      this.$router.push({
          name: "masteretcdDetail",
          query: {
            clusterId: this.clusterId,
            node: row.PrivateIpAddresses[0],
            detail: row
          }
      });
    },

   // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      this.getNodeList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.getNodeList();
    },
    setFlag (data) {
      console.log(data)
      this.flag = data
    },
    setTime (data) {
      console.log(data)
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

