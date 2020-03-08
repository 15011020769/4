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
            class="check-flex"
          >
            <el-checkbox v-for="item in instances" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="box-bottom-right">
          <!-- <div ref="main" style="width:100%;height:400px;" v-if="timeAll"></div> -->
        </div>
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
// const cityOptions = ["asdasd", "3dsda", "asdaqwe"];
export default {
  name: "openMonitor",
  props: {
    dimensionflag: {
      type: Boolean,
      default: false
    },
  },
  components:{TimeDropDown},
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
      StartTime:"",
      EndTIme:"",
      timeAll:[],
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
   mounted(){
    this.inits();
  },
  methods: {
    GetDat(val){
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
    // inits(){
    //   var myChart = this.$echarts.init(this.$refs.main)
    // // 绘制图表
    // myChart.setOption({
    //     title: {
    //           text: '折线图堆叠'
    //       },
    //       tooltip: {
    //           trigger: 'axis'
    //       },
    //       // legend: {
    //       //     data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    //       // },
    //        grid: {
    //         x: 50,
    //         y: 45,
    //         x2: 5,
    //         y2: 20,
    //         borderWidth: 1
    //       },
    //       toolbox: {
    //           feature: {
    //               saveAsImage: {}
    //           }
    //       },
    //       xAxis: {
    //           type: 'category',
    //           boundaryGap: false,
    //           data: this.timeAll,
    //            axisTick: {
    //           // 决定是否显示坐标刻度
    //             alignWithLabel: true,
    //             show: false
    //           },
    //           splitLine: {
    //             show: false
    //           },
    //           axisLabel: {
    //             // 决定是否显示数据
    //             show: false
    //           },
    //       },
    //       yAxis: {
    //           type: 'value',
    //            splitLine: {
    //             // 网格线
    //             show: false
    //           },
    //           axisLine: {
    //             // X轴显示
    //             show: false
    //           },
    //       },
    //       series: [  {
    //               name: '邮件营销',
    //               type: 'line',
    //               stack: '总量',
    //               data: this.timeAll
    //           },
    //           {
    //               name: '联盟广告',
    //               type: 'line',
    //               stack: '总量',
    //               data: this.timeAll
    //           },
    //           {
    //               name: '视频广告',
    //               type: 'line',
    //               stack: '总量',
    //               data: this.timeAll
    //           },
    //           {
    //               name: '直接访问',
    //               type: 'line',
    //               stack: '总量',
    //               data: this.timeAll
    //           },
    //           {
    //               name: '搜索引擎',
    //               type: 'line',
    //               stack: '总量',
    //               data: this.timeAll
    //           },
    //       ]
    //   });
    // },
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
      param["GroupBys.0"] = "timestamp(60s)";
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
      param["GroupBys.0"] = "timestamp(60s)";
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
          let dataCount = JSON.parse(res.Response.Data)
          console.log(JSON.parse(res.Response.Data))
          this.timeAll=dataCount.map(item=>{
              return  moment(item[0]).format("YYYY-MM-DD HH:mm:ss")
              // return time
          })
          console.log(this.timeAll)
          // this.timeAll.push(JSON.parse(res.Response.Data).)
          
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
      }
    }
    .box-bottom-right {
      width: 85%;
      margin-right: 5%;
      height: auto;
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
