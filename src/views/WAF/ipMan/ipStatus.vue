<template>
  <div>
    <div class="topHeader">
      <span>IP{{t('封堵状态', 'WAF.fdzt')}}</span>
      <el-select v-model="ipSearch" filterable allow-create default-first-option :placeholder="t('请选择Ip地址', 'WAF.qxzipdz')">
        <el-option v-for="item in ipSearchOptions" :key="item.Domain" :label="item.Domain" :value="item.Domain">
        </el-option>
      </el-select>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p>{{t('这里可以查看到正在封堵状态中的IP记录/这里可以查看动态生成的IP封堵记录，例如CC，BOT，自定义人机识别等', 'WAF.zlkyckzzfd')}}</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="filterCon">
        <div>
          <span>{{t('类型', 'WAF.lx')}}: </span>
          <el-select class="select" v-model="typeCheck" style="margin-left: 52px;">
            <el-option v-for="item in IP_STATUS_TYPE_ARR" :label="item.name" :value="item.value" :key="item.value" />
          </el-select>
        </div>
        <!-- <div class="timeCon newClear"> -->
        <div class="timeCon" style="display: flex">
          <div>
            <span class="floatLeft">{{t('记录创建时间', 'WAF.jlcjsj')}}：</span>
            <el-button-group class="floatLeft">
              <el-button :disabled="disabledIp" size="mini" @click="onTimeClick('hour')">最近1小时</el-button>
              <el-button :disabled="disabledIp" size="mini" @click="onTimeClick('day')">最近1天</el-button>
              <el-button :disabled="disabledIp" size="mini" @click="onTimeClick('week')">最近7天</el-button>
            </el-button-group>
            <el-date-picker style="border-left: none;" size="mini" class="floatLeft timePick" v-model="timeValue1" type="datetimerange" range-separator="至" :start-placeholder="t('开始日期', 'WAF.ksrq')" :end-placeholder="t('结束日期', 'WAF.jsrq')" :disabled="disabledIp" />
          </div>
          <div style="flex: 1">
            <el-checkbox :disabled="disabledIp" class="floatLeft checkBo" v-model="timeOut" label="有效截止日期:" name="time"></el-checkbox>
            <el-date-picker size="mini" class="floatLeft timePick" v-model="timeValue2" type="datetimerange" range-separator="至" :start-placeholder="t('开始日期', 'WAF.ksrq')" :end-placeholder="t('结束日期', 'WAF.jsrq')" :disabled="disabledIp"></el-date-picker>
          </div>
        </div>
        <div style="margin-top: 15px;">
          <span>{{t('触发策略', 'WAF.cfcl')}}：</span>
          <el-input :disabled="disabledIp" v-model="triggerStrategy" style="width: 180px; margin-left: 23px" />
          <el-tooltip class="tooltip" effect="dark" :content="t('如果您想查询“智能CC”的封堵状态，请输入auto_cc', 'WAF.rgnxcxzncc')" placement="right">
            <i class="el-icon-info" style="margin-left: 10px;" />
          </el-tooltip>
        </div>
        <div style="margin-top: 20px;">
          <span>IP地址：</span>
          <el-input v-model="iptIP" style="width: 180px; margin-left: 36px" />
          <div class="err-tips"  style="margin-left: 83px"v-show="ipTest">{{t('IP格式输入有误', 'WAF.ipgsyw')}}</div>
        </div>
        <div>
          <el-button type="primary" @click="onSearch" size="mini" class="lookSearch">{{t('查询', 'WAF.js')}}</el-button>
        </div>
      </div>
        <el-row type="flex" justify="end" style="margin-bottom: 15px;">
          <el-button type="primary" size="small" :disabled="tableDataBegin.length === 0">{{t('导出全部筛选结果', 'WAF.dcqbsxjg')}}</el-button>
        </el-row>
        <el-card>
          <el-table ref="multipleTable" :data="tableDataBegin && tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" tooltip-effect="dark" style="width: 100%" v-loading="loadShow">
            <el-table-column
              type="selection"
              class-name="hide"
              width="1"
            />
            <el-table-column prop="num" :label="t('序号', 'WAF.xh')">
              <template slot-scope="scope">{{ scope.$index+1}}</template>
            </el-table-column>
            <!-- <el-table-column prop="resourse" label="来源"></el-table-column> -->
            <el-table-column prop="category" :label="t('类别', 'WAF.lb')"></el-table-column>
            <el-table-column prop="ip" label="IP地址"></el-table-column>
            <el-table-column prop="name" :label="t('策略名称', 'WAF.clmc')"></el-table-column>
            <el-table-column prop="action" :label="t('动作', 'WAF.dz')"></el-table-column>
            <el-table-column prop="ts_version">
              <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('ts_version')">
                {{t('创建时间', 'WAF.cjsj')}}
                <i class="el-icon-caret-top" v-if="sort === 'ts_version:1'"></i>
                <i class="el-icon-caret-bottom" v-if="sort === 'ts_version:-1'"></i>
                <i class="el-icon-d-caret" v-if="sort.includes('valid_ts')"></i>
              </el-button>
              <!-- <span slot="header">
                {{t('创建时间', 'WAF.cjsj')}}
                <i @click="() => { onSearch('Cts'); ctsFlag = !ctsFlag }" style="cursor: pointer" class="el-icon-d-caret" />
              </span> -->
              <template slot-scope="scope">
                {{scope.row.ts_version | currentTimeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="valid_ts">
              <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('valid_ts')">
                有效{{t('截止时间', 'WAF.jzsj')}}
                <i class="el-icon-caret-top" v-if="sort === 'valid_ts:1'"></i>
                <i class="el-icon-caret-bottom" v-if="sort === 'valid_ts:-1'"></i>
                <i class="el-icon-d-caret" v-if="sort.includes('ts_version')"></i>
              </el-button>
              <!-- <span slot="header">
                有效截止{{t('时间', 'WAF.time')}}
                <i @click="() => { onSearch('Vts'); vtsFlag = !vtsFlag }" style="cursor: pointer" class="el-icon-d-caret" />
              </span> -->
              <template slot-scope="scope">
                {{scope.row.valid_ts | currentTimeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="mini">编辑</el-button> -->
                <el-button @click="addBW(40, scope)" type="text" size="mini">加白</el-button>
                <el-button @click="addBW(42, scope)" type="text" size="mini">加黑</el-button>
                <!-- <el-popover
                  placement="bottom"
                  width="220"
                  v-model="visible">
                  <div class="deleteCon" style="text-align:center;">
                    <h1 style="font-size:14px;font-weight: 600;margin-bottom:16px;">确认删除该记录？</h1>
                    <p style="font-size:12px;color:#333;margin-bottom:16px;">删除IP：{{scope.row.ipAddress}}</p>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="visible = false">删除</el-button>
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="text" style="margin-left:10px;">删除</el-button>
                </el-popover> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems"></el-pagination>
        </el-card>
    </div>
    <!-- <addBWmodel :isShow="addBWmodel"/> -->
    <addBlackWhite @closeModel="closeModel" :isShow="addBWmodel" :ipInfo="Object.assign(ipInfo, { Domain: ipSearch, type: 'ipStatus' })" />
  </div>
</template>

<script>
import addBWmodel from './model/addBWmodel'
import addBlackWhite from './model/addBlackWhite'
import { DESCRIBE_ACCESS_CONTROL, DESCRIBE_HOSTS, DESCRIBEIP_HITITEMS } from '@/constants'
import { IP_STATUS_TYPE_ARR } from '../constants'
import moment from 'moment'
import { COMMON_ERROR } from '../constants'

export default {
  data() {
    return {
      ipSearch: "", //ip查询下拉
      ipSearchOptions: [],
      IP_STATUS_TYPE_ARR, //类型下拉选项
      tipShow: true, //提示文字
      resouseC: "", //来源
      typeCheck: "BOT", //类别
      iptIP: "", //输入IP
      arrowShow: true, //箭头显示
      flag: true,
      timeValue1: "", //创建时间
      timeOut: false, //有效截止日期
      timeValue2: "", //有效截止日期
      multipleSelection: [], //tableCheck
      allData: [{
        resourse: '自定义',
        ipAddress: '10.1.1.23',
        type: '黑名单',
        updata: '2019-12-25 13:52:03',
        stopTime: '2020-01-01 23:59:59',
        descrip: '123'
      }],//自定义数据
      tableDataBegin: [],//表格数据
      tableDataEnd: [],
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
      filterTableDataEnd: [],
      flag: false,//定义一个开关
      loadShow: false,//加载
      visible: false,//删除弹框
      addBWmodel: false,//添加黑白IP弹框
      ipTest: false, // ip输入格式是否正确
      disabledIp: false, // 如果有输入ip地址，则禁用别的按钮
      triggerStrategy: '', // 触发策略
      ipInfo: {}, // 保存编辑信息
      ctsFlag: false, // 更新时间升降序
      vtsFlag: false, // 有效时间时间升降序
      sort: 'valid_ts:1',
    };
  },
  components: {
    addBlackWhite
  },
  mounted() {
    // this.getData();
    this.getDescribeHost()
    this.onSearch()
  },
  methods: {
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
      this.onSearch()
    },
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    //点击查看详情
    isShowTop() {
      if (this.flag) {
        this.arrowShow = false;
        this.flag = true;
      } else {
        this.arrowShow = true;
        this.flag = false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取防护域名列表
    getDescribeHost() {
      let params = {
        Version: '2018-01-25',
      }

      this.axios.post(DESCRIBE_HOSTS, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.ipSearchOptions = data.Response.HostList
          this.ipSearch = this.ipSearchOptions[0].Domain
        }
      })
    },
    // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //添加黑白名单按钮
    addBW(flag, scope) {
      this.ipInfo = scope.row
      this.ipInfo.ActionType = flag
      this.addBWmodel = true;
    },

    // 快捷时间查询
    onTimeClick(temp) {
      const map = {
        hour: [moment().subtract(1, 'hour'), moment(new Date())],
        day: [moment().subtract(1, 'day'), moment(new Date())],
        week: [moment().subtract(7, 'day'), moment(new Date())]
      }

      this.timeValue1 = map[temp]
    },

    // 条件查询
    onSearch(sort) {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Count: 1,
        Limit: 20,
        Skip: 0,
        Ip: this.iptIP || undefined,
        CtsMin: this.timeValue1 ? moment(new Date(this.timeValue1[0])).format('x') : undefined, //创建最小时间戳
        CtsMax: this.timeValue1 ? moment(new Date(this.timeValue1[1])).format('x') : undefined,
        Category: this.typeCheck.toLowerCase(),
        Name: this.triggerStrategy || undefined,
        Sort: this.sort,
      }

      if (this.timeOut) {
        params.VtsMin = moment(new Date(this.timeValue2[0])).format('X') || undefined
        params.VtsMax = moment(new Date(this.timeValue2[1])).format('X') || undefined
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
          const data = (Data.Res || []).map(d => ({...d}))
          this.tableDataBegin = data
          this.totalItems = this.tableDataBegin.length;
          if (this.totalItems > this.pageSize) {
            for (let index = 0; index < this.pageSize; index++) {
              this.tableDataEnd.push(this.tableDataBegin[index]);
            }
          } else {
            this.tableDataEnd = this.tableDataBegin;
          }
          this.loadShow = false;
        })
        // this.tableDataBegin = this.allData;
        // 将数据的长度赋值给totalItems
        // this.totalItems = this.tableDataBegin.length;
        // if (this.totalItems > this.pageSize) {
        //   for (let index = 0; index < this.pageSize; index++) {
        //     this.tableDataEnd.push(this.tableDataBegin[index]);
        //   }
        // } else {
        //   this.tableDataEnd = this.tableDataBegin;
        // }
        // this.loadShow=false;
        // })
      })
    },

    //关闭
    closeModel(isShow) {
      this.addBWmodel = false;
      this.ipInfo = {}
      if (isShow === 'refresh') {
        this.onSearch()
      }
    },
  },
  watch: {
    iptIP(n) {
      let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
      this.ipTest = !pattern.test(n)
      if (n) {
        this.disabledIp = true
      } else {
        this.disabledIp = false
      }
    }
  },

  filters: {
    currentTimeFilter(time) {
      if (time) {
        const len = JSON.stringify(time).length
        let str = time
        if (len < 13) {
          str = str * 1000
        }
        return moment(new Date(str)).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }
};
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
      width: 320px;
      margin-right: 100px;
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
