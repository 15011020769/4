 <!-- deployment-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary"  @click="goUpdateYAML()" :disabled="rowData.metadata.namespace === 'kube-system'?true:false">编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
      <el-card class='box-card'> 
        <div class='box-black'>
          <codemirror style="background-color: #444;"  ref="myCm"  v-model="yamlData"  :options="cmOptions" class="code" ></codemirror>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
  require("codemirror/mode/python/python.js")
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/xml-fold.js')
  require('codemirror/addon/fold/indent-fold.js')
  require('codemirror/addon/fold/markdown-fold.js')
  require('codemirror/addon/fold/comment-fold.js')
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "deploymentDetailYaml",
  data() {
    return {
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      loadShow: false,//是否显示加载
      yamlData: '',//数据
      cmOptions: {
        tabSize: 4,
        mode: 'python',
        theme: 'darcula',
        lineNumbers: true,//行号
        line: true,
        lineNumbers: true,
        foldgutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
        lineWrapping: true, //代码折叠
        foldGutter: true,
        matchBrackets: true,  //括号匹配
        autoCloseBrackets: true
      }
    };
  },
  components: {
    codemirror
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
          Path: "/apis/batch/v1beta1/namespaces/"+this.rowData.metadata.namespace+"/cronjobs/"+this.rowData.metadata.name,
          Version: "2018-05-25",
          Accept: "application/yaml",
          ClusterName: this.clusterId
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
    },
    //跳转编辑Yaml
    goUpdateYAML() {
      this.$router.push({
        name: "updateCronJob",
        query: {
          clusterId: this.clusterId,
          spaceName: this.rowData.metadata.namespace,
          rowData: this.rowData
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

