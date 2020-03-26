<template>
  <div class="carrier">
    <Head :title="$t('CAM.Role.gljszt')" :backShow="true" @_back="_back" />
    <div class="main" v-loading="loading">
      <div
        class="box contant_flex"
        v-if="!loading && type === 'federated' && providers.length"
      >
        <div class="flex_left">
          <p style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap">
            身份提供商
          </p>
        </div>
        <div class="flex_right">
          <el-tag
            closable
            v-for="(a, i) in providers"
            :key="a.name"
            @close="removeProvider(i)"
            style="margin-right: 10px;"
            >{{ a.name }}</el-tag
          >
          <el-button
            style="font-size: 12px;"
            type="text"
            @click="visible2 = true"
            >添加身份提供商</el-button
          >
        </div>
      </div>
      <div
        v-show="!loading && (type !== 'federated' || providers.length === 0)"
      >
        <div class="box contant_flex">
          <div class="flex_left">
            <p style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap">
              雲帳號
            </p>
          </div>
          <div class="flex_right">
            <el-tag
              closable
              v-for="(a, i) in accounts"
              :key="a"
              @close="removeAccount(i)"
              style="margin-right: 10px;"
              >{{ a }}</el-tag
            >
            <el-button
              style="font-size: 12px;"
              type="text"
              @click="visible = true"
              >添加帳戶</el-button
            >
          </div>
        </div>
        <div class="box contant_flex">
          <div class="flex_left">
            <p style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap">
              {{ $t("CAM.Role.support") }}<span class="reds">*</span>
            </p>
          </div>
          <div class="flex_right">
            <el-checkbox-group
              v-model="checkedPrinCipalService"
              @change="handleCheckedCitiesChange"
              style="display:flex;flex-flow: row wrap;align-content: flex-start;font-size:12px"
            >
              <el-checkbox
                v-for="item in prinCipalService"
                :label="item"
                :key="item.Domain"
                style="margin-bottom:15px"
                v-if="item.Name.Zh !== ''"
                >{{ item.Name.Zh }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="box button-box">
        <div class="button-wrap">
          <el-button type="primary" @click="onSubmit" size="small">{{
            $t("CAM.userGroup.delConfirmBtn")
          }}</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加身份提供商"
      :visible.sync="visible2"
      width="1040px"
      destroy-on-close
    >
      <provider
        :visible.sync="visible2"
        :removeProviders="providers"
        @add="addProvider"
      />
    </el-dialog>
    <el-dialog
      title="添加新帳戶"
      :visible.sync="visible"
      @close="beforeClose"
      width="500px"
    >
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="雲帳號類型" prop="accountType" required>
          <el-radio-group v-model="form.accountType">
            <el-radio :label="1">當前主帳號</el-radio>
            <el-radio :label="0">其它主帳號</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="帳號ID"
          prop="uin"
          :rules="[
            {
              required: true,
              message: '請輸入正確的帳號',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            :disabled="form.accountType === 1"
            size="small"
            style="width: 200px"
            v-model="form.uin"
            :maxlength="15"
            @input="val => (form.uin = val.replace(/[^\d]/g, ''))"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary" @click="addAccount" size="small"
          >確定</el-button
        >
        <el-button @click="visible = false" size="small">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Head from "../../UserListNew/components/Head";
import { GET_PRINCIPAL_SERVICE, GET_ROLE, UPDATE_ASSUME } from "@/constants";
import provider from "./provider";
export default {
  name: "carrier",
  data() {
    return {
      prinCipalService: [],
      checkedPrinCipalService: [],
      RoleId: this.$route.query.id,
      type: "",
      visible: false,
      visible2: false,
      loading: true,
      form: {
        accountType: 1,
        uin: this.$cookie.get("uin")
      },
      accounts: [],
      providers: []
    };
  },
  watch: {
    "form.accountType"(n) {
      if (n === 0) this.form.uin = "";
      else this.form.uin = this.$cookie.get("uin");
    }
  },
  components: {
    provider,
    Head
  },
  methods: {
    addProvider(provider) {
      this.visible2 = false;
      this.providers.push(provider);
    },
    removeProvider(i) {
      this.providers.splice(i, 1);
    },
    removeAccount(i) {
      this.accounts.splice(i, 1);
    },
    addAccount() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.accountType === 1) {
            if (this.accounts.includes(this.form.uin)) {
              return void this.$message({
                message: "該帳號已存在",
                type: "error",
                showClose: true,
                duration: 0
              });
            }
            this.accounts.push(this.form.uin);
            this.visible = false;
            this.form.accountType = 1;
          } else {
            this.checkAccount(this.form.uin);
          }
        }
      });
    },
    checkAccount(uin) {
      let url = "cam/CheckAccount";
      let params = {
        uin
      };
      this.axios.post(url, params).then(res => {
        if (res.code !== 0) {
          return void this.$message({
            message: res.message,
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        if (res != "" && res.data.IsExist === false) {
          this.$message({
            message: "該帳號不存在",
            type: "error",
            showClose: true,
            duration: 0
          });
        } else {
          this.accounts.push(uin);
          this.visible = false;
          this.form.accountType = 1;
        }
      });
    },
    beforeClose() {
      this.form.accountType = 1;
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    // 获取载体列表
    getPrinCipalService() {
      let params = {
        Version: "2019-01-16",
        Region: "ap-guangzhou"
      };
      this.axios.post(GET_PRINCIPAL_SERVICE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.prinCipalService = res.Response.PrinciPalService;
          this.getRoleDetail();
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.RoleNotExist": "角色不存在"
          };
          this.loading = false;
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

    // 获取角色详情
    getRoleDetail() {
      let params = {
        Version: "2019-01-16",
        RoleId: this.RoleId
      };
      this.axios.post(GET_ROLE, params).then(res => {
        if (res.Response.Error === undefined) {
          let { PolicyDocument } = res.Response.RoleInfo;
          PolicyDocument = JSON.parse(PolicyDocument);
          const accounts = [];
          if (PolicyDocument.statement[0].principal.qcs) {
            this.type = "qcs";
            PolicyDocument.statement[0].principal.qcs.forEach(u => {
              accounts.push(u.match(/\w+::\w+::uin\/(\d+):/)[1]);
            });
            this.accounts = accounts;
          }
          if (PolicyDocument.statement[0].principal.service) {
            this.type = "service";
            const services = [];
            PolicyDocument.statement[0].principal.service.forEach(item => {
              let temp = this.prinCipalService.find(
                _item => _item.Domain === item
              );
              this.checkedPrinCipalService.push(temp);
            });
          }
          if (PolicyDocument.statement[0].principal.federated) {
            PolicyDocument.statement.forEach(s => {
              const condition = [];
              if (s.condition) {
                const condis = Object.keys(s.condition);
                if (condis.length) {
                  condis.forEach(condi => {
                    Object.keys(s.condition[condi]).forEach(key => {
                      s.condition[condi][key].forEach(val => {
                        condition.push({
                          key,
                          condi,
                          val
                        });
                      });
                    });
                  });
                }
              }
              this.providers.push({
                name: s.principal.federated[0].match(/[^/]*$/)[0],
                condition
              });
            });
            this.type = "federated";
          }
          this.loading = false;
        } else {
          this.loading = false;
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.RoleNotExist": "角色不存在"
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

    // 提交
    onSubmit() {
      if (
        !this.accounts.length &&
        !this.checkedPrinCipalService.length &&
        !this.providers.length
      ) {
        return void this.$message({
          message: "請選擇角色載體",
          type: "error",
          showClose: true,
          duration: 0
        });
      }
      let policyDocument = {
        version: "2.0",
        statement: [
          {
            action: "name/sts:AssumeRole",
            effect: "allow",
            principal: {}
          }
        ]
      };
      const qcs = this.accounts.map(uin => `qcs::cam::uin/${uin}:root`);
      const service = this.checkedPrinCipalService.map(s => s.Domain);
      if (qcs.length) {
        policyDocument.statement[0].principal.qcs = qcs;
      }
      if (service.length) {
        policyDocument.statement[0].principal.service = service;
      }
      if (this.providers.length) {
        policyDocument.statement = [];
        this.providers.forEach(p => {
          const condition = {};
          p.condition.forEach(condi => {
            if (condition[condi.condi]) {
              if (condition[condi.condi][condi.key]) {
                condition[condi.condi][condi.key].push(condi.val);
              } else {
                condition[condi.condi][condi.key] = [condi.val];
              }
            } else {
              condition[condi.condi] = {
                [condi.key]: [condi.val]
              };
            }
          });
          policyDocument.statement.push({
            action: "name/sts:AssumeRoleWithSAML",
            effect: "allow",
            principal: {
              federated: [
                `qcs::cam::uin/${this.$cookie.get("uin")}:saml-provider/${
                  p.name
                }`
              ]
            },
            condition
          });
        });
      }
      let paramsPolicy = {
        Version: "2019-01-16",
        PolicyDocument: JSON.stringify(policyDocument),
        RoleId: this.RoleId
      };
      this.axios.post(UPDATE_ASSUME, paramsPolicy).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: "操作成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this._back();
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤。",
            "InvalidParameter.AttachmentFull":
              "principal欄位的授權對象關聯策略數已達到上限。",
            "InvalidParameter.ConditionError":
              "策略文件的condition欄位不合法。",
            "InvalidParameter.ParamError": "非法入參。",
            "InvalidParameter.PrincipalError":
              "策略文件的principal欄位不合法。",
            "InvalidParameter.RoleNotExist": "角色不存在。",
            "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在。"
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
  },

  mounted() {
    this.getPrinCipalService();
  }
};
</script>

<style scoped lang='scss'>
.carrier >>> .el-checkbox {
  width: 20% !important;
}
.carrier {
  .flex_left {
    width: 100px;
  }
  .contant_flex {
    display: flex;
    padding-top: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    .flex_right {
      width: 100%;
      padding-left: 20px;
      .el-checkbox {
        margin-left: 0;
        width: calc(25% - 30px);
      }
    }
  }
  .main {
    padding: 20px;
    box-sizing: border-box;
    .box {
      background: white;
      padding: 20px;
      box-sizing: border-box;
      margin-top: -1px;
      .button-wrap {
        padding-top: 20px;
        margin: 0 10px;
        border-top: 1px solid #ddd;
      }
    }
    .button-box {
      padding-top: 0px;
    }
  }
}
.reds {
  color: #F56C6C;
}
</style>
