<template>
  <div class="createAccount">
    <HeadCom :title="$t('CAM.Role.top_text')" :backShow="true" @_back="_back" />
    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps :active="active" simple :space="200" finish-status="success">
            <el-step :title="$t('CAM.Role.step_titile1')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile2')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile3')"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
          <div class="first">
            <div class="first_left">
              <p style="margin-bottom:40px">{{$t('CAM.Role.cloudCardType')}}</p>
              <p>{{$t('CAM.Role.cardId')}}</p>
            </div>
            <div class="first_right">
              <p style="margin-bottom:30px">
                <!-- <el-radio v-model="radio" label="1">{{$t('CAM.Role.currentMainAccount')}}</el-radio>
                <el-radio v-model="radio" label="2">{{$t('CAM.Role.otherMainAccount')}}</el-radio>-->
                <el-radio-group v-model="radioAccount" @change="changeAccount">
                  <el-radio label="1">{{$t('CAM.Role.currentMainAccount')}}</el-radio>
                  <el-radio label="2">{{$t('CAM.Role.otherMainAccount')}}</el-radio>
                </el-radio-group>
              </p>
              <p>
                <el-input
                  v-model="input_num"
                  :placeholder="$t('CAM.strategy.inputContent')"
                  size="mini"
                  :disabled="disabledAccount"
                  style="width:150px"
                ></el-input>
              </p>
            </div>
          </div>
        </div>
        <div class="tansfer" v-if="active == 2">
          <transfer ref="tansferStep"></transfer>
        </div>
        <div class="shenyue" v-if="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese">{{$t('CAM.Role.roleName')}}*</p>
              <p class="juese" style="margin-top:55px">{{$t('CAM.Role.roleDesc')}}</p>
              <p class="juese">{{$t('CAM.Role.roleCarrier')}}</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input
                  v-model="inputRoleName"
                  :placeholder="$t('CAM.Role.inputRoleName')"
                  size="mini"
                  @blur="jsname"
                ></el-input>
                <p
                  v-if="have"
                  style="font-size:12px;color:#E1504A;padding-top:10px"
                >{{$t('CAM.Role.isNotNullRoleName')}}</p>
              </div>
              <p class="jscontent">
                <el-input v-model="inputRoleDesc" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">{{$t('CAM.Role.serveRole')}}-mps.cloud.tencent.com</p>
            </div>
          </div>
          <div class="content_table">
            <el-table :data="policiesSelectedData" height="300" border style="width: 100%" :empty-text="$t('CAM.strategy.zwsj')">
              <el-table-column prop="PolicyName" :label="$t('CAM.Role.strategyName')"></el-table-column>
              <el-table-column prop="Description" :label="$t('CAM.Role.desc')"></el-table-column>
              <el-table-column prop="Type" :label="$t('CAM.Role.strategyType')">
                <template slot-scope="scope">
                  <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
                  <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">{{$t('CAM.Role.goBack')}}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="next"
            v-if="active != 3"
          >{{$t('CAM.Role.toStep')}}</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="active == 3"
            @click="complete"
          >{{$t('CAM.Role.complete')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import transfer from "./component/transfer";
import HeadCom from "../UserListNew/components/Head";
import { CREATE_ROLE, ATTACH_ROLE } from "@/constants";
export default {
  components: {
    transfer,
    HeadCom
  },
  data() {
    return {
      active: 1,
      input_num: "100011921910",
      inputRoleName: "",
      inputRoleDesc: "",
      have: false,
      radioAccount: "1",
      disabledAccount: true,
      policiesData: [],
      policiesSelectedData: [],
      transfer_value: [],
      tableData: [
        {
          date: "QCloudFinanceFullAccess",
          name: "	該策略允許您管理賬戶內財務相關的內容，例如：付款、開票。",
          address: "預設策略"
        }
      ]
    };
  },

  methods: {
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    back() {
      this.$router.push("/Role");
    },
    next() {
      let _this = this;
      if (this.active == 1) {
        //其他主账号时需要校验账户
        if (_this.radioAccount === "2") {
          _this.checkAccount();
        }
        this.active = this.active + 1;
      } else if (this.active == 2) {
        this.policiesSelectedData = this.$refs.tansferStep.getData();
        console.log(this.policiesSelectedData);
        if (this.active == 3) {
          return;
        }
        this.active = this.active + 1;
      }
    },
    reTurn() {
      if (this.active == 1) {
        return;
      }
      this.active = this.active - 1;
    },

    leftCheck(val) {},
    // 角色名称校验
    jsname() {
      if (!this.inputRoleName) {
        this.have = true;
      } else {
        this.have = false;
      }
    },
    // 切换腾讯雲主账号
    changeAccount() {
      if (this.radioAccount === "2") {
        this.disabledAccount = false;
        this.input_num = "";
      } else {
        this.disabledAccount = true;
        this.input_num = "100011921910";
      }
    },
    // 校验主账号，暂时没有发现接口先不校验；点击下一步或者光标离开输入框时校验。
    checkAccount() {
      // let url = "cam2/CheckAccount";
      // let params = {
      //   Action: "CheckAccount",
      //   Version: "2019-01-16",
      //   Uin: this.input_num
      // };
      // this.axios.post(url, params).then(res => {
      //   if (res != '' && data.Response.data.IsExist != undefined && data.Response.data.IsExist === false) {
      //     this.have = true;
      //   } else {
      //     this.have = false;
      //   }
      // }).catch(error => {
      // });
    },
    //新建自定义角色创建
    complete() {
      let _this = this;
      if (!this.inputRoleName) {
        this.have = true;
        return;
      }
      let params = {
        Version: "2019-01-16",
        RoleName: this.inputRoleName,
        Description: this.inputRoleDesc,
        PolicyDocument:
          '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"qcs":["qcs::cam::uin/' +
          this.input_num +
          ':root"]}}]}'
      };
      this.axios.post(CREATE_ROLE, params).then(data => {
        if(data.Response.Error === undefined){
          let roleId = data.Response.RoleId; // 获取创建的角色id
          if (data.Response.Error) {
            if (data.Response.Error.Code == "InvalidParameter.RoleNameError") {
              this.$message({
              message: "角色名不合法。",
              type: "error",
              showClose: true,
              duration: 0
            })
            }
          } else {
            this.$message({
              message: "創建角色成功",
              type: "success",
              showClose: true,
              duration: 0
            })
          }

          let policiesArray = this.policiesSelectedData; // 获取权限策略
          // 根据获取的角色ID创建角色策略
          if (roleId != undefined && roleId != "" && policiesArray != "") {
            for (let i = 0; i < policiesArray.length; i++) {
              let obj = policiesArray[i];
              let params = {
                Action: "AttachRolePolicy",
                Version: "2019-01-16",
                PolicyId: obj.PolicyId,
                AttachRoleId: roleId
              };
              _this.AttachRolePolicy(params);
            }
          }
          this.back();
        }else{
            let ErrTips = {
              "InternalError.SystemError":'內部錯誤',
               "InvalidParameter.AttachmentFull":'principal欄位的授權對象關聯策略數已達到上限',
               "InvalidParameter.ConditionError":'策略文檔的condition欄位不合法',
               "InvalidParameter.DescriptionLengthOverlimit":'Description入參長度不能大於300位元組',
               "InvalidParameter.ParamError":'非法入參',
               "InvalidParameter.PrincipalError":'策略文檔的principal欄位不合法',
               "InvalidParameter.RoleFull":'角色數量達到上限',
               "InvalidParameter.RoleNameError":'角色名不合法',
               "InvalidParameter.RoleNameInUse":'相同名稱的角色已存在',
               "InvalidParameter.UserNotExist":'principal欄位的授權對象不存在'
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
    // 绑定权限策略到角色
    AttachRolePolicy(params) {
      this.$axios.post(ATTACH_ROLE, params).then(res => {
        if(res.Response.Error === undefined){
          console.log(res);
        }else{
          let ErrTips = {
             "InternalError.SystemError":'內部錯誤',
             "InvalidParameter.AttachmentFull":'principal欄位的授權對象關聯策略數已達到上限',
             "InvalidParameter.ParamError":'非法入參',
             "InvalidParameter.PolicyIdNotExist":'策略ID不存在',
             "InvalidParameter.RoleNotExist":'角色不存在'
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
    }
  }
};
</script>
<style lang="scss" scoped>
.createAccount {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;

    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }

  .container {
    padding-top: 20px;

    .contant {
      max-width: 96%;
      margin: 0 auto;
      padding: 20px;
      background: #fff;

      .contant_flex {
        display: flex;
        padding-top: 20px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;

        .flex_right {
          padding-left: 20px;

          .el-checkbox {
            margin-left: 0;
          }
        }
      }
    }
  }

  .shenyue {
    .content_flex {
      display: flex;
      padding: 20px 0 0 5px;

      .content_left {
        color: #888;
        padding-right: 20px;

        .juese {
          margin-bottom: 40px;
          margin-top: 10px;
        }
      }

      .content_right {
        .jscontent {
          margin-bottom: 20px;
        }

        .text {
          margin-top: 35px;
        }
      }
    }
  }

  .first {
    display: flex;

    .first_left {
      color: #888;
    }

    .first_right {
      padding-left: 50px;
    }
  }
  .step >>> .el-steps {
    background: white;
    padding-bottom: 25px;
  }
}
</style>
