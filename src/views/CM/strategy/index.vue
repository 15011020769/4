<template>
  <div class="strategy-wrap">
    <Header title="告警策略">
      <div class="strategy-filter">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="100px"
          size="mini"
          label-position="left"
        >
          <div>
            <el-form-item label="策略名稱">
              <el-input v-model="formInline.strategy_name"></el-input>
            </el-form-item>

            <el-form-item>
              <div style="display: flex;">
                <el-select
                  filterable
                  v-model="formInline.product_name"
                  class="select-option"
                  disabled
                >
                  <el-option
                    v-for="item in formInline.product_kind"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <el-select
                  filterable
                  v-model="formInline.productArr"
                  class="select-option-tow"
                  v-if="formInline.product_name === '1'"
                  multiple
                >
                  <el-option
                    v-for="item in productOptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.viewName"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <el-select
                  filterable
                  v-model="productValue"
                  class="select-option-tow"
                  v-if="formInline.product_name === '2'"
                  @change="changeMonitor"
                >
                  <el-option
                    v-for="item in productOptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.viewName"
                    label-width="40px"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查詢</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </Header>
    <div class="overview-main"></div>
    <div class="table">
      <p class="addBtn">
        <el-row>
          <el-button type="primary" @click="addCreate">新增</el-button>
          <el-button v-if="multipleSelection.length > 0" @click="AllDelete"
            >刪除</el-button
          >
          <el-button v-else disabled>刪除</el-button>
          <el-button v-if="ModifyAlarm" @click="ModifyAlarmBtn()"
            >修改告警管道</el-button
          >
          <el-button v-if="!ModifyAlarm" disabled>修改告警管道</el-button>
        </el-row>
        <el-row class="iconBtn">
          <!-- <i class="el-icon-setting" @click="buyMessgae"></i> -->
          <i class="el-icon-refresh" @click="ListInit"></i>
          <i class="el-icon-download" @click="exportExcel"></i>
        </el-row>
      </p>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loadShow"
        height="450"
        @selection-change="handleSelectionChange"
        id="exportTable"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="策略名稱">
          <template slot-scope="scope">
            <a class="defaultDialog" @click="defaultClick(scope.row)">{{
              scope.row.GroupName
            }}</a>
            <i @click="NameModify(scope.row)" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="觸發條件">
          <template slot-scope="scope">
            <el-popover placement="right" width="500" trigger="hover">
              <div class="popover-box">
                <p class="text-color">
                  指標告警（{{
                    scope.row.IsUnionRule === 0 ? "任意" : "所有"
                  }}）：
                </p>
                <div
                  v-for="(i, item) in scope.row.Conditions"
                  :key="item"
                  class="trigger-condition"
                >
                  <p>
                    {{ i.MetricShowName }}
                    {{ i.CalcType | CalcType }} {{ i.CalcValue
                    }}{{ i.Unit }}，持续{{ i.ContinueTime / 60 }}分钟，
                    <span v-if="i.AlarmNotifyType != 1"
                      >按{{ i.AlarmNotifyPeriod | AlarmNotifyPeriod
                      }}{{
                        i.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                      }}
                    </span>
                    <span v-else>
                      按週期指数递增重复告警
                    </span>
                  </p>
                </div>
                <p class="text-color" v-if="scope.row.EventConditions">
                  事件告警：
                </p>
                <div
                  v-for="j in scope.row.EventConditions"
                  class="trigger-condition"
                >
                  <p>
                    {{ j.EventShowName }}，{{
                      j.AlarmNotifyPeriod > 0 ? "重複告警" : "不重複告警"
                    }}
                  </p>
                </div>
              </div>
              <div slot="reference">
                <div
                  v-for="item in scope.row.Conditions"
                  class="trigger-condition"
                >
                  <p>
                    {{ item.MetricShowName }}
                    {{ item.CalcType | CalcType }} {{ item.CalcValue
                    }}{{ item.Unit }}，持續{{ item.ContinueTime / 60 }}分鍾，
                    <span v-if="item.AlarmNotifyType != 1"
                      >按{{ item.AlarmNotifyPeriod | AlarmNotifyPeriod
                      }}{{
                        item.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                      }}
                    </span>
                    <span v-else>
                      按周期指数递增重复告警
                    </span>
                  </p>
                </div>
                <div
                  v-for="(items, indexs) in scope.row.EventConditions"
                  :key="indexs"
                  class="trigger-condition"
                >
                  <p>
                    {{ items.EventShowName }}，{{
                      items.AlarmNotifyPeriod > 0 ? "重複告警" : "不重複告警"
                    }}
                  </p>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="所屬專案">
          <template slot-scope="scope">
            {{ scope.row.ProjectId | ProjectName }}
          </template>
        </el-table-column>
        <el-table-column label="策略類型">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover">
              <div>
                <p>
                  <span
                    >策略類型： <span v-if="scope.row.IsDefault == 1">預設</span
                    >{{ scope.row.Name }}</span
                  >
                </p>
                <p
                  v-if="
                    scope.row.IsDefault == 0 &&
                      scope.row.CanSetDefault === false
                  "
                  style="color:#888;"
                >
                  此告警策略綁定的物件是實力組，當前不支持設置爲預設策略
                </p>
              </div>
              <div slot="reference">
                <div
                  :class="{ strong: scope.row.IsDefault == 1 }"
                  @mouseenter="enter(scope.$index)"
                  @mouseleave="leave()"
                >
                  <span v-if="scope.row.IsDefault == 1">預設</span
                  >{{ scope.row.Name }}
                  <p
                    v-show="edit && scope.$index == current"
                    v-if="scope.row.IsDefault != 1 && scope.row.CanSetDefault"
                  >
                    <a href="javascript:;" @click="SetDefault(scope.row)"
                      >設置預設</a
                    >
                  </p>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="已啓用/實例數">
          <template slot-scope="scope">
            <div>{{ scope.row.NoShieldedSum }} / {{ scope.row.UseSum }}</div>
            <div
              class="group-color"
              v-if="scope.row.InstanceGroup != undefined"
            >
              組：{{ scope.row.InstanceGroup.GroupName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最後修改">
          <template slot-scope="scope">
            <div>{{ scope.row.LastEditUin }}</div>
            <div>{{ scope.row.UpdateTime | formatDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="告警管道">
          <template slot-scope="scope">
            <div v-if="scope.row.ReceiverInfos != undefined">
              <div v-for="(i, x) in scope.row.ReceiverInfos" :key="x">
                <p v-if="i.ReceiverGroupList.length > 0">
                  接收組：{{ i.ReceiverGroupList.length }}個
                </p>
                <p v-if="i.ReceiverUserList.length > 0">
                  接收人：{{ i.ReceiverUserList.length }}個
                </p>
                <p
                  v-if="
                    i.ReceiverUserList.length === 0 &&
                      i.ReceiverGroupList.length === 0
                  "
                >
                  接收組：0個
                </p>
                <p>
                  有效期：{{ i.StartTime | EndTime }} -
                  {{ i.EndTime | EndTime }}
                </p>
                <p v-if="i.NotifyWay.length > 0">
                  管道：<span v-for="(j, k) in i.NotifyWay" :key="k"
                    >{{ j | NotifyWay
                    }}<i v-if="i.NotifyWay.length - 1 > k">、</i></span
                  >
                </p>
                <p v-else>管道：-</p>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="告警啓停">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsOpen"
              active-color="#006eff"
              inactive-color="#888"
              @change="AlarmStart(scope.row, scope.$index)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn" @click="Copy(scope.row)"
              >複製</el-button
            >
            <el-tooltip
              content="預設策略不支持刪除，可釋放所有資源或設置新的預設策略後將此轉爲非預設策略"
              placement="left"
              effect="light"
              v-if="scope.row.IsDefault != 0"
            >
              <el-button type="text" class="deleteBtn-color deleteBtn"
                >刪除</el-button
              >
            </el-tooltip>
            <el-tooltip
              content="釋放所有資源後支持刪除"
              placement="left"
              effect="light"
              v-else-if="scope.row.UseSum != 0"
            >
              <el-button type="text" class="deleteBtn-color deleteBtn"
                >刪除</el-button
              >
            </el-tooltip>
            <el-button
              type="text"
              class="deleteBtn"
              v-else
              @click="Delete(scope.row)"
              >刪除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁 -->
      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 點擊設置 -->
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
    <!-- 修改名稱 -->
    <el-dialog
      title="修改告警策略名稱"
      :visible.sync="modifyNameDialogVisible"
      width="500px"
      custom-class="dialog-box"
    >
      <div class="edit-dialog">
        <el-input
          size="small"
          placeholder="請輸告警策略名稱，20字以內"
          v-model="GroupName"
          @input="EditTips"
          maxlength="20"
        ></el-input>
        <p v-if="tipsShow">告警策略名稱不能爲空</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NameSure">確定</el-button>
        <el-button @click="modifyNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 刪除 -->
    <el-dialog
      title="策略刪除確認"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>您確定要刪除此條告警策略嗎？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteSure()">確定</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 刪除策略 -->
    <el-dialog
      title="刪除策略"
      :visible.sync="deleteAllDialogVisible"
      width="600px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>
        <p>您已選擇{{ multipleSelection.length }}條策略，詳情如下:</p>
        <div class="delete-table">
          <el-table
            :data="multipleSelection"
            style="width: 100%"
            height="200px"
          >
            <el-table-column label="策略名">
              <template slot-scope="scope">
                {{ scope.row.GroupName }}
              </template>
            </el-table-column>
            <el-table-column label="備注">
              <template slot-scope="scope">
                <p
                  class="text-color-red"
                  v-if="scope.row.IsDefault != 0"
                  id="text-color-red"
                >
                  <span>預設策略,無法刪除</span>
                  <el-tooltip
                    content="預設策略不支持刪除，可釋放所有資源或設置新的預設策略後將此轉爲非預設策略"
                    placement="left"
                    effect="light"
                  >
                    <i class="el-icon-info ml5"></i>
                  </el-tooltip>
                </p>

                <p
                  class="text-color-red"
                  v-else-if="scope.row.UseSum != 0"
                  id="text-color-red"
                >
                  <span>已關聯物件,無法刪除</span>
                  <el-tooltip
                    content="釋放所有資源後支持刪除"
                    placement="left"
                    effect="light"
                  >
                    <i class="el-icon-info ml5"></i>
                  </el-tooltip>
                </p>

                <p v-else class="text-color-grey">可刪除</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="showIsAll">
          <p class="tips">確定刪除所選可刪除策略？</p>
          <p class="tips-grey">刪除後,策略配置將徹底銷毀</p>
        </div>
        <div v-if="showIsDefault">
          <p class="tips">無可刪除策略</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!showIsDefault" @click="DeleteSure"
          >確定</el-button
        >
        <el-button disabled v-if="showIsDefault">確定</el-button>
        <el-button @click="deleteAllDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改告警管道 -->
    <el-dialog
      title="修改告警管道"
      :visible.sync="ModifyDialogVisible"
      width="600px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>
        <p>
          <el-tooltip
            effect="light"
            content="告警管道爲空的策略不支持修改"
            placement="top"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
          您已選擇{{ multipleSelection.length }}條策略，其中{{
            arr.length
          }}條支持修改。接收管道統計如下:
        </p>
        <div class="modify-box">
          <div>
            <p>
              <span>郵件</span>
              <span>已開通數:{{ emailOpen }},未開通數:{{ emailClose }}</span>
            </p>
            <el-select v-model="emailVal" placeholder="請選擇">
              <el-option
                v-for="item in emailOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <p>
              <span>簡訊</span>
              <span>已開通數:{{ SMSOpen }},未開通數:{{ SMSClose }}</span>
            </p>
            <el-select v-model="SMSVal" placeholder="請選擇">
              <el-option
                v-for="item in SMSOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- <div>
            <p>
              <span>微信</span>
              <span>已開通數:{{ wechatOpen }},未開通數:{{ wechatClose }}</span>
            </p>
            <el-select v-model="wechatVal" placeholder="請選擇">
              <el-option
                v-for="item in wechatOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <p>
              <span>電話</span>
              <span>已開通數:{{ callOpen }},未開通數:{{ callClose }}</span>
            </p>
            <el-select v-model="callVal" placeholder="請選擇">
              <el-option
                v-for="item in callOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ModifyNotifySure">確定</el-button>
        <el-button @click="ModifyDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警啓停 -->
    <el-dialog
      title="告警操作確認"
      :visible.sync="startStop"
      width="500px"
      custom-class="tke-dialog"
      :before-close="CelStart"
    >
      <div>
        <p>確定{{ statue }}告警策略【{{ GroupName }}】</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureStart()">確定</el-button>
        <el-button @click="CelStart()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Header from "./components/Head";
import Dialog from "./components/dialog";
import FileSaver from "file-saver";
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type_str";
import XLSX from "xlsx";
import moment from "moment";
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_ALARM_LIST,
  ALL_PROJECT,
  CM_GROUPING_LIST_TYPE,
  CM_GROUPING_ALARM_START,
  CM_ALARM_DELETE,
  CM_ALARM_SET_DEFAULT,
  CM_GROUPING_LIST_EDIT,
  CM_ALARM_MODIFY_NOTIFY,
  CVM_LIST, //云伺服器列表
  NAT_LIST, //NAT网关列表
  VPN_LIST, //VPN网关列表
  VPNTD_LIST, //VPN通道列表
  DCG_LIST, //专线网关列表
  MYSQL_LIST, //MYSQL列表
  REDIS_LIST, //REDIS列表
  Physics_LIST, //物理专线列表
  Private_LIST, //专线通道列表
  OBJ_LIST, //对象存储列表
  DISK_LIST //云硬碟列表
} from "@/constants";
var project = [];
export default {
  name: "strategy",
  data() {
    return {
      checkAllProduct: false,
      checkedCities: [],
      cities: [
        {
          value: 0,
          name: "産品類型"
        },
        {
          value: 1,
          name: "策略類型"
        }
      ],
      //産品
      productOptions: [
        {
          label: "雲伺服器",
          viewName: "cvm_device"
        },
        {
          label: "雲硬碟",
          viewName: "BS"
        },
        {
          label: "VPN閘道",
          viewName: "VPN_GW"
        },
        {
          label: "VPN通道",
          viewName: "vpn_tunnel"
        },
        {
          label: "NAT閘道",
          viewName: "nat_tc_stat"
        },
        {
          label: "專線閘道",
          viewName: "DC_GW"
        },
        {
          label: "MYSQL",
          viewName: "cdb_detail"
        },
        {
          label: "Redis",
          viewName: "REDIS-CLUSTER"
        },
        {
          label: "專用通道",
          viewName: "dcchannel"
        },
        {
          label: "物理專線",
          viewName: "dcline"
        },
        {
          label: "物件儲存",
          viewName: "COS"
        }
      ],
      isIndeterminate: true,
      formInline: {
        product_name: "1", //策略
        productArr: [], //産品類型列表
        product_kind: [
          {
            id: "1",
            name: "産品類型"
          }
          // {
          //   id: "2",
          //   name: "策略類型"
          // }
        ], //産品/.策略類型
        strategy_kind: [
          {
            value: 0,
            name: "請選擇"
          }
        ], //用戶/組
        strategy_name: "", //策略名稱
        alarm: "", //告警對象
        alarm_list: [
          {
            name: "告警物件1"
          }
        ], //告警對象陣列
        user: "用戶組", //用戶
        group: "", //組
        user_kind: [
          {
            value: "0",
            name: "用戶組"
          },
          {
            vale: "1",
            name: "用戶名"
          }
        ], //用戶類型數據
        kind_list: [
          {
            value: "0",
            name: "全選"
          },
          {
            value: "1",
            name: "誤刪"
          },
          {
            value: "2",
            name: "測試誤刪"
          }
        ], //用户名类型数据
        product_value: "", //产品
        strategy_value: "" //策略
      },
      tableData: [], //表格数据
      loadShow: true,
      edit: false,
      current: "", // 编辑
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      operationFlag: -1, //按钮禁用开关
      dataListLoading: false,
      dialogVisible: false, //设置弹出框
      defaultIconFlag: false, //鼠标事件
      deleteDialogVisible: false,
      deleteAllDialogVisible: false,
      deleteTableData: [],
      ModifyAlarm: false,
      ModifyDialogVisible: false,
      modifyNameDialogVisible: false,
      editSearchVal: "",
      tipsShow: false,
      project,
      GroupId: "",
      GroupName: "",
      startStop: false,
      statue: "停用",
      copyDialogVisible: false,
      IsOpen: false,
      inputVal: "",
      indexs: "",
      multipleSelection: [],
      arr: [],
      arrOpen: [],
      arrClose: [],
      showIsDefault: false,
      showIsAll: true,
      // 郵件
      emailVal: "1",
      emailOpt: [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ],
      emailOpen: 0,
      emailClose: 0,
      // 簡訊
      SMSVal: "1",
      SMSOpt: [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ],
      SMSOpen: 0,
      SMSClose: 0,
      // 微信
      wechatVal: "1",
      wechatOpt: [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ],
      wechatOpen: 0,
      wechatClose: 0,
      // 電話
      callVal: "1",
      callOpt: [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ],
      callOpen: 0,
      callClose: 0,
      searchParam: {},
      projectId: 0,
      productValue: "",
      loading: true,
      dataList: [], //查詢告警對象列表
      selectStrategyList: [], //選中的告警對象列表
      headConfig: {
        title1: "",
        title2: "",
        title3: "",
        title4: ""
      },
      monitorNumber: "",
      DiskType: {
        CLOUD_BASIC: "普通雲硬碟",
        CLOUD_PREMIUM: "高效能雲硬碟",
        CLOUD_SSD: "SSD雲硬碟"
      },
      vpcConnState: {
        PENDING: "生產中",
        AVAILABLE: "運行中",
        DELETING: "刪除中"
      },
      natStatu: {
        PENDING: "生產中",
        DELETING: "刪除中",
        AVAILABLE: "運行中",
        UPDATING: "升級中",
        FAILED: "失敗"
      },
      DiskUsage: {
        SYSTEM_DISK: "系統盤",
        DATA_DISK: "數據盤"
      },
      isShowPopover: false
    };
  },
  components: {
    Header,
    Dialog,
    ProductTypeCpt
  },
  mounted() {
    this.ListInit();
    this.Project();
  },
  methods: {
    passData(data) {
      console.log("data", data);
      this.isShow = false;
      this.productListData = data;
      this.productValue = data.productValue;
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
    },
    Type_loading(val) {
      this.loading = val;
    },
    async ListInit() {
      this.loadShow = true;
      let params = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Module: "monitor",
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      if (this.formInline.strategy_name !== "") {
        params.Like = this.formInline.strategy_name;
      }
      if (this.formInline.productArr.length > 0) {
        for (let i = 0; i < this.formInline.productArr.length; i++) {
          params["ViewNames." + i] = this.formInline.productArr[i];
        }
      }
      if (this.formInline.product_name === "2") {
        params["ViewNames.0"] = this.productValue;
      }
      await this.axios.post(CM_ALARM_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          var _tableData = res.Response.GroupList;
          this.total = res.Response.Total;
          let param = {
            Version: "2018-07-24",
            Module: "monitor"
          };
          this.axios.post(CM_GROUPING_LIST_TYPE, param).then(res => {
            if (res.Response.Error === undefined) {
              let Conditions = res.Response.Conditions;

              for (let i in _tableData) {
                for (let j in Conditions) {
                  if (_tableData[i].ViewName === Conditions[j].PolicyViewName) {
                    _tableData[i]["Name"] = Conditions[j].Name;
                  }
                }
              }
              this.tableData = _tableData;
              console.log("tableData", this.tableData);
              this.loadShow = false;
            } else {
              this.loadShow = false;
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation":
                  "請求未授權。請參考 CAM 文件對鑒權的說明。",
                DryRunOperation:
                  "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
                FailedOperation: "操作失敗。",
                "FailedOperation.AlertFilterRuleDeleteFailed":
                  "刪除過濾條件失敗。",
                "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
                "FailedOperation.AlertPolicyDescribeFailed":
                  "告警策略查詢失敗。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
                "FailedOperation.AlertTriggerRuleDeleteFailed":
                  "刪除觸發條件失敗。",
                "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
                "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
                "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
                "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
                "FailedOperation.DbTransactionBeginFailed":
                  "數據庫事務開始失敗。",
                "FailedOperation.DbTransactionCommitFailed":
                  "數據庫事務提交失敗。",
                "FailedOperation.DimQueryRequestFailed":
                  "請求維度查詢服務失敗。",
                "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
                "FailedOperation.DuplicateName": "名字重複。",
                "FailedOperation.ServiceNotEnabled":
                  "服務未啓用，開通服務後方可使用。",
                InternalError: "內部錯誤。",
                "InternalError.ExeTimeout": "	執行超時。",
                InvalidParameter: "	參數錯誤。",
                "InvalidParameter.InvalidParameter": "參數錯誤。",
                "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                InvalidParameterValue: "無效的參數值。",
                LimitExceeded: "超過配額限制。",
                "LimitExceeded.MetricQuotaExceeded":
                  "指標數量達到配額限制，禁止含有未注冊指標的請求。",
                MissingParameter: "缺少參數錯誤。",
                ResourceInUse: "資源被占用。",
                ResourceInsufficient: "資源不足。",
                ResourceNotFound: "資源不存在。",
                ResourceUnavailable: "資源不可用。",
                ResourcesSoldOut: "資源售罄。",
                UnauthorizedOperation: "未授權操作。",
                UnknownParameter: "未知參數錯誤。",
                UnsupportedOperation: "操作不支持。"
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
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文件對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。UnknownParameter	未知參數錯誤。",
            UnsupportedOperation: "操作不支持。"
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
    // 專案
    Project() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          project = arr;
        } else {
          let ErrTips = {
            InternalError: "內部錯誤",
            UnauthorizedOperation: "未授權操作"
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
    // 告警啓停
    AlarmStart(row, index) {
      console.log(row);
      this.startStop = true;
      this.GroupId = row.GroupId;
      this.GroupName = row.GroupName;
      if (row.IsOpen) {
        this.statue = "開啟";
      } else {
        this.statue = "停用";
      }
      this.IsOpen = !row.IsOpen;
      this.indexs = index;
    },
    SureStart() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.GroupId
      };
      if (this.IsOpen === false) {
        param["IsShielded"] = 0;
      } else {
        param["IsShielded"] = 1;
      }
      this.axios.post(CM_GROUPING_ALARM_START, param).then(res => {
        if (res.Response.Error === undefined) {
          this.startStop = false;
          this.ListInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文件對鑒權的說明。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。"
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
    CelStart() {
      this.startStop = false;
      this.tableData[this.indexs].IsOpen = !this.tableData[this.indexs].IsOpen;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.arr = [];
      console.log(this.multipleSelection);
      for (let i in this.multipleSelection) {
        if (this.multipleSelection[i].IsDefault == 0) {
          this.arr.push(this.multipleSelection[i]);
        }
      }
      if (this.arr.length > 0) {
        this.ModifyAlarm = true;
      } else {
        this.ModifyAlarm = false;
      }
      if (this.multipleSelection.length === 0) {
        this.ModifyAlarm = false;
      }
    },
    handleSelectionSte(val) {
      this.selectStrategyList = val;
    },
    onSubmit() {
      this.ListInit();
    },
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        // this.pageIndex++;
      }
    },
    // 分頁
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每頁 ${val} 條`);
      this.pageSize = val;
      this.ListInit();
    },
    //設置彈框
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消設置彈框
    cancel() {
      this.dialogVisible = false;
    },
    //確定設置彈框
    save() {
      this.dialogVisible = false;
    },
    defaultClick(row) {
      console.log(row);
      this.$router.push({
        name: "strategyCreateDetail",
        query: {
          groupId: row.GroupId,
          viewName: row.ViewName
        }
      });
    },
    //思路：便利妳所有的數據，給每條都加上defaultIconFlag：false屬性，當妳劃過的時候就可以改成true
    mouseoverDefault() {
      //鼠標劃入事件
      this.defaultIconFlag = true;
    },
    mouseoutDefault() {
      //鼠標移除事件
      this.defaultIconFlag = false;
    },
    addCreate() {
      // alert('/strategy/create');
      this.$router.push({ path: "/strategy/create" });
    },
    // 修改名稱
    NameModify(row) {
      this.modifyNameDialogVisible = true;
      this.GroupId = row.GroupId;
      this.GroupName = row.GroupName;
    },
    NameSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.GroupId,
        GroupType: 1,
        Key: "groupName",
        Value: this.GroupName
      };
      this.axios.post(CM_GROUPING_LIST_EDIT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.modifyNameDialogVisible = false;
          this.ListInit();
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。"
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
    // 複製
    Copy(row) {
      this.$router.push({
        path: "/strategy/create",
        query: {
          groupId: row.GroupId
        }
      });
    },
    // 刪除
    Delete(row) {
      this.deleteDialogVisible = true;
      this.GroupId = row.GroupId;
      this.multipleSelection = row;
    },
    // 全部刪除
    AllDelete() {
      this.deleteAllDialogVisible = true;
      this.$nextTick(() => {
        let dom = document.getElementsByClassName("text-color-red");
        if (dom.length === this.multipleSelection.length) {
          this.showIsDefault = true;
          this.showIsAll = false;
        }
        if (dom.length < this.multipleSelection.length) {
          this.showIsDefault = false;
          this.showIsAll = true;
        }
      });
    },
    DeleteSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        Region: "ap-taipei"
      };
      if (!Array.isArray(this.multipleSelection)) {
        param["GroupId.0"] = this.GroupId;
      } else {
        for (let i in this.multipleSelection) {
          param["GroupId." + i] = this.multipleSelection[i].GroupId;
        }
      }
      this.axios.post(CM_ALARM_DELETE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.deleteDialogVisible = false;
          this.deleteAllDialogVisible = false;
          this.ListInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文件對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "	數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。"
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
    // 策略類型
    enter(index) {
      this.edit = true;
      this.current = index;
    },
    leave() {
      this.edit = false;
      this.current = null;
    },
    // 設置默認
    SetDefault(row) {
      let param = {
        GroupId: row.GroupId,
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(CM_ALARM_SET_DEFAULT, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
          this.ListInit();
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
    // 修改名稱
    EditTips() {
      if (this.GroupName == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
      if (this.GroupName.length === 20) {
        this.$message({
          message: "名稱不能超過20個字",
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    // 修改告警管道
    ModifyAlarmBtn() {
      this.ModifyDialogVisible = true;
      // console.log(this.arr[0].ReceiverInfos[0].NotifyWay);
      // for (let i = 0; i < this.arr.length; i++) {
      //   if (this.arr[i]) {
      //   }
      // }
      // 郵件
      this.emailOpt = [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ];
      this.emailOpen = 0;
      this.emailClose = 0;
      this.emailVal = "1";
      // 簡訊
      this.SMSOpt = [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ];
      this.SMSOpen = 0;
      this.SMSClose = 0;
      this.SMSVal = "1";
      // 微信
      this.wechatOpt = [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ];
      this.wechatOpen = 0;
      this.wechatClose = 0;
      this.wechatVal = "1";
      // 電話
      this.callOpt = [
        {
          value: "1",
          label: "-(保持不變)"
        }
      ];
      this.callOpen = 0;
      this.callClose = 0;
      this.callVal = "1";
      for (let i in this.arr) {
        if (this.arr[i].ReceiverInfos[0].NotifyWay.length > 0) {
          for (let k in this.arr[i].ReceiverInfos[0].NotifyWay) {
            console.log(this.arr[i].ReceiverInfos[0].NotifyWay);
            // if(this.arr[i].ReceiverInfos[0].NotifyWay.toString())
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "EMAIL") {
              this.emailOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "SMS") {
              this.SMSOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "WECHAT") {
              this.wechatOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "CALL") {
              this.callOpen++;
            }
          }
        } else {
          this.emailClose = this.arr.length - this.emailOpen;
          this.SMSClose = this.arr.length - this.SMSOpen;
          this.wechatClose = this.arr.length - this.wechatOpen;
          this.callClose = this.arr.length - this.callOpen;
        }
      }
      this.emailClose = this.arr.length - this.emailOpen;
      this.SMSClose = this.arr.length - this.SMSOpen;
      this.wechatClose = this.arr.length - this.wechatOpen;
      this.callClose = this.arr.length - this.callOpen;
      if (this.emailOpen > 0) {
        this.emailOpt.push({
          value: "2",
          label: "關閉已開通的" + this.emailOpen + "條策略"
        });
      }
      if (this.emailClose > 0) {
        this.emailOpt.unshift({
          value: "0",
          label: "開啓未開通的" + this.emailClose + "條策略"
        });
      }

      if (this.SMSOpen > 0) {
        this.SMSOpt.push({
          value: "2",
          label: "關閉已開通的" + this.SMSOpen + "條策略"
        });
      }
      if (this.SMSClose > 0) {
        this.SMSOpt.unshift({
          value: "0",
          label: "開啓未開通的" + this.SMSClose + "條策略"
        });
      }

      if (this.wechatOpen > 0) {
        this.wechatOpt.push({
          value: "2",
          label: "關閉已開通的" + this.wechatOpen + "條策略"
        });
      }
      if (this.wechatClose > 0) {
        this.wechatOpt.unshift({
          value: "0",
          label: "開啓未開通的" + this.wechatClose + "條策略"
        });
      }

      if (this.callOpen > 0) {
        this.callOpt.push({
          value: "2",
          label: "關閉已開通的" + this.callOpen + "條策略"
        });
      }
      if (this.callClose > 0) {
        this.callOpt.unshift({
          value: "0",
          label: "開啓未開通的" + this.callClose + "條策略"
        });
      }
    },
    ModifyNotifySure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      for (let i in this.arr) {
        param["GroupNotifyInfos." + i + ".GroupId"] = this.arr[i].GroupId;

        if (this.emailVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "EMAIL";
        } else if (this.emailVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("EMAIL")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "EMAIL";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "";
          }
        } else if (this.emailVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "";
        }
        if (this.SMSVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "SMS";
        } else if (this.SMSVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("SMS")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "SMS";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "";
          }
        } else if (this.SMSVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "";
        }
        if (this.wechatVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "WECHAT";
        } else if (this.wechatVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("WECHAT")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "WECHAT";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "";
          }
        } else if (this.wechatVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "";
        }
        if (this.callVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "CALL";
        } else if (this.callVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("CALL")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "CALL";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "";
          }
        } else if (this.callVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "";
        }

        for (let j in this.arr[i].ReceiverInfos[0].NotifyWay) {
          if (this.emailVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "EMAIL") {
              param["GroupNotifyInfos." + i + ".NotifyWay.0"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.SMSVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "SMS") {
              param["GroupNotifyInfos." + i + ".NotifyWay.1"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.wechatVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "WECHAT") {
              param["GroupNotifyInfos." + i + ".NotifyWay.2"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.callVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "CALL") {
              param["GroupNotifyInfos." + i + ".NotifyWay.3"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
        }
      }
      console.log(param);
      this.axios.post(CM_ALARM_MODIFY_NOTIFY, param).then(res => {
        if (res.Response.Error === undefined) {
          this.ModifyDialogVisible = false;
          this.ListInit();
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。"
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
    // 導出表格
    exportExcel() {
      console.log("exportExcel...");
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          "download(policy).xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  },
  filters: {
    formatDate(value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
    EndTime(val) {
      return moment(val * 1000).format("HH:mm:ss");
    },
    CalcType(value) {
      if (value == 1) {
        return ">";
      } else if (value == 2) {
        return ">=";
      } else if (value == 3) {
        return "<";
      } else if (value == 4) {
        return "<=";
      } else if (value == 5) {
        return "=";
      } else if (value == 6) {
        return "!=";
      } else if (value == 7) {
        return "日同比上漲";
      } else if (value == 8) {
        return "日同比下降";
      } else if (value == 9) {
        return "周同比上漲";
      } else if (value == 10) {
        return "周同比下降";
      } else if (value == 11) {
        return "週期環比上漲";
      } else if (value == 12) {
        return "週期環比下降";
      }
    },
    AlarmNotifyPeriod(val) {
      if ((val / 60 / 60) % 1 == 0) {
        if ((val / 60 / 60 / 24) % 1 == 0) {
          return val / 60 / 60 / 24 + "天";
        } else {
          return val / 60 / 60 + "小時";
        }
      } else if ((val / 60) % 1 == 0) {
        return val / 60 + "分鍾";
      }
    },
    NotifyWay(val) {
      if (val === "EMAIL") {
        return "郵件";
      } else if (val === "SMS") {
        return "簡訊";
      } else if (val === "WECHAT") {
        return "微信";
      } else if (val === "CALL") {
        return "電話";
      }
    },
    ProjectName(val) {
      if (val == 0) {
        return "預設專案";
      }
      for (let i in project) {
        if (val == project[i].projectId) {
          return project[i].projectName;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.strategy-wrap >>> .el-button,
.strategy-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.strategy-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.strategy-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.strategy-wrap >>> .el-form-item__label {
  font-size: 12px;
  color: #888;
  font-weight: 200;
}

// .strategy-wrap >>> .el-table .cell {
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 1;
//   overflow: hidden;
// }
// p.qudaoInfo {
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 1;
//   overflow: hidden;
// }
a {
  color: #006eff;
  cursor: pointer;
}
a:hover {
  border-bottom: 1px solid #006eff;
}
.cursor {
  cursor: pointer;
}
.strategy-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.strategy-wrap >>> .deleteBtn > span {
  color: #666;
}

.strategy-wrap {
  border-radius: 0;
  .strategy-filter {
    width: 100%;
    height: 100px;
    ::v-deep .el-form-item__label {
      padding: 0px;
      font-size: 12px;
      color: #888;
      font-weight: 400;
    }
    ::v-deep .el-input__inner {
      border-radius: 0px;
      height: 30px;
      width: 360px;
    }
    .select-option {
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
        width: 100px;
      }
    }
    .select-option-tow {
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
        width: 250px;
        margin-left: 10px;
      }
      ::v-deep .el-select__tags {
        margin-left: 10px;
      }
    }
  }
  .table {
    padding: 0 20px 20px 20px;

    .addBtn {
      width: 100%;
      height: 55px;
      padding: 20px 10px 0 10px;
      background: rgb(255, 255, 255);
      display: flex;
      justify-content: space-between;
      .iconBtn {
        font-size: 16px;
        color: #888;
        display: flex;
        align-items: center;
        > i {
          margin: 0 10px;
          font-weight: 600;
        }
        i:hover {
          cursor: pointer;
        }
      }
      ::v-deep .el-button {
        border-radius: 0px;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
      }
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
  }

  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
.dialog-box {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  ::v-deep .el-dialog__body {
    padding-top: 15px;
  }
  .delete-table {
    margin-top: 10px;
    ::v-deep .el-table {
      border: 1px solid #ebeef5;
      margin-left: 1px;
    }
  }
  .edit-dialog {
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
      padding: 0 10px;
    }
    p {
      color: #b43537;
      border: 1px solid #f6b5b5;
      background-color: #fcecec;
      width: 258px;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 10px;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
    }
  }
  .tips {
    margin-top: 20px;
    color: #444 !important;
    font-size: 12px;
    vertical-align: middle;
    font-weight: 700;
    .tips-grey {
      color: #bbb;
      font-size: 14px;
    }
  }
  .modify-box {
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding: 10px;
      background-color: #f2f2f2;
      border: 1px solid #ddd;
      ::v-deep .el-input {
        width: 155px;
        margin-right: 30px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0;
        height: 30px;
        width: 155px;
      }
      & > p {
        span {
          &:nth-of-type(1) {
            margin-right: 10px;
            font-size: 14px;
            color: #444;
          }
          &:nth-of-type(2) {
            margin-right: 10px;
            font-size: 12px;
            color: #888;
          }
        }
      }
    }
  }
  .edit-dialog {
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
      padding: 0 10px;
    }
    p {
      color: #b43537;
      border: 1px solid #f6b5b5;
      background-color: #fcecec;
      width: 258px;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 10px;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
    }
  }
}
.popover-box {
  .text-color {
    font-size: 12px;
    color: #888;
    &:nth-of-type(2) {
      margin-top: 20px;
    }
  }
}
.trigger-condition {
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}
.group-color {
  color: #888;
  font-size: 14px;
}
.deleteBtn-color {
  cursor: pointer;
  color: #bbb;
}
.strong {
  font-weight: 700;
}
.text-color-red {
  span {
    color: #e54545;
  }
  i {
    color: #888;
    margin-left: 2px;
  }
}

.text-color-grey {
  color: #bbb;
}
</style>
