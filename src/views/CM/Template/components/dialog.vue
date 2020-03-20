<template>
  <div class="dialog">
     <!-- @open="$emit('open')" -->
    <el-dialog title="新建" :visible.sync="show" @open="$emit('open')" @close="$emit('close')">
      <el-form :model="formInline" :rules="rules" ref="form">
        <p class="rowCont">
          <span>策略名称</span>
          <el-form-item style="display:inline-block" prop="strategy_name">
            <!-- v-model="formInline.strategy_name" -->
            <el-input
              style="width:330px;margin:0"
              maxlength="20"
              v-model="formInline.strategy_name"
              placeholder="1-20个中英文字符或下划线"
            ></el-input>
          </el-form-item>
        </p>
        <p class="rowCont">
          <span style="vertical-align:top">备注</span>
          <el-form-item style="display:inline-block" prop="textareas">
            <!-- v-model="formInline.textareas" -->
            <el-input
              style="width:330px;"
              :autosize="{ minRows: 5, maxRows: 2}"
              type="textarea"
              placeholder="1-100个中英文字符或下划线"
              v-model="formInline.textareas"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </p>
      </el-form>
      <p class="rowCont" style="display: flex;margin-bottom:20px">
        <span>策略类型</span>
        <product-type-cpt v-on:PassData="passData" :projectId='projectId' :searchParam='searchParam'
        :productValue='productValue'/>
        <!-- <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type> -->
        <!-- <el-checkbox v-model="checkedUse" style="margin-left:20px;">
          使用预置触发条件
          <el-popover trigger="hover" placement="top" content="根据系统预先设定的模版，自动设置对应云产品的告警策略常用触发条件。">
            <i class="el-icon-info" slot="reference"></i>
          </el-popover>
        </el-checkbox> -->
      </p>
      <div class="rowCont cont">
        <span>触发条件</span>
        <div>
          <div>
            <p>
              <el-checkbox v-model="checkedZhibiao" :checked="checkedZhibiao" @change="isDisabledZB()">指标告警</el-checkbox>
            </p>
            <div class="color">
              <p>
                <span style="display:inline">满足</span>
                <el-select :disabled="isDisabled" v-model="metting" style="width:90px;margin:0 5px;">
                  <el-option
                    v-for="(item,index) in meetConditions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <span style="display:inline">条件时，触发告警</span>
              </p>
              <!-- 在这里进行便利，添加 -->
              <ul>
                  <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(it,i) in indexAry" :key="i">
                  <p>
                    if&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:150px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:150px;">
                      <el-option
                        v-for="(item,index) in zhibiaoType"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:130px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.Period" style="width:130px;">
                      <el-option
                        v-for="(item,index) in tongjiZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:60px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.CalcType" style="width:60px;">
                      <el-option
                        v-for="(item,index) in SymbolList"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                     <!-- placeholder="指标" -->
                    <input :disabled="isDisabled" v-model="it.CalcValue" min="0" max="100" type="number"
                      style="height: 30px;line-height: 30px;padding:0 10px;width:85px;border: 1px solid #dcdfe6;"/>
                    <b
                      style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                    >%</b>
                    &nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:110px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.ContinuePeriod" style="width:110px;">
                      <el-option
                        v-for="(item,index) in continuePeriod"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    then&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:150px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.alarm" style="width:150px;">
                      <el-option
                        v-for="(item,index) in jinggaoZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <el-popover placement="top" trigger="hover" width="300" style="width:22px;height:22px">
                      <div>
                        <p style="font-size:12px">重复通知：可以设置告警发生24小时内重复发送通知；超过24小时，每天告警一次，超过72小时，不再发送告警通知。</p>
                        <p style="font-size:12px">周期指数递增通知: 告警持续时长到达告警统计周期的1，2，4，8，16，32...倍时发送告警通知</p>
                      </div>
                      <i slot="reference" class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                    </el-popover>
                    <!-- <i class="el-icon-info" style="color:#888; margin:0 5px;"></i> -->
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;"
                  @click="delZhibiao(it)" v-if="indexAry.length>1"></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
              </ul>
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
        <el-button type="primary" @click="save('form')">保 存</el-button>
        <el-button @click="show=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import GroupingType from '@/components/GroupingType'
import ProductTypeCpt from '@/views/CM/CM_assembly/product_type'
// import type from '@/views/CM/CM_assembly/product_type'
import { NEWBUILD_TEMPLATE } from '@/constants/CM-yhs.js'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  data () {
    return {
      isChected: true, // 多选框是否选中
      isDisabled: false, // 指标告警是否禁用
      isDisGJ: false, // 事件告警是否禁用
      backShow: 'true',
      strategy_name: '', // 策略名称
      remark: '', // 备注信息
      value1: new Date(2020, 1, 10, 18, 40),
      value2: new Date(2020, 1, 10, 18, 40),

      showChufa1: false, // 触发条件1显示开关
      showChufa2: true, // 触发条件2显示开关

      showQudao1: false, // 渠道选择1显示开关
      showQudao2: false, // 渠道选择2显示开关

      errorTip1: false, // 触发条件模板错误提示
      errorTip2: true, // 配置触发条件错误提示
      checkedZhibiao: true, // 指示告警
      checkedUse: false, // 使用预置触发条件
      productData: [], // 策略类型
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      formInline: {       
        strategy_name: '', // 策略名称
        textareas: '', // 备注
      },
      indexAry: [ // 指标告警数组
        {
          Period: 60,
          CalcType: '>',
          CalcValue: '0',
          ContinuePeriod: 1,
          alarm: 86400
        }
      ],
      eventAry: [// 事件告警数组
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      ],
      metting: '任意 ', // 满足条件
      meetConditions: [{ label: '任意', value: 0 }, { label: '所有', value: 1 }], // 满足条件
      tongjiZQ: [{ label: '统计周期1分钟', value: 60 }, { label: '统计周期5分钟', value: 300 }],
      continuePeriod: [// 持续周期
        { label: '持续1个周期', value: 1 },
        { label: '持续2个周期', value: 2 },
        { label: '持续3个周期', value: 3 },
        { label: '持续4个周期', value: 4 },
        { label: '持续5个周期', value: 5 }
      ],
      jinggaoZQ: [// 警告周期
        { label: '不重复', value: 0 },
        { label: '每5分钟警告一次', value: 300 },
        { label: '每10分钟警告一次', value: 600 },
        { label: '每15分钟警告一次', value: 900 },
        { label: '每30分钟警告一次', value: 1800 },
        { label: '每1小时警告一次', value: 3600 },
        { label: '每2小时警告一次', value: 7200 },
        { label: '每3小时警告一次', value: 10800 },
        { label: '每6小时警告一次', value: 21600 },
        { label: '每12小时警告一次', value: 43200 },
        { label: '每1天警告一次', value: 86400 },
        { label: '周期指数递增', value: 1 }
      ],
      zhibiaoType: [// 指标告警类型
        'CPU利用率',
        '内存利用率',
        '内存使用量',
        '磁盘利用率',
        '磁盘读流量',
        '磁盘写流量',
        '磁盘IO等待',
        '内网入包量',
        '内网出包量',
        '外网入带宽',
        '外网出带宽',
        '外网入包量',
        '外网出包量',
        '外网带宽使用率',
        'TCP连接数',
        'CPU一分钟平均负载',
        'CPU五分钟平均负载',
        'CPU十五分钟平均负载',
        '基础CPU利用率',
        '内网入带宽',
        '内网出带宽'
      ],
      eventType: [// 事件告警类型
        '磁盘只读',
        '内核故障',
        '内存oom',
        'ping不可达',
        '机器重启',
        '外网出带宽超限导致丢包',
        'agent上报超时',
        '子机nvme设备error'
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checkedGaojing: '', // 告警
      // dialogFormVisible: false //监控面板的开关
      rules: {
        strategy_name: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('模板名称不能为空'))
              } else if (value.length === 20) {
                callback(new Error('模板名称不能超过 20 字'))
              } else {
                callback()
              }
            },
            trigger: 'change',
            required: true
          }
        ],
        textareas: [
          {
            validator: (rule, value, callback) => {
              if (value.length === 100) {
                callback(new Error('描述不能超过100个字'))
              } else {
                callback()
              }
            },
            trigger: 'change',
            required: true
          }
        ]
      }, // 名称和备注的验证
      show: this.dialogVisible,
      view_name: '', // 策略视图名称
      projectId: 0,
      searchParam: { value: 'ins-6oz38wnu', label: 'instance-id' },
      productValue: 'cvm_device'
    }
  },
  watch: {
    dialogVisible: function (val) {
      this.show = val
    },
    show: function (val) {
      this.$emit('update:dialogVisible', val)
    }
  },
  components: {
    // GroupingType,
    ProductTypeCpt
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    },
    Conditions: {
      required: true,
      type: Array
    }
  },
  created () {
    // console.log(this.productData)
  },
  methods: {
    save (form) {
      // this.$emit('save')
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.newBuild()
        } else {
          return false
        }
      })
    },
    // 新建完成保存
    async newBuild () {
      // this.meetConditions.forEach(ele => {
      //   if (ele.label == this.metting) {
      //     this.metting = Number(ele.value)
      //   }
      // })
      // this.Conditions.forEach(item=>{
      //   if(this.productValue = item.PolicyViewName){
      //   this.productValue = item.PolicyViewName
      // }
      // })
      let params = {
        Version: '2018-07-24',
        GroupName: this.formInline.strategy_name,
        ViewName: this.productValue,
        Module: 'monitor',
        // IsUnionRule: this.metting,
        Remark: this.formInline.textareas
      }
      this.indexAry.forEach((ele, i) => {
        params[`Conditions.${i}.CalcValue`] = Number(ele.CalcValue)// 百分比
        params[`Conditions.${i}.MetricID`] = 929
        this.tongjiZQ.forEach((item1) => {
          var PD
          if (ele.Period == item1.value) {
            PD = item1.value
            params[`Conditions.${i}.CalcPeriod`] = PD// 统计周期
          }
        })
        this.continuePeriod.forEach((item2) => {
          var CP
          if (ele.ContinuePeriod == item2.value) {
            CP = item2.value
            params[`Conditions.${i}.ContinuePeriod`] = CP// 持续周期
          }
        })
        this.SymbolList.forEach((item3, index) => {
          var CT
          if (ele.CalcType == item3) {
            CT = index + 1
            params[`Conditions.${i}.CalcType`] = CT// 符号
          }
        })
        this.jinggaoZQ.forEach(item4 => {
          var AM
          if (ele.alarm == item4.value && ele.alarm !== 1) {
            AM = item4.value
            params[`Conditions.${i}.AlarmNotifyPeriod`] = AM
            params[`Conditions.${i}.AlarmNotifyType`] = 0
          }
          if (ele.alarm == 1) {
            // params[`Conditions.${i}.AlarmNotifyPeriod`] = ''
            params[`Conditions.${i}.AlarmNotifyType`] = 1
          }
        })
      })
      await this.axios.post(NEWBUILD_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
          this.show = false
          this.formInline.strategy_name = ''
          this.this.formInline.textareas = ''
        } else {
          this.errorPrompt(res)
        }
      })
    },
    passData (item) {
      console.log(item)
      this.productData = item
      this.zhibiaoType = item.MetricName
      this.productValue = item.productValue
    },
    // 类型
    msgBtn (index) {
      this.liIndex = index
    },
    addZhibiao () { // 添加触发条件的指标告警
      this.indexAry.push(
        {
          Period: 60,
          CalcType: '>',
          CalcValue: '0',
          ContinuePeriod: 1,
          // MetricID:33,
          alarm: 86400
        }
      )
    },
    delZhibiao (it) { // 删除触发条件的指标告警
      var index = this.indexAry.indexOf(it)
      if (index !== -1) {
        this.indexAry.splice(index, 1)
      }
    },
    addShijian () { // 添加触发条件的事件告警
      this.eventAry.push(
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      )
    },
    delShijian (item) { // 删除触发条件的事件告警
      var index = this.eventAry.indexOf(item)
      if (index !== -1) {
        this.eventAry.splice(index, 1)
      }
    },
    // 指标告警是否禁用
    isDisabledZB () {
      if (this.checkedZhibiao) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 事件告警是否禁用
    isDisabledGJ () {
      if (this.checkedGaojing) {
        this.isDisGJ = false
      } else {
        this.isDisGJ = true
      }
    },
    // 错误提示
    errorPrompt (res) {
      let ErrTips = {
        'AuthFailure.UnauthorizedOperation': '请求未授权。请参考 CAM 文档对鉴权的说明。',
        'DryRunOperation': 'DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。',
        'FailedOperation': '操作失败。',
        'FailedOperation.AlertFilterRuleDeleteFailed': '删除过滤条件失败。',
        'FailedOperation.AlertPolicyCreateFailed': '创建告警策略失败。',
        'FailedOperation.AlertPolicyDeleteFailed': '告警策略删除失败。',
        'FailedOperation.AlertPolicyDescribeFailed': '告警策略查询失败。',
        'FailedOperation.AlertPolicyModifyFailed': '告警策略修改失败。',
        'FailedOperation.AlertTriggerRuleDeleteFailed': '删除触发条件失败。',
        'FailedOperation.DbQueryFailed': '数据库查询失败。',
        'FailedOperation.DbRecordCreateFailed': '创建数据库记录失败。',
        'FailedOperation.DbRecordDeleteFailed': '数据库记录删除失败。',
        'FailedOperation.DbRecordUpdateFailed': '数据库记录更新失败。',
        'FailedOperation.DbTransactionBeginFailed': '数据库事务开始失败。',
        'FailedOperation.DbTransactionCommitFailed': '数据库事务提交失败。',
        'FailedOperation.DimQueryRequestFailed': '请求维度查询服务失败。',
        'FailedOperation.DruidQueryFailed': '查询分析数据失败。',
        'FailedOperation.DuplicateName': '名字重复。',
        'FailedOperation.ServiceNotEnabled': '服务未启用，开通服务后方可使用。',
        'InternalError': '内部错误。',
        'InternalError.ExeTimeout': '执行超时。',
        'InvalidParameter': '参数错误。',
        'InvalidParameter.InvalidParameter': '参数错误。',
        'InvalidParameter.InvalidParameterParam': '参数错误。',
        'InvalidParameterValue': '无效的参数值。',
        'LimitExceeded': '超过配额限制。',
        'LimitExceeded.MetricQuotaExceeded': '指标数量达到配额限制，禁止含有未注册指标的请求。',
        'MissingParameter': '缺少参数错误。',
        'ResourceInUse': '资源被占用。',
        'ResourceInsufficient': '资源不足。',
        'ResourceNotFound': '资源不存在。',
        'ResourceUnavailable': '资源不可用。',
        'ResourcesSoldOut': '资源售罄。',
        'UnauthorizedOperation': '未授权操作。',
        'UnknownParameter': '未知参数错误。',
        'UnsupportedOperation': '操作不支持。'
      }
      let ErrOr = Object.assign(ErrorTips, ErrTips)
      this.$message({
        message: ErrOr[res.Response.Error.Code],
        type: 'error',
        showClose: true,
        duration: 0
      })
    },
    // 新建策略类型
    showMsgfromChild (val) {
      console.log('val', val)
    }
  }
}
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
  .dialog-footer{
    margin-top: 20px;
  }
}
</style>
