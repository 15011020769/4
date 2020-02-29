 <!-- Service-yaml -->
<template>
  <div class="colony-main">
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" type="primary">编辑YAML</el-button>
      </div>
    </div>

    <div class="tke-card mt10 tke-formpanel-wrap">{{YAMLData}}</div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  name: 'svcDetailYaml',
  data () {
    return {
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '', // 服务的名称
      YAMLData: ''// 数据信息
    }
  },
  components: {

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
          console.log(response)
          this.YAMLData = response
        } else {
          let ErrTips = {

          }
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
  }
}
</script>

<style lang="scss" scoped>
.mt10{
  white-space: pre-wrap
}
</style>
