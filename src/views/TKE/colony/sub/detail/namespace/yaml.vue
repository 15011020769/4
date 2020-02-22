 <!-- 命名空间-yaml -->
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
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "namespaceDetailYaml",
  data() {
    return {
      loadShow: false,//是否显示加载
      yamlInfo: null,//yaml数据
      clusterId:'',//集群id
      name: '',//命名空间名称
    };
  },
  components: {
    
  },
  created() {
     // 从路由获取类型
    this.clusterId=this.$route.query.clusterId;
    this.name = this.$route.query.name;
    this.getYamlInfo();
  },
  methods: {
    async getYamlInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.name,
        Version: "2018-05-25",
        Accept: "application/yaml",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.yamlInfo = res.Response.ResponseBody;
          this.loadShow = false;
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

