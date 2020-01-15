 <!-- Service-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">sdsd</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">default</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">2020-01-02 14:02:26</div>
        </el-form-item>
        <el-form-item label="Selector">
          <div class="tke-form-item_text">k8s-app：asdasd、qcloud-app：asdasd</div>
        </el-form-item>
        <el-form-item label="访问方式">
          <div class="tke-form-item_text">LoadBalancer</div>
        </el-form-item>
        <el-form-item label="集群IP">
          <div class="tke-form-item_text">172.16.253.125</div>
        </el-form-item>
        <el-form-item label="负载均衡IP">
          <div class="tke-form-item_text">175.97.144.48</div>
        </el-form-item>
        <el-form-item label="端口映射">
          <div style="max-width:800px">
            <el-table
              :data="list"
             
              style="width: 100%">
              <el-table-column
                prop="protocol"
                label="协议"
                >
              </el-table-column>
              <el-table-column
                prop="containerPort"
                label="容器端口"
                >
              </el-table-column>
              <el-table-column
                prop="hostPort"
                label="主机端口"
                >
              </el-table-column>
              <el-table-column
                prop="servicePort"
                label="服务端口"
                >
              </el-table-column>
              
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">高级设置</h4>
      <el-form  class="tke-form" label-position='left' label-width="130px" size="mini">
        <el-form-item label="ExternalTrafficPolicy">
          <div class="tke-form-item_text">Cluster</div>
        </el-form-item>
        <el-form-item label="Session Affinity">
          <div class="tke-form-item_text">None</div>
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
  name: "svcDetailInfo",
  data() {
    return {
      list:[
        {
          protocol:'TCP',
          containerPort:'333',
          hostPort:'32436',
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

