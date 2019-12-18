<template>
  <div class="StrategyDetail">
    <div class="top">
      <img
        style="width:20px;cursor: pointer;"
        @click="back"
        src="../../../assets/CAM/images/left.png"
        alt
      />
      <span class="top_text">策略详情</span>
    </div>
    <div class="container">
      <div class="baseInfo" v-loading="infoLoad">
        <p class="baseInfo_title">基本信息</p>
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
              <el-input
                v-if="input_show"
                v-model="input_Value"
                size="mini"
                style="width:150px"
                :placeholder="$t('CAM.strategy.inputContent')"
              ></el-input>
              <a
                v-if="input_show"
                @click="input_sure"
                style="margin-left:10px"
                href="javascript:;"
              >确定</a>
              <a
                v-if="input_show"
                @click="input_cancel"
                style="margin-left:10px"
                href="javascript:;"
              >取消</a>
              <span v-if="!input_show">{{inputValue}}</span>
              <i
                v-if="!input_show"
                @click="icon_click"
                style="cursor: pointer;"
                class="el-icon-edit item"
              ></i>
            </p>
            <p class="baseInfo_type item">{{policy.Type}}</p>
            <p class="baseInfo_time item">{{policy.AddTime}}</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- <el-tab-pane :label="$t('CAM.strategy.starLangu')" name="first">
            <div class="markdown"></div>
          </el-tab-pane>-->
          <!-- tab 策略详情页面，关联用户组tab  start -->
          <el-tab-pane :label="$t('CAM.strategy.straGroup')" name="first">
            <div class="config">
              <p style="margin:10px">
                <el-button
                  type="primary"
                  @click="Relation_user"
                  size="small"
                >{{$t('CAM.strategy.straGroup')}}</el-button>
                <el-button
                  type="primary"
                  @click="Relieve_user"
                  size="small"
                  :disabled="display"
                >{{$t('CAM.strategy.outBindUser')}}</el-button>
              </p>
              <div class="config_table">
                <el-table
                  v-loading="loading"
                  :data="policysData"
                  height="300"
                  @selection-change="handleSelectionChange"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="60"></el-table-column>
                  <el-table-column prop="date" :label="$t('CAM.strategy.straGroup')">
                    <template slot-scope="scope">
                      <el-button
                        @click="handleClickPolicies(scope.row)"
                        type="text"
                        size="small"
                      >{{scope.row.Name}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">
                      <el-dropdown trigger="click" @command="handleCommand" size="mini">
                        <span style="color:#909399">
                          {{ tableTitle }}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="item in table_options"
                            :key="item.value"
                            :command="item"
                          >{{item.label}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                      <p v-show="scope.row.RelatedType == '1'">{{$t('CAM.strategy.userBind')}}</p>
                      <p v-show="scope.row.RelatedType == '2'">{{$t('CAM.strategy.userGroupBind')}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                      <!-- <el-button size="mini" type="text" @click="popover_visible = true" slot="reference">解除用户<span v-show="scope.row.RelatedType == '2'">组</span></el-button> -->
                      <el-button
                        size="mini"
                        type="text"
                        @click="removePolicyEntity(scope.row)"
                        slot="reference"
                      >
                        {{$t('CAM.strategy.sureOubind')}}
                        <span
                          v-show="scope.row.RelatedType == '2'"
                        >{{$t('CAM.strategy.team')}}</span>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
              
             <div style="flex:1;display:flex;justify-content: flex-end;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
          <el-pagination
            :page-size="pagesize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="TotalCount"
          ></el-pagination>
        </div>
            </div>
          </el-tab-pane>
          <!-- tab 策略详情页面，关联用户组tab  end -->
        </el-tabs>
      </div>
      <!-- dialog关联用户组弹框页面 start -->
      <el-dialog :visible.sync="dialogVisible" width="72%" :before-close="handleClosePolicy">
        <p class="dialog">{{$t('CAM.strategy.straGroup')}}</p>
        <div>
          <transfer ref="userTransfer" :PolicyId="policy.PolicyId"></transfer>
        </div>
        <p style="text-align:center;margin-top:20px">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="attachPolicy"
            size="small"
          >{{$t('CAM.strategy.suerStr')}}</el-button>
        </p>
      </el-dialog>
      <!-- dialog关联用户组弹框页面 end -->
      <el-dialog
        :visible.sync="Relieve_dialogVisible"
        width="30%"
        :before-close="handleClosePolicyRemove"
      >
        <p class="dialog">{{$t('CAM.strategy.outBindUser')}}</p>
        <div style="margin:15px 0">
          <p>
            {{$t('CAM.strategy.overChoose')}}，
            <a
              href="javascript:;"
              @click="look_detail"
            >{{$t('CAM.strategy.lookDetils')}}</a>
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
          <el-button
            type="primary"
            @click="removePolicysEntity"
            size="small"
          >{{$t('CAM.strategy.suerStr')}}</el-button>
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
  ATTACH_GROUP
} from "@/constants";
import transfer from "./component/transfer";
export default {
  components: {
    transfer
  },
  data() {
    return {
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1 ,// 当前页码
      activeName: "first",
      policy: {},
      policysData: [],
      policysSelData: [],
      table_options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "用户关联"
        },
        {
          value: "2",
          label: "用户组关联"
        }
      ],
      entityFilter: "",
      tableTitle: "类型",
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
      handleFlag: false
    };
  },
  created() {
    this.infoLoad = true;
    const params = {
      Version: "2019-01-16",
      PolicyId: this.$route.query.policy
    };
    this.axios.post(GET_POLICY, params).then(res => {
      this.policy = res.Response;
      this.infoLoad = false;
    });
    this.getAttachPolicys();
  },
  methods: {
    handleCurrentChange(val){
       this.currpage = val;
       this.getAttachPolicys();
    },
    // 打开 关联用户/用户组 页面
    Relation_user() {
      this.dialogVisible = true;
      if (this.handleFlag) {
        this.$refs.userTransfer.getList(); //dialog关闭再打开，created()mounted()方法不执行，所以需要再此处执行初始化方法
      }
    },
    // 关闭 关联用户/用户组 页面
    handleClosePolicy() {
      this.dialogVisible = false;
      this.handleFlag = this.$refs.userTransfer.getHandleFlag();
    },
    // 关联用户/用户组 跳转用户、用户组页面连接方法
    handleClickPolicies(obj) {
      if (obj.RelatedType != undefined && obj.RelatedType === 1) {
        this.$router.push({
          path: "/details",
          query: {
            content: obj.Name
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
      console.log(this.policysSelData);
      this.$refs.userTransfer.attachPolicy();
      this.dialogVisible = false;
      this.getAttachPolicys(); // 重新加载策略关联实体列表
      this.$refs.userTransfer.clearData(); // 添加完毕时清空数组。
      this.handleFlag = this.$refs.userTransfer.getHandleFlag();
    },
    // 获取策略关联的实体列表
    getAttachPolicys() {
      this.selTotal = 0;
      this.policysData = [];
      let policyId = this.$route.query.policy;
      let params = {
        Version: '2019-01-16',
        Page: this.currpage,
        Rp: this.pagesize,
        PolicyId: policyId
      };
      let entityFilter = this.entityFilter;
      //'All' 表示获取所有实体类型，'User' 表示只获取子账号，'Group' 表示只获取用户组，'Role' 表示只获取角色，默认取 'All'
      if (entityFilter != undefined && entityFilter != "") {
        params["EntityFilter"] = entityFilter;
      } else {
        params["EntityFilter"] = "User|Group";
      }
      this.axios.post(LIST_ENPOLICY, params).then(res => {
        // RelatedType 关联类型。1 用户关联 ； 2 用户组关联
        this.policysData = res.Response.List
        this.TotalCount= res.Response.TotalNum
        this.loading = false
        console.log(res)
      })
    },
    // 解除策略绑定实体
    removePolicyEntity(obj) {
      let policyId = this.policy.PolicyId;
      if (obj != "" && obj.RelatedType === 1) {
        let paramsUser = {
          Action: "DetachUserPolicy",
          Version: "2019-01-16",
          PolicyId: policyId,
          DetachUin: obj.Uin
        };
        this.removeUserPolicy(paramsUser);
      }
      if (obj != "" && obj.RelatedType === 2) {
        let paramsGroup = {
          Action: "DetachGroupPolicy",
          Version: "2019-01-16",
          PolicyId: policyId,
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
          this.getAttachPolicys(); // 重新加载
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
          this.getAttachPolicys(); // 重新加载
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClick() {},
    Relieve_user() {
      this.Relieve_dialogVisible = true;
    },
    // 批量解除绑定到策略的实体
    removePolicysEntity() {
      let arrs = this.policysSelData;
      for (let i = 0; i < arrs.length; i++) {
        let obj = arrs[i];
        this.removePolicyEntity(obj);
      }
      this.Relieve_dialogVisible = false;
    },
    handleSelectionChange(val) {
      if (val != "") {
        this.policysSelData = val;
        this.display = false;
        this.selTotal = val.length;
      } else {
        this.display = true;
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
    handleSizeChange(val) {
      this.rp = val;
      this.getAttachPolicys();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAttachPolicys();
    },
    handleClose() {},
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
</style>
