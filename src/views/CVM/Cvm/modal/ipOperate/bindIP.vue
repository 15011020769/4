<template>
  <div class="bindIP">
    <el-dialog :visible.sync="bindIPStatus.bindIPDialog" :show-close="false" width="35%">
      <div slot="title" class="title-wrap">
        <span>绑定弹性公网IP</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div style="margin-top: 10px;">
          <el-form ref="instanceInfo" :rules="rules" :model="instanceInfo" label-width="100px" class="instanceInfo">
            <el-form-item label="实例:" prop="instanceName">
              <span>{{instanceInfo.InstanceId}}({{instanceInfo.InstanceName}})</span>
            </el-form-item>
            <el-form-item label="当前IP" prop="nowIP">
              <span>{{instanceInfo.PublicIpAddresses?instanceInfo.PublicIpAddresses[0]:''}}<span style="color:red;">(此公网IP将被释放)</span></span>
            </el-form-item>
            <el-form-item label="新IP:" prop="newIP">
              <!-- <el-select v-model="instanceInfo.SecurityGroupIds" placeholder size="mini">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-form>
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
      userOptions: [
        {
          value: "1",
          label: "系统默认"
        },
        {
          value: "2",
          label: "指定用户名"
        }
      ],
      rules: {
        instanceName: [
          {
            required: true,
            message: "",
            trigger: "blur"
          }
        ],
        nowIP: [
          {
            required: true,
            message:
              "",
            trigger: "blur"
          }
        ],
        newIP: [
          { required: true, message: "", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    bindIPStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.bindIPStatus.InstanceItem[0];
  },
  computed: {

  },
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
.bindIP {
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

