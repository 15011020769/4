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
            @blur="reg"
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
        <Cam v-on:camClick="camFun"></Cam>
        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "./Header";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import Cam from "./Cam";
import {
  ADD_CUSTON_MESSAGE,
  RECEIVING_GROUP_DETAILE
} from "@/constants/CM-lxx.js"; /////////

export default {
  data() {
    return {
      multipleSelection: [], //穿梭框数据
      // checked1: "", //邮件
      // checked2: "", //短信
      input: "",
      input1: "",
      tableData: [],
      options: [],
      values: "",
      cam: {}, // cam组件的值
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
    Cam
  },
  methods: {
    reg() {
      //策略名
      if (this.formInline.strategy_name == "") {
        this.$message({
          message: "策略名不能为空",
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    // 获取cam组件的值
    camFun(data) {
      this.cam = data;
    },
    //选择告警接收组
    // getList() {
    //   var params = {
    //     Version: "2018-07-24"
    //     // GroupId: item
    //   };
    //   this.axios.post(RECEIVING_GROUP_DETAILE, params).then(res => {
    //     console.log(res);
    //     this.lists.push();
    //     if (res.codeDesc === "Success") {
    //       // this.deleteDialogVisible1 = false;
    //     } else {
    //       let ErrTips = {};
    //       let ErrOr = Object.assign(ErrorTips, ErrTips);
    //       this.$message({
    //         message: ErrOr[res.Response.Error.Code],
    //         type: "error",
    //         showClose: true,
    //         duration: 0
    //       });
    //     }
    //   });
    // },
    //确定
    save() {
      if (this.cam.selectUserGroup.length == 0) {
        this.$message({
          message: "请选择告警接收组",
          type: "error",
          showClose: true,
          duration: 0
        });
        return;
      }
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        PolicyName: this.formInline.strategy_name //策略名
      };
      this.cam.selectUserGroup.forEach((v, i) => {
        param["ReceiverGroupIds." + i] = v.GroupId;
      });

      this.cam.channel.forEach((v, i) => {
        if (v == "郵件") {
          v = "EMAIL";
        } else if (v == "簡訊") {
          v = "SMS";
        }
        param["NotifyWays." + i] = v;
      });
      this.axios.post(ADD_CUSTON_MESSAGE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: "添加成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.$router.push({
            path: "/message"
          });
          this.loadShow = false;
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
          };
          this.loadShow = false;
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
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