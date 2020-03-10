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
            <TimeDropDown
              :TimeArr="TimeArr"
              :Datecontrol="true"
              :Graincontrol="false"
              v-on:switchData="GetDat"
              :Difference="'D'"
            ></TimeDropDown>
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
        <div class="box-bottom-right">
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='podNumbers' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='podStarts' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='cpuUseds' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='cpuUsedColonys' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='cpuRequests' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='cpuUsedmaxs' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='memorys' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='memusages' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='memrequests' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='menNocaches' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='memUsageBytes' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='memNoYsages' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='GpuUseds' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='GpuUsedSees' style="width:400px;height:200px;" />
          </div>
           <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='GpuUsedColoys' style="width:400px;height:200px;" />
          </div>
          <div class="box-top-left" style="margin-bottom:20px;">
            <EcharTKE :time='times' :series='GpuUsedSeeColoys' style="width:400px;height:200px;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import subTitle from "@/views/TKE/components/subTitle";
import {
  TKE_GETTKEDATAJOB,
  TKE_GETTKEDATARESULT,
  NODE_LIST,
  POINT_REQUEST,
  NODE_INFO
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import TimeDropDown from "@/components/public/TimeDropDown.vue";
import moment from "moment";
import EcharTKE from "@/components/public/EcharTKE";
// const cityOptions = ["asdasd", "3dsda", "asdaqwe"];
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
          name: "实时",
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
              label: "24小时"
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
      timestamp: "" //粒度长度
    };
  },
  watch: {},
  created() {
    this.title = this.$route.query.title;
    this.type = this.$route.query.type;
    this.clusterId = this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
  },
  methods: {
    GetDat(val) {
      this.StartTime = new Date(val[1].StartTIme).getTime();
      this.EndTime = new Date(val[1].EndTIme).getTime();
      this.timestamp = val[0];
      this.getDeploymentList();
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
    // 获取列表
    async getDeploymentList() {
      this.loadShow = true;
      let params = {};
      params = {
        Method: "GET",
        Path:
          "/apis/apps/v1beta2/namespaces/" +
          this.spaceName +
          "/deployments?limit=100",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      };
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log(response);
          if (response.items.length > 0) {
            response.items.map(deployment => {
              (deployment.k8sApp =
                deployment.metadata.labels && deployment.metadata.labels.k8s),
                (deployment.qcloudApp =
                  deployment.metadata.labels &&
                  deployment.metadata.labels.qcloud);
            });
          }
          let ids = [];
          if (response.items.length > 0) {
            response.items.map(obj => {
              ids.push(obj.metadata.name);
            });
          }
          console.log(ids);
          this.checkedInstances = ids;
          this.instances = ids;
          this.InstancesAll = ids;
          this.list = ids;
          this.getDataJob();
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
      param["Conditions.3"] = JSON.stringify([
        "workload_name",
        "in",
        this.list
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
      const param = {
        JobId: this.JobId,
        Module: "/front/v1",
        Version: "2019-06-06"
      };
      this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        if (res.Response.Error === undefined) {
          let data = JSON.parse(res.Response.Data);
          console.log(data);
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
            //   let key = item[0];
            //   let value = monitor[key];
            //   if (value) {
            //     value.push(data[i]);
            //   } else {
            //     value = [];
            //     value.push(data[i]);
            //   }
            //   monitor[key] = value;
              let time = moment(item[0]).format("YYYY-MM-DD HH:mm:ss"); //时间
              let podId = item[1]; //节点ID
              let podNumber = item[2]; //Pod数量
              let podStart = item[3]; //Pod重启次数
              let cpuUsed = item[4]; //CPU使用量
              let cpuUsedColony = item[5]; //CPU利用率(占集群)
              let cpuRequest = item[6]; //内存使用量
              let cpuUsedmax = item[7]; //内存利用率(占集群)
              let memory = item[8]; //网络入带宽
              let memusage = item[9];//网络出带宽
              let memrequest = item[10];//网络入流量
              let menNocache = item[11];//网络出流量
              let memUsageByte = item[12];//网络入包量
              let memNoYsage = item[13];//网络出包量
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
            this.podNumbers = [{name: '节点数量',type: 'line', data: podNumbers}];
            this.podStarts = [{name: '节点数量',type: 'line', data: podStarts}];
            this.cpuUseds = [{name: '节点数量',type: 'line', data: cpuUseds}];
            this.cpuUsedColonys = [{name: '节点数量',type: 'line', data: cpuUsedColonys}];
            this.cpuRequests = [{name: '节点数量',type: 'line', data: cpuRequests}];
            this.cpuUsedmaxs = [{name: '节点数量',type: 'line', data: cpuUsedmaxs}];
            this.memorys = [{name: '节点数量',type: 'line', data: memorys}];
            this.memusages = [{name: '节点数量',type: 'line', data: memusages}];
            this.memrequests = [{name: '节点数量',type: 'line', data: memrequests}];
            this.menNocaches = [{name: '节点数量',type: 'line', data: menNocaches}];
            this.memUsageBytes = [{name: '节点数量',type: 'line', data: memUsageBytes}];
            this.memNoYsages = [{name: '节点数量',type: 'line', data: memNoYsages}];
            this.GpuUseds = [{name: '节点数量',type: 'line', data: GpuUseds}];
            this.GpuUsedSees = [{name: '节点数量',type: 'line', data: GpuUsedSees}];
            this.GpuUsedColoys = [{name: '节点数量',type: 'line', data: GpuUsedColoys}];
            this.GpuUsedSeeColoys = [{name: '节点数量',type: 'line', data: GpuUsedSeeColoys}];
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
      width: 85%;
      margin-right: 5%;
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
