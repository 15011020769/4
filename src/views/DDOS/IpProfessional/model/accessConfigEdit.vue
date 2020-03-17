<template>
  <!-- 接入配置-编辑转发规则 -->
  <div>
    <div>
      <el-dialog
        class="dialogModel"
        :title="$t('DDOS.AccesstoCon.editAcc')"
        :visible.sync="getIsShow"
        width="30%"
        :before-close="handleClose"
      >
        <div class="createRulesForm">
          <p class="tc-15-msg error" v-if="checkflg == false">{{$t('DDOS.accessCopy.editWarning')}}</p>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.businessDoma')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.RuleName"></el-input>
              <p>{{$t('DDOS.accessCopy.accessCopyTitle')}}</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingPro')}}</span>
            <span class="ruleListIpt">
              <el-select class="forwardHttp" v-model="EnidData.Protocol">
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
              <el-input v-model="EnidData.VirtualPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.SourcePort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button
                  class="BackResouse"
                  @click="BackResouse()"
                  :style="EnidData.SourceType==2?'color:#006eff;border:1px solid #006eff':''"
                >IP回源</el-button>
                <el-button
                  class="BackResouse"
                  @click="BackResouse()"
                  :style="EnidData.SourceType==1?'color:#006eff;border:1px solid #006eff':''"
                >域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.LoadBalancing')}}</span>
            <span class="ruleListIpt">
              <el-button
                class="BackResouse"
                :style="EnidData.LbType==1?'color:#006eff;border:1px solid #006eff':''"
              >{{$t('DDOS.accessCopy.WeightedPoll')}}</el-button>
            </span>
          </div>
          <div class="ruleList newClear">
            <span
              class="ruleListLabel"
            >{{EnidData.SourceType==1?'源站域名':$t('DDOS.accessCopy.SourceIp')}}</span>
            <span class="ruleListIpt">
              <el-input
                type="textarea"
                class="resoureStation"
                v-model="textData"
                @input="textDataChange"
              />
              <p>{{EnidData.SourceType==1?$t('DDOS.accessCopy.domainTitle'):$t('DDOS.accessCopy.SoutceTitle')}}</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="editSure">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ENID_CREATE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  inject: ["describleL4Rules"],
  props: {
    isShow3: Boolean,
    resourceId: String
  },
  data() {
    return {
      dialogVisible: "", //弹框状态
      protocolList: [{ pro: "TCP" }, { pro: "UDP" }],
      EnidData: "", //获取某一条数据
      textData: "",
      checkflg: true //textData是否通过校验
    };
  },
  computed: {
    getIsShow() {
      this.dialogVisible = this.isShow3;
      return this.isShow3;
    },
    getResourceId() {
      return this.resourceId;
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("closeEditModel", this.dialogVisible);
    },
    init(scopeRow) {
      this.textData = "";
      if (scopeRow.SourceType == 1) {
        //域名
        this.protocolList = [{ pro: "TCP" }];
        for (let i = 0; i < scopeRow.SourceList.length; i++) {
          this.textData = this.textData.concat(
            scopeRow.SourceList[i].Source +
              (i + 1 == scopeRow.SourceList.length ? "" : "\n")
          );
        }
      } else if (scopeRow.SourceType == 2) {
        //IP
        this.protocolList = [{ pro: "TCP" }, { pro: "UDP" }];
        for (let i = 0; i < scopeRow.SourceList.length; i++) {
          this.textData = this.textData.concat(
            scopeRow.SourceList[i].Source +
              " " +
              scopeRow.SourceList[i].Weight +
              (i + 1 == scopeRow.SourceList.length ? "" : "\n")
          );
        }
      }
      this.EnidData = JSON.parse(JSON.stringify(scopeRow));
    },
    //编辑确定按钮
    editSure() {
      if (!this.checkflg) {
        return;
      }
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.getResourceId,
        "Rule.RuleId": this.EnidData.RuleId,
        "Rule.RuleName": this.EnidData.RuleName,
        "Rule.Protocol": this.EnidData.Protocol,
        "Rule.VirtualPort": this.EnidData.VirtualPort,
        "Rule.SourcePort": this.EnidData.SourcePort,
        "Rule.SourceType": this.EnidData.SourceType,
        "Rule.LbType": this.EnidData.LbType,
        "Rule.KeepTime": this.EnidData.KeepTime
      };

      let arr = this.textData.split(/[\s\n]/);
      if (this.EnidData.SourceType == 1) {
        //域名
        for (let i = 0; i < arr.length; i++) {
          params["Rule.SourceList." + i + ".Source"] = arr[i];
          params["Rule.SourceList." + i + ".Weight"] = 0;
        }
      } else if (this.EnidData.SourceType == 2) {
        //IP
        for (let i = 0; i < arr.length / 2; i++) {
          params["Rule.SourceList." + i + ".Source"] = arr[i * 2];
          params["Rule.SourceList." + i + ".Weight"] = arr[i * 2 + 1];
        }
      }
      this.axios.post(ENID_CREATE, params).then(res => {
        // console.log(res)
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "編輯成功",
            type: "success"
          });
          this.describleL4Rules();
          this.dialogVisible = false;
          this.$emit("closeEditModel", this.dialogVisible);
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
    BackResouse() {
      this.$message({
        showClose: true,
        message: "回源方式不允許修改",
        type: "warning"
      });
    },
    //值改变调用校验方法
    textDataChange() {
      let arr = this.textData.split(/[\s\n]/);
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var regNUM = /(^[1-9]\d*$)/;
      this.checkflg = true;
      if (this.EnidData.SourceType == "2") {
        //IP回源
        for (let i = 0; i < arr.length / 2; i++) {
          if (!regIP.test(arr[i * 2]) || !regNUM.test(arr[i * 2 + 1])) {
            this.checkflg = false;
            // return
          }
        }
      } else if (this.EnidData.SourceType == "1") {
        //域名回源
        // for(let i=0; i<arr.length; i++) {
        //   params['Rules.0.SourceList.'+i+'.Source'] = arr[i]
        // }
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
</style>