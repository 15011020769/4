<template>
  <div class="returnIP">
    <el-dialog :visible.sync="returnIPStatus.returnIPDialog" :show-close="false" width="35%">
      <div slot="title" class="title-wrap">
        <span>释放公网IP</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div class="renewdetail">
          确定要释放实例：
          <span>{{instanceInfo.InstanceId}}({{instanceInfo.InstanceName}})</span>上的公网IP：
          <span>{{instanceInfo.PrivateIpAddresses?instanceInfo.PrivateIpAddresses[0]:""}}</span>
        </div>
        <div>
          <span>释放公网IP后将无法访问外网，建议您绑定弹性公网IP。</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">确定</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      instanceInfo: {},
    };
  },
  props: {
    returnIPStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.returnIPStatus.InstanceItem[0];
  },
  computed: {},
  methods: {
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.returnIP {
  ::v-deep .el-dialog__body {
    padding: 0px 20px 30px;
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
    }
  }
  .content {
    span {
      font-size: 12px;
    }
    .renewdetail {
      padding: 10px 20px;
      font-size: 12px;
      background: #e5f0ff;
      color: #003b80;
      border: 1px solid #97c7ff;
      span {
        font-weight: bolder;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 5px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
      top: 95%;
    }
  }
}
</style>

