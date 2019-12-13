<template>
  <div id="ipConfigFourth" class="wrap">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">高防IP专业版</h3>
        <el-select v-model="listResouse" class="selectListResou">
          <el-option label="资源列表" value="resourceList"></el-option>
          <el-option label="业务列表" value="value2"></el-option>
        </el-select>
        <!-- <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button> -->
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear" style="padding:20px;width:100%;">
          <div class="addBgColor" style="display:flex;"> 
            <el-checkbox-group v-model="comingSoon" class="checkOne">
              <el-checkbox label="即将过期" name="comingSoon"></el-checkbox>
            </el-checkbox-group>
            <span class="runningStatusText">运行状态:</span>
            <el-checkbox-group v-model="runningStatus"  class="checkTwo">
              <el-checkbox label="运行中" name="type" value="1"></el-checkbox>
              <el-checkbox label="清洗中" name="type" value="2"></el-checkbox>
              <el-checkbox label="封堵中" name="type" value="3"></el-checkbox>
            </el-checkbox-group>
          </div>
          <span v-if="listResouse=='resourceList'?true:false" style="float:right;">
            <el-input v-model="tableDataName" class="searchs" placeholder="输入ID/名称/IP搜索"></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
          <span v-if="listResouse!='resourceList'?true:false" style="float:right;">
            <el-input v-model="tableDataName1" class="searchs" placeholder="输入域名/CNAME搜索"></el-input>
            <el-button class="el-icon-search" @click="doFilter1"></el-button>
          </span>
        </div>
        <div class="mainContent newClear">
          <div class="mainTable">
            <!-- 业务列表 -->


            <el-table :data="resourceList.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-if="listResouse=='resourceList'?false:true">
              <el-table-column prop="Record" label="CNAME/ID">

              <template slot-scope="scope" >
                      <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='Id' || item.Key=='CName'" @click="toDoDetailResouse(scope.row)">{{item.Value}}<br>{{item.CName}}</a>
                      </span>
                    </template>
                  </el-table-column>
                <!-- <template slot-scope="scope">
                  <span>4fsf4sers.daymsf.com</span><br/>
                  <a href="#" @click="toDoDetailYewu(scope.row)">{{scope.row.canmeId}}</a><br/>
                </template> -->


              </el-table-column>
              <el-table-column prop="domain" label="域名">
                 <template slot-scope="scope">
                   {{scope.row.domain}}<a href="#" @click="toAccest(scope.row)">设置</a>
                </template>
              </el-table-column>
              <el-table-column prop="nowIp" label="当前IP">

               <template slot-scope="scope" >
                      <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='GroupIpList'" @click="toDoDetailResouse(scope.row)">{{item.Value}}<br></a>
                      </span>
                    </template>
                  </el-table-column>



              </el-table-column>
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
            <el-table :data="resourceList.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-if="listResouse!='resourceList'?false:true">
                <el-table-column prop="Record" label="ID/名称">
                    <template slot-scope="scope" >
                      <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='Id' || item.Key=='Name'" @click="toDoDetailResouse(scope.row)">{{item.Value}}<br>{{item.Name}}</a>
                      </span>
                    </template>
                  </el-table-column>
                
                <!-- <el-table-column prop="Id" label="ID/名称">
                <template slot-scope="scope">
                  <a href="#" @click="toDoDetailResouse(scope.row)">{{scope.row.Id}}</a><br/>
                  <span>{{scope.row.Name}}</span>
                </template>
              </el-table-column> -->
              <el-table-column prop="Record" label="转发规则数(个)">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='ReturnHour'" @click="toAccest(scope.row)">{{item.Value}}</a>
                      </span>
                  <!-- <span>0<a href="#" @click="toAccest(scope.row)">设置</a></span> -->
                </template>
              </el-table-column>
              <el-table-column prop="Record" label="防护IP数(个)">
                      <template slot-scope="scope" >
                      <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='GroupIpList'">{{index}}</a>
                      </span>
                    </template>   

                
              </el-table-column>
              <el-table-column prop="origin" label="初始区域">
            <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='OriginRegion'">{{item.Value}}</a>
                      </span>
                </template>


              </el-table-column>
              <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='Status'">{{item.Value}}</a>
                      </span>
                  <!-- <span>0<a href="#" @click="toAccest(scope.row)">设置</a></span> -->
                </template>



              </el-table-column>
              <el-table-column prop="dataTime" label="到期时间">

                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" >
                        <a v-if="item.Key=='Expire'">{{item.Value}}</a>
                      </span>
                  <!-- <span>0<a href="#" @click="toAccest(scope.row)">设置</a></span> -->
                </template>
                
              </el-table-column>
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
            <resouseListModel :isShow="dialogResouseList"  @closeListDetail="closeListDetail" ref="addOrUpdate"/>
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
import resouseListModel from "./model/resouseListModel";
import upgradeModel from "./model/upgradeModel";
import RenewModel from "./model/RenewModel";
import ProtectConfigModel from "./model/ProtectConfigModel";
import yewuListModel from "./model/yewuListModel";

export default {
  data() {
    return {
      activeName: "first",
      tableDataBegin: [], //业务列表table
      tableDataBegin1: [], //资源列表table
      tableDataName: "", //资源列表搜索框
      tableDataEnd: [],
      resourceList: [], //资源列表table
      DDosPolicyList: [], //定义DDoS高级策略接口返回的数据。
      RuleSetsa: [], //获取资源的规则数接口
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      filterConrent: "",
      listResouse: "resourceList", //业务列表Or资源列表
      runningStatus: [], //运行状态绑定
      comingSoon: false, //是否即将过期
      tableDataName1: "", //业务列表搜索框
      dialogResouseList: false, //资产列表详情弹框
      diaologUpgradeModel: false, //升级弹框
      doalogRenewModel: false, //续费弹框
      dialogConfigModel: false, //防护配置弹框
      // autoBack:false,//是否自动回切开关
      dialogYewuModel: false, //业务列表详情弹框
      resouseOrYw: "", //判断是哪个列表
      status: ""
    };
  },
  components: {
    resouseListModel: resouseListModel,
    upgradeModel: upgradeModel,
    RenewModel: RenewModel,
    ProtectConfigModel,
    yewuListModel: yewuListModel
  },
  watch: {
    listResouse: function() {
      if (this.listResouse == "resourceList") {
        this.getData1(); //资源列表
      } else if (this.listResouse != "") {
        this.getData(); //业务列表
      }
    }
  },
  created() {
    this.describeResourceList(); //获取资源列表接口
    //this.describeDDoSPolicy()//获取DDoS高级策略接口
    // this.describeRuleSets(); //获取资源的规则数接口
  },
  // mounted() {
  //   this.getData1();
  // },
  methods: {
    //获取DDoS高级策略接口
    describeDDoSPolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(DDOSPOLICY_CONT, params).then(res => {
        //console.log(params)
        console.log(res);
        this.DDosPolicyList = res.Response.DDosPolicyList;
        console.log(this.DDosPolicyList);
      });
    },
    //获取资源的规则数接口
    describeRuleSets() {
      filterConrent = this.filterConrent;
      runningStatus = this.runningStatus; // 运行状态

      comingSoon = this.comingSoon; // 即将过期
      tableDataName = this.tableDataName; //搜索的输入

      let params = {
        Version: "2018-07-09",
        Business: "net",
        "IdList.0": "net-0000006y"
      };

      this.axios.post(RULESETS_CONT, params).then(res => {
        console.log(params);
        console.log(res);
      });
    },
    //获取资源列表接口
    describeResourceList() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
      };
      // 1.初始化调用 2.条件搜索调用
      if(this.runningStatus.length == 0){ //1.初始化调用，当搜索条件为空时
        
      } else if(this.runningStatus.length > 0) { //2.条件搜索调用
        // 1.添加搜索参数
        // 1.1 勾选框参数
        for (let a in this.runningStatus) {
          if (this.runningStatus[a] == "运行中") {
            params['Status.'+a] = 0;
          } else if (this.runningStatus[a] == "清洗中") {
            params['Status.'+a] = 1;
          } else if (this.runningStatus[a] == "封堵中") {
            params['Status.'+a] = 2;
          }
        }
        // 1.2 输入框参数



      }else if(this.comingSoon==true){

      }else if(this.tableDataName!=null){


      }
      
      this.axios.post(RESOURCE_LIST, params).then(res => {
        console.log(params, res);
        this.resourceList = res.Response.ServicePacks;
        this.totalItems = this.resourceList.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.resourceList[index]);
          }
        } else {
          this.tableDataEnd = this.resourceList;
        }
      });
    },

    // 资源列表条件搜索
    doFilter() {
      // 调用查询接口
      this.describeResourceList();
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
    newBuy() {
      this.$router.push({
        path: "/choose"
      });
    },
    //资产列表详情
    toDoDetailResouse(scopeRow) {
      this.dialogResouseList = true;
      // this.resouseOrYw = this.listResouse;
      console.log(scopeRow);
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scopeRow);
      });
    },
    //关闭资源列表详情
    closeListDetail(DetailShow) {
      this.dialogResouseList = DetailShow;
    },
    //转发规则个数设置按钮
    toAccest() {
      this.$router.push({
        path: "/AccessConfig"
      });
    },
    //升级按钮
    upgradeModel() {
      this.diaologUpgradeModel = true;
    },
    //升级弹框关闭按钮
    closeUpgradeModel(isShow) {
      this.diaologUpgradeModel = isShow;
    },
    //续费弹框
    RenewModel() {
      this.doalogRenewModel = true;
    },
    //续费弹框关闭按钮
    closeRenewModel(isShow) {
      this.doalogRenewModel = isShow;
    },
    //防护配置点击按钮
    configModel() {
      this.dialogConfigModel = true;
    },
    //防护配置弹框关闭按钮
    closeConfigModel(isShow) {
      this.dialogConfigModel = isShow;
    },
    //查看报表跳转页面
    lookReportList() {
      this.$router.push({
        path: "/IpProfessional"
      });
    },
    //业务列表详情
    toDoDetailYewu(rowList) {
      this.dialogYewuModel = true;
    },
    //关闭业务列表详情
    closeListDetailYw(DetailShow) {
      this.dialogYewuModel = DetailShow;
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-tabs__nav-wrap{
  background: white;
  padding: 0 15px;
  box-sizing: border-box;
}
.wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
}
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
#ipConfigFourth {
  .allContent {
    width: 100%;
    // padding: 12px 20px 0;
    .mainContentCenter {
      width: 100%;
      padding: 0 20px 20px;
    }
    .ReportTit {
      width: 100%;
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      line-height: 50px;
      margin-bottom: 20px;
      .ReportTitH3 {
        float: left;
        font-size: 16px;
        font-weight: 600;
        margin-right: 20px;
      }
      .ReportTitBtn {
        float: right;
        height: 30px;
        line-height: 30px;
        padding: 0;
        margin-top: 8px;
        width: 52px;
        border-radius: 0;
        text-align: center;
        background-color: #006eff;
      }
    }
    .textAlignTop {
      width: 648px;
      float: right;
      text-align: right;
      margin-bottom:20px;
      .checkOne {
        float: left;
      }
      .checkTwo {
        float: left;
      }
      span.runningStatusText {
        float: left;
        margin-right: 10px;
        margin-left: 10px;
      }
      .searchs {
        float: left;
        height: 30px;
        width:178px;
        input {
          height: 30px;
          border-radius: 0;
        }
      }
      .el-icon-search {
        float: left;
        height: 30px;
        padding: 0;
        width: 50px;
        text-align: center;
        line-height: 30px;
        border-radius: 0;
      }
      .addBgColor {
        width: 387px;
        height: 27px;
        float: left;
        margin-right: 10px;
        background-color: #fff;
        margin-top: 2px;
        line-height: 18px;
        padding-top: 4px;
        padding-left: 10px;
        .el-checkbox + .el-checkbox {
          margin-left: 10px;
        }
      }
    }
  }
  .mainTable {
    min-height: 450px;
    border-bottom: 1px solid #ddd;
  }
  .tabListPage {
    height: 50px;
    padding-top: 8px;
  }
}
.marginRightA {
  margin-right: 10px;
}
.selectListResou {
  height: 30px;
  div.el-input {
    height: 30px;
    input.el-input__inner {
      height: 30px;
      border-radius: 0;
    }
  }
}
.modelCenterCon{
  p{
    margin-bottom:16px;
    span:nth-child(1).modelSpan1{
      width:120px;
      font-size:12px;
      color:#999;
      float:left;
    }
    span:nth-child(2).modelSpan2{
      float:left;
      width:calc(100% - 120px);
      .gardenChoose {
        padding: 0 20px;
        color: #000;
        font-size: 12px;
      }
      .seceltGarden {
        color: #006eff !important;
      }
    }
  } 
}
.setSelectM{
  div{
    width:200px;
    height:30px;
    input{
      height:30px;
      width:200px;
      line-height: 30px;
      border-radius: 0;
    }
  }
}
.mainContent {
  background-color:#fff;
}
</style>