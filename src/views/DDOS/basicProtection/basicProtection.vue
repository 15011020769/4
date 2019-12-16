<template>
  <div>
    <div class="basicProtTit">
      <span>DDoS基础防护</span>
      <el-select v-model="selectedSubarea" placeholder class="codeOrigin">
        <el-option
          v-for="item in subareas"
          :key="item.subarea"
          :label="item.lable"
          :value="item.subarea"
        ></el-option>
      </el-select>
      <el-select v-model="selectedRegion" placeholder class="taiwan">
        <el-option
          v-for="item in cities"
          :key="item.Region"
          :label="item.lable"
          :value="item.Region"
          @click="changeCity(item)"
        ></el-option>
      </el-select>
    </div>
    <div class="basicProtCon">
      <div class="newClear">
        <div class="basicProtConSearch newClear">
          <el-input placeholder="请输入主机名/主机IP搜索" class="searchIpt" v-model="searchInputVal" />
          <el-button @click="doFilter" class="el-icon-search"></el-button>
        </div>
      </div>
      <div class="tableBasic">
        <div class="tableBasicCon">
          <el-table
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            v-loading="loading"
            height="450"
          >
            <el-table-column prop="Name" label="主机名">
              <template slot-scope="scope">
                <a
                  href="#"
                  v-if="selectedSubarea=='cvm'"
                  @click="toDoDetail(scope.row)"
                >{{scope.row.InstanceName}}</a>
                <a
                  href="#"
                  v-else-if="selectedSubarea=='clb'"
                  @click="toDoDetail(scope.row)"
                >{{scope.row.LoadBalancerName}}</a>
                <a
                  href="#"
                  v-else-if="selectedSubarea=='nat'"
                  @click="toDoDetail(scope.row)"
                >{{scope.row.NatGatewayName}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="IP" label="绑定IP">
              <template slot-scope="scope">
                <div v-if="selectedSubarea=='cvm'">
                  <span v-for="item in scope.row.PublicIpAddresses" :key="item">{{item}}</span>
                </div>
                <div v-else-if="selectedSubarea=='clb'">
                  <span v-for="item in scope.row.LoadBalancerVips" :key="item">{{item}}</span>
                </div>
                <div v-else-if="selectedSubarea=='nat'">
                  <span
                    v-for="item in scope.row.PublicIpAddressSet"
                    :key="item"
                  >{{item.PublicIpAddress}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="InstanceType" label="主机类型">
              <span v-if="selectedSubarea=='cvm'">云主机</span>
              <span v-else-if="selectedSubarea=='clb'">负载均衡</span>
              <span v-else-if="selectedSubarea=='nat'">NAT</span>
              <span v-else-if="selectedSubarea=='net'">互联网</span>
            </el-table-column>
            <el-table-column prop="Status" label="安全状态">
              <template slot-scope="scope">
                <div v-if="selectedSubarea=='cvm'">
                  <span v-if="scope.row.InstanceState == 'PENDING'">创建中</span>
                  <span v-else-if="scope.row.InstanceState == 'LAUNCH_FAILED'">创建失败</span>
                  <span v-else-if="scope.row.InstanceState == 'RUNNING'">运行中</span>
                  <span v-else-if="scope.row.InstanceState == 'STOPPED'">关机</span>
                  <span v-else-if="scope.row.InstanceState == 'STARTING'">开机中</span>
                  <span v-else-if="scope.row.InstanceState == 'STOPPING'">关机中</span>
                  <span v-else-if="scope.row.InstanceState == 'REBOOTING'">重启中</span>
                  <span v-else-if="scope.row.InstanceState == 'SHUTDOWN'">停止待销毁</span>
                  <span v-else-if="scope.row.InstanceState == 'TERMINATING'">销毁中</span>
                </div>
                <div v-else-if="selectedSubarea=='clb'">
                  <span v-if="scope.row.Status == '0'">创建中</span>
                  <span v-else-if="scope.row.Status == '1'">正常运行</span>
                </div>
                <div v-else-if="selectedSubarea=='nat'">
                  <span v-if="scope.row.State == 'PENDING'">生产中</span>
                  <span v-else-if="scope.row.State == 'DELETING'">删除中</span>
                  <span v-else-if="scope.row.State == 'AVAILABLE'">运行中</span>
                  <span v-else-if="scope.row.State == 'UPDATING'">升级中</span>
                  <span v-else-if="scope.row.State == 'FAILED'">失败</span>
                </div>
              </template>
            </el-table-column>
            <!-- 操作：升级防护 跳转页面为BGP高防包，不涉及此功能 -->
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CVM_INSTANCES, CLB_LIST, NAT_LIST, ALL_CITY } from "@/constants";
export default {
  data() {
    return {
      loading: true,
      // 专区选择
      selectedSubarea: "cvm",
      subareas: [
        { subarea: "cvm", lable: "云服务器专区" },
        { subarea: "clb", lable: "负载均衡专区" },
        { subarea: "nat", lable: "NAT服务器专区" },
        { subarea: "net", lable: "互联网通道" }
      ],
      // 地域选择
      selectedCity: {},
      selectedRegion: "ap-taipei",
      cities: [],
      // 实例列表
      tableDataBegin: [],
      // 搜索框输入值
      searchInputVal: "",
      // 过滤刷新列表过程中使用
      allData: [], // 存储全部实例列表
      tableDataEnd: [],
      filterTableDataEnd: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      flag: false
    };
  },
  created() {
    this.getCity();
    this.getData();
  },
  watch: {
    selectedSubarea: function() {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.currentPage = 1;
      this.allData.splice(0, this.allData.length);
      if (this.selectedSubarea == "cvm") {
        this.describeInstances();
      } else if (this.selectedSubarea == "clb") {
        this.describeLoadBalancers();
      } else if (this.selectedSubarea == "nat") {
        this.describeNatGateway();
      } else if (this.selectedSubarea == "net") {
        this.$message("此服务功能暂未开通！");
        this.tableDataBegin = this.allData;
        this.totalItems = 0;
      }
    },
    // 1.1.查询实例列表
    describeInstances() {
      this.loading = true;
      let params = {
        Version: "2017-03-12",
        Region: this.selectedRegion
      };
      this.axios.post(CVM_INSTANCES, params).then(res => {
        // console.log(params, res)
        if (res.Response.Error == undefined) {
          this.allData = res.Response.InstanceSet;
          this.tableDataBegin = res.Response.InstanceSet;
          this.totalItems = res.Response.TotalCount;
        } else {
          this.$message.error(res.Response.Error.Message);
        }
        this.loading = false;
      });
    },
    // 1.2.查询负载均衡实例列表
    describeLoadBalancers() {
      let params = {
        Version: "2018-03-17",
        Region: this.selectedRegion
      };
      this.axios.post(CLB_LIST, params).then(res => {
        // console.log(params, res)
        if (res.Response.Error == undefined) {
          this.allData = res.Response.LoadBalancerSet;
          this.tableDataBegin = res.Response.LoadBalancerSet;
          this.totalItems = res.Response.TotalCount;
        } else {
          this.$message.error(res.Response.Error.Message);
        }
      });
    },
    // 1.3.查询NAT网关/查询NET服务器专区实例列表
    describeNatGateway() {
      let params = {
        Version: "2017-03-12",
        Region: this.selectedRegion
      };
      this.axios.post(NAT_LIST, params).then(res => {
        // console.log(params, res)
        if (res.Response.Error == undefined) {
          this.allData = res.Response.NatGatewaySet;
          this.tableDataBegin = res.Response.NatGatewaySet;
          this.totalItems = res.Response.TotalCount;
        } else {
          this.$message.error(res.Response.Error.Message);
        }
      });
    },
    // 搜索
    doFilter() {
      this.loading = true;
      if (this.searchInputVal != null && this.searchInputVal != "") {
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.tableDataBegin = new Array();
        this.filterTableDataEnd = new Array();
        this.allData.forEach((val, index) => {
          if (this.selectedSubarea == "cvm") {
            if (val.InstanceName == this.searchInputVal) {
              this.filterTableDataEnd.push(val);
            } else if (
              this.searchInputVal.indexOf(val.PublicIpAddresses) > -1
            ) {
              this.filterTableDataEnd.push(val);
            }
          } else if (this.selectedSubarea == "clb") {
            if (val.LoadBalancerName == this.searchInputVal) {
              this.filterTableDataEnd.push(val);
            } else if (this.searchInputVal.indexOf(val.LoadBalancerVips) > -1) {
              this.filterTableDataEnd.push(val);
            }
          } else if (this.selectedSubarea == "nat") {
            if (val.NatGatewayName == this.searchInputVal) {
              this.filterTableDataEnd.push(val);
            }
            for (let i in val.PublicIpAddressSet) {
              if (
                this.searchInputVal == val.PublicIpAddressSet[i].PublicIpAddress
              ) {
                this.filterTableDataEnd.push(val);
                break;
              }
            }
          } else if (this.selectedSubarea == "net") {
            // 未找到接口
          }
        });
        this.tableDataBegin = this.filterTableDataEnd;
      } else {
        // 如果没有输入搜素内容
        this.tableDataBegin = this.allData;
      }

      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.tableDataBegin.length;
      //渲染表格,根据值
      this.currentChangePage(this.tableDataBegin);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
      this.loading = false;
    },
    // 获取城市列表
    getCity() {
      this.axios.get(ALL_CITY).then(data => {
        this.cities = data.data;
        this.selectedRegion = data.data[0].Region;
        this.selectedCity = data.data[0];
        this.$cookie.set("regionv2", this.selectedCity.Region);
      });
    },
    // 切换城市
    changeCity(city) {
      this.selectedCity = city;
      this.$cookie.set("regionv2", city.Region);
      this.getData();
    },

    // 分页开始
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //跳转详情页
    toDoDetail(basicRow) {
      let insTemp = {}
      // 判断专区类型，转换传参对象
      if (this.selectedSubarea == 'cvm') {
        insTemp['Id'] = basicRow.InstanceId
        insTemp['Name'] = basicRow.InstanceName
        for (let i in basicRow.PublicIpAddresses) {
          insTemp['Ip.' + i] = basicRow.PublicIpAddresses[i]
        }
      } else if (this.selectedSubarea == 'clb') {
        insTemp['Id'] = basicRow.LoadBalancerId
        insTemp['Name'] = basicRow.LoadBalancerName
        for (let i in basicRow.LoadBalancerVips) {
          insTemp['Ip.' + i] = basicRow.LoadBalancerVips[i]
        }
      } else if (this.selectedSubarea == 'nat') {
        insTemp['Id'] = basicRow.NatGatewayId
        insTemp['Name'] = basicRow.NatGatewayName
        for (let i in basicRow.PublicIpAddressSet) {
          insTemp['Ip.' + i] = basicRow.PublicIpAddressSet[i].PublicIpAddress
        }
      }
      // 判断IP地址
      if (insTemp['Ip.0'] == null | insTemp['Ip.0'] == '') {
        // console.log('No Ip')
      } else {
        this.$router.push({
          path: "/basicProteDetail",
          query: {
            instance: JSON.stringify(insTemp)
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.basicProtTit {
  width: 100%;
  height: 52px;
  line-height: 52px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  span {
    font-size: 16px;
    font-weight: 600;
    margin-right: 38px;
  }
  .codeOrigin {
    border: 0;
    margin-right: 20px;
    ::v-deep input {
      border: 0;
      width: 150px;
    }
  }
  .taiwan {
    width: 100px;
    height: 30px;
    line-height: 30px;
    ::v-deep input {
      width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #006eff;
      color: #006eff;
      border-radius: 0;
    }
  }
}
.basicProtCon {
  width: 100%;
  padding: 20px;
  .basicProtConSearch {
    text-align: right;
    margin-bottom: 20px;
    float: right;
    .searchIpt {
      width: 300px;
      float: left;
      height: 30px;
      ::v-deep input {
        width: 100%;
        height: 30px;
        border-radius: 0;
        line-height: 30px;
      }
    }
    .el-icon-search {
      width: 50px;
      float: left;
      border-radius: 0;
      height: 30px;
      padding: 0;
      text-align: center;
      line-height: 30px;
    }
  }
  .tableBasic {
    background-color: #fff;
    .tableBasicCon {
      min-height: 450px;
    }
  }
}
.tabListPage {
  text-align: right;
  height: 50px;
  border-top: 1px solid #ddd;
  padding-top: 8px !important;
}
</style>