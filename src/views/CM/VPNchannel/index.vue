<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">VPN通道</div>
    <div class="tool">
      <Cities
        :cities="cities"
        class="city"
        :Cityvalue.sync="selectedRegion"
        @changeCity="changeCity"
      />
      <!-- 搜索 -->
      <SEARCH
        :searchOptions="searchOptions"
        :searchValue="searchValue"
        @changeValue="changeValue"
        :searchInput="searchInput"
        @changeinput="changeinput"
        @clicksearch="clicksearch"
      ></SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table
        :data="ProTableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        height="550"
        style="width: 100%"
      >
        <el-table-column prop label="ID/主机名 " width="150">
          <template slot-scope="scope">
            <p>
              <a
                @click="jump(scope.row.VpnConnectionId)"
                style="cursor:pointer;"
              >{{scope.row.VpnConnectionId}}</a>
            </p>
            {{ scope.row.VpnConnectionName}}
          </template>
        </el-table-column>
        <el-table-column prop label="监控">
          <template slot-scope="scope">
            <i class="el-icon-share"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <p
              :class="scope.row.State == 'PENDING' ? 'orange' : scope.row.State == 'AVAILABLE' ? 'green' : 'red'"
            >{{vpcConnState[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="所属网络" width="150">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpcId}}</p>
            <p>{{scope.row.VpcName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="VPN网关" width="150">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpnGatewayId}}</p>
            <p>{{scope.row.vpnGwName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="	对端网关" width="150">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.CustomerGatewayId}}</p>
            <p>{{scope.row.userGwName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="	健康状态"></el-table-column>
        <el-table-column prop label="	告警策略数"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 30, 40,50,100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ProTableData.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ALL_CITY, VPNTD_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      loadShow: true,//加载是否显示
      //下拉框
      searchOptions: [
        {
          value: "vpn-connection-id",
          label: "ID"
        },
        {
          value: "vpn-connection-name",
          label: "名称"
        }
      ],
      searchValue: "",
      //文字过滤
      instanceStatus: {
        PENDING: "创建中",
        LAUNCH_FAILED: "创建失败",
        RUNNING: "运行中",
        STOPPED: "已关机",
        STARTING: "开机中",
        STOPPING: "关机中",
        REBOOTING: "重启中",
        SHUTDOWN: "待回收",
        TERMINATING: "销毁中"
      },
      RestrictState: {
        NORMAL: "健康",
        EXPIRED: "过期",
        PROTECTIVELY_ISOLATED: "隔离"
      },
      vpcConnState: {
        PENDING: "生产中",
        AVAILABLE: "运行中",
        DELETING: "删除中"
      },
      cities: [],
      selectedRegion: "ap-taipei", // 默认选中城市
      selectedCity: {}, // 切换城市
      search: "", // 搜索
      searchInput: "",
      TbaleData: [], // 表格数据
      ProjectData: [], // 项目列表数据
      ProTableData: [], // 添加完项目列表的表格数据
      pagesize: 20, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  created() {
    this.GetCity();
    this.GetTabularData();
  },
  components: {
    Cities,
    SEARCH,
    Loading
  },
  methods: {
    // 获取城市列表
    GetCity() {
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
      this.GetTabularData();
    },
    //选择搜索条件
    changeValue(val) {
      this.searchValue = val;
    },
    //输入框输入值
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.GetTabularData();
      }
    },
    //点击搜索按钮
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.GetTabularData();
      } else {
        this.$message.error("请输入正确搜索信息");
      }
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
        Version: "2017-03-12",
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        param["Filters.0.Name"] = this.searchValue;
        param["Filters.0.Values.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(VPNTD_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.VpnConnectionSet;
          this.ProTableData = this.TbaleData;
          this.loadShow = false;
        } else {
          this.$message.error(data.Response.Error.Message);
        }
      });
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      this.GetTabularData();
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.GetTabularData();
    },
    //跳转
    jump(id) {
      this.$router.push({
        name: "CMVPNTdetails",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.CM-wrap{
  width: 100%;
  height: 100%;
}
.green {
  color: green;
}

.red {
  color: red;
}

.orange {
  color: orange;
}

.tool {
  display: flex;
  justify-content: space-between;
  margin: 20px 20px 0 20px;
}

.CVM-title {
  background: #fff;
  line-height: 60px;
  font-weight: bold;
  padding-left: 20px;
  font-size: 16px;
}

.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}

.Table-SY {
  background: #fff;
  margin: 20px;
}

.pagstyle {
  padding: 20px;
}
</style>
