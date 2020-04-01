<template>
  <div class="Dashboard-wrap">
    <Header title="Dashboard">
      <el-select v-model="DashboardID" :placeholder="$t('CVM.Dashboard.qxz')" style="margin:0 20px 0 40px;width:260px"
        @change="getDescribeDashboardView">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          <!-- @mouseover.native="mouseoverSelect(item.value)" -->
          <!-- <span style="float: left">{{ item.label }}</span>
            <div class="slot-button-div" style="float: right" v-if="item.value == selectButtonShow">
               <el-button type="text" style="padding: 0" @click="handleRenameControl(item.value)">重命名</el-button>
               <el-button type="text" style="padding: 0">删除</el-button>
            </div> -->
        </el-option>
      </el-select>
      <a class="addPanel" style="font-size:12px;font-weight:20" @click="addPanel">{{ $t("CVM.Dashboard.tjjkmb") }}</a>
      <AddPanel ref="addPanel" :dialogVisible.sync="panelFlag" :options.sync="options" @cancel="cancel" @save="save" />
      <!-- 重名名监控面板弹框 -->
      <RenameControlPanel ref="renameControlPanel" :name="this.renameControlName" />
    </Header>
    <div class="Dashboard-main" v-loading="mainLoading">
      <div class="explain" v-show="this.ViewList.length">
        <!-- <p>{{ $t("CVM.Dashboard.jhtjsj") }}</p> -->
        <p>{{ $t("CVM.Dashboard.zcbbdc") }}</p>
      </div>
      <div class="headBtn">
        <el-button v-show="this.ViewList.length" type="primary" @click="openCreate()">
          {{ $t("CVM.Dashboard.tjjktb") }}
        </el-button>
        <div style="float: right">
          <DashboardTimeDropDown :TimeArr="TimeArr" :Datecontrol="true" :Graincontrol="false" :Difference="'H'"
            v-on:switchData="GetDat" v-on:refresh="refresh" style="float: left" />
          <!-- <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'D'"
            v-on:switchData="GetDat" /> -->
        </div>
      </div>
      <div class="chart" v-if="this.ViewList.length">
        <div class="chartList" v-for="(item, index) in ViewList" :key="item.ViewID" v-loading="chartsLoading">
          <div class="chartItem">
            <p>
              <b>
                <!-- {{$t('CVM.Dashboard.mx')}}-CPU利用率 -->
                {{ item.DescName }}
                <!-- <span style="color:#888">（%）</span> -->
              </b>
              <el-row>
                <!-- <i class="el-icon-zoom-in"></i>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>{{$t('CVM.Dashboard.fztb')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.Dashboard.bj')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.clBload.dcsj')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.Dashboard.dctp')}}</el-dropdown-item>
                    <el-dropdown-item @click="deleteChart">{{$t('CVM.Casegrouping.sc')}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                <el-button type="text" @click="handleDelDashBoardView(item.DescName, item.ViewID)">删除</el-button>  
              </el-row>
            </p>
            <!-- <div class="line" :ref="'echart' + item.ViewID" :id="'echart'+item.ViewID">
            </div> DataPoints-->
            <!-- <div  v-for="(item,i) in seriesArr" :key='i'>
              <EcharS class="line" :time="time" :series='item.series' :period='period' />
            </div>  -->
            <EcharS class="line" :time="time" :series="item.DataPoints" :period="period"
              v-if="item.DataPoints.length !== 0" :echartsIndex="item.echartsIndex"
              @changeDataIndex="changeDataIndex" />
            <div class="empty" v-else>
              暫無數據
            </div>
          </div>
          <div class="open">
            <p>
              <span>共 {{ item.DataPoints.length }}
                {{ $t("CVM.Dashboard.ygsl") }}</span>
              <span v-show="item.openChartFlag">,{{$t("CVM.Dashboard.jkmx")}}( {{item.showTime}} )</span>
            </p>
            <p>
              <span>
                <a @click="exportExcel(item.ViewID)">{{ $t("CVM.Dashboard.dc") }}</a>
                <el-popover placement="left-start" width="200" trigger="hover">
                  <p>{{ $t("CVM.Dashboard.elPop1") }}</p>
                  <p>{{ $t("CVM.Dashboard.elPop2") }}</p>
                  <i class="el-icon-info" slot="reference" style="color:#888"></i>
                </el-popover>
              </span>
              <a v-show="!item.openChartFlag" @click="openChart(index)"
                style="margin-left:30px;">{{ $t("CVM.Dashboard.zk") }}</a>
              <a v-show="item.openChartFlag" @click="retractChart(index)" style="margin-left:30px;">收起</a>
            </p>
          </div>
          <div class="chartContent" v-show="item.openChartFlag">
            <el-table :data="item.Instances" :id="'exportTable'+item.ViewID">
              <el-table-column prop="" label="" width="50">
                <template slot-scope="scope">
                  <div :style='"width: 10px;height: 10px;border-radius: 50%;background:" + scope.row.bgColor'></div>
                </template>
              </el-table-column>
              <el-table-column prop="" label="ID" width="">
                <template slot-scope="scope">
                  <a style="color: #006eff" @click="goMonitorDetail(scope.row)">{{
                    scope.row[item.InstanceName]
                  }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="" :label="CMname[item.MetricName[0]]" width="">
                <template slot-scope="scope">
                  <span>{{item.DataPoints.length ? item.DataPoints[scope.$index].data[item.dataIndex] : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Namespace" v-if="false"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 新增控制面板页面 -->
      <div class="emptyControlPanelPage" v-if="this.ViewList.length == 0">
        <p>{{ $t("CVM.Dashboard.zjklbz") }}</p>
        <el-button type="primary" @click="openCreate()">
          {{ $t("CVM.Dashboard.tjjktb") }}
        </el-button>
      </div>
    </div>
    <chart-edit :dialogVisible.sync="showChartEdit"></chart-edit>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import DashboardTimeDropDown from "./components/DashboardTimeDropDown"; //引入时间组件
  import AddPanel from "./components/AddPaneldialog";
  import RenameControlPanel from "./components/renameControlPanel";
  import EcharS from "@/components/public/EcharS";
  import {
    GET_DASHBOARD_LIST, DESCRIBE_DASHBOARD_VIEWS,
    GET_MONITOR_DATA, DELETE_DASHBOARD_VIEW
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    CMname
  } from '../CMdia';
  import ChartEdit from "./components/ChartEdit"; //公共错误码
  import moment from "moment";
  import XLSX from "xlsx";
  import FileSaver from "file-saver";
  export default {
    name: "Dashboard",
    data() {
      return {
        TimeArr: [{
            name: "近1小時",
            Time: "realTime",
            TimeGranularity: [{
              value: "60",
              label: "1分鐘"
            }]
          },
          {
            name: "近24小時",
            Time: "Nearly_24_hours",
            TimeGranularity: [{
              value: "3600",
              label: "1小時"
            }]
          },
          {
            name: "近7天",
            Time: "Nearly_7_days",
            TimeGranularity: [{
              value: "3600",
              label: "1小時"
            }]
          },
          {
            name: "近15天",
            Time: "Nearly_15_days",
            TimeGranularity: [{
              value: "86400",
              label: "1天"
            }]
          },
          {
            name: "近30天",
            Time: "Nearly_30_days",
            TimeGranularity: [{
              value: "86400",
              label: "1天"
            }]
          }
        ],
        panelFlag: false, //面板开关
        panelValue: "", //监控面板默认值
        options: [],
        openName: "展開", //展开收起名字显示
        openChartFlag: true, //展开图表开关
        retractChartFlag: false,
        value: 13, //时间
        timeBtnRadio: "上海", //事件选择单选
        dialogVisible: false, //购买簡訊弹出框
        region: "",
        tableData: [], //表格数据
        //下拉框
        options1: [{
          value: 0,
          label: "所有專案"
        }],
        options2: [{
          value: 0,
          label: "所有專案"
        }],
        options3: [],
        //下拉框选中的值
        value1: "所有專案",
        value2: "所有專案",
        value3: "",
        showChartEdit: false, // 添加图表的弹窗
        selectButtonShow: "", // 下拉框按钮是否展示
        renameControlName: "", // 重命名监控面板名称
        showEmptyControlPanel: false, // 是否展示空的监控面板
        ViewList: [], // 监控面板数组
        DashboardID: "", // 展示面板的ID
        DashboardName: "",
        period: "60", // echarts展示粒度
        time: [], // 横坐标时间
        startEnd: {
          StartTime: "",
          EndTime: ""
        },
        seriesArr: [
          // 纵坐标
          {
            series: [{
              type: "line",
              data: [0.1, 0.2, 0.3, 0.1, 0.2, 0.3, 0.1, 0.2, 0.3]
            }]
          }
        ],
        mainLoading: false,
        chartsLoading: false,
        CMname: CMname,
        colorArr: ["#2072d9", "#fff2cc", "#ffd966", "#f1c232", "#9fc5e8", "#3d85c6",
          "#00ff00", "#008bff", "#980000", "#1c4587",  '#B738CD', '#EA2000']
      };
    },
    components: {
      ChartEdit,
      Header,
      DashboardTimeDropDown,
      AddPanel,
      RenameControlPanel,
      EcharS
    },
    created() {
      // console.log(this.CMname)
      this.createGetDashboardList(); // 先 获取Dashboard列表数据 再 获取监控面板视图
      if (this.$router.query) {
        this.DashboardID = this.$router.query.DashboardID; // 路由传过来的
      }
    },
    watch: {
      DashboardID(newVal) {
        // this.selectShowControlPanel(newVal);
        // console.log(newVal, "newVal");
        // this.DashboardID = newVal;
        this.mainLoading = true;
        this.chartsLoading = true;
        this.getDescribeDashboardView(); // 监控面板展示
      },
      DashboardName() {
        this.mainLoading = true;
        this.chartsLoading = true;
        this.getDescribeDashboardView(); // 监控面板展示
      }
    },
    methods: {
      // 从展开的列表ID 跳转到别的路由
      goMonitorDetail(row) {
        // console.log(row, 'row');
        let name = "";
        let query = {
          id: row.Id
        };
        if (row.Namespace == 'qce/cvm') { // 雲服务器详情监控
          name = "CMCVMdetails"
        } else if (row.Namespace == 'QCE/VPNGW') { // vpn网关详情
          name = "CMVPNdetails"
        } else if (row.Namespace == 'qce/vpnx') { // VPN通道列表
          name = "CMVPNTdetails"
        } else if (row.Namespace == 'qce/nat_gateway') { // NAT网关列表
          name = "NATdetails"
        } else if (row.Namespace == 'qce/dcg') { // 专线网关列表
          name = "PrivateGatewaydetails"
        } else if (row.Namespace == 'qce/redis') { // 获取RESIS列表
          name = "Redisdetails"
        } else if (row.Namespace == 'qce/dcx') { // 专线通道列表
          name = "Privatedetails"
        } else if (row.Namespace == 'qce/cos') { // 对象存储
          name = "CMobjdetails"
        } else if (row.Namespace == 'qce/dc') { // 物理专线
          name = "Physicsdetails"
        } else if (row.Namespace == 'qce/cdb') { // mysql列表
          name = "CMMysqldetails"
        } else if (row.Namespace == 'qce/block_storage') { // 云硬盘
          name = "Diskdetails"
        }

        this.$router.push({
          name: name,
          query: query
        });
      },
      GetDat(data) {
        // console.log(data, '时间控件')
        this.time = data[1].XAxis; // 横坐标时间
        this.startEnd.StartTime = data[1].StartTIme; // 开始时间
        this.startEnd.EndTime = data[1].EndTIme; //  结束时间
        this.period = data[0]; // 粒度
        this.getAllMonitorData(); // 获取Y轴数据
        // console.log(data, "data", this.startEnd);
        // this.seriesArr.forEach(item => {
        //   item.series[0].data = [];
        //   this.time.forEach(ele => {
        //     item.series[0].data.push(parseInt(Math.random() * 100));
        //   })
        // })
      },
      //设置弹框//新建实例分组
      buyMessgae() {
        // alert("11")
        this.dialogVisible = true;
      },
      //取消设置弹框
      cancel() {
        // this.dialogVisible = false;
        this.panelFlag = false;
      },
      //确定设置弹框
      save() {
        // this.dialogVisible = false;
        this.panelFlag = false;
      },
      openCreate() {
        this.$router.push({
          name: "DashboardCreate",
          query: {
            DashboardID: this.DashboardID
          }
        });
      },
      // panelStatus(flag) {
      //   //父组件事件
      //   this.panelFlag = flag;
      // },
      addPanel() {
        //添加dialog面板
        this.panelFlag = true;
        this.$refs.addPanel.getDashboardList(); // 子组件下拉框数据
      },
      openChart(index) { //展开图表
        // this.openChartFlag = false;
        // this.retractChartFlag = true;
        this.ViewList[index].openChartFlag = true;
      },
      retractChart(index) { //收起
        // this.openChartFlag = true;
        // this.retractChartFlag = false;
        this.ViewList[index].openChartFlag = false;
      },
      exportChart() {
        //导出图表
        // alert("導出");
      },
      deleteChart() {
        //删除图表
      },
      //获取数据
      GetData(data) {
        // console.log(data);
      },
      selectShowControlPanel(value) {
        // 选择展示那个ID的监控面板
      },
      // 初始获取下拉列表，获取首个监控面板id
      async createGetDashboardList() {
        let params = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        await this.axios
          .get(GET_DASHBOARD_LIST, {
            params: params
          })
          .then(res => {
            if (res.Response.Error === undefined) {
              let options = [];
              options = res.Response.DashboardList.map(ele => {
                return {
                  value: ele.DashboardID,
                  label: ele.DescName
                };
              });
              this.options = options;
              if (this.options.length > 0) {
                this.DashboardID = this.options[0].value; // 首次加载 展示面板的ID
                this.DashboardName = this.options[0].label;
              } else {
                this.DashboardID = "";
                this.DashboardName = "";
              }
            } else {
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation": "請求未授權。請參考 CAM 文件對鑒權的說明。",
                DryRunOperation: "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
                FailedOperation: "操作失敗。",
                "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
                "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
                "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
                "FailedOperation.AlertTriggerRuleDeleteFailed": "刪除触发條件失敗。",
                "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
                "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
                "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
                "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
                "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
                "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
                "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
                "FailedOperation.DivisionByZero": "被除數為0。",
                "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重複。",
                "FailedOperation.ServiceNotEnabled": "服務未啟用，開通服務後方可使用。",
                InternalError: "內部錯誤。",
                "InternalError.ExeTimeout": "執行超時。",
                InvalidParameter: "參數錯誤。",
                "InvalidParameter.InvalidParameter": "參數錯誤。",
                "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                InvalidParameterValue: "無效的參數值。",
                LimitExceeded: "超過配額限制。",
                "LimitExceeded.MetricQuotaExceeded": "指標數量達到配額限制，禁止含有未註冊指標的請求。",
                MissingParameter: "缺少參數錯誤。",
                ResourceInUse: "資源被佔用。",
                ResourceInsufficient: "資源不足。",
                ResourceNotFound: "資源不存在。",
                ResourceUnavailable: "資源不可用。",
                ResourcesSoldOut: "資源售罄。",
                UnauthorizedOperation: "未授權操作。",
                UnknownParameter: "未知參數錯。",
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
      // 获取Dashboard 下拉选框数据
      async getDashboardList() {
        let params = {
          Version: "2018-07-24",
          Module: "monitor"
          // ProductType: '',
          // CustomID: ''
        };
        await this.axios
          .get(GET_DASHBOARD_LIST, {
            params: params
          })
          .then(res => {
            if (res.Response.Error === undefined) {
              let options = [];
              options = res.Response.DashboardList.map(ele => {
                return {
                  value: ele.DashboardID,
                  label: ele.DescName
                };
              });
              this.options = options;
              // console.log(this.options, "options");
            } else {
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation": "請求未授權。請參考 CAM 文件對鑒權的說明。",
                "DryRunOperation": "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
                "FailedOperation": "操作失敗。",
                "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
                "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
                "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
                "FailedOperation.AlertTriggerRuleDeleteFailed": "刪除触发條件失敗。",
                "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
                "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
                "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
                "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
                "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
                "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
                "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
                "FailedOperation.DivisionByZero": "被除數為0。",
                "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重複。",
                "FailedOperation.ServiceNotEnabled": "服務未啟用，開通服務後方可使用。",
                InternalError: "內部錯誤。",
                "InternalError.ExeTimeout": "執行超時。",
                InvalidParameter: "參數錯誤。",
                "InvalidParameter.InvalidParameter": "參數錯誤。",
                "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                InvalidParameterValue: "無效的參數值。",
                LimitExceeded: "超過配額限制。",
                "LimitExceeded.MetricQuotaExceeded": "指標數量達到配額限制，禁止含有未註冊指標的請求。",
                MissingParameter: "缺少參數錯誤。",
                ResourceInUse: "資源被佔用。",
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
      // 下拉框显示按钮
      mouseoverSelect(itemVal) {
        this.selectButtonShow = itemVal;
        // console.log(this.selectButtonShow, "this.selectButtonShow", itemVal);
      },
      // 重命名
      handleRenameControl(name) {
        this.$refs.renameControlPanel.show = true;
        this.renameControlName = name;
      },
      // 获取监控面板视图
      async getDescribeDashboardView() {
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
          DashboardID: this.DashboardID
        };
        await this.axios
          .get(DESCRIBE_DASHBOARD_VIEWS, {
            params: params
          })
          .then(res => {
            this.mainLoading = false;
            this.chartsLoading = false;
            if (res.Response.Error === undefined) {
              const ViewList = JSON.parse(JSON.stringify(res.Response.ViewList)); // 监控面板视图数组
              ViewList.forEach((ele, index) => {
                ele.openChartFlag = false; // 列表展开收起的标志
                ele.dataIndex = 0; // 折线图下面需要展示的数值的索引
                ele.echartsIndex = index; // echarts图在Viewlist中的索引
                // console.log(this.time[this.time.length - 1], 'a');
                ele.showTime = this.time[this.time.length - 1]// echarts图标需要展示的时间
                let newInstances = [];
                ele.Instances.forEach((el,i) => {
                  // newInstances.push(JSON.parse(el));
                  let newEl = JSON.parse(el);
                  newEl.Namespace = ele.Namespace;
                  newEl.bgColor = this.colorArr[i] ? this.colorArr[i] : '#fff';
                  // 加一个id
                  if (ele.Namespace == 'qce/cvm') {
                    newEl.Id = newEl.unInstanceId; // 与Namespace相对应
                  } else if (ele.Namespace == 'QCE/VPNGW') {
                    newEl.Id = newEl.vpnGwId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/vpnx') {
                    newEl.Id = newEl.vpnConnId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/nat_gateway') {
                    newEl.Id = newEl.natId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/dcg') {
                    newEl.Id = newEl.directConnectGatewayId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/redis') {
                    newEl.Id = newEl.instanceid; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/dcx') {
                    newEl.Id = newEl.directConnectConnId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/cos') {
                    newEl.Id = newEl.bucket; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/dc') {
                    newEl.Id = newEl.directConnectId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/cdb') {
                    newEl.Id = newEl.uInstanceId; // 与Namespace相对应
                  } else if (ele.Namespace == 'qce/block_storage') {
                    ele.InstanceName = 'diskId'; // 与Namespace相对应
                    newEl.Id = newEl.diskId; // 与Namespace相对应
                  }
                  newInstances.push(newEl);
                });
                ele.Instances = newInstances;
                ele.Meta = JSON.parse(ele.Meta);
                ele.DataPoints = []; // 占位，让vue响应
                if (ele.Namespace == 'qce/cvm') {
                  ele.InstanceName = 'unInstanceId'; // 与Namespace相对应
                } else if (ele.Namespace == 'QCE/VPNGW') {
                  ele.InstanceName = 'vpnGwId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/vpnx') {
                  ele.InstanceName = 'vpnConnId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/nat_gateway') {
                  ele.InstanceName = 'natId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/dcg') {
                  ele.InstanceName = 'directConnectGatewayId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/redis') {
                  ele.InstanceName = 'instanceid'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/dcx') {
                  ele.InstanceName = 'directConnectConnId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/cos') {
                  ele.InstanceName = 'bucket'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/dc') {
                  ele.InstanceName = 'directConnectId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/cdb') {
                  ele.InstanceName = 'uInstanceId'; // 与Namespace相对应
                } else if (ele.Namespace == 'qce/block_storage') {
                  // ele.Id = ele.Instances.length ? ele.Instances[0].diskId : '';
                  ele.InstanceName = 'diskId'; // 与Namespace相对应
                }
              });
              this.ViewList = ViewList;
              // console.log(this.ViewList, 'this.ViewList');
              this.getAllMonitorData(); // 获取echarts数据
            } else {
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation": "請求未授權。請參考 CAM 文件對鑒權的說明。",
                DryRunOperation: "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
                FailedOperation: "操作失敗。",
                "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
                "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
                "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
                "FailedOperation.AlertTriggerRuleDeleteFailed": "刪除触发條件失敗。",
                "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
                "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
                "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
                "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
                "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
                "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
                "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
                "FailedOperation.DivisionByZero": "被除數為0。",
                "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重複。",
                "FailedOperation.ServiceNotEnabled": "服務未啟用，開通服務後方可使用。",
                InternalError: "內部錯誤。",
                "InternalError.ExeTimeout": "執行超時。",
                InvalidParameter: "參數錯誤。",
                "InvalidParameter.InvalidParameter": "參數錯誤。",
                "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                InvalidParameterValue: "無效的參數值。",
                "LimitExceeded.MetricQuotaExceeded": "指標數量達到配額限制，禁止含有未註冊指標的請求。",
                MissingParameter: "缺少參數錯誤。",
                ResourceInUse: "資源被佔用。",
                ResourceInsufficient: "資源不足。",
                ResourceNotFound: "資源不存在。",
                ResourceUnavailable: "資源不可用。",
                ResourcesSoldOut: "資源售罄。",
                UnauthorizedOperation: "未授權操作。",
                UnknownParameter: "未知參數錯誤。",
                UnsupportedOperation: "操作不支持。"
              };
            }
          });
      },
      // 获取监控面板echarts数据
      getSingleMonitorData(
        Namespace, MetricName, Period, StartTime, EndTime, Instances, index, InstanceName
      ) {
        let params = {
          Version: "2017-03-12", Namespace, MetricName, Period, StartTime: StartTime,EndTime: EndTime,
        };
        let color = this.colorArr;
        if (Instances.length <= 10) {
          var DataPoints = []; // 取出这个空数组
          if (Instances.length != 0) {
            Instances.forEach((ele, i) => {
              params["Dimensions." + i + '.' + InstanceName] = ele[InstanceName];
            });
          } else {
            const item = this.ViewList[index];
            item.DataPoints = [];
            // this.$set(this.ViewList, index, item);
            return;
          }
          this.axios
            .get(GET_MONITOR_DATA, {params: params})
            .then(res => {
            this.mainLoading = false;
            this.chartsLoading = false;
            if (res.Response.Error === undefined) {
              res.Response.DataPoints.forEach((ele, i) => {
                DataPoints.push({
                  type: "line",
                  connectNulls: true,
                  data: ele.Points.map((item,i) => {
                    // 存在坐标为null的情况，应该是接口问题
                    return item === null ? "" : item
                  }),
                  // data: ele.Points,
                  name: ele.Dimensions[InstanceName], // Id名对应的Id
                  itemStyle: {
                    normal: {
                      color: color[i] ? color[i] : color[i % 10],
                      lineStyle: {
                        color: color[i] ? color[i] : color[i % 10]
                      }
                    }
                  }
                });
              });
              // this.$set(this.ViewList, index, item);
              } else {
                let ErrTips = {
                  'InternalError': 'InternalError',
                  'InvalidParameterValue': 'there are no valid dimession values'
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
          const item = this.ViewList[index];
          item.DataPoints = DataPoints;
        } else { // 大于10条数据
          var DataPoints = []; // 取出这个空数组
          let DimensionsArr = []; // Dimensions数组外的数组
          DimensionsArr[0] = {}; DimensionsArr[1] = {};
          Instances.forEach((ele, i) => {
            if (i < 10) {
              DimensionsArr[0]["Dimensions." + i + '.' + InstanceName] = ele[InstanceName];
            } else if (i>=10) {
              let s = i - 10;
              DimensionsArr[1]["Dimensions." + s + '.' + InstanceName] = ele[InstanceName];
            }
          });
          // 两次调用获取Y轴数据接口
          DimensionsArr.forEach((item, j) => {
            let oldParams = {};
            oldParams = JSON.parse(JSON.stringify(params));
            let newParams = Object.assign(oldParams, item);

            this.axios.get(GET_MONITOR_DATA, {params: newParams})
              .then(res => {
                this.mainLoading = false;
                this.chartsLoading = false;
                if (res.Response.Error === undefined) {
                  res.Response.DataPoints.forEach((ele, i) => {
                    DataPoints.push({
                      type: "line",
                      connectNulls: true,
                      data: ele.Points.map((item,i) => {
                        // 存在坐标为null的情况，应该是接口问题
                        return item === null ? "" : item
                      }),
                      // data: ele.Points,
                      name: ele.Dimensions[InstanceName], // Id名对应的Id
                      itemStyle: {
                        normal: {
                          color: color[i] ? color[i] : color[i % 10],
                          lineStyle: {
                            color: color[i] ? color[i] : color[i % 10]
                          }
                        }
                      }
                    });
                  });
                } else {
                  let ErrTips = {
                    'InternalError': 'InternalError',
                    'InvalidParameterValue': 'there are no valid dimession values'
                  };
                  let ErrOr = Object.assign(ErrorTips, ErrTips);
                  this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                  });
                }
              }); // .then结束
          });// foreach结束
          const item = this.ViewList[index];
          item.DataPoints = DataPoints;
        }
        
      },
      // 获取监控面板echarts数据 old
      // async getSingleMonitorData(
      //   Namespace,
      //   MetricName,
      //   Period,
      //   StartTime,
      //   EndTime,
      //   Instances,
      //   index,
      //   InstanceName
      // ) {
      //   let params = {
      //     Version: "2017-03-12",
      //     Namespace,
      //     MetricName,
      //     Period,
      //     StartTime: StartTime,
      //     EndTime: EndTime,
      //   };
      //   let color = this.colorArr;
      //   if (Instances.length != 0) {
      //     Instances.forEach((ele, i) => {
      //       params["Dimensions." + i + '.' + InstanceName] = ele[InstanceName];
      //     });
      //   } else {
      //     const item = this.ViewList[index];
      //     item.DataPoints = [];
      //     // this.$set(this.ViewList, index, item);
      //     return;
      //   }
      //   await this.axios
      //     .get(GET_MONITOR_DATA, {
      //       params: params
      //     })
      //     .then(res => {
      //       this.mainLoading = false;
      //       this.chartsLoading = false;
      //       if (res.Response.Error === undefined) {
      //         var DataPoints = []; // 取出这个空数组
      //         res.Response.DataPoints.forEach((ele, i) => {
      //           DataPoints.push({
      //             type: "line",
      //             connectNulls: true,
      //             data: ele.Points.map((item,i) => {
      //               // 存在坐标为null的情况，应该是接口问题
      //               return item === null ? "" : item
      //             }),
      //             // data: ele.Points,
      //             name: ele.Dimensions[InstanceName], // Id名对应的Id
      //             itemStyle: {
      //               normal: {
      //                 color: color[i] ? color[i] : color[i % 10],
      //                 lineStyle: {
      //                   color: color[i] ? color[i] : color[i % 10]
      //                 }
      //               }
      //             }
      //           });
      //         });
      //         const item = this.ViewList[index];
      //         item.DataPoints = DataPoints;
      //         // this.$set(this.ViewList, index, item);
      //       } else {
      //         let ErrTips = {
      //           'InternalError': 'InternalError',
      //           'InvalidParameterValue': 'there are no valid dimession values'
      //         };
      //         let ErrOr = Object.assign(ErrorTips, ErrTips);
      //         this.$message({
      //           message: ErrOr[res.Response.Error.Code],
      //           type: "error",
      //           showClose: true,
      //           duration: 0
      //         });
      //       }
      //     });
      // },
      getAllMonitorData() {
        this.chartsLoading = true;
        this.ViewList.forEach((ele, index) => {
          // Instances的数组长度大于0，才去请求echarts的Y轴数据
          if (ele.Instances.length > 0) {
            // Y轴数据
            this.getSingleMonitorData(
              ele.Namespace,
              ele.MetricName[0],
              this.period,
              this.startEnd.StartTime,
              this.startEnd.EndTime,
              ele.Instances,
              index,
              ele.InstanceName
            );
          }
        });
      },
      refresh() {
        // this.chartsLoading = true;
        this.getAllMonitorData();
      },
      //导出表格
      exportExcel(ViewID) {
        // console.log(ViewID)
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable" + ViewID));
        // console.log(wb);
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
            "1300560919-monitor-data" + ".xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") {
            // console.log(e, wbout);
          }
        }
        return wbout;
      },
      // 改变监控图标实时展示的列表值
      changeDataIndex(echartsIndex, dataIndex, name) {
        // console.log(this.ViewList, echartsIndex, dataIndex);
        this.ViewList[echartsIndex]['dataIndex'] = dataIndex;
        this.ViewList[echartsIndex]['showTime'] = name; // 展示的时间
      },
      // 删除监控面板
      handleDelDashBoardView(DescName, ViewID) {
        this.$confirm('确定删除' + DescName + '?', {
          confirmButtonText: '确定', cancelButtonText: '取消', center: true
        }).then(() => {
          this.deleteDashboardView(ViewID); // 删除监控面板接口
          this.mainLoading = true;
        }).catch(() => {});
      },
      // 删除监控面板
      async deleteDashboardView(ViewID) {
        let params = { Version: "2018-07-24", Module: "monitor", ViewID };
        await this.axios.get(DELETE_DASHBOARD_VIEW, {
            params: params
          }).then(res => {
            if (res.Response.Error === undefined) {
              this.mainLoading = true;
              this.chartsLoading = true;
              this.getDescribeDashboardView(); // 获取监控面板视图
            } else {
              let ErrTips = {
                "FailedOperation":	"操作失败。",
                "InternalError":	"内部错误。",
                "InvalidParameter":	"参数错误。",
                "UnknownParameter":	"未知参数错误。",
                "UnsupportedOperation":	"操作不支持。"
              };
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
      }

      // //取消
      // cancel() {
      //   this.dialogVisible = false;
      // },
      // //确定
      // save() {
      //   this.dialogVisible = false;
      // }
    }
  };

</script>

<style lang="scss" scoped>
  .chartContent {
    width: 100%;
    // height: 200px;
    padding: 20px;
    background: #ffffff;
  }

  .Dashboard-wrap>>>.el-progress-bar__outer,
  .Dashboard-wrap>>>.el-progress-bar__inner {
    border-radius: 0;
  }

  .Dashboard-wrap>>>.el-dialog__body {
    padding: 20px;
    box-sizing: border-box;
  }

  .Dashboard-wrap>>>.el-button,
  .Dashboard-wrap>>>.el-input__inner,
  .Dashboard-wrap>>>.el-input-number__increase,
  .Dashboard-wrap>>>.el-input-number__decrease {
    height: 30px;
    border-radius: 0;
    padding-top: 0;
    line-height: 30px;
    font-size: 12px;
  }

  .Dashboard-wrap>>>.el-input-number__increase,
  .Dashboard-wrap>>>.el-input-number__decrease {
    top: 5px;
    border-top: 1px #dcdfe6 solid;
    border-bottom: 1px #dcdfe6 solid;
  }

  .Dashboard-wrap>>>.explain {
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

  .Dashboard-wrap>>>.headBtn {
    // display: flex;
    // justify-content: space-between;
    margin: 20px 0;

    >div {
      i {
        margin: 0 10px;
      }
    }
  }

  .Dashboard-wrap>>>.chart {
    width: 100%;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    overflow: hidden;

    >div.chartList {
      width: 32%;
      margin-bottom: 10px;
      float: left;
      margin-right: 1%;

      .chartItem {
        padding: 20px;
        background: #ffffff;
        border: 1px solid #e2e1e1;

        p {
          display: flex;
          justify-content: space-between;

          i {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 800;
            color: #888888;
            margin-left: 10px;
          }

          i:hover {
            background: #f3f0f0;
          }
        }

        .empty {
          width: 100%;
          height: 300px;
          background: rgb(248, 248, 248);
          display: flex;
          justify-content: center;
          align-items: center;
          // margin-top: 20px;
        }
      }

      .open {
        background: #f2f2f2;
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        border: 1px solid #e2e1e1;
        border-top: 0;
      }
    }
  }

  .Dashboard-wrap>>>.el-button {
    line-height: 28px;
  }

  .Dashboard-wrap {
    a {
      color: #006eff;
      cursor: pointer;
    }

    .cursor {
      cursor: pointer;
    }

    .Dashboard-main {
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
    }
  }

  .Dashboard-wrap .emptyControlPanelPage {
    clear: both;

    p {
      margin: 100px 0 30px;
      text-align: center;
    }

    .el-button {
      margin: 0 auto;
      display: block;
    }
  }

</style>
