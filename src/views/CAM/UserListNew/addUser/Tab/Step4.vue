<template>
  <div class="edit-wrap">
    <div class="explain">
      <p>{{$t('CAM.userList.heckYourSelf')}}</p>
    </div>
    <div class="edit-main">
      <div class="edit-box">
         <h3>{{$t('CAM.userList.userMessage')}}</h3>
        <el-form label-width="120px" :model="userInfo" :rules="rules">
          <el-form-item :label="$t('CAM.userList.userName')">
            {{userInfo.Name}}
          </el-form-item>
          <el-form-item label="備註" prop="Remark">
            <el-input v-model="userInfo.Remark" style="width: 330px"></el-input>
            <p style="color: #888;">100個英文字母、數字或漢字以內，支持@、._[]-:</p>
          </el-form-item>
        </el-form>
        <!--<table width="100%" boder="1" cellspacing="0" cellpadding="1">
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
              <td>{{userInfo.Name}}</td>
              <td>
                <el-input v-model="userInfo.Remark"></el-input>
              </td>
              <td class="reg">
                <el-input v-model="userInfo.PhoneNum" @change="telInp"></el-input>
                <span class="red" v-show="phoneReg">{{$t('CAM.userList.sjhyw')}}</span>
              </td>
              <td class="reg">
                <el-input v-model="userInfo.Email" @change="emailInp"></el-input>
                <span class="red" v-show="emailReg">{{$t('CAM.userList.yxsryw')}}</span>
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
      <div class="edit-box">
        <h3>{{$t('CAM.userList.askMesg')}}</h3>
        <el-form label-width="120px">
          <el-form-item :label="$t('CAM.userList.askWay')">
            <p v-if="userInfo.type.includes('1')">可以訪問控制台</p>
            <p v-else>不能訪問控制台</p>
          </el-form-item>
          <el-form-item :label="$t('CAM.userList.passType')">
            <p v-if="userInfo.pwdRadio">{{$t('CAM.userList.Custom')}}</p>
            <p v-else>{{$t('CAM.userList.generation')}}</p>
          </el-form-item>
          <el-form-item :label="$t('CAM.userList.resetPassword')">
            <p v-if="userInfo.pwdType.length != 0">是</p>
            <p v-if="userInfo.pwdType.length == 0">否</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-box">
        <h3>{{$t('CAM.userList.policyMesg')}}</h3>
        <el-table
          :data="strategies"
          style="width: 100%"
          max-height="520"
        >
         <el-table-column label="策略名" prop="PolicyName"></el-table-column>
          <el-table-column label="描述" prop="Description"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  QUERY_USER,
  QUERY_POLICY,
  REMOVEBIND_USER,
  RELATE_USER,
  DEL_USERTOGROUP,
  UPDATA_USER
} from "@/constants";
export default {
  name: "edit",
  props: {
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    strategies: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      phoneReg: false,
      emailReg: false,
      loading: true, //加载
      tableloading: true, //表格加载
      //表单
      num: 0,
      userList: [],
      policyData: [], //策略列表
      userData: {}, //用户信息
      userInp: false, //用户信息input
      rules: {
        // Remark:[
        //   { max: 100, message: "100個英文字母、數字或漢字以內，支持@、._[]-:" },
        //   {
        //     pattern: /^[\u4E00-\u9FFFa-zA-Z0-9@_、.\-:\[\]]+$/g,
        //     message: "100個英文字母、數字或漢字以內，支持@、._[]-:"
        //   }
        // ]
      }
    };
  },
  methods: {
    //手机号验证
    telInp() {
      var reg = /^09\d{8}$/;
      if (this.userInfo.PhoneNum != "") {
        if (!reg.test(this.userInfo.PhoneNum)) {
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
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.userInfo.Email != "") {
        if (!reg.test(this.userInfo.Email)) {
          this.emailReg = true;
        } else {
          this.emailReg = false;
        }
      } else {
        this.emailReg = false;
      }
    },
    //用户信息编辑
    _edit() {
      this.userInp = !this.userInp;
    },
    //用户信息取消
    // _userCancel() {
    //   this.userInp = !this.userInp;
    // },
    //用户信息确定
    // _userConfirm() {
    //   const params = {
    //     Version: "2019-01-16",
    //     Name: this.name,
    //     Remark: this.form.Remark,
    //     PhoneNum: this.form.PhoneNum,
    //     Email: this.form.Email
    //   };
    //   if (this.phoneReg) {
    //     this.$message({
    //       showClose: true,
    //       message: "請輸入正確的手機號",
    //       duration: 0,
    //       type: "error"
    //     });
    //   } else if (this.emailReg) {
    //     this.$message({
    //       showClose: true,
    //       message: "請輸入正確的郵箱",
    //       duration: 0,
    //       type: "error"
    //     });
    //   } else {
    //     this.axios
    //       .post(UPDATA_USER, params)
    //       .then(res => {
    //         if (res.Response.Error === undefined) {
    //           this.$message({
    //             showClose: true,
    //             message: "編輯成功",
    //             duration: 0,
    //             type: "success"
    //           });
    //           this.userInp = !this.userInp;
    //         } else {
    //           let ErrTips = {
    //             "InvalidParameter.PasswordViolatedRules":
    //               "密碼不符合用戶安全設置",
    //             "ResourceNotFound.UserNotExist": "用戶不存在"
    //           };
    //           let ErrOr = Object.assign(ErrorTips, ErrTips);
    //           this.$message({
    //             message: ErrOr[res.Response.Error.Code],
    //             type: "error",
    //             showClose: true,
    //             duration: 0
    //           });
    //         }
    //       })
    //       .then(() => {
    //         this._getUser();
    //       });
    //   }
    // },
  },
};
</script>

<style scoped lang='scss'>
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.edit-wrap {
  width: 100%;
  height: 100%;
  .edit-main >>> .el-form-item {
    margin-bottom: 0;
  }
  .edit-main >>> .el-form-item__content {
    p {
      font-size: 12px;
    }
  }
  .edit-main {
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

    .omit {
      // width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .page-box {
      padding: 15px 0;
      box-sizing: border-box;
      color: #666;
    }

    .edit {
      color: #006eff;
      cursor: pointer;
    }

    h3 {
      font-size: 14px;
      line-height: 14px;
      margin: 15px 0;
    }
    .edit-box {
      padding-bottom: 15px;
      box-sizing: border-box;
    }
    table {
      border: 1px #f2f2f2 solid;
      thead {
        td {
          font-weight: bold;
          color: #888;
          padding: 10px;
          box-sizing: border-box;
        }
      }
      tbody {
        td {
          padding: 10px;
          box-sizing: border-box;
        }
        .userInp {
          td {
            padding: 16px 10px;
          }
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
  }
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    p {
      line-height: 20px;
    }
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
</style>