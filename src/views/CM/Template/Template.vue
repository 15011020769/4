<template>
  <div class="Template-wrap">
    <Header title="觸發條件範本" />
    <div class="overview-main">
      <div class="explain">
        <p>
          觸發條件範本功能支持對相同告警規則的複用和統壹修改
          <!-- ，點擊檢視<a>觸發條件範本文件</a> -->
        </p>
      </div>
    </div>
    <div class="table">
      <div class="addBtn">
        <el-row>
          <el-button type="primary" @click="buyMessgae">新建</el-button>
        </el-row>
        <el-row class="seek">
          <el-input v-model="triggerInput" placeholder="請輸入觸發條件範本名搜索"></el-input>
          <el-button icon="el-icon-search" @click="clickSerch(triggerInput)" style="margin-left:-1px;"></el-button>
        </el-row>
      </div>
      <el-table style="width: 100%" height="500" :data="tableData" v-loading="loadShow"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column prop label="範本名稱">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="`策略名稱: ${scope.row.GroupName}`">
              <span class="tke-text-link" slot="reference" @click="goDetail(scope.row.GroupID,scope.row.GroupName)">{{scope.row.GroupName}}</span>
            </el-popover>
            <i class="el-icon-edit ml5" @click="showEditNameDlg(scope.row)" style="cursor:pointer"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="觸發條件">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <div>
                <p style="color:#999;font-size:12px">指標告警({{scope.row.IsUnionRule==0?'任意':'所有'}}):</p>
                <p v-for="(it,i) in scope.row.Conditions" :key="i" style="font-size:12px">
                  {{ `${it.MetricDisplayName}${it.CalcType||'-'}${it.CalcValue||'-'}${it.Unit||''},持續${it.ContinueTime/60}分鍾,${it.alarm}` }}</p>
              </div>
              <div v-if="scope.row.EventConditions.length">
                <p style="color:#999;font-size:12px">事件告警:</p>
                <p v-for="(it,i) in scope.row.EventConditions" :key="i" style="font-size:12px">
                  {{ `${it.EventDisplayName},不重複告警` }}</p>
              </div>
              <div slot="reference" class="name-wrapper">
                <p class="textEps" v-for="items in scope.row.Conditions.slice(0,3)" :key="items.MetricDisplayName">
                  {{ `${items.MetricDisplayName}
                      ${items.CalcType||'-'}
                      ${items.CalcValue||'-'}
                      ${items.Unit||''},持續
                      ${items.ContinueTime/60}分鍾,
                      ${items.alarm}` }}
                </p>
                <p class="textEps"
                 v-for="items in scope.row.EventConditions.slice(0,3-scope.row.Conditions.length<=0?0:3-scope.row.Conditions.length)" :key="items.EventDisplayName">
                  {{ `${items.EventDisplayName},不重複告警` }}
                </p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- :filter-method="filterName"
        :filters="PolicyType"
        :filter-multiple="false"
        filter-placement="top-start" 策略類型下拉框屬性和方法-->
        <el-table-column prop="type" label="策略類型">
          <template slot-scope="scope">
            <span>{{scope.row.ViewName | ViewName}}</span>
            <!-- <i class="el-icon-caret-bottom"></i> -->
          </template>
        </el-table-column>
        <el-table-column prop label="備注">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="scope.row.Remark||'-'">
              <span class="textEps" slot="reference">{{scope.row.Remark || '-'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop label="綁定告警策略數">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" content="點擊檢視詳情">
              <span class="tke-text-link" slot="reference" @click="goDetail(scope.row.GroupID)">{{`${scope.row.PolicyGroups.length}個`}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop sortable label="最後修改">
          <template slot-scope="scope">
            <p>{{ scope.row.LastEditUin }}</p>
            <p>{{ scope.row.UpdateTime | formatDate }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn" @click="copyBtn(scope.row)">複製</el-button>
            <el-button type="text" class="deleteBtn" @click="delBtn(scope.row.GroupID)">刪除</el-button>
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
          :current-page="currentPage"
          :pager-count="7"
          layout="sizes,prev, pager, next"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑範本名称弹框 -->
    <el-dialog class="dil" :visible.sync="ShowEditDialog" width="25%" title="修改條件範本名稱">
      <!-- <p style="color:#444;font-weight:bolder;margin-bottom:30px">修改條件範本名稱</p> -->
          <div>
            <el-input maxlength="20" show-word-limit @input="editNameChange"
            v-model="editGroupName"></el-input>
            <p v-if="editGroupName==''" class="edit-text-tips">條件範本名稱不能爲空</p>
            <p v-if="VerifyName" class="edit-text-tips">含有非法字符,请输入1-20個中英文字符或下劃線</p>
          </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="editGroupName==''||VerifyName" @click="submitEditName()">保 存</el-button>
        <el-button @click="ShowEditDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
      <el-dialog :visible.sync="showDelDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">確定刪除所選觸發條件範本嗎?</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">確 定</el-button>
          <el-button @click="showDelDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 复制弹框 -->
      <el-dialog :visible.sync="showCopyDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">複製所選觸發條件範本</p>
        <p style="font-size:12px;margin-top:20px">{{`是否複製${groupName}`}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="coptData()">確 定</el-button>
          <el-button @click="showCopyDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    <!-- 新建对话框 -->
    <Dialog :createSuccess='getTemplateList' :dialogVisible.sync="panelFlag" :Conditions="Conditions" @save="save" style="margin:0;" />
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
      VerifyName:false,
      showDelDialog: false, // 是否显示删除弹框
      showCopyDialog: false, // 是否显示复制弹框
      groupId: '', // 删除需要的id值
      groupName: '', // 範本名称
      editGroupName: '', // 编辑的範本名称
      editGroupId: '', // 编辑的範本id
      // templateObj: {}, // 当前範本数据对象
      Conditions: [], // 策略类型
      PolicyType: [], // 策略类型下拉框的策略名称
      tableData: [], // 表格數據
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符號陣列
      // 分頁
      TotalCount: 0, // 總條數
      pageSize: 10, // 分頁條數
      currpage: 0, // 當前頁碼
      currentPage:0,
      operationFlag: -1, // 按鈕禁用開關
      searchName: '',
      triggerInput: '' // 觸發條件範本名
    }
  },
  components: {
    Header,
    Dialog,
    Loading
  },
  created () {
    this.getTemplateList()
  },
  methods: {
    // 获取触发条件列表
    async getTemplateList (val) {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        Limit: this.pageSize,
        Offset: this.currpage
      }
      if (this.triggerInput != '') {
        params['GroupName'] = val
      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.TotalCount = res.Response.Total
          let msg = res.Response.TemplateGroupList
          msg.forEach(ele => {
            ele.Conditions.forEach((item, i) => {
              let ct = Number(item.CalcType)
              let anp = item.AlarmNotifyPeriod
              item.CalcType = this.SymbolList[ct - 1]
              let time1 = anp / 60
              let time2 = anp / (60 * 60)
              if (anp == 0 && item.AlarmNotifyType == 0) {
                item.alarm = '不重複告警'
              } else if (item.AlarmNotifyType == 1) {
                item.alarm = '按週期指數遞增重複告警'
              } else if (anp > 0 && time1 <= 30) {
                item.alarm = `按${time1}分鍾重複告警`
              } else if (anp > 0 && time1 > 30 && time2 < 24) {
                item.alarm = `按${time2}小時重複告警`
              } else {
                item.alarm = '按1天重複告警'
              }
            })
          })
          this.tableData = msg
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {
            'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文件對鑒權的說明。',
            DryRunOperation: 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
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
            InternalError: '內部錯誤。',
            'InternalError.ExeTimeout': '執行超時。',
            InvalidParameter: '參數錯誤。',
            'InvalidParameter.InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameterParam': '參數錯誤。',
            InvalidParameterValue: '無效的參數值。',
            LimitExceeded: '超過配額限制。',
            'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
            MissingParameter: '缺少參數錯誤。',
            ResourceInUse: '資源被占用。',
            ResourceInsufficient: '資源不足。',
            ResourceNotFound: '資源不存在。',
            ResourceUnavailable: '資源不可用。',
            ResourcesSoldOut: '資源售罄。',
            UnauthorizedOperation: '未授權操作。',
            UnknownParameter: '未知參數錯誤。',
            UnsupportedOperation: '操作不支持。'
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
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    },
    // 搜索按钮
    clickSerch (val) {
      if (this.triggerInput == '') {
        this.getTemplateList()
      } else {
        this.getTemplateList(val)
      }
    },
    // 编辑範本名称按钮
    showEditNameDlg (obj) {
      this.editGroupName = obj.GroupName
      this.editGroupId = obj.GroupID
      this.ShowEditDialog = true
      // this.templateObj = obj
    },
    //编辑名称的验证
    editNameChange(val){
      let rg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if(!rg.test(val)&&this.editGroupName!==''){
        this.VerifyName = true
      }else{
        this.VerifyName = false
      }
    },
    // 确定编辑範本名称完成
    async submitEditName () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.editGroupId,
        GroupType: 3,
        Key: 'groupName',
        Value: this.editGroupName
      }
      await this.axios.post(MODIFYPOLICYGROUPINFO, params).then(res => {
        if (res.Response.Error === undefined) {
          this.ShowEditDialog = false
          this.getTemplateList()
          this.$message({
            message: '條件範本名稱修改成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
        } else {
          let ErrTips = {
            'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文件對鑒權的說明。',
            DryRunOperation: 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
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
            InternalError: '內部錯誤。',
            'InternalError.ExeTimeout': '執行超時。',
            InvalidParameter: '參數錯誤。',
            'InvalidParameter.InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameterParam': '參數錯誤。',
            InvalidParameterValue: '無效的參數值。',
            LimitExceeded: '超過配額限制。',
            'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
            MissingParameter: '缺少參數錯誤。',
            ResourceInUse: '資源被占用。',
            ResourceInsufficient: '資源不足。',
            ResourceNotFound: '資源不存在。',
            ResourceUnavailable: '資源不可用。',
            ResourcesSoldOut: '資源售罄。',
            UnauthorizedOperation: '未授權操作。',
            UnknownParameter: '未知參數錯誤。',
            UnsupportedOperation: '操作不支持。'
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
        GroupID: this.groupId,
        Module: 'monitor'
      }
      await this.axios.post(COPY_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.showCopyDialog = false
          this.getTemplateList()
          this.$message({
            message: '複製成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {
            'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文件對鑒權的說明。',
            DryRunOperation: 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
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
            InternalError: '內部錯誤。',
            'InternalError.ExeTimeout': '執行超時。',
            InvalidParameter: '參數錯誤。',
            'InvalidParameter.InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameterParam': '參數錯誤。',
            InvalidParameterValue: '無效的參數值。',
            LimitExceeded: '超過配額限制。',
            'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
            MissingParameter: '缺少參數錯誤。',
            ResourceInUse: '資源被占用。',
            ResourceInsufficient: '資源不足。',
            ResourceNotFound: '資源不存在。',
            ResourceUnavailable: '資源不可用。',
            ResourcesSoldOut: '資源售罄。',
            UnauthorizedOperation: '未授權操作。',
            UnknownParameter: '未知參數錯誤。',
            UnsupportedOperation: '操作不支持。'
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
      }
      await this.axios.post(DELETE_TEMPLATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.getTemplateList()
          this.showDelDialog = false
          this.$message({
            message: '刪除成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
        } else {
          this.showDelDialog = false
          let ErrTips = {
            'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文件對鑒權的說明。',
            DryRunOperation: 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
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
            InternalError: '內部錯誤。',
            'InternalError.ExeTimeout': '執行超時。',
            InvalidParameter: '參數錯誤。',
            'InvalidParameter.InvalidParameter': '參數錯誤。',
            'InvalidParameter.InvalidParameterParam': '參數錯誤。',
            InvalidParameterValue: '無效的參數值。',
            LimitExceeded: '超過配額限制。',
            'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
            MissingParameter: '缺少參數錯誤。',
            ResourceInUse: '資源被占用。',
            ResourceInsufficient: '資源不足。',
            ResourceNotFound: '資源不存在。',
            ResourceUnavailable: '資源不可用。',
            ResourcesSoldOut: '資源售罄。',
            UnauthorizedOperation: '未授權操作。',
            UnknownParameter: '未知參數錯誤。',
            UnsupportedOperation: '操作不支持。'
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
    // 错误提示
    errorPrompt (res) {
      let ErrTips = {
        'AuthFailure.UnauthorizedOperation': '請求未授權。請參考 CAM 文件對鑒權的說明。',
        DryRunOperation: 'DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。',
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
        InternalError: '內部錯誤。',
        'InternalError.ExeTimeout': '執行超時。',
        InvalidParameter: '參數錯誤。',
        'InvalidParameter.InvalidParameter': '參數錯誤。',
        'InvalidParameter.InvalidParameterParam': '參數錯誤。',
        InvalidParameterValue: '無效的參數值。',
        LimitExceeded: '超過配額限制。',
        'LimitExceeded.MetricQuotaExceeded': '指標數量達到配額限制，禁止含有未注冊指標的請求。',
        MissingParameter: '缺少參數錯誤。',
        ResourceInUse: '資源被占用。',
        ResourceInsufficient: '資源不足。',
        ResourceNotFound: '資源不存在。',
        ResourceUnavailable: '資源不可用。',
        ResourcesSoldOut: '資源售罄。',
        UnauthorizedOperation: '未授權操作。',
        UnknownParameter: '未知參數錯誤。',
        UnsupportedOperation: '操作不支持。'
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
      })
    },
    // 设置弹框//新建实例分组
    buyMessgae () {
      this.panelFlag = true
    },
    // 确定设置弹框
    save () {
      this.panelFlag = false
    },
    // 策略类型下拉框回调
    // filterName (value, row) {
    //   return row.Name === value
    // },
    // 分页
    handleCurrentChange (val) {
      this.currpage = (val - 1)* this.pageSize;
      this.getTemplateList()
      this.currentPage = val
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
<style lang="scss">
  // .el-table-filter .el-table-filter__list{
  //   height: 300px;
  //   overflow-y: scroll;
  // }
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
