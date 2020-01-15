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

