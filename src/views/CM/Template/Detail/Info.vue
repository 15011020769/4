<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card1">
      <h4 class="title-text">基本訊息</h4>
      <el-form class="form form_container" label-position='left' label-width="120px" size="mini">
        <el-form-item label="範本名稱" class="form-item">
          <div class="item-text">
            {{infoData.GroupName}}
            <!-- <i class="el-icon-edit" @click="openName(infoData.GroupName)" style="cursor:pointer"></i> -->
          </div>
        </el-form-item>
        <el-form-item label="策略類型">
          <div class="item-text">{{infoData.ViewName | ViewName}}</div>
        </el-form-item>
        <el-form-item label="最後修改人">
          <div class="item-text">{{infoData.LastEditUin}}</div>
        </el-form-item>
        <el-form-item label="最後修改時間">
          <div class="item-text">{{infoData?infoData.UpdateTime : '' | formatDate}}</div>
        </el-form-item>
        <el-form-item label="備注">
          <div class="item-text">
            <span>{{infoData.Remark||'-'}}</span>
            <!-- <i class="el-icon-edit" @click="openRemark(infoData.Remark)" style="cursor:pointer"></i> -->
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card2">
      <h4 class="title-text">告警觸發條件
        <!-- <span @click="openEdit()" style="cursor:pointer">編輯</span> -->
      </h4>
      <p class="text-color1">指標告警({{infoData.IsUnionRule==0?'任意':'所有'}})</p>
      <p class="text-color2" v-for="(it) in ConditionsAry" :key="it.MetricDisplayName">
        <!-- {{ `${it.metricShowName}>${it.calcValue}${it.unit},持續${it.continueTime/60}秒,按${it.calcType}天重複告警` }} -->
        {{ `${it.MetricDisplayName}${it.CalcType||'-'}${it.CalcValue||'-'}${it.Unit||''}, 持續${it.ContinueTime/60}分鍾, ${it.alarm}` }}
      </p>
      <p class="text-color1" v-if="infoData.EventConditions&&infoData.EventConditions.length>0">事件告警</p>
      <p class="text-color2" v-for="(it) in infoData.EventConditions" :key="it.EventDisplayName">
        {{ `${it.EventDisplayName},不重複告警` }}
      </p>
    </el-card>
    <el-card class="card3">
      <h4 class="title-text">關聯告警策略</h4>
      <el-table :data="infoData.PolicyGroups">
        <el-table-column label="策略名稱" prop="GroupName">
          <template slot-scope="scope">
            <a :href="`#/strategy/createdetail?groupId=${scope.row.GroupID}`" class="gpn">{{scope.row.GroupName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="所屬專案">
          <template slot-scope="scope">
            {{ scope.row.ProjectID | ProjectName }}
          </template>
        </el-table-column>
        <el-table-column label="已啓用/實例數">
           <template slot-scope="scope">
              <p>{{scope.row.TotalInstanceCount+' / '+scope.row.NoShieldedInstanceCount}}</p>
              <!-- <p>{{'組: '+scope.row.instanceGroup.groupName}}</p> -->
           </template>
        </el-table-column>
        <el-table-column label="告警管道">
          <template slot-scope="scope">
            <div v-for="(item,i) in scope.row.ReceiverInfos" :key="i">
              <!-- +item.ReceiverGroupList.length||0 -->
              <p>接收組:&nbsp;{{item.ReceiverGroupList?''+item.ReceiverGroupList.length+'個':'0個'}}</p>
              <p>有效期:&nbsp;{{'00:00:00 - 23:59:59'}}</p>
              <!-- <p>{{'管道:'}}<span v-for="it in channelList" :key="it">{{it+' '}}</span></p> -->
              <p>管道:<span v-for="key in item.NotifyWay" :key="key">&nbsp; {{key|notifyChannel}}</span></p>
            </div>
          </template>
          <!-- <span v-else>{{'-'}}</span> -->
        </el-table-column>
      </el-table>
      <div class="number">共 {{infoData.PolicyGroups?infoData.PolicyGroups.length:0}} 項</div>
    </el-card>
    <!-- 修改名稱彈框 -->
    <el-dialog class="dil" :visible.sync="showDelDialog1" width="25%" title="修改條件範本名稱">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改條件範本名稱</p> -->
      <div>
        <el-input maxlength="20" v-model="editGroupName" style="width:200px;margin-top:20px" size="small"></el-input>
        <p v-if="editGroupName==''" class="edit-text-tips">條件範本名稱不能爲空</p>
        <p v-if="editGroupName.length==20" class="edit-text-tips">條件範本名稱不能超過20個字符</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitName()">保 存</el-button>
        <el-button @click="showDelDialog1 = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dil" :visible.sync="showDelDialog2" width="35%" title="修改條件範本備注">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改條件範本備注</p> -->
      <!-- <el-form :model="infoData" :rules="rules" ref="form"> -->
        <!-- <el-form-item prop="remark"> -->
          <div>
          <el-input type="textarea" rows="5" maxlength="100" v-model="editRemark" show-word-limit></el-input>
          <p v-if="editRemark.length==100" class="edit-text-tips">條件範本備注不能超過100個字符</p>
          </div>
        <!-- </el-form-item> -->
      <!-- </el-form> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRemark(infoData.remark)">保 存</el-button>
        <el-button @click="showDelDialog2 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 告警触发条件编辑弹框 -->
     <!--  @open="openEditloadShow=true"   @open="openEdit()"-->
    <el-dialog class="dil" :visible.sync="showDelDialog3" width="65%">
      <p class="title">修改觸發條件</p>
      <!-- <div v-if="!checkedZhibiao" style="color:red;margin-top:-10px;">请至少配置1项触发条件</div> -->
      <div class="tips" v-if="!checkedGaojing&&!checkedZhibiao">请至少配置1项触发条件</div>
      <product-type-cpt v-on:PassData="passData" :projectId='projectId' :searchParam='searchParam'
        :productValue='productValue' v-on:loading="Type_loading" style="display:none"/>
      <div v-loading="openLoadShow">
        <div style="display:flex">
          <span style="display: inline-block;width: 80px;">觸發條件</span>
          <div v-loading="openEditloadShow">
            <div>
              <p style="line-height:30px;">
                <el-checkbox v-model="checkedZhibiao" :checked="checkedZhibiao">指標告警</el-checkbox>
              </p>
            </div>
            <div class="color">
              <p>
                <span>滿足</span>
                <el-select :disabled="!checkedZhibiao" v-model="UnionRule" style="width:90px;margin:0 5px;" size="small">
                  <el-option
                    v-for="(item,index) in meetConditions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <span>條件時，觸發告警</span>
              </p>
              <!-- -->
              <ul>
                <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(it,i) in indexAry" :key="i">
                  <p>
                    if&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:150px;" size="small"> -->
                    <el-select :disabled="!checkedZhibiao" v-model="it.MetricID" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in zhibiaoType"
                        :key="index"
                        :label="item.MetricShowName"
                        :value="item.MetricId"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:130px;" size="small"> -->
                    <el-select :disabled="!checkedZhibiao" v-model="it.Period" style="width:130px;" size="small">
                      <el-option
                        v-for="(item,index) in tongjiZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:60px;" size="small"> -->
                      <el-select :disabled="!checkedZhibiao" v-model="it.CalcType" style="width:75px;" size="small">
                      <el-option
                        v-for="(item,index) in SymbolList"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                      <!-- placeholder="指標" -->
                    <input :disabled="!checkedZhibiao"
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
                    <el-select :disabled="!checkedZhibiao" v-model="it.ContinueTime" style="width:110px;" size="small">
                      <el-option
                        v-for="(item,index) in continuePeriod"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <span style="width:30px" v-if="UnionRule!==1" >then</span>&nbsp;
                    <el-select :disabled="!checkedZhibiao" v-model="it.RepeatedAlarm" v-if="UnionRule!==1" style="width:150px;" size="small">
                      <el-option
                        v-for="(item,index) in jinggaoZQ"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <el-popover v-if="UnionRule!==1" placement="top" trigger="hover" width="300">
                      <div>
                        <p style="font-size:12px">重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。</p>
                        <p style="font-size:12px">週期指數遞增通知: 告警持續時長到達告警統計週期的1，2，4，8，16，32...倍時發送告警通知</p>
                      </div>
                      <i slot="reference" class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                    </el-popover>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delZhibiao(it)" v-if="indexAry.length>1"></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
                <p style="color:red" v-if="isRepeated"><i class="el-icon-info"
                   style="color:#888; margin:0 5px;color:red"></i>請勿重複配置</p>
              </ul>
              <p v-if="UnionRule==1">
                <span style="width:30px">then</span>&nbsp;
                <el-select :disabled="!checkedZhibiao" v-model="all_alarm" style="width:150px;">
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
                    <p style="font-size:12px">重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。</p>
                    <p style="font-size:12px">週期指數遞增通知: 告警持續時長到達告警統計週期的1，2，4，8，16，32...倍時發送告警通知</p>
                  </div>
                  <i slot="reference" class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                </el-popover>
              </p>
            </div>
            <div>
              <p style="line-height:30px;">
                <el-checkbox v-model="checkedGaojing" :checked="checkedGaojing">
                  事件告警
                  <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                </el-checkbox>
              </p>
              <ul class="color">
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in eventAry" :key="i">
                  <p>
                    <el-select :disabled="!checkedGaojing" v-model="item.EventID"
                      @change="eventChange" style="width:180px;margin:0 5px;" size="small">
                      <el-option
                        v-for="it in eventType"
                        :key="it.EventId"
                        :label="it.EventShowName"
                        :value="it.EventId"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delShijian(item)" v-if="eventAry.length>1"></i>
                </li>
                <a @click="addShijian" style="cursor:pointer">添加</a>
                <i class="rubbish-icon"></i>
                <p style="color:red" v-if="IsEventRepeated">
                  <i class="el-icon-info" style="color:#888; margin:0 5px;color:red"></i>
                  請勿重複配置
                </p>
              </ul>
            </div>
            <p class="red-text">{{`該告警觸發條件範本已經關聯了${infoData.PolicyGroups?infoData.PolicyGroups.length:0}個策略，若修改，修改內容將應用到所有已關聯的告警策略上`}}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;margin-top:20px">
          <el-button :disabled="isRepeated||(!checkedZhibiao&&!checkedGaojing)||IsEventRepeated" @click="submitEdit" type="primary" size="small">保存</el-button>
          <el-button size="small" @click="showDelDialog3=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProductTypeCpt from '@/views/CM/CM_assembly/product_type'
import {
  GET_GROUP_LIST,
  GET_POLICY_GROUP_TYPE,
  GET_CONDITIONSTEMPLATELIST,
  MODIFYPOLICYGROUPINFO,
  GET_PROJECTNAME,
  EDIT_TEMPLATE
} from '@/constants/CM-yhs.js'
// import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共错误码
import moment from 'moment'
export default {
  name: 'templateInfo',
  data () {
    return {
      loading: true,
      openEditloadShow: true, // 打开编辑弹窗指标告警的加载
      openLoadShow:false,//打开编辑弹窗的加载
      isRepeated: false, // 重复警告是否显示
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
      id: '', // 範本id
      editGroupName: '', // 编辑的範本名称
      editRemark: '', // 编辑的备注
      Conditions: [], // 策略类型
      ConditionsAry:[],//指标告警数组
      tongjiZQ: [{ label: '統計週期1分鍾', value: 60 }, { label: '統計週期5分鍾', value: 300 }],
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      continuePeriod: [// 持续週期
        { label: '持續1個週期', value: 1 },
        { label: '持續2個週期', value: 2 },
        { label: '持續3個週期', value: 3 },
        { label: '持續4個週期', value: 4 },
        { label: '持續5個週期', value: 5 }
      ],
      jinggaoZQ: [// 警告週期
        { label: '不重複', value: 0 },
        { label: '每5分鍾警告壹次', value: 300 },
        { label: '每10分鍾警告壹次', value: 600 },
        { label: '每15分鍾警告壹次', value: 900 },
        { label: '每30分鍾警告壹次', value: 1800 },
        { label: '每1小時警告壹次', value: 3600 },
        { label: '每2小時警告壹次', value: 7200 },
        { label: '每3小時警告壹次', value: 10800 },
        { label: '每6小時警告壹次', value: 21600 },
        { label: '每12小時警告壹次', value: 43200 },
        { label: '每1天警告壹次', value: 86400 },
        { label: '週期指數遞增', value: 1 }
      ],
      formInline: {
        jieshou: '接收組',
        jieshouArr: [
          { value: '0', name: '接收組' },
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
        projectName: '預設專案',
        project: [
          {
            value: 0,
            name: '預設專案'
          }
        ]
      },
      indexAry: [], // 编辑弹框打开后的指标告警数组
      zhibiaoType: [], // 触发条件数据
      eventAry: [], // 事件告警数组
      eventType:[],//事件告警类型数组
      IsEventRepeated:false,//添加事件告警类型是否重复
      meetConditions: [{ label: '任意', value: 0 }, { label: '所有', value: 1 }], // 满足条件
      UnionRule: 0, // 双向绑定的满足条件
      all_alarm: 86400, // 满足条件为 所有 时告警值
      groupList: [], // 策略组列表
      channelList: [], // 管道列表
      PolicyGrouplist: [], // 关联政策组列表
      allProjectName: [], // 项目名称列表
      projectId: 0,
      searchParam: {},
      //  value: 'ins-6oz38wnu', label: 'instance-id'  cvm_device
      productValue: ''
    }
  },
  watch: {
    indexAry: {
      handler: function (val) {
        let temp = []
        val.forEach((ele, i) => {
          let tempObj = this.zhibiaoType.find(item => {
            return item.MetricId === ele.MetricID
          })
          if (tempObj) {
            this.indexAry[i].Unit = tempObj.MetricUnit
          }
          !temp.some(it => it.MetricID === ele.MetricID) && temp.push(ele)
        })
        if (val.length === temp.length) {
          this.isRepeated = false
        } else {
          this.isRepeated = true
        }
      },
      deep: true
    }
  },
  components: {
    // Loading,
    ProductTypeCpt
  },
  created () {
    this.id = this.$route.params.id
    this.getInfo()
  },
  methods: {
    async getInfo () {
      // await this.getPolicyType()
      await this.getProjectName()
      await this.getDetailInfo()
      // await this.getPolicyGroupList()
    },
    // 獲取策略類型
    async getPolicyType  () {
      // this.loadShow = true
      // let params = {
      //   Version: '2018-07-24',
      //   // Region:"",
      //   Module: 'monitor'
      // }
      // this.loadShow = true
      // await this.axios.post(GET_POLICY_GROUP_TYPE, params).then(res => {
      //   if (res.Response.Error === undefined) {
      //     this.Conditions = res.Response.Conditions
      //     // console.log(this.Conditions)
      //     this.loadShow = false
      //   } else {
      //     this.loadShow = false
      //     let ErrTips = {}
      //     let ErrOr = Object.assign(ErrorTips, ErrTips)
      //     this.$message({
      //       message: ErrOr[res.Response.Error.Code],
      //       type: 'error',
      //       showClose: true,
      //       duration: 0
      //     })
      //   }
      // })
    },
    // 获取项目名称
    async getProjectName () {
      this.axios.get(GET_PROJECTNAME).then(res => {
        if (res.codeDesc === 'Success') {
          // console.log(res)
          this.allProjectName = res.data
        } else {
          let ErrTips = {
            InternalError: '內部錯誤',
            UnauthorizedOperation: '未授權操作'
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
        if (res.Response.Error === undefined) {
          var msg = res.Response.TemplateGroupList
          // let ct = this.Conditions
          msg.forEach((ele, i) => {
            this.productValue = ele.ViewName
            // ct.forEach((k, j) => {
            //   if (ele.ViewName === k.PolicyViewName) {
            //     ele['Name'] = k.Name
            //   }
            // }) 
            // this.indexAry = ele.Conditions           
            ele.Conditions.forEach((item, i) => {
              let ct = Number(item.CalcType)
              item.CalcType = this.SymbolList[ct - 1]
              let time1 = item.AlarmNotifyPeriod / 60
              let time2 = item.AlarmNotifyPeriod / (60 * 60)
              if (item.AlarmNotifyPeriod == 0 && item.AlarmNotifyType == 0) {
                item.alarm = '不重複告警'              
              } else if (item.AlarmNotifyType == 1) {
                item.alarm = '按周期指數遞增重複告警'               
              } else if (item.AlarmNotifyPeriod > 0 && time1 <= 30) {
                item.alarm = `按${time1}分鍾重複告警`                
              } else if (item.AlarmNotifyPeriod > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小時重複告警`                
              } else {
                item.alarm = '按1天重複告警'               
              }
            })
            this.infoData = ele
            this.ConditionsAry = [...ele.Conditions]            
          })
          // this.infoData = msg[0]
          this.loadShow = false
        } else {
          this.loadShow = false
          this.errorPrompt(res)
        }
      })
    },
    passData (item) {
      this.productValue = item.productValue
      this.eventType = item.EventMetrics
      this.zhibiaoType = item.Metrics.filter(v=>{
        return v.MetricShowName!=="磁碟只讀"&&v.MetricShowName!=="機器重啟"&&v.MetricShowName!=="ping不可達"
      })
      // this.zhibiaoType = item.Metrics
      this.$nextTick(() => {
        this.openEditloadShow = false
      })
    },
    //打开编辑弹框的回调
    async openEdit(){
      this.showDelDialog3 = true
      this.openLoadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupID: this.id
      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res=>{
        if (res.Response.Error === undefined){
          var msg = res.Response.TemplateGroupList
          msg.forEach(ele=>{            
            ele.Conditions.forEach((item,i)=>{
              let ct = Number(item.CalcType)
              item.CalcType = this.SymbolList[ct - 1]
              let time = item.Period / 60
              let num = item.ContinueTime / (time * 60)
              item['ContinueTime'] = Number(num)
              let time1 = item.AlarmNotifyPeriod / 60
              let time2 = item.AlarmNotifyPeriod / (60 * 60)
              if (item.AlarmNotifyPeriod == 0 && item.AlarmNotifyType == 0) {
                item.RepeatedAlarm = 0
                this.all_alarm = 0
              } else if (item.AlarmNotifyType == 1) {
                item.RepeatedAlarm = 1
                 this.all_alarm = 1
              } else if (item.AlarmNotifyPeriod > 0 && time1 <= 30) {
                item.RepeatedAlarm = item.AlarmNotifyPeriod
                this.all_alarm = item.AlarmNotifyPeriod
              } else if (item.AlarmNotifyPeriod > 0 && time1 > 30 && time2 < 24) {
                item.RepeatedAlarm = item.AlarmNotifyPeriod
                this.all_alarm = item.AlarmNotifyPeriod
              } else {
                item.RepeatedAlarm = item.AlarmNotifyPeriod
                this.all_alarm = item.AlarmNotifyPeriod
              }
            })
            ele.EventConditions.forEach(it=>{
              it.EventID = Number(it.EventID)
            })
            this.indexAry = ele.Conditions
            this.eventAry = ele.EventConditions// 編輯觸發條件
            if (ele.IsUnionRule === 0) {
              this.UnionRule = 0
            } else if (ele.IsUnionRule === 1) {
              this.UnionRule = 1
            }
          })
          this.openLoadShow = false
        }else{
          this.openLoadShow = false
          this.errorPrompt(res)
        }
      })
    },
    // 保存編輯條件模板
    submitEdit () {
      let { GroupID, GroupName, ViewName } = this.infoData
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        IsUnionRule: this.UnionRule,
        GroupID: GroupID,
        ViewName: ViewName,
        GroupName: GroupName
      }
      if(checkedZhibiao){
      this.indexAry.forEach((ele, i) => {
        params[`Conditions.${i}.CalcValue`] = Number(ele.CalcValue)// 百分比
        params[`Conditions.${i}.MetricID`] = ele.MetricID// 指標類型id值
        params[`Conditions.${i}.CalcPeriod`] = ele.Period// 統計周期
        params[`Conditions.${i}.ContinuePeriod`] = ele.ContinueTime// 持續周期
        this.SymbolList.forEach((item3, index) => {
          var CT
          if (ele.CalcType == item3) {
            CT = index + 1
            params[`Conditions.${i}.CalcType`] = CT// 符號
          }
        })
        this.jinggaoZQ.forEach(item4 => {
          var AM
          if (ele.RepeatedAlarm == item4.value && ele.RepeatedAlarm !== 1) {
            AM = item4.value
            params[`Conditions.${i}.AlarmNotifyPeriod`] = AM
            params[`Conditions.${i}.AlarmNotifyType`] = 0
          }
          if (ele.RepeatedAlarm == 1) {
            // params[`Conditions.${i}.AlarmNotifyPeriod`] = ''
            params[`Conditions.${i}.AlarmNotifyType`] = 1
          }
        })
        if (this.UnionRule == 1 && this.all_alarm !== 1) {
          params[`Conditions.${i}.AlarmNotifyPeriod`] = this.all_alarm
          params[`Conditions.${i}.AlarmNotifyType`] = 0
        } else if (this.UnionRule == 1 && this.all_alarm == 1) {
          params[`Conditions.${i}.AlarmNotifyType`] = 1
        }
      })
      }
      if(this.eventAry.length&&checkedGaojing){
        this.eventAry.forEach((ele,i)=>{
          params[`EventConditions.${i}.EventID`] = ele.EventID
          params[`EventConditions.${i}.AlarmNotifyPeriod`] = 0
          params[`EventConditions.${i}.AlarmNotifyType`] = 0
        })
      }
      this.axios.post(EDIT_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.showDelDialog3 = false
          this.getDetailInfo()
        }else{
          this.showDelDialog3 = false
          this.errorPrompt(res)
        }
      })
    },
    // 獲取策略組列表(未完成  參數有誤)
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
                  this.channelList.push('郵件')
                } else if (item === 'SMS') {
                  this.channelList.push('簡訊')
                } else if (item === 'WECHAT') {
                  this.channelList.push('微信')
                }
              })
            }
          })
          this.groupList = msg
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
    openName (name) { // 修改名字彈框
      this.editGroupName = name
      this.showDelDialog1 = true
    },
    // 修改名稱
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
    openRemark (remark) { // 修改備注彈框
      this.editRemark = remark
      this.showDelDialog2 = true
    },
    // 修改備注
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
    // 格式化時間
    upTime (value) {
      // return moment(value).format('YYYY/MM/DD HH :mm:ss')
      return moment(value).format('HH :mm:ss')
    },
    addZhibiao () { // 添加觸發條件的指標告警
      let { zhibiaoType } = this
      for (let i = 0; i < zhibiaoType.length; i++) {
        let result = this.indexAry.some(item => {
          return item.MetricID === zhibiaoType[i].MetricId
        })
        this.isRepeated = result
        if (!result) {
          this.indexAry.push({
            Period: 60,
            CalcType: '>',
            CalcValue: '0',
            ContinueTime: 1,
            MetricID: zhibiaoType[i].MetricId,
            Unit: zhibiaoType[i].MetricUnit,
            RepeatedAlarm: 86400
          })
          return
        }
      }
      // 如果不 return 就把陣列第壹個push進來
      this.indexAry.push({
        Period: 60,
        CalcType: '>',
        CalcValue: '0',
        ContinueTime: 1,
        MetricID: zhibiaoType[0].MetricId,
        Unit: zhibiaoType[0].MetricUnit,
        RepeatedAlarm: 86400
      })
    },
    delZhibiao (it) { // 刪除觸發條件的指標告警
      var index = this.indexAry.indexOf(it)
      if (index !== -1) {
        this.indexAry.splice(index, 1)
      }
    },
    addShijian () { // 添加觸發條件的事件告警
      let { eventType,eventAry } = this
      for(let i = 0;i<eventType.length;i++){
        let msg = eventAry.some(item=>{
          return item.EventID === eventType[i].EventId
        })
        this.IsEventRepeated = msg
        if(!msg){
          eventAry.push({
            EventID:eventType[i].EventId,
            AlarmNotifyPeriod:0,
            AlarmNotifyType:0,
          });
          return
        }
      }
      eventAry.push({
        EventID:eventType[0].EventId,
        AlarmNotifyPeriod:0,
        AlarmNotifyType:0,
      });
    },
    delShijian (item) { // 刪除觸發條件的事件告警
      var index = this.eventAry.indexOf(item)
      if (index !== -1) {
        this.eventAry.splice(index, 1)
      }
    },
    eventChange(val){//事件告警选中值的改变 验证
      let ary = []
      this.eventAry.forEach(ele=>[
        !ary.some(item=>{
          return item.EventID === val
        }) && ary.push(ele)
      ])
      if(ary.length===this.eventAry.length){
        this.IsEventRepeated = false
      }else{
        this.IsEventRepeated = true
      }
    },
    Type_loading(val) {
      this.loading = val;
    },
    // 錯誤提示
    errorPrompt (res) {
      let ErrTips = {
        'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文檔對鑒權的說明。',
        'DryRunOperation': 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
        'FailedOperation': '操作失敗。',
        'FailedOperation.AlertFilterRuleDeleteFailed': '刪除過濾條件失敗。',
        'FailedOperation.AlertPolicyCreateFailed': '創建告警策略失敗。',
        'FailedOperation.AlertPolicyDeleteFailed': '告警策略刪除失敗。',
        'FailedOperation.AlertPolicyDescribeFailed': '告警策略查詢失敗。',
        'FailedOperation.AlertPolicyModifyFailed': '告警策略修改失敗。',
        'FailedOperation.AlertTriggerRuleDeleteFailed': '刪除觸發條件失敗。',
        'FailedOperation.DbQueryFailed': '數據庫查詢失敗。',
        'FailedOperation.DbRecordCreateFailed': '創建數據庫記錄失敗。',
        'FailedOperation.DbRecordDeleteFailed': '數據庫記錄刪除失敗。',
        'FailedOperation.DbRecordUpdateFailed': '數據庫記錄更新失敗。',
        'FailedOperation.DbTransactionBeginFailed': '數據庫事務開始失敗。',
        'FailedOperation.DbTransactionCommitFailed': '數據庫事務提交失敗。',
        'FailedOperation.DimQueryRequestFailed': '請求維度查詢服務失敗。',
        'FailedOperation.DruidQueryFailed': '查詢分析數據失敗。',
        'FailedOperation.DuplicateName': '名字重複。',
        'FailedOperation.ServiceNotEnabled': '服務未啓用，開通服務後方可使用。',
        'InternalError': '內部錯誤。',
        'InternalError.ExeTimeout': '執行超時。',
        'InvalidParameter': '參數錯誤。',
        'InvalidParameter.InvalidParameter': '參數錯誤。',
        'InvalidParameter.InvalidParameterParam': '參數錯誤。',
        'InvalidParameterValue': '無效的參數值。',
        'LimitExceeded': '超過配額限制。',
        'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
        'MissingParameter': '缺少參數錯誤。',
        'ResourceInUse': '資源被占用。',
        'ResourceInsufficient': '資源不足。',
        'ResourceNotFound': '資源不存在。',
        'ResourceUnavailable': '資源不可用。',
        'ResourcesSoldOut': '資源售罄。',
        'UnauthorizedOperation': '未授權操作。',
        'UnknownParameter': '未知參數錯誤。',
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
        return '預設專案'
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
        return '郵件'
      } else if (val === 'SMS') {
        return '簡訊'
      } else if (val === 'WECHAT') {
        return '微信'
      } else if (val === 'CALL') {
        return '電話'
      }
    },
    ViewName (val) {
      if (val) {
        if (val === 'cvm_device') {
          return '雲伺服器'
        } else if (val === 'BS') {
          return '雲硬碟'
        } else if (val === 'VPN_GW') {
          return 'VPN閘道'
        } else if (val === 'vpn_tunnel') {
          return 'VPN通道'
        } else if (val === 'nat_tc_stat') {
          return 'NAT閘道'
        } else if (val === 'DC_GW') {
          return '專線閘道'
        } else if (val === 'cdb_detail') {
          return 'MYSQL'
        } else if (val === 'REDIS-CLUSTER') {
          return 'Redis'
        } else if (val === 'dcchannel') {
          return '專用通道'
        } else if (val === 'dcline') {
          return '物理專線'
        } else if (val === 'COS') {
          return '物件儲存'
        }
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
.tips {
  height:45px;
  line-height:45px;
  color: #b43537;
  font-size: 14px;
  background-color: #fcecec;
  border:1px solid #f6b5b5;
  padding: 0 20px;
  margin-bottom:10px;
}
</style>
