<template>
  <div class="StrategyDetail wrap">
    <div class="top">
      <img style="width:20px;cursor: pointer;" @click="back" src="../../../assets/CAM/images/left.png" alt />
      <span class="top_text">{{$t('CAM.strategy.clxq')}}</span>
    </div>
    <div class="container">
      <div class="baseInfo" v-loading="infoLoad">
        <p class="baseInfo_title">{{$t('CAM.strategy.jbxx')}}</p>
        <div class="baseInfo_flex">
          <div class="baseInfo_left">
            <p class="baseInfo_cl item">{{$t('CAM.Role.strategy')}}</p>
            <p class="baseInfo_ms item">{{$t('CAM.userList.descs')}}</p>
            <p class="baseInfo_mark item">{{$t('CAM.userGroup.colRemark')}}</p>
            <p class="baseInfo_type item">{{$t('CAM.Role.strategyType')}}</p>
            <p class="baseInfo_time item">{{$t('CAM.userList.createTime')}}</p>
          </div>
          <div class="baseInfo_right">
            <p class="baseInfo_cl item">{{policy.PolicyName}}</p>
            <p class="baseInfo_ms item">{{policy.Description}}</p>
            <p class="baseInfo_mark item">
              <el-input v-if="input_show" v-model="input_Value" size="mini" style="width:150px" :placeholder="$t('CAM.strategy.inputContent')"></el-input>
              <a v-if="input_show" @click="input_sure" style="margin-left:10px" href="javascript:;">{{$t('CAM.userGroup.delConfirmBtn')}}</a>
              <a v-if="input_show" @click="input_cancel" style="margin-left:10px" href="javascript:;">取消</a>
              <span v-if="!input_show">{{inputValue}}</span>
              <i v-if="!input_show" @click="icon_click" style="cursor: pointer;" class="el-icon-edit item"></i>
            </p>
            <p class="baseInfo_type item">{{Type[policy.Type]}}</p>
            <p class="baseInfo_time item">{{policy.AddTime}}</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('CAM.strategy.starLangu')" name="first">
            <div ref="monaco" style="height: 400px;" v-loading="loadingMonaco"></div>
            <!-- <div class="markdown" v-html="formatJson(policy.PolicyDocument)"></div> -->
          </el-tab-pane>
          <!-- tab 策略详情页面，关联用户组tab  start -->
          <el-tab-pane :label="$t('CAM.strategy.straGroup')" name="second">
            <div class="config" v-loading="loading">
              <p style="margin:10px">
                <el-button type="primary" @click="Relation_user" size="small">{{$t('CAM.strategy.straGroup')}}</el-button>
                <el-button type="primary" @click="Relieve_user" size="small">{{$t('CAM.strategy.outBindUser')}}</el-button>
              </p>
              <div class="config_table">
                <el-table :data="policysData" height="300" :row-style="{height:0}" :cell-style="{padding:'5px 10px'}" :header-cell-style="{height:'20px',padding:'0px 10px'}" style="width: 100%" :empty-text="$t('CAM.strategy.zwsj')" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" prop="Id" width="80"></el-table-column>
                  <el-table-column prop="date" :label="$t('CAM.strategy.straGroup')">
                    <template slot-scope="scope">
                      <el-button @click="handleClickPolicies(scope.row)" type="text" size="small">{{scope.row.Name}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">
                      <el-dropdown trigger="click" @command="handleCommand" size="mini" style="cursor: pointer;">
                        <span style="color:#909399">
                          {{ tableTitle }}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="item in table_options" :key="item.value" :command="item">{{item.label}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                      <p v-show="scope.row.RelatedType == '1'">用戶</p>
                      <p v-show="scope.row.RelatedType == '2'">用戶組</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                      <el-popover placement="bottom" width="280" v-model="scope.row.delDialog">
                        <div class="prpoDialog">
                          <p>解除此用戶{{scope.row.RelatedType == '2' ? '組' : ''}}後，將不具備該策略對應的許可權，是否確認？</p>
                        </div>
                        <div style="text-align: center; margin: 0">
                          <el-button size="mini" type="text" @click="removePolicyEntity(scope.row)">確認解除</el-button>
                          <el-button size="mini" type="text" @click="scope.row.delDialog=false">取消</el-button>
                        </div>
                        <el-button size="mini" type="text" slot="reference" style="color:#3E8EF7;background: transparent;font-size:12px;">
                          解除用戶<span v-show="scope.row.RelatedType == '2'">{{$t('CAM.strategy.team')}}</span>
                        </el-button>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
              <div style="flex:1;display:flex;justify-content: space-between;">
                <div>
                  <span class="pagtotal">已选 {{policysSelData.length}} 项，</span>
                  <span class="pagtotal" style="margin-left: 5px;">共&nbsp;{{TotalCount}}&nbsp;{{$t('CAM.strip')}}</span>
                </div>
                <el-pagination :page-size="pagesize" :pager-count="7" :current-page="currpage" layout="prev, sizes, pager, next" :page-sizes="[10, 20, 30, 40, 50]" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="TotalCount"></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab 策略详情页面，关联用户组tab  end -->
        </el-tabs>
      </div>
      <!-- dialog关联用户组弹框页面 start -->
      <el-dialog title="關聯用戶/用戶組" :visible.sync="dialogVisible" width="72%" :before-close="handleClosePolicy">
        <!-- <p class="dialog">{{$t('CAM.strategy.straGroup')}}</p> -->
        <div>
          <transfer ref="userTransfer" :policyId="policyID" :visible.sync="dialogVisible"></transfer>
        </div>
        <p style="text-align:center;margin-top:20px">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="attachPolicy" size="small">{{$t('CAM.strategy.suerStr')}}</el-button>
        </p>
      </el-dialog>
      <!-- dialog关联用户组弹框页面 end -->
      <el-dialog :visible.sync="Relieve_dialogVisible" width="30%" :before-close="handleClosePolicyRemove">
        <p class="dialog">{{$t('CAM.strategy.outBindUser')}}</p>
        <div style="margin:15px 0">
          <p>
            {{$t('CAM.strategy.overChoose')}}，
            <a href="javascript:;" @click="look_detail">{{$t('CAM.strategy.lookDetils')}}</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in policysSelData" :key="item">{{item.Name}}</p>
          </div>
          <h3 style="margin-top:15px">{{$t('CAM.strategy.okDel')}}？</h3>
          <p>{{$t('CAM.strategy.removeStra')}}</p>
        </div>
        <p style="text-align:center">
          <el-button @click="handleClosePolicyRemove" size="small">取 消</el-button>
          <el-button type="primary" @click="removePolicysEntity" size="small">{{$t('CAM.strategy.suerStr')}}</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  REMOVEBIND_USER,
  LIST_ENPOLICY,
  DETACH_POLICY,
  GET_POLICY,
  ATTACH_GROUP,
  UPDATE_POLICY_V2,
  DETACH_GROUPS_POLICY,
  DETACH_USERS_POLICY,
  ATTACH_GROUPS_POLICY,
  ATTACH_USERS_POLICY,
} from "@/constants";
import transfer from "./transfer";
import * as monaco from 'monaco-editor'
import { ErrorTips } from "@/components/ErrorTips";
export default {
  components: {
    transfer
  },
  data() {
    return {
      infoLoad: false,
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      activeName: "first",
      policyID: this.$route.query.policy,
      policy: {}, //详情数据
      policysData: [],
      policysSelData: [],
      table_options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "用戶"
        },
        {
          value: "2",
          label: "用戶組"
        }
      ],
      entityFilter: "",
      tableTitle: "類型",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      Relieve_dialogVisible: false,
      display: true,
      isShow: false,
      popover_visible: false,
      inputValue: "-",
      input_Value: "",
      loading: true,
      input_show: false,
      page: 1,
      rp: 10,
      total: 0,
      selTotal: 0,
      handleFlag: false,
      groupArr: [],
      userArr: [],
      loadingMonaco: true,
      Type: {
        1: "自定義策略",
        2: "預設策略"
      },
      attachVal: ""
    };
  },
  mounted() {
    this.infoLoad = true;
    const params = {
      Version: "2019-01-16",
      PolicyId: this.policyID
    };
    this.axios.post(GET_POLICY, params).then(res => {
      if (res.Response.Error === undefined) {
        this.policy = res.Response;
        const editor = monaco.editor.create(this.$refs.monaco, {
          value: res.Response.PolicyDocument,
          language: 'json',
          automaticLayout: true,
            autoIndent: true,
            contextmenu: false,
            formatOnType: true
        })
        var didScrollChangeDisposable = editor.onDidScrollChange(() => {
          didScrollChangeDisposable.dispose();
          editor.getAction("editor.action.formatDocument").run().then(() => {
            editor.updateOptions({ readOnly: true})
            this.loadingMonaco = false
          })
        });
        // editor.getAction('editor.action.formatDocument').run().then(() => editor.updateOptions({ readOnly: true}));
        // loadingMonaco
        // setTimeout(() => {
        //   editor.trigger('anyString', 'editor.action.formatDocument')
        // }, 300)
        // setTimeout(() => {
        //   editor.updateOptions({ readOnly: true })
        // }, 400)
        
        this.inputValue = res.Response.PresetAlias
        this.infoLoad = false;
      } else {
        let ErrTips = {
          "InternalError.SystemError": "內部錯誤",
          "InvalidParameter.ParamError": "非法入參",
          "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
          "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在"
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
    this.getAttachPolicys();
  },
  methods: {
    attach(val) {
      this.attachVal = val;
    },
    // 打开 关联用户/用户组 页面
    Relation_user() {
      this.dialogVisible = true;
    },
    // 关闭 关联用户/用户组 页面
    handleClosePolicy() {
      this.dialogVisible = false;
    },
    // 关联用户/用户组 跳转用户、用户组页面连接方法
    handleClickPolicies(obj) {
      if (obj.RelatedType != undefined && obj.RelatedType === 1) {
        this.$router.push({
          path: "/detailsUser",
          query: {
            detailsData: obj.Name
          }
        });
      }
      if (obj.RelatedType != undefined && obj.RelatedType === 2) {
        this.$router.push({
          name: "Interfacedetails",
          query: {
            GroupId: obj.Id
          }
        });
      }
    },
    // 策略添加用户/用户组
    attachPolicy() {
      const selectedData = this.$refs.userTransfer.selectedData
      if (selectedData.length === 0) {
        return void this.$message({
          message: '請選擇用戶/用戶組',
          type: "error",
          showClose: true,
          duration: 0
        });
      }

      const users = []
      const groups = []
      const p = []
      selectedData.forEach(d => {
        if (d.type === 'user') {
          users.push(d.uin)
        } else {
          groups.push(d.groupId)
        }
      })
      if (users.length) {
        const params = {
          Version: '2019-01-16',
          PolicyId: this.policyID
        }
        users.forEach((id, i) => {
          params[`TargetUin.${i}`] = id
        })
        p.push(this.axios.post(ATTACH_USERS_POLICY, params))
      }
      if (groups.length) {
        const params = {
          Version: '2019-01-16',
          PolicyId: this.policyID
        }
        groups.forEach((id, i) => {
          params[`GroupId.${i}`] = id
        })
        p.push(this.axios.post(ATTACH_GROUPS_POLICY, params))
      }
      Promise.all(p).then(() => {
        this.$message({
          message: '關聯成功',
          type: "success",
          showClose: true,
          duration: 0
        });
        this.currpage = 1
        this.getAttachPolicys()
        this.dialogVisible = false;
      })
      // if (user.length === 0) {
      //   
      // }
      // this.$refs.userTransfer.attachPolicy();
      // this.dialogVisible = false;
      // // 重新加载策略关联实体列表

      // this.handleFlag = this.$refs.userTransfer.getHandleFlag();
      // this.loading = true;
      // new Promise(function(resolve, reject) {
      //   resolve("成功"); // 数据处理完成
      // })
      //   .then(res => {
      //     setTimeout(() => {
      //       this.getAttachPolicys();
      //     }, 3000);
      //   })
      //   .then(() => {
      //     this.attachVal == "";
      //     // this.$refs.userTransfer.clearData(); // 添加完毕时清空数组。
      //   });
    },
    // 获取策略关联的实体列表
    getAttachPolicys() {
      this.loading = true;
      this.selTotal = 0;
      this.policysData = [];
      let params = {
        Version: "2019-01-16",
        Page: this.currpage,
        Rp: this.pagesize,
        PolicyId: this.policyID
      };
      let entityFilter = this.entityFilter;
      //'All' 表示获取所有实体类型，'User' 表示只获取子账号，'Group' 表示只获取用户组，'Role' 表示只获取角色，默认取 'All'
      if (entityFilter != undefined && entityFilter != "") {
        params["EntityFilter"] = entityFilter;
      } else {
        params["EntityFilter"] = "User|Group";
      }
      this.axios.post(LIST_ENPOLICY, params).then(res => {
        if (res.Response.Error === undefined) {
          var groupArr = [];
          var userArr = [];
          // RelatedType 关联类型。1 用户关联 ； 2 用户组关联
          this.TotalCount = res.Response.TotalNum;
          const list = res.Response.List
          list.forEach(item => {
            item.delDialog = false
            if (item.RelatedType == 2) {
              groupArr.push(item);
            }
            if (item.RelatedType == 1) {
              userArr.push(item);
            }
          });
          this.policysData = list;
          this.userArr = userArr;
          this.groupArr = groupArr;
          this.loading = false;
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.EntityFilterError": "EntityFilter欄位不合法",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法"
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
    // 解除策略绑定实体
    removePolicyEntity(obj) {
      if (obj != "" && obj.RelatedType === 1) {
        let paramsUser = {
          Action: "DetachUserPolicy",
          Version: "2019-01-16",
          PolicyId: this.policyID,
          DetachUin: obj.Uin
        };
        this.removeUserPolicy(paramsUser);
      }
      if (obj != "" && obj.RelatedType === 2) {
        let paramsGroup = {
          Action: "DetachGroupPolicy",
          Version: "2019-01-16",
          PolicyId: this.policyID,
          DetachGroupId: obj.Id
        };
        this.removeGroupPolicy(paramsGroup);
      }
    },
    // 解除绑定到用户的策略
    removeUserPolicy(params) {
      this.axios
        .post(REMOVEBIND_USER, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.getAttachPolicys(); // 重新加载
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull":
                "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
              "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
            this.getAttachPolicys();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 解除绑定到用户组的策略
    removeGroupPolicy(params) {
      this.axios
        .post(DETACH_POLICY, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.getAttachPolicys(); // 重新加载
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
              "ResourceNotFound.GroupNotExist": "用戶組不存在",
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClick() { },
    Relieve_user() {
      if (this.policysSelData.length != 0) {
        this.Relieve_dialogVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: "請選擇要解除關聯的用戶/用戶組",
          duration: 0
        });
      }
    },
    // 批量解除绑定到策略的实体
    removePolicysEntity() {
      const users = []
      const groups = []
      const p = []
      this.selectData.forEach(d => {
        if (d.RelatedType === 1) {
          users.push(d.Uin)
        } else {
          groups.push(d.Id)
        }
      })
      if (users.length) {
        const params = {
          Version: '2019-01-16',
          PolicyId: this.policyID
        }
        users.forEach((id, i) => {
          params[`TargetUin.${i}`] = id
        })
        p.push(this.axios.post(DETACH_USERS_POLICY, params))
      }
      if (groups.length) {
        const params = {
          Version: '2019-01-16',
          PolicyId: this.policyID
        }
        groups.forEach((id, i) => {
          params[`GroupId.${i}`] = id
        })
        p.push(this.axios.post(DETACH_GROUPS_POLICY, params))
      }
      Promise.all(p).then(() => {
        this.$message({
          message: '解除成功',
          type: "success",
          showClose: true,
          duration: 0
        });
        this.currpage = 1
        this.getAttachPolicys()
        this.Relieve_dialogVisible = false;
      })
    },
    handleSelectionChange(val) {
      this.policysSelData = val;
      if (val.length != 0) {
        this.selectData = JSON.parse(JSON.stringify(val));
      }
    },
    handleClosePolicyRemove() {
      this.Relieve_dialogVisible = false;
    },
    handleCommand(command) {
      this.tableTitle = command.label;
      if (command.value === "0") {
        this.entityFilter = "User|Group";
      }
      if (command.value === "1") {
        this.entityFilter = "User";
      }
      if (command.value === "2") {
        this.entityFilter = "Group";
      }
      // 重新查询策略关联实体
      this.getAttachPolicys();
    },
    handleCurrentChange(val) {
      this.currpage = val
      this.getAttachPolicys();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAttachPolicys();
    },
    handleClose() { },
    look_detail() {
      this.isShow = !this.isShow;
    },
    icon_click() {
      this.input_show = true;
      this.input_Value = this.inputValue;
    },
    input_cancel() {
      this.input_show = false;
    },
    input_sure() {
      let params = {
        // Version: "2019-01-16",
        policyId: this.policyID,
        alias: this.input_Value,
      };
      this.axios.post(UPDATE_POLICY_V2, params)
        .then(res => {
          if (res) {
            console.log(res)
          }
        })
      this.inputValue = this.input_Value;
      this.input_show = false;
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang='scss' scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.StrategyDetail {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    font-size: 16px;

    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }

  .container {
    max-width: 96%;
    margin: 0 auto;

    .baseInfo {
      padding: 20px;
      background: #fff;
      margin-bottom: 20px;

      .baseInfo_title {
        font-size: 14px;
        color: #000;
        font-weight: 600;
        line-height: 30px;
        color: #000;
        margin-bottom: 11px;
        height: 30px;
      }

      .baseInfo_flex {
        display: flex;
        color: #888;

        .item {
          padding-bottom: 20px;
        }

        .baseInfo_right {
          padding-left: 20px;
        }

        .baseInfo_left {
          .baseInfo_mark {
            padding-bottom: 40px;
          }
        }
      }
    }

    .tabs {
      background: #fff;
      padding: 20px;

      .markdown {
        width: 725px;
        height: 300px;
        background-color: #ddd;
        color: #a31515;
        font-size: 14px;
        padding: 20px;
        box-sizing: border-box;
        word-wrap: break-word;
        line-height: 30px;
        overflow-y: scroll;
      }
    }
    .markdown ::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }

    .dialog {
      color: #000;
      font-weight: 700;
      line-height: 26px;
      font-size: 14px;
    }

    .box {
      height: 125px;
      width: 360px;
      overflow: auto;
      border: 1px solid #ccc;

      .list {
        padding-left: 10px;
        cursor: pointer;
      }

      .list:hover {
        background: #f4f4f4;
      }
    }
  }
}
.pagtotal {
  color: #888;
}
</style>
