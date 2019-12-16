<template>
  <div class="mod-role">

    <!-- title 月份 -->
    <div class="mod">
      <span class="mod-mar">{{$t('BILL.Detail.title')}}</span>
      <el-date-picker v-model="dataForm.month" type="month" value-format="yyyy-MM" size="small" @change="getMonth(dataForm.month)" style="padding-left: 10px;">
      </el-date-picker>
      <span class="span-1">{{$t('BILL.Detail.note')}}</span>
    </div>

    <!-- 下拉选择 -->
    <div class="mod-from">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item>
          <!-- 产品 -->
          <el-select v-model="dataForm.businessCode" value-key="code" :placeholder="$t('BILL.Detail.allProduct')" @change="productClick()" clearable size="small">
            <el-option v-for="item in getProductList" :key="item.businessCode" :label="item.businessCodeName" :value="item.businessCode">
            </el-option>
          </el-select>
          <!-- 子产品 -->
          <!-- <el-select v-model="dataForm.productCodeName" value-key="code" :placeholder="reminder1()" @change="getComponentInfo()" clearable size="small">
            <el-option v-for="item in getChildList" :key="item.code" :label="item.nameTw" :value="item">
            </el-option>
          </el-select> -->
          <!-- 组件类型 -->
          <!-- <el-select v-model="dataForm.componentCodeName" :placeholder="reminder2()" @change="getInfo()" clearable size="small">
            <el-option v-for="item in getComponentList" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select> -->
          <!-- 项目 -->
          <el-select v-model="dataForm.projectName" :placeholder="$t('BILL.Detail.allProject')" @change="projectClick()" clearable size="small">
            <el-option v-for="item in getProjectList" :key="item.projectName" :label="item.projectName" :value="item.projectName">
            </el-option>
          </el-select>
          <!-- 区域 -->
          <!-- <el-select v-model="dataForm.regionName" :placeholder="$t('BILL.Detail.allArea')" @change="getRegionInfo()" clearable size="small">
            <el-option v-for="item in getRegionList" :key="item.regionName" :label="item.regionName" :value="item.regionName">
            </el-option>
          </el-select> -->
          <!-- 计费模式 -->
          <el-select v-model="dataForm.payModeName" :placeholder="$t('BILL.Detail.allpayMode')" @change="payClick()" clearable size="small">
            <el-option v-for="item in getPayModeList" :key="item.payModeName" :label="item.payModeName" :value="item.payModeName">
            </el-option>
          </el-select>
          <!-- 交易类型 -->
          <el-select v-model="dataForm.actionTypeName" :placeholder="$t('BILL.Detail.allActionType')" @change="actionTypeClick()" clearable size="small">
            <el-option v-for="item in getActionTypeList" :key="item.actionTypeName" :label="item.actionTypeName" :value="item.actionTypeName">
            </el-option>
          </el-select>
          <el-checkbox v-model="dataForm.checked" style="padding-left: 15px;" @change="getCharge()">
            {{$t('BILL.Detail.filter')}}
          </el-checkbox>
        </el-form-item>
      </el-form>
    </div>

    <!-- 费用计算 -->
    <div class="mod-box">
      <div class="mod-left">
        <span style="font-size: 14px;">{{$t('BILL.Detail.allCast')}}: </span>
        <span style="font-size: 16px; color: #006eff;">NT$ {{dataForm.allCoat}}</span>
      </div>
      <div class="mod-right">
        <div style="float: right;">
          <el-button type="primary" icon="el-icon-download" @click="download" size="small" plain v-loading="downloadLoading"></el-button>
        </div>
        <div style="float: right; padding-right:5px;">
          <el-input :placeholder="$t('BILL.Detail.resourceId')" clearable v-model="dataForm.resourceId" size="small">
            <el-button type="primary" @click="search()" slot="append" icon="el-icon-search" size="small"></el-button>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="mod-table">
      <el-table :data="dataList" class="table-content" style="width: 100%" v-loading="dataListLoading" size="small">
        <el-table-column prop="resourceId" header-align="center" align="center" width="140" fixed :label="$t('BILL.Detail.resourceId')">
        </el-table-column>
        <el-table-column prop="businessCodeName" header-align="center" align="center" width="140" fixed :label="$t('BILL.Detail.productName')">
        </el-table-column>
        <el-table-column prop="payModeName" header-align="center" align="center" width="120" :label="$t('BILL.Detail.payMode')">
        </el-table-column>
        <el-table-column prop="projectName" header-align="center" align="center" width="120" :label="$t('BILL.Detail.projectName')">
        </el-table-column>
        <el-table-column prop="regionName" header-align="center" align="center" width="200" :label="$t('BILL.Detail.regionName')">
        </el-table-column>
        <el-table-column prop="zoneName" header-align="center" align="center" width="120" :label="$t('BILL.Detail.zoneName')">
        </el-table-column>
        <el-table-column prop="productCodeName" header-align="center" align="center" width="200" :label="$t('BILL.Detail.productCodeName')">
        </el-table-column>
        <el-table-column prop="actionTypeName" header-align="center" align="center" width="150" :label="$t('BILL.Detail.actionTypeName')">
        </el-table-column>
        <el-table-column prop="orderId" header-align="center" align="center" width="120" :label="$t('BILL.Detail.orderId')">
        </el-table-column>
        <el-table-column prop="billId" header-align="center" align="center" width="150" :label="$t('BILL.Detail.billId')">
        </el-table-column>
        <el-table-column prop="payTime" header-align="center" align="center" width="150" :label="$t('BILL.Detail.payTime')">
        </el-table-column>
        <el-table-column prop="feeBeginTime" header-align="center" align="center" width="150" :label="$t('BILL.Detail.feeBeginTime')">
        </el-table-column>
        <el-table-column prop="feeEndTime" header-align="center" align="center" width="150" :label="$t('BILL.Detail.feeEndTime')">
        </el-table-column>
        <el-table-column prop="componentCodeName" header-align="center" align="center" width="120" :label="$t('BILL.Detail.componentCodeName')">
        </el-table-column>
        <el-table-column prop="itemCodeName" header-align="center" align="center" width="150" :label="$t('BILL.Detail.itemCodeName')">
        </el-table-column>
        <el-table-column prop="singlePrice" header-align="center" align="center" width="120" :label="$t('BILL.Detail.singlePrice')">
        </el-table-column>
        <el-table-column prop="specifiedPrice" header-align="center" align="center" width="120" :label="$t('BILL.Detail.specifiedPrice')">
        </el-table-column>
        <el-table-column prop="priceUnit" header-align="center" align="center" width="120" :label="$t('BILL.Detail.priceUnit')">
        </el-table-column>
        <el-table-column prop="usedAccount" header-align="center" align="center" width="120" :label="$t('BILL.Detail.usedAccount')">
        </el-table-column>
        <el-table-column prop="usedAccountUnit" header-align="center" align="center" width="120" :label="$t('BILL.Detail.usedAccountUnit')">
        </el-table-column>
        <el-table-column prop="timeSpan" header-align="center" align="center" width="120" :label="$t('BILL.Detail.timeSpan')">
        </el-table-column>
        <el-table-column prop="timeUnitName" header-align="center" align="center" width="120" :label="$t('BILL.Detail.timeUnitName')">
        </el-table-column>
        <el-table-column prop="cost" header-align="center" align="center" width="120" :label="$t('BILL.Detail.cost')">
        </el-table-column>
        <el-table-column prop="qcloudDiscount" header-align="center" align="center" width="120" :label="$t('BILL.Detail.qcloudDiscount')">
        </el-table-column>
        <el-table-column prop="tfcDiscount" header-align="center" align="center" width="120" :label="$t('BILL.Detail.tfcDiscount')">
        </el-table-column>
        <el-table-column prop="reduceType" header-align="center" align="center" width="120" :label="$t('BILL.Detail.reduceType')">
        </el-table-column>
        <el-table-column prop="realCost" header-align="center" align="center" width="120" :label="$t('BILL.Detail.realCost')">
        </el-table-column>
        <el-table-column prop="voucherPayAmount" header-align="center" align="center" width="120" :label="$t('BILL.Detail.voucherPayAmount')">
        </el-table-column>
        <el-table-column prop="cashPayAmount" header-align="center" align="center" width="120" :label="$t('BILL.Detail.cashPayAmount')">
        </el-table-column>
        <el-table-column prop="incentivePayAmount" header-align="center" align="center" width="140" :label="$t('BILL.Detail.incentivePayAmount')">
        </el-table-column>
        <el-table-column prop="usdExpenditure" header-align="center" align="center" width="120" :label="$t('BILL.Detail.usdExpenditure')">
        </el-table-column>
        <el-table-column prop="ntExpenditure" header-align="center" align="center" width="120" :label="$t('BILL.Detail.ntExpenditure')">
        </el-table-column>
        <el-table-column prop="month" header-align="center" align="center" width="120" :label="$t('BILL.Detail.month')">
        </el-table-column>
      </el-table>
      <div class="table-page">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" style="width:100%; text-align:right;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { PRODUCT_LIST, ADMIN_PROJECT, PAY_MODEL_LIST, ACTION_TYPE_LIST, BILL_LIST, GET_PAY_AMOUNT, EXPORTLIST } from '@/constants/BILL.js'     // 获取接口
export default {
  data() {
    return {
      dataForm: {
        month: moment(new Date()).format('YYYY-MM'),                // 默认月份
        businessCode: '',                         // 选中的产品代码
        projectName: '',          // 项目名称
        payModeName: '',          // 计费模式
        actionTypeName: '',       // 交易类型
        resourceId: '',           // 资源实例id
        realCost: '',
        checked: false,
        allCoat: '0',             // 总费用
      },
      dataList: [],
      getProductList: [],       // 产品列表
      getChildList: [],
      getProjectList: [],       // 项目列表
      getRegionList: [],
      getPayModeList: [],       // 获取计费模式
      getActionTypeList: [],    // 获取交易类型
      getComponentList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      downloadLoading: false
    }
  },
  mounted() {
    this.getProductInfo()     // 获取产品列表
    this.getProjectInfo()     // 获取项目列表
    this.getPayModeInfo()     // 获取计费模式列表
    this.getActionTypeInfo()  // 获取交易类型列表
    this.getDataList()        // 获取数据列表 
  },
  methods: {

    // 点击下拉月份
    getMonth(mon) {
      this.pageIndex = 1
      this.dataForm.month = mon           // 2019-11
      this.getDataList()                  // 获取账单列表
    },

    // 获取产品列表
    getProductInfo() {
      var params = {
        'uin': this.$cookie.get('uin'),
        'month': this.dataForm.month,
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + PRODUCT_LIST}`, params).then((res) => {
        this.getProductList = res.productList
      })
    },

    // 点击产品
    productClick() {
      this.pageIndex = 1
      this.getDataList()        // 获取数据列表
    },

    // 获取项目列表
    getProjectInfo() {
      var params = {
        'month': this.dataForm.month,
        'uin': this.$cookie.get('uin'),
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + ADMIN_PROJECT}`, params).then((res) => {
        this.getProjectList = res.projectList
      })
    },

    // 点击项目
    projectClick() {
      this.pageIndex = 1
      this.getDataList()        // 获取数据列表
    },

    // 获取计费模式列表
    getPayModeInfo() {
      var params = {
        'month': this.dataForm.month
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + PAY_MODEL_LIST}`, params).then((res) => {
        this.getPayModeList = res.payModeList
      })
    },

    // 点击计费模式
    payClick() {
      this.pageIndex = 1
      this.getDataList()        // 获取数据列表
    },

    // 获取交易类型列表
    getActionTypeInfo() {
      var params = {
        'month': this.dataForm.month
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + ACTION_TYPE_LIST}`, params).then((
        res) => {
        this.getActionTypeList = res.actionTypeList
      })
    },

    // 点击交易类型
    actionTypeClick() {
      this.pageIndex = 1
      this.getDataList()        // 获取数据列表
    },

    // 获取数据列表
    getDataList() {
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'uin': this.$cookie.get('uin'),
        'month': this.dataForm.month,
        'businessCode': this.dataForm.businessCode,
        'projectName': this.dataForm.projectName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'ifDisZero': this.dataForm.checked,
      }
      this.dataListLoading = true
      this.axios.post(`${process.env.VUE_APP_adminUrl + BILL_LIST}`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
          this.cost()     // 查询完数据之后 获取总费用
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },

    // 点击每页select显示的条数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },

    // 点击页码
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },

    // 搜索
    search() {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },

    // 总费用计算
    cost() {
      var params = {
        'uin': this.$cookie.get('uin'),
        'month': this.dataForm.month,
        'businessCode': this.dataForm.businessCode,
        'projectName': this.dataForm.projectName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'ifDisZero': this.dataForm.checked,
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + GET_PAY_AMOUNT}`, params).then(data => {
        if (data.payAmount != null && data.code === 0) {
          this.dataForm.allCoat = data.payAmount.totalAmount
        } else {
          this.dataForm.allCoat = 0
          this.dataForm.cashPayment = 0
          this.dataForm.freePayment = 0
          this.dataForm.voucherPayment = 0
        }
      })
    },

    // 下载
    download() {
      var params = {
        'uin': this.$cookie.get('uin'),
        'month': this.dataForm.month,
        'businessCode': this.dataForm.businessCode,
        'projectName': this.dataForm.projectName,
        'payModeName': this.dataForm.payModeName,
        'actionTypeName': this.dataForm.actionTypeName,
        'resourceId': this.dataForm.resourceId,
        'ifDisZero': this.dataForm.checked,
      }
      this.downloadLoading = true
      this.axios.post(`${process.env.VUE_APP_adminUrl + EXPORTLIST}`, params, {
        responseType: 'blob'
      }).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = this.dataForm.month + '--賬單明細.csv'
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
        this.downloadLoading = false
      })
    },

    // 0元费用
    getCharge() {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
    },


    // 获取子产品列表
    // getChildInfo() {
    //   this.pageIndex = 1
    //   this.pageSize = 10
    //   this.dataForm.productCodeName = ''
    //   this.dataForm.componentCodeName = ''
    //   var params = {
    //     'parentCode': this.dataForm.businessCodeName.code
    //   }
    //   this.axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/cloud-product/getProduct`, params).then((res) => {
    //     this.getChildList = res.list
    //   })
    //   this.getComponentList = []
    //   this.getDataList()
    //   this.cost()
    // },
    // 获取组件列表
    // getComponentInfo() {
    //   this.pageIndex = 1
    //   this.pageSize = 10
    //   this.dataForm.componentCodeName = ''
    //   var params = {
    //     'projectCode': this.dataForm.productCodeName.code
    //   }
    //   this.axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tcloudsubgroup/getSubByParent`, params).then((
    //     res) => {
    //     this.getComponentList = res.list
    //   })
    //   this.getDataList()
    //   this.cost()
    // },
    // 改变组件选项，刷新datagrid和费用项
    // getInfo() {
    //   this.getDataList()
    //   this.cost()
    // },

    // reminder1() {
    //   if (this.dataForm.businessCodeName.code) {
    //     return this.$t('BILL.Detail.label1')
    //   } else {
    //     return this.$t('BILL.Detail.label2')
    //   }
    // },
    // reminder2() {
    //   if (this.dataForm.productCodeName.code) {
    //     return this.$t('BILL.Detail.label3')
    //   } else {
    //     return this.$t('BILL.Detail.label4')
    //   }
    // }
  }
}

</script>
<style lang="scss" scoped>
.mod {
  color: #000;
  height: 50px;
  line-height: 50px;
  margin-bottom: 20px;
  padding: 0 20px;
  background: #fff;
  font-size: 16px;
  .span-1 {
    padding-left: 10px;
    font-size: 12px;
  }
}

.mod-from {
  padding: 0 20px;
  ::v-deep .el-form-item {
    margin-bottom: 12px;
  }
}

.mod-box {
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  .mod-left {
    float: left;
  }
  .mod-right {
    float: right;
    vertical-align: middle;
  }
}

.mod-table {
  margin: 0 20px;
  background-color: #fff;
  min-height: 520px;
  clear: both;
  margin-bottom: 20px;

  .table-content {
    min-height: 450px;
  }
  .table-page {
    width: 100%;
    height: 70px;
    .el-pagination {
      padding-top: 22px;
    }
  }

  .pagination {
    background: rgb(255, 255, 255);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    line-height: 30px;
  }

  .mod-box {
    display: table;
    width: 100%;
    padding-bottom: 10px;
    background: #fff;
  }
}

.el-form-item__content .el-select {
  margin-right: 10px;
}

.el-select .el-input {
  width: 200px !important;
}
</style>
