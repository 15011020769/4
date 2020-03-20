<template>
  <div class="security-rules">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <div>
            <el-row>
              <el-button type="primary" @click="AddBtn">新增</el-button>
              <el-button disabled v-if="multipleSelection1.length === 0"
                >移出</el-button
              >
              <el-button
                v-if="multipleSelection1.length !== 0"
                @click="allDelete = true"
                >移出</el-button
              >
            </el-row>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="enterList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading="loadShow"
            height="500px"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="ID/主机名" v-if="viewName === 'cvm_device'">
              <template slot-scope="scope">
                <a href="javascript:;">{{ scope.row.InstanceId }}</a>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'cvm_device'">
              <template slot-scope="scope">
                <span>{{ InstanceState(scope.row.InstanceState) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="网络类型" v-if="viewName === 'cvm_device'">
              VPC 网络
            </el-table-column>
            <el-table-column label="IP地址" v-if="viewName === 'cvm_device'">
              <template slot-scope="scope">
                <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
                <p>{{ scope.row.PublicIpAddresses[0] }}(外网)</p>
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'cvm_device'">
              台湾台北
            </el-table-column>
            <!-- VPN_GW -->
            <el-table-column label="ID/名称" v-if="viewName === 'VPN_GW'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <p>{{ scope.row.VpnGatewayName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'VPN_GW'">
              <template slot-scope="scope">
                <span>{{ VPN_GW_State(scope.row.State) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属网络" v-if="viewName === 'VPN_GW'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'VPN_GW'">
              台湾台北
            </el-table-column>
            <!-- vpn_tunnel -->
            <el-table-column label="ID/名称" v-if="viewName === 'vpn_tunnel'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <p>{{ scope.row.VpnConnectionName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'vpn_tunnel'">
              <template slot-scope="scope">
                <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属网络" v-if="viewName === 'vpn_tunnel'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="VPN网关" v-if="viewName === 'vpn_tunnel'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="对端网关" v-if="viewName === 'vpn_tunnel'">
              <template slot-scope="scope">
                <p>{{ scope.row.CustomerGatewayId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'vpn_tunnel'">
              台湾台北
            </el-table-column>
            <!-- nat_tc_stat -->
            <el-table-column label="ID/名称" v-if="viewName === 'nat_tc_stat'">
              <template slot-scope="scope">
                <p>{{ scope.row.NatGatewayId }}</p>
                <p>{{ scope.row.NatGatewayName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'nat_tc_stat'">
              <template slot-scope="scope">
                <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="私有网络" v-if="viewName === 'nat_tc_stat'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="类型" v-if="viewName === 'nat_tc_stat'">
              <template slot-scope="scope">
                <p>小型</p>
                <p>最大并发连接数{{ scope.row.maxConcurrent / 100 }}万</p>
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'nat_tc_stat'">
              台湾台北
            </el-table-column>
            <!-- DC_GW -->
            <el-table-column label="ID/名称" v-if="viewName === 'DC_GW'">
              <template slot-scope="scope">
                <p>{{ scope.row.DirectConnectGatewayId }}</p>
                <p>{{ scope.row.DirectConnectGatewayName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="NAT配置状态" v-if="viewName === 'DC_GW'">
              <template slot-scope="scope">
                <span>{{ NAT_Status(scope.row.GatewayType) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属网络" v-if="viewName === 'DC_GW'">
              <template slot-scope="scope">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.}}</p> -->
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'DC_GW'">
              台湾台北
            </el-table-column>
            <!-- EIP -->
            <el-table-column label="ID/名称" v-if="viewName === 'EIP'">
              <template slot-scope="scope">
                <p>{{ scope.row.AddressId }}</p>
              </template>
            </el-table-column>
            <el-table-column label="弹性IP地址" v-if="viewName === 'EIP'">
              <template slot-scope="scope">
                <span>{{ scope.row.AddressIp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'EIP'">
              台湾台北
            </el-table-column>
            <!-- cdb_detail -->
            <el-table-column label="ID/名称" v-if="viewName === 'cdb_detail'">
              <template slot-scope="scope">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'cdb_detail'">
              <template slot-scope="scope">
                <p>{{ CDB_Status(scope.row.Status) }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="内网IP/端口"
              v-if="viewName === 'cdb_detail'"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.Vip }}</span>
                <p>{{ scope.row.Vport }}</p>
              </template>
            </el-table-column>
            <el-table-column label="网络类型" v-if="viewName === 'cdb_detail'">
              <template slot-scope="scope">
                VPC
              </template>
            </el-table-column>
            <el-table-column label="类型" v-if="viewName === 'cdb_detail'">
              <template slot-scope="scope">
                {{ CDB_InstanceType(scope.row.InstanceType) }}
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'cdb_detail'">
              台湾台北
            </el-table-column>
            <!-- REDIS-CLUSTER -->
            <el-table-column
              label="ID/名称"
              v-if="viewName === 'REDIS-CLUSTER'"
            >
              <template slot-scope="scope">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'REDIS-CLUSTER'">
              <template slot-scope="scope">
                <p>{{ REDIS_Status(scope.row.Status) }}</p>
              </template>
            </el-table-column>
            <el-table-column label="规格" v-if="viewName === 'REDIS-CLUSTER'">
              <template slot-scope="scope">
                master-slave
              </template>
            </el-table-column>
            <el-table-column
              label="内网地址"
              v-if="viewName === 'REDIS-CLUSTER'"
            >
              <template slot-scope="scope">
                {{ scope.row.WanIp }}
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'REDIS-CLUSTER'">
              台湾台北
            </el-table-column>
            <!-- dcchannel -->
            <el-table-column label="ID/名称" v-if="viewName === 'dcchannel'">
              <template slot-scope="scope">
                <p>{{ scope.row.DirectConnectTunnelId }}</p>
                <p>{{ scope.row.DirectConnectTunnelName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态" v-if="viewName === 'dcchannel'">
              <template slot-scope="scope">
                <p>{{ dcchannel_Status(scope.row.State) }}</p>
              </template>
            </el-table-column>
            <el-table-column label="规格" v-if="viewName === 'dcchannel'">
              <template slot-scope="scope">
                master-slave
              </template>
            </el-table-column>
            <el-table-column label="内网地址" v-if="viewName === 'dcchannel'">
              <template slot-scope="scope">
                {{ scope.row.WanIp }}
              </template>
            </el-table-column>
            <!-- dcline -->
            <el-table-column label="名称/ID" v-if="viewName === 'dcline'">
              <template slot-scope="scope">
                <p>{{ scope.row.DirectConnectName }}</p>
                <p>{{ scope.row.DirectConnectId }}</p>
              </template>
            </el-table-column>
            <el-table-column label="所在地" v-if="viewName === 'dcline'">
              <template slot-scope="scope">
                <p>{{ scope.row.Location }}</p>
              </template>
            </el-table-column>
            <el-table-column label="带宽" v-if="viewName === 'dcline'">
              <template slot-scope="scope">
                <p>{{ scope.row.Bandwidth }}Mbps</p>
              </template>
            </el-table-column>
            <!-- COS -->
            <el-table-column label="Bucket名称" v-if="viewName === 'COS'">
              <template slot-scope="scope">
                <p>{{ scope.row.Name }}</p>
              </template>
            </el-table-column>
            <el-table-column label="地域" v-if="viewName === 'COS'">
              <template slot-scope="scope">
                <p>{{ scope.row.zone.zone }}</p>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" v-if="viewName === 'COS'">
              <template slot-scope="scope">
                {{ CreationDate(scope.row.CreationDate) }}
              </template>
            </el-table-column>

            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" @click="MoveOut(scope.row)">移出</a>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tke-page">
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <div class="wraps">
      <el-dialog
        :visible.sync="newBuildByVal.newBuildState"
        width="1024px"
        :show-close="false"
        class="dialog-box"
        v-loading="loadShowAdd"
      >
        <div class="title">
          <h3>新建</h3>
          <a href="javascript:;" @click="newBuildByVal.newBuildState = false">
            <i class="el-icon-close"></i>
          </a>
        </div>
        <div class="dialog">
          <div>
            <product-type-cpt
              v-on:PassData="passData"
              :searchParam="searchParam"
              :projectId="projectId"
              :productValue="viewName"
              style="display:none;"
            />
            <CamTransferCpt
              :productData="productListData"
              v-on:projectId="projectIds"
              v-on:searchParam="searchParams"
              v-on:multipleSelection="selectDatas"
              :isShowRight="isShowRight"
            ></CamTransferCpt>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="newBuildByVal.newBuildState = false"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <!-- 移出 -->
      <el-dialog
        title="确定移出所选实例？"
        :visible.sync="rulesEditorByVal.rulesEditorState"
        width="500px"
        custom-class="tke-dialog"
      >
        <div>
          移出后，该组之前绑定的告警策略将与该实例解绑，该组后续所涉及的操作将不会对该实例生效。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DeleteList()">确定移出</el-button>
          <el-button @click="rulesEditorByVal.rulesEditorState = false"
            >取消</el-button
          >
        </div>
      </el-dialog>
      <!-- 批量移出 -->
      <el-dialog
        :title="
          '已选择' + multipleSelection1.length + '个实例，确定要解除关联？'
        "
        :visible.sync="allDelete"
        width="500px"
        custom-class="tke-dialog"
      >
        <div>
          移出后，该组之前绑定的告警策略将与该实例解绑，该组后续所涉及的操作将不会对该实例生效。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DeleteList()"
            >确定移出所选实例</el-button
          >
          <el-button @click="allDelete = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type";
import CamTransferCpt from "@/views/CM/CM_assembly/CamTransferCpt";
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_GROUPING_MANAGE,
  CM_GROUPING_MANAGELIST,
  CM_GROUPING_MOVE,
  CM_GROUPING_MANAGELIST_ADD,
  ALL_PROJECT,
  TKE_EXIST_NODES,
  CM_GROUPING_NEWLY_BUILD,
  VPN_LIST,
  VPNTD_LIST,
  NAT_LIST,
  DCG_LIST,
  NETIP_LIST,
  MYSQL_LIST,
  REDIS_LIST,
  Private_LIST,
  Physics_LIST,
  OBJ_LIST
} from "@/constants";
export default {
  data() {
    return {
      activeName: "first",
      enterList: [],
      loadShow: true,
      loadShowAdd: true,
      multipleSelection: [],
      multipleSelection1: [],
      newBuildByVal: {
        // 新建
        newBuildState: false
      },
      rulesEditorByVal: {
        rulesEditorState: false
      },
      allDelete: false,
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      tableData: [],
      input: "",
      delete: "",
      searchInput: "",
      searchSelectProject: 0,
      projectOptions: [
        {
          projectId: 0,
          projectName: "默认项目"
        }
      ],
      searchSelect: "",
      selectOptions: [
        {
          value: "1",
          label: "主机ID"
        },
        {
          value: "2",
          label: "IP"
        },
        {
          value: "3",
          label: "主机名"
        }
      ],
      viewName: this.Rules.viewName,
      productListData: {},
      projectId: 0,
      searchParam: {},
      productData: {},
      isShow: false,
      loadShow: true,
      isShowRight: true
    };
  },
  components: {
    CamTransferCpt,
    ProductTypeCpt
  },
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.NewProject();
    this.ListInit();
  },
  methods: {
    passData(data) {
      this.isShow = false;
      this.productListData = data;
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
    },
    projectIds(data) {
      this.projectId = data;
    },
    searchParams(data) {
      this.searchParam = data;
    },
    //选择右侧表格数据
    selectDatas(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    // 项目
    NewProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            this.projectOptions.push(arr[i]);
          }
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
    async ListInit() {
      this.loadShow = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.Rules.instanceGroupId,
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      await this.axios.post(CM_GROUPING_MANAGE, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
          var _enterList = res.Response.InstanceList;
          this.total = res.Response.Total;
          if (_enterList.length > 0) {
            if (this.viewName === "cvm_device") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["InstanceIds." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).unInstanceId;
              }
              this.axios.post(CM_GROUPING_MANAGELIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.InstanceSet;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).unInstanceId ===
                        this.enterList[j].InstanceId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  console.log(this.enterList);
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    FailedOperation: "操作失败",
                    InternalError: "内部错误",
                    "InternalError.Param": "Param。",
                    "InternalError.PublicClusterOpNotSupport":
                      "集群不支持当前操作。",
                    InvalidParameter: "参数错误",
                    ResourceNotFound: "资源不存在",
                    ResourceUnavailable: "资源不可用"
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
            } else if (this.viewName === "VPN_GW") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              console.log(_enterList);
              params["Filters.0.Name"] = "public-ip-address";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).vip;
              }
              this.axios.post(VPN_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.VpnGatewaySet;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).vip ===
                        this.enterList[j].PublicIpAddress
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  console.log(this.enterList);
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    "InvalidVpnGatewayId.Malformed":
                      "无效的VPN网关,VPN实例ID不合法。",
                    "InvalidVpnGatewayId.NotFound":
                      "无效的VPN网关,VPN实例不存在，请再次核实您输入的资源信息是否正确。"
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
            } else if (this.viewName === "vpn_tunnel") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "vpn-connection-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uniqVpnconnId;
              }
              this.axios.post(VPNTD_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.VpnConnectionSet;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uniqVpnconnId ===
                        this.enterList[j].VpnConnectionId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    "InvalidParameter.Coexist": "参数不支持同时指定。",
                    "InvalidParameterValue.Malformed": "入参格式不合法。",
                    ResourceNotFound: "	资源不存在。"
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
            } else if (this.viewName === "nat_tc_stat") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "nat-gateway-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uniq_nat_id;
              }
              this.axios.post(NAT_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.NatGatewaySet;

                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uniq_nat_id ===
                        this.enterList[j].VpnConnectionId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
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
            } else if (this.viewName === "DC_GW") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "direct-connect-gateway-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnectgatewayid;
              }
              this.axios.post(DCG_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.DirectConnectGatewaySet;

                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions)
                          .directconnectgatewayid ===
                        this.enterList[j].DirectConnectGatewayId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    "InvalidParameter.Coexist": "参数不支持同时指定。",
                    InvalidParameterValue: "参数值不合法。",
                    "InvalidParameterValue.Malformed": "入参格式不合法。",
                    "InvalidParameterValue.TooLong": "无效参数值。参数值太长。"
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
            } else if (this.viewName === "EIP") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "address-ip";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).vip;
              }
              this.axios.post(NETIP_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.AddressSet;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).vip ===
                        this.enterList[j].AddressIp
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    InvalidParameter: "入参不合法。"
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
            } else if (this.viewName === "cdb_detail") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["InstanceIds." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uInstanceId;
              }
              this.axios.post(MYSQL_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.Items;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uInstanceId ===
                        this.enterList[j].InstanceId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    CdbError: "后端错误或者流程错误。",
                    "InternalError.DatabaseAccessError": "数据库内部错误。",
                    "InternalError.DesError": "系统内部错误。",
                    InvalidParameter: "参数错误。",
                    "InvalidParameter.InstanceNotFound": "实例不存在。",
                    "OperationDenied.WrongStatus": "后端任务状态非法。"
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
            } else if (this.viewName === "REDIS-CLUSTER") {
              let params = {
                Version: "2018-04-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["SearchKeys." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).instanceid;
              }
              this.axios.post(REDIS_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.InstanceSet;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).instanceid ===
                        this.enterList[j].InstanceId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    "InternalError.DbOperationFailed":
                      "统一的 DB 操作错误，可以是 update insert select..。",
                    InvalidParameter: "参数错误",
                    "InvalidParameter.EmptyParam": "参数为空。",
                    "InvalidParameter.InvalidParameter": "业务参数错误。",
                    "InvalidParameter.PermissionDenied": "接口没有cam权限。",
                    "UnauthorizedOperation.NoCAMAuthed": "无cam 权限。"
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
            } else if (this.viewName === "dcchannel") {
              let params = {
                Version: "2018-04-10",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              console.log(_enterList);
              params["Filters.0.Name"] = "direct-connect-tunnel-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnecttunnelid;
              }
              this.axios.post(Private_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.DirectConnectTunnelSet;
                  this.total = res.Response.TotalCount;
                  console.log(this.enterList);
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions)
                          .directconnecttunnelid ===
                        this.enterList[j].DirectConnectTunnelId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  console.log(this.enterList);
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    InternalError: "内部错误",
                    ResourceNotFound: "资源不存在",
                    "ResourceNotFound.DirectConnectTunnelIdIsNotExist":
                      "专用通道不存在。"
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
            } else if (this.viewName === "dcline") {
              let params = {
                Version: "2018-04-10",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              console.log(_enterList);

              for (let i in _enterList) {
                params["DirectConnectIds." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnectid;
              }
              this.axios.post(Physics_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.enterList = res.Response.DirectConnectSet;
                  this.total = res.Response.TotalCount;
                  console.log(this.enterList);
                  for (let i in _enterList) {
                    for (let j in this.enterList) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).directconnectid ===
                        this.enterList[j].DirectConnectId
                      ) {
                        this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                      }
                    }
                  }
                  console.log(this.enterList);
                  this.loadShow = false;
                } else {
                  let ErrTips = {
                    FailedOperation: "操作失败。",
                    InternalError: "内部错误。",
                    "InternalError.ExeTimeout": "执行超时。",
                    InvalidParameter: "参数错误。",
                    "InvalidParameter.InvalidParameter": "参数错误。",
                    "InvalidParameter.InvalidParameterParam": "参数错误。",
                    InvalidParameterValue: "无效的参数值。",
                    LimitExceeded: "超过配额限制。",
                    MissingParameter: "缺少参数错误。",
                    UnknownParameter: "未知参数错误。",
                    UnsupportedOperation: "操作不支持。"
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
            } else if (this.viewName === "COS") {
              this.axios.get(OBJ_LIST).then(res => {
                var _arr = res.Buckets.Bucket;
                console.log(_arr);
                for (let i in _enterList) {
                  for (let j in _arr) {
                    if (
                      JSON.parse(_enterList[i].Dimensions).bucket ===
                      _arr[j].Name
                    ) {
                      this.enterList.push(_arr[j]);
                      this.enterList[i]["UniqueId"] = _enterList[i].UniqueId;
                    }
                  }
                }
                console.log(this.enterList);
                this.loadShow = false;
              });
            }
          } else {
            this.enterList = [];
            this.loadShow = false;
          }
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
    // 状态
    InstanceState(val) {
      if (val === "PENDING") {
        return "创建中";
      } else if (val === "LAUNCH_FAILED") {
        return "创建失败";
      } else if (val === "RUNNING") {
        return "运行中";
      } else if (val === "STOPPED") {
        return "关机";
      } else if (val === "STARTING") {
        return "关机中";
      } else if (val === "REBOOTING") {
        return "重启中";
      } else if (val === "SHUTDOWN") {
        return "停止待销毁";
      } else if (val === "TERMINATING") {
        return "销毁中";
      }
    },
    VPN_GW_State(val) {
      if (val === "PENDING") {
        return "生产中";
      } else if (val === "DELETING") {
        return "删除中";
      } else if (val === "AVAILABLE") {
        return "运行中";
      }
    },
    VPN_Tunnel_State(val) {
      if (val === "PENDING") {
        return "生产中";
      } else if (val === "DELETING") {
        return "删除中";
      } else if (val === "AVAILABLE") {
        return "运行中";
      } else if (val === "UPDATING") {
        return "升级中";
      } else if (val === "FAILE") {
        return "失败";
      }
    },
    NAT_Status(val) {
      if (val === "NAT") {
        return "支持";
      } else {
        return "不支持";
      }
    },
    CDB_Status(val) {
      if (val == 0) {
        return "创建中";
      } else if (val == 1) {
        return "运行中";
      } else if (val == 4) {
        return "隔离中";
      } else if (val == 5) {
        return "已隔离";
      }
    },
    REDIS_Status(val) {
      if (val == 0) {
        return "待初始化";
      } else if (val == 1) {
        return "流程中";
      } else if (val == 2) {
        return "运行中";
      } else if (val == -2) {
        return "已隔离";
      } else if (val == -3) {
        return "待删除";
      }
    },
    CDB_InstanceType(val) {
      if (val == 1) {
        return "主实例";
      } else if (val == 2) {
        return "灾备实例";
      } else if (val == 3) {
        return "只读实例";
      }
    },
    dcchannel_Status(val) {
      if (val == "AVAILABLE") {
        return "就绪或者已连接";
      } else if (val == "PENDING") {
        return "申请中";
      } else if (val == "ALLOCATING") {
        return "配置中";
      } else if (val == "ALLOCATED") {
        return "配置完成";
      } else if (val == "ALTERING") {
        return "修改中";
      } else if (val == "DELETING") {
        return "删除中";
      } else if (val == "DELETED") {
        return "删除完成";
      } else if (val == "COMFIRMING") {
        return "待接受";
      } else if (val == "REJECTED") {
        return "拒绝";
      }
    },
    dcline_Status(val) {
      if (val == "PENDING") {
        return "申请中";
      } else if (val == "REJECTED") {
        return "申请驳回";
      } else if (val == "TOPAY") {
        return "待付款";
      } else if (val == "PAID") {
        return "已付款";
      } else if (val == "ALLOCATED") {
        return "建设中";
      } else if (val == "AVAILABLE") {
        return "已开通";
      } else if (val == "DELETING") {
        return "删除中";
      } else if (val == "DELETED") {
        return "已删除";
      }
    },
    CreationDate(val) {
      return val.replace("T", " ").substring(0, val.length - 1);
    },
    // 新增
    AddBtn() {
      this.newBuildByVal.newBuildState = true;
      this.loadShowAdd = true;
      this.AddDataList();
    },
    DeleteListAdd(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.multipleSelection) {
        if (row.InstanceId === this.multipleSelection[i].InstanceId) {
          this.multipleSelection.splice(this.multipleSelection[i], 1);
        }
      }
    },
    save() {
      let param = {
        GroupName: this.Rules.groupName,
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: this.Rules.viewName,
        InstanceGroupId: this.Rules.instanceGroupId
      };
      console.log(this.multipleSelection);
      for (let i in this.multipleSelection) {
        if (this.viewName === "cvm_device") {
          param["InstanceList." + i + ".Dimensions"] = {
            unInstanceId: this.multipleSelection[i].InstanceId
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            uuid: this.multipleSelection[i].Uuid
          };
        } else if (this.viewName === "VPN_GW") {
          param["InstanceList." + i + ".Dimensions"] = {
            vip: this.multipleSelection[i].PublicIpAddress
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            VpnGatewayId: this.multipleSelection[i].VpnGatewayId
          };
        } else if (this.viewName === "vpn_tunnel") {
          param["InstanceList." + i + ".Dimensions"] = {
            uniqVpnconnId: this.multipleSelection[i].VpnConnectionId
          };
        } else if (this.viewName === "nat_tc_stat") {
          param["InstanceList." + i + ".Dimensions"] = {
            uniq_nat_id: this.multipleSelection[i].NatGatewayId
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            instanceId: this.multipleSelection[i].NatGatewayId
          };
        } else if (this.viewName === "DC_GW") {
          param["InstanceList." + i + ".Dimensions"] = {
            directconnectgatewayid: this.multipleSelection[i]
              .DirectConnectGatewayId
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            instanceId: this.multipleSelection[i].DirectConnectGatewayId
          };
        } else if (this.viewName === "EIP") {
          param["InstanceList." + i + ".Dimensions"] = {
            vip: this.multipleSelection[i].AddressIp
          };
        } else if (this.viewName === "cdb_detail") {
          param["InstanceList." + i + ".Dimensions"] = {
            uInstanceId: this.multipleSelection[i].InstanceId
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            InstanceId: this.multipleSelection[i].InstanceId
          };
        } else if (this.viewName === "REDIS-CLUSTER") {
          param["InstanceList." + i + ".Dimensions"] = {
            instanceid: this.multipleSelection[i].InstanceId
          };
          param["InstanceList." + i + ".EventDimensions"] = {
            instanceid: this.multipleSelection[i].InstanceId
          };
        } else if (this.viewName === "dcchannel") {
          param["InstanceList." + i + ".Dimensions"] = {
            directconnecttunnelid: this.multipleSelection[i]
              .DirectConnectTunnelId
          };
        } else if (this.viewName === "dcline") {
          param["InstanceList." + i + ".Dimensions"] = {
            directconnectid: this.multipleSelection[i].DirectConnectId
          };
        } else if (this.viewName === "COS") {
          param["InstanceList." + i + ".Dimensions"] = {
            bucket: this.multipleSelection[i].Name
          };
        }
      }
      this.axios.post(CM_GROUPING_NEWLY_BUILD, param).then(res => {
        if (res.Response.Error === undefined) {
          this.newBuildByVal.newBuildState = false;
          this.ListInit();
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 移出
    MoveOut(row) {
      console.log(row);
      this.rulesEditorByVal.rulesEditorState = true;
      this.multipleSelection1 = row;
    },
    // 确定移出
    DeleteList() {
      console.log(this.multipleSelection1);
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.Rules.instanceGroupId
      };
      if (!Array.isArray(this.multipleSelection1)) {
        param["UniqueIds.0"] = this.multipleSelection1.UniqueId;
      } else {
        for (let i in this.multipleSelection1) {
          param["UniqueIds." + i] = this.multipleSelection1[i].UniqueId;
        }
      }
      this.axios.post(CM_GROUPING_MOVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.rulesEditorByVal.rulesEditorState = false;
          this.allDelete = false;
          this.ListInit();
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
    async AddDataList() {
      let param = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        Limit: 100
      };
      param["Filters.0.Name"] = "project-id";
      param["Filters.0.Values.0"] = this.searchSelectProject;
      if (this.searchSelect == 1 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-id";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect == 2 && this.searchInput != "") {
        param["Filters.1.Name"] = "private-ip-address";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect == 3 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-name";
        param["Filters.1.Values.0"] = this.searchInput;
      }
      if (this.searchSelect == "") {
        if (this.searchInput != "") {
          if (this.searchInput.slice(0, 4) === "ins-") {
            this.searchSelect = "1";
            param["Filters.1.Name"] = "instance-id";
            param["Filters.1.Values.0"] = this.searchInput;
          } else {
            this.searchSelect = "3";
            param["Filters.1.Name"] = "instance-name";
            param["Filters.1.Values.0"] = this.searchInput;
          }
        }
      }
      await this.axios.post(TKE_EXIST_NODES, param).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.InstanceSet;
          this.loadShowAdd = false;
        } else {
          this.loadShowAdd = false;
          let ErrTips = {
            InternalServerError: "操作内部错误。",
            InvalidFilter: "无效的过滤器。",
            "InvalidFilterValue.LimitExceeded": "Filter参数值数量超过限制。",
            "InvalidHostId.Malformed":
              "无效CDH ID。指定的CDH ID格式错误。例如ID长度错误host-1122。",
            "InvalidInstanceId.Malformed":
              "无效实例ID。指定的实例ID格式错误。例如实例ID长度错误ins-1122。",
            InvalidParameter: "无效参数。参数不合要求或者参数不被支持等。",
            InvalidParameterValue:
              "无效参数值。参数值格式错误或者参数值不被支持等。",
            "InvalidParameterValue.LimitExceeded": "参数值数量超过限制。",
            "InvalidZone.MismatchRegion": "指定的zone不存在。"
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
    handleSelectionChange(val) {
      this.multipleSelection1 = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.ListInit();
    }
  }
};
</script>
<style lang="scss" scoped>
.security-rules {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    ::v-deep .el-tabs__content {
      padding: 20px;
    }
    .tab-box {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 30px;
          & > a {
            font-size: 14px;
            font-weight: 700;
            color: #006eff;
            & > i {
              font-size: 12px;
              font-weight: 900;
            }
          }
        }
        & > a {
          & > i {
            font-size: 12px;
            color: #888;
          }
        }
        ::v-deep .el-row {
          margin-right: 30px;
        }
        ::v-deep .el-button {
          border-radius: 0px;
          height: 30px;
          padding-top: 0;
          font-size: 12px;
          padding-bottom: 0;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
      }
      .table {
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        margin-top: 10px;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        ::v-deep .el-table {
          padding: 20px;
        }
        .cl {
          color: #0abf5b;
        }
        a {
          margin-right: 10px;
          color: #006eff;
          &:hover {
            text-decoration: underline;
          }
        }
        ::v-deep .el-table th {
          padding: 0px;
          height: 40px;
        }
        ::v-deep .el-table th > .cell {
          font-size: 12px;
          font-weight: 700;
          color: #888;
        }
        ::v-deep .el-table__empty-text {
          font-size: 14px;
          color: #444;
        }
        ::v-deep .el-table td {
          border-color: #e5e5e5;
        }
        ::v-deep .el-table .cell {
          font-size: 12px;
          color: #444;
        }
        ::v-deep .el-table th.is-leaf {
          border-color: #e5e5e5;
        }
      }
    }
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}

.wraps >>> .el-button,
.wraps >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wraps >>> .el-dialog__body {
  padding: 0 20px;
}
.wraps {
  .dialog {
    .p {
      display: flex;
      margin-bottom: 16px;

      span {
        width: 68px;
        line-height: 30px;
      }
      .group-input {
        width: 300px;
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 300px;
          height: 30px;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}
.dialog-box {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
}
.wraps >>> .el-dropdown {
  font-size: 12px;
}
.wraps >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wraps {
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > h3 {
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      // flex: 1;

      .seek {
        display: flex;
        ::v-deep .el-select {
          width: 100px;
          font-size: 12px;
        }
        ::v-deep .el-input-group {
          width: 60%;
        }
        ::v-deep .el-input__inner {
          border-radius: 0;
          height: 30px;
          font-size: 12px;
          padding: 0px 10px;
        }
        ::v-deep .el-input-group__append {
          border-radius: 0;
        }
      }
    }
    // .right {
    //   flex: 1;
    // }
    .mid {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 20px;
      }
    }
  }
}
.tke-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
}
</style>
