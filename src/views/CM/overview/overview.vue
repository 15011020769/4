<template>
  <div class="overview-wrap">
    <Header :title="$t('CVM.jkgl')" />
    <div class="overview-main">
      <!-- <div class="explain">
        <p>
          {{ $t("CVM.overview.xbysx") }}
          <a>{{ $t("CVM.overview.sqncty") }}</a>
        </p>
        <p>
          {{ $t("CVM.overview.zdjk") }}
          <a>{{ $t("CVM.lljk") }}</a> {{ $t("CVM.overview.pzljgd") }}
        </p>
        <p>
          [{{ $t("CVM.overview.wgzd") }} <a>dashboard</a>，{{
            $t("CVM.overview.hyty")
          }}
        </p>
        <p>
          {{ $t("CVM.overview.gwlljksj") }}
          <a>{{ $t("CVM.lljk") }}</a
          >{{ $t("CVM.overview.ymck") }}
        </p>
      </div> -->
      <div class="main-box">
        <div class="left">
          <!-- 近24小时服务健康状态 -->
          <div class="box">
            <div class="head">
              <h3>{{ $t("CVM.overview.fwjkzt") }}</h3>
              <el-button type="primary" v-show="region != ''">{{
                region
              }}</el-button>
              <el-button
                icon="el-icon-loading"
                v-show="region == ''"
              ></el-button>
              <el-select
                v-model="value1"
                :placeholder="$t('CVM.Dashboard.qxz')"
                style="width:140px;margin-left:-1px;"
                @change="getHealthStatusList"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-table
              v-loading="tableLoading"
              :data="productOptions"
              style="width: 100%"
              height="450"
              :empty-text="$t('CVM.clBload.zwsj')"
            >
              <el-table-column
                prop="label"
                :label="$t('CVM.overview.fwlx')"
              ></el-table-column>
              <el-table-column prop="status">
                <template slot="header">
                  <label>{{ $t("CVM.overview.dqzt") }}</label>
                  <el-tooltip placement="right" effect="light">
                    <div slot="content" style="line-height: 20px">
                      <i
                        class="el-icon-success"
                        style="color: green;font-size: 10px;"
                      ></i>
                      正常 無資源異常<br />
                      <i
                        class="el-icon-question"
                        style="color: red;font-size: 14px;"
                      ></i>
                      提醒 近24小時內有資源發生過異常<br />
                      <i
                        class="el-icon-warning"
                        style="color: red;font-size: 10px;"
                      ></i>
                      異常 當前有資源正處於異常狀態未修復
                    </div>
                    <i
                      class="el-icon-info"
                      style="font-size:15px;vertical-align: middle;"
                    ></i>
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <el-tooltip
                    placement="right"
                    effect="light"
                    :disabled="scope.row.tips.length === 0"
                    popper-class="cm-overview-tooltip"
                  >
                    <timelineview
                      slot="content"
                      :data="scope.row.tips"
                    ></timelineview>
                    <i
                      v-if="scope.row.status"
                      class="el-icon-success"
                      style="color: green;font-size: 15px;margin-right:3px;"
                    ></i>
                    <i
                      v-else
                      class="el-icon-warning"
                      style="color: red;font-size: 15px;margin-right:3px;"
                    ></i>
                  </el-tooltip>
                  <label v-if="scope.row.status">正常</label>
                  <label v-else>異常</label>
                </template>
              </el-table-column>
              <el-table-column prop="address" :label="$t('CVM.overview.yxdxs')">
                <template slot-scope="scope">
                  <span v-if="scope.row.desc !== 0"
                    >{{ scope.row.subtitle + "："
                    }}<a
                      @click="goToProduct(scope.row)"
                      class="go-to-product"
                      >{{ scope.row.desc }}</a
                    ></span
                  >
                  <span v-else>-</span>
                  <!-- <span>{{ scope.row.desc }}</span> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 近7天监控时间轴 -->
          <div class="box">
            <div class="head">
              <h3>{{ $t("CVM.overview.jksjz") }}</h3>
              <el-select
                v-model="value2"
                :placeholder="$t('CVM.Dashboard.qxz')"
                style="width:140px;margin-left:-1px;"
                @change="handleProjectEvent"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <type
                @PassData="PassData"
                :projectId="projectId"
                :searchParam="searchParam"
                :productValue="productValue"
              />
              <div style="margin-left:-1px;">
                <el-button type="primary" v-show="region != ''">{{
                  region
                }}</el-button>
                <el-button
                  icon="el-icon-loading"
                  v-show="region == ''"
                  style="margin:0;"
                ></el-button>
              </div>
              <div class="trail" v-if="chartsObjects.length > 0">
                <a href="#" @click="exportCSV">導出CSV</a
                ><i class="el-icon-download"></i>
              </div>
            </div>
            <TimelineCharts
              :timelineData="timelineData"
              :loading="chartLoading"
              :day="monitorStartTime"
            ></TimelineCharts>
            <div class="button-group">
              <el-button
                type="primary"
                v-for="day in sevenDays"
                :key="day.key"
                :plain="day.isSelected"
                @click="handleDaysButtonEvent($event, day)"
                >{{ day.value.format("MM-DD") }}</el-button
              >
            </div>
          </div>
        </div>
        <!-- <div class="right">
           当月已使用短信统计
          <div class="box">
            <div class="head">
              <h3 style="flex:1;">
                {{ $t("CVM.overview.dxtj") }}
                <el-tooltip class="item" effect="light" placement="bottom">
                  <div slot="content">
                    {{ $t("CVM.overview.gjdx") }}
                    <br />{{ $t("CVM.overview.dxpe") }} <br />{{
                      $t("CVM.overview.mfpe")
                    }}
                  </div>
                  <i class="el-icon-info cursor"></i>
                </el-tooltip>
              </h3>
              <a @click="buyMessgae">{{ $t("CVM.overview.gmdx") }}</a>
            </div>
            <div class="box-main" style="margin-top:10px;">
              <div class="progress" v-for="item in quotaList" :key="item.Type">
                <p>
                  {{ item.Name }}
                  <span>剩餘{{ item.FreeLeft }}條/已使用{{ item.Used }}條</span>
                </p>
                <el-progress
                  :percentage="100 * (item.Used / (item.Used + item.FreeLeft))"
                  :stroke-width="20"
                  :show-text="false"
                ></el-progress>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 购买短信 -->
    <!-- <bugmsg :dialogVisible="dialogVisible" @cancel="cancel" @save="save" /> -->
  </div>
</template>

<script>
import TimelineCharts from "./TimelineCharts";
import Header from "@/components/public/Head";
import XLSX from "xlsx";
import {
  ALL_CITY,
  ALL_PROJECT,
  ALL_PROJECT_HEALTH_STATUS_LIST,
  POLICY_CONDITIONS_LIST,
  ONE_DAY_MONITOR_LIST,
  OVERVIEW_SMS_LIST
} from "@/constants";
import bugmsg from "../components/buymsg";
import { ErrorTips } from "@/components/ErrorTips.js";
import moment from "moment";
import type from "@/views/CM/CM_assembly/product_type";
import timelineview from "./timelineview";
export default {
  name: "overview",
  data() {
    return {
      dialogVisible: false, //购买短信弹出框
      region: "",
      tableData: [], //表格数据
      //下拉框
      options1: [
        {
          value: 0,
          label: "所有專案"
        }
      ],
      options2: [
        {
          value: 0,
          label: "所有專案"
        }
      ],
      options3: [],
      //下拉框选中的值
      value1: "所有專案",
      value2: "所有專案",
      value3: "",
      time: [1, 2, 3, 4, 5, 6, 7],
      series: [
        {
          type: "line",
          stack: "总量",
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          type: "line",
          stack: "总量",
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ],
      period: "10",
      timelineData: null,
      chartsObjects: [],
      quotaList: [],
      projectId: 0,
      productValue: "cvm_device",
      monitorStartTime: moment().format("YYYY-MM-DD"),
      searchParam: {},
      chartLoading: false,
      tableLoading: false,
      productOptions: [
        {
          label: "雲伺服器",
          viewName: "cvm_device",
          subtitle: "基礎監控"
        },
        {
          label: "雲硬碟",
          viewName: "BS",
          subtitle: "雲硬碟"
        },
        {
          label: "VPN網關",
          viewName: "VPN_GW",
          subtitle: "VPN網關"
        },
        {
          label: "VPN通道",
          viewName: "vpn_tunnel",
          subtitle: "VPN通道"
        },
        {
          label: "NAT網關",
          viewName: "nat_tc_stat",
          subtitle: "NAT網關"
        },
        {
          label: "專線網關",
          viewName: "DC_GW",
          subtitle: "專線網關"
        },
        {
          label: "彈性公網IP",
          viewName: "EIP",
          subtitle: "彈性公網IP"
        },
        {
          label: "MYSQL",
          viewName: "cdb_detail",
          subtitle: "主機監控"
        },
        {
          label: "Redis",
          viewName: "REDIS-CLUSTER",
          subtitle: "Redis"
        },
        {
          label: "專用通道",
          viewName: "dcchannel",
          subtitle: "專用通道"
        },
        {
          label: "物理專線",
          viewName: "dcline",
          subtitle: "物理專線"
        },
        {
          label: "對象存儲",
          viewName: "COS",
          subtitle: "對象存儲"
        }
      ]
    };
  },
  components: {
    Header,
    bugmsg,
    TimelineCharts,
    type,
    timelineview
  },
  computed: {
    sevenDays: function() {
      let days = [];
      for (let index = 6; index >= 0; index--) {
        let day = moment().subtract(index, "days");

        days.push({
          key: index,
          value: day,
          isSelected: day.format("YYYY-MM-DD") !== this.monitorStartTime
        });
      }
      return days;
    }
  },
  created() {
    this.GetCity();
    this.getProject();
    // this.getServiceType();
    this.getHealthStatusList();
    this.MonitorList();
    // this.getSMS();

    this.productOptions.forEach(item => {
      item.status = true;
      item.desc = 0;
      item.tips = [];
    });
  },

  methods: {
    //购买短信
    buyMessgae() {
      this.dialogVisible = true;
    },
    //取消
    cancel() {
      this.dialogVisible = false;
    },
    //确定
    save() {
      this.dialogVisible = false;
    },
    //获取城市
    GetCity() {
      this.axios.get(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
      });
    },
    // 当月已使用短信统计
    // getSMS() {
    //   let params = {
    //     Version: "2018-07-24",
    //     Module: "monitor"
    //   };
    //   this.axios.post(OVERVIEW_SMS_LIST, params).then(res => {
    //     if (res.Response.Error === undefined) {
    //       // this.tableData=res.data;//lxx
    //       this.quotaList = res.Response.QuotaList;
    //     } else {
    //       let ErrTips = {
    //         InternalError: "內部錯誤",
    //         UnauthorizedOperation: "未授權操作"
    //       };
    //       let ErrOr = Object.assign(ErrorTips, ErrTips);
    //       this.$message({
    //         message: ErrOr[res.Response.Error.Code],
    //         type: "error",
    //         showClose: true,
    //         duration: 0
    //       });
    //     }
    //   });
    // },
    //获取项目列表
    getProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          // this.tableData=res.data;//lxx
          res.data.forEach((item, index) => {
            const obj = {
              value: index + 1,
              label: item.projectName,
              projectId: item.projectId
            };
            this.options1.push(obj);
            this.options2.push(obj);
          });
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
    // getServiceType() {
    //   let params = {
    //     Version: "2018-07-24",
    //     Module: "monitor"
    //   };
    //   this.axios.post(POLICY_CONDITIONS_LIST, params).then(res => {
    //     if (res.Response.Error === undefined) {
    //       let result = res.Response.Conditions.filter(item => {
    //         if (!item.SupportRegions.includes("tpe")) {
    //           return false;
    //         }

    //         // if (item.PolicyViewName !== "cvm_device") {
    //         //   return false;
    //         // }

    //         return true;
    //       });

    //       // console.log(result);
    //     } else {
    //       let ErrTips = {
    //         InternalError: "内部错误",
    //         UnauthorizedOperation: "未授权操作"
    //       };
    //       let ErrOr = Object.assign(ErrorTips, ErrTips);
    //       this.$message({
    //         message: ErrOr[res.Response.Error.Code],
    //         type: "error",
    //         showClose: true,
    //         duration: 0
    //       });
    //     }
    //   });
    // },
    getHealthStatusList() {
      //获取项目列表数据
      let params = {
        Version: "2018-07-24",
        Module: "monitor"
      };

      if (typeof this.value1 === "number") {
        params["ProjectIds.0"] = this.options1[this.value1].projectId;
      }

      this.tableLoading = true;
      this.axios.post(ALL_PROJECT_HEALTH_STATUS_LIST, params).then(res => {
        this.tableLoading = false;
        if (res.Response.Error === undefined) {
          const data = res.Response.List;

          this.productOptions = this.productOptions.map((item, index) => {
            const viewNameObj = data.find(view => {
              return view.ViewName === item.viewName;
            });

            if (viewNameObj !== undefined && viewNameObj.HealthStatus === 1) {
              item.status = false;
              this.getAbnormalList(viewNameObj.ViewName, index);
            } else {
              item.status = true;
              item.tips = [];
            }

            // if (viewNameObj !== undefined) {
            //   item.desc = item.subtitle + "：" + viewNameObj.AbnormalCount;
            // } else {
            //   item.desc = "-";
            // }

            if (viewNameObj !== undefined) {
              item.desc = viewNameObj.AbnormalCount;
            } else {
              item.desc = 0;
            }

            return item;
          });
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    getRouterNameByViewName(viewName) {
      if (viewName === "VPN_GW") {
        // VPN网关
        return "VPNgateway";
      } else if (viewName === "vpn_tunnel") {
        // vpn通道
        return "VPNchannel";
      } else if (viewName === "nat_tc_stat") {
        // Nat网关
        return "NATgateway";
      } else if (viewName === "DC_GW") {
        // 专线网关
        return "PrivateGateway";
      } else if (viewName === "REDIS-CLUSTER") {
        // Redis
        return "Redis";
      } else if (viewName === "dcchannel") {
        // 专用通道
        return "PrivateGateway";
      } else if (viewName === "COS") {
        // 对象存储
        return "objectStorage";
      } else if (viewName === "dcline") {
        // 物理专线
        return "Physics";
      } else if (viewName === "cdb_detail") {
        // MYSQL
        return "cloudMysql";
      } else if (viewName === "BS") {
        // 云硬盘
        return "cloudDisk";
      } else if (viewName === "EIP") {
        // 弹性公网IP
        return "networkIP";
      } else {
        return "CVM";
      }
    },
    goToProduct(row) {
      this.$router.push({
        name: this.getRouterNameByViewName(row.ViewName)
      });
    },
    getAbnormalList(viewName, index) {
      const params = {
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: viewName
      };

      this.axios.post(ONE_DAY_MONITOR_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          const item = this.productOptions[index];

          item.tips = res.Response.ThresholdObjects;

          this.$set(this.productOptions, index, item);
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    handleDaysButtonEvent(e, day) {
      this.monitorStartTime = day.value.format("YYYY-MM-DD");
      this.MonitorList();
    },
    handleProjectEvent() {
      this.MonitorList();
    },
    MonitorList() {
      const params = {
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: this.productValue,
        StartTime: this.monitorStartTime
      };

      let project = null;
      if (typeof this.value2 === "number") {
        params["ProjectIds.0"] = this.options2[this.value2].projectId;
      }

      this.chartLoading = true;
      this.axios.post(ONE_DAY_MONITOR_LIST, params).then(res => {
        this.chartLoading = false;
        if (res.Response.Error === undefined) {
          let chartsObjects = [];
          const startTimes = [];
          const endTimes = [];
          const otherInfo = [];

          const thresholdObjects = res.Response.ThresholdObjects;
          const eventObjects = res.Response.EventObjects;

          // 添加到图表数据源
          if (thresholdObjects !== undefined) {
            chartsObjects = chartsObjects.concat(
              thresholdObjects.map(item => {
                return {
                  FirstOccurTime: item.FirstOccurTime,
                  LastOccurTime: item.LastOccurTime,
                  Content: item.Content,
                  Dimensions: item.Dimensions,
                  Status: item.Status,
                  Type: "threshold",
                  GroupName: item.GroupName,
                  ProductCName: ""
                };
              })
            );
          }

          if (eventObjects !== undefined) {
            chartsObjects = chartsObjects.concat(
              eventObjects.map(item => {
                return {
                  FirstOccurTime: item.FirstOccurTime,
                  LastOccurTime: item.LastOccurTime,
                  Content: item.EventCName,
                  Dimensions: item.Dimensions,
                  Status: item.Status,
                  Type: "event",
                  GroupName: item.GroupName,
                  ProductCName: item.ProductCName
                };
              })
            );
          }

          // 排序
          chartsObjects.sort((value1, value2) => {
            return this.sortChartObject(value1, value2);
          });

          // this.chartsObjects = chartsObjects;
          // const monitorStartTime = this.monitorStartTime;
          // chartsObjects = chartsObjects.filter(function(item) {
          //   const firstOccurTime = moment(item.FirstOccurTime);
          //   return firstOccurTime.isBefore(monitorStartTime, "day");
          // });

          chartsObjects.forEach(item => {
            startTimes.push(item.FirstOccurTime);
            endTimes.push(item.LastOccurTime);
            otherInfo.push({
              Status: item.Status,
              Type: item.Type,
              ProductCName: item.ProductCName,
              Title: item.Content,
              FirstOccurTime: item.FirstOccurTime,
              LastOccurTime: item.LastOccurTime
            });
          });

          this.timelineData = [startTimes, endTimes, otherInfo];
        } else {
          this.chartLoading = false;
          this.chartsObjects = [];
          this.timelineData = [];
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    sortChartObject(value1, value2) {
      const firstTime = moment(value1.FirstOccurTime);
      const secondTime = moment(value2.FirstOccurTime);

      var i =
        firstTime.hour() * 60 * 60 +
        firstTime.minute() * 60 +
        firstTime.second();
      var n =
        secondTime.hour() * 60 * 60 +
        secondTime.minute() * 60 +
        secondTime.second();
      if (i > n) {
        return -1;
      } else if (i < n) {
        return 1;
      } else {
        return 0;
      }
    },
    exportCSV() {
      let json = [];

      let project = null;
      if (typeof this.value2 === "number") {
        project = this.options2[this.value2].label;
      } else {
        project = this.value2;
      }

      const product = this.productOptions.find(item => {
        return item.viewName === this.productValue;
      });

      this.chartsObjects.forEach(item => {
        json.push({
          監控事件: item.Content,
          項目: item.Type === "threshold" ? project : "-",
          地域: "台灣台北",
          產品類型: product.label,
          // "類型": item.event === "evnet" ? "事件" : "阈值告警",   // 接口未提供該字段
          對象: item.Dimensions === undefined ? "" : item.Dimensions,
          狀態: item.Status === 0 ? "未恢復" : "已恢復",
          告警策略: item.GroupName,
          開始時間: moment(item.FirstOccurTime).format("YYYY-MM-DD HH:mm:ss"),
          結束時間:
            item.LastOccurTime === "-"
              ? "-"
              : moment(item.LastOccurTime).format("YYYY-MM-DD HH:mm:ss")
        });
      });

      const ws = XLSX.utils.json_to_sheet(json);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "統計數據");
      XLSX.writeFile(wb, "統計數據.csv");
    },
    PassData(data) {
      this.productValue = data.productValue;
      this.MonitorList();
    }
  }
};
</script>

<style lang="css">
.cm-overview-tooltip {
  max-width: 300px;
  max-height: 300px;
  overflow-y: auto;
}
</style>

<style lang="scss" scoped>
.button-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.button-group >>> .el-button {
  flex-basis: 0;
  flex-grow: 1;
}

.overview-wrap >>> .el-progress-bar__outer,
.overview-wrap >>> .el-progress-bar__inner {
  border-radius: 0;
}
.overview-wrap >>> .el-dialog__body {
  padding: 20px;
  box-sizing: border-box;
}
.overview-wrap >>> .el-button,
.overview-wrap >>> .el-input__inner,
.overview-wrap >>> .el-input-number__increase,
.overview-wrap >>> .el-input-number__decrease {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.overview-wrap >>> .el-input-number__increase,
.overview-wrap >>> .el-input-number__decrease {
  top: 5px;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
}
.overview-wrap >>> .explain {
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
.overview-wrap >>> .el-button {
  line-height: 28px;
}
.go-to-product:hover {
  text-decoration: underline;
}
.overview-wrap {
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
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

    .left {
      width: 100%;
      margin-right: 20px;
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
      .trail {
        margin-left: 20px;
        a:hover {
          text-decoration: underline;
        }
      }
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
</style>
