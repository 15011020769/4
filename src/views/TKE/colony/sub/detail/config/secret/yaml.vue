 <!-- Secret-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" type="primary" @click="goSecretDetail">编辑YAML</el-button>
      </div>
    </div>

    <div class="tke-card mt10 tke-formpanel-wrap cls">
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
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import { ALL_CITY , POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "secretDetailYaml",
  data() {
    return {
      loadShow: false, //加载是否显示
      yamlInfo: "",
      clusterId: "",
      np: "",
      name: "",
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
      }
    };
  },
  components: {
     Loading,
    codemirror
  },
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    this.np = this.$route.query.np;
    this.name = this.$route.query.name;
    this.getYamlInfo();
  },
  methods: {
    async getYamlInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/" + this.np + "/secrets/" + this.name,
        Version: "2018-05-25",
        Accept: "application/yaml",
        ClusterName: this.clusterId
      };

      await this.axios.post(POINT_REQUEST, param).then(res => {
        
        if (res.Response.Error === undefined) {
          var response = res.Response.ResponseBody;
          this.yamlInfo = res.Response.ResponseBody;
          this.loadShow = false;
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
     // 详情
    goSecretDetail() {
       this.$router.push({
        name: "updateYamlSecret",
        query: {
          clusterId: this.clusterId,
          name: this.name,
          np: this.np
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tke-card >>>div.CodeMirror-scroll{
  background: #272822;
  color:#fff;
}
</style>

