 <!-- Service-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">{{$t('TKE.storage.zysjjbczq1xs')}}</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>{{$t('TKE.overview.zdsx')}}</span><el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch()" ></el-switch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          :label="$t('TKE.event.sccxsj')"
          >
          <template slot-scope="scope">
            <p>{{upTime(scope.row.firstTimestamp)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('TKE.event.zhcxsj')"
          >
          <template slot-scope="scope">
            <p>{{upTime(scope.row.lastTimestamp)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.jb')"
          >
          <template slot-scope="scope">
              <span class="text-red">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.zylx')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.involvedObject && scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          :label="$t('TKE.event.zymc')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata && scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width=200
          prop="nodeTotal"
          :label="$t('TKE.event.xxms')">
          <template slot-scope="scope">
            <p style="white-space: nowrap; width: 180px; overflow: hidden;text-overflow: ellipsis">{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.cxcs')">
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
import { ErrorTips } from '@/components/ErrorTips'
import moment from 'moment'
export default {
  name: 'svcDetailEvent',
  data () {
    return {
      loadShow: false, // 加载是否显示
      autoRefresh: false, // 自动刷新
      timer: null, // 定时器
      list: [
        {
          status: false
        },
        {
          status: true
        },
        {
          status: true
        },
        {
          status: true
        }
      ], // 列表
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '' // 服务的名称
    }
  },
  components: {
    Loading
  },
  created () {
    // 从路由获取类型
    let { clusterId, spaceName, serviceName } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = spaceName
    this.serviceName = serviceName
    this.handleEvent()
    let autoRefresh = this.autoRefresh
    if (autoRefresh) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.handleEvent()
        }, 1000 * 20)
      }
    }
  },
  methods: {
    // 返回上一层
    goBack () {
      this.$router.go(-1)
    },
    async handleEvent () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}/events`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          this.list = JSON.parse(res.Response.ResponseBody).items
          // console.log(this.list, 123)
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
    // 是否刷新
    changeSwitch () {
      // console.log(this.autoRefresh, 'val')
      let autoRefresh = this.autoRefresh
      if (autoRefresh) {
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.handleEvent()
          }, 1000 * 20)
        }
      } else {
        if (this.timer) { // 如果定时器在运行则关闭
          clearInterval(this.timer)
        }
      }
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
