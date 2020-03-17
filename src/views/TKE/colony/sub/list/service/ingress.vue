<!--服务 - Ingress -->
<template>
  <div>
    <subTitle title='Ingress'/>
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goIngressCreate()" size="small" type="primary">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          typeSelect
          refreshData
          exportData
          :typeLabel="$t('TKE.overview.mmkj')"
          :typeOptions='searchOptions'
          :typeValue='searchType'
          :inputPlaceholder="$t('TKE.subList.qsrgjzss')"
          :searchInput='searchInput'

          @changeType="changeSearchType"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh='refreshList'
          @exportExcel="exportExcel">
        </tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table :data="list" v-loading="loadShow" id="exportTable" style="width: 100%">
        <el-table-column :label="$t('TKE.overview.mc')">
          <template slot-scope="scope">
            <span @click="goIngressDetail(scope.row.metadata.name)" class="tke-text-link">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.overview.lx')">
          <template slot-scope="scope">
            <span class="tke-text-link">{{scope.row.metadata.annotations['kubernetes.io/ingress.qcloud-loadbalance-id']}}</span>
            <p>{{$t('TKE.subList.fzjh')}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="VIP">
          <template slot-scope="scope">
            <p>{{scope.row.status.loadBalancer.ingress && scope.row.status.loadBalancer.ingress[0].ip}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="" :label="$t('TKE.subList.hdfw')" width="350">
          <template slot-scope="scope">
            <span class="tke-text-link">
              http://{{scope.row.status.loadBalancer.ingress?scope.row.status.loadBalancer.ingress[0].ip:'-'}}{{scope.row.spec.rules[0].http.paths[0].path}}
            </span>
            &ndash;&gt;
            {{scope.row.spec.rules[0].http.paths[0].backend.serviceName}}
            : {{scope.row.spec.rules[0].http.paths[0].backend.servicePort}}
          </template>
        </el-table-column>

        <el-table-column prop="" :label="$t('TKE.overview.cjsj')">
          <template slot-scope="scope">
            <p v-for="v in upTime(scope.row.metadata.creationTimestamp)" :key="v">{{v}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="toUpdateConfigure(scope.row)">{{$t('TKE.subList.gxzfpz')}}</span>
            <span class="tke-text-link ml10" @click="toYmal(scope.row)">{{$t('TKE.overview.bj')}}YAML</span>
            <span class="tke-text-link ml10" @click="showDeleteDialog(scope.row)">{{$t('TKE.overview.sc')}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="showNameSpaceModal" width="35%">
      <p style="color:#444;font-weight:bolder;">{{$t('TKE.storage.nqdysc')}}Ingress：{{ingressItem.name}}嗎？</p>
      <p style="color:#e54545">{{$t('TKE.subList.schbkhf')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteIngress()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="showNameSpaceModal = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from '@/views/TKE/components/subTitle'
import tkeSearch from '@/views/TKE/components/tkeSearch'
import Loading from '@/components/public/Loading'
import moment from 'moment'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips.js'
import Template from '../../../../../CM/Template/Template' // 公共错误码

export default {
  name: 'colonyServiceIngress',
  data () {
    return {
      loadShow: false, // 加载是否显示
      list: [], // 列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      // 搜索下拉框
      searchOptions: [],
      searchType: 'default', // 下拉选中的值
      searchInput: '', // 输入的搜索关键字
      nameSpaceName: '',
      showNameSpaceModal: false,
      ingressItem: {}
    }
  },

  created () {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId
    this.initNetworkRequery()
  },
  methods: {
    initNetworkRequery: async function () {
      await this.getNameSpaceList()
      await this.getIngressList()
    },
    // 删除ingress
    deleteIngress: function () {
      let { namespace, name } = this.ingressItem
      let param = {
        Method: 'DELETE',
        Path: `/apis/extensions/v1beta1/namespaces/${namespace}/ingresses/${name}`,
        Version: '2018-05-25',
        RequestBody: JSON.stringify({ 'propagationPolicy': 'Background' }),
        ClusterName: this.clusterId
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        this.$message({
          message: '刪除成功',
          showClose: true,
          type: 'success',
          duration: 2000
        })
        this.getIngressList()
      })
      this.showNameSpaceModal = false
    },
    showDeleteDialog: function (val) {
      let { namespace, name } = val.metadata
      this.ingressItem = { namespace, name }
      this.showNameSpaceModal = true
    },
    // 新建
    goIngressCreate () {
      this.$router.push({
        name: 'ingressCreate',
        query: {
          clusterId: this.clusterId,
          np: this.searchType
        }
      })
    },
    // 获取命名空间
    async getNameSpaceList () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        let searchOpt = JSON.parse(res.Response.ResponseBody).items
        searchOpt.map(item => {
          item.value = item.metadata.name
          item.label = item.metadata.name
        })
        this.searchOptions = searchOpt
        if (this.searchOptions.length > 0) {
          this.searchType = this.searchOptions[0].value
        }
      })
    },
    // 获取表格列表
    async getIngressList () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.searchType}/ingresses?limit=${this.pageSize}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      if (this.searchInput !== '') {
        param.Path = `/apis/extensions/v1beta1/namespaces/${this.searchType}/ingresses?fieldSelector=metadata.name=${this.searchInput}`
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody)
          let { items } = mes
          this.list = items
          this.total = items.length
          this.loadShow = false
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
    // 详情
    goIngressDetail (val) {
      this.$router.push({
        name: 'ingressDetail',
        query: {
          clusterId: this.clusterId,
          ingressName: val,
          namespace: this.searchType // 获取当前命名空间
        }
      })
    },

    // 选择搜索条件
    changeSearchType (val) {
      this.searchType = val
      this.getIngressList()
    },
    // 监听搜索框的值
    changeSearchInput (val) {
      this.searchInput = val
      console.log(this.searchInput)
    },
    // 点击搜索
    clickSearch (val) {
      this.searchInput = val
      console.log(this.searchInput)
      this.getIngressList()
    },
    // 刷新数据
    refreshList () {
      console.log('refreshList....')
      this.getIngressList()
    },
    // 导出表格
    exportExcel () {
      console.log('exportExcel...')
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: 'application/octet-stream'
          }),
          this.$t('CVM.clBload.fzjh') + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },

    // 分页
    handleCurrentChange (val) {
      this.pageIndex = val - 1
      // this.getColonyList();
      this.pageIndex += 1
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      // this.getColonyList();
    },
    toUpdateConfigure (val) {
      this.$router.push({
        name: 'configure',
        query: {
          clusterId: this.clusterId,
          np: val.metadata.namespace,
          resourceIns: val.metadata.name
        }
      })
    },

    upTime (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss').split(' ')
    },
    toYmal: function (val) {
      this.$router.push({
        path: '/colony/sub/modify/service/ingress',
        query: {
          clusterId: this.clusterId,
          np: val.metadata.namespace,
          resourceIns: val.metadata.name
        }
      })
    }

  },
  components: {
    Template,
    subTitle,
    tkeSearch,
    Loading
  }
}
</script>
