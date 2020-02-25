 <!-- PersistentVolumeClaim-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{this.$route.query.resourceIns}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{list.metadata.namespace}}</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
         <el-form-item label="状态">
          <div class="tke-form-item_text"><span class="text-green">{{list.status.phase}}</span></div>
        </el-form-item>
        <el-form-item label="访问权限">
          <div class="tke-form-item_text">{{list.spec.accessModes[0]}}</div>
        </el-form-item>
        <el-form-item label="Storage">
          <div class="tke-form-item_text">{{list.spec.resources.requests.storage}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{list.metadata.creationTimestamp|creationTimestamps}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY ,POINT_REQUEST} from "@/constants";
export default {
  name: "pvcDetailInfo",
  data() {
    return {
      list:""
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
        Path: "/api/v1/namespaces/"+this.$route.query.np+"/persistentvolumeclaims/"+this.$route.query.resourceIns,
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

