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
            <el-col>为啥子</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">匹配模式</el-col>
            <el-col>为啥子</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('会话标识', 'WAF.hhbs')}}</el-col>
            <el-col>为啥子</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('会话设置', 'WAF.hhsz')}}</el-col>
            <el-col>为啥子</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" :gutter="20">
            <el-col :span="2" class="label">{{t('设置时间', 'WAF.szsj')}}</el-col>
            <el-col>为啥子</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 15px;">
      <h3>{{t('CC规则设置', 'WAF.ccgzsz')}}</h3>
      <el-row type="flex" justify="space-between" class="actions-container">
        <el-button type="primary" @click="dialogRule=true">{{t('添加规则', 'WAF.tjgz')}}</el-button>
        <i class="el-icon-refresh refresh" />
      </el-row>
      <el-table :data="rules" v-loading="loading">
        </el-table-column>
        <el-table-column prop="Name" :label="t('规则名称', 'WAF.gzmc')">
        </el-table-column>
        <el-table-column :label="t('匹配条件', 'WAF.pptj')">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('请求路径', 'WAF.qqlj')">
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('访问频次', 'WAF.fwpc')">
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('执行动作', 'WAF.zxdz')">
        </el-table-column>
        <el-table-column prop="CreateTime" :label="`${t('启用', 'WAF.qy')}SESSION`">
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('惩罚时长', 'WAF.cfsc')">
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('优先级', 'WAF.yxsx')" sortable>
        </el-table-column>
        <el-table-column prop="Name" :label="t('规则开关', 'WAF.gzkg')">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.cjsj')" sortable>
        </el-table-column>
        <el-table-column prop="Name" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateRule">{{t('编辑', 'WAF.bj')}}</el-button> 
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="`SESSION${t('设置', 'WAF.sz')}`"
      :visible.sync="dialogSessionSet"
      :before-close="beforeClose"
      width="730px"
    >
      <SessionSet :visible.sync="dialogSessionSet" :session="session" />
    </el-dialog>
    <el-dialog
      :title="`SESSION${t('测试', 'WAF.cs')}`"
      :visible.sync="dialogSessionTest"
      :before-close="beforeClose"
      width="530px"
    >
      <SessionTest :visible.sync="dialogSessionTest" :session="session" />
    </el-dialog>
  </div>
</template>
<script>
import { DESCIRBE_CCRULE, DESCRIBE_SESSION, DELETE_SESSION } from '@/constants'
import SessionSet from '../model/sessionSet'
import SessionTest from '../model/sessionTest'
import { flatObj } from '@/utils'
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../../constants'

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
      session: undefined,
      loading: true,
      showTip: true,
      dialogSessionSet: false,
      dialogSessionTest: false,
    }
  },
  components: {
    SessionSet,
    SessionTest
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
        this.generalRespHandler(resp, data => {
          this.session = data
        })
      })
    },
    getCCRule() {
      this.loading = true
      this.axios.post(DESCIRBE_CCRULE, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Edition: 'clb-waf',
        Offset: 1,
        Limit: 10,
      }).then(resp => {
        this.generalRespHandler(resp, data => {
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
    beforeClose(done) {
      this.session = undefined
      done()
    },
    updateRule(rule) {
      this.rule = rule
      this.dialogRule = true
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
</style>