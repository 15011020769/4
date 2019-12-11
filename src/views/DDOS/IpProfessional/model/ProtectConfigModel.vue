<template>
  <div id="configModel">
    <div>
      <el-dialog title="DDoS防护配置" :visible.sync="configIsShow" width="40%" :append-to-body="true" :before-close="handleClose">
        <div class="modelCenterCon">
          <p>
            <span class="modelSpan1">防护状态</span>
            <span @click="outOk()">
              <el-switch v-model="servicePack.DefendStatus" active-color="#006eff" inactive-color="#999">
              </el-switch>
            </span>
          </p>
          <div v-if="ShowFlag=='0'?true:false">
            <p>
              <span class="modelSpan1">清洗阈值<i class="el-icon-info"></i></span>
              <span>
                <el-select v-model="servicePack.DdosThreshold" class="setSelectM" @change="cleanThreshold">
                  <el-option v-for="(item, index) in cleanNumOption" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </span>
            </p>
            <p>
              <span class="modelSpan1">防护等级<i class="el-icon-info"></i></span>
              <span>
                <a class="gardenChoose" :class="saveGarden==1?'seceltGarden':''" @click="clickGarden(1,'宽松')">宽松</a>
                <a class="gardenChoose" :class="saveGarden==2?'seceltGarden':''" @click="clickGarden(2,'正常')">正常</a>
                <a class="gardenChoose" :class="saveGarden==3?'seceltGarden':''" @click="clickGarden(3,'严格')">严格</a>
              </span>
              <el-dialog title="确认切换到严格模式？" :visible.sync="changeModelTip3" width="30%" :append-to-body="true" :before-close="changeCloseTip3">
                <p>严格模式可能会影响业务，建议仅在正常模式透传攻击包影响业务时才使用。如果严格模式仍然无法解决透传影响业务的问题，请联系售后技术支持定制策略。</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip3">取 消</el-button>
                  <el-button type="primary" @click="changeSureTip1()">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog title="确认切换到正常模式？" :visible.sync="changeModelTip2" width="30%" :append-to-body="true" :before-close="changeCloseTip2">
                <p>默认清洗模式，清洗策略不松不紧。</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip2">取 消</el-button>
                  <el-button type="primary" @click="changeSureTip1()">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog title="确认切换到宽松模式？" :visible.sync="changeModelTip1" width="30%" :append-to-body="true" :before-close="changeCloseTip1">
                <p>宽松模式在遇到复杂攻击时可能会存在攻击透传，建议仅在正常模式存在误杀影响业务时使用。如果宽松模式仍然无法解决误杀问题，请联系售后技术支持进行策略定制。</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip1">取 消</el-button>
                  <el-button type="primary" @click="changeSureTip1()">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog title="关闭防护确认" :visible.sync="changeModelTip4" width="30%" :append-to-body="true" :before-close="changeCloseTip4">
                <p class="outOk">目前只能临时关闭防护1-6小时，超时后防护会自动恢复，攻击超过100wpps或2Gbps时防护会自动恢复。</p>
                <span class="modelSpan1">请设置关闭防护时长：</span>
                <span>
                  <el-select v-model="servicePack.cleanTime" class="setSelectM">
                    <el-option v-for="(item, index) in cleanTime" :label="item.label" :value="item.value" :key="index"></el-option>
                  </el-select>
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="changeCloseTip4">取 消</el-button>
                  <el-button type="primary" @click="changeSureTip4(servicePack.cleanTime)">确 定</el-button>
                </span>
              </el-dialog>

            </p>
            <p>
              <span class="modelSpan1">高级策略</span>
              <span>
                <el-select v-model="topFun" class="setSelectM">
                  <el-option label="无" value="no"></el-option>
                  <el-option label="erg" value="erg"></el-option>
                </el-select>
              </span>
            </p>
            <p>
              <span class="modelSpan1">DDoS攻击告警阈值</span>
              <span>
                <el-select v-model="ddosWarning" class="setSelectM" @change="selectChange1">
                  <el-option label="未设置" value="no"></el-option>
                  <el-option label="入流量宽带" value="into"></el-option>
                  <el-option label="清洗流量" value="clean"></el-option>
                </el-select>
                <span v-if="iptNummbps">
                  <el-input v-model="iptmbpsText" class="intMbps" @input="CreateBasic"></el-input> Mbps
                </span>
              </span>
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    configShow: Boolean
  },
  data() {
    return {
      modelIsShow: '',//模态框
      servicePack: {
        DefendStatus: '',
        DdosThreshold: '',
        cleanTime: ''
      },//修改框数据绑定
      cleanNumOption: [
        { label: '默认', value: '0' },
        { label: '60Mbps', value: '60' },
        { label: '80Mbps', value: '80' },
        { label: '100Mbps', value: '100' },
        { label: '150Mbps', value: '150' },
        { label: '200Mbps', value: '200' },
        { label: '250Mbps', value: '250' },
        { label: '300Mbps', value: '300' },
        { label: '400Mbps', value: '400' },
        { label: '500Mbps', value: '500' },
        { label: '700Mbps', value: '700' },
        { label: '1000Mbps', value: '1000' },
      ],//阈值
      cleanTime: [
        { label: '1小时', value: '1' },
        { label: '2小时', value: '2' },
        { label: '3小时', value: '3' },
        { label: '4小时', value: '4' },
        { label: '5小时', value: '5' },
        { label: '6小时', value: '6' },
      ],
      saveGarden: '',//防护等级
      saveGardenText: '宽松',
      topFun: '',//高级策略
      ddosWarning: 'no',//攻告警阈值
      iptNummbps: false,//告警阈值输入框隐藏
      iptmbpsText: '1000',
      saveStatus: true,//防护状态
      resourceId: '',
      tableDataPolicy: [],//tab3,DDoS高级防护策略
      changeModelTip1: false,//修改模式提示弹框
      changeModelTip2: false,
      changeModelTip3: false,
      changeModelTip4: false,
      tabMode: '',//防护等级
      AlarmType: '',//告警阈值类型，1-入流量，2-清洗流量
      ShowFlag: '', //控制台功能展示字段，为1表示控制台功能展示，为0表示控制台功能隐藏
      UndefendExpire: '', //防护临时关闭的过期时间
      Status: '',
    }
  },
  computed: {
    configIsShow() {
      return this.configShow
    },

  },
  created() {
    this.GetID()  //获取ID
    this.GETStatus() // 获取DDoS防护状态
    //  this.GETSPolicy() // 获取DDoS高级策略
  },
  methods: {
    //获取ID
    GetID() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
      };
      this.axios.post('dayu2/DescribeResIpList', params).then(res => {
        // console.log(res.Response)
        this.resourceId = res.Response.Resource[0].Id
        this.GETStatus() // 获取DDoS防护状态
      });
    },
    // 获取DDoS高级策略
    GETSPolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
      };
      this.axios.post('dayu2/DescribeDDoSPolicy', params).then(res => {
<<<<<<< HEAD
        console.log(res);
        
=======
        // console.log(res.Response);
        this.topFun = res.Response.DDosPolicyList[0].PolicyName
>>>>>>> DDOS防护状态
      });
    },
    // 获取DDoS防护状态
    GETStatus() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId,
      };
      this.axios.post('dayu2/DescribeDDoSDefendStatus', params).then(res => {
        // console.log(res.Response);
        this.ShowFlag = res.Response.ShowFlag
        if (res.Response.DefendStatus == 0) {
          this.servicePack.DefendStatus = false
        }
      });
    },
    //弹框关闭按钮
    handleClose() {
      this.modelIsShow = false;
      this.$emit("closeConfigModel", this.modelIsShow)
    },
    selectChange1() {
      if (this.ddosWarning == 'no') {
        this.iptNummbps = false;
      } else if (this.ddosWarning == 'into') {
        this.iptNummbps = true;;
        this.AlarmType = 1
        this.CreateBasic()
      } else {
        this.iptNummbps = true;;
        this.AlarmType = 2
        this.CreateBasic()
      }
    },
    //选择防护等级
    clickGarden(typeNum, type) {
      this.changeModel = false;
      if (typeNum == 3) {
        this.changeModelTip3 = true;
        this.tabMode = 'high'
      } else if (typeNum == 2) {
        this.changeModelTip2 = true;
        this.tabMode = 'middle'
      } else if (typeNum == 1) {
        this.changeModelTip1 = true;
        this.tabMode = 'low'
      }
    },
    //防护状态按钮
    outOk() {
      if (this.servicePack.DefendStatus == false) {
        this.changeModelTip4 = true;
        this.Status = 0
        // this.modelIsShow=false;
        // this.$emit("closeConfigModel",this.modelIsShow)
      } else {
        this.changeModelTip4 = false;
        this.Status = 1;
        this.startSureTip()
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
      this.axios.post('dayu2/ModifyDDoSThreshold', params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        } else {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
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
      // this.modelIsShow=true;
      // this.$emit("closeConfigModel",this.modelIsShow)
    },
    //修改DDoSIP防护等级
    changeSureTip1() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId,
        Method: 'set',
        DDoSLevel: this.tabMode
      };
      this.axios.post('dayu2/ModifyDDoSLevel', params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        } else {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        }
        if (this.tabMode == 'low') {
          this.saveGarden = 1;
          this.saveGardenText = '宽松'
          this.changeModelTip1 = false
        } else if (this.tabMode == 'middle') {
          this.saveGarden = 2;
          this.saveGardenText = '正常'
          this.changeModelTip2 = false;
        } else {
          this.saveGarden = 3;
          this.saveGardenText = '严格'
          this.changeModelTip3 = false;
        }
      });
    },
    //设置基础防护的DDoS告警阈值
    CreateBasic() {
      let params = {
        Version: "2018-07-09",
        Business: 'basic',
        Method: 'set',
        AlarmType: this.AlarmType,
        AlarmThreshold: this.iptmbpsText
      };
      this.axios.post('dayu2/CreateBasicDDoSAlarmThreshold', params).then(res => {
        // console.log(res);
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        } else {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        }
      });
    },
    // 关闭防护确认按钮
    changeSureTip4(value) {
      let params = {
        Version: "2018-07-09",
        Business: 'net',
        Status: this.Status,
        Hour: value,
        Id: this.resourceId,
      };
      this.axios.post('dayu2/ModifyDDoSDefendStatus', params).then(res => {
        // console.log(res);
        this.changeModelTip4 = false;
        this.servicePack.DefendStatus = true;
        this.GETStatus() // 获取DDoS防护状态
      });
    },
    // 开闭防护确认按钮
    startSureTip() {
      let params = {
        Version: "2018-07-09",
        Business: 'net',
        Status: this.Status,
        Hour: 1,
        Id: this.resourceId,
      };
      this.axios.post('dayu2/ModifyDDoSDefendStatus', params).then(res => {
        // console.log(res);
        this.changeModelTip4 = false;
        this.servicePack.DefendStatus = true;
        this.GETStatus() // 获取DDoS防护状态
      });
    }
  }
}
</script>
<style lang="scss">
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
      span:nth-child(2) {
        .gardenChoose {
          padding: 0 20px;
          color: #000;
          font-size: 12px;
        }
        .seceltGarden {
          color: #006eff !important;
        }
      }
    }
  }
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
