<template>
  <div>
    <div class="topHeader">
      <i class="el-icon-back" data-reactid=".1a.0.0.0" />
      <span style="margin-left: 20px">BOT 策略设置</span>
      <el-select
        v-model="ipSearch"
        filterable
        allow-create
        default-first-option
        placeholder="请选择文章标签">
        <el-option
          v-for="item in ipSearchOptions"
          :key="item.Domain"
          :label="item.Domain"
          :value="item.Domain">
        </el-option>
      </el-select>
      <el-tabs :value="routerTips">
        <el-tab-pane name="public"><p @click="goRouter('public')" slot="label">公共类型</p></el-tab-pane>
        <el-tab-pane name="diy"><p @click="goRouter('diy')" slot="label">自定义会话策略</p></el-tab-pane>
      </el-tabs>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <!-- <el-row type="flex" justify="end">
          <el-input style="width: 180px;" placeholder="请输入域名">
             <i slot="suffix" style="display: flex; justify-content: center; align-items: center; cursor: pointer" class="el-input__icon el-icon-search" />
          </el-input>
      </el-row> -->
      <!-- <div class="tableList">
        <div class="tableCon">
          <el-table
            ref="multipleTable"
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            tooltip-effect="dark"
            style="width: 100%" v-loading="loadShow"
          >
            <el-table-column prop="num" label="序号" width="70%">
              <template slot-scope="scope">{{ scope.$index+1 }}</template>
            </el-table-column>
            <el-table-column prop="host" label="域名">
              <div slot="header" @click="togleHost" style="cursor: pointer">
                域名
                <i v-if="hostFlag" class="el-icon-caret-top" />
                <i v-if="!hostFlag" class="el-icon-caret-bottom" />
              </div>
            </el-table-column>
            <el-table-column class="bot-wrapper" prop="bot" label="BOT流量分析开关">
              <div slot="header">
                <el-dropdown trigger="click" style="line-height: 0">
                  <span class="el-dropdown-link" style="font-size: 12px;">
                    BOT流量分析开关<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>全部</el-dropdown-item>
                    <el-dropdown-item>开启</el-dropdown-item>
                    <el-dropdown-item>关闭</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div slot-scope="scope">
                <el-switch
                  v-model="scope.row.bot > 0"
                  active-color="#13ce66"
                  :change="togleSwitch(scope.row)"
                  >
                </el-switch>
              </div>
            </el-table-column>
            <el-table-column prop="waf" label="WAF开关">
              <div slot="header">
                WAF开关
                <el-tooltip placement="right-end" effect="light" class="mode-tooltip">
                  <i class="el-icon-info"></i>
                  <span slot="content">WAF开关状态，可前往【Web应用防火墙-防护设置】域名列表页面进行设置。</span>
                </el-tooltip>
              </div>
              <div slot-scope="scope">
                <span style="color: #13ce66">{{scope.row.waf > 0 ? '开启' : '关闭'}}</span>
              </div>
            </el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                 <a style="cursor: pointer">防护设置</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div> -->
      <DiyType v-if="routerTips === 'diy'" />
      <PublicType v-if="routerTips === 'public'" />
    </div>
  </div>
</template>

<script>
import { DESCRIBE_ACCESS_CONTROL, DESCRIBE_HOSTS } from '@/constants'
import DiyType from './diyType'
import PublicType from './publicType'

export default {
  data() {
    return {
      tipShow: true, //提示文字
      flag: true,
      ipSearch:'',//ip查询下拉
      ipSearchOptions:[],
      routerTips: 'diy', // 保存tabs选项数据 diy为自定义策略
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
    };
  },
  components:{
    DiyType,
    PublicType
  },
  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
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
        this.ipSearchOptions = data.Response.HostList
        console.log(data);
      })
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
    // 点击bot流量分析开关switch
    togleSwitch(e) {
      console.log(e);
    },
    // 绑定tabs选项菜单
    getTabs() {
      this.routerTips = this.$route.meta.tips
    },
    // 路由跳转
    goRouter(router) {
      const host = this.$route.path.split('/').reverse()[0]
      this.routerTips = router
      this.$router.push(`/botSetting/${router}/${host}`)
    }
  },
  mounted() {
    this.getDescribeHost(),
    this.getData();
    this.getTabs()
    // console.log(this.$route);
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
  // height: 50px;
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
