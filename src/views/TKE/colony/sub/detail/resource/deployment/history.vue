 <!-- deployment-修订历史 -->
<template>
  <div class="colony-main">
   
    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          label="版本號"
          >
          <template slot-scope="scope">
            <span>V{{scope.row.metadata.annotations['deployment.kubernetes.io/revision']}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="版本詳情"
          >
          <template slot-scope="scope">
            <span class="text-green">
              <i class="el-icon-tickets" @click="viewYaml(scope.row)" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="映像"
          >
          <template slot-scope="scope">
              <p>映像: {{scope.row.spec && scope.row.spec.template && scope.row.spec.template.spec && scope.row.spec.template.spec.containers && scope.row.spec.template.spec.containers.length > 0 && scope.row.spec.template.spec.containers[0].image}}</p>
              <p>版本(tag) {{scope.row.spec && scope.row.spec.template && scope.row.spec.template.spec && scope.row.spec.template.spec.containers && scope.row.spec.template.spec.containers.length > 0 && scope.row.spec.template.spec.containers[0].Tag}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="更新時間"
          >
          <template slot-scope="scope">
            <span>{{scope.row.addTime}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button type='text' class="tke-text-link" @click="isShowRollBack(scope.row)">回滚</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-dialog title="版本詳情" :visible.sync="isShowYamlModal" width="35%">
      <codemirror style="background-color: #444;"  ref="myCm"  v-model="yamlInfo"  :options="cmOptions" class="code" >
      </codemirror>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowYamlModal = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="回滾資源" :visible.sync="showRollBack" width="35%">
      <span>您確定要回滾Deployment：{{this.rowData.metadata.name}} 至 版本v{{this.version}}嗎？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rollBack">确 定</el-button>
        <el-button @click="showRollBack = false">取 消</el-button>
      </span>
    </el-dialog>
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
import moment from 'moment';
import { ErrorTips } from "@/components/ErrorTips";
import * as yaml from 'js-yaml'
export default {
  name: "deploymentDetailHistory",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      list:[], //列表
      isShowYamlModal: false,//是否显示yaml显示框
      yamlInfo: null,//yaml数据
      cmOptions: {
        tabSize: 4,
        mode: 'JSON',
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
      },
      history: {},//历史数据
      showRollBack: false,//是否打开回滚弹窗
      version: '',//版本
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
    this.getHistoryList();
  },
  methods: {
    //获取修订历史列表
    async getHistoryList() {
      this.loadShow = true;
      let selector = this.rowData.spec.selector.matchLabels;
      let param = '';
      for(let i in selector) {
        param += i + '=' + selector[i] + ','
      }
      let params = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.rowData.metadata.namespace+"/replicasets?labelSelector=" + param.substring(0,param.length - 1),
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            response.items.map(pod => {
              pod.addTime = moment(pod.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
            });
          }
          this.list = response.items;
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
    //打开yaml查看modal
    viewYaml(rowData) {
      this.isShowYamlModal = true;
      this.yamlInfo = JSON.stringify(rowData);
    },

    //打开回滚弹窗
    isShowRollBack(rowData) {
      this.history = rowData;
      this.version = rowData.metadata.annotations['deployment.kubernetes.io/revision'];
      this.showRollBack = true;
    },

    //回滚数据 disabled
    async rollBack() {
      this.loadShow = true;
      let RequestBody = {
        kind: 'DeploymentRollback',
        apiVersion: 'extensions/v1beta1',
        name: this.rowData.metadata.name,
        rollbackTo: {revision: Number(this.history.metadata.annotations['deployment.kubernetes.io/revision'])}
      }
      let param = {
        Method: "POST",
        Path: `/apis/extensions/v1beta1/namespaces/${this.rowData.metadata.namespace}/deployments/${this.rowData.metadata.name}/rollback`,
        Version: "2018-05-25",
        RequestBody: JSON.stringify(RequestBody),
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.getHistoryList();
          this.showRollBack = false;
          this.$message({
            message: '回滾成功',
            type: "success",
            showClose: true,
            duration: 0
          });
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

