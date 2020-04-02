<template>
  <div class="adduserlist-wrap">
    <HeadCom :title="$t('CAM.userList.createUser')" :backShow="true" @_back="_back" />
    <div class="adduserlist-main" v-loading="loading">
      <el-steps :active="active" simple>
        <!-- <el-step :title="$t('CAM.userList.chooserType')"></el-step> -->
        <el-step :title="$t('CAM.userList.userMesgs')"></el-step>
        <el-step :title="$t('CAM.userList.setStrage')"></el-step>
        <el-step :title="$t('CAM.userList.userMesg')"></el-step>
      </el-steps>
      <div class="main">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div class="step2" v-show="active == 1">
            <el-form-item label="用戶名稱" required>
              <el-input v-model="ruleForm.Name" style="width: 330px" placeholder="請輸入用戶名"></el-input>
              <p style="color: #888;">支持數字英文字母 長度1-32位</p>
              <!-- <table width="100%" boder="1" cellspacing="0" cellpadding="1">
                <thead>
                  <tr>/^[\u4e00-\u9fa5\da-zA-Z_\+=,\.!@-]{1,64}$/
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
              </table> -->
            </el-form-item>
            <el-form-item label="備註" prop="Remark">
              <el-input
                style="width: 330px"
                v-model="ruleForm.Remark"
                :placeholder="$t('CAM.userList.userRemarkPlaceholder')"
              ></el-input>
              <p style="color: #888;">100個英文字母、數字或漢字以內，支持@、._[]-:</p>
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
                  <el-radio :label="false">{{$t('CAM.userList.mrmm')}}</el-radio>
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
              <!-- <el-form-item :label="$t('CAM.userList.resetPassword')">
                <el-checkbox :label="0" name="pwdType">{{$t('CAM.userList.passAgin')}}</el-checkbox>
              </el-form-item> -->
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
            ref="step3"
          />
        </div>
        <div class="step4" v-if="active == 3">
          <Step4
            ref="step4"
            :userInfo.sync="this.ruleForm"
            :strategies="strategies"
          />
        </div>
      </div>
      <div class="btn-box">
        <el-button @click="_lastStep" v-show="this.active > 1">上一步</el-button>
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
  GROUP_POLICY,
  BATCH_OPERATE_CAM_STRATEGY,
  ADD_GROUPTOLIST,
  COPY_USER_POLICY
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
      strategies: [], //全选
      tableData: [],
      active: 1,
      btnVal: "下一步",
      pwdReg: true,
      //选择类型
      type: [
        {
          code: 1,
          title: "可訪問資源並接收消息",
          txt:
            "該用戶可以登錄控制台或通過 API 金鑰訪問您授予其許可權的台富雲資源，同時擁有接收消息等子帳號的全部功能"
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
      typeIndex: 1,
      pwdInp: false, //密码框
      ruleForm: {
        loginRadio: true, //登录保护
        processRadio: true, //操作保护
        type: [],
        CountryCode: "",
        pwdType: [],
        pwdRadio: false,
        Password: "", //密码
        ConsoleLogin: 0, //子用户是否可以登录控制台
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
        // Remark:[
        //   { max: 100, message: "100個英文字母、數字或漢字以內，支持@、._[]-:" },
        //   {
        //     pattern: /^[\u4E00-\u9FFFa-zA-Z0-9@_、.\-:\[\]]+$/g,
        //     message: "100個英文字母、數字或漢字以內，支持@、._[]-:"
        //   }
        // ]
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
  watch: {
    active(n) {
      if (n === 3) {
        this.btnVal = '完成'
      } else {
        this.btnVal = '下一步'
      }
    },
    'ruleForm.Password'() {
      this._pwdInp()
    }
  },
  methods: {
    //密码验证
    _pwdInp() {
      var reg1 = /[1-9]/
      var reg2 = /[a-z]/
      var reg3 = /[A-Z]/
      var reg4 = /[\.?!@#$%^&*()_+~|\\/<>;'`,=]/
      //用户名不能和密码相同
      if (this.ruleForm.Name != this.ruleForm.Password) {
        this.pwdreReg = false;
      } else {
        this.pwdreReg = true;
      }
      // 0. 长度为 8-32 个字符,1. 包含数字，特殊字符（除空格），小写字母，大写字母
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
           reg1.test(this.ruleForm.Password)
        && reg2.test(this.ruleForm.Password)
        && reg3.test(this.ruleForm.Password)
        && reg4.test(this.ruleForm.Password)
        && !/\s/.test(this.ruleForm.Password)
      ) {
        this.pwdtypeReg = false;
      } else {
        this.pwdtypeReg = true;
      }
    },
    //手机号验证
    telInp() {
      var reg = /^09\d{8}$/;
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
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    //新建子用户
    async addUser() {
      this.loading = true
      const param = {
        Version: "2019-01-16",
        Name: this.ruleForm.Name,
        Remark: this.ruleForm.Remark,
        ConsoleLogin: this.ruleForm.type.includes('1') ? 1 : 0,
        Password: this.ruleForm.pwdRadio ? this.ruleForm.Password : "",
        NeedResetPassword: this.ruleForm.pwdType.includes(0) ? 1 : 0,
        PhoneNum: this.ruleForm.PhoneNum,
        CountryCode: this.ruleForm.CountryCode,
        Email: this.ruleForm.Email,
        UseApi: 1
      };
      let res = await this.axios.post(ADD_USER, param)
      if (res.Response.Error) {
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
        })
        this.loading = false
        return
      }
      const params = {
        Password: this.ruleForm.pwdRadio ? this.ruleForm.Password : "Tfc123456",
        QcloudUin: this.$cookie.get("uin"), //uin
        SecretId: res.Response.SecretId,
        SecretKey: res.Response.SecretKey,
        SubAccountUin: String(res.Response.Uin),
        SubAccountname: res.Response.Name
      };
      this.axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/account-sub/manage/register`, params)

      const step3Ref = this.$refs.step3
      //从策略列表中选取策略关联
      if (step3Ref.activeName === "first") {
        const param = {
          Version: "2019-01-16",
          "ActionType": 1, // 绑定
          "RelateUin.0": res.Response.Uin
        }
        this.strategies.forEach((strategy, i) => {
          param[`StrategyId.${i}`] = strategy.PolicyId
        })
        res = await this.axios.post(BATCH_OPERATE_CAM_STRATEGY, param)
      } else if (step3Ref.activeName === "second") { // 复用现有用户策略
        const param = {
          Version: "2019-01-16",
          "FromUin": step3Ref.selectedUser, // 绑定
          "ToUin.0": res.Response.Uin
        }
        res = await this.axios.post(COPY_USER_POLICY, param)
      }
      // //添加至组获得随机权限
      else {
        const param = {
          Version: "2019-01-16",
        }
        this.attachGroupIds.forEach((groupId, i) => {
          param[`Info.${i}.Uid`] = res.Response.Uid
          param[`Info.${i}.GroupId`] = groupId
        })
        res = await this.axios.post(ADD_GROUPTOLIST, param)
      }
      if (res.Response.Error) {
        let ErrTips = {
          "InvalidParameter.GroupNotExist": "用戶組不存在",
          "InvalidParameter.GroupUserFull":
            "用戶組中的子用戶數量達到上限",
          "InvalidParameter.UserGroupFull":
            "子用戶加入的用戶組數量達到上限",
          "ResourceNotFound.UserNotExist": "用戶不存在"
        }
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: `用戶創建成功，但是關聯策略失敗！${ErrOr[res.Response.Error.Code]}`,
          type: "error",
          showClose: true,
          duration: 0
        })
        this.loading = false
        return
      } else {
        this.$message({
          message: '創建成功',
          type: "success",
          showClose: true,
          duration: 0
        })
        this.$router.push('/UserListNew')
      }
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
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    //下一步
    _nextStep(formName) {
      if (this.active == 2) {
        const step3Ref = this.$refs.step3
        //从策略列表中选取策略关联
        if (step3Ref.activeName == "first") {
          if (!step3Ref.selectedPolicyId.length) {
            this.$message({
              message: '請選擇策略',
              type: "error",
              showClose: true,
              duration: 0
            });
            return
          }
          this.strategies = step3Ref.getSelectedStrategiesForStrategies()
        }
        // //复用现有用户策略
        else if (step3Ref.activeName == "second") {
          if (!step3Ref.selectedUser) {
            this.$message({
              message: '請選擇用戶',
              type: "error",
              showClose: true,
              duration: 0
            });
            return
          }
          this.strategies = step3Ref.getSelectedStrategiesForUser()
        }
        // //添加至组获得随机权限
        else if (step3Ref.activeName == "third") {
          if (!step3Ref.selectedUserGroupId.length) {
            this.$message({
              message: '請選擇用戶組',
              type: "error",
              showClose: true,
              duration: 0
            });
            return
          }
          const result = step3Ref.getSelectedStrategiesForUserGroup()
          const strategies = []
          const attachGroupIds = []
          Object.keys(result).forEach(groupId => {
            attachGroupIds.push(groupId)
            strategies.push(...result[groupId])
          })
          this.attachGroupIds = attachGroupIds
          this.strategies = strategies
        }
        this.active += 1
        return
      }
      if (this.active === 3) {
        // console.log(object)
        if (this.ruleForm.Remark && !/^[\u4E00-\u9FFFa-zA-Z0-9@_、.\-:\[\]]+$/g.test(this.ruleForm.Remark)) {
           this.$message({
            showClose: true,
            message: "備註格式錯誤",
            type: "error",
            duration: 0
          })
          return
        }
        const step4Ref = this.$refs.step4
        if (!step4Ref.phoneReg && !step4Ref.emailReg) {
          this.addUser()
        }
      }
      if (this.active == 1) {
        let flag = false
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
        } else if (!this.ruleForm.Name || !/^[\da-zA-Z]{1,32}$/.test(this.ruleForm.Name)) {
          this.$message({
            showClose: true,
            message: "用戶名格式錯誤",
            type: "error",
            duration: 0
          });
        } else if (this.ruleForm.Remark && !/^[\u4E00-\u9FFFa-zA-Z0-9@_、.\-:\[\]]+$/g.test(this.ruleForm.Remark)) {
           this.$message({
            showClose: true,
            message: "備註格式錯誤",
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
        } else if (this.visitType) {
          if (this.ruleForm.loginRadio === "") {
            this.$message({
              showClose: true,
              message: "請設置登錄保護",
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
            flag = true
          }
        } else {
          flag = true
        }
        if (flag) {
          this.loading = true
          this.axios.post(QUERY_USER, {
            Version: '2019-01-16',
            Name: this.ruleForm.Name
          })
          .then(res => {
            if (res.Response.Uid) {
              this.$message({
                message: '子用戶名稱重複',
                type: "error",
                showClose: true,
                duration: 0
              });
            } else {
              this.active += 1
            }
          }).then(() => {
            this.loading = false
          })
        }
      }
      if (this.active === 0) {
        this.active += 1
      }
    },
    //上一步
    _lastStep() {
      this.active -= 1
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
