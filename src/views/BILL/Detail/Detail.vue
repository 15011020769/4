<template>
  <div class="mod-role">
    <div class="mod">
      <span class="mod-mar" style="font-size: 16px; font-weight: 700; line-height:3;">{{$t('BILL.BILL.Detail.title')}}</span>
      <el-date-picker v-model="dataForm.month" type="month" value-format="yyyy-MM" size="small" @change="getMonth(dataForm.month)" style="padding-left: 5px;">
      </el-date-picker>
      <span style="padding-left: 10px; font-size: 12px;">{{$t('BILL.BILL.Detail.note')}}</span>
    </div>
    <div class="mod-from">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="dataForm.businessCodeName" value-key="code" :placeholder="$t('BILL.BILL.Detail.allProduct')" @change="getChildInfo()" clearable size="small">
          <el-option v-for="item in getProductList" :key="item.code" :label="item.nameTw" :value="item" >
          </el-option>
        </el-select>
        <el-select v-model="dataForm.productCodeName" value-key="code" :placeholder="reminder1()" @change="getComponentInfo()" clearable size="small">
          <el-option v-for="item in getChildList" :key="item.code" :label="item.nameTw" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.componentCodeName" :placeholder="reminder2()" @change="getInfo()" clearable size="small">
          <el-option v-for="item in getComponentList" :key="item.name" :label="item.name" :value="item.name">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.projectName" :placeholder="$t('BILL.BILL.Detail.allProject')" @change="getProjectInfo()" clearable size="small">
          <el-option v-for="item in getProjectList" :key="item.projectName" :label="item.projectName" :value="item.projectName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.regionName" :placeholder="$t('BILL.BILL.Detail.allArea')" @change="getRegionInfo()" clearable size="small">
          <el-option v-for="item in getRegionList" :key="item.regionName" :label="item.regionName" :value="item.regionName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.payModeName" :placeholder="$t('BILL.BILL.Detail.allpayMode')" @change="getPayModeInfo()" clearable size="small">
          <el-option v-for="item in getPayModeList" :key="item.payModeName" :label="item.payModeName" :value="item.payModeName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.actionTypeName" :placeholder="$t('BILL.BILL.Detail.allActionType')" @change="getActionTypeInfo()" clearable size="small">
          <el-option v-for="item in getActionTypeList" :key="item.actionTypeName" :label="item.actionTypeName" :value="item.actionTypeName">
          </el-option>
        </el-select>
        <el-checkbox v-model="dataForm.checked" style="padding-left: 15px;" @change="getCharge()">{{$t('BILL.BILL.Detail.filter')}}</el-checkbox>
      </el-form-item>
    </el-form>
    </div>
    <div class="mod-table">
      <div class="mod-box">
        <div class="mod-left">
          <span style="font-size: 14px;">{{$t('BILL.BILL.Detail.allCast')}}：</span>
          <span style="font-size: 16px; color: #006eff;">{{dataForm.allCoat}} 元</span>
          <span style="font-size: 14px;"> = {{$t('BILL.BILL.Detail.cashPayment')}} {{dataForm.cashPayment}} 元 + {{$t('BILL.BILL.Detail.freePayment')}} {{dataForm.freePayment}} 元 + {{$t('BILL.BILL.Detail.voucherPayment')}} {{dataForm.voucherPayment}} 元</span>
        </div>
        <div class="mod-right">
        <div style="float: right;">
          <el-button type="primary" icon="el-icon-download" @click="download" size="small"></el-button>
        </div>
        <div style="float: right; padding-right:5px;">
          <el-button type="primary" @click="search()" size="small">{{$t('BILL.BILL.Detail.search')}}</el-button>
        </div>
        <div style="float: right; padding-right:5px;">
          <el-input :placeholder="$t('BILL.BILL.Detail.resourceId')" clearable v-model="dataForm.resourceId" size="small">
          </el-input>
        </div>
      </div>
      </div>
      <el-table :data="dataList" border style="width: 100%" v-loading="dataListLoading" size="small">
      <el-table-column prop="resourceId" header-align="center" align="center" width="160" fixed :label="$t('BILL.BILL.Detail.resourceId')">
      </el-table-column>
      <el-table-column prop="businessCodeName" header-align="center" align="center" width="160" fixed :label="$t('BILL.BILL.Detail.productName')">
      </el-table-column>
      <el-table-column prop="payModeName" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.payMode')">
      </el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.projectName')">
      </el-table-column>
      <el-table-column prop="regionName" header-align="center" align="center" width="200" :label="$t('BILL.BILL.Detail.regionName')">
      </el-table-column>
      <el-table-column prop="zoneName" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.zoneName')">
      </el-table-column>
      <el-table-column prop="productCodeName" header-align="center" align="center" width="200" :label="$t('BILL.BILL.Detail.productCodeName')">
      </el-table-column>
      <el-table-column prop="actionTypeName" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.actionTypeName')">
      </el-table-column>
      <el-table-column prop="orderId" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.orderId')">
      </el-table-column>
      <el-table-column prop="billId" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.billId')">
      </el-table-column>
      <el-table-column prop="payTime" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.payTime')">
      </el-table-column>
      <el-table-column prop="feeBeginTime" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.feeBeginTime')">
      </el-table-column>
      <el-table-column prop="feeEndTime" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.feeEndTime')">
      </el-table-column>
      <el-table-column prop="componentCodeName" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.componentCodeName')">
      </el-table-column>
      <el-table-column prop="itemCodeName" header-align="center" align="center" width="150" :label="$t('BILL.BILL.Detail.itemCodeName')">
      </el-table-column>
      <el-table-column prop="singlePrice" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.singlePrice')">
      </el-table-column>
      <el-table-column prop="specifiedPrice" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.specifiedPrice')">
      </el-table-column>
      <el-table-column prop="priceUnit" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.priceUnit')">
      </el-table-column>
      <el-table-column prop="usedAccount" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.usedAccount')">
      </el-table-column>
      <el-table-column prop="usedAccountUnit" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.usedAccountUnit')">
      </el-table-column>
      <el-table-column prop="timeSpan" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.timeSpan')">
      </el-table-column>
      <el-table-column prop="timeUnitName" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.timeUnitName')">
      </el-table-column>
      <el-table-column prop="cost" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.cost')">
      </el-table-column>
      <el-table-column prop="qcloudDiscount" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.qcloudDiscount')">
      </el-table-column>
      <el-table-column prop="tfcDiscount" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.tfcDiscount')">
      </el-table-column>
      <el-table-column prop="reduceType" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.reduceType')">
      </el-table-column>
      <el-table-column prop="realCost" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.realCost')">
      </el-table-column>
      <el-table-column prop="voucherPayAmount" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.voucherPayAmount')">
      </el-table-column>
      <el-table-column prop="cashPayAmount" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.cashPayAmount')">
      </el-table-column>
      <el-table-column prop="incentivePayAmount" header-align="center" align="center" width="140" :label="$t('BILL.BILL.Detail.incentivePayAmount')">
      </el-table-column>
      <el-table-column prop="usdExpenditure" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.usdExpenditure')">
      </el-table-column>
      <el-table-column prop="ntExpenditure" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.ntExpenditure')">
      </el-table-column>
      <el-table-column prop="month" header-align="center" align="center" width="120" :label="$t('BILL.BILL.Detail.month')">
      </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" style="width:100%; text-align:right;">
        </el-pagination>
    </div>
    </div>
    <iframe ref="iframe" src="" style="display:none"></iframe>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      dataForm: {
        businessCodeName: {},
        productCodeName: '',
        componentCodeName: '',
        projectName: '',
        regionName: '',
        payModeName: '',
        actionTypeName: '',
        resourceId: '',
        realCost: '',
        month: '',
        checked: false,
        allCoat: '0',
        cashPayment: '0',
        freePayment: '0',
        voucherPayment: '0'
      },
      dataList: [],
      getProductList: [],
      getChildList: [],
      getProjectList: [],
      getRegionList: [],
      getPayModeList: [],
      getActionTypeList: [],
      getComponentList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  mounted () {
    this.dataForm.month = moment(new Date()).format('YYYY-MM')
    this.getProductInfo()
    this.getDataList()
    this.cost()
    this.getProjectInfo()
    this.getRegionInfo()
    this.getPayModeInfo()
    this.getActionTypeInfo()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'businessCodeName': this.dataForm.businessCodeName.nameTw,
        'productCodeName': this.dataForm.productCodeName.nameTw,
        'itemCodeName': this.dataForm.componentCodeName,
        'projectName': this.dataForm.projectName,
        'regionName': this.dataForm.regionName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'resourceName': this.dataForm.resourceId,
        'realCost': this.dataForm.realCost,
        'month': this.dataForm.month,
        'ifDisZero': this.dataForm.checked,
        'uin': this.$cookie.get('uin')
      }
      this.dataListLoading = true
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/list`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
      this.cost()
    },
    // 下拉月份
    getMonth (mon) {
      this.dataForm.month = mon
      this.getDataList()
      this.getProjectInfo()
      this.getRegionInfo()
      this.getPayModeInfo()
      this.getActionTypeInfo()
    },
    // 搜索
    search () {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
      this.cost()
    },
    // 总费用计算
    cost () {
      var params = {
        'businessCodeName': this.dataForm.businessCodeName.nameTw,
        'productCodeName': this.dataForm.productCodeName.nameTw,
        'itemCodeName': this.dataForm.componentCodeName,
        'projectName': this.dataForm.projectName,
        'regionName': this.dataForm.regionName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'resourceName': this.dataForm.resourceId,
        'realCost': this.dataForm.realCost,
        'month': this.dataForm.month,
        'ifDisZero': this.dataForm.checked,
        'uin': this.$cookie.get('uin')
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/getPayAmount`, params).then(data => {
        if (data.payAmount != null && data.code === 0) {
          this.dataForm.allCoat = data.payAmount.totalAmount
          this.dataForm.cashPayment = data.payAmount.cashAmount
          this.dataForm.freePayment = data.payAmount.incentiveAmount
          this.dataForm.voucherPayment = data.payAmount.voucherAmount
        } else {
          this.dataForm.allCoat = 0
          this.dataForm.cashPayment = 0
          this.dataForm.freePayment = 0
          this.dataForm.voucherPayment = 0
        }
      })
    },
    // 下载
    download () {
      var params = {
        'businessCodeName': this.dataForm.businessCodeName.nameTw,
        'productCodeName': this.dataForm.productCodeName.nameTw,
        'itemCodeName': this.dataForm.componentCodeName,
        'projectName': this.dataForm.projectName,
        'regionName': this.dataForm.regionName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'resourceName': this.dataForm.resourceId,
        'realCost': this.dataForm.realCost,
        'month': this.dataForm.month,
        'ifDisZero': this.dataForm.checked,
        'uin': this.$cookie.get('uin')
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/exportList`, params, { responseType: 'blob' }).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = this.dataForm.month + '--账单明细.csv'
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
      this.cost()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
      this.cost()
    },
    // 获取产品列表
    getProductInfo () {
      var params = {
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/cloud-product/getProduct`, params).then((res) => {
        this.getProductList = res.list
      })
    },
    // 获取子产品列表
    getChildInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      this.dataForm.productCodeName = ''
      this.dataForm.componentCodeName = ''
      var params = {
        'parentCode': this.dataForm.businessCodeName.code
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/cloud-product/getProduct`, params).then((res) => {
        this.getChildList = res.list
      })
      this.getComponentList = []
      this.getDataList()
      this.cost()
    },
    // 获取组件列表
    getComponentInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      this.dataForm.componentCodeName = ''
      var params = {
        'projectCode': this.dataForm.productCodeName.code
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tcloudsubgroup/getSubByParent`, params).then((res) => {
        this.getComponentList = res.list
      })
      this.getDataList()
      this.cost()
    },
    // 改变组件选项，刷新datagrid和费用项
    getInfo () {
      this.getDataList()
      this.cost()
    },
    // 获取项目列表
    getProjectInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      var params = {
        'month': this.dataForm.month
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/projectList`, params).then((res) => {
        this.getProjectList = res.projectList
      })
      this.getDataList()
      this.cost()
    },
    // 获取区域列表
    getRegionInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      var params = {
        'month': this.dataForm.month
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/regionList`, params).then((res) => {
        this.getRegionList = res.regionList
      })
      this.getDataList()
      this.cost()
    },
    // 获取计费模式列表
    getPayModeInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      var params = {
        'month': this.dataForm.month
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/payModeList`, params).then((res) => {
        this.getPayModeList = res.payModeList
      })
      this.getDataList()
      this.cost()
    },
    // 获取交易类型列表
    getActionTypeInfo () {
      this.pageIndex = 1
      this.pageSize = 10
      var params = {
        'month': this.dataForm.month
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/actionTypeList`, params).then((res) => {
        this.getActionTypeList = res.actionTypeList
      })
      this.getDataList()
      this.cost()
    },
    // 0元费用
    getCharge () {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
      this.cost()
    },
    reminder1 () {
      if (this.dataForm.businessCodeName.code) {
        return this.$t('BILL.BILL.Detail.label1')
      } else {
        return this.$t('BILL.BILL.Detail.label2')
      }
    },
    reminder2 () {
      if (this.dataForm.productCodeName.code) {
        return this.$t('BILL.BILL.Detail.label3')
      } else {
        return this.$t('BILL.BILL.Detail.label4')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .mod{
    color: #000;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    font-size: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    // display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin-bottom: 20px;
    .mod-mar{
      margin-right: 20px;
    }
  }
  .mod-from{
      width: 96%;
      margin: 0 auto;
    }
  .mod-table{
   width: 96%;
      padding: 20px;
      background-color: #fff;
      margin: 0 auto;
    .pagination{
    background: rgb(255, 255, 255);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    }
    .mod-box{
      display: table;
      width: 100%;
      padding-bottom: 10px;
      background: #fff;
      .mod-left, .mod-right{
      display: table-cell;
    vertical-align: middle;
    }
    }
  }
  .el-form-item__content .el-select {
    margin-right: 10px;
  }
  .el-select .el-input{
    width: 200px;
  }
</style>
