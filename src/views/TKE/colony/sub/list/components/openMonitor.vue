<template>
  <div class="monitor">
    <!-- 顶部标题 -->
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
            <span>{{title}} / {{$t('TKE.colony.jk')}}</span>
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
        </div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-left">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选(共{{this.list.length}}个)</el-checkbox>
          <!-- <div style="margin: 15px 0;"></div> -->
          <el-checkbox-group
            v-model="checkedInstances"
            @change="handleCheckedCitiesChange"
            class="check-flex"
          >
            <el-checkbox v-for="(item, i) in list" :label="item.metadata.name" :key="i">{{item.metadata.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="box-bottom-right">
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='series' style="height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='seriesError' style="height:200px;" />
          </div>
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
      times:[],
      series:[],
      seriesError:[],
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
              label: "24小時"
            }
          ]
        }
      ],
      title: '',//title
      type: '',//类型
      list: [],//列表
      spaceName: '',//空间名称
      JobId:"",// 后台返回id
      StartTime:0,//开始时间
      EndTime:0,//结束时间
      timestamp: '',//粒度长度
    }
  },
  watch:{

  },
  created() {
    this.title = this.$route.query.title;
    this.type = this.$route.query.type;
    this.list = this.$route.query.list;
    this.clusterId = this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
  },
  // mounted(){
  //   this.inits();
  // },
  methods: {
    GetDat(val){
      this.StartTime = new Date(val[1].StartTIme).getTime();
      this.EndTime = new Date(val[1].EndTIme).getTime();
      this.timestamp = val[0];
      this.getDataJob();
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    changeFlag() {
      this.$emit("changeFlag", false);
    },
    handleCheckAllChange(val) {
      debugger
      this.checkedInstances = val ? this.InstancesAll : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
      let checkedInstances = value.length;
      this.checkAll = checkedInstances === this.list.length;
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

    getDataJob(){
      const param = {
        EndTime: this.EndTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: "k8s_workload",
        Offset: 0,
        Order: "asc",
        OrderBy: "timestamp",
        StartTime: this.StartTime,
        Version: "2019-06-06"
      }
      let list = this.list;
      let arr = [];
      if(list.length > 0) {
        list.forEach(element => {
          arr.push(element.metadata.name);
        });
      }
      param['Conditions.0'] = JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]);
      param['Conditions.1'] = JSON.stringify(["workload_kind","=",this.type]);
      param['Conditions.2'] = JSON.stringify(["namespace","=",this.spaceName]);
      param['Conditions.3'] = JSON.stringify(["workload_name","in",arr]);
      param['Fields.0'] = 'max(k8s_workload_pod_total)';
      param["Fields.1"] = "sum(k8s_workload_pod_restart_total)";
      param["Fields.2"] = "max(k8s_workload_cpu_core_used)";
      param["Fields.3"] = "max(k8s_workload_rate_cpu_core_used_cluster)";
      param["Fields.4"] = "max(k8s_workload_mem_usage_bytes)";
      param["Fields.5"] = "max(k8s_workload_rate_mem_usage_bytes_cluster)";
      param["Fields.6"] = "max(k8s_workload_network_receive_bytes_bw)";
      param["Fields.7"] = "max(k8s_workload_network_transmit_bytes_bw)";
      param["Fields.8"] = "max(k8s_workload_network_receive_bytes)";
      param["Fields.9"] = "max(k8s_workload_network_transmit_bytes)";
      param["Fields.10"] = "max(k8s_workload_network_receive_packets)";
      param["Fields.11"] = "max(k8s_workload_network_transmit_packets)";
      param["Fields.12"] = "max(k8s_workload_gpu_used)";
      param["Fields.13"] = "max(k8s_workload_gpu_memory_used_bytes)";
      param["Fields.14"] = "max(k8s_workload_rate_gpu_used_cluster)";
      param["Fields.15"] = "max(k8s_workload_rate_gpu_memory_used_cluster)";
      param["GroupBys.0"] = `timestamp(${this.timestamp}s)`;
      param["GroupBys.1"] = "workload_name";
      this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
        if(res.Response.Error === undefined) {
          this.JobId = res.Response.JobId
          this.getResult()
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
      })
    },
    getResult() {
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      }
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        if(res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data)
          console.log(data);
          // let times = [], podIds = [], pods = [], statuErrs = [], cpus = [], cpuUseds = [],
          // cpuRequests = [], cpuUsedmaxs = [], memorys= [], memusages = [], memrequests = [], menNocaches = [],
          // memUsageBytes = [], memNoYsages = [], receives = [], transmits = [];
          let monitor = {};
          if(data.length > 0) {
            for(let i = 0; i < data.length; i++) {
              let item = data[i];
              let key = item[0];
              let value = monitor[key];
              if(value) {
                value.push(data[i]);
              } else {
                value = [];
                value.push(data[i]);
              }
              monitor[key] = value;



              // let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");//时间
              // let podId = item[1];//节点ID
              // let pod = item[2];//实例数量
              // let statuErr = item[3];//异常
              // let cpu = item[4];//cpu总配置
              // let cpuUsed = item[5];//cpu使用率
              // let cpuRequest = item[6];//cpu分配率
              // let cpuUsedmax = item[7];//cpu使用量
              // let memory = item[8];//内存总量
              // let memusage = item[9];
              // let memrequest = item[10];
              // let menNocache = item[11];
              // let memUsageByte = item[12];
              // let memNoYsage = item[13];
              // let receive = item[14];
              // let transmit = item[15];
              // times.push(time);
              // podIds.push(podId);
              // pods.push(pod);
              // statuErrs.push(statuErr);
              // cpus.push(cpu);
              // cpuUseds.push(cpuUsed);
              // cpuRequests.push(cpuRequest);
              // cpuUsedmaxs.push(cpuUsedmax);
              // memorys.push(memory);
              // memusages.push(memusage);
              // memrequests.push(memrequest);
              // menNocaches.push(menNocache);
              // memUsageBytes.push(memUsageByte);
              // memNoYsages.push(memNoYsage);
              // receives.push(receive);
              // transmits.push(transmit);
            }
          }
          for(let key in monitor) {
            let item = monitor[key];
            let time = moment(key).format("YYYY-MM-DD HH:mm:ss");//时间

            for(let j = 0; j < item.length; j++) {
              let monItem = item[j];
              let pod = item[2];//实例数量
              let restart = item[3];//重启次数
              let cpu = item[4];//cpu总配置
              let cpuUsed = item[5];//cpu使用率
              let cpuRequest = item[6];//cpu分配率
              let cpuUsedmax = item[7];//cpu使用量
              let memory = item[8];//内存总量
              let memusage = item[9];
              let memrequest = item[10];
              let menNocache = item[11];
              let memUsageByte = item[12];
              let memNoYsage = item[13];
              let receive = item[14];
              let transmit = item[15];
            }
          }
          // this.times = times;
          // this.series = [{name: '节点数量',type: 'line', data: pods}];
          // this.seriesError = [{name: '节点数量',type: 'line', data: statuErrs}];
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
