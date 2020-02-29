<template>
  <div>
    <div class="topHeader">
      <span>BOT 防护设置</span>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <el-row style="margin-bottom: 10px" type="flex" justify="end">
          <el-input v-model="iptDomain" style="width: 180px;" placeholder="请输入域名">
             <i slot="suffix" @click="getDescribeHost" style="display: flex; justify-content: center; align-items: center; cursor: pointer" class="el-input__icon el-icon-search" />
          </el-input>
      </el-row>
      <el-card>
          <el-table
            ref="multipleTable"
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            tooltip-effect="dark"
            style="width: 100%" v-loading="loadShow"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="num" label="序号" width="70%">
              <template slot-scope="scope">{{ scope.$index+1 }}</template>
            </el-table-column>
            <el-table-column prop="Domain" label="域名">
              <div slot="header" @click="togleHost" style="cursor: pointer">
                域名
                <i v-if="hostFlag" class="el-icon-caret-top" />
                <i v-if="!hostFlag" class="el-icon-caret-bottom" />
              </div>
            </el-table-column>
            <el-table-column class="bot-wrapper" prop="Status" label="BOT流量分析开关">
              <div slot="header">
                <el-dropdown trigger="click" style="line-height: 0">
                  <span class="el-dropdown-link" style="font-size: 12px;">
                    BOT流量分析开关<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu @click="getDescribeHost" slot="dropdown">
                    <el-dropdown-item><span @click="onBotSearch(undefined)">全部</span></el-dropdown-item>
                    <el-dropdown-item><span @click="onBotSearch('on')">开启</span></el-dropdown-item>
                    <el-dropdown-item><span @click="onBotSearch('off')">关闭</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div slot-scope="scope">
                <el-switch
                  v-model="scope.row.botStatus > 0"
                  active-color="#13ce66"
                  :change="upDateBotStatus(scope.row)"
                  >
                </el-switch>
                <!-- <span>{{scope.row.bot}}</span> -->
              </div>
            </el-table-column>
            <el-table-column label="WAF开关">
              <div slot="header">
                WAF开关
                <el-tooltip placement="right-end" effect="light" class="mode-tooltip">
                  <i class="el-icon-info"></i>
                  <span slot="content">WAF开关状态，可前往【Web应用防火墙-防护设置】域名列表页面进行设置。</span>
                </el-tooltip>
              </div>
              <div slot-scope="scope">
                <span :style="`color: ${scope.row.Status > 0 ? '#13ce66' : '#e1504a'}`">{{scope.row.Status > 0 ? '开启' : '关闭'}}</span>
              </div>
            </el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                 <a style="cursor: pointer" @click="$router.push(`${$route.path}/diy/${scope.row.Domain}`)">防护设置</a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
      </el-card>
        <!-- <div class="tabListPage"> -->
        <!-- </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { DESCRIBE_ACCESS_CONTROL, DESCRIBE_HOSTS, DESCRIBE_BOT_STATUS, MODIFY_BOT_STATUS } from '@/constants'
import { COMMON_ERROR } from '../constants'

export default {
  data() {
    return {
      tipShow: true, //提示文字
      flag: true,
      tableDataBegin: [{
        host: 'tfc.dhycloud.com',
        bot: 1,
        waf: 2
      }],//表格数据
      tableDataEnd: [],
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
      filterTableDataEnd: [],
      flag: false,//定义一个开关
      loadShow:false,//加载
      visible: false,//删除弹框
      hostFlag: true, // 域名状态 true为向上箭头 false反之
      iptDomain: '' // 域名搜索输入
    };
  },
  components:{
  },
  mounted() {
    this.getData();
    this.getDescribeHost()
  },
  methods: {
    onclick() {
      console.log(this.$route);
    },
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取数据
    getData() {
      this.loadShow=true;
      let params = {
        Version: '2018-01-25',
        Domain: 'tfc.dhycloud.com',
        Count: 10
      }
      this.axios.post(DESCRIBE_ACCESS_CONTROL, params).then(data => {
        this.loadShow = false;
        console.log(data)
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
    // 点击域名状态更新表格
    togleHost() {
      this.hostFlag = !this.hostFlag
    },
    // 获取防护域名列表
    getDescribeHost() {
      let params = {
        Version: '2018-01-25',
        Search: this.iptDomain,
        // 'Item.FlowMode': 0,
      } 
      this.loadShow=true;
      this.axios.post(DESCRIBE_HOSTS, params).then(data => {
        this.loadShow=false;
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.tableDataBegin = data.Response.HostList
          this.getBotStatus()
        }
      })
    },

    // 查询bot开关
    getBotStatus() {
      let params = {
        Version: '2018-01-25',
        Category: 'bot'
      }
      this.axios.post(DESCRIBE_BOT_STATUS, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          const botArr = data.Response.Data.Res
          this.tableDataBegin.forEach(item => {
           let temp = botArr.find(_item => _item.Domain === item.Domain)
           this.$set(item, 'botStatus', temp.Status)
          })
          localStorage.setItem('tableList', JSON.stringify(this.tableDataBegin))
        }
      })
    },

    // bot开关筛选
    onBotSearch(term) {
      const map = {
        'on': 1,
        'off': 0,
      }
      const arr = JSON.parse(localStorage.getItem('tableList'))
      if (term) {
        this.tableDataBegin = arr.filter(item => item.botStatus === map[term])
        return
      }
       this.tableDataBegin = arr
    },

    // bot开关更新
    upDateBotStatus(row) {
      let params = {
        Version: '2018-01-25',
        Domain: row.Domain,
        Category: 'bot',
        Status: row.botStatus === 0 ? 1 : 0
      }
      console.log(row, 'row')
      return
      this.axios.post(MODIFY_BOT_STATUS, params).then(res => {
        this.generalRespHandler(res, this.getDescribeHost(), COMMON_ERROR, '切换 开关 成功')
      })
    }
  },
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
      margin-left: 10px;
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
      background-color: #006eff;
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
    margin-top: 20px;
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
  .tabListPage{
    height:50px;
    border-top:1px solid #ddd;
    padding-top:8px;
    text-align:right;
    background-color:#fff;
  }
  .bot-wrapper {
    background-color: red !important;
    ::v-deep .cell {
      height: 23px;
    }
  }
  ::v-deep .el-table_1_column_4{
    .cell {
      height: 23px;
    }
  }
  ::v-deep .el-table {
    th {
      line-height: 23px;
      .cell {
        height: 23px;
        line-height: 23px;
        // background-color: red;
        & > div {
          line-height: 23px;
          padding: 0;
        }
      }
    }
  }
}
</style>
