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
        <el-button  style="padding: 5px 10px; margin-right: 10px;"  type="primary" @click="onAdd">添加</el-button>
        <el-button style="padding: 5px 10px; margin-right: 10px;" >复制</el-button>
        <span style="color: #bbb; font-size: 12px; margin-left: 10px">最多可以添加50条</span>
      </el-col>
      <el-row type="flex" align="middle">
        <el-input placeholder="请输入策略名称" style="width: 180px; font-size: 12px">
          <div style="cursor: pointer" slot="suffix">
            <i class="el-icon-search"/>
          </div>
        </el-input>
        <i style="margin-left: 10px" class="el-icon-refresh" />
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
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label="策略名称/描述">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p class="sub-text">{{scope.row.desc}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="term" label="匹配条件">
          <template slot-scope="scope">
            <div v-for="rule in scope.row.rule" :key="rule.key">
              <p>{{ALL_RULE[rule.key].label}} {{rule.op | labelFilter}} 
                <span v-if="rule.value === true">是</span>
                <span v-else-if="rule.value === false">否</span>
                <span v-else-if="Array.isArray(rule.value)" v-for="v in rule.value">{{ALL_OPTION[v].label}} </span>
                <span v-else>{{rule.value}}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="动作">
          <template slot-scope="scope">
            {{CUSTOM_SESSION_ACTION[scope.row.action]}}
            <span v-if="scope.row.valid_time > 0">{{scope.row.valid_time}}分钟</span>
            <p v-if="scope.row.action === CUSTOM_SESSION_ACTION.重定向">
              重定向路径：{{scope.row.addition_arg}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="策略开关">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="修改时间">
          <template slot-scope="scope">
            {{formatDate(scope.row.timestamp)}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showDialog(scope.row)">编辑</el-button>
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
      title="添加自定义会话特征"
      width="960px"
      :close-on-click-modal="false"
      @click.native="closeChildMatchDialogIndex"
      @close="beforeClose"
      destroy-on-close
    >
      <DiySessionDialog
        :domain="domain"
        :childMatchDialogIndex.sync="childMatchDialogIndex"
        :visible.sync="showSessionDialog"
        :ucbRule="ucbRule"
        ref="sessionDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import DiySessionDialog from '../../diySessionDIalog'
import { DESCRIBE_BOT_UCB_FEATURE_RULE } from '@/constants'
import { ALL_RULE, CUSTOM_SESSION_ACTION, ALL_OPTION } from '../../../../constants'
export default {
  data() {
    return {
      domain: '',
      tableData: [],
      skip: 0,
      limit: 10,
      loading: true,
      total: 0,
      showSessionDialog: false,
      ucbRule: undefined,
      childMatchDialogIndex: -1,
      ALL_RULE,
      CUSTOM_SESSION_ACTION,
      ALL_OPTION,
    }
  },

  components: {
    DiySessionDialog
  },
  mounted() {
    this.domain = this.$route.params.id
    this.getUCBRule()
  },
  methods: {
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
    getUCBRule() {
      this.loading = true
      this.axios.post(DESCRIBE_BOT_UCB_FEATURE_RULE, {
        "Version": 
        "2018-01-25",
        "Domain": "tfc.dhycloud.com", 
        "Skip": this.skip, 
        "Limit": this.limit,
        Sort: 'timestamp:-1'
      }).then(resp => {
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
    }
  },
  filters: {
    labelFilter(e) {
      switch (e) {
        case '>': return '大于'
        case '<': return '小于'
        case 'belong': return '属于'
        case 'not belong': return '不属于'
        case 'contains': return '包含'
        case 'not contains': return '不包含'
        case 'yes': return '是'
        case 'no': return '否'
        default: break;
      }
    }
  }
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