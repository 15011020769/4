<template>
  <div class="Cvm">
    <div class="top">
      <span class="title-left">实例列表</span>
      <span class="title-right">
        <span>实例使用指南</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <div class="content">
      <div class="Cbs-City">
        <City :parm="parm" @changeCity="changeCity"></City>
      </div>
      <div class="operation">
        <div style="float: left;">
          <el-row>
            <el-button size="mini" @click="handleNewBuild">新建</el-button>
            <el-button
              size="mini"
              v-if="checked&&InstanceStatus=='stopped'&&cancelStatus"
              @click="handleStart"
            >开机</el-button>
            <el-button size="mini" v-else disabled>开机</el-button>
            <el-button
              size="mini"
              v-if="checked&&InstanceStatus=='running'&&cancelStatus"
              @click="handleStop"
            >关机</el-button>
            <el-button size="mini" v-else disabled>关机</el-button>
            <el-button
              size="mini"
              v-if="checked&&InstanceStatus=='running'&&cancelStatus"
              @click="handleReset"
            >重启</el-button>
            <el-button size="mini" v-else disabled>重启</el-button>
          </el-row>
        </div>
        <div style="float:left;margin-left: 10px;">
          <search class="searchBox" :options="searchOptions" v-on:search="handleSearch"></search>
        </div>
        <div style="float:right;margin-top:10px;">
          <i class="el-icon-download" @click="handleExport"></i>
        </div>
      </div>
      <div class="tableList">
        <el-table
          ref="instanceInfo"
          :data="instanceInfo"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{'font-size':'12px'}"
          :row-style="tableRowStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="date" label="ID/实例名" width="100">
            <template slot-scope="scope">
              <div class="detail-code">
                <span>{{scope.row.InstanceId}}</span>
              </div>
              <div class="detail-name">
                <span>{{scope.row.InstanceName}}</span>
                <i
                  class="el-icon-edit"
                  @click="handleInstanceSetup(scope.$index, scope.row, 'rename')"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="监控" width="50">
            <i class="el-icon-edit"></i>
          </el-table-column>
          <el-table-column label="状态" width="60">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.InstanceState|cvmState}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="可用区" width="80">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.Placement.Zone| Regionfilter()}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="InstanceType" label="主机类型" width="70">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.InstanceType.substring(0,scope.row.InstanceType.indexOf('.'))|insttypea}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="配置" width="140">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.CPU}}核&nbsp;{{scope.row.Memory}}GB&nbsp;{{scope.row.InternetAccessible.InternetMaxBandwidthOut}}Mbps</div>
                <div>系统盘:{{scope.row.SystemDisk.DiskType | Toconfigurefilter()}}</div>
                <div>
                  网络:
                  <a href class="network">{{scope.row.VirtualPrivateCloud.VpcId}}</a>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="主IP地址">
            <template slot-scope="scope">
              <div>
                <div>
                  <span v-if="scope.row.PublicIpAddresses">{{scope.row.PublicIpAddresses[0]}}</span>
                  <span v-else>-</span>
                </div>
                <div>
                  <span v-if="scope.row.PrivateIpAddresses">{{scope.row.PrivateIpAddresses[0]}}(内)</span>
                  <span v-else>-</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实例计费模式">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.InstanceChargeType">{{scope.row.InstanceChargeType|instancebill}}</div>
                <div
                  v-show="scope.row.InstanceChargeType === 'PREPAID'"
                >{{scope.row.ExpiredTime|renderTime}}到期</div>
                <div
                  v-show="scope.row.InstanceChargeType === 'POSTPAID_BY_HOUR'"
                >{{scope.row.CreatedTime|renderTime}}创建</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="网络计费模式">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.InternetAccessible.InternetChargeType|netbill}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属项目">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.Placement.ProjectId|Itemfilteri()}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button @click="handleLogin(scope.$index, scope.row)" type="text" size="small">登录</el-button>
              <el-button @click="handleRenew(scope.$index, scope.row)" type="text" size="small">续费</el-button>
              <el-dropdown :hide-on-click="false" size="mini" trigger="click">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        实例状态
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'restart')"
                          style="font-size: 12px;" v-if="scope.row.InstanceState=='RUNNING'"
                        >重启</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'restart')"
                          style="font-size: 12px;" v-else disabled
                        >重启</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'start')"
                          style="font-size: 12px;" v-if="scope.row.InstanceState=='STOPPED'"
                        >开机</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'start')"
                          style="font-size: 12px;" v-else disabled
                        >开机</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'stop')"
                          style="font-size: 12px;" v-if="scope.row.InstanceState=='RUNNING'"
                        >关机</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'stop')"
                          style="font-size: 12px;" v-else disabled
                        >关机</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'destroy')"
                          style="font-size: 12px;" v-if="scope.row.InstanceState=='SHUTDOWN'"
                        >销毁/退还</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceStatus(scope.$index, scope.row, 'destroy')"
                          style="font-size: 12px;" v-else disabled
                        >销毁/退还</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        实例设置
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item
                          @click.native="handleInstanceSetup(scope.$index, scope.row, 'rename')"
                        >改名</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceSetup(scope.$index, scope.row, 'export')"
                        >导出实例</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceSetup(scope.$index, scope.row, 'distribute')"
                        >分配至项目</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceSetup(scope.$index, scope.row, 'automatic')"
                        >设置自动续费</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceSetup(scope.$index, scope.row, 'change')"
                        >按量转包年包月</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handlereInstall(scope.$index, scope.row)">重装系统</el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        密码/密钥
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown" trigger="click">
                        <el-dropdown-item
                          @click.native="handleInstanceCode(scope.$index, scope.row, 'resetpassword')"
                        >重置密码</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleInstanceCode(scope.$index, scope.row, 'loadpassword')"
                        >加载密钥</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        资源调整
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="handleResourceChange(scope.$index, scope.row, 'configurate')"
                        >调整配置</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleResourceChange(scope.$index, scope.row, 'disk')"
                        >调整硬盘</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleResourceChange(scope.$index, scope.row, 'network')"
                        >调整网络</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleMirror(scope.$index, scope.row, 'mirror')"
                  >制作镜像</el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        IP/网卡
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'bindIP')"
                        >绑定弹性IP</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'unbindIP')"
                        >解绑弹性IP</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'returnIP')"
                        >退还公网IP</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'replaceIP')"
                        >更换公网IP</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'bindNetwork')"
                        >绑定弹性网卡</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleBindIP(scope.$index, scope.row, 'unbindNetwork')"
                        >解绑弹性网卡</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown :hide-on-click="false" size="mini">
                      <span class="el-dropdown-link" style="font-size: 12px;">
                        安全组
                        <i class="el-icon-arrow-right el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="handleSafeGroup(scope.$index, scope.row, 'safeGroup')"
                        >配置安全组</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="cvm-pag">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <login
        :loginStatus="loginStatus"
        v-if="loginStatus.loginDialog"
        v-on:close="dialogClose('login')"
      ></login>
      <stop :stopStatus="stopStatus" v-if="stopStatus.stopDialog" v-on:close="dialogClose('stop')"></stop>
      <renew
        :renewStatus="renewStatus"
        v-if="renewStatus.renewDialog"
        v-on:close="dialogClose('renew')"
      ></renew>
      <start
        :startStatus="startStatus"
        v-if="startStatus.startDialog"
        v-on:close="dialogClose('start')"
      ></start>
      <reset
        :resetStatus="resetStatus"
        v-if="resetStatus.resetDialog"
        v-on:close="dialogClose('reset')"
      ></reset>
      <edit :editStatus="editStatus" v-if="editStatus.editDialog" v-on:close="dialogClose('edit')"></edit>
      <distribute
        :distributeStatus="distributeStatus"
        v-if="distributeStatus.distributeDialog"
        v-on:close="dialogClose('distribute')"
      ></distribute>
      <destroy
        :destroyStatus="destroyStatus"
        v-if="destroyStatus.destroyDialog"
        v-on:close="dialogClose('destroy')"
      ></destroy>

      <automatic
        :automaticStatus="automaticStatus"
        v-if="automaticStatus.automaticDialog"
        v-on:close="dialogClose('automatic')"
      ></automatic>
      <reinstall
        :reinstallStatus="reinstallStatus"
        v-if="reinstallStatus.reinstallDialog"
        v-on:close="dialogClose('reinstall')"
      ></reinstall>
      <resetpassword
        :resetpasswordStatus="resetpasswordStatus"
        v-if="resetpasswordStatus.resetpasswordDialog"
        v-on:close="dialogClose('resetpassword')"
      ></resetpassword>
      <loadpassword
        :loadpasswordStatus="loadpasswordStatus"
        v-if="loadpasswordStatus.loadpasswordDialog"
        v-on:close="dialogClose('loadpassword')"
      ></loadpassword>
      <configurate
        :configurateStatus="configurateStatus"
        v-if="configurateStatus.configurateDialog"
        v-on:close="dialogClose('configurate')"
      ></configurate>
      <network
        :networkStatus="networkStatus"
        v-if="networkStatus.networkDialog"
        v-on:close="dialogClose('network')"
      ></network>
      <mirror
        :mirrorStatus="mirrorStatus"
        v-if="mirrorStatus.mirrorDialog"
        v-on:close="dialogClose('mirror')"
      ></mirror>
      <bindIP
        :bindIPStatus="bindIPStatus"
        v-if="bindIPStatus.bindIPDialog"
        v-on:close="dialogClose('bindIP')"
      ></bindIP>
      <returnIP
        :returnIPStatus="returnIPStatus"
        v-if="returnIPStatus.returnIPDialog"
        v-on:close="dialogClose('returnIP')"
      ></returnIP>
      <replaceIP
        :replaceIPStatus="replaceIPStatus"
        v-if="replaceIPStatus.replaceIPDialog"
        v-on:close="dialogClose('replaceIP')"
      ></replaceIP>
      <bindNetwork
        :bindNetworkStatus="bindNetworkStatus"
        v-if="bindNetworkStatus.bindNetworkDialog"
        v-on:close="dialogClose('bindNetwork')"
      ></bindNetwork>
      <unbindNetwork
        :unbindNetworkStatus="unbindNetworkStatus"
        v-if="unbindNetworkStatus.unbindNetworkDialog"
        v-on:close="dialogClose('unbindNetwork')"
      ></unbindNetwork>
      <safeGroup
        :safeGroupStatus="safeGroupStatus"
        v-if="safeGroupStatus.safeGroupDialog"
        v-on:close="dialogClose('safeGroup')"
      ></safeGroup>
    </div>
  </div>
</template>
<script>
import search from "@/components/Tools/search";
import City from "@/components/Tools/RegionBtn";
import login from "./modal/operate/login"; //登录
import renew from "./modal/operate/renew"; //续费
import start from "./modal/instanceStaus/start"; // 实例状态/开机
import stop from "./modal/instanceStaus/stop"; // 实例状态/关机
import reset from "./modal/instanceStaus/reset"; // 实例状态/重启
import destroy from "./modal/instanceStaus/destroy"; // 实例状态/销毁
import edit from "./modal/instanceset/edit"; // 实例设置/改名
import distribute from "./modal/instanceset/distribute"; // 实例设置/分配至项目
import automatic from "./modal/instanceset/automatic"; // 实例设置/设置自动续费
import reinstall from "./modal/reinstall/reinstall"; // 重装系统
import resetpassword from "./modal/password/resetpassword"; // 密码/重置密码
import loadpassword from "./modal/password/loadpassword"; // 密码/加载密钥
import configurate from "./modal/resource/configurate"; // 资源调整/调整配置
import network from "./modal/resource/network"; // 资源调整/网络配置
import mirror from "./modal/mirror/mirror"; // 资源调整/网络配置
import bindIP from "./modal/ipOperate/bindIP"; // IP/网卡/绑定IP
import returnIP from "./modal/ipOperate/returnIP"; // IP/网卡/退还IP
import replaceIP from "./modal/ipOperate/replaceIP"; // IP/网卡/退还IP
import bindNetwork from "./modal/ipOperate/bindNetwork"; // IP/网卡/绑定网卡
import unbindNetwork from "./modal/ipOperate/unbindNetwork"; // IP/网卡/绑定网卡
import safeGroup from "./modal/safeGroup/safeGroup"; // IP/网卡/绑定网卡

export default {
  data() {
    return {
      parm: "FWQ",
      loading: false,
      InstanceStatus: "", //按钮状态
      cancelStatus: false, //是否禁选
      multipleSelection: [], // 多选选中项
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      searchOptions: [
        {
          value: "instance-name",
          label: "实例名"
        },
        {
          value: "instance-id",
          label: "实例ID"
        },
        {
          value: "public-ip-address",
          label: "公网IP"
        },
        {
          value: "private-ip-address",
          label: "内网IP"
        },
        {
          value: "5",
          label: "可用区"
        },
        {
          value: "6",
          label: "实例类型"
        },
        {
          value: "7",
          label: "实例计费模式"
        },
        {
          value: "8",
          label: "标签"
        }
      ],
      instanceInfo: [], // 实例列表
      stopStatus: {
        stopDialog: false, // 关机
        InstanceItem: []
      },
      startStatus: {
        startDialog: false, // 开机
        InstanceItem: []
      },
      resetStatus: {
        resetDialog: false, // 重启
        InstanceItem: []
      },
      renewStatus: {
        renewDialog: false, // 续费
        InstanceItem: []
      },
      loginStatus: {
        loginDialog: false, // 登录
        InstanceItem: []
      },
      destroyStatus: {
        destroyDialog: false, // 销毁
        InstanceItem: []
      },
      editStatus: {
        editDialog: false, // 修改
        InstanceItem: []
      },
      distributeStatus: {
        //分配至项目
        distributeDialog: false,
        InstanceItem: []
      },
      automaticStatus: {
        automaticDialog: false,
        InstanceItem: []
      },
      reinstallStatus: {
        reinstallDialog: false,
        InstanceItem: []
      },
      resetpasswordStatus: {
        resetpasswordDialog: false,
        InstanceItem: []
      },
      loadpasswordStatus: {
        loadpasswordDialog: false,
        InstanceItem: []
      },
      configurateStatus: {
        configurateDialog: false,
        InstanceItem: []
      },
      networkStatus: {
        networkDialog: false,
        InstanceItem: []
      },
      mirrorStatus: {
        mirrorDialog: false,
        InstanceItem: []
      },
      bindIPStatus: {
        bindIPDialog: false,
        InstanceItem: []
      },
      returnIPStatus: {
        returnIPDialog: false,
        InstanceItem: []
      },
      replaceIPStatus: {
        replaceIPDialog: false,
        InstanceItem: []
      },
      bindNetworkStatus: {
        bindNetworkDialog: false,
        InstanceItem: []
      },
      unbindNetworkStatus: {
        unbindNetworkDialog: false,
        InstanceItem: []
      },      
      safeGroupStatus: {
        safeGroupDialog: false,
        InstanceItem: []
      },
    };
  },
  computed: {
    //选中状态
    checked() {
      return this.multipleSelection.length > 0;
    }
  },
  components: {
    search,
    City,
    login,
    stop,
    renew,
    start,
    reset,
    edit,
    destroy,
    distribute,
    automatic,
    resetpassword,
    loadpassword,
    reinstall,
    configurate,
    network,
    mirror,
    bindIP,
    returnIP,
    replaceIP,
    bindNetwork,
    unbindNetwork,
    safeGroup
  },
  mounted() {
    this.getListData();
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      var b = this.multipleSelection.map(function(v) {
        return v.InstanceState;
      });
      let runList = []; //运行中的实例
      let stopList = []; //关闭的实例
      if (b.length) {
        for (var i = 0; i < b.length; i++) {
          if (b[i] == "RUNNING") {
            runList.push(this.multipleSelection[i]);
          }
          if (b[i] == "STOPPED") {
            stopList.push(this.multipleSelection[i]);
          }
        }
        //全是运行中状态
        if (runList.length == b.length) {
          this.InstanceStatus = "running";
          this.cancelStatus = true;
        }
        //全是关闭的状态
        if (stopList.length == b.length) {
          this.InstanceStatus = "stopped";
          this.cancelStatus = true;
        }
        if (runList.length < b.length && stopList.length < b.length) {
          this.cancelStatus = false;
        }
      }
    },
    // 获取表格列表数据
    getListData(name, code) {
      this.loading = true;
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      };
      if (name && code) {
        params["Filters.0.Name"] = code;
        params["Filters.0.Values.0"] = name;
      }
      this.axios.post("cvm2/DescribeInstances", params).then(data => {
        this.instanceInfo = data.Response.InstanceSet;
        this.totalPage = data.Response.TotalCount;
        this.loading = false;
      });
    },
    // 搜索
    handleSearch(searchInput, searchSelect) {
      this.getListData(searchInput, searchSelect);
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getListData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getListData();
    },
    // 城市切换
    changeCity(city) {
      this.getListData();
    },
    // 新建按钮
    handleNewBuild() {
      this.$router.push({
        path: "/CvmNew"
      });
    },
    // 开机按钮
    handleStart() {
      this.startStatus.startDialog = true;
      this.startStatus.InstanceItem = this.multipleSelection;
    },
    // 关机按钮
    handleStop() {
      this.stopStatus.stopDialog = true;
      this.stopStatus.InstanceItem = this.multipleSelection;
    },
    // 重启按钮
    handleReset() {
      this.resetStatus.resetDialog = true;
      this.resetStatus.InstanceItem = this.multipleSelection;
    },
    // 登录
    handleLogin(index, row) {
      this.loginStatus.loginDialog = true;
      var arr = [];
      arr.push(row);
      this.loginStatus.InstanceItem = arr;
    },
    // 续费
    handleRenew(index, row) {
      this.renewStatus.renewDialog = true;
      var arr = [];
      arr.push(row);
      this.renewStatus.InstanceItem = arr;
    },
    // 实例状态具体操作
    handleInstanceStatus(index, row, name) {
      // 重启
      if (name == "restart") {
        this.resetStatus.resetDialog = true;
        var arr = [];
        arr.push(row);
        this.resetStatus.InstanceItem = arr;
      }
      // 开机
      if (name == "start") {
        this.startStatus.startDialog = true;
        var arr = [];
        arr.push(row);
        this.startStatus.InstanceItem = arr;
      }
      // 关机
      if (name == "stop") {
        this.stopStatus.stopDialog = true;
        var arr = [];
        arr.push(row);
        this.stopStatus.InstanceItem = arr;
      }
      // 销毁
      if (name == "destroy") {
        this.destroyStatus.destroyDialog = true;
        var arr = [];
        arr.push(row);
        this.destroyStatus.InstanceItem = arr;
      }
    },
    // 实例设置具体操作
    handleInstanceSetup(index, row, name) {
      //改名
      if (name == "rename") {
        this.editStatus.editDialog = true;
        this.editStatus.InstanceItem = row;
      }
      //分配至项目
      if (name == "distribute") {
        this.distributeStatus.distributeDialog = true;
        var arr = [];
        arr.push(row);
        this.distributeStatus.InstanceItem = arr;
      }
      //设置自动续费
      if (name == "automatic") {
        this.automaticStatus.automaticDialog = true;
        var arr = [];
        arr.push(row);
        this.automaticStatus.InstanceItem = arr;
      }
      //按量转包年包月
      if (name == "change") {
      }
      // 导出单个实例
      if (name == "export") {
      }
    },
    //重装系统操作
    handlereInstall(index, row) {
      this.reinstallStatus.reinstallDialog = true;
      var arr = [];
      arr.push(row);
      this.reinstallStatus.InstanceItem = arr;
    },
    // 密码、密钥具体操作
    handleInstanceCode(index, row, name) {
      if (name == "resetpassword") {
        this.resetpasswordStatus.resetpasswordDialog = true;
        var arr = [];
        arr.push(row);
        this.resetpasswordStatus.InstanceItem = arr;
      }
      if (name == "loadpassword") {
        this.loadpasswordStatus.loadpasswordDialog = true;
        var arr = [];
        arr.push(row);
        this.loadpasswordStatus.InstanceItem = arr;
      }
    },
    //资源调整
    handleResourceChange(index, row, name) {
      //调整配置
      if (name == "configurate") {
        this.configurateStatus.configurateDialog = true;
        var arr = [];
        arr.push(row);
        this.configurateStatus.InstanceItem = arr;
      }
      //调整网络
      if (name == "network") {
        this.networkStatus.networkDialog = true;
        var arr = [];
        arr.push(row);
        this.networkStatus.InstanceItem = arr;
      }
    },
    //制作镜像
    handleMirror(index, row, name) {
      if (name == "mirror") {
        this.mirrorStatus.mirrorDialog = true;
        var arr = [];
        arr.push(row);
        this.mirrorStatus.InstanceItem = arr;
      }
    },
    //IP/网卡
    handleBindIP(index, row, name) {
      if (name == "bindIP") {
        this.bindIPStatus.bindIPDialog = true;
        var arr = [];
        arr.push(row);
        this.bindIPStatus.InstanceItem = arr;
      }
      if (name == "unbindIP") {
        this.unbindIPStatus.unbindIPDialog = true;
        var arr = [];
        arr.push(row);
        this.unbindIPStatus.InstanceItem = arr;
      }
      if (name == "returnIP") {
        this.returnIPStatus.returnIPDialog = true;
        var arr = [];
        arr.push(row);
        this.returnIPStatus.InstanceItem = arr;
      }
      if (name == "replaceIP") {
        this.replaceIPStatus.replaceIPDialog = true;
        var arr = [];
        arr.push(row);
        this.replaceIPStatus.InstanceItem = arr;
      }
      if (name == "bindNetwork") {
        this.bindNetworkStatus.bindNetworkDialog = true;
        var arr = [];
        arr.push(row);
        this.bindNetworkStatus.InstanceItem = arr;
      }
      if (name == "unbindNetwork") {
        this.unbindNetworkStatus.unbindNetworkDialog = true;
        var arr = [];
        arr.push(row);
        this.unbindNetworkStatus.InstanceItem = arr;
      }
    },
    //安全组
    handleSafeGroup(index, row, name) {
      if(name=='safeGroup') {
        this.safeGroupStatus.safeGroupDialog = true;
        var arr = [];
        arr.push(row);
        this.safeGroupStatus.InstanceItem = arr;
      }
    },  
    // 弹框关闭
    dialogClose(name) {
      // 登录
      if (name == "login") {
        this.loginStatus.loginDialog = false;
      }
      // 关机
      if (name == "stop") {
        this.stopStatus.stopDialog = false;
      }
      // 续费
      if (name == "renew") {
        this.renewStatus.renewDialog = false;
      }
      // 开机
      if (name == "start") {
        this.startStatus.startDialog = false;
      }
      // 重启
      if (name == "reset") {
        this.resetStatus.resetDialog = false;
      }
      // 改名
      if (name == "edit") {
        this.editStatus.editDialog = false;
      }
      if (name == "distribute") {
        this.distributeStatus.distributeDialog = false;
      }
      if (name == "automatic") {
        this.automaticStatus.automaticDialog = false;
      }
      if (name == "reinstall") {
        this.reinstallStatus.reinstallDialog = false;
      }
      if (name == "resetpassword") {
        this.resetpasswordStatus.resetpasswordDialog = false;
      }
      if (name == "loadpassword") {
        this.loadpasswordStatus.loadpasswordDialog = false;
      }
      if (name == "configurate") {
        this.configurateStatus.configurateDialog = false;
      }
      if (name == "network") {
        this.networkStatus.networkDialog = false;
      }
      if (name == "mirror") {
        this.mirrorStatus.mirrorDialog = false;
      }
      if (name == "bindIP") {
        this.bindIPStatus.bindIPDialog = false;
      }
      if (name == "returnIP") {
        this.returnIPStatus.returnIPDialog = false;
      }
      if (name == "replaceIP") {
        this.replaceIPStatus.replaceIPDialog = false;
      }
      if(name=="bindNetwork") {
        this.bindNetworkStatus.bindNetworkDialog = false;
      }
      if(name=="unbindNetwork") {
        this.unbindNetworkStatus.unbindNetworkDialog = false;
      }
      if(name=="safeGroup") {
        this.safeGroupStatus.safeGroupDialog = false;
      }
    },
    // 导出所有实例
    handleExport() {}
  }
};
</script>
<style lang="scss" scoped>
.Cvm {
  .top {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .content {
    padding: 20px;
    .operation {
      margin-bottom: 10px;
    }
    .search {
      overflow: hidden;
      padding: 10px 0;
      .search-left {
        float: left;
        .searchBox {
          display: inline-block;
        }
      }
      .search-right {
        float: right;
        margin-top: 10px;
        :hover {
          cursor: pointer;
        }
        i {
          padding: 0 3px;
        }
      }
    }
    .tableList {
      margin-top: 40px;
      background: #fff;
      .detail-code {
        color: #006eff;
        :hover {
          cursor: pointer;
        }
      }
      .detail-name {
        .el-icon-edit {
          margin-left: 10px;
        }
      }
      .cloudHostrenewa {
        color: #888888;
        cursor: default;
      }

      .cloudHostrenewa:hover {
        color: #888888;
        cursor: default;
      }
      .el-dropdown-link {
        margin-left: 5px;
        font-size: 12px !important;
        color: #006eff;
      }
      .el-dropdown-list {
        font-size: 12px;
        color: #006eff;
      }
    }
    .cvm-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
