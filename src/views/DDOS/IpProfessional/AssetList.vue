<template>
  <!-- 资产列表 -->
  <div id="ipConfigFourth" class="wrap">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">{{ $t("DDOS.Protective.professionalEdition") }}</h3>
        <el-select v-model="listSelect" class="selectListResou">
          <el-option :label="$t('DDOS.AssetList.resourceList')" value="resourceList"></el-option>
          <el-option :label="$t('DDOS.AssetList.businessList')" value="businessList"></el-option>
        </el-select>
        <!-- 新购 -->
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">{{$t('DDOS.total.new_buy')}}</el-button>
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear">
          <div class="addBgColor" style="display:flex;">
            <!-- 即将过期 -->
            <el-checkbox-group v-model="expireFilter" class="checkOne" @change="expireChange">
              <el-checkbox :label="$t('DDOS.AssetList.willExpire')"></el-checkbox>
            </el-checkbox-group>
            <!-- 运行状态 -->
            <span class="runningStatusText">{{ $t("DDOS.AssetList.RunningState") }}:</span>
            <el-checkbox-group v-model="runningStatus" class="checkTwo" @change="statusChange">
              <el-checkbox :label="0">{{ $t("DDOS.AssetList.Running") }}</el-checkbox>
              <el-checkbox :label="1">{{ $t("DDOS.Protective.Protectivewash") }}</el-checkbox>
              <el-checkbox :label="2">{{ $t("DDOS.Protective.blockIng") }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <span style="float:right;">
            <el-input
              v-model="selectResourceInput"
              class="searchs"
              :placeholder="this.listSelect == 'resourceList'?$t('DDOS.AssetList.searchAssetList'):$t('DDOS.AssetList.searchAssetListS')"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
        </div>
        <div class="newClear"></div>
        <div class="mainContent newClear">
          <div class="mainTable">
            <!-- 资源列表 -->
            <el-table
              :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
              v-if="listSelect == 'resourceList'"
              v-loading="loading"
              height="460"
              empty-text="暫無數據"
            >
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.AssetListName')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <a v-if="item.Key == 'Id'" @click="toDetailResourse(scope.row)">{{ item.Value }}</a>
                  </div>
                  <div v-for="(item, index) in scope.row.Record" :key="index + 'i'">
                    <span v-if="item.Key == 'Name'">{{ item.Value == "" ? "未命名" : item.Value }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.Forwarding')">
                <template slot-scope="scope">
                  <div>
                    {{ (scope.row.RuleNum === undefined || scope.row.RuleNum == "") ? 0 : scope.row.RuleNum}}
                    <a @click="toAccest(scope.row.Record)">
                      {{ $t("DDOS.AssetList.AssetListSet") }}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="Record" :label="$t('DDOS.AssetList.protectionNum')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key == 'IPText'">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.Value.join(';')"
                        placement="top"
                      >
                        <span>{{ item.Value.length }}</span>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- 初始区域（接口未对字段说明，部分值无法解析直接输出） -->
              <el-table-column prop="origin" :label="$t('DDOS.AssetList.initialRegio')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span
                      v-if="item.Key == 'OriginRegion'"
                    >{{ item.Value == "tpe" ? $t("DDOS.total.address") : item.Value }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 状态 -->
              <el-table-column prop="status" :label="$t('DDOS.UnlockOperation.Unlockstate')">
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.Record" :key="index">
                    <!-- (idle:运行中, attacking:攻击中, blocking:封堵中, isolate:隔离中) -->
                    <span v-if="item.Key == 'Status' && item.Value == 'idle'">
                      {{
                      $t("DDOS.AssetList.Running")
                      }}
                    </span>
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'attacking'
                      "
                      style="color: red;"
                    >{{ $t("DDOS.AssetList.Attacking") }}</span>
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'blocking'
                      "
                    >{{ $t("DDOS.AssetList.Blocking") }}</span>
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'isolate'
                      "
                    >{{ $t("DDOS.AssetList.Isolate") }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="dataTime" :label="$t('DDOS.AssetList.DueTime')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'Expire'">{{ item.Value }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 自动续费 -->
              <el-table-column prop="renewFlag" :label="$t('DDOS.choose.renewalMoney')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <el-switch
                      v-if="item.Key == 'AutoRenewFlag'"
                      v-model="item.Value"
                      active-color="#006eff"
                      inactive-color="#999"
                      active-value="1"
                      inactive-value="0"
                      @change="modifyResourceRenewFlag(scope.row)"
                    ></el-switch>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="230">
                <template slot-scope="scope">
                  <a class="marginRightA" href="#" @click="upgradeButton(scope.row)">
                    {{
                    $t("DDOS.AssetList.upgrade")
                    }}
                  </a>
                  <a class="marginRightA" href="#" @click="renewModelButton(scope.row)">
                    {{
                    $t("DDOS.AssetList.renewal")
                    }}
                  </a>
                  <!-- 防护配置 -->
                  <a
                    class="marginRightA"
                    href="#"
                    @click="configModel(scope.row)"
                  >{{ $t("DDOS.AssetList.ProtectionConfig") }}</a>
                  <a
                    class="marginRightA"
                    href="#"
                    @click="lookReportList(scope.row.Record)"
                  >{{ $t("DDOS.AssetList.CheckReport") }}</a>
                </template>
              </el-table-column>
            </el-table>
            <!-- 业务列表 -->
            <el-table
              :data="
                tableData.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              v-if="listSelect == 'businessList'"
              v-loading="loading"
              height="450"
              empty-text="暫無數據"
            >
              <el-table-column prop="Record" label="CNAME/ID">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'CName'">{{ item.Value }}</span>
                  </div>
                  <div v-for="(item, index) in scope.row.Record" :key="index + 'i'">
                    <a v-if="item.Key == 'Id'" @click="toDetailResourse(scope.row)">{{ item.Value }}</a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="RuleNameList" :label="$t('DDOS.AssetList.domainName')">
                <template slot-scope="scope">
                  {{ (scope.row.RuleNameList === undefined || scope.row.RuleNameList == "") ? "-" :  scope.row.RuleNameList}}
                  <a @click="toAccest(scope.row.Record)">
                    {{
                    $t("DDOS.AssetList.AssetListSet")
                    }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="nowIp" :label="$t('DDOS.AssetList.currentIp')">
                <!-- 当前IP-->
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key == 'GroupIpList'">
                      <div v-for="(item2, index2) in item.Value.split(';')" :key="index2+'i'">
                        <div v-for="(item3, index3) in scope.row.Record" :key="index3+'j'">
                          <div v-if="item3.Key == 'CurrentGroup'">
                            <div v-if="item2.indexOf('-'+item3.Value+'-')>-1">
                              {{ item2.substring(0, item2.indexOf('-')) }}
                              <span style="color: #999;">
                                {{ item2.substring(item2.indexOf('-')+1, item2.indexOf('-', item2.indexOf('-')+1)) == 'tpe'?'台湾台北(BGP)':item2.substring(item2.indexOf('-')+1, item2.indexOf('-', 2)) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="backSelf" :label="$t('DDOS.AssetList.AutomaticBack')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <el-tooltip v-if="item.Key == 'AutoReturn'" class="tooltip" effect="light" placement="bottom-start">
                      <div slot="content" class="tooltip_text">
                        {{ $t('DDOS.AssetList.OpenAutoReturn') }}
                      </div>
                      <el-switch
                        v-model="item.Value"
                        active-color="#006eff"
                        inactive-color="#999"
                        active-value="1"
                        inactive-value="0"
                        @change="changeSwitch(scope.row)"
                        style="float: left;"
                      ></el-switch>
                    </el-tooltip>
                    <div v-if="item.Key == 'AutoReturn' && item.Value == 1">
                      <div v-for="(item2, index2) in scope.row.Record" :key="index2+'i'">
                        <el-tooltip v-if="item2.Key == 'ReturnHour'" class="tooltip" effect="light" placement="bottom">
                          <div slot="content" class="tooltip_text">
                            <p
                              style="height: 20px;"
                            >{{$t('DDOS.AssetList.autoHourText1')}}{{item2.Value}}{{$t('DDOS.AssetList.autoHourText2')}}</p>
                            <a
                              href="#"
                              @click="changeAutoReturnTime(scope.row)"
                              style="text-decoration: underline;"
                            >{{$t('DDOS.AssetList.changeTime')}}</a>
                          </div>
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="180">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index" style="float: left;">
                    <a
                      class="marginRightA"
                      href="#"
                      style="pointer-events:none; color:#999;"
                      v-if="item.Key == 'CurrentGroup' && item.Value == '100'"
                    >{{ $t("DDOS.AssetList.keyBack") }}</a>
                    <a
                      class="marginRightA"
                      href="#"
                      v-if="item.Key == 'CurrentGroup' && item.Value == '300'"
                      @click="toNetReturn(scope.row)"
                    >{{ $t("DDOS.AssetList.keyBack") }}</a>
                  </div>
                  <a
                    class="marginRightA"
                    href="#"
                    @click="lookReportList(scope.row.Record)"
                  >{{ $t("DDOS.AssetList.CheckReport") }}</a>
                </template>
              </el-table-column>
            </el-table>

            <!-- 设置自动回切时间 -->
            <el-dialog
              :title="$t('DDOS.AssetList.AutomaticBack')"
              :visible.sync="autoReturnTimeDialogVisible"
              width="43%"
            >
              <div v-for="(item, index) in resourceObj.Record" :key="index">
                <div v-if="item.Key == 'ReturnHour'">
                  {{$t('DDOS.AssetList.changeAutoHourText1')}}
                  <el-select
                    v-model="item.Value"
                    :placeholder="$t('DDOS.AccesstoCon.searchAccess')"
                    style="width: 120px;"
                  >
                    <el-option
                      v-for="(item, index) in autoReturnTimeList"
                      :label="item"
                      :value="item"
                      :key="index"
                    ></el-option>
                  </el-select>
                  {{$t('DDOS.AssetList.changeAutoHourText2')}}
                </div>
              </div>
              <div slot="footer" style="text-align: center">
                <el-button
                  type="primary"
                  @click="changeAutoReturnHour"
                >{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
                <el-button @click="autoReturnTimeDialogVisible = false">取 消</el-button>
              </div>
            </el-dialog>
            <!-- 一键回切确认弹框 -->
            <el-dialog
              :title="$t('DDOS.AssetList.netReturnSure')"
              :visible.sync="netReturnDialogVisible"
              width="43%"
            >
              <div>
                {{ $t('DDOS.AssetList.netReturnSureMsg') }}
              </div>
              <div slot="footer" style="text-align: center">
                <el-button
                  type="primary"
                  @click="netReturnSure"
                >{{$t('DDOS.AssetList.return')}}</el-button>
                <el-button @click="netReturnDialogVisible = false">取 消</el-button>
              </div>
            </el-dialog>
            <!-- 一键回切成功返回弹框 -->
            <el-dialog
              :visible.sync="netReturnSuccessDialogVisible"
              width="43%"
            >
              <div>
                {{ $t('DDOS.AssetList.netReturnSuccessMsg') }}
              </div>
              <div slot="footer" style="text-align: center">
                <el-button
                  type="primary"
                  @click="netReturnSuccessDialogVisible = false"
                >{{$t('DDOS.AssetList.iKnow')}}</el-button>
              </div>
            </el-dialog>
            <!-- 一键回切失败返回弹框 -->
            <el-dialog
              :title="$t('DDOS.AssetList.netReturnError')"
              :visible.sync="netReturnErrorDialogVisible"
              width="43%"
            >
              <div>
                {{ $t('DDOS.AssetList.netReturnErrorMsg') }}
              </div>
              <div slot="footer" style="text-align: center">
                <el-button
                  type="primary"
                  @click="netReturnErrorDialogVisible = false"
                >{{$t('DDOS.AssetList.iKnow')}}</el-button>
              </div>
            </el-dialog>
            <!-- 资源列表详情弹框 -->
            <resouseListModel
              :ipSegment="ipSegment"
              :isShow="dialogResouseList"
              @closeListDetail="closeListDetail"
              ref="addOrUpdate"
            />
            <!-- 升级弹框 -->
            <upgradeModel
              :Upgrade="diaologUpgradeModel"
              @closeUpgradeModel="closeUpgradeModel"
              ref="UpGradeModel"
            />
            <!-- 续费弹框 -->
            <RenewModel
              :RenewShow="doalogRenewModel"
              @closeRenewModel="closeRenewModel"
              ref="ReNewModel"
            />
            <!-- 防护配置弹框 -->
            <ProtectConfigModel
              :configShow="dialogConfigModel"
              @closeConfigModel="closeConfigModel"
              ref="protectConfigModel"
            />
          </div>
          <div class="Right-style pagstyle">
            <span class="pagtotal">
              共&nbsp;{{ totalItems }}&nbsp;{{
              $t("DDOS.UnsealCode.tiao")
              }}
            </span>
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
import {
  RESOURCE_LIST,
  GET_SPolicy,
  Modify_Level,
  RULESETS_CONT,
  SOURCEIPSEGMENT_DESCRIBE,
  INSTANCENAME_CONT,
  L4_RULES,
  MODIFY_RENEWFLAG,
  Modify_NetReturnSwitch,
  CREATE_NETRETURN
} from "@/constants";
import resouseListModel from "./model/resouseListModel";
import upgradeModel from "./model/upgradeModel";
import RenewModel from "./model/RenewModel";
import ProtectConfigModel from "./model/ProtectConfigModel";
import { ErrorTips } from "@/components/ErrorTips";

export default {
  data() {
    return {
      loading: true,
      listSelect: "resourceList", // 列表选择（业务列表Or资源列表）
      tableData: [], // 共用table数据
      expireFilter: false, // 搜索勾选框：即将到期搜索；可选，取值为[0（不搜索），1（搜索即将到期的资源）]
      runningStatus: [], // 搜索勾选框：运行状态
      selectResourceInput: "", // 搜索输入框
      resourceObj: {}, // 各弹框所使用对象（防护配置）

      ruleSets: [], // 资源的规则数据
      ipSegment: "", // 回源IP
      tableDataEnd: [],
      RuleSetsa: [], // 获取资源的规则数接口
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      filterConrent: "",
      dialogResouseList: false, // 资产列表详情弹框
      diaologUpgradeModel: false, // 升级弹框
      doalogRenewModel: false, // 续费弹框
      dialogConfigModel: false, // 防护配置弹框
      resouseOrYw: "", // 判断是哪个列表
      status: "",
      inputName: "", // 修改名称
      // 资源列表

      // 业务列表
      netReturnDialogVisible: false, //一键回切-确认弹框
      netReturnSuccessDialogVisible: false, //一键回切-成功返回弹框
      netReturnErrorDialogVisible: false, //一键回切-失败返回弹框
      autoReturnTimeDialogVisible: false, //自动回切-修改时间弹框
      autoReturnTimeList: [1, 2, 3, 4, 5, 6], //自动回切-时间数组
      // 分页
      currentPage: 1,
      pageSize: 10,
      totalItems: 0
    };
  },
  components: {
    resouseListModel: resouseListModel,
    upgradeModel: upgradeModel,
    RenewModel: RenewModel,
    ProtectConfigModel
  },
  watch: {
    listSelect: function() {
      // 资源列表、业务列表 调用同一接口
      this.describeResourceList();
    },
    // 搜索框监控
    selectResourceInput: function() {
      this.describeResourceList();
    }
  },
  created() {
    this.describeResourceList(); // 获取资源列表接口
  },
  methods: {
    // 搜索勾选框-即将过期
    expireChange() {
      this.describeResourceList();
    },
    // 搜索勾选框-运行状态
    statusChange() {
      this.describeResourceList();
    },
    // 1.1.获取资源列表接口
    async describeResourceList() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      // 1.1.0.条件搜索参数（即将过期）
      if (this.expireFilter) {
        params["Expire"] = 1;
      }
      // 1.1.1.条件搜索参数（运行状态）
      if (this.runningStatus.length > 0) {
        for (let a in this.runningStatus) {
          params["Status." + a] = this.runningStatus[a];
        }
      }
      // 1.1.2.条件搜索参数（输入框参数）
      if (this.selectResourceInput != "") {
        if (this.listSelect == "resourceList") {
          var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          if (regIP.test(this.selectResourceInput)) {
            params["IpList.0"] = this.selectResourceInput;
          } else if (this.selectResourceInput.length == 12 && this.selectResourceInput.substring(0,4) == "net-") {
            params["IdList.0"] = this.selectResourceInput;
          } else {
            params["Name"] = this.selectResourceInput;
          }
        } else if (this.listSelect == "businessList") {
          if (this.selectResourceInput.indexOf("dayugslb") != -1) {
            params["CName"] = this.selectResourceInput;
          } else {
            params["Domain"] = this.selectResourceInput;
          }
        }
      }
      // -----调用接口-----
      await this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(params, res);
        this.tableData = res.Response.ServicePacks;
        this.totalItems = res.Response.Total;
        this.tableData.forEach(val => {
          val.Record.forEach(item => {
            if (item.Key == "GroupIpList") {
              // IP列表文本格式化处理（资源列表 需要）
              let IPText = [];
              let ipArr = item.Value.split(";");
              for (let key = ipArr.length - 1; key >= 0; key--) {
                const element = ipArr[key];
                let ipDetailArr = element.split("-");
                if (ipDetailArr[3] == "100") {
                  //IP显示顺序处理
                  IPText.splice(0, 0,
                    ipDetailArr[0] +
                      "(" +
                      (ipDetailArr[1] == "tpe" ? "台灣台北" : ipDetailArr[1]) +
                      (ipDetailArr[2] == "bgp" ? "BGP" : ipDetailArr[2]) +
                      ")"
                  );
                } else {
                  IPText.push(
                    ipDetailArr[0] +
                      "(" +
                      (ipDetailArr[1] == "tpe" ? "台灣台北" : ipDetailArr[1]) +
                      (ipDetailArr[2] == "bgp" ? "BGP" : ipDetailArr[2]) +
                      ")"
                  );
                }
              }
              const obj = {
                Key: "IPText",
                Value: IPText
              };
              val.Record.push(obj);
            }
          });
        });
        // 此接口调用完，调用1.2接口
        if (this.totalItems != 0) {
          this.describeRuleSets();
        }
        this.loading = false;
      });
    },
    // 1.2.获取资源的规则数接口
    async describeRuleSets() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].Record.length; j++) {
          if (this.tableData[i].Record[j].Key == "Id") {
            params["IdList." + i] = this.tableData[i].Record[j].Value;
          }
        }
      }
      await this.axios.post(RULESETS_CONT, params).then(res => {
        // console.log(params, res)
        this.ruleSets = res.Response;
        // 循环tableData
        this.tableData.forEach(item => {
          // 循环Record
          item.Record.forEach(map => {
            // 判断获取Key=Id的值
            if (map.Key == "Id") {
              // 循环ruleSets
              this.ruleSets.L4RuleSets.forEach(ruleSet => {
                // 循环Record2
                ruleSet.Record.forEach(map2 => {
                  // 判断获取Key=Id的值(判断resourceId和ruleSetId是否相等)
                  if (map2.Key == "Id" && map.Value == map2.Value) {
                    // 再次循环Record2，获取RuleNameList的值
                    ruleSet.Record.forEach(map3 => {
                      if (map3.Key == "RuleNameList") {
                        // 将RuleNameList的值添加进tableData
                        item.RuleNameList = map3.Value;
                      } else if (map3.Key == "RuleNum") {
                        // item.RuleNum = map3.Value;
                        this.$set(item, 'RuleNum', map3.Value);
                      }
                    });
                  }
                });
              });
            }
          });
        });
      });
    },
    // 1.3.获取回源IP段
    describeSourceIpSegment(resourceId) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: resourceId
      };
      this.axios.post(SOURCEIPSEGMENT_DESCRIBE, params).then(res => {
        // console.log(res);
        if (res.Response.Error === undefined) {
          this.ipSegment = res.Response.Data;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 1.4.资源实例重命名接口
    createInstanceName(resourceId, name) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: resourceId,
        Name: name
      };
      this.axios.post(INSTANCENAME_CONT, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 1.5.资源列表-自动续费
    modifyResourceRenewFlag(row) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      for (let i = 0; i < row.Record.length; i++) {
        if (row.Record[i].Key == "Id") {
          params.Id = row.Record[i].Value;
        } else if (row.Record[i].Key == "AutoRenewFlag") {
          params.RenewFlag = row.Record[i].Value; // RenewFlag是Integer	自动续费标记（0手动续费；1自动续费；2到期不续费）
        } 
      }
      this.axios.post(MODIFY_RENEWFLAG, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList();
        } else {
          let ErrTips = {
            DryRunOperation: "多傳了DryRun參數的操作",
            FailedOperation: "操作失敗",
            InternalError: "內部錯誤",
            InvalidParameter: "無效參數",
            InvalidParameterValue: "無效參數值",
            LimitExceeded: "超過配額限制",
            MissingParameter: "缺少參數錯誤",
            ResourceInUse: "資源被占用",
            ResourceNotFound: "資源不存在",
            ResourceUnavailable: "資源不可用"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // 1.6. 设置自动回切
    modifyNetReturnSwitch(id, status, hour) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: id,
        Status: status,
        Hour: hour
      };
      this.axios.post(Modify_NetReturnSwitch, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList();
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          });
          return
        }
      });
    },
    // 1.7. 一键回切
    creatNetReturn(id) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: id
      };
      this.axios.post(CREATE_NETRETURN, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList();
          this.netReturnSuccessDialogVisible = true;
        } else {
          this.netReturnErrorDialogVisible = true;
        }
      });
    },

    // 跳转一键回切确认弹框
    toNetReturn(row) {
      this.resourceObj = JSON.parse(JSON.stringify(row));
      this.netReturnDialogVisible = true;
    },
    // 一键回切 确认
    netReturnSure() {
      let id = "";
      for (let i = 0; i < this.resourceObj.Record.length; i++) {
        if (this.resourceObj.Record[i].Key == "Id") {
          id = this.resourceObj.Record[i].Value;
          this.creatNetReturn(id);
          this.netReturnDialogVisible = false;
          return
        }
      }
    },
    // 自动回切 按钮
    changeSwitch(row) {
      let id = "";
      let status = 1;
      for (let i = 0; i < row.Record.length; i++) {
        if (row.Record[i].Key == "Id") {
          id = row.Record[i].Value;
        } else if (row.Record[i].Key == "AutoReturn") {
          status = row.Record[i].Value;
        } 
      }
      this.modifyNetReturnSwitch(id, status, 2);
    },
    // 设置自动回切时间弹框显示 按钮
    changeAutoReturnTime(row) {
      this.resourceObj = JSON.parse(JSON.stringify(row));
      this.autoReturnTimeDialogVisible = true;
    },
    // 设置自动回切时间确认 按钮
    changeAutoReturnHour() {
      let id = "";
      let status = 1;
      let hour = 2;
      for (let i = 0; i < this.resourceObj.Record.length; i++) {
        if (this.resourceObj.Record[i].Key == "Id") {
          id = this.resourceObj.Record[i].Value;
        } else if (this.resourceObj.Record[i].Key == "AutoReturn") {
          status = this.resourceObj.Record[i].Value;
        } else if (this.resourceObj.Record[i].Key == "ReturnHour") {
          hour = this.resourceObj.Record[i].Value;
        }
      }
      this.modifyNetReturnSwitch(id, status, hour);
      this.autoReturnTimeDialogVisible = false;
    },
    // 跳转详情页面
    toDetailResourse(scopeRow) {
      // 获取回源IP段
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
    // 关闭资源详情页面
    closeListDetail(arr) {
      if (arr[2] != "") {
        // 编辑确定
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
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, "_blank");
    },
    // 转发规则个数设置按钮
    toAccest(record) {
      let resId = "";
      for (const i in record) {
        if (record.hasOwnProperty(i)) {
          const element = record[i];
          if (element.Key == "Id") {
            resId = element.Value;
          }
        }
      }
      this.$router.push({
        path: "/AccessConfig",
        query: {
          resourceId: resId
        }
      });
    },
    // 升级按钮
    upgradeButton(row) {
      this.$nextTick(() => {
        this.$refs.UpGradeModel.init(row);
      });
      this.diaologUpgradeModel = true;
    },
    // 升级弹框关闭按钮
    closeUpgradeModel(isShow) {
      this.diaologUpgradeModel = isShow;
    },
    // 续费弹框
    renewModelButton(row) {
      this.$nextTick(() => {
        this.$refs.ReNewModel.init(row);
      });
      this.doalogRenewModel = true;
    },
    // 续费弹框关闭按钮
    closeRenewModel(isShow) {
      this.doalogRenewModel = isShow;
    },
    // 防护配置点击按钮
    configModel(row) {
      this.resourceObj = JSON.parse(JSON.stringify(row));
      row.Record.forEach(item => {
        if (item.Key == "Id") {
          // 1.防护等级（资源列表-防护配置 需要）
          let params = {
            Version: "2018-07-09",
            Region: localStorage.getItem("regionv2"),
            Business: "net",
            Id: item.Value,
            Method: "get"
          };
          this.axios.post(Modify_Level, params).then(res => {
            const obj = {
              Key: "DDoSLevel",
              Value: res.Response.DDoSLevel
            };
            this.resourceObj.Record.push(obj);
          });
          // 2.高级防护策略（资源列表-防护配置 需要）
          let params2 = {
            Version: "2018-07-09",
            Region: localStorage.getItem("regionv2"),
            Business: "net",
            Id: item.Value
          };
          this.axios.post(GET_SPolicy, params2).then(res => {
            if (res.Response.DDosPolicyList.length == 0) {
              const obj2 = {
                Key: "SPolicyName",
                Value: ""
              };
              const obj2Id = {
                Key: "SPolicyId",
                Value: ""
              };
              this.resourceObj.Record.push(obj2);
              this.resourceObj.Record.push(obj2Id);
            } else {
              const obj2 = {
                Key: "SPolicyName",
                Value: res.Response.DDosPolicyList[0].PolicyName
              };
              const obj2Id = {
                Key: "SPolicyId",
                Value: res.Response.DDosPolicyList[0].PolicyId
              };
              this.resourceObj.Record.push(obj2);
              this.resourceObj.Record.push(obj2Id);
            }
          });
        }
      });
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.protectConfigModel.init(this.resourceObj);
        });
        this.dialogConfigModel = true;
      }, 1000);
    },
    // 防护配置弹框关闭按钮
    closeConfigModel(isShow) {
      this.dialogConfigModel = isShow;
      this.describeResourceList();
    },
    // 查看报表跳转页面
    lookReportList(record) {
      let resId = "";
      for (const i in record) {
        if (record.hasOwnProperty(i)) {
          const element = record[i];
          if (element.Key == "Id") {
            resId = element.Value;
          }
        }
      }
      this.$router.push({
        path: "/IpProfessional",
        query: {
          selectId: resId
        }
      });
    },

    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, // 组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
.wrap >>> .el-loading-mask {
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
.tooltip_text {
  font-size: 13px;
}
.el-icon-info {
  margin-left: 5px;
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
