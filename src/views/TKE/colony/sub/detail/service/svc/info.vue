 <!-- Service-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">{{$t('TKE.overview.jbxx')}}</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item :label="$t('TKE.overview.mc')">
          <div class="tke-form-item_text">{{serviceName}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{spaceName}}</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">{{detailData.metadata && detailData.metadata.annotations && detailData.metadata.annotations.description||'-'}}</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text" v-if="detailData.metadata &&detailData.metadata.labels">
            <!-- {{detailData.metadata && detailData.metadata.labels}} -->
            <span v-for="(v,i) in detailData.metadata && detailData.metadata.labels" :key="v">
              {{i}}: {{v+'&nbsp;&nbsp;'}}
              </span>
          </div>
          <div class="tke-form-item_text" v-else>-</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.cjsj')">
          <div class="tke-form-item_text">{{upTime(detailData.metadata && detailData.metadata.creationTimestamp)}}</div>
        </el-form-item>
        <el-form-item label="Selector">
          <!-- <div class="tke-form-item_text">k8s-app：{{detailData.k8sApp}} 、qcloud-app：{{detailData.qcloudApp}}</div> -->
          <div class="tke-form-item_text">{{detailData.k8sApp?'k8s-app：'+detailData.k8sApp+' 、'+'qcloud-app：'+detailData.qcloudApp:'-'}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.subList.fwfs')">
          <div class="tke-form-item_text">{{detailData.spec && detailData.spec.type}}</div>
        </el-form-item>
        <el-form-item label="集群IP">
          <div class="tke-form-item_text">{{detailData.spec && detailData.spec.clusterIP}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.subList.fzjhip')">
          <!-- <div class="tke-form-item_text">{{detailData.status && detailData.status.loadBalancer.ingress && detailData.status.loadBalancer.ingress[0].ip}}</div> -->
          <div class="tke-form-item_text">{{detailData.status && detailData.status.loadBalancer.ingress? detailData.status.loadBalancer.ingress[0].ip:'-'}}</div>
        </el-form-item>
        <el-form-item label="端口映射">
          <div style="max-width:800px">
            <el-table
              :data="list"

              style="width: 100%">
              <el-table-column
                prop="protocol"
                :label="$t('TKE.subList.xy')"
                >
              </el-table-column>
              <el-table-column
                prop="port"
                label="容器端口"
                >
              </el-table-column>
              <el-table-column
                prop="nodePort"
                :label="$t('TKE.subList.zjdk')"
                >
              </el-table-column>
              <el-table-column
                prop="targetPort"
                :label="$t('TKE.subList.fwdk')"
                >
              </el-table-column>

            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">{{$t('TKE.colony.gjszhi')}}</h4>
      <el-form  class="tke-form" label-position='left' label-width="130px" size="mini">
        <el-form-item label="ExternalTrafficPolicy">
          <div class="tke-form-item_text">{{detailData.spec && detailData.spec.type||'-'}}</div>
        </el-form-item>
        <el-form-item label="Session Affinity">
          <div class="tke-form-item_text">{{detailData.spec && detailData.spec.sessionAffinity}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.subList.zdhhbcsj')" v-if="detailData.spec&&detailData.spec.sessionAffinity==='ClientIP'">
          <div class="tke-form-item_text">{{detailData.spec && detailData.spec.sessionAffinityConfig.clientIP.timeoutSeconds+'秒'}}</div>
        </el-form-item>
      </el-form>
    </div>
   </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import moment from 'moment'
export default {
  name: 'svcDetailInfo',
  data () {
    return {
      list: [
        {
          protocol: 'TCP',
          containerPort: '333',
          hostPort: '32436',
          servicePort: '333'
        }

      ], // 列表
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '', // 服务的名称
      detailData: {}// 详情数据
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
    // console.log(this.spaceName, this.serviceName)
    this.getServiceNameInfo()
  },
  methods: {
    // 获取详情信息
    async getServiceNameInfo () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          let response = JSON.parse(res.Response.ResponseBody)
          this.detailData = response
          this.detailData.k8sApp = this.detailData.spec.selector && this.detailData.spec.selector['k8s-app']
          this.detailData.qcloudApp = this.detailData.spec.selector && this.detailData.spec.selector['qcloud-app']
          this.list = response.spec.ports
          // console.log(this.detailData, 'detail')
          // console.log(response)
        } else {
          this.loadShow = false
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
    },
    // 处理时间格式
    upTime (value) {
      return moment(value).format('YYYY-MM-DD HH :mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
