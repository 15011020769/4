<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">{{$t('BILL.BILL.Deal.title')}}</span>
      <el-select v-model="dataForm.projectId" :placeholder="$t('BILL.BILL.Detail.allProject')" @change="getProjectListInfo()" clearable size="small" style="padding-left: 25px;">
        <el-option v-for="item in getprejectList" :key="item.projectId" :label="item.projectName" :value="item.projectId" >
        </el-option>
      </el-select>
    </div>
    <div class="cam-form">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input :placeholder="$t('BILL.BILL.Deal.orderId')" clearable v-model="dataForm.orderId" size="small">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()" size="small">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" icon="el-icon-download" @click="download" size="small"></el-button>
          </el-form-item>
        </el-form>
    </div>
    <div class="cam-box">
      <el-table :data="dataList" border style="width: 100%" v-loading="dataListLoading" size="small">
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
      <div style="background:#fff;padding:10px;height:10vh;justify-content: space-between;line-height:10px;">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" style="float: right;">
      </el-pagination>
      </div>
    </div>
    <!-- 弹窗, 详情 -->
    <Detail ref="Detail"></Detail>
  </div>
</template>

<script>
import Detail from './Dealdetail'
export default {
  data () {
    return {
      dataForm: {
        projectId: '',
        orderId: ''
      },
      dataList: [],
      getprejectList: [],
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
  mounted () {
    this.getDataList()
    this.getProjectListInfo()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin')
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderproduct/list`, params).then(data => {
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
    // 获取项目名称
    getProjectListInfo () {
      var params = {
        'allList': 0
      }
      this.$axios.post(`${process.env.VUE_APP_serverUrl}account/DescribeProject`, params).then(data => {
        if (data && data.code === 0) {
          this.getprejectList = data.data
        } else {
          this.getprejectList = []
        }
      })
      this.getDataList()
    },
    // 搜索
    search () {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },
    formatterStatus (row, column, cellValue) {
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
    formatterCurrency (row, column, cellValue) {
      if (cellValue === 'CNY') {
        return '人民币'
      } else if (cellValue === 'USD') {
        return '美元'
      } else if (cellValue === 'TWD') {
        return '台币'
      }
    },
    // 下载
    download () {
      var params = {
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin')
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderproduct/exportList`, params, { responseType: 'blob' }).then(res => {
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
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    detailHandle (rowData) {
      this.$nextTick(() => {
        this.$refs.Detail.init(rowData)
      })
    }
  }
}
</script>

<style lang="scss">
#CCN .el-container .el-main{
  padding:0 !important;
}
  .Cam {
    .cam-form{
      width: 96%;
      padding:0;
      margin: 0 auto;
    }
    .top {
      height: 45px;
      line-height: 45px;
      margin-bottom: 20px;
      padding: 0 20px;
      background: #fff;
      .title-left {
        font-size: 16px;
        font-weight: bolder;
      }
    }
    .content {
      padding: 20px;
      .operation {
        margin-bottom: 10px;
      }
      .search {
        overflow: hidden;
        padding: 10px 0;
        .search-left {
          float: left;
          .searchBox {
            display: inline-block;
          }
        }
        .search-right {
          float: right;
          margin-top: 10px;
          :hover {
            cursor: pointer;
          }
          i {
            padding: 0 3px;
          }
        }
      }
      .cam-pag {
        padding: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
    }
    .abs{
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left{
      position: relative;
      width: 44%;
      display: inline-block;
    }
    .cam_button{
      width: 96%;
      height: 40px;
      margin: 10px auto;
    }
    .cam-lt{
      float: left;
    }
    .head-container{
      float: right;
    }
    .cam_button{
      position: relative;
    }
    .cam-box{
      width: 96%;
      padding: 20px;
      background-color: #fff;
      margin: 0 auto;
    }
    .block{
      text-align: right;
      padding-top: 10px;
    }
    .btn-fr{
      float: right;
    }
    .pad{
      padding: 0 20px 0 20px;
    }
    .bor-box{
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      //max-width: 1360px;
      margin-left: auto;
    }
    .bor-box p{
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .bor-box .num-item{
      text-indent: -10px;
      padding-left: 18px;
      margin-bottom: 0;
    }
    .ifier {
      cursor:pointer;
      font-size: 140%;
      color: #888;
      position: absolute;
      right: 3%;
      top: 18%;
    }
    .gear {
      cursor:pointer;
      font-size: 140%;
      color: #888;
      padding-left: 6px;
    }
    .fier{
      cursor:pointer;
      font-size: 140%;
      color: #888;
      position: absolute;
      right: 3%;
      top: 8%;
    }
    .app-cam-alert {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
    }
  }
</style>
