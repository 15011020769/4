<!-- Ingress-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" type="primary" @click="toYmal">编辑YAML</el-button>
      </div>
    </div>

    <div class="tke-card mt10 tke-formpanel-wrap">
      <div style="white-space: pre-wrap;">{{yamlDetail}}</div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips.js'

export default {
  name: 'ingressDetailYaml',
  data () {
    return {
      clusterId: '',
      namespace: '', // 所在页面的命名空间
      ingressName: '', // 所在页面的ingress名称
      yamlDetail: '' // yaml 内容
    }
  },
  components: {},
  created () {
    // 从路由获取集群id
    let { clusterId, ingressName, namespace } = this.$route.query
    this.clusterId = clusterId
    this.namespace = namespace
    this.ingressName = ingressName
    this.getIngressYaml()
  },
  methods: {
    getIngressYaml: async function () {
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.namespace}/ingresses/${this.ingressName}`,
        Version: '2018-05-25',
        Accept: 'application/yaml',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        console.log(res.Response.ResponseBody)
        if (res.Response.Error === undefined) {
          this.yamlDetail = res.Response.ResponseBody
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    toYmal: function () {
      this.$router.push({
        path: '/colony/sub/modify/service/ingress',
        query: {
          clusterId: this.clusterId,
          np: this.namespace,
          resourceIns: this.ingressName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
