<template>
  <div class="delete">
    <el-dialog :visible.sync="rulesNewShow.rulesNewState" width="71.2%" :show-close="false">
      <div class="title">
        <h3>添加{{rulesNewShow.RulesType === 0?"入站规则":"出站规则"}}</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <div class="add">
          <div class="oneSel">
            <span>类型：</span>
            <el-select placeholder="请选择" v-model="addList.type" @change="TypeSel()">
              <el-option
                v-for="item in ruleJson"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="oneInt">
            <span>来源：</span>
            <el-input placeholder="如10.0.0.1或10.0.0.0/16" v-model="addList.source"></el-input>
          </div>
          <div class="twoInt">
            <span>协议端口：</span>
            <div v-if="addList.type!=='自定义'">
              <el-input
                placeholder="如UDP:53,TCP:80,443或TCP:80-90"
                v-model="addList.ipPort"
                disabled
              ></el-input>
            </div>
            <div v-if="addList.type==='自定义'">
              <el-input placeholder="如UDP:53,TCP:80,443或TCP:80-90" v-model="addList.ipPort"></el-input>
            </div>
          </div>
          <div class="twoSel">
            <span>策略：</span>
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="threeInt" style="margin-left:56px;">
            <span>备注：</span>
            <el-input v-model="addList.remark"></el-input>
          </div>
          <div class="add-btn">
            <el-button type="primary" @click="AddRow()">+ 新增一行</el-button>
          </div>
        </div>
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <td width="141px">类型</td>
              <td width="178px">来源</td>
              <td>协议端口</td>
              <td>策略</td>
              <td>备注</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dataList.length === 0">
              <td colspan="6" style="text-align: center;">无</td>
            </tr>
            <tr v-for="(item,index) in dataList" :key="index">
              <td>{{item.type}}</td>
              <td>{{item.source}}</td>
              <td>{{item.ipPort}}</td>
              <td>{{item.policy==="ACCEPT"?"允许":"拒绝"}}</td>
              <td>{{item.remark}}</td>
              <td>
                <a href="javascript:;" @click="edit(item,index)">编辑</a>
                <a href="javascript:;" @click="deletelist(item,index)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        <el-button type="primary" @click="RulesNewSure()">完成</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="title">
        <h3>编辑</h3>
        <a href="javascript:;" @click="dialogVisible = false">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body edit-body">
        <div class="add">
          <div class="oneSel">
            <span>类型：</span>
            <el-select placeholder="请选择" v-model="editDetail.type" @change="EditTypeSel()">
              <el-option
                v-for="item in ruleJson"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="oneInt" style="margin-top:10px;">
            <span>来源：</span>
            <el-input placeholder="如10.0.0.1或10.0.0.0/16" v-model="editDetail.source"></el-input>
          </div>
          <div class="twoInt" style="margin-top:10px;">
            <span>协议端口：</span>
            <div v-if="editDetail.type!=='自定义'">
              <el-input
                placeholder="如UDP:53,TCP:80,443或TCP:80-90"
                v-model="editDetail.ipPort"
                disabled
              ></el-input>
            </div>
            <div v-if="editDetail.type==='自定义'">
              <el-input placeholder="如UDP:53,TCP:80,443或TCP:80-90" v-model="editDetail.ipPort"></el-input>
            </div>
          </div>
          <div class="twoSel" style="margin-top:10px;">
            <span>策略：</span>
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="threeInt">
            <span>备注：</span>
            <el-input v-model="editDetail.remark"></el-input>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="update()">更新</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dataList: [], // 表格列表
      ruleJson: [
        {
          type: "自定义",
          source: "",
          Protocol: "",
          Port: "",
          ipPort: "",
          remark: ""
        },
        {
          type: "Windows登录",
          source: "0.0.0.0/0",
          Protocol: "TCP",
          Port: "3389",
          ipPort: "TCP:3389",
          remark: "放通Windows远程登录"
        },
        {
          type: "Linux登录",
          source: "0.0.0.0/0",
          Protocol: "TCP",
          Port: "22",
          ipPort: "TCP:22",
          remark: "放通Linux SSH登录"
        },
        {
          type: "Ping",
          source: "0.0.0.0/0",
          Protocol: "ICMP",
          Port: "",
          ipPort: "ICMP",
          remark: "支持Ping服务"
        },
        {
          type: "HTTP(80)",
          source: "0.0.0.0/0",
          Protocol: "TCP",
          Port: "80",
          ipPort: "TCP:80",
          remark: "放通Web服务HTTP（80），如 Apache、Nginx"
        },
        {
          type: "HTTPS(443)",
          source: "0.0.0.0/0",
          Protocol: "TCP",
          Port: "443",
          ipPort: "TCP:443",
          remark: "放通Web服务HTTPS（443），如 Apache、Nginx"
        }
      ],
      options: [
        {
          value: "ACCEPT",
          label: "允许"
        },
        {
          value: "DROP",
          label: "拒绝"
        }
      ],
      value: "允许",
      addList: {
        type: "自定义"
      },
      editDetail: {}
    };
  },
  props: {
    rulesNewShow: {
      type: Object,
      default: () => []
    }
  },
  created() {},
  methods: {
    // 选择的类型
    TypeSel() {
      for (var i = 0; i < this.ruleJson.length; i++) {
        if (this.addList.type === this.ruleJson[i].type) {
          this.addList.source = this.ruleJson[i].source;
          this.addList.Protocol = this.ruleJson[i].Protocol;
          this.addList.Port = this.ruleJson[i].Port;
          this.addList.ipPort = this.ruleJson[i].ipPort;
          this.addList.remark = this.ruleJson[i].remark;
        }
      }
    },
    // 编辑的类型
    EditTypeSel() {
      for (var i = 0; i < this.ruleJson.length; i++) {
        if (this.editDetail.type === this.ruleJson[i].type) {
          this.editDetail.source = this.ruleJson[i].source;
          this.editDetail.Protocol = this.ruleJson[i].Protocol;
          this.editDetail.Port = this.ruleJson[i].Port;
          this.editDetail.ipPort = this.ruleJson[i].ipPort;
          this.editDetail.remark = this.ruleJson[i].remark;
        }
      }
    },
    // 新增一行
    AddRow() {
      if (this.addList.source && this.addList.source) {
        if (this.value === "允许") {
          this.value = "ACCEPT";
        }
        this.dataList.push({
          type: this.addList.type,
          source: this.addList.source,
          ipPort: this.addList.ipPort,
          remark: this.addList.remark,
          policy: this.value,
          Protocol: this.addList.Protocol,
          Port: this.addList.Port
        });
      } else {
        this.$message({
          message: "新增失败，请填写完整",
          type: "error"
        });
      }
    },
    //编辑
    edit(item, index) {
      this.dialogVisible = true;
      this.editDetail = {
        type: item.type,
        source: item.source,
        policy: item.policy,
        ipPort: item.ipPort,
        remark: item.remark,
        Protocol: item.Protocol,
        Port: item.Port
      };
      this.editid = index;
    },
    //确认更新
    update() {
      if (this.editDetail.source && this.editDetail.source) {
        let _this = this;
        for (let i = 0; i < _this.dataList.length; i++) {
          if (i === this.editid) {
            _this.dataList[i] = {
              type: _this.editDetail.type,
              source: _this.editDetail.source,
              ipPort: _this.editDetail.ipPort,
              remark: _this.editDetail.remark,
              policy: this.value,
              Protocol: _this.editDetail.Protocol,
              Port: _this.editDetail.Port
            };
            this.dialogVisible = false;
          }
        }
        this.dataList = _this.dataList;
      } else {
        this.$message({
          message: "修改失败，请填写完整",
          type: "error"
        });
      }
    },
    // 删除
    deletelist(row, i) {
      this.dataList.splice(i, 1);
    },
    RulesNewSure() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.rulesNewShow.SecurityGroupId
      };
      if (this.rulesNewShow.RulesType === 0) {
        for (let i = 0; i < this.dataList.length; i++) {
          params["SecurityGroupPolicySet.Ingress." + i + ".PolicyIndex"] = 0;
          params[
            "SecurityGroupPolicySet.Ingress." + i + ".Protocol"
          ] = this.dataList[i].Protocol;
          params[
            "SecurityGroupPolicySet.Ingress." + i + ".Port"
          ] = this.dataList[i].Port;
          params[
            "SecurityGroupPolicySet.Ingress." + i + ".CidrBlock"
          ] = this.dataList[i].source;
          params[
            "SecurityGroupPolicySet.Ingress." + i + ".Action"
          ] = this.dataList[i].policy;
          params[
            "SecurityGroupPolicySet.Ingress." + i + ".PolicyDescription"
          ] = this.dataList[i].remark;
        }
      } else if (this.rulesNewShow.RulesType === 1) {
        for (let i = 0; i < this.dataList.length; i++) {
          params["SecurityGroupPolicySet.Egress." + i + ".PolicyIndex"] = 0;
          params[
            "SecurityGroupPolicySet.Egress." + i + ".Protocol"
          ] = this.dataList[i].Protocol;
          params[
            "SecurityGroupPolicySet.Egress." + i + ".Port"
          ] = this.dataList[i].Port;
          params[
            "SecurityGroupPolicySet.Egress." + i + ".CidrBlock"
          ] = this.dataList[i].source;
          params[
            "SecurityGroupPolicySet.Egress." + i + ".Action"
          ] = this.dataList[i].policy;
          params[
            "SecurityGroupPolicySet.Egress." + i + ".PolicyDescription"
          ] = this.dataList[i].remark;
        }
      }
      this.axios
        .post("vpc2/CreateSecurityGroupPolicies", params)
        .then(data => {
          if (data.Response.Error) {
            this.$message({
              message: "添加失败",
              type: "error"
            });
            this.cancel();
          } else {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$emit("rulesList");
            this.cancel();
          }
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
    font-size: 12px;
    ::v-deep .el-input {
      width: 100%;
    }
    a {
      color: #006eff;
      font-size: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
    .add {
      display: flex;
      justify-content: flex-start;
      justify-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
      border: 1px solid #ddd;
      padding: 20px;
      & > div {
        display: flex;
        justify-content: flex-start;
        margin-right: 40px;
        justify-items: center;
        span {
          line-height: 30px;
        }
      }
      .oneSel {
        ::v-deep .el-select .el-input {
          width: 121px;
        }
        ::v-deep .el-input__inner {
          height: 30px;
          width: 121px;
          font-size: 12px;
          color: #000;
          border-radius: 0px;
          padding: 0 28px 0 10px;
        }
      }
      .oneInt {
        span {
          width: 44px;
        }
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 158px;
          height: 30px;
          padding-left: 10px;
          font-size: 12px;
        }
      }
      .twoInt {
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 221px;
          height: 30px;
          padding-left: 10px;
          font-size: 12px;
        }
      }
      .twoSel {
        margin-top: 10px;
        ::v-deep .el-select .el-input {
          width: 64px;
        }
        ::v-deep .el-input__inner {
          height: 30px;
          width: 64px;
          font-size: 12px;
          color: #000;
          border-radius: 0px;
          padding: 0 28px 0 10px;
        }
      }
      .threeInt {
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
        span {
          width: 43px;
        }
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 193px;
          height: 30px;
          padding-left: 10px;
          font-size: 12px;
        }
      }
      .add-btn {
        width: 600px;
        margin-top: 10px;
        ::v-deep .el-button {
          border-radius: 0px;
          padding: 0px 10px;
          height: 30px;
        }
      }
    }
    table {
      width: 100%;
      border: 1px solid #ddd;
      thead {
        tr {
          td {
            padding: 0 10px;
            height: 40px;
            font-size: 12px;
            color: #888;
            font-weight: 700;
          }
        }
      }
      tbody {
        tr {
          td {
            border-top: 1px solid #ddd;
            padding: 0 10px;
            height: 40px;
            font-size: 12px;
            color: #333;
            a {
              color: #006eff;
              margin-left: 10px;
            }
          }
        }
      }
    }
    ::v-deep .el-table--border {
      border: 1px solid #ddd;
    }
    ::v-deep .el-table--border th {
      border-right: 0px;
      border-color: #ddd;
    }
    ::v-deep .el-table--border td {
      border-right: 0px;
      border-color: #ddd;
    }
    ::v-deep .el-table th > .cell {
      font-size: 12px;
      color: #888;
    }
    ::v-deep .el-table th {
      padding: 0px;
      height: 40px;
    }
  }
  .edit-body {
    ::v-deep .el-input {
      width: auto;
    }
    .add {
      & > div {
        margin-right: 0px !important;
        span {
          display: inline-block;
          width: 60px !important;
        }
      }
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
      font-size: 12px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>

