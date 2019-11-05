<template>
  <div class="new-build">
    <el-dialog :visible.sync="newBuildShow.newBuildState" width="38.6%" :show-close="false">
      <div class="title">
        <h3>新建安全组</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <ul>
          <li>
            <span>模板</span>
            <div>
              <el-select v-model="value" placeholder="请选择" @change="Template()">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <span>名称</span>
            <div>
              <input type="text" v-model="name" placeholder="请输入安全组名称" maxlength="60"/>
            </div>
          </li>
          <li>
            <span>所属项目</span>
            <div>
              <el-select
                v-model="projectId"
                @change="changeProjectId"
                placeholder="全部项目"
                size="small"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <span>备注</span>
            <textarea v-model="textarea" maxlength="100"></textarea>
          </li>
        </ul>
        <p>
          <a href="javascript:;" v-if="!showRules" @click="showRules=true">显示模板规则</a>
        </p>
        <div class="template-rule" style="width:100%;" v-if="showRules">
          <div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="入站规则" name="first">
                <el-table :data="inboundList" style="width: 100%" border>
                  <el-table-column prop="address" label="源IP地址"></el-table-column>
                  <el-table-column prop="port" label="协议端口"></el-table-column>
                  <el-table-column prop="policy" label="策略"></el-table-column>
                  <el-table-column prop="remarks" label="备注"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="出站规则" name="second">
                <el-table :data="outboundList" style="width: 100%" border>
                  <el-table-column prop="address" label="目标IP地址"></el-table-column>
                  <el-table-column prop="port" label="协议端口"></el-table-column>
                  <el-table-column prop="policy" label="策略"></el-table-column>
                  <el-table-column prop="remarks" label="备注"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <p>
              <a href="javascript:;" @click="showRules=false">隐藏模板规则</a>
            </p>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="NewBuildSure()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      showRules: false,
      options: [
        {
          lable: "暴露全部端口到公网和内网，有一定安全风险",
          value: "放通全部端口"
        },
        {
          lable: "公网放通云主机常用登录及web服务端口，内网全放通。",
          value: "放通22，80，443，3389端口和ICMP协议"
        },
        {
          lable: "",
          value: "自定义"
        }
      ],
      value: "放通全部端口",
      name: "", // 名称
      projects: "", // 所属项目
      textarea: "暴露全部端口到公网和内网，有一定安全风险", // 备注
      date: "",
      projectList: JSON.parse(localStorage.getItem("projectList")), // 项目列表
      projectId: "", // 点击下拉框获取的项目id
      inboundList: [
        { address: "ALL", port: "ALL", policy: "允许", remarks: "" }
      ], // 入站规则
      outboundList: [
        { address: "ALL", port: "ALL", policy: "允许", remarks: "" }
      ], // 出站规则
      inAll: [{ address: "ALL", port: "ALL", policy: "允许", remarks: "" }], // 放通全部端口入
      outAll: [{ address: "ALL", port: "ALL", policy: "允许", remarks: "" }], // 放通全部端口出
      inFew: [
        {
          address: "ALL",
          port: "TCP:3389",
          policy: "允许",
          remarks: "放通Windows远程登录"
        },
        {
          address: "ALL",
          port: "TCP:22",
          policy: "允许",
          remarks: "放通Linux SSH登录"
        },
        {
          address: "ALL",
          port: "TCP:80,443",
          policy: "允许",
          remarks: "放通Web服务端口"
        },
        {
          address: "ALL",
          port: "ICMP",
          policy: "允许",
          remarks: "放通Ping服务"
        },
        {
          address: "10.0.0.0/8",
          port: "ALL",
          policy: "允许",
          remarks: "放通内网"
        },
        {
          address: "172.16.0.0/12",
          port: "ALL",
          policy: "允许",
          remarks: "放通内网"
        },
        {
          address: "192.168.0.0/16",
          port: "ALL",
          policy: "允许",
          remarks: "放通内网"
        }
      ],
      outFew: [{ address: "ALL", port: "ALL", policy: "允许", remarks: "" }] //放通22，80，443，3389端口和ICMP协议
    };
  },
  props: {
    newBuildShow: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.date = this.timeFormat(new Date());
    this.name = this.value + "-" + this.date;
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    timeFormat(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let hs = new Date(timeStamp).getMilliseconds();
      return year + month + date + hh + mm + ss + hs;
      this.date = year + month + date + hh + mm + ss + hs;
    },
    // 模板
    Template() {
      console.log(this.value);
      for (var i = 0; i < this.options.length; i++) {
        if (this.value === this.options[i].value) {
          this.textarea = this.options[i].lable;
        }
      }
      this.name = this.value + "-" + this.date;
      if (this.value === "放通全部端口") {
        this.inboundList = this.inAll;
        this.outboundList = this.outAll;
      } else if (this.value === "放通22，80，443，3389端口和ICMP协议") {
        this.inboundList = this.inFew;
        this.outboundList = this.outFew;
      } else if (this.value === "自定义") {
        this.inboundList = [];
        this.outboundList = [];
        this.name = "";
      }
    },
    // 更换项目事件
    changeProjectId() {
      console.log(this.projectId);
    },
    // 确定
    NewBuildSure() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        GroupName: this.name,
        GroupDescription: this.textarea,
        ProjectId: this.projectId
      };
      console.log(params);
      if (this.projectId === "") {
        this.$message({
          message: "请选择所属项目",
          type: "error"
        });
        return
      }
      this.axios
        .post("vpc2/CreateSecurityGroup", params)
        .then(data => {
          this.$message({
            message: "新建成功",
            type: "success"
          });
          this.$emit("getDataList");
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
.new-build {
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
    display: flex;
    justify-content: flex-start;
    flex-flow: wrap;
    & > ul {
      width: 100%;
      li {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-start;
        &:last-child {
          margin-bottom: 5px;
        }
        & > span {
          font-size: 12px;
          display: inline-block;
          &:nth-of-type(1) {
            width: 68px;
            color: #888;
          }
          &:nth-of-type(2) {
            color: #444;
          }
        }
        & > div {
          font-size: 12px;
          & > input {
            color: #444;
            width: 320px;
            height: 30px;
            border: 1px solid #ddd;
            padding: 0 10px;
            &:hover {
              border: 1px solid #bbb;
            }
          }
          & > p {
            color: #a2a2a2;
          }
        }
        & > textarea {
          width: 320px;
          height: 54px;
          color: #444;
          font-size: 12px;
          border: 1px solid #ddd;
          padding: 5px 10px;
          &:hover {
            border: 1px solid #bbb;
          }
        }
      }
    }
    p {
      width: 100%;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      & > a {
        color: #006eff;
        font-size: 12px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .template-rule {
      ::v-deep .el-tabs__item {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
      }
      ::v-deep .el-tabs__item.is-active {
        color: #000;
        font-weight: 700;
      }
      ::v-deep .el-table th > .cell {
        font-size: 12px;
        color: #888;
        font-weight: 700;
      }
      ::v-deep .el-table th {
        padding: 0px;
        height: 40px;
      }
      ::v-deep .el-table--border th {
        border-right: 0px;
      }
      ::v-deep .el-table--border td {
        border-right: 0px;
      }
      ::v-deep .el-table .cell {
        font-size: 12px;
        color: #444;
        height: 20px;
        line-height: 20px;
      }
    }
    ::v-deep .el-select {
      width: 320px;
    }
    ::v-deep .el-select .el-input {
      width: 320px;
    }
    ::v-deep .el-input--suffix .el-input__inner {
      width: 320px;
      height: 30px;
      padding: 0 28px 0 10px;
      border-radius: 0px;
    }
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

