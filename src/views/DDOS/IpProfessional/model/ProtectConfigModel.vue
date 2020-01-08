<template>
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
          <p class="newClear">
            <span class="modelSpan1">{{$t('DDOS.protectCon.protectionStatus')}}</span>
            <span @click="outOk()">
              <el-switch
                v-model="servicePack.DefendStatus"
                active-color="#006eff"
                inactive-color="#999"
              ></el-switch>
            </span>
          </p>
          <div v-if="ShowFlag=='0'?true:false">
            <p class="newClear">
              <span class="modelSpan1">
                {{$t('DDOS.protectCon.CleaningShold')}}
                <i class="el-icon-info"></i>
              </span>
              <!-- 清洗阙值 -->
              <span>
                <!-- v-model="servicePack.DdosThreshold" -->
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
            <p class="newClear">
              <span class="modelSpan1">
                {{$t('DDOS.protectCon.ProtectionGrade')}}
                <i class="el-icon-info"></i>
              </span>
              <span class="modelSpan2">
                <a
                  :class="saveGarden==1?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden(1,'宽松')"
                >{{$t('DDOS.protectCon.loose')}}</a>
                <a
                  :class="saveGarden==2?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden(2,'正常')"
                >正常</a>
                <a
                  :class="saveGarden==3?'seceltGarden gardenChoose':'gardenChoose'"
                  @click="clickGarden(3,'严格')"
                >{{$t('DDOS.protectCon.strict')}}</a>
              </span>

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
                    @click="changeSureTip1()"
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
                    @click="changeSureTip1()"
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
                    @click="changeSureTip1()"
                  >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
                </span>
              </el-dialog>
              <el-dialog
                :title="$t('DDOS.protectCon.CloseConfirm')"
                :visible.sync="changeModelTip4"
                width="30%"
                :append-to-body="true"
                :before-close="changeCloseTip4"
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
                  <el-button @click="changeCloseTip4">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="changeSureTip4(servicePack.cleanTime)"
                  >{{$t('DDOS.accessCopy.domainSure')}}</el-button>
                </span>
              </el-dialog>
            </p>
            <p class="newClear">
              <span class="modelSpan1">{{$t('DDOS.protectCon.AdvancedStra')}}</span>
              <span class="modelSpan2">
                <el-select v-model="topFun" class="setSelectM" @change="changeTopFun">
                  <el-option :label="$t('DDOS.protectCon.noHave')" value="no"></el-option>
                  <el-option label="erg" value="erg"></el-option>
                  <el-option label="高级防护策略测试" value="高级防护策略测试"></el-option>
                  <el-option label="sxdfg" value="sxdfg"></el-option>
                  <el-option label="asd" value="asd"></el-option>
                </el-select>
              </span>
            </p>
            <p class="newClear">
              <span class="modelSpan1">{{$t('DDOS.protectCon.configValue')}}</span>
              <span class="modelSpan2 modelSpan2_2">
                <el-select v-model="ddosWarning" class="setSelectM" @change="selectChange1">
                  <el-option :label="$t('DDOS.protectCon.NotSet')" value="no"></el-option>
                  <el-option :label="$t('DDOS.protectCon.Incoming')" value="into"></el-option>
                  <el-option :label="$t('DDOS.protectCon.CleaningFlow')" value="clean"></el-option>
                </el-select>
              </span>
              <span class="modelSpan3" v-if="iptNummbps">
                <!-- <span v-if="iptNummbps"> -->
                <el-input v-model="iptmbpsText" class="intMbps" @input="CreateBasic"></el-input>
              </span>
              <span class="modelSpan3" v-if="iptNummbps">Mbps</span>
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  GET_ID,
  GET_SPolicy,
  GET_Status,
  CLAEN_SHOLD,
  Modify_Level,
  DDOS_POLICY_MODIFY,
  SET_SHOLD,
  Modify_Status
} from "@/constants";
export default {
  // props: {
  //   configShow: Boolean,
  //   changeRow:,
  // },
  props: {
    configShow: {
      type: Boolean,
      default: true
    },
    changeRow1: {
      type: String,
      default: ""
    },
    ddoslevel: {
      type: String,
      default: ""
    }
  },
  watch: {
    changeRow1(val) {
      this.servicePack.DdosThreshold = val;
    },
    ddoslevel(val) {
      if (val == "low") {
        this.saveGarden = 1;
      } else if (val == "middle") {
        this.saveGarden = 2;
      } else if (val == "high") {
        this.saveGarden = 3;
      }
    }
  },
  data() {
    return {
      modelIsShow: "", //模态框
      servicePack: {
        DefendStatus: "",
        DdosThreshold: "",
        cleanTime: ""
      }, //修改框数据绑定
      cleanNumOption: [
        { label: "默认", value: "0" },
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
        { label: "1小时", value: "1" },
        { label: "2小时", value: "2" },
        { label: "3小时", value: "3" },
        { label: "4小时", value: "4" },
        { label: "5小时", value: "5" },
        { label: "6小时", value: "6" }
      ],
      saveGarden: "", //防护等级
      saveGardenText: "宽松",
      topFun: "", //高级策略
      ddosWarning: "no", //攻告警阈值
      iptNummbps: false, //告警阈值输入框隐藏
      iptmbpsText: "1000",
      saveStatus: true, //防护状态
      resourceId: "",
      tableDataPolicy: [], //tab3,DDoS高级防护策略
      changeModelTip1: false, //修改模式提示弹框
      changeModelTip2: false,
      changeModelTip3: false,
      changeModelTip4: false,
      tabMode: "", //防护等级
      AlarmType: "", //告警阈值类型，1-入流量，2-清洗流量
      ShowFlag: "", //控制台功能展示字段，为1表示控制台功能展示，为0表示控制台功能隐藏
      UndefendExpire: "", //防护临时关闭的过期时间
      Status: ""
    };
  },
  computed: {
    configIsShow() {
      return this.configShow;
    },
    configDataShow() {
      return this.configData;
    }
  },
  watch: {
    configDataShow: {
      handler(val) {
        console.log(val);
        let DdosThreshold = val.filter(v => {
          return v.Key == "DdosThreshold";
        });

        this.servicePack.DdosThreshold = DdosThreshold[0].Value;
        // this.topFun=''
      },
      deep: true
    }
  },
  created() {
    this.GetID(); //获取ID
    this.GETSPolicy(); //获取DDoS高级策略
    this.servicePack.DdosThreshold = this.changeRow1;
    if (this.ddoslevel == "low") {
      this.saveGarden = 1;
    } else if (this.ddoslevel == "middle") {
      this.saveGarden = 2;
    } else if (this.ddoslevel == "high") {
      this.saveGarden = 3;
    }
  },
  methods: {
    //获取ID
    GetID() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(GET_ID, params).then(res => {
        this.resourceId = res.Response.Resource[0].Id;
        this.GETStatus(); // 获取DDoS防护状态
      });
    },
    // 获取DDoS高级策略
    GETSPolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(GET_SPolicy, params).then(res => {
        this.topFun = res.Response.DDosPolicyList[0].PolicyName;
      });
    },
    // 获取DDoS防护状态
    GETStatus() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId
      };
      this.axios.post(GET_Status, params).then(res => {
        this.ShowFlag = res.Response.ShowFlag;
        if (res.Response.DefendStatus == 0) {
          this.servicePack.DefendStatus = false;
        }
      });
    },
    //弹框关闭按钮
    handleClose() {
      this.modelIsShow = false;
      this.$emit("closeConfigModel", this.modelIsShow);
    },
    selectChange1() {
      if (this.ddosWarning == "no") {
        this.iptNummbps = false;
      } else if (this.ddosWarning == "into") {
        this.iptNummbps = true;
        this.AlarmType = 1;
        this.CreateBasic();
      } else {
        this.iptNummbps = true;
        this.AlarmType = 2;
        this.CreateBasic();
      }
    },
    //选择防护等级
    clickGarden(typeNum, type) {
      this.changeModel = false;
      if (typeNum == 3) {
        this.changeModelTip3 = true;
        this.tabMode = "high";
      } else if (typeNum == 2) {
        this.changeModelTip2 = true;
        this.tabMode = "middle";
      } else if (typeNum == 1) {
        this.changeModelTip1 = true;
        this.tabMode = "low";
      }
    },
    //防护状态按钮
    outOk() {
      if (this.servicePack.DefendStatus == false) {
        this.changeModelTip4 = true;
        this.Status = 0;
      } else {
        this.changeModelTip4 = false;
        this.Status = 1;
        this.startSureTip();
      }
    },
    //修改DDoS清洗阈值
    cleanThreshold(value) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId,
        Threshold: value
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
    changeCloseTip1() {
      this.changeModelTip1 = false;
    },
    changeCloseTip2() {
      this.changeModelTip2 = false;
    },
    changeCloseTip3() {
      this.changeModelTip3 = false;
    },
    changeCloseTip4() {
      this.changeModelTip4 = false;
      this.servicePack.DefendStatus = true;
    },
    //修改DDoSIP防护等级
    changeSureTip1() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId,
        Method: "set",
        DDoSLevel: this.tabMode
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
        }
        if (this.tabMode == "low") {
          this.saveGarden = 1;
          this.saveGardenText = "宽松";
          this.changeModelTip1 = false;
        } else if (this.tabMode == "middle") {
          this.saveGarden = 2;
          this.saveGardenText = "正常";
          this.changeModelTip2 = false;
        } else {
          this.saveGarden = 3;
          this.saveGardenText = "严格";
          this.changeModelTip3 = false;
        }
      });
    },
    //修改高级策略
    changeTopFun() {
      console.log(this.topFun, DDOS_POLICY_MODIFY);
      // let params = {
      //   Action:'ModifyDDoSPolicy',
      //   Version: "2018-07-09",
      //   Business: "net",
      //   PolicyId: this.resourceId,
      //   "DropOptions.N":'',
      //   Method: "set",
      //   DDoSLevel: this.tabMode
      // };
    },
    //设置基础防护的DDoS告警阈值
    CreateBasic() {
      let params = {
        Version: "2018-07-09",
        Business: "basic",
        Method: "set",
        AlarmType: this.AlarmType,
        AlarmThreshold: this.iptmbpsText
      };
      this.axios.post(SET_SHOLD, params).then(res => {
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
    // 关闭防护确认按钮
    changeSureTip4(value) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Status: this.Status,
        Hour: value,
        Id: this.resourceId
      };
      this.axios.post(Modify_Status, params).then(res => {
        this.changeModelTip4 = false;
        this.servicePack.DefendStatus = true;
        this.GETStatus(); // 获取DDoS防护状态
      });
    },
    // 开闭防护确认按钮
    startSureTip() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Status: this.Status,
        Hour: 1,
        Id: this.resourceId
      };
      this.axios.post(Modify_Status, params).then(res => {
        this.changeModelTip4 = false;
        this.servicePack.DefendStatus = true;
        this.GETStatus(); // 获取DDoS防护状态
      });
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
    color: #000;
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
        .seceltGarden {
          color: #006eff;
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
</style>
