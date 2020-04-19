 <!-- 自动伸缩-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{name}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{np}}</div>
        </el-form-item>
        <el-form-item label="关联deployment">
          <div class="tke-form-item_text">{{Info.dp}}</div>
        </el-form-item>
        <el-form-item label="HPA指标">
          <div class="tke-form-item_text">
            <p v-for="(v,i) in Info.hpa" :key="i">{{v|dataShow(v)}}</p>
            </div>
        </el-form-item>
        <el-form-item label="最小副本数">
          <div class="tke-form-item_text">{{Info.min}}</div>
        </el-form-item>
        <el-form-item label="最大副本数">
          <div class="tke-form-item_text">{{Info.max}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "hpaDetailInfo",
  data() {
    return {
      clusterId:'',
      name:'',
      np:'', 
      Info:{
        dp:'',
        hpa:[],
        min:'',
        max:'',
      },
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
      this.clusterId=this.$route.query.clusterId;
      this.name=this.$route.query.name;
      this.np=this.$route.query.np;

      if(this.name&&this.np){
        this.findData()
      }
   
  },
  methods: {

   findData(){
      var params={
          ClusterName: this.clusterId,
          Method: "GET",
           Path: "/apis/autoscaling/v2beta1/namespaces/"+this.np+"/horizontalpodautoscalers?fieldSelector=metadata.name="+this.name,
          Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
               if(data.items){
                 this.Info.dp=data.items[0].spec.scaleTargetRef.name
                 this.Info.hpa=data.items[0].spec.metrics;
                 this.Info.min=data.items[0].spec.minReplicas
                 this.Info.max=data.items[0].spec.maxReplicas
               }
        }
      })

    },
  },
    filters:{
    dataShow(val){

      if(val.resource){
         if(val.resource.name=='cpu'){
             return "CPU利用率（占Request）"+val.resource.targetAverageUtilization+'%'
        }
      }
      if(val.pods){
       //cpu
        if(val.pods['metricName']=='k8s_pod_cpu_core_used'){
          return "CPU使用量"+val.pods.targetAverageValue+'核'
        }
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_node'){
          return "CPU利用率（占节点）"+val.pods.targetAverageValue+'%'
        }
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_request'){
          return "CPU利用率（占Request）"+val.pods.targetAverageValue+'%'
        }
       
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_limit'){
          return "CPU利用率（占Limit）"+val.pods.targetAverageValue+'%'
        }
        //内存
         if(val.pods['metricName']=='k8s_pod_mem_usage_bytes'){
          return "内存使用量"+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_mem_no_cache_bytes'){
          return "内存使用量（不包含 Cache）"+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_node'){
          return "内存利用率（占节点）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_node'){
          return "内存利用率（占节点，不包含 Cache）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_request'){
          return "内存利用率（占Request）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_request'){
          return "内存利用率（占 Request，不包含Cache）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_limit'){
          return "内存利用率（占 Limit）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_limit'){
          return "内存利用率（占 Limit，不包含 Cache）"+val.pods.targetAverageValue+'%'
          }
         //硬盘 
         if(val.pods['metricName']=='k8s_pod_fs_write_bytes'){
          return "硬盘写流量"+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_read_bytes'){
          return "硬盘读流量"+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_read_times'){
          return "硬盘读 IOPS "+val.pods.targetAverageValue+'次/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_write_times'){
          return "硬盘写 IOPS "+val.pods.targetAverageValue+'次/s'
          }
        //网络  
         if(val.pods['metricName']=='k8s_pod_network_receive_bytes_bw'){
          return "网络入带宽 "+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_bytes_bw'){
          return "网络出带宽 "+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_network_receive_bytes'){
          return "网络入流量 "+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_bytes'){
          return "网络出流量 "+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_network_receive_packets'){
          return "网络入包量 "+val.pods.targetAverageValue+'个'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_packets'){
          return "网络出包量 "+val.pods.targetAverageValue+'个'
          }
      }
    }
  },
};
</script>

<style lang="scss" scoped>




</style>

