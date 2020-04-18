<template>
  <div class="container-yaml">
    <div class="tke-content-header tke-detail-header" style="margin-bottom:20px">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="()=>$router.back()"><i class="el-icon-back"></i></span>
          <h2 class="header-title">更新Ingress</h2>
        </div>
      </div>
    </div>
    <div>
      <codemirror  v-model="YAMLData"  :options="cmOptions" class="code" ></codemirror>
    </div>
    <!-- 底部 -->
    <div class="tke-formpanel-footer">
      <el-button size="small" type="primary" @click="submit">完成</el-button>
      <el-button size="small" @click="()=>$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { POINT_REQUEST } from '@/constants'
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
  name: 'ingressYaml',
  data: function () {
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
        autoCloseBrackets: true,
        // readOnly: true// 只读
        // readOnly: 'nocursor'// 只读没有焦点
      }
    }
  },
  components: {
    codemirror
  },
  methods: {
    getYamlData: async function(){
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.spaceName}/ingresses/${this.serviceName}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId,
        Accept: 'application/yaml'
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          let response = res.Response.ResponseBody
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
    submit: async function () {
      this.loadShow = true
      let params = {
        Accept: 'application/json',
        ClusterName: this.clusterId,
        ContentType: 'application/yaml',
        Method: 'PUT',
        Path: `/apis/extensions/v1beta1/namespaces/${this.spaceName}/ingresses/${this.serviceName}`,
        RequestBody: this.YAMLData,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message.success('更新成功')
          this.$router.replace({
            path: '/colony/sub/detail/service/ingress/event',
            query: {
              clusterId: this.clusterId,
              ingressName: this.serviceName,
              namespace: this.spaceName
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
    }
  },
  created: function () {
    let { clusterId, np, resourceIns } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = np
    this.serviceName = resourceIns
    this.getYamlData()
  }
}
</script>

<style scoped>
  .code{
    padding:20px;
    background-color: white;
  }
</style>
