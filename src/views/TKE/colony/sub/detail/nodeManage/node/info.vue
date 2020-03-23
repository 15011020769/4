 <!-- 节点-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">主机信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="节点ID">
          <div class="tke-form-item_text"><span class="tke-text-link">{{detail.InstanceId}}</span></div>
        </el-form-item>
        <el-form-item label="状态">
          <div class="tke-form-item_text"><span class="text-green"></span>{{detail.status}}</div>
        </el-form-item>
        <el-form-item label="地域">
          <div class="tke-form-item_text">港澳台地区(台灣台北)</div>
        </el-form-item>
        <el-form-item label="可用区">
          <div class="tke-form-item_text">台北一区</div>
        </el-form-item>
        <el-form-item label="配置">
          <div class="tke-form-item_text">
            <span class="text-gray">CPU:</span> {{detail.CPU}} 核，
            <span class="text-gray">内存:</span> {{detail.Memory}} GB，
            <span class="text-gray">带宽:</span> 1 Mbps，
            <span class="text-gray">系统盘:</span> {{detail.SystemDisk.DiskSize}} GB(高性能云硬盘)</div>
        </el-form-item>
        <el-form-item label="IP地址">
          <div class="tke-form-item_text">
            <p>{{detail.PrivateIpAddresses[0]}} (外网)</p>
            <p>{{detail.PublicIpAddresses[0]}} (内网)</p>
          </div>
        </el-form-item>
        <el-form-item label="操作系统">
          <div class="tke-form-item_text">{{detail.OsName}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{detail.addTime}}</div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">Kubernetes信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="150px" size="mini">
        <el-form-item label="Kubernetes Labels">
          <div class="tke-form-item_text">
            beta.kubernetes.io/arch：amd64 <br>
            beta.kubernetes.io/instance-type：QCLOUD<br>
            beta.kubernetes.io/os：linux<br>
            cloud.tencent.com/auto-scaling-group-id：asg-p3mt06kq<br>
            cloud.tencent.com/node-instance-id：ins-5ic5rvb2<br>
            failure-domain.beta.kubernetes.io/region：tpe<br>
            failure-domain.beta.kubernetes.io/zone：390001<br>
            kubernetes.io/hostname：10.0.128.8
          </div>
        </el-form-item>
        <el-form-item label="Kubernetes Annotations">
          <div class="tke-form-item_text">
            node.alpha.kubernetes.io/ttl：0 <br>
            volumes.kubernetes.io/controller-managed-attach-detach：true
          </div>
        </el-form-item>
        <el-form-item label="已分配资源">
          <div class="tke-form-item_text">
            <span class="text-gray">CPU:</span> 0.81 核，
            <span class="text-gray">内存:</span> 0.55 GB
          </div>
        </el-form-item>
        <el-form-item label="总可分配资源">
          <div class="tke-form-item_text">
            <span class="text-gray">CPU:</span> 0.94 核，
            <span class="text-gray">内存:</span> 0.59 GB
          </div>
        </el-form-item>
        <el-form-item label="容器运行时版本">
          <div class="tke-form-item_text">docker://18.6.3</div>
        </el-form-item>
        <el-form-item label="Kubelet版本">
          <div class="tke-form-item_text">v1.10.5-tke.6</div>
        </el-form-item>
        <el-form-item label="KubeProxy版本">
          <div class="tke-form-item_text">v1.10.5-tke.6</div>
        </el-form-item>
      </el-form>
    </div>
   </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "nodeDetailInfo",
  data() {
    return {
      detail: {}
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
    this.detail = this.$route.query.detail;
    console.log("detail",this.detail);
  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>




</style>

