<template>
  <!-- 接入配置-添加转发规则 -->
  <div>
    <div>
      <el-dialog
        class="dialogModel"
        :title="$t('DDOS.AccesstoCon.addAcc')"
        :visible.sync="getIsShow"
        width="30%"
        :before-close="handleClose"
      >
        <div class="createRulesForm">
          <p class="tc-15-msg error" v-if="checkIpFlg == false">
            {{$t('DDOS.accessCopy.editWarning')}}
          </p>
          <p class="tc-15-msg error" v-if="checkNetFlg == false">
            {{$t('DDOS.accessCopy.netWarning')}}
          </p>
          <p class="tc-15-msg error" v-if="checkNumFlg == false">
            {{$t('DDOS.accessCopy.numWarning')}}
          </p>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.businessDoma')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="RuleName"></el-input>
              <p>{{$t('DDOS.accessCopy.accessCopyTitle')}}</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingPro')}}</span>
            <span class="ruleListIpt">
              <el-select class="forwardHttp" v-model="Protocol">
                <el-option
                  v-for="(item, index) in protocolList"
                  :label="item.pro"
                  :value="item.pro"
                  :key="index"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingExcit')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="VirtualPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="SourcePort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button
                  class="BackResouse"
                  @click="BackResouse(2)"
                  :style="SourceType==2?'color:#006eff;border:1px solid #006eff':''"
                >IP回源</el-button>
                <el-button
                  class="BackResouse"
                  @click="BackResouse(1)"
                  :style="SourceType==1?'color:#006eff;border:1px solid #006eff':''"
                >域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.LoadBalancing')}}</span>
            <span class="ruleListIpt">
              <el-button
                class="BackResouse"
                :style="LbType==1?'color:#006eff;border:1px solid #006eff':''"
              >{{$t('DDOS.AccesstoCon.WeightedPoll')}}</el-button>
            </span>
          </div>
          <div class="ruleList newClear">
            <span
              class="ruleListLabel"
            >{{SourceType==1?'源站域名':$t('DDOS.accessCopy.SourceIp')}}</span>
            <span class="ruleListIpt">
              <el-input
                type="textarea"
                class="resoureStation"
                v-model="textData"
                @input="textDataChange"
              />
              <p>{{SourceType==1?$t('DDOS.accessCopy.domainTitle'):$t('DDOS.accessCopy.SoutceTitle')}}</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="createL4Rules">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { L4RULES_CREATE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  //子页面调用L4转发规则的方法
  inject: ["describleL4Rules"],
  props: {
    isShow: Boolean,
    resourceId: String
  },
  data() {
    return {
      dialogVisible: "", //弹框
      RuleName: "", //业务域名
      Protocol: "TCP", //转发协议，取值[TCP, UDP]
      protocolList: [{ pro: "TCP" }, { pro: "UDP" }],
      VirtualPort: "", //转发端口
      SourcePort: "", //源站端口
      SourceType: 2, //回源方式，取值[1(域名回源)，2(IP回源)]
      KeepTime: 0, //会话保持时间，单位秒
      textData: "",
      LbType: 1, //负载均衡方式，取值[1(加权轮询)，2(源IP hash)]
      KeepEnable: 0, //会话保持开关，取值[0(会话保持关闭)，1(会话保持开启)]
      checkIpFlg: true, //textData是否通过IP校验
      checkNetFlg: true, //textData是否通过域名校验
      checkNumFlg: true //textData是否通过数量校验
    };
  },
  computed: {
    getIsShow() {
      this.dialogVisible = this.isShow;
      return this.isShow;
    },
    getResourceId() {
      return this.resourceId;
    }
  },
  methods: {
    //弹框关闭按钮
    handleClose() {
      this.dialogVisible = false;
      this.clearData();
      this.$emit("addRulesSure", this.dialogVisible);
    },
    // 数据清空方法
    clearData() {
      this.RuleName = ""; //业务域名
      this.Protocol = "TCP"; //转发协议，取值[TCP, UDP]
      this.protocolList = [{ pro: "TCP" }, { pro: "UDP" }];
      this.VirtualPort = ""; //转发端口
      this.SourcePort = ""; //源站端口
      this.SourceType = 2; //回源方式，取值[1(域名回源)，2(IP回源)]
      this.KeepTime = 0; //会话保持时间，单位秒
      this.textData = "";
      this.LbType = 1; //负载均衡方式，取值[1(加权轮询)，2(源IP hash)]
      this.KeepEnable = 0; //会话保持开关，取值[0(会话保持关闭)，1(会话保持开启)]
    },
    // 1.1.添加L4转发规则(弹框确定按钮)
    createL4Rules() {
      if (!this.checkIpFlg || !this.checkNetFlg || !this.checkNumFlg) {
        return;
      }
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId,
        "Rules.0.RuleName": this.RuleName,
        "Rules.0.Protocol": this.Protocol,
        "Rules.0.VirtualPort": this.VirtualPort,
        "Rules.0.SourcePort": this.SourcePort,
        "Rules.0.SourceType": this.SourceType,
        "Rules.0.LbType": this.LbType,
        "Rules.0.KeepTime": this.KeepTime,
        "Rules.0.KeepEnable": this.KeepEnable
      };

      let arr = this.textData.split(/[\s\n]/);
      if (this.SourceType == 1) {
        //域名
        for (let i = 0; i < arr.length; i++) {
          params["Rules.0.SourceList." + i + ".Source"] = arr[i];
          params["Rules.0.SourceList." + i + ".Weight"] = 0;
        }
      } else if (this.SourceType == 2) {
        //IP
        for (let i = 0; i < arr.length / 2; i++) {
          params["Rules.0.SourceList." + i + ".Source"] = arr[i * 2];
          params["Rules.0.SourceList." + i + ".Weight"] = arr[i * 2 + 1];
        }
      }
      this.axios.post(L4RULES_CREATE, params).then(res => {
        // console.log(params)
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          this.clearData();
          this.dialogVisible = false;
          this.$emit("addRulesSure", this.dialogVisible);
          this.describleL4Rules();
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
    //回源方式点击按钮
    BackResouse(thisType) {
      this.SourceType = thisType;
      if (thisType == "2") {
        this.protocolList = [{ pro: "TCP" }, { pro: "UDP" }];
      } else if (thisType == "1") {
        this.Protocol = "TCP";
        this.protocolList = [{ pro: "TCP" }];
      }
    },
    //值改变调用校验方法（先校验是否正确，再检查数量）
    textDataChange() {
      this.checkIpFlg = true;
      this.checkNetFlg = true;
      this.checkNumFlg = true;
      if (this.textData == "") {
        return
      }
      let arr = this.textData.split(/[\s\n]/);
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var regNet = new RegExp("^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$");
      var regNUM = /(^[0-9]\d*$)/;
      if (this.SourceType == "2") {
        //IP回源
        for (let i = 0; i < arr.length / 2; i++) {
          if (!regIP.test(arr[i * 2]) || !regNUM.test(arr[i * 2 + 1])) {
            this.checkIpFlg = false;
            return
          }
        }
        if (arr.length/2 > 20) {
          this.checkNumFlg = false;
          return
        }
      } else if (this.SourceType == "1") {
        //域名回源
        for(let i=0; i<arr.length; i++) {
          if (!regNet.test(arr[i]) || arr[i].indexOf(".") == -1) {
            this.checkNetFlg = false;
            return
          }
        }
        if (arr.length > 20) {
          this.checkNumFlg = false;
          return
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tc-15-msg {
  color: #b43537;
  border: 1px solid #f6b5b5;
  background-color: #fcecec;
  background: #fcecec;
  border-radius: 0;
  font-size: 12px;
  line-height: inherit;
  padding: 10px 30px 10px 20px;
  position: relative;
  max-width: 1360px;
  margin-block-end: 1em;
}
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.dialogModel {
  .el-dialog__header {
    font-size: 14px !important;
    font-weight: 600;
    .el-dialog__title {
      font-size: 14px !important;
      font-weight: 600;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .titleTip {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 12px;
  }
  .lookDetails {
    font-size: 12px;
    color: #000;
    .fontweight {
      font-size: 12px;
      font-weight: 600;
    }
  }
}
.createRulesForm {
  padding: 10px 0;
  .ruleList {
    margin-bottom: 15px;
    color: #999;
    font-size: 12px;
    input {
      border-radius: 0;
      width: 178px;
      height: 30px;
    }
    span.ruleListLabel {
      display: inline-block;
      width: 100px;
      text-align: left;
      float: left;
    }
    span.ruleListIpt {
      float: left;
      width: calc(100% - 100px);
      .forwardHttp {
        width: 178px;
        div {
          width: 178px;
        }
      }
      .BackResouse {
        padding: 0 20px;
        line-height: 30px;
        height: 30px;
        border-radius: 0;
      }
      .el-button:not(:last-child) {
        margin-right: 0;
      }
      .resoureStation {
        width: 65%;
        height: 100px;
        border-radius: 0;
        resize: none;
        textarea {
          width: 100%;
          height: 100px;
          border-radius: 0;
          resize: none;
        }
      }
    }
  }
}
</style>