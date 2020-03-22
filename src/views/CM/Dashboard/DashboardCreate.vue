<template>
  <div class="room">
    <h2>创建监控图表</h2>
    <div class="top">
      <div class="top-one">
        <span>产品类型</span>
        <Type
          v-on:PassData="PassData"
          :projectId="projectId"
          :searchParam="searchParam"
          :productValue="productValue"
          v-on:loading="Type_loading"
        ></Type>
      </div>
      <div class="top-two">
        <span>数据视图</span>
        <div class="top-two-see">明细试图</div>
      </div>
    </div>
    <h3 style="margin-bottom:20px">配置监控图表</h3>
    <div class="footer">
      <div class="footer-left">
        <div class="footer-left-left">
          <h4>图标配置</h4>
          <div style="margin-top:30px">
            <p style="margin-bottom:10px">图表名称</p>
            <el-input size="mini" v-model="picName" style="max-width:250px"></el-input>
          </div>
          <div style="margin-top:30px">
            <p style="margin-bottom:10px">监控指标</p>
            <el-select
              v-model="target"
              placeholder="请选择"
              size="mini"
              @change="getTarget"
              style="max-width:250px"
            >
              <el-option
                v-for="item in optionTarget"
                :key="item.value"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="footer-left-right">
          <h2>{{picName}}</h2>
          <div>
            <Echarts
              :time="times"
              :series="series"
              :period="'60'"
              :xdata="true"
              style="width:90%;height:400px;margin-left:-15px"
              v-if="rightData.length"
            ></Echarts>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="Cam-right">
          <CamTransferCpt
            style="width:100%"
            :productData="productListData"
            v-on:projectId="projectIds"
            v-on:searchParam="searchParams"
            v-on:multipleSelection="selectDatas"
            :isShowRight="flag"
            v-loading="loading"
          ></CamTransferCpt>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button
        type="primary"
        size="mini"
        @click="createJump()"
        :disabled="!this.rightData.length"
      >确定</el-button>
      <el-button size="mini" @click="jump">取消</el-button>
    </div>
  </div>
</template>
<script>
import Type from "@/views/CM/CM_assembly/product_type";
import CamTransferCpt from "@/views/CM/CM_assembly/CamTransferCpt";
import { CREATDASHBORD, All_MONITOR } from "@/constants";
import Echarts from "./components/echars-line";
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
export default {
  name: "DashboardCreate",
  components: {
    Type,
    CamTransferCpt,
    Echarts
  },
  created() {
    this.StartTime = moment(
      new Date(moment().format()).getTime() - 1000 * 60 * 60
    ).format("YYYY-MM-DD HH:mm:ss");
    this.EndTime = moment(new Date(moment().format()).getTime()).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    this.DashboardID = this.$route.query.DashboardID;
  },
  data() {
    return {
      projectId: 0,
      searchParam: {},
      productValue: "cvm_device",
      optionTarget: [], // 监控指标
      target: "", // 指标
      picName: "",
      productData: [],
      productListData: {},
      MetricName: "", // 监控名
      rightData: "", // 多选数据
      StartTime: "", //开始时间
      EndTime: "", //结束时间
      timeDate: {},
      times: [],
      series: [],
      DashboardID: "",
      DashboardData: [],
      loading: true,
      flag: false
    };
  },
  methods: {
    PassData(data) {
      this.productListData = data
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
      console.log(this.productListData);
      this.Namespace = data.Namespace;
      this.productValue = data.productValue;
      this.optionTarget = data.MetricName;
      this.target = data.MetricName[0]; // 指标
      this.MetricName = data.MetricName[0].value; // 监控名
      this.picName = "明细-" + this.target.label;
      this.rightData = [];
      this.loading = false;
      this.configId = data.id;
    },
    getTarget(val) {
      this.picName = "明细-" + val.label;
      this.MetricName = val.value;
      if(this.rightData.length){
        this.getMonitorList();
      }
      console.log(this.MetricName);
    },
    projectIds(data) {
      console.log(data);
      this.projectId = data;
    },
    searchParams(data) {
      console.log(data);
      this.searchParam = data;
    },
    selectDatas(val) {
      this.rightData = val;
      console.log(val);
      if(this.rightData.length){
        this.getMonitorList();
      }
    },
    Type_loading(val) {
      this.loading = val;
      this.series = [];
    },
    // 创建
    createJump() {
      if (this.rightData.length) {
        this.createDashboard();
        this.$router.push({
          name: "Dashboard",
          query: {
            DashboardID: this.DashboardID
          }
        });
      }
    },
    // 跳转
    jump() {
      this.$router.go(-1);
    },
    // 获取监控列表
    async getMonitorList() {
      this.timeDate = {};
      this.times = [];
      this.series = [];
      this.DashboardData = [];
      let color = [
        "#2072d9",
        "#fff2cc",
        "#ffd966",
        "#f1c232",
        "#9fc5e8",
        "#3d85c6",
        "#00ff00",
        "#008bff",
        "#980000",
        "#1c4587"
      ];
      let params = {
        Namespace: this.Namespace,
        MetricName: this.MetricName,
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Period: 60,
        Version: "2017-03-12"
      };
      for (let i = 0; i < this.rightData.length; i++) {
        if (this.productValue === "cvm_device") {
          // 云服务器
          params["Dimensions." + i + ".unInstanceId"] = this.rightData[
            i
          ].InstanceId;
          this.DashboardData.push({
            regionId: "39",
            unInstanceId: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "VPN_GW") {
          // VPN网关
          params["Dimensions." + i + ".vpnGwId"] = this.rightData[
            i
          ].VpnGatewayId;
          this.DashboardData.push({
            regionId: "39",
            vpnGwId: this.rightData[i].VpnGatewayId
          });
        } else if (this.productValue === "vpn_tunnel") {
          // vpn通道
          params["Dimensions." + i + ".vpnConnId"] = this.rightData[
            i
          ].VpnConnectionId;
          this.DashboardData.push({
            regionId: "39",
            vpnConnId: this.rightData[i].VpnConnectionId
          });
        } else if (this.productValue === "nat_tc_stat") {
          // Nat网关
          params["Dimensions." + i + ".natId"] = this.rightData[i].NatGatewayId;
          this.DashboardData.push({
            regionId: "39",
            natId: this.rightData[i].NatGatewayId
          });
        } else if (this.productValue === "DC_GW") {
          // 专线网关
          params[
            "Dimensions." + i + ".directConnectGatewayId"
          ] = this.rightData[i].DirectConnectGatewayId;
          this.DashboardData.push({
            regionId: "39",
            directConnectGatewayId: this.rightData[i].DirectConnectGatewayId
          });
        } else if (this.productValue === "REDIS-CLUSTER") {
          // Redis
          params["Dimensions." + i + ".appid"] = this.rightData[i].Appid;
          params["Dimensions." + i + ".instanceid"] = this.rightData[
            i
          ].InstanceId;
          this.DashboardData.push({
            regionId: "39",
            appid: this.rightData[i].Appid,
            instanceid: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "dcchannel") {
          // 专用通道
          params["Dimensions." + i + ".directConnectConnId"] = this.rightData[
            i
          ].DirectConnectTunnelId;
          this.DashboardData.push({
            regionId: "39",
            directConnectConnId: this.rightData[i].DirectConnectTunnelId
          });
        } else if (this.productValue === "COS") {
          // 对象存储
          params["Dimensions." + i + ".bucket"] = this.rightData[i].Name;
          this.DashboardData.push({
            regionId: "39",
            bucket: this.rightData[i].Name
          });
        } else if (this.productValue === "dcline") {
          // 物理专线
          params["Dimensions." + i + ".directConnectId"] = this.rightData[
            i
          ].DirectConnectId;
          this.DashboardData.push({
            regionId: "39",
            directConnectId: this.rightData[i].DirectConnectId
          });
        } else if (this.productValue === "cdb_detail") {
          // MYSQL
          params["Dimensions." + i + ".uInstanceId"] = this.rightData[
            i
          ].InstanceId;
          this.DashboardData.push({
            regionId: "39",
            uInstanceId: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "BS") {
          // 云硬盘
          params["Dimensions." + i + ".diskId"] = this.rightData[i].DiskId;
          this.DashboardData.push({
            regionId: "39",
            diskId: this.rightData[i].DiskId
          });
        }
      }
      await this.axios.post(All_MONITOR, params).then(res => {
        if (res.Response.Error == undefined) {
          console.log(res);
          if (res.Response.DataPoints.length) {
            // 监控数据处理
            for (let i in res.Response.DataPoints) {
              this.timeDate["DataPoints." + i] = [];
              for (let j in res.Response.DataPoints[i].Points) {
                this.timeDate["DataPoints." + i].push({
                  point: res.Response.DataPoints[i].Points[j],
                  time: moment(
                    new Date(this.StartTime).getTime() + 60000 * j
                  ).format("YYYY-MM-DD HH:mm:ss")
                });
              }
            }
            // x轴数据
            for (let keyTime in this.timeDate["DataPoints.0"]) {
              this.times.push(this.timeDate["DataPoints.0"][keyTime].time);
            }
            // y轴
            for (let item in res.Response.DataPoints) {
              if (res.Response.DataPoints.length) {
                this.series.push({
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  type: "line",
                  data: res.Response.DataPoints[item].Points,
                  symbol: "none",
                  itemStyle: {
                    normal: {
                      color: color[item] ? color[item] : color[item % 10],
                      lineStyle: {
                        color: color[item] ? color[item] : color[item % 10]
                      }
                    }
                  }
                });
              }
            }
            console.log(this.series);
          } else {
            this.series = [];
          }
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
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
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
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
    // 创建Dashboard
    async createDashboard() {
      const param = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Module: "monitor",
        Namespace: this.Namespace,
        DescName: this.picName,
        DashboardID: this.DashboardID,
        "MetricNames.0": this.MetricName,
        Meta: JSON.stringify({
          aggregateType: "detail",
          aggregations: ["Avg", "Max", "Min"],
          chartTypes: ["line"],
          configId: this.configId,
          layout: {
            h: "5",
            h2: "0",
            w: "4",
            x: "0",
            y: "0"
          },
          timeAggregate: "last"
        })
      };
      for (let i in this.DashboardData) {
        param["Instances." + i] = JSON.stringify(this.DashboardData[i]);
      }
      await this.axios.post(CREATDASHBORD, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
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
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
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
    }
  }
};
</script>
<style lang="scss" scoped>
.room {
  padding: 20px;
  background: white;
}
.top {
  margin-top: 20px;
  font-size: 14px;
  height: 50px;
  // line-height: center;
  .top-one {
    width: 300px;
    float: left;
    display: flex;
    justify-content: space-between;
    // align-self: center;
    align-items: center;
  }
  .top-two {
    width: 150px;
    float: left;
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    // align-self: center;
    align-items: center;
    .top-two-see {
      border: 1px solid rgb(0, 110, 255);
      width: 80px;
      height: 30px;
      color: rgb(0, 110, 255);
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footer-left {
    width: 56%;
    height: 450px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    .footer-left-left {
      width: 25%;
      height: 448px;
      background: #f2f2f2;
      padding: 10px;
    }
    .footer-left-right {
      width: 75%;
      height: 450px;
      padding: 10px;
    }
  }
  .footer-right {
    width: 42%;
    height: 450px;
  }
}
.bottom {
  margin-top: 20px;
}
.Cam-right {
  float: right;
}
</style>