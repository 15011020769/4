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
          <div class="block" style="display: flex;">
            <!-- 时间组件 -->
            <TimeDropDown
              :TimeArr="TimeArr"
              :Datecontrol="true"
              :Graincontrol="false"
              v-on:switchData="GetDat"
              :Difference="'D'"
            ></TimeDropDown>
            <el-select
              size="mini"
              v-model="resourceName"
              :placeholder="$t('TKE.overview.qxz')"
              @change="changeResource"
              style="margin-left:10px;height:30px;"
            >
              <el-option
                v-for="item in list"
                :key="item.metadata.name"
                :value="item.metadata.name"
                style="margin-left:10px;height:30px;"
              ></el-option>
            </el-select>
          </div>
          <!-- 对比维度 -->
        </div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-right">
          <p>{{$t('TKE.subList.podsl')}}({{$t('TKE.overview.ge')}})</p>
          <div class="dataNone" v-if="podNumbers.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='podNumbers' :name='podName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.colony.pcqcs')}}</p>
          <div class="dataNone" v-if="podStarts.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='podStarts' :name='restartName' style="width:90%;height:200px;" />
          </div>
          <p>CPU使用量(核)</p>
          <div class="dataNone" v-if="cpuUseds.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='cpuUseds' :name='cpuName' style="width:90%;height:200px;" />
          </div>
          <p>CPU利用率({{$t('TKE.overview.zhan')}}集群)(%)</p>
          <div class="dataNone" v-if="cpuUsedColonys.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='cpuUsedColonys' :name='cpuRateName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.ncsyl')}}(B)</p>
          <div class="dataNone" v-if="cpuRequests.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='cpuRequests' :name='memoryName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.nclyl')}}({{$t('TKE.overview.zhan')}}集群)(%)</p>
          <div class="dataNone" v-if="cpuUsedmaxs.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='cpuUsedmaxs' :name='memRateName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlrdk')}}(Bps)</p>
          <div class="dataNone" v-if="memorys.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='memorys' :name='internetName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlcdk')}}(Bps)</p>
          <div class="dataNone" v-if="memusages.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='memusages' :name='internetOutName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlrll')}}(B)</p>
          <div class="dataNone" v-if="memrequests.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='memrequests' :name='netName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlcll')}}(B)</p>
          <div class="dataNone" v-if="menNocaches.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='menNocaches' :name='netOutName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlrbl')}}({{$t('TKE.overview.ge')}}/s)</p>
          <div class="dataNone" v-if="memUsageBytes.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='memUsageBytes' :name='inflagName' style="width:90%;height:200px;" />
          </div>
          <p>{{$t('TKE.overview.wlcbl')}}({{$t('TKE.overview.ge')}}/s)</p>
          <div class="dataNone" v-if="memNoYsages.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='memNoYsages' :name='outflagName' style="width:90%;height:200px;" />
          </div>
          <p>GPU使用量(卡)</p>
          <div class="dataNone" v-if="GpuUseds.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='GpuUseds' :name='gpuName' style="width:90%;height:200px;" />
          </div>
          <p>GPU{{$t('TKE.overview.xcsyl')}}(B)</p>
          <div class="dataNone" v-if="GpuUsedSees.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='GpuUsedSees' :name='gpumemName' style="width:90%;height:200px;" />
          </div>
          <p>GPU利用率（{{$t('TKE.overview.zhan')}}集群）(%)</p>
          <div class="dataNone" v-if="GpuUsedColoys.length === 0">{{$t('TKE.overview.zwsj')}}</div>
           <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='GpuUsedColoys' :name='gpeuesdName' style="width:90%;height:200px;" />
          </div>
          <p>GPU{{$t('TKE.overview.xclyl')}}（{{$t('TKE.overview.zhan')}}集群）(%)</p>
          <div class="dataNone" v-if="GpuUsedSeeColoys.length === 0">{{$t('TKE.overview.zwsj')}}</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <EcharTKE :time='times' :opData='GpuUsedSeeColoys' :name='gpumemName' style="width:90%;height:200px;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  TKE_GETTKEDATAJOB,
  TKE_GETTKEDATARESULT,
  NODE_LIST,
  POINT_REQUEST,
  NODE_INFO
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import TimeDropDown from "@/components/public/TimeDropDown7.vue";
import moment from "moment";
import EcharTKE from "@/components/public/EcharTKE";
export default {
  name: "openMonitor",
  props: {
    dimensionflag: {
      type: Boolean,
      default: false
    }
  },
  components: { TimeDropDown, EcharTKE },
  data() {
    return {
      checkAll: true,
      options: [],
      isCollapse: "k8s_node",
      checkedInstances: [], // 全选
      isIndeterminate: false,
      instances: [], // 单选
      title: "",
      clusterId: "",
      InstancesAll: [],
      isFlag: true,
      //   list:[],
      podData: [],
      valueLast: "",
      times: [],
      podIds : [],
      podNumbers : [],
      podStarts : [],
      cpuUseds : [],
      cpuUsedColonys : [],
      cpuRequests : [],
      cpuUsedmaxs : [],
      memorys : [],
      memusages : [],
      memrequests : [],
      menNocaches : [],
      memUsageBytes : [],
      memNoYsages : [],
      GpuUseds : [],
      GpuUsedSees : [],
      GpuUsedColoys : [],
      GpuUsedSeeColoys : [],
      TimeArr: [
        {
          name: "實時",
          Time: "realTime",
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
          name: "近一天",
          Time: "Nearly_24_hours",
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
          name: "近7天",
          Time: "Nearly_7_days",
          TimeGranularity: [
            {
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
      title: "", //title
      type: "", //类型
      list: [], //列表
      spaceName: "", //空间名称
      JobId: "", // 后台返回id
      StartTime: 0, //开始时间
      EndTime: 0, //结束时间
      timestamp: "", //粒度长度
      resourceName: '',//资源名称
      podName: 'Pod數量',
      restartName: 'Pod重啟次數',
      cpuName: 'CPU使用量',
      cpuRateName: 'CPU利用率(佔集群)',
      memoryName: '記憶體使用量',
      memRateName: '記憶體利用率(佔集群)',
      internetName: '網路入頻寬',
      internetOutName: '網路出頻寬',
      netName: '網路入流量',
      netOutName: '網路出流量',
      inflagName: '網路入包量',
      outflagName: '網路出包量',
      gpuName: 'GPU使用量',
      gpumemName: 'GPU顯存使用量',
      gpeuesdName: 'GPU利用率',
      gpumemName: 'GPU顯存利用率(佔集群)'
    };
  },
  watch: {},
  created() {
    this.title = this.$route.query.title;
    this.type = this.$route.query.type;
    this.clusterId = this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.list = this.$route.query.list;
    if(this.$route.query.list.length > 0) {
      this.resourceName = this.$route.query.list[0].metadata.name;
    }
  },
  methods: {
    GetDat(val) {
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
      //   debugger
      this.checkedInstances = val ? this.InstancesAll : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
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
    getChange(val) {
      console.log(val);
      this.valueLast = val.split("|");
      console.log(this.valueLast);
      this.getPodList();
    },
    
    //选择资源
    changeResource(val) {
      this.getDataJob();
    },

    getDataJob() {
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
      };
      param["Conditions.0"] = JSON.stringify([
        "tke_cluster_instance_id",
        "=",
        this.clusterId
      ]);
      param["Conditions.1"] = JSON.stringify(["workload_kind", "=", this.type]);
      param["Conditions.2"] = JSON.stringify([
        "namespace",
        "=",
        this.spaceName
      ]);
      let arr = [];
      arr.push(this.resourceName);
      param["Conditions.3"] = JSON.stringify([
        "workload_name",
        "in",
        arr
      ]);
      param["Fields.0"] = "max(k8s_workload_pod_total)";
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
        if (res.Response.Error === undefined) {
          this.JobId = res.Response.JobId;
          this.getResult();
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
    getResult() {
      this.loadShow = true;
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      };
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        if (res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data);
          this.podNumbers = [];
          this.podStarts = [];
          this.cpuUseds = [];
          this.cpuUsedColonys = [];
          this.cpuRequests = [];
          this.cpuUsedmaxs = [];
          this.memorys = [];
          this.memusages = [];
          this.memrequests = [];
          this.menNocaches = [];
          this.memUsageBytes = [];
          this.memNoYsages = [];
          this.GpuUseds = [];
          this.GpuUsedSees = [];
          this.GpuUsedColoys = [];
          this.GpuUsedSeeColoys = [];
          let times = [],
            podIds = [],
            podNumbers = [],
            podStarts = [],
            cpuUseds = [],
            cpuUsedColonys = [],
            cpuRequests = [],
            cpuUsedmaxs = [],
            memorys = [],
            memusages = [],
            memrequests = [],
            menNocaches = [],
            memUsageBytes = [],
            memNoYsages = [],
            GpuUseds = [],
            GpuUsedSees = [],
            GpuUsedColoys = [],
            GpuUsedSeeColoys = []
          let monitor = {};
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss"); //时间
              let podId = item[1]; //节点ID
              let podNumber = item[2]; //Pod数量
              let podStart = item[3]; //Pod重启次数
              let cpuUsed = null; //CPU使用量
              if(item[4]) {
                cpuUsed = item[4].toFixed(5);
              }
              let cpuUsedColony = null; //CPU利用率(占集群)
              if(item[5]) {
                cpuUsedColony = item[5].toFixed(4);
              }
              let cpuRequest = null; //内存使用量
              if(item[6]) {
                cpuRequest = (item[6]/(1000*1000)).toFixed(3);
              }
              let cpuUsedmax = null; //内存利用率(占集群)
              if(item[7]) {
                cpuUsedmax = item[7].toFixed(3);
              }
              let memory = null; //网络入带宽
              if(item[8]) {
                memory = item[8].toFixed(3);
              }
              let memusage = null;//网络出带宽
              if(item[9]) {
                memusage = item[9].toFixed(3);
              }
              let memrequest = null;//网络入流量
              if(item[10]) {
                memrequest = (item[10]/1000).toFixed(3);
              }
              let menNocache = null;//网络出流量
              if(item[11]) {
                menNocache = (item[11]/1000).toFixed(3);
              }
              let memUsageByte = null;//网络入包量
              if(item[12]) {
                memUsageByte = item[12].toFixed(3);
              }
              let memNoYsage = null;//网络出包量
              if(item[13]) {
                memNoYsage = item[13].toFixed(3);
              }
              let GpuUsed = item[14];//GPU使用量
              let GpuUsedSee = item[15];//GPU显存使用量
              let GpuUsedColoy = item[16];//GPU利用率（占集群）
              let GpuUsedSeeColoy = item[17];//GPU显存利用率（占集群）
              times.push(time);
              podIds.push(podId);
              podNumbers.push(podNumber);
              podStarts.push(podStart);
              cpuUseds.push(cpuUsed);
              cpuUsedColonys.push(cpuUsedColony);
              cpuRequests.push(cpuRequest);
              cpuUsedmaxs.push(cpuUsedmax);
              memorys.push(memory);
              memusages.push(memusage);
              memrequests.push(memrequest);
              menNocaches.push(menNocache);
              memUsageBytes.push(memUsageByte);
              memNoYsages.push(memNoYsage);
              GpuUseds.push(GpuUsed);
              GpuUsedSees.push(GpuUsedSee);
              GpuUsedColoys.push(GpuUsedColoy);
              GpuUsedSeeColoys.push(GpuUsedSeeColoy);
            }
          }
            this.times = times;
            this.podNumbers = podNumbers;//[{name: 'Pod数量',type: 'line', data: podNumbers}];
            this.podStarts = podStarts;//[{name: 'Pod重启次数',type: 'line', data: podStarts}];
            this.cpuUseds = cpuUseds;//[{name: 'CPU使用量',type: 'line', data: cpuUseds}];
            this.cpuUsedColonys = cpuUsedColonys;//[{name: 'CPU利用率(占集群)',type: 'line', data: cpuUsedColonys}];
            this.cpuRequests = cpuRequests;//[{name: '内存使用量',type: 'line', data: cpuRequests}];
            this.cpuUsedmaxs = cpuUsedmaxs;//[{name: '内存利用率(占集群)',type: 'line', data: cpuUsedmaxs}];
            this.memorys = memorys;//[{name: '网络入带宽',type: 'line', data: memorys}];
            this.memusages = memusages;//[{name: '网络出带宽',type: 'line', data: memusages}];
            this.memrequests = memrequests;//[{name: '网络入流量',type: 'line', data: memrequests}];
            this.menNocaches = menNocaches;//[{name: '网络出流量',type: 'line', data: menNocaches}];
            this.memUsageBytes = memUsageBytes;//[{name: '网络入包量',type: 'line', data: memUsageBytes}];
            this.memNoYsages = memNoYsages;//[{name: '网络出包量',type: 'line', data: memNoYsages}];
            this.GpuUseds = GpuUseds;//[{name: 'GPU使用量',type: 'line', data: GpuUseds}];
            this.GpuUsedSees = GpuUsedSees;//[{name: 'GPU显存使用量',type: 'line', data: GpuUsedSees}];
            this.GpuUsedColoys = GpuUsedColoys;//[{name: 'GPU利用率(占集群)',type: 'line', data: GpuUsedColoys}];
            this.GpuUsedSeeColoys = GpuUsedSeeColoys;//[{name: 'GPU显存利用率(占集群)',type: 'line', data: GpuUsedSeeColoys}];
            this.loadShow = false;
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
    }
  }
};
</script>
<style lang='scss' scoped>
.dataNone{
  width: 100%;
  height: 200px;
  line-height:200px;
  text-align:center;
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
      }
    }
    .box-bottom-right {
      width: 100%;
      /* margin-right: 5%; */
      height: auto;
      overflow-y:scroll;
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
