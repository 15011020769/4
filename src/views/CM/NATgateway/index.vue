<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">NAT网关</div>
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
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="TbaleData" height="550" style="width: 100%">
        <el-table-column prop label="ID/主机名">
          <template slot-scope="scope">
            <p>
              <a
                @click="jump(scope.row.NatGatewayId)"
                style="cursor:pointer;"
              >{{scope.row.NatGatewayId}}</a>
            </p>
            <p>{{scope.row.NatGatewayName}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="监控">
          <template slot-scope="scope">
            <!-- <a @click="jump(scope.row.NatGatewayId)" style="cursor:pointer;">
              <i class="el-icon-share"></i>
            </a> -->
             <div class="a" @click="jump(scope.row.NatGatewayId)"></div>
          </template>
        </el-table-column>

        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <p :class="scope.row.State == 'FAILED' ? 'red' :' green'">{{natStatu[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="私有网络">
          <template slot-scope="scope">
            <a href>{{scope.row.VpcId}}</a>
            <p></p>
          </template>
        </el-table-column>
        <el-table-column prop label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.CreatedTime}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="健康状态"></el-table-column>
        <el-table-column label="告警策略数"></el-table-column>-->
      </el-table>
      <div class="Right-style pagstyle" style="display:flex;justify-content:flex-end;padding:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currpage"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TbaleData.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ALL_CITY, NAT_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      loadShow: true,
      searchOptions: [
        {
          value: "nat-gateway-id",
          label: "ID"
        },
        {
          value: "nat-gateway-name",
          label: "名称"
        }
      ],
      // 列表数据处理
      natStatu: {
        PENDING: "生产中",
        DELETING: "删除中",
        AVAILABLE: "运行中",
        UPDATING: "升级中",
        FAILED: "失败"
      },
      natConnStatu: {
        100: "小型",
        300: "中型",
        1000: "大型"
      },
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
    // 获取表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize,
        Version: "2017-03-12"
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        param["Filters.0.Name"] = this.searchValue;
        param["Filters.0.Values.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      this.axios.post(NAT_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          console.log(data.Response.NatGatewaySet);
          this.TbaleData = data.Response.NatGatewaySet;
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
        name: "NATdetails",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.CM-wrap {
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
.a {
  background-image: url("./../../../assets/CAM/images/cvm-20199061519.svg");
  background-size: 350px 249px;
  background-repeat: no-repeat;
  background-position: -101px -101px;
  height: 25px;
  width: 16px;
  cursor: pointer;
}
</style>
