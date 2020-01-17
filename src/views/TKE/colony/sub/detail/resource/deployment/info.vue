 <!-- deployment-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text"><span class="tke-text-link">kube-dns</span></div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">kube-system</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">2020-01-10 14:15:05</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">addonmanager.kubernetes.io/mode：Reconcile、k8s-app：kube-dns、kubernetes.io/cluster-service：true</div>
        </el-form-item>
        <el-form-item label="Selector">
          <div class="tke-form-item_text">k8s-app：kube-dns</div>
        </el-form-item>
        <el-form-item label="更新策略">
          <div class="tke-form-item_text">RollingUpdate</div>
        </el-form-item>
        <el-form-item label="副本数">
          <div class="tke-form-item_text">2</div>
        </el-form-item>
        <el-form-item label="运行副本数">
          <div class="tke-form-item_text">1</div>
        </el-form-item>
        
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">数据卷（Volumes）</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="configMap">
          <div class="tke-form-item_text">kube-dns-config（卷名称） kube-dns（资源名称）</div>
        </el-form-item>
        <el-form-item label="configMap">
          <div class="tke-form-item_text">clientconfig（卷名称） clientconfig（资源名称）</div>
        </el-form-item>
        <el-form-item label="hostPath">
          <div class="tke-form-item_text">tz-config（卷名称） /etc/localtime（主机路径）不校验（路径检查类型）</div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">容器（Containers）</h4>
      <hr style="margin-left:-20px; margin-right:-20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="kubedns" name="first">
          <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
            <el-form-item label="容器名称">
              <div class="tke-form-item_text">kubedns</div>
            </el-form-item>
            <el-form-item label="镜像">
              <div class="tke-form-item_text">tpeccr.ccs.tencentyun.com/library/kubedns-amd64:1.14.4</div>
            </el-form-item>
            <el-form-item label="CPU Requested">
              <div class="tke-form-item_text">100m</div>
            </el-form-item>
            <el-form-item label="内存 Requested">
              <div class="tke-form-item_text">30M</div>
            </el-form-item>
            <el-form-item label="运行参数">
              <div class="tke-form-item_text">
                --domain=cluster.local. <br>
                --dns-port=10053<br>
                --config-dir=/kube-dns-config<br>
                --v=2
              </div>
            </el-form-item>
            <el-form-item label="环境变量">
              <div class="tke-form-item_text">PROMETHEUS_PORT=10055</div>
            </el-form-item>
            <el-form-item label="挂载点">
              <div class="tke-form-item_text">
                <span class="text-gray">数据卷名称:</span> kube-dns-config 
                <span class="text-gray">目标路径:</span> /kube-dns-config 
                <span class="text-gray">挂载子路径:</span> 未设置，默认全覆盖目标路径
              </div>
            </el-form-item>
            <el-form-item label="存活检查">
              <div class="tke-form-item_text">Detail</div>
            </el-form-item>
            <el-form-item label="就绪检查">
              <div class="tke-form-item_text">Detail</div>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="dnsmasq" name="second">dnsmasq</el-tab-pane>
        <el-tab-pane label="sidecar" name="third">sidecar</el-tab-pane>
      </el-tabs>
      <!-- <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="configMap">
          <div class="tke-form-item_text">kube-dns-config（卷名称） kube-dns（资源名称）</div>
        </el-form-item>
      </el-form> -->
    </div>
   </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "deploymentDetailInfo",
  data() {
    return {
       activeName: 'first'
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>




</style>

