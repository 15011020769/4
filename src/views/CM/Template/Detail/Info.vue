<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card1">
      <h4 class="title-text">基本信息</h4>
      <el-form class="form form_container" label-position='left' label-width="120px" size="mini">
        <el-form-item label="模板名称" class="form-item">
          <div class="item-text">
            {{infoData.GroupName}}
            <!-- <i class="el-icon-edit" @click="openName(infoData.GroupName)" style="cursor:pointer"></i> -->
          </div>
        </el-form-item>
        <el-form-item label="策略类型">
          <div class="item-text">{{infoData.Name}}</div>
        </el-form-item>
        <el-form-item label="最后修改人">
          <div class="item-text">{{infoData.LastEditUin}}</div>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <div class="item-text">{{infoData?infoData.UpdateTime : '' | formatDate}}</div>
        </el-form-item>
        <el-form-item label="备注">
          <div class="item-text">
            <span>{{infoData.Remark}}</span>
            <!-- <i class="el-icon-edit" @click="openRemark(infoData.Remark)" style="cursor:pointer"></i> -->
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card2">
      <h4 class="title-text">告警触发条件
        <!-- <span @click="openEdit()" style="cursor:pointer">编辑</span> -->
      </h4>
      <p class="text-color1">指标告警(任意)</p>
      <p class="text-color2" v-for="(it) in infoData.Conditions" :key="it.MetricDisplayName">
        <!-- {{ `${it.metricShowName}>${it.calcValue}${it.unit},持续${it.continueTime}秒,按${it.calcType}天重复告警` }} -->
        {{ `${it.MetricDisplayName}${it.CalcType||'-'}${it.CalcValue||'-'}${it.Unit||''},持续${it.ContinueTime/60}分钟,${it.alarm}` }}
      </p>
      <p class="text-color1" v-if="infoData.EventConditions&&infoData.EventConditions.length>0">事件告警</p>
      <p class="text-color2" v-for="(it) in infoData.EventConditions" :key="it.EventDisplayName">
        {{ `${it.EventDisplayName},不重复告警` }}
      </p>
    </el-card>
    <el-card class="card3">
      <h4 class="title-text">关联告警策略</h4>
      <el-table :data="infoData.PolicyGroups">
        <el-table-column label="策略名称" prop="GroupName">
          <template slot-scope="scope">
            <a :href="`#/strategy/createdetail?groupId=${scope.row.GroupID}`" class="gpn">{{scope.row.GroupName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="所属项目">
          <template slot-scope="scope">
            {{ scope.row.ProjectID | ProjectName }}
          </template>
        </el-table-column>
        <el-table-column label="已启用/实例数">
           <template slot-scope="scope">
              <p>{{scope.row.TotalInstanceCount+' / '+scope.row.NoShieldedInstanceCount}}</p>
              <!-- <p>{{'组: '+scope.row.instanceGroup.groupName}}</p> -->
           </template>
        </el-table-column>
        <el-table-column label="告警渠道">
          <template slot-scope="scope">
            <div v-for="(item,i) in scope.row.ReceiverInfos" :key="i">
              <!-- +item.ReceiverGroupList.length||0 -->
              <p>接收组:&nbsp;{{item.ReceiverGroupList?''+item.ReceiverGroupList.length+'个':'0个'}}</p>
              <p>有效期:&nbsp;{{'00:00:00 - 23:59:59'}}</p>
              <!-- <p>{{'渠道:'}}<span v-for="it in channelList" :key="it">{{it+' '}}</span></p> -->
              <p>渠道:<span v-for="key in item.NotifyWay" :key="key">&nbsp; {{key|notifyChannel}}</span></p>
            </div>
          </template>
          <!-- <span v-else>{{'-'}}</span> -->
        </el-table-column>
      </el-table>
      <div class="number">共 {{infoData.PolicyGroups?infoData.PolicyGroups.length:0}} 项</div>
    </el-card>
    <!-- 修改名称弹框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog1" width="25%" title="修改条件模板名称">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改条件模板名称</p> -->
      <div>
        <el-input maxlength="20" v-model="editGroupName" style="width:200px;margin-top:20px" size="small"></el-input>
        <p v-if="editGroupName==''" class="edit-text-tips">条件模板名称不能为空</p>
        <p v-if="editGroupName.length==20" class="edit-text-tips">条件模板名称不能超过20个字符</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitName()">保 存</el-button>
        <el-button @click="showDelDialog1 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改备注弹框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog2" width="35%" title="修改条件模板备注">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改条件模板备注</p> -->
      <!-- <el-form :model="infoData" :rules="rules" ref="form"> -->
        <!-- <el-form-item prop="remark"> -->
          <div>
          <el-input type="textarea" rows="5" maxlength="100" v-model="editRemark" show-word-limit></el-input>
          <p v-if="editRemark.length==100" class="edit-text-tips">条件模板备注不能超过100个字符</p>
          </div>
        <!-- </el-form-item> -->
      <!-- </el-form> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRemark(infoData.remark)">保 存</el-button>
        <el-button @click="showDelDialog2 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 告警触发条件编辑弹框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog3" width="65%">
      <div>
        <p class="title">修改触发条件</p>
        <div style="display:flex">
          <span style="display: inline-block;width: 80px;">触发条件</span>
          <div>
            <div>
              <p style="line-height:30px;">
                <el-checkbox v-model="checkedZhibiao" :checked="checkedZhibiao" @change="isDisabledZB()">指标告警</el-checkbox>
              </p>
            </div>
            <div class="color">
              <p>
                <span>满足</span>
                <el-select :disabled="isDisabled" v-model="UnionRule" style="width:90px;margin:0 5px;" size="small">
                  <el-option
                    v-for="(item,index) in meetConditions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <span>条件时，触发告警</span>
              </p>
              <ul>
                <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(it,i) in indexAry" :key="i">
                  <p>
                    if&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:150px;" size="small"> -->
                    <el-select :disabled="isDisabled" v-model="it.MetricDisplayName" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in conditionsData.conditions"
                        :key="index"
                        :label="item.metricShowName"
                        :value="item.metricShowName"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:130px;" size="small"> -->
                    <el-select :disabled="isDisabled" v-model="it.Period" style="width:130px;" size="small">
                      <el-option
                        v-for="(item,index) in tongjiZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:60px;" size="small"> -->
                      <el-select :disabled="isDisabled" v-model="it.CalcType" style="width:75px;" size="small">
                      <el-option
                        v-for="(item,index) in SymbolList"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                      <!-- placeholder="指标" -->
                    <input :disabled="isDisabled"
                      style="height: 30px;line-height: 30px;padding:0 10px;width:60px;border: 1px solid #dcdfe6;"
                      value="0"
                      v-model="it.CalcValue"
                      min="0"
                      max="100"
                      type="number"
                    />
                    <b
                      style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                    >{{it.Unit||'&nbsp;'}}</b>
                    &nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:110px;" size="small"> -->
                      <el-select :disabled="isDisabled" v-model="it.ContinuePeriod" style="width:110px;" size="small">
                      <el-option
                        v-for="(item,index) in continuePeriod"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    then&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:150px;" size="small"> -->
                    <el-select :disabled="isDisabled" v-model="it.alarm" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in jinggaoZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <el-popover placement="top" trigger="hover" width="300">
                      <div>
                        <p style="font-size:12px">重复通知：可以设置告警发生24小时内重复发送通知；超过24小时，每天告警一次，超过72小时，不再发送告警通知。</p>
                        <p style="font-size:12px">周期指数递增通知: 告警持续时长到达告警统计周期的1，2，4，8，16，32...倍时发送告警通知</p>
                      </div>
                      <i slot="reference" class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                    </el-popover>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delZhibiao(it)" v-if="indexAry.length>1"></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
              </ul>
            </div>
            <!-- <div>
              <p style="line-height:30px;">
                <el-checkbox v-model="checkedGaojing" :checked="checkedGaojing" @change="isDisabledGJ()">
                  事件告警
                  <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                </el-checkbox>
              </p>
              <ul class="color">
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in eventAry" :key="i">
                  <p>
                    <el-select :disabled="isDisGJ" v-model="item.EventDisplayName" style="width:180px;margin:0 5px;" size="small">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delShijian(item)" v-if="eventAry.length>1"></i>
                </li>
                <a @click="addShijian" style="cursor:pointer">添加</a>
                <i class="rubbish-icon"></i>
              </ul>
            </div> -->
            <p class="red-text">{{`该告警触发条件模板已经关联了${infoData.PolicyGroups?infoData.PolicyGroups.length:0}个策略，若修改，修改内容将应用到所有已关联的告警策略上`}}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;margin-top:20px">
          <el-button type="primary" size="small">保存</el-button>
          <el-button size="small" @click="showDelDialog3=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GET_GROUP_LIST,
  GET_POLICY_GROUP_TYPE,
  DESCRIBE_METRICS,
  GET_CONDITIONSTEMPLATELIST,
  MODIFYPOLICYGROUPINFO,
  GET_PROJECTNAME
} from '@/constants/CM-yhs.js'
import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共错误码
import moment from 'moment'
export default {
  name: 'templateInfo',
  data () {
    return {
      showDelDialog1: false, // 是否显示修改名称弹框
      showDelDialog2: false, // 是否显示修改备注弹框
      showDelDialog3: false, // 是否显示条件编辑弹框
      checkedZhibiao: true, // 指示告警多选框是否选中
      checkedGaojing: true, // 事件告警多选框是否选中
      isDisabled: false, // 指标告警是否禁用
      isDisGJ: false, // 事件告警是否禁用
      loadShow: false, // 加载显示
      infoData: {}, // 详情信息
      total: 0, // 告警策略列表总数
      id: '', // 模板id
      editGroupName: '', // 编辑的模板名称
      editRemark: '', // 编辑的备注
      Conditions: [], // 策略类型
      tongjiZQ: [{ label: '统计周期1分钟', value: 60 }, { label: '统计周期5分钟', value: 300 }],
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
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
      formInline: {
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
      },
      indexAry: [], // 指标告警数组
      eventAry: [], // 事件告警数组
      conditionsData: [], // 触发条件数据
      meetConditions: [{ label: '任意', value: 0 }, { label: '所有', value: 1 }], // 满足条件
      UnionRule: '任意', // 双向绑定的满足条件
      groupList: [], // 策略组列表
      channelList: [], // 渠道列表
      PolicyGrouplist: [], // 关联政策组列表
      allProjectName: []// 项目名称列表
    }
  },
  components: {
    Loading
  },
  created () {
    this.id = this.$route.params.id
    this.getInfo()
  },
  methods: {
    async getInfo () {
      await this.getPolicyType()
      await this.getProjectName()
      await this.getDetailInfo()
      // await this.getPolicyGroupList()
    },
    // 获取策略类型
    async getPolicyType  () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        // Region:"",
        Module: 'monitor'
      }
      this.loadShow = true
      await this.axios.post(GET_POLICY_GROUP_TYPE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.Conditions = res.Response.Conditions
          // console.log(this.Conditions)
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取项目名称
    async getProjectName () {
      this.axios.get(GET_PROJECTNAME).then(res => {
        if (res.codeDesc === 'Success') {
          // console.log(res)
          this.allProjectName = res.data
        } else {
          let ErrTips = {
            InternalError: '内部错误',
            UnauthorizedOperation: '未授权操作'
          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取详情数据
    async getDetailInfo () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupID: this.id
      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
        // console.log(res)
        if (res.Response.Error === undefined) {
          var msg = res.Response.TemplateGroupList
          // this.conditionsData = msg[0]
          let ct = this.Conditions
          msg.forEach((ele, i) => {
            ct.forEach((k, j) => {
              if (ele.ViewName === k.PolicyViewName) {
                ele['Name'] = k.Name
              }
            })
            this.indexAry = ele.Conditions// 编辑触发条件
            ele.Conditions.forEach((item, i) => {
              let ct = Number(item.CalcType)
              item.CalcType = this.SymbolList[ct - 1]
              let time = item.Period / 60// 编辑触发条件
              item['Period'] = `统计周期${time}分钟`// 编辑触发条件
              let num = item.ContinueTime / (time * 60)// 编辑触发条件
              item['ContinuePeriod'] = `持续${num}个周期`// 编辑触发条件
              let time1 = item.AlarmNotifyPeriod / 60
              let time2 = item.AlarmNotifyPeriod / (60 * 60)
              if (item.AlarmNotifyPeriod == 0 && item.AlarmNotifyType == 0) {
                item.alarm = '不重复告警'
                this.indexAry[i].alarm = '不重复'// 编辑触发条件
              } else if (item.AlarmNotifyType == 1) {
                item.alarm = '按周期指数递增重复告警'
                this.indexAry[i].alarm = '周期指数递增'// 编辑触发条件
              } else if (item.AlarmNotifyPeriod > 0 && time1 < 30) {
                item.alarm = `按${time1}分钟重复告警`
                this.indexAry[i].alarm = `每${time1}分钟警告一次`// 编辑触发条件
              } else if (item.AlarmNotifyPeriod > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小时重复告警`
                this.indexAry[i].alarm = `每${time2}小时警告一次`// 编辑触发条件
              } else {
                item.alarm = '按1天重复告警'
                this.indexAry[i].alarm = '每1天重复告警'// 编辑触发条件
              }
            })
            if (ele.IsUnionRule === 0) { // 编辑触发条件
              this.UnionRule = '任意'
            } else if (ele.IsUnionRule === 1) {
              this.UnionRule = '所有'
            }
            this.infoData = ele
            this.eventAry = ele.EventConditions// 编辑触发条件
          })
          // this.infoData = msg[0]
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取策略组列表(未完成  参数有误)
    async getPolicyGroupList () {
      this.loadShow = true
      let params = {
        conditionTempGroupId: this.id,
        lang: 'zh',
        like: '',
        limit: 20,
        offset: 0,
        Version: '2018-07-24'
      }
      await this.axios.post(GET_GROUP_LIST, params).then(res => {
        if (res.codeDesc === 'Success') {
          let msg = res.data.groupList
          this.total = res.data.total
          msg.forEach(ele => {
            ele.receiverGroup = ele.receiverInfos && ele.receiverInfos[0].receiverGroupList.length
            if (ele.receiverInfos.length > 0) {
              ele.receiverInfos.notifyWay.forEach(item => {
                if (item === 'EMAIL') {
                  this.channelList.push('邮件')
                } else if (item === 'SMS') {
                  this.channelList.push('短信')
                } else if (item === 'WECHAT') {
                  this.channelList.push('微信')
                }
              })
            }
          })
          this.groupList = msg
          this.loadShow = false
          console.log(res)
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    openName (name) { // 修改名字弹框
      this.editGroupName = name
      this.showDelDialog1 = true
    },
    // 修改名称
    async submitName () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.id,
        GroupType: 3,
        Key: 'groupName',
        Value: this.editGroupName
        // lang: 'zh',
      }
      await this.axios.post(MODIFYPOLICYGROUPINFO, params).then(res => {
        this.showDelDialog1 = false
        this.getDetailInfo()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 0,
          showClose: true
        })
      })
    },
    openRemark (remark) { // 修改备注弹框
      this.editRemark = remark
      this.showDelDialog2 = true
    },
    // 修改备注
    async submitRemark () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.id,
        GroupType: 3,
        Key: 'remark',
        Value: this.editRemark
        // lang: 'zh',
      }
      await this.axios.post(MODIFYPOLICYGROUPINFO, params).then(res => {
        this.showDelDialog2 = false
        this.getDetailInfo()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 0,
          showClose: true
        })
      })
    },
    // 是否禁用指标告警
    isDisabledZB () {
      if (this.checkedZhibiao) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 是否禁用事件告警
    isDisabledGJ () {
      if (this.checkedGaojing) {
        this.isDisGJ = false
      } else {
        this.isDisGJ = true
      }
    },
    // 格式化时间
    upTime (value) {
      // return moment(value).format('YYYY/MM/DD HH :mm:ss')
      return moment(value).format('HH :mm:ss')
    },
    // 告警触发条件弹框(未完成)
    openEdit () {
      this.showDelDialog3 = true
      let params = {
        lang: 'zh',
        namespace: 'qce/cvm'
      }
      this.axios.post(DESCRIBE_METRICS, params).then(res => {
        // console.log(res)
      })
    },
    addZhibiao () { // 添加触发条件的指标告警
      this.indexAry.push(
        {
          Period: '统计周期1分钟',
          CalcType: '>',
          CalcValue: '0',
          ContinuePeriod: '持续1个周期',
          alarm: '每1天警告一次'
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
    }
  },
  filters: {
    formatDate (value) {
      let date = new Date(value * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ':' + s
    },
    ProjectName (val) {
      if (val == 0) {
        return '默认项目'
      }
      if (this.allProjectName) {
        for (let i in this.allProjectName) {
          if (val == this.allProjectName[i].projectId) {
            return this.allProjectName[i].projectName
          }
        }
      }
    },
    notifyChannel (val) {
      if (val === 'EMAIL') {
        return '邮件'
      } else if (val === 'SMS') {
        return '短信'
      } else if (val === 'WECHAT') {
        return '微信'
      } else if (val === 'CALL') {
        return '电话'
      }
    }
  }
}
</script>
<style>
.form_container .el-form-item__label {
  font-size: 12px;
  color: #888;

}
</style>
<style scoped lang='scss'>
.card1{
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 20px;
  .form{
    .form-item{
      font-size: 12px;
      color: #888;
    }
    .el-form-item__label{
      font-size: 12px;
      color: #888;
    }
}
}
.form{
  .form-item{
    font-size: 12px;
    color: #888;
  }
  .el-form-item__label{
    font-size: 12px;
    color: #888;
  }
}
.title-text{
    font-size: 14px;
    font-weight: 700;
    color: #000;
    margin-bottom: 20px;
}
.card2{
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 20px;
  .title-text{
    span{
      font-size: 14px;
      color:#006eff;
    }
  }
  .text-color1{
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
  }
  .text-color2{
    font-size: 12px;
    color: #444;
    margin-bottom: 10px;
  }
}
.card3{
  .gpn{
    color: #006eff;
    &:hover{
      text-decoration:underline;
    }
  }
  .number {
    padding: 10px 10px 14px 10px;
    line-height: 27px;
    color: #888;
    margin: 0 10px;
  }
}
.item-text{
  font-size: 12px;
  color: #444;
}
.dil >>> .el-dialog__body{
  padding-top: 0;
}
.dil{
  .title{
    font-weight: 800;
    margin-bottom: 20px;
    color: black;

  }
}
.color {
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 10px;

  background-color: #f2f2f2;
  p {
    margin: 5px 0;
  }
}
.red-text{
  font-size: 12px;
  color:red;
  line-height: 30px;
}
.edit-text-tips{
  color: red;
  font-size: 12px;
  margin-top:10px;
}
</style>
