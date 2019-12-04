<template>
  <div class="Deal">
    <div class="top">
      <span class="title-left">{{$t('BILL.BILL.Deal.title')}}</span>
      <el-select v-model="dataForm.projectId" :placeholder="$t('BILL.BILL.Detail.allProject')" @change="getProjectListInfo()" clearable size="small" style="padding-left: 25px;">
        <el-option v-for="item in getprojectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
        </el-option>
      </el-select>
    </div>
    <div class="deal-content">
      <div class="deal-form">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input :placeholder="$t('BILL.BILL.Deal.orderId')" clearable v-model="dataForm.orderId">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="search()"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" icon="el-icon-download" @click="download" size="small" plain></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="deal-box">
        <el-table :data="dataList" class="table-content" v-loading="dataListLoading">
          <el-table-column prop="orderId" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Deal.orderId')">
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.status')" :formatter="formatterStatus">
          </el-table-column>
          <el-table-column prop="projectId" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.projectId')">
          </el-table-column>
          <el-table-column prop="goodsCategoryId" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.goodsCategoryId')">
          </el-table-column>
          <el-table-column prop="realTotalCost" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Deal.realTotalCost')">
          </el-table-column>
          <el-table-column prop="voucherDecline" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Deal.voucherDecline')">
          </el-table-column>
          <el-table-column prop="policy" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.policy')">
          </el-table-column>
          <el-table-column prop="price" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.price')">
          </el-table-column>
          <el-table-column prop="totalCost" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.totalCost')">
          </el-table-column>
          <el-table-column prop="usdCost" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.usdCost')">
          </el-table-column>
          <el-table-column prop="ntCost" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.ntCost')">
          </el-table-column>
          <el-table-column prop="month" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.month')">
          </el-table-column>
          <el-table-column prop="currency" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Deal.currency')" :formatter="formatterCurrency">
          </el-table-column>
          <el-table-column prop="createTime" header-align="center" align="center" width="160" :label="$t('BILL.BILL.Deal.createTime')">
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailHandle(scope.row)">{{$t('BILL.BILL.Deal.details')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-page">
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" style="float: right;">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹窗, 详情 -->
    <Detail ref="Detail"></Detail>
  </div>
</template>

<script>
import Detail from './Dealdetail'
export default {
  data() {
    return {
      dataForm: {
        projectId: '',
        orderId: ''
      },
      dataList: [],
      getprojectList: [],   // 项目列表
      projectName: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  components: {
    Detail
  },
  mounted() {
    this.getDataList()
    this.getProjectListInfo()
  },
  methods: {
    // 获取项目名称
    getProjectListInfo() {
      // 配置默认的项目，这个接口不返回默认项目
      var defaultProject = [{
        projectId: '',
        projectInfo: this.$t('BILL.BILL.Deal.allProject'),
        projectName: this.$t('BILL.BILL.Deal.allProject')
      }, {
        projectId: 0,
        projectInfo: this.$t('BILL.BILL.Deal.defaultProject'),
        projectName: this.$t('BILL.BILL.Deal.defaultProject')
      }]
      var params = {
        'allList': 0
      }
      this.axios.post(`${process.env.VUE_APP_serverUrl}account/DescribeProject`, params).then(data => {
        if (data && data.code === 0) {
          let projectArr = data.data
          this.getprojectList = defaultProject.concat(projectArr)
        } else {
          this.getprojectList = []
        }
      })
      this.getDataList()
    },

    // 获取数据列表
    getDataList() {
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin')
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderproduct/list`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },

    // 搜索
    search() {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },
    formatterStatus(row, column, cellValue) {
      if (cellValue === '1') {
        return '未支付'
      } else if (cellValue === '2') {
        return '已支付'
      } else if (cellValue === '3') {
        return '发货中'
      } else if (cellValue === '4') {
        return '已发货'
      } else if (cellValue === '5') {
        return '发货失败'
      } else if (cellValue === '6') {
        return '已退款'
      } else if (cellValue === '7') {
        return '已关单'
      } else if (cellValue === '8') {
        return '订单过期'
      } else if (cellValue === '9') {
        return '订单已失效'
      } else if (cellValue === '10') {
        return '产品已失效'
      } else if (cellValue === '11') {
        return '代付拒绝'
      } else if (cellValue === '12') {
        return '支付中'
      }
    },
    formatterCurrency(row, column, cellValue) {
      if (cellValue === 'CNY') {
        return '人民币'
      } else if (cellValue === 'USD') {
        return '美元'
      } else if (cellValue === 'TWD') {
        return '台币'
      }
    },
    // 下载
    download() {
      var params = {
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin')
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderproduct/exportList`, params, { responseType: 'blob' }).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = '订单明细.csv'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    detailHandle(rowData) {
      this.$nextTick(() => {
        this.$refs.Detail.init(rowData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Deal {
  .top {
    height: 50px;
    line-height: 50px;
    margin-bottom: 15px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 16px;
      font-weight: bolder;
    }
  }
  .deal-content {
    padding: 0 20px;
    .deal-form {
      float: right;
      ::v-deep .el-form-item {
        margin-bottom: 10px;
      }
      .el-input-group {
        ::v-deep .el-input__inner {
          height: 32px !important;
        }
      }
    }
    .deal-box {
      background-color: #fff;
      min-height: 520px;
      clear: both;
      margin-bottom: 20px;
      .table-content{
        min-height: 450px;
      }
      .table-page{
        width: 100%;
        height: 70px;
        .el-pagination{
          padding-top: 22px;
        }
      }
    }
  }
}
</style>
