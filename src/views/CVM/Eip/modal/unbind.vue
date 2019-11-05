<template>
  <div class="renew">
    <el-dialog :visible.sync="unbindObj.unbindShow" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>释放弹性公网IP</span>
        <i class="el-icon-close" @click="handleCancel"></i>
      </div>
      <div class="content">
        <div class="p-desc">
          <p>确定将该弹性公网IP:{{unbindObj.unbindInfo.AddressIp}} 与绑定的弹性网卡：{{unbindObj.unbindInfo.NetworkInterfaceId}}</p>
          <p>解绑后，可能会导致您的{{unbindObj.unbindInfo.NetworkInterfaceId}} 实例的网络不通，请您提前做好准备</p>
        </div>
        <div>
          <span class="span-t">费用</span>
          <span class="span-s">
            该弹性公网IP解绑后将收取闲置费用
            <span class="span-p">0.20元/小时</span>
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submitForm()">确定</el-button>
          <el-button size="mini" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      basic: true,
      currentIndex: 0
    }
  },
  props: {
    unbindObj: {
      type: Object,
      default: () => []
    }
  },
  created () {
    // console.log(this.unbindObj.unbindInfo.AddressIp)
  },
  methods: {
    tableRowStyle ({ row, rowIndex }) {
      return {
        'font-size': '12px'
      }
    },
    handlePack () {
      this.basic = !this.basic
    },
    submitForm () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'AddressId': this.unbindObj.unbindInfo.AddressId
      }
      this.axios.post('vpc2/DisassociateAddress', params).then(data => {
        // console.log(data)
        setTimeout(() => {
          this.$parent.getDataList() // 请求父组件的列表
        }, 1000)
        this.$emit('unbindShowVal', false)
      })
    },
    handleCancel () {
      this.$emit('unbindShowVal', false)
    },
    handleCheck (index) {
      this.currentIndex = index
      if (this.currentIndex <= 2) {
      }
    }
  },
  components: {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.renew {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .p-desc {
      font-size: 12px;
      line-height: inherit;
      padding: 10px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      margin-bottom: 20px;
    }
    .span-t {
      display: inline-block;
      color: #888;
      padding-right: 20px;
      white-space: nowrap;
      box-sizing: border-box;
    }
    .span-p {
      color: #ff7800;
      font-size: 24px;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
