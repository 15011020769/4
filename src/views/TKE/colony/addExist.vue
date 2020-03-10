<!-- 添加已有节点 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->

    <div class="tke-content-header ">
      <div class="tke-grid ">
        <!-- 左侧 -->

        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>

          <h2 class="header-title">
            {{ basicNews.ClusterId }}（{{ basicNews.ClusterName }}）
          </h2>
        </div>

        <!-- 右侧 -->

        <div class="grid-right"></div>
      </div>
    </div>

    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <div class="tke-step tke-grid">
          <div class="tke-step-item is-curr">
            <span class="num">1</span>

            <span class="title">选择节点</span>

            <i class="el-icon-arrow-right"></i>
          </div>

          <div class="tke-step-item" :class="{ 'is-curr': secondTab }">
            <span class="num">2</span>

            <span class="title">云服务器配置</span>
          </div>
        </div>

        <hr style="margin-left:-20px;margin-right:-20px" />

        <!--第一步-->

        <div class="tke-" v-if="firstTab">
          <div class="flex">
            <div class="left-box">
              <p>
                当前集群所在VPC（{{ VpcId }}）下有以下可用节点 共{{
                  leftList.length
                }}项 已加载 {{ leftList.length }} 项
              </p>

              <div class="search">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchInput"
                  class="input-with-select"
                >
                  <el-select
                    v-model="selectList"
                    slot="prepend"
                    placeholder="请选择"
                  >
                    <el-option label="instanceId" value="1"></el-option>

                    <el-option label="实例名" value="2"></el-option>

                    <el-option label="ip" value="3"></el-option>
                  </el-select>

                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="DataList"
                  ></el-button>
                </el-input>
              </div>

              <div class="right-table">
                <el-table
                  ref="multipleTable"
                  :data="leftList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="350"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    align="center"
                    type="selection"
                    :selectable="selectInit"
                    width="55"
                  >
                  </el-table-column>

                  <el-table-column label="ID/节点名">
                    <template slot-scope="scope">
                      <p>{{ scope.row.InstanceId }}</p>

                      <p>{{ scope.row.InstanceName }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="IP地址">
                    <template slot-scope="scope">
                      <p>
                        {{ scope.row.PublicIpAddresses[0] }}
                      </p>

                      <p>{{ scope.row.PrivateIpAddresses[0] }}</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="center-box">
              <i class="el-icon-arrow-left"></i>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="right-box">
              <p>已选择{{ rightList.length }}项</p>
              <el-table
                :data="rightList"
                tooltip-effect="dark"
                style="width: 430px;"
                height="390"
              >
                <el-table-column label="ID/节点名">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.InstanceId }}
                    </p>

                    <p>{{ scope.row.InstanceName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="IP地址">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.PublicIpAddresses[0] }}
                    </p>

                    <p>{{ scope.row.PrivateIpAddresses[0] }}</p>
                  </template>
                </el-table-column>
                <el-table-column width="55">
                  <template slot-scope="scope">
                    <i class="el-icon-error" @click="DeleteList(scope.row)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="selNode" class="select-node">请选择节点</div>
        </div>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="firstNext"
            >下一步</el-button
          >
        </div>
        <!--第二步-->
        <div v-if="secondTab">
          <el-form
            class="tke-form"
            :model="colony"
            label-position="left"
            label-width="120px"
            size="mini"
          >
            <el-form-item label="已选节点">
              <div class="selected-node">
                <p v-for="(item, index) in rightList" :key="index">
                  <a href="#">{{ item.InstanceId }}</a
                  >,
                </p>
              </div>
              <span class="tke-tips"
                >提示：以上节点需要重装系统，同时会将以上节点迁移至当前集群的新增资源所属项目下。注意：重装后，节点系统盘内的所有数据将被清除，恢复到初始状态；迁移项目后原安全组解绑，需要重新绑定安全组。</span
              >
            </el-form-item>
            <el-form-item label="数据盘挂载" class="item-box">
              <el-checkbox v-model="dataMountCheck"></el-checkbox>
              <!-- <input class="tke-checkbox" type="checkbox"/> -->
              <span style="color:#000;"
                >自动格式化数据盘成ext4，仅对拥有一块数据盘的节点生效</span
              >
              <div v-if="dataMountCheck">
                <el-input v-model="dataDiskMount"></el-input>
                <p class="tke-tips">
                  注意：已格式化的ext3，ext4，xfs文件系统的数据盘将直接挂载，其他文件系统或未格式化的数据盘将自动格式化为ext4并挂载
                </p>
                <p class="tke-tips-ash">
                  注意：无数据盘或有多块数据盘的云服务器的容器目录设置不生效。
                </p>
              </div>
            </el-form-item>
            <el-form-item label="容器目录" class="item-box">
              <el-checkbox v-model="containerListCheck"></el-checkbox>
              <span style="color:#000;"
                >设置容器和镜像存储目录，建议存储到数据盘</span
              >
              <div v-if="containerListCheck">
                <el-input v-model="containerList"></el-input>
              </div>
            </el-form-item>
            <hr />
            <el-form-item label="新增资源所属项目">
              <p style="color:#000;">{{ projectName }}</p>
              <span
                >集群内新增的云服务器、负载均衡器等资源将会自动分配到该项目下。<a
                  href="#"
                  >使用指引</a
                ><i class="el-icon-edit-outline"></i
              ></span>
            </el-form-item>
            <el-form-item>
              <span slot="label"
                >操作系统
                <el-tooltip
                  effect="dark"
                  content="操作系统为集群级别，您可以前往集群详情页进行修改，修改后新增或重装的节点将使用新的操作系统。"
                  placement="right"
                  ><i class="el-icon-info"></i> </el-tooltip
              ></span>
              <p style="color:#000;">Ubuntu Server 16.04.1 LTS 64bit</p>
            </el-form-item>
            <el-form-item label="登录方式">
              <div class="tke-second-radio-btn">
                <el-radio-group @change="changeType" v-model="loginType">
                  <el-radio-button label="1">立即关联秘钥</el-radio-button>
                  <el-radio-button label="2">自动生成密码</el-radio-button>
                  <el-radio-button label="3">设置密码</el-radio-button>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="用户名" v-if="joinPassWord">
              <p style="color:#000;">ubuntu</p>
            </el-form-item>
            <el-form-item label="SSH密钥" v-if="joinPassWord">
              <div class="tke-third-select">
                <el-select placeholder="请选择" v-model="sshKeySel">
                  <el-option
                    v-for="item in sshKey"
                    :key="item.KeyId"
                    :label="item.KeyName"
                    :value="item.KeyId"
                  >
                  </el-option>
                </el-select>
                <i class="el-icon-refresh ml5"></i>
                <a href="#">使用指引</a><i class="el-icon-edit-outline"></i>
                <p>
                  如您现有的密钥不合适，可以<a href="#">现在创建</a
                  ><i class="el-icon-edit-outline"></i>
                </p>
              </div>
            </el-form-item>
            <el-form-item label="用户名" v-if="setPassWord">
              <p style="color:#000;">ubuntu</p>
            </el-form-item>
            <el-form-item label="密码" v-if="setPassWord" class="password">
              <el-input
                placeholder="请输入主机密码"
                :class="{ 'cluster-wran': colonyThird.passwordWran }"
                v-model="passwordVal"
                @blur="PasswordInput(passwordVal)"
                show-password
              ></el-input>
              <el-tooltip
                effect="light"
                :content="colonyThird.passwordTips"
                placement="right"
                v-if="colonyThird.passwordWran"
                ><i class="el-icon-warning-outline ml5"></i>
              </el-tooltip>
              <p>
                linux机器密码需8到16位，至少包括两项（[a-z,A-Z] ,
                [0-9]和[()`~!@#$%^&}*-+=|{}[]:;',.?/]的特殊符号）
              </p>
            </el-form-item>
            <el-form-item>
              <span slot="label">安全组 <i class="el-icon-info"></i></span>
              <div class="tke-third-select" style="margin-bottom:6px;">
                <el-select placeholder="请选择" v-model="securityGroupSel">
                  <el-option
                    v-for="x in securityGroupOpt"
                    :key="x.label"
                    :label="x.label"
                    :value="x.label"
                  >
                  </el-option>
                </el-select>
                <i class="el-icon-refresh ml5"></i>
              </div>
              <div
                class="tke-third-select"
                v-for="(item, index) in itemArr"
                :key="index"
                style="margin-bottom:6px;display: flex;align-items: center;"
              >
                <el-select placeholder="请选择" v-model="item.securityGroupSel">
                  <el-option
                    v-for="x in securityGroupOpt"
                    :key="x.value"
                    :label="x.label"
                    :value="x.value"
                  >
                  </el-option>
                </el-select>
                <i class="el-icon-refresh ml5"></i>
                <i
                  class="el-icon-error ml5"
                  @click="deleteExceptPrice(index)"
                ></i>
              </div>
              <p>
                <a
                  href="javascript:;"
                  @click="addExceptPrice"
                  v-if="itemArr.length < 9"
                  >添加安全组</a
                >
              </p>
            </el-form-item>
            <el-form-item label="安全加固">
              <el-checkbox v-model="safetyCheck">免费开通</el-checkbox>
              <p>
                安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="#"
                  >详细介绍</a
                ><i class="el-icon-edit-outline"></i>
              </p>
            </el-form-item>
            <el-form-item label="云监控">
              <el-checkbox v-model="cloudMonitorCheck">免费开通</el-checkbox>
              <p class="tke-tips-orange" v-if="!cloudMonitorCheck">
                取消勾选将无法获得集群、主机、容器等相关监控信息及告警等能力，请慎重选择
              </p>
              <p>
                免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标<a
                  href="#"
                  >详细介绍</a
                ><i class="el-icon-edit-outline"></i>
              </p>
            </el-form-item>
            <p>
              <i
                :class="[
                  isActive ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                ]"
              ></i
              ><el-button
                type="text"
                style="font-size:12px;"
                @click="isActive = !isActive"
                >高级设置</el-button
              >
            </p>
            <el-form-item v-show="isActive">
              <span slot="label">自定义数据 <i class="el-icon-info"></i></span>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="可选，用于启动时配置实例，支持Shell格式，原始数据不能超过16KB"
                v-model="textarea2"
                class="w420"
              >
              </el-input>
            </el-form-item>

            <el-form-item label="封锁（cordon）" v-show="isActive">
              <el-checkbox v-model="openBlockadeCheck">开启封锁</el-checkbox>
              <el-form-item>
                <p>
                  封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点，或在自定义数据中执行<a
                    href="https://cloud.tencent.com/document/product/457/18824"
                    target="_blank"
                    >取消封锁命令</a
                  ><i class="el-icon-edit-outline"></i>
                </p>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Label" v-show="isActive">
              <el-form-item v-for="(domain, index) in domainstion" :key="index">
                <div class="form-input">
                  <el-input
                    size="mini"
                    class="w70"
                    v-model="domain.value"
                  ></el-input>
                  <span>=</span>
                  <el-input
                    size="mini"
                    class="w70"
                    v-model="domain.valueKey"
                  ></el-input
                  ><i
                    class="el-icon-error ml10"
                    @click="removeDomain2(index)"
                  ></i>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="text" @click="addDomain2">新增Lable</el-button>
                <p>
                  标签名称只能包含字母、数字及分隔符("-"、"_"、"."、"/")，且必须以字母、数字开头和结尾
                </p>
                <p>
                  标签值只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾
                </p>
              </el-form-item>
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <div class="tke-formpanel-footer">
            <el-button size="small" @click="secondPrev">上一步</el-button>
            <el-button size="small" type="primary" @click="AddComplete"
              >完成</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  ALL_CITY,
  ALL_PROJECT,
  TKE_COLONY_LIST,
  TKE_EXIST,
  TKE_EXIST_NODES,
  TKE_SSH,
  TKE_MISG,
  TKE_ADD_COMPLETE
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "clusterAddExist",
  data() {
    return {
      // 第一个tab
      firstTab: true,
      // 第二个tab
      secondTab: false,
      // 关联密码选项
      joinPassWord: true,
      // 自动生成密码选项
      autoPassWord: false,
      // 设置密码选项
      setPassWord: false,
      isActive: false,
      domainstion: [],
      loginType: 1,
      textarea2: "",
      genDataValue: [],
      colony: {
        chargingMode: "mode1"
      },
      searchInput: "",
      basicNews: "",
      selectList: "",
      VpcId: "",
      leftList: [],
      rightList: [],
      index: [],
      multipleSelection: [],
      selNode: false, // 请选择节点
      dataMountCheck: false,
      dataDiskMount: "/var/lib/docker",
      // 密码
      passwordVal: "",
      // 容器目录
      containerListCheck: false,
      containerList: "/var/lib/docker",
      projectName: "",
      projectId: this.$route.query.ProjectId,
      sshKey: [],
      sshKeySel: "",
      sshKeySelId: "",
      safetyCheck: true,
      cloudMonitorCheck: true,
      itemArr: [],
      securityGroupOpt: [],
      securityGroupSel: "",
      arr: "",
      // 开启封锁
      openBlockadeCheck: false,
      // 第三步
      colonyThird: {
        passwordWran: false,
        passwordTips: "密码不能为空"
      }
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {
    console.log(this.projectId);
  },
  mounted() {
    this.getColonyList();
    this.SSHKey();
  },
  methods: {
    // 返回上一层
    goBack() {
      this.$router.go(-1);
    },
    // 获取集群列表
    async getColonyList() {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25"
      };
      params["ClusterIds.0"] = this.$route.query.clusterId;
      const res = await this.axios.post(TKE_COLONY_LIST, params);
      if (res.Response.Error === undefined) {
        this.basicNews = res.Response.Clusters[0];
        this.VpcId = this.basicNews.ClusterNetworkSettings.VpcId;
        this.DataList();
      } else {
        let ErrTips = {
          InternalError: "内部错误",
          "InternalError.CamNoAuth": "没有权限。",
          "InternalError.Db": "db错误。",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
          "InternalError.QuotaMaxClsLimit": "超过配额限制。",
          "InternalError.QuotaMaxNodLimit": "超过配额限制。",
          InvalidParameter: "参数错误",
          "InvalidParameter.Param": "参数错误。",
          LimitExceeded: "超过配额限制",
          ResourceNotFound: "资源不存在"
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
    DataList() {
      let params = {
        Version: "2018-05-25"
      };
      if (
        (this.selectList == "" && this.searchInput == "") ||
        this.searchInput == "" ||
        this.selectList > 1
      ) {
        params["ClusterId"] = this.$route.query.clusterId;
        params["Filters.0.Name"] = "vpc-id";
        params["Filters.0.Values.0"] = this.VpcId;
      }

      if (this.selectList == 1 && this.searchInput != "") {
        params["InstanceIds.0"] = this.searchInput;
      }
      if (this.selectList == "" && this.searchInput != "") {
        params["InstanceIds.0"] = this.searchInput;
      }
      if (this.selectList == 2) {
        params["VagueInstanceName"] = this.searchInput;
      }
      if (this.selectList == 3) {
        params["VagueIpAddress"] = this.searchInput;
      }
      this.axios.post(TKE_EXIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.leftList = res.Response.ExistedInstanceSet;
          // console.log(res.Response.ExistedInstanceSet);
        } else {
          this.leftList = [];
          let ErrTips = {
            FailedOperation: "操作失败",
            InternalError: "内部错误",
            "InternalError.AccountUserNotAuthenticate": "账户未通过认证。",
            "InternalError.CreateMasterFailed": "创建集群失败。",
            "InternalError.CvmCommon": "cvm创建节点报错。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db错误。",
            "InternalError.DbAffectivedRows": "DB错误",
            "InternalError.DbRecordNotFound": "记录未找到。",
            "InternalError.ImageIdNotFound": "镜像未找到。",
            "InternalError.InitMasterFailed": "初始化master失败。",
            "InternalError.InvalidPrivateNetworkCidr": "无效CIDR。",
            "InternalError.OsNotSupport": "镜像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.UnexceptedInternal	": "内部错误",
            "InternalError.VpcCommon": "VPC报错。",
            "InternalError.VpcRecodrNotFound": "未发现vpc记录。",
            InvalidParameter: "参数错误",
            LimitExceeded: "超过配额限制",
            MissingParameter: "缺少参数错误",
            ResourceInUse: "资源被占用",
            ResourceNotFound: "资源不存在",
            ResourceUnavailable: "资源不可用",
            UnauthorizedOperation: "未授权操作",
            UnknownParameter: "未知参数错误",
            UnsupportedOperation: "操作不支持"
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
    ExistingNodes() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            if (this.projectId == 0) {
              this.projectName = "默认项目";
            } else {
              if (this.projectId === arr[i].projectId) {
                this.projectName = arr[i].projectName;
              }
            }
          }
          this.SecurityGroup();
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    // SSH密钥
    SSHKey() {
      let param = {
        Version: "2017-03-12"
      };
      this.axios.post(TKE_SSH, param).then(res => {
        if (res.Response.Error === undefined) {
          this.sshKey = res.Response.KeyPairSet;
          // console.log(res.Response.KeyPairSet);
          this.sshKeySel = this.sshKey[0].KeyName;
        } else {
          let ErrTips = {};
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
    // 安全组
    SecurityGroup() {
      let param = {
        Version: "2017-03-12"
      };
      param["Filters.0.Name"] = "project-id";
      param["Filters.0.Values.0"] = this.projectId;
      this.axios.post(TKE_MISG, param).then(res => {
        if (res.Response.Error === undefined) {
          var arr = res.Response.SecurityGroupSet;
          for (var i in arr) {
            this.securityGroupOpt.push({
              label: arr[i].SecurityGroupId + "|" + arr[i].SecurityGroupName,
              value: arr[i].SecurityGroupId
            });
          }
          this.securityGroupSel = this.securityGroupOpt[0].label;
        } else {
          let ErrTips = {};
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
    //
    addExceptPrice() {
      if (this.itemArr.length < 9) {
        this.itemArr.push({
          securityGroupSel: ""
        });
      }
    },
    //删除一项
    deleteExceptPrice(index) {
      this.itemArr.splice(index, 1);
    },
    // 复选框操作
    selectInit(row, index) {
      if (row.Usable === false) {
        return false; // 不可勾选
      } else {
        return true; // 可勾选
      }
    },
    // left 列表
    handleSelectionChange(val) {
      this.rightList = val;
      if (this.rightList.length != 0) {
        this.selNode = false;
      } else {
        this.selNode = true;
      }
    },
    // right 列表删除
    DeleteList(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.rightList) {
        if (row.InstanceId === this.rightList[i].InstanceId) {
          this.rightList.splice(this.rightList[i], 1);
        }
      }
    },
    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
    },
    // 第一步 下一步
    firstNext() {
      if (this.rightList.length != 0) {
        this.firstTab = false;
        this.secondTab = true;
        this.selNode = false;
        this.ExistingNodes();
      } else {
        this.selNode = true;
      }
    },
    // 第二歨 上一步
    secondPrev() {
      this.firstTab = true;
      this.secondTab = false;
      this.$nextTick(() => {
        this.rightList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      });
    },
    // 设置密码
    PasswordInput(val) {
      if (val == "") {
        this.colonyThird.passwordTips = "密码不能为空";
        this.colonyThird.passwordWran = true;
      } else if (val.length <= 8 || val.length > 16) {
        this.colonyThird.passwordTips = "密码必须为8到16位";
        this.colonyThird.passwordWran = true;
      } else if (
        !/^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![/`!#$%^&*()-+=|{\\[\\]':;,.?}\/]+$)[\da-zA-Z0-9`!#$%^&*()-+=|{[\]':;,.?/}].{8,16}$/.test(
          val
        )
      ) {
        // ()`~!@#$%^&}*-+=|{}[]:;',.?/
        this.colonyThird.passwordTips =
          "密码必须包含数字、字母、特殊字符中至少两项";
        this.colonyThird.passwordWran = true;
      } else {
        this.colonyThird.passwordWran = false;
      }
    },
    // 高级设置
    removeDomain2(index) {
      this.domainstion.splic(index, 1);
    },
    // 完成
    AddComplete() {
      if (this.colonyThird.passwordWran === true) {
        return false;
      } else {
        let param = {
          Version: "2018-05-25",
          ClusterId: this.$route.query.clusterId
        };
        for (var i in this.rightList) {
          param["InstanceIds." + i] = this.rightList[i].InstanceId;
        }

        // 安全组
        let _securityGroupSel = "";
        for (var i in this.securityGroupOpt) {
          if (this.securityGroupSel === this.securityGroupOpt[i].label) {
            _securityGroupSel = this.securityGroupOpt[i].value;
          }
        }
        param["SecurityGroupIds.0"] = _securityGroupSel;
        if (this.itemArr.lenght !== 0) {
          for (var i in this.itemArr) {
            var a = i - 0 + (1 - 0);
            param["SecurityGroupIds." + a] = this.itemArr[i].securityGroupSel;
          }
        }

        // InstanceAdvancedSettings
        if (this.openBlockadeCheck === true) {
          param["InstanceAdvancedSettings.Unschedulable"] = 1;
        } else {
          param["InstanceAdvancedSettings.Unschedulable"] = 0;
        }

        // 数据盘挂载
        if (this.dataMountCheck === true) {
          param["InstanceAdvancedSettings.MountTarget"] = this.dataDiskMount;
        }

        // 容器目录
        if (this.containerListCheck === true) {
          param[
            "InstanceAdvancedSettings.DockerGraphPath"
          ] = this.containerList;
        }

        for (var i in this.sshKey) {
          if (this.sshKeySel === this.sshKey[i].KeyName) {
            this.sshKeySelId = this.sshKey[i].KeyId;
          }
        }

        // SSH密钥
        if (this.loginType == 1) {
          param["LoginSettings.KeyIds.0"] = this.sshKeySelId;
        }
        if (this.loginType == 3) {
          param["LoginSettings.Password"] = this.passwordVal;
        }

        // 安全加固
        param["EnhancedService.SecurityService.Enabled"] = this.safetyCheck;

        // 云监控
        param[
          "EnhancedService.MonitorService.Enabled"
        ] = this.cloudMonitorCheck;

        // 高级设置
        if (this.domainstion.length !== 0) {
          for (var i in this.domainstion) {
            param[
              "InstanceAdvancedSettings.Labels." + i + ".Name"
            ] = this.domainstion[i].value;
            param[
              "InstanceAdvancedSettings.Labels." + i + ".Value"
            ] = this.domainstion[i].valueKey;
          }
        }

        this.axios.post(TKE_ADD_COMPLETE, param).then(res => {
          if (res.Response.Error === undefined) {
            this.$router.push({
              name: "colonyNodeManageNode",
              query: {
                clusterId: this.$route.query.clusterId
              }
            });
          } else {
            let ErrTips = {
              InternalError: "	内部错误",
              "InternalError.Db": "	db错误。",
              "InternalError.DbAffectivedRows": "	DB错误",
              "InternalError.Param": "	Param。",
              InvalidParameter: "参数错误",
              LimitExceeded: "	超过配额限制"
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
      }
    },
    addDomain2() {
      this.domainstion.push({
        value: "",
        valueKey: "",
        key: Date.now()
      });
    },
    // 选择登录方式
    changeType(val) {
      if (val === "1") {
        this.joinPassWord = true;
        this.autoPassWord = false;
        this.setPassWord = false;
      } else if (val === "2") {
        this.joinPassWord = false;
        this.autoPassWord = true;
        this.setPassWord = false;
      } else {
        this.joinPassWord = false;
        this.autoPassWord = false;
        this.setPassWord = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.password {
  ::v-deep .el-input {
    top: 0;
    width: 200px;
  }
  p {
    padding-bottom: 14px;
    margin-top: 4px;
    color: #888;
    font-size: 12px;
    line-height: 14px;
    vertical-align: middle;
  }
}
.el-icon-warning-outline {
  margin-left: 5px;
  color: #e1504a;
  font-size: 16px;
  font-weight: 600;
}
.cluster-wran {
  ::v-deep .el-input__inner {
    border: 1px solid #e1504a;
  }
}
.tke-tips {
  color: #e54545;
}

.tke-checkbox {
  height: 16px;
  width: 16px;
  background-color: #fff;
  vertical-align: middle;
  margin-right: 5px;
  border: 1px solid #bbb;
}

.flex {
  display: flex;
  .left-box {
    font-size: 12px;
    line-height: 30px;
    font-weight: 700;
    color: #000;
    .search {
      ::v-deep .el-input__inner {
        padding: 0px;
        height: 30px;
        line-height: 30px;
      }
      ::v-deep .el-select {
        width: 80px;
      }
    }
    ::v-deep .el-table {
      margin-top: 10px;
    }
  }
  .center-box {
    height: 290px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0 5px;
  }
  .right-box {
    font-size: 12px;
    line-height: 30px;
    font-weight: 700;
    color: #000;
  }
  ::v-deep .el-table {
    border: 1px solid rgb(221, 221, 221);
  }
}

.select-node {
  margin-top: 5px;
  color: #e1504a;
  font-size: 12px;
}

.el-icon-error {
  font-size: 16px;
  cursor: pointer;
}

.selected-node {
  display: flex;
  flex-wrap: wrap;
}

.item-box {
  ::v-deep .el-input__inner {
    border-radius: 0px;
    width: 200px;
    height: 30px;
  }
  .tke-tips-ash {
    color: #bbb;
    font-size: 12px;
  }
}

.tke-tips-orange {
  color: #ff9d00;
  font-size: 12px;
}
</style>
