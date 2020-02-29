<!-- Ingress-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">基本信息</h4>
      <el-form class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{ingressName}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{namespace}}</div>
        </el-form-item>
        <el-form-item label="VIP">
          <div class="tke-form-item_text">{{ingressDetail.status && ingressDetail.status.loadBalancer.ingress[0].ip}}</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{upTime(ingressDetail.metadata && ingressDetail.metadata.creationTimestamp)}}</div>
        </el-form-item>
        <el-form-item label="网络类型">
          <div class="tke-form-item_text">公网</div>
        </el-form-item>
        <el-form-item label="annotations">
          <div class="tke-form-item_text">
            <p v-for="(v,i) in ingressDetail.metadata && ingressDetail.metadata.annotations" :key="v">{{i}}:{{v}}</p>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4 class="tke-formpanel-title">转发配置</h4>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="protocol" label="协议"></el-table-column>
        <el-table-column prop="listenPort" label="监听端口">80</el-table-column>
        <el-table-column prop="domainName" label="域名"></el-table-column>
        <el-table-column prop="url" label="URL路径"></el-table-column>
        <el-table-column prop="backend" label="后端服务"></el-table-column>
        <el-table-column prop="servicePort" label="服务端口"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import moment from 'moment'
import { ErrorTips } from '@/components/ErrorTips.js'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import Template from '../../../../../../CM/Template/Template'

export default {
  name: 'ingressDetailInfo',
  data () {
    return {
      clusterId: '',
      namespace: '',
      ingressName: '',
      ingressDetail: {},
      list: [] // 列表
    }
  },
  components: { Template },
  created () {
    // 从路由获取类型
    let { clusterId, ingressName, namespace } = this.$route.query
    this.clusterId = clusterId
    this.namespace = namespace
    this.ingressName = ingressName
    this.getIngressDetail()
  },
  methods: {
    // 获取 ingress 信息
    async getIngressDetail () {
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.namespace}/ingresses/${this.ingressName}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody)
          this.ingressDetail = mes
          let tempList = mes.spec.rules
          // 进行参数的重新封装
          tempList.forEach((item) => {
            let tempArr = {}
            tempArr.protocol = Object.keys(item)[0]
            tempArr.url = item[tempArr.protocol].paths[0].path
            tempArr.backend = item[tempArr.protocol].paths[0].backend.serviceName
            tempArr.servicePort = item[tempArr.protocol].paths[0].backend.servicePort
            tempArr.domainName = mes.status.loadBalancer.ingress[0].ip
            tempArr.listenPort = 80
            this.list.push(tempArr)
          })
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
    upTime (value) {
      if (!value) return
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped></style>
