<template>
  <div class="overview-wrap">
    <Header :title="$t('CVM.jkgl')" />
    <div class="overview-main">
      <div class="explain">
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
      </div>
      <div class="main-box">
        <div class="left">
          <!-- 近24小时服务健康状态 -->
          <div class="box">
            <div class="head">
              <h3>{{ $t("CVM.overview.fwjkzt") }}</h3>
              <el-button v-show="region != ''">{{ region }}</el-button>
              <el-button
                icon="el-icon-loading"
                v-show="region == ''"
              ></el-button>
              <el-select
                v-model="value1"
                :placeholder="$t('CVM.Dashboard.qxz')"
                style="width:140px;margin-left:-1px;"
                @change="getProjectList"
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
              :data="tableData"
              style="width: 100%"
              height="450"
              :empty-text="$t('CVM.clBload.zwsj')"
            >
              <el-table-column
                prop="projectName"
                :label="$t('CVM.overview.fwlx')"
              ></el-table-column>
              <el-table-column
                prop="name"
                :label="$t('CVM.overview.dqzt')"
              ></el-table-column>
              <el-table-column
                prop="address"
                :label="$t('CVM.overview.yxdxs')"
              ></el-table-column>
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
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="value3"
                :placeholder="$t('CVM.Dashboard.qxz')"
                style="width:140px;margin-left:-1px;"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="margin-left:-1px;">
                <el-button v-show="region != ''">{{ region }}</el-button>
                <el-button
                  icon="el-icon-loading"
                  v-show="region == ''"
                  style="margin:0;"
                ></el-button>
              </div>
              <div class="trail" v-if="thresholdObjects.length > 0">
                <a href="#" @click="exportCSV">導出CSV</a
                ><i class="el-icon-download"></i>
              </div>
            </div>
            <TimelineCharts :timelineData="timelineData"></TimelineCharts>
            <div class="button-group">
              <el-button
                type="primary"
                v-for="day in sevenDays"
                :key="day.key"
                @click="handleDaysButtonEvent($event, day)"
                >{{ day.value.format("MM-DD") }}</el-button
              >
            </div>
          </div>
        </div>
        <div class="right">
          <!-- 当月已使用短信统计 -->
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
              <div class="progress">
                <p>
                  {{ $t("CVM.overview.jcgj") }}
                  <span>{{ $t("CVM.overview.syysy") }}</span>
                </p>
                <el-progress
                  :percentage="100"
                  :stroke-width="20"
                  :show-text="false"
                ></el-progress>
              </div>
              <div class="progress">
                <p>
                  {{ $t("CVM.overview.ybcgj") }}
                  <span>{{ $t("CVM.overview.syysy") }}</span>
                </p>
                <el-progress
                  :percentage="100"
                  :stroke-width="20"
                  :show-text="false"
                ></el-progress>
              </div>
              <div class="progress">
                <p>
                  {{ $t("CVM.overview.zdyjkgj") }}
                  <span>{{ $t("CVM.overview.syysy") }}</span>
                </p>
                <el-progress
                  :percentage="100"
                  :stroke-width="20"
                  :show-text="false"
                ></el-progress>
              </div>
              <div class="progress">
                <p>
                  {{ $t("CVM.overview.zdyxx") }}
                  <span>{{ $t("CVM.overview.syysy") }}</span>
                </p>
                <el-progress
                  :percentage="100"
                  :stroke-width="20"
                  :show-text="false"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 购买短信 -->
    <bugmsg :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
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
  ONE_DAY_MONITOR_LIST
} from "@/constants";
import bugmsg from "../components/buymsg";
import { ErrorTips } from "@/components/ErrorTips.js";
import moment from "moment";
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
      thresholdObjects: []
    };
  },
  components: {
    Header,
    bugmsg,
    TimelineCharts
  },
  computed: {
    sevenDays: function() {
      let days = [];
      for (let index = 6; index >= 0; index--) {
        days.push({
          key: index,
          value: moment().subtract(index, "days")
        });
      }
      return days;
    }
  },
  created() {
    this.GetCity();
    this.getProject();
    this.getServiceType();
    // this.getProjectList();
    this.MonitorList(moment().format("YYYY-MM-DD"));
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
    //获取项目列表
    getProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        console.info(res);
        if (res.codeDesc === "Success") {
          // this.tableData=res.data;//lxx
          res.data.forEach((item, index) => {
            const obj = {
              value: index + 1,
              label: item.projectName
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
    getServiceType() {
      let params = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(POLICY_CONDITIONS_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          let result = res.Response.Conditions.filter(item => {
            if (!item.SupportRegions.includes("tpe")) {
              return false;
            }

            // if (item.PolicyViewName !== "cvm_device") {
            //   return false;
            // }

            return true;
          });

          console.log(result);
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
    getProjectList() {
      //获取项目列表数据
      let params = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(ALL_PROJECT_HEALTH_STATUS_LIST, params).then(res => {
        // if (res.codeDesc === "Success") {
        //     this.tableData=res.data;//lxx
        // } else {
        //   let ErrTips = {
        //     InternalError: "内部错误",
        //     UnauthorizedOperation: "未授权操作"
        //   };
        //   let ErrOr = Object.assign(ErrorTips, ErrTips);
        //   this.$message({
        //     message: ErrOr[res.Response.Error.Code],
        //     type: "error",
        //     showClose: true,
        //     duration: 0
        //   });
        // }
      });
    },
    handleDaysButtonEvent(e, day) {
      this.MonitorList(day.value.format("YYYY-MM-DD"));
    },
    MonitorList(startTime) {
      //近7天监控时间轴项目列表数据
      let params = {
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: "cvm_device",
        StartTime: startTime
      };
      this.axios.post(ONE_DAY_MONITOR_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          const startTimes = [];
          const endTimes = [];
          const titles = [];

          this.thresholdObjects = res.Response.ThresholdObjects;

          res.Response.ThresholdObjects.forEach(item => {
            startTimes.push(item.FirstOccurTime);
            endTimes.push(item.LastOccurTime);
            titles.push(item.Content);
          });

          this.timelineData = [
            startTimes.reverse(),
            endTimes.reverse(),
            titles.reverse()
          ];
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
    exportCSV() {
      let json = [];

      let project = null;
      if (typeof this.value2 === "number") {
        project = this.options2[this.value2].label;
      } else {
        project = this.value2;
      }

      this.thresholdObjects.forEach(item => {
        json.push({
          "監控事件": item.Content,
          "項目": project,
          "地域": "中國臺北",
          "產品類型": "雲伺服器-基礎監控",
          // "類型": item.event === "evnet" ? "事件" : "阈值告警",   // 接口未提供該字段
          "對象": item.Dimensions === undefined ? "" : item.Dimensions,
          "狀態": item.Status === 0 ? "未恢復" : "已恢復",
          "告警策略": item.GroupName,
          "開始時間": item.FirstOccurTime,
          "結束時間": item.LastOccurTime
        });
      });

      const ws = XLSX.utils.json_to_sheet(json);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "統計數據");
      XLSX.writeFile(wb, "統計數據.csv");
    }
  }
};
</script>

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
