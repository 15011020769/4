 <!-- PersistentVolume-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button  size="small" type="primary" @click="editYaml()">编辑YAML</el-button>
      </div>
    </div>
    
    <div class="tke-card mt10 tke-formpanel-wrap">
        <codemirror
        style="background-color: #444;"
        ref="myCm"
        v-model="yaml"
        :options="cmOptions"
        class="code"
      ></codemirror>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { codemirror } from "vue-codemirror";
import Loading from "@/components/public/Loading";
require("codemirror/mode/python/python.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/markdown-fold.js");
require("codemirror/addon/fold/comment-fold.js");
export default {
  name: "pvDetailYaml",
  data() {
    return {
      list:'',
      yaml:'',
      cmOptions: {
        tabSize: 4,
        mode: 'python', // 默认脚本编码
        theme: 'darcula',
        lineNumbers: true, // 是否显示行号
        line: true,
        // lineNumbers: true,
        foldgutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        lineWrapping: true, // 是否强制换行
        foldGutter: true,
        matchBrackets: true, // 括号匹配
        autoCloseBrackets: true,
        readOnly: true// 只读
      }
    };
  },
  components: {
   codemirror,
   Loading
  },
  created() {
    this.GetPersistentVolume()
  },
  methods: {
     // 获取pv列表
   GetPersistentVolume(){
      const param = {
            Accept: "application/yaml",
            ClusterName: this.$route.query.clusterId,
            Method: "GET",
            Path: "/apis/storage.k8s.io/v1/storageclasses/"+this.$route.query.resourceIns,
            Version: "2018-05-25"}  
            // np=aasd&resourceIns=saad2
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
    editYaml(){
      this.$router.push({
          name: "scUpdate",
          query: {
            clusterId: this.$route.query.clusterId,
            resourceIns:this.$route.query.resourceIns
          }
      });
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

