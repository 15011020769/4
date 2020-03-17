 <!-- 命名空间-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary" @click="goUpdateYAML()">{{$t('TKE.overview.bj')}}YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
      <codemirror style="background-color: #444;"  ref="myCm"  v-model="yamlInfo"  :options="cmOptions" class="code" ></codemirror>
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
    },
    //跳转编辑Yaml
    goUpdateYAML() {
      this.$router.push({
        name: "updateNameSpace",
        query: {
          clusterId: this.clusterId,
          name: this.name
        }
      });
    }
  },
   
};
</script>

<style lang="scss" scoped>
  .code{
    text-align: left;
    background-color: #444;
  }

</style>

