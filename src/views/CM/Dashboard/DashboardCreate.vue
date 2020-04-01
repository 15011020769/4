<template>
  <div class="room">
    <h2>{{ $t("CVM.DashboardCreate.cjjktb") }}</h2>
    <div class="top">
      <div class="top-one">
        <span>{{ $t("CVM.DashboardCreate.cplx") }}</span>
        <Type
          v-on:PassData="PassData"
          :projectId="projectId"
          :searchParam="searchParam"
          :productValue="productValue"
          v-on:loading="Type_loading"
        ></Type>
      </div>
      <div class="top-two">
        <span
          >{{ $t("CVM.DashboardCreate.sjst") }}
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('CVM.DashboardCreate.tips1')"
            placement="top"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
        <div class="top-two-see">{{ $t("CVM.DashboardCreate.mxst") }}</div>
      </div>
    </div>
    <h3 style="margin-bottom:20px">{{ $t("CVM.DashboardCreate.pzjktb") }}</h3>
    <div class="footer">
      <div class="footer-left">
        <div class="footer-left-left" v-loading="loading">
          <h4>{{ $t("CVM.DashboardCreate.tbpz") }}</h4>
          <div style="margin-top:30px">
            <p style="margin-bottom:10px">圖表名稱</p>
            <el-popover
              placement="right"
              width="100"
              trigger="click"
              content="已達到最大限度"
              :disabled="picName.length === 30 ? false:true">
              <el-input size="mini" v-model="picName" style="max-width:250px" maxlength='30' slot="reference"></el-input>
           </el-popover>
          </div>
          <div style="margin-top:30px">
            <p style="margin-bottom:10px">
              {{ $t("CVM.DashboardCreate.jkzb") }}
            </p>
            <el-select
              v-model="target"
              :placeholder="$t('CVM.DashboardCreate.qxz')"
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
          <h2 class="white-point">{{ picName }}</h2>
          <div>
            <Echarts
              :time="times"
              :series="series"
              :period="'60'"
              :xdata="true"
              style="width:95%;height:180px;margin-left:-20px"
              v-if="rightData.length"
              @paramValue="paramValue"
            ></Echarts>
          </div>
          <div>
            <div style="width:100%;height:30px;background-color:#f2f2f2;margin:10px 0px;" v-if='rightData.length'>
                <div style="margin-left:20px;line-height:30px">
                    <span>共有{{rightData.length}}個實例</span>
                    <span style="margin-left:20px">監控明細({{StartTime}})</span>
                </div>
                <el-table
                 :data="tableData"
                  style="width: 100%"
                  max-height="180"
                  v-loading="loadShow">
                  <el-table-column
                    prop="color">
                    <template slot-scope="scope">
                      <div :style='"width: 10px;height: 10px;border-radius: 50%;background:" + scope.row.color'></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="pointId"
                    label="ID">
                  </el-table-column>
                  <el-table-column
                    prop="points"
                    :label="picNameLable">
                  </el-table-column>
                </el-table>
            </div>
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
        >{{ $t("CVM.DashboardCreate.qd") }}</el-button
      >
      <el-button size="mini" @click="jump">{{
        $t("CVM.DashboardCreate.qx")
      }}</el-button>
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
      picNameLable:"",
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
      tableData:[],
      Data:[],
      pointId:"",
      loading: true,
      flag: false,
      loadShow:true,
      color : [
        "#2072d9",
        "#fff2cc",
        "#f45333",
        "#33d8f4",
        "#c151df",
        "#90e52a",
        "#e5ce2a",
        "#9486f8",
        "#980000",
        "#1c4587"
      ]
    };
  },
  methods: {
    PassData(data) {
      this.productListData = data;
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
      this.picNameLable = this.target.label; 
      this.picName = "明細-" + this.target.label;
      this.rightData = [];
      this.loading = false;
      this.configId = data.id;
    },
    getTarget(val) {
      this.picName = "明細-" + val.label;
      this.picNameLable = val.label
      // console.log(this.picNameLable)
      this.MetricName = this.filterMetricName(val.value);
      this.loadShow = true
      if (this.rightData.length) {
        this.getMonitorList();
      }
      console.log(this.MetricName);
    },
    projectIds(data) {
      console.log(data);
      this.projectId = data;
    },
    paramValue(evt){
      this.StartTime = evt
      for(let i in this.times){
        if(this.times[i] == evt){
            // this.tableData[points]=res.Response.DataPoints[i].Points[0],
            for(let j in this.tableData){
              this.tableData[j]['points'] = this.Data[j].Points[i]
            }
        }
      }
        // console.log(evt)
    },
    searchParams(data) {
      console.log(data);
      this.searchParam = data;
    },
    selectDatas(val) {
      this.rightData = val;
      this.loadShow = true
      console.log(val);
      if (this.rightData.length) {
        this.series = []
        this.getMonitorList();
        this.selectDashboardData()
      }
    },
    Type_loading(val) {
      this.loading = val;
      this.series = [];
    },
    filterMetricName(val){
        if(val.indexOf('(')!==-1){
          return val.split('(')[0]
        } else {
          return val
        }
        console.log(val)
    },
    // 创建
    createJump() {
      let number = 0
      if (this.rightData.length) {
        if(this.DashboardData.length<=10){
           this.createDashboard(0,this.DashboardData.length);
            this.$router.push({
              name: "Dashboard",
              query: {
                DashboardID: this.DashboardID
              }
            });
        } else {
          if(this.DashboardData.length%10!=0){
            number = parseInt(this.DashboardData.length/10)+1
            for(let i=0;i<number;i++){
               if(number === (i+1)){
                  this.createDashboard(i*10,this.DashboardData.length)
                  break
               }
              this.createDashboard(i*10,(i+1)*10)
            }
             this.$router.push({
              name: "Dashboard",
              query: {
                DashboardID: this.DashboardID
              }
            });
          } else {
            number = parseInt(this.DashboardData.length/10)
            for(let i=0;i<number;i++){
               this.createDashboard(i,(i+1)*10)
            }
            this.$router.push({
              name: "Dashboard",
              query: {
                DashboardID: this.DashboardID
              }
            });
          }
        }
      }
    },
    // 跳转
    jump() {
      this.$router.go(-1);
    },

    selectDashboardData(){
      for (let i = 0;i < this.rightData.length;i++) {
        if (this.productValue === "cvm_device") {
          // 云服务器
          this.DashboardData.push({
            regionId: "39",
            unInstanceId: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "VPN_GW") {
          // VPN网关
          this.DashboardData.push({
            regionId: "39",
            vpnGwId: this.rightData[i].VpnGatewayId
          });
        } else if (this.productValue === "vpn_tunnel") {
          // vpn通道
          this.DashboardData.push({
            regionId: "39",
            vpnConnId: this.rightData[i].VpnConnectionId
          });
        } else if (this.productValue === "nat_tc_stat") {
          // Nat网关
          this.DashboardData.push({
            regionId: "39",
            natId: this.rightData[i].NatGatewayId
          });
        } else if (this.productValue === "DC_GW") {
          // 专线网关
          this.DashboardData.push({
            regionId: "39",
            directConnectGatewayId: this.rightData[i].DirectConnectGatewayId
          });
        } else if (this.productValue === "REDIS-CLUSTER") {
          // Redis
          this.DashboardData.push({
            regionId: "39",
            appid: this.rightData[i].Appid,
            instanceid: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "dcchannel") {
          // 专用通道
          this.DashboardData.push({
            regionId: "39",
            directConnectConnId: this.rightData[i].DirectConnectTunnelId
          });
        } else if (this.productValue === "COS") {
          // 对象存储
          this.DashboardData.push({
            regionId: "39",
            bucket: this.rightData[i].Name
          });
        } else if (this.productValue === "dcline") {
          // 物理专线
          this.DashboardData.push({
            regionId: "39",
            directConnectId: this.rightData[i].DirectConnectId
          });
        } else if (this.productValue === "cdb_detail") {
          // MYSQL
          this.DashboardData.push({
            regionId: "39",
            uInstanceId: this.rightData[i].InstanceId
          });
        } else if (this.productValue === "BS") {
          // 云硬盘
          this.DashboardData.push({
            regionId: "39",
            diskId: this.rightData[i].DiskId
          });
        }
      }
      console.log(this.DashboardData)
    },
    // 获取监控列表
    async getMonitorList() {
      this.timeDate = {};
      this.times = [];
      this.series = [];
      this.DashboardData = [];
      this.tableData = [];
      
      let params = {
        Namespace: this.Namespace,
        MetricName: this.MetricName,
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Period: 60,
        Version: "2017-03-12"
      };
      //   this.rightData.length
      for (
        let i = 0;
        i < (this.rightData.length > 10 ? 10 : this.rightData.length);
        i++
      ) {
        if (this.productValue === "cvm_device") {
          // 云服务器
          this.pointId = "unInstanceId"
          params["Dimensions." + i + ".unInstanceId"] = this.rightData[
            i
          ].InstanceId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   unInstanceId: this.rightData[i].InstanceId
          // });
        } else if (this.productValue === "VPN_GW") {
          // VPN网关
          this.pointId = "vpnGwId"
          params["Dimensions." + i + ".vpnGwId"] = this.rightData[
            i
          ].VpnGatewayId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   vpnGwId: this.rightData[i].VpnGatewayId
          // });
        } else if (this.productValue === "vpn_tunnel") {
          // vpn通道
          this.pointId = "vpnConnId"
          params["Dimensions." + i + ".vpnConnId"] = this.rightData[
            i
          ].VpnConnectionId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   vpnConnId: this.rightData[i].VpnConnectionId
          // });
        } else if (this.productValue === "nat_tc_stat") {
          // Nat网关
          this.pointId = "natId"
          params["Dimensions." + i + ".natId"] = this.rightData[i].NatGatewayId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   natId: this.rightData[i].NatGatewayId
          // });
        } else if (this.productValue === "DC_GW") {
          // 专线网关
          this.pointId = "directConnectGatewayId"
          params[
            "Dimensions." + i + ".directConnectGatewayId"
          ] = this.rightData[i].DirectConnectGatewayId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   directConnectGatewayId: this.rightData[i].DirectConnectGatewayId
          // });
        } else if (this.productValue === "REDIS-CLUSTER") {
          // Redis
          this.pointId = "instanceid"
          params["Dimensions." + i + ".appid"] = this.rightData[i].Appid;
          params["Dimensions." + i + ".instanceid"] = this.rightData[
            i
          ].InstanceId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   appid: this.rightData[i].Appid,
          //   instanceid: this.rightData[i].InstanceId
          // });
        } else if (this.productValue === "dcchannel") {
          // 专用通道
          this.pointId = "directConnectConnId"
          params["Dimensions." + i + ".directConnectConnId"] = this.rightData[
            i
          ].DirectConnectTunnelId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   directConnectConnId: this.rightData[i].DirectConnectTunnelId
          // });
        } else if (this.productValue === "COS") {
          // 对象存储
          this.pointId = "bucket"
          params["Dimensions." + i + ".bucket"] = this.rightData[i].Name;
          // this.DashboardData.push({
          //   regionId: "39",
          //   bucket: this.rightData[i].Name
          // });
        } else if (this.productValue === "dcline") {
          // 物理专线
          this.pointId = "directConnectId"
          params["Dimensions." + i + ".directConnectId"] = this.rightData[
            i
          ].DirectConnectId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   directConnectId: this.rightData[i].DirectConnectId
          // });
        } else if (this.productValue === "cdb_detail") {
          // MYSQL
          this.pointId = "uInstanceId"
          params["Dimensions." + i + ".uInstanceId"] = this.rightData[
            i
          ].InstanceId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   uInstanceId: this.rightData[i].InstanceId
          // });
        } else if (this.productValue === "BS") {
          // 云硬盘
          this.pointId = "diskId"
          params["Dimensions." + i + ".diskId"] = this.rightData[i].DiskId;
          // this.DashboardData.push({
          //   regionId: "39",
          //   diskId: this.rightData[i].DiskId
          // });
        }
      }
      await this.axios.post(All_MONITOR, params).then(res => {
        if (res.Response.Error == undefined) {
          console.log(res);
          this.Data = res.Response.DataPoints
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
            // for (let keyTime in this.timeDate["DataPoints.0"]) {
            //   this.times.push(this.timeDate["DataPoints.0"][keyTime].time.replace("-", "/").replace("-", "/"));
            // }
            this.times=this.GetX(new Date(this.StartTime).getTime(),new Date(this.EndTime).getTime(),60)
            // console.log(this.times)
            // y轴
            //  res.Response.DataPoints
            for (let item=0 ;item<res.Response.DataPoints.length;item++) {
              if (res.Response.DataPoints.length) {
                this.series.push({
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  type: "line",
                  data: res.Response.DataPoints[item].Points,
                  // ? color[item] : color[item % 10],
                  itemStyle: {
                    normal: {
                      color: this.color[item],
                      lineStyle: {
                        color: this.color[item]
                      }
                    }
                  },
                  symbol:'circle',
                  showSymbol: false
                });
              }
            }
            // table数据
            for(let i in res.Response.DataPoints){
              this.tableData.push({
                points:res.Response.DataPoints[i].Points[0],
                pointId:res.Response.DataPoints[i].Dimensions[this.pointId],
                color:this.color[i]
              })
            }
            this.loadShow = false
            // console.log(this.series);
            // console.log(this.times);
          } else {
            this.series = [];
          }
        } else {
          let ErrTips = {
            InternalError: "內部錯誤",
            InvalidParameterValue: "無效的參數值"
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
    async createDashboard(key,length) {
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
      for (let i=key ;i<length;i++) {
        param["Instances." + (i%10)] = JSON.stringify(this.DashboardData[i]);
      }
      await this.axios.post(CREATDASHBORD, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
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
              "刪除触发條件失敗。",
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
            "FailedOperation.ServiceNotEnabled":
              "服務未啟用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未註冊指標的請求。",
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
    GetX(startDate, endDate, space) {
        if (!endDate) {
          endDate = new Date();
        } else {
          endDate = new Date(endDate);
        }
        if (!startDate) {
          startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        } else {
          startDate = new Date(startDate);
        }
        if (!space) {
          space = 600 * 1000;
        } else {
          space = space * 1000;
        }
        var endTime = endDate.getTime();
        var startTime = startDate.getTime();
        var mod = endTime - startTime;
        var dateArray = [];
        // 加入结束时间
        var a = new Date();
        a.setTime(endTime);
        a = this.nowtime(a);
        dateArray.push(a);
        while (mod - space >= space) {
          var d = new Date();
          d.setTime(endTime - space);
          d = this.nowtime(d);
          dateArray.push(d);
          mod = mod - space;
          endTime = endTime - space;
        }
        // 加入开始时间
        var a = new Date();
        a.setTime(startTime);
        a = this.nowtime(a);
        dateArray.push(a);
        var xAxis = dateArray.reverse()
        return xAxis;
      },
      nowtime(dt) {
        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" +
            dt.getDate() :
            dt.getDate()) + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (dt
            .getMinutes() < 10 ? "0" +
            dt.getMinutes() : dt.getMinutes()) + ":" + (dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt
            .getSeconds()));
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
    width: 180px;
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
.white-point {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
