 <!-- Master&Etcd列表 -->
<template>
  <div >
    <subTitle :title='name'></subTitle>
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
              <span :class="[
                scope.row.status !== 'running' ? 'text-red' : 'text-green'
                ]" >{{scope.row.status | changeStatus}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="类型"
            >
             <p>MASTER_ETCD</p>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="可用区"
            >
            <template slot-scope="scope">
              <el-tooltip effect="light" :content="scope.row.Placement.Zone | zone" placement="top">
                <span>{{scope.row.Placement.Zone | zone}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="主机类型">
            <template slot-scope="scope">
             <p>{{scope.row.InstanceType | instanceType}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
             width="200"
            label="配置">
            <template slot-scope="scope">
              {{scope.row.CPU}}核 , {{scope.row.Memory}}GB , {{scope.row.InternetAccessible.InternetMaxBandwidthOut}} Mbps<br />
              系统盘: {{scope.row.SystemDisk && scope.row.SystemDisk.DiskSize}}GB {{scope.row.SystemDisk.DiskType | diskType}}<br />
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
              <p>{{scope.row.InstanceChargeType | changeChargeType}}</p>
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
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
import { NODE_INFO, NODE_LIST, ALL_CITY, POINT_REQUEST  } from "@/constants";
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
      DrawerTitle:'',
      name:"Master&Etcd"
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
          title:this.name,
          clusterId: this.$route.query.clusterId,
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
      if(res.Response.Error === undefined) {
        let ids = [];
        if (res.Response.InstanceSet.length > 0) {
          res.Response.InstanceSet.map(obj => {
            ids.push(obj.InstanceId);
          });
        }
        let nodeInfoList = res.Response.InstanceSet;
        let param = {
          Version: "2017-03-12",
          Limit: this.pageSize
        }
        if(ids.length > 0) {
          for(let i = 0; i < ids.length; i++) {
            param['InstanceIds.'+i] = ids[i];
          }
          // this.loadShow = true;
          this.loadShow = true;
          let nodeRes = await this.axios.post(NODE_LIST, param);
          if(nodeRes.Response.Error === undefined) {
            this.loadShow = false;
            if(nodeRes.Response.InstanceSet.length > 0) {
              nodeRes.Response.InstanceSet.map(node => {
                node.addTime = moment(node.CreatedTime).format("YYYY-MM-DD HH:mm:ss");
                nodeInfoList.map(info => {
                  if(node.InstanceId === info.InstanceId) {
                    node.status = info.InstanceState;
                  }
                });
                return node;
              });
              this.list = nodeRes.Response.InstanceSet;
            }
            this.total = nodeRes.Response.TotalCount;
          } else {
            this.loadShow = false;
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[nodeRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }
        else {
          this.loadShow = false;
        }
      } else {
        this.loadShow = false;
        let ErrTips = {};
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
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
  },
  filters: {
    //返回状态
    changeStatus(status) {
      if(status === 'failed') {
        return '异常';
      } else if(status === 'initializing') {
        return '创建中';
      } else if(status === 'upgrading') {
        return "升级中";
      } else if(status === 'running') {
        return '健康';
      }
    },
    //返回计费模式
    changeChargeType(type) {
      if(type === 'POSTPAID_BY_HOUR') {
        return '按量计费';
      } else if(type === 'PREPAID') {
        return '报年报月';
      } else if(type === 'SPOTPAID') {
        return '按量计费-竞价';
      } else if (type === 'CDHPAID') {
        return 'CDH付费';
      }
    },
    //可用区
    zone(val) {
      if(val) {
        if (val.substring(3, val.length - 2) === "taipei") {
          return "台北" + val.substring(val.length - 1, val.length) + "区";
        }
      }
    },
    //机型
    instanceType(val) {
      if(val) {
        if(val.substring(0,1) === 'S') {
          return '标准型'+ val.substring(0,2);
        } else if (val.substring(0,1) === 'M') {
          return '内存型'+ val.substring(0,2);
        } else if (val.substring(0,1) === 'C') {
          return '计算型'+ val.substring(0,2);
        }
      }
    },
    //系统盘类型
    diskType(val) {
      if(val) {
        if(val === 'CLOUD_SSD') {
          return 'SSD云硬盘';
        } else {
          return '高性能云硬盘';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tke-grid >>> .el-input__inner,
.tke-grid >>> .el-button {
  border-radius: 0;
}
</style>

