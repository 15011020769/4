<template>
  <div class="Dashboard-wrap">
    <Header title="Dashboard">
      <el-select v-model="panelValue" :placeholder="$t('CVM.Dashboard.qxz')" style="margin:0 20px 0 40px;width:260px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            <!-- @mouseover.native="mouseoverSelect(item.value)" -->
            <!-- <span style="float: left">{{ item.label }}</span>
            <div class="slot-button-div" style="float: right" v-if="item.value == selectButtonShow">
               <el-button type="text" style="padding: 0" @click="handleRenameControl(item.value)">重命名</el-button>  
               <el-button type="text" style="padding: 0">删除</el-button>  
            </div> -->
        </el-option>
      </el-select>
      <a class="addPanel" style="font-size:12px;font-weight:20" @click="addPanel">{{$t('CVM.Dashboard.tjjkmb')}}</a>
      <AddPanel :dialogVisible.sync="panelFlag" @cancel="cancel" @save="save" />
      <!-- 重名名监控面板弹框 -->
      <RenameControlPanel ref="renameControlPanel" :name="this.renameControlName" />
    </Header>
    <div class="Dashboard-main">
      <div class="explain">
        <p>{{$t('CVM.Dashboard.jhtjsj')}}</p>
        <p>{{$t('CVM.Dashboard.zcbbdc')}}</p>
      </div>
      <div class="headBtn">
        <el-button v-show="!this.showEmptyControlPanel" type="primary" @click="openCreate()">
          {{$t('CVM.Dashboard.tjjktb')}}
        </el-button>
        <div style="float: right">
          <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='false' :Difference="'H'"
            v-on:switchData="GetDat" style="float: left" />
          <!-- <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'D'"
            v-on:switchData="GetDat" /> -->
          <el-button type="text" style="float: left"><i class="el-icon-refresh"></i></el-button>
          <el-dropdown>
            <el-button type="text" style="float: left;margin-left: 0px;"><i class="el-icon-more"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <div style="padding: 0 10px 10px;color: #bbb">自动刷新</div>
              <el-dropdown-item v-for="item in refreshTimeArr" :key="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="chart" v-if="!this.showEmptyControlPanel">
        <div class="chartList" v-for="item in ViewList" :key="item.ViewID" >
          <div class="chartItem">
            <p>
              <b>
                <!-- {{$t('CVM.Dashboard.mx')}}-CPU利用率 -->
                {{item.DescName}}
                <span style="color:#888">（%）</span>
              </b>
              <el-row>
                <i class="el-icon-zoom-in"></i>
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
                </el-dropdown>
              </el-row>
            </p>
            <!-- <div class="line" :ref="'echart' + item.ViewID" :id="'echart'+item.ViewID">

            </div> -->
            <div  v-for="(item,i) in seriesArr" :key='i'>
              <EcharS class="line" :time="time" :series='item.series' :period='period' />
            </div> 
          </div>
          <div class="open">
            <p>
              <span>共 {{item.Instances.length}} {{$t('CVM.Dashboard.ygsl')}}</span>
              <!-- <span v-show="retractChartFlag">,监控明细（2020-01-10 21:47:40）</span> -->
            </p>
            <p>
              <span v-show="retractChartFlag">
                <a @click="exportChart">{{$t('CVM.Dashboard.dc')}}</a>
                <i class="el-icon-info" style="color:#888"></i>
              </span>
              <a v-show="openChartFlag" @click="openChart" style="margin-left:30px;">{{$t('CVM.Dashboard.zk')}}</a>
              <a v-show="retractChartFlag" @click="retractChart" style="margin-left:30px;">收起</a>
            </p>
          </div>
          <div class="chartContent" v-show="retractChartFlag">
            <el-table :data="item.Instances">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="unInstanceId" label="ID/主机名" width="120">
                <template scope="scope">
                  <span style="color: #006eff">{{scope.row.unInstanceId}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="IP地址" width="120"></el-table-column>
              <el-table-column prop="" label="CPU利用率" width=""></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 新增控制面板页面 -->
      <div class="emptyControlPanelPage" v-if="this.showEmptyControlPanel">
        <p>{{$t('CVM.Dashboard.zjklbz')}}</p>
        <el-button v-if="this.showEmptyControlPanel" type="primary"  @click="openCreate()">
          {{$t('CVM.Dashboard.tjjktb')}}
        </el-button>
      </div>
    </div>
    <chart-edit :dialogVisible.sync="showChartEdit"></chart-edit>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
import AddPanel from "./components/AddPaneldialog";
import RenameControlPanel from "./components/renameControlPanel";
import EcharS from '@/components/public/EcharS'
import {
  GET_DASHBOARD_LIST, DESCRIBE_DASHBOARD_VIEWS
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips";
import ChartEdit from './components/ChartEdit' //公共错误码
export default {
  name: "Dashboard",
  data() {
    return {
      TimeArr: [{
          name: '近1小时',
          Time: 'realTime',
          TimeGranularity: [{
            value: "10000",
            label: "10秒"
          }, ]
        },
        {
          name: '近24小时',
          Time: 'Nearly_24_hours',
          TimeGranularity: [{
            value: "60000",
            label: "1分鐘"
          }, ]
        },
        {
          name: '近7天',
          Time: 'Nearly_7_days',
          TimeGranularity: [{
            value: "3600000",
            label: "1小時"
          }, ]
        },
        {
          name: '近15天',
          Time: 'Nearly_15_days',
          TimeGranularity: [{
            value: "3600000",
            label: "1小時"
          }, ]
        },
        {
          name: '近30天',
          Time: 'Nearly_30_days',
          TimeGranularity: [{
            value: "3600000",
            label: "1小時"
          }, ]
        },
      ],
      panelFlag: false, //面板开关
      panelValue: "", //监控面板默认值
      options: [],
      openName: "展開", //展开收起名字显示
      openChartFlag: true, //展开图表开关
      retractChartFlag: false,
      value: 13, //时间
      timeBtnRadio: "上海", //事件选择单选
      dialogVisible: false, //购买短信弹出框
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
      selectButtonShow: '', // 下拉框按钮是否展示
      renameControlName: '', // 重命名监控面板名称
      refreshTimeArr: [
        { label: '暂停', value: 0}, { label: '30秒', value: 30}, { label: '1分钟', value: 60}, 
        { label: '2分钟', value: 120}, { label: '5分钟', value: 300}, { label: '10分钟', value: 600},
      ],
      showEmptyControlPanel: false, // 是否展示空的监控面板
      ViewList: [], // 监控面板数组
      DashboardID: '', // 展示面板的ID
      period: '10000', // echarts展示粒度
      time: [], // 横坐标时间
      seriesArr: [ // 纵坐标
        {series: [{
            type: 'line',
            stack: '总量',
            data: []
          }],
        },
      ]
      ,
    };
  },
  components: {
    ChartEdit,
    Header,
    TimeDropDown,
    AddPanel,
    RenameControlPanel,
    EcharS
  },
  created() {
    this.createGetDashboardList(); // 先 获取Dashboard列表数据 再 获取监控面板视图
  },
  watch: {
    panelValue(newVal) {
      // this.selectShowControlPanel(newVal);
      this.DashboardID = newVal;
      this.getDescribeDashboardView(); // 监控面板展示
    }
  },
  methods: {
    GetDat(data) {
      console.log(data, 'data')
      this.time = data[1].XAxis; // 横坐标时间
      this.seriesArr.forEach(item => {
        item.series[0].data = [];
        this.time.forEach(ele => {
          item.series[0].data.push(parseInt(Math.random() * 100));
        })
      })
      
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
    openCreate(){
      this.$router.push({
        name:'DashboardCreate'
      })
    },
    // panelStatus(flag) {
    //   //父组件事件
    //   this.panelFlag = flag;
    // },
    addPanel() {
      //添加dialog面板
      this.panelFlag = true;
    },
    openChart() {
      //展开图表
      this.openChartFlag = false;
      this.retractChartFlag = true;
    },
    retractChart() {
      this.openChartFlag = true;
      this.retractChartFlag = false;
    }, //收起
    exportChart() {
      //导出图表
      alert("導出");
    },
    deleteChart() {
      //删除图表
    },
    //获取数据
    GetData(data) {
      // console.log(data);
    },
    selectShowControlPanel(value) { // 选择展示那个ID的监控面板
      
    },
    // 初始获取下拉列表，获取首个监控面板id
    async createGetDashboardList() {
      let params = {
        Version: '2018-07-24', Module: 'monitor',
      }
      await this.axios.get(GET_DASHBOARD_LIST, {
        params: params
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.options = [];
          res.Response.DashboardList.forEach(ele => {
            this.options.push({
              value: ele.DashboardID,
              label: ele.DescName
            });
            this.panelValue = this.options[0].value; // 监控面板默认值
            this.DashboardID = this.options[0].value; // 展示面板的ID
            this.getDescribeDashboardView(); // 获取监控面板视图
          });
          console.log(this.options, 'options');
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation": "请求未授权。请参考 CAM 文档对鉴权的说明。",
            "DryRunOperation": "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            "FailedOperation": "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed": "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DivisionByZero": "被除数为0。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled": "服务未启用，开通服务后方可使用。",
            "InternalError": "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            "InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            "InvalidParameterValue": "无效的参数值。",
            "LimitExceeded": "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded": "指标数量达到配额限制，禁止含有未注册指标的请求。",
            "MissingParameter": "缺少参数错误。",
            "ResourceInUse": "资源被占用。",
            "ResourceInsufficient": "资源不足。",
            "ResourceNotFound": "资源不存在。",
            "ResourceUnavailable": "资源不可用。",
            "ResourcesSoldOut": "资源售罄。",
            "UnauthorizedOperation": "未授权操作。",
            "UnknownParameter": "未知参数错误。",
            "UnsupportedOperation": "操作不支持。"
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
        Version: '2018-07-24',
        Module: 'monitor',
        // ProductType: '',
        // CustomID: ''
      }
      await this.axios.get(GET_DASHBOARD_LIST, {
        params: params
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.options = [];
          res.Response.DashboardList.forEach(ele => {
            this.options.push({
              value: ele.DashboardID,
              label: ele.DescName
            });
            this.panelValue = this.options[0].label;
          });
          console.log(this.options, 'options');
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation": "请求未授权。请参考 CAM 文档对鉴权的说明。",
            "DryRunOperation": "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            "FailedOperation": "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed": "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DivisionByZero": "被除数为0。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled": "服务未启用，开通服务后方可使用。",
            "InternalError": "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            "InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            "InvalidParameterValue": "无效的参数值。",
            "LimitExceeded": "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded": "指标数量达到配额限制，禁止含有未注册指标的请求。",
            "MissingParameter": "缺少参数错误。",
            "ResourceInUse": "资源被占用。",
            "ResourceInsufficient": "资源不足。",
            "ResourceNotFound": "资源不存在。",
            "ResourceUnavailable": "资源不可用。",
            "ResourcesSoldOut": "资源售罄。",
            "UnauthorizedOperation": "未授权操作。",
            "UnknownParameter": "未知参数错误。",
            "UnsupportedOperation": "操作不支持。"
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
    },
    // 下拉框显示按钮
    mouseoverSelect(itemVal) {
       this.selectButtonShow = itemVal;
       console.log(this.selectButtonShow, 'this.selectButtonShow', itemVal);
    },
    // 重命名
    handleRenameControl(name) {
        this.$refs.renameControlPanel.show = true;
        this.renameControlName = name;
    },
    // 获取监控面板视图
    async getDescribeDashboardView() {
        let params = {
          Version: '2018-07-24', Module: 'monitor', DashboardID: this.DashboardID
        }
        await this.axios.get(DESCRIBE_DASHBOARD_VIEWS, {
          params: params
        }).then(res => {
            if (res.Response.Error === undefined) {
              this.ViewList = JSON.parse(JSON.stringify(res.Response.ViewList)); // 监控面板视图数组
              this.ViewList.forEach(ele => {
                let newInstances = [];
                ele.Instances.forEach(el => {
                  newInstances.push(JSON.parse(el));
                });
                ele.Instances = newInstances;
                ele.Meta = JSON.parse(ele.Meta);
                // this.$nextTick(() => {
                  // const chartView = this.$refs['echart' + ele.ViewID];
                  // const chartView = document.getElementById['echart' + ele.ViewID];
                  // const myChart = this.$echarts.init(chartView);
                  // myChart.setOption({
                  //   xAxis: {
                  //       type: 'category',
                  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  //   },
                  //   yAxis: {
                  //       type: 'value'
                  //   },
                  //   series: [{
                  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
                  //       type: 'line',
                  //       smooth: true
                  //   }]
                  // });
                // });
              });
              console.log( this.ViewList, 'Response');
            } else {
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation": "请求未授权。请参考 CAM 文档对鉴权的说明。",
                "DryRunOperation": "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
                "FailedOperation": "操作失败。",
                "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
                "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
                "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
                "FailedOperation.AlertTriggerRuleDeleteFailed": "删除触发条件失败。",
                "FailedOperation.DbQueryFailed": "数据库查询失败。",
                "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
                "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
                "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
                "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
                "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
                "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
                "FailedOperation.DivisionByZero": "被除数为0。",
                "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重复。",
                "FailedOperation.ServiceNotEnabled": "服务未启用，开通服务后方可使用。",
                "InternalError": "内部错误。",
                "InternalError.ExeTimeout": "执行超时。",
                "InvalidParameter": "参数错误。",
                "InvalidParameter.InvalidParameter": "参数错误。",
                "InvalidParameter.InvalidParameterParam": "参数错误。",
                "InvalidParameterValue": "无效的参数值。",
                "LimitExceeded.MetricQuotaExceeded": "指标数量达到配额限制，禁止含有未注册指标的请求。",
                "MissingParameter": "缺少参数错误。",
                "ResourceInUse": "资源被占用。",
                "ResourceInsufficient": "资源不足。",
                "ResourceNotFound": "资源不存在。",
                "ResourceUnavailable": "资源不可用。",
                "ResourcesSoldOut": "资源售罄。",
                "UnauthorizedOperation": "未授权操作。",
                "UnknownParameter": "未知参数错误。",
                "UnsupportedOperation": "操作不支持。",
              }
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
    height: 200px;
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    >div.chartList {
      width: 32%;

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

  .Dashboard-wrap {
    .el-icon-refresh, .el-icon-more {
       font-weight: 700;
       font-size: 16px;
       color: #888888;
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
