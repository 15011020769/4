<template>
  <div class="RoleDetail" v-loading="loading">
    <HeadCom :title="roleInfo.RoleName" :backShow="true" @_back="_back" />
    <div class="container">
      <div class="baseInfo">
        <p class="baseInfo_title">角色信息</p>
        <div class="baseInfo_flex">
          <div class="baseInfo_left">
            <p class="baseInfo_cl item">角色名称</p>
            <p class="baseInfo_ms item">RoleArn</p>
            <p class="baseInfo_mark item">角色ID</p>
            <p class="baseInfo_type item">角色描述</p>
            <p class="baseInfo_time item">创建时间</p>
          </div>
          <div class="baseInfo_right">
            <p class="baseInfo_cl item">{{roleInfo.RoleName}}</p>
            <p class="baseInfo_ms item">{{roleInfo.PolicyDocument}}</p>
            <p class="baseInfo_type item">{{roleInfo.RoleId}}</p>
            <p class="baseInfo_mark item">
              <el-input
                v-if="input_show"
                v-model="roleInfo.Description"
                size="mini"
                style="width:150px"
                placeholder="请输入内容"
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
              <span v-if="!input_show">{{roleInfo.Description}}</span>
              <i
                v-if="!input_show"
                @click="icon_click"
                style="cursor: pointer;"
                class="el-icon-edit item"
              ></i>
            </p>
            <p class="baseInfo_time item">{{roleInfo.AddTime}}</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- tab 角色策略 start -->
          <el-tab-pane label="已授权策略" name="first">
            <p style="margin:10px">
              <el-button type="primary" @click="relationPolicies" size="small">关联策略</el-button>
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
                    <div v-if="scope.row.PolicyType == 'User'">自定义策略</div>
                    <div v-else-if="scope.row.PolicyType == 'QCS'">预设策略</div>
                  </template>
                </el-table-column>
                <el-table-column prop="AddTime" label="关联时间"></el-table-column>
                <el-table-column label="失效时间">
                  <template slot-scope="scope">
                    <span>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="relieveRolePolicy(scope.row)"
                      type="text"
                      size="small"
                    >解除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div
                style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
              >
                <div>
                  <span style="font-size:12px;color:#888">已选 {{selTotalNum}} 项，共 {{TotalNum}} 项</span>
                </div>
                <div>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage2"
                    :page-sizes="[10, 20, 50, 100, 200]"
                    :page-size="rpPolicies"
                    layout="sizes, prev, pager, next"
                    :total="TotalNum"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab 角色策略 end -->
          <!-- tab 角色载体 start -->
          <el-tab-pane label="角色载体" name="second">
            <div class="config">
              <p style="margin:10px">
                <el-button type="primary" @click="Relation_user" size="small">管理载体</el-button>
              </p>
              <div class="config_table">
                <el-table
                  :data="roleCarrier"
                  height="300"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%"
                >
                  <el-table-column label="角色载体">
                    <template slot-scope="scope" show-overflow-tooltip>
                      <span>{{scope.row}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        v-if="roleCarrier.length === 1"
                        type="text"
                        size="small"
                        disabled
                      >解除</el-button>
                      <el-button
                        v-if="roleCarrier.length > 1"
                        @click.native.prevent="updateRolePolicy(scope.$index, roleCarrier)"
                        type="text"
                        size="small"
                      >解除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
                >
                  <div>
                    <span style="font-size:12px;color:#888">已选 {{selTotalNum}} 项，共 {{TotalNum}} 项</span>
                  </div>
                  <div>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage2"
                      :page-sizes="[100, 200, 300, 400]"
                      :page-size="20"
                      layout="sizes, prev, pager, next"
                      :total="TotalNum"
                    ></el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab  角色载体 end -->
          <el-tab-pane label="撤销会话" name="third">
            <p>
              <el-popover
                placement="top-start"
                title
                width="200"
                trigger="hover"
                content="您无法撤销服务角色的活跃会话"
              >
                <div slot="reference" style="display:inline-block">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="cancelAllSession"
                    disabled
                  >撤销所有会话</el-button>
                </div>
              </el-popover>
            </p>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="25%" :before-close="handleCloseSessionHint">
        <h3 slot="title">风险提醒</h3>
        <p
          style="line-height: 20px;padding: 0;background: #fff;font-size: 12px;margin-bottom: 27px;color: #444;"
        >该角色为您授权的服务角色，擅自更改角色内容（角色关联策略或者角色载体）可能导致您授权的服务无法正确使用该角色。</p>
        <p style="text-align:center" slot="footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="Relievesure_dialogVisible = true;dialogVisible = false;"
            size="small"
          >确 定</el-button>
        </p>
      </el-dialog>
      <!-- 载体dialog  start -->
      <el-dialog
        :visible.sync="Relievesure_dialogVisible"
        width="70%"
        :before-close="handleCloseCarrierBody"
      >
        <span>云账号</span>
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
        <p class="dialog">解除用户/组</p>
        <div style="margin:15px 0">
          <p>
            已选择1个用户/组，
            <a href="javascript:;" @click="look_detail">查看详情</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in RelieveData" :key="item">{{item}}</p>
          </div>
          <h3 style="margin-top:15px">确认是否解除？</h3>
          <p>解除后，以上策略关联的用户或用户组将失去对应的权限。</p>
        </div>
        <p style="text-align:center">
          <el-button @click="Relieve_dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="Relieve_dialogVisible = false" size="small">确 定</el-button>
        </p>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisiblePolicies"
        width="70%"
        :before-close="handleClosePolicy"
      >
        <p class="dialog" slot="title">关联策略</p>
        <transfer ref="transferPolicies" :roleId="roleId"></transfer>
        <p style="text-align:center;margin-top:30px">
          <el-button @click="dialogVisiblePolicies = false" size="small">取 消</el-button>
          <el-button type="primary" @click="attachRolePolicies" size="small">确 定</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import transfer from "./component/transfer";
import HeadCom from "../UserListNew/components/Head";
export default {
  components: {
    transfer,
    HeadCom
  },
  data() {
    return {
      loading: true,
      title: "",
      activeName: "first",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      Relieve_dialogVisible: false,
      transfer_value: [],
      dialogVisiblePolicies: false,
      transfer_data: [
        {
          value: 1,
          desc: "备选项1"
        },
        {
          value: 2,
          desc: "备选项2"
        },
        {
          value: 3,
          desc: "备选项3"
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
          label: "自定义策略"
        },
        {
          value: "QCS",
          label: "预设策略"
        }
      ],
      displayPolicies: true,
      tableTitle: "策略类型",
      rolePolicies: [],
      roleSelPolicies: [],
      pagePolicies: 1,
      rpPolicies: 20,
      roleCarrier: [],
      TotalNum: 0,
      selTotalNum: 0,
      roleServeCarrier: [],
      checkedRoleServeCarrier: [],
      Relievesure_dialogVisible: false,
      rolePolicyType: ""
    };
  },
  mounted() {
    this.roleId = this.$route.query.RoleId;
    this.init();
  },
  methods: {
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
      let _this = this;
      let url = "cam2/GetRole";
      let paramsInfo = {
        Action: "GetRole",
        Version: "2019-01-16",
        RoleId: this.roleId
      };
      this.axios
        .post(url, paramsInfo)
        .then(res => {
          let resInfo = res.Response.RoleInfo;
          let PolicyDocument = JSON.parse(resInfo.PolicyDocument);
          if (typeof PolicyDocument.statement[0].principal.qcs === "object") {
            _this.roleCarrier = PolicyDocument.statement[0].principal.qcs;
            resInfo.PolicyDocument =
              PolicyDocument.statement[0].principal.qcs[0];
          }
          if (typeof PolicyDocument.statement[0].principal.qcs === "string") {
            _this.roleCarrier.push(PolicyDocument.statement[0].principal.qcs);
            resInfo.PolicyDocument = PolicyDocument.statement[0].principal.qcs;
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
          this.roleInfo = resInfo;
          this.loading = false;
        })
        .catch(error => {});
    },
    // 获取角色策略
    getRolePolicy() {
      this.selTotalNum = 0;
      let url = "cam2/ListAttachedRolePolicies";
      let paramsList = {
        Action: "ListAttachedRolePolicies",
        Version: "2019-01-16",
        Page: this.pagePolicies,
        Rp: this.rpPolicies,
        RoleId: this.roleId
      };
      if (this.rolePolicyType != "") {
        paramsList["PolicyType"] = this.rolePolicyType;
      }
      this.axios
        .post(url, paramsList)
        .then(res => {
          this.rolePolicies = res.Response.List;
          this.TotalNum = res.Response.TotalNum;
        })
        .catch(error => {});
    },
    // 解除角色策略
    relieveRolePolicy(scope) {
      let paramsDel = {
        Action: "DetachRolePolicy",
        Version: "2019-01-16",
        PolicyId: scope.PolicyId,
        DetachRoleId: this.roleId
      };
      this.relievePolicy(paramsDel);
    },
    // 解除角色绑定的策略
    relievePolicy(paramsRelieve) {
      let url = "cam2/DetachRolePolicy";
      this.axios
        .post(url, paramsRelieve)
        .then(res => {
          this.getRolePolicy(); // 重新加载
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
      let arrs = this.roleSelPolicies;
      for (let i = 0; i < arrs.length; i++) {
        let obj = arrs[i];
        this.relieveRolePolicy(obj);
      }
      this.displayPolicies = false;
    },
    // 修改角色描述信息
    updateRoleDescription() {
      let url = "cam2/UpdateRoleDescription";
      let paramsUpdate = {
        Action: "UpdateRoleDescription",
        Version: "2019-01-16",
        Description: this.roleInfo.Description,
        RoleId: this.roleId
      };
      this.axios
        .post(url, paramsUpdate)
        .then(res => {
          this.getRoleDetail(); //重新加载
        })
        .catch(error => {});
    },
    // 修改角色信任策略
    updateRolePolicy(index, rows) {
      this.roleCarrier.splice(index, 1); // 从数组中删除要移除的数据
      let url = "cam2/UpdateAssumeRolePolicy";
      let policyDocument = JSON.parse(
        '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":[]}}]}'
      );
      policyDocument.statement[0].principal.service = policyDocument.statement[0].principal.service.concat(
        this.roleCarrier
      );
      let paramsPolicy = {
        Action: "UpdateAssumeRolePolicy",
        Version: "2019-01-16",
        PolicyDocument: policyDocument,
        RoleId: this.roleId
      };
      this.axios
        .post(url, paramsPolicy)
        .then(res => {
          this.getRoleDetail(); //重新加载
        })
        .catch(error => {});
    },
    // 打开关联策略dialog
    relationPolicies() {
      this.dialogVisiblePolicies = true;
    },
    // 关联角色策略
    attachRolePolicies() {
      this.$refs.transferPolicies.attachRolePolicies();
      this.dialogVisiblePolicies = false;
      this.getRolePolicy();
    },
    // 关闭关联策略dialog
    handleClosePolicy() {
      this.dialogVisiblePolicies = false;
    },
    first_handleClick(obj) {
      debugger;
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: obj
        }
      });
    },
    icon_click() {
      this.input_show = true;
      this.input_Value = this.inputValue;
    },
    input_cancel() {
      this.input_show = false;
    },
    input_sure() {
      this.input_show = false;
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
    cancelAllSession() {
      // let url = "cam2/UpdatePolicy";
      // let policyDocument = JSON.parse('{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":[]}}]}')
      // policyDocument.statement[0].principal.service = policyDocument.statement[0].principal.service.concat(this.roleCarrier)
      // let paramsPolicy = {
      //   Action: "UpdatePolicy",
      //   Version: "2019-01-16",
      //   PolicyDocument: policyDocument,
      //   RoleId: this.roleId
      // };
      // this.axios.post(url, paramsPolicy).then(res => {
      //   this.getRoleDetail() //重新加载
      // }).catch(error => {
      // });
    },
    handleClick() {},
    isRelieve() {},
    // 管理载体
    Relation_user() {
      this.dialogVisible = true;
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
      return '{"Responce": {"data": [{"domain": "aegis.qcloud.com","name": {"zh": "宙斯盾安全防护","en": "Aegis"}}, {"domain": "apigateway.qcloud.com","name": {"zh": "API网关","en": "ApiGateway"}}, {"domain": "as.cloud.tencent.com","name": {"zh": "弹性伸缩","en": "Auto Scaling-AS"}}, {"domain": "baas.qq.com","name": {"zh": "腾讯区块链开发平台","en": "Tencent Blockchain"}}, {"domain": "batchoperations.cos.cloud.tencent.com","name": {"zh": "对象存储批量处理","en": "Cloud Object Storage Batch Operations"}}, {"domain": "blueking.cloud.tencent.com","name": {"zh": "蓝鲸平台","en": "BlueKing"}}, {"domain": "bm.qcloud.com","name": {"zh": "黑石物理服务器1.0","en": "Cloud Physical Machine"}}, {"domain": "bpaas.cloud.tencent.com","name": {"zh": "商业流程服务","en": "BPaaS"}}, {"domain": "ccs.qcloud.com","name": {"zh": "容器服务","en": "Tencent Kubernetes Engine"}}, {"domain": "cdb.qcloud.com","name": {"zh": "云数据库 MySQL","en": "TencentDB for MySQL"}}, {"domain": "cdn.cloud.tencent.com","name": {"zh": "内容分发网络","en": "Content Delivery Network - CDN"}}, {"domain": "cfs.cloud.tencent.com","name": {"zh": "文件存储","en": "Cloud File Storage"}}, {"domain": "cfw.qcloud.com","name": {"zh": "云防火墙","en": "Cloud Firewall"}}, {"domain": "cge.cloud.tencent.com","name": null}, {"domain": "ci.qcloud.com","name": {"zh": "数据万象","en": "Cloud Infinite"}}, {"domain": "ckafka.qcloud.com","name": {"zh": "消息队列 CKafka","en": "Cloud Kafka"}}, {"domain": "clb.qcloud.com","name": {"zh": "负载均衡","en": "Cloud Load Balancer"}}, {"domain": "cloudaudit.cloud.tencent.com","name": {"zh": "云审计","en": "CloudAudit"}}, {"domain": "cloudstudio.cloud.tencent.com","name": {"zh": "云端开发环境","en": "Cloud Studio"}}, {"domain": "cls.cloud.tencent.com","name": {"zh": "日志服务","en": "Cloud Log Service"}}, {"domain": "cls.qcloud.com","name": null}, {"domain": "cm.qcloud.com","name": {"zh": "云监控","en": "Cloud Monitor"}}, {"domain": "coding.cloud.tencent.com","name": {"zh": "CODING DevOps","en": "CODING DevOps"}}, {"domain": "cos.qcloud.com","name": {"zh": "对象存储","en": "Cloud Object Storage"}}, {"domain": "cts.qcloud.com","name": {"zh": "视频处理","en": "Video Cloud"}}, {"domain": "cvm.qcloud.com","name": {"zh": "云服务器","en": "Cloud Virtual Machine"}}, {"domain": "devops.cloud.tencent.com","name": {"zh": "腾讯云开发者平台","en": "Tencent Cloud Developer-TDP"}}, {"domain": "di.qcloud.com","name": {"zh": "数据集成","en": "DI"}}, {"domain": "dsgc.qcloud.com","name": {"zh": "数据安全治理中心","en": "Data Security Governance Center"}}, {"domain": "dts.qcloud.com","name": {"zh": "数据传输服务","en": "Data Transmission Service-DTS"}}, {"domain": "emr.cloud.tencent.com","name": {"zh": "弹性MapReduce","en": "Elastic MapReduce"}}, {"domain": "iai.qcloud.com","name": {"zh": "人脸识别","en": "Image AI"}}, {"domain": "icm.tencent.com","name": null}, {"domain": "idaas.cloud.tencent.com","name": {"zh": "身份管理服务","en": "IDaaS"}}, {"domain": "ieg_port_scan.tencent.com","name": null}, {"domain": "iotcloud.qcloud.com","name": {"zh": "物联网通信","en": "IotHub"}}, {"doin": "iotsuite.cloud.tencent.com","name": {"zh": "加速物联网套件","en": "IoT Suite"}}, {"domain": "labs.cloud.tencent.com","name": {"zh": "开发者实验室","en": "Developer Laboratory"}}, {"domain": "lvb.qcloud.com","name": {"zh": "云直播","en": "Live Video Broadcasting-LVB"}}, {"domain": "mariadb.qcloud.com","name": {"zh": "云数据库 MariaDB","en": "TencentDB for MariaDB"}}, {"domain": "message.qcloud.com","name": null}, {"domain": "mgobe.cloud.tencent.com","name": {"zh": "小游戏联机对战引擎","en": "Mini Game Online Battle Engine-mgobe"}}, {"domain": "mongodb.qcloud.com","name": {"zh": "云数据库 MongoDB","en": "TencentDB for MongoDB"}}, {"domain": "mps.cloud.tencent.com","name": {"zh": "视频处理","en": "Media Processing Service"}}, {"domain": "msp.cloud.tencent.com","name": {"zh": "迁移服务平台","en": "Migrate Service Platform"}}, {"domain": "mts.tencent.com","name": {"zh": "媒体转码服务","en": "Media Transcoding Service"}}, {"domain": "narms.qcloud.com","name": {"zh": "网络资产风险监测系统","en": "Network Assets Risk Monitor System"}}, {"domain": "pai.cloud.tencent.com","name": {"zh": "小程序云主机","en": "Publicly Accessible Instance-PAI"}}, {"domain": "qco.qcloud.com","name": null}, {"domain": "saas.cloud.tencent.com","name": {"zh": "臻选市场","en": "SaaS Market"}}, {"domain": "scf.qcloud.com","name": {"zh": "云函数","en": "Serverless Cloud Function"}}, {"domain": "scs.qcloud.com","name": {"zh": "流计算Oceanus","en": "Oceanus"}}, {"domain": "sparkling.cloud.tencent.com","name": {"zh": "云数据仓库套件-Sparkling","en": "Sparkling"}}, {"domain": "ssa.qcloud.com","name": {"zh": "安全运营中心","en": "Security Situation Awareness"}}, {"domain": "tcb.cloud.tencent.com","name": {"zh": "云开发","en": "TCB"}}, {"domain": "tdm.qcloud.com","name": {"zh": "数据库中间件","en": "Tencent Database Middleware"}}, {"domain": "ti.cloud.tencent.com","name": {"zh": "腾讯智能钛","en": "TI"}}, {"domain": "tia.qcloud.com","name": {"zh": "智能钛机器学习加速器","en": "TI Accelerator"}}, {"domain": "tiems.cloud.tencent.com","name": {"zh": "智能钛弹性模型服务","en": "Tencent Intelligence Elastic Model Service"}}, {"domain": "tione.cloud.tencent.com","name": {"zh": "智能钛机器学习平台","en": "TI-ONE"}}, {"domain": "tis.qcloud.com","name": {"zh": "智能钛自动机器学习","en": "TI Self-Learning"}}, {"domain": "tsf.qcloud.com","name": {"zh": "腾讯微服务平台","en": "Tencent Service Framework"}}, {"domain": "tss.qcloud.com","name": {"zh": "客服支持平台","en": "Tencent Support System"}}, {"domain": "wemall.cloud.tencent.com","name": {"zh": "微Mall","en": "WeMall"}}, {"domain": "youmall.cloud.tencent.com","name": {"zh": "腾讯优Mall","en": "YouMall"}}, {"domain": "zhiyun.cloud.tencent.com","name": {"zh": "织云","en": "Cloud Operations Console"}}]},"seqId": "4169e1e2-8f53-74bf-70eb-ce38b90f1360"}';
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
