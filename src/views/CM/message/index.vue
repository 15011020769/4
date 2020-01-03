<template>
  <div class="message-wrap">
    <Header title="自定义消息" />
    <div class="overview-main">
      <div class="explain">
        <p>
          当月短信配额已用0条，剩余1000条可用。
          <a>购买短信</a>
        </p>
      </div>
    </div>
    <div class="table">
      <p class="addBtn">
        <el-row>
          <el-button type="primary">新增消息策略</el-button>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-setting"></i>
          <i class="el-icon-refresh"></i>
          <i class="el-icon-download"></i>
        </el-row>
      </p>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";

export default {
  name: "message",
  data() {
    return {};
  },
  components: {
    Header
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.strategy-wrap >>> .el-button,
.strategy-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.table {
  padding: 20px;
}

.message-wrap {
  a {
    color: #006eff;
    cursor: pointer;
  }
  a:hover {
    border-bottom: 1px solid #006eff;
  }
  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
</style>