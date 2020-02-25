<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item
      prop="Name"
      :label="t('规则名称', 'WAF.gzmc')"
      :rules="[
        { required: true, message: t('规则名称不能为空', 'WAF.gzmcbnwk') },
        { max: 50, message: t('名称长度不能超过50个字符', 'WAF.mccd50zy') }
      ]"
    >
      <el-input
        class="name-input"
        v-model="form.Name"
        :placeholder="t('请输入名称，最长50个字符', 'WAF.qsrmc50zy')"
      ></el-input>
    </el-form-item>
    <el-form-item
      :label="t('匹配条件', 'WAF.pptj')"
      :rules="[
        { required: true, message: t('匹配条件不能为空', 'WAF.pptjbnwk') },
      ]"
    >
      <el-table :data="form.Strategies" class="strategies-table">
        <el-table-column :label="t('匹配字段', 'WAF.pplw')" width="160">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.Field"
              popper-class="small"
              class="small"
              @change="matchKey => onChangeMatchKey(matchKey, scope)"
            >
              <el-option
                v-for="item in matchKeys[scope.$index]"
                :key="item.value"
                :label="item.name.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="t('匹配参数', 'WAF.ppcs')" width="180">
          <template slot-scope="scope">
            <el-form-item
              v-if="MATCH_KEY[scope.row.Field].param"
              :prop="`Strategies[${scope.$index}].Arg`"
            >
              <el-input v-model="form.Strategies[scope.$index].Arg" :placeholder="t('请输入参数值，不填默认全部', 'WAF.qsrcszmrqb')" class="small" />
            </el-form-item>
            <span v-else>
              {{t('此字段不支持参数选择', 'WAF.clwbzccsxz')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('逻辑符号', 'WAF.ljfh')" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.CompareFunc" popper-class="small" class="small">
              <el-option
                v-for="item in LOGIC_SYMBOL_ARR"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                v-if="MATCH_KEY[scope.row.Field].symbol.includes(item.value)"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="t('匹配内容', 'WAF.ppnr')" width="230" class-name="match-content">
          <template slot-scope="scope">
            <el-form-item
              v-if="MATCH_KEY[scope.row.Field].input !== false"
              :prop="`Strategies[${scope.$index}].Content`"
              :rules="[
                { validator:  MATCH_KEY[scope.row.Field].validator(MATCH_KEY[scope.row.Field])},
              ]"
              class="content-input"
            >
            <el-input v-model="form.Strategies[scope.$index].Content" :placeholder="MATCH_KEY[scope.row.Field].placeholder" class="small"/>
            </el-form-item>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="info" @click="delStrategy(scope.$index)" style="cursor: pointer;">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="strategies-table-footer" type="flex" align="middle" justify="center">
        <el-button type="text" size="small" @click="addStrategy" :disabled="selectedMatchKeys.length > 4">添加</el-button> <span class="sub-text">还可以添加{{5 - selectedMatchKeys.length}}条，最多5条</span>
      </el-row>
    </el-form-item>
    <el-form-item
      :label="t('执行动作', 'WAF.zxdz')"
      prop="ActionType"
      :rules="[
        { required: true, },
      ]"
    >
       <el-select v-model="form.ActionType">
          <el-option
            v-for="item in POLICY_RULE_ACTION_ARR"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>&nbsp;
        <el-tooltip v-show="form.ActionType === POLICY_RULE_ACTION.人机识别" placement="right-end" :content="t('交互式行为验证码，可智能感知并切换验证难度。该功能需JavaScript支持；部分采用Ajax发送的post请求以及非WEB应用（例如App），可能无法支持', 'WAF.rjsbtip')" effect="light">
          <i class="el-icon-info"></i>
        </el-tooltip>
        <div class="name-input" style="display: inline-block;" v-if="form.ActionType === POLICY_RULE_ACTION.重定向">
          <el-form-item
            prop="Redirect"
            :rules="[
              {
                validator: isValidURI(),
              }
            ]"
            >
            <el-input v-model="form.Redirect" :placeholder="t('重定向路径输入有误，请以/开头，128个字符以内', 'WAF.cdxtsy')"/>
          </el-form-item>
        </div>
        <span v-show="form.ActionType === POLICY_RULE_ACTION.放行">
          <span class="sub-text"> {{t('放行规则优先于其他匹配操作执行', 'WAF.fxgzyxy')}}</span>
          <el-checkbox-group v-model="Bypass" class="bypass">
            <el-checkbox v-for="item in BY_PASS_ACTION_ARR" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </span>
    </el-form-item>
    <el-form-item
      :label="t('截止时间', 'WAF.jzsj')"
      prop="ExpireTimeType"
      :rules="[
        { required: true },
      ]"
    >
       <el-select v-model="form.ExpireTimeType">
        <el-option label="永久生效" :value="0"></el-option>
        <el-option label="限定日期" :value="1"></el-option>
      </el-select>&nbsp;
      <span v-if="form.ExpireTimeType === 1">
        <el-date-picker
          v-model="ExpireTimeDay"
          type="date"
         >
        </el-date-picker>&nbsp;
        <el-tooltip placement="right-end" :content="t('截止日期为 选中日期 当天24:00点之前', 'WAF.jzrqwdt')" effect="light">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </span>
    </el-form-item>
    <el-form-item
      :label="t('优先级', 'WAF.yxsx')"
      prop="SortId"
      :rules="[
        { required: true, message: t('优先级不能为空', 'WAF.yxsxbnwk') },
      ]"
    >
      <el-input-number v-model="form.SortId" :min="1" :max="100"></el-input-number>
      <p class="sub-text">{{t('请输入1~100的整数，数字越小，代表这条规则的执行优先级越高', 'WAF.qrs1z100dzs')}}</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="onSubmit">{{rule && rule.RuleId ? '保存' : '添加'}}</el-button>
      <el-button :disabled="loading" @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { 
  POLICY_RULE_ACTION, // 执行动作
  POLICY_RULE_ACTION_ARR,
  MATCH_KEY, // 匹配字段
  MATCH_KEY_ARR,
  LOGIC_SYMBOL_ARR, // 逻辑符号
  BY_PASS_ACTION, // 放行后继续执行的动作
  BY_PASS_ACTION_ARR,
  COMMON_ERROR,
} from '../../constants'
import { ADD_CUSTOM_RULE, MODIFY_CUSTOM_RULE } from '@/constants'
import { flatObj } from '@/utils'
import moment from 'moment'

const DEFAULT_MATCH_KEY_Field = 'IP'

export default {
  props: {
    domain: Object,
    visible: Boolean,
    rule: {
      required: false,
      type: Object,
    }
  },
  watch: {
    rule: {
      handler(r) {
        if (r) {
          this.selectedMatchKeys = []
          if (r.ExpireTimeType === 1) {
            this.ExpireTimeDay = moment(Number(r.ExpireTime)*1000).format('YYYY-MM-DD')
          }
          if (r.ActionType === POLICY_RULE_ACTION.放行) {
            const selectedBypass = new Set(r.Bypass.split(','))
            const allBypass = new Set(Object.keys(BY_PASS_ACTION))
            const bypass = []
            for (let item of allBypass) {
              if (!selectedBypass.has(item)) {
                bypass.push(item);
              }
            }
            this.Bypass = bypass
          }
          this.form = JSON.parse(JSON.stringify(r))
          const selectedMatchKeys = r.Strategies.map(strategy => strategy.Field)
          this.selectedMatchKeys.push(...selectedMatchKeys)
          this.resetMatchKeys()
        } else {
          this.selectedMatchKeys.push('IP')
          this.form = {
            Name: '',
            ExpireTimeType: 0,
            ActionType: POLICY_RULE_ACTION.阻断,
            SortId: 100,
            Strategies: [{
              Field: DEFAULT_MATCH_KEY_Field,
              CompareFunc: MATCH_KEY[DEFAULT_MATCH_KEY_Field].symbol[0],
              Content: '',
            }]
          }
        }
      },
      immediate: true
    },
    selectedMatchKeys(n) {
      this.resetMatchKeys()
    }
  },
  data() {
    return {
      loading: false,
      form: {},
      selectedMatchKeys: [],
      Bypass: [],
      ExpireTimeDay: new Date(),
      matchKeys: [MATCH_KEY_ARR],
      POLICY_RULE_ACTION,
      POLICY_RULE_ACTION_ARR,
      MATCH_KEY,
      LOGIC_SYMBOL_ARR,
      BY_PASS_ACTION_ARR,
    }
  },
  methods: {
    isValidURI() {
      var warpper = (rule, value, callback) => {
        if (/^\/.{1,128}$/.test(value)) {
          return callback()
        }
        callback(this.t('重定向路径输入有误，请以/开头，128个字符以内', 'WAF.cdxtsy'))
      }
      return warpper
    },
    onChangeMatchKey(matchKey, { row, $index }) {
      row.Content = ''
      this.$refs.form.clearValidate(`Strategies[${$index}].Content`)
      this.selectedMatchKeys.splice($index, 1, matchKey)
      const strategy = this.form.Strategies.find((_, i) => i === $index)
      strategy.CompareFunc = MATCH_KEY[strategy.Field].symbol[0]
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            Version: '2018-01-25',
            SortId: this.form.SortId,
            ExpireTime: this.form.ExpireTimeType === 0 ? 0 : moment(this.ExpireTimeDay).startOf('day').format("X"),
            Domain: this.domain.Domain,
            Edition: 'clb-waf',
            Strategies: this.form.Strategies,
          }

          let url = ADD_CUSTOM_RULE
          if (this.rule) { // 修改
            url = MODIFY_CUSTOM_RULE
            param.RuleAction = this.form.ActionType
            param.RuleName = this.form.Name
            param.RuleId = this.rule.RuleId
          } else { // 添加
            param.ActionType = this.form.ActionType
            param.Name = this.form.Name
          }
          if (param.ActionType === POLICY_RULE_ACTION.重定向) {
            param.Redirect = this.form.Redirect
          }
          if (param.ActionType === POLICY_RULE_ACTION.放行) {
            const selectedBypass = new Set(this.Bypass)
            const allBypass = new Set(Object.keys(BY_PASS_ACTION))
            const bypass = []
            for (let item of allBypass) {
              if (!selectedBypass.has(item)) {
                bypass.push(item);
              }
            }
            param.Bypass = bypass.join()
          }

          this.axios.post(url, flatObj(param)).then(resp => {
            this.generalRespHandler(resp, () => {
              this.$emit('onSuccess')
            }, COMMON_ERROR, this.rule ? `${this.t('编辑', 'WAF.bj')}成功` : '添加成功')
          }).then(() => this.loading = false)
        }
      })
    },
    addStrategy() {
      const matchkeys = MATCH_KEY_ARR.filter(({ value }) => !this.selectedMatchKeys.includes(value))
      this.selectedMatchKeys.push(matchkeys[0].value)
      this.form.Strategies.push({
        Field: matchkeys[0].value,
        CompareFunc: MATCH_KEY[matchkeys[0].value].symbol[0],
        Content: '',
      })
    },
    delStrategy(index) {
      this.selectedMatchKeys.splice(index, 1)
      this.form.Strategies.splice(index, 1)
      this.resetMatchKeys()
    },
    resetMatchKeys() {
      this.matchKeys = this.selectedMatchKeys.map(selectedMatchKeyValue => {
        return MATCH_KEY_ARR.filter(({ value }) => value === selectedMatchKeyValue || !this.selectedMatchKeys.includes(value))
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="scss" scoped>
.name-input {
  width: 330px;
}
.sub-text {
  color: #bbb;
  font-size: 12px;
}
::v-deep .el-input-number {
  line-height: 28px;
}
.strategies-table {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 12px;
}
.strategies-table-footer {
  border: 1px solid #ebeef5;
  border-top: none;
}
.small {
  * {
    font-size: 12px;
  }
  ::v-deep {
    .el-select-dropdown__item, .el-input__inner {
      font-size: 12px !important;
    }
  }
}
.content-input {
  // padding-bottom: 20px;
  ::v-deep .el-form-item__error {
    position: static;
  }
}
.bypass {
  ::v-deep .el-checkbox+.el-checkbox {
    margin-left: 10px;
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
    font-weight: normal;
  }
}
.match-content {
  padding-bottom: 0;
}
::v-deep .el-table__row td {
  padding: 0;
  .cell {
    & > * {
      padding: 12px 0;
    }
    .el-form-item__error {
      position: absolute;
      top: 88%;
    }
  }
}
</style>