<template>
  <div class='container-yaml'>
    <div class="tke-content-header tke-detail-header" style="margin-bottom:20px">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack()">
						<i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新Service</h2>
        </div>
      </div>
    </div>

    <div class="">
       <codemirror  ref="myCm"  v-model="YAMLData"  :options="cmOptions" class="code" ></codemirror>
    </div>
		<!-- 底部 -->
		<div class="tke-formpanel-footer">
			<el-button size="small" type="primary" @click="submit">完成</el-button>
			<el-button size="small" @click="goBack()">取消</el-button>
		</div>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { codemirror } from 'vue-codemirror'
require('codemirror/mode/python/python.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
export default {
  name: 'svcUpdateYaml',
  data () {
    return {
      loadShow: false, // 是否显示加载
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '', // 服务的名称
      YAMLData: '', // 数据信息
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
        autoCloseBrackets: true
        // readOnly: true// 只读
        // readOnly: 'nocursor'// 只读没有焦点
      }
    }
  },
  components: {
    codemirror
  },
  created () {
    // 从路由获取类型
    let { clusterId, spaceName, serviceName } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = spaceName
    this.serviceName = serviceName
    this.getYAMLData()
  },
  methods: {
    // 点击完成的事件
    async submit () {
      this.loadShow = true
      let params = {
        Accept: 'application/json',
        ClusterName: this.clusterId,
        ContentType: 'application/yaml',
        Method: 'PUT',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        RequestBody: this.YAMLData,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message.success('更新成功')
          this.$router.push({
            name: 'svcDetailEvent',
            query: {
              clusterId: this.clusterId,
              spaceName: this.spaceName,
              serviceName: this.serviceName
            }
          })
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取数据
    async getYAMLData () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId,
        Accept: 'application/yaml'
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          let response = res.Response.ResponseBody
          console.log(response)
          this.YAMLData = response
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 返回上一层
    goBack () {
      this.$router.push({
        name: 'colonyServiceSvc'

      })
    }
  }
}
</script>

<style scoped lang='scss'>
.code{
  padding:20px;
  background-color: white;
}
</style>
