<template>
  <div class="monitor">
    <!-- 顶部标题 -->
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
            <span>{{title}} / 监控</span>
          </span>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="room-bottom">
      <div class="box-top">
        <div class="box-top-left">
          <!-- <span class="span-1">实时</span> -->
          <div class="block">
            <!-- 时间组件 -->
            <TimeDropDown :TimeArr='TimeArr' :Datecontrol="true" :Graincontrol="false" v-on:switchData="GetDat" :Difference="'D'"></TimeDropDown>
          </div>
          <!-- 对比维度 -->
          <div v-show="isFlag">
            <span class="span-2">对比维度</span>
            <el-radio-group v-model="isCollapse" size="mini" >
              <el-radio-button label="k8s_node">节点</el-radio-button>
              <el-radio-button label="k8s_pod">pod</el-radio-button>
            </el-radio-group>
            <span class="span-2" v-show="isCollapse=='k8s_pod'">所属节点</span>
            <el-select v-model="value" placeholder="请选择" size="mini" v-show="isCollapse=='k8s_pod'" @change="getChange($event)">
              <el-option
                v-for="item in podData"
                :key="item.InstanceId"
                :label="item.InstanceId+'('+item.InstanceName+')'"
                :value="item.PrivateIpAddresses+'|'+item.InstanceId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-left">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选(共{{this.instances.length}}个)</el-checkbox>
          <!-- <div style="margin: 15px 0;"></div> -->
          <el-checkbox-group
            v-model="checkedInstances"
            @change="handleCheckedCitiesChange"
            class="check-flex point-white"
          >
            <el-checkbox v-for="item in instances" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 节点监控数据 -->
        <div class="box-bottom-right"  v-show="isCollapse=='k8s_node'">
          <!-- <div ref="main" style="width:100%;height:400px;" v-if="timeAll"></div> -->
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='series' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesError' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesCpus' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesCpuUseds' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesCpuUseds' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesCpuUsedmaxs' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesMemory' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesemusages' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesMemrequests' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesMenNocaches' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesMemUsageBytes' style="width:400px;height:200px;" />
          </div>
        </div>
        <!-- pod监控数据 -->
        <div class="box-bottom-right"  v-show="isCollapse=='k8s_pod'">
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podStatuErrs' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podCpuUseds' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podCpuUsedCenters' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podCpuUsedRequests' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podCpuUsedLimits' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemorys' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryNocaches' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryCenters' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryCenterNocaches' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryRequestNocaches' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryLimits' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podMemoryLimitNocaches' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podInNetworks' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podOutNetworks' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podInFlows' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podOutFlows' style="width:400px;height:200px;" />
           </div>
            <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podInPacketFlows' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podOutPacketFlows' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUUses' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUSeeUses' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUUseNodes' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUSeeUseNodes' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUUseRequests' style="width:400px;height:200px;" />
           </div>
           <div class="box-top-left" style="margin-bottom:20px;">
              <EcharTKE :time='podTimes' :series='podGPUSeeUseRequests' style="width:400px;height:200px;" />
           </div>
        </div>
        <!-- podTimes:[],                
      podsIds:[],                 
      podStatuErrs:[],            
      podCpuUseds:[],             
      podCpuUsedCenters:[],       
      podCpuUsedRequests:[],      
      podCpuUsedLimits:[],        
      podMemorys:[],              
      podMemoryNocaches:[],       
      podMemoryCenters:[],        
      podMemoryCenterNocaches:[], 
      podMemoryRequests:[],       
      podMemoryRequestNocaches:[],
      podMemoryLimits:[],         
      podMemoryLimitNocaches:[],  
      podInNetworks:[],           
      podOutNetworks:[],          
      podInFlows:[],              
      podOutFlows:[],            
      podInPacketFlows:[],        
      podOutPacketFlows:[],       
      podGPUUses:[],              
      podGPUSeeUses:[],           
      podGPUUseNodes:[],          
      podGPUSeeUseNodes:[],       
      podGPUUseRequests:[],       
      podGPUSeeUseRequests:[], -->
      </div>
    </div>
  </div>
</template>
<script>
// import subTitle from "@/views/TKE/components/subTitle";
import {TKE_GETTKEDATAJOB,TKE_GETTKEDATARESULT,NODE_LIST,POINT_REQUEST,NODE_INFO} from '@/constants'
import { ErrorTips } from "@/components/ErrorTips";
import TimeDropDown from "@/components/public/TimeDropDown.vue"
import moment from 'moment';
import EcharTKE from '@/components/public/EcharTKE'
// const cityOptions = ["asdasd", "3dsda", "asdaqwe"];
export default {
  name: "openMonitor",
  props: {
    dimensionflag: {
      type: Boolean,
      default: false
    },
  },
  components:{TimeDropDown,EcharTKE},
  data() {
    return {
      activeName: "first",
      value: "",
      checkAll: true,
      options: [],
      isCollapse: "k8s_node",
      checkedInstances: [],// 全选
      isIndeterminate: false,
      instances: [], // 单选
      title:"",
      clusterId:"",
      InstancesAll:[],
      isFlag:true,
      list:[],
      podData:[],
      valueLast:"",
      JobId:"",// 后台返回id
      StartTime:"",// 开始时间
      EndTIme:"", // 结束时间
      grain:"" ,//粒数
      times:[],
      series:[],
      seriesError:[],
      seriesCpus:[],
      seriesCpuUseds:[],
      seriesCpuUsedmaxs:[],
      seriesMemory:[],
      seriesemusages:[],
      seriesMemrequests:[],
      seriesMenNocaches:[],
      seriesMemUsageBytes:[],

      podTimes:[],                
      podsIds:[],                 
      podStatuErrs:[],            
      podCpuUseds:[],             
      podCpuUsedCenters:[],       
      podCpuUsedRequests:[],      
      podCpuUsedLimits:[],        
      podMemorys:[],              
      podMemoryNocaches:[],       
      podMemoryCenters:[],        
      podMemoryCenterNocaches:[], 
      podMemoryRequests:[],       
      podMemoryRequestNocaches:[],
      podMemoryLimits:[],         
      podMemoryLimitNocaches:[],  
      podInNetworks:[],           
      podOutNetworks:[],          
      podInFlows:[],              
      podOutFlows:[],            
      podInPacketFlows:[],        
      podOutPacketFlows:[],       
      podGPUUses:[],              
      podGPUSeeUses:[],           
      podGPUUseNodes:[],          
      podGPUSeeUseNodes:[],       
      podGPUUseRequests:[],       
      podGPUSeeUseRequests:[],
      TimeArr: [{
          name: '实时',
          Time: 'realTime',
          TimeGranularity: [
            {
              value: "60",
              label: "1分鐘"
            },
            {
              value: "300",
              label: "5分鐘"
            }
          ]
        },
        {
          name: '近一天',
          Time: 'Nearly_24_hours',
          TimeGranularity: [
            {
              value: "300",
              label: "5分鐘"
            },
            {
              value: "3600",
              label: "1小時"
            }
          ]
        },
        {
          name: '近7天',
          Time: 'Nearly_7_days',
          TimeGranularity: [{
              value: "3600",
              label: "1小時"
            },
            {
              value: "86400",
              label: "24小时"
            }
          ]
        }
      ],
    }
  },
  watch:{
    isCollapse(val){
      if(val == "k8s_pod"){
        this.checkedInstances = []
        this.instances =  []
        this.InstancesAll = []
        this.getPodList()
      } else if (val == "k8s_node") {
        this.checkedInstances = []
        this.instances =  []
        this.InstancesAll = []
        this.list=[]
        this.getNodeList()
      }
    },
  },
  created() {
    let{ title, clusterId } = this.$route.query
    this.clusterId = clusterId
    this.title = title
  },
  // mounted(){
  //   this.inits();
  // },
  methods: {
    GetDat(val){
      // console.log(val)
      this.grain = val[0]
      this.StartTime = new Date(val[1].StartTIme).getTime();
      this.EndTIme = new Date(val[1].EndTIme).getTime();
      console.log(this.StartTime,this.EndTIme)
      if(this.isCollapse == "k8s_pod"){
        this.checkedInstances = []
        this.instances =  []
        this.InstancesAll = []
        this.getPodList()
      } else {
        this.checkedInstances = []
        this.instances =  []
        this.InstancesAll = []
        this.list=[]
        this.getNodeList()
      }
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    changeFlag() {
      this.$emit("changeFlag", false);
    },
    handleCheckAllChange(val) {
      console.log(val)
      this.checkedInstances = val ? this.InstancesAll : [];
      console.log(this.checkedInstances)
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
      let checkedInstances = value.length;
      this.checkAll = checkedInstances === this.instances.length;
      this.isIndeterminate =
        checkedInstances > 0 && checkedInstances < this.instances.length;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    setTime() {
      this.$emit("setTime", this.value2);
    },
    getChange(val){
      console.log(val)
      this.valueLast = val.split("|")
      console.log(this.valueLast)
      this.getPodList()
    },
        //获取节点列表
    async getNodeList () {
      let params = {
        ClusterId: this.clusterId,
        Offset: 0,
        Limit: 20,
        Version: "2018-05-25",
        InstanceRole: "MASTER_ETCD"
      };
      const res = await this.axios.post(NODE_INFO, params);
      // this.loadShow = false;
      // 节点
      let ids = [];
      if (res.Response.InstanceSet.length > 0) {
        res.Response.InstanceSet.map(obj => {
          ids.push(obj.InstanceId);
        });
      }
      console.log(res.Response.InstanceSet)
      // check选择部分
      this.checkedInstances = ids
      this.instances =  ids
      this.InstancesAll = ids
      this.list = ids
      // this.value = ids[0]
      let param = {
        Version: "2017-03-12",
        Limit: 20
      }
      if(ids.length > 0) {
        for(let i = 0; i < ids.length; i++) {
          param['InstanceIds.'+i] = ids[i];
        }
        // this.loadShow = true;
        let nodeRes = await this.axios.post(NODE_LIST, param);
        // console.log(nodeRes)
        if(nodeRes.Response.Error === undefined) {
          // this.loadShow = false;
          this.podData = []
          // 数据合并
          if(nodeRes.Response.InstanceSet.length > 0) {
            console.log(nodeRes.Response.InstanceSet)
            for(let i in ids){
              for(let  j in nodeRes.Response.InstanceSet){
                if(nodeRes.Response.InstanceSet[j].InstanceId == ids[i]){
                  this.podData.push({
                    InstanceId:ids[i],
                    InstanceName:nodeRes.Response.InstanceSet[j].InstanceName,
                    PrivateIpAddresses:nodeRes.Response.InstanceSet[j].PrivateIpAddresses[0]
                  })
                }  
              }
            }
            this.value = this.podData[0].PrivateIpAddresses+"|"+this.podData[0].InstanceId
            this.valueLast = this.value.split("|")
            // this.getPodJob()
            
            console.log(this.podData)
            this.getNodeJob()
          }
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
    getPodList() {
    //   this.list = [];
      const param = {
        Method: 'GET',
        Path: '/api/v1/pods?fieldSelector=spec.nodeName='+this.valueLast[0]+'&limit=50',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          console.log(JSON.parse(res.Response.ResponseBody))
          // JSON.parse(res.Response.ResponseBody)
          let dataPod = []
          dataPod = JSON.parse(res.Response.ResponseBody).items.map((item,index)=>{
            return item.metadata.name
          })
          this.checkedInstances = dataPod
          this.instances =  dataPod
          this.InstancesAll = dataPod
          this.getPodJob()
        }
      })
    },

    getPodJob(){
       const param = {
        'Conditions.0': JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]),
        'Conditions.1': JSON.stringify(["unInstanceId","=",this.valueLast[1]]),
        EndTime: this.EndTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: this.isCollapse,
        Offset: 0,
        Order: "asc",
        OrderBy: "timestamp",
        StartTime: this.StartTime,
        Version: "2019-06-06"
      }
      param['Fields.0'] = 'min(k8s_pod_status_ready)';
      param["Fields.1"] = "max(k8s_pod_cpu_core_used)";
      param["Fields.2"] = "max(k8s_pod_rate_cpu_core_used_node)";
      param["Fields.3"] = "max(k8s_pod_rate_cpu_core_used_request)";
      param["Fields.4"] = "max(k8s_pod_rate_cpu_core_used_limit)";
      param["Fields.5"] = "max(k8s_pod_mem_usage_bytes)";
      param["Fields.6"] = "max(k8s_pod_mem_no_cache_bytes)";
      param["Fields.7"] = "max(k8s_pod_rate_mem_usage_node)";
      param["Fields.8"] = "max(k8s_pod_rate_mem_no_cache_node)";
      param["Fields.9"] = "max(k8s_pod_rate_mem_usage_request)";
      param["Fields.10"] = "max(k8s_pod_rate_mem_no_cache_request)";
      param["Fields.11"] = "max(k8s_pod_rate_mem_usage_limit)";
      param["Fields.12"] = "max(k8s_pod_rate_mem_no_cache_limit)";
      param["Fields.13"] = "max(k8s_pod_network_receive_bytes_bw)";
      param["Fields.14"] = "max(k8s_pod_network_transmit_bytes_bw)";
      param["Fields.15"] = "max(k8s_pod_network_receive_bytes)";
      param["Fields.16"] = "max(k8s_pod_network_transmit_bytes)";
      param["Fields.17"] = "max(k8s_pod_network_receive_packets)";
      param["Fields.18"] = "max(k8s_pod_network_transmit_packets)";
      param["Fields.19"] = "max(k8s_pod_gpu_used)";
      param["Fields.20"] = "max(k8s_pod_gpu_memory_used_bytes)";
      param["Fields.21"] = "max(k8s_pod_rate_gpu_used_node)";
      param["Fields.22"] = "max(k8s_pod_rate_gpu_memory_used_node)";
      param["Fields.23"] = "max(k8s_pod_rate_gpu_used_request)";
      param["Fields.24"] = "max(k8s_pod_rate_gpu_memory_used_request)";
      param["GroupBys.0"] = "timestamp("+this.grain+"s)";
      param["GroupBys.1"] = "pod_name";
      this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
        //   console.log(res)
        if(res.Response.Error === undefined) {
            // console.log(res.Response.JobId)
            this.JobId = res.Response.JobId
                setTimeout(()=>{
                    this.getResult()
                },4000)
        }
      })
    },
    getNodeJob(){
        console.log(this.list)
       const param = {
        'Conditions.0': JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]),
        'Conditions.1': JSON.stringify(["node_role","!=","Node"]),
        'Conditions.2': JSON.stringify(["unInstanceId","in",this.list]),
        EndTime: this.EndTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: this.isCollapse,
        Offset: 0,
        Order: "asc",
        OrderBy: "timestamp",
        StartTime: this.StartTime,
        Version: "2019-06-06"
      }
      param['Fields.0'] = 'sum(k8s_node_pod_restart_total)';
      param["Fields.1"] = "min(k8s_node_status_ready)";
      param["Fields.2"] = "max(k8s_node_cpu_usage)";
      param["Fields.3"] = "max(k8s_node_mem_usage)";
      param["Fields.4"] = "max(k8s_node_lan_intraffic)";
      param["Fields.5"] = "max(k8s_node_lan_outtraffic)";
      param["Fields.6"] = "max(k8s_node_wan_intraffic)";
      param["Fields.7"] = "max(k8s_node_wan_outtraffic)";
      param["Fields.8"] = "max(k8s_node_tcp_curr_estab)";
      param["Fields.9"] = "max(k8s_node_rate_gpu_used)";
      param["Fields.10"] = "max(k8s_node_rate_gpu_memory_used)";
      param["GroupBys.0"] = "timestamp("+this.grain+"s)";
      param["GroupBys.1"] = "unInstanceId";
      this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
          console.log()
          console.log(res)
        if(res.Response.Error === undefined) {
            console.log(res.Response.JobId)
            this.JobId = res.Response.JobId
                setTimeout(()=>{
                    this.getResult()
                },4000)
        }
      })
    },
    getResult() {
    //   this.list = [];
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      }
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        //   console.log(res)
        if(res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data)
          console.log(JSON.parse(res.Response.Data))
          if(this.isCollapse == "k8s_node"){
            let times = [], podIds = [], pods = [], statuErrs = [], cpus = [], cpuUseds = [],
            cpuRequests = [], cpuUsedmaxs = [], memorys= [], memusages = [], memrequests = [], menNocaches = [],
            memUsageBytes = []
              if(data.length > 0) {
                for(let i = 0; i < data.length; i++) {
                  let item = data[i];
                  let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");//时间
                  let podId = item[1];//节点ID
                  let pod = item[2];//实例数量
                  let statuErr = item[3];//异常
                  let cpu = item[4];//cpu总配置
                  let cpuUsed = item[5];//内存利用率
                  let cpuRequest = item[6];//内网入带宽
                  let cpuUsedmax = item[7];//内网出带宽
                  let memory = item[8];//外网入带宽
                  let memusage = item[9];// 外网出带宽
                  let memrequest = item[10];//TCP连接数
                  let menNocache = item[11];// GPU利用率
                  let memUsageByte = item[12];//GPU显存利用率
                  times.push(time);
                  podIds.push(podId);
                  pods.push(pod);
                  statuErrs.push(statuErr);
                  cpus.push(cpu);
                  cpuUseds.push(cpuUsed);
                  cpuRequests.push(cpuRequest);
                  cpuUsedmaxs.push(cpuUsedmax);
                  memorys.push(memory);
                  memusages.push(memusage);
                  memrequests.push(memrequest);
                  menNocaches.push(menNocache);
                  memUsageBytes.push(memUsageByte);
                }
              }
              this.times = times;
              this.series = [{name: '节点数量',type: 'line', data: pods}];
              this.seriesError = [{name: '节点数量',type: 'line', data: statuErrs}];
              this.seriesCpus = [{name: '节点数量',type: 'line', data: cpus}];
              this.seriesCpuUseds = [{name: '节点数量',type: 'line', data: cpuUseds}];
              this.seriesCpuRequests = [{name: '节点数量',type: 'line', data: cpuRequests}];
              this.seriesCpuUsedmaxs = [{name: '节点数量',type: 'line', data: cpuUsedmaxs}];
              this.seriesMemory = [{name: '节点数量',type: 'line', data: memorys}];
              this.seriesemusages = [{name: '节点数量',type: 'line', data: memusages}];
              this.seriesMemrequests = [{name: '节点数量',type: 'line', data: memrequests}];
              this.seriesMenNocaches = [{name: '节点数量',type: 'line', data: menNocaches}];
              this.seriesMemUsageBytes = [{name: '节点数量',type: 'line', data: memUsageBytes}];
            } else {
            let podTimes=[],                
                podsIds=[],                 
                podStatuErrs=[],            
                podCpuUseds=[],             
                podCpuUsedCenters=[],       
                podCpuUsedRequests=[],      
                podCpuUsedLimits=[],        
                podMemorys=[],              
                podMemoryNocaches=[],       
                podMemoryCenters=[],        
                podMemoryCenterNocaches=[], 
                podMemoryRequests=[],       
                podMemoryRequestNocaches=[],
                podMemoryLimits=[],         
                podMemoryLimitNocaches=[],  
                podInNetworks=[],           
                podOutNetworks=[],          
                podInFlows=[],              
                podOutFlows=[],            
                podInPacketFlows=[],        
                podOutPacketFlows=[],       
                podGPUUses=[],              
                podGPUSeeUses=[],           
                podGPUUseNodes=[],          
                podGPUSeeUseNodes=[],       
                podGPUUseRequests=[],       
                podGPUSeeUseRequests=[]   
              for(let i = 0; i < data.length; i++) {
                  let items = data[i];
                  let podTime = moment(items[0]).format("YYYY-MM-DD HH:mm:ss");//时间
                  let podsId  = items[1];//节点ID
                  let podStatuErr = items[2];//异常
                  let podCpuUsed = items[3];//CPU使用量
                  let podCpuUsedCenter = items[4];//CPU利用率(占主机)
                  let podCpuUsedRequest = items[5];//CPU利用率(占Request)
                  let podCpuUsedL = items[6];//CPU利用率(占Limit)
                  let podMemory  = items[7];//内存使用量
                  let podMemoryNocache  = items[8];//内存使用量(不含cache)
                  let podMemoryCenter  = items[9];// 内存利用率(占主机)
                  let podMemoryCenterNocache = items[10];//内存利用率(占主机,不含cache)
                  let podMemoryRequest  = items[11];// 内存利用率(占Request)
                  let podMemoryRequestNoc = items[12];//内存利用率(占Request,不含cache)
                  let podMemoryLimit  = items[13];//内存利用率(占Limit)
                  let podMemoryLimitNocache = items[14];//内存利用率(占Limit,不含cache)
                  let podInNetwork = items[15];//网络入带宽
                  let podOutNetwork = items[16];//网络出带宽
                  let podInFlow = items[17];//网络入流量
                  let podOutFlow = items[18];//网络出流量
                  let podInPacketFlow = items[19];//网络入包量
                  let podOutPacketFlow= items[20];//网络出包量
                  let podGPUUse = items[21];//GPU使用量
                  let podGPUSeeUse = items[22];//GPU显存使用量
                  let podGPUUseNode = items[23];//GPU利用率（占节点）
                  let podGPUSeeUseNode = items[24];//GPU显存利用率（占节点）
                  let podGPUUseRequest = items[25];//GPU利用率（占Request）
                  let podGPUSeeUseRequest = items[26];//GPU显存利用率（占Request）
                  podTimes.push(podTime)                
                  // podsIds.push(podsId)                 
                  podStatuErrs.push(podStatuErr)            
                  podCpuUseds.push(podCpuUsed)             
                  podCpuUsedCenters.push(podCpuUsedCenter)       
                  podCpuUsedRequests.push(podCpuUsedRequest)      
                  podCpuUsedLimits.push(podCpuUsedL)        
                  podMemorys.push(podMemory)              
                  podMemoryNocaches.push(podMemoryNocache)      
                  podMemoryCenters.push(podMemoryCenter) 
                  podMemoryCenterNocaches.push(podMemoryCenterNocache) 
                  podMemoryRequests.push(podMemoryRequest)       
                  podMemoryRequestNocaches.push(podMemoryRequestNoc)
                  podMemoryLimits.push(podMemoryLimit)         
                  podMemoryLimitNocaches.push(podMemoryLimitNocache)  
                  podInNetworks.push(podInNetwork)          
                  podOutNetworks.push(podOutNetwork)          
                  podInFlows.push(podInFlow)              
                  podOutFlows.push(podOutFlow)            
                  podInPacketFlows.push(podInPacketFlow)        
                  podOutPacketFlows.push(podOutPacketFlow)       
                  podGPUUses.push(podGPUUse)              
                  podGPUSeeUses.push(podGPUSeeUse)           
                  podGPUUseNodes.push(podGPUUseNode)          
                  podGPUSeeUseNodes.push(podGPUSeeUseNode)       
                  podGPUUseRequests.push(podGPUUseRequest)       
                  podGPUSeeUseRequests.push(podGPUSeeUseRequest)  
                }
                this.podTimes = podTimes;
                this.podStatuErrs = [{name: '节点数量',type: 'line', data: podStatuErrs}];
                this.podCpuUseds = [{name: '节点数量',type: 'line', data: podCpuUseds}];
                this.podCpuUsedCenters = [{name: '节点数量',type: 'line', data: podCpuUsedCenters}];
                this.podCpuUsedRequests = [{name: '节点数量',type: 'line', data: podCpuUsedRequests}];
                this.podCpuUsedLimits = [{name: '节点数量',type: 'line', data: podCpuUsedLimits}];
                this.podMemoryNocaches = [{name: '节点数量',type: 'line', data: podMemoryNocaches}];
                this.podMemoryCenters = [{name: '节点数量',type: 'line', data: podMemoryCenters}];
                this.podMemoryRequests = [{name: '节点数量',type: 'line', data: podMemoryCenterNocaches}];
                this.podMemoryRequestNocaches = [{name: '节点数量',type: 'line', data: podMemoryRequestNocaches}];
                this.podMemoryLimits = [{name: '节点数量',type: 'line', data: podMemoryLimits}];
                this.podMemoryLimitNocaches = [{name: '节点数量',type: 'line', data: podMemoryLimitNocaches}];
                this.podInNetworks = [{name: '节点数量',type: 'line', data: podInNetworks}];
                this.podOutNetworks = [{name: '节点数量',type: 'line', data: podOutNetworks}];
                this.podInFlows = [{name: '节点数量',type: 'line', data: podInFlows}];
                this.podOutFlows = [{name: '节点数量',type: 'line', data: podOutFlows}];
                this.podInPacketFlows = [{name: '节点数量',type: 'line', data: podInPacketFlows}];
                this.podOutPacketFlows = [{name: '节点数量',type: 'line', data: podOutPacketFlows}];
                this.podGPUUses = [{name: '节点数量',type: 'line', data: podGPUUses}];
                this.podGPUSeeUses = [{name: '节点数量',type: 'line', data: podGPUSeeUses}];
                this.podGPUUseNodes = [{name: '节点数量',type: 'line', data: podGPUUseNodes}];
                this.podGPUSeeUseNodes = [{name: '节点数量',type: 'line', data: podGPUSeeUseNodes}];
                this.podGPUUseRequests = [{name: '节点数量',type: 'line', data: podGPUUseRequests}];
                this.podGPUSeeUseRequests = [{name: '节点数量',type: 'line', data: podGPUSeeUseRequests}];
              }
            }
        })
      },
    },
};
</script>
<style lang='scss' scoped>
.room-bottom {
  width: 94%;
  margin: 20px auto;
  padding: 0 20px;
  .box-top {
    height: 40px;
    width: 100%;
    .box-top-left {
      display: flex;
      align-items: center;
      .span-1 {
        padding: 5px 10px;
        border: 1px solid #006eff;
        font-size: 12px;
        color: #006eff;
        cursor: pointer;
      }
      .span-2 {
        margin: 0px 10px;
      }
    }
  }
  .box-bottom {
    background: #ffffff;
    box-sizing: border-box;
    height: 580px;
    display: flex;
    justify-content: space-between;
    .box-bottom-left {
      width: 20%;
      height: 100%;
      border: 1px solid #e5e5e5;
      padding: 20px;
      .check-flex {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        // width: 100%;
      }
    }
    .box-bottom-right {
      width: 100%;
      // margin-right: 5%;
      height: auto;
      overflow-y: scroll;
    }
  }
}

.el-checkbox + .el-checkbox {
  margin-left: 0;
  margin-top: 15px;
  width: 50px;
}
.monitor >>> .el-date-picker {
  border-radius: 0;
}
</style>
