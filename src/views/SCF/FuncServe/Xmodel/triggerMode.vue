<template>
  <div class="tigger">
    <div class="contentMain" v-loading="loading">
      <div class="contentMainList">
        <div class="addTriggerBtn">
          <p @click="addTriggerBtn" style="cursor:pointer">{{ $t('SCF.total.tjcffs') }}</p>
        </div>
        <div class="addTriggerBox" v-if="displayShow">
          <h3 @click="addTriggerBtn" style="cursor:pointer">{{ $t('SCF.total.tjcffs') }}</h3>
          <el-form :model="formTriggerForm" label-width="130px" :rules="rules" ref="formTriggerForm">
            <el-form-item :label="$t('SCF.total.cffs')" :required="true">
              <span slot="label">{{ $t('SCF.total.cffs') }}</span>
              <el-select v-model="formTriggerForm.triggerType" @change="chufatype" class="selectSetWidth">
                <el-option :label="$t('SCF.total.dscf')" value="timer"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.dsrwmc')" prop="tasksName">
              <span slot="label">{{ $t('SCF.total.dsrwmc') }}</span>
              <!-- 请输入定时任务名称 -->
              <el-input v-model="formTriggerForm.tasksName" class="inputSetWidth"
                :placeholder="$t('SCF.total.srdsrwmc')" @input="tasksNameChange" />
              <p class="tipCon" v-show="warnFlag">{{ $t('SCF.total.ts1') }}</p>
              <p class="tipCon" v-show="warnFlag">{{ $t('SCF.total.ts2') }}</p>
              <p class="tipCon" v-show="notNullFlag">{{$t('SCF.total.cfqmc')}}</p>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.cfzq')" :required="true">
              <el-select v-model="formTriggerForm.triggerTime" @change="triggerChange" class="selectSetWidth">
                <el-option :label="$t('SCF.total.mfz')" value="type1"></el-option>
                <el-option :label="$t('SCF.total.mwfz')" value="type2"></el-option>
                <el-option :label="$t('SCF.total.mbxs')" value="type3"></el-option>
                <el-option :label="$t('SCF.total.mxs')" value="type4"></el-option>
                <el-option :label="$t('SCF.total.mt')" value="type5"></el-option>
                <el-option :label="$t('SCF.total.zdtcfzq')" value></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.bds')" v-if="triggerShow">
              <el-input v-model="formTriggerForm.cronlist" placeholder="0 */5 * * * * *" />
              <span>{{ $t('SCF.total.bdsts') }}</span>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.fjxx')">
              <span slot="label">{{ $t('SCF.total.fjxx') }}</span>
              <el-select v-model="formTriggerForm.writeIsTrue" class="selectSetWidth">
                <!-- @change="selectChange" -->
                <el-option :label="$t('SCF.total.s')" value="true"></el-option>
                <el-option :label="$t('SCF.total.f')" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="formTriggerForm.writeIsTrue=='true'" class="writeIsTrue">
              <span slot="label"></span>
              <el-input class="inputSetWidth" type="textarea" :rows="3" placeholder="$t('SCF.total.qsrnr')"
                v-model="formTriggerForm.CustomArgument"></el-input>
              <p>{{$t('SCF.total.qtxfjxx')}}</p>
            </el-form-item>
            <el-form-item :label="$t('SCF.total.ljqy')">
              <el-checkbox class="inputSetWidth" type="checkbox" v-model="formTriggerForm.nowStart"></el-checkbox>
              <br />
              <span>{{ $t('SCF.total.zqcf') }}</span>
            </el-form-item>
          </el-form>
          <div class="triggerBtnBot">
            <el-button type="primary" @click="saveTrigger('formTriggerForm')">{{ $t('SCF.total.bc') }}</el-button>
            <el-button @click="cancleAdd">{{ $t('SCF.total.qx') }}</el-button>
            <!-- <el-button @click="displayShow=false">{{ $t('SCF.total.qx') }}</el-button> -->
          </div>
        </div>
        <div class="timerListShow" v-for="(item,index) in triggerBoxList" :key="item.name">
          <div class="newClear">
            <span class="timerListTit">{{ $t('SCF.total.dscf') }}</span>
            <div class="btnAll">
              <!-- v-model="item.Enable" -->
              <el-switch v-model="switch1[index]" active-color="#006eff" @change="triggerStatus(item,switch1[index])"
                inactive-color="#888" class="switchs"></el-switch>

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
            <p v-if="item.CustomArgument">
              <span>{{ $t('SCF.total.fjxx') }}</span>
              <span>{{item.CustomArgument}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('SCF.total.ts')" :visible.sync="centerDialogVisible" width="30%">
      <h3 slot="title">{{ $t('SCF.total.qdsccfq') }}</h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('SCF.total.qx') }}</el-button>
        <el-button type="primary" @click="detele()">{{ $t('SCF.total.qd') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    SCF_DETAILS,
    CREAT_TRIGGER,
    UPDATE_TRIGGER,
    DEL_TRIGGER
  } from "@/constants";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    props: ['FunctionVersion'],
    data() {
      var validateTasksName = (rule, value, callback) => {
        if (value === "") {
          this.warnFlag = true;
          callback();
        } else {
          let reg = /^[A-Za-z]([A-Za-z0-9]|-|_){0,58}([A-Za-z0-9])$/;
          let flag = reg.test(this.formTriggerForm.tasksName);
          if (!flag) {
            this.warnFlag = true;
            callback();
          } else {
            this.warnFlag = false;
            callback();
          }
        }
      };
      return {
        childData: {},
        centerDialogVisible: false,
        loading: true,
        displayShow: false,
        triggerShow: false,
        warnFlag: false,
        notNullFlag: false, //是否点击
        rules: {
          tasksName: [{
            validator: validateTasksName,
            trigger: "blur",
            required: true
          }]
        },
        formTriggerForm: {
          triggerType: "timer",
          tasksName: "",
          triggerTime: "每5分鐘（每5分鐘的0秒执行一次）",
          cronlist: "",
          writeIsTrue: "false",
          nowStart: false,
          CustomArgument: ""
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
      //tasksName改变后再去改变notNullFlag
      tasksNameChange() {
        if (!this.formTriggerForm.tasksName) {
          this.notNullFlag = true;
        } else {
          this.notNullFlag = false;
        }
      },
      detele() {
        this.centerDialogVisible = false;
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Action: "DeleteTrigger",
          TriggerName: this.childData.TriggerName,
          Type: this.childData.Type,
          Qualifier: this.FunctionVersion
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios.post(DEL_TRIGGER, params).then(res => {
          this.getfunction();
        });
      },

      //保存添加的触发
      saveTrigger(formName) {
        let _this = this;
        if (this.formTriggerForm.tasksName == "") {
          this.notNullFlag = true;
        } else {
          this.notNullFlag = false;
          let reg = /^[A-Za-z]([A-Za-z0-9]|-|_){0,58}([A-Za-z0-9])$/;
          let flag = reg.test(this.formTriggerForm.tasksName);
          if (flag) {
            this.warnFlag = false;
            this.displayShow = false;
            let params = {
              Version: "2018-04-16",
              Region: localStorage.getItem("regionv2"),
              Action: "CreateTrigger",
              TriggerName: this.formTriggerForm.tasksName,
              Type: this.formTriggerForm.triggerType,
              TriggerDesc: this.desc,
              CustomArgument: this.formTriggerForm.CustomArgument,
              Enable: this.formTriggerForm.nowStart == true ? "OPEN" : "CLOSE",
              Qualifier: this.FunctionVersion,
              Namespace: this.$route.query.SpaceValue
            };
            let functionName = this.$route.query.functionName;
            if (this.triggerShow === true) {
              params['TriggerDesc'] = this.formTriggerForm.cronlist
            }
            if (functionName != "" && functionName != null) {
              params["FunctionName"] = functionName;
            }
            this.axios.post(CREAT_TRIGGER, params).then(res => {
              if (res.Response.Error == undefined) {
                this.formTriggerForm.cronlist = ''
                _this.getfunction();
                _this.formTriggerForm.tasksName = "";
                _this.formTriggerForm.writeIsTrue = "false";
                _this.formTriggerForm.triggerType = "timer";
                _this.formTriggerForm.triggerTime =
                  "每5分鐘（每5分鐘的0秒执行一次）";
                _this.formTriggerForm.CustomArgument = "";
              } else {
                let ErrTips = {
                  'InvalidParameterValue.TriggerDesc': 'TriggerDesc參數不合法 (定時觸發器Cron表達式不正確(cron表達式分段數必須是5或7))',
                  'LimitExceeded.Trigger': 'Trigger數量超出最大限制',
                }
                let ErrOr = Object.assign(ErrorTips, ErrTips)
                this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "warning",
                  showClose: true,
                  duration: 0
                });
              }
            });
          } else {
            this.warnFlag = true;
            this.notNullFlag = false;
          }
        }
      },
      //更改定时触发器状态
      triggerStatus(val, status) {
        if (val) {
          let state = status == true ? "OPEN" : "CLOSE";
          let functionName = this.$route.query.functionName;
          let params = {
            Version: "2018-04-16",
            Action: "CreateTrigger",
            Enable: state,
            TriggerName: val.TriggerName,
            Type: val.Type
          };
          if (functionName != "" && functionName != null) {
            params["FunctionName"] = functionName;
          }
          this.axios.post(UPDATE_TRIGGER, params).then(res => {
            if (res.Response.RequestId) {
              if (state == "OPEN") {
                this.$message({
                  showClose: true,
                  message: "觸發器已啟用",
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "觸發器已關閉",
                  type: "success"
                });
              }
            }
          });
        }
      },
      //取消添加触发方式
      cancleAdd() {
        this.displayShow = false;
        this.formTriggerForm.tasksName = "";
        this.formTriggerForm.writeIsTrue = "false";
        this.formTriggerForm.triggerType = "timer";
        this.formTriggerForm.triggerTime = "每5分鐘（每5分鐘的0秒执行一次）";
        this.formTriggerForm.CustomArgument = "";
        this.warnFlag = false;
      },
      //监测select变化
      triggerChange(val) {
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
        this.centerDialogVisible = true
        this.childData = newItem
      },
      getfunction() {
        this.loading = true;
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem("regionv2"),
          Action: "GetFunction",
          Qualifier: this.FunctionVersion,
          Namespace: this.$route.query.SpaceValue
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios.post(SCF_DETAILS, params).then(res => {
          this.triggerBoxList = res.Response.Triggers;
          for (let i = 0; i < this.triggerBoxList.length; i++) {
            if (this.triggerBoxList[i].Enable == "1") {
              this.switch1[i] = true;
            } else {
              this.switch1[i] = false;
            }
          }
          this.loading = false;
        });
      },
      chufatype(val) {
        this.formTriggerForm.triggerType = val;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }

  .tipCon {
    font-size: 12px;
    color: #f56c6c;
    line-height: 16px;
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

        .writeIsTrue {
          div span {
            // float: left
          }
        }
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

</style>
<style lang="scss">
  .addTriggerBox .selectSetWidth .el-input {
    width: 200px !important;
  }

  .addTriggerBox .selectSetWidth .el-input__inner {
    width: 200px !important;
  }

  .addTriggerBox .inputSetWidth {
    width: 200px;

    input {
      width: 200px;
    }
  }

</style>
