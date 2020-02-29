 <!-- deployment-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary">编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
      <el-card class='box-card'> 
        <div class='box-black'>{{yamlData}}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "deploymentDetailYaml",
  data() {
    return {
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      loadShow: false,//是否显示加载
      yamlData: ''//数据
    };
  },
  components: {
   
  },
  created() {
    // 从路由获取类型
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.getYamlData();
  },
  methods: {
    async getYamlData() {
      this.loadShow = true;
      let params = {
          Method: "GET",
          Path: "/apis/apps/v1beta2/namespaces/"+this.rowData.metadata.namespace+"/statefulsets/"+this.rowData.metadata.name,
          Version: "2018-05-25",
          Accept: "application/yaml",
          ClusterName: this.clusterId,
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.yamlData = res.Response.ResponseBody;
        } else {
          this.loadShow = false;
          let ErrTips = {};
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
  .box-card {
    width: 100%;
    margin:20px 0;
  }
	.box-black{
    margin:10px;
    background:black;
  }
</style>

