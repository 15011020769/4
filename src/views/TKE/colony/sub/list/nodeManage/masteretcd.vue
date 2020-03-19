 <!-- Master&Etcd列表 -->
<template>
  <div >
    <subTitle :title='name'></subTitle>
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" type="primary" @click='toMonitor'>{{$t('TKE.colony.jk')}}</el-button>
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
            :label="$t('TKE.colony.idjdm')"
            >
            <template slot-scope="scope">
              <!-- <span @click="goMasteretcdDetail(scope.row)" class="tke-text-link" >{{scope.row.InstanceId}}</span> -->
              <span>{{scope.row.InstanceId}}</span>
              <p>{{scope.row.InstanceName}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('TKE.overview.zt')"
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
            :label="$t('TKE.overview.lx')"
            >
             <p>MASTER_ETCD</p>
          </el-table-column>
          
          <el-table-column
            prop=""
            :label="$t('TKE.colony.kyq')"
            >
            <template slot-scope="scope">
              <el-tooltip effect="light" :content="scope.row.Placement.Zone | zone" placement="top">
                <span>{{scope.row.Placement.Zone | zone}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('TKE.subList.zjlx')">
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
              {{$t('TKE.colony.xtp')}}: {{scope.row.SystemDisk && scope.row.SystemDisk.DiskSize}}GB {{scope.row.SystemDisk.DiskType | diskType}}<br />
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
            :label="$t('TKE.subList.yfpzzy')">
            <template slot-scope="scope">
              <p>CPU: {{scope.row.cpu || '0.00'}}/{{scope.row.cpuTotal}}</p>
              <p>{{$t('TKE.overview.ncun')}}: {{scope.row.memory || '0.00'}}/{{scope.row.memoyTotal}}</p>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            prop=""
            :label="$t('TKE.colony.jfms')">
            <template slot-scope="scope">
              <p>{{scope.row.InstanceChargeType | changeChargeType}}</p>
              <p>{{scope.row.addTime}}{{$t('TKE.subList.cj')}}</p>
            </template>
          </el-table-column>
        </el-table>

        <div class="tke-page">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              :pager-count="7"
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
import {
  ALL_CITY,
  NODE_INFO,
  NODE_LIST,
  POINT_REQUEST,
  OBJ_LIST,
  DELETE_NODE,
  BLOCK_NODE,
  NODE_ID_LIST,
  NODE_POD_LIST,
  JOB_ID,
  MOMITOR_TKE  } from "@/constants";
export default {
  name: "colonyNodeManageMasteretcd",
  data() {
    return {
      tit:"Master&Etcd清單",
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
        name:"masteretcdMonitor",
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
          let param1 = {
            Method: "GET",
            Path: "/api/v1/nodes",
            Version: "2018-05-25",
            ClusterName: this.clusterId
          };
          let k8sNodeList = [];
          // this.loadShow = true;
          let k8sRes = await this.axios.post(POINT_REQUEST, param1);
          if (k8sRes.Response.Error === undefined) {
            let response = JSON.parse(k8sRes.Response.ResponseBody);
            k8sNodeList = response.items;
            // this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[k8sRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          let dataResult = {};
          var now = new Date;
          now.setMinutes (now.getMinutes () - 10);
          let paramJob = {
            EndTime: new Date().getTime(),
            Limit: 65535,
            Module: "/front/v1",
            NamespaceName: "k8s_node",
            Offset: 0,
            Order: "desc",
            OrderBy: "timestamp",
            StartTime: new Date(now).getTime(),
            Version: "2019-06-06"
          };
          paramJob["Conditions.0"] = JSON.stringify([
            "tke_cluster_instance_id",
            "=",
            this.clusterId
          ]);
          paramJob["Conditions.1"] = JSON.stringify(["node_role", "!=", "Node"]);
          paramJob["Fields.0"] = "avg(k8s_node_cpu_core_request_total)";
          paramJob["Fields.1"] = "avg(k8s_node_memory_request_bytes_total)";
          paramJob["GroupBys.0"] = "timestamp(60s)";
          paramJob["GroupBys.1"] = "unInstanceId";
          let jobRes = await this.axios.post(JOB_ID, paramJob);
          if(jobRes.Response.Error === undefined) {
            let param3 = {
              Version: "2019-06-06",
              JobId: jobRes.Response.JobId,
              Module: "/front/v1"
            };
            let resultRes = await this.axios.post(MOMITOR_TKE, param3);
            if(resultRes.Response.Error === undefined) {
              let result = JSON.parse(resultRes.Response.Data);
              if(result.length > 0) {
                for(let i = 0; i < result.length; i++) {
                  let item = result[i];
                  let key = item[1];
                  let value = dataResult[key];
                  if(value) {
                    value.push(result[i]);
                  } else {
                    value = [];
                    value.push(result[i]);
                  }
                  dataResult[key] = value;
                }
              }
              console.log(dataResult);
            } else {
              this.loadShow = false;
              let ErrTips = {};
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[resultRes.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[jobRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          // this.loadShow = true;
          this.loadShow = true;
          let nodeRes = await this.axios.post(NODE_LIST, param);
          if(nodeRes.Response.Error === undefined) {
            this.loadShow = false;
            if(nodeRes.Response.InstanceSet.length > 0) {
              nodeRes.Response.InstanceSet.map(node => {
                let resultList = dataResult[node.InstanceId];
                if(resultList) {
                  if(resultList.length > 0) {
                    if(resultList[resultList.length - 1][2]) {
                      node.cpu = resultList[resultList.length - 1][2].toFixed(2);
                    }
                    if(resultList[resultList.length - 1][3]) {
                      node.memory = (resultList[resultList.length - 1][3]/(1024*1024*1024)).toFixed(2);
                    }
                  }
                }
                node.addTime = moment(node.CreatedTime).format("YYYY-MM-DD HH:mm:ss");
                nodeInfoList.map(info => {
                  if(node.InstanceId === info.InstanceId) {
                    node.status = info.InstanceState;
                  }
                });
                k8sNodeList.map(k8s => {
                  let providerId = k8s.spec.providerID;
                  if (
                    node.InstanceId ===
                    providerId.substring(providerId.lastIndexOf("/") + 1)
                  ) {
                    node.kubeletVersion = k8s.status.nodeInfo.kubeletVersion;
                    node.allocatable = k8s.status.allocatable;
                    node.cpuTotal =  (Number(k8s.status.allocatable.cpu.substring(0, k8s.status.allocatable.cpu.length -1))/1000).toFixed(2);
                    node.memoyTotal = (Number(k8s.status.allocatable.memory.substring(0, k8s.status.allocatable.memory.length -2))/(1024*1024)).toFixed(2);
                    node.unschedulable = k8s.spec.unschedulable;
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
        return '異常';
      } else if(status === 'initializing') {
        return '創建中';
      } else if(status === 'upgrading') {
        return "升級中";
      } else if(status === 'running') {
        return '健康';
      }
    },
    //返回计费模式
    changeChargeType(type) {
      if(type === 'POSTPAID_BY_HOUR') {
        return '按量計費';
      } else if(type === 'PREPAID') {
        return '包年包月';
      } else if(type === 'SPOTPAID') {
        return '按量計費-競價';
      } else if (type === 'CDHPAID') {
        return 'CDH付費';
      }
    },
    //可用区
    zone(val) {
      if(val) {
        if (val.substring(3, val.length - 2) === "taipei") {
          return "台北" + val.substring(val.length - 1, val.length) + "區";
        }
      }
    },
    //机型
    instanceType(val) {
      if(val) {
        if(val.substring(0,1) === 'S') {
          return '標準型'+ val.substring(0,2);
        } else if (val.substring(0,1) === 'M') {
          return '記憶體型'+ val.substring(0,2);
        } else if (val.substring(0,1) === 'C') {
          return '計算型'+ val.substring(0,2);
        }
      }
    },
    //系统盘类型
    diskType(val) {
      if(val) {
        if(val === 'CLOUD_SSD') {
          return 'SSD雲硬碟';
        } else {
          return '高性能雲硬碟';
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

