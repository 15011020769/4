<template>
  <div class="tigger">
    <div class="contentMain">
      <div class="contentMainList">
        <div class="addTriggerBtn">
          <p @click="addTriggerBtn" style="cursor:pointer">{{ $t('SCF.total.tjcffs') }}</p>
        </div>
        <div class="addTriggerBox" v-if="displayShow">
          <h3 @click="addTriggerBtn" style="cursor:pointer">{{ $t('SCF.total.tjcffs') }}</h3>
          <el-form :model="formTriggerForm" label-width="130px">
            <el-form-item :label="$t('SCF.total.cffs')" :required="true">
              <span slot="label">
                {{ $t('SCF.total.cffs') }}
                <!-- <i class="el-icon-question"></i> -->
              </span>
              <el-select v-model="formTriggerForm.triggerType" @change="chufatype" class="selectSetWidth">
                <el-option :label="$t('SCF.total.dscf')" value="timer"></el-option>
                <el-option :label="$t('SCF.total.coscf')" value="cos"></el-option>
                <el-option :label="$t('SCF.total.ztdycf')" value="cmq"></el-option>
                <el-option :label="$t('SCF.total.cfkcf')" value="ckafka"></el-option>
                <el-option :label="$t('SCF.total.wgcf')" value="apiwg"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.dsrwmc')" :required="true">
              <span slot="label">
                {{ $t('SCF.total.dsrwmc') }}
                <!-- <i class="el-icon-question"></i> -->
              </span>
              <el-input
                v-model="formTriggerForm.tasksName"
                class="inputSetWidth"
                :placeholder="$t('SCF.total.srdsrwmc')"
              />
            </el-form-item>
            <el-form-item :label="$t('SCF.total.cfzq')" :required="true">
              <el-select
                v-model="formTriggerForm.triggerTime"
                @change="triggerChange"
                class="selectSetWidth"
              >
                <el-option :label="$t('SCF.total.mfz')" value="type1"></el-option>
                <el-option :label="$t('SCF.total.mwfz')" value="type2"></el-option>
                <el-option :label="$t('SCF.total.mbxs')" value="type3"></el-option>
                <el-option :label="$t('SCF.total.mxs')" value="type4"></el-option>
                <el-option :label="$t('SCF.total.mt')" value="type5"></el-option>
                <el-option :label="$t('SCF.total.zdtcfzq')" value></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.bds')" v-if="triggerShow">
              <el-input v-model="formTriggerForm.cronlist" placeholder="0 */5 * * * * *"/>
              <span>{{ $t('SCF.total.bdsts') }}</span>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.fjxx')">
              <span slot="label">
                {{ $t('SCF.total.fjxx') }}
                <!-- <i class="el-icon-question"></i> -->
              </span>
              <el-select v-model="formTriggerForm.writeIsTrue" class="selectSetWidth">
                <el-option :label="$t('SCF.total.s')" value="true"></el-option>
                <el-option :label="$t('SCF.total.f')" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.ljqy')">
              <el-checkbox class="inputSetWidth" type="checkbox" v-model="formTriggerForm.nowStart"></el-checkbox>
              <br>
              <span>{{ $t('SCF.total.zqcf') }}</span>
            </el-form-item>
          </el-form>
          <div class="triggerBtnBot">
            <el-button type="primary" @click="saveTrigger">{{ $t('SCF.total.bc') }}</el-button>
            <el-button @click="displayShow=false">{{ $t('SCF.total.qx') }}</el-button>
          </div>
        </div>
        <div class="timerListShow" v-for="(item,index) in triggerBoxList" :key="item.name">
          <div class="newClear">
            <span class="timerListTit">{{ $t('SCF.total.dscf') }}</span>
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
              <span>{{ $t('SCF.total.mc') }}</span>
              <span>{{item.TriggerName}}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */1 * * * * *\"}"'>
              <span>{{ $t('SCF.total.cfqzq') }}</span>
              <span>{{ $t('SCF.total.mfz') }}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */5 * * * * *\"}"'>
              <span>{{ $t('SCF.total.cfqzq') }}</span>
              <span>{{ $t('SCF.total.mwfz') }}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 */30 * * * * *\"}"'>
              <span>{{ $t('SCF.total.cfqzq') }}</span>
              <span>{{ $t('SCF.total.mbxs') }}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 0 */1 * * * *\"}"'>
              <span>{{ $t('SCF.total.cfqzq') }}</span>
              <span>{{ $t('SCF.total.mxs') }}</span>
            </p>
            <p v-if='item.TriggerDesc == "{\"cron\":\"0 0 0 */1 * * *\"}"'>
              <span>{{ $t('SCF.total.cfqzq') }}</span>
              <span>{{ $t('SCF.total.mt') }}</span>
            </p>
            <p>
              <span>{{ $t('SCF.total.bds') }}</span>
              <span>{{item.TriggerDesc}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SCF_DETAILS,CREAT_TRIGGER } from '@/constants'
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
        Region: 'ap-guangzhou',//this.$cookie.get("regionv2"),
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
      this.axios.post(CREAT_TRIGGER, params).then(res => {
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
        Region: 'ap-guangzhou',//this.$cookie.get("regionv2"),
        Action: "GetFunction"
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios.post(SCF_DETAILS, params).then(res => {
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
