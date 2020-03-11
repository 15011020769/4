<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card1">
      <h4 class="title-text">基本信息</h4>
      <el-form class="form form_container" label-position='left' label-width="120px" size="mini">
        <el-form-item label="模板名称" class="form-item">
          <div class="item-text">
            {{infoData.groupName}}
            <i class="el-icon-edit" @click="openName(infoData.groupName)"></i>
          </div>
        </el-form-item>
        <el-form-item label="策略类型">
          <div class="item-text">{{infoData.Name}}</div>
        </el-form-item>
        <el-form-item label="最后修改人">
          <div class="item-text">{{infoData.lastEditUin}}</div>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <div class="item-text">{{infoData?infoData.updateTime : '' | formatDate}}</div>
        </el-form-item>
        <el-form-item label="备注">
          <div class="item-text">
            <span>{{infoData.remark}}</span>
            <i class="el-icon-edit" @click="openRemark()"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card2">
      <h4 class="title-text">告警触发条件 <span @click="openEdit()">编辑</span></h4>
      <p class="text-color1">指标告警(任意)</p>
      <p class="text-color2" v-for="(it) in infoData.conditions" :key="it.metricShowName">
        {{ `${it.metricShowName}>${it.calcValue}${it.unit},持续${it.continueTime}秒,按${it.calcType}天重复告警` }}
      </p>
      <p class="text-color1">事件告警</p>
      <p class="text-color2" v-for="(it) in infoData.eventConditions" :key="it.eventShowName">
        {{ `${it.eventShowName},不重复告警` }}
      </p>
    </el-card>
    <el-card class="card3">
      <h4 class="title-text">关联告警策略</h4>
      <el-table border :data="groupList">
        <el-table-column label="策略名称" prop="groupName"></el-table-column>
        <el-table-column label="所属项目"></el-table-column>
        <el-table-column label="已启用/实例数">
           <template slot-scope="scope">
              <p>{{scope.row.useSum+' / '+scope.row.noShieldedSum}}</p>
              <p>{{'组: '+scope.row.instanceGroup.groupName}}</p>
           </template>
        </el-table-column>
        <el-table-column label="告警渠道">
          <template slot-scope="scope" v-if="groupList.receiverInfos.length>0">
            <p>{{'接收组: '+scope.row.receiverGroup}}</p>
            <p>{{'有效期:00:00:00 - 23:59:59'}}</p>
            <p>{{'渠道:'}}<span v-for="it in channelList" :key="it">{{it}}</span></p>
          </template>
          <span v-else>{{'-'}}</span>
        </el-table-column>
      </el-table>
      <div class="number">共 {{total}} 项</div>
    </el-card>
    <!-- 修改名称弹框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog1" width="35%">
      <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改条件模板名称</p>
      <el-form :model="infoData" :rules="rules" ref="form">
        <el-form-item prop="groupName">
          <el-input maxlength="20" v-model="infoData.groupName" :value="infoData.groupName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitName(infoData.groupName)">保 存</el-button>
        <el-button @click="showDelDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改备注弹框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog2" width="35%">
      <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改条件模板备注</p>
      <el-form :model="infoData" :rules="rules" ref="form">
        <el-form-item prop="remark">
          <el-input type="textarea" rows="5" maxlength="100" v-model="infoData.remark" :value="infoData.remark" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRemark(infoData.remark)">保 存</el-button>
        <el-button @click="showDelDialog = false">取 消</el-button>
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
                <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:90px;margin:0 5px;" size="small">
                  <el-option
                    v-for="(item,index) in conditions"
                    :key="index"
                    :label="item"
                    :value="item"
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
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in conditionsData.conditions"
                        :key="index"
                        :label="item.metricShowName"
                        :value="item.metricShowName"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:130px;" size="small"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:130px;" size="small">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:60px;" size="small"> -->
                      <el-select :disabled="isDisabled" v-model="it.projectName" style="width:60px;" size="small">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <input :disabled="isDisabled"
                      placeholder="指标"
                      style="height: 30px;line-height: 30px;padding:0 10px;width:85px;border: 1px solid #dcdfe6;"
                      value="0"
                      min="0"
                      max="100"
                      type="number"
                    />
                    <b
                      style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                    >%</b>
                    &nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:110px;" size="small"> -->
                      <el-select :disabled="isDisabled" v-model="it.projectName" style="width:110px;" size="small">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    then&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:150px;" size="small"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delZhibiao(it)" v-if="indexAry.length>1"></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
              </ul>
            </div>
            <div>
              <p style="line-height:30px;">
                <el-checkbox v-model="checkedGaojing" :checked="checkedGaojing" @change="isDisabledGJ()">
                  事件告警
                  <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                </el-checkbox>
              </p>
              <ul class="color">
              <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
              <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in eventAry" :key="i">
                <p>
                  <!-- <el-select :disabled="isDisGJ" v-model="formInline.projectName" style="width:180px;margin:0 5px;" size="small"> -->
                    <el-select :disabled="isDisGJ" v-model="item.projectName" style="width:180px;margin:0 5px;" size="small">
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
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GET_TENCENTCLOUDAPI,
  GET_TEMPLATE_LIST,
  GET_GROUP_LIST,
  GET_POLICY_GROUP_TYPE,
  UPDATE_INFO,
  DESCRIBE_METRICS
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
      Conditions: [],
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
      indexAry: [ // 指标告警数组
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
      conditionsData: [], // 触发条件数据
      conditions: ['任意', '所有'], // 满足条件
      groupList: [], // 策略组列表
      channelList: [], // 渠道列表
      rules: {
        groupName: [// 验证名字
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('名称不能为空'))
              } else if (!(/^[\u4e00-\u9fa5_a-zA-Z_]{1,19}$/.test(value))) {
                callback(new Error('条件模板名称不能超过20个字符'))
              } else {
                callback()
              }
            },
            trigger: 'change',
            required: true
          }
        ],
        remark: [// 验证备注
          {
            validator: (rule, value, callback) => {
              if (value.length === 100) {
                callback(new Error('条件模板备注不能超过100个字符'))
              } else {
                callback()
              }
            },
            trigger: 'change',
            required: true
          }
        ]
      }
    }
  },
  components: {
    Loading
  },
  created () {
    this.id = this.$route.params.id
    this.getInfo()
    // this.getInfo2()
    // this.getDetailInfo()
    // this.getPolicyGroupList()
  },
  methods: {
    async getInfo () {
      // await this.getTemplateList()
      await this.getPolicyType()
      await this.getDetailInfo()
      await this.getPolicyGroupList()
      // await this.getConditionsTemplateList()
    },
    // 获取告警策略模板列表
    // async getConditionsTemplateList () {
    //   let { groupName, groupId, viewName } = this.conditionsData
    //   let params = {
    //     Module: 'monitor',
    //     ViewName: viewName,
    //     GroupName: groupName,
    //     GroupID: groupId,
    //     UpdateTimeOrder: 'desc',
    //     Limit: 1,
    //     Offset: 0,
    //     Version: '2018-07-24'
    //   }
    //   this.axios.post(GET_DESCRIBECONDITIONSTEMPLATELIST, params).then(res => {
    //     console.log(res)
    //   })
    // },
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
    // 获取详情数据
    async getDetailInfo () {
      this.loadShow = true
      let params = {
        groupId: this.id,
        lang: 'zh'
      }
      await this.axios.post(GET_TEMPLATE_LIST, params).then(res => {
        if (res.codeDesc === 'Success') {
          var msg = res.data.templateGroupList
          this.conditionsData = msg[0]
          let ct = this.Conditions
          for (let i in msg) {
            for (let j in ct) {
              if (msg[i].viewName === ct[j].PolicyViewName) {
                msg[i]['Name'] = ct[j].Name
              }
            }
          }
          this.infoData = msg[0]
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
    // 修改名称(未完成 修改不成,报错缺少Version)
    async submitName (val) {
      let params = {
        groupType: 3,
        key: 'groupName',
        lang: 'zh',
        value: val,
        groupId: Number(this.id)
        // Version: '2018-07-24'
      }
      await this.axios.post(UPDATE_INFO, params).then(res => {
        this.showDelDialog1 = false
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 0,
          showClose: true
        })
      })
    },
    // 修改备注(未完成 修改不成,报错缺少Version)
    async submitRemark (val) {
      let params = {
        groupType: 3,
        key: 'remark',
        lang: 'zh',
        value: val,
        groupId: Number(this.id)
        // Version: '2018-07-24'
      }
      await this.axios.post(UPDATE_INFO, params).then(res => {
        this.showDelDialog2 = false
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
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    },
    openName () { // 修改名字弹框
      this.showDelDialog1 = true
    },
    openRemark () { // 修改备注弹框
      this.showDelDialog2 = true
    },
    // 告警触发条件弹框(未完成)
    openEdit () {
      this.showDelDialog3 = true
      let params = {
        lang: 'zh',
        namespace: 'qce/cvm'
      }
      this.axios.post(DESCRIBE_METRICS, params).then(res => {
        console.log(res)
      })
    },
    addZhibiao () { // 添加触发条件的指标告警
      this.indexAry.push(
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
// .rubbish-icon{
//   position: absolute;
//   right: 0;

// }
</style>
