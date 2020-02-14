<template>
  <div class="adduserlist-wrap">
    <HeadCom :title="$t('CAM.userList.createUser')" :backShow="true" @_back="_back" />
    <div class="adduserlist-main" v-loading="loading">
      <el-steps :active="active" simple>
        <el-step :title="$t('CAM.userList.chooserType')"></el-step>
        <el-step :title="$t('CAM.userList.userMesgs')"></el-step>
        <el-step :title="$t('CAM.userList.setStrage')" v-if="this.ruleForm.ConsoleLogin == 1"></el-step>
        <el-step :title="$t('CAM.userList.userMesg')" v-if="this.ruleForm.ConsoleLogin == 1"></el-step>
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
            <el-form-item :label="$t('CAM.userList.chooserType')" required>
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
            <el-form-item :label="$t('CAM.userList.setUserMesg')">
              <table width="100%" boder="1" cellspacing="0" cellpadding="1">
                <thead>
                  <tr>
                    <td width="280">
                      {{$t('CAM.userList.userName')}}
                      <span style="color:#e54545;">*</span>
                    </td>
                    <td width="170">{{$t('CAM.userList.userRemark')}}</td>
                    <td width="200">{{$t('CAM.userList.userPhone')}}</td>
                    <td width="200">{{$t('CAM.userList.userEmail')}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <el-form-item prop="Name">
                        <el-input v-model="ruleForm.Name" :placeholder="$t('CAM.userList.userNamePlaceholder')"></el-input>
                      </el-form-item>
                    </td>
                    <td>
                      <el-form-item prop="Remark">
                        <el-input
                          v-model="ruleForm.Remark"
                          :placeholder="$t('CAM.userList.userRemarkPlaceholder')"
                        ></el-input>
                      </el-form-item>
                    </td>
                    <td class="reg">
                      <el-input v-model="ruleForm.PhoneNum" @change="telInp" :placeholder="$t('CAM.userList.userPhonePlaceholder')"></el-input>
                      <span class="red" v-show="phoneReg">{{$t('CAM.userList.sjhyw')}}</span>
                    </td>
                    <td class="reg">
                      <el-input v-model="ruleForm.Email" @change="emailInp" :placeholder="$t('CAM.userList.userEmailPlaceholder')"></el-input>
                      <span class="red" v-show="emailReg">{{$t('CAM.userList.yxsryw')}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item :label="$t('CAM.userList.askWay')" required>
              <el-checkbox-group v-model="ruleForm.type" @change="_visitType" class="check">
                <el-checkbox label="0" name="type">
                  <span>{{$t('CAM.userList.Programmatic')}}</span>
                  <span>{{$t('CAM.userList.prigMesg')}}</span>
                </el-checkbox>
                <el-checkbox label="1" name="type">
                  <span>{{$t('CAM.userList.access')}}</span>
                  <span>{{$t('CAM.userList.password')}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="new-set" v-show="this.visitType">
              <el-form-item :label="$t('CAM.userList.ConsolePassword')" required>
                <el-radio-group v-model="ruleForm.pwdRadio" @change="_pwdRadio">
                  <el-radio :label="false">{{$t('CAM.userList.generation')}}</el-radio>
                  <el-radio :label="true">{{$t('CAM.userList.Custom')}}</el-radio>
                </el-radio-group>
                <div v-show="pwdInp" class="regPWD">
                  <el-input
                    v-model="ruleForm.Password"
                    style="width:200px;"
                    type="password"
                    show-password
                    maxlength="32"
                    @click="visible = !visible"
                    @change="_pwdInp"
                  ></el-input>
                  <div class="reg-box">
                    <p :class="pwdlenReg ? 'red' : 'green'">{{$t('CAM.userList.cdzf')}}</p>
                    <p :class="pwdtypeReg ? 'red' : 'green'">{{$t('CAM.userList.bhzf')}}</p>
                    <p :class="pwdreReg ? 'red' : 'green'">{{$t('CAM.userList.mmbnyyhmxt')}}</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$t('CAM.userList.resetPassword')">
                <el-checkbox :label="0" name="pwdType">{{$t('CAM.userList.passAgin')}}</el-checkbox>
              </el-form-item>
              <el-form-item :label="$t('CAM.userList.protect')" required>
                <el-radio-group v-model="ruleForm.loginRadio">
                  <el-radio :label="true">{{$t('CAM.userList.open')}}</el-radio>
                  <el-radio :label="false">{{$t('CAM.userList.doOpne')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('CAM.userList.Operation')" required>
                <el-radio-group v-model="ruleForm.processRadio">
                  <el-radio :label="true">{{$t('CAM.userList.open')}}</el-radio>
                  <el-radio :label="false">{{$t('CAM.userList.doOpne')}}</el-radio>
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
        <el-button @click="_lastStep" v-show="this.active == 1">上一步</el-button>
        <el-button type="primary" @click="_nextStep('ruleForm')">{{btnVal}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
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
            new Error("密碼規則為8位以上同時包含大寫小字母、數字和特殊字元")
          );
        } else {
          _this.pwdReg = true;
          callback();
        }
      });
    };
    return {
      //密码正则验证
      pwdlenReg: false,
      pwdtypeReg: false,
      pwdreReg: false,
      loading: false,
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
          title: "可訪問資源並接收消息",
          txt:
            "該用戶可以登錄控制台或通過 API 密鑰訪問您授予其許可權的台富雲資源，同時擁有接收消息等子賬號的全部功能"
        },
        {
          code: 0,
          title: "僅用於接收消息",
          txt:
            "該用戶僅可通過手機、郵箱接收台富雲發送給您的消息通知，不可訪問台富雲"
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
        Password: [
          {
            validator: Password,
            trigger: "blur"
          }
        ],
        Remark:[
          { max: 100, message: "100個英文字母、數字或漢字以內，支持@、._[]-:" },
          {
            pattern: /^[\u4E00-\u9FFFa-zA-Z0-9@_、.\-:\[\]]+$/g,
            message: "100個英文字母、數字或漢字以內，支持@、._[]-:"
          }
        ]
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
      phoneReg: false,
      emailReg: false,
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
    //密码验证
    _pwdInp() {
      var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[#@*&.]).*$/;
      //用户名不能和密码相同
      if (this.ruleForm.Name != this.ruleForm.Password) {
        this.pwdreReg = false;
      } else {
        this.pwdreReg = true;
      }
      //长度为8-32个字符
      if (
        this.ruleForm.Password.length >= 8 &&
        this.ruleForm.Password.length <= 32
      ) {
        this.pwdlenReg = false;
      } else {
        this.pwdlenReg = true;
      }
      //包含数字，特殊字符(除空格)，小写字母，大写字母
      if (
        reg.test(this.ruleForm.Password) &&
        !/s/.test(this.ruleForm.Password)
      ) {
        this.pwdtypeReg = false;
      } else {
        this.pwdtypeReg = true;
      }
    },
    //手机号验证
    telInp() {
      var reg = /^1[3456789]\d{9}$/;
      if (this.ruleForm.PhoneNum != "") {
        if (!reg.test(this.ruleForm.PhoneNum)) {
          this.phoneReg = true;
        } else {
          this.phoneReg = false;
        }
      } else {
        this.phoneReg = false;
      }
    },
    //邮箱验证
    emailInp() {
      var reg = /^[A-Za-z0-9_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.ruleForm.Email != "") {
        if (!reg.test(this.ruleForm.Email)) {
          this.emailReg = true;
        } else {
          this.emailReg = false;
        }
      } else {
        this.emailReg = false;
      }
    },
    //获取cookir
    getCookie(name) {
      var strcookie = document.cookie; //获取cookie字符串
      var arrcookie = strcookie.split("; "); //分割
      //遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
          return arr[1];
        }
      }
      return "";
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
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
          if (res.Response.Error === undefined) {
            this.userUin = res.Response.Uin;
          }
          // else {
          //   let ErrTips = {};
          //   let ErrOr = Object.assign(ErrorTips, ErrTips);
          //   this.$message({
          //     message: ErrOr[res.Response.Error.Code],
          //     type: "error",
          //     showClose: true,
          //     duration: 0
          //   });
          // }
        })
        //获取关联的策略
        .then(data => {
          const params = {
            Version: "2019-01-16",
            TargetUin: this.userUin
          };
          this.axios.post(QUERY_POLICY, params).then(res => {
            if (res.Response.Error === undefined) {
              this.multipleSelection = res.Response.List;
            }
            // else {
            //   let ErrTips = {
            //     "InternalError.SystemError": "内部错误",
            //     "nvalidParameter.ParamError": "非法入参"
            //   };
            //   let ErrOr = Object.assign(ErrorTips, ErrTips);
            //   this.$message({
            //     message: ErrOr[res.Response.Error.Code],
            //     type: "error",
            //     showClose: true,
            //     duration: 0
            //   });
            // }
          });
        });
    },
    //初始化用户列表数据
    init() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {
        if (data.Response.Error === undefined) {
          var json = data.Response.Data;
          json.forEach(item => {
            const params = {
              Version: "2019-01-16",
              TargetUin: item.Uin
            };
            this.axios.post(QUERY_POLICY, params).then(res => {
              if (res.Response.Error === undefined) {
                item.policy = res.Response.List;
              }
              // else {
              //   let ErrTips = {
              //     "InternalError.SystemError": "内部错误",
              //     "nvalidParameter.ParamError": "非法入参"
              //   };
              //   let ErrOr = Object.assign(ErrorTips, ErrTips);
              //   this.$message({
              //     message: ErrOr[res.Response.Error.Code],
              //     type: "error",
              //     showClose: true,
              //     duration: 0
              //   });
              // }
            });
          });
          this.userDatas = json;
        } else {
          let ErrTips = {
            "ResourceNotFound.UserNotExist": "用戶不存在"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
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
      this.axios.post(ADD_USERTOGROUP, params).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            "InvalidParameter.GroupNotExist": "用戶組不存在",
            "InvalidParameter.GroupUserFull": "用戶組中的子用戶數量達到上限",
            "InvalidParameter.UserGroupFull": "子用戶加入的用戶組數量達到上限",
            "ResourceNotFound.UserNotExist": "用戶不存在"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
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
        if (res.Response.Error === undefined) {
          this.userpolicyData = res.Response;
        }
        // else {
        //   let ErrTips = {
        //     "ResourceNotFound.UserNotExist": "用户不存在"
        //   };
        //   let ErrOr = Object.assign(ErrorTips, ErrTips);
        //   this.$message({
        //     message: ErrOr[res.Response.Error.Code],
        //     type: "error",
        //     showClose: true,
        //     duration: 0
        //   });
        // }
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
        if (res.Response.Error === undefined) {
          if (res.Response.RequestId) {
            this.active = 3;
          }
        } else {
          let ErrTips = {
            "FailedOperation.PolicyFull": "用戶策略數超過上限",
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.AttachmentFull":
              "principal欄位的授權對象關聯策略數已達到上限",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
            "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
            "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
            "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
            "ResourceNotFound.UserNotExist": "用戶不存在"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //新建子用户
    _arrUser() {
      this.loading = true;
      const params = {
        Version: "2019-01-16",
        Name: this.ruleForm.Name,
        Remark: this.ruleForm.Remark,
        ConsoleLogin: this.ruleForm.ConsoleLogin,
        Password: this.ruleForm.pwdRadio ? this.ruleForm.Password : "",
        NeedResetPassword: this.ruleForm.pwdType.includes(0) ? 1 : 0,
        PhoneNum: this.ruleForm.PhoneNum,
        CountryCode: this.ruleForm.CountryCode,
        Email: this.ruleForm.Email,
        UseApi: 1
      };
      this.axios
        .post(ADD_USER, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.taifuAIP = res.Response;
            if (res.Response.Error) {
              this.$message({
                showClose: true,
                message: res.Response.Error.Message,
                type: "error",
                duration: 0
              });
            } else {
              this.$nextTick(() => {
                if (this.btnVal == "完成") {
                  this.$router.push("/UserListNew");
                }
              })
              if (this.pwdReg) {
                this._getUser();
                this.active = 2;
              }
            }
          } else {
            let ErrTips = {
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PasswordViolatedRules":
                "密碼不符合用戶安全設置",
              "InvalidParameter.SubUserFull": "子帳號數量達到上限",
              "InvalidParameter.SubUserNameInUse": "子用戶名稱重複"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.loading = false;
        })
        .then(() => {
          const params = {
            Password: "yes",
            QcloudUin: this.getCookie("uin"), //uin
            SecretId: this.taifuAIP.SecretId,
            SecretKey: this.taifuAIP.SecretKey,
            SubAccountUin: String(this.taifuAIP.Uin),
            SubAccountname: this.taifuAIP.Name
          };
          this.axios
            .post(
              `${process.env.VUE_APP_adminUrl}taifucloud/account-sub/manage/register`,
              params
            )
            .then(res => {
              console.log(res);
            });
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
        if (res.Response.Error === undefined) {
          this.userData = res.Response.GroupInfo;
          this.userNum = res.Response.TotalNum;
          var data = this.userData;
          data.forEach(item => {
            const params = {
              Version: "2019-01-16",
              TargetGroupId: item.GroupId
            };
            this.axios.post(GROUP_POLICY, params).then(res => {
              if (res.Response.Error === undefined) {
                item.policy = res.Response.List;
              }
              // else {
              //   let ErrTips = {
              //     "InternalError.SystemError": "内部错误",
              //     "InvalidParameter.ParamError": "非法入参"
              //   };
              //   let ErrOr = Object.assign(ErrorTips, ErrTips);
              //   this.$message({
              //     message: ErrOr[res.Response.Error.Code],
              //     type: "error",
              //     showClose: true,
              //     duration: 0
              //   });
              // }
            });
          });
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
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
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.List;
          this.totalNum = res.Response.TotalNum;
        }
        // else {
        //   let ErrTips = {
        //     "InternalError.SystemError": "内部错误",
        //     "InvalidParameter.GroupIdError": "GroupId字段不合法",
        //     "InvalidParameter.KeywordError": "Keyword字段不合法",
        //     "InvalidParameter.ParamError": "非法入参",
        //     "InvalidParameter.ScopeError": "Scope字段不合法",
        //     "InvalidParameter.ServiceTypeError": "ServiceType字段不合法",
        //     "InvalidParameter.UinError": "Uin字段不合法"
        //   };
        //   let ErrOr = Object.assign(ErrorTips, ErrTips);
        //   this.$message({
        //     message: ErrOr[res.Response.Error.Code],
        //     type: "error",
        //     showClose: true,
        //     duration: 0
        //   });
        // }
      });
    },
    //控制台密码
    _pwdRadio() {
      if (this.ruleForm.pwdRadio) {
        this.pwdInp = true;
        this.pwdlenReg = true;
        this.pwdtypeReg = true;
        this.pwdreReg = true;
      } else {
        this.pwdInp = false;
        this.pwdlenReg = false;
        this.pwdtypeReg = false;
        this.pwdreReg = false;
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
        if (this.phoneReg) {
          this.$message({
            showClose: true,
            message: "請輸入正確的手機號",
            type: "error",
            duration: 0
          });
        } else if (this.emailReg) {
          this.$message({
            showClose: true,
            message: "請輸入正確的郵箱",
            type: "error",
            duration: 0
          });
        } else {
          if (!this.visitType) {
            if (!this.ruleForm.Name) {
              this.$message({
                showClose: true,
                message: "用戶名不能為空",
                type: "error",
                duration: 0
              });
            } else if (this.ruleForm.type.length == 0) {
              this.$message({
                showClose: true,
                message: "編程訪問和台富雲控制台訪問至少需要選擇一個",
                type: "error",
                duration: 0
              });
            } else {
              this._arrUser();
            }
          }
          if (this.visitType) {
            if (!this.ruleForm.Name) {
              this.$message({
                showClose: true,
                message: "用戶名不能為空",
                type: "error",
                duration: 0
              });
            } else if (this.ruleForm.type.length == 0) {
              this.$message({
                showClose: true,
                message: "編程訪問和台富雲控制台訪問至少需要選擇一個",
                type: "error",
                duration: 0
              });
            } else if (this.ruleForm.loginRadio === "") {
              this.$message({
                showClose: true,
                message: "請設置登入保護",
                type: "error",
                duration: 0
              });
            } else if (this.ruleForm.processRadio === "") {
              this.$message({
                showClose: true,
                message: "請設置操作保護",
                type: "error",
                duration: 0
              });
            } else if (this.ruleForm.pwdRadio && (this.pwdlenReg || this.pwdtypeReg || this.pwdreReg)) {
              this.$message({
                showClose: true,
                message: "密碼格式輸入有誤",
                type: "error",
                duration: 0
              });
            } else {
              this._arrUser();
            }
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
    white-space: nowrap;
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

    .reg {
      position: relative;

      span {
        position: absolute;
        bottom: -12px;
        left: 10px;
      }

      .red {
        color: red;
      }

      .green {
        color: green;
      }
    }

    .regPWD {
      position: relative;

      .reg-box {
        p {
          line-height: 20px;
          font-size: 12px;
        }

        .green {
          color: green;
        }

        .red {
          color: red;
        }
      }
    }

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
