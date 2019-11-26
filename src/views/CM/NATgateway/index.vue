<template>
  <div>
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
              <a @click="jump(scope.row.natId)" style="cursor:pointer;">{{scope.row.natId}}</a>
            </p>
            <p>{{scope.row.natName}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="监控">
          <template slot-scope="scope">
            <i class="el-icon-share"></i>
          </template>
        </el-table-column>

        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <p style="color: #06c290">{{natStatu[scope.row.state]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="私有网络">
          <template slot-scope="scope">
            <a href>{{scope.row.unVpcId}}</a>
            <p>{{scope.row.vpcName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="类型">
          <template slot-scope="scope">
            <p v-show="scope.row.maxConcurrent/10000 == 100" style="font-size: 12px;">小型</p>
            <p v-show="scope.row.maxConcurrent/10000 == 300" style="font-size: 12px;">中型</p>
            <p v-show="scope.row.maxConcurrent/10000 == 1000" style="font-size: 12px;">大型</p>
            <p style="font-size: 12px;">最大并发连接数{{scope.row.maxConcurrent/10000}}万</p>
          </template>
        </el-table-column>
        <el-table-column label="健康状态"></el-table-column>
        <el-table-column label="告警策略数"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
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
import { ALL_CITY, NAT_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      searchOptions: [
        {
          value: "natId",
          label: "ID"
        },
        {
          value: "natName",
          label: "名称"
        }
      ],
      // 列表数据处理
      natStatu: {
        0: "运行中",
        1: "不可用",
        2: "欠费停服"
      },
      natConnStatu: {
        100: "小型",
        300: "中型",
        1000: "大型"
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
    // 获取表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        param[this.searchValue] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      this.axios
        .post(NAT_LIST, param)
        .then(data => {
          this.TbaleData = data.data;
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
