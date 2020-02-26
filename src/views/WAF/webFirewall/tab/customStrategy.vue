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
          <el-input v-model="keyword" :placeholder="t('请输入规则名称或匹配条件', 'WAF.qsrzgmcpptj')" style="width: 200px">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="query" />
          </el-input>
          <i class="el-icon-refresh refresh" @click="getCustomRules" />
        </el-row>
      </el-col>
    </el-row>
    <el-card>
    <el-table :data="customRules" v-loading="loading" :empty-text="t('暂无数据', 'WAF.zwsj')">
      <el-table-column prop="RuleId" :label="t('序号', 'WAF.xh')" width="80">
      </el-table-column>
      <el-table-column prop="Name" :label="t('规则名称', 'WAF.gzmc')">
      </el-table-column>
      <el-table-column :label="t('匹配条件', 'WAF.pptj')">
        <template slot-scope="scope">
          <p v-for="strategy in scope.row.Strategies" :key="strategy.Field">
            <span style="font-weight: 600;">{{ MATCH_KEY[strategy.Field].name}}</span> {{LOGIC_SYMBOL[strategy.CompareFunc]}} {{strategy.Content}}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <el-dropdown slot="header" @command="handleCommand">
          <span class="el-dropdown-link" style="color: #909399;">
            {{t('执行动作', 'WAF.zxdz')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="action.value"
              v-for="action in POLICY_RULE_ACTION_ARR"
              :key="action.name"
            >
              {{action.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot-scope="scope">
          {{POLICY_RULE_ACTION[scope.row.ActionType]}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.cjsj')">
      </el-table-column>
      <el-table-column prop="SortId" width="100">
        <div slot="header" style="padding: 0;">
          {{t('优先级', 'WAF.yxsx')}} 
          <el-tooltip placement="right-end" :content="t('1~100的整数，数字越小，代表这条规则的执行优先级越高', 'WAF.dbztgz')" effect="light">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
      </el-table-column>
      <el-table-column :label="t('过期时间', 'WAF.gqsj')" width="150">
        <template slot-scope="scope">
          {{
            formatDate(scope.row.ExpireTime)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="Name" :label="t('规则开关', 'WAF.gzkg')" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.StatusBool" @change="switchStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="操作" width="120" class-name="actions" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="updateRule(scope.row)">{{t('编辑', 'WAF.bj')}}</el-button> 
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="offset"
      :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
      :title="t(!rule ? '添加规则' : '编辑自定义策略', !rule ? 'WAF.tjgz' : 'WAF.bjzdycl')"
      :visible.sync="dialogRule"
      @close="beforeClose"
      width="900px"
      destroy-on-close
    >
      <Rule :visible.sync="dialogRule" @onSuccess="onSuccess" :domain="domain" :rule="rule" />
    </el-dialog>
  </div>
</template>
<script>
import { DESCRIBE_CUSTOM_RULES, MODIFY_CUSTOM_RULE_STATUS } from '@/constants'
import { POLICY_RULE_ACTION_ARR, POLICY_RULE_ACTION, MATCH_KEY, LOGIC_SYMBOL, COMMON_ERROR } from '../../constants'
import Rule from '../model/rule'
import { flatObj } from '@/utils'
import moment from 'moment'
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
      keyword: '',
      rule: undefined,
      loading: true,
      showTip: true,
      POLICY_RULE_ACTION_ARR: [{name: '全部', value: '-1'},...POLICY_RULE_ACTION_ARR],
      POLICY_RULE_ACTION,
      LOGIC_SYMBOL,
      MATCH_KEY,
      dialogRule: false,
      customRules: [],
      offset: 1,
      limit: 10,
      total: 0,
      ActionType: '-1',
    }
  },
  components: {
    Rule
  },
  watch: {
    domain() {
      this.getCustomRules()
    }
  },
  methods: {
    switchStatus(rule) {
      rule.StatusBool = !rule.StatusBool
      this.axios.post(MODIFY_CUSTOM_RULE_STATUS, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        RuleId: rule.RuleId,
        Status: Number(rule.Status)^1,
        Edition: 'clb-waf'
      }).then(resp => {
        this.generalRespHandler(resp, () => {
          this.getCustomRules()
        }, COMMON_ERROR, '切换成功')
      })
    },
    handleCommand(ActionType) {
      this.ActionType = ActionType
      this.getCustomRules()
    },
    handleCurrentChange(page) {
      this.offset = page
      this.getCustomRules()
    },
    handleSizeChange(size) {
      this.limit = size
      this.getCustomRules()
    },
    formatDate(mm) {
      if (mm === '0') return '永不过期'
      return moment(Number(mm)*1000).format('YYYY-MM-DD 00:00:00')
    },
    query() {
      this.offset = 1
      this.getCustomRules()
    },
    getCustomRules() {
      this.loading = true
      const param = {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Edition: 'clb-waf',
        Paging: {
          Offset: this.offset - 1,
          Limit: this.limit
        },
        Search: this.keyword,
      }
      if (this.ActionType !== '-1') {
        param.ActionType = this.ActionType
      }
      this.axios.post(DESCRIBE_CUSTOM_RULES, flatObj(param)).then(resp => {
        this.generalRespHandler(resp, ({ RuleList, TotalCount }) => {
          RuleList.forEach(rule => {
            rule.StatusBool = !!Number(rule.Status)
          })
          this.total = Number(TotalCount)
          this.customRules = RuleList
          this.loading = false
        })
      })
    },
    beforeClose() {
      this.rule = undefined
    },
    onSuccess() {
      this.dialogRule = false
      this.rule = undefined
      this.getCustomRules()
    },
    updateRule(rule) {
      rule.ActionType = `${rule.ActionType}`
      rule.ExpireTimeType = rule.ExpireTime === '0' ? 0 : 1
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
.actions {
  button {
    padding: 0;
  }
}
</style>