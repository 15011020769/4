<template>
  <div>
    <div class="topHeader">
      <span>IP{{ t("封堵状态", "WAF.fdzt") }}</span>
      <el-select
        v-model="ipSearch"
        filterable
        allow-create
        default-first-option
        :placeholder="t('请选择Ip地址', 'WAF.qxzipdz')"
      >
        <el-option
          v-for="item in ipSearchOptions"
          :key="item.Domain"
          :label="item.Domain"
          :value="item.Domain"
        >
        </el-option>
      </el-select>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p>
          {{
            t(
              "这里可以檢視到正在封堵状态中的IP记录/这里可以檢視动态生成的IP封堵记录，例如CC，BOT，自定义人机识别等",
              "WAF.zlkyckzzfd"
            )
          }}
        </p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="filterCon">
        <div>
          <span>{{ t("类型", "WAF.lx") }}: </span>
          <el-select
            class="select"
            v-model="typeCheck"
            style="margin-left: 52px;"
          >
            <el-option
              v-for="item in IP_STATUS_TYPE_ARR"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </div>
        <!-- <div class="timeCon newClear"> -->
        <div class="timeCon" style="display: flex">
          <div style="margin-right: 20px;">
            <span class="floatLeft"
              >{{ t("记录创建时间", "WAF.jlcjsj") }}：</span
            >
            <el-button-group class="floatLeft">
              <el-button
                :disabled="disabledIp"
                :type="createTimeType === 5 ? 'primary' : ''"
                size="mini"
                @click="onTimeClick(5)"
                >最近5{{ t("分钟", "WAF.fz") }}</el-button
              >
              <el-button
                :disabled="disabledIp"
                :type="createTimeType === 10 ? 'primary' : ''"
                size="mini"
                @click="onTimeClick(10)"
                >最近10{{ t("分钟", "WAF.fz") }}</el-button
              >
              <el-button
                :disabled="disabledIp"
                :type="createTimeType === 30 ? 'primary' : ''"
                size="mini"
                @click="onTimeClick(30)"
                >最近30{{ t("分钟", "WAF.fz") }}</el-button
              >
            </el-button-group>
            <el-date-picker
              style="border-left: none;"
              :clearable="false"
              size="mini"
              class="floatLeft timePick"
              v-model="timeValue1"
              type="datetimerange"
              @change="changeTimeValue"
              range-separator="至"
              :start-placeholder="t('开始日期', 'WAF.ksrq')"
              :end-placeholder="t('结束日期', 'WAF.jsrq')"
              :disabled="disabledIp"
            />
          </div>
          <div style="flex: 1">
            <el-checkbox
              :disabled="disabledIp"
              class="floatLeft checkBo"
              v-model="timeOut"
              label="有效截止日期:"
              name="time"
            ></el-checkbox>
            <el-date-picker
              size="mini"
              :clearable="false"
              class="floatLeft timePick"
              v-model="timeValue2"
              type="datetimerange"
              range-separator="至"
              :start-placeholder="t('开始日期', 'WAF.ksrq')"
              :end-placeholder="t('结束日期', 'WAF.jsrq')"
              :disabled="disabledIp"
            ></el-date-picker>
          </div>
        </div>
        <div style="margin-top: 15px;">
          <span>{{ t("触发策略", "WAF.cfcl") }}：</span>
          <el-input
            :disabled="disabledIp"
            v-model="triggerStrategy"
            style="width: 180px; margin-left: 23px"
          />
          <el-tooltip
            class="tooltip"
            effect="dark"
            :content="
              t(
                '如果您想查询“智能CC”的封堵状态，请输入auto_cc',
                'WAF.rgnxcxzncc'
              )
            "
            placement="right"
          >
            <i class="el-icon-info" style="margin-left: 10px;" />
          </el-tooltip>
        </div>
        <div style="margin-top: 20px;">
          <span>IP地址：</span>
          <el-input
            v-model.trim="iptIP"
            style="width: 180px; margin-left: 36px"
          />
          <div class="err-tips" style="margin-left: 83px" v-show="ipTest">
            {{ t("IP格式输入有误", "WAF.ipgsyw") }}
          </div>
        </div>
        <div>
          <el-button
            type="primary"
            @click="onSearch"
            size="mini"
            class="lookSearch"
            >{{ t("查询", "WAF.js") }}</el-button
          >
        </div>
      </div>
      <el-row type="flex" justify="end" style="margin-bottom: 15px;">
        <el-button
          type="primary"
          size="small"
          @click="exportFile"
          :disabled="tableDataBegin.length === 0"
          >{{ t("导出全部筛选结果", "WAF.dcqbsxjg") }}</el-button
        >
      </el-row>
      <el-card>
        <el-table
          ref="multipleTable"
          :data="tableDataBegin"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loadShow"
        >
          <el-table-column type="selection" class-name="hide" width="1" />
          <el-table-column prop="num" :label="t('序号', 'WAF.xh')">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="category" :label="t('类别', 'WAF.lb')">
            <template slot-scope="scope">
              {{ scope.row.category === "cc" ? "CC" : scope.row.category }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址"></el-table-column>
          <el-table-column
            prop="name"
            :label="t('策略名称', 'WAF.clmc')"
          ></el-table-column>
          <el-table-column prop="action" :label="t('动作', 'WAF.dz')">
            <template slot-scope="scope">
              {{ ALL_ACTION[scope.row.action] }}
            </template>
          </el-table-column>
          <el-table-column prop="ts_version">
            <el-button
              type="text"
              slot="header"
              style="padding: 0; color: #444;"
              @click="setSort('ts_version')"
            >
              {{ t("创建时间", "WAF.cjsj") }}
              <i class="el-icon-caret-top" v-if="sort === 'ts_version:1'"></i>
              <i
                class="el-icon-caret-bottom"
                v-if="sort === 'ts_version:-1'"
              ></i>
              <i class="el-icon-d-caret" v-if="sort.includes('valid_ts')"></i>
            </el-button>
            <template slot-scope="scope">
              {{ scope.row.ts_version | currentTimeFilter }}
            </template>
          </el-table-column>
          <el-table-column prop="valid_ts">
            <el-button
              type="text"
              slot="header"
              style="padding: 0; color: #444;"
              @click="setSort('valid_ts')"
            >
              有效{{ t("截止时间", "WAF.jzsj") }}
              <i class="el-icon-caret-top" v-if="sort === 'valid_ts:1'"></i>
              <i class="el-icon-caret-bottom" v-if="sort === 'valid_ts:-1'"></i>
              <i class="el-icon-d-caret" v-if="sort.includes('ts_version')"></i>
            </el-button>
            <template slot-scope="scope">
              {{ scope.row.valid_ts | currentTimeFilter }}
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作">
            <template slot-scope="scope">
              <el-button @click="addBW(42, scope)" type="text" size="mini"
                >加黑</el-button
              >
              <el-button @click="addBW(40, scope)" type="text" size="mini"
                >加白</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="skip"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        ></el-pagination>
      </el-card>
    </div>
    <el-dialog
      title="添加黑白IP"
      :visible.sync="addBWmodel"
      width="45%"
      destroy-on-close
    >
      <addBlackWhite
        @success="closeModel"
        :isShow.sync="addBWmodel"
        :ipInfo="ipInfo"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="batchExportVisible"
      title="导出记录"
      width="550px"
      destroy-on-close
    >
      <batchExport
        :visible.sync="batchExportVisible"
        :count="totalItems"
        :param="exportParam"
      />
    </el-dialog>
  </div>
</template>

<script>
import addBlackWhite from './model/addBlackWhite'
import batchExport from './model/batchExportStatus'
import { DESCRIBE_ACCESS_CONTROL, DESCRIBE_HOSTS, DESCRIBEIP_HITITEMS } from '@/constants'
import { IP_STATUS_TYPE_ARR, ALL_ACTION, COMMON_ERROR } from '../constants'
import moment from 'moment'

export default {
  data () {
    return {
      batchExportVisible: false,
      ALL_ACTION,
      ipSearch: '', // ip查询下拉
      ipSearchOptions: [],
      IP_STATUS_TYPE_ARR, // 类型下拉选项
      tipShow: true, // 提示文字
      resouseC: '', // 来源
      typeCheck: 'CC', // 类别
      iptIP: '', // 输入IP
      arrowShow: true, // 箭头显示
      flag: true,
      timeValue1: [moment().subtract(5, 'm'), moment().endOf('d')], // 创建时间
      timeOut: false, // 有效截止日期
      timeValue2: [moment(), moment().add(8, 'd')], // 有效截止日期
      multipleSelection: [], // tableCheck
      createTimeType: 5,
      tableDataBegin: [], // 表格数据
      tableDataEnd: [],
      skip: 1, // 当前页
      limit: 20, // 每页长度
      totalItems: 0, // 总长度
      filterTableDataEnd: [],
      flag: false, // 定义一个开关
      loadShow: true, // 加载
      visible: false, // 删除弹框
      addBWmodel: false, // 添加黑白IP弹框
      ipTest: false, // ip输入格式是否正确
      disabledIp: false, // 如果有输入ip地址，则禁用别的按钮
      triggerStrategy: '', // 触发策略
      ipInfo: {}, // 保存编辑信息
      ctsFlag: false, // 更新时间升降序
      vtsFlag: false, // 有效时间时间升降序
      sort: 'valid_ts:1',
      exportParam: undefined
    }
  },
  components: {
    addBlackWhite,
    batchExport
  },
  watch: {
    iptIP (n) {
      if (n) {
        let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
        this.ipTest = !pattern.test(n)
        this.disabledIp = true
      } else {
        this.disabledIp = false
        this.ipTest = false
      }
    }
  },
  mounted () {
    this.getDescribeHost()
  },
  methods: {
    exportFile () {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Count: 1,
        Ip: this.iptIP || undefined,
        CtsMin: this.timeValue1 ? moment(new Date(this.timeValue1[0])).format('x') : undefined, // 创建最小时间戳
        CtsMax: moment(moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')).format('x'),
        Category: this.typeCheck.toLowerCase(),
        Name: this.triggerStrategy || undefined,
        Sort: this.sort
      }

      if (this.timeOut) {
        params.VtsMin = moment(new Date(this.timeValue2[0])).format('X')
        params.VtsMax = moment(new Date(this.timeValue2[1])).format('X')
      }

      if (this.disabledIp) {
        delete params.CtsMin
        delete params.CtsMax
        delete params.VtsMin
        delete params.VtsMax
        delete params.Name
      }
      this.exportParam = params
      this.batchExportVisible = true
    },
    setSort (key) {
      if (this.sort.includes(key)) { // 升降序
        if (this.sort.includes('-')) {
          this.sort = `${key}:1`
        } else {
          this.sort = `${key}:-1`
        }
      } else { // 换个排序字段 默认降序
        this.sort = `${key}:-1`
      }
      this.onSearch()
    },
    // 关闭提示文字
    closeTip () {
      this.tipShow = false
    },
    // 点击檢視详情
    isShowTop () {
      if (this.flag) {
        this.arrowShow = false
        this.flag = true
      } else {
        this.arrowShow = true
        this.flag = false
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取防护域名列表
    getDescribeHost () {
      let params = {
        Version: '2018-01-25'
      }

      this.axios.post(DESCRIBE_HOSTS, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        } else {
          this.ipSearchOptions = data.Response.HostList
          if (this.ipSearchOptions.length) {
            this.ipSearch = this.ipSearchOptions[0].Domain
          }
            this.onSearch()
        }
      })
    },
    // 分页开始
    handleSizeChange (val) {
      this.limit = val
      this.onSearch()
    },
    handleCurrentChange (val) {
      this.skip = val
      this.onSearch()
    },
    // 添加黑白名单按钮
    addBW (flag, { row }) {
      this.ipInfo = {
        Domain: this.ipSearch,
        type: 'ipStatus',
        ipAddress: row.ip,
        blackWhiteCh: flag,
        des: row.name,
        datatime: moment(),
        timeValue: moment().format('YYYY-MM-DD 23:59:59')
      }
      this.addBWmodel = true
    },

    // 快捷时间查询
    onTimeClick (temp) {
      this.createTimeType = temp
      const map = {
        5: [moment().subtract(5, 'm'), moment().endOf('d')],
        10: [moment().subtract(10, 'm'), moment().endOf('d')],
        30: [moment().subtract(30, 'm'), moment().endOf('d')]
      }

      this.timeValue1 = map[temp]
    },
    changeTimeValue (data) {
      this.createTimeType = 0
      this.timeValue1 = data
    },
    // 条件查询
    onSearch () {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Count: 1,
        Limit: this.limit,
        Skip: (this.skip - 1) * this.limit,
        Ip: this.iptIP || undefined,
        CtsMin: this.timeValue1 ? moment(new Date(this.timeValue1[0])).format('x') : undefined, // 创建最小时间戳
        CtsMax: moment(moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')).format('x'),
        Category: this.typeCheck.toLowerCase(),
        Name: this.triggerStrategy || undefined,
        Sort: this.sort
      }

      if (this.timeOut) {
        params.VtsMin = moment(new Date(this.timeValue2[0])).format('X')
        params.VtsMax = moment(new Date(this.timeValue2[1])).format('X')
      }

      if (this.disabledIp) {
        delete params.CtsMin
        delete params.CtsMax
        delete params.VtsMin
        delete params.VtsMax
        delete params.Name
      }

      this.axios.post(DESCRIBEIP_HITITEMS, params)
        .then(resp => {
          this.generalRespHandler(resp, ({ Data }) => {
            const data = (Data.Res || []).map(d => ({ ...d }))
            this.tableDataBegin = data
            this.totalItems = Data.TotalCount
            this.loadShow = false
          })
        })
    },

    // 关闭
    closeModel (isShow) {
      this.addBWmodel = false
    }
  },

  filters: {
    currentTimeFilter (time) {
      if (time) {
        const len = JSON.stringify(time).length
        let str = time
        if (len < 13) {
          str = str * 1000
        }
        return moment(new Date(str)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topHeader {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-right: 20px;
  }
}
::v-deep input {
  height: 30px;
  border-radius: 0;
}
::v-deep button {
  border-radius: 0;
}
.wrapper {
  width: 100%;
  padding: 20px;
  .topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      // transform: translateY(-50%);
      right: 20px;
    }
  }
  .filterCon {
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-bottom: 20px;
    .select {
      width: 140px;
      margin-right: 15px;
    }
    .iptIP {
      width: 200px;
    }
    .topFilter {
      color: #006eff;
      font-size: 14px;
      margin-left: 10px;
    }
    .timeCon {
      margin-top: 20px;
      line-height: 30px;
    }
    .lookSearch {
      color: #fff;
      margin-top: 20px;
    }
    .floatLeft {
      float: left;
    }
    .timePick {
      width: 345px;
      ::v-deep .el-range-separator {
        width: 7%;
      }
    }
    .checkBo {
      margin-right: 10px;
    }
    .err-tips {
      font-size: 10px;
      color: #e1504a;
      width: 100px;
      padding-top: 5px;
    }
  }
  .tableList {
    .tableListBtn {
      margin-bottom: 12px;
      .addBW {
        background-color: #006eff;
        color: #fff;
      }
      .exportFilter {
        background-color: #006eff;
        color: #fff;
        float: right;
      }
    }
    .tableCon {
      min-height: 450px;
      background-color: #fff;
    }
  }
  .tabListPage {
    height: 50px;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    text-align: right;
    background-color: #fff;
  }
}
::v-deep .hide {
  visibility: hidden;
}
</style>
