<template>
  <div class="main" style="background:white;">
    <div class="left">
      <div class="left-main border">
        <div class="seek" style="">
          <el-select
            v-model="projectSelectedOption"
            @change="changeProject"
            v-if="productValue === 'cvm_device' || productValue === 'BS'"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="searchItem"
            :placeholder="$t('CVM.CamTransferCpt.placeholder1')"
          >
            <el-option
              v-for="item in searchItemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            :placeholder="$t('CVM.CamTransferCpt.placeholder1')"
            v-model="searchInput"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="changeSearch"
            ></el-button>
          </el-input>
        </div>
        <el-table
          :data="tableData"
          height="420"
          ref="multipleTable"
          @select="handleSelection"
          @select-all="handleSelection"
          @selection-change="handleSelectionChange"
          v-loadmore="loadMore"
          class="table-left"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectable"
            disabled="true"
          ></el-table-column>
          <el-table-column :label="headConfig.title1" width="120">
            <template slot-scope="scope">
              <div v-if="productValue === 'cvm_device'">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <p>{{ scope.row.VpnGatewayName }}</p>
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpnConnectionId }}</p>
                <p>{{ scope.row.VpnConnectionName }}</p>
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ scope.row.NatGatewayId }}</p>
                <p>{{ scope.row.NatGatewayName }}</p>
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>{{ scope.row.DirectConnectGatewayId }}</p>
                <p>{{ scope.row.DirectConnectGatewayName }}</p>
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <div v-if="productValue === 'cdb_detail'">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>{{ scope.row.InstanceName }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'dcchannel'">
                <p>{{ scope.row.DirectConnectTunnelId }}</p>
                <p>{{ scope.row.DirectConnectTunnelName }}</p>
              </div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.DirectConnectId }}</p>
                <p>{{ scope.row.DirectConnectName }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.Name }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ scope.row.DiskId }}</p>
                <p>{{ scope.row.DiskName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="headConfig.title2" width="120">
            <template slot-scope="scope">
              <div v-if="productValue == 'cvm_device'">
                <p>VPC 網路</p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ vpcConnState[scope.row.State] }}</p>
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.RouteType}}</p> -->
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ natStatu[scope.row.State] }}</p>
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>不支持</p>
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <div v-if="productValue === 'cdb_detail'">
                <p>{{ scope.row.Vip }}</p>
                <p>{{ scope.row.Vport }}</p>
              </div>
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>master-slave</p>
              </div>
              <div v-if="productValue === 'dcchannel'">
                <p>{{ scope.row.VpcId }}</p>
              </div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.Location }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.zone.zone }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ scope.row.DiskSize }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="headConfig.title3" width="120">
            <template slot-scope="scope">
              <div v-if="productValue == 'cvm_device'">
                <p>
                  {{
                    scope.row.PrivateIpAddresses &&
                      scope.row.PrivateIpAddresses[0]
                  }}(内網)
                </p>
                <p>
                  {{
                    scope.row.PublicIpAddresses &&
                      scope.row.PublicIpAddresses[0]
                  }}(外網)
                </p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.VpnGatewayName}}</p> -->
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <!-- <p>{{scope.row.VpnProto}}</p> -->
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.natName}}</p> -->
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.directConnectGatewayName}}</p> -->
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <!-- <div v-if="productValue === 'cdb_detail'">
              <p>VPC网络</p>
            </div> -->
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>{{ scope.row.WanIp }}</p>
              </div>
              <div v-if="productValue === 'dcchannel'"></div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.Bandwidth }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.CreationDate | CreateDate }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ DiskType[scope.row.DiskType] }}</p>
                <p>{{ DiskUsage[scope.row.DiskUsage] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="headConfig.title4"
            v-if="productValue === 'nat_tc_stat'"
          >
            <template slot-scope="scope">
              <div v-if="productValue === 'nat_tc_stat'">
                <p>最大並發連接數{{ scope.row.MaxConcurrentConnection }}</p>
              </div>
              <!-- <div v-if="productValue === 'cdb_detail'">
              <p>主实例</p>
            </div> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mid" v-if="isShowRight">
      <i class="el-icon-connection"></i>
    </div>
    <div class="right" v-if="isShowRight">
      <div class="right-main border">
        <el-table
          :data="multipleSelection"
          style=""
          height="450"
          class="table-left"
        >
          <!-- <el-table-column
          type="selection"
          width="55"
        ></el-table-column> -->
          <el-table-column :label="headConfig.title1" width="120">
            <template slot-scope="scope">
              <div v-if="productValue === 'cvm_device'">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <p>{{ scope.row.VpnGatewayName }}</p>
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpnConnectionId }}</p>
                <p>{{ scope.row.VpnConnectionName }}</p>
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ scope.row.NatGatewayId }}</p>
                <p>{{ scope.row.NatGatewayName }}</p>
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>{{ scope.row.DirectConnectGatewayId }}</p>
                <p>{{ scope.row.DirectConnectGatewayName }}</p>
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <div v-if="productValue === 'cdb_detail'">
                <p>{{ scope.row.InstanceId }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>{{ scope.row.InstanceName }}</p>
                <p>{{ scope.row.InstanceName }}</p>
              </div>
              <div v-if="productValue === 'dcchannel'">
                <p>{{ scope.row.DirectConnectTunnelId }}</p>
                <p>{{ scope.row.DirectConnectTunnelName }}</p>
              </div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.DirectConnectId }}</p>
                <p>{{ scope.row.DirectConnectName }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.Name }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ scope.row.DiskId }}</p>
                <p>{{ scope.row.DiskName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="headConfig.title2" width="120">
            <template slot-scope="scope">
              <div v-if="productValue == 'cvm_device'">
                <p>VPC 網路</p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ vpcConnState[scope.row.State] }}</p>
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.RouteType}}</p> -->
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ natStatu[scope.row.State] }}</p>
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>不支持</p>
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <div v-if="productValue === 'cdb_detail'">
                <p>{{ scope.row.Vip }}</p>
                <p>{{ scope.row.Vport }}</p>
              </div>
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>master-slave</p>
              </div>
              <div v-if="productValue === 'dcchannel'">
                <p>{{ scope.row.VpcId }}</p>
              </div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.Location }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.zone.zone }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ scope.row.DiskSize }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="headConfig.title3" width="120">
            <template slot-scope="scope">
              <div v-if="productValue == 'cvm_device'">
                <p>
                  {{
                    scope.row.PrivateIpAddresses &&
                      scope.row.PrivateIpAddresses[0]
                  }}(内網)
                </p>
                <p>
                  {{
                    scope.row.PublicIpAddresses &&
                      scope.row.PublicIpAddresses[0]
                  }}(外網)
                </p>
              </div>
              <div v-if="productValue === 'VPN_GW'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.VpnGatewayName}}</p> -->
              </div>
              <div v-if="productValue === 'vpn_tunnel'">
                <p>{{ scope.row.VpnGatewayId }}</p>
                <!-- <p>{{scope.row.VpnProto}}</p> -->
              </div>
              <div v-if="productValue === 'nat_tc_stat'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.natName}}</p> -->
              </div>
              <div v-if="productValue === 'DC_GW'">
                <p>{{ scope.row.VpcId }}</p>
                <!-- <p>{{scope.row.directConnectGatewayName}}</p> -->
              </div>
              <div v-if="productValue === 'EIP'">
                <p>{{ scope.row.AddressId }}</p>
              </div>
              <!-- <div v-if="productValue === 'cdb_detail'">
              <p>VPC网络</p>
            </div> -->
              <div v-if="productValue === 'REDIS-CLUSTER'">
                <p>{{ scope.row.WanIp }}</p>
              </div>
              <div v-if="productValue === 'dcchannel'"></div>
              <div v-if="productValue === 'dcline'">
                <p>{{ scope.row.Bandwidth }}</p>
              </div>
              <div v-if="productValue === 'COS'">
                <p>{{ scope.row.CreationDate | CreateDate }}</p>
              </div>
              <div v-if="productValue === 'BS'">
                <p>{{ DiskType[scope.row.DiskType] }}</p>
                <p>{{ DiskUsage[scope.row.DiskUsage] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="headConfig.title4"
            v-if="productValue === 'nat_tc_stat'"
          >
            <template slot-scope="scope">
              <div v-if="productValue === 'nat_tc_stat'">
                <p>最大並發連接數{{ scope.row.MaxConcurrentConnection }}</p>
              </div>
              <!-- <div v-if="productValue === 'cdb_detail'">
              <p>主实例</p>
            </div> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  TKE_EXIST_NODES,
  ALL_PROJECT,
  CM_GROUPING_NEWLY_BUILD
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
export default {
  name: "CamTransferCpt",
  data() {
    return {
      projectSelectedOption: 0, //選擇了一個專案
      projectOptions: [
        {
          projectId: 0,
          projectName: "預設專案"
        }
      ], //專案資源列表
      searchItem: "", //搜索项值
      multipleSelection: [],
      searchItemOptions: [], //搜索项数组
      searchInput: "", //搜索内容
      loadSign: true,
      tableData: [],
      productValue: "", //产品类型
      headConfig: {
        title1: "",
        title2: "",
        title3: ""
      },
      DiskType: {
        CLOUD_BASIC: "普通雲硬碟",
        CLOUD_PREMIUM: "高效能雲硬碟",
        CLOUD_SSD: "SSD雲硬碟"
      },
      vpcConnState: {
        PENDING: "生產中",
        AVAILABLE: "運行中",
        DELETING: "刪除中"
      },
      natStatu: {
        PENDING: "生產中",
        DELETING: "刪除中",
        AVAILABLE: "運行中",
        UPDATING: "升級中",
        FAILED: "失敗"
      },
      DiskUsage: {
        SYSTEM_DISK: "系統盤",
        DATA_DISK: "數據盤"
      }
      // isShowRight: this.isShowRight,
    };
  },
  props: {
    productData: {
      required: true,
      type: Object
    },
    isShowRight: {
      required: true,
      type: Boolean
    },
    selectedList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showSelectedList: { // 弹出组件时，默认右边是否显示已选中的组件
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  watch: {
    productData: {
      handler(value, oldValue) {
        if (JSON.stringify(value) !== "{}") {
          if (value.productValue === "COS") {
            this.tableData = value.Date.Bucket;
          } else {
            this.tableData = value.Date;
          }
          this.selected();
          this.searchItemOptions = value.SearchConfig;
          if (this.searchItemOptions.length > 0) {
            this.searchItem = this.searchItemOptions[0].value;
          }
          this.headConfig = value.HeadConfig;
          this.productValue = value.productValue;
          if (value.projectId !== undefined) {
            this.projectSelectedOption = value.projectId;
          }
          this.$emit("CAM_loading", false);
        }
      },
      deep: true,
      immediate: true
    },
    selectedList: {
      handler(value, oldValue) {
        this.multipleSelection = [];
        this.selected();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    // 根据 InstanceId 设置选中
    byIdSetSeleteList: function (InstanceId) {
      let newSelectList = this.tableData.filter(item => item.InstanceId === InstanceId)
      if (newSelectList[0]) {
        this.multipleSelection = newSelectList
        this.$refs.multipleTable.toggleRowSelection(newSelectList[0], true)
      }
      this.$emit('multipleSelection', newSelectList)
    },
    //选择项目
    changeProject() {
      this.$emit("projectId", this.projectSelectedOption);
    },
    selected() {
      if (this.$refs.multipleTable !== undefined) {
        this.$refs.multipleTable.clearSelection();
      }

      this.tableData.forEach(row => {
        const found = this.selectedList.find(item => {
          // 已经选择过的勾选上
          if (this.productValue === "cvm_device") {
            return item.InstanceId === row.InstanceId;
          } else if (this.productValue === "VPN_GW") {
            return item.VpnGatewayId === row.VpnGatewayId;
          } else if (this.productValue === "vpn_tunnel") {
            return item.VpnConnectionId === row.VpnConnectionId;
          } else if (this.productValue === "nat_tc_stat") {
            return item.NatGatewayId === row.NatGatewayId;
          } else if (this.productValue === "DC_GW") {
            return item.DirectConnectGatewayId === row.DirectConnectGatewayId;
          } else if (this.productValue === "EIP") {
            return item.AddressId === row.AddressId;
          } else if (this.productValue === "cdb_detail") {
            return item.InstanceId === row.InstanceId;
          } else if (this.productValue === "REDIS-CLUSTER") {
            return item.InstanceName === row.InstanceName;
          } else if (this.productValue === "dcchannel") {
            return item.DirectConnectTunnelId === row.DirectConnectTunnelId;
          } else if (this.productValue === "dcline") {
            return item.DirectConnectId === row.DirectConnectId;
          } else if (this.productValue === "COS") {
            return item.Name === row.Name;
          } else if (this.productValue === "BS") {
            return item.DiskId === row.DiskId;
          } else {
            return false;
          }
        });

        this.$nextTick(function() {
          if (found !== undefined) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          } else {
            this.$refs.multipleTable.toggleRowSelection(row, false);
          }
        });
      });
    },
    selectable(row, index) {
      if (this.selectedList.length === 0) {
        return true;
      }

      // 如果已经选择了则禁用勾选
      if (this.productValue === "cvm_device") {
        const item = this.selectedList.find(item => {
          return item.InstanceId === row.InstanceId;
        });

        return item === undefined;
      } else if (this.productValue === "VPN_GW") {
        const item = this.selectedList.find(item => {
          return item.VpnGatewayId === row.VpnGatewayId;
        });

        return item === undefined;
      } else if (this.productValue === "vpn_tunnel") {
        const item = this.selectedList.find(item => {
          return item.VpnConnectionId === row.VpnConnectionId;
        });

        return item === undefined;
      } else if (this.productValue === "nat_tc_stat") {
        const item = this.selectedList.find(item => {
          return item.NatGatewayId === row.NatGatewayId;
        });

        return item === undefined;
      } else if (this.productValue === "DC_GW") {
        const item = this.selectedList.find(item => {
          return item.DirectConnectGatewayId === row.DirectConnectGatewayId;
        });

        return item === undefined;
      } else if (this.productValue === "EIP") {
        const item = this.selectedList.find(item => {
          return item.AddressId === row.AddressId;
        });

        return item === undefined;
      } else if (this.productValue === "cdb_detail") {
        const item = this.selectedList.find(item => {
          return item.InstanceId === row.InstanceId;
        });

        return item === undefined;
      } else if (this.productValue === "REDIS-CLUSTER") {
        const item = this.selectedList.find(item => {
          return item.InstanceName === row.InstanceName;
        });

        return item === undefined;
      } else if (this.productValue === "dcchannel") {
        const item = this.selectedList.find(item => {
          return item.DirectConnectTunnelId === row.DirectConnectTunnelId;
        });

        return item === undefined;
      } else if (this.productValue === "dcline") {
        const item = this.selectedList.find(item => {
          return item.DirectConnectId === row.DirectConnectId;
        });

        return item === undefined;
      } else if (this.productValue === "COS") {
        const item = this.selectedList.find(item => {
          return item.Name === row.Name;
        });

        return item === undefined;
      } else if (this.productValue === "BS") {
        const item = this.selectedList.find(item => {
          return item.DiskId === row.DiskId;
        });

        return item === undefined;
      } else {
        return ture;
      }
    },
    changeSearch() {
      let searchParam = {};
      if (this.searchInput) {
        searchParam.value = this.searchInput;
        searchParam.label = this.searchItem;
      }
      // searchParam.value = this.searchInput;
      // searchParam.label = this.searchItem;
      this.$emit("searchParam", searchParam);
    },

    // 项目
    getProjectList() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            this.projectOptions.push(arr[i]);
          }
        } else {
          let ErrTips = {
            InternalError: "內部錯誤",
            UnauthorizedOperation: "未授權操作"
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
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        this.pageIndex++;
      }
    },
    handleSelection(val) {
      console.log('handleSelection', val)
      if (this.showSelectedList === true) {
        return;
      }

      // 将以前已选择的过滤掉，右边表格只保留用户手动勾选的
      let selectedItems = [];
      if (this.selectedList.length !== 0) {
        if (this.productValue === "cvm_device") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.InstanceId === selected.InstanceId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "VPN_GW") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.VpnGatewayId === selected.VpnGatewayId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "vpn_tunnel") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.VpnConnectionId === selected.VpnConnectionId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "nat_tc_stat") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.NatGatewayId === selected.NatGatewayId;
            });

            return v === undefined;
          });
        } else if (this.productValue === "DC_GW") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return (
                item.DirectConnectGatewayId === selected.DirectConnectGatewayId
              );
            });

            return found === undefined;
          });
        } else if (this.productValue === "EIP") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.AddressId === selected.AddressId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "cdb_detail") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.InstanceId === selected.InstanceId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "REDIS-CLUSTER") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.InstanceName === selected.InstanceName;
            });

            return found === undefined;
          });
        } else if (this.productValue === "dcchannel") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return (
                item.DirectConnectTunnelId === selected.DirectConnectTunnelId
              );
            });

            return found === undefined;
          });
        } else if (this.productValue === "dcline") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.DirectConnectId === selected.DirectConnectId;
            });

            return found === undefined;
          });
        } else if (this.productValue === "COS") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.Name === selected.Name;
            });

            return found === undefined;
          });
        } else if (this.productValue === "BS") {
          selectedItems = val.filter(item => {
            const found = this.selectedList.find(selected => {
              return item.DiskId === selected.DiskId;
            });

            return found === undefined;
          });
        }
      } else {
        selectedItems = val;
      }

      this.multipleSelection = selectedItems;
      this.$emit("multipleSelection", selectedItems);
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange', val)
      if (this.showSelectedList === false) {
        return;
      }

      this.multipleSelection = val;
      this.$emit("multipleSelection", val);
    },
    DeleteList(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.multipleSelection) {
        if (row.InstanceId === this.multipleSelection[i].InstanceId) {
          this.multipleSelection.splice(this.multipleSelection[i], 1);
        }
      }
    }
  },
  filters: {
    CreateDate(val) {
      if (val) {
        return moment(val).format("YYYY-MM-DD HH :mm:ss");
      }
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function() {
          let sign = 100;
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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

  .right {
    border: 1px #f2f2f2 solid;
    border-bottom: 0px;
  }

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
</style>
