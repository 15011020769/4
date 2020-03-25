<template>
  <div class="monitor">
    <!-- 顶部标题 -->
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
            <span>集群({{name}}) / 监控</span>
          </span>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="room-bottom">
      <div class="box-top">
        <div class="box-top-left">
          <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'D'"
                  v-on:switchData="GetDat" />
        </div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-right">
          <p>节点数量(台)</p>
          <div class="dataNone" v-if="clusters.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='series' style="width:90%;height: 200px;" />
          </div>
          <p>Pod数量(个)</p>
          <div class="dataNone" v-if="pods.length === 0 && allocatablePods.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesPod' style="width:90%;height: 200px;" />
          </div>
          <p>CPU总配置(核)</p>
          <div class="dataNone" v-if="cpus.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesCpu' style="width:90%;height: 200px;" />
          </div>
          <p>CPU利用率(%)</p>
          <div class="dataNone" v-if="cpuUseds.length === 0 && cpuRequests.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesCpuRate' style="width:90%;height: 200px;" />
          </div>
          <p>CPU使用量(核)</p>
          <div class="dataNone" v-if="cpuUsedmaxs.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesCpuUsed' style="width:90%;height: 200px;" />
          </div>
          <p>内存总配置(B)</p>
          <div class="dataNone" v-if="memorys.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesMemoy' style="width:90%;height: 200px;" />
          </div>
          <p>内存利用率(%)</p>
          <div class="dataNone" v-if="memusages.length === 0 && memrequests.length === 0 && menNocaches.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesMemoyRate' style="width:90%;height: 200px;" />
          </div>
          <p>内存使用量(B)</p>
          <div class="dataNone" v-if="memUsageBytes.length === 0 && memNoYsages.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesMemoyUsed' style="width:90%;height: 200px;" />
          </div>
          <p>网络带宽(Bps)</p>
          <div class="dataNone" v-if="receives.length === 0 && transmits.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='times' :series='seriesInternet' style="width:90%;height: 200px;" />
          </div>
          <p>GPU 总配置(卡)</p>
          <div class="dataNone" v-if="gpus.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='gpuTimes' :series='seriesGpu' style="width:90%;height: 200px;" />
          </div>
          <p>GPU利用率(%)</p>
          <div class="dataNone" v-if="gpuUseds.length === 0 && gpuRequests.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='gpuTimes' :series='seriesGpuUesd' style="width:90%;height: 200px;" />
          </div>
          <p>显存利用率(%)</p>
          <div class="dataNone" v-if="gpuMems.length === 0 && gpuMemRequests.length === 0">暂无数据</div>
          <div class="box-top-left" style="margin-bottom:20px;" v-else>
            <Echarts :time='gpuTimes' :series='seriesInternet' style="width:90%;height: 200px;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {TKE_GETTKEDATAJOB,TKE_GETTKEDATARESULT,NODE_LIST,POINT_REQUEST,NODE_INFO} from '@/constants'
import TimeDropDown from '@/components/public/TimeDropDown'
import Echarts from '@/components/public/Echarts'
import moment from 'moment';
import { ErrorTips } from "@/components/ErrorTips";
// const cityOptions = ["asdasd", "3dsda", "asdaqwe"];
export default {
  name: "openMonitor",
  props: {
    dimensionflag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      clusters: [],
      pods: [],
      allocatablePods: [],
      cpus: [],
      cpuUseds: [],
      cpuRequests: [],
      cpuUsedmaxs: [],
      memorys: [],
      memusages: [],
      memrequests: [],
      menNocaches: [],
      memUsageBytes: [],
      memNoYsages: [],
      receives: [],
      transmits: [],
      gpus: [],
      gpuUseds: [],
      gpuRequests: [],
      gpuMems: [],
      gpuMemRequests: [],
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
      list: [],//列表数据
      startTime: 0,//开始时间
      endTime: 0,//结束时间
      timestamp: '',//粒度
      times: [],//时间轴
      series: [],//节点y轴数据
      seriesPod: [],//Pod数量
      title: 'asdsad',
      legend: { data: ['节点数量']},
      seriesCpu: [],//cpuY轴
      seriesCpuRate: [],//CPU利用率
      seriesCpuUsed: [],//CPU使用量
      seriesMemoy: [],//内存总配置
      seriesMemoyRate: [],//内存利用率
      seriesMemoyUsed: [],//内存使用量
      seriesInternet: [],//网络带宽
      gpuTimes: [],//gpu时间轴
      seriesGpu: [],//gpu
      seriesGpuUesd: [],//gpu使用率
      seriesInternet: [],//gpu分配率
      podName: '节点数量',
    }
  },
  watch:{
    
  },
  components: {
    TimeDropDown,
    Echarts
  },
  created() {
    let{ name, clusterId } = this.$route.query
    this.clusterId = clusterId
    this.name = name
  },
  methods: {
    //获取数据
    GetDat(data) {
      this.timestamp = data[0];
      this.startTime = new Date(data[1].StartTIme).getTime();
      this.endTime = new Date(data[1].EndTIme).getTime();
      this.getDataJob();
      this.getGpuDataJob();
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
   
    getDataJob(){
      this.loadShow = true;
      const param = {
        EndTime: this.endTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: "k8s_cluster",
        Offset: 0,
        Order: "asc",
        OrderBy: "timestamp",
        StartTime: this.startTime,
        Version: "2019-06-06",
      }
      param['Conditions.0'] = JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]);
      param['Fields.0'] = "max(k8s_cluster_node_total)";
      param["Fields.1"] = "max(k8s_cluster_pods_used_total)";
      param["Fields.2"] = "max(k8s_cluster_allocatable_pods_total)";
      param["Fields.3"] = "max(k8s_cluster_cpu_core_total)";
      param["Fields.4"] = "max(k8s_cluster_rate_cpu_core_used_cluster)";
      param["Fields.5"] = "max(k8s_cluster_rate_cpu_core_request_cluster)";
      param["Fields.6"] = "max(k8s_cluster_cpu_core_used)";
      param["Fields.7"] = "max(k8s_cluster_memory_total)";
      param["Fields.8"] = "max(k8s_cluster_rate_mem_usage_bytes_cluster)";
      param["Fields.9"] = "max(k8s_cluster_rate_mem_request_bytes_cluster)";
      param["Fields.10"] = "max(k8s_cluster_rate_mem_no_cache_bytes_cluster)";
      param["Fields.11"] = "max(k8s_cluster_mem_usage_bytes)";
      param["Fields.12"] = "max(k8s_cluster_mem_no_cache_bytes)";
      param["Fields.13"] = "max(k8s_cluster_network_receive_bytes_bw)";
      param["Fields.14"] = "max(k8s_cluster_network_transmit_bytes_bw)";
      param["GroupBys.0"] = `timestamp(${this.timestamp}s)`;
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
    getGpuDataJob(){
      this.loadShow = true;
      const param = {
        EndTime: this.endTime,
        Limit: 65535,
        Module: "/front/v1",
        NamespaceName: "k8s_cluster",
        Offset: 0,
        Order: "asc",
        OrderBy: "timestamp",
        StartTime: this.startTime,
        Version: "2019-06-06"
      }
      param['Conditions.0'] = JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]);
      param["GroupBys.0"] = `timestamp(${this.timestamp}s)`;
      param['Fields.0'] = 'max(k8s_cluster_gpu_total)';
      param["Fields.1"] = "max(k8s_cluster_rate_gpu_used_cluster)";
      param["Fields.2"] = "max(k8s_cluster_rate_gpu_request_cluster)";
      param["Fields.3"] = "max(k8s_cluster_rate_gpu_memory_used_cluster)";
      param["Fields.4"] = "max(k8s_cluster_rate_gpu_memory_request_cluster)";
      this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
        if(res.Response.Error === undefined) {
            console.log(res.Response.JobId)
            this.JobId = res.Response.JobId
            this.getGpuResult();
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
    getGpuResult() {
      this.loadShow = false;
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      }
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        if(res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data);
          let gpuTimes = [], gpus = [], gpuUseds = [], gpuRequests = [], gpuMems = [], gpuMemRequests = [];//时间
          if(data.length > 0) {
            for(let i = 0; i < data.length; i++) {
              let item = data[i];
              let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");//时间
              let gpu = item[1];
              let gpuUsed = item[2];
              let gpuRequest = item[3];
              let gpuMem = item[4];
              let gpuMemRequest = item[5];
              gpuTimes.push(time);
              gpus.push(gpu);
              gpuUseds.push(gpuUsed);
              gpuRequests.push(gpuRequest);
              gpuMems.push(gpuMem);
              gpuMemRequests.push(gpuMemRequest);
            }
            this.gpus = gpus;
            this.gpuUseds = gpuUseds;
            this.gpuRequests = gpuRequests;
            this.gpuMems = gpuMems;
            this.gpuMemRequests = gpuMemRequests;
          }
          this.gpuTimes = gpuTimes;
          this.seriesGpu = [
            {name: 'GPU 总配置',type: 'line', data: gpus}
          ];
          this.seriesGpuUesd = [
            {name: 'GPU利用率',type: 'line', data: gpuUseds},
            {name: 'GPU分配率(Request)',type: 'line', data: gpuRequests}
          ];
          this.seriesInternet = [
            {name: '显存利用率',type: 'line', data: gpuMems},
            {name: '显存分配率(Request)',type: 'line', data: gpuMemRequests}
          ];
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
    },
    getResult() {
      this.loadShow = false;
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      }
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        if(res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data);
          let times = [], clusters = [], pods = [], allocatablePods = [], cpus = [], cpuUseds = [],
            cpuRequests = [], cpuUsedmaxs = [], memorys= [], memusages = [], memrequests = [], menNocaches = [],
            memUsageBytes = [], memNoYsages = [], receives = [], transmits = [];
          if(data.length > 0) {
            for(let i = 0; i < data.length; i++) {
              let item = data[i];
              let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss");//时间
              let cluster = item[1];//节点数量
              let pod = item[2];//实例数量
              let allocatablePod = item[3];//allocatable实例数量
              let cpu = null;//cpu总配置
              if(item[4]) {
                cpu = item[4].toFixed(2);
              }
              let cpuUsed = null;//cpu使用率
              if(item[5]) {
                cpuUsed = item[5].toFixed(2)
              }
              let cpuRequest = null;//cpu分配率
              if(item[6]) {
                cpuRequest = item[6].toFixed(3);
              }
              let cpuUsedmax = null;//cpu使用量
              if(item[7]) {
                cpuUsedmax = item[7].toFixed(4);
              }
              let memory = null;//内存总量
              if(item[8]) {
                memory = (item[8]/(1024*1024)).toFixed(3);
              }
              let memusage = null;
              if(item[9]) {
                memusage = item[9].toFixed(3);
              }
              let memrequest = null;
              if(item[10]) {
                memrequest = item[10].toFixed(3);
              }
              let menNocache = null;
              if(item[11]) {
                menNocache = item[11].toFixed(3);
              }
              let memUsageByte = null;
              if(item[12]) {
                memUsageByte = (item[12]/(1024*1024*1024)).toFixed(3);
              }
              let memNoYsage = null;
              if(item[13]) {
                memNoYsage = (item[13]/(1024*1024*1024)).toFixed(3);
              }
              let receive = null;
              if(item[14]) {
                receive = (item[14]/(1024)).toFixed(3);
              }
              let transmit = null;
              if(item[15]) {
                transmit = (item[15]/(1024)).toFixed(3);
              }
              times.push(time);
              clusters.push(cluster);
              pods.push(pod);
              allocatablePods.push(allocatablePod);
              cpus.push(cpu);
              cpuUseds.push(cpuUsed);
              cpuRequests.push(cpuRequest);
              cpuUsedmaxs.push(cpuUsedmax);
              memorys.push(memory);
              memusages.push(memusage);
              memrequests.push(memrequest);
              menNocaches.push(menNocache);
              memUsageBytes.push(memUsageByte);
              memNoYsages.push(memNoYsage);
              receives.push(receive);
              transmits.push(transmit);
            }
            this.clusters = clusters;
            this.pods = pods;
            this.allocatablePods = allocatablePods;
            this.cpus = cpus;
            this.cpuUseds = cpuUseds;
            this.cpuRequests = cpuRequests;
            this.cpuUsedmaxs = cpuUsedmaxs;
            this.memorys = memorys;
            this.memusages = memusages;
            this.memrequests = memrequests;
            this.menNocaches = menNocaches;
            this.memUsageBytes = memUsageBytes;
            this.memNoYsages = memNoYsages;
            this.receives = receives;
            this.transmits = transmits;
          }
          this.times = times;
          this.series = [{name: '节点数量',type: 'line', data: clusters,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}];
          this.seriesPod = [{name: 'Allocatable Pod数量',type: 'line', data: allocatablePods,itemStyle: {
            normal: {
              color: "#44FF8F",//折线点的颜色
              lineStyle: {
              color: "#44FF8F"//折线的颜色
              }
            }  }},{name: 'Pod数量',type: 'line', data: pods,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}];
          this.seriesCpu = [{name: 'CPU总配置',type: 'line', data: cpus,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}];

          this.seriesCpuRate = [
            {name: 'CPU分配率(Request)',type: 'line', data: cpuRequests,itemStyle: {
            normal: {
              color: "#44FF8F",//折线点的颜色
              lineStyle: {
              color: "#44FF8F"//折线的颜色
              }
            }  }},
            {name: 'CPU利用率',type: 'line', data: cpuUseds,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}
          ];
          this.seriesCpuUsed = [{name: 'CPU使用量',type: 'line', data: cpuUsedmaxs,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}];
          this.seriesMemoy = [{name: '内存总配置',type: 'line', data: memorys,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }}];
          this.seriesMemoyRate = [
            {name: '内存分配率(Request)',type: 'line', data: memrequests,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }},
            {name: '内存利用率',type: 'line', data: memusages,itemStyle: {
            normal: {
              color: "#44FF8F",//折线点的颜色
              lineStyle: {
              color: "#44FF8F"//折线的颜色
              }
            }  }},
            {name: '内存利用率(不含cache)',type: 'line', data: menNocaches,itemStyle: {
            normal: {
              color: "#ED9257",//折线点的颜色
              lineStyle: {
              color: "#ED9257"//折线的颜色
              }
            }  }}
          ];
          this.seriesMemoyUsed = [
            {name: '内存使用率',type: 'line', data: memUsageBytes,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }},
            {name: '内存使用率(不含cache)',type: 'line', data: memNoYsages,itemStyle: {
            normal: {
              color: "#44FF8F",//折线点的颜色
              lineStyle: {
              color: "#44FF8F"//折线的颜色
              }
            }  }}
          ];
          this.seriesInternet = [
            {name: '网络入带宽',type: 'line', data: receives,itemStyle: {
            normal: {
              color: "#2072d9",//折线点的颜色
              lineStyle: {
              color: "#2072d9"//折线的颜色
              }
            }  }},
            {name: '网络出带宽',type: 'line', data: transmits,itemStyle: {
            normal: {
              color: "#44FF8F",//折线点的颜色
              lineStyle: {
              color: "#44FF8F"//折线的颜色
              }
            }  }}
          ];
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
      })
    },
    
  },
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
    height: auto;
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
      width: 100%;
      /* margin-right: 5%; */
      .el-tab-pane {
        height: auto;
        overflow-y: scroll;
      }
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
