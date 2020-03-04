<template>
  <div class="RoleDetail wrap">
    <HeadCom :title="roleInfo.RoleName" :backShow="true" @_back="_back" />
    <div class="container">
      <div class="baseInfo">
        <p class="baseInfo_title">{{$t('CAM.Role.jsxx')}}</p>
        <div class="baseInfo_flex">
          <p>
            <span class="spns">{{$t('CAM.Role.roleName')}}</span>
            <span>{{roleInfo.RoleName}}</span>
          </p>
          <p>
            <span class="spns">RoleArn</span>
            <span>{{roleInfo.PolicyDocument}}</span>
          </p>
          <p>
            <span class="spns">角色ID</span>
            <span>{{roleInfo.RoleId}}</span>
          </p>
          <p>
            <span class="spns">角色描述</span>
            <span style="display:block;flex:1;margin-top:-3px;">
              <el-input
                v-if="input_show"
                v-model="roleInfo.Description"
                size="mini"
                style="width:150px"
                :placeholder="$t('CAM.strategy.inputContent')"
              ></el-input>
              <a
                v-if="input_show"
                @click="input_sure"
                style="margin-left:10px"
                href="javascript:;"
              >{{$t('CAM.userGroup.delConfirmBtn')}}</a>
              <a
                v-if="input_show"
                @click="input_cancel"
                style="margin-left:10px"
                href="javascript:;"
              >取消</a>
              <span v-if="!input_show" style="line-height:20px;">{{roleInfo.Description}}</span>
              <i
                v-if="!input_show"
                @click="icon_click"
                style="cursor: pointer;"
                class="el-icon-edit item"
              ></i>
            </span>
          </p>
          <p>
            <span class="spns">{{$t('CAM.userList.createTime')}}</span>
            <span>{{roleInfo.AddTime}}</span>
          </p>
        </div>
      </div>
      <div class="tabs" v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- tab 角色策略 start -->
          <el-tab-pane :label="$t('CAM.Role.Authorized')" name="first">
            <p style="margin:10px">
              <el-button
                type="primary"
                @click="relationPolicies"
                size="small"
              >{{$t('CAM.userList.RelatedPolicies')}}</el-button>
              <el-button
                type="primary"
                @click="relieveRolePolicies"
                size="small"
                :disabled="displayPolicies"
              >批量解除策略</el-button>
            </p>
            <div class="first_table">
              <el-table
                @selection-change="handleSelectionChangePolicies"
                :data="rolePolicies"
                height="300"
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column type="selection" width="29"></el-table-column>
                <el-table-column prop="PolicyName" label="策略名">
                  <template slot-scope="scope">
                    <el-button
                      @click="first_handleClick(scope.row)"
                      type="text"
                      size="small"
                    >{{scope.row.PolicyName}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot="header" slot-scope="scope">
                    <el-dropdown trigger="click" @command="handleCommand" size="mini">
                      <span style="color:#909399">
                        {{ tableTitle }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="item in optionPolicies"
                          :key="item.value"
                          :command="item"
                        >{{item.label}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <template slot-scope="scope">
                    <div v-if="scope.row.PolicyType == 'User'">{{$t('CAM.userList.strategySelf')}}</div>
                    <div v-else-if="scope.row.PolicyType == 'QCS'">{{$t('CAM.userList.ysStrategy')}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="AddTime" :label="$t('CAM.userList.AssociationTime')"></el-table-column>
                <el-table-column >
                  <div slot="header" style="padding: 0;">
                    {{$t('CAM.Role.failure')}}
                    <el-tooltip placement="top" :content="$t('CAM.Role.rgnxzcx')" effect="light">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                  <template slot-scope="scope">
                    <span v-if="scope.row.validTime">{{scope.row.validTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="relieveRolePolicy(scope.row, true)"
                      type="text"
                      size="small"
                    >解除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="Right-style pagstyle" v-show="activeName == 'first'" style="height:70px;display:flex;align-items:center;">
                <span class='pagtotal'>共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
                <el-pagination
                  :page-size="pagesize"
                  :pager-count="7"
                  layout="prev, sizes, pager, next"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :total="TotalCount"
                >
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab 角色策略 end -->
          <!-- tab 角色载体 start -->
          <el-tab-pane :label="$t('CAM.Role.roleCarrier')" name="second">
            <div class="config">
              <p style="margin:10px">
                <el-button
                  type="primary"
                  @click="Relation_user"
                  size="small"
                >{{$t('CAM.Role.Management')}}</el-button>
              </p>
              <div class="config_table">
                <el-table
                  :data="roleCarrier.slice((currpage - 1) * pagesize, currpage * pagesize)"
                  height="300"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%"
                >
                  <el-table-column :label="$t('CAM.Role.roleCarrier')">
                    <template slot-scope="scope" show-overflow-tooltip>
                      <span>{{scope.row}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-tooltip v-if="roleCarrier.length === 1" effect="dark" :content="$t('CAM.Role.wfscwydzt')" placement="top-start">
                      <el-button
                        type="text"
                        size="small"
                      >解除</el-button>
                      </el-tooltip>
                      <el-button
                        v-if="roleCarrier.length > 1"
                        @click.native.prevent="delRolePolicy(scope.$index, roleCarrier)"
                        type="text"
                        size="small"
                      >解除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="Right-style pagstyle" v-show="activeName == 'second'" style="height:70px;display:flex;align-items:center;">
                  <span class='pagtotal'>共&nbsp;{{TotalCounts}}&nbsp;{{$t("CAM.strip")}}</span>
                  <el-pagination
                    :page-size="pagesize"
                    :pager-count="7"
                    layout="prev, sizes, pager, next"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :total="TotalCounts"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab  角色载体 end -->
          <el-tab-pane :label="$t('CAM.Role.Cancel')" name="third">
            <div class="explain">
              <p>{{$t('CAM.Role.cancelSessionTitle1')}}RevokeOlderSessionFor{{roleInfo.RoleName}}{{$t('CAM.Role.cancelSessionTitle2')}}</p>
            </div>
            <el-button
              size="small"
              type="primary"
              @click="dialogVisibleCancelAllSession = true"
            >{{$t('CAM.Role.cancelAll')}}</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="25%" :before-close="handleCloseSessionHint">
        <h3 slot="title">{{$t('CAM.Role.Risk')}}</h3>
        <p
          style="line-height: 20px;padding: 0;background: #fff;font-size: 12px;margin-bottom: 27px;color: #444;"
        >{{$t('CAM.Role.notUsed')}}</p>
        <p style="text-align:center" slot="footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="Relievesure_dialogVisible = true;dialogVisible = false;"
            size="small"
          >{{$t('CAM.userList.suerAdd')}}</el-button>
        </p>
      </el-dialog>
      <!-- 载体dialog  start -->
      <el-dialog
        :visible.sync="Relievesure_dialogVisible"
        width="70%"
        :before-close="handleCloseCarrierBody"
      >
        <span>{{$t('CAM.Role.account')}}</span>
        <!-- <el-checkbox-group 
          v-model="checkedRoleServeCarrier">
          <el-checkbox v-for="item in roleServeCarrier" :label="item.value" :key="item.key">{{item.key}}</el-checkbox>
        </el-checkbox-group>-->
      </el-dialog>
      <el-dialog
        :visible.sync="Relieve_dialogVisible"
        width="30%"
        :before-close="handleCloseCarrier"
      >
        <p class="dialog">{{$t('CAM.Role.Unblock')}}</p>
        <div style="margin:15px 0">
          <p>
            {{$t('CAM.strategy.overChoose')}}
            <a
              href="javascript:;"
              @click="look_detail"
            >{{$t('CAM.strategy.lookDetils')}}</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in RelieveData" :key="item">{{item}}</p>
          </div>
          <h3 style="margin-top:15px">{{$t('CAM.strategy.lookDetils')}}</h3>
          <p>{{$t('CAM.strategy.removeStra')}}</p>
        </div>
        <p style="text-align:center">
          <el-button @click="Relieve_dialogVisible = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="Relieve_dialogVisible = false"
            size="small"
          >{{$t('CAM.userGroup.delConfirmBtn')}}</el-button>
        </p>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisiblePolicies"
        width="70%"
        :before-close="handleClosePolicy"
      >
        <p class="dialog" slot="title">{{$t('CAM.userGroup.createRelevance')}}</p>
        <transfer
          @_multipleSelection="_multipleSelection"
          :multipleSelection="multipleSelection"
          :rolePolicies="rolePolicies"
          ref="transfer"
        ></transfer>
        <p style="text-align:center;margin-top:30px">
          <el-button @click="dialogVisiblePolicies = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="attachRolePolicies"
            size="small"
          >{{$t('CAM.userGroup.delConfirmBtn')}}</el-button>
        </p>
      </el-dialog>
      <!-- 撤销所有会话弹窗 -->
      <el-dialog
        title="撤銷所有會話"
        :visible.sync="dialogVisibleCancelAllSession"        
        >
          <p>您是否確定要撤銷角色的當前所有會話？撤銷會話後，該角色當前所有訪問將立即被拒絕。</p>
          <el-checkbox v-model="cancelAllSessionChecked">我已知曉上述信息並確認要撤銷該角色所有會話</el-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="!cancelAllSessionChecked" @click="cancelAllSession">確認撤銷會話</el-button>
          <el-button @click="dialogVisibleCancelAllSession = false">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import transfer from "./component/transfer";
import HeadCom from "../UserListNew/components/Head";
import moment from 'moment'
import {
  Loading
} from 'element-ui'
import {
  GET_POLICY,
  GET_ROLE,
  LIST_ATTACHE,
  DEACH_ROLE,
  UPDATE_ROLE,
  UPDATE_ASSUME,
  ATTACH_ROLE,
  POLICY_LIST,
  UPDATE_POLICY,
  LOGOUT_ROLE_SESSIONS,
  CREATE_POLICY,
} from "@/constants";
export default {
  components: {
    transfer,
    HeadCom
  },
  data() {
    return {
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      infoLoad: true,
      loading: true,
      cancelAllSessionChecked: false,
      title: "",
      activeName: "first",
      dialogVisible: false,
      Relieve_dialogVisible: false,
      transfer_value: [],
      dialogVisiblePolicies: false,
      dialogVisibleCancelAllSession: false,
      transfer_data: [
        {
          value: 1,
          desc: "備選項1"
        },
        {
          value: 2,
          desc: "備選項2"
        },
        {
          value: 3,
          desc: "備選項3"
        }
      ],
      display: true,
      RelieveData: [],
      isShow: false,
      popover_visible: false,
      inputValue: "-",
      input_Value: "",
      input_show: false,
      roleId: "",
      roleInfo: {},
      optionPolicies: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "User",
          label: "自定義策略"
        },
        {
          value: "QCS",
          label: "預設策略"
        }
      ],
      displayPolicies: true,
      tableTitle: "策略類型",
      rolePolicies: [],
      roleSelPolicies: [],
      pagePolicies: 1,
      rpPolicies: 20,
      roleCarrier: [],
      TotalCounts: 0,
      TotalNum: 0,
      selTotalNum: 0,
      roleServeCarrier: [],
      checkedRoleServeCarrier: [],
      Relievesure_dialogVisible: false,
      rolePolicyType: "",
      multipleSelection: []
    };
  },
  mounted() {
    this.roleId = this.$route.query.RoleId;
    this.init();
  },
  methods: {
    _multipleSelection(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    // 页面实例化
    init() {
      this.getRoleDetail();
      this.getRolePolicy();
    },
    // 获取角色详情
    getRoleDetail() {
      this.loading = true;
      this.infoLoad = true;
      let _this = this;
      let paramsInfo = {
        Version: "2019-01-16",
        RoleId: this.roleId
      };
      this.axios
        .post(GET_ROLE, paramsInfo)
        .then(res => {
          if (res.Response.Error === undefined) {
            let resInfo = res.Response.RoleInfo;
            console.log(resInfo)
            let PolicyDocument = JSON.parse(resInfo.PolicyDocument);
            this.TotalCounts =
              (PolicyDocument.statement[0].principal.service || PolicyDocument.statement[0].principal.qcs).length
              console.log((PolicyDocument.statement[0].principal.service || PolicyDocument.statement[0].principal.qcs).length)
            if (typeof PolicyDocument.statement[0].principal.qcs === "object") {
              _this.roleCarrier = PolicyDocument.statement[0].principal.qcs;
              resInfo.PolicyDocument =
                PolicyDocument.statement[0].principal.qcs[0];
            }
            if (typeof PolicyDocument.statement[0].principal.qcs === "string") {
              _this.roleCarrier.push(PolicyDocument.statement[0].principal.qcs);
              resInfo.PolicyDocument =
                PolicyDocument.statement[0].principal.qcs;
            }
            if (
              typeof PolicyDocument.statement[0].principal.service === "object"
            ) {
              _this.roleCarrier = PolicyDocument.statement[0].principal.service;
              resInfo.PolicyDocument =
                PolicyDocument.statement[0].principal.service[0];
            }
            if (
              typeof PolicyDocument.statement[0].principal.service === "string"
            ) {
              _this.roleCarrier.push(
                PolicyDocument.statement[0].principal.service
              );
              resInfo.PolicyDocument =
                PolicyDocument.statement[0].principal.service;
            }
            console.log(resInfo)
            this.roleInfo = resInfo;
            this.loading = false;
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.RoleNotExist": "角色不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.infoLoad = false;
        }) 
        .catch(error => {});
    },
    // 获取角色策略
    getRolePolicy() {
      this.loading = true;
      this.selTotalNum = 0;
      let paramsList = {
        Version: "2019-01-16",
        Page: this.currpage,
        Rp: this.pagesize,
        RoleId: this.roleId
      };
      if (this.rolePolicyType != "") {
        paramsList["PolicyType"] = this.rolePolicyType;
      }
      
      this.axios
        .post(LIST_ATTACHE, paramsList)
        .then(res => {
          if (res.Response.Error === undefined) {
            // this.rolePolicies = res.Response.List;
            const index = res.Response.List.findIndex(item => item.PolicyName === 'RevokeOlderSessionFor6')
            if (index !== -1) {
              this.axios.post(GET_POLICY, {
                Version: '2019-01-16',
                PolicyId: res.Response.List[index].PolicyId
              }).then(({ Response }) => {
                res.Response.List[index].validTime = moment(JSON.parse(Response.PolicyDocument).statement[0].condition.date_less_than['qcs:token_create_time']).format('YYYY-MM-DD HH:mm:ss')
              }).then(() => {
                this.rolePolicies = res.Response.List;
              })

            } else {
              this.rolePolicies = res.Response.List;
            }
            this.TotalNum = res.Response.TotalNum;
            this.TotalCount = res.Response.TotalNum;
          } else {
            if (!res.Response.Error.code == "InvalidParameter.RoleNotExist") {
              let ErrTips = {
                "InternalError.SystemError": "內部錯誤",
                "InvalidParameter.ParamError": "非法入參"
              };
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            } else {
              this.rolePolicies = []
            }
          }
          this.loading = false;
        })
        .catch(error => {});
    },
    // 解除角色策略
    relieveRolePolicy(scope, flag = false) {
      if (flag) {
        this.$confirm("此操作將永久解除策略, 是否繼續?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let paramsDel = {
            Version: "2019-01-16",
            PolicyId: scope.PolicyId,
            DetachRoleId: this.roleId
          };
          this.relievePolicy(paramsDel);
        });
        return
      }
      
      let paramsDel = {
        Version: "2019-01-16",
        PolicyId: scope.PolicyId,
        DetachRoleId: this.roleId
      };
      this.relievePolicy(paramsDel);
    },
    // 解除角色绑定的策略
    relievePolicy(paramsRelieve) {
      this.axios
        .post(DEACH_ROLE, paramsRelieve)
        .then(res => {
          if (res.Response.Error === undefined) {
            if (res.Response.RequestId) {
              this.$message({
                message: "解綁成功",
                type: "success",
                duration: 0,
                showClose: true
              });
            }
            this.getRolePolicy(); // 重新加载
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.RoleNotExist": "角色不存在"
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
        .catch(error => {});
    },
    // 批量解除策略按钮启禁用
    handleSelectionChangePolicies(val) {
      if (val != "") {
        this.roleSelPolicies = val;
        this.selTotalNum = val.length;
        this.displayPolicies = false;
      } else {
        this.displayPolicies = true;
      }
    },
    // 批量解除绑定到策略的实体
    relieveRolePolicies() {
      if (this.roleSelPolicies.length > 3) {
        this.$message({
          type: "success",
          message: "每次最多可以選中3條",
          duration: 0,
          showClose: true
        });
      } else {
        this.$confirm("此操作將永久解除策略, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let arrs = this.roleSelPolicies;
        for (let i = 0; i < arrs.length; i++) {
          let obj = arrs[i];
          this.relieveRolePolicy(obj);
        }
        this.displayPolicies = false;
      });
      }
    },
    // 修改角色描述信息
    updateRoleDescription() {
      let paramsUpdate = {
        Version: "2019-01-16",
        Description: this.roleInfo.Description,
        RoleId: this.roleId
      };
      this.axios
        .post(UPDATE_ROLE, paramsUpdate)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.getRoleDetail(); //重新加载
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.DescriptionLengthOverlimit":
                "Description入參長度不能大於300位元組",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.RoleNotExist": "角色不存在"
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
        .catch(error => {});
    },
    delRolePolicy(index, rows) {
      this.$confirm("此操作將永久刪除, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.updateRolePolicy(index, rows);
      });
    },
    // 修改角色信任策略
    updateRolePolicy(index, rows) {
      this.roleCarrier.splice(index, 1); // 从数组中删除要移除的数据
      let policyDocument = JSON.parse(
        '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":[]}}]}'
      );
      policyDocument.statement[0].principal.service = policyDocument.statement[0].principal.service.concat(
        this.roleCarrier
      );
      let paramsPolicy = {
        Version: "2019-01-16",
        PolicyDocument: policyDocument,
        RoleId: this.roleId
      };
      this.axios
        .post(UPDATE_ASSUME, paramsPolicy)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.getRoleDetail(); //重新加载
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull":
                "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ConditionError":
                "策略文件的condition欄位不合法",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PrincipalError":
                "策略文件的principal欄位不合法",
              "InvalidParameter.RoleNotExist": "角色不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在"
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
        .catch(error => {});
    },
    // 打开关联策略dialog
    relationPolicies() {
      this.dialogVisiblePolicies = true;
    },
    attachPolicy(val) {
      const params = {
        Version: "2019-01-16",
        PolicyId: val,
        AttachRoleId: this.$route.query.RoleId
      };
      this.axios.post(ATTACH_ROLE, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.Error) {
            this.$message({
              message: "關聯失敗",
              type: "error",
              duration: 0,
              showClose: true
            });
          } else {
            this.$message({
              message: "關聯成功",
              type: "success",
              duration: 0,
              showClose: true
            });
          }
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.AttachmentFull":
              "principal欄位的授權對象關聯策略數已達到上限",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
            "InvalidParameter.RoleNotExist": "角色不存在"
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
    // 关联角色策略
    attachRolePolicies() {
      if (this.multipleSelection.length > 3) {
        this.$message({
          message: "每次最多可以選中三條",
          type: "error",
          showClose: true,
          duration: 0
        });
      } else if (this.multipleSelection.length == 0) {
        this.$message({
          message: "請選中要關聯的數據",
          type: "error",
          showClose: true,
          duration: 0
        });
      } else {
        var _this = this;
        new Promise(function() {
          _this.multipleSelection.forEach(item => {
            _this.attachPolicy(item.PolicyId);
          });
          _this.dialogVisiblePolicies = false;
          _this.loading = true;
          // _this.multipleSelection = [];
          setTimeout(() => {
            _this.getRolePolicy();
          }, 3000);
        }).then(_this.$refs.transfer.clear());
      }
    },
    // 关闭关联策略dialog
    handleClosePolicy() {
      this.dialogVisiblePolicies = false;
    },
    first_handleClick(obj) {
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: obj.PolicyId
        }
      });
    },
    icon_click() {
      this.input_show = true;
      this.input_Value = this.inputValue;
    },
    input_cancel() {
      this.getRoleDetail();
      this.input_show = false;
    },
    input_sure() {
      this.input_show = false;
      this.loading = true;
      this.updateRoleDescription();
    },
    handleCloseSessionHint() {
      this.dialogVisible = false;
    },
    handleCloseCarrier() {
      this.Relieve_dialogVisible = false;
    },
    handleCloseCarrierBody() {
      this.Relievesure_dialogVisible = false;
    },
    // 撤销所有会话
    async cancelAllSession() {
      const loading = Loading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
      })
      let res
      let PolicyId
      res = await this.axios.post(POLICY_LIST, {
        Version: '2019-01-16',
        Keyword: `RevokeOlderSessionFor${this.roleInfo.RoleName}`
      })
      if (res.Response.Error !== undefined) {
        let ErrTips = {
          'InvalidParameter.GroupIdError': 'GroupId字段不合法',
          'InvalidParameter.KeywordError': 'Keyword字段不合法',
          'InvalidParameter.ParamError': '非法入参',
          'InvalidParameter.ScopeError': 'Scope字段不合法',
          'InvalidParameter.ServiceTypeError': 'ServiceType字段不合法',
          'InvalidParameter.UinError': 'Uin字段不合法',
        }
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        })
        loading.close()
        return
      }
      if (res.Response.TotalNum === 0) {
        res = await this.axios.post(CREATE_POLICY, {
          Version: '2019-01-16',
          PolicyName: `RevokeOlderSessionFor${this.roleInfo.RoleName}`,
          PolicyDocument: `{"version":"2.0","statement":[{"action":["*"],"resource":"*","effect":"deny","condition":{"date_less_than":{"qcs:token_create_time":"${moment().utc().format()}"}}}]}`
        })
        PolicyId = res.Response.PolicyId
      } else {
        PolicyId = res.Response.List[0].PolicyId
      }
      res = await this.axios.post(ATTACH_ROLE, {
        Version: "2019-01-16",
        PolicyId,
        AttachRoleId: this.$route.query.RoleId
      })
      if (res.Response.Error === undefined) {
        res = await this.axios.post(LOGOUT_ROLE_SESSIONS, {
          roleId: this.$route.query.RoleId
        })
        loading.close()
        this.getRolePolicy()
        if (res.code === 0) {
          this.$message({
            message: '撤銷成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.dialogVisibleCancelAllSession = false
        } else {
          this.$message({
            message: '撤銷失敗',
            type: "error",
            showClose: true,
            duration: 0
          });
        } 
      } else {
        loading.close()
        let ErrTips = {
          "InternalError.SystemError": "內部錯誤",
          "InvalidParameter.AttachmentFull":
            "principal欄位的授權對象關聯策略數已達到上限",
          "InvalidParameter.ParamError": "非法入參",
          "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
          "InvalidParameter.RoleNotExist": "角色不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      } 
    },
    handleClick() {},
    isRelieve() {},
    // 管理载体
    Relation_user() {
      this.$router.push({
        path: "/carrier",
        query: {
          id: this.$route.query.RoleId
        }
      });
      // this.dialogVisible = true;
      // let carriers = JSON.parse(this.getCarriers()).Responce.data
      // for(let i = 0; i < carriers.length; i++) {
      //   let obj = carriers[i]
      //   carriers[i].key = carriers[i]
      //   carriers[i].value = carriers[i].zh
      // }
      // this.roleServeCarrier = carriers
    },
    Relieve_user() {
      this.Relieve_dialogVisible = true;
    },
    // 详情页面，角色策略列表策略类型切换查询
    handleCommand(command) {
      this.tableTitle = command.label;
      this.rolePolicyType = command.value;
      this.getRolePolicy();
    },
    // 每页条数
    handleSizeChange(val) {
      this.rpPolicies = val;
      this.getRolePolicy();
    },
    // 当前页
    handleCurrentChange(val) {
      this.pagePolicies = val;
      this.currpage = val;
      this.getRolePolicy();
    },
    handleClose() {},
    look_detail() {
      this.isShow = !this.isShow;
    },
    back() {
      this.$router.push("/Role");
    },
    getCarriers() {
      return '{"Responce": {"data": [{"domain": "aegis.qcloud.com","name": {"zh": "宙斯盾安全防护","en": "Aegis"}}, {"domain": "apigateway.qcloud.com","name": {"zh": "API网关","en": "ApiGateway"}}, {"domain": "as.cloud.tencent.com","name": {"zh": "弹性伸缩","en": "Auto Scaling-AS"}}, {"domain": "baas.qq.com","name": {"zh": "腾讯区块链开发平台","en": "Tencent Blockchain"}}, {"domain": "batchoperations.cos.cloud.tencent.com","name": {"zh": "对象存储批量处理","en": "Cloud Object Storage Batch Operations"}}, {"domain": "blueking.cloud.tencent.com","name": {"zh": "蓝鲸平台","en": "BlueKing"}}, {"domain": "bm.qcloud.com","name": {"zh": "黑石物理服务器1.0","en": "Cloud Physical Machine"}}, {"domain": "bpaas.cloud.tencent.com","name": {"zh": "商业流程服务","en": "BPaaS"}}, {"domain": "ccs.qcloud.com","name": {"zh": "容器服务","en": "Tencent Kubernetes Engine"}}, {"domain": "cdb.qcloud.com","name": {"zh": "雲数据库 MySQL","en": "TencentDB for MySQL"}}, {"domain": "cdn.cloud.tencent.com","name": {"zh": "内容分发网络","en": "Content Delivery Network - CDN"}}, {"domain": "cfs.cloud.tencent.com","name": {"zh": "文件存储","en": "Cloud File Storage"}}, {"domain": "cfw.qcloud.com","name": {"zh": "雲防火墙","en": "Cloud Firewall"}}, {"domain": "cge.cloud.tencent.com","name": null}, {"domain": "ci.qcloud.com","name": {"zh": "数据万象","en": "Cloud Infinite"}}, {"domain": "ckafka.qcloud.com","name": {"zh": "消息队列 CKafka","en": "Cloud Kafka"}}, {"domain": "clb.qcloud.com","name": {"zh": "负载均衡","en": "Cloud Load Balancer"}}, {"domain": "cloudaudit.cloud.tencent.com","name": {"zh": "雲审计","en": "CloudAudit"}}, {"domain": "cloudstudio.cloud.tencent.com","name": {"zh": "雲端开发环境","en": "Cloud Studio"}}, {"domain": "cls.cloud.tencent.com","name": {"zh": "日志服务","en": "Cloud Log Service"}}, {"domain": "cls.qcloud.com","name": null}, {"domain": "cm.qcloud.com","name": {"zh": "雲监控","en": "Cloud Monitor"}}, {"domain": "coding.cloud.tencent.com","name": {"zh": "CODING DevOps","en": "CODING DevOps"}}, {"domain": "cos.qcloud.com","name": {"zh": "对象存储","en": "Cloud Object Storage"}}, {"domain": "cts.qcloud.com","name": {"zh": "视频处理","en": "Video Cloud"}}, {"domain": "cvm.qcloud.com","name": {"zh": "雲服务器","en": "Cloud Virtual Machine"}}, {"domain": "devops.cloud.tencent.com","name": {"zh": "腾讯雲开发者平台","en": "Tencent Cloud Developer-TDP"}}, {"domain": "di.qcloud.com","name": {"zh": "数据集成","en": "DI"}}, {"domain": "dsgc.qcloud.com","name": {"zh": "数据安全治理中心","en": "Data Security Governance Center"}}, {"domain": "dts.qcloud.com","name": {"zh": "数据传输服务","en": "Data Transmission Service-DTS"}}, {"domain": "emr.cloud.tencent.com","name": {"zh": "弹性MapReduce","en": "Elastic MapReduce"}}, {"domain": "iai.qcloud.com","name": {"zh": "人脸识别","en": "Image AI"}}, {"domain": "icm.tencent.com","name": null}, {"domain": "idaas.cloud.tencent.com","name": {"zh": "身份管理服务","en": "IDaaS"}}, {"domain": "ieg_port_scan.tencent.com","name": null}, {"domain": "iotcloud.qcloud.com","name": {"zh": "物联网通信","en": "IotHub"}}, {"doin": "iotsuite.cloud.tencent.com","name": {"zh": "加速物联网套件","en": "IoT Suite"}}, {"domain": "labs.cloud.tencent.com","name": {"zh": "开发者实验室","en": "Developer Laboratory"}}, {"domain": "lvb.qcloud.com","name": {"zh": "雲直播","en": "Live Video Broadcasting-LVB"}}, {"domain": "mariadb.qcloud.com","name": {"zh": "雲数据库 MariaDB","en": "TencentDB for MariaDB"}}, {"domain": "message.qcloud.com","name": null}, {"domain": "mgobe.cloud.tencent.com","name": {"zh": "小游戏联机对战引擎","en": "Mini Game Online Battle Engine-mgobe"}}, {"domain": "mongodb.qcloud.com","name": {"zh": "雲数据库 MongoDB","en": "TencentDB for MongoDB"}}, {"domain": "mps.cloud.tencent.com","name": {"zh": "视频处理","en": "Media Processing Service"}}, {"domain": "msp.cloud.tencent.com","name": {"zh": "迁移服务平台","en": "Migrate Service Platform"}}, {"domain": "mts.tencent.com","name": {"zh": "媒体转码服务","en": "Media Transcoding Service"}}, {"domain": "narms.qcloud.com","name": {"zh": "网络资产风险监测系统","en": "Network Assets Risk Monitor System"}}, {"domain": "pai.cloud.tencent.com","name": {"zh": "小程序雲主机","en": "Publicly Accessible Instance-PAI"}}, {"domain": "qco.qcloud.com","name": null}, {"domain": "saas.cloud.tencent.com","name": {"zh": "臻选市场","en": "SaaS Market"}}, {"domain": "scf.qcloud.com","name": {"zh": "雲函数","en": "Serverless Cloud Function"}}, {"domain": "scs.qcloud.com","name": {"zh": "流计算Oceanus","en": "Oceanus"}}, {"domain": "sparkling.cloud.tencent.com","name": {"zh": "雲数据仓库套件-Sparkling","en": "Sparkling"}}, {"domain": "ssa.qcloud.com","name": {"zh": "安全运营中心","en": "Security Situation Awareness"}}, {"domain": "tcb.cloud.tencent.com","name": {"zh": "雲开发","en": "TCB"}}, {"domain": "tdm.qcloud.com","name": {"zh": "数据库中间件","en": "Tencent Database Middleware"}}, {"domain": "ti.cloud.tencent.com","name": {"zh": "腾讯智能钛","en": "TI"}}, {"domain": "tia.qcloud.com","name": {"zh": "智能钛机器学习加速器","en": "TI Accelerator"}}, {"domain": "tiems.cloud.tencent.com","name": {"zh": "智能钛弹性模型服务","en": "Tencent Intelligence Elastic Model Service"}}, {"domain": "tione.cloud.tencent.com","name": {"zh": "智能钛机器学习平台","en": "TI-ONE"}}, {"domain": "tis.qcloud.com","name": {"zh": "智能钛自动机器学习","en": "TI Self-Learning"}}, {"domain": "tsf.qcloud.com","name": {"zh": "腾讯微服务平台","en": "Tencent Service Framework"}}, {"domain": "tss.qcloud.com","name": {"zh": "客服支持平台","en": "Tencent Support System"}}, {"domain": "wemall.cloud.tencent.com","name": {"zh": "微Mall","en": "WeMall"}}, {"domain": "youmall.cloud.tencent.com","name": {"zh": "腾讯优Mall","en": "YouMall"}}, {"domain": "zhiyun.cloud.tencent.com","name": {"zh": "织雲","en": "Cloud Operations Console"}}]},"seqId": "4169e1e2-8f53-74bf-70eb-ce38b90f1360"}';
    }
  }
};
</script>
<style lang="scss" scoped>
// ::v-deep .el-tooltip__popper .is-light{
//   max-width: 50%;
// }
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.RoleDetail >>> .el-loading-mask {
  background: #fff;
}
.spns {
  width: 80px;
  display: inline-block;
}
.pagstyle {
  padding: 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.RoleDetail {
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
    margin-top: 20px;
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
        flex-direction: column;

        p {
          margin-bottom: 14px;
          display: flex;
        }
        .item {
          padding-bottom: 20px;
        }
        .baseInfo_right {
          padding-left: 20px;
        }
        .baseInfo_left {
          .baseInfo_type {
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
      }
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
.explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 20px;

    p {
      line-height: 20px;
    }
  }
</style>
