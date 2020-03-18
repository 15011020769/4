<template>
  <div>
    <div class="wrapper">
      <div class="topDateIpt">
        <div class="newClear listTop">
          <el-select
            v-model="dominList"
            filterable
            allow-create
            class="dominList"
            default-first-option
          >
            <el-option
              v-for="item in dominOptions"
              :key="item.Domain"
              :label="item.Domain"
              :value="item.Domain"
            >
            </el-option>
          </el-select>
          <el-button-group class="btnGroup">
            <el-button
              :class="thisType == '1h' ? 'addBgColor' : ''"
              @click="choseDate(1, 'h')"
              >近1小{{ t("时", "WAF.hour") }}</el-button
            >
            <el-button
              :class="thisType == '6h' ? 'addBgColor' : ''"
              @click="choseDate(6, 'h')"
              >近6小{{ t("时", "WAF.hour") }}</el-button
            >
            <el-button
              :class="thisType == '0d' ? 'addBgColor' : ''"
              @click="choseDate(0, 'd')"
              >今天</el-button
            >
            <el-button
              :class="thisType == '1d' ? 'addBgColor' : ''"
              @click="choseDate(1, 'd')"
              >昨天</el-button
            >
            <el-button
              :class="thisType == '7d' ? 'addBgColor' : ''"
              @click="choseDate(7, 'd')"
              >近7天</el-button
            >
          </el-button-group>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            class="dataTime"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')"
          >
          </el-date-picker>
        </div>
        <div class="newClear">
          <el-select class="shortSelect" v-model="riskLevelVlaue">
            <el-option
              v-for="item in riskLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="actionVlaue">
            <el-option
              v-for="item in actionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="attackVlaue">
            <el-option
              v-for="item in attackOption"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            class="inputIpt"
            v-model="ruleId"
            :placeholder="t('输入策略ID', 'WAF.srclid')"
          ></el-input>
          <el-input
            class="inputIpt"
            v-model="attackIP"
            :placeholder="t('输入攻击源IP', 'WAF.srgjyip')"
          ></el-input>
          <el-button class="selectBtn" @click="search">{{
            t("查询", "WAF.js")
          }}</el-button>
          <i
            class="el-icon-download"
            style="cursor: pointer;"
            @click="createDownTask"
          ></i>
        </div>
      </div>
      <div class="tableCon">
        <el-row
          type="flex"
          align="middle"
          justify="space-between"
          style="margin: 0 10px;"
        >
          {{ t("总数量", "WAF.zsl") }}：{{ total }} {{ t("项", "WAF.x") }}
          <div class="topSet newClear">
            <i
              class="el-icon-setting"
              style="cursor: pointer;"
              @click="openDialog"
            ></i>
          </div>
        </el-row>
        <div class="tableMian">
          <el-table
            :data="tableDataBegin"
            :empty-text="t('暂无数据', 'WAF.zwsj')"
            v-loading="loading"
          >
            <el-table-column
              type="index"
              width="50"
              :label="t('序号', 'WAF.xh')"
            ></el-table-column>
            <el-table-column
              prop="Domain"
              v-if="columnsCopy.includes('Domain')"
              :label="t('被攻击网址', 'WAF.bgjwz')"
            ></el-table-column>
            <el-table-column
              prop="AttackIp"
              v-if="columnsCopy.includes('AttackIp')"
              :label="t('攻击源IP', 'WAF.gjyip')"
            ></el-table-column>
            <el-table-column
              prop="AttackType"
              v-if="columnsCopy.includes('AttackType')"
              :label="t('攻击类型', 'WAF.gjlx')"
            ></el-table-column>
            <el-table-column
              prop="RuleId"
              v-if="columnsCopy.includes('RuleId')"
              label="策略ID"
            ></el-table-column>
            <el-table-column
              prop="RuleName"
              v-if="columnsCopy.includes('RuleName')"
              :label="t('策略名称', 'WAF.clmc')"
            >
              <template scope="scope">
                <span v-if="scope.row.AttackContent.includes('cc:')">{{
                  scope.row.AttackContent.split(":")[1]
                }}</span>
                <span v-else>{{ scope.row.RuleName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="AttackContent"
              v-if="columnsCopy.includes('AttackContent')"
              :label="t('攻击内容', 'WAF.gjlr')"
            >
              <template scope="scope">
                <span v-if="scope.row.AttackContent.includes('cc:')">{{
                  scope.row.AttackContent.split(":")[2]
                }}</span>
                <span v-else>{{ scope.row.AttackContent }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="AttackTime"
              v-if="columnsCopy.includes('AttackTime')"
              :label="t('攻击时间', 'WAF.gjsj')"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="Status"
              v-if="columnsCopy.includes('Status')"
              :label="t('执行动作', 'WAF.zxdz')"
            >
              <template scope="scope">
                <span :class="'status-' + scope.row.Status">{{
                  scope.row.Status === "1" ? "拦截" : "观察"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="RiskLevel"
              v-if="columnsCopy.includes('RiskLevel')"
              :label="t('风险等级', 'WAF.fxdj')"
            >
              <template scope="scope">
                <span
                  :class="'riskLevel-' + scope.row.RiskLevel"
                  v-if="scope.row.RiskLevel === '1'"
                  >高危</span
                >
                <span v-if="scope.row.RiskLevel === '2'">中危</span>
                <span v-if="scope.row.RiskLevel === '3'">低危</span>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="
                    $router.push({
                      name: 'attackLog',
                      params: { log: scope.row }
                    })
                  "
                  >{{ t("详情", "WAF.xq") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <p class="loadmore" v-if="Context && !loadmoreloading">
            <el-button type="text" size="small" @click="loadmore">{{
              t("点击加载更多", "WAF.djjzgd")
            }}</el-button>
          </p>
          <p class="loadmore" v-if="loadmoreloading">
            <el-button type="text">{{ t("加载中", "WAF.zrz") }}</el-button>
          </p>
        </div>
      </div>
      <createDownTaskModel
        :isShow="createDownTaskModel"
        @create="createDownloadTask"
        @closeCreateTaskModel="closeCreateTaskModel"
      />
    </div>
    <el-dialog
      :title="t('自定义列表字段', 'WAF.dzylbzd')"
      :visible.sync="visible"
      width="420px"
      center
    >
      <el-checkbox-group v-model="columns" class="columns">
        <el-checkbox label="index" disabled>{{
          t("序号", "WAF.xh")
        }}</el-checkbox>
        <el-checkbox label="Domain">{{
          t("被攻击网址", "WAF.bgjwz")
        }}</el-checkbox>
        <el-checkbox label="AttackIp">{{
          t("攻击源IP", "WAF.gjyip")
        }}</el-checkbox>
        <el-checkbox label="AttackType">{{
          t("攻击类型", "WAF.gjlx")
        }}</el-checkbox>
        <el-checkbox label="RuleId">策略ID</el-checkbox>
        <el-checkbox label="RuleName">{{
          t("策略名称", "WAF.clmc")
        }}</el-checkbox>
        <el-checkbox label="AttackContent">{{
          t("攻击内容", "WAF.gjlr")
        }}</el-checkbox>
        <el-checkbox label="AttackTime">{{
          t("攻击时间", "WAF.gjsj")
        }}</el-checkbox>
        <el-checkbox label="Status">{{
          t("执行动作", "WAF.zxdz")
        }}</el-checkbox>
        <el-checkbox label="RiskLevel">{{
          t("风险等级", "WAF.fxdj")
        }}</el-checkbox>
        <el-checkbox label="action" disabled>操作</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="setColumns">{{
          t("确定", "WAF.qd")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import createDownTaskModel from '../model/createDownTaskModel'
import { ATTACK_TYPE, COMMON_ERROR } from '../../constants'
import { DESCRIBE_HOSTS, DESCRIBE_ATTACK_DETAIL, DESCRIBE_ATTACK_LOG_COUNT, CREATE_ATTACK_DOWNLOAD_TASK } from '@/constants'
export default {
  data () {
    return {
      visible: false,
      columnsCopy: [],
      columns: ['index', 'action', 'Domain', 'AttackIp', 'AttackType', 'RuleId', 'RuleName', 'AttackContent', 'AttackTime', 'Status', 'RiskLevel'],
      dominList: 'ALL', // 域名下拉
      dominOptions: [],
      thisType: '1h', // 默认时间选择
      timeValue: [moment().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')], // 时间选择
      riskLevelVlaue: '-1', // 风险等级
      riskLevelOption: [
        {
          label: this.t('全部风险等级', 'WAF.qbfxdj'),
          value: '-1'
        },
        {
          label: '高危',
          value: '1'
        },
        {
          label: '中危',
          value: '2'
        },
        {
          label: '低危',
          value: '3'
        }
      ],
      actionVlaue: '-1', // 执行动作
      actionOption: [
        {
          label: this.t('全部执行动作', 'WAF.qbzxdz'),
          value: '-1'
        },
        {
          label: '观察',
          value: '0'
        },
        {
          label: '拦截',
          value: '1'
        }
      ],
      attackVlaue: '-1', // 注入攻击类型
      attackOption: [
        {
          label: this.t('全部攻击类型', 'WAF.qbgjlx'),
          id: '-1'
        },
        ...ATTACK_TYPE
      ],
      ruleId: '', // 策略ID
      attackIP: '', // 攻击源IP
      tableDataBegin: [],
      createDownTaskModel: false, // 创建下载任务弹框
      Context: '',
      total: 0,
      loading: false,
      loadmoreloading: false,
      startTime: moment().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    createDownTaskModel
  },
  watch: {
    columns (val, oldVal) {
      if (val.length === 3) {
        this.$message({
          message: this.t('至少选择4个', 'WAF.zsxz4g'),
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.columns = [...oldVal]
      }
    }
  },
  mounted () {
    this.columnsCopy = [...this.columns]
    this.init()
    this.axios.post(DESCRIBE_HOSTS, {
      Version: '2018-01-25'
    }).then(resp => {
      this.generalRespHandler(resp, ({ HostList }) => {
        this.dominOptions = [{
          Domain: 'ALL'
        }, ...HostList]
      })
    })
  },
  methods: {
    openDialog () {
      this.columnsCopy = [...this.columns]
      this.visible = true
    },
    cancelDialog () {
      this.visible = false
      this.columns = [...this.columnsCopy]
    },
    setColumns () {
      this.columnsCopy = [...this.columns]
      this.visible = false
    },
    loadmore () {
      this.loadmoreloading = true
      this.queryLogs()
    },
    search () { // 检索
      this.tableDataBegin = []
      this.Context = ''
      this.init()
    },
    init () {
      this.loading = true
      this.queryLogs()
      this.queryLogCount()
    },
    queryLogCount () {
      const { Context, startTime, endTime, dominList } = this
      let domain = dominList
      if (domain === 'ALL') {
        domain = 'all'
      }
      const params = {
        Version: '2018-01-25',
        Domain: domain,
        FromTime: startTime,
        ToTime: endTime
      }
      // 风险等级
      if (this.riskLevelVlaue !== '-1') {
        params.RiskLevel = this.riskLevelVlaue
      }
      // 拦截状态
      if (this.actionVlaue !== '-1') {
        params.Status = Number(this.actionVlaue)
      }
      // 攻击类型
      if (this.attackVlaue !== '-1') {
        params.AttackType = this.attackVlaue
      }
      if (this.attackIP) {
        params.AttackIp = this.attackIP
      }
      if (this.ruleId) {
        params.RuleId = this.ruleId
      }
      this.axios.post(DESCRIBE_ATTACK_LOG_COUNT, params).then(resp => {
        this.generalRespHandler(resp, ({ Count }) => {
          this.total = Count
        })
      })
    },
    queryLogs () {
      const { Context, startTime, endTime, dominList } = this
      let domain = dominList
      if (domain === 'ALL') {
        domain = 'all'
      }
      const params = {
        Version: '2018-01-25',
        Domain: domain,
        FromTime: startTime,
        ToTime: endTime
      }
      // 风险等级
      if (this.riskLevelVlaue !== '-1') {
        params.RiskLevel = this.riskLevelVlaue
      }
      // 拦截状态
      if (this.actionVlaue !== '-1') {
        params.Status = Number(this.actionVlaue)
      }
      // 攻击类型
      if (this.attackVlaue !== '-1') {
        params.AttackType = this.attackVlaue
      }
      if (this.ruleId) {
        params.RuleId = this.ruleId
      }
      if (this.attackIP) {
        params.AttackIp = this.attackIP
      }
      this.axios.post(DESCRIBE_ATTACK_DETAIL, {
        ...params,
        Context,
        Count: 20
      }).then(resp => {
        this.generalRespHandler(resp, ({ Context, Data, Count }) => {
          this.tableDataBegin = this.tableDataBegin.concat(Data)
          this.Context = Context
        })
      }).then(() => {
        this.loading = false
        this.loadmoreloading = false
      })
    },
    // 时间选择按钮
    choseDate (num, unit) {
      this.thisType = `${num}${unit}`
      var ipt1 = document.querySelector('.dataTime input:nth-child(2)')
      var ipt2 = document.querySelector('.dataTime input:nth-child(4)')
      let startTime = moment().subtract(num, unit)

      if (unit === 'd') {
        startTime = moment().subtract(num, unit).startOf('d')
      }
      console.log(startTime.format('YYYY-MM-DD HH:mm:ss'), 'this.startTime')
      ipt1.value = startTime.format('YYYY-MM-DD HH:mm:ss')
      ipt2.value = moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')
      this.startTime = startTime.format('YYYY-MM-DD HH:mm:ss')
      this.endTime = moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')
      if (num === 1 && unit === 'd') {
        this.endTime = moment().subtract(1, 'd').endOf('d').format('YYYY-MM-DD HH:mm:ss')
        ipt2.value = moment().subtract(1, 'd').endOf('d').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 创建下载任务
    createDownTask () {
      this.createDownTaskModel = true
    },
    createDownloadTask (name) {
      const { Context, startTime, endTime, dominList } = this
      let domain = dominList
      if (domain === 'ALL') {
        domain = 'all'
      }
      const params = {
        Version: '2018-01-25',
        Domain: domain,
        FromTime: startTime,
        ToTime: endTime,
        Name: name,
        AttackIp: this.attackIP
      }
      // 风险等级
      if (this.riskLevelVlaue !== '-1') {
        params.RiskLevel = this.riskLevelVlaue
      }
      // 拦截状态
      if (this.actionVlaue !== '-1') {
        params.Status = this.actionVlaue
      }
      // 攻击类型
      if (this.attackVlaue !== '-1') {
        params.AttackType = this.attackVlaue
      }
      if (this.ruleId) {
        params.RuleId = this.ruleId
      }
      this.axios.post(CREATE_ATTACK_DOWNLOAD_TASK, params).then(resp => {
        this.generalRespHandler(resp, ({ Context, Data, Count }) => {
          this.createDownTaskModel = false
        }, COMMON_ERROR, this.t('创建成功，你可以前往“下载任务”界面查看任务状态', 'WAF.cjcgnkyqw'))
      })
    },
    // 关闭下载任务弹框
    closeCreateTaskModel (isShow) {
      this.createDownTaskModel = false
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  clear: both;
  display: block;
}
::v-deep input {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
}
::v-deep button {
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border-radius: 0;
}
.wrapper {
  width: 100%;
}
.topDateIpt {
  width: 100%;
  height: 120px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  .listTop {
    margin-bottom: 20px;
  }
}
.dominList {
  float: left;
  margin-right: 10px;
}
.addBgColor {
  color: #fff;
  background-color: #006eff;
}
.btnGroup {
  float: left;
}
.dataTime {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  float: left;
  margin-left: 10px;
  ::v-deep .el-input__icon {
    line-height: 26px;
  }
  ::v-deep .el-range-separator {
    line-height: 26px;
    width: 7%;
  }
}
.shortSelect {
  width: 120px;
  font-size: 12px;
  margin-right: 10px;
  ::v-deep input {
    font-size: 12px;
  }
}
.inputIpt {
  width: 178px;
  margin-right: 10px;
}
::v-deep button.selectBtn {
  background-color: #006eff;
  color: #fff;
}
.el-icon-download {
  float: right;
  font-size: 20px;
}
.tableCon {
  width: 100%;
  min-height: 200px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px 0;
  margin: 20px 0;
  border: 1px solid #ddd;
}
.topSet {
  .el-icon-setting {
    font-size: 18px;
    float: right;
  }
}
.tableMian {
  min-height: 450px;
}
.loadmore {
  border-bottom: 1px solid #ebeef5;
  padding: 5px 0;
  text-align: center;
}
.columns {
  label {
    width: 120px;
  }
  ::v-deep .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
  ::v-deep .el-checkbox {
    font-size: 12px;
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}
.status-1,
.riskLevel-1 {
  color: #e1504a;
}
</style>
