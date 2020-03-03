<!--
 * @Author: your name
 * @Date: 2020-02-20 17:09:59
 * @LastEditTime: 2020-02-28 12:39:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/module/diyTable.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button style="padding: 5px 10px; margin-right: 10px;" :disabled="total === 50" type="primary" @click="onAdd">添加</el-button>
        <el-button style="padding: 5px 10px; margin-right: 10px;" :disabled="multipleSelection.length === 0" @click="copy">{{t('复制', 'WAF.copy')}}</el-button>
        <span style="color: #bbb; font-size: 12px; margin-left: 10px">最多可以添加50{{t('条', 'WAF.t')}}</span>
      </el-col>
      <el-row type="flex" align="middle">
        <el-input :placeholder="t('请输入策略名称', 'WAF.qsrclmc')" v-model="name" style="width: 180px; font-size: 12px">
          <div slot="suffix">
            <i class="el-icon-search"  style="cursor: pointer; font-size: 16px;" @click="getUCBRule"/>
          </div>
        </el-input>
        <i style="margin-left: 10px;cursor: pointer; font-size: 16px" class="el-icon-refresh" @click="getUCBRule"/>
      </el-row>
    </el-row>
    <el-card style="margin-top: 20px">
      <el-table
        :data="tableData"
        v-loading="loading"
        :empty-text="t('暂无数据', 'WAF.zwsj')"
        @selection-change="handleSelectionChange"
        row-key="name"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column :label="t('序号', 'WAF.xh')" type="index"></el-table-column>
        <el-table-column prop="name">
          <el-button type="text" slot="header" style="padding: 0; cursor: pointer;color: #444;" @click="setSort('name')">
            {{t('策略名称/描述', 'WAF.clmcms')}} 
            <i class="el-icon-caret-top" v-if="sort === 'name:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'name:-1'"></i>
            <i class="el-icon-d-caret" v-if="sort.includes('timestamp')"></i>
          </el-button>
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p class="sub-text">{{scope.row.desc}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="term" :label="t('匹配条件', 'WAF.pptj')">
          <template slot-scope="scope">
            <div v-for="rule in scope.row.rule" :key="rule.key">
              <p>
                <span style="font-weight: 600;color: #000;">{{ALL_RULE[rule.key].label}}&nbsp;</span>
                <template v-if="rule.op === 'proportion'">
                  {{rule.op_arg.join()}}
                  {{labelFilter(rule.op_op)}}&nbsp;
                  {{rule.op_value * 100}}%
                </template>
                <template v-else>
                  <span>{{labelFilter(rule.op)}}&nbsp;</span>
                  <span v-if="rule.value === true">是</span>
                  <span v-else-if="rule.value === false">否</span>
                  <span v-else-if="Array.isArray(rule.value)" v-for="v in rule.value">{{ALL_OPTION[v] && ALL_OPTION[v].label || v}} </span>
                  <span v-else>{{rule.value}}</span>
                </template>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="action">
          <el-dropdown slot="header" @command="handleCommand">
          <span class="el-dropdown-link" style="color: #909399;">
            {{t('动作', 'WAF.dz')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="action.value"
              v-for="action in CUSTOM_SESSION_ACTION_ARR"
              :key="action.name"
            >
              {{action.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <template slot-scope="scope">
            {{CUSTOM_SESSION_ACTION[scope.row.action]}}
            <span v-if="scope.row.valid_time > 0">{{scope.row.valid_time}}{{t('分钟', 'WAF.fz')}}</span>
            <p v-if="scope.row.action === CUSTOM_SESSION_ACTION.重定向">
              {{t('重定向路径', 'WAF.cdxlj')}}：{{scope.row.addition_arg}}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="t('策略开关', 'WAF.clkg')" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="status => onChangeStatus(scope.row, status)" />
          </template>
        </el-table-column>
        <el-table-column prop="time" width="150">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('timestamp')">
            {{t('修改时间', 'WAF.xgsj')}}
            <i class="el-icon-caret-top" v-if="sort === 'timestamp:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'timestamp:-1'"></i>
            <i class="el-icon-d-caret" v-if="sort.includes('name')"></i>
          </el-button>
          <template slot-scope="scope">
            {{formatDate(scope.row.timestamp)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="showDialog(scope.row)">{{t('编辑', 'WAF.bj')}}</el-button>
            <el-popover
                placement="bottom"
                width="280"
                v-model="scope.row.delDialog"
              >
                <div class="prpoDialog">
                  <h1>{{t('确定', 'WAF.qd')}}删除？</h1>
                  <p>{{t('删除后源站将可能会遭受恶意攻击的威胁', 'WAF.schyzjknzs')}}。</p>
                </div>
                <div style="text-align: center; margin: 0">
                  <el-button size="mini" type="text" @click="delUCBRule(scope.row)">{{t('确定', 'WAF.qd')}}</el-button>
                  <el-button size="mini" type="text" @click="scope.row.delDialog=false">取消</el-button>
                </div>
                <el-button slot="reference"style="color:#3E8EF7;background: transparent;border: none;">删除</el-button>
              </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      :visible.sync="showSessionDialog"
      :title="`${ucbRule ? t('编辑', 'WAF.bj') : '添加'}${t('自定义会话特征', 'WAF.zdyhhtz')}`"
      width="1000px"
      :close-on-click-modal="false"
      @click.native="closeChildMatchDialogIndex"
      @close="beforeClose"
      destroy-on-close
    >
      <DiySessionDialog
        :allRuleNames="allRuleNames"
        :domain="ipSearch"
        :childMatchDialogIndex.sync="childMatchDialogIndex"
        :visible.sync="showSessionDialog"
        :ucbRule="ucbRule"
        @success="onSuccess"
        ref="sessionDialog"
      />
    </el-dialog>
    <el-dialog
      :title="t('复制自定义策略', 'WAF.fzzdycl')"
      :visible="dialogVisible"
      width="850px"
      destroy-on-close
    >
      <Transfer category="ucb" :ruleNames="ruleNames" :dialogVisible.sync="dialogVisible" :iptDomain="ipSearch" />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Transfer from '../../transfer'
import DiySessionDialog from '../../diySessionDIalog'
import { DESCRIBE_BOT_UCB_FEATURE_RULE, UPSERT_BOT_UCB_FEATURE_RULE, DELETE_BOT_UCB_FEATURE_RULE } from '@/constants'
import { ALL_RULE, CUSTOM_SESSION_ACTION, ALL_OPTION, CUSTOM_SESSION_ACTION_ARR, COMMON_ERROR } from '../../../../constants'

export default {
  props: {
    ipSearch: String, // 选中的域名
  },
  data() {
    return {
      allTableData: [],
      currentPage: 1,
      pageSize: 20,
      loading: true,
      total: 0,
      name: '',
      showSessionDialog: false,
      dialogVisible: false,
      ucbRule: undefined,
      childMatchDialogIndex: -1,
      Operate: '-1',
      ALL_RULE,
      CUSTOM_SESSION_ACTION,
      CUSTOM_SESSION_ACTION_ARR,
      ALL_OPTION,
      sort: 'timestamp:-1',
      multipleSelection: [],
      ruleNames: '', // 待复制的策略名称
      allRuleNames: [], // 使用策略名称，用于添加时去重
    }
  },
  computed: {
    tableData() {
      return this.allTableData.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
    },
  },
  components: {
    DiySessionDialog,
    Transfer
  },
  watch: {
    ipSearch() {
      this.getUCBRule()
    },
  },
  mounted() {
    if (this.ipSearch) {
      this.getUCBRule()
    }
  },
  methods: {
    copy() {
      this.ruleNames = this.multipleSelection.map(rule => rule.name).join(';')
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delUCBRule(rule) {
      rule.delDialog = false
      this.loading = true
      this.axios.post(DELETE_BOT_UCB_FEATURE_RULE, {
        Version: '2018-01-25',
        Domain: rule.domain,
        Name: rule.name,
      }).then(resp => {
        this.generalRespHandler(resp, this.getUCBRule, COMMON_ERROR, '删除成功')
      }).then(() => {
        this.loading = false
      })
    },
    onChangeStatus(rule, status) {
      rule.status = !status
      const Rule = {
        domain: rule.domain,
        name: rule.name,
        desc: rule.desc,
        on_off: status ? 'on' : 'off',
        timestamp: +new Date(),
        action: rule.action,
        rule_type: rule.rule_type,
        addition_arg: rule.addition_arg,
        valid_time: rule.valid_time,
        appid: rule.appid
      }
      this.loading = true
      this.axios.post(UPSERT_BOT_UCB_FEATURE_RULE, {
        Version: '2018-01-25',
        Domain: rule.domain,
        Rule: JSON.stringify(Rule),
      }).then(resp => {
        this.generalRespHandler(resp, this.getUCBRule, COMMON_ERROR, `${this.t('编辑', 'bj')}成功`)
      }).then(() => {
        this.loading = false
      })
    },
    setSort(key) {
      if (this.sort.includes(key)) { // 升降序
        if (this.sort.includes('-')) {
          this.sort = `${key}:1`
        } else {
          this.sort = `${key}:-1`
        }
      } else { // 换个排序字段 默认降序
        this.sort = `${key}:-1`
      }
      this.getUCBRule()
    },
    handleCommand(Operate) {
      this.Operate = Operate
      this.getUCBRule()
    },
    showDialog(rule) {
      this.ucbRule = rule
      this.showSessionDialog = true
    },
    formatDate(ms) {
      return moment(Number(ms)).format('YYYY-MM-DD HH:mm:ss')
    },
    closeChildMatchDialogIndex(){
      if (this.childMatchDialogIndex !== -1) {
        this.$refs.sessionDialog.closeMatchDialog(this.childMatchDialogIndex)
      }
    },
    onSuccess() {
      this.showSessionDialog = false
      this.getUCBRule()
    },
    getUCBRule() {
      this.loading = true
      const param = {
        "Version": 
        "2018-01-25",
        "Domain": this.ipSearch, 
        "Skip": 0, 
        "Limit": 99,
        Name: this.name,
      }
      if (this.Operate !== '-1') {
        param.Operate = this.Operate
      }
      param.Sort = this.sort
      this.axios.post(DESCRIBE_BOT_UCB_FEATURE_RULE, param)
      .then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          const allRuleNames = []
          const data = Data.Res.map(data => {
            const d = JSON.parse(data)
            allRuleNames.push(d.name)
            d.delDialog = false
            d.status = d.on_off === 'off' ? false : true
            return d
          })
          this.allRuleNames = allRuleNames
          this.allTableData = data
          this.total = Data.TotalCount
        })
      }).then(() => {
        this.loading = false
      })
    },
     handleCurrentChange(page) {
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    beforeClose() {
      this.ucbRule = undefined
    },
    onAdd() {
      this.showSessionDialog = true
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
.main {
  ::v-deep .el-input__suffix {
    height: 30px;
    display: flex;
    align-items: center;
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
  ::v-deep button {
    border: none;
  }
}
</style>