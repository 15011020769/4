<template>
  <div class="create-wrap">
    <Header title="新增策略" :backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <el-form class="create-form" :model="formInline" ref="form" label-position="left" label-width="70px"
          size="mini">
          <el-form-item label="策略名稱" prop="strategy_name" :rules="strategyNameValidator">
            <el-input class="w200" v-model="formInline.strategy_name" placeholder="1-20個中英文字符或下劃線" @input="EditTips"
              maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="備注" prop="textarea">
            <el-input class="w420" :autosize="{ minRows: 5, maxRows: 2 }" type="textarea" placeholder="1-100個中英文字符或下劃線"
              v-model="formInline.textarea" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="策略類型">
            <product-type @PassData="passData" :searchParam="searchParam" :projectId="formInline.projectId"
              :productValue="formInline.productValue" @loading="e => (loading = e)" />
          </el-form-item>
          <el-form-item label="所屬專案" prop="projectName" v-if="
              product.productValue === 'cvm_device' ||
                product.productValue === 'BS'
            ">
            <el-select class="w200" v-model="formInline.projectId" @change="projectIdChange = true">
              <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.projectName"
                :value="item.projectId" label-width="40px"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警物件">
            <p>
              <el-radio v-model="radio" label="1">全部物件</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="2">選擇部分物件</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="3">選擇實例組</el-radio>
              <el-button type="text" size="mini" style="position: relative;margin-left: 20px"
                @click="$router.push({ path: '/Casegrouping' })">新建實例組
              </el-button>
            </p>
          </el-form-item>
          <!-- 告警對象-》選擇部分對象 -->
          <div style="margin-bottom: 18px" v-show="radio === '2'">
            <div style="margin-left: 70px">
              <cam-transfer-cpt ref="camTransferCpt" v-loading="loading" :productData="product" isShowRight
                @projectId="projectIds" @searchParam="searchParams" @multipleSelection="selectDatas"></cam-transfer-cpt>
            </div>
          </div>
          <!-- 告警對象-》 選擇實例組 -->
          <div style="margin-bottom: 18px" v-show="radio === '3'">
            <div style="margin-left: 70px">
              <el-form-item label-width="0px">
                <el-select v-model="formInline.instanceGroupId" style="width:150px;">
                  <el-option v-for="(item, index) in formInline.instanceGroup" :key="index" :label="item.GroupName"
                    :value="item.InstanceGroupId" label-width="40px"></el-option>
                </el-select>
                <el-button type="text" size="mini" style="width: 50px" @click="describeInstanceGroupList">重新整理
                </el-button>
              </el-form-item>
            </div>
          </div>
          <!-- 觸發條件 -->
          <div style="margin-bottom: 18px">
            <label
              style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">觸發條件</label>
            <div style="margin-left: 70px" v-loading="loading">
              <!-- 觸發條件範本 -->
              <div style="background-color: #f2f2f2;padding: 20px">
                <el-radio v-model="radioChufa" label="1">觸發條件範本</el-radio>
                <el-button type="text" size="mini" style="margin-left: 20px"
                  @click="$router.push({ path: '/Template' })">新增觸發條件範本
                </el-button>
                <div v-show="radioChufa === '1'" style="padding: 10px">
                  <el-form-item label-width="0px" style="margin-bottom: 0px">
                    <el-select v-model="formInline.conditionsTemplateId" style="width:150px;"
                      placeholder="當前策略下沒有觸發條件範本" @change="conditionTemplateChange"
                      :disabled="!formInline.conditionsTemplateId">
                      <el-option v-for="(item, index) in formInline.conditionsTemplate" :key="index"
                        :label="item.GroupName" :value="item.GroupID" label-width="40px"></el-option>
                    </el-select>
                    <el-button type="text" size="mini" style="margin-left: 20px"
                      @click="describeConditionsTemplateList">重新整理
                    </el-button>
                  </el-form-item>
                  <div v-show="formInline.conditionsTemplateId">
                    <p style="line-height: 28px" v-if="formInline.triggerCondition.Conditions.length > 0">
                      <el-checkbox disabled>指標告警</el-checkbox>
                    </p>
                    <div style="padding-left: 21px" v-if="formInline.triggerCondition.Conditions.length > 0">
                      <el-form-item label-width="0px">
                        <span>滿足</span>
                        <el-select v-model="formInline.triggerCondition.IsUnionRule" style="margin: 0px 5px" disabled>
                          <el-option v-for="(item, index) in condition" :key="index" :label="item.label"
                            :value="item.id" label-width="40px"></el-option>
                        </el-select>
                        <span>條件時，觸發告警</span>
                      </el-form-item>
                      <div v-for="cItem in formInline.triggerCondition.Conditions" :key="cItem.RuleID">
                        <div class="indication-alarm">
                          <span>if</span>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.MetricId" style="width:150px;" disabled>
                              <el-option v-for="(item, index) in product.Metrics" :key="index"
                                :label="item.MetricShowName" :value="item.MetricId"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.Period" style="width:150px;" disabled>
                              <el-option v-for="(item, index) in tongjiZQ" :key="index" :label="item.label"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.CalcType" style="width:80px;" disabled>
                              <el-option v-for="(item, index) in symbolList" :key="index" :label="item.label"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-input style="vertical-align: baseline;width: 140px" placeholder="指標" value="0" min="0"
                              max="100" type="number" v-model="cItem.CalcValue" disabled>
                              <template slot="append">{{ cItem.Unit }}
                              </template>
                            </el-input>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.ContinueTime" style="width:120px;" disabled>
                              <el-option v-for="(item, index) in continuePeriod" :key="index" :label="item.label"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <template v-if="formInline.triggerCondition.IsUnionRule === 0">
                            <span>then</span>
                            <el-form-item label-width="0px" style="display: inline-block">
                              <el-select v-model="cItem.AlarmNotifyPeriod" style="width:150px;" disabled>
                                <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label"
                                  :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                            <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                          </template>
                        </div>
                      </div>
                      <div v-show="formInline.triggerCondition.IsUnionRule === 1">
                        <span>then</span>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="
                              formInline.triggerCondition.AlarmNotifyPeriod
                            " style="width:150px;" disabled>
                            <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                      </div>
                    </div>
                    <!-- 事件告警 -->
                    <p style="line-height: 28px" v-if="
                        formInline.triggerCondition.EventConditions.length > 0
                      ">
                      <el-checkbox disabled>事件告警</el-checkbox>
                      <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                    </p>
                    <div style="padding-left: 21px" v-if="
                        formInline.triggerCondition.EventConditions.length > 0
                      ">
                      <div v-for="(feItem, feIndex) in formInline.triggerCondition
                          .EventConditions" :key="feIndex">
                        <el-form-item label-width="0px">
                          <el-select v-model="feItem.EventID" style="width:180px;" disabled>
                            <el-option v-for="(item, index) in product.EventMetrics" :key="index"
                              :label="item.EventShowName" :value="item.EventId" label-width="40px"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 配置觸發條件 -->
              <div style="background-color: #f2f2f2;padding: 20px;margin-top: 10px;">
                <el-radio v-model="radioChufa" label="2">配置觸發條件</el-radio>
                <!--                <div class="tip">請至少配置1項觸發條件</div>-->
                <div v-show="radioChufa === '2'" style="padding: 10px">
                  <div v-if="formInline.alarmCheckbok.length === 0"
                    style="color: #b43537;border: 1px solid #f6b5b5;background-color: #fcecec; line-height: 27px;padding: 10px 30px 10px 20px;margin-bottom: 20px;">
                    请至少配置1项触发条件
                  </div>
                  <p style="line-height: 28px">
                    <el-checkbox v-model="formInline.alarmCheckbok" label="指標告警">指標告警
                    </el-checkbox>
                  </p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <span>滿足</span>
                      <el-select v-model="formInline.configTrigger.IsUnionRule" style="margin: 0px 5px" :disabled="
                          !formInline.alarmCheckbok.includes('指標告警')
                        ">
                        <el-option v-for="(item, index) in condition" :key="index" :label="item.label" :value="item.id"
                          label-width="40px"></el-option>
                      </el-select>
                      <span>條件時，觸發告警</span>
                    </el-form-item>
                    <div v-for="(cItem, cIndex) in formInline.configTrigger
                        .Conditions" :key="cItem.key">
                      <div class="indication-alarm">
                        <span>if</span>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.MetricId" style="width:150px;" :disabled="
                              !formInline.alarmCheckbok.includes('指標告警')
                            " @change="configTriggerConditionCalcValueChange">
                            <el-option v-for="(item, index) in product.Metrics" :key="index"
                              :label="item.MetricShowName" :value="item.MetricId"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.Period" style="width:150px;" :disabled="
                              !formInline.alarmCheckbok.includes('指標告警')
                            ">
                            <el-option v-for="(item, index) in tongjiZQ" :key="index" :label="item.label"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.CalcType" style="width:80px;" :disabled="
                              !formInline.alarmCheckbok.includes('指標告警')
                            ">
                            <el-option v-for="(item, index) in symbolList" :key="index" :label="item.label"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block"
                          :prop="`configTrigger.Conditions.${cIndex}.CalcValue`"
                          :rules="configTriggerCalcValueValidator">
                          <el-input style="vertical-align: baseline;width: 190px" placeholder="指標" value="0"
                            type="number" v-model.number="cItem.CalcValue" :disabled="
                              !formInline.alarmCheckbok.includes('指標告警')
                            ">
                            <template slot="append">{{ cItem.Unit }}</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.ContinueTime" style="width:120px;" :disabled="
                              !formInline.alarmCheckbok.includes('指標告警')
                            ">
                            <el-option v-for="(item, index) in continuePeriod" :key="index" :label="item.label"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <template v-if="formInline.configTrigger.IsUnionRule === 0">
                          <span>then</span>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.AlarmNotifyPeriod" style="width:150px;" :disabled="
                                !formInline.alarmCheckbok.includes('指標告警')
                              ">
                              <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                          <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="
                              configTriggerDelConditions(
                                formInline.configTrigger.Conditions,
                                cIndex
                              )
                            " v-if="
                              formInline.configTrigger.Conditions.length > 1
                            "></i>
                        </template>
                      </div>
                    </div>
                    <div v-show="formInline.configTrigger.IsUnionRule === 1">
                      <span>then</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.configTrigger.AlarmNotifyPeriod" style="width:150px;" :disabled="
                            !formInline.alarmCheckbok.includes('指標告警')
                          ">
                          <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label"
                            :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <el-button type="text" size="mini" @click="configTriggerAddConditions">添加
                    </el-button>
                  </div>
                  <!-- 事件告警 -->
                  <p style="line-height: 28px" v-if="product.EventMetrics !== undefined">
                    <el-checkbox v-model="formInline.alarmCheckbok" label="事件告警">事件告警
                    </el-checkbox>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <div style="padding-left: 21px" v-if="product.EventMetrics !== undefined">
                    <div v-for="(feItem, feIndex) in formInline.configTrigger
                        .EventConditions" :key="feIndex">
                      <el-form-item label-width="0px" :prop="
                          `configTrigger.EventConditions.${feIndex}.EventID`
                        " :rules="configTriggerEventIDValidator">
                        <el-select v-model="feItem.EventID" style="width:180px;" :disabled="
                            !formInline.alarmCheckbok.includes('事件告警')
                          " @change="configTriggerEventConditionEventIDChange">
                          <el-option v-for="(item, index) in product.EventMetrics" :key="index"
                            :label="item.EventShowName" :value="item.EventId" label-width="40px"></el-option>
                        </el-select>
                        <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="
                            configTriggerDelEventConditions(
                              formInline.configTrigger.EventConditions,
                              feIndex
                            )
                          " v-if="
                            formInline.configTrigger.EventConditions.length > 1
                          "></i>
                      </el-form-item>
                    </div>
                    <el-button type="text" size="mini" @click="configTriggerAddEventConditions">添加
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 告警管道 -->
          <div style="margin-bottom: 18px">
            <label
              style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">告警管道</label>
            <div style="margin-left: 70px;background-color: #f2f2f2;">
              <Cam v-loading="receivingObjectLoad" @camClick="camFun" ref="cam" :selectedList="receivingObjectData"
                :type="ReceiverInfos.ReceiverType"></Cam>
            </div>
          </div>
          <!-- 接口回調 -->
          <div style="margin-bottom: 18px">
            <div style="width: 70px;">
              <label style="vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">接口回調</label>
              <!--<p>（選填）</p>-->
            </div>
            <div style="margin-left: 70px" class="callback-interface-box">
              <div class="text-http">
                <el-select v-model="httpVal" placeholder="請選擇" @change="HttpTypeChange">
                  <el-option v-for="item in httpOpt" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="httpInput" placeholder="例如：www.com:8080/callback" @focus="HttpHistroy"
                  @blur="HttpHistroyBlur" class="input-http" @input="HttpHistruyInput"></el-input>
                <ul v-if="httpShow" @mouseleave="leave()">
                  <li v-for="(item, index) in httpOption" :key="index" @click="HttpSelect(item)">
                    <p>
                      {{
                        item.Url.substring(
                          item.Url.lastIndexOf("/") + 1,
                          item.Url.length
                        )
                      }}
                      <span>{{ item.ValidFlag == 0 ? "" : "驗證超時" }}</span>
                    </p>
                  </li>
                  <li v-if="httpOption.length === 0">
                    無數據
                  </li>
                </ul>
              </div>
              <p style="line-height: 28px">
                填寫公網可訪問到的url作爲回調接口地址(域名或IP[:端口][/path])，雲監控將及時把告警訊息推送到該地址。
              </p>
              <div
                style="margin-top: 10px;background-color: #fff4e3;color: #c07400;border: 1px solid #ffd18b;padding: 10px 20px;font-size: 12px;line-height: 28px;">
                <p>
                  回調域名通過驗證後生效，請于Response Body中返回以下code。<i class="el-icon-info" style="margin:0 5px;color: #c07400;"></i>
                </p>
                <p style="margin: 10px 0;font-size: 16px;font-weight: 700;">
                  {{ httpCode }}
                </p>
              </div>
            </div>
          </div>
        </el-form>
        <div class="foot">
          <el-button type="primary" size="small" @click="save" :disabled="saveBtnIsDisable">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Header from "./Head";
  import Cam from "@/views/CM/CM_assembly/Cam";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_PROJECT,
    CM_GROUPING_LIST,
    CM_ALARM_OBJECT_LIST_EDIT,
    CM_ALARM_RECEIVE_OBJECT_RELIEVE,
    CM_CALLBACK_SAVE,
    LIST_SUBACCOUNTS
  } from "@/constants";
  import {
    GET_CONDITIONSTEMPLATELIST
  } from "@/constants/CM-yhs.js";
  import {
    CM_CALLBACK,
    CM_CALLBACK_HISTORY,
    CREATE_POLICYGROUP,
    CM_ALARM_STRATEGY_DETAILS,
    CM_ALARM_RECEIVE_OBJECT_GetGroup
  } from "@/constants/CM-wxy.js";
  import CamTransferCpt from "@/views/CM/CM_assembly/CamTransferCpt";
  import ProductType from "@/views/CM/CM_assembly/product_type";

  export default {
    components: {
      ProductType,
      CamTransferCpt,
      Header,
      Cam
    },
    data: function () {
      return {
        strategyNameValidator: [{
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("策略名稱不能爲空"));
            } else if (value.length > 20) {
              callback(new Error("策略名稱不能超過20個字符"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }],
        configTriggerEventIDValidator: [{
          validator: (rule, value, callback) => {
            if (this.radioChufa === "2") {
              let index = parseInt(rule.field.split(".")[2]);
              let EventConditions = this.formInline.configTrigger
                .EventConditions;
              for (let i = 0; i < index; i++) {
                if (
                  EventConditions[index].EventID === EventConditions[i].EventID
                ) {
                  callback(new Error("請勿重複配置"));
                  return;
                }
              }
            }
            callback();
          }
        }],
        configTriggerCalcValueValidator: [{
          validator: (rule, value, callback) => {
            if (this.radioChufa === "2") {
              let index = parseInt(rule.field.split(".")[2]);
              let Conditions = this.formInline.configTrigger.Conditions;
              let {
                CalcValue,
                MetricId
              } = Conditions[index];
              for (let i = 0; i < index; i++) {
                if (
                  Conditions[index].CalcValue === Conditions[i].CalcValue &&
                  Conditions[index].MetricId === Conditions[i].MetricId
                ) {
                  callback(new Error("請勿重複配置"));
                  return;
                }
              }
              if (CalcValue === "") {
                callback(new Error("請輸入非空數值"));
                return;
              }
              let panduanObj = this.product.Metrics.find(
                item => item.MetricId === MetricId
              );
              if (panduanObj.ConfigManual.CalcValue.Need) {
                if (
                  parseFloat(CalcValue) >
                  parseInt(panduanObj.ConfigManual.CalcValue.Max)
                ) {
                  callback(
                    new Error(
                      `請輸入不大於${parseInt(
                        panduanObj.ConfigManual.CalcValue.Max
                      )}的數字`
                    )
                  );
                  return;
                }
                if (
                  parseFloat(CalcValue) <
                  parseInt(panduanObj.ConfigManual.CalcValue.Min)
                ) {
                  callback(
                    new Error(
                      `請輸入不小於${parseInt(
                        panduanObj.ConfigManual.CalcValue.Min
                      )}的數字`
                    )
                  );
                  return;
                }
              }
            }
            callback();
          }
        }],
        radio: "2", // 选择告警对象类型
        radioChufa: "2", // 触发条件单选
        options: [],
        formInline: {
          alarmCheckbok: ["指標告警", "事件告警"],
          protocolValue: "http", // 接口回调
          callbackVerifyCode: "",
          strategy_name: "", // 策略名称
          textarea: "", // 备注
          strategy: "雲伺服器-基礎監控",
          strategy_kind: [{
            value: 0,
            name: "雲伺服器-基礎監控"
          }], // 策略類型
          alarm: "", // 策略類型
          project: [{
            projectName: "預設專案",
            projectId: 0
          }],
          projectId: 0,
          instanceGroup: [],
          instanceGroupId: "",
          conditionsTemplate: [], // 触发条件範本下拉数组
          conditionsTemplateId: "",
          triggerCondition: {
            IsUnionRule: 0,
            Conditions: [], // 触发条件-》指标告警
            EventConditions: [] // 触发条件-》事件告警
          },
          configTrigger: {
            IsUnionRule: 0,
            Conditions: [], // 触发条件-》指标告警
            EventConditions: [], // 触发条件-》事件告警
            AlarmNotifyPeriod: 86400
          },
          productValue: "cvm_device"
        },
        condition: [{
            id: 0,
            label: "任意"
          },
          {
            id: 1,
            label: "所有"
          }
        ],
        tongjiZQ: [{
            id: 60,
            label: "統計週期1分鍾"
          },
          {
            id: 300,
            label: "統計週期5分鍾"
          }
        ],
        symbolList: [{
            id: "1",
            label: ">"
          },
          {
            id: "2",
            label: ">="
          },
          {
            id: "3",
            label: "<"
          },
          {
            id: "4",
            label: "<="
          },
          {
            id: "5",
            label: "="
          },
          {
            id: "6",
            label: "!="
          }
        ], // 符號陣列
        continuePeriod: [{
            id: 1,
            label: "持續1個週期"
          },
          {
            id: 2,
            label: "持續2個週期"
          },
          {
            id: 3,
            label: "持續3個週期"
          },
          {
            id: 4,
            label: "持續4個週期"
          },
          {
            id: 5,
            label: "持續5個週期"
          }
        ], // 持續週期
        jinggaoZQ: [{
            label: "不重複",
            id: 0
          },
          {
            label: "每5分鍾警告壹次",
            id: 300
          },
          {
            label: "每10分鍾警告壹次",
            id: 600
          },
          {
            label: "每15分鍾警告壹次",
            id: 900
          },
          {
            label: "每30分鍾警告壹次",
            id: 1800
          },
          {
            label: "每1小時警告壹次",
            id: 3600
          },
          {
            label: "每2小時警告壹次",
            id: 7200
          },
          {
            label: "每3小時警告壹次",
            id: 10800
          },
          {
            label: "每6小時警告壹次",
            id: 21600
          },
          {
            label: "每12小時警告壹次",
            id: 43200
          },
          {
            label: "每1天警告壹次",
            id: 86400
          },
          {
            label: "週期指數遞增",
            id: 1
          }
        ], // 警告週期
        cam: {}, // cam元件的值
        projectId: 0,
        searchParam: {},
        product: {},
        loading: false,
        httpCodes: "", // 回調的隨機碼
        protocol: ["http", "https"],
        httpOption: [],
        httpsOption: [],
        saveResponseGroupId: "", // 新建響應回的GroupId
        multipleSelection: [],
        groupId: 0,
        groupInfo: {},
        isInit: false,
        projectIdChange: false,
        receivingObjectData: [],
        receivingObjectLoad: false,
        ReceiverInfos: [],
        saveBtnIsDisable: false,
        fromEventCenterParam: null,
        isFromEventCenterInit: false,
        httpOpt: [{
            value: "http",
            label: "http"
          },
          {
            value: "https",
            label: "https"
          }
        ],
        httpVal: "http",
        httpShow: false,
        httpOption: [],
        httpOption1: [],
        httpOption2: [],
        httpOption3: [],
        httpCodes: "",
        httpCode: "",
        httpInput: ""
      };
    },
    watch: {
      "formInline.configTrigger.Conditions": {
        handler: function (val) {
          val.forEach((item, index) => {
            let tempObj = this.product.Metrics.find(pmItem => {
              return pmItem.MetricId === item.MetricId;
            });
            if (tempObj) {
              this.formInline.configTrigger.Conditions[index].Unit =
                tempObj.MetricUnit;
            }
          });
        },
        deep: true
      }
    },
    methods: {
      EditTips() {
        if (this.formInline.strategy_name.length === 20) {
          this.$message({
            message: "名稱不能超過20個字",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      },
      selectDatas: function (val) {
        this.multipleSelection = val;
      },
      searchParams: function (val) {
        this.searchParam = val;
      },
      projectIds: function (val) {
        this.projectId = val;
      },
      passData: async function (val) {
        this.multipleSelection = [];
        this.product = {
          ...val,
          projectId: this.formInline.projectId
        };
        await this.initRequest();
        if (this.isInit) {
          if (!this.projectIdChange) {
            let {
              ConditionsTemp,
              IsUnionRule,
              ConditionsConfig,
              EventConfig
            } = this.groupInfo;
            // 回显触发条件
            if (ConditionsTemp) {
              this.formInline.conditionsTemplateId = ConditionsTemp.GroupId;
              this.conditionTemplateChange(ConditionsTemp.GroupId);
            } else {
              this.formInline.configTrigger.IsUnionRule = IsUnionRule;
              this.formInline.alarmCheckbok = [];
              if (ConditionsConfig) {
                if (IsUnionRule === 1) {
                  this.formInline.configTrigger.AlarmNotifyPeriod =
                    ConditionsConfig[0].AlarmNotifyPeriod;
                }
                this.formInline.configTrigger.Conditions = ConditionsConfig.map(
                  item => {
                    item.MetricShowName = "磁碟利用率";
                    item.continuePeriod = item.AlarmNotifyPerio;
                    if (item.ContinueTime !== undefined) {
                      item.ContinueTime = [1, 2, 3, 4, 5].includes(
                          item.ContinueTime
                        ) ?
                        item.ContinueTime :
                        item.ContinueTime / item.Period;
                    }
                    if (item.CalcType) {
                      item.CalcType = item.CalcType.toString();
                    }
                    return item;
                  }
                );
                this.formInline.alarmCheckbok.push("指標告警");
              }
              if (EventConfig) {
                this.formInline.configTrigger.EventConditions = EventConfig.map(
                  item => {
                    item.EventID = item.EventId;
                    return item;
                  }
                );
                this.formInline.alarmCheckbok.push("事件告警");
              }
            }
          } else {
            this.isInit = false;
          }
        }
        if (this.isFromEventCenterInit) {
          let {
            ProjectId,
            InstanceId,
            EventId
          } = this.fromEventCenterParam;
          let tempProjectId = this.formInline.projectId;
          this.formInline.projectId = ProjectId;
          if (tempProjectId === ProjectId) {
            this.$refs.camTransferCpt.byIdSetSeleteList(InstanceId);
            this.formInline.alarmCheckbok = ["事件告警"];
            this.formInline.configTrigger.EventConditions[0].EventID = EventId;
            this.isFromEventCenterInit = false;
          }
        }
        this.projectIdChange = false;
        this.loading = false;
      },
      configTriggerDelConditions: function (arr, index) {
        arr.splice(index, 1);
        this.$nextTick(() => {
          this.configTriggerConditionCalcValueChange();
        });
      },
      configTriggerAddConditions: function () {
        let {
          Metrics
        } = this.product;
        for (let i = 0; i < Metrics.length; i++) {
          let exist = this.formInline.configTrigger.Conditions.some(item => {
            return item.MetricId === Metrics[i].MetricId;
          });
          if (!exist) {
            this.formInline.configTrigger.Conditions.push({
              key: Date.now(),
              MetricId: Metrics[i].MetricId,
              Period: 60,
              CalcType: "1",
              CalcValue: 0,
              Unit: "",
              ContinueTime: 1,
              AlarmNotifyPeriod: 86400
            });
            this.$nextTick(() => {
              this.configTriggerConditionCalcValueChange();
            });
            return;
          }
        }
        this.formInline.configTrigger.Conditions.push({
          key: Date.now(),
          MetricId: Metrics[0].MetricId,
          Period: 60,
          CalcType: "1",
          CalcValue: 0,
          Unit: "",
          ContinueTime: 1,
          AlarmNotifyPeriod: 86400,
          ConfigManual: Metrics[0].ConfigManual
        });
        this.$nextTick(() => {
          this.configTriggerConditionCalcValueChange();
        });
      },
      configTriggerConditionCalcValueChange: function () {
        this.formInline.configTrigger.Conditions.forEach((item, idx) => {
          this.$refs["form"].validateField(
            `configTrigger.Conditions.${idx}.CalcValue`
          );
        });
      },
      configTriggerDelEventConditions: function (arr, index) {
        arr.splice(index, 1);
        this.$nextTick(() => {
          this.configTriggerEventConditionEventIDChange();
        });
      },
      configTriggerAddEventConditions: function () {
        let {
          EventMetrics
        } = this.product;
        if (!EventMetrics) {
          let index = this.formInline.alarmCheckbok.indexOf("事件告警");
          if (index !== -1) this.formInline.alarmCheckbok.splice(index, 1);
          return;
        }
        for (let i = 0; i < EventMetrics.length; i++) {
          let exist = this.formInline.configTrigger.EventConditions.some(item => {
            return item.EventID === EventMetrics[i].EventId;
          });
          if (!exist) {
            this.formInline.configTrigger.EventConditions.push({
              key: Date.now(),
              AlarmNotifyPeriod: 0,
              AlarmNotifyType: 0,
              EventID: EventMetrics[i].EventId
            });
            this.$nextTick(() => {
              this.configTriggerEventConditionEventIDChange();
            });
            return;
          }
        }
        this.formInline.configTrigger.EventConditions.push({
          key: Date.now(),
          AlarmNotifyPeriod: 0,
          AlarmNotifyType: 0,
          EventID: EventMetrics[0].EventId
        });
        this.$nextTick(() => {});
      },
      configTriggerEventConditionEventIDChange: function () {
        this.formInline.configTrigger.EventConditions.forEach((item, idx) => {
          this.$refs["form"].validateField(
            `configTrigger.EventConditions.${idx}.EventID`
          );
        });
      },
      initRequest: async function () {
        await Promise.all([this.describeConditionsTemplateList()]).then(() => {
          this.describeInstanceGroupList();
          this.formInline.configTrigger.Conditions = [];
          this.formInline.configTrigger.EventConditions = [];
          this.configTriggerAddConditions();
          this.configTriggerAddEventConditions();
          if (this.formInline.conditionsTemplate.length > 0) {
            this.conditionTemplateChange(
              this.formInline.conditionsTemplate[0].GroupID
            );
          } else {
            this.conditionTemplateChange("");
          }
        });
      },
      callbackEdit: async function () {
        let params = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        await this.axios.post(CM_CALLBACK, params).then(res => {
          this.axiosUtils(res, () => {
            this.httpCodes = res.Response.VerifyCode;
          });
        });
      },
      httpHistroy: function () {
        this.httpOption = [];
        this.httpsOption = [];
        let param = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
          this.axiosUtils(res, () => {
            let {
              List
            } = res.Response;
            if (!List) List = [];
            List.forEach(item => {
              let [protocol, website] = item.Url.split("://");
              item.website = website;
              item.protocol = protocol;
              if (protocol === "http") {
                this.httpOption.push(item);
              } else {
                this.httpsOption.push(item);
              }
            });
          });
        });
      },
      // 條件觸發範本 更改
      conditionTemplateChange: function (groupID) {
        if (groupID !== "") {
          let oneConditionsTemplate = this.formInline.conditionsTemplate.find(
            item => {
              return item.GroupID === groupID;
            }
          );
          let {
            IsUnionRule,
            Conditions,
            EventConditions
          } = oneConditionsTemplate;
          Conditions.map(item => {
            let {
              ContinueTime,
              Period
            } = item;
            if (!(ContinueTime > -1 && ContinueTime < 6)) {
              item.ContinueTime = ContinueTime / Period;
              item.ContinueTime =
                item.ContinueTime !== 0 ? item.ContinueTime : "";
            }
            return item;
          });
          oneConditionsTemplate.EventConditions = EventConditions.map(item => {
            item.EventID = parseInt(item.EventID);
            return item;
          });
          if (IsUnionRule === 1 && Conditions.length > 0) {
            oneConditionsTemplate.AlarmNotifyPeriod =
              Conditions[0].AlarmNotifyPeriod;
          }
          this.formInline.triggerCondition = oneConditionsTemplate;
        } else {
          this.formInline.triggerCondition = {
            IsUnionRule: "",
            Conditions: [],
            EventConditions: []
          };
        }
      },
      // 獲取 專案 列表
      getProjectsList: async function () {
        this.axios.post(ALL_PROJECT, {}).then(res => {
          this.axiosUtils(res, () => {
            this.formInline.project = [{
                projectName: "預設專案",
                projectId: 0
              },
              ...res.data
            ];
          });
        });
      },
      // 獲取 選擇實例組 列表
      describeInstanceGroupList: async function () {
        let _viewName = "";
        if (this.$route.query.viewName) {
          _viewName = this.$route.query.viewName;
        } else {
          _viewName = this.product.productValue;
        }
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
          Limit: 100,
          Offset: 0,
          ViewName: _viewName
        };
        await this.axios.post(CM_GROUPING_LIST, params).then(res => {
          this.axiosUtils(res, () => {
            this.formInline.instanceGroup = res.Response.InstanceGroupList;
            console.log(this.formInline.instanceGroup);
            if (res.Response.InstanceGroupList.length > 0) {
              this.formInline.instanceGroupId =
                res.Response.InstanceGroupList[0].InstanceGroupId;
            }
          });
        });
      },
      // 獲取 觸發條件範本 列表
      describeConditionsTemplateList: async function () {
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
          ViewName: this.product.productValue
        };
        await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
          this.axiosUtils(res, () => {
            this.formInline.conditionsTemplate = res.Response.TemplateGroupList;
            if (res.Response.TemplateGroupList.length > 0) {
              this.formInline.conditionsTemplateId =
                res.Response.TemplateGroupList[0].GroupID;
            } else {
              this.formInline.conditionsTemplateId = "";
            }
          });
        });
      },
      describePolicyGroupInfo: async function () {
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
          GroupId: this.groupId
        };
        await this.axios.post(CM_ALARM_STRATEGY_DETAILS, params).then(res => {
          this.axiosUtils(res, () => {
            this.groupInfo = res.Response;
            this.formInline.strategy_name = `複製-${this.groupInfo.GroupName}`;
            this.formInline.textarea = this.groupInfo.Remark;
            this.formInline.productValue = this.groupInfo.ViewName;
            this.formInline.projectId = this.groupInfo.ProjectId;
            // 回显触发条件
            if (this.groupInfo.ConditionsTemp) {
              this.radioChufa =
                this.groupInfo.ConditionsTemp &&
                this.groupInfo.ConditionsTemp.IsUnionRule !== undefined ?
                "1" :
                "2";
              this.formInline.conditionsTemplateId = this.groupInfo.GroupId;
            }
            // 回显接口回调
            if (this.groupInfo.Callback) {
              let cb = this.groupInfo.Callback.CallbackUrl.split("://");
              this.formInline.protocolValue = cb[0];
              this.formInline.callbackVerifyCode = this.groupInfo.Callback.VerifyCode;
            }
            this.isInit = true;
          });
        });
      },
      camFun(data) {
        this.cam = data;
      },
      // 保存
      save: async function () {
        let {
          multipleSelection,
          radio,
          cam
        } = this;
        let {
          Conditions,
          EventConditions
        } = this.formInline.configTrigger;
        for (let i = 0; i < Conditions.length; i++) {
          let errMsg = "";
          this.$refs["form"].validateField(
            `configTrigger.Conditions.${i}.CalcValue`,
            errorMessage => {
              errMsg = errorMessage;
            }
          );
          if (errMsg !== "") {
            this.$message({
              message: "請選擇告警條件",
              type: "error",
              showClose: true,
              duration: 0
            });
            return;
          }
        }
        for (let i = 0; i < EventConditions.length; i++) {
          let errMsg = "";
          this.$refs["form"].validateField(
            `configTrigger.EventConditions.${i}.EventID`,
            errorMessage => {
              errMsg = errorMessage;
            }
          );
          if (errMsg !== "") {
            this.$message({
              message: "請選擇告警條件",
              type: "error",
              showClose: true,
              duration: 0
            });
            return;
          }
        }
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (radio === "2" && multipleSelection.length <= 0) {
              this.$message({
                message: "請選擇綁定物件",
                type: "error",
                showClose: true,
                duration: 0
              });
              return;
            }
            if (
              JSON.stringify(cam) === "{}" ||
              (cam.selectUserGroup.length <= 0 && cam.selectUserList <= 0)
            ) {
              this.$message({
                message: "請選擇接收物件",
                type: "error",
                showClose: true,
                duration: 0
              });
              return;
            } else if (cam.channel.length <= 0) {
              this.$message({
                message: "請選擇接收管道 ",
                type: "error",
                showClose: true,
                duration: 0
              });
              return;
            } else if (
              this.radioChufa === "2" &&
              this.formInline.alarmCheckbok.length === 0
            ) {
              this.$message({
                message: "請選擇告警條件 ",
                type: "error",
                showClose: true,
                duration: 0
              });
            }
            this.saveSubmit();
          } else {
            console.error("有驗證錯誤");
            return false;
          }
        });
      },
      saveSubmit: async function () {
        this.saveBtnIsDisable = true;
        let {
          configTrigger,
          triggerCondition,
          textarea,
          alarmCheckbok
        } = this.formInline;
        let {
          productValue
        } = this.product;
        let params = {
          Version: "2018-07-24",
          Region: localStorage.getItem("regionv2"),
          GroupName: this.formInline.strategy_name,
          Module: "monitor",
          ViewName: productValue,
          ProjectId: productValue === "cvm_device" || productValue === "BS" ?
            this.formInline.projectId : 0,
          IsShielded: 0
        };
        if (textarea !== "") params.Remark = textarea;
        if (this.radioChufa === "1") {
          let {
            Conditions,
            EventConditions
          } = triggerCondition;
          Conditions.forEach((item, index) => {
            params[`Conditions.${index}.MetricId`] = item.MetricId;
            params[`Conditions.${index}.AlarmNotifyType`] = item.AlarmNotifyType;
            params[`Conditions.${index}.AlarmNotifyPeriod`] =
              item.AlarmNotifyPeriod;
            params[`Conditions.${index}.CalcType`] = item.CalcType;
            params[`Conditions.${index}.CalcValue`] = item.CalcValue;
            params[`Conditions.${index}.CalcPeriod`] = item.Period;
            params[`Conditions.${index}.ContinuePeriod`] = item.ContinueTime;
            params[`Conditions.${index}.RuleId`] = item.RuleID;
          });
          EventConditions.forEach((item, index) => {
            params[`EventConditions.${index}.EventId`] = item.EventID;
            params[`EventConditions.${index}.AlarmNotifyType`] =
              item.AlarmNotifyType;
            params[`EventConditions.${index}.AlarmNotifyPeriod`] =
              item.AlarmNotifyPeriod;
            params[`EventConditions.${index}.RuleId`] = item.RuleID;
          });
          params.ConditionTempGroupId = this.formInline.conditionsTemplateId;
        } else {
          let {
            Conditions,
            EventConditions
          } = configTrigger;
          // params.IsUnionRule = configTrigger.IsUnionRule
          if (alarmCheckbok.includes("指標告警")) {
            Conditions.forEach((item, index) => {
              params[`Conditions.${index}.MetricId`] = item.MetricId;
              // todo 有問題，不知道給後台傳的是什麽值，文件上是 0.連續告警 1.指數告警
              // params[`Conditions.${index}.AlarmNotifyType`] = item.AlarmNotifyType
              params[`Conditions.${index}.AlarmNotifyType`] = 0;
              if (configTrigger.IsUnionRule === 0) {
                params[`Conditions.${index}.AlarmNotifyPeriod`] =
                  item.AlarmNotifyPeriod;
                params.IsUnionRule = 0;
              } else {
                params[`Conditions.${index}.AlarmNotifyPeriod`] =
                  configTrigger.AlarmNotifyPeriod;
                params.IsUnionRule = 1;
              }
              params[`Conditions.${index}.CalcType`] = item.CalcType;
              params[`Conditions.${index}.CalcValue`] = item.CalcValue;
              params[`Conditions.${index}.CalcPeriod`] = item.Period;
              params[`Conditions.${index}.ContinuePeriod`] = item.ContinueTime;
            });
          }
          if (alarmCheckbok.includes("事件告警")) {
            EventConditions.forEach((item, index) => {
              params[`EventConditions.${index}.EventId`] = item.EventID;
              params[`EventConditions.${index}.AlarmNotifyType`] =
                item.AlarmNotifyType;
              params[`EventConditions.${index}.AlarmNotifyPeriod`] =
                item.AlarmNotifyPeriod;
            });
          }
        }
        await this.axios.post(CREATE_POLICYGROUP, params).then(res => {
          this.axiosUtils(res, () => {
            this.saveResponseGroupId = res.Response.GroupId;
            Promise.all([this.saveOther()]).then(() => {
              setTimeout(() => {
                this.$message({
                  message: "創建告警策略成功",
                  type: "success",
                  showClose: true
                });
                this.$router.replace({
                  path: "/strategy"
                });
              }, 2000);
            });
          });
          this.saveBtnIsDisable = false;
        });
      },
      saveOther: async function () {
        this.bandingPolicyObject();
        this.updateAlarmReceivers();
        console.log(this.httpInput);
        if (this.httpInput !== "") {
          this.modifyAlarmCallback();
        }
      },
      bandingPolicyObject: async function () {
        let {
          radio,
          multipleSelection,
          product: {
            productValue,
            Date
          },
          formInline: {
            instanceGroupId
          }
        } = this;
        let params = {
          GroupId: this.saveResponseGroupId,
          Version: "2018-07-24",
          Module: "monitor"
        };
        if (this.$route.query.instanceGroupId) {
          instanceGroupId = this.$route.query.instanceGroupId;
        }
        if (radio !== "3") {
          if (radio === "1") multipleSelection = Date;
          multipleSelection.forEach((item, index) => {
            params[`Dimensions.${index}.Region`] = "tpe";
            if (productValue === "cvm_device") {
              params[`Dimensions.${index}.Dimensions`] = {
                unInstanceId: item.InstanceId
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                uuid: item.Uuid
              };
            } else if (productValue === "BS") {
              params[`Dimensions.${index}.Dimensions`] = {
                diskid: item.DiskId
              };
            } else if (productValue === "vpn_tunnel") {
              params[`Dimensions.${index}.Dimensions`] = {
                uniqVpnconnId: item.VpnConnectionId
              };
            } else if (productValue === "VPN_GW") {
              params[`Dimensions.${index}.Dimensions`] = {
                vip: item.PublicIpAddress
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                VpnGatewayId: item.VpnGatewayId
              };
            } else if (productValue === "vpn_tunnel") {
              params[`Dimensions.${index}.Dimensions`] = {
                uniqVpnconnId: item.VpnConnectionId
              };
            } else if (productValue === "nat_tc_stat") {
              params[`Dimensions.${index}.Dimensions`] = {
                uniq_nat_id: item.NatGatewayId
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                instanceId: item.NatGatewayId
              };
            } else if (productValue === "DC_GW") {
              params[`Dimensions.${index}.Dimensions`] = {
                directconnectgatewayid: item.DirectConnectGatewayId
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                instanceId: item.DirectConnectGatewayId
              };
            } else if (productValue === "EIP") {
              params[`Dimensions.${index}.Dimensions`] = {
                vip: item.AddressIp
              };
            } else if (productValue === "cdb_detail") {
              params[`Dimensions.${index}.Dimensions`] = {
                uInstanceId: item.InstanceId
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                InstanceId: item.InstanceId
              };
            } else if (productValue === "REDIS-CLUSTER") {
              params[`Dimensions.${index}.Dimensions`] = {
                instanceid: item.InstanceId
              };
              params[`Dimensions.${index}.EventDimensions`] = {
                instanceid: item.InstanceId
              };
            } else if (productValue === "dcchannel") {
              params[`Dimensions.${index}.Dimensions`] = {
                directconnecttunnelid: item.DirectConnectTunnelId
              };
            } else if (productValue === "dcline") {
              params[`Dimensions.${index}.Dimensions`] = {
                directconnectid: item.DirectConnectId
              };
            } else if (productValue === "COS") {
              params[`Dimensions.${index}.Dimensions`] = {
                bucket: item.Name
              };
            }
          });
        } else {
          params["InstanceGroupId"] = instanceGroupId;
        }
        await this.axios.post(CM_ALARM_OBJECT_LIST_EDIT, params).then(res => {
          this.axiosUtils(res, () => {
            console.log("success");
          });
        });
      },
      updateAlarmReceivers: async function () {
        let {
          selectUserGroup,
          channel,
          selectType,
          selectUserList
        } = this.cam;
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
          GroupId: this.saveResponseGroupId
        };
        if (selectUserGroup.length > 0) {
          params["ReceiverInfos.0.StartTime"] = this.cam.time[0];
          params["ReceiverInfos.0.EndTime"] = this.cam.time[1];
          for (let i in channel) {
            if (channel[i] === "郵件") {
              params["ReceiverInfos.0.NotifyWay." + i] = "EMAIL";
            } else if (channel[i] === "簡訊") {
              params["ReceiverInfos.0.NotifyWay." + i] = "SMS";
            }
          }
          /* params['ReceiverInfos.0.PersonInterval'] = this.ReceiverInfos.PersonInterval
            params['ReceiverInfos.0.RoundNumber'] = this.ReceiverInfos.RoundNumber
            params['ReceiverInfos.0.RoundInterval'] = this.ReceiverInfos.RoundInterval
            for (let i in this.ReceiverInfos.RecoverNotify) {
              params['ReceiverInfos.0.RoundInterval.' + i] = this.ReceiverInfos.RecoverNotify[i]
            }
            params['ReceiverInfos.0.NeedSendNotice'] = this.ReceiverInfos.NeedSendNotice */

          if (selectType === "group" || selectType === "") {
            params["ReceiverInfos.0.ReceiverType"] = "group";
            for (let i in this.cam.selectUserGroup) {
              params["ReceiverInfos.0.ReceiverGroupList." + i] =
                selectUserGroup[i].GroupId;
            }
          }
        }
        if (selectUserList.length > 0) {
          params["ReceiverInfos.0.StartTime"] = this.cam.time[0];
          params["ReceiverInfos.0.EndTime"] = this.cam.time[1];
          for (let i in channel) {
            if (channel[i] === "郵件") {
              params["ReceiverInfos.0.NotifyWay." + i] = "EMAIL";
            } else if (channel[i] === "簡訊") {
              params["ReceiverInfos.0.NotifyWay." + i] = "SMS";
            }
          }
          if (selectType === "user") {
            params["ReceiverInfos.0.ReceiverType"] = "user";
            for (let i in selectUserList) {
              params["ReceiverInfos.0.ReceiverUserList." + i] =
                selectUserList[i].Uid;
            }
          }
        }
        await this.axios
          .post(CM_ALARM_RECEIVE_OBJECT_RELIEVE, params)
          .then(res => {
            this.axiosUtils(res, () => {
              console.log(res);
            });
          });
      },
      modifyAlarmCallback: async function () {
        let {
          formInline: {
            protocolValue,
            callbackVerifyCode
          },
          httpOption,
          httpsOption,
          saveResponseGroupId
        } = this;
        let urlOption = protocolValue === "http" ? httpOption : httpsOption;
        let callbackObj = urlOption.find(
          item => item.VerifyCode === callbackVerifyCode
        );
        let param = {
          Version: "2018-07-24",
          Module: "monitor",
          GroupId: saveResponseGroupId,
          UserAction: "bind",
          Url: this.httpVal + "://" + this.httpInput,
          VerifyCode: this.httpCode
        };
        this.axios.post(CM_CALLBACK_SAVE, param).then(res => {
          if (res.Response.Error === undefined) {} else {
            let ErrTips = {
              int64: "無效的回調url或內部ip,請輸入正確的url或ip"
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
      axiosUtils: function (res, func) {
        // func()
        if (res.info !== undefined) {
          this.$message({
            message: res.info,
            type: "error",
            showClose: true,
            duration: 2000
          });
          return;
        }
        if (
          res.Response === undefined ||
          (res.Response && res.Response.Error === undefined)
        ) {
          func();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      },
      // 回显
      echoDis: async function () {
        // this.receivingObjectLoad = true
        await this.describePolicyGroupInfo();
        if (this.groupInfo.ReceiverInfos) {
          let ReceiverInfos = this.groupInfo.ReceiverInfos[0];
          this.ReceiverInfos = ReceiverInfos;
          let {
            StartTime,
            EndTime,
            ReceiverType,
            ReceiverGroupList,
            ReceiverUserList,
            NotifyWay
          } = ReceiverInfos;
          if (ReceiverType === "user") {
            let params = {
              Type: "SubAccount",
              Version: "2019-01-16",
              Offset: 0,
              Limit: 1000
            };
            this.axios.post(LIST_SUBACCOUNTS, params).then(res => {
              this.axiosUtils(res, () => {
                let {
                  UserInfo
                } = res.Response;
                ReceiverUserList.forEach(item => {
                  let oneUserInfo = UserInfo.find(uItem => item === uItem.Uid);
                  this.receivingObjectData.push(oneUserInfo);
                });
                this.$refs.cam.setType(ReceiverType);
              });
            });
          } else if (ReceiverType) {
            ReceiverGroupList.forEach(item => {
              let params = {
                Version: "2019-01-16",
                GroupId: item
              };
              this.axios
                .post(CM_ALARM_RECEIVE_OBJECT_GetGroup, params)
                .then(res => {
                  this.axiosUtils(res, () => {
                    this.receivingObjectData.push(res.Response);
                  });
                });
            });
          }
          let notifyWay = NotifyWay.map(item => {
            if (item === "EMAIL") {
              return "郵件";
            } else if (item === "SMS") {
              return "簡訊";
            }
          });
          this.$refs.cam.setStartAndEndTime(StartTime, EndTime);
          this.$refs.cam.setNotifyWay(notifyWay);
        }
        this.receivingObjectLoad = false;
      },
      callbackEdit() {
        // 回調接口配置
        this.callbackInterface = true;
        let param = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        this.axios.post(CM_CALLBACK, param).then(res => {
          if (res.Response.Error === undefined) {
            this.httpCodes = res.Response.VerifyCode;
            this.httpCode = this.httpCodes;
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
      // 回調接口
      HttpHistroy() {
        this.httpOption = [];
        this.httpOption1 = [];
        let param = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
          if (res.Response.Error === undefined) {
            var list = res.Response.List;

            for (let i in list) {
              if (
                this.httpVal ===
                list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
              ) {
                this.httpOption.push(list[i]);
                this.httpOption1.push(list[i]);
              }
            }

            this.httpShow = true;
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
      HttpHistroyBlur() {
        this.isURL(this.httpVal + "://" + this.httpInput);
      },
      isURL(str) {
        if (str.indexOf(".") != -1) {
          let _str = str.split(".");
          if (_str[1].length >= 1) {
            this.codeSure = true;
          } else {
            this.$message({
              message: "請輸入正確的url",
              type: "error",
              showClose: true,
              duration: 0
            });
            this.codeSure = false;
          }
        }
      },
      leave() {
        this.httpShow = false;
      },
      HttpHistruyInput() {
        this.httpShow = true;
        this.httpOption = [];
        this.httpOption = this.httpOption1;
        var _arr = [];
        for (let i in this.httpOption) {
          //如果字符串中不包含目標字符會返回-1
          if (this.httpOption[i].Url.indexOf(this.httpInput) >= 0) {
            _arr.push(this.httpOption[i]);
          }
        }
        this.httpOption = _arr;
        if (this.httpVal == "http") {
          for (let i in this.httpOption2) {
            if (
              this.httpOption2[i].Url.substring(
                this.httpOption2[i].Url.lastIndexOf("/") + 1,
                this.httpOption2[i].Url.length
              ) === this.httpInput
            ) {
              this.HttpSelect(this.httpOption2[i]);
              return false;
            } else {
              this.httpCode = this.httpCodes;
            }
          }
        } else {
          for (let i in this.httpOption3) {
            if (
              this.httpOption3[i].Url.substring(
                this.httpOption3[i].Url.lastIndexOf("/") + 1,
                this.httpOption3[i].Url.length
              ) === this.httpInput
            ) {
              this.HttpSelect(this.httpOption3[i]);
              return false;
            } else {
              this.httpCode = this.httpCodes;
            }
          }
        }
      },
      HttpInit() {
        let param = {
          Version: "2018-07-24",
          Module: "monitor"
        };
        this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
          if (res.Response.Error === undefined) {
            let list = res.Response.List;

            for (let i in list) {
              if (
                "http" === list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
              ) {
                this.httpOption2.push(list[i]);
              }
              if (
                "https" === list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
              ) {
                this.httpOption3.push(list[i]);
              }
            }
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
      HttpTypeChange() {
        this.httpShow = false;
        if (this.httpVal == "http") {
          for (let i in this.httpOption2) {
            if (
              this.httpOption2[i].Url.substring(
                this.httpOption2[i].Url.lastIndexOf("/") + 1,
                this.httpOption2[i].Url.length
              ) === this.httpInput
            ) {
              this.HttpSelect(this.httpOption2[i]);
              return false;
            } else {
              this.httpCode = this.httpCodes;
            }
          }
        } else {
          for (let i in this.httpOption3) {
            if (
              this.httpOption3[i].Url.substring(
                this.httpOption3[i].Url.lastIndexOf("/") + 1,
                this.httpOption3[i].Url.length
              ) === this.httpInput
            ) {
              this.HttpSelect(this.httpOption3[i]);
              return false;
            } else {
              this.httpCode = this.httpCodes;
            }
          }
        }
      },
      HttpSelect(item) {
        this.httpInput = item.Url.substring(
          item.Url.lastIndexOf("/") + 1,
          item.Url.length
        );
        this.httpCode = item.VerifyCode;
        this.httpShow = false;
      },
      // 回調接口 保存
      CallBackSave(val) {
        if (val == 1) {
          if (!this.codeSure) {
            this.$message({
              message: "請輸入正確的url",
              type: "error",
              showClose: true,
              duration: 0
            });
            return false;
          }
        }
        let param = {
          Version: "2018-07-24",
          Module: "monitor",
          GroupId: this.$route.query.groupId
        };
        if (val == 1) {
          param["UserAction"] = "bind";
          param["Url"] = this.httpVal + "://" + this.httpInput;
          param["VerifyCode"] = this.httpCode;
        } else {
          param["UserAction"] = "unbind";
        }
        this.axios.post(CM_CALLBACK_SAVE, param).then(res => {
          if (res.Response.Error === undefined) {
            this.callbackInterface = false;
            this.DetailsInit();
          } else {
            let ErrTips = {
              int64: "無效的回調url或內部ip,請輸入正確的url或ip"
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
      }
    },
    created: function () {
      if (this.$route.query.viewName && this.$route.query.instanceGroupId) {
        this.radio = "3";
        this.describeInstanceGroupList();
      }
      let {
        groupId,
        id
      } = this.$route.query;
      this.groupId = groupId;
      if (groupId !== 0 && groupId !== undefined) {
        this.echoDis();
      }
      if (id) {
        let {
          ProjectId,
          InstanceId,
          EventId
        } = JSON.parse(id);
        this.fromEventCenterParam = {
          ProjectId: parseInt(ProjectId),
          InstanceId,
          EventId
        };
        this.isFromEventCenterInit = true;
      }
      this.getProjectsList();
      this.callbackEdit();
      this.httpHistroy();
      this.HttpInit();
    },
    mounted: function () {}
  };

</script>
<style lang="scss" scoped>
  .w200 {
    width: 200px;
  }

  .w420 {
    width: 420px;
  }

  .create-main {
    padding: 20px 35px;

    .box {
      width: 100%;
      height: 100%;
      color: #888;
      background: white;
      padding: 20px;
      font-size: 12px;
      box-shadow: 1px 1px 5px #cccccc;
    }
  }

  .create-form {

    >.el-form-item__label,
    >.el-form-item__content {
      font-size: 12px;
      color: #888;
    }
  }

  .indication-alarm>* {
    margin-right: 5px;
  }

  .callback-interface-box {
    margin-top: 14px;

    ::v-deep .el-select {
      width: 100px;
    }

    .input-http {
      width: 78%;
      margin-left: 10px;
    }

    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
    }

    .text-http {
      position: relative;

      ul {
        position: absolute;
        z-index: 1000;
        left: 110px;
        width: 78%;
        background: #fff;
        top: 40px;
        border: 1px solid #ddd;

        li {
          padding: 5px;
          width: 100%;
          box-sizing: border-box;
          cursor: pointer;

          &:hover {
            background: #f2f2f2;
          }

          span {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }

    &>p {
      color: #888;
      font-size: 12px;
      line-height: 22px;
      margin-top: 10px;
    }
  }

</style>
