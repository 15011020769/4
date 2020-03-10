 <!-- 自动伸缩-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary" @click="goUpdateYaml">编辑YAML</el-button>
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
import { TKE_COLONY_QUERY} from "@/constants";
export default {
  name: "hpaDetailYaml",
  data() {
    return {
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
      clusterId:'',
      name:'',
      np:'',
    };
  },
  components: {
       codemirror
  },
  created() {
      // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    if (this.$route.query.name && this.$route.query.np) {
      this.name = this.$route.query.name;
      this.np = this.$route.query.np;
    }
    this.findYamlData()
   
  },
  methods: {
     //编辑yaml
    goUpdateYaml(){
       this.$router.push({
          name: "updateHpaYaml",
          query: {
            clusterId: this.clusterId,
            name:this.name,
            np:this.np,
          }
      });

    },

      findYamlData(){
        var params={
          Accept: "application/yaml",
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/apis/autoscaling/v2beta1/namespaces/"+this.np+"/horizontalpodautoscalers/"+this.name,
          Version: "2018-05-25",
        }
        this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
          console.log(res)
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

</style>

