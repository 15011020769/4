 <!-- 节点-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid"></div>

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
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "nodeDetailYaml",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: "",
      node: "",
      yamlInfo: null,
      cmOptions: {
        tabSize: 4,
        mode: "python",
        theme: "darcula",
        lineNumbers: true, //行号
        line: true,
        lineNumbers: true,
        foldgutter: true,
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
    this.node = this.$route.query.node;
    this.getYamlInfo();
  },
  methods: {
    async getYamlInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/nodes/" + this.node,
        Version: "2018-05-25",
        Accept: "application/yaml",
        ClusterName: this.clusterId
      };

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          // let response = JSON.parse(res.Response.ResponseBody);
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

