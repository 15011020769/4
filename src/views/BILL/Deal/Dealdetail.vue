<template>
  <el-dialog :title="$t('BILL.BILL.Deal.details')" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="160px">
      <el-form-item :label="$t('BILL.BILL.Deal.orderId')" prop="orderId">
        <el-input v-model="dataForm.orderId" :disabled="true" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item :label="$t('BILL.BILL.Deal.productDetail')" prop="productInfo">
        <el-input type="textarea" :rows="8" v-model="dataForm.productInfo" :disabled="true" style="width: 400px;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary">{{$t('BILL.BILL.Deal.back')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        orderId: '',
        productInfo: ''
      }
    }
  },
  methods: {
    init (row) {
      this.visible = true
      this.dataForm.orderId = row.orderId
      let productList = JSON.parse(row.productInfo)
      var info = ''
      for (var i = 0; i < productList.length; i++) {
        info += productList[i].Name + '：' + productList[i].Value + '\n'
      }
      this.dataForm.productInfo = info
    }
  }
}
</script>
