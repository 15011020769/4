<template>
  <div class="mod-role">
    <span style="font-size: 18px; font-weight: 600; line-height:3;">订单管理</span>
    <!-- <el-select style="width: 120px; padding-left: 15px;" v-model="value">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        size="mini">
      </el-option>
    </el-select> -->
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <!-- <el-form-item>
        <el-button-group>
            <el-button type="primary" @click="currentMonth">本月</el-button>
            <el-button type="primary" @click="lastMonth">上月</el-button>
            <el-button type="primary" @click="currentSeason">本季度</el-button>
            <el-button type="primary" @click="lastSeason">上季度</el-button>
        </el-button-group>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-date-picker
            v-model="dataForm.beginDate"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0">
        </el-date-picker>
        <el-date-picker
            v-model="dataForm.endDate"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
        </el-date-picker>
      </el-form-item>  -->
      <el-form-item>
        <el-input placeholder="项目" clearable v-model="dataForm.projectId">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="订单编号" clearable v-model="dataForm.orderId">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" icon="el-icon-download" @click="download"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%" v-loading="dataListLoading">
      <el-table-column prop="orderId" header-align="center" align="center" width="120" label="订单编号">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="120" label="订单状态">
      </el-table-column>
      <el-table-column prop="payer" header-align="center" align="center" width="120" label="支付者">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="120" label="创建时间">
      </el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" width="120" label="创建人">
      </el-table-column>
      <el-table-column prop="realTotalCost" header-align="center" align="center" width="150" label="实际支付金额(分)">
      </el-table-column>
      <el-table-column prop="voucherDecline" header-align="center" align="center" width="150" label="代金券抵扣金额(分)">
      </el-table-column>
      <el-table-column prop="projectId" header-align="center" align="center" width="120" label="项目ID">
      </el-table-column>
      <el-table-column prop="goodsCategoryId" header-align="center" align="center" width="120" label="产品分类ID">
      </el-table-column>
      <el-table-column prop="productInfo" header-align="center" align="center" width="120" label="产品详情">
      </el-table-column>
      <el-table-column prop="timeSpan" header-align="center" align="center" width="120" label="时长">
      </el-table-column>
      <el-table-column prop="timeUnit" header-align="center" align="center" width="120" label="时间单位">
      </el-table-column>
      <el-table-column prop="currency" header-align="center" align="center" width="120" label="货币单位">
      </el-table-column>
      <el-table-column prop="policy" header-align="center" align="center" width="120" label="折扣率">
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" width="120" label="单价(分)">
      </el-table-column>
      <el-table-column prop="totalCost" header-align="center" align="center" width="120" label="原价(分)">
      </el-table-column>
      <el-table-column prop="usdCost" header-align="center" align="center" width="120" label="美元金额">
      </el-table-column>
      <el-table-column prop="ntCost" header-align="center" align="center" width="120" label="台币金额">
      </el-table-column>
      <el-table-column prop="month" header-align="center" align="center" width="120" label="订单所属月份">
      </el-table-column>
      <el-table-column prop="offset" header-align="center" align="center" width="120" label="数据偏移量">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <iframe ref="iframe" src="" style="display:none"></iframe>
  </div>
</template>

<script>
import axios from 'axios'
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
        projectId: '',
        orderId: ''
      },
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.dataForm.endDate) {
            return (
              time.getTime() > new Date(this.dataForm.endDate).getTime()
            )
          } else {
            return time.getTime() > Date.now() - 8.64e7
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.dataForm.beginDate) {
            return (
              time.getTime() < new Date(this.dataForm.beginDate).getTime() - 8.64e7 ||
              time.getTime() > Date.now()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      dataList: [],
      value: '',
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
      axios.post(this.$http.adornUrl('/taifucloud/torderdetails/list'),
        {
          'page': this.pageIndex,
          'limit': this.pageSize,
          'projectId': this.dataForm.projectId,
          'orderId': this.dataForm.orderId
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
    currentMonth() {
      console.log('方法三')
    },
    lastMonth() {
      console.log('方法三')
    },
    currentSeason() {
      console.log('方法四')
    },
    lastSeason() {
      console.log('方法五')
    },
    download() {
      var param = 'projectId=' + this.dataForm.projectId + '&orderId=' + this.dataForm.orderId
      this.$refs.iframe.src = this.$http.adornUrl('/taifucloud/torderdetails/exportList') + '?' + param
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
    created() {
      this.value = this.options[0].value
    }
  }
}
</script>

