 <!-- Service-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" :disabled="spaceName=='kube-system'?true:false" type="primary" @click="goEdit">{{$t('TKE.overview.bj')}}YAML</el-button>
      </div>
    </div>

    <!-- <div class="tke-card mt10 tke-formpanel-wrap">{{YAMLData}}</div> -->
    <div class="tke-card mt10 tke-formpanel-wrap">
      <codemirror style="background-color: #444;"  ref="myCm"  v-model="YAMLData"  :options="cmOptions" class="code" ></codemirror>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { codemirror } from 'vue-codemirror'
// import 'codemirror/theme/ambiance.css'
require('codemirror/mode/python/python.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
export default {
  name: 'svcDetailYaml',
  data () {
    return {
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
        readOnly: true// 只读
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
    async getYAMLData () {
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
          this.YAMLData = response
        } else {
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
    goEdit () {
      if (this.spaceName !== 'kube-system') {
        this.$router.push({
          name: 'svcUpdateYaml',
          query: {
            clusterId: this.clusterId,
            spaceName: this.spaceName,
            serviceName: this.serviceName
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mt10{
  white-space: pre-wrap;
  .code{
    text-align: left;
    background-color: #444;
  }
}

</style>
