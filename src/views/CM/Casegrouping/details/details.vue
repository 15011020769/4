<template>
  <div class="details">
    <div class="details-header">
      <div class="details-title">
        <div>
          <i class="el-icon-back" @click="back()"></i>
          <h2>{{ $route.query.groupName }}</h2>
        </div>
      </div>
      <div class="details-headerTab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('CVM.Casegrouping.slgl')" name="1">
            <div class="tab-box">
              <instance-management
                :Rules="rules"
                ref="child"
              ></instance-management>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('CVM.Casegrouping.gjcl')" name="2">
            <div class="tab-box">
              <alarm-strategy :Rules="rules" ref="child"></alarm-strategy>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('CVM.Casegrouping.bgrz')" name="3">
            <div class="tab-box">
              <change-log :Rules="rules" ref="child"></change-log>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import InstanceManagement from "./InstanceManagement"; // 实例管理
import AlarmStrategy from "./AlarmStrategy"; // 关联实例
import ChangeLog from "./ChangeLog"; // 关联实例
export default {
  data() {
    return {
      activeName: this.$route.query.type,
      id: "",
      name: "",
      rules: {
        instanceGroupId: this.$route.query.instanceGroupId,
        groupName: this.$route.query.groupName,
        viewName: this.$route.query.viewName
      }
    };
  },
  components: {
    InstanceManagement,
    AlarmStrategy,
    ChangeLog
  },
  created() {
    // console.log(this.$route.query);
    // let parms = {
    //   Version: "2017-03-12",
    //   Region: this.$cookie.get("regionv2"),
    //   "SecurityGroupIds.0": this.$route.query.SecurityGroupId
    // };
    // this.axios
    //   .post("vpc2/DescribeSecurityGroups", parms)
    //   .then(data => {
    //     console.log(data.Response.SecurityGroupSet[0]);
    //     this.id = data.Response.SecurityGroupSet[0].SecurityGroupId;
    //     this.name = data.Response.SecurityGroupSet[0].SecurityGroupName;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      // this.$router.go(0);
      this.$refs.child.ListInit();
    }
  }
};
</script>
<style lang="scss" scoped>
.details {
  .details-header {
    .details-title {
      padding: 10px 20px;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > i {
          font-size: 16px;
          font-weight: 700;
          color: #006eff;
          cursor: pointer;
          margin-right: 24px;
        }
        & > h2 {
          color: #171d25;
          font-size: 16px;
          font-weight: 700;
        }
      }
      & > a {
        font-size: 12px;
        color: #444;
        &:hover {
          color: #006eff;
          text-decoration: underline;
        }
        .iconfont {
          font-size: 12px;
          font-weight: 800;
        }
      }
    }
    .details-headerTab {
      .tab-box {
        margin: 20px;
        // background: #fff;
        // border: 1px solid #ddd;
        // padding-top: 20px;
      }
      ::v-deep .el-tabs__header {
        margin: 0px;
        background: #fff;
      }
      ::v-deep .el-tabs__nav-scroll {
        padding-left: 35px;
      }
      ::v-deep .el-tabs__item {
        height: 30px;
        line-height: 30px;
      }
      ::v-deep .el-tabs__content {
        margin: 0px;
      }
      ::v-deep .el-tabs__item.is-active {
        color: #000;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
}
</style>
