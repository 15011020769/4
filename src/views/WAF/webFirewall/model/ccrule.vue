<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item
      prop="Name"
      :label="t('规则名称', 'WAF.gzmc')"
      class="middle-input"
      :rules="[
        { required: true, message: t('规则名称不能为空', 'WAF.gzmcbnwk') },
        { max: 50, message: t('名称长度不能超过50个字符', 'WAF.mccd50zy') }
      ]"
    >
      <el-input v-model="form.Name" :placeholder="t('请输入名称，最长50个字符', 'WAF.qsrmc50zy')"/>
    </el-form-item>
    <el-form-item
      prop="Advance"
      label="识别方式"
      :rules="[
        { required: true },
      ]"
    >
      <el-radio-group v-model="form.Advance">
        <el-radio :label="0">IP</el-radio>
        <el-radio :label="1">SESSION</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      prop="MatchFunc"
      :label="t('匹配条件', 'WAF.pptj')"
      :rules="[
        { required: true },
      ]"
    >
      <el-select v-model="form.MatchFunc">
        <el-option
          v-for="item in CC_RULE_MATCH_ARR"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      class="middle-input"
      prop="Url"
      :label="t('URI路径', 'WAF.urilj')"
      :rules="[
        { required: true, message: t('URI路径不能为空', 'WAF.uriljbnwk') },
        { validator: isValidURI() }
      ]"
    >
      <el-input v-model="form.Url" />
    </el-form-item>
    <el-form-item>
      <el-button type="text" slot="label" @click="showExplain=!showExplain">
        {{t('示例说明', 'WAF.slsm')}}
        <el-tooltip placement="right-end" :content="t('支持get表单和post表单参数过滤，单个匹配字段最多配置5个', 'WAF.zcgtbd')" effect="light">
          <i class="el-icon-info"></i>
        </el-tooltip>
        <i class="el-icon-caret-top" v-if="showExplain" />
        <i class="el-icon-caret-bottom" v-else />
      </el-button>
      <el-row class="explain" v-show="showExplain">
        <el-table :data="form.options" class="strategies-table">
          <el-table-column :label="t('匹配字段', 'WAF.pplw')" width="120">
            <template slot-scope="scope">
              <el-select v-model="form.options[scope.$index].key">
                <el-option label="GET" value="get"></el-option>
                <el-option label="POST" value="post"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="t('参数名', 'WAF.csm')" width="120">
            <template slot-scope="scope">
              <el-input v-model="form.options[scope.$index].label" placeholder="512个字符以内" />
            </template>
          </el-table-column>
          <el-table-column :label="t('参数值', 'WAF.csz')" width="120">
            <template slot-scope="scope">
              <el-input v-model="form.options[scope.$index].value" placeholder="512个字符以内" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="info" @click="delOption(scope.$index)" style="cursor: pointer;">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="options-table-footer" type="flex" align="middle" justify="center">
          <el-button type="text" size="small" @click="addOption">新增</el-button>
        </el-row>
      </el-row>
    </el-form-item>
    <el-form-item
      :label="t('访问频次', 'WAF.fwpc')"
      prop="Limit"
      :rules="[
        { required: true, message: t('访问频次不能为空', 'WAF.fwpcbnwk') },
      ]"
    >
      <el-row type="flex" align="middle">
        <el-input v-model="form.Limit" class="small-input">
          <template slot="append">次</template>
        </el-input>&nbsp;&nbsp;
        <el-select v-model="form.Interval" class="small-input">
          <el-option :value="10">10秒</el-option>
          <el-option :value="20">20秒</el-option>
          <el-option :value="30">30秒</el-option>
          <el-option :value="40">40秒</el-option>
          <el-option :value="50">50秒</el-option>
          <el-option :value="60">60秒</el-option>
        </el-select>&nbsp;
        <el-tooltip placement="right-end" :content="t('建议输入：正常人访问速度的3-10倍，例如网站人平均访问20次/分钟，可配置为60-200/分钟；可依据被攻击严重程度调整', 'WAF.jysrzcr')" effect="light">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-row>
    </el-form-item>
    <el-form-item
      :label="t('执行动作', 'WAF.zxdz')"
      prop="ActionType"
      :rules="[
        { required: true },
      ]"
    >
      <el-select v-model="form.ActionType">
        <el-option
          v-for="item in CC_RULE_ACTION_ARR"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>&nbsp;
       <el-tooltip placement="right-end" :content="t('“人机识别” 目前不支持移动终端；在移动端场景下，不建议选择人机识别', 'WAF.rjsbmqbzc')" effect="light">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      class="middle-input"
      :label="t('惩罚时长', 'WAF.cfsc')"
      prop="ValidTime"
      :rules="[
        { required: true, message: t('惩罚时长不能为空', 'WAF.cfscbnwk') },
      ]"
    >
      <el-row type="flex" align="middle">
        <el-input v-model="form.ValidTime">
          <template slot="append">{{t('分钟', 'WAF.fz')}}</template>
        </el-input>&nbsp;
        <el-tooltip placement="right-end" :content="t('惩罚时长，最短1分钟，最长一周', 'WAF.cfsczd')" effect="light">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-row>
    </el-form-item>
    <el-form-item
      :label="t('优先级', 'WAF.yxsx')"
      prop="Priority"
      :rules="[
        { required: true, message: t('优先级不能为空', 'WAF.yxsxbnwk') },
      ]"
    >
      <el-input-number v-model="form.Priority" :min="1" :max="100"></el-input-number>
      <p class="sub-text">{{t('请输入1~100的整数，数字越小，代表这条规则的执行优先级越高', 'WAF.qrs1z100dzs')}}</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="onSubmit">{{rule && rule.RuleId ? '保存' : '添加'}}</el-button>
      <el-button :disabled="loading" @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { UPSERT_CCRULE } from '@/constants'
import { CC_RULE_MATCH_ARR, CC_RULE_MATCH, CC_RULE_ACTION, CC_RULE_ACTION_ARR } from '../../constants'
export default {
  props: {
    domain: Object,
    visible: Boolean,
    rule: {
      required: false,
      type: Object,
    }
  },
  data() {
    return {
      form: {},
      CC_RULE_MATCH_ARR,
      CC_RULE_ACTION_ARR,
      loading: false,
      showExplain: false,
    }
  },
  watch: {
    rule: {
      handler(r) {
        if (r) {
          const rule = JSON.parse(JSON.stringify(r))
          rule.ValidTime /= 60
          rule.MatchFunc = `${rule.MatchFunc}`
          const options = JSON.parse(rule.OptionsArr)
          const _options = []
          options.forEach(option => {
            option.args.forEach(arg => {
              _options.push({key: option.key, label: arg.split('=')[0], value: arg.split('=')[1]})
            })
          })
          rule.options = _options
          this.form = rule
          if (_options.length) {
            this.showExplain = true
          }
        } else {
          this.form = {
            Advance: 0,
            MatchFunc: CC_RULE_MATCH.相等,
            Limit: 60,
            Interval: 60,
            ActionType: CC_RULE_ACTION.拦截,
            ValidTime: 10,
            Priority: 50,
            options: [],
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    isValidURI() {
      var warpper = (rule, value, callback) => {
        if (/^\/.{1,128}$/.test(value)) {
          return callback()
        }
        callback(this.t('请输入正确的路径，以/开头，不要包含域名', 'WAF.qsrzqdlj'))
      }
      return warpper
    },
    addOption() {
      this.form.options.push({
        key: 'get',
      })
    },
    delOption(index) {
      this.form.options.splice(index, 1)
    },
    onSubmit() {
      // this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          let OptionsArr = ''
          const _optionsArr = []
          this.form.options.forEach(option => {
            const args = _optionsArr[option.key] || ''
            _optionsArr[option.key] = `${args},"${option.label || ''}=${option.value || ''}"`
          })
          Object.keys(_optionsArr).forEach(key => {
            OptionsArr += `,{"key":"${key}","args":[${_optionsArr[key].substr(1)}]}`
          })
          this.axios.post(UPSERT_CCRULE, {
            Version: '2018-01-25',
            Domain: this.domain.Domain,
            Name: this.form.Name,
            Status: this.form.Status || 1,
            Advance: this.form.Advance,
            Limit: this.form.Limit,
            Interval: this.form.Interval,
            Url: this.form.Url,
            MatchFunc: this.form.MatchFunc,
            ActionType: this.form.ActionType,
            Priority: this.form.Priority,
            ValidTime: this.form.ValidTime * 60,
            OptionsArr: `[${OptionsArr.substr(1)}]`,
            Edition: 'clb-waf'
          })
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="scss" scoped>
.middle-input {
  width: 330px;
}
.small-input {
  width: 180px;
}
::v-deep .el-input-number {
  line-height: 28px;
}
.sub-text {
  color: #bbb;
  font-size: 12px;
}
.options-table-footer {
  border: 1px solid #ebeef5;
  border-top: none;
}
::v-deep {
  .el-input__inner {
    font-size: 12px !important;
  }
}
</style>