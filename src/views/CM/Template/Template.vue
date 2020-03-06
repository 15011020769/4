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
      <el-table style="width: 100%" height="450" :data="tableData" v-loading="loadShow"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column prop="groupName" label="模板名称">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="`策略名称: ${scope.row.groupName}`">
              <span class="tke-text-link" slot="reference">{{scope.row.groupName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="chufa" label="触发条件">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>
                <p style="color:#999">指标告警(任意):</p>
                {{ `${scope.row.conditions[0].metricShowName}>${scope.row.conditions[0].calcValue}${scope.row.conditions[0].unit},持续${scope.row.conditions[0].continueTime}秒,按${scope.row.conditions[0].calcType}天重复告警` }}
              </p>
              <p>
                <p style="color:#999">事件告警:</p>
                {{ `${scope.row.eventConditions[0].eventShowName},不重复告警` }}
              </p>
              <div slot="reference" class="name-wrapper">
                <p class="textEps">
                  {{ `${scope.row.conditions[0].metricShowName}>${scope.row.conditions[0].calcValue}${scope.row.conditions[0].unit},持续${scope.row.conditions[0].continueTime}秒,按${scope.row.conditions[0].calcType}天重复告警` }}
                </p>
                <p class="textEps">
                  {{ `${scope.row.eventConditions[0].eventShowName},不重复告警` }}
                </p>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="策略类型"></el-table-column>
        <el-table-column prop="YS" label="备注">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :content="scope.row.remark">
              <span class="textEps" slot="reference">{{scope.row.remark || '-'}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="绑定告警策略数">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" content="点击查看详情">
              <span class="tke-text-link" slot="reference">{{`${scope.row.policyGroups.length}个`}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="qudao" sortable label="最后修改">
          <template slot-scope="scope">
            <span class="textEps">{{scope.row.lastEditUin}}</span>
            <span>{{upTime(scope.row.updateTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- <template :slot-scope="$scope.row">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-button type="text" class="deleteBtn" @click="delDate(scope.row.grounpId)">删除</el-button>
          </template> -->
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn" @click="copyBtn(scope.row.groupId)">复制</el-button>
            <el-button type="text" class="deleteBtn" @click="delBtn(scope.row.groupId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除弹框 -->
      <el-dialog :visible.sync="showDelDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">确定删除所选触发条件模板</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete()">确 定</el-button>
          <el-button @click="showDelDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 复制弹框 -->
      <el-dialog :visible.sync="showCopyDialog" width="35%">
        <p style="color:#444;font-weight:bolder;">复制所选触发条件模板</p>
        <p style="font-size:12px;margin-top:20px">是否复制 model测试改名</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="coptData()">确 定</el-button>
          <el-button @click="showCopyDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    <!-- 新建对话框 -->
    <Dialog :dialogVisible="panelFlag" @cancel="cancel" @save="save" style="margin:0;" />
  </div>
</template>

<script>
import Header from '@/components/public/Head'
import Dialog from './components/dialog'
import Loading from '@/components/public/Loading'
import moment from 'moment'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  name: 'Template',
  data () {
    return {
      loadShow: false, // 加载是否显示
      panelFlag: false, // dialog新建弹框
      // metricShowName:'',//指标显示名称
      // dialogFormVisible: false,
      showDelDialog: false, // 是否显示删除弹框
      showCopyDialog: false, // 是否显示复制弹框
      groupId: '', // 删除需要的id值
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
      // 分页
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
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
    // this.getReportUserLastVisit()
    this.getList()
    console.log(this.upTime(1583490304))
  },
  methods: {

    getReportUserLastVisit () {
      let params = {
        loginOwnerUin: 100011921910,
        loginUin: '100011921910',
        productName: '/monitor',
        skey: 'j5bbEd42OsF3A*lCvM*5ahGqKjM3hsXUilZJLhYsXPM_'
      }
      this.axios.post('ReportUserLastVisit', params).then(res => {
        console.log(res)
        // this.Dialog
      })
    },
    // 获取列表数据
    async getList () {
      this.loadShow = true
      let params = {
        groupName: '',
        lang: 'zh',
        limit: 20,
        offset: 0
        // Version: '2018-07-24'
      }
      if (this.triggerInput !== '') params.groupName = this.triggerInput
      await this.axios.post('monitor/GetConditionsTemplateList', params).then(res => {
        console.log(res.data.templateGroupList)
        this.TotalCount = res.data.total
        let msg = res.data.templateGroupList
        this.tableData = msg
        this.loadShow = false
        var abc = {
          // let ary = []
          // msg.forEach(ele => {
          //   let newTableData = {}
          //   let{ grounpId, groupName } = ele
          //   // let{ metricShowName, calcValue, unit, continueTime, calcType } = ele.conditions[0]
          //   newTableData.grounpId = grounpId
          //   newTableData.groupName = groupName
          //   newTableData.chufa = ele
          //   // newTableData.chufa = `${metricShowName}>${calcValue}${unit},持续${continueTime}秒,按${calcType}天重复告警`

          //   ary.unshift(newTableData)
          // })
          // this.tableData = ary
        }
      })
    },
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    },
    // 搜索框的事件
    // changeInput (val) {
    //   this.triggerInput = val
    // },
    // 点击所搜按钮的事件
    clickSerch (val) {
      console.log(val)
      this.triggerInput = val
      this.getList()
    },
    // 删除按钮
    delBtn (id) {
      this.showDelDialog = true
      this.groupId = id
      // console.log(id)
    },
    // 复制按钮
    copyBtn (id) {
      this.showCopyDialog = true
      this.groupId = id
    },
    // 复制数据
    async coptData () {
      this.loadShow = true
      let params = {
        groupId: this.groupId,
        lang: 'zh'
      }
      await this.axios.post('monitor/CopyConditionsTemplate', params).then(res => {
        if (res.codeDesc == 'Success') {
          this.showCopyDialog = false
          this.getList()
          console.log(res)
          this.loadShow = false
        } else {
          this.loadShow = false
          this.errorPrompt(res)
        }
      })
    },
    // 删除对应的数据
    async submitDelete () {
      let params = {
        groupId: this.groupId,
        isDelRelatedPolicy: 2,
        lang: 'zh'
      }
      await this.axios.post('monitor/DeleteConditionsTemplate', params).then(res => {
        if (res.codeDesc == 'Success') {
          this.getList()
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
        'FailedOperation': '操作失敗',
        'InternalError': '必須包含開始時間和結束時間，且必須為整形時間戳（精確到秒）',
        'InvalidParameterValue.MaxResult': '內部錯誤',
        'InvalidParameter': '參數錯誤',
        'InvalidParameter.FormatError': '參數格式錯誤',
        'InvalidParameterValue': '參數取值錯誤',
        'InvalidParameterValue.InvalidFilter': 'Filter參數輸入錯誤',
        'InvalidParameterValue.Length': '參數長度錯誤',
        'UnauthorizedOperation': '未授權操作'
      }
      let ErrOr = Object.assign(ErrorTips, ErrTips)
      this.$message({
        message: ErrOr[res.Response.Error.Code],
        type: 'error',
        showClose: true,
        duration: 0
      })
    },
    // 设置弹框//新建实例分组
    buyMessgae () {
      // alert("11")
      this.panelFlag = true
    },
    // 取消设置弹框
    cancel () {
      this.panelFlag = false
    },
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
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
    }
  }
}
</script>

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
</style>
