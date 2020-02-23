 <!-- PersistentVolume-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary">编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
        {{yaml}}
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,POINT_REQUEST } from "@/constants";
export default {
  name: "pvDetailYaml",
  data() {
    return {
      list:'',
      yaml:''
    };
  },
  components: {
   
  },
  created() {
    this.GetPersistentVolume()
  },
  methods: {
     // 获取pv列表
   GetPersistentVolume(){
      const param = {
            Accept: "application/yaml",
            ClusterName: "cls-l74ol4g0",
            Method: "GET",
            Path: "/api/v1/persistentvolumes/wwe333",
            Version: "2018-05-25"}  
      this.axios.post(POINT_REQUEST, param).then(res => {
          if (res.Response.Error == undefined) {
            // let yaml = require("js-yaml");
            // let result = yaml.load(res.Response.ResponseBody);
            // console.log(result.reg.test("test"));
            // console.log(yaml)
            console.log(res.Response.ResponseBody)
            this.yaml = res.Response.ResponseBody
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.code],
              type: "error",
              showClose: true,
              duration: 0
            })
          }
        })
    },
  }
};
</script>

<style lang="scss" scoped>


</style>

