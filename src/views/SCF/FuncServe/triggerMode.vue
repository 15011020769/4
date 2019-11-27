<template>
  <div class="tigger">
    <div class="contentMain">
      <div class="contentMainList">
        <div class="addTriggerBtn">
          <p @click="addTriggerBtn" style="cursor:pointer">添加触发方式</p>
        </div>
        <div class="addTriggerBox" v-if="displayShow">
          <h3 @click="addTriggerBtn" style="cursor:pointer">添加触发方式</h3>
          <el-form :model="formTriggerForm" label-width="130px">
            <el-form-item label="触发方式" :required="true">
              <span slot="label">
                触发方式
                <i class="el-icon-question"></i>
              </span>
              <el-select v-model="formTriggerForm.triggerType" @change="chufatype" class="selectSetWidth">
                <el-option label="定时触发" value="timer"></el-option>
                <el-option label="COS触发" value="cos"></el-option>
                <el-option label="CMQ主题订阅触发" value="cmq"></el-option>
                <el-option label="Ckafka触发" value="ckafka"></el-option>
                <el-option label="API网关触发器" value="apiwg"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="定时任务名称" :required="true">
              <span slot="label">
                定时任务名称
                <i class="el-icon-question"></i>
              </span>
              <el-input
                v-model="formTriggerForm.tasksName"
                class="inputSetWidth"
                placeholder="请输入定时任务名称"
              />
            </el-form-item>
            <el-form-item label="触发周期" :required="true">
              <el-select
                v-model="formTriggerForm.triggerTime"
                @change="triggerChange"
                class="selectSetWidth"
              >
                <el-option label="每1分钟（每分钟0秒执行一次）" value="type1"></el-option>
                <el-option label="每5分钟（每5分钟的0秒执行一次）" value="type2"></el-option>
                <el-option label="每半小时（每小时的0分和30分执行）" value="type3"></el-option>
                <el-option label="每1小时（每小时0分执行一次）" value="type4"></el-option>
                <el-option label="每1天（每天0点0分执行一次）" value="type5"></el-option>
                <el-option label="自定义触发周期" value></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Cron表达式" v-if="triggerShow">
              <el-input v-model="formTriggerForm.cronlist" placeholder="0 */5 * * * * *"/>
              <span>Cron当前以 UTC +8 中国标准时间 （China Standard Time）运行，即北京时间。</span>
            </el-form-item>
            <el-form-item label="填写入参">
              <span slot="label">
                填写入参
                <i class="el-icon-question"></i>
              </span>
              <el-select v-model="formTriggerForm.writeIsTrue" class="selectSetWidth">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="立即启用">
              <el-checkbox class="inputSetWidth" type="checkbox" v-model="formTriggerForm.nowStart"></el-checkbox>
              <br>
              <span>勾选后定时触发器将立即开启（于下个配置周期触发）</span>
            </el-form-item>
          </el-form>
          <div class="triggerBtnBot">
            <el-button type="primary" @click="saveTrigger">保存</el-button>
            <el-button @click="displayShow=false">取消</el-button>
          </div>
        </div>
        <div class="timerListShow" v-for="(item,index) in triggerBoxList" :key="item.name">
          <div class="newClear">
            <span class="timerListTit">定时触发</span>
            <div class="btnAll">
              <el-switch
                v-model="switch1[index]"
                active-color="#006eff"
                inactive-color="#888"
                class="switchs"
              ></el-switch>
              <i class="el-icon-delete" style="cursor:pointer" @click="deleteTrigger(index,item)"></i>
            </div>
          </div>
          <div class="newListShow">
            <p>
              <span>名称</span>
              <span>{{item.TriggerName}}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */1 * * * * *\"}"'>
              <span>触发器周期</span>
              <span>每1分钟（每分钟0秒执行一次）</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */5 * * * * *\"}"'>
              <span>触发器周期</span>
              <span>每5分钟（每5分钟的0秒执行一次）</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */30 * * * * *\"}"'>
              <span>触发器周期</span>
              <span>每半小时（每小时的0分和30分执行）</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 0 */1 * * * *\"}"'>
              <span>触发器周期</span>
              <span>每1小时（每小时0分执行一次）</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 0 0 */1 * * *\"}"'>
              <span>触发器周期</span>
              <span>每1天（每天0点0分执行一次）</span>
            </p>
            <p>
              <span>cron表达式</span>
              <span>{{item.TriggerDesc}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      displayShow: false,
      triggerShow: false,
      formTriggerForm: {
        triggerType: "timer",
        tasksName: "",
        triggerTime: "每5分钟（每5分钟的0秒执行一次）",
        cronlist: "",
        writeIsTrue: "",
        nowStart: ""
      },
      desc: "0 */5 * * * * *",
      switch1: [],
      triggerBoxList: []
    };
  },
  created() {
    this.getfunction();
  },
  methods: {
    //添加触发按钮
    addTriggerBtn() {
      this.displayShow = true;
    },
    //保存添加的触发
    saveTrigger() {
      let _this = this;
      this.displayShow = false;
      let params = {
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        Action: "CreateTrigger",
        TriggerName: this.formTriggerForm.tasksName,
        Type: this.formTriggerForm.triggerType,
        TriggerDesc: this.desc
      };
      console.log(params);
      let functionName = this.$route.query.functionName;
      // functionName = 'tttt'
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.$axios.post("scf2/CreateTrigger", params).then(res => {
        _this.getfunction();
        _this.formTriggerForm.tasksName = ""
        _this.formTriggerForm.writeIsTrue = ""
        _this.formTriggerForm.triggerType = "timer"
        _this.formTriggerForm.triggerTime = "每5分钟（每5分钟的0秒执行一次）"
      });
    },
    //监测select变化
    triggerChange(val) {
      console.log(val);
      if (val === "type1") {
        this.desc = "0 */1 * * * * *";
      } else if (val === "type2") {
        this.desc = "0 */5 * * * * *";
      } else if (val === "type3") {
        this.desc = "0 */30 * * * * *";
      } else if (val === "type4") {
        this.desc = "0 0 */1 * * * *";
      } else if (val === "type5") {
        this.desc = "0 0 0 */1 * * *";
      }
      if (this.formTriggerForm.triggerTime == "") {
        this.triggerShow = true;
      } else {
        this.triggerShow = false;
      }
    },
    //删除触发器
    deleteTrigger(newIndex, newItem) {
       this.$emit('childFn', newItem);
    },
    getfunction() {
      let params = {
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        Action: "GetFunction"
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.$axios.post("scf2/GetFunction", params).then(res => {
        console.log(res);
        this.triggerBoxList = res.Response.Triggers;
        for (let i = 0; i < this.triggerBoxList.length; i++) {
          this.switch1[i] = true;
        }
      });
    },
    chufatype(val) {
      this.formTriggerForm.triggerType = val
    }
  }
};
</script>  
<style lang="scss">
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.contentMain {
  width: 100%;
  // padding:20px;
  .contentMainList {
    width: 100%;
    min-height: 200px;
    border: 1px solid #ddd;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    .addTriggerBtn {
      width: 100%;
      height: 60px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      text-align: center;
      line-height: 60px;
      color: #888;
      font-size: 12px;
    }
    .addTriggerBox {
      width: 100%;
      padding: 20px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
    }
  }
}
.triggerBtnBot {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
.timerListShow {
  padding: 20px;
  border: 1px solid #ddd;
  .timerListTit {
    font-size: 14px;
    font-weight: 600;
    float: left;
  }
  .btnAll {
    float: right;
    .switchs {
      float: left;
    }
    .el-icon-delete {
      font-size: 20px;
      float: left;
      margin-left: 10px;
    }
  }
  .newListShow {
    p {
      margin: 16px 0;
      font-size: 12px;
      span:nth-child(1) {
        display: inline-block;
        width: 80px;
        color: #888;
        text-align: left;
      }
      span:nth-child(2) {
        color: #000;
      }
    }
  }
}
.selectSetWidth {
  width: 200px;
  div.el-input {
    width: 200px;
    input {
      width: 200px;
    }
  }
}
.inputSetWidth {
  width: 200px;
  input {
    width: 200px;
  }
}
</style>
