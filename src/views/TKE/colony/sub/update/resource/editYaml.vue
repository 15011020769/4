<!-- 工作负载更新调度策略 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新Deployment</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>
    <el-card class='box-card'> 
      <div >
      <!-- <div class='box-black'> -->
            <codemirror
        style="background-color: #444;"
        ref="myCm"
        v-model="yamlInfo"
        :options="cmOptions"
        class="code"
      ></codemirror>
      </div>
    </el-card>
		<!-- 底部 -->
		<div class="tke-formpanel-footer">
			<el-button size="small" type="primary" @click="submit">完成</el-button>
			<el-button size="small" @click="goBack">取消</el-button>
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
import {TKE_COLONY_QUERY} from '@/constants'
export default {
  name: "editYaml",
  data() {
    return {
			type: '',
			number:0,
      se: {
        tabPosition: 'jt',
        radio: '2'
      },
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
      spaceName:'',
      workload:'',
      rowData:{},//路由接受对象
    };
  },
  components: {
    codemirror
  },
  created() {
     this.clusterId=this.$route.query.clusterId;
     this.name=this.$route.query.name;
     this.spaceName=this.$route.query.spaceName;
     this.rowData=this.$route.query.rowData;
     this.workload=this.$route.query.workload
     console.log(this.rowData)
     this.baseYamlData()
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.go(-1);
		},
		submit(){
      // RequestBody
      var params=null;
      if(this.workload=='jobs'){
         params={
          Accept: "application/json",
          ClusterName: this.clusterId,
          ContentType: "application/yaml",
          Method: "PUT",
          Path:`/apis/batch/v1/namespaces/${this.spaceName}/jobs/${this.name}`,
          Version: "2018-05-25",
          RequestBody:this.yamlInfo
        }
      }else{
        params={
          Accept: "application/json",
          ClusterName: this.clusterId,
          ContentType: "application/yaml",
          Method: "PUT",
          Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/"+this.workload+"/"+this.name,
          Version: "2018-05-25",
          RequestBody:this.yamlInfo
        }
      }
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res)
        if(res.Response.Error === undefined){
          this.$message({
                message: '更新成功',
                type: "success",
                showClose: true,
                duration: 0
          });
          if(this.workload=='deployments'){
            this.$router.push({
              name:'deploymentDetailEvent',
              query:{
                clusterId: this.clusterId,
                spaceName: this.spaceName,
                rowData: this.rowData,
                workload:this.workload
              }
            })
          }else if(this.workload=='statefulsets'){
              this.$router.push({
                name:'statefulSetDetailEvent',
                query:{
                  clusterId: this.clusterId,
                  spaceName: this.spaceName,
                  rowData: this.rowData,
                  workload:this.workload
                }
              })
          }else if(this.workload=='daemonsets'){
                this.$router.push({
                  name:'daemonSetDetailEvent',
                  query:{
                    clusterId: this.clusterId,
                    spaceName: this.spaceName,
                    rowData: this.rowData,
                    workload:this.workload
                  }
                })
          }else if(this.workload=='jobs'){
                  this.$router.push({
                    name:'jobDetailEvent',
                    query:{
                      clusterId: this.clusterId,
                      spaceName: this.spaceName,
                      rowData: this.rowData,
                      workload:this.workload
                    }
                  })
          }

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

    },
    baseYamlData(){
      var params=null;
      if(this.workload=='jobs'){
         params={
           Accept: "application/yaml",
          ClusterName: this.clusterId,
          Method: "GET",
          Path:`/apis/batch/v1/namespaces/${this.spaceName}/jobs/${this.name}`,
          Version: "2018-05-25",
        }
      }else{
        params={
          Accept: "application/yaml",
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/"+this.workload+"/"+this.name,
          Version: "2018-05-25",
        }
      }
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res) 
        if(res.Response.Error === undefined){
            // let response = JSON.parse(res.Response.ResponseBody);
            let response = res.Response.ResponseBody;
            console.log(response)
            this.yamlInfo=response
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
  .box-card {
    width: 100%;
    margin:20px 0;
  }
	.box-black{
    margin:10px;
    background:black;
  }
</style>

