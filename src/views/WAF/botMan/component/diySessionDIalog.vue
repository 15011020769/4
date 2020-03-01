<!--
 * @Author: your name
 * @Date: 2020-02-21 10:54:14
 * @LastEditTime: 2020-02-21 19:22:06
 * @LastEditors: Please set LastEditors
 * @Description: 自定义会话特征弹窗
 * @FilePath: /new_product/src/views/WAF/botMan/component/diySessionDIalog.vue
 -->
<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    label-position="left"
  >
    <el-form-item
      :label="t('策略名称', 'WAF.clmc')"
      prop="name"
      :rules="[
        { required: true, message: t('名称不能为空', 'WAF.mcbnwk') },
        { max: 50, message: t('名称长度不能超过50个字符', 'WAF.mccd50zy') },
      ]"
    >
      <el-input v-model="form.name" :disabled="ucbRule !== undefined" class="name-input" />
    </el-form-item>
    <el-form-item label="策略描述" prop="desc">
      <el-input v-model="form.desc" class="name-input" />
    </el-form-item>
    <el-form-item required :label="t('策略开关', 'WAF.clkg')" prop="status">
      <el-switch v-model="form.status" />
    </el-form-item>
    <el-form-item required>
      <span slot="label">
        {{t('匹配条件', 'WAF.pptj')}}
        <el-tooltip effect="light" :content="t('同一规则的多个条件是“与”关系，同时满足才会执行动作，且最多配置10个；若匹配条件输入类型为字符串，区分大小写', 'WAF.tygzddgtjs')">
          <i class="el-icon-info" />
        </el-tooltip>
      </span>
      <ul class="table-wrapper" >
        <li class="table-title">
          <h4 style="width: 166px">{{t('匹配字段', 'WAF.pplw')}}</h4>
          <h4 style="width: 233px; padding-left: 15px;">{{t('匹配参数', 'WAF.ppcs')}}</h4>
          <h4 style="width: 84px">{{t('逻辑符号', 'WAF.ljfh')}}</h4>
          <h4 style="width: 260px; padding-left: 15px;">{{t('匹配内容', 'WAF.ppnr')}}</h4>
          <h4 style="width: 60px; text-align: center;">操作</h4>
        </li>
        <li v-for="(rule, i) in form.rule" :key="rule.key" class="table-title">
          <div style="width: 166px; display: inline-block;" @click.stop.prevent="switchMatchDialog(i)">
            <el-input :value="rule.label" :maxlength="0" style="width: 100%" suffix-icon="el-icon-caret-bottom" />
            <SelectMenu
              v-show="rule.showMatchDialog"
              :current="rule.key"
              :selected="selectedMatchKeys"
              @select="onSelect"
            />
          </div>

          <div style="width: 233px; display: inline-block; padding-left: 15px;">
          </div>

          <el-select v-model="form.rule[i].op" style="width: 84px">
            <el-option v-for="item in rule.opoptions" :value="item" :key="item" :label="labelFilter(item)"></el-option>
          </el-select>

          <div style="width: 260px; padding-left: 15px;">
            <el-form-item
              v-if="!rule.opoptions.includes('yes')"
              :prop="`rule[${i}].value`"
              :rules="[
                {
                  validator: isvalidContent(rule.reg, rule.placeholder, rule.key)
                }
              ]"
            >
              <el-checkbox-group v-model="form.rule[i].value" v-if="rule.valueoptions" class="valueoptions">
                <el-checkbox v-for="item in rule.valueoptions" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <el-input :type="rule.key === 'ip_scope' ? 'textarea' : 'text'" :rows="5" v-model="form.rule[i].value" v-if="rule.placeholder && !rule.valueoptions" :placeholder="rule.placeholder"/>
            </el-form-item>
          </div>
          <div style="width: 60px; display: inline-block;text-align: center;">
            <el-button type="text" :disabled="selectedMatchKeys.length === 1" @click="removeUCBRule(i)">删除</el-button>
          </div>
        </li>
      </ul>
       <el-row class="add-footer" type="flex" align="middle" justify="center">
        <el-button type="text" size="small" @click="addUCBRule" :disabled="selectedMatchKeys.length > 9">添加</el-button>&nbsp;<span class="sub-text">{{t('还', 'WAF.h')}}可以添加{{10 - selectedMatchKeys.length}}{{t('条', 'WAF.t')}}，最多10{{t('条', 'WAF.t')}}</span>
      </el-row>
    </el-form-item>
    <el-row type="flex">
      <el-form-item
        :label="t('执行动作', 'WAF.zxdz')"
        prop="action"
        :rules="[
          { required: true, },
        ]"
      >
        <el-select v-model="form.action">
          <el-option
            v-for="item in CUSTOM_SESSION_ACTION_ARR"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>&nbsp;
        <span v-if="form.action === CUSTOM_SESSION_ACTION.验证码" class="sub-text"> {{t('仅用于浏览器访问场景 (强烈建议配置 UA类型 属于 browser后使用)', 'WAF.jyyllqfwcj')}}</span>
      </el-form-item>
      <div class="name-input" style="display: inline-block;" v-if="form.action === CUSTOM_SESSION_ACTION.重定向">
        <el-form-item
          class="redire-form"
          prop="addition_arg"
          :rules="[
            {
              validator: isValidURI(),
            }
          ]"
          >
          <el-input v-model="form.addition_arg" :placeholder="t('请以/开头，支持重定向到当前域名下的URL，512个字符以内', 'WAF.qyktzccdxddqym')"/>
        </el-form-item>
      </div>
    </el-row>
    <el-form-item
      v-if="form.action !== CUSTOM_SESSION_ACTION.监控 && form.action !== CUSTOM_SESSION_ACTION.放行"
      :label="t('惩罚时长', 'WAF.cfsc')"
      prop="valid_time"
      :rules="[
        { required: true, message: t('请输入5~10080以内的整数', 'WAF.qsr51zs') },
        {
          validator: isValidTime()
        }
      ]"
    >
      <el-input v-model.number="form.valid_time" :placeholder="t('请输入5~10080以内的整数', 'WAF.qsr51zs')" style="width: 195px;" />&nbsp;
      <el-tooltip effect="light" :content="t('最短5分钟，最长1周', 'WAF.zdfzzc')">
        <i class="el-icon-info" />
      </el-tooltip>
    </el-form-item>
    <el-form-item>
      <p class="sub-text">{{t('策略优先级按照动作类型匹配生效，优先级为：放行＞监控＞重定向＞验证码＞拦截，动作相同添加时间越晚优先级越高', 'WAF.clsxazdz')}}</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" :loading="loading" @click="onSubmit">{{ucbRule ? '保存' : '添加'}}</el-button>
      <el-button :disabled="loading" size="small" @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { UPSERT_BOT_UCB_FEATURE_RULE } from '@/constants'
import SelectMenu from './selectMenu'
import { ALL_RULE_ARR, ALL_RULE, CUSTOM_SESSION_ACTION_ARR, CUSTOM_SESSION_ACTION, COMMON_ERROR } from '../../constants'
export default {
  props: {
    domain: String,
    visible: {
      default: false
    },
    ucbRule: Object,
    childMatchDialogIndex: Number,
  },
  components: {
    SelectMenu,
  },
  data() {
    return {
      form: {},
      appid: '',
      loading: false,
      matchs: ALL_RULE_ARR,
      selectedMatchKeys: [],
      currShowMatchDialogIndex: -1,
      CUSTOM_SESSION_ACTION_ARR,
      CUSTOM_SESSION_ACTION,
    }
  },

  watch: {
    ucbRule: {
      handler(r) {
        if (r) {
          const ucbrule = JSON.parse(JSON.stringify(r))
          ucbrule.rule = ucbrule.rule.map(rule => ({
            ...ALL_RULE[rule.key],
            op: rule.op === 'logic' ? (rule.value ? 'yes' : 'no') : rule.op,
            value: rule.value,
            showMatchDialog: false
          }))
          if (ucbrule.action !== CUSTOM_SESSION_ACTION.重定向) {
            ucbrule.addition_arg = ''
          }
          if (ucbrule.action === CUSTOM_SESSION_ACTION.监控 || ucbrule.action === CUSTOM_SESSION_ACTION.放行) {
            ucbrule.valid_time = ''
          }
          this.form = ucbrule
        } else {
          this.form = {
            action: CUSTOM_SESSION_ACTION.监控,
            rule: [],
            status: false,
          }
          this.addUCBRule()
        }
      },
      immediate: true
    },
  },
  methods: {
    isValidTime() {
      var warpper = (rule, value, callback) => {
        if (value >= 5 && value <= 10080) {
          return callback()
        }
        callback(this.t('请输入5~10080以内的整数', 'WAF.qsr51zs'))
      }
      return warpper
    },
    isValidURI() {
      var warpper = (rule, value, callback) => {
        if (/^\/.{1,128}$/.test(value)) {
          return callback()
        }
        callback(this.t('请以/开头，支持重定向到当前域名下的URL，512个字符以内', 'WAF.qyktzccdxddqym'))
      }
      return warpper
    },
    isvalidContent(reg, msg, key) {
      var warpper = (rule, value, callback) => {
        if (key !== 'ip_scope') {
          if (!reg.test(value)) {
            return callback(msg)
          }
        } else {
          const vs = value.split('\n')
          for (let i = 0; i < vs.length; i += 1) {
            if (!reg.test(vs[i])) {
              return callback(msg)
            }
          }
        }
        callback()
      }
      return warpper
    },
    async onSubmit() {
      let appid = this.appid
      if (!appid) {
        const res = await this.axios.get(`redesc/selectAppid?uin=${this.$cookie.get('uuid')}`)
        appid = res.data[0].app_id
      }
      const rule = {
        domain: this.domain,
        name: this.form.name,
        desc: this.form.desc,
        on_off: this.form.status ? 'on' : 'off',
        timestamp: +new Date(),
        action: this.form.action,
        rule_type: 0,
        addition_arg: 'none',
        valid_time: 0,
        appid: Number(appid)
      }
      if (this.form.action !== CUSTOM_SESSION_ACTION.监控 && this.form.action !== CUSTOM_SESSION_ACTION.放行) {
        rule.valid_time = this.form.valid_time
      }
      if (this.form.action === CUSTOM_SESSION_ACTION.重定向) {
        rule.addition_arg = this.form.addition_arg
      }
      rule.rule = this.form.rule.map(rule => ({
        key: rule.key,
        op: rule.op,
        value: rule.value
      }))
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.axios.post(UPSERT_BOT_UCB_FEATURE_RULE, {
            Version: '2018-01-25',
            Domain: this.domain,
            Rule: JSON.stringify(rule),
          }).then(resp => {
            this.generalRespHandler(resp, () => {
              this.$emit('success')
            }, COMMON_ERROR, this.ucbRule ? `${this.t('编辑', 'bj')}成功` : '添加成功')
          }).then(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    // 选择匹配字段
    onSelect(item) {
      this.form.rule.splice(this.currShowMatchDialogIndex, 1, {
        ...item,
        op: item.opoptions[0],
        showMatchDialog: false,
      })
      this.selectedMatchKeys.splice(this.currShowMatchDialogIndex, 1, item.key)
    },
    switchMatchDialog(i) {
      if (this.currShowMatchDialogIndex !== -1 && i !== this.currShowMatchDialogIndex) {
        // 已经有打开的了
        this.form.rule[this.currShowMatchDialogIndex].showMatchDialog = false
      }
      this.form.rule[i].showMatchDialog = !this.form.rule[i].showMatchDialog
      this.currShowMatchDialogIndex = i
      this.$emit('update:childMatchDialogIndex', i)
    },
    closeMatchDialog(i) {
      this.form.rule[i].showMatchDialog = false
    },
    removeUCBRule(i) {
      this.form.rule.splice(i, 1)
      this.selectedMatchKeys.splice(i, 1)
    },
    addUCBRule() {
      let index = 0
      if (this.selectedMatchKeys.length > 0) {
        index = this.matchs.findIndex(match => !this.selectedMatchKeys.includes(match.key))
      }
      this.selectedMatchKeys.push(this.matchs[index].key)
      this.form.rule.push({
        ...this.matchs[index],
        op: this.matchs[index].opoptions[0],
        showMatchDialog: false
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
    labelFilter(e) {
      switch (e) {
        case '>': return `大${this.t('于', 'WAF.y')}`
        case '<': return `小${this.t('于', 'WAF.y')}`
        case 'belong': return this.t('属于', 'WAF.sy')
        case 'not belong': return `不${this.t('属于', 'WAF.sy')}`
        case 'contains': return '包含'
        case 'not contains': return '不包含'
        case 'yes': return '是'
        case 'no': return '否'
        default: break;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.name-input {
  width: 330px;
}
.main {
  font-size: 12px;
  * {
    font-size: 12px;
  }
}
.table-wrapper {
  border: 1px solid #ddd;
  .table-content {
    display: flex;
    align-items: center;
  }
  li {
    border-bottom: 1px solid #ddd;
    &:last-of-type {
      border-bottom: none;
    }
  }
}
.table-title {
  color: #888;
  line-height: 40px;
  font-size: 12px;
  display: flex;
  padding: 15px 10px;
}
.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .el-button {
    border: none;
    background: white;
    color: #006eff;
    padding: 0;
    margin-right: 5px;
  }
}
.add-footer {
  border: 1px solid #ebeef5;
  border-top: none;
}
.sub-text {
  color: #bbb;
  font-size: 12px;
}
.valueoptions {
  ::v-deep .el-checkbox {
      color: #444;
    font-weight: normal;
  }
  label {
    margin-left: 0;
    display: block;
    span {
      font-size: 12px;
    }
  }
}
::v-deep .el-input__suffix {
  top: 5px;
}
.redire-form{
::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
}
</style>