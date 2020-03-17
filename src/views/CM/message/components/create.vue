<template>
  <div class="create-wrap">
    <Header title="新建消息策略" backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <p class="rowCont">
          <span>策略名称</span>
          <el-input
            style="width:330px;margin:0"
            v-model="formInline.strategy_name"
            placeholder="请输入策略名称，20字以内"
          ></el-input>
        </p>
        <div class="rowGaojing">
          <span style>告警接收组</span>
          <p class="tip">
            您可到访问
            <a>管理控制台</a>修改用户和用户组信息
            <br />
          </p>
        </div>
        <Transfer style="margin-left:80px;" :multipleSelection="multipleSelection"></Transfer>
        <div class="qudao">
          <span>告警渠道</span>
          <div class="qudaoContent">
            <p>
              <el-checkbox v-model="checked1">邮件</el-checkbox>
            </p>
            <p>
              <el-checkbox v-model="checked2">短信</el-checkbox>
            </p>
          </div>
        </div>

        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "./Header";
import Transfer from "./transfer";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ADD_CUSTON_MESSAGE } from "@/constants/CM-lxx.js"; /////////

export default {
  data() {
    return {
      multipleSelection: [], //穿梭框数据
      checked1: "", //邮件
      checked2: "", //短信
      input: "",
      input1: "",
      tableData: [],
      options: [],
      values: "",
      formInline: {
        strategy_name: "", //策略名称
        textarea: "", //备注
        strategy: "云服务器-基础监控",
        strategy_kind: [
          {
            value: 0,
            name: "云服务器-基础监控"
          }
        ], //策略类型
        alarm: "", //策略类型
        projectName: "默认项目",
        project: [
          {
            value: 0,
            name: "默认项目"
          }
        ]
      }
    };
  },
  components: {
    Header,
    Transfer
  },
  methods: {
    //确定
    save() {
      this.$router.push({
        path: "/message"
      });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.create-wrap >>> .el-button,
.create-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.create-main {
  padding: 20px 35px;
}
.box {
  width: 100%;
  height: 100%;
  color: #888;
  background: white;
  padding: 20px;
  font-size: 12px;
  box-shadow: 1px 1px 5px #cccccc;
  p.rowCont {
    padding: 10px 0;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  .qudao {
    display: flex;
    p:nth-last-child(1) {
      margin: 10px 0;
    }
  }
  .rowGaojing {
    display: flex;
    width: 100%;
    .tip {
      flex: 1;
      padding: 20px;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
    }
  }
  input {
    margin: 0;
  }
  > div {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 80px;
    }
  }

  .table {
    margin-top: 20px;
  }
  .foot {
    // margin: 10px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
}
.box >>> .el-input {
  width: 200px;
  height: 30px;
  margin-left: 20px;
}
</style>