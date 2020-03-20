<template>
  <div>
    <div class="topHeader">
      <span>IP{{t('黑白名单', 'WAF.hbmd')}}</span>
      <el-select
        v-model="ipSearch"
        @change="pageOffset === 0 ? getData() : pageOffset = 0"
      >
        <el-option
          key="all"
          label="ALL"
          value="global">
        </el-option>
        <el-option
          v-for="item in ipSearchOptions"
          :key="item.Domain"
          :label="item.Domain"
          :value="item.Domain">
        </el-option>
      </el-select>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p>{{t('在这里，您可以将一个或多个IP加入黑/白名单，实现精准的访问控制。需要注意的是：黑白名单的优先级仅低于WAF自定义放行策略，高于其他检测逻辑。', 'WAF.zzlnkyj')}}<p>
        <p>{{t('IP黑白名单优先级：全局白名单 > 域名白名单 > 域名黑名单 > 全局黑名单', 'WAF.iphbmdsx')}}</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="filterCon">
        <div>
          <span>{{t('类别', 'WAF.lb')}}：</span>
          <el-select class="select" v-model="typeCheck">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option :label="t('黑名单', 'WAF.hmd')" value="42"></el-option>
            <el-option :label="t('白名单', 'WAF.bmd')" value="40"></el-option>
          </el-select>
          <span>
            
          </span>
          <el-select class="select" v-model="resouseC">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option label="CC" value="cc"></el-option>
            <el-option label="BOT" value="bot"></el-option>
            <el-option :label="t('自定义', 'WAF.zdy')" value="custom"></el-option>
          </el-select>
          <el-input :placeholder="t('输入IP', 'WAF.srip')" class="iptIP" v-model="iptIP" :disabled="!arrowShow"></el-input>
          <span class="topFilter" @click="isShowTop">
            {{t('高级筛选', 'WAF.gjsx')}}
            <i v-if="arrowShow" class="el-icon-caret-bottom"></i>
            <i v-if="!arrowShow" class="el-icon-caret-top"></i>
          </span>
        </div>
        <div v-if="!arrowShow" class="timeCon newClear">
          <span class="floatLeft">{{t('创建时间', 'WAF.cjsj')}}：</span>
          <el-button-group class="floatLeft">
            <el-button size="mini" :type="createTimeType === 'hour' ? 'primary' : ''" @click="onTimeClick('hour')">最近1小时</el-button>
            <el-button size="mini" :type="createTimeType === 'day' ? 'primary' : ''" @click="onTimeClick('day')">最近1天</el-button>
            <el-button size="mini" :type="createTimeType === 'week' ? 'primary' : ''" @click="onTimeClick('week')">最近7天</el-button>
          </el-button-group>
          <el-date-picker
            size="mini"
            class="floatLeft timePick"
            style="border-left: none;"
            v-model="timeValue1"
            type="datetimerange"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')"
          ></el-date-picker>
          <el-checkbox class="floatLeft checkBo" v-model="timeOut" label="有效截止日期" name="time"></el-checkbox>
          <el-date-picker
            size="mini"
            class="floatLeft timePick"
            v-model="timeValue2"
            type="datetimerange"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')"
          ></el-date-picker>
        </div>
        <div>
          <el-button @click="pageOffset === 0 ? getData() : pageOffset = 0" size="mini" type="primary" class="lookSearch">{{t('查询', 'WAF.js')}}</el-button>
        </div>
      </div>
      <div class="tableList">
        <div class="tableListBtn newClear">
          <el-button type="primary" class="addBW" size="mini" @click="addBW">{{t('添加黑白名单', 'WAF.tjhbmd')}}</el-button>
          <el-button 
            :disabled="multipleSelection.length === 0"
            class="allDelete" 
            @click="dialogVisible=true"  
            size="mini"
            >
              批量删除
            </el-button>
          <el-button size="mini" type="primary" @click="batchImportVisible=true">{{t('导入数据', 'WAF.drsj')}}</el-button>
          <el-button class="exportFilter" type="primary" :disabled="tableDataBegin.length === 0" @click="exportFile" size="mini">{{t('导出全部筛选结果', 'WAF.dcqbsxjg')}}</el-button>
        </div>
        <el-card>
          <el-table
            ref="multipleTable"
            :data="tableDataBegin"
            tooltip-effect="dark"
            style="width: 100%" 
            v-loading="loadShow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column width="80px" prop="num" :label="t('序号', 'WAF.xh')">
              <template slot-scope="scope">{{ scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="Source" :label="t('来源', 'WAF.ly')">
              <template slot-scope="scope">
                {{ scope.row.Source | sourceFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="Ip" label="IP地址"></el-table-column>
            <el-table-column prop="ActionType" :label="t('类别', 'WAF.lb')">
              <template slot-scope="scope">
                {{scope.row.ActionType | ActionTypeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="TsVersion">
              <el-button type="text" slot="header" style="padding: 0; cursor: pointer;color: #444;" @click="setSort('ts_version')">
                {{t('更新时间', 'WAF.gxsj')}}
                <i class="el-icon-caret-top" v-if="sort === 'ts_version:1'"></i>
                <i class="el-icon-caret-bottom" v-if="sort === 'ts_version:-1'"></i>
                <i class="el-icon-d-caret" v-if="sort.includes('valid_ts')"></i>
              </el-button>
              <template slot-scope="scope">
                {{scope.row.TsVersion | currentTimeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="ValidTs">
              <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('valid_ts')">
                {{t('截止时间', 'WAF.jzsj')}}
                <i class="el-icon-caret-top" v-if="sort === 'valid_ts:1'"></i>
                <i class="el-icon-caret-bottom" v-if="sort === 'valid_ts:-1'"></i>
                <i class="el-icon-d-caret" v-if="sort.includes('ts_version')"></i>
              </el-button>
              <template slot-scope="scope">
                {{scope.row.ValidTs | currentTimeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="Note" :label="t('备注', 'WAF.bz')">
              <template slot-scope="scope">
                {{scope.row.Note || t('无', 'WAF.w')}}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <el-button @click="onEdit(scope)" type="text" size="mini">{{t('编辑', 'WAF.bj')}}</el-button>
                <el-button @click="onAction(scope)" type="text" size="mini">{{scope.row.ActionType | actionButtonFilter}}</el-button>
                <el-popover
                  placement="bottom"
                  width="220"
                  v-model="scope.row.delDialog"
                  >
                  <div class="deleteCon" style="text-align:center;">
                    <h1 style="font-size:14px;font-weight: 600;margin-bottom:16px;">{{t('确认删除该记录', 'WAF.qrscgjlm')}}？</h1>
                    <p style="font-size:12px;color:#333;margin-bottom:16px;">删除IP：{{scope.row.Ip}}</p>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button type="text" size="mini" @click="onDeleteRow(scope.row)">删除</el-button>
                    <el-button size="mini" style="color: black" type="text" @click="scope.row.delDialog=false">取消</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="text" style="margin-left:10px;">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="pageShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageLimit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </el-card>
      </div>
    </div>
    <el-dialog
      :title="`${ipInfo.bj ? t('编辑', 'WAF.bj') : '添加'}黑白IP`"
      :visible.sync="addBWmodel"
      width="45%"
      destroy-on-close
      @close="ipInfo={}"
    >
      <addBlackWhite @success="closeHBDialog" :isShow.sync="addBWmodel" :ipInfo="ipInfo"/>
    </el-dialog>
    <el-dialog
      title="删除IP"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <i class="el-icon-warning" style="width: 30px"/><span>{{t('确定要删除选中的IP么', 'WAF.qrscxz')}}？</span>
      <el-row slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onDeleteRow(multipleSelection)">{{t('确定', 'WAF.qd')}}</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="batchImportVisible"
      title="导入IP名单"
      width="550px"
      destroy-on-close
    >
      <batchImport :on-success="onSuccess" :domain="ipSearch" />
    </el-dialog>
    <el-dialog
      :visible.sync="batchExportVisible"
      title="导出记录"
      width="550px"
      destroy-on-close
    >
      <batchExport :visible.sync="batchExportVisible" :count="totalItems" :param="exportParam" />
    </el-dialog>
  </div>
</template>

<script>
import addBlackWhite from './model/addBlackWhite'
import moment from 'moment'
import { COMMON_ERROR } from '../constants'
import batchImport from './model/batchImport'
import batchExport from './model/batchExport'

import { 
  DESCRIBE_ACCESS_CONTROL, 
  DESCRIBE_HOSTS, 
  UPSERTIP_ACCESS_CONTROL ,
  DELETEIP_ACCESS_CONTROL
  } from '@/constants'

export default {
  data() {
    return {
      createTimeType: 'hour',
      ipSearch: "global", //ip查询下拉
      ipSearchOptions: [],
      tipShow: true, //提示文字
      resouseC: undefined, //来源
      typeCheck: undefined, //类别
      iptIP: "", //输入IP
      arrowShow: true, //箭头显示
      flag: true,
      timeValue1: [moment().subtract(1, 'hour'), moment().endOf('d')], //创建时间
      timeOut: false, //有效截止日期
      timeValue2: [moment().subtract(1, 'hour'), moment().add('8', 'd')], //有效截止日期
      multipleSelection: [], //tableCheck
      tableDataBegin: [],//表格数据
      tableDataEnd: [],
      currentPage: 1,//当前页
      totalItems: 0,//总长度
      filterTableDataEnd: [],
      loadShow:false,//加载
      visible: false,//删除弹框
      addBWmodel:false,//添加黑白IP弹框
      data: [],
      ipInfo: {}, // 保存编辑信息
      dialogVisible: false, // 批量删除弹窗
      pageLimit: 10,  // 分页限制
      pageOffset: 0,  // 分页偏移量
      pageShow: true,  // 切换分页显示
      ctsFlag: false, // 更新时间升降序
      vtsFlag: false, // 有效时间时间升降序
      sort: 'ts_version:-1',
      batchImportVisible: false,
      batchExportVisible: false,
      exportParam: undefined
    };
  },
  components:{
    addBlackWhite,
    batchImport,
    batchExport
  },
  mounted() {
    this.getDescribeHost()
    this.getData();
  },

  watch: {
    pageOffset(n, o) {
      if(n === 0) {
        this.currentPage = 1
      }
      this.getData()
    },

    pageLimit() {
      this.getData()
    }
  },

  methods: {
    onSuccess() {
      this.batchImportVisible = false
      this.getData()
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
      this.getData()
    },
    exportFile() {
      const params = {
        Version: '2018-01-25',
        Domain: 'global',
        Count: 1,
        Sort: this.sort,
        ActionType: this.typeCheck,
        Source: this.resouseC || undefined,
        Ip: this.iptIP || undefined,
      }
      if (!this.arrowShow) { // 高级筛选
        params.CtsMin = moment(this.timeValue1[0]).format('x')
        params.CtsMax = moment(this.timeValue1[1]).format('x')
        if (this.timeOut) { // 勾选了有效截止时
          params.VtsMin = moment(this.timeValue2[0]).format('X')
          params.VtsMax = moment(this.timeValue2[1]).format('X')
        }
      }
      this.exportParam = params
      this.batchExportVisible = true
		},
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    //点击查看详情
    isShowTop() {
      if (this.flag) {
        this.arrowShow = false;
        this.flag = false;
        this.iptIP = ''
      } else {
        this.arrowShow = true;
        this.flag = true;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取数据
    getData() {
      this.loadShow = true
      const params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Count: 1,
        Limit: this.pageLimit,
        OffSet: this.pageOffset,
        Sort: this.sort,
        ActionType: this.typeCheck,
        Source: this.resouseC || undefined,
        Ip: this.iptIP || undefined,
      }
      if (!this.arrowShow) { // 高级筛选
        params.CtsMin = moment(this.timeValue1[0]).format('x')
        params.CtsMax = moment(this.timeValue1[1]).format('x')
        if (this.timeOut) { // 勾选了有效截止时
          params.VtsMin = moment(this.timeValue2[0]).format('X')
          params.VtsMax = moment(this.timeValue2[1]).format('X')
        }
      }
      this.axios.post(DESCRIBE_ACCESS_CONTROL, params)
      .then(resp => {
        this.generalRespHandler(resp, ({Data}) => {
          const data = (Data.Res || []).map(d => ({...d}))
          this.tableDataBegin = data
          this.tableDataBegin.forEach(item => {
            this.$set(item, 'delDialog', false)
          })
          this.totalItems = Data.TotalCount;
        })
      }).then(() => {
        this.loadShow = false
      })
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageLimit = val
      this.pageOffset = 0

    },
    handleCurrentChange(val) {
      this.pageOffset = (val - 1) * this.pageLimit
    }, 

    //添加黑白名单按钮
    addBW(){
      this.ipInfo = {
        Domain: this.ipSearch,
        datatime: moment().add(7, 'd'),
        timeValue: moment().add(7, 'd').format('YYYY-MM-DD 23:59:59')
      }
      this.addBWmodel=true;
    },

    // 获取防护域名列表
    getDescribeHost() {
      let params = {
        Version: '2018-01-25',
      }
      this.axios.post(DESCRIBE_HOSTS, params)
      .then(resp => {
        this.generalRespHandler(resp, ({ HostList }) => {
          this.ipSearchOptions = HostList
        })
      })
    },

    //关闭
    closeHBDialog(isShow){
      this.addBWmodel = false ;
      this.ipInfo = {}
      this.getData()
    },

    // 快捷时间查询
    onTimeClick(temp) {
      this.createTimeType = temp
      const map = {
        hour: [moment().subtract(1, 'hour'), moment(new Date())],
        day: [moment().subtract(1, 'day'), moment(new Date())],
        week: [moment().subtract(7, 'day'), moment(new Date())]
      }

      this.timeValue1 = map[temp]
    },

    // 编辑
    onEdit({ row }) {
      this.ipInfo = {
        Domain: this.ipSearch,
        ipAddress: row.Ip,
        blackWhiteCh: row.ActionType,
        des: row.Note,
        datatime: moment(row.ValidTs * 1000).format('YYYY-MM-DD HH:mm:ss'),
        timeValue: moment(row.ValidTs * 1000).format('YYYY-MM-DD HH:mm:ss'),
        type: 'ipList',
        bj: true,
      }
      this.addBWmodel = true
    },

    // 加黑或者加白
    onAction(info) {
      this.axios.post(UPSERTIP_ACCESS_CONTROL, ({
        Version: '2018-01-25',
        Domain: this.ipSearch,
        'Items.0': JSON.stringify({
          ip: info.row.Ip,
          action: info.row.ActionType === 40 ? 42 : 40, // 除了黑名单加白 其他都加黑
          source: info.row.Source,
          valid_ts: info.row.ValidTs
        }),
        Edition: 'clb-waf'
      }))
      .then(resp => {
        this.generalRespHandler(resp, this.getData, COMMON_ERROR, '操作成功')
      })
    },
    // 删除表单
    onDeleteRow(row) {
      const itemArr = [].concat(row)
      const flatItem = itemArr.reduce((prev, next, index) => {
        return Object.assign(prev, {
          [`Items.${index}`]: next.Ip
        })
      }, {})
      this.axios.post(DELETEIP_ACCESS_CONTROL, {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        ...flatItem
      }).then(resp => {
        this.dialogVisible = false
        this.generalRespHandler(resp, this.getData, COMMON_ERROR, '删除成功')
      })
    },
  },

  filters: {
    currentTimeFilter(time) {
      const len = JSON.stringify(time).length
      let str = time
      if (len < 13) {
       str = str * 1000
      }
      return moment(new Date(str)).format("YYYY-MM-DD HH:mm:ss");
    },

    ActionTypeFilter(action) {
      switch (action) {
        case 40:
          return '白名單'
          break;
        case 42:
          return '黑名單'
        default: return '未知'
          break;
      }
    },

    actionButtonFilter(action) {
      const map = {
        42: '加白'
      }
      return map[action] || '加黑'
    },

    sourceFilter(text) {
      const map = {
        bot: 'BOT',
        cc: 'CC',
        custom: '自定義'
      }
      return map[text] || '未知'
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
      top: 20px;
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
      cursor: pointer;
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
      width: 340px;
      margin-right: 100px;
      ::v-deep .el-range-separator {
        width: 7%;
      }
    }
    .checkBo {
      margin-right: 10px;
    }
  }
  .tableList {
    .tableListBtn {
      margin-bottom: 12px;
      .addBW {
        color: #fff;
      }
      .exportFilter {
        color: #fff;
        float: right;
      }
    }
    .tableCon {
      min-height: 450px;
      background-color: #fff;
    }
  }
  .tabListPage{
    height:50px;
    border-top:1px solid #ddd;
    padding-top:8px;
    text-align:right;
    background-color:#fff;
  }
}
.import-btn {
  display: inline-block;
  margin-left: 10px;
}
::v-deep .el-input__inner {
  border-radius: 0;
}
</style>
