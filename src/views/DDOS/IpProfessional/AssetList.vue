<template>
  <div id="ipConfigFourth" class="wrap">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">{{$t('DDOS.Protective.professionalEdition')}}</h3>
        <el-select v-model="listSelect" class="selectListResou">
          <el-option :label="$t('DDOS.AssetList.resourceList')" value="resourceList"></el-option>
          <el-option :label="$t('DDOS.AssetList.businessList')" value="businessList"></el-option>
        </el-select>
        <!-- <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button> -->
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear">
          <div class="addBgColor" style="display:flex;">
            <el-checkbox-group v-model="expire" class="checkOne">
              <el-checkbox :label="$t('DDOS.AssetList.willExpire')" name="expire"></el-checkbox>
            </el-checkbox-group>
            <span class="runningStatusText">{{$t('DDOS.AssetList.RunningState')}}:</span>
            <el-checkbox-group v-model="runningStatus" class="checkTwo" @change="statusChange">
              <el-checkbox :label="0">{{$t('DDOS.AssetList.Running')}}</el-checkbox>
              <el-checkbox :label="1">{{$t('DDOS.Protective.Protectivewash')}}</el-checkbox>
              <el-checkbox :label="2">{{$t('DDOS.Protective.blockIng')}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <span style="float:right;">
            <el-input
              v-model="selectResourceInput"
              class="searchs"
              :placeholder="$t('DDOS.AssetList.searchAssetList')"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
        </div>
        <div class="newClear"></div>
        <div class="mainContent newClear">
          <div class="mainTable">
            <!-- 资源列表 -->
            <el-table
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              v-if="listSelect=='resourceList'"
              v-loading="loading"
            >
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.AssetListName')">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='Id'" @click="toDetailResourse(scope.row)" >
                      {{item.Value}}
                    </a>
                  </div>
                  <div v-for="(item,index) in scope.row.Record" :key="index+'i'">
                    <span v-if="item.Key=='Name'">
                      {{item.Value}}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.Forwarding')">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='ReturnHour'" @click="toAccest(scope.row)">{{item.Value}}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.protectionNum')">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='GroupIpList'">{{item.Value.split(';').length}}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="origin" :label="$t('DDOS.AssetList.initialRegio')">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='OriginRegion'">{{item.Value}}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='Status'">{{item.Value}}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="dataTime" :label="$t('DDOS.AssetList.DueTime')">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.Record" :key="index">
                    <a v-if="item.Key=='Expire'">{{item.Value}}</a>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="230">
                <template slot-scope="scope">
                  <a
                    class="marginRightA"
                    href="#"
                    @click="upgradeModel"
                  >{{$t('DDOS.AssetList.upgrade')}}</a>
                  <a
                    class="marginRightA"
                    href="#"
                    @click="RenewModel"
                  >{{$t('DDOS.AssetList.renewal')}}</a>
                  <a
                    class="marginRightA"
                    href="#"
                    @click="configModel"
                  >{{$t('DDOS.AssetList.ProtectionConfig')}}</a>
                  <a
                    class="marginRightA"
                    href="#"
                    @clcik="lookReportList(scope.row)"
                  >{{$t('DDOS.AssetList.CheckReport')}}</a>
                </template>
              </el-table-column>
            </el-table>
            <!-- 业务列表 -->
            <el-table
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              v-if="listSelect=='businessList'"
              v-loading="loading"
              height="450"
            >
              <el-table-column prop="Record" label="CNAME/ID">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.Record" :key="index">
                    <span v-if="item.Key=='CName'">
                      {{item.Value}}
                    </span>
                  </div>
                  <div v-for="(item,index) in scope.row.Record" :key="index+'i'">
                    <a v-if="item.Key=='Id'" @click="toDetailResourse(scope.row)">
                      {{item.Value}}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="RuleNameList" :label="$t('DDOS.AssetList.domainName')">
                <template slot-scope="scope">
                  {{ scope.row.RuleNameList }}
                  <a href="#" @click="toAccest(scope.row)">
                    {{$t('DDOS.AssetList.AssetListSet')}}
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="nowIp" :label="$t('DDOS.AssetList.currentIp')">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.Record" :key="index">
                    <span v-if="item.Key=='GroupIpList'">
                      {{item.Value}}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="backSelf" :label="$t('DDOS.AssetList.AutomaticBack')">
                <template slot-scope="scope">
                  <!-- {{scope.row.AutoReturn}} -->
                  <el-switch
                    v-model="scope.row.AutoReturn"
                    active-color="#006eff"
                    inactive-color="#999"
                    disabled
                    @change="changeSwitch"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="180">
                <template slot-scope="scope">
                  <a
                    class="marginRightA"
                    href="#"
                    style="pointer-events:none;color:#999;"
                  >{{$t('DDOS.AssetList.keyBack')}}</a>
                  <a
                    class="marginRightA"
                    href="#"
                    @clcik="lookReportList(scope.row)"
                  >{{$t('DDOS.AssetList.CheckReport')}}</a>
                </template>
              </el-table-column>
            </el-table>

            <!-- 资源列表详情弹框 -->
            <resouseListModel
              :ipSegment="ipSegment"
              :isShow="dialogResouseList"
              @closeListDetail="closeListDetail"
              ref="addOrUpdate"
            />
            <!-- 升级弹框 -->
            <upgradeModel :Upgrade="diaologUpgradeModel" @closeUpgradeModel="closeUpgradeModel" />
            <!-- 续费弹框 -->
            <RenewModel :RenewShow="doalogRenewModel" @closeRenewModel="closeRenewModel" />
            <!-- 防护配置弹框 -->
            <ProtectConfigModel
              :configShow="dialogConfigModel"
              @closeConfigModel="closeConfigModel"
            />
          </div>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
            <el-pagination
              :page-size="pageSize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="totalItems"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { RESOURCE_LIST, RULESETS_CONT, SOURCEIPSEGMENT_DESCRIBE, INSTANCENAME_CONT } from "@/constants";
import resouseListModel from "./model/resouseListModel";
import upgradeModel from "./model/upgradeModel";
import RenewModel from "./model/RenewModel";
import ProtectConfigModel from "./model/ProtectConfigModel";

export default {
  data() {
    return {
      loading: true,
      ruleSets: [], //资源的规则数据
      tableData: [], //共用table数据
      ipSegment: '', //回源IP
      inputName: '', //修改名称

      expire: false, //即将到期搜索；可选，取值为[0（不搜索），1（搜索即将到期的资源）]
      runningStatus: [], //运行状态绑定

      selectResourceInput: "", //资源列表搜索框

      currentPage: 1,
      pageSize: 10,
      totalItems: 0,

      tableDataEnd: [],
      DDosPolicyList: [], //定义DDoS高级策略接口返回的数据。
      RuleSetsa: [], //获取资源的规则数接口
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      filterConrent: "",
      listSelect: "resourceList", //列表选择（业务列表Or资源列表）
      dialogResouseList: false, //资产列表详情弹框
      diaologUpgradeModel: false, //升级弹框
      doalogRenewModel: false, //续费弹框
      dialogConfigModel: false, //防护配置弹框
      resouseOrYw: "", //判断是哪个列表
      status: ""
    };
  },
  components: {
    resouseListModel: resouseListModel,
    upgradeModel: upgradeModel,
    RenewModel: RenewModel,
    ProtectConfigModel,
  },
  watch: {
    listSelect: function() {//资源列表、业务列表 调用同一接口
      this.describeResourceList();
    },
    expire: function() {
      this.describeResourceList();
    },
    selectResourceInput: function() {
      this.describeResourceList();
    }
  },
  created() {
    this.describeResourceList(); //获取资源列表接口
  },
  methods: {
    //选择运行状态
    statusChange(){
      this.describeResourceList();
    },
    // 1.1.获取资源列表接口
    describeResourceList() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      // 1.1.0.条件搜索调用（即将过期）
      if(this.expire){
        params['Expire'] = 1;
      }
      // 1.1.1.条件搜索调用（运行状态）
      if (this.runningStatus.length > 0) {
        // 勾选框参数
        for (let a in this.runningStatus) {
          params["Status." + a] = this.runningStatus[a];
        }
      }
      // 1.1.2.条件搜索调用（输入框参数）
      if(this.selectResourceInput != ""){
        if(this.listSelect == "resourceList"){
          params["Name"] = this.selectResourceInput;
        } else if(this.listSelect == "businessList"){
          params["Domain"] = this.selectResourceInput;
        }
        // params["IpList.0"] = this.selectResourceInput;
        // params["IdList.0"] = this.selectResourceInput;
      }
      console.log(params)
      // 执行调用接口--------------
      this.axios.post(RESOURCE_LIST, params).then(res => {
        console.log(params, res);
        this.tableData = res.Response.ServicePacks;
        this.totalItems = res.Response.Total;
        // 此接口调用完，调用1.2接口
        this.describeRuleSets();
      });
    },
    // 1.2.获取资源的规则数接口
    describeRuleSets() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
      };
      for(let i=0; i<this.tableData.length; i++){
        for(let j=0; j<this.tableData[i].Record.length; j++){
          if("Id" == this.tableData[i].Record[j].Key){
            params["IdList."+i] = this.tableData[i].Record[j].Value;
          }
        }
      }
      this.axios.post(RULESETS_CONT, params).then(res => {
        // console.log(params, res)
        this.ruleSets = res.Response;
        // 循环tableData
        this.tableData.forEach((item)=>{
          // 循环Record
          item.Record.forEach((map)=>{
            // 判断获取Key=Id的值
            if(map.Key == "Id"){
              // 循环ruleSets
              this.ruleSets.L4RuleSets.forEach((ruleSet)=>{
                // 循环Record2
                ruleSet.Record.forEach((map2)=>{
                  // 判断获取Key=Id的值
                  if(map2.Key == "Id"){
                    // 判断resourceId和ruleSetId是否相等
                    if(map.Value == map2.Value){
                      // 再次循环Record2，获取RuleNameList的值
                      ruleSet.Record.forEach((map3)=>{
                        if(map3.Key == "RuleNameList"){
                          // 将RuleNameList的值添加进tableData
                          item.RuleNameList = map3.Value;
                        }
                      })
                    }
                  }
                })
              })
            } else if(map.Key == "AutoReturn"){
              if(map.Value == '1'){
                item.AutoReturn = true;
              } else if(map.Value == '0'){
                item.AutoReturn = false;
              }
            }
          })
        })
        this.loading = false;
        // console.log(this.tableData);
      });
    },
    // 1.3.获取回源IP段
    describeSourceIpSegment(resourceId){
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: resourceId
      };
      this.axios.post(SOURCEIPSEGMENT_DESCRIBE, params).then(res => {
        console.log(res)
        this.ipSegment = res.Response.Data;
      })
    },
    // 1.4.资源实例重命名接口
    createInstanceName(resourceId, name){
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: resourceId,
        Name: name
      };
      this.axios.post(INSTANCENAME_CONT, params).then(res => {
        console.log(res)
        this.describeResourceList();
      })
    },

    changeSwitch(val){
      // this.$message('暂无接口调用');
    },
    // 跳转详情页面
    toDetailResourse(scopeRow) {
      //获取回源IP段
      scopeRow.Record.forEach(item => {
        if (item.Key == "Id") {
          this.describeSourceIpSegment(item.Value);
        }
      });
      this.dialogResouseList = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scopeRow);
      });
    },
    //关闭资源详情页面
    closeListDetail(arr) {
      if(arr[2]!=""){//编辑确定
        this.createInstanceName(arr[1], arr[2]);
      }
      this.dialogResouseList = arr[0];
    },

    // 条件搜索
    doFilter() {
      // 调用查询接口
      this.describeResourceList();
    },

    //跳转新购页面
    newBuy() {
      this.$router.push({
        path: "/choose"
      });
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

    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
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
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-loading-mask{
  background: white;
}
.Right-style {
  display: flex;
  justify-content: flex-end;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.wrap >>> .el-tabs__nav-wrap {
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
      width: 670px;
      float: right;
      text-align: right;
      margin-bottom: 20px;
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
        width: 178px;
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
.modelCenterCon {
  p {
    margin-bottom: 16px;
    span:nth-child(1).modelSpan1 {
      width: 120px;
      font-size: 12px;
      color: #999;
      float: left;
    }
    span:nth-child(2).modelSpan2 {
      float: left;
      width: calc(100% - 120px);
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
.setSelectM {
  div {
    width: 200px;
    height: 30px;
    input {
      height: 30px;
      width: 200px;
      line-height: 30px;
      border-radius: 0;
    }
  }
}
.mainContent {
  background-color: #fff;
}
.tabListPage {
  text-align: right;
}
</style>