<template>
  <div class="mod-role">
    <span style="font-size: 16px; font-weight: 700; line-height:3;">账单管理</span>
    <el-date-picker v-model="dataForm.month" type="month" value-format="yyyy-MM" size="small" @change="getDataList()" style="padding-left: 5px;">
    </el-date-picker>
    <span style="padding-left: 10px; font-size: 12px;">按扣费周期（按扣费时间统计生产月度账单）</span>
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.businessCodeName" value-key="code" placeholder="全部产品" @change="getChildInfo()" clearable size="small">
          <el-option v-for="item in getProductList" :key="item.code" :label="item.nameTw" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.productCodeName" value-key="code" placeholder="请先选择产品" @change="getComponentInfo()" clearable size="small">
          <el-option v-for="item in getChildList" :key="item.code" :label="item.nameTw" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.componentCodeName" placeholder="请先子选择产品" @change="getInfo()" clearable size="small">
          <el-option v-for="item in getComponentList" :key="item.name" :label="item.name" :value="item.name">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.projectName" placeholder="全部项目" @change="getProjectInfo()" clearable size="small">
          <el-option v-for="item in getProjectList" :key="item.projectName" :label="item.projectName" :value="item.projectName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.regionName" placeholder="全部区域" @change="getRegionInfo()" clearable size="small">
          <el-option v-for="item in getRegionList" :key="item.regionName" :label="item.regionName" :value="item.regionName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.payModeName" placeholder="全部计费模式" @change="getPayModeInfo()" clearable size="small">
          <el-option v-for="item in getPayModeList" :key="item.payModeName" :label="item.payModeName" :value="item.payModeName">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.actionTypeName" placeholder="全部交易类型" @change="getActionTypeInfo()" clearable size="small">
          <el-option v-for="item in getActionTypeList" :key="item.actionTypeName" :label="item.actionTypeName" :value="item.actionTypeName">
          </el-option>
        </el-select>
        <el-checkbox v-model="dataForm.checked" style="padding-left: 15px;" @change="getDataList()">不显示0元费用</el-checkbox>
      </el-form-item>
      <el-form-item>
        <span style="font-size: 14px;">总费用：</span>
        <span style="font-size: 16px; color: #006eff;">{{dataForm.allCoat}} 元</span>
        <span style="font-size: 14px;"> = 现金支付 {{dataForm.cashPayment}} 元 + 赠送金支付 {{dataForm.freePayment}} 元 + 代金券支付 {{dataForm.voucherPayment}} 元</span>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" icon="el-icon-download" @click="download" size="small"></el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="search()" size="small">搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-input placeholder="资源实例ID" clearable v-model="dataForm.resourceId" size="small">
        </el-input>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%" v-loading="dataListLoading" size="small">
      <el-table-column prop="resourceId" header-align="center" align="center" width="160" fixed label="资源实例ID">
      </el-table-column>
      <el-table-column prop="businessCodeName" header-align="center" align="center" width="160" fixed label="产品名称">
      </el-table-column>
      <el-table-column prop="payModeName" header-align="center" align="center" width="120" label="计费模式">
      </el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" width="120" label="项目">
      </el-table-column>
      <el-table-column prop="regionName" header-align="center" align="center" width="200" label="区域">
      </el-table-column>
      <el-table-column prop="zoneName" header-align="center" align="center" width="120" label="可用区">
      </el-table-column>
      <el-table-column prop="productCodeName" header-align="center" align="center" width="200" label="子产品名称">
      </el-table-column>
      <el-table-column prop="actionTypeName" header-align="center" align="center" width="150" label="交易类型">
      </el-table-column>
      <el-table-column prop="orderId" header-align="center" align="center" width="120" label="订单ID">
      </el-table-column>
      <el-table-column prop="billId" header-align="center" align="center" width="150" label="交易ID">
      </el-table-column>
      <el-table-column prop="payTime" header-align="center" align="center" width="150" label="扣费时间">
      </el-table-column>
      <el-table-column prop="feeBeginTime" header-align="center" align="center" width="150" label="开始使用时间">
      </el-table-column>
      <el-table-column prop="feeEndTime" header-align="center" align="center" width="150" label="结束使用时间">
      </el-table-column>
      <el-table-column prop="componentCodeName" header-align="center" align="center" width="120" label="组件类型">
      </el-table-column>
      <el-table-column prop="itemCodeName" header-align="center" align="center" width="150" label="组件名称">
      </el-table-column>
      <el-table-column prop="singlePrice" header-align="center" align="center" width="120" label="组件刊例价">
      </el-table-column>
      <el-table-column prop="specifiedPrice" header-align="center" align="center" width="120" label="组件指定价">
      </el-table-column>
      <el-table-column prop="priceUnit" header-align="center" align="center" width="120" label="价格单位">
      </el-table-column>
      <el-table-column prop="usedAccount" header-align="center" align="center" width="120" label="组件用量">
      </el-table-column>
      <el-table-column prop="usedAccountUnit" header-align="center" align="center" width="120" label="组件用量单位">
      </el-table-column>
      <el-table-column prop="timeSpan" header-align="center" align="center" width="120" label="使用时长">
      </el-table-column>
      <el-table-column prop="timeUnitName" header-align="center" align="center" width="120" label="时长单位">
      </el-table-column>
      <el-table-column prop="cost" header-align="center" align="center" width="120" label="组件原价">
      </el-table-column>
      <el-table-column prop="qcloudDiscount" header-align="center" align="center" width="120" label="腾讯云折扣率">
      </el-table-column>
      <el-table-column prop="tfcDiscount" header-align="center" align="center" width="120" label="台富云折扣率">
      </el-table-column>
      <el-table-column prop="reduceType" header-align="center" align="center" width="120" label="优惠类型">
      </el-table-column>
      <el-table-column prop="realCost" header-align="center" align="center" width="120" label="优惠后总价">
      </el-table-column>
      <el-table-column prop="voucherPayAmount" header-align="center" align="center" width="120" label="代金券支付金额">
      </el-table-column>
      <el-table-column prop="cashPayAmount" header-align="center" align="center" width="120" label="现金支付金额">
      </el-table-column>
      <el-table-column prop="incentivePayAmount" header-align="center" align="center" width="140" label="赠送账户支付金额">
      </el-table-column>
      <el-table-column prop="usdExpenditure" header-align="center" align="center" width="120" label="美金结算金额">
      </el-table-column>
      <el-table-column prop="ntExpenditure" header-align="center" align="center" width="120" label="台币结算金额">
      </el-table-column>
      <el-table-column prop="month" header-align="center" align="center" width="120" label="账单月份">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <iframe ref="iframe" src="" style="display:none"></iframe>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      options: [{
        value: '选项1',
        label: '全部项目'
      }, {
        value: '选项2',
        label: '默认项目'
      }, {
        value: '选项3',
        label: 'taifucloud'
      }, {
        value: '选项4',
        label: 'test'
      }],
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
        allCoat: '100',
        cashPayment: '70',
        freePayment: '20',
        voucherPayment: '10'
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
      totalPage: 3,
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
        // 'checked': this.dataForm.checked,
        'ifDisZero': this.dataForm.checked
      }
      this.dataListLoading = true
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/list`, params).then(data => {
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
    search () {
      this.pageIndex = 1
      this.pageSize = 10
      this.getDataList()
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
        'ifDisZero': this.dataForm.checked
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/getPayAmount`, params).then(data => {
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
        'ifDisZero': this.dataForm.checked
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/exportList`, params, { responseType: 'blob' }).then(res => {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/projectList`, params).then((res) => {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/regionList`, params).then((res) => {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/payModeList`, params).then((res) => {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/actionTypeList`, params).then((res) => {
        this.getActionTypeList = res.actionTypeList
      })
      this.getDataList()
      this.cost()
    }
  }
}
</script>
