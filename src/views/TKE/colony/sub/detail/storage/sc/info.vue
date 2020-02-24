 <!-- StorageClass-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{this.$route.query.resourceIns}}</div>
        </el-form-item>
        <el-form-item label="云盘类型">
          <div class="tke-form-item_text">{{list.parameters.type|parameterss}}</div>
        </el-form-item>
        <el-form-item label="来源">
          <div class="tke-form-item_text">{{list.provisioner}}</div>
        </el-form-item>
        <el-form-item label="回收策略">
          <div class="tke-form-item_text">{{list.reclaimPolicy}}</div>
        </el-form-item>
        <el-form-item label="Default Class">
          <div class="tke-form-item_text">{{list.metadata.annotations|annotationses}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{list.metadata.creationTimestamp|creationTimestamps}}</div>
        </el-form-item>
      </el-form>
    </div>
   </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,POINT_REQUEST } from "@/constants";
export default {
  name: "scDetailInfo",
  data() {
    return {
      list:''
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   this.GetList()
  },
  methods: {
   // 获取列表
    GetList() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/apis/storage.k8s.io/v1/storageclasses/"+this.$route.query.resourceIns,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
         console.log(mes);
          this.list = mes;
          console.log(this.list)
          // this.loadShow = false
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    
  },
  filters:{
    parameterss:function(value){
        if(value == "CLOUD_PREMIUM"){
          return "高性能云硬盘"
        } else if(value == "CLOUD_SSD"){
          return "SSD云硬盘"
        } else {
          return "普通云硬盘"
        }
    },
    annotationses:function(value){
      // console.log(typeof(value))
        if(typeof(value) == "object"){
          return "true"
        }
        else {
          return "false"
        }
    },
    creationTimestamps:function(value){
              var d = new Date(value);
              var n = d.getFullYear();
              var y = d.getMonth() + 1;
              var r = d.getDate();
              var h = d.getHours(); //12
              var m = d.getMinutes(); //12
              var s = d.getSeconds();
              h < 10 ? h = "0" + h : h;
              m < 10 ? m = "0" + m : m
              return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      }
    }
};
</script>

<style lang="scss" scoped>




</style>

