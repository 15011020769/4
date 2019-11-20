<template>
  <div class="mod-role">
    <span style="font-size: 18px; font-weight: 600; line-height:3;">订单管理</span>
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="项目ID" clearable v-model="dataForm.projectId">
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
      <div style='display:inline-block;' v-if="false">
        <el-table-column prop="payer" header-align="center" align="center" width="150" label="支付者">
        </el-table-column>
          <el-table-column prop="creator" header-align="center" align="center" width="160" label="创建人">
        </el-table-column>
          <el-table-column prop="productInfo" header-align="center" align="center" width="160" label="产品详情">
        </el-table-column>
          <el-table-column prop="offset" header-align="center" align="center" width="120" label="数据偏移量">
        </el-table-column>
        <el-table-column prop="timeSpan" header-align="center" align="center" width="120" label="时长">
        </el-table-column>
        <el-table-column prop="timeUnit" header-align="center" align="center" width="120" label="时间单位">
        </el-table-column>
      </div>
      <el-table-column prop="orderId" header-align="center" align="center" width="150" label="订单编号">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="120" label="订单状态" :formatter="formatterStatus">
      </el-table-column>
       <el-table-column prop="projectId" header-align="center" align="center" width="120" label="项目ID">
      </el-table-column>
      <el-table-column prop="goodsCategoryId" header-align="center" align="center" width="120" label="产品分类ID">
      </el-table-column>
      <el-table-column prop="realTotalCost" header-align="center" align="center" width="150" label="实际支付金额(分)">
      </el-table-column>
      <el-table-column prop="voucherDecline" header-align="center" align="center" width="150" label="代金券抵扣金额(分)">
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
      <el-table-column prop="currency" header-align="center" align="center" width="120" label="货币单位" :formatter="formatterCurrency">
      </el-table-column>
       <el-table-column prop="createTime" header-align="center" align="center" width="160" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
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
      pageIndex: 1,
      pageSize: 10,
      totalPage: 3,
      dataListLoading: false
    }
  },
  components: {
    Detail
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      console.log(process.env.VUE_APP_adminUrl)
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderdetails/list`, params).then(data => {
        console.log('获取列表成功')
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
    download () {
      var params = {
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/torderdetails/exportList`, params, { responseType: 'blob' }).then(res => {
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
