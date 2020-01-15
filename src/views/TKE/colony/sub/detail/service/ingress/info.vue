 <!-- Ingress-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">cbs</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">default</div>
        </el-form-item>
        <el-form-item label="VIP">
          <div class="tke-form-item_text">175.97.144.235</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">ssssssssssss</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">2020-01-02 14:02:26</div>
        </el-form-item>
        <el-form-item label="网络类型">
          <div class="tke-form-item_text">公网</div>
        </el-form-item>
        <el-form-item label="annotations">
          <div class="tke-form-item_text">
            description: ssss <br>
            kubernetes.io/ingress.class: qcloud<br>
            kubernetes.io/ingress.http-rules: [{"path":"/acc","backend":{"serviceName":"asdasd","servicePort":"333"}}]<br>
            kubernetes.io/ingress.https-rules: null<br>
            kubernetes.io/ingress.qcloud-loadbalance-id: lb-k6f8vpaw<br>
            kubernetes.io/ingress.rule-mix: false
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">转发配置</h4>
      <el-table
        :data="list"
        
        style="width: 100%">
        <el-table-column
          prop="protocol"
          label="协议"
          >
        </el-table-column>
        <el-table-column
          prop="monitorPort"
          label="监听端口"
          >
        </el-table-column>
        <el-table-column
          prop="domainName"
          label="域名"
          >
        </el-table-column>
        <el-table-column
          prop="url"
          label="URL路径"
          >
        </el-table-column>
        <el-table-column
          prop="backend"
          label="后端服务"
          >
        </el-table-column>
        <el-table-column
          prop="servicePort"
          label="服务端口"
          >
        </el-table-column>
        
      </el-table>
    </div>
   </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "ingressDetailInfo",
  data() {
    return {
      list:[
        {
          protocol:'http',
          monitorPort:'80',
          domainName:'175.97.144.235',
          url:'/acc',
          backend:'asdasd',
          servicePort:'333',
        },
        
      ], //列表 
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>




</style>

