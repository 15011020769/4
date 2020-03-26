<template>
  <div class="dialog">
    <!--  @open="$emit('open')" @close="$emit('close')" -->
    <el-dialog title="新建" :visible.sync="show" @open="loadShow = true">
      <el-form :model="formInline" :rules="rules" ref="form">
        <p class="rowCont">
          <span>策略名稱</span>
          <el-form-item style="display:inline-block" prop="strategy_name">
            <!-- v-model="formInline.strategy_name" -->
            <el-input
              style="width:330px;margin:0"
              maxlength="20"
              show-word-limit
              v-model="formInline.strategy_name"
              placeholder="1-20個中英文字符或下劃線"
            ></el-input>
          </el-form-item>
        </p>
        <p class="rowCont">
          <span style="vertical-align:top">備注</span>
          <el-form-item style="display:inline-block" prop="textareas">
            <el-input
              show-word-limit
              style="width:330px;"
              :autosize="{ minRows: 5, maxRows: 2 }"
              type="textarea"
              placeholder="1-100個中英文字符或下劃線"
              v-model="formInline.textareas"
              maxlength="100"
            ></el-input>
            <!-- <div v-if="formInline.textareas.length==100" style="color:red;font-size:12px;margin-bottom:-20px">描述不能超過100個字</div> -->
          </el-form-item>
        </p>
      </el-form>
      <p class="rowCont" style="display: flex;margin-bottom:20px">
        <span>策略類型</span>
        <product-type-cpt
          v-on:PassData="passData"
          :projectId="projectId"
          :searchParam="searchParam"
          :productValue="productValue"
          @loading="isLoading"
        />
        <!-- <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type> -->
        <!-- <el-checkbox v-model="checkedUse" style="margin-left:20px;">
          使用預置觸發條件
          <el-popover trigger="hover" placement="top"
           content="根據系統預先設定的模版，自動設置對應雲産品的告警策略常用觸發條件。">
            <i class="el-icon-info" slot="reference"></i>
          </el-popover>
        </el-checkbox> -->
      </p>
      <div class="rowCont cont">
        <span>觸發條件</span>
        <div>
          <div>
            <p>
              <el-checkbox
                v-model="checkedZhibiao"
                :checked="checkedZhibiao"
                @change="isDisabledZB()"
                >指標告警</el-checkbox
              >
            </p>
            <div class="color">
              <p>
                <span style="display:inline">滿足</span>
                <el-select
                  :disabled="isDisabled"
                  v-model="metting"
                  style="width:90px;margin:0 5px;"
                >
                  <el-option
                    v-for="(item, index) in meetConditions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <span style="display:inline">條件時，觸發告警</span>
              </p>
              <!-- 在這裏進行便利，添加 -->
              <ul v-loading="loadShow">
                <li
                  style="display:flex;align-items: center;cursor: pointer;"
                  v-for="(it, i) in indexAry"
                  :key="i"
                >
                  <p :class="{ mp: metting == 1 }">
                    if&nbsp;
                    <el-select
                      :disabled="isDisabled"
                      v-model="it.MetricId"
                      style="width:150px;"
                    >
                      <el-option
                        v-for="(item, index) in zhibiaoType"
                        :key="index"
                        :label="item.MetricShowName"
                        :value="item.MetricId"
                        label-width="40px"
                      ></el-option> </el-select
                    >&nbsp;
                    <el-select
                      :disabled="isDisabled"
                      v-model="it.Period"
                      style="width:130px;"
                    >
                      <el-option
                        v-for="(item, index) in tongjiZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option> </el-select
                    >&nbsp;
                    <el-select
                      :disabled="isDisabled"
                      v-model="it.CalcType"
                      style="width:60px;"
                    >
                      <el-option
                        v-for="(item, index) in SymbolList"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option> </el-select
                    >&nbsp;
                    <!-- placeholder="指標" -->
                    <input
                      :disabled="isDisabled"
                      v-model="it.CalcValue"
                      min="0"
                      max="100"
                      type="number"
                      style="height: 30px;line-height: 30px;
                      padding:0 10px;width:85px;border: 1px solid #dcdfe6;"
                    />
                    <b
                      style="padding:0 10px;display:inline-block;
                      height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                      >{{ it.Unit || "&nbsp;" }}</b
                    >
                    &nbsp;
                    <el-select
                      :disabled="isDisabled"
                      v-model="it.ContinuePeriod"
                      style="width:110px;"
                    >
                      <el-option
                        v-for="(item, index) in continuePeriod"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option> </el-select
                    >&nbsp;
                    <span style="width:30px" v-if="metting !== 1">then</span
                    >&nbsp;
                    <el-select
                      :disabled="isDisabled"
                      v-model="it.alarm"
                      v-if="metting !== 1"
                      style="width:150px;"
                    >
                      <el-option
                        v-for="(item, index) in jinggaoZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <el-popover
                      placement="top"
                      trigger="hover"
                      width="300"
                      v-if="metting !== 1"
                      style="width:22px;height:22px"
                    >
                      <div>
                        <p style="font-size:12px">
                          重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                        </p>
                        <p style="font-size:12px">
                          週期指數遞增通知:
                          告警持續時長到達告警統計週期的1，2，4，8，16，32...倍時發送告警通知
                        </p>
                      </div>
                      <i
                        slot="reference"
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                      ></i>
                    </el-popover>
                    <!-- <i class="el-icon-info" style="color:#888; margin:0 5px;"></i> -->
                  </p>
                  <i
                    class="el-icon-error"
                    style="color:#888; margin:0 5px;line-height:30px;"
                    @click="delZhibiao(it)"
                    v-if="indexAry.length > 1"
                  ></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
                <p style="color:red" v-if="isRepeated">
                  <i
                    class="el-icon-info"
                    style="color:#888; margin:0 5px;color:red"
                  ></i
                  >請勿重複配置
                </p>
              </ul>
              <p v-if="metting == 1">
                <span style="width:30px">then</span>&nbsp;
                <el-select
                  :disabled="isDisabled"
                  v-model="all_alarm"
                  style="width:150px;"
                >
                  <el-option
                    v-for="(item, index) in jinggaoZQ"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <el-popover
                  placement="top"
                  trigger="hover"
                  width="300"
                  style="width:22px;height:22px"
                >
                  <div>
                    <p style="font-size:12px">
                      重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                    </p>
                    <p style="font-size:12px">
                      週期指數遞增通知:
                      告警持續時長到達告警統計週期的1，2，4，8，16，32...倍時發送告警通知
                    </p>
                  </div>
                  <i
                    slot="reference"
                    class="el-icon-info"
                    style="color:#888; margin:0 5px;"
                  ></i>
                </el-popover>
              </p>
            </div>
          </div>
          <!-- <div>
            <p>
              <el-checkbox v-model="checkedGaojing" :checked="checkedGaojing" @change="isDisabledGJ()">
                事件告警
                <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
              </el-checkbox>
            </p>
            <ul class="color">
              <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in eventAry" :key="i">
                <p>
                  <el-select :disabled="isDisGJ" v-model="item.projectName" style="width:180px;margin:0 5px;">
                    <el-option
                      v-for="(item,index) in eventType"
                      :key="index"
                      :label="item"
                      :value="item"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                </p>
                <i class="el-icon-error" style="color:#888; margin:0 5px;"
                  @click="delShijian(item)" v-if="eventAry.length>1"></i>
              </li>
              <a @click="addShijian" style="cursor:pointer">添加</a>
            </ul>
          </div> -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isRepeated" @click="save('form')"
          >保 存</el-button
        >
        <el-button @click="show = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import GroupingType from '@/components/GroupingType'
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type";
// import type from '@/views/CM/CM_assembly/product_type'
import { NEWBUILD_TEMPLATE } from "@/constants/CM-yhs.js";
import { ErrorTips } from "@/components/ErrorTips";
import Loading from "@/components/public/Loading";
export default {
  data() {
    return {
      loadShow: false, // 加载是否显示
      isChected: true, // 多选框是否选中
      isDisabled: false, // 指标告警是否禁用
      isDisGJ: false, // 事件告警是否禁用
      isRepeated: false, // 是否为重复的指标告警条件
      backShow: 'true',
      strategy_name: '', // 策略名称
      remark: '', // 备注信息
      value1: new Date(2020, 1, 10, 18, 40),
      value2: new Date(2020, 1, 10, 18, 40),

      showChufa1: false, // 触发条件1显示开关
      showChufa2: true, // 触发条件2显示开关

      showQudao1: false, // 渠道选择1显示开关
      showQudao2: false, // 渠道选择2显示开关

      errorTip1: false, // 触发条件範本错误提示
      errorTip2: true, // 配置触发条件错误提示
      checkedZhibiao: true, // 指示告警
      checkedUse: false, // 使用预置触发条件
      productData: [], // 策略类型
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      formInline: {
        strategy_name: '', // 策略名称
        textareas: '' // 备注
      },
      indexAry: [ // 指标告警数组
        {
          Period: 60,
          CalcType: ">",
          CalcValue: "0",
          MetricId: 33,
          Unit: "%",
          ContinuePeriod: 1,
          alarm: 86400
        }
      ],
      eventAry: [// 事件告警数组
        {
          jieshou: "接收組",
          jieshouArr: [
            { value: "0", name: "接收組" },
            {
              value: "1",
              name: "接收人"
            }
          ],
          apiStr: "http", // 接口回調
          apiArr: [
            {
              value: 0,
              name: "http"
            },
            {
              value: 1,
              name: "https"
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '雲伺服器-基礎監控',
          strategy_kind: [
            {
              value: 0,
              name: "雲伺服器-基礎監控"
            }
          ], // 策略類型
          alarm: "", // 策略類型
          projectName: "預設專案",
          project: [
            {
              value: 0,
              name: "預設專案"
            }
          ]
        }
      ],
      metting: 0, // 滿足條件
      meetConditions: [
        { label: "任意", value: 0 },
        { label: "所有", value: 1 }
      ], // 滿足條件
      tongjiZQ: [
        { label: "統計週期1分鍾", value: 60 },
        { label: "統計週期5分鍾", value: 300 }
      ],
      continuePeriod: [
        // 持續週期
        { label: "持續1個週期", value: 1 },
        { label: "持續2個週期", value: 2 },
        { label: "持續3個週期", value: 3 },
        { label: "持續4個週期", value: 4 },
        { label: "持續5個週期", value: 5 }
      ],
      jinggaoZQ: [
        // 警告週期
        { label: "不重複", value: 0 },
        { label: "每5分鍾警告壹次", value: 300 },
        { label: "每10分鍾警告壹次", value: 600 },
        { label: "每15分鍾警告壹次", value: 900 },
        { label: "每30分鍾警告壹次", value: 1800 },
        { label: "每1小時警告壹次", value: 3600 },
        { label: "每2小時警告壹次", value: 7200 },
        { label: "每3小時警告壹次", value: 10800 },
        { label: "每6小時警告壹次", value: 21600 },
        { label: "每12小時警告壹次", value: 43200 },
        { label: "每1天警告壹次", value: 86400 },
        { label: "週期指數遞增", value: 1 }
      ],
      zhibiaoType: [], // 指標告警類型
      eventType: [], // 事件告警類型
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      checkedGaojing: "", // 告警
      // dialogFormVisible: false //監控面板的開關
      rules: {
        strategy_name: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("範本名稱不能爲空"));
              } else if (value.length === 20) {
                callback(new Error("範本名稱不能超過 20 字"));
              } else {
                callback();
              }
              //  else if (value.length === 20) {
              // callback(new Error('提示:範本名称不能超过 20 字'))
              // }
            },
            trigger: "blur",
            required: true
          }
        ],
        textareas: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 100) {
                callback(new Error("描述不能超過100個字"));
              } else {
                callback();
              }
            },
            trigger: "change",
            required: true
          }
        ]
      }, // 名称和备注的验证
      show: this.dialogVisible, // 控制弹框显示隐藏
      all_alarm: 86400, // 满足条件为 所有 时告警值
      view_name: '', // 策略视图名称
      projectId: 0,
      searchParam: {},
      //  value: 'ins-6oz38wnu', label: 'instance-id'
      productValue: "cvm_device"
    };
  },
  watch: {
    dialogVisible: function(val) {
      this.show = val;
    },
    show: function(val) {
      this.$emit("update:dialogVisible", val);
    },
    productValue: function(val) {
      let { zhibiaoType } = this;
      if (zhibiaoType) {
        this.indexAry = [
          {
            Period: 60,
            CalcType: ">",
            CalcValue: "0",
            MetricId: zhibiaoType[0].MetricId,
            Unit: zhibiaoType[0].MetricUnit,
            ContinuePeriod: 1,
            alarm: 86400
          }
        ];
      }
    },
    indexAry: {
      handler: function(val, old) {
        let temp = [];
        val.forEach((ele, index) => {
          let tempObj = this.zhibiaoType.find(item => {
            return item.MetricId === ele.MetricId;
          });
          if (tempObj) {
            this.indexAry[index].Unit = tempObj.MetricUnit;
          }
          !temp.some(item => {
            return ele.MetricId === item.MetricId;
          }) && temp.push(ele);
        });
        if (val.length === temp.length) {
          this.isRepeated = false;
        } else {
          this.isRepeated = true;
        }
      },
      deep: true
    }
  },
  components: {
    // GroupingType,
    ProductTypeCpt,
    Loading
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    },
    Conditions: {
      required: true,
      type: Array
    },
    createSuccess: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    save(form) {
      // this.$emit('save')
      this.$refs[form].validate(valid => {
        if (valid) {
          this.newBuild();
        } else {
          return false;
        }
      });
    },
    // 新建完成保存
    async newBuild() {
      let params = {
        Version: "2018-07-24",
        GroupName: this.formInline.strategy_name,
        ViewName: this.productValue,
        Module: "monitor",
        IsUnionRule: this.metting,
        Remark: this.formInline.textareas
      };
      this.indexAry.forEach((ele, i) => {
        params[`Conditions.${i}.CalcValue`] = Number(ele.CalcValue); // 百分比
        params[`Conditions.${i}.MetricID`] = ele.MetricId;
        this.tongjiZQ.forEach(item1 => {
          var PD;
          if (ele.Period == item1.value) {
            PD = item1.value;
            params[`Conditions.${i}.CalcPeriod`] = PD; // 統計週期
          }
        });
        this.continuePeriod.forEach(item2 => {
          var CP;
          if (ele.ContinuePeriod == item2.value) {
            CP = item2.value;
            params[`Conditions.${i}.ContinuePeriod`] = CP; // 持續週期
          }
        });
        this.SymbolList.forEach((item3, index) => {
          var CT;
          if (ele.CalcType == item3) {
            CT = index + 1;
            params[`Conditions.${i}.CalcType`] = CT; // 符號
          }
        });
        this.jinggaoZQ.forEach(item4 => {
          var AM;
          if (ele.alarm == item4.value && ele.alarm !== 1) {
            AM = item4.value;
            params[`Conditions.${i}.AlarmNotifyPeriod`] = AM;
            params[`Conditions.${i}.AlarmNotifyType`] = 0;
          }
          if (ele.alarm == 1) {
            // params[`Conditions.${i}.AlarmNotifyPeriod`] = ''
            params[`Conditions.${i}.AlarmNotifyType`] = 1;
          }
        });
        if (this.metting == 1 && this.all_alarm !== 1) {
          params[`Conditions.${i}.AlarmNotifyPeriod`] = this.all_alarm;
          params[`Conditions.${i}.AlarmNotifyType`] = 0;
        } else if (this.metting == 1 && this.all_alarm == 1) {
          params[`Conditions.${i}.AlarmNotifyType`] = 1;
        }
      });
      await this.axios.post(NEWBUILD_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
          this.show = false; // 關閉彈框
          this.formInline.strategy_name = "";
          this.formInline.textareas = "";
          this.indexAry = [
            {
              Period: 60,
              CalcType: ">",
              CalcValue: "0",
              MetricId: 33,
              Unit: "%",
              ContinuePeriod: 1,
              alarm: 86400
            }
          ];
          this.$message({
            message: "新建成功",
            type: "success",
            showClose: true,
            duration: 2000
          });
          this.createSuccess(); // 更新列表
          this.loadShow = false;
        } else {
          this.errorPrompt(res);
        }
      });
    },
    passData(item) {
      // this.productData = item
      // this.zhibiaoType = item.MetricName
      this.zhibiaoType = item.Metrics;
      this.productValue = item.productValue;
      this.$nextTick(() => {
        this.loadShow = false;
      });
    },
    // 切換策略類型加載提示
    isLoading(val) {
      this.loadShow = val;
    },
    // 類型
    msgBtn(index) {
      this.liIndex = index;
    },
    addZhibiao() {
      // 添加觸發條件的指標告警
      let { zhibiaoType } = this;
      for (let i = 0; i < zhibiaoType.length; i++) {
        let result = this.indexAry.some(item => {
          return item.MetricId === zhibiaoType[i].MetricId;
        });
        this.isRepeated = result;
        if (!result) {
          this.indexAry.push({
            Period: 60,
            CalcType: ">",
            CalcValue: "0",
            ContinuePeriod: 1,
            MetricId: zhibiaoType[i].MetricId,
            Unit: zhibiaoType[i].MetricUnit,
            alarm: 86400
          });
          return;
        }
      }
      // 如果不 return 就把數組第壹個push進來
      this.indexAry.push({
        Period: 60,
        CalcType: ">",
        CalcValue: "0",
        ContinuePeriod: 1,
        MetricId: zhibiaoType[0].MetricId,
        Unit: zhibiaoType[0].MetricUnit,
        alarm: 86400
      });
    },
    delZhibiao(it) {
      // 刪除觸發條件的指標告警
      var index = this.indexAry.indexOf(it);
      if (index !== -1) {
        this.indexAry.splice(index, 1);
      }
    },
    addShijian() {
      // 添加觸發條件的事件告警
      this.eventAry.push({
        jieshou: "接收組",
        jieshouArr: [
          { value: "0", name: "接收組" },
          {
            value: "1",
            name: "接收人"
          }
        ],
        apiStr: "http", // 接口回調
        apiArr: [
          {
            value: 0,
            name: "http"
          },
          {
            value: 1,
            name: "https"
          }
        ], // 接口回調數據
        strategy_name: "", // 策略名稱
        textareas: "", // 備注
        strategy: "雲伺服器-基礎監控",
        strategy_kind: [
          {
            value: 0,
            name: "雲伺服器-基礎監控"
          }
        ], // 策略類型
        alarm: "", // 策略類型
        projectName: "預設專案",
        project: [
          {
            value: 0,
            name: "預設專案"
          }
        ]
      });
    },
    delShijian(item) {
      // 刪除觸發條件的事件告警
      var index = this.eventAry.indexOf(item);
      if (index !== -1) {
        this.eventAry.splice(index, 1);
      }
    },
    // 指標告警是否禁用
    isDisabledZB() {
      if (this.checkedZhibiao) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    // 事件告警是否禁用
    isDisabledGJ() {
      if (this.checkedGaojing) {
        this.isDisGJ = false;
      } else {
        this.isDisGJ = true;
      }
    },
    // 錯誤提示
    errorPrompt(res) {
      let ErrTips = {
        "AuthFailure.UnauthorizedOperation":
          "請求未授權。請參考 CAM 文檔對鑒權的說明。",
        DryRunOperation:
          "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
        FailedOperation: "操作失敗。",
        "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
        "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
        "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
        "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
        "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
        "FailedOperation.AlertTriggerRuleDeleteFailed": "刪除觸發條件失敗。",
        "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
        "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
        "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
        "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
        "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
        "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
        "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
        "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
        "FailedOperation.DuplicateName": "名字重複。",
        "FailedOperation.ServiceNotEnabled": "服務未啓用，開通服務後方可使用。",
        InternalError: "內部錯誤。",
        "InternalError.ExeTimeout": "執行超時。",
        InvalidParameter: "參數錯誤。",
        "InvalidParameter.InvalidParameter": "參數錯誤。",
        "InvalidParameter.InvalidParameterParam": "參數錯誤。",
        InvalidParameterValue: "無效的參數值。",
        LimitExceeded: "超過配額限制。",
        "LimitExceeded.MetricQuotaExceeded":
          "指標數量達到配額限制，禁止含有未注冊指標的請求。",
        MissingParameter: "缺少參數錯誤。",
        ResourceInUse: "資源被占用。",
        ResourceInsufficient: "資源不足。",
        ResourceNotFound: "資源不存在。",
        ResourceUnavailable: "資源不可用。",
        ResourcesSoldOut: "資源售罄。",
        UnauthorizedOperation: "未授權操作。",
        UnknownParameter: "未知參數錯誤。",
        UnsupportedOperation: "操作不支持。"
      };
      let ErrOr = Object.assign(ErrorTips, ErrTips);
      this.$message({
        message: ErrOr[res.Response.Error.Code],
        type: "error",
        showClose: true,
        duration: 0
      });
    },
    // 新建策略類型
    showMsgfromChild(val) {
      console.log("val", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog >>> .el-button,
.dialog >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}

.dialog >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.dialog >>> .el-dialog__body {
  padding: 0 20px;
}
.dialog .color {
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 10px;

  background-color: #f2f2f2;
  p {
    margin: 5px 0;
  }
}
.dialog {
  display: flex;
  width: 100%;
  height: 100%;
  color: #888;
  background: white;
  box-shadow: 1px 1px 5px #cccccc;
  span {
    line-height: 30px;
  }
  .cont {
    display: flex;
  }
  p.rowCont {
    line-height: 30px;
    // padding: 10px 0;
    span {
      display: inline-block;
      width: 70px;
    }
  }
  input {
    margin: 0;
  }
  > div {
    span {
      display: inline-block;
      width: 70px;
    }
  }

  .table {
    margin-top: 20px;
  }
  .foot {
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  .dialog-footer {
    margin-top: 20px;
  }
}
.mp {
  height: 28px;
}
</style>
