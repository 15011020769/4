 <!--服务 - Service -->
<template>
  <div>
    <subTitle title="Service" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goSvcCreate()" size="small" type="primary">新建</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <div>
          <span>命名空间</span>
          <el-select size="small" v-model="nameSpaceName" placeholder="请选择" @change="changNameSpace">
            <el-option
              v-for="item in searchOptions"
              :key="item.metadata.name"
              :value="item.metadata.name"
            ></el-option>
          </el-select>
        </div>
        <tkeSearch
          refreshData
          exportData
          :typeValue="searchType"
          inputPlaceholder="请输入关键词搜索"
          :searchInput="searchInput"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh="refreshList"
          @exportExcel="exportExcel"
        ></tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table id="exportTable" :data="list" v-loading="loadShow" style="width: 100%">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span
              @click="goSvcDetail(scope.row.metadata.name)"
              class="tke-text-link"
            >{{scope.row.metadata && scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="类型">
          <template slot-scope="scope">
            <span :class="scope.row.idDb?'tke-text-link':''">{{scope.row.spec.type}}</span>
            <p v-if="scope.row.idDb?true:false">负载均衡</p>
          </template>
        </el-table-column>
        <el-table-column prop label="Selector">
          <template slot-scope="scope">
            <span><span>{{scope.row.k8sApp?'k8s-app:'+scope.row.k8sApp+'、qcloud-app:'+scope.row.qcloudApp:'无'}}</span></span>
          </template>
        </el-table-column>

        <el-table-column prop label="IP地址">
          <template slot-scope="scope">
            <!-- <p>175.97.144.196 <br>172.16.252.49</p> -->
            <p><br>{{scope.row.spec.clusterIP+'(服务IP)'}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="创建时间">
          <template slot-scope="scope">
            <!-- <p>2020-01-10<br>14:16:37</p> -->
            <p>{{upTime(scope.row.metadata.creationTimestamp)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span :class="scope.row.isDisabled?'':'tke-text-link'" @click="scope.row.isDisabled?'':goSvcUpdteType(scope.row)">更新访问方式</span>
            <span class=" ml10" :class="scope.row.isDisabled?'':'tke-text-link'" @click="goEdit(scope.row)">编辑YAML</span>
            <span class="ml10" :class="scope.row.isDisabled?'':'tke-text-link'" @click="scope.row.isDisabled?'':deleteInfo(scope.row.metadata.name)">删除</span>
          </template>
        </el-table-column>
      </el-table>
     <!-- 分页 -->
      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- 删除弹框 -->
      <el-dialog title="删除资源" :visible.sync="showNameSpaceModal" width="35%">
        <p style="color:#444;font-weight:bolder;">您确定要删除Namespace：{{nameSpaceName}}吗？</p>
        <p style="color:#e54545">删除Namespace将销毁Namespace下的所有资源，销毁后不可恢复，请谨慎操作。</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">确 定</el-button>
          <el-button @click="showNameSpaceModal = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/views/TKE/components/subTitle'
import tkeSearch from '@/views/TKE/components/tkeSearch'
import Loading from '@/components/public/Loading'
import { ALL_CITY, POINT_REQUEST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import moment from 'moment'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
export default {
  name: 'colonyServiceSvc',
  data () {
    return {
      name: '',
      loadShow: false, // 加载是否显示
      list: [], // 列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      showNameSpaceModal: false, // 是否显示删除框
      // 搜索下拉框
      searchInput: '', // 输入的搜索关键字
      searchOptions: [], // 命名空间列表
      nameSpaceName: 'default', // 选中的命名空间名称
      searchType: 'default' // 下拉选中的值
    }
  },

  created () {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId
    this.getTypeOptions()
    this.getList()
  },
  methods: {
    // 获取命名空间名字
    async getTypeOptions () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          let searchOpt = JSON.parse(res.Response.ResponseBody).items// 得到空间列表
          this.searchOptions = searchOpt// 赋值
          this.nameSpaceName = searchOpt[0].metadata.name// 默认选中第一项
        } else {
          this.loadShow = false
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取列表数据
    async getList () {
      this.loadShow = true
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.nameSpaceName}/services?limit=${this.pageSize}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      if (this.searchInput !== '') {
        param.Path = `/api/v1/namespaces/${this.nameSpaceName}/services?fieldSelector=metadata.name=${this.searchInput}`
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res)
          this.loadShow = false
          let data = JSON.parse(res.Response.ResponseBody).items
          if (data.length > 0) { // 处理selector字段中的数据
            data.map(item => {
              item.k8sApp = item.spec.selector && item.spec.selector['k8s-app']
              item.qcloudApp = item.spec.selector && item.spec.selector['qcloud-app']
              let { metadata, spec } = item
              // 权限的验证
              // if (item.metadata.name === 'default' || item.metadata.name.indexOf('kube-') === 0) {
              if (metadata.namespace !== 'default' || metadata.name.indexOf('kube') === 0) {
                item.isDisabled = true
              } else {
                item.isDisabled = false
              }
              if (spec.type == 'ClusterIP' || spec.type == 'NodePort') {
                item.idDb = false
              } else {
                item.idDb = true
              }
            })
          }
          this.list = data// 得到列表数据并赋值
          console.log(this.list)
          this.total = data.length// 总条数
        } else {
          this.loadShow = false
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 根据命名空间来渲染列表
    changNameSpace () {
      this.getList()
    },
    // 操作列删除按钮事件
    deleteInfo (item) {
      this.showNameSpaceModal = true
      this.name = item
    },
    // 删除列表中的命名空间
    async submitDelete () {
      const params = {
        Method: 'DELETE',
        Path: `/api/v1/namespaces/${this.searchType}/services/${this.name}`,
        Version: '2018-05-25',
        RequestBody: { 'propagationPolicy': 'Background' },
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.getList()
          this.showNameSpaceModal = false
          this.$message.success('删除成功')
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
    },
    // 处理时间格式
    upTime (value) {
      return moment(value).format('YYYY-MM-DD HH :mm:ss')
    },
    // 新建
    goSvcCreate () {
      this.$router.push({
        name: 'svcCreate',
        query: {
          clusterId: this.clusterId,
          nameSpaceName: this.nameSpaceName
        }
      })
    },

    // 详情
    goSvcDetail (name) {
      this.$router.push({
        name: 'svcDetail',
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          serviceName: name
        }
      })
    },
    // 更新访问方式
    goSvcUpdteType (item) {
      this.$router.push({
        name: 'svcUpdate',
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          serviceName: item.metadata.name
        }
      })
    },
    goEdit (item) {
      this.$router.push({
        name: 'svcUpdate',
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          serviceName: item.metadata.name
        }
      })
    },

    // 选择搜索条件
    changeSearchType (val) {
      this.searchType = val
      // console.log(this.searchType)
    },
    // 监听搜索框的值
    changeSearchInput (val) {
      this.searchInput = val
      // console.log(this.searchInput)
    },
    // 点击搜索
    clickSearch (val) {
      this.searchInput = val
      // console.log(this.searchInput)
      this.getList()
    },
    // 刷新数据
    refreshList () {
      this.getList()
    },
    // 导出表格
    exportExcel () {
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
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.pageIndex = val - 1
      this.getList()
      this.pageIndex += 1
    },
    // pageSize 改变时会触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()
    }

  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
}
</script>

<style lang="scss" scoped>
.aaa{
  color:#ccc;
}
</style>
