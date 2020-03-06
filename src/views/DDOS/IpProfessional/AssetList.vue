<template>
  <!-- 资产列表 -->
  <div id="ipConfigFourth" class="wrap">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">
          {{ $t("DDOS.Protective.professionalEdition") }}
        </h3>
        <el-select v-model="listSelect" class="selectListResou">
          <el-option
            :label="$t('DDOS.AssetList.resourceList')"
            value="resourceList"
          ></el-option>
          <el-option
            :label="$t('DDOS.AssetList.businessList')"
            value="businessList"
          ></el-option>
        </el-select>
        <!-- 新购 -->
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">{{$t('DDOS.total.new_buy')}}</el-button>
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear">
          <div class="addBgColor" style="display:flex;">
            <el-checkbox-group v-model="expire" class="checkOne">
              <el-checkbox
                :label="$t('DDOS.AssetList.willExpire')"
                name="expire"
              ></el-checkbox>
            </el-checkbox-group>
            <span class="runningStatusText"
              >{{ $t("DDOS.AssetList.RunningState") }}:</span
            >
            <el-checkbox-group
              v-model="runningStatus"
              class="checkTwo"
              @change="statusChange"
            >
              <el-checkbox :label="0">{{
                $t("DDOS.AssetList.Running")
              }}</el-checkbox>
              <el-checkbox :label="1">{{
                $t("DDOS.Protective.Protectivewash")
              }}</el-checkbox>
              <el-checkbox :label="2">{{
                $t("DDOS.Protective.blockIng")
              }}</el-checkbox>
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
              :data="
                tableData.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              v-if="listSelect == 'resourceList'"
              v-loading="loading"
            >
              <el-table-column
                prop="Record"
                :label="$t('DDOS.AssetList.AssetListName')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <a
                      v-if="item.Key == 'Id'"
                      @click="toDetailResourse(scope.row)"
                      >{{ item.Value }}</a
                    >
                  </div>
                  <div
                    v-for="(item, index) in scope.row.Record"
                    :key="index + 'i'"
                  >
                    <span v-if="item.Key == 'Name'">{{
                      item.Value == "" ? "未命名" : item.Value
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="Record"
                :label="$t('DDOS.AssetList.Forwarding')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'L4RulesTotal'">
                      {{ item.Value }}
                      <a @click="toAccest(scope.row.Record)">{{
                        $t("DDOS.AssetList.AssetListSet")
                      }}</a>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="Record"
                :label="$t('DDOS.AssetList.protectionNum')"
              >
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
              <el-table-column
                prop="origin"
                :label="$t('DDOS.AssetList.initialRegio')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'OriginRegion'">{{
                      item.Value == "tpe"
                        ? $t("DDOS.total.address")
                        : item.Value
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 状态 -->
              <el-table-column
                prop="status"
                :label="$t('DDOS.UnlockOperation.Unlockstate')"
              >
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.Record" :key="index">
                    <!-- (idle:运行中, attacking:攻击中, blocking:封堵中, isolate:隔离中) -->
                    <span v-if="item.Key == 'Status' && item.Value == 'idle'">{{
                      $t("DDOS.AssetList.Running")
                    }}</span>
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'attacking'
                      "
                      style="color: red;"
                      >{{ $t("DDOS.AssetList.Attacking") }}</span
                    >
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'blocking'
                      "
                      >{{ $t("DDOS.AssetList.Blocking") }}</span
                    >
                    <span
                      v-else-if="
                        item.Key == 'Status' && item.Value == 'isolate'
                      "
                      >{{ $t("DDOS.AssetList.Isolate") }}</span
                    >
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="dataTime"
                :label="$t('DDOS.AssetList.DueTime')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'Expire'">{{ item.Value }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 自动续费 -->
              <el-table-column
                prop="renewFlag"
                :label="$t('DDOS.choose.renewalMoney')"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.RenewFlag"
                    active-color="#006eff"
                    inactive-color="#999"
                    @change="renewFlagSwitch(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作" width="230">
                <template slot-scope="scope">
                  <a class="marginRightA" href="#" @click="upgradeModel">{{
                    $t("DDOS.AssetList.upgrade")
                  }}</a>
                  <a class="marginRightA" href="#" @click="RenewModel">{{
                    $t("DDOS.AssetList.renewal")
                  }}</a>
                  <!-- 防护配置 -->
                  <a
                    class="marginRightA"
                    href="#"
                    @click="configModel(scope.row)"
                    >{{ $t("DDOS.AssetList.ProtectionConfig") }}</a
                  >
                  <a
                    class="marginRightA"
                    href="#"
                    @click="lookReportList(scope.row)"
                    >{{ $t("DDOS.AssetList.CheckReport") }}</a
                  >
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
            >
              <el-table-column prop="Record" label="CNAME/ID">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <span v-if="item.Key == 'CName'">{{ item.Value }}</span>
                  </div>
                  <div
                    v-for="(item, index) in scope.row.Record"
                    :key="index + 'i'"
                  >
                    <a
                      v-if="item.Key == 'Id'"
                      @click="toDetailResourse(scope.row)"
                      >{{ item.Value }}</a
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="RuleNameList"
                :label="$t('DDOS.AssetList.domainName')"
              >
                <template slot-scope="scope">
                  {{ scope.row.RuleNameList }}
                  <a @click="toAccest(scope.row.Record)">{{
                    $t("DDOS.AssetList.AssetListSet")
                  }}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="nowIp"
                :label="$t('DDOS.AssetList.currentIp')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key == 'IPText'">
                      <span>{{ item.Value[item.Value.length - 1] }}</span>
                      <!-- 此处值在获取的方法中转化时，使用push操作所以顺序为倒序，去最后一个值即为原数据的第一个值 -->
                    </div>
                    <!-- IP地址-->
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="backSelf"
                :label="$t('DDOS.AssetList.AutomaticBack')"
              >
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
                    >{{ $t("DDOS.AssetList.keyBack") }}</a
                  >
                  <a
                    class="marginRightA"
                    href="#"
                    @click="lookReportList(scope.row)"
                    >{{ $t("DDOS.AssetList.CheckReport") }}</a
                  >
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
            <upgradeModel
              :Upgrade="diaologUpgradeModel"
              @closeUpgradeModel="closeUpgradeModel"
            />
            <!-- 续费弹框 -->
            <RenewModel
              :RenewShow="doalogRenewModel"
              @closeRenewModel="closeRenewModel"
            />
            <!-- 防护配置弹框 -->
            <ProtectConfigModel
              :configShow="dialogConfigModel"
              @closeConfigModel="closeConfigModel"
              :modifyDDosRes="modifyDDosRes"
              :policysData="tableDataPolicy"
            />
          </div>
          <div class="Right-style pagstyle">
            <span class="pagtotal"
              >共&nbsp;{{ totalItems }}&nbsp;{{
                $t("DDOS.UnsealCode.tiao")
              }}</span
            >
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
  MODIFY_RENEWFLAG
} from '@/constants'
import resouseListModel from './model/resouseListModel'
import upgradeModel from './model/upgradeModel'
import RenewModel from './model/RenewModel'
import ProtectConfigModel from './model/ProtectConfigModel'

export default {
  data () {
    return {
      loading: true,
      ruleSets: [], // 资源的规则数据
      tableData: [], // 共用table数据
      ipSegment: '', // 回源IP
      inputName: '', // 修改名称

      expire: false, // 即将到期搜索；可选，取值为[0（不搜索），1（搜索即将到期的资源）]
      runningStatus: [], // 运行状态绑定

      selectResourceInput: '', // 资源列表搜索框

      currentPage: 1,
      pageSize: 10,
      totalItems: 0,

      tableDataEnd: [],
      tableDataPolicy: [], // DDoS高级防护策略列表
      RuleSetsa: [], // 获取资源的规则数接口
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      filterConrent: '',
      listSelect: 'resourceList', // 列表选择（业务列表Or资源列表）
      dialogResouseList: false, // 资产列表详情弹框
      diaologUpgradeModel: false, // 升级弹框
      doalogRenewModel: false, // 续费弹框
      dialogConfigModel: false, // 防护配置弹框
      resouseOrYw: '', // 判断是哪个列表
      status: '',
      modifyDDosRes: {} // 防护配置使用对象
    }
  },
  components: {
    resouseListModel: resouseListModel,
    upgradeModel: upgradeModel,
    RenewModel: RenewModel,
    ProtectConfigModel
  },
  watch: {
    listSelect: function () {
      // 资源列表、业务列表 调用同一接口
      this.describeResourceList()
    },
    expire: function () {
      this.describeResourceList()
    },
    selectResourceInput: function () {
      this.describeResourceList()
    }
  },
  created () {
    this.describeResourceList() // 获取资源列表接口
    this.describeDDoSPolicy() // 获取高级策略列表
  },
  methods: {
    // 选择运行状态
    statusChange () {
      this.describeResourceList()
    },
    // 1.1.获取资源列表接口
    describeResourceList () {
      this.loading = true
      let params = {
        Version: '2018-07-09',
        Business: 'net'
      }
      // 1.1.0.条件搜索调用（即将过期）
      if (this.expire) {
        params['Expire'] = 1
      }
      // 1.1.1.条件搜索调用（运行状态）
      if (this.runningStatus.length > 0) {
        // 勾选框参数
        for (let a in this.runningStatus) {
          params['Status.' + a] = this.runningStatus[a]
        }
      }
      // 1.1.2.条件搜索调用（输入框参数）
      if (this.selectResourceInput != '') {
        if (this.listSelect == 'resourceList') {
          params['Name'] = this.selectResourceInput
        } else if (this.listSelect == 'businessList') {
          params['Domain'] = this.selectResourceInput
        }
      }
      // console.log(params);
      // 执行调用接口--------------
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(params, res);
        this.tableData = res.Response.ServicePacks
        this.totalItems = res.Response.Total
        this.tableData.forEach(val => {
          val.Record.forEach(item => {
            if (item.Key == 'Id') {
              // 1.防护等级
              let params = {
                Version: '2018-07-09',
                Business: 'net',
                Id: item.Value,
                Method: 'get'
              }
              this.axios.post(Modify_Level, params).then(res => {
                const obj = {
                  Key: 'DDoSLevel',
                  Value: res.Response.DDoSLevel
                }
                val.Record.push(obj)
              })
              // 2.高级防护策略
              let params2 = {
                Version: '2018-07-09',
                Business: 'net',
                Id: item.Value
              }
              this.axios.post(GET_SPolicy, params2).then(res => {
                if (res.Response.DDosPolicyList.length == 0) {
                  const obj2 = {
                    Key: 'SPolicyName',
                    Value: '-'
                  }
                  const obj2Id = {
                    Key: 'SPolicyId',
                    Value: '0000'
                  }
                  val.Record.push(obj2)
                  val.Record.push(obj2Id)
                } else {
                  const obj2 = {
                    Key: 'SPolicyName',
                    Value: res.Response.DDosPolicyList[0].PolicyName
                  }
                  const obj2Id = {
                    Key: 'SPolicyId',
                    Value: res.Response.DDosPolicyList[0].PolicyId
                  }
                  val.Record.push(obj2)
                  val.Record.push(obj2Id)
                }
              })
              // 3.转发规则个数（接入配置）
              let params3 = {
                Version: '2018-07-09',
                Business: 'net',
                Id: item.Value
              }
              this.axios.post(L4_RULES, params3).then(res => {
                if (res.Response.Error === undefined) {
                  const obj3 = {
                    Key: 'L4RulesTotal',
                    Value: res.Response.Total
                  }
                  val.Record.push(obj3)
                  // this.tableDataBegin = res.Response.Rules;
                } else {
                  let ErrTips = {}
                  let ErrOr = Object.assign(ErrorTips, ErrTips)
                  this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: 'error',
                    showClose: true,
                    duration: 0
                  })
                }
              })
            } else if (item.Key == 'GroupIpList') {
              // IP格式化175.97.143.121-tpe-bgp-300-1;175.97.142.153-tpe-bgp-100-1 >>> 175.97.142.153(中国台湾BGP)
              let IPText = []
              let ipArr = item.Value.split(';')
              for (const key in ipArr) {
                if (ipArr.hasOwnProperty(key)) {
                  const element = ipArr[key]
                  let ipDetailArr = element.split('-')
                  IPText.push(
                    ipDetailArr[0] +
                      '(' +
                      (ipDetailArr[1] == 'tpe' ? '中國台灣' : ipDetailArr[1]) +
                      (ipDetailArr[2] == 'bgp' ? 'BGP' : ipDetailArr[2]) +
                      ')'
                  )
                }
              }
              const obj = {
                Key: 'IPText',
                Value: IPText
              }
              val.Record.push(obj)
            } else if (item.Key == 'AutoRenewFlag') {
              // 自动续费
              val.RenewFlag = item.Value == '1'
            }
          })
        })
        // 此接口调用完，调用1.2接口
        this.describeRuleSets()
      })
    },
    // 1.2.获取资源的规则数接口
    describeRuleSets () {
      let params = {
        Version: '2018-07-09',
        Business: 'net'
      }
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].Record.length; j++) {
          if (this.tableData[i].Record[j].Key == 'Id') {
            params['IdList.' + i] = this.tableData[i].Record[j].Value
          }
        }
      }
      this.axios.post(RULESETS_CONT, params).then(res => {
        // console.log(params, res)
        this.ruleSets = res.Response
        // 循环tableData
        this.tableData.forEach(item => {
          // 循环Record
          item.Record.forEach(map => {
            // 判断获取Key=Id的值
            if (map.Key == 'Id') {
              // 循环ruleSets
              this.ruleSets.L4RuleSets.forEach(ruleSet => {
                // 循环Record2
                ruleSet.Record.forEach(map2 => {
                  // 判断获取Key=Id的值
                  if (map2.Key == 'Id') {
                    // 判断resourceId和ruleSetId是否相等
                    if (map.Value == map2.Value) {
                      // 再次循环Record2，获取RuleNameList的值
                      ruleSet.Record.forEach(map3 => {
                        if (map3.Key == 'RuleNameList') {
                          // 将RuleNameList的值添加进tableData
                          item.RuleNameList = map3.Value
                        }
                      })
                    }
                  }
                })
              })
              if (item.RuleNameList === undefined) {
                item.RuleNameList = '-'
              }
            } else if (map.Key == 'AutoReturn') {
              if (map.Value == '1') {
                item.AutoReturn = true
              } else if (map.Value == '0') {
                item.AutoReturn = false
              }
            }
          })
        })
        this.loading = false
        // console.log(this.tableData);
      })
    },
    // 1.3.获取回源IP段
    describeSourceIpSegment (resourceId) {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: resourceId
      }
      this.axios.post(SOURCEIPSEGMENT_DESCRIBE, params).then(res => {
        // console.log(res);
        if (res.Response.Error === undefined) {
          this.ipSegment = res.Response.Data
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 1.4.资源实例重命名接口
    createInstanceName (resourceId, name) {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: resourceId,
        Name: name
      }
      this.axios.post(INSTANCENAME_CONT, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList()
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 1.5.获取DDoS高级策略
    describeDDoSPolicy () {
      let params = {
        Version: '2018-07-09',
        Business: 'net'
      }
      this.axios.post(GET_SPolicy, params).then(res => {
        this.tableDataPolicy = res.Response.DDosPolicyList
      })
    },
    // 1.6.资源列表-自动续费
    modifyResourceRenewFlag (id, renewFlag) {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: id,
        RenewFlag: renewFlag // RenewFlag是Integer	自动续费标记（0手动续费；1自动续费；2到期不续费）
      }
      this.axios.post(MODIFY_RENEWFLAG, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeResourceList()
        } else {
          let ErrTips = {
            DryRunOperation: '多傳了DryRun參數的操作',
            FailedOperation: '操作失敗',
            InternalError: '內部錯誤',
            InvalidParameter: '無效參數',
            InvalidParameterValue: '無效參數值',
            LimitExceeded: '超過配額限制',
            MissingParameter: '缺少參數錯誤',
            ResourceInUse: '資源被占用',
            ResourceNotFound: '資源不存在',
            ResourceUnavailable: '資源不可用'
          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },

    // 自动回切
    changeSwitch (val) {
      // this.$message('暂无接口调用');
    },
    // 自动续费
    renewFlagSwitch (row) {
      for (let i = 0; i < row.Record.length; i++) {
        if (row.Record[i].Key == 'Id') {
          this.modifyResourceRenewFlag(
            row.Record[i].Value,
            row.RenewFlag == true ? 1 : 0
          )
          return
        }
      }
    },
    // 跳转详情页面
    toDetailResourse (scopeRow) {
      // 获取回源IP段
      scopeRow.Record.forEach(item => {
        if (item.Key == 'Id') {
          this.describeSourceIpSegment(item.Value)
        }
      })
      this.dialogResouseList = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scopeRow)
      })
    },
    // 关闭资源详情页面
    closeListDetail (arr) {
      if (arr[2] != '') {
        // 编辑确定
        this.createInstanceName(arr[1], arr[2])
      }
      this.dialogResouseList = arr[0]
    },

    // 条件搜索
    doFilter () {
      // 调用查询接口
      this.describeResourceList()
    },

    //跳转新购页面
    newBuy() {
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, '_blank');
    },
    // 转发规则个数设置按钮
    toAccest (record) {
      let resId = ''
      for (const i in record) {
        if (record.hasOwnProperty(i)) {
          const element = record[i]
          if (element.Key == 'Id') {
            resId = element.Value
          }
        }
      }
      this.$router.push({
        path: '/AccessConfig',
        query: {
          resourceId: resId
        }
      })
    },
    // 升级按钮
    upgradeModel () {
      this.diaologUpgradeModel = true
    },
    // 升级弹框关闭按钮
    closeUpgradeModel (isShow) {
      this.diaologUpgradeModel = isShow
    },
    // 续费弹框
    RenewModel () {
      this.doalogRenewModel = true
    },
    // 续费弹框关闭按钮
    closeRenewModel (isShow) {
      this.doalogRenewModel = isShow
    },
    // 防护配置点击按钮
    configModel (ddosRes) {
      this.modifyDDosRes = ddosRes
      this.dialogConfigModel = true
    },
    // 防护配置弹框关闭按钮
    closeConfigModel (isShow) {
      this.dialogConfigModel = isShow
      this.describeResourceList()
    },
    // 查看报表跳转页面
    lookReportList () {
      this.$router.push({
        path: '/IpProfessional'
      })
    },

    // 分页开始
    handleSizeChange (val) {
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, // 组件自带监控当前页码
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    }
  }
}
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
</style>
