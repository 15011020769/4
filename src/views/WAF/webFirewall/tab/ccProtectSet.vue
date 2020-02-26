<template>
  <div class="container">
    <el-row type="flex" align="middle" justify="space-between" class="tip" v-if="showTip">
      {{t('CC 防护功能支持对公网用户访问特定 URL 的行为进行频率控制，人机识别，封禁恶意的高频访问行为', 'WAF.ccfhgnzcdg')}}。
      <i class="el-icon-close" @click="showTip=false"></i>
    </el-row>
    <el-card>
      <h3>SESSION{{t('设置', 'WAF.sz')}}</h3>
      <p class="session-tip">{{t('定义SESSION，CC规则若启用SESSION，则会基于SESSION维度进行统计和封堵', 'WAF.dyhhcc')}}。</p>
      <el-row type="flex"align="middle">
        <el-button type="primary" @click="sessionSet">{{t('设置', 'WAF.sz')}}</el-button>
        <el-button type="primary" @click="sessionTest">{{t('测试', 'WAF.cs')}}</el-button>
        <el-button type="primary" @click="delSession">删除</el-button>
      </el-row>
      <el-row class="session-content">
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">SESSION位置</el-col>
            <el-col>{{session && session.Source || '未配置'}}</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">匹配模式</el-col>
            <el-col>{{session && session.Category === 'match' ? '字符串模式匹配' : '位置匹配' || '未配置'}}</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('会话标识', 'WAF.hhbs')}}</el-col>
            <el-col>{{session && session.KeyOrStartMat || '未配置'}}</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('会话设置', 'WAF.hhsz')}}</el-col>
            <el-col>
              <span v-if="!session">开始位置：；结束位置：</span>
              <span v-else-if="session.Category === 'location'">开始位置：{{session.StartOffset}}；结束位置：{{session.EndOffset}}</span>
              <span v-else>结束字符：{{session.EndMat}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('设置时间', 'WAF.szsj')}}</el-col>
            <el-col>{{session && formatDate(session.TsVersion) || '未配置'}}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 15px;">
      <h3>{{t('CC规则设置', 'WAF.ccgzsz')}}</h3>
      <el-row type="flex" justify="space-between" class="actions-container">
        <el-button type="primary" @click="dialogCCRule=true">{{t('添加规则', 'WAF.tjgz')}}</el-button>
        <i class="el-icon-refresh refresh" @click="getCCRule" />
      </el-row>
      <el-table :data="rules" v-loading="loading" :empty-text="t('暂无数据', 'WAF.zwsj')">
        </el-table-column>
        <el-table-column prop="Name" :label="t('规则名称', 'WAF.gzmc')">
        </el-table-column>
        <el-table-column :label="t('匹配条件', 'WAF.pptj')">
          <template slot-scope="scope">
            {{CC_RULE_MATCH[scope.row.MatchFunc]}}
          </template>
        </el-table-column>
        <el-table-column prop="Url" :label="t('请求路径', 'WAF.qqlj')">
        </el-table-column>
        <el-table-column :label="t('访问频次', 'WAF.fwpc')">
          <template slot-scope="scope">
            {{scope.row.Limit}}次/{{scope.row.Interval}}秒
          </template>
        </el-table-column>
        <el-table-column :label="t('执行动作', 'WAF.zxdz')">
          <template slot-scope="scope">
            {{CC_RULE_ACTION[scope.row.ActionType]}}
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="`${t('启用', 'WAF.qy')}SESSION`">
          <template slot-scope="scope">
            {{scope.row.Advance === 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('惩罚时长', 'WAF.cfsc')">
          <template slot-scope="scope">
            {{scope.row.ValidTime/60}}分钟
          </template>
        </el-table-column>
        <el-table-column prop="Priority" :label="t('优先级', 'WAF.yxsx')" sortable>
        </el-table-column>
        <el-table-column prop="Name" :label="t('规则开关', 'WAF.gzkg')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.StatusBool" @change="switchStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.cjsj')" sortable width="150">
          <template slot-scope="scope">
            {{formatDate(scope.row.TsVersion)}}
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="操作" width="120" class-name="actions" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="updateRule(scope.row, scope.$index)">{{t('编辑', 'WAF.bj')}}</el-button>&nbsp;&nbsp;
            <el-popover
              placement="bottom"
              width="280"
              v-model="scope.row.delDialog"
            >
              <div class="prpoDialog">
                <h1>{{t('确认删除', 'WAF.qrsc')}}？</h1>
                <p>{{t('删除后将无法恢复，重新添加才能生效。', 'WAF.schwfhf')}}</p>
              </div>
              <div style="text-align: center; margin: 0">
                <el-button size="mini" type="text" @click="delCCRule(scope.row)">删除</el-button>
                <el-button size="mini" type="text" @click="scope.row.delDialog=false">取消</el-button>
              </div>
              <el-button slot="reference"style="color:#3E8EF7;background: transparent;">删除</el-button>
            </el-popover>
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
      :title="`SESSION${t('设置', 'WAF.sz')}`"
      :visible.sync="dialogSessionSet"
      :before-close="beforeSessionSetClose"
      destroy-on-close
      width="730px"
    >
      <SessionSet
        :visible.sync="dialogSessionSet"
        :session="session"
        :domain="domain"
        @onSuccess="getSession"
      />
    </el-dialog>
    <el-dialog
      :title="`SESSION${t('测试', 'WAF.cs')}`"
      :visible.sync="dialogSessionTest"
      :before-close="beforeSessionSetClose"
      destroy-on-close
      width="530px"
    >
      <SessionTest :visible.sync="dialogSessionTest" :session="session" :domain="domain"/>
    </el-dialog>
    <el-dialog
      :title="t(!rule ? '添加CC防护规则' : '编辑CC防护规则', !rule ? 'WAF.tjccrule' : 'WAF.bjccrule')"
      :visible.sync="dialogCCRule"
      width="1000px"
      @close="beforeRuleClose"
      destroy-on-close
    >
      <CCRule
        :visible.sync="dialogCCRule"
        :rule="rule"
        :domain="domain"
        @onSuccess="onSuccess"
        :ruleNames="ruleNames"
      />
    </el-dialog>
  </div>
</template>
<script>
import { DESCIRBE_CCRULE, DESCRIBE_SESSION, DELETE_SESSION, DELETE_CCRULE, UPSERT_CCRULE } from '@/constants'
import SessionSet from '../model/sessionSet'
import SessionTest from '../model/sessionTest'
import { flatObj } from '@/utils'
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR, CC_RULE_MATCH, CC_RULE_ACTION } from '../../constants'
import CCRule from '../model/ccrule'
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
      CC_RULE_MATCH,
      CC_RULE_ACTION,
      rules: [],
      rule: undefined,
      ruleNames: [],
      session: undefined,
      loading: true,
      showTip: true,
      dialogCCRule: false,
      dialogSessionSet: false,
      dialogSessionTest: false,
      offset: 1,
      limit: 10,
      total: 0,
    }
  },
  components: {
    SessionSet,
    SessionTest,
    CCRule
  },
  watch: {
    domain(n) {
      if (n) {
        this.getSession()
        this.getCCRule()
      }
    }
  },
  methods: {
    switchStatus(rule) {
      rule.StatusBool = !rule.StatusBool
      this.axios.post(UPSERT_CCRULE, {
        Version: '2018-01-25',
          Domain: this.domain.Domain,
          Name: rule.Name,
          Status: rule.Status^1,
          Advance: rule.Advance,
          Limit: rule.Limit,
          Interval: rule.Interval,
          Url: rule.Url,
          MatchFunc: rule.MatchFunc,
          ActionType: rule.ActionType,
          Priority: rule.Priority,
          ValidTime: rule.ValidTime,
          OptionsArr: rule.OptionsArr,
          Edition: 'clb-waf'
      }).then(resp => {
        this.generalRespHandler(resp, this.getCCRule, COMMON_ERROR, '切换成功')
      })
    },
    delCCRule(rule) {
      this.axios.post(DELETE_CCRULE, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Name: rule.Name,
        Edition: 'clb-waf',
      }).then(resp => {
        this.generalRespHandler(resp, this.getCCRule, COMMON_ERROR, '删除成功')
      })
    },
    onSuccess() {
      this.dialogCCRule = false
      this.rule = undefined
      this.getCCRule()
    },
    formatDate(ms) {
      return moment(Number(ms)).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(page) {
      this.offset = page
      this.getCCRule()
    },
    handleSizeChange(size) {
      this.limit = size
      this.getCCRule()
    },
    delSession() {
      this.$confirm('删除SESSION设置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(DELETE_SESSION, {
          Version: '2018-01-25',
          Domain: this.domain.Domain,
          Edition: 'clb-waf',
        }).then(resp => {
          this.generalRespHandler(resp, this.getSession)
        })
      })
    },
    getSession() {
      this.axios.post(DESCRIBE_SESSION, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Edition: 'clb-waf',
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          if (Data) {
            this.session = Data.Res[0]
          } else {
            this.session = undefined
          }
        })
      })
    },
    getCCRule() {
      this.loading = true
      this.axios.post(DESCIRBE_CCRULE, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Edition: 'clb-waf',
        Offset: this.offset - 1,
        Limit: this.limit,
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          Data = Data || {Res: [], TotalCount: 0}
          const ruleNames = []
          Data.Res.forEach(rule => {
            rule.StatusBool = !!rule.Status
            ruleNames.push(rule.Name)
          })
          this.ruleNames = ruleNames
          this.rules = Data.Res
          this.total = Data.TotalCount
          this.loading = false
        })
      })
    },
    sessionSet() {
      this.dialogSessionSet = true
    },
    sessionTest() {
      this.dialogSessionTest = true
    },
    beforeSessionSetClose(done) {
      this.session = undefined
      done()
    },
    updateRule(rule, index) {
      this.rule = rule
      this.dialogCCRule = true
    },
    beforeRuleClose() {
      this.rule = undefined
    },
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
    margin: 15px 0;
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
  .session-tip {
    margin: 15px 0;
  }
  .session-content {
    & > div {
      margin-top: 20px;
      .label {
        color: #888;
      }
    }
  }
}
.actions {
  button {
    padding: 0;
  }
}
.prpoDialog{
  text-align:center;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-top:16px;
  }
  p{
    margin:16px 0;
  }
}
::v-deep button{
  border-radius: 0;
  height:30px;
  line-height: 30px;
  padding:0 16px;
  border:none;
  outline: none;
}
</style>