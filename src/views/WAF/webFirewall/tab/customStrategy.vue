<template>
  <div class="container">
    <p class="tip">自定义策略支持从 HTTP 报文的请求路径、GET 参数、 POST 参数、 Referer 和 User-Agent 等多个特征进行组合，进行特征匹配来对公网用户的访问进行管控。</p>
    <el-row type="flex" justify="space-between" class="actions-container">
      <el-button type="primary" @click="dialogRule=true">添加规则</el-button>
      <el-col>
        <el-row type="flex" justify="end" align="middle" :gutter="15">
          <el-input placeholder="请输入规则名称或匹配条件" style="width: 200px">
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>
          <i class="el-icon-refresh refresh" />
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="rules" v-loading="loading">
      <el-table-column prop="RuleId" label="序号">
      </el-table-column>
      <el-table-column prop="Name" label="规则名称">
      </el-table-column>
      <el-table-column label="匹配条件">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column>
        <el-dropdown slot="header">
          <span class="el-dropdown-link" style="color: #909399;">
            执行动作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="action in POLICY_RULE_ACTION_ARR" :key="action.name">{{action.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="SortId">
        <div slot="header" style="padding: 0;">
          优先级 
          <el-tooltip placement="right-end" content="1~100的整数，数字越小，代表这条规则的执行优先级越高。" effect="light">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
      </el-table-column>
      <el-table-column label="过期时间">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="规则开关">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateRule">编辑</el-button> 
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加规则"
      :visible.sync="dialogRule"
      :before-close="beforeClose"
      width="840px"
    >
      <Rule :visible.sync="dialogRule" :rule="rule" />
    </el-dialog>
  </div>
</template>
<script>
import { DESCRIBE_CUSTOM_RULES } from '@/constants'
import { POLICY_RULE_ACTION_ARR } from '../../constants'
import Rule from '../model/rule'
import { flatObj } from '@/utils'
export default {
  data() {
    return {
      rules: [],
      rule: undefined,
      loading: true,
      POLICY_RULE_ACTION_ARR,
      dialogRule: false,
    }
  },
  components: {
    Rule
  },
  mounted() {
    this.axios.post(DESCRIBE_CUSTOM_RULES, flatObj({
      Version: '2018-01-25',
      Domain: '',
      Edition: 'clb-waf',
      Paging: {
        Offset: 1,
        Limit: 10
      }
    })).then(() => this.loading = false)
  },
  methods: {
    beforeClose(done) {
      this.rule = undefined
      done()
    },
    updateRule(rule) {
      this.rule = rule
      this.dialogRule = true
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .tip {
    background-color: #e5f0ff;
    color: #003b80;
    border-color: #ffd18b;
    font-size: 12px;
    font-weight: normal;
    border: 1px solid #97c7ff;
    height: 38px;
    line-height: 38px;
    padding-left: 20px;
    margin: 15px 0;
  }
  .actions-container {
    margin-bottom: 15px;
    .refresh {
      cursor: pointer;
      margin-left: 20px;
      width: 28px;
      font-size: 18px;
    }
    .el-icon-search {
      cursor: pointer;
    }
    ::v-deep .el-input__suffix {
      top: -4px;
    }
  }
}
</style>