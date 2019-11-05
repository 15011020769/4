<template>
  <div class="relation-example">
    <div class="tab">
      <el-tabs v-model="activeName1" @tab-click="handleClick">
        <el-tab-pane label="云主机" name="first">
          <div class="tab-box">
            <div class="btn">
              <el-row>
                <el-button type="primary" @click="NewRelation()">新增关联</el-button>
                <el-button v-if="SelectLength.length===0" disabled>批量移出</el-button>
                <el-button v-if="SelectLength.length!==0" @click="MoveOutBtn(SelectLength)">批量移出</el-button>
              </el-row>
              <div class="search">
                <search :options="options" v-on:search="search"></search>
              </div>
            </div>
            <div class="table-box">
              <el-table
                ref="multipleTable"
                :data="VPSData"
                v-loading="loading"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.InstanceId}}</a>
                    <p>{{scope.row.InstanceName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="所属网络">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.VirtualPrivateCloud.VpcId}}</a>
                    <p>{{scope.row.VirtualPrivateCloud.VpcName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="主 IP 地址">
                  <template slot-scope="scope">
                    <p>{{scope.row.PublicIpAddresses? '-' : scope.row.PrivateIpAddresses.join(',') + '(内)'}}</p>
                    <p>{{scope.row.PrivateIpAddresses? '-' : scope.row.PrivateIpAddresses.join(',') + '(外)'}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="MoveOutBtn(scope.row)">移出安全组</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="length">
              <p>已选 {{SelectLength.length}} 项，共 {{VPSDataLength}} 项</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="辅助弹性网卡" name="second">
          <div class="tab-box">
            <div class="btn">
              <el-row>
                <el-button type="primary" @click="NewRelation()">新增关联</el-button>
                <el-button v-if="SelectLength.length===0" disabled>批量移出</el-button>
                <el-button v-if="SelectLength.length!==0" @click="MoveOutBtn(SelectLength)">批量移出</el-button>
              </el-row>
              <div class="search">
                <search :options="options" v-on:search="search"></search>
              </div>
            </div>
            <div class="table-box">
              <el-table
                ref="multipleTable"
                :data="CardData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.NetworkInterfaceId}}</a>
                    <p>{{scope.row.NetworkInterfaceName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="所属网络">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.VpcId}}</a>
                    <p>{{scope.row.vpcName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="主 IP 地址">
                  <template slot-scope="scope">
                    <p>{{!scope.row.PrivateIpAddressSet? '-' : scope.row.PrivateIpAddressSet[0].PrivateIpAddress + '(主)'}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="MoveOutBtn(scope.row)">移出安全组</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="length">
              <p>已选 {{SelectLength.length}} 项，共 {{CardDataLength}} 项</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="云数据库Mysql" name="third">
          <div class="tab-box">
            <div class="btn">
              <el-row>
                <el-button type="primary" @click="NewRelation()">新增关联</el-button>
                <el-button v-if="SelectLength.length===0" disabled>批量移出</el-button>
                <el-button v-if="SelectLength.length!==0" @click="MoveOutBtn(SelectLength)">批量移出</el-button>
              </el-row>
              <div class="search">
                <search :options="options" v-on:search="search"></search>
              </div>
            </div>
            <div class="table-box">
              <el-table
                ref="multipleTable"
                :data="MysqlData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.InstanceId}}</a>
                    <p>{{scope.row.InstanceName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="所属网络">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.UniqVpcId}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="MoveOutBtn(scope.row)">移出安全组</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="length">
              <p>已选 {{SelectLength.length}} 项，共 {{MysqlDataLength}} 项</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="负载均衡" name="fourth">
          <div class="tab-box">
            <div class="btn">
              <el-row>
                <el-button type="primary" @click="NewRelation()">新增关联</el-button>
                <el-button v-if="SelectLength.length===0" disabled>批量移出</el-button>
                <el-button v-if="SelectLength.length!==0" @click="MoveOutBtn(SelectLength)">批量移出</el-button>
              </el-row>
              <div class="search">
                <search :options="options" v-on:search="search"></search>
              </div>
            </div>
            <div class="table-box">
              <el-table
                ref="multipleTable"
                :data="slbData"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="loading"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.LoadBalancerId}}</a>
                    <p>{{scope.row.LoadBalancerName}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="所属网络">
                  <template slot-scope="scope">
                    <a href="javascript:;">{{scope.row.VpcId}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="VIP">
                  <template slot-scope="scope">
                    <p>{{scope.row.VipIsp === ""?"-":scope.row.VipIsp}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="MoveOutBtn(scope.row)">移出安全组</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="length">
              <p>已选 {{SelectLength.length}} 项，共 {{slbDataLength}} 项</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <move-out
      :moveOutShow="moveOutByVal"
      v-if="moveOutByVal.moveOutState"
      v-on:close="moveOutByVal.moveOutState = false"
      @update="Update"
    ></move-out>
    <new-linkages
      :newLinkagesShow="newLinkagesByVal"
      v-if="newLinkagesByVal.newLinkagesState"
      v-on:close="newLinkagesByVal.newLinkagesState = false"
    ></new-linkages>
  </div>
</template>
<script>
import NewLinkages from "./modal/example/newLinkages"; // 新增关联
import MoveOut from "./modal/example/moveOut"; // 移出
export default {
  data() {
    return {
      activeName1: "first",
      loading: true, // 表格加载动画
      searchSelect: "", // 搜索
      searchInput: "", // 搜索
      VPSData: [], // 云主机
      VPSDataLength: 0,
      CardData: [], // 辅助弹性网卡
      CardDataLength: 0,
      MysqlData: [], // 云数据库Mysql
      MysqlDataLength: 0,
      slbData: [], // 负载均衡
      slbDataLength: 0,
      options: [
        //搜索
        {
          value: "名称",
          lable: "名称"
        },
        {
          value: "ID",
          lable: "ID"
        }
      ],
      SelectLength: [], // 选中的项
      newLinkagesByVal: {
        // 新建关联
        newLinkagesState: false,
        newLinkagesList: [],
        newLinkagesType: "",
        newLinkagesId: this.Rules.SecurityGroupId
      },
      moveOutByVal: {
        // 删除
        moveOutState: false,
        moveOutList: [],
        moveOutType: "",
        moveOutId: this.Rules.SecurityGroupId
      }
    };
  },
  components: {
    MoveOut,
    NewLinkages
  },
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.VPS(); // 云主机
    this.ElasticCard(); // 辅助弹性网卡
    this.Mysql(); // 云数据库Mysql
    this.LoadBalancing(); // 负载均衡
  },
  methods: {
    // 云主机
    VPS() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "Filters.0.Name": "security-group-id",
        "Filters.0.Values.0": this.Rules.SecurityGroupId
      };
      if (
        (this.searchSelect === "" && this.searchInput !== "") ||
        (this.searchSelect === "名称" && this.searchInput !== "")
      ) {
        params["Filters.1.Name"] = "instance-name";
        params["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect === "ID" && this.searchInput !== "") {
        params["Filters.1.Name"] = "instance-id";
        params["Filters.1.Values.0"] = this.searchInput;
      }
      this.axios
        .post("cvm2/DescribeInstances", params)
        .then(data => {
          this.VPSData = data.Response.InstanceSet;
          this.loading = false;
          this.VPSDataLength = data.Response.TotalCount;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 辅助弹性网卡
    ElasticCard() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "Filters.0.Name": "groups.security-group-id",
        "Filters.0.Values.0": this.Rules.SecurityGroupId
      };
      if (
        (this.searchSelect === "" && this.searchInput !== "") ||
        (this.searchSelect === "名称" && this.searchInput !== "")
      ) {
        params["Filters.1.Name"] = "network-interface-name";
        params["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect === "ID" && this.searchInput !== "") {
        params["Filters.1.Name"] = "network-interface-id";
        params["Filters.1.Values.0"] = this.searchInput;
      }
      this.axios
        .post("vpc2/DescribeNetworkInterfaces", params)
        .then(data => {
          this.loading = false;
          this.CardData = data.Response.NetworkInterfaceSet;
          this.CardDataLength = data.Response.TotalCount;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 云数据库Mysql
    Mysql() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.Rules.SecurityGroupId
      };
      if (
        (this.searchSelect === "" && this.searchInput !== "") ||
        (this.searchSelect === "名称" && this.searchInput !== "")
      ) {
        params["InstanceNames.0"] = this.searchInput;
      } else if (this.searchSelect === "ID" && this.searchInput !== "") {
        params["InstanceIds.0"] = this.searchInput;
      }
      this.axios
        .post("cdb/DescribeDBInstances", params)
        .then(data => {
          this.loading = false;
          this.MysqlData = data.data.items;
          this.MysqlDataLength = data.data.totalCount;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 负载均衡
    LoadBalancing() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.Rules.SecurityGroupId
      };
      if (
        (this.searchSelect === "" && this.searchInput !== "") ||
        (this.searchSelect === "名称" && this.searchInput !== "")
      ) {
        params["LoadBalancerName"] = this.searchInput;
      } else if (this.searchSelect === "ID" && this.searchInput !== "") {
        params["LoadBalancerIds.0"] = this.searchInput;
      }
      this.axios
        .post("lb/DescribeLoadBalancers", params)
        .then(data => {
          this.loading = false;
          this.slbData = data.loadBalancerSet;
          this.slbDataLength = data.totalCount;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 搜索
    search(searchInput, searchSelect) {
      this.searchInput = searchInput;
      this.searchSelect = searchSelect;
      this.loading = true;
      this.VPS();
      this.ElasticCard();
      this.Mysql();
      this.LoadBalancing(); // 负载均衡
    },
    // 新建关联
    NewRelation() {
      this.newLinkagesByVal.newLinkagesState = true;
    },
    // 移出安全组
    MoveOutBtn(row) {
      this.moveOutByVal.moveOutState = true;
      if (this.activeName1 === "first") {
        this.moveOutByVal.moveOutType = 0;
      } else if (this.activeName1 === "second") {
        this.moveOutByVal.moveOutType = 1;
      } else if (this.activeName1 === "third") {
        this.moveOutByVal.moveOutType = 2;
      } else if (this.activeName1 === "fourth") {
        this.moveOutByVal.moveOutType = 3;
      }
      this.moveOutByVal.moveOutList = row;
    },
    handleClick(tab, event) {
      this.loading = true;
      this.VPS(); // 云主机
      this.ElasticCard(); // 辅助弹性网卡
      this.Mysql(); // 云数据库Mysql
      this.LoadBalancing(); // 负载均衡
    },
    handleSelectionChange(val) {
      this.SelectLength = val;
    },
    Update() {
      this.loading = true;
      if (this.activeName1 === "first") {
        this.VPS();
      } else if (this.activeName1 === "second") {
        this.ElasticCard();
      } else if (this.activeName1 === "third") {
        this.Mysql();
      } else if (this.activeName1 === "fourth") {
        this.LoadBalancing();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.relation-example {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    .tab-box {
      margin: 20px;
      .btn {
        display: flex;
        justify-content: space-between;
        ::v-deep .el-button {
          padding-top: 0px;
          padding-bottom: 0px;
          border-radius: 0px;
          height: 30px;
          font-size: 12px;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
      }
      .table-box {
        min-height: 350px;
        border-bottom: 1px solid #ddd;
        margin-top: 10px;
        a {
          color: #006eff;
          font-size: 12px;
          &:hover {
            text-decoration: underline;
          }
        }
        p {
          margin-top: -4px;
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
      .length {
        padding: 10px 10px 14px 10px;
        & > p {
          height: 30px;
          line-height: 30px;
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

