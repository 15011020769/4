<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item
      prop="Name"
      label="规则名称"
      :rules="[
        { required: true, message: '名称不能为空' },
        { max: 50, message: '名称长度不能超过50个字符' }
      ]"
    >
      <el-input
        class="name-input"
        v-model="form.Name"
        placeholder="请输入名称，最长50个字符"
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="Strategies"
      label="匹配条件"
      :rules="[
        { required: true, message: '匹配条件不能为空' },
      ]"
    >
      <el-table :data="form.Strategies" class="strategies-table">
        <el-table-column label="匹配字段" width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.Field" popper-class="small" class="small" @change="matchKey => onChangeMatchKey(matchKey, scope)">
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
        <el-table-column label="匹配参数" width="180">
          <template slot-scope="scope">
            <el-input v-if="MATCH_KEY[scope.row.Field].param" v-model="scope.row.Arg" placeholder="请输入参数值，不填默认全部" class="small" />
            <span v-else>
              此字段不支持参数选择
            </span>
          </template>
        </el-table-column>
        <el-table-column label="逻辑符号" width="120">
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
        <el-table-column label="匹配内容" width="230">
          <template slot-scope="scope">
            <el-form-item
              :prop="`Strategies[${scope.$index}].Content`"
              :rules="[
                { required: true, message: '内容不能为空' },
              ]"
              class="content-input"
            >
            <el-input v-model="scope.row.Content" :placeholder="MATCH_KEY[scope.row.Field].placeholder" class="small"/>
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
      label="执行动作"
      prop="ActionType"
      :rules="[
        { required: true, message: '执行动作不能为空' },
      ]"
    >
       <el-select v-model="form.ActionType" placeholder="请选择">
          <el-option
            v-for="item in POLICY_RULE_ACTION_ARR"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select><span class="sub-text"> 放行规则优先于其他匹配操作执行</span>
        <el-checkbox-group v-model="Bypass" class="bypass">
          <el-checkbox label="geoip">继续执行地域封禁防护</el-checkbox>
          <el-checkbox label="cc">继续执行CC策略防护</el-checkbox>
          <el-checkbox label="owasp">继续执行WEB应用防护</el-checkbox>
          <el-checkbox label="ai">继续执行AI引擎防护</el-checkbox>
          <el-checkbox label="antileakage">继续执行信息防泄漏防护</el-checkbox>
        </el-checkbox-group>
    </el-form-item>
    <el-form-item
      label="截止时间"
      prop="ExpireTime"
      :rules="[
        { required: true, message: '截止时间不能为空' },
      ]"
    >
       <el-select v-model="form.ExpireTime" placeholder="请选择">
        <el-option label="永久生效" value="0"></el-option>
        <el-option label="限定日期" value="0"></el-option>
      </el-select>&nbsp;
      <el-date-picker
        v-model="ExpireTimeDay"
        type="date"
        placeholder="选择日期">
      </el-date-picker>&nbsp;
      <el-tooltip placement="right-end" content="截止日期为 选中日期 当天24:00点之前" effect="light">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      label="优先级"
      prop="SortId"
      :rules="[
        { required: true, message: '优先级不能为空' },
      ]"
    >
      <el-input-number v-model="form.SortId" :min="1" :max="100"></el-input-number>
      <p class="sub-text">请输入1~100的整数，数字越小，代表这条规则的执行优先级越高</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">添加</el-button>
      <el-button @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { POLICY_RULE_ACTION_ARR, MATCH_KEY_ARR, MATCH_KEY, LOGIC_SYMBOL_ARR } from '../../constants'
const DEFAULT_MATCH_KEY_Field = 'IP'

export default {
  props: {
    visible: Boolean,
    rule: {
      required: false,
      type: Object,
      default() {
        return {
          Name: '',
          Strategies: [{
            Field: DEFAULT_MATCH_KEY_Field,
            CompareFunc: MATCH_KEY[DEFAULT_MATCH_KEY_Field].symbol[0]
          }]
        }
      }
    }
  },
  watch: {
    rule(r) {
      if (r) {
        const selectedMatchKeys = r.Strategies.map(strategy => strategy.Field)
        const matchKeys = r.Strategies.map((strategy, index) => {
          return MATCH_KEY_ARR.filter(matchKey => matchKey === selectedMatchKeys[index] && !selectedMatchKeys.includes(matchKey))
        })
      }
    },
    selectedMatchKeys(n) {
      this.resetMatchKeys()
    }
  },
  data() {
    return {
      form: this.rule,
      selectedMatchKeys: [],
      Bypass: [],
      ExpireTimeDay: new Date(),
      matchKeys: [MATCH_KEY_ARR],
      POLICY_RULE_ACTION_ARR,
      MATCH_KEY,
      LOGIC_SYMBOL_ARR,
    }
  },
  mounted() {
    this.selectedMatchKeys.push('IP')
  },
  methods: {
    onChangeMatchKey(matchKey, { $index }) {
      this.selectedMatchKeys.splice($index, 1, matchKey)
      const strategy = this.form.Strategies.find((_, i) => i === $index)
      strategy.CompareFunc = MATCH_KEY[strategy.Field].symbol[0]
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addStrategy() {
      const matchkeys = MATCH_KEY_ARR.filter(({ value }) => !this.selectedMatchKeys.includes(value))
      this.selectedMatchKeys.push(matchkeys[0].value)
      this.form.Strategies.push({
        Field: matchkeys[0].value,
        CompareFunc: MATCH_KEY[matchkeys[0].value].symbol[0]
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
</style>