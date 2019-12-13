<template>
  <div class="Deal">

    <!-- title -->
    <div class="top">
      <span class="title-left">{{$t('BILL.Deal.title')}}</span>
      <el-select v-model="dataForm.projectId" :placeholder="$t('BILL.Detail.allProject')" @change="getProjectListInfo()" clearable size="small" style="padding-left: 25px;">
        <el-option v-for="item in getprojectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
        </el-option>
      </el-select>
    </div>

    <!-- 搜索 -->
    <div class="deal-content">
      <div class="deal-form">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
          <el-form-item class="item-1">
            <el-date-picker size="small" v-model="dataForm.date" @change="dataPick" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="item-3">
            <el-button type="primary" icon="el-icon-download" @click="download" size="small" plain v-loading="downloadLoading"></el-button>
          </el-form-item>
          <el-form-item class="item-2">
            <el-input :placeholder="$t('BILL.Deal.orderId')" size="small" clearable v-model="dataForm.orderId">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="search()"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- table -->
      <div class="deal-box">
        <el-table :data="dataList" class="table-content" v-loading="dataListLoading">
          <el-table-column prop="orderId" header-align="center" align="center" width="150" :label="$t('BILL.Deal.orderId')">
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" width="120" :label="$t('BILL.Deal.status')" :formatter="formatterStatus">
          </el-table-column>
          <el-table-column prop="projectName" header-align="center" align="center" width="120" :label="$t('BILL.Deal.projectId')">
          </el-table-column>
          <el-table-column prop="productName" header-align="center" align="center" width="120" :label="$t('BILL.Deal.goodsCategoryId')">
          </el-table-column>
          <el-table-column prop="realTotalCost" header-align="center" align="center" width="150" :label="$t('BILL.Deal.realTotalCost')">
          </el-table-column>
          <el-table-column prop="voucherDecline" header-align="center" align="center" width="150" :label="$t('BILL.Deal.voucherDecline')">
          </el-table-column>
          <el-table-column prop="policy" header-align="center" align="center" width="120" :label="$t('BILL.Deal.policy')">
          </el-table-column>
          <el-table-column prop="price" header-align="center" align="center" width="120" :label="$t('BILL.Deal.price')">
          </el-table-column>
          <el-table-column prop="totalCost" header-align="center" align="center" width="120" :label="$t('BILL.Deal.totalCost')">
          </el-table-column>
          <el-table-column prop="usdCost" header-align="center" align="center" width="120" :label="$t('BILL.Deal.usdCost')">
          </el-table-column>
          <el-table-column prop="ntCost" header-align="center" align="center" width="120" :label="$t('BILL.Deal.ntCost')">
          </el-table-column>
          <el-table-column prop="month" header-align="center" align="center" width="120" :label="$t('BILL.Deal.month')">
          </el-table-column>
          <!-- <el-table-column prop="currency" header-align="center" align="center" width="120" :label="$t('BILL.Deal.currency')" :formatter="formatterCurrency">
          </el-table-column> -->
          <el-table-column prop="createTime" header-align="center" align="center" width="160" :label="$t('BILL.Deal.createTime')">
          </el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailHandle(scope.row)">{{$t('BILL.Deal.details')}}</el-button>
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
import { PROJECT_LIST, ORDER_LIST } from '@/constants/BILL.js'     // 获取接口
export default {
  data() {
    return {
      dataForm: {       // 搜索控件
        projectId: '',  // 项目id
        orderId: '',    // 订单id
        date: ''        // 时间
      },
      dataList: [],         // 列表数组
      getprojectList: [],   // 项目列表
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: true,
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  components: {
    Detail
  },
  mounted() {
    this.getProjectListInfo()     // 获取项目列表
  },
  methods: {
    // 获取项目名称
    getProjectListInfo() {
      // 配置默认的项目，这个接口不返回默认项目
      var defaultProject = [{
        projectId: '',
        projectInfo: this.$t('BILL.Deal.allProject'),
        projectName: this.$t('BILL.Deal.allProject')
      }, {
        projectId: 0,
        projectInfo: this.$t('BILL.Deal.defaultProject'),
        projectName: this.$t('BILL.Deal.defaultProject')
      }]
      var params = {
        'allList': 0
      }
      this.axios.post(`${process.env.VUE_APP_serverUrl + PROJECT_LIST}`, params).then(data => {
        if (data && data.code === 0) {
          let projectArr = data.data
          this.getprojectList = defaultProject.concat(projectArr)
          this.pageIndex = 1
          this.getDataList()      // 获取项目成功之后 获取订单列表
        } else {
          this.getprojectList = []
        }
      })
      
    },

    // 点击日期获取数据
    dataPick(){
      this.pageIndex = 1
      this.getDataList()
    },

    // 获取数据列表
    getDataList() {
      var params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin'),
        'beginDate': this.dataForm.date[0],
        'endDate': this.dataForm.date[1]
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + ORDER_LIST}`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList = []
          let dataArr = data.page.list
          this.totalPage = data.page.totalCount
          // 根据项目id获取name
          dataArr.map((item1) => {
            this.getprojectList.map((item2) => {
              if(String(item1.projectId) === String(item2.projectId)){
                item1.projectName = item2.projectName
                this.dataList.push(item1)
              }
            })
          })
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.totalPage = 0
        }
      })
    },

    // 搜索
    search() {
      this.pageIndex = 1
      this.getDataList()
    },

    // 过滤订单状态
    formatterStatus(row, column, cellValue) {
      if (cellValue === '1') {
        return this.$t('BILL.Deal.noPay')
      } else if (cellValue === '2') {
        return this.$t('BILL.Deal.paid')
      } else if (cellValue === '3') {
        return this.$t('BILL.Deal.delivering')
      } else if (cellValue === '4') {
        return this.$t('BILL.Deal.delivered')
      } else if (cellValue === '5') {
        return this.$t('BILL.Deal.deliverFail')
      } else if (cellValue === '6') {
        return this.$t('BILL.Deal.refund')
      } else if (cellValue === '7') {
        return this.$t('BILL.Deal.close')
      } else if (cellValue === '8') {
        return this.$t('BILL.Deal.past')
      } else if (cellValue === '9') {
        return this.$t('BILL.Deal.orderInvalid')
      } else if (cellValue === '10') {
        return this.$t('BILL.Deal.proInvalid')
      } else if (cellValue === '11') {
        return this.$t('BILL.Deal.refuse')
      } else if (cellValue === '12') {
        return this.$t('BILL.Deal.paying')
      }
    },

    // 下载
    download() {
      var params = {
        'projectId': this.dataForm.projectId,
        'orderId': this.dataForm.orderId,
        'orderOwner': this.$cookie.get('uin')
      }
      this.downloadLoading = true
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
        this.downloadLoading = false
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
    
    // 点击详情
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
      .item-1 {
        float: left;
      }
      .item-2,
      .item-3 {
        float: right;
      }
      ::v-deep .el-form-item {
        margin-bottom: 10px;
      }
    }
    .deal-box {
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
    }
  }
}
</style>
