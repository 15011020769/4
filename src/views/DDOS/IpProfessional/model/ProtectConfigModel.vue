<template>
  <!-- 高防IP专业版-防护配置-DDoS攻击防护-修改 -->
  <div id="configModel">
    <div class="wrap">
      <el-dialog
        :title="$t('DDOS.protectCon.ProtectionName')"
        :visible.sync="configIsShow"
        width="40%"
        :append-to-body="true"
        :before-close="handleClose"
      >
        <div class="modelCenterCon">
          <!-- 防护状态start -->
          <p class="newClear">
            <span class="modelSpan1">{{$t('DDOS.protectCon.protectionStatus')}}</span>
            <span @click="defendStatusSwitch()">
              <el-switch
                v-model="servicePack.DefendStatus"
                active-color="#006eff"
                inactive-color="#999"
              ></el-switch>
            </span>
            <!-- 关闭防护状态模态框 -->
            <el-dialog
              :title="$t('DDOS.protectCon.CloseConfirm')"
              :visible.sync="defendStatusModel"
              width="30%"
              :append-to-body="true"
              :before-close="closeDefendStatus"
            >
              <p class="outOk">{{$t('DDOS.protectCon.CloseConfirmTitle')}}</p>
              <span class="modelSpan1">{{$t('DDOS.protectCon.setTime')}}</span>
              <span>
                <el-select v-model="servicePack.cleanTime" class="setSelectM">
                  <el-option
                    v-for="(item, index) in cleanTime"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  ></el-option>
                </el-select>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="closeDefendStatus">取 消</el-button>
                <el-button
                  type="primary"
                  @click="modifyDefendStatus()"
                >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
              </span>
            </el-dialog>
          </p>
          <!-- 防护状态end -->
          <div v-if="ShowFlag=='0'?true:false">
            <!-- 清洗阙值start -->
            <p class="newClear">
              <span class="modelSpan1">
                {{$t('DDOS.protectCon.CleaningShold')}}
                <el-tooltip class="item" effect="light" placement="top-start">
                  <div slot="content" class="tooltip_text">
                    {{$t('DDOS.protectCon.CleaningSholdToolTip01')}}
                    <br />
                    {{$t('DDOS.protectCon.CleaningSholdToolTip02')}}
                  </div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
              <span>
                <el-select
                  v-model="servicePack.DdosThreshold"
                  class="setSelectM"
                  @change="cleanThreshold"
                >
                  <el-option
                    v-for="(item, index) in cleanNumOption"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  ></el-option>
                </el-select>
              </span>
            </p>
            <!-- 清洗阈值end -->
            <!-- 防护等级start -->
            <p class="newClear">
              <span class="modelSpan1">
                {{$t('DDOS.protectCon.ProtectionGrade')}}
                <el-tooltip class="item" effect="light" placement="bottom-start">
                  <div slot="content" class="tooltip_text">
                    <span
                      class="tooltip_text_bold"
                    >{{$t('DDOS.protectCon.ProtectionGradeToolTip0101')}}</span>
                    {{$t('DDOS.protectCon.ProtectionGradeToolTip010101')}}
                    <br />
                    {{$t('DDOS.protectCon.ProtectionGradeToolTip0102')}}
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0103')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0104')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0105')}}</span>
                    <br />
                    <br />
                    <span
                      class="tooltip_text_bold"
                    >{{$t('DDOS.protectCon.ProtectionGradeToolTip0201')}}</span>
                    {{$t('DDOS.protectCon.ProtectionGradeToolTip020101')}}
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0202')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0203')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0204')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0205')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0206')}}</span>
                    <br />
                    <br />
                    <span
                      class="tooltip_text_bold"
                    >{{$t('DDOS.protectCon.ProtectionGradeToolTip0301')}}</span>
                    {{$t('DDOS.protectCon.ProtectionGradeToolTip030101')}}
                    <br />
                    {{$t('DDOS.protectCon.ProtectionGradeToolTip0302')}}
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0303')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0304')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0305')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0306')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0307')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0308')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0309')}}</span>
                    <br />
                    <span class="indent">{{$t('DDOS.protectCon.ProtectionGradeToolTip0310')}}</span>
                  </div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
              <span class="modelSpan2">
                <a
                  :class="servicePack.DDoSLevel=='low'?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden('low')"
                  style="color:#000;"
                >{{$t('DDOS.protectCon.loose')}}</a>
                <a
                  :class="servicePack.DDoSLevel=='middle'?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden('middle')"
                  style="color:#000;"
                >{{$t('DDOS.protectCon.normal')}}</a>
                <a
                  :class="servicePack.DDoSLevel=='high'?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden('high')"
                  style="color:#000;"
                >{{$t('DDOS.protectCon.strict')}}</a>
              </span>
              <!-- 选择防护等级模态框 -->
              <el-dialog
                :title="$t('DDOS.protectCon.toggStrtic')"
                :visible.sync="changeModelTip3"
                width="30%"
                :append-to-body="true"
                :before-close="changeCloseTip3"
              >
                <p>{{$t('DDOS.protectCon.strticTitle')}}</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip3">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="modifyDDoSLevel('high')"
                  >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :title="$t('DDOS.protectCon.toggNormal')"
                :visible.sync="changeModelTip2"
                width="30%"
                :append-to-body="true"
                :before-close="changeCloseTip2"
              >
                <p>{{$t('DDOS.protectCon.NormalTitle')}}</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip2">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="modifyDDoSLevel('middle')"
                  >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :title="$t('DDOS.protectCon.toggloose')"
                :visible.sync="changeModelTip1"
                width="30%"
                :append-to-body="true"
                :before-close="changeCloseTip1"
              >
                <p>{{$t('DDOS.protectCon.togglooseTitle')}}</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip1">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="modifyDDoSLevel('low')"
                  >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
                </span>
              </el-dialog>
            </p>
            <!-- 防护等级end -->
            <!-- 高级策略start -->
            <p class="newClear">
              <span class="modelSpan1">{{$t('DDOS.protectCon.AdvancedStra')}}</span>
              <span class="modelSpan2">
                <el-select
                  v-model="servicePack.SPolicyId"
                  class="setSelectM"
                  @change="modifyPolicy"
                >
                  <el-option
                    v-for="(item, index) in policys"
                    :label="item.PolicyName"
                    :value="item.PolicyId"
                    :key="index"
                  ></el-option>
                </el-select>
              </span>
            </p>
            <!-- 高级策略end -->
            <!-- DDOS攻击告警阈值start -->
            <p class="newClear">
              <span class="modelSpan1">{{$t('DDOS.protectCon.configValue')}}</span>
              <span class="modelSpan2 modelSpan2_2">
                <el-select
                  v-model="servicePack.AlarmType"
                  class="setSelectM"
                  @change="modifyAlarmType"
                >
                  <el-option
                    v-for="(item, index) in alarmTypeOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  ></el-option>
                </el-select>
              </span>
              <span class="modelSpan3" v-if="servicePack.AlarmType!=0">
                <el-input
                  type="number"
                  v-model="servicePack.AlarmThreshold"
                  class="intMbps"
                  @change="modifyAlarmThreshold"
                ></el-input>
              </span>
              <span class="modelSpan3" v-if="servicePack.AlarmType!=0">Mbps</span>
            </p>
            <!-- DDOS攻击告警阈值end -->
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  CLAEN_SHOLD,
  Modify_Level,
  GET_SPolicy,
  DDOS_POLICY_MODIFY,
  RESBIND_MODIFY,
  SET_SHOLD,
  GET_SHOLD,
  Modify_Status
} from "@/constants";
import { monthsShort } from "moment";
export default {
  props: {
    configShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ShowFlag: "", //根据防护状态是否展示标签内容
      resourceId: "", //资源id
      servicePack: {
        DefendStatus: true,
        DdosThreshold: "",
        DDoSLevel: "",
        SPolicyId: "",
        AlarmThreshold: "",
        AlarmType: "",
        cleanTime: "1"
      }, //修改框数据绑定
      ipList: [], //资源关联的IP列表
      policys: [], //高级策略数组
      spolicyId: "", //绑定高级策略id
      alarmTypeOptions: [
        { label: "未設置", value: 0 },
        { label: "入流量寬頻", value: 1 },
        { label: "清洗流量", value: 2 }
      ],
      cleanNumOption: [
        { label: "默認", value: "0" },
        { label: "60Mbps", value: "60" },
        { label: "80Mbps", value: "80" },
        { label: "100Mbps", value: "100" },
        { label: "150Mbps", value: "150" },
        { label: "200Mbps", value: "200" },
        { label: "250Mbps", value: "250" },
        { label: "300Mbps", value: "300" },
        { label: "400Mbps", value: "400" },
        { label: "500Mbps", value: "500" },
        { label: "700Mbps", value: "700" },
        { label: "1000Mbps", value: "1000" }
      ], //阈值
      cleanTime: [
        { label: "1小時", value: "1" },
        { label: "2小時", value: "2" },
        { label: "3小時", value: "3" },
        { label: "4小時", value: "4" },
        { label: "5小時", value: "5" },
        { label: "6小時", value: "6" }
      ],
      defendStatusModel: false, //关闭防护状态模态框
      changeModelTip1: false, //修改防护等级提示弹框1
      changeModelTip2: false, //修改防护等级提示弹框2
      changeModelTip3: false //修改防护等级提示弹框3
    };
  },
  computed: {
    configIsShow() {
      return this.configShow;
    }
  },
  methods: {
    init(row) {
      this.freshData(row);
      this.describeDDoSPolicy();
      this.describeDDoSAlarmThreshold(); //获取DDoS告警通知阈值
    },
    freshData(res) {
      res.Record.forEach(item => {
        if (item.Key == "Id") {
          this.resourceId = item.Value;
        } else if (item.Key == "DefendStatus") {
          this.servicePack.DefendStatus = item.Value == 1 ? true : false;
        } else if (item.Key == "DdosThreshold") {
          this.servicePack.DdosThreshold = item.Value;
        } else if (item.Key == "DDoSLevel") {
          this.servicePack.DDoSLevel = item.Value;
        } else if (item.Key == "SPolicyId") {
          this.servicePack.SPolicyId = item.Value;
          this.spolicyId = item.Value;
        } else if (item.Key == "ShowFlag") {
          this.ShowFlag = item.Value;
        } else if (item.Key == "GroupIpList") {
          this.ipList = [];
          let ipArr = item.Value.split(";");
          for (const key in ipArr) {
            if (ipArr.hasOwnProperty(key)) {
              const element = ipArr[key];
              let ipDetailArr = element.split("-");
              this.ipList.push(ipDetailArr[0]);
            }
          }
        }
      });
    },
    // 获取DDoS高级策略列表
    describeDDoSPolicy() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      this.axios.post(GET_SPolicy, params).then(res => {
        this.policys = JSON.parse(JSON.stringify(res.Response.DDosPolicyList));
        this.policys.splice(0, 0, { PolicyName: "無", PolicyId: "" });
      });
    },
    // 获取DDoS告警通知阈值
    describeDDoSAlarmThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        RsId: this.resourceId //资源ID
      };
      this.axios.post(GET_SHOLD, params).then(res => {
        this.servicePack.AlarmThreshold =
          res.Response.DDoSAlarmThreshold.AlarmThreshold;
        this.servicePack.AlarmType = res.Response.DDoSAlarmThreshold.AlarmType;
        // console.log(params, res.Response)
      });
    },
    // 弹框关闭按钮
    handleClose() {
      this.$emit("closeConfigModel", false);
    },
    // 1.0防护状态按钮
    defendStatusSwitch() {
      if (this.servicePack.DefendStatus == false) {
        //关闭防护状态
        this.defendStatusModel = true;
      } else {
        //开启防护状态
        this.servicePack.DefendStatus = true;
        this.modifyDefendStatus();
      }
    },
    // 1.1修改防护状态
    modifyDefendStatus() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Status: this.servicePack.DefendStatus ? 1 : 0,
        Hour: this.servicePack.cleanTime,
        Id: this.resourceId
      };
      this.axios.post(Modify_Status, params).then(res => {
        if (res.Response.Success != undefined) {
          this.ShowFlag = this.servicePack.DefendStatus ? 0 : 1;
        }
      });
      this.defendStatusModel = false;
    },
    // 2.0修改DDoS清洗阈值
    cleanThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId,
        Threshold: this.servicePack.DdosThreshold
      };
      this.axios.post(CLAEN_SHOLD, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
        }
      });
    },
    // 3.0 选择防护等级提示模态框
    clickGarden(typeNum) {
      if (typeNum == "high") {
        this.changeModelTip3 = true;
      } else if (typeNum == "middle") {
        this.changeModelTip2 = true;
      } else if (typeNum == "low") {
        this.changeModelTip1 = true;
      }
    },
    // 3.1 修改DDoSIP防护等级
    modifyDDoSLevel(level) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId,
        Method: "set",
        DDoSLevel: level
      };
      this.axios.post(Modify_Level, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.servicePack.DDoSLevel = level;
          if (level == "low") {
            this.changeModelTip1 = false;
          } else if (level == "middle") {
            this.changeModelTip2 = false;
          } else {
            this.changeModelTip3 = false;
          }
        }
      });
    },
    // 4.0修改高级策略
    modifyPolicy() {
      // console.log(this.servicePack.SPolicyId, DDOS_POLICY_MODIFY);
      let bindFlag = true;
      if (this.spolicyId != "") {
        // 解绑
        let params = {
          Version: "2018-07-09",
          Region: localStorage.getItem("regionv2"),
          Business: "net",
          Id: this.resourceId, //资源ID
          PolicyId: this.spolicyId, //原绑定策略ID
          Method: "unbind" //bind/unbind
        };
        this.axios.post(RESBIND_MODIFY, params).then(res => {
          // console.log(res.Response)
          if (res.Response.Success == undefined) {
            bindFlag = false;
          }
        });
      }
      setTimeout(() => {
        if (bindFlag && this.servicePack.SPolicyId != "") {
          // 绑定
          let params2 = {
            Version: "2018-07-09",
            Region: localStorage.getItem("regionv2"),
            Business: "net",
            Id: this.resourceId, //资源ID
            PolicyId: this.servicePack.SPolicyId, //策略ID
            Method: "bind" //bind/unbind
          };
          this.axios.post(RESBIND_MODIFY, params2).then(res => {
            // console.log(res.Response)
            if (res.Response.Success !== undefined) {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
            }
            this.spolicyId = this.servicePack.SPolicyId;
          });
        }
      }, 2000);
    },
    // 5.0修改DDOS攻击告警阈值（类型）
    modifyAlarmType() {
      // console.log(this.servicePack.AlarmType, this.servicePack.AlarmThreshold);
      if (
        this.servicePack.AlarmType == 0 ||
        !/(^[1-9]\d*$)/.test(this.servicePack.AlarmThreshold)
      ) {
        this.servicePack.AlarmThreshold = 1000;
      }
      this.modifyDDoSAlarmThreshold();
    },
    modifyAlarmThreshold() {
      // console.log(this.servicePack.AlarmType, this.servicePack.AlarmThreshold);
      if (this.servicePack.AlarmThreshold == "") {
        this.$message({
          showClose: true,
          message: "DDoS攻告警阈值不為空",
          type: "warning"
        });
        return;
      }
      if (!/(^[1-9]\d*$)/.test(this.servicePack.AlarmThreshold)) {
        this.$message({
          showClose: true,
          message: "DDoS攻告警阈值為正整數",
          type: "warning"
        });
        return;
      }
      this.modifyDDoSAlarmThreshold();
    },
    //设置DDoS告警通知阈值
    modifyDDoSAlarmThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        RsId: this.resourceId,
        AlarmType: this.servicePack.AlarmType, //告警阈值类型，0-未设置，1-入流量，2-清洗流量
        AlarmThreshold: this.servicePack.AlarmThreshold
      };
      // 添加参数：资源关联的IP列表
      for (const i in this.ipList) {
        if (this.ipList.hasOwnProperty(i)) {
          const ip = this.ipList[i];
          params["IpList." + i] = ip;
        }
      }
      this.axios.post(SET_SHOLD, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
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

    changeCloseTip1() {
      this.changeModelTip1 = false;
    },
    changeCloseTip2() {
      this.changeModelTip2 = false;
    },
    changeCloseTip3() {
      this.changeModelTip3 = false;
    },
    closeDefendStatus() {
      this.defendStatusModel = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  a {
    display: inline-block;
    margin: 0 20px;
  }
  .modelSpan1 {
    width: 120px;
  }

  .newClear >>> .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    padding-top: 0 !important;
    border-radius: 0 !important;
  }
}

.modelSpan3 >>> .el-input__inner {
  width: 100px;
  margin-left: 10px;
}
.modelSpan2 {
  float: left;
}
.modelSpan3 {
  float: left;
  margin-top: 10px;
}
.modelSpan2_2 {
  margin-top: 10px;
}
#configModel {
  .modelCenterCon {
    p {
      margin-bottom: 15px;
      span:nth-child(1).modelSpan1 {
        display: inline-block;
        font-size: 12px;
        color: #888;
        width: 126px;
        i {
          margin-left: 6px;
        }
      }
      span:nth-child(2).modelSpan2 {
        .gardenChoose {
          padding: 0 20px;
          font-size: 12px;
        }
      }
    }
  }
}
.seceltGarden {
  color: #006eff !important;
}
.outOk {
  font-size: 12px;
  line-height: inherit;
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  box-sizing: border-box;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.tooltip_text {
  font-size: 14px;
  .tooltip_text_bold {
    font-weight: bold;
  }
  .indent {
    padding-left: 20px;
  }
}
</style>
