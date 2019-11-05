<template>
  <div class="delete">
    <el-dialog :visible.sync="moveOutShow.moveOutState" width="29.68%" :show-close="false">
      <div class="title">
        <h3>移出实例</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <p>确认要移出所选实例?</p>
      </div>
      <div class="footer">
        <el-button type="primary" @click="MoveSure()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    moveOutShow: {
      type: Object,
      default: () => []
    }
  },
  created() {
    console.log(this.moveOutShow);
  },
  methods: {
    MoveSure() {
      let url = "";
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2")
      };
      if (this.moveOutShow.moveOutType === 0) {
        params["SecurityGroupIds.0"] = this.moveOutShow.moveOutId;
        if (this.moveOutShow.moveOutList.length !== undefined) {
          for (let i = 0; i < this.moveOutShow.moveOutList.length; i++) {
            params["InstanceIds." + i] = this.moveOutShow.moveOutList[
              i
            ].InstanceId;
          }
        } else {
          params["InstanceIds.0"] = this.moveOutShow.moveOutList.InstanceId;
        }
        url = "cvm2/DisassociateSecurityGroups";
      } else if (this.moveOutShow.moveOutType === 1) {
        params["sgIds.0"] = this.moveOutShow.moveOutId;
        if (this.moveOutShow.moveOutList.length !== undefined) {
          for (let i = 0; i < this.moveOutShow.moveOutList.length; i++) {
            params["networkInterfaceIds." + i] = this.moveOutShow.moveOutList[
              i
            ].NetworkInterfaceId;
          }
        } else {
          params[
            "networkInterfaceIds.0"
          ] = this.moveOutShow.moveOutList.NetworkInterfaceId;
        }
        url = "vpc/DisassociateNetworkInterfaceSecurityGroups";
      } else if (this.moveOutShow.moveOutType === 2) {
        params["SecurityGroupId"] = this.moveOutShow.moveOutId;
        if (this.moveOutShow.moveOutList.length !== undefined) {
          for (let i = 0; i < this.moveOutShow.moveOutList.length; i++) {
            params["InstanceIds." + i] = this.moveOutShow.moveOutList[
              i
            ].InstanceId;
          }
        } else {
          params["InstanceIds.0"] = this.moveOutShow.moveOutList.InstanceId;
        }
        url = "cdb/DisassociateSecurityGroups";
      } else if (this.moveOutShow.moveOutType === 3) {
        params["SecurityGroupId"] = this.moveOutShow.moveOutId;
        if (this.moveOutShow.moveOutList.length !== undefined) {
          for (let i = 0; i < this.moveOutShow.moveOutList.length; i++) {
            params["loadBalancerIds." + i] = this.moveOutShow.moveOutList[
              i
            ].LoadBalancerId;
          }
        } else {
          params[
            "loadBalancerIds.0"
          ] = this.moveOutShow.moveOutList.LoadBalancerId;
        }
        url = "cdb/DisassociateSecurityGroups";
      }
      this.axios
        .post(url, params)
        .then(data => {
          this.$message({
            message: "移出成功",
            type: "success"
          });
          this.$emit("update");
          this.cancel();
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.delete {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px;
  }
  ::v-deep .el-dialog {
    padding: 20px;
  }
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > h3 {
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .body {
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 27px;
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 27px;
    /* 确定--取消按钮 */
    .el-button {
      width: 66px !important;
      padding: 0px;
      height: 30px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>

