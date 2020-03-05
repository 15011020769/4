 <!-- ConfigMap-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary" @click='goUpdateYaml'>编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
        <codemirror
        style="background-color: #444;"
        ref="myCm"
        v-model="yamlInfo"
        :options="cmOptions"
        class="code"
      ></codemirror>
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
require("codemirror/mode/python/python.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/markdown-fold.js");
require("codemirror/addon/fold/comment-fold.js");
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY ,TKE_COLONY_QUERY} from "@/constants";
export default {
  name: "configmapDetailYaml",
  data() {
    return {
      name:'',
      np:'',
      cmOptions: {
        tabSize: 4,//字符的宽度，默认为4 。
        mode: "python",
        theme: "darcula",
        lineNumbers: true, //行号
        line: true,
        lineNumbers: true,
        foldgutter: true,
        indentUnit: 2,//首行缩进
        smartIndent: false,//缩进继承
        lineWrapping: scroll,//超出滚动
        // readOnly: nocursor,//只读
        showCursorWhenSelecting:true,//是否显示光标
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        lineWrapping: true, //代码折叠
        foldGutter: true,
        matchBrackets: true, //括号匹配
        autoCloseBrackets: true
      },
      yamlInfo:'',
    };
  },
  components: {
       codemirror
  },
  created() {
     // 从路由获取类型
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    if (this.$route.query.name && this.$route.query.np) {
      this.name = this.$route.query.name;
      this.np = this.$route.query.np;
    }
    this.findYamlData();

  },
  methods: {
   goUpdateYaml() {
      this.$router.push({
        name: "updateYaml",
        query: {
          clusterId: this.clusterId,
          name: this.name,
          np: this.np
        }
      });
    },
    findYamlData(){
          var params={
            Accept: "application/yaml",
            ClusterName: this.clusterId,
            Method: "GET",
            Path: "/api/v1/namespaces/"+this.np+"/configmaps/"+this.name,
            Version: "2018-05-25",
          }
          this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
             if (res.Response.Error == undefined){
              var response = res.Response.ResponseBody;
               this.yamlInfo = res.Response.ResponseBody; 
             }else{
               let ErrTips = {};
               let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
               this.$message({
                 message: ErrOr[res.Response.Error.Code],
                 type: "error",
                 showClose: true,
                 duration: 0
               });
             }
          })

     }
  }
};
</script>

<style lang="scss" scoped>
.code{
  ::v-deep   .el-textarea__inner{
      width:100%;
      height: 268px !important;
      background: black;
      color: white;
    }
}
.tke-card >>>div.CodeMirror-scroll{
  background: #272822;
  color:#fff;
}

</style>

