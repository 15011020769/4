 <!-- 命名空间-详情 -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header tke-detail-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack()">
						<i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新Namespace</h2>
        </div>
      </div>
    </div>

    <div class="">
       <codemirror style="background-color: black;"  ref="myCm"  v-model="yamlInfo"  :options="cmOptions" class="code" ></codemirror>
    </div>
		<!-- 底部 -->
		<div class="tke-formpanel-footer">
			<el-button size="small" type="primary" @click="submit">完成</el-button>
			<el-button size="small" @click="goBack()">取消</el-button>
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
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "namespaceDetail",
  data() {
    return {
      loadShow: false,//是否显示加载
			clusterId:'',//集群id
			yamlInfo: null,//yaml数据
			spaceName: '',//命名空间名称
			rowData: {},//名称
      cmOptions: {
        tabSize: 8,
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
      }
    };
  },
  components: {
    codemirror
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
		this.rowData = this.$route.query.rowData;
		this.spaceName = this.$route.query.spaceName;
		this.getYamlInfo();
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colonyResourceStatefulSet',
        
      })
    },
    async getYamlInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/statefulsets/"+this.rowData.metadata.name,
        Version: "2018-05-25",
        Accept: "application/yaml",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
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
		//提交
		async submit() {
			this.loadShow = true;
			let params = {
				Method: "PUT",
				Path: "/apis/apps/v1beta2/namespaces/" + this.spaceName + "/statefulsets/" + this.rowData.metadata.name,
				Version: "2018-05-25",
				RequestBody: this.yamlInfo,
				Accept: "application/json",
				ContentType: "application/yaml",
				ClusterName: this.clusterId
			}
			await this.axios.post(POINT_REQUEST, params).then(res => {
				if(res.Response.Error === undefined) {
					this.$message({
            message: '更新成功',
            type: "success",
            showClose: true,
            duration: 0
					});
					this.$router.push({
						name: "statefulSetDetailEvent",
						query: {
							clusterId: this.clusterId,
							spaceName: this.spaceName,
							rowData: this.rowData
						}
					});
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

