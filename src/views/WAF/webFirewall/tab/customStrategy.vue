<template>
  <div class="container">
    <el-row type="flex" align="middle" justify="space-between" class="tip" v-if="showTip">
      {{t('自定义策略支持从 HTTP 报文的请求路径、GET 参数、 POST 参数、 Referer 和 User-Agent 等多个特征进行组合，进行特征匹配来对公网用户的访问进行管控', 'WAF.zdyclzcch')}}。
      <i class="el-icon-close" @click="showTip=false"></i>
    </el-row>
    <el-row type="flex" justify="space-between" class="actions-container">
      <el-button type="primary" @click="dialogRule=true">{{t('添加规则', 'WAF.tjgz')}}</el-button>
      <el-col>
        <el-row type="flex" justify="end" align="middle" :gutter="15">
          <el-input :placeholder="t('请输入规则名称或匹配条件', 'WAF.qsrzgmcpptj')" style="width: 200px">
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>
          <i class="el-icon-refresh refresh" />
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="rules" v-loading="loading" :empty-text="t('暂无数据', 'WAF.zwsj')">
      <el-table-column prop="RuleId" :label="t('序号', 'WAF.xh')">
      </el-table-column>
      <el-table-column prop="Name" :label="t('规则名称', 'WAF.gzmc')">
      </el-table-column>
      <el-table-column :label="t('匹配条件', 'WAF.pptj')">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column>
        <el-dropdown slot="header">
          <span class="el-dropdown-link" style="color: #909399;">
            {{t('执行动作', 'WAF.zxdz')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="action in POLICY_RULE_ACTION_ARR" :key="action.name">{{action.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.cjsj')">
      </el-table-column>
      <el-table-column prop="SortId">
        <div slot="header" style="padding: 0;">
          {{t('优先级', 'WAF.yxsx')}} 
          <el-tooltip placement="right-end" :content="t('1~100的整数，数字越小，代表这条规则的执行优先级越高', 'WAF.dbztgz')" effect="light">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
      </el-table-column>
      <el-table-column :label="t('过期时间', 'WAF.gqsj')">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="Name" :label="t('规则开关', 'WAF.gzkg')">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateRule">{{t('编辑', 'WAF.bj')}}</el-button> 
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="t('添加规则', 'WAF.tjgz')"
      :visible.sync="dialogRule"
      :before-close="beforeClose"
      width="900px"
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
  props: {
    domain: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: [],
      rule: undefined,
      loading: true,
      showTip: true,
      POLICY_RULE_ACTION_ARR,
      dialogRule: false,
    }
  },
  components: {
    Rule
  },
  mounted() {
    this.getCustomRules()
  },
  methods: {
    getCustomRules() {
      this.loading = true
      this.axios.post(DESCRIBE_CUSTOM_RULES, flatObj({
        Version: '2018-01-25',
        Domain: '',
        Edition: 'clb-waf',
        Paging: {
          Offset: 1,
          Limit: 10
        }
      })).then(resp => {
        this.generalRespHandler(resp, data => {
          this.loading = false
        })
      })
    },
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
    padding: 0 20px;
    margin: 15px 0;
    .el-icon-close {
      font-size: 20px;
      cursor: pointer;
    }
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