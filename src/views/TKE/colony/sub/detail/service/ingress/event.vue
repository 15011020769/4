<!-- Ingress-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">{{$t('TKE.storage.zysjjbczq1xs')}}</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
    <!--  <div class="grid-right">
        <span>自动重新整理</span>
        <el-switch class="ml10" v-model="autoRefresh"></el-switch>
      </div>-->
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table :data="list" v-loading="loadShow" style="width: 100%">
        <el-table-column :label="$t('TKE.event.sccxsj')">
          <template slot-scope="scope">
            <p>{{scope.row.firstTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('TKE.event.zhcxsj')">
          <template slot-scope="scope">
            <p>{{scope.row.lastTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.event.jb')">
          <template slot-scope="scope">
            <span :class="{'text-red': scope.row.type === 'Warning'}">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.event.zylx')">
          <template slot-scope="scope">
            <span>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.event.zymc')">
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" :label="$t('TKE.event.xxms')">
          <template slot-scope="scope">
            <p style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.event.cxcs')">
          <template slot-scope="scope">
            <p>{{scope.row.count}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/public/Loading'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips.js'

export default {
  name: 'ingressDetailEvent',
  data () {
    return {
      clusterId: '',
      namespace: '', // 所在页面的命名空间
      ingressName: '', // 所在页面的ingress名称
      loadShow: false, // 加载是否显示
      autoRefresh: true, // 自动重新整理
      list: [] // 列表
    }
  },
  components: {
    Loading
  },
  created () {
    // 从路由获取类型
    let { clusterId, ingressName, namespace } = this.$route.query
    this.clusterId = clusterId
    this.namespace = namespace
    this.ingressName = ingressName
    this.getIngressEvent()
  },
  methods: {
    // 返回上一层
    goBack () {
      this.$router.go(-1)
    },
    async getIngressEvent () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.namespace}/ingresses/${this.ingressName}/events`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody)
          this.list = mes.items
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
        this.loadShow = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
