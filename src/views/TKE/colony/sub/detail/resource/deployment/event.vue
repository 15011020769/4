 <!-- deployment-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">资源事件只保存最近1小时内发生的事件，请尽快查阅。</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>自动刷新</span><el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch(e)" ></el-switch>
      </div>
    </div>
    
    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          label="首次出现时间"
          >
          <template slot-scope="scope">
            <p>2020-01-09 19:10:37</p>
          </template>
        </el-table-column>
        <el-table-column
          label="最后出现时间"
          >
          <template slot-scope="scope">
            <p>2020-01-10 17:01:02</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="级别"
          >
          <template slot-scope="scope">
              <span class="text-red">Warning</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="资源类型"
          >
          <template slot-scope="scope">
            <span>HorizontalPodAutoscaler</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="资源名称"
          >
          <template slot-scope="scope">
            <span>asdas.15e83372c763e97e</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <span>FailedGetPodsMetric</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeTotal"
          label="详细描述">
          <template slot-scope="scope">
            <p>Error: ImagePullBackOff</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="出现次数">
          <template slot-scope="scope">
            <p>2617</p>
          </template>
        </el-table-column>
      </el-table>
      
    </div>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
export default {
  name: "deploymentDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      autoRefresh: true, //自动刷新
      list:[], //列表
      timer: null,//定时器
    };
  },
  components: {
    Loading
  },
  created() {
    // 从路由获取数据
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.getEventList();
    let autoRefresh = this.autoRefresh;
    if(autoRefresh) {
      if(this.timer) {
        this.timer = setInterval(() => {
          this.getEventList();
        }, 1000 * 20);
      }
    }
  },
  methods: {
    //获取事件列表数据
    async getEventList() {
      this.loadShow = true;
      let params = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/deployments/"+this.rowData.metadata.name+"/events",
        Version: "2018-05-25",
        ClusterName: "cls-l74ol4g0"
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            response.items.map(pod => {
              pod.addTime = moment(pod.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
            });
          }
          this.list = response.items;
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
    //是否刷新
    changeSwitch() {
      debugger
      let autoRefresh = this.autoRefresh;
      if(autoRefresh) {
        if(!this.timer) {
          this.timer = setInterval(() => {
            this.getEventList();
          }, 1000 * 20);
        }
      } else {
        if(this.timer) { //如果定时器在运行则关闭
          clearInterval(this.timer); 
        }
      }
    },
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    //销毁定时器
    destroyed(){
      if(this.timer) { //如果定时器在运行则关闭
        clearInterval(this.timer); 
      }
    }
  }
};
</script>

<style lang="scss" scoped>




</style>

