 <!-- 节点-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary">编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
        {{yamlInfo}}
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "nodeDetailYaml",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: '',
      node: '',
      yamlInfo: null
    };
  },
  components: {
    Loading
  },
  created() {
     // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    this.node = this.$route.query.node;
    this.getYamlInfo();
  },
  methods: {
    async getYamlInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/nodes/"+this.node,
        Version: "2018-05-25",
        Accept: "application/yaml",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        debugger
        if(res.Response.Error === undefined) {
          // let response = JSON.parse(res.Response.ResponseBody);
          this.yamlInfo = res.Response.ResponseBody;
          this.loadShow = false;
          console.log(this.yamlInfo,"response");
        } else {
          this.loadShow = false;
          let ErrTips = {
            
          };
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

<style lang="scss" scoped>


</style>

