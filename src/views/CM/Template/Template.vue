<template>
  <div class="Template-wrap">
    <Header title="觸發條件模板" />
    <div class="overview-main">
      <div class="explain">
        <p>
          触发条件模板功能支持对相同告警规则的复用和统一修改，点击查看
          <a>触发条件模板文档</a>
        </p>
      </div>
    </div>
    <div class="table">
      <div class="addBtn">
        <el-row>
          <el-button type="primary" @click="buyMessgae">新建</el-button>
        </el-row>
        <el-row class="seek">
          <el-input v-model="triggerInput" placeholder="请输入触发条件模板名搜索"></el-input>
          <el-button icon="el-icon-search" @click="clickSerch(triggerInput)" style="margin-left:-1px;"></el-button>
        </el-row>
      </div>
      <el-table style="width: 100%" height="500" :data="tableData" v-loading="loadShow"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column prop label="模板名称">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="`策略名称: ${scope.row.GroupName}`">
              <span class="tke-text-link" slot="reference" @click="goDetail(scope.row.GroupID,scope.row.GroupName)">{{scope.row.GroupName}}</span>
            </el-popover>
            <i class="el-icon-edit ml5" @click="showEditNameDlg(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="触发条件">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <div>
                <p style="color:#999;font-size:12px">指标告警(任意):</p>
                <p v-for="(it,i) in scope.row.Conditions" :key="i" style="font-size:12px">
                  {{ `${it.MetricDisplayName}${it.CalcType}${it.CalcValue}${it.Unit},持续${it.ContinueTime/60}分钟,${it.alarm}` }}</p>
              </div>
              <div v-if="scope.row.EventConditions.length">
                <p style="color:#999;font-size:12px">事件告警:</p>
                <p v-for="(it,i) in scope.row.EventConditions" :key="i" style="font-size:12px">
                  {{ `${it.EventDisplayName},不重复告警` }}</p>
              </div>
              <div slot="reference" class="name-wrapper">
                <p class="textEps" v-for="items in scope.row.Conditions.slice(0,3)" :key="items.MetricDisplayName">
                  {{ `${items.MetricDisplayName}
                      ${items.CalcType}
                      ${items.CalcValue}
                      ${items.Unit},持续
                      ${items.ContinueTime/60}分钟,
                      ${items.alarm}` }}
                </p>
                <p class="textEps"
                 v-for="items in scope.row.EventConditions.slice(0,3-scope.row.Conditions.length<=0?0:3-scope.row.Conditions.length)" :key="items.EventDisplayName">
                  {{ `${items.EventDisplayName},不重复告警` }}
                </p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="策略类型"
        :filter-method="filterName"
        :filters="PolicyType"
        :filter-multiple="false"
        filter-placement="top-start">
          <template slot-scope="scope">
            <span>{{scope.row.Name}}</span>
            <!-- <i class="el-icon-caret-bottom"></i> -->
          </template>
        </el-table-column>
        <el-table-column prop label="备注">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="scope.row.Remark||'-'">
              <span class="textEps" slot="reference">{{scope.row.Remark || '-'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop label="绑定告警策略数">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" content="点击查看详情">
              <span class="tke-text-link" slot="reference" @click="goDetail(scope.row.GroupID)">{{`${scope.row.PolicyGroups.length}个`}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop sortable label="最后修改">
          <template slot-scope="scope">
            <p>{{ scope.row.LastEditUin }}</p>
            <p>{{ scope.row.UpdateTime | formatDate }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn" @click="copyBtn(scope.row)">复制</el-button>
            <el-button type="text" class="deleteBtn" @click="delBtn(scope.row.GroupID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination
          @size-change="handleSizesChange"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :page-sizes="[10,20,50,100]"
          :current-page="currpage"
          :pager-count="7"
          layout="sizes,prev, pager, next"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑模板名称弹框 -->
    <el-dialog class="dil" :visible.sync="ShowEditDialog" width="25%" title="修改条件模板名称">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改条件模板名称</p> -->
          <div>
            <el-input maxlength="20" v-model="editGroupName" style="width:200px"></el-input>
            <p v-if="editGroupName==''" class="edit-text-tips">条件模板名称不能为空</p>
            <p v-if="editGroupName.length==20" class="edit-text-tips">条件模板名称不能超过20个字符</p>
          </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditName()">保 存</el-button>
        <el-button @click="ShowEditDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
      <el-dialog :visible.sync="showDelDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">确定删除所选触发条件模板吗?</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">确 定</el-button>
          <el-button @click="showDelDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 复制弹框 -->
      <el-dialog :visible.sync="showCopyDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">复制所选触发条件模板</p>
        <p style="font-size:12px;margin-top:20px">{{`是否复制${groupName}`}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="coptData()">确 定</el-button>
          <el-button @click="showCopyDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    <!-- 新建对话框 -->
    <Dialog @open="openDialogEvent" @close="closeDialogEvent"  :dialogVisible.sync="panelFlag" :Conditions="Conditions" @save="save" style="margin:0;" />
  </div>
</template>

<script>
import Header from '@/components/public/Head'
import Dialog from './components/dialog'
import Loading from '@/components/public/Loading'
import moment from 'moment'
import { ErrorTips } from '@/components/ErrorTips'
import {
  COPY_TEMPLATE,
  DELETE_TEMPLATE,
  GET_POLICY_GROUP_TYPE,
  GET_CONDITIONSTEMPLATELIST,
  MODIFYPOLICYGROUPINFO
} from '@/constants/CM-yhs.js'
export default {
  name: 'Template',
  data () {
    return {
      loadShow: false, // 加载是否显示
      panelFlag: false, // dialog新建弹框
      // metricShowName:'',//指标显示名称
      // dialogFormVisible: false,
      ShowEditDialog: false, // 是否显示修改名称弹框
      showDelDialog: false, // 是否显示删除弹框
      showCopyDialog: false, // 是否显示复制弹框
      groupId: '', // 删除需要的id值
      groupName: '', // 模板名称
      editGroupName: '', // 编辑的模板名称
      editGroupId: '', // 编辑的模板id
      // templateObj: {}, // 当前模板数据对象
      Conditions: [], // 策略类型
      PolicyType: [],//策略类型下拉框的策略名称
      formInline: {
        product_kind: [
          {
            value: 0,
            name: '产品类型'
          },
          {
            value: 1,
            name: '策略类型'
          }
        ], // 产品/.策略类型
        Template_kind: [
          {
            value: 0,
            name: '全选'
          },
          {
            value: 1,
            name: '云服务器'
          },
          {
            value: 2,
            name: '云数据库'
          }
        ], // 用户/组
        Template_name: '', // 策略名称
        alarm: '', // 告警对象
        alarm_list: [
          {
            name: '告警对象1'
          }
        ], // 告警对象数组
        user: '', // 用户
        group: '', // 组
        user_kind: [
          {
            value: '0',
            name: '用户组'
          },
          {
            vale: '1',
            name: '用户名'
          }
        ], // 用户类型数据
        kind_list: [
          {
            value: '0',
            name: '全选'
          },
          {
            value: '1',
            name: '误删'
          },
          {
            value: '2',
            name: '测试误删'
          }
        ], // 用户名类型数据
        product_value: '', // 产品
        Template_value: '' // 策略
      },
      tableData: [
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%,持续5分钟，不重复告警',
        //   object: '東崋雲计算有限公司',
        //   type: '默认云数据库-Redis-其他版本',
        //   YS: '3/3',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 13:52:55',
        //   qudao: '',
        //   zanting: true
        // },
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%,持续5分钟',
        //   object: '東崋雲计算有限公司',
        //   type: '默认云数据库',
        //   YS: '0/0',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 13:21:32',
        //   qudao: '',
        //   zanting: true
        // },
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%',
        //   object: '東崋雲计算有限公司',
        //   type: '東崋雲云数据库',
        //   YS: '15/15',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 7:16:46',
        //   qudao: '',
        //   zanting: true
        // },
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%,持续5分钟，不重复告警',
        //   object: '東崋雲计算有限公司',
        //   type: '默认云数据库-Redis-其他版本',
        //   YS: '3/3',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 13:52:55',
        //   qudao: '',
        //   zanting: true
        // },
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%,持续5分钟',
        //   object: '東崋雲计算有限公司',
        //   type: '默认云数据库',
        //   YS: '0/0',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 13:21:32',
        //   qudao: '',
        //   zanting: true
        // },
        // {
        //   grounpId: 3290043,
        //   groupName: '默认',
        //   isOpen: true,
        //   chufa: '容量使用率>80%',
        //   object: '東崋雲计算有限公司',
        //   type: '東崋雲云数据库',
        //   YS: '15/15',
        //   yiqiying: 3,
        //   shilishu: 3,
        //   lastEditUin: 100011921910,
        //   changeData: '2019/12/31 7:16:46',
        //   qudao: '',
        //   zanting: true
        // }
      ], // 表格数据
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      // 分页
      TotalCount: 0, // 总条数
      pageSize: 10, // 分页条数
      currpage: 0, // 当前页码
      operationFlag: -1, // 按钮禁用开关
      searchName: '',
      triggerInput: '' // 触发条件模板名
    }
  },
  components: {
    Header,
    Dialog,
    Loading
  },
  created () {
    this.getDataInit()
  },
  methods: {
    async getDataInit () {
      await this.getPolicyType()
      await this.getTemplateList()
    },
    // 打开新建弹窗时的回调
    openDialogEvent () {
      // this.getPolicyType()
    },
    // 关闭新建弹窗时的回调
    closeDialogEvent(){
      this.getTemplateList()
    },
    // 获取策略类型
    async getPolicyType  () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor'
      }
      this.loadShow = true
      await this.axios.post(GET_POLICY_GROUP_TYPE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.Conditions = res.Response.Conditions
          // console.log(this.Conditions)
          this.Conditions.forEach(ele => {
            this.PolicyType.push({ text: ele.Name, value: ele.Name })
          })
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
    // 获取触发条件列表
    async getTemplateList () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor'

      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
          this.TotalCount = res.Response.Total
          let msg = res.Response.TemplateGroupList
          let ct = this.Conditions
          for (let i in msg) {
            for (let j in ct) {
              if (msg[i].ViewName === ct[j].PolicyViewName) {
                msg[i]['Name'] = ct[j].Name
              }
            }
          }
          msg.forEach(ele => {
            ele.Conditions.forEach((item, i) => {
              let ct = Number(item.CalcType)
              let anp = item.AlarmNotifyPeriod
              item.CalcType = this.SymbolList[ct - 1]
              let time1 = anp / 60
              let time2 = anp / (60 * 60)
              if (anp == 0 && item.AlarmNotifyType == 0) {
                item.alarm = '不重复告警'
              } else if (item.AlarmNotifyType == 1) {
                item.alarm = '按周期指数递增重复告警'
              } else if (anp > 0 && time1 < 30) {
                item.alarm = `按${time1}分钟重复告警`
              } else if (anp > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小时重复告警`
              } else {
                item.alarm = '按1天重复告警'
              }
            })
          })
          this.tableData = msg
          this.loadShow = false
        } else {
          this.loadShow = false
          this.errorPrompt(res)
        }
      })
    },
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    },
    // 搜索按钮
    clickSerch (val) {
      // console.log(val)
      this.triggerInput = val
      this.getTemplateList()
    },
    // 编辑模板名称按钮
    showEditNameDlg (obj) {
      this.editGroupName = obj.GroupName
      this.editGroupId = obj.GroupID
      this.ShowEditDialog = true
      // this.templateObj = obj
    },
    // 确定编辑模板名称完成
    async submitEditName () {
      // let { groupId, groupName } = this.templateObj
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.editGroupId,
        GroupType: 3,
        Key: 'groupName',
        Value: this.editGroupName
        // lang: 'zh',
      }
      await this.axios.post(MODIFYPOLICYGROUPINFO, params).then(res => {
        if (res.Response.Error === undefined) {
          this.ShowEditDialog = false
          this.getTemplateList()
        } else {
          this.errorPrompt(res)
        }
      })
    },
    // 复制按钮
    copyBtn (row) {
      this.showCopyDialog = true
      this.groupId = row.GroupID
      this.groupName = row.GroupName
    },
    // 复制数据完成
    async coptData () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        // groupId: this.groupId,
        GroupID: this.groupId,
        Module: 'monitor'
        // lang: 'zh'
      }
      await this.axios.post(COPY_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.showCopyDialog = false
          this.getTemplateList()
          // console.log(res)
          this.$message.success('复制成功')
          this.loadShow = false
        } else {
          this.loadShow = false
          this.errorPrompt(res)
        }
      })
    },
    // 删除按钮
    delBtn (id) {
      this.showDelDialog = true
      this.groupId = id
      // console.log(id)
    },
    // 删除对应的数据完成
    async submitDelete () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupID: this.groupId,
        IsDeleteRelatedPolicy: 2
        // groupId: this.groupId,
        // isDelRelatedPolicy: 2,
        // lang: 'zh'
      }
      await this.axios.post(DELETE_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.getTemplateList()
          this.showDelDialog = false
          this.$message.success('删除成功')
        } else {
          this.showDelDialog = false
          this.errorPrompt(res)
        }
      })
    },
    // 错误提示
    errorPrompt (res) {
      let ErrTips = {
        'AuthFailure.UnauthorizedOperation': '请求未授权。请参考 CAM 文档对鉴权的说明。',
        'DryRunOperation': 'DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。',
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
    // 去详情页
    goDetail (id, name) {
      this.$router.push({
        // name: 'TemplateDetail',
        // query: {
        //   groupId: id,
        //   groupName: name
        // }
        path: `/Template/Detail/index/${id}`
        // params: { groupName: name }
      })
    },
    // 设置弹框//新建实例分组
    buyMessgae () {
      // alert("11")
      this.panelFlag = true
    },
    // 取消设置弹框
    // cancel () {
    //   this.panelFlag = false
    // },
    // 确定设置弹框
    save () {
      this.panelFlag = false
    },
    handleClose (done) {

      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    addTemplate () {
      // 新建触发条件模板
      this.dialogFormVisible = true
    },
    onSubmit () {
      console.log('submit!')
    },
    //策略类型下拉框回调
    filterName (value, row) {      
      return row.Name === value
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
      this.getTemplateList()
    },
    handleSizesChange (val) {
      this.pageSize = val
      this.getTemplateList()
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
<style lang="scss">
.el-table-filter .el-table-filter__list{
  height: 300px;
  overflow-y: scroll;
}
</style>
<style lang="scss" scoped>
.Template-wrap >>> .el-button,
.Template-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.Template-wrap >>> .el-dialog {
  width: 1000px;
  // height: 650px;
  // margin-top: 0;
}
.Template-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.Template-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.Template-wrap >>> .el-form-item__label {
  font-size: 12px;
  color: #888;
  font-weight: 200;
}
a {
  color: #006eff;
  cursor: pointer;
}
a:hover {
  border-bottom: 1px solid #006eff;
}
.cursor {
  cursor: pointer;
}
.Template-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.Template-wrap >>> .deleteBtn > span {
  color: #006eff;
}
.Template-wrap {
  border-radius: 0;
  .Template-filter {
    width: 100%;
    height: 100px;
  }
  .table {
    padding: 0 20px 20px 20px;
    .addBtn {
      width: 100%;
      height: 55px;
      padding: 20px 10px 0 10px;
      background: rgb(255, 255, 255);
      display: flex;
      justify-content: space-between;
      .seek {
        width: 240px;
        display: flex;
      }
      .iconBtn {
        font-size: 16px;
        color: #888;
        display: flex;
        align-items: center;
        > i {
          margin: 0 10px;
          font-weight: 600;
        }
        i:hover {
          cursor: pointer;
        }
      }
    }
    .Right-style {
      display: flex;
      justify-content: flex-end;

      .esach-inputL {
        width: 300px;
        margin-right: 20px;
      }
    }
    .pagstyle {
      padding: 20px;

      .pagtotal {
        font-size: 13px;
        font-weight: 400;
        color: #565656;
        line-height: 32px;
      }
    }
  }

  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
.tke-text-link {
    color: #006eff;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        color: #006eff;
    }
}
.textEps{
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
// .dialog-footer {
//   text-align: center;
//   .el-button {
//     height: 30px;
//     line-height: 30px;
//     border-radius: 0;
//   }
// }
.edit-text-tips{
  color: red;
  font-size: 12px;
  margin-top:10px;
}

</style>
