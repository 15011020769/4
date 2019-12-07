<template>
  <div class="createAccount">
    <div class="top">
      <img style="width:20px;cursor: pointer;" @click="back" src="../../../assets/CAM/images/left.png" alt />
      <span class="top_text">{{$t('CAM.Role.top_text')}}</span>
    </div>
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
                <el-radio v-model="radio" label="2">{{$t('CAM.Role.otherMainAccount')}}</el-radio> -->
                <el-radio-group v-model="radioAccount" @change="changeAccount">
                  <el-radio label="1">{{$t('CAM.Role.currentMainAccount')}}</el-radio>
                  <el-radio label="2">{{$t('CAM.Role.otherMainAccount')}}</el-radio>
                </el-radio-group>
              </p>
              <p>
                <el-input v-model="input_num" placeholder="请输入内容" size="mini" :disabled="disabledAccount"
                  style="width:150px"></el-input>
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
                <el-input v-model="inputRoleName" :placeholder="$t('CAM.Role.inputRoleName')" size="mini"
                  @blur="jsname"></el-input>
                <p v-if="have" style="font-size:12px;color:#E1504A;padding-top:10px">
                  {{$t('CAM.Role.isNotNullRoleName')}}</p>
              </div>
              <p class="jscontent">
                <el-input v-model="inputRoleDesc" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">服务-mps.cloud.tencent.com</p>
            </div>
          </div>
          <div class="content_table">
            <el-table :data="policiesSelectedData" height="300" border style="width: 100%">
              <el-table-column prop="PolicyName" :label="$t('CAM.Role.strategyName')"></el-table-column>
              <el-table-column prop="Description" :label="$t('CAM.Role.desc')"></el-table-column>
              <el-table-column prop="Type" :label="$t('CAM.Role.strategyType')">
                <template slot-scope="scope">
                  <p v-show="scope.row.Type == 1">自定义策略</p>
                  <p v-show="scope.row.Type == 2">预设策略</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">{{$t('CAM.Role.goBack')}}</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">{{$t('CAM.Role.toStep')}}</el-button>
          <el-button type="primary" size="small" v-if="active == 3" @click="complete">{{$t('CAM.Role.complete')}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import transfer from "./component/transfer";
  export default {
    components: {
      transfer
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
        tableData: [{
          date: "QCloudFinanceFullAccess",
          name: "	该策略允许您管理账户内财务相关的内容，例如：付款、开票。",
          address: "预设策略"
        }]
      };
    },

    methods: {
      back() {
        this.$router.push("/Role");
      },
      next() {
        let _this = this
        if (this.active == 1) {
          //其他主账号时需要校验账户
          if (_this.radioAccount === '2') {
            _this.checkAccount()
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
      // 切换腾讯云主账号
      changeAccount() {
        if (this.radioAccount === '2') {
          this.disabledAccount = false
          this.input_num = ''
        } else {
          this.disabledAccount = true
          this.input_num = '100011921910'
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
        let _this = this
        if (!this.inputRoleName) {
          this.have = true;
          return;
        }
        /**
         * PolicyDocument参数示例：principal用于指定角色的授权对象。获取该参数可参阅 获取角色详情 输出参数RoleInfo
         * service是指定的
          {
            "version": "2.0",
            "statement": [{
              "action": "name/sts:AssumeRole",
              "effect": "allow",
              "principal": {
                "qcs": ["qcs::cam::uin/100011921910:root"]
              }
            }]
          }
         */
        let params = {
          Action: "CreateRole",
          Version: "2019-01-16",
          RoleName: this.inputRoleName,
          Description: this.inputRoleDesc,
          PolicyDocument: '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"qcs":["qcs::cam::uin/' +
            this.input_num + ':root"]}}]}'
        };
        let url = "cam2/CreateRole";
        this.axios.post(url, params).then(data => {
          let roleId = data.Response.RoleId; // 获取创建的角色id
          this.$message("创建角色成功");
          let policiesArray = this.policiesSelectedData // 获取权限策略
          // 根据获取的角色ID创建角色策略
          if (roleId != undefined && roleId != '' && policiesArray != '') {
            for (let i = 0; i < policiesArray.length; i++) {
              let obj = policiesArray[i]
              let params = {
                Action: 'AttachRolePolicy',
                Version: '2019-01-16',
                PolicyId: obj.PolicyId,
                AttachRoleId: roleId
              }
              _this.AttachRolePolicy(params)
            }
          }
          this.back()
        });
      },
      // 绑定权限策略到角色
      AttachRolePolicy(params) {
        this.$axios.post('cam2/AttachRolePolicy', params).then(res => {
          console.log(res)
        })
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

        .step {
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
        }

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
  }

</style>
