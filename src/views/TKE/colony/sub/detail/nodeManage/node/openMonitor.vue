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
       <div class="block">
            <!-- 时间组件 -->
        <TimeDropDown :TimeArr='TimeArr'  :Datecontrol="true" :Graincontrol="true" v-on:switchData="GetDat" :Difference="'D'" ></TimeDropDown>
      </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-background">
        <el-tab-pane label="节点" name="k8s_node" class="tab-one">
          <div>
          <div class="box-top">
            <div class="box-top-left">
              <!-- <span class="span-1">实时</span> -->
               <div class="block-left">
                 <span>节点：</span>
                  <el-select v-model="value" placeholder="请选择" size="mini"  @change="getChange($event)">
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
          <div class="room-bottom">
            <div class="box-bottom">
              <!-- 节点监控数据 -->
              <div class="box-bottom-right"  >
                <!-- <div ref="main" style="width:100%;height:400px;" v-if="timeAll"></div> -->
                <p>Pod重启次数(次)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='series' style="width:600px;height:200px;" />
                </div>
                <p>异常状态</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesError' style="width:600px;height:200px;" />
                </div>
                <p>CPU利用率(%)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesCpus' style="width:600px;height:200px;" />
                </div>
                <p>内存利用率(%)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesCpuUseds' style="width:600px;height:200px;" />
                </div>
                <p>内网入带宽(Bps)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesCpuRequests' style="width:600px;height:200px;" />
                </div>
                <p>内网出带宽(Bps)</p>

                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesCpuUsedmaxs'  style="width:600px;height:200px;" />
                </div>
                <p>外网入带宽(Bps)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesMemory' style="width:600px;height:200px;" />
                </div>
                <p>外网出带宽(Bps)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesemusages' style="width:600px;height:200px;" />
                </div>
                <p>TCP连接数(个)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesMemrequests' style="width:600px;height:200px;" />
                </div>
                <p>GPU利用率(%)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesMenNocaches'  style="width:600px;height:200px;" />
                </div>
                <p>GPU显存利用率(%)</p>
                <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='times' :name="'haha'" :opData='seriesMemUsageBytes'  style="width:600px;height:200px;" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="pod" name="k8s_pod">
           <div class="box-top">
            <div class="box-top-left">
               <div class="block-left">
                 <span>节点：</span>
                  <el-select v-model="value" placeholder="请选择" size="mini"  @change="getChange($event)">
                    <el-option
                      v-for="item in podData"
                      :key="item.InstanceId"
                      :label="item.InstanceId+'('+item.InstanceName+')'"
                      :value="item.PrivateIpAddresses+'|'+item.InstanceId"
                    ></el-option>
                  </el-select>
                  <span>Pod:</span>
                  <el-select v-model="podValue" placeholder="请选择" size="mini" @change="getPodChange">
                    <el-option
                      v-for="item in Podlist"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
              </div>
            </div>
          </div>
          <div class="room-bottom">
            <div class="box-bottom">
             <div class="box-bottom-right">
              <p>异常状态</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podStatuErrs' style="width:600px;height:200px;" />
              </div>
              <p>CPU使用量(核)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podCpuUseds'  style="width:600px;height:200px;" />
              </div>
              <p>CPU利用率(占主机)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podCpuUsedCenters' style="width:600px;height:200px;" />
              </div>
              <p>CPU利用率(占Request)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podCpuUsedRequests'  style="width:600px;height:200px;" />
              </div>
              <p>CPU利用率(占Limit)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podCpuUsedLimits'  style="width:600px;height:200px;" />
              </div>
              <p>内存使用量(B)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemorys' style="width:600px;height:200px;" />
              </div>
              <p>内存使用量(不含cache)(B)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryNocaches'  style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占主机)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryCenters' style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占主机,不含cache)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryCenterNocaches'  style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占Request)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryRequestNocaches'  style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占Request,不含cache)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryLimits' style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占Limit)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podMemoryLimitNocaches'  style="width:600px;height:200px;" />
              </div>
              <p>内存利用率(占Limit,不含cache)(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podInNetworks' style="width:600px;height:200px;" />
              </div>
              <p>网络入带宽(Bps)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podOutNetworks' style="width:600px;height:200px;" />
              </div>
              <p>网络出带宽(Bps)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podInFlows' style="width:600px;height:200px;" />
              </div>
              <p>网络入流量(B)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes'  :name="podValue" :opData='podOutFlows' style="width:600px;height:200px;" />
              </div>
              <p>网络出流量(B)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes'  :name="podValue" :opData='podInPacketFlows'  style="width:600px;height:200px;" />
              </div>
              <p>网络入包量(个/s)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podOutPacketFlows'  style="width:600px;height:200px;" />
              </div>
              <p>网络出包量(个/s)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUUses' style="width:600px;height:200px;" />
              </div>
              <p>GPU使用量(卡)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUSeeUses' style="width:600px;height:200px;" />
              </div>
              <p>GPU显存使用量(B)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUUseNodes'  style="width:600px;height:200px;" />
              </div>
              <p>GPU利用率（占节点）(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUSeeUseNodes'  style="width:600px;height:200px;" />
              </div>
              <p>GPU显存利用率（占节点）(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUUseRequests' style="width:600px;height:200px;" />
              </div>
              <p>GPU利用率（占Request）(%)</p>
              <div class="box-top-left" style="margin-bottom:20px;">
                  <EcharTKE :time='podTimes' :name="podValue" :opData='podGPUSeeUseRequests'  style="width:600px;height:200px;" />
              </div>
            </div>
          </div>
          </div>
        </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
// import subTitle from "@/views/TKE/components/subTitle";
import {TKE_GETTKEDATAJOB,TKE_GETTKEDATARESULT,NODE_LIST,POINT_REQUEST,NODE_INFO} from '@/constants'
import { ErrorTips } from "@/components/ErrorTips";
import TimeDropDown from "@/components/public/TimeDropDown.vue"
import moment from 'moment';
import EcharTKE from '@/components/public/EcharTKE'
// import EcharTKELine from '@/components/public/EcharTKELine'
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
      activeName: "k8s_node",
      value: "",
      podValue:"",
      checkAll: true,
      options: [],
      isCollapse: "k8s_node",
      isIndeterminate: false,
      title:"",
      clusterId:"",
      InstancesAll:[],
      isFlag:true,
      Nodelist:[],
      Podlist:[],
      podData:[],
      valueLast:"",
      JobId:"",// 后台返回id
      StartTime:"",// 开始时间
      EndTIme:"", // 结束时间
      grain:"" ,//粒数
      NodeTitle:"",
      times:[],
      series:[],
      seriesError:[],
      seriesCpus:[],
      seriesCpuUseds:[],
      seriesCpuRequests:[],
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
  created() {
    let{ title, clusterId } = this.$route.query
    this.clusterId = clusterId
    this.title = title
  },

  methods: {
    GetDat(val){
      // console.log(val)
      this.grain = val[0]
      this.StartTime = new Date(val[1].StartTIme).getTime();
      this.EndTIme = new Date(val[1].EndTIme).getTime();
      console.log(val)
      console.log(this.StartTime,this.EndTIme)
      if(this.activeName == "k8s_pod"){
        // console.log(2233)
        this.getPodList()
      } else {
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
    // tab切换事件
    handleClick(tab, event) {
      console.log(this.activeName)
      console.log(tab, event);
      if(this.activeName == "k8s_pod"){
        // console.log(2233)
        this.getPodList()
      } else {
        this.getNodeList()
      }
      // this.GetDat()
    },
    setTime() {
      this.$emit("setTime", this.value2);
    },
    getChange(val){
      // console.log(val)
      this.valueLast = val.split("|")
      console.log(this.valueLast)
      this.NodeTitle = this.valueLast[1]
      this.getPodList()
    },
    getPodChange(val){
      this.podValue = val
      console.log(val)
      this.getPodList()
    },
        //获取节点列表
    async getNodeList () {
      let params = {
        ClusterId: this.clusterId,
        Offset: 0,
        Limit: 20,
        Version: "2018-05-25",
        InstanceRole: "WORKER"
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
      console.log(ids)
      // 节点下拉数据
      this.Nodelist = ids
      let param = {
        Version: "2017-03-12",
        Limit: 20
      }
      if(ids.length > 0) {
        for(let i = 0; i < ids.length; i++) {
          param['InstanceIds.'+i] = ids[i];
        }
        let nodeRes = await this.axios.post(NODE_LIST, param);
        if(nodeRes.Response.Error === undefined) {
          this.podData = []
          // 数据合并
          if(nodeRes.Response.InstanceSet.length > 0) {
            ids.forEach((x,y)=>{
                  if(!this.podData[y]){
                     this.podData[y]={
                            InstanceId:x
                        }
                  }
                  nodeRes.Response.InstanceSet.forEach((val,index)=>{
                      if(val['InstanceId']==this.podData[y]['InstanceId']){
                          this.podData[y]['InstanceName']=val.InstanceName
                          this.podData[y]['PrivateIpAddresses'] = val.PrivateIpAddresses[0]
                          
                      }
                      if(!this.podData[y]['InstanceName']){
                          this.podData[y]['InstanceName']=''
                          this.podData[y]['PrivateIpAddresses'] = val.PrivateIpAddresses[0]
                      }
                  })
              })
            console.log( this.podData)
            this.value = this.podData[0].PrivateIpAddresses+"|"+this.podData[0].InstanceId
            this.valueLast = this.value.split("|")
            this.NodeTitle = this.valueLast[1]
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
    console.log(this.valueLast)
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
          this.Podlist =dataPod
          if(!this.podValue){
              this.podValue = this.Podlist[0]
          }
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
        NamespaceName: this.activeName,
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
            this.getResult()
        }
      })
    },
    getNodeJob(){
       const param = {
        'Conditions.0': JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]),
        'Conditions.1': JSON.stringify(["node_role","=","Node"]),
        'Conditions.2': JSON.stringify(["unInstanceId","in",this.Nodelist]),
        EndTime: this.EndTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: this.activeName,
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
          // console.log()
          console.log(res)
        if(res.Response.Error === undefined) {
            console.log(res.Response.JobId)
            this.JobId = res.Response.JobId
            this.getResult()
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
        console.log(this.NodeTitle)
        //   console.log(res)
        if(res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data)
          console.log(JSON.parse(res.Response.Data))
          if(this.activeName == "k8s_node"){
            let times = [], podIds = [], pods = [], statuErrs = [], cpus = [], cpuUseds = [],
            cpuRequests = [], cpuUsedmaxs = [], memorys= [], memusages = [], memrequests = [], menNocaches = [],
            memUsageBytes = []
              if(data.length > 0) {
                for(let i = 0; i < data.length; i++) {
                  let item = data[i];
                  let podId = item[1];
                  if(this.NodeTitle == podId){
                      let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");//时间
                      //节点ID
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
              }
              this.times = times
              this.series = pods
              this.seriesError = statuErrs
              this.seriesCpus =  cpus
              this.seriesCpuUseds =  cpuUseds
              this.seriesCpuRequests =  cpuRequests
              this.seriesCpuUsedmaxs = cpuUsedmaxs
              this.seriesMemory =  memorys
              this.seriesemusages =  memusages
              this.seriesMemrequests =  memrequests
              this.seriesMenNocaches =  menNocaches
              this.seriesMemUsageBytes = memUsageBytes
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
                  let podsId  = items[1];//节点ID
                  if(this.podValue == podsId){
                    // console.log(this.podValue)
                    let podTime = moment(items[0]).format("YYYY-MM-DD HH:mm:ss");//时间
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
                    podsIds.push(podsId)                 
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
                }
                this.podTimes = podTimes;
                this.podStatuErrs =  podStatuErrs
                this.podCpuUseds =  podCpuUseds
                this.podCpuUsedCenters = podCpuUsedCenters
                this.podCpuUsedRequests = podCpuUsedRequests
                this.podCpuUsedLimits = podCpuUsedLimits
                this.podMemoryNocaches = podMemoryNocaches
                this.podMemoryCenters = podMemoryCenters
                this.podMemoryRequests = podMemoryCenterNocaches
                this.podMemoryRequestNocaches = podMemoryRequestNocaches
                this.podMemoryLimits = podMemoryLimits
                this.podMemoryLimitNocaches = podMemoryLimitNocaches
                this.podInNetworks = podInNetworks
                this.podOutNetworks = podOutNetworks
                this.podInFlows = podInFlows
                this.podOutFlows = podOutFlows
                this.podInPacketFlows = podInPacketFlows
                this.podOutPacketFlows = podOutPacketFlows
                this.podGPUUses = podGPUUses
                this.podGPUSeeUses = podGPUSeeUses
                this.podGPUUseNodes =  podGPUUseNodes
                this.podGPUSeeUseNodes = podGPUSeeUseNodes
                this.podGPUUseRequests = podGPUUseRequests
                this.podGPUSeeUseRequests = podGPUSeeUseRequests
              }
            }
        })
      },
    },
};
</script>
<style lang='scss' scoped>
.tab-background{
  background: white;
  padding-left: 20px;
  ::v-deep .el-tabs__nav-wrap::after{
    background-color: white;
  }
}
// .block-left{
//   float: left;
// }
.block{
  width: 100%;
  background: white;
  padding:20px 0 20px 20px;
}
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
      overflow-y: scroll;
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
  // background: white;
}
</style>
