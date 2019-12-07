<template>
  <el-dialog id="dealDetail" :title="$t('BILL.Deal.details')" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="110px">
      <el-form-item :label="$t('BILL.Deal.orderId')">
        <p>{{dataForm.orderId}}</p>
      </el-form-item>
      <el-form-item :label="$t('BILL.Deal.status')">
        <p>{{dataForm.statusName}}</p>
      </el-form-item>
      <el-form-item :label="$t('BILL.Deal.projectId')">
        <p>{{dataForm.projectName}}</p>
      </el-form-item>
      <el-form-item v-for="(item, index) in dataForm.productInfo" :key="index" :label="item.Name">
        <p>{{item.Value}}</p>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary">{{$t('BILL.Deal.back')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {}      // 数据
    }
  },
  methods: {
    init(row) {
      this.visible = true
      let info = row
      if(info.productInfo !== '[]'){
        info.productInfo = JSON.parse(info.productInfo)
      }
      info.statusName = this.statusFilter(info.status)
      this.dataForm = info
      console.log(this.dataForm)
    },

    // 订单状态
    statusFilter(cellValue) {            
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
    }
  }
}
</script>

<style lang="scss" scoped>
#dealDetail{
  ::v-deep .el-form-item__label{
    color: rgb(172, 166, 166);
    padding-right: 25px;
  }
}

</style>
