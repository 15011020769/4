 <!-- deployment-日志 -->
<template>
  <div class="colony-main">
    <div class="tke-card mt10 tke-formpanel-wrap">
      <div class="tke-grid ">
        <!-- 右侧 -->
        <div class="grid-right">
          <span>自動重新整理</span><el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch(e)" ></el-switch>
        </div>
      </div>
      <el-card class='box-card'> 
        <el-select v-model="currPod" @change="changePod">
          <el-option 
            v-for="(it, i) in potList" 
            :key="i" 
            :label="it.metadata.name" 
            :value="it.metadata.name"
            >
          </el-option>
        </el-select>
        <el-select v-model="currStateful" @change="changeContainer">
          <el-option
            v-for="(item,i) in this.statefulSetList"
            :key="i"
            :label="item.name"
            :value="item.name"
            >
          </el-option>
        </el-select>
        <el-select v-model="index" @change="changeSize">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
        <div class='box-black'>
          <codemirror style="background-color: #444;"  ref="myCm"  v-model="logData"  :options="cmOptions" class="code" ></codemirror>
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
import moment from 'moment';
export default {
  name: "deploymenDetailLog",
  data() {
    return {
      options: [
        {value: 100,
        label: '顯示100條'},
        {value: 200,
        label: '顯示200條'},
        {value: 500,
        label: '顯示500條'},
        {value: 1000,
        label: '顯示1000條'},
      ],
      index: 100,//选中的条数
      statefulSetList: [],//statefulSet列表
      potList:[],//pod列表
      currPod: '',//选中的pod
      currStateful: '',//选中的stateful
      loadShow: false,//是否显示加载
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      workload:'',//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      logData: null,//日志数据
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
      },
      autoRefresh: true, //自动重新整理
      timer: null,//定时器
    };
  },
  components: {
    codemirror
  },
  created() {
     // 从路由获取类型
    this.clusterId=this.$route.query.clusterId
    this.potList = this.$route.query.potList;
    this.spaceName = this.$route.query.spaceName;
    this.workload=this.$route.query.workload;
    this.rowData = this.$route.query.rowData;
    if(this.$route.query.potList.length > 0) {
      this.currPod = this.$route.query.potList[0].metadata.name;
    }
    this.statefulSetList = this.$route.query.rowData.spec.template.spec.containers;
    this.currStateful = this.$route.query.rowData.spec.template.spec.containers[0].name;
    this.getstatefulLog();
    let autoRefresh = this.autoRefresh;
    if(autoRefresh) {
      if(this.timer) {
        this.timer = setInterval(() => {
          this.getstatefulLog();
        }, 1000 * 20);
      }
    }
  },
  methods: {
    async getstatefulLog() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.rowData.metadata.namespace+"/pods/"+this.currPod+"/log?container="+this.currStateful+"&timestamps=true&tailLines="+this.index,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.logData = res.Response.ResponseBody?res.Response.ResponseBody:'暫無日誌';
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
    //选择实例
    changePod() {
      this.getstatefulLog();
    },
    //选择容器
    changeContainer() {
      this.getstatefulLog();
    },
    //选择条数
    changeSize() {
      this.getstatefulLog();
    },
    //是否重新整理
    changeSwitch() {
      let autoRefresh = this.autoRefresh;
      if(autoRefresh) {
        if(!this.timer) {
          this.timer = setInterval(() => {
            this.getstatefulLog();
          }, 1000 * 20);
        }
      } else {
        if(this.timer) { //如果定时器在运行则关闭
          clearInterval(this.timer); 
        }
      }
    },
    //销毁定时器
    destroyed(){
      if(this.timer) { //如果定时器在运行则关闭
        clearInterval(this.timer); 
      }
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

