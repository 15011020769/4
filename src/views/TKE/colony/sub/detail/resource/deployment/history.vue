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
          label="版本号"
          >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="版本详情"
          >
          <template slot-scope="scope">
            <span class="text-green">
              <i class="el-icon-tickets" @click="viewYaml(scope.row)" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="镜像"
          >
          <template slot-scope="scope">
              <p></p>
              <p></p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="更新时间"
          >
          <template slot-scope="scope">
            <span>{{scope.row.addTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template>
            <span class="tke-text-link">回滚</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="版本详情" :visible.sync="isShowYamlModal" width="35%">
      <codemirror style="background-color: #444;"  ref="myCm"  v-model="yamlInfo"  :options="cmOptions" class="code" >
      </codemirror>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowYamlModal = false">确 定</el-button>
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
      console.log(param);
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
          console.log(response);
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
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

