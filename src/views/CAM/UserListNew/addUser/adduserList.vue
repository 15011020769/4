<template>
  <div class="adduserlist-wrap">
    <HeadCom title="新建子用户" :backShow="true"  />
    <div class="adduserlist-main">
      <el-steps :active="active" simple>
        <el-step title="选择类型"></el-step>
        <el-step title="填写用户信息"></el-step>
        <el-step title="设置用户权限" v-if="this.ruleForm.ConsoleLogin == 1"></el-step>
        <el-step title="审阅信息和权限" v-if="this.ruleForm.ConsoleLogin == 1"></el-step>
      </el-steps>
      <div class="main">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div class="step1" v-show="active == 0">
            <el-form-item label="选择类型" required>
              <div
                :class="index == typeIndex ? 'type-box active' : 'type-box'"
                v-for="(item,index) in type"
                :key="index"
                @click="_type(index)"
              >
                <p>
                  <b>{{item.title}}</b>
                </p>
                <p>{{item.txt}}</p>
              </div>
            </el-form-item>
          </div>
          <div class="step2" v-show="active == 1">
            <el-form-item label="设置用户信息">
              <table width="100%" boder="1" cellspacing="0" cellpadding="1">
                <thead>
                  <tr>
                    <td width="280">
                      用户名
                      <span style="color:#e54545;">*</span>
                    </td>
                    <td width="170">备注</td>
                    <td width="200">手机</td>
                    <td width="200">邮箱</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <el-form-item prop="Name">
                        <el-input v-model="ruleForm.Name"></el-input>
                      </el-form-item>
                    </td>
                    <td>
                      <el-input v-model="ruleForm.Remark"></el-input>
                    </td>
                    <td>
                      <el-input v-model="ruleForm.PhoneNum"></el-input>
                    </td>
                    <td>
                      <el-input v-model="ruleForm.Email"></el-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="访问方式" required>
              <el-checkbox-group v-model="ruleForm.type" @change="_visitType" class="check">
                <el-checkbox label="0" name="type">
                  <span>编程访问</span>
                  <span>启用SecretId和SecretKey，支持台富云API、SDK和其他开发工具访问</span>
                </el-checkbox>
                <el-checkbox label="1" name="type">
                  <span>台富云控制台访问</span>
                  <span>启用密码，允许用户登录到台富云控制台</span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="new-set" v-show="this.visitType">
              <el-form-item label="控制台密码" required>
                <el-radio-group v-model="ruleForm.pwdRadio" @change="_pwdRadio">
                  <el-radio :label="false">自动生成密码</el-radio>
                  <el-radio :label="true">自定义密码</el-radio>
                </el-radio-group>
                <div v-show="pwdInp">
                  <el-form-item prop="Password" v-if="ruleForm.pwdRadio">
                    <el-input
                      v-model="ruleForm.Password"
                      style="width:200px;"
                      type="password"
                      show-password
                    ></el-input>
                  </el-form-item>
                  <el-form-item v-if="!ruleForm.pwdRadio">
                    <el-input
                      v-model="ruleForm.Password"
                      style="width:200px;"
                      type="password"
                      show-password
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="需要重置密码">
                <el-checkbox :label="0" name="pwdType">用户必须在下次登录时重置密码</el-checkbox>
              </el-form-item>
              <el-form-item label="登录保护" required>
                <el-radio-group v-model="ruleForm.loginRadio">
                  <el-radio :label="true">启用虚拟 MFA 设备校验</el-radio>
                  <el-radio :label="false">不开启</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="操作保护" required>
                <el-radio-group v-model="ruleForm.processRadio">
                  <el-radio :label="true">启用虚拟 MFA 设备校验</el-radio>
                  <el-radio :label="false">不开启</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="step3" v-show="active == 2">
          <Step3
            :totalNum="totalNum"
            :tableData="tableData"
            :userData="userData"
            :userNum="userNum"
            :userDatas="userDatas"
            @handleSelectionChange="handleSelectionChange"
            @acitiveName="_acitiveName"
            @loadMore="_loadMore"
            @_policySearch="_policySearch"
            @_policyInp="_policyInp"
            @_userSearch="_userSearch"
            @_userInp="_userInp"
            @_userRadio="_userRadio"
          />
        </div>
        <div class="step4" v-if="active == 3">
          <Step4
            :name="this.ruleForm.Name"
            :activeName="activeName"
            :pwdType="ruleForm.pwdType"
            :pwdRadio="ruleForm.pwdRadio"
          />
        </div>
      </div>
      <div class="btn-box">
        <el-button @click="_lastStep" v-show="this.active == 0 || this.active == 1">上一步</el-button>
        <el-button type="primary" @click="_nextStep('ruleForm')">{{btnVal}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "../components/Head";
import {
  ADD_USER,
  POLICY_LIST,
  USER_GROUP,
  POLICY_USER,
  QUERY_USER,
  ADD_USERTOGROUP,
  USER_LIST,
  QUERY_POLICY,
  GROUP_POLICY
} from "@/constants";
import Step3 from "./Tab/Step3"; //步骤3
import Step4 from "./Tab/Step4"; //步骤4

export default {
  name: "adduserlist",
  data() {
    var Password = (rule, value, callback) => {
      var reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,}$/;
      var _this = this;
      setTimeout(() => {
        if (!reg.test(value)) {
          _this.pwdReg = false;
          callback(
            new Error("密码规则为8位以上同时包含大写小字母、数字和特殊字符")
          );
        } else {
          _this.pwdReg = true;
          callback();
        }
      });
    };
    return {
      activeName: "first",
      userData: [], //用户组
      totalNum: 0, //策略列表条数
      multipleSelection: [], //全选
      tableData: [],
      active: 0,
      btnVal: "下一步",
      pwdReg: true,
      //选择类型
      type: [
        {
          code: 1,
          title: "可访问资源并接收消息",
          txt:
            "该用户可以登录控制台或通过 API 密钥访问您授予其权限的台富云资源，同时拥有接收消息等子账号的全部功能"
        },
        {
          code: 0,
          title: "仅用于接收消息",
          txt:
            "该用户仅可通过手机、邮箱接收台富云发送给您的消息通知，不可访问台富云"
        }
      ],
      //访问方式
      visitType: false,
      typeIndex: 0,
      pwdInp: false, //密码框
      ruleForm: {
        loginRadio: true, //登录保护
        processRadio: true, //操作保护
        type: [],
        CountryCode: "",
        pwdType: [],
        pwdRadio: false,
        Password: "", //密码
        ConsoleLogin: 1, //子用户是否可以登录控制台
        Name: "", //	子用户用户名
        Remark: "", //子用户备注
        PhoneNum: "", //手机号
        Email: "" //邮箱
      },
      rules: {
        Password: [{ validator: Password, trigger: "blur" }]
      }, //规则
      userpolicyData: {},
      //步骤三表格页数
      policyPage: 1,
      policyNum: 10,
      userPage: 1,
      userNums: 10,
      userNum: 0,
      namereg: "",
      policyVal: "",
      userVal: "",
      userUin: "",
      userDatas: [] //用户
    };
  },
  components: {
    HeadCom,
    Step3,
    Step4
  },
  created() {
    this._getList();
    this._userList();
    this.init();
  },
  methods: {
    //复用现有用户策略
    _userRadio(val) {
      const params = {
        Version: "2019-01-16",
        Name: val
        // Name: this.ruleForm.Name
      };
      this.axios
        .post(QUERY_USER, params)
        .then(res => {
          this.userUin = res.Response.Uin;
        })
        //获取关联的策略
        .then(data => {
          const params = {
            Version: "2019-01-16",
            TargetUin: this.userUin
          };
          this.axios.post(QUERY_POLICY, params).then(res => {
            this.multipleSelection = res.Response.List;
          });
        });
    },
    //初始化用户列表数据
    init() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {
        var json = data.Response.Data;
        json.forEach(item => {
          const params = {
            Version: "2019-01-16",
            TargetUin: item.Uin
          };
          this.axios.post(QUERY_POLICY, params).then(res => {
            item.policy = res.Response.List;
          });
        });
        this.userDatas = json;
      });
    },
    //用户列表搜索
    _userSearch(val) {
      this.userVal = val;
      this._userList(val);
    },
    _userInp(val) {
      if (val == "") {
        this._userList();
      }
    },
    //策略列表搜索
    _policySearch(val) {
      this.policyVal = val;
      this._getList(val);
    },
    _policyInp(val) {
      if (val == "") {
        this._getList();
      }
    },
    //步骤三表格懒加载
    _loadMore(val) {
      if (val == "first") {
        this.policyPage++;
        this.policyNum = this.policyNum + 10;
        this._getList(this.policyVal);
      } else if (val == "third") {
        this.userPage++;
        this.userNums = this.userNums + 10;
        this._userList(this.userVal);
      }
    },
    //绑定用户组
    _userGroup(id) {
      const params = {
        Version: "2019-01-16",
        "Info.0.Uid": this.userpolicyData.Uid,
        "Info.0.GroupId": id
      };
      this.axios.post(ADD_USERTOGROUP, params).then(res => {});
    },
    //tab标签名称
    _acitiveName(val) {
      this.activeName = val;
    },
    //获取用户信息
    _getUser() {
      const params = {
        Version: "2019-01-16",
        // Name: "策略列表"
        Name: this.ruleForm.Name
      };
      this.axios.post(QUERY_USER, params).then(res => {
        this.userpolicyData = res.Response;
      });
    },
    //绑定策略列表
    _policy(id) {
      const params = {
        Version: "2019-01-16",
        PolicyId: id,
        AttachUin: this.userpolicyData.Uin
      };
      this.axios.post(POLICY_USER, params).then(res => {
        if (res.Response.RequestId) {
          this.active = 3;
        }
      });
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //新建子用户
    _arrUser() {
      const params = {
        Version: "2019-01-16",
        Name: this.ruleForm.Name,
        Remark: this.ruleForm.Remark,
        ConsoleLogin: this.ruleForm.ConsoleLogin,
        Password: this.ruleForm.pwdRadio ? this.ruleForm.Password : "",
        NeedResetPassword: this.ruleForm.pwdType.includes(0) ? 1 : 0,
        PhoneNum: this.ruleForm.PhoneNum,
        CountryCode: this.ruleForm.CountryCode,
        Email: this.ruleForm.Email
      };
      this.axios.post(ADD_USER, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          if (this.pwdReg) {
            this._getUser();
            this.active = 2;
          }
        }
      });
    },
    //用户组列表
    _userList(val) {
      const params = {
        Version: "2019-01-16",
        Rp: this.userNums
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(USER_GROUP, params).then(res => {
        this.userData = res.Response.GroupInfo;
        this.userNum = res.Response.TotalNum;
        var data = this.userData;
        data.forEach(item => {
          const params = {
            Version: "2019-01-16",
            TargetGroupId: item.GroupId
          };
          this.axios.post(GROUP_POLICY, params).then(res => {
            item.policy = res.Response.List;
          });
        });
      });
    },
    //策略列表
    _getList(val) {
      const params = {
        Version: "2019-01-16",
        Rp: this.policyNum
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        this.tableData = res.Response.List;
        this.totalNum = res.Response.TotalNum;
      });
    },
    //控制台密码
    _pwdRadio() {
      if (this.ruleForm.pwdRadio) {
        this.pwdInp = true;
      } else {
        this.pwdInp = false;
      }
    },
    //访问方式
    _visitType() {
      if (this.ruleForm.type.includes("1")) {
        this.visitType = true;
      } else {
        this.visitType = false;
      }
    },
    //选择类型
    _type(index) {
      this.typeIndex = index;
      this.ruleForm.ConsoleLogin = this.type[index].code;
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    //下一步
    _nextStep(formName) {
      var num = this.active;
      var temp = 3;
      if (this.btnVal == "完成") {
        this.$router.push("/UserListNew");
      }
      if (this.ruleForm.ConsoleLogin == 0) {
        var temp = 1;
      }
      if (this.active < temp) {
        num++;
      }
      if (num == temp) {
        this.btnVal = "完成";
      }
      if (this.active == 2) {
        this.multipleSelection.forEach(item => {
          //从策略列表中选取策略关联
          if (this.activeName == "first") {
            this._policy(item.PolicyId);
          }
          //复用现有用户策略
          else if (this.activeName == "second") {
            this._policy(item.PolicyId);
          }
          //添加至组获得随机权限
          else if (this.activeName == "third") {
            this._userGroup(item.GroupId);
          }
        });
      }
      if (this.active == 1) {
        if (!this.visitType) {
          if (!this.ruleForm.Name) {
            this.$message.error("用户名不能为空");
          } else if (this.ruleForm.type.length == 0) {
            this.$message.error("编程访问和台富云控制台访问至少需要选择一个");
          } else {
            this._arrUser();
          }
        }
        if (this.visitType) {
          if (!this.ruleForm.Name) {
            this.$message.error("用户名不能为空");
          } else if (this.ruleForm.type.length == 0) {
            this.$message.error("编程访问和台富云控制台访问至少需要选择一个");
          } else if (this.ruleForm.loginRadio === "") {
            this.$message.error("请设置登录保护");
          } else if (this.ruleForm.processRadio === "") {
            this.$message.error("请设置操作保护");
          } else {
            this._arrUser();
          }
        }
      } else {
        this.active = num;
      }
    },
    //上一步
    _lastStep() {
      var num = this.active;
      if (this.active > 0) {
        num--;
      }
      if (this.btnVal == "完成") {
        this.btnVal = "下一步";
      }
      this.active = num;
    }
  }
};
</script>

<style scoped lang='scss'>
.adduserlist-wrap {
  width: 100%;
  height: 100%;
  .adduserlist-main >>> .el-tabs {
    padding-bottom: 30px;
  }
  .adduserlist-main >>> .el-button {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
    padding-top: 0;
    font-size: 12px;
  }
  .adduserlist-main >>> .el-form-item__label {
    font-size: 12px;
    text-align: left;
  }
  .adduserlist-main >>> .el-steps {
    background: white;
    padding-bottom: 25px;
    .el-step__title {
      font-size: 15px;
    }
  }
  .adduserlist-main >>> .el-form-item__error {
    top: -12px;
  }
  .adduserlist-main >>> .el-input__inner {
    font-size: 12px;
    border-radius: 0;
    line-height: 30px;
    height: 30px;
    padding-left: 5px;
  }
  .adduserlist-main >>> .el-checkbox {
    margin-left: 0;
    display: block;
  }
  .adduserlist-main >>> .el-checkbox-group {
    margin-top: 12px;
  }
  .adduserlist-main >>> .el-checkbox__label {
    font-size: 12px;
    span {
      display: block;
      font-size: 12px;
    }
  }
  .adduserlist-main >>> .el-radio-group {
    margin-top: 12px;
  }
  .adduserlist-main >>> .el-radio {
    display: block;
    margin-bottom: 8px;
    margin-left: 0;
    .el-radio__label {
      font-size: 12px;
    }
  }
  .adduserlist-main .check >>> .el-checkbox__input {
    margin-top: -36px;
  }
  .adduserlist-main {
    background: white;
    margin: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    box-sizing: border-box;

    .main {
      border-top: 1px #f2f2f2 solid;
      border-bottom: 1px #f2f2f2 solid;
      margin-bottom: 20px;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
      h3 {
        font-size: 12px;
        margin-bottom: 10px;
        margin-top: 5px;

        span {
          font-weight: normal;
          color: #666;
        }
      }
      .omit {
        // width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      table {
        border: 1px #f2f2f2 solid;
        thead {
          td {
            font-weight: bold;
            color: #888;
          }
        }
        tbody {
          td {
            padding: 10px;
            box-sizing: border-box;
          }
        }
        td {
          font-size: 12px;
          border: 0.5px #f2f2f2 solid;
          border-right: 0;
          border-left: 0;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
      .active {
        border-color: #0075ff !important;
        background-color: #f0f5ff !important;
        p:nth-child(1) {
          color: #0075ff;
        }
      }
      .type-box:hover {
        border: 1px #0075ff solid;
      }
      .type-box {
        cursor: pointer;
        margin-bottom: 15px;
        border: 1px #f2f2f2 solid;
        padding: 5px 15px;
        padding-bottom: 14px;
        box-sizing: border-box;
        background: white;
        p {
          margin: 0;
          padding: 0;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: #666;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
