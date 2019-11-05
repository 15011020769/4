<template>
  <div class="Cbs-renewal">
    <el-dialog :visible.sync="renewalShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="720px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>确定将 {{Cbsdata.DiskId}}({{Cbsdata.DiskName}})设为自动续费？</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
      <p>设置自动续费后，在账户余额充足的情况下，云硬盘到期后将按月自动续费，避免忘记续费导致云硬盘被回收。</p>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="renewal">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    renewalShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {}
  },
  components: {},
  created () {
    console.log(this.Cbsdata)
  },
  methods: {
    // 卸载确定
    renewal () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        RenewFlag: 'NOTIFY_AND_AUTO_RENEW'
      }

      this.axios.post('cbs2/ModifyDisksRenewFlag', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('renewalShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '设置自动续费成功',
            type: 'success'
          })
        }
      })
    },
    // 取消
    close () {
      this.$emit('renewalShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cbs-renewal {
  a {
    cursor: pointer;
  }
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
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
    font-size: 12px;
    line-height: 20px;
  }
  .Cbs-mountbottom {
    margin-bottom: 15px;
  }
  h2 {
    color: black;
    font-size: 14px;
  }
}
</style>
