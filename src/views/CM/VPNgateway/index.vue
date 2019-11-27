<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">VPN网关</div>
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
        <el-table-column prop label="ID/主机名 ">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.vpcId)" style="cursor:pointer;">{{scope.row.vpcId}}</a>
            </p>
            {{ scope.row.vpnGwName}}
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
              :class="[0,2,4].indexOf(scope.row.vpcConnStatus) != -1 ? 'orange' : [1,3].indexOf(scope.row.vpcConnStatus) != -1 ? 'red' : 'green'"
            >{{vpcConnState[scope.row.vpnGwStatus]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="所属网络">
        </el-table-column>

        <el-table-column label="健康状态">
        </el-table-column>
        <el-table-column prop label="告警策略数">
        </el-table-column>
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
import { ALL_CITY, VPN_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      searchOptions: [
        {
          value: "vpcId",
          label: "ID"
        },
        {
          value: "vpnGwName",
          label: "名称"
        }
      ],
      vpcConnState: {
        0: "创建中",
        1: "创建出错",
        2: "修改中",
        3: "修改出错",
        4: "删除中",
        5: "删除出错",
        6: "运行正常"
      },
      searchValue: "",
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
    SEARCH
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
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.GetTabularData();
      }
    },
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
        param[this.searchValue] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(VPN_LIST, param).then(data => {
        this.TbaleData = data.data;
        this.ProTableData = this.TbaleData;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      this.GetTabularData();
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.GetTabularData();
    },
    jump(id) {
      this.$router.push({
        name: "CMVPNdetails",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
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
