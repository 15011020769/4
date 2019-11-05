<template>
  <div class="details">
    <div class="details-header">
      <div class="details-title">
        <div>
          <i class="el-icon-back" @click="back()"></i>
          <h2>{{id}}({{name}})</h2>
        </div>
        <a href="javascript:;">
          安全组帮助文档
          <i class="iconfont">&#xe614;</i>
        </a>
      </div>
      <div class="details-headerTab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="安全组规则" name="first">
            <div class="tab-box">
              <security-rules :Rules="rules"></security-rules>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关联实例" name="second">
            <div class="tab-box">
              <relation-example :Rules="rules"></relation-example>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import SecurityRules from "./SecurityRules"; // 安全组规则
import RelationExample from "./RelationExample"; // 关联实例
export default {
  data() {
    return {
      activeName: "first",
      id: "",
      name: "",
      rules: {
        SecurityGroupId: this.$route.query.SecurityGroupId
      }
    };
  },
  components: {
    SecurityRules,
    RelationExample
  },
  created() {
    console.log(this.$route.query);
    let parms = {
      Version: "2017-03-12",
      Region: this.$cookie.get("regionv2"),
      "SecurityGroupIds.0": this.$route.query.SecurityGroupId
    };
    this.axios
      .post("vpc2/DescribeSecurityGroups", parms)
      .then(data => {
        console.log(data.Response.SecurityGroupSet[0]);
        this.id = data.Response.SecurityGroupSet[0].SecurityGroupId;
        this.name = data.Response.SecurityGroupSet[0].SecurityGroupName;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    // 返回
    back() {
      this.$router.push({
        path: "SecurityGroup"
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
        background: #fff;
        border: 1px solid #ddd;
        padding-top: 20px;
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

