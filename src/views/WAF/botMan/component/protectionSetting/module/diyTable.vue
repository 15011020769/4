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
        <el-button style="padding: 5px 10px; margin-right: 10px;" >{{t('复制', 'WAF.copy')}}</el-button>
        <span style="color: #bbb; font-size: 12px; margin-left: 10px">最多可以添加50{{t('条', 'WAF.t')}}</span>
      </el-col>
      <el-row type="flex" align="middle">
        <el-input :placeholder="t('请输入策略名称', 'WAF.qsrclmc')" style="width: 180px; font-size: 12px">
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
        v-loading="loading" :empty-text="t('暂无数据', 'WAF.zwsj')"
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
              <p>{{ALL_RULE[rule.key].label}} {{labelFilter(rule.op)}} 
                <span v-if="rule.value === true">是</span>
                <span v-else-if="rule.value === false">否</span>
                <span v-else-if="Array.isArray(rule.value)" v-for="v in rule.value">{{ALL_OPTION[v] && ALL_OPTION[v].label || v}} </span>
                <span v-else>{{rule.value}}</span>
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
        <el-table-column :label="t('策略开关', 'WAF.clkg')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="status => onChangeStatus(scope.row, status)" />
          </template>
        </el-table-column>
        <el-table-column prop="time">
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showDialog(scope.row)">{{t('编辑', 'WAF.bj')}}</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="skip"
        :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      :visible.sync="showSessionDialog"
      :title="`${ucbRule ? t('编辑', 'WAF.bj') : '添加'}${t('自定义会话特征', 'WAF.zdyhhtz')}`"
      width="960px"
      :close-on-click-modal="false"
      @click.native="closeChildMatchDialogIndex"
      @close="beforeClose"
      destroy-on-close
    >
      <DiySessionDialog
        :domain="ipSearch"
        :childMatchDialogIndex.sync="childMatchDialogIndex"
        :visible.sync="showSessionDialog"
        :ucbRule="ucbRule"
        @success="onSuccess"
        ref="sessionDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import DiySessionDialog from '../../diySessionDIalog'
import { DESCRIBE_BOT_UCB_FEATURE_RULE, UPSERT_BOT_UCB_FEATURE_RULE } from '@/constants'
import { ALL_RULE, CUSTOM_SESSION_ACTION, ALL_OPTION, CUSTOM_SESSION_ACTION_ARR } from '../../../../constants'

export default {
  props: {
    ipSearch: String, // 选中的域名
  },
  data() {
    return {
      tableData: [],
      skip: 0,
      limit: 10,
      loading: true,
      total: 0,
      showSessionDialog: false,
      ucbRule: undefined,
      childMatchDialogIndex: -1,
      Operate: '-1',
      ALL_RULE,
      CUSTOM_SESSION_ACTION,
      CUSTOM_SESSION_ACTION_ARR,
      ALL_OPTION,
      sort: 'timestamp:-1',
      mounted: false,
    }
  },
  components: {
    DiySessionDialog
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
    onChangeStatus(fature, status) {
      fature.status = !status
      console.log(fature)
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
        "Skip": this.skip, 
        "Limit": this.limit,
      }
      if (this.Operate !== '-1') {
        param.Operate = this.Operate
      }
      param.Sort = this.sort
      this.axios.post(DESCRIBE_BOT_UCB_FEATURE_RULE, param).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          const data = Data.Res.map(data => {
            const d = JSON.parse(data)
            d.status = d.on_off === 'off' ? false : true
            return d
          })
          this.tableData = data
          this.total = Data.TotalCount
        })
      }).then(() => {
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.skip = page
      this.getUCBRule()
    },
    handleSizeChange(size) {
      this.limit = size
      this.getUCBRule()
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
</style>