<template>
  <div class="overview-wrap">
    <HeadCom title="概览"></HeadCom>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <el-row>
          <!-- 左边内容 -->
          <el-col >
          <!-- <el-col :span="16"> -->
            <!-- 第一行内容 -->
            <div class="resource-overview">
              <h3 class="font" style="margin-bottom:20px">资源概览</h3>
              <ul class="ro-data-card"  v-loading="shows">
                <li class="ro-data-card-list">
                  <div class="font ">
                    <h3 class="ro-data-card-hd font">集群</h3>
                    <div>
                      <span class="font-big">{{ TotalCount }}</span>
                      <span class="ro-data-card-value">个</span>
                    </div>
                  </div>
                </li>
                <li class="ro-data-card-list" >
                  <div class="font  border-set">
                    <h3 class="ro-data-card-hd font">节点</h3>
                    <div>
                      <span class="font-big">{{ nodeNum }}</span>
                      <span>个（</span>
                      <span class="font-red">异常{{ abnormalNodeNum }}个</span>
                      <span>）</span>
                    </div>
                  </div>
                </li>
                <li class="ro-data-card-list">
                  <div class="font  ">
                    <h5 class="ro-data-card-hd font">工作负载</h5>
                    <div>
                      <span class="font-big">{{ workLoad }}</span>
                      <span>个（</span>
                      <span class="font-red">异常{{ abWorkLoad }}个</span>
                      <el-tooltip content="Pod副本数不符合预期" placement="top">
                        <i
                          style="margin-left:5px"
                          class="data-card-icon el-icon-info"
                        ></i>
                      </el-tooltip>
                      <span>）</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 第二行内容 -->
            <div class="resource-overview" style="margin-top:20px">
              <h3 class="font" style="margin:6px 0 6px 0;">集群健康</h3>
            </div>
            <!-- 集群卡片内容 -->
            <div
              
              class="resource-overview twoRow-data-card-border-top"
            >
              <h3 class="font" style="margin:0;" @click="show()">
                <i
                  v-if="isShow"
                  class="el-icon-caret-bottom data-card-icon"
                  style="margin-right:5px"
                ></i>
                <i
                  v-else
                  class="el-icon-caret-right data-card-icon"
                  style="margin-right:5px"
                ></i
                >中国台北
                <span class="font-small"
                  >共&nbsp;{{ TotalCount }}&nbsp;个集群</span
                >
                <i
                  class="data-card-icon el-icon-info font-red"
                  style="margin-left:2px"
                ></i>
              </h3>
              <div
                v-for="(item, index) in clusters"
                :key="index"
                v-if="isShow"
                class="resource-overview data-card-border"
                style="box-shadow:none;"
              >
                <div>
                  <!-- 第二行集群头 -->
                  <div class="font-small">
                    <a @click='goColonySub(item.name)'>{{ item.name }}</a>
                    <!-- <span style="margin-left:6px">{{ item.ClusterName }}</span> -->
                  </div>
                  <!-- 第二行集群内容 -->
                  <div class="ro-data-card" style="margin:0">
                    <div class="twoROW-data-card-list">
                      <div>
                        <span style="font-size:18px;font-weight:700">{{item.c1||'--'}}</span>
                        <span class="font-small" style="color:black;"
                          >&nbsp;CPU利用率</span
                        >
                      </div>
                      <div class="font-small" style="margin-top:10px;">
                        总数：{{item.c2||'--'}}核&nbsp;Request已分配：{{item.c3||'--'}}
                      </div>
                    </div>
                    <div class="twoROW-data-card-list">
                      <div>
                        <span style="font-size:18px; font-weight:700">{{item.n1||'--'}}</span>
                        <span class="font-small" style="color:black;"
                          >&nbsp;内存利用率</span
                        >
                      </div>
                      <div class="font-small" style="margin-top:10px;">
                        总数：{{item.n2||'--'}}GB&nbsp;Request已分配：{{item.n3||'--'}}
                      </div>
                    </div>
                    <div
                      class="twoROW-data-card-list font-small"
                      style="background:none;padding:0"
                    >
                      <div style="padding-top:0;">
                        <span class="set-span">
                          <span>节点</span>
                          <a @click="goNode(item.name)">（{{item.nodetotal}}个）</a>
                        </span>
                        <span v-if="item.nodeab==0"  class="font-green"
                          >正常</span
                        >
                        <span  v-if="item.nodeab!=0" class="font-red"
                          >异常&nbsp;{{item.nodeab}}&nbsp;个</span
                        >
                      </div>
                      <div style="padding-top:17px;">
                        <span class="set-span"> 
                          <span>Master&Etcd</span>
                          <a @click="goMasteretcd(item.name)">（{{item.matotal}}个）</a>
                        </span>
                        <span  v-if="item.maab==0"  class="font-green"
                          >正常</span
                        >
                         <span v-if="item.maab!=0"  class="font-red"
                          >异常&nbsp;{{item.maab}}&nbsp;个</span
                        >
                      </div>
                      <div style="padding-top:17px;">
                        <span class="set-span">
                        <span>工作负载</span>
                        <a @click="goWorkload(item.name)">（{{item.workloadtotal}}个）</a>
                         </span>
                         <span  v-if="item.workloadab==0"  class="font-green"
                          >正常</span
                        >
                        <span v-if="item.workloadab!=0"   class="font-red"
                          >异常&nbsp;{{item.workloadab}}&nbsp;个</span
                        >
                        <el-tooltip placement="right" effect="light">
                          <div slot="content" style="width:200px;height:200px">
                            <div class="font-small">
                              <span>命名空间</span>
                              <div class="hsd"></div>
                              <span>Deployment</span>
                            </div>
                            <div class="font-small" style="margin-top:10px">
                              <span>kube-system</span>
                              <a style="margin-left:55px;" href="">coredns</a>
                              <br />
                              <a style="margin-left:130px" href="">查看事件</a>
                            </div>
                          </div>
                          <i
                            v-if="false"
                            style="margin-left:2px"
                            class="el-icon-more-outline"
                          ></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 左边底部内容 -->
            <div
              class="resource-overview twoRow-data-card-border-top"
              style="margin-top:20px;"
            >
              <h3 class="font" style="margin:0;">使用指引</h3>
              <div class="zn">
                <div class="data-card-img">
                  <img
                    src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/docker/css/img/overview-zhiying.svg"
                    alt=""
                  />
                </div>
                <div class="data-card-img">
                  <div class="font-small" style="color:black">使用指引</div>
                  <div class="font-small">
                    通过固定流程，快速创建容器服务
                    <a href="">开始使用</a>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <!-- 右边内容 -->
          
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import { TKE_COLONY_LIST, TKE_COLONY_STATUS_JZ,TKE_COLONY_STATUS_JZ2, TKE_GETCPUUSE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "overview",
  data() {
    return {
      isShow: false,
      shows:true,
      TotalCount: "",
      nodeNum: 0,
      abnormalNodeNum: 0,
      workLoad: 0,
      abWorkLoad: 0,
      clusters: [] //集群
    };
  },
  components: {
    HeadCom
  },
  created() {
    this.resourceList();
    this.resourceStatusData();
    this.statusData();
  },
  methods: {
    // 查看详情跳转
    goColonySub(id) {
      // scope.row.ClusterType=='MANAGED_CLUSTER'
      this.$router.push({
        name: "colonySub",
        query: {
          clusterId: id
        }
      });
    
    },
    //查看节点
    goNode(id){
        this.$router.push({
        name: "colonyNodeManageNode",
        query: {
          clusterId: id
        }
      });
    },
    //查看节点
    goMasteretcd(id){
        this.$router.push({
        name: "colonyNodeManageMasteretcd",
        query: {
          clusterId: id
        }
      });
    },
    //查看节点
    goWorkload(id){
        this.$router.push({
        name: "colonyResourceDeployment",
        query: {
          clusterId: id
        }
      });
    },
    show() {
      this.isShow = !this.isShow;

      this.getCpuInfo()
    },
    async resourceList() {
      var params = {
        Version: "2018-05-25",
        Region: this.$cookie.get("regionv2")
      };
      const res = await this.axios.post(TKE_COLONY_LIST, params);

      if (res.Response.Error === undefined) {
        this.TotalCount = res.Response.TotalCount;

        // this.clusters = res.Response.Clusters;
        console.log(this.clusters);
      } else {
        let ErrTips = {
          InternalError: "内部错误",
          "InternalError.CamNoAuth": "没有权限",
          "InternalError.Db": "db错误",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作",
          "InternalError.QuotaMaxClsLimit": "超过配额限制",
          "InternalError.QuotaMaxNodLimit": "超过配额限制",
          InvalidParameter: "参数错误",
          "InvalidParameter.Param": "参数错误",
          LimitExceeded: "超过配额限制",
          ResourceNotFound: "资源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    resourceStatusData() {
      var params = {
        Version: "2018-05-25",
        Region: this.$cookie.get("regionv2"),
        "dimensions.0": "workload",
        "dimensions.1": "node"
      };
      this.axios.post(TKE_COLONY_STATUS_JZ, params).then(res => {
        console.log(res);
        if (res.Error === undefined) {
          var sum = 0,
            absum = 0,
            sum2 = 0,
            absum2 = 0;
          res.data.clusterResourceStatusList.map(val => {
            return val.status.map(v => {
              if (v.dimension == "node") {
                sum += v.total;
                absum += v.abnormal;
              }
              if (v.dimension == "workload") {
                sum2 += v.total;
                absum2 += v.abnormal;
              }
            });
          });
          this.shows=false;
          this.nodeNum = sum;//节点总数
          this.abnormalNodeNum = absum;//异常节点数
          this.workLoad = sum2;//负载总数
          this.abWorkLoad = absum2;//异常负载数
          this.TotalCount = res.data.clusterResourceStatusList.length;//集群数
        }
      });
    },
     
    statusData(){
      var params={
        "Dimensions.0": "workload",
        "Dimensions.1": "node",
        "Dimensions.2": "master_etcd",
        ResourceType: "nodeWorkloadStaticNum",
        Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_STATUS_JZ2, params).then(res=>{
          if (res.Response.Error === undefined){
           let  d1=res.Response.ResourceStatusSet
           var arr=[];
           d1.forEach(item=>{
            let obj={};
             obj.name=item.ClusterInstanceId;
             item.Status.forEach(v=>{
               if(v.Dimension=='workload'){
                 obj.workloadtotal=v.TotalNum;
                 obj.workloadab=v.AbnormalNum;
               }else if(v.Dimension=='node'){
                  obj.nodetotal=v.TotalNum;
                 obj.nodeab=v.AbnormalNum;
               }else if(v.Dimension=='master_etcd'){
                  obj.matotal=v.TotalNum;
                 obj.maab=v.AbnormalNum;
               }
             })
             arr.push(obj)
           })
           this.clusters = arr;
           this.getCpuInfo();
           console.log(arr)
          }else{
             let ErrTips = {};
             let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
               this.$message({
                 message: ErrOr[res.Response.Error.Code],
                 type: "error",
                 showClose: true,
                 duration: 0
               });
          }
      })
    },

    getCpuInfo(){
        var params={
         Method: "POST",
         Path: "/front/v1/get/query",
         RequestBody: "eyJ0YWJsZSI6Ims4c19jbHVzdGVyIiwic3RhcnRUaW1lIjoxNTgzMTM4MzAyODA3LCJlbmRUaW1lIjoxNTgzMTM4NjAyODA3LCJmaWVsZHMiOlsibWVhbihrOHNfY2x1c3Rlcl9jcHVfY29yZV90b3RhbCkiLCJtZWFuKGs4c19jbHVzdGVyX3JhdGVfY3B1X2NvcmVfcmVxdWVzdF9jbHVzdGVyKSIsIm1lYW4oazhzX2NsdXN0ZXJfcmF0ZV9jcHVfY29yZV91c2VkX2NsdXN0ZXIpIiwibWVhbihrOHNfY2x1c3Rlcl9tZW1vcnlfdG90YWwpIiwibWVhbihrOHNfY2x1c3Rlcl9yYXRlX21lbV9yZXF1ZXN0X2J5dGVzX2NsdXN0ZXIpIiwibWVhbihrOHNfY2x1c3Rlcl9yYXRlX21lbV91c2FnZV9ieXRlc19jbHVzdGVyKSJdLCJjb25kaXRpb25zIjpbWyJ0a2VfY2x1c3Rlcl9pbnN0YW5jZV9pZCIsImluIixbImNscy03NHUwOGRjYyIsImNscy1uZDF5NWlvMiIsImNscy1oZnpveGI4bSJdXV0sIm9yZGVyQnkiOiJ0aW1lc3RhbXAiLCJncm91cEJ5IjpbInRpbWVzdGFtcCg2MHMpIiwidGtlX2NsdXN0ZXJfaW5zdGFuY2VfaWQiXSwib3JkZXIiOiJkZXNjIiwibGltaXQiOjY1NTM1fQ==",
         Version: "2018-07-24",
        }
        this.axios.post(TKE_GETCPUUSE, params).then(res=>{

          if (res.Response.Error === undefined){
            let response = JSON.parse(res.Response.ResponseBody);
            console.log(response)
            console.log( this.clusters)
            this.clusters.forEach(val=>{

              response.data.forEach(item=>{
                  
                  if(item.indexOf(val.name)!=-1){
                        val.c1=item[4]==null?'--':item[4].toFixed('2')+'%'
                        val.c2=item[2]==null?'--':item[2].toFixed('2')
                        val.c3=item[3]==null?'--':item[3].toFixed('2')+'%'
                        val.n1=item[7]==null?'--':item[7].toFixed('2')+'%'
                        val.n2=item[5]==null?'--':(item[5]/(1024*1024*1024)).toFixed('2')
                        val.n3=item[6]==null?'--':item[6].toFixed('2')+'%'
                  }
              })
            })
           }
        })

    },

  }
};
</script>

<style lang="scss" scoped>
.font-black {
  color: black !important;
}
.help-list {
  margin: 20px 0 20px 0;
}
.zn {
  display: flex;
}
.data-card-img {
  padding: 20px;
}
.hsd {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f2f2f2;
  display: inline-block;
  margin: 0 30px 0 30px;
}
a:hover {
  text-decoration: underline;
}
.twoROW-data-card-list {
  width: 272px;
  height: 78px;
  background: #f2f2f2;
  margin: 20px 14px 0 0;
  padding: 16px 12px;
}
.data-card-border {
  margin-top: 20px;
  border: 1px solid #dddddd;
}
.twoRow-data-card-border-top {
  border-top: 1px solid #dddddd;
}
.data-card-icon {
  font-size: 10px;
}
.data-card-list {
  margin-left: 20px;
}

.font-small {
  font-size: 12px;
  color: #888888;
  font-weight: 700;
//   font-weight: lighter;
}
.font-big {
  font-size: 36px;
}
.font-green {
  color: #0abf5b;
}
.font-red {
  color: #e54545;
}
.app-tke-fe-content__inner {
  // padding-top: 20px;
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px 15px 0px;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.resource-overview {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.font {
  font-size: 15px;
  margin-bottom: 20px;
}
.border-set{
  border-left: solid 1px #ddd;
  border-right: solid 1px #ddd;
  padding-left: 20px;
  margin-right: 20px;
}
.ro-data-card {
  display: flex;
  justify-content: space-between;
  margin: -10px 0;
}
.ro-data-card-hd {
  margin: 10px 0;
  // width: 282px;
}
.show {
  display: block;
}
.hide {
  display: none;
}
.ro-data-card-list{
  width:33%
}
.set-span{
  width:130px;
  display:inline-block;
}
a{
  cursor:pointer;
  color:#006eff !important;
}
</style>
