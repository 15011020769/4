 <!-- 新建ConfigMap -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新Secret</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <codemirror
          style="background-color: #444;"
          ref="myCm"
          v-model="yamlInfo"
          :options="cmOptions"
          class="code"
        ></codemirror>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="btnOk">完成</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
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
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "configmapCreate",
  components: { codemirror },
  data() {
    return {
      clusterId: "",
      name: "",
      np: "",
      cmOptions: {
        tabSize: 4, //字符的宽度，默认为4 。
        mode: "python",
        theme: "darcula",
        lineNumbers: true, //行号
        line: true,
        lineNumbers: true,
        foldgutter: true,
        indentUnit: 2, //首行缩进
        smartIndent: false, //缩进继承
        lineWrapping: scroll, //超出滚动
        // readOnly: nocursor,//只读
        showCursorWhenSelecting: true, //是否显示光标
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
      yamlInfo: ""
    };
  },
  watch: {},
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    this.name = this.$route.query.name;
    this.np = this.$route.query.np;
    this.findYamlData();
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    btnOk() {
      var params = {
        Accept: "application/json",
        ClusterName: this.clusterId,
        ContentType: "application/yaml",
        Method: "PUT",
        Path: "/api/v1/namespaces/" + this.np + "/secrets/" + this.name,
        RequestBody: this.yamlInfo,
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error == undefined) {
          this.$router.push({
            name: "secretDetail",
            query: { clusterId: this.clusterId, name: this.name, np: this.np }
          });
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    findYamlData() {
      var params = {
        Accept: "application/yaml",
        ClusterName: this.clusterId,
        Method: "GET",
        Path: "/api/v1/namespaces/" + this.np + "/secrets/" + this.name,
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error == undefined) {
          var response = res.Response.ResponseBody;
          this.yamlInfo = res.Response.ResponseBody;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
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
.code {
  ::v-deep .el-textarea__inner {
    width: 100%;
    height: 268px !important;
    background: black;
    color: white;
  }
}
</style>

