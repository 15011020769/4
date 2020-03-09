 <!-- deployment-pod管理 -->
<template>
  <div class="colony-main">
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" >监控</el-button>
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
            <el-table border :data="scope.row.spec.containers" >
                <el-table-column prop="" label="容器名称" >
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="容器ID" >
                  <template slot-scope="scope">
                    <span>{{scope.row.imageID || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="镜像版本号" >
                  <template slot-scope="scope">
                    <span>{{scope.row.image || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="重启次数" >
                  <template slot-scope="scope">
                    <span>{{scope.row.restartCount || '-'}}次</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="状态" >
                  <template slot-scope="scope">
                    <span class="text-green">{{Object.keys(scope.row.state || {})[0] || '-'}}</span>
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
            <span class="tke-text-link">{{scope.row.metadata && scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          >
          <template slot-scope="scope">
              <span :class="[scope.row.phase ==='Running'?'text-green':'']">{{scope.row.status && scope.row.status.phase}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例所在节点IP"
          >
          <template slot-scope="scope">
              <span>{{scope.row.status && scope.row.status.hostIP || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="实例IP"
          >
          <template slot-scope="scope">
            <span>{{scope.row.status && scope.row.status.podIP || '-'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="运行时间"
          >
          <template slot-scope="scope">
            <span>{{scope.row.status && scope.row.status.startTime | getDuration}}</span>
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
            <span>{{scope.row.restart}}次</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <span class="tke-text-link" @click="redeployment(scope.row)">销毁重建</span>
            <span class="tke-text-link ml10" @click="remoteLogin(scope.row)">远程登录</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="销毁实例" :visible.sync="isShowRedeployment" width="35%">
      <p style="font-weight: bolder;color: #444;">您确定要销毁实例{{podName}}吗</p>
      <p>实例销毁重建后将不可恢复，请提前备份好数据。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRedeployment()">确 定</el-button>
        <el-button @click="isShowRedeployment = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="容器登录" :visible.sync="showRemoteLoginModal" width="35%">
      <div>该实例下共有<span style="color:#ff9d00;">{{this.podLoginList.length || 0}}个</span>容器</div>
          <el-collapse-transition>
            <el-table :data="podLoginList" height="200">
              <el-table-column property="name" label="容器名称" width="200"></el-table-column>
              <el-table-column property="" label="状态" width="150"></el-table-column>
              <el-table-column label="操作" width="150">
                <a href="">登录</a>
              </el-table-column>
            </el-table>
          </el-collapse-transition>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRemoteLoginModal = false">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
export default {
  name: "deploymentDetailPod",
  data() {
    return {
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],//选择列表数据
      loadShow: false, //加载是否显示
      isShowRedeployment: false,//是否开启重新部署弹窗
      podName: '',//实例名称
      showRemoteLoginModal: false,//是否打开远程登录弹窗
      podLoginList: [],//远程登录列表
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
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.getJobsPodList();
  },
  methods: {
    //获取列表
    async getJobsPodList() {
      this.loadShow = true;
      let params = {
        Method: "GET",
        Path: "/apis/batch/v1/namespaces/"+this.rowData.metadata.namespace+"/jobs/"+this.rowData.metadata.name+"/pods",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log(response);
          if(response.items.length > 0) {
            response.items.map(pod => {
              pod.addTime = moment(pod.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
              if(pod.spec.containers) {
                pod.spec.containers.map(contain => {
                  if(pod.status.containerStatuses) {
                    pod.status.containerStatuses.map(conStatus => {
                      if(contain.name === conStatus.name) {
                        contain.imageID = conStatus.containerID;
                        contain.restartCount = conStatus.restartCount;
                        contain.state = conStatus.state;
                      }
                    })
                  }
                });
              }
              let restart = 0;
              if(pod.status && pod.status.containerStatuses && pod.status.containerStatuses.length > 0) {
                for(var j = 0; j < pod.status.containerStatuses.length; j++) {
                  let containerStatuses = pod.status.containerStatuses[j];
                  restart += containerStatuses.restartCount;
                }  
              }
              pod.restart = restart;
            });
          }
          this.list = response.items;
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
      }); 
    },

    //返回上一层
    goBack(){
      this.$router.go(-1);
    },

    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //是否打开重新部署弹窗
    redeployment(rowData) {
      this.isShowRedeployment = true;
      this.podName = rowData.metadata.name;
    },
    //重新部署
    async submitRedeployment() {
      this.loadShow = true;
      let time = new Date().getTime().toString();
      let params = {
        Method: "DELETE",
        Path: "/api/v1/namespaces/"+this.rowData.metadata.namespace+"/pods/"+this.podName,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({propagationPolicy: "Background"}),
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.isShowRedeployment = false;
          this.getJobsPodList();
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
      });
    },
    //打开远程登录弹窗
    remoteLogin(rowObj) {
      this.showRemoteLoginModal = true;
      this.podLoginList = rowObj.status.containerStatuses;
    },
  },
  filters: {
    getDuration(date) {
      if(date) {
        var now = new Date();    //结束时间  
        var timeStamp = now.getTime() - new Date(moment(date).format("YYYY-MM-DD HH:mm:ss")).getTime();   //时间差的毫秒数        
        //计算出相差天数  
        var days=Math.floor(timeStamp/(24*3600*1000));  
        //计算出小时数  
        var leave1=timeStamp%(24*3600*1000);    //计算天数后剩余的毫秒数  
        var hours=Math.floor(leave1/(3600*1000));  
        return days+"d "+hours+"h";
      } else {
        return '-';
      }
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

