<template>
  <div class="create-wrap">
    <Header title="新增策略" :backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <el-form class="create-form" :model="formInline" ref="form" label-position='left' label-width="70px" size="mini">
          <el-form-item label="策略名稱" prop='strategy_name' :rules="strategyNameValidator">
            <el-input class="w200" v-model="formInline.strategy_name" placeholder="1-20個中英文字符或下劃線"></el-input>
          </el-form-item>
          <el-form-item label="備注" prop="textarea">
            <el-input class="w420" :autosize="{ minRows: 5, maxRows: 2 }" type="textarea" placeholder="1-100個中英文字符或下劃線" v-model="formInline.textarea" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="策略類型">
            <product-type-cpt @PassData="passData" :searchParam="searchParam" :projectId="formInline.projectId" productValue="cvm_device" @loading="(e)=>loading=e"/>
          </el-form-item>
          <el-form-item label="所屬項目" prop="projectName">
            <el-select class="w200" v-model="formInline.projectId">
              <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.projectName" :value="item.projectId" label-width="40px"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警對象">
            <p>
              <el-radio v-model="radio" label="1">全部對象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="2">選擇部分對象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="3">選擇實例組</el-radio>
              <el-button type="text" size="mini" style="position: relative;margin-left: 20px" @click="$router.push({path: '/Casegrouping'})">新建實例組</el-button>
            </p>
          </el-form-item>
          <!-- 告警對象-》選擇部分對象 -->
          <div style="margin-bottom: 18px" v-show="radio==='2'">
            <div style="margin-left: 70px">
                <cam-transfer-cpt v-loading="loading" :productData="product" isShowRight @projectId="projectIds" @searchParam="searchParams" @multipleSelection="selectDatas"></cam-transfer-cpt>
            </div>
          </div>
          <!-- 告警對象-》 選擇實例組 -->
          <div style="margin-bottom: 18px" v-show="radio==='3'">
            <div style="margin-left: 70px">
              <el-form-item label-width="0px">
                <el-select v-model="formInline.instanceGroupId" style="width:150px;">
                  <el-option v-for="(item, index) in formInline.instanceGroup" :key="index" :label="item.GroupName" :value="item.InstanceGroupId" label-width="40px"></el-option>
                </el-select>
                <el-button type="text" size="mini" style="width: 50px" @click="describeInstanceGroupList">刷新</el-button>
              </el-form-item>
            </div>
          </div>
          <!-- 觸發條件 -->
          <div style="margin-bottom: 18px">
            <label style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">觸發條件</label>
            <div style="margin-left: 70px" v-loading="loading">
              <!-- 觸發條件模板 -->
              <div style="background-color: #f2f2f2;padding: 20px">
                <el-radio v-model="radioChufa" label="1">觸發條件模板</el-radio>
                <el-button type="text" size="mini" style="margin-left: 20px" @click="$router.push({path: '/Template'})">新增觸發條件模板</el-button>
                <div v-show="radioChufa === '1'" style="padding: 10px">
                  <el-form-item label-width="0px" style="margin-bottom: 0px">
                    <el-select v-model="formInline.conditionsTemplateId" style="width:150px;" placeholder="當前策略下沒有觸發條件模板"
                               @change="conditionTemplateChange" :disabled="!formInline.conditionsTemplateId">
                      <el-option v-for="(item, index) in formInline.conditionsTemplate" :key="index" :label="item.GroupName" :value="item.GroupID" label-width="40px"></el-option>
                    </el-select>
                    <el-button type="text" size="mini" style="margin-left: 20px" @click="describeConditionsTemplateList">刷新</el-button>
                  </el-form-item>
                  <div v-show="formInline.conditionsTemplateId">
                    <p style="line-height: 28px"><el-checkbox disabled>指標告警</el-checkbox></p>
                    <div style="padding-left: 21px">
                      <el-form-item label-width="0px">
                        <span>滿足</span>
                        <el-select v-model="formInline.triggerCondition.IsUnionRule" style="margin: 0px 5px" disabled>
                          <el-option v-for="(item, index) in condition" :key="index" :label="item.label" :value="item.id" label-width="40px"></el-option>
                        </el-select>
                        <span>條件時，觸發告警</span>
                      </el-form-item>
                      <div v-for="cItem in formInline.triggerCondition.Conditions" :key="cItem.RuleID">
                        <div class="indication-alarm">
                          <span>if</span>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.MetricID" style="width:150px;" disabled>
                              <el-option v-for="(item, index) in product.Metrics" :key="index" :label="item.MetricShowName" :value="item.MetricId"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.Period" style="width:150px;" disabled>
                              <el-option v-for="(item, index) in tongjiZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.CalcType" style="width:80px;" disabled>
                              <el-option v-for="(item, index) in symbolList" :key="index" :label="item.label" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-input style="vertical-align: baseline;width: 140px" placeholder="指標"
                                      value="0" min="0" max="100" type="number" v-model="cItem.CalcValue" disabled>
                              <template slot="append">{{cItem.Unit}}</template>
                            </el-input>
                          </el-form-item>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.ContinueTime" style="width:120px;" disabled>
                              <el-option v-for="(item, index) in continuePeriod" :key="index" :label="item.label" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <template v-if="formInline.triggerCondition.IsUnionRule === 0">
                            <span>then</span>
                            <el-form-item label-width="0px" style="display: inline-block">
                              <el-select v-model="cItem.AlarmNotifyPeriod" style="width:150px;" disabled>
                                <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                            <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                          </template>
                        </div>
                      </div>
                      <div v-show="formInline.triggerCondition.IsUnionRule === 1">
                        <span>then</span>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="formInline.triggerCondition.AlarmNotifyPeriod" style="width:150px;" disabled>
                            <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                      </div>
                    </div>
                    <!-- 事件告警 -->
                    <!--                    <p style="line-height: 28px">-->
                    <!--                      <el-checkbox disabled>事件告警</el-checkbox>-->
                    <!--                      <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>-->
                    <!--                    </p>-->
                    <!--                    <div style="padding-left: 21px">-->
                    <!--                      <el-form-item label-width="0px">-->
                    <!--                        <el-select v-model="formInline.projectName" style="width:180px;">-->
                    <!--                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>-->
                    <!--                        </el-select>-->
                    <!--                      </el-form-item>-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <!-- 配置觸發條件 -->
              <div style="background-color: #f2f2f2;padding: 20px;margin-top: 10px;">
                <el-radio v-model="radioChufa" label="2">配置觸發條件</el-radio>
                <!--                <div class="tip">請至少配置1項觸發條件</div>-->
                <div v-show="radioChufa === '2'" style="padding: 10px">
                  <p style="line-height: 28px"><el-checkbox checked disabled>指標告警</el-checkbox></p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <span>滿足</span>
                      <el-select v-model="formInline.configTrigger.IsUnionRule" style="margin: 0px 5px">
                        <el-option v-for="(item, index) in condition" :key="index" :label="item.label" :value="item.id" label-width="40px"></el-option>
                      </el-select>
                      <span>條件時，觸發告警</span>
                    </el-form-item>
                    <div v-for="(cItem, cIndex) in formInline.configTrigger.Conditions" :key="cItem.key">
                      <div class="indication-alarm">
                        <span>if</span>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.MetricID" style="width:150px;">
                            <el-option v-for="(item, index) in product.Metrics" :key="index" :label="item.MetricShowName" :value="item.MetricId"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.Period" style="width:150px;">
                            <el-option v-for="(item, index) in tongjiZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.CalcType" style="width:80px;">
                            <el-option v-for="(item, index) in symbolList" :key="index" :label="item.label" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-input style="vertical-align: baseline;width: 140px" placeholder="指標" value="0" min="0" max="100" type="number" v-model.number="cItem.CalcValue">
                            <template slot="append">{{cItem.Unit}}</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block">
                          <el-select v-model="cItem.ContinueTime" style="width:120px;">
                            <el-option v-for="(item, index) in continuePeriod" :key="index" :label="item.label" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                        <template v-if="formInline.configTrigger.IsUnionRule === 0">
                          <span>then</span>
                          <el-form-item label-width="0px" style="display: inline-block">
                            <el-select v-model="cItem.AlarmNotifyPeriod" style="width:150px;">
                              <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                          <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="triggerConditionDelConditions(formInline.configTrigger.Conditions, cIndex)"
                             v-if="formInline.configTrigger.Conditions.length > 1"></i>
                        </template>
                      </div>
                    </div>
                    <div v-show="formInline.configTrigger.IsUnionRule === 1">
                      <span>then</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.configTrigger.AlarmNotifyPeriod" style="width:150px;">
                          <el-option v-for="(item, index) in jinggaoZQ" :key="index" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <el-button type="text" size="mini" @click="triggerConditionAddConditions">添加</el-button>
                  </div>
                  <!-- 事件告警 -->
                  <!--<p style="line-height: 28px"><el-checkbox>事件告警</el-checkbox><i class="el-icon-info" style="color:#888; margin:0 5px;"></i></p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <el-select v-model="formInline.projectName" style="width:180px;">
                        <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                      </el-select>
                      <i class="el-icon-error" style="color:#888; margin:0 5px;"></i>
                    </el-form-item>
                    <el-button type="text" size="mini">添加</el-button>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
          <!-- 告警渠道 -->
          <div style="margin-bottom: 18px">
            <label style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">告警渠道</label>
            <div style="margin-left: 70px;background-color: #f2f2f2;">
              <Cam @camClick="camFun"></Cam>
            </div>
          </div>
          <!-- 接口回調 -->
          <div style="margin-bottom: 18px">
            <div style="width: 70px;">
              <label style="vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">接口回調</label>
              <!--<p>（選填）</p>-->
            </div>
            <div style="margin-left: 70px">
              <el-form-item style="display: inline-block" label-width="0px">
                <el-select v-model="formInline.protocolValue" style="display: inline-block" @change="formInline.callbackVerifyCode = ''">
                  <el-option v-for="(item, index) in protocol" :key="index" :label="item" :value="item" label-width="40px"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="display: inline-block;margin-left: 10px" label-width="0px">
                <el-select filterable v-model="formInline.callbackVerifyCode" style="width: 300px">
                  <el-option v-for="item in formInline.protocolValue === 'http'?httpOption:httpsOption"
                             :key="item.VerifyCode" :label="item.website" :value="item.VerifyCode">
                    <span>{{item.website}}</span>
                    <span style="margin-left: 10px;color: #999999">{{item.ValidFlag===2?'請求超時': ''}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <p style="line-height: 28px">填寫公網可訪問到的url作爲回調接口地址(域名或IP[:端口][/path])，雲監控將及時把告警信息推送到該地址。</p>
              <div style="margin-top: 10px;background-color: #fff4e3;color: #c07400;border: 1px solid #ffd18b;padding: 10px 20px;font-size: 12px;line-height: 28px;">
                <p>回調域名通過驗證後生效，請于Response Body中返回以下code。<i class="el-icon-info" style="margin:0 5px;color: #c07400;"></i></p>
                <p style="margin: 10px 0;font-size: 16px;font-weight: 700;">{{formInline.callbackVerifyCode===''? httpCodes : formInline.callbackVerifyCode}}</p>
              </div>
            </div>
          </div>
        </el-form>
        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import Header from './Head'
import Cam from '@/views/CM/CM_assembly/Cam'
import { ErrorTips } from '@/components/ErrorTips'
import { ALL_PROJECT, CM_GROUPING_LIST, CM_ALARM_OBJECT_LIST_EDIT, CM_ALARM_RECEIVE_OBJECT_RELIEVE, CM_CALLBACK_SAVE } from '@/constants'
import { GET_CONDITIONSTEMPLATELIST } from '@/constants/CM-yhs.js'
import { CM_CALLBACK, CM_CALLBACK_HISTORY, CREATE_POLICYGROUP } from '@/constants/CM-wxy.js'
import CamTransferCpt from '@/views/CM/CM_assembly/CamTransferCpt'
import ProductTypeCpt from '@/views/CM/CM_assembly/product_type'

export default {
  components: {
    ProductTypeCpt,
    CamTransferCpt,
    Header,
    Cam
  },
  data: function () {
    return {
      strategyNameValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('策略名稱不能爲空'))
          } else if (value.length > 20) {
            callback(new Error('策略名稱不能超過20個字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }],
      radio: '2', // 选择告警对象类型
      radioChufa: '2', // 触发条件单选
      options: [],
      formInline: {
        protocolValue: 'http', // 接口回调
        callbackVerifyCode: '',
        strategy_name: '', // 策略名称
        textarea: '', // 备注
        strategy: '雲伺服器-基礎監控',
        strategy_kind: [{
          value: 0,
          name: '雲伺服器-基礎監控'
        }], // 策略類型
        alarm: '', // 策略類型
        project: [{ projectName: '默認項目', projectId: 0 }],
        projectId: 0,
        instanceGroup: [],
        instanceGroupId: '',
        conditionsTemplate: [], // 触发条件模板下拉数组
        conditionsTemplateId: '',
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
        }
      },
      condition: [{ id: 0, label: '任意' }, { id: 1, label: '所有' }],
      tongjiZQ: [{ id: 60, label: '統計周期1分鍾' }, { id: 300, label: '統計周期5分鍾' }],
      symbolList: [
        { id: '1', label: '>' },
        { id: '2', label: '>=' },
        { id: '3', label: '<' },
        { id: '4', label: '<=' },
        { id: '5', label: '=' },
        { id: '6', label: '!=' }
      ], // 符號數組
      continuePeriod: [
        { id: 1, label: '持續1個周期' },
        { id: 2, label: '持續2個周期' },
        { id: 3, label: '持續3個周期' },
        { id: 4, label: '持續4個周期' },
        { id: 5, label: '持續5個周期' }
      ], // 持續周期
      jinggaoZQ: [
        { label: '不重複', id: 0 },
        { label: '每5分鍾警告壹次', id: 300 },
        { label: '每10分鍾警告壹次', id: 600 },
        { label: '每15分鍾警告壹次', id: 900 },
        { label: '每30分鍾警告壹次', id: 1800 },
        { label: '每1小時警告壹次', id: 3600 },
        { label: '每2小時警告壹次', id: 7200 },
        { label: '每3小時警告壹次', id: 10800 },
        { label: '每6小時警告壹次', id: 21600 },
        { label: '每12小時警告壹次', id: 43200 },
        { label: '每1天警告壹次', id: 86400 },
        { label: '周期指數遞增', id: 1 }
      ], // 警告周期
      cam: {}, // cam組件的值
      projectId: 0,
      searchParam: {},
      product: {},
      loading: false,
      httpCodes: '', // 回調的隨機碼
      protocol: ['http', 'https'],
      httpOption: [],
      httpsOption: [],
      saveResponseGroupId: '', // 新建響應回的GroupId
      multipleSelection: []
    }
  },
  watch: {
    'formInline.configTrigger.Conditions': {
      handler: function (val) {
        val.forEach((item, index) => {
          let tempObj = this.product.Metrics.find(pmItem => {
            return pmItem.MetricId === item.MetricID
          })
          if (tempObj) {
            this.formInline.configTrigger.Conditions[index].Unit = tempObj.MetricUnit
          }
        })
      },
      deep: true
    }
  },
  methods: {
    selectDatas: function (val) {
      this.multipleSelection = val
    },
    searchParams: function (val) {
      this.searchParam = val
    },
    projectIds: function (val) {
      this.projectId = val
    },
    passData: async function (val) {
      this.product = { ...val, projectId: this.formInline.projectId }
      await this.initRequest()
      this.loading = false
    },
    triggerConditionDelConditions: function (arr, index) {
      arr.splice(index, 1)
    },
    triggerConditionAddConditions: function () {
      let { Metrics } = this.product
      for (let i = 0; i < Metrics.length; i++) {
        let exist = this.formInline.configTrigger.Conditions.some(item => {
          return item.MetricID === Metrics[i].MetricId
        })
        if (!exist) {
          this.formInline.configTrigger.Conditions.push({
            key: Date.now(),
            MetricID: Metrics[i].MetricId,
            Period: 60,
            CalcType: '1',
            CalcValue: 0,
            Unit: '',
            ContinueTime: 1,
            AlarmNotifyPeriod: 86400
          })
          return
        }
      }
      this.formInline.configTrigger.Conditions.push({
        key: Date.now(),
        MetricID: Metrics[0].MetricId,
        Period: 60,
        CalcType: '1',
        CalcValue: 0,
        Unit: '',
        ContinueTime: 1,
        AlarmNotifyPeriod: 86400
      })
    },
    initRequest: async function () {
      await Promise.all([
        this.describeConditionsTemplateList()
      ]).then(() => {
        this.describeInstanceGroupList()
        this.formInline.configTrigger.Conditions = []
        this.triggerConditionAddConditions()
        if (this.formInline.conditionsTemplate.length > 0) {
          this.conditionTemplateChange(this.formInline.conditionsTemplate[0].GroupID)
        } else {
          this.conditionTemplateChange('')
        }
      })
    },
    callbackEdit: async function () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor'
      }
      await this.axios.post(CM_CALLBACK, params).then(res => {
        this.axiosUtils(res, () => {
          this.httpCodes = res.Response.VerifyCode
        })
      })
    },
    httpHistroy: function () {
      this.httpOption = []
      this.httpsOption = []
      let param = {
        Version: '2018-07-24',
        Module: 'monitor'
      }
      this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
        this.axiosUtils(res, () => {
          let { List } = res.Response
          List.forEach(item => {
            let [protocol, website] = item.Url.split('://')
            item.website = website
            item.protocol = protocol
            if (protocol === 'http') {
              this.httpOption.push(item)
            } else {
              this.httpsOption.push(item)
            }
          })
        })
      })
    },
    // 條件觸發模板 更改
    conditionTemplateChange: function (groupID) {
      if (groupID !== '') {
        let oneConditionsTemplate = this.formInline.conditionsTemplate.find(item => {
          return item.GroupID === groupID
        })
        let { IsUnionRule, Conditions } = oneConditionsTemplate
        Conditions.map(item => {
          let { ContinueTime, Period } = item
          if (!(ContinueTime > -1 && ContinueTime < 6)) {
            item.ContinueTime = ContinueTime / Period
            item.ContinueTime = item.ContinueTime !== 0 ? item.ContinueTime : ''
          }
          return item
        })
        if (IsUnionRule === 1 && Conditions.length > 0) {
          oneConditionsTemplate.AlarmNotifyPeriod = Conditions[0].AlarmNotifyPeriod
        }
        this.formInline.triggerCondition = oneConditionsTemplate
      } else {
        this.formInline.triggerCondition = {
          IsUnionRule: '',
          Conditions: [],
          EventConditions: []
        }
      }
    },
    // 獲取 項目 列表
    getProjectsList: async function () {
      this.axios.get(ALL_PROJECT).then(res => {
        this.axiosUtils(res, () => {
          this.formInline.project = [{ projectName: '默認項目', projectId: 0 }, ...res.data]
        })
      })
    },
    // 獲取 選擇實例組 列表
    describeInstanceGroupList: async function () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        Limit: 100,
        Offset: 0,
        ViewName: this.product.productValue
      }
      await this.axios.post(CM_GROUPING_LIST, params).then(res => {
        this.axiosUtils(res, () => {
          this.formInline.instanceGroup = res.Response.InstanceGroupList
          if (res.Response.InstanceGroupList.length > 0) this.formInline.instanceGroupId = res.Response.InstanceGroupList[0].InstanceGroupId
        })
      })
    },
    // 獲取 觸發條件模板 列表
    describeConditionsTemplateList: async function () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        ViewName: this.product.productValue
      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
        this.axiosUtils(res, () => {
          this.formInline.conditionsTemplate = res.Response.TemplateGroupList
          if (res.Response.TemplateGroupList.length > 0) {
            this.formInline.conditionsTemplateId = res.Response.TemplateGroupList[0].GroupID
          } else {
            this.formInline.conditionsTemplateId = ''
          }
        })
      })
    },
    camFun (data) {
      this.cam = data
    },
    // 保存
    save: async function () {
      let { multipleSelection, radio, cam } = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (radio === '2' && multipleSelection.length <= 0) {
            this.$message({
              message: '請選擇綁定對象',
              type: 'error',
              showClose: true,
              duration: 0
            })
            return
          }
          if (JSON.stringify(cam) === '{}' || (cam.selectUserGroup.length <= 0 && cam.selectUserList <= 0)) {
            this.$message({
              message: '請選擇接收對象',
              type: 'error',
              showClose: true,
              duration: 0
            })
            return
          } else if (cam.channel.length <= 0) {
            this.$message({
              message: '請選擇接收渠道 ',
              type: 'error',
              showClose: true,
              duration: 0
            })
            return
          }
          this.saveSubmit()
        } else {
          console.error('有驗證錯誤')
          return false
        }
      })
    },
    saveSubmit: async function () {
      let { configTrigger, triggerCondition, textarea } = this.formInline
      let params = {
        Version: '2018-07-24',
        Region: localStorage.getItem('regionv2'),
        GroupName: this.formInline.strategy_name,
        Module: 'monitor',
        ViewName: this.product.productValue,
        ProjectId: this.formInline.projectId,
        IsShielded: 0
      }
      if (textarea !== '') params.Remark = textarea
      if (this.radioChufa === '1') {
        let { Conditions } = triggerCondition
        Conditions.forEach((item, index) => {
          params[`Conditions.${index}.MetricId`] = item.MetricID
          params[`Conditions.${index}.AlarmNotifyType`] = item.AlarmNotifyType
          params[`Conditions.${index}.AlarmNotifyPeriod`] = item.AlarmNotifyPeriod
          params[`Conditions.${index}.CalcType`] = item.CalcType
          params[`Conditions.${index}.CalcValue`] = item.CalcValue
          params[`Conditions.${index}.CalcPeriod`] = item.Period
          params[`Conditions.${index}.ContinuePeriod`] = item.ContinueTime
          params[`Conditions.${index}.RuleId`] = item.RuleID
        })
        params.ConditionTempGroupId = this.formInline.conditionsTemplateId
      } else {
        let { Conditions } = configTrigger
        // params.IsUnionRule = configTrigger.IsUnionRule
        Conditions.forEach((item, index) => {
          params[`Conditions.${index}.MetricId`] = item.MetricID
          // todo 有問題，不知道給後台傳的是什麽值，文檔上是 0.連續告警 1.指數告警
          // params[`Conditions.${index}.AlarmNotifyType`] = item.AlarmNotifyType
          params[`Conditions.${index}.AlarmNotifyType`] = 0
          if (configTrigger.IsUnionRule === 0) {
            params[`Conditions.${index}.AlarmNotifyPeriod`] = item.AlarmNotifyPeriod
            params.IsUnionRule = 0
          } else {
            params[`Conditions.${index}.AlarmNotifyPeriod`] = configTrigger.AlarmNotifyPeriod
            params.IsUnionRule = 1
          }
          params[`Conditions.${index}.CalcType`] = item.CalcType
          params[`Conditions.${index}.CalcValue`] = item.CalcValue
          params[`Conditions.${index}.CalcPeriod`] = item.Period
          params[`Conditions.${index}.ContinuePeriod`] = item.ContinueTime
          // params[`Conditions.${index}.RuleId`] = item.RuleID
        })
      }
      await this.axios.post(CREATE_POLICYGROUP, params).then(res => {
        this.axiosUtils(res, () => {
          this.saveResponseGroupId = res.Response.GroupId
          Promise.all([this.saveOther()]).then(()=>{
            this.$message({
              message: '創建告警策略成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            this.$router.replace({
              path: '/strategy'
            })
          })
        })
      })
    },
    saveOther: async function () {
      this.bandingPolicyObject()
      this.updateAlarmReceivers()
      if (this.formInline.callbackVerifyCode !== '') {
        this.modifyAlarmCallback()
      }
    },
    bandingPolicyObject: async function () {
      let {
        radio,
        multipleSelection,
        product: { productValue, Date },
        formInline: { instanceGroupId }
      } = this
      let params = {
        GroupId: this.saveResponseGroupId,
        Version: '2018-07-24',
        Module: 'monitor'
      }
      if (radio !== '3') {
        if (radio === '1') multipleSelection = Date
        multipleSelection.forEach((item, index) => {
          params[`Dimensions.${index}.Region`] = 'tpe'
          if (productValue === 'cvm_device') {
            params[`Dimensions.${index}.Dimensions`] = { unInstanceId: item.InstanceId }
            params[`Dimensions.${index}.EventDimensions`] = { uuid: item.Uuid }
          } else if (productValue === 'BS') {
            params[`InstanceList.${index}.Dimensions`] = { diskid: item.DiskId }
          } else if (productValue === 'vpn_tunnel') {
            params[`Dimensions.${index}.Dimensions`] = { uniqVpnconnId: item.VpnConnectionId }
          } else if (productValue === 'VPN_GW') {
            params[`Dimensions.${index}.Dimensions`] = { vip: item.PublicIpAddress }
            params[`Dimensions.${index}.EventDimensions`] = { VpnGatewayId: item.VpnGatewayId }
          } else if (productValue === 'vpn_tunnel') {
            params[`Dimensions.${index}.Dimensions`] = { uniqVpnconnId: item.VpnConnectionId }
          } else if (productValue === 'nat_tc_stat') {
            params[`Dimensions.${index}.Dimensions`] = { uniq_nat_id: item.NatGatewayId }
            params[`Dimensions.${index}.EventDimensions`] = { instanceId: item.NatGatewayId }
          } else if (productValue === 'DC_GW') {
            params[`Dimensions.${index}.Dimensions`] = { directconnectgatewayid: item.DirectConnectGatewayId }
            params[`Dimensions.${index}.EventDimensions`] = { instanceId: item.DirectConnectGatewayId }
          } else if (productValue === 'EIP') {
            params[`Dimensions.${index}.Dimensions`] = { vip: item.AddressIp }
          } else if (productValue === 'cdb_detail') {
            params[`Dimensions.${index}.Dimensions`] = { uInstanceId: item.InstanceId }
            params[`Dimensions.${index}.EventDimensions`] = { InstanceId: item.InstanceId }
          } else if (productValue === 'REDIS-CLUSTER') {
            params[`Dimensions.${index}.Dimensions`] = { instanceid: item.InstanceId }
            params[`Dimensions.${index}.EventDimensions`] = { instanceid: item.InstanceId }
          } else if (productValue === 'dcchannel') {
            params[`Dimensions.${index}.Dimensions`] = { directconnecttunnelid: item.DirectConnectTunnelId }
          } else if (productValue === 'dcline') {
            params[`Dimensions.${index}.Dimensions`] = { directconnectid: item.DirectConnectId }
          } else if (productValue === 'COS') {
            params[`Dimensions.${index}.Dimensions`] = { bucket: item.Name }
          }
        })
      } else {
        params['InstanceGroupId'] = instanceGroupId
      }
      await this.axios.post(CM_ALARM_OBJECT_LIST_EDIT, params).then(res => {
        this.axiosUtils(res, () => {
          console.log('success')
        })
      })
    },
    updateAlarmReceivers: async function () {
      let { selectUserGroup, channel, selectType, selectUserList } = this.cam
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.saveResponseGroupId
      }
      if (selectUserGroup.length > 0) {
        params['ReceiverInfos.0.StartTime'] = this.cam.time[0]
        params['ReceiverInfos.0.EndTime'] = this.cam.time[1]
        for (let i in channel) {
          if (channel[i] === '郵件') {
            params['ReceiverInfos.0.NotifyWay.' + i] = 'EMAIL'
          } else if (channel[i] === '簡訊') {
            params['ReceiverInfos.0.NotifyWay.' + i] = 'SMS'
          }
        }
        /* params['ReceiverInfos.0.PersonInterval'] = this.ReceiverInfos.PersonInterval
        params['ReceiverInfos.0.RoundNumber'] = this.ReceiverInfos.RoundNumber
        params['ReceiverInfos.0.RoundInterval'] = this.ReceiverInfos.RoundInterval
        for (let i in this.ReceiverInfos.RecoverNotify) {
          params['ReceiverInfos.0.RoundInterval.' + i] = this.ReceiverInfos.RecoverNotify[i]
        }
        params['ReceiverInfos.0.NeedSendNotice'] = this.ReceiverInfos.NeedSendNotice */

        if (selectType === 'group' || selectType === '') {
          params['ReceiverInfos.0.ReceiverType'] = 'group'
          for (let i in this.cam.selectUserGroup) {
            params['ReceiverInfos.0.ReceiverGroupList.' + i] = selectUserGroup[i].GroupId
          }
        }
      }
      if (selectUserList.length > 0) {
        params['ReceiverInfos.0.StartTime'] = this.cam.time[0]
        params['ReceiverInfos.0.EndTime'] = this.cam.time[1]
        for (let i in channel) {
          if (channel[i] === '郵件') {
            params['ReceiverInfos.0.NotifyWay.' + i] = 'EMAIL'
          } else if (channel[i] === '簡訊') {
            params['ReceiverInfos.0.NotifyWay.' + i] = 'SMS'
          }
        }
        if (selectType === 'user') {
          params['ReceiverInfos.0.ReceiverType'] = 'user'
          for (let i in selectUserList) {
            params['ReceiverInfos.0.ReceiverUserList.' + i] = selectUserList[i].Uid
          }
        }
      }
      await this.axios.post(CM_ALARM_RECEIVE_OBJECT_RELIEVE, params).then(res => {
        this.axiosUtils(res, () => {
          console.log(res)
        })
      })
    },
    modifyAlarmCallback: async function () {
      let { formInline: { protocolValue, callbackVerifyCode }, httpOption, httpsOption, saveResponseGroupId } = this
      let urlOption = protocolValue === 'http' ? httpOption : httpsOption
      let callbackObj = urlOption.find(item => item.VerifyCode === callbackVerifyCode)
      let param = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: saveResponseGroupId,
        UserAction: 'bind',
        Url: callbackObj.Url,
        VerifyCode: callbackVerifyCode
      }
      this.axios.post(CM_CALLBACK_SAVE, param).then(res => {
        this.axiosUtils(res, () => {
          console.log(res)
        })
      })
    },
    axiosUtils: function (res, func) {
      // func()
      if (res.info !== undefined) {
        this.$message({
          message: res.info,
          type: 'error',
          showClose: true,
          duration: 2000
        })
        return
      }
      if (res.Response === undefined || (res.Response && res.Response.Error === undefined)) {
        func()
      } else {
        let ErrTips = {}
        let ErrOr = Object.assign(ErrorTips, ErrTips)
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: 'error',
          showClose: true,
          duration: 2000
        })
      }
    }
  },
  created: function () {
    this.getProjectsList()
    this.callbackEdit()
    this.httpHistroy()
  },
  mounted: function () {
  }
}
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
    >>>.el-form-item__label,
    >>>.el-form-item__content {
      font-size: 12px;
      color: #888;
    }
  }
  .indication-alarm > * {
    margin-right: 5px;
  }
</style>
