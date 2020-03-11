<template>
  <div class="createProvider">
    <HeadCom :title="$t('CAM.Role.top_text')" :backShow="true" @_back="_back" />
    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps :active="active" simple finish-status="success">
            <el-step :title="$t('CAM.Role.step_titile1')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile2')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile3')"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
          <el-form :model="form" ref="form">
            <div class="first">
              <div class="first_left">
                <p style="margin-bottom:50px">身份提供商</p>
                <p>{{$t('CAM.Role.kztfw')}}</p>
                <p style="margin-top:30px">{{$t('CAM.Role.sytj')}}</p>
              </div>
              <div class="first_right">
                <p style="margin-bottom:30px">
                  <el-form-item
                    prop="provider"
                    :rules="{
                      required: true, message: ' ', trigger: 'blur'
                    }"
                  >
                    <el-select v-model="form.provider" filterable :placeholder="$t('CAM.Role.zwkxsftgs')" size="small">
                      <el-option
                        v-for="item in providers"
                        :key="item.Name"
                        :label="item.Name"
                        :value="item.Name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </p>
                <p>
                  <el-form-item prop="consoleLogin">
                    <el-checkbox v-model="form.consoleLogin">{{$t('CAM.Role.yxjsfwkzt')}}</el-checkbox>
                  </el-form-item>
                </p>
                <div style="width:900px;margin-top:40px">
                  <el-table :data="form.condition" max-height="450" class="condi-table" :empty-text="$t('CAM.strategy.zwsj')">
                    <el-table-column prop="date" :label="$t('CAM.Role.jian')" width="200px">
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="`condition.${scope.$index}.key`"
                          :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }"
                        >
                          <el-select v-model="form.condition[scope.$index].key" :placeholder="$t('CAM.Role.qxz')" size="small">
                            <el-option
                              v-for="item in keys"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" :label="$t('CAM.Role.tj')" width="250px">
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="`condition.${scope.$index}.condi`"
                          :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }"
                        >
                          <el-select v-model="form.condition[scope.$index].condi" :placeholder="$t('CAM.Role.qxz')" size="small" style="width: 230px">
                            <el-option
                              v-for="item in values"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label="值">
                      <template slot-scope="scope">
                        <el-form-item
                         :prop="`condition.${scope.$index}.val`"
                         :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }"
                        >
                          <el-input v-model="form.condition[scope.$index].val" :placeholder="$t('CAM.strategy.inputContent')" size="small"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label width="100">
                      <template slot-scope="scope">
                        <a href="JavaScript:;" @click="detele(scope)">删除</a>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p style="margin-top: 15px;">共{{form.condition.length}}项</p>
                  <p style="margin-top:20px">
                    <el-button size="small" @click="add_use">{{$t('CAM.Role.xzsytj')}}</el-button>
                  </p>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="tansfer" v-show="active == 2">
          <transfer ref="tansferStep"></transfer>
        </div>
        <div class="shenyue" v-show="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese">角色名称*</p>
              <p class="juese" style="margin-top:55px">角色描述</p>
              <p class="juese">角色载体</p>
              <p class="juese">身份提供商</p>
              <p class="juese">访问类型</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input v-model="inputName" placeholder="请输入角色名称" size="mini" @blur="jsname"></el-input>
                <p v-if="have" style="font-size:12px;color:#E1504A;padding-top:10px">1-128個英文字母、數字和+=,.@_-</p>
              </div>
              <p class="jscontent">
                <el-input v-model="input" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">身份提供商</p>
              <p class="jscontent text">{{form.provider}}</p>
              <p class="jscontent text">{{form.consoleLogin ? '編程訪問，台富雲控制台訪問' : '編程訪問'}}</p>
            </div>
          </div>
          <div class="content_table">
            <el-table :data="policiesSelectedData" height="300" border style="width: 100%">
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
          <el-button size="small" v-if="active != 1" @click="reTurn">返回</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">下一步</el-button>
          <el-button type="primary" size="small" v-if="active == 3" @click="finall">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
import transfer from "./component/transfer";
import { LIST_PROVIDERS, ATTACH_ROLE_POLICIES, CREATE_ROLE } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      form: {
        provider: '',
        consoleLogin: false,
        condition: [],
      },
      providers: [],
      provider: '',
      active: 1,
      input: "",
      inputName: "",
      have: false,
      radio: "1",
      checked: true,
      value: "",
      checkedCities: [],
      transfer_value: [],
      keys: [
        {
          value: "saml:iss",
          label: "saml:iss"
        },
        {
          value: "saml:aud",
          label: "saml:aud"
        },
        {
          value: "saml:sub",
          label: "saml:sub"
        },
        {
          value: "saml:sub_type",
          label: "saml:sub_type"
        }
      ],
      values: [
        {
          value: 'string_equal',
          label: 'string_equal',
        },
        {
          value: 'string_not_equal',
          label: 'string_not_equal',
        },
        {
          value: 'string_equal_ignore_case',
          label: 'string_equal_ignore_case',
        },
        {
          value: 'string_not_equal_ignore_case',
          label: 'string_not_equal_ignore_case',
        },
      ],
      policiesSelectedData: []
    };
  },
  components:{
    HeadCom,
    transfer
  },
  mounted() {
    let params = {
      Version: "2019-01-16"
    };
    this.axios
      .post(LIST_PROVIDERS, params)
      .then(res => {
        this.providers = res.Response.SAMLProviderSet
      })
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
      if (this.active == 1) {
        if (!this.form.provider) {
          return void this.$message({
            message: "請選擇身份提供商",
            type: "error",
            showClose: true,
            duration: 0
          })
        }
         this.$refs.form.validate((valid) => {
          if (valid) {
            this.active = this.active + 1;
          }
        })
      } else if (this.active == 2) {
        this.policiesSelectedData = this.$refs.tansferStep.selectedStrategies;
        if (this.policiesSelectedData.length === 0) {
          return void this.$message({
                        message: "請選擇策略",
                        type: "error",
                        showClose: true,
                        duration: 0
                      })
        }
        if (this.active == 3) {
          return
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
    jsname() {
      if (!/^[a-zA-Z\d\+=,\.@_-]{1,128}$/.test(this.inputName)) {
        this.have = true;
      } else {
        this.have = false;
      }
    },
    finall() {
      if (!/^[a-zA-Z\d\+=,\.@_-]{1,128}$/.test(this.inputName)) {
        this.have = true;
        return;
      }
      const condition = {}
      this.form.condition.forEach(condi => {
        if (condition[condi.condi]) {
          if (condition[condi.condi][condi.key]) {
            condition[condi.condi][condi.key].push(condi.val)
          } else {
            condition[condi.condi][condi.key] = [condi.val]
          }
        } else {
          condition[condi.condi] = {
            [condi.key]: [condi.val]
          }
        }
      })
      const policyDocument = {
        "version":"2.0",
        "statement":[
          {
            "action":"name/sts:AssumeRoleWithSAML",
            "effect":"allow",
            "principal":{
              "federated":[
                `qcs::cam::uin/${this.$cookie.get('uin')}:saml-provider/${this.form.provider}`
              ]
            },
            "condition":{},
          }
        ]
      }
      policyDocument.statement[0].condition = condition
      let params = {
        Version: "2019-01-16",
        RoleName: this.inputName,
        Description: this.input,
        PolicyDocument: JSON.stringify(policyDocument),
        ConsoleLogin: Number(this.form.consoleLogin)
      };
      this.axios.post(CREATE_ROLE, params).then(data => {
        let roleId = data.Response.RoleId; // 获取创建的角色id
        if (data.Response.Error) {
          const error = {
            'InternalError.SystemError': '內部錯誤。',
            'InvalidParameter.AttachmentFull': 'principal欄位的授權對象關聯策略數已達到上限。',
            'InvalidParameter.ConditionError': '策略文檔的condition欄位不合法。',
            'InvalidParameter.DescriptionLengthOverlimit': 'Description入參長度不能大於300位元組。',
            'InvalidParameter.ParamError': '非法入參。',
            'InvalidParameter.PrincipalError': '策略文檔的principal欄位不合法。',
            'InvalidParameter.RoleFull': '角色數量達到上限。',
            'InvalidParameter.RoleNameError': '角色名不合法。',
            'InvalidParameter.RoleNameInUse': '相同名稱的角色已存在。',
            'InvalidParameter.UserNotExist': 'principal欄位的授權對象不存在。',
          }
          let ErrOr = Object.assign(ErrorTips, error);
          this.$message({
            message: ErrOr[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        } else {
          this.attachRolePolicies(roleId)
          this.$message({
            message: "創建角色成功",
            type: "success",
            showClose: true,
            duration: 0
          })
          this.back()
        }
      })
    },
    attachRolePolicies(roleId) {
      const params = { 
        "Version": "2019-01-16",
        RoleId: roleId,
       }
      this.policiesSelectedData.forEach((policy, i) => {
        params[`PolicyId.${i}`] = policy.PolicyId
      })
      this.axios.post(ATTACH_ROLE_POLICIES, params)
    },
    add_use() {
      this.form.condition.push({});
    },
    detele(val) {
      this.form.condition.splice(val.$index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.createProvider {
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
.condi-table {
  border: 1px solid #ebeef5;
  border-bottom: 0;
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
