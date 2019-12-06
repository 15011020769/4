<template>
  <div id="ipConfigFourth">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">高防IP专业版</h3>
        <el-select v-model="listResouse" class="selectListResou">
          <el-option label="资源列表" value="resourceList"></el-option>
          <el-option label="业务列表" value="value2"></el-option>
        </el-select>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear">
          <div class="addBgColor"> 
            <el-checkbox-group v-model="comingSoon" class="checkOne">
              <el-checkbox label="即将过期" name="comingSoon"></el-checkbox>
            </el-checkbox-group>
            <span class="runningStatusText">运行状态:</span>
            <el-checkbox-group v-model="runningStatus"  class="checkTwo">
              <el-checkbox label="运行中" name="type"></el-checkbox>
              <el-checkbox label="清洗中" name="type"></el-checkbox>
              <el-checkbox label="封堵中" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
          <span v-if="listResouse=='resourceList'?true:false">
            <el-input v-model="tableDataName" class="searchs" placeholder="输入ID/名称/IP搜索"></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
          <span v-if="listResouse!='resourceList'?true:false">
            <el-input v-model="tableDataName1" class="searchs" placeholder="输入域名/CNAME搜索"></el-input>
            <el-button class="el-icon-search" @click="doFilter1"></el-button>
          </span>
        </div>
        <div class="mainContent newClear">
          <div class="mainTable">
            <!-- 业务列表 -->
            <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-if="listResouse=='resourceList'?false:true">
              <el-table-column prop="canmeId" label="CNAME/ID">
                <template slot-scope="scope">
                  <span>4fsf4sers.daymsf.com</span><br/>
                  <a href="#" @click="toDoDetailYewu(scope.row)">{{scope.row.canmeId}}</a><br/>
                </template>
              </el-table-column>
              <el-table-column prop="domain" label="域名">
                 <template slot-scope="scope">
                   {{scope.row.domain}}<a href="#" @click="toAccest(scope.row)">设置</a>
                </template>
              </el-table-column>
              <el-table-column prop="nowIp" label="当前IP"></el-table-column>
              <el-table-column prop="backSelf" label="自动回切">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.autoBack"
                    active-color="#006eff"
                    inactive-color="#999">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="180">
                <template slot-scope="scope">
                  <a class="marginRightA" href="#" style="pointer-events:none;color:#999;">一键回切</a>
                  <a class="marginRightA" href="#" @clcik="lookReportList(scope.row)">查看报表</a>
                </template>
              </el-table-column>
            </el-table>
            <!-- 资源列表 -->
            <el-table :data="tableDataBegin1.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-if="listResouse!='resourceList'?false:true">
              <el-table-column prop="idOrName" label="ID/名称">
                <template slot-scope="scope">
                  <a href="#" @click="toDoDetailResouse(scope.row)">{{scope.row.idOrName}}</a><br/>
                  <span>未命名</span>
                </template>
              </el-table-column>
              <el-table-column prop="rulesNum" label="转发规则数(个)">
                <template slot-scope="scope">
                  <span>0<a href="#" @click="toAccest(scope.row)">设置</a></span>
                </template>
              </el-table-column>
              <el-table-column prop="IpNume" label="防护IP数(个)"></el-table-column>
              <el-table-column prop="origin" label="初始区域"></el-table-column>
              <el-table-column prop="status" label="状态"></el-table-column>
              <el-table-column prop="dataTime" label="到期时间"></el-table-column>
              <el-table-column prop="action" label="操作" width="230">
                <template slot-scope="scope">
                  <a class="marginRightA" href="#" @click="upgradeModel">升级</a>
                  <a class="marginRightA" href="#" @click="RenewModel">续费</a>
                  <a class="marginRightA" href="#" @click="configModel">防护配置</a>
                  <a class="marginRightA" href="#" @clcik="lookReportList(scope.row)">查看报表</a>
                </template>
              </el-table-column>
            </el-table>
            <!-- 资源列表详情弹框 -->
            <resouseListModel :isShow="dialogResouseList"  @closeListDetail="closeListDetail"/>
            <!-- 升级弹框 -->
            <upgradeModel :Upgrade="diaologUpgradeModel" @closeUpgradeModel="closeUpgradeModel"/>
            <!-- 续费弹框 -->
            <RenewModel :RenewShow="doalogRenewModel" @closeRenewModel="closeRenewModel"/>
            <!-- 防护配置弹框 -->
            <ProtectConfigModel :configShow="dialogConfigModel" @closeConfigModel="closeConfigModel"/>
            <!-- 业务列表详情弹框 -->
            <yewuListModel :isShow="dialogYewuModel" @closeListDetailYw="closeListDetailYw"/>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { RESOURCE_LIST, DDOSPOLICY_CONT, RULESETS_CONT } from "@/constants";
import resouseListModel from './model/resouseListModel'
import upgradeModel from './model/upgradeModel'
import RenewModel from './model/RenewModel'
import ProtectConfigModel from './model/ProtectConfigModel'
import yewuListModel from './model/yewuListModel'

export default {
  data() {
    return {
      activeName: "first",
      tableDataBegin: [],//业务列表table
      tableDataBegin1:[],//资源列表table
      tableDataName: "",//资源列表搜索框
      tableDataEnd: [],
      ResourceList:[],
      DDosPolicyList:[],//定义DDoS高级策略接口返回的数据。
      RuleSetsa:[],//获取资源的规则数接口
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      filterConrent: "",
      allData: [//业务列表假数据
        {
          canmeId: "1",
          domain: "https",
          nowIp: "10.1.1.212",
          autoBack: false
        },{
          canmeId: '2',
          domain: 'https2',
          nowIp: '1.1.1.2',
          autoBack:true
        }
      ],
      allData1:[
        {
          idOrName:'1231213',
          rulesNum:'1',
          IpNume:'456',
          origin:'中国台湾',
          status:'回收中',
          dataTime:'已到期'
        }
      ],//资源列表假数据
      listResouse: 'resourceList',//业务列表Or资源列表
      runningStatus: [],//运行状态绑定
      comingSoon: false,//是否即将过期
      tableDataName1:'',//业务列表搜索框
      dialogResouseList:false,//资产列表详情弹框
      diaologUpgradeModel:false,//升级弹框
      doalogRenewModel:false,//续费弹框
      dialogConfigModel:false,//防护配置弹框
      // autoBack:false,//是否自动回切开关
      dialogYewuModel:false,//业务列表详情弹框
      resouseOrYw:'',//判断是哪个列表
    };
  },
  components:{
    resouseListModel:resouseListModel,
    upgradeModel:upgradeModel,
    RenewModel:RenewModel,
    ProtectConfigModel,
    yewuListModel:yewuListModel
  },
  watch: {
    'listResouse': function () {
      if (this.listResouse == 'resourceList') {
        this.getData1()//资源列表
      } else if (this.listResouse != '') {
        this.getData()//业务列表
      }
    }
  },
 created() {
    this.describeResourceList()//获取资源列表接口
    //this.describeDDoSPolicy()//获取DDoS高级策略接口
    this.describeRuleSets()//获取资源的规则数接口
  },
  mounted() {
      this.getData1();
  },
  methods: {
    //获取DDoS高级策略接口
    describeDDoSPolicy(){
      let params = {
        Version: '2018-07-09',
        Business:'net',
      }
      this.axios.post(DDOSPOLICY_CONT, params).then(res => {
        //console.log(params)
        console.log(res)
        this.DDosPolicyList = res.Response.DDosPolicyList
         console.log(this.DDosPolicyList);
      })

    },
    //获取资源的规则数接口
    describeRuleSets(){
      let params = {
        Version: '2018-07-09',
        Business:'net',
        "IdList.0":"net-0000006y",
      }
      this.axios.post(RULESETS_CONT, params).then(res => {
        console.log(params)
        console.log(res)
        // this.RuleSetsa = res.Response.
        // this.totalItems = this.RuleSetsa.length;
        // if (this.totalItems > this.pageSize) {
        //   for (let index = 0; index < this.pageSize; index++) {
        //     this.tableDataEnd.push(this.RuleSetsa[index]);
        //   }
        // } else {
        //   this.tableDataEnd = this.RuleSetsa;
        // }
      })

    },
    //获取资源列表接口
    describeResourceList(){
      let params = {
        Version: '2018-07-09',
        Business:'net',
      }
      this.axios.post(RESOURCE_LIST, params).then(res => {
        console.log(params)
        console.log(res)
         this.ResourceList = res.Response
        //  this.totalItems = this.ResourceList.length;
        //  if (this.totalItems > this.pageSize) {
        //    for (let index = 0; index < this.pageSize; index++) {
        //      this.tableDataEnd.push(this.ResourceList[index]);
        //    }
        //  } else {
        //    this.tableDataEnd = this.ResourceList;
        //  }
      })

    },

    handleClick() {},
    getData() { //默认查询 业务列表
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        Version: '2018-07-09',
        // Region: '',
        Business: 'net'
      };
      this.$axios.post('dayu2/DescribeResourceList', params).then(res => {
        console.log(params)
        console.log(res)
        // this.tableDataBegin = res.Response.ServicePacks;
        this.tableDataBegin = this.allData
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      });
    },
    //默认查询 资源列表
    getData1() { 
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        Version: '2018-07-09',
        // Region: '',
        Business: 'net'
      };
      //this.$axios.post('dayu2/DescribeResourceList', params).then(res => {
        //console.log(params)
        //console.log(res)
        // this.tableDataBegin = res.Response.ServicePacks;
        this.tableDataBegin1 = this.allData1
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin1.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin1[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin1;
        }
      // });
    },
    // 业务列表搜索
    doFilter() {
      // console.log(this.filterConrent);
      // console.log(this.runningStatus) // 运行状态
      // console.log(this.comingSoon)  // 即将过期
      // console.log(this.tableDataName) // 搜索的输入
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.canmeId == this.tableDataName) {
          this.filterTableDataEnd.push(val);
          this.tableDataBegin = this.filterTableDataEnd;
        } else {
          this.filterTableDataEnd.push();
          this.tableDataBegin = this.filterTableDataEnd;
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // 业务列表搜索
    doFilter1() {
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.canmeId == this.tableDataName1) {
          this.filterTableDataEnd.push(val);
          this.tableDataBegin1 = this.filterTableDataEnd;
        } else {
          this.filterTableDataEnd.push();
          this.tableDataBegin1 = this.filterTableDataEnd;
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
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
    //跳转新购页面
    newBuy(){
      this.$router.push({
        path: '/choose'
      })
    },
    //资产列表详情
    toDoDetailResouse(rowList){
      this.dialogResouseList=true;
      this.resouseOrYw=this.listResouse;
      console.log(this.resouseOrYw)
    },
    //关闭资源列表详情
    closeListDetail(DetailShow){
      this.dialogResouseList=DetailShow
    },
    //转发规则个数设置按钮
    toAccest(){
      this.$router.push({
        path: '/AccessConfig'
      })
    },
    //升级按钮
    upgradeModel(){
      this.diaologUpgradeModel=true;
    },
    //升级弹框关闭按钮
    closeUpgradeModel(isShow){
      this.diaologUpgradeModel=isShow
    },
    //续费弹框
    RenewModel(){
      this.doalogRenewModel=true;
    },
    //续费弹框关闭按钮
    closeRenewModel(isShow){
      this.doalogRenewModel=isShow
    },
    //防护配置点击按钮
    configModel(){
      this.dialogConfigModel=true;
    },
    //防护配置弹框关闭按钮
    closeConfigModel(isShow){
      this.dialogConfigModel=isShow;
    },
    //查看报表跳转页面
    lookReportList(){
      this.$router.push({
        path: '/IpProfessional'
      })
    },
    //业务列表详情
    toDoDetailYewu(rowList){
      this.dialogYewuModel=true;
    },
    //关闭业务列表详情
    closeListDetailYw(DetailShow){
      this.dialogYewuModel=DetailShow
    },
  }
};
</script>
<style lang="scss">
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
#ipConfigFourth {
  .allContent {
    width: 100%;
    // padding: 12px 20px 0;
    .mainContentCenter{
      width:100%;
      padding:0 20px 20px;
    }
    .ReportTit{
      width: 100%;
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      line-height: 50px;
      margin-bottom: 20px;
      .ReportTitH3{
        float:left;
        font-size:16px;
        font-weight:600;
        margin-right:20px;
      }
      .ReportTitBtn{
        float:right;
        height:30px;
        line-height: 30px;
        padding:0;
        margin-top:8px;
        width:52px;
        border-radius: 0;
        text-align:center;
        background-color:#006eff;
      }
    }
    .textAlignTop{
      width:655px;
      float:right;
      text-align:right;
      .checkOne{
        float:left;
      }
      .checkTwo{
        float:left;
      }
      span.runningStatusText{
        float:left;
        margin-right:10px;
        margin-left:10px;
      }
      .searchs{
        float:left;
        height:30px;
        input{
          height:30px;
          border-radius: 0;
        }
      }
      .el-icon-search{
        float:left;
        height:30px;
        padding:0;
        width:50px;
        text-align:center;
        line-height:30px;
        border-radius: 0;
      }
      .addBgColor{
        width: 387px;
        height: 27px;
        float: left;
        margin-right: 10px;
        background-color: #fff;
        margin-top: 2px;
        line-height: 18px;
        padding-top: 4px;
        padding-left: 10px;
        .el-checkbox+.el-checkbox{
          margin-left:10px;
        }
      }
    }
  }
  .mainTable{
    min-height: 450px;
    border-bottom:1px solid #ddd;
  }
  .tabListPage{
    height: 50px;
    padding-top: 16px;
  }
}
.marginRightA{
  margin-right:10px;
}
.selectListResou{
  height:30px;
  div.el-input{
    height:30px;
    input.el-input__inner{
      height:30px;
      border-radius: 0;
    }
  }
}
</style>