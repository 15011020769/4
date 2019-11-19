<template>
  <div class="mod-role">
    <span style="font-size: 18px; font-weight: 600; line-height:3;">账单管理</span>
    <el-date-picker v-model="dataForm.month" type="month" size="small" style="padding-left: 5px;">
    </el-date-picker>
    <span>按扣费周期(按扣费时间统计生产月度账单)</span>
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.businessCodeName" placeholder="全部产品">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.productCodeName" placeholder="请先选择产品">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.componentCodeName" placeholder="请先子选择产品">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.projectName" placeholder="全部项目">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.regionName" placeholder="全部区域">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.payModeName" placeholder="全部计费模式" style="line-height:4;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-select v-model="dataForm.actionTypeName" placeholder="全部交易类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
          </el-option>
        </el-select>
        <el-checkbox v-model="dataForm.checked" style="padding-left: 15px;">不显示0元费用</el-checkbox>
      </el-form-item>
      <el-form-item>
        <span>总费用：</span>
        <span style="font-size: 20px; color: #006eff;">{{dataForm.allCoat}} 元</span>
        <span> = 现金支付 {{dataForm.cashPayment}} 元 + 赠送金支付 {{dataForm.freePayment}} 元 + 代金券支付 {{dataForm.voucherPayment}} 元</span>
      </el-form-item>
      <el-form-item style="padding-left: 26.5%;">
        <el-input placeholder="资源实例ID" suffix-icon="el-icon-search" clearable v-model="dataForm.resourceId">
        </el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" icon="el-icon-download" @click="download"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%" v-loading="dataListLoading">
      <el-table-column prop="resourceId" header-align="center" align="center" width="120" fixed label="资源实例ID">
      </el-table-column>
      <el-table-column prop="businessCodeName" header-align="center" align="center" width="120" fixed label="产品名称">
      </el-table-column>
      <el-table-column prop="payModeName" header-align="center" align="center" width="120" label="计费模式">
      </el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" width="120" label="项目">
      </el-table-column>
      <el-table-column prop="regionName" header-align="center" align="center" width="150" label="区域">
      </el-table-column>
      <el-table-column prop="zoneName" header-align="center" align="center" width="120" label="可用区">
      </el-table-column>
      <el-table-column prop="productCodeName" header-align="center" align="center" width="120" label="子产品名称">
      </el-table-column>
      <el-table-column prop="actionTypeName" header-align="center" align="center" width="150" label="交易类型">
      </el-table-column>
      <el-table-column prop="orderId" header-align="center" align="center" width="120" label="订单ID">
      </el-table-column>
      <el-table-column prop="billId" header-align="center" align="center" width="150" label="交易ID">
      </el-table-column>
      <el-table-column prop="payTime" header-align="center" align="center" width="120" label="扣费时间">
      </el-table-column>
      <el-table-column prop="feeBeginTime" header-align="center" align="center" width="120" label="开始使用时间">
      </el-table-column>
      <el-table-column prop="feeEndTime" header-align="center" align="center" width="120" label="结束使用时间">
      </el-table-column>
      <el-table-column prop="componentCodeName" header-align="center" align="center" width="120" label="组件类型">
      </el-table-column>
      <el-table-column prop="itemCodeName" header-align="center" align="center" width="120" label="组件名称">
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
import axios from 'axios'
// import moment from "moment"
export default {
  data() {
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
        businessCodeName: '',
        productCodeName: '',
        componentCodeName: '',
        projectName: '',
        regionName: '',
        payModeName: '',
        actionTypeName: '',
        resourceId: '',
        realCost: '',
        month: new Date(),
        checked: false,
        allCoat: '100',
        cashPayment: '70',
        freePayment: '20',
        voucherPayment: '10'
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 3,
      dataListLoading: false
    }
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      axios.post(`${VUE_APP_adminUrl}/taifucloud/tbilldetails/list`),
        {
          'page': this.pageIndex,
          'limit': this.pageSize,
          'businessCodeName': this.dataForm.businessCodeName,
          'productCodeName': this.dataForm.productCodeName,
          'componentCodeName': this.dataForm.componentCodeName,
          'projectName': this.dataForm.projectName,
          'regionName': this.dataForm.regionName,
          'payModeName': this.dataForm.payModeName,
          'actionTypeName': this.dataForm.actionTypeName,
          'resourceId': this.dataForm.resourceId,
          'realCost': this.dataForm.realCost,
          'month': this.dataForm.month,
          'checked': this.dataForm.checked
        }).then(({ data }) => {
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
    download() {
      console.log('download')
      this.$refs.iframe.src = this.$http.adornUrl('/taifucloud/tbilldetails/exportList')
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
    }
  }
}
</script>

