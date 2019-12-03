<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">专线接入-物理专线</div>
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
              <a
                @click="jump(scope.row.DirectConnectId)"
                style="cursor:pointer;"
              >{{scope.row.DirectConnectId}}</a>
            </p>
            {{ scope.row.DirectConnectName}}
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
              :class="scope.row.State==='RUNNING'?'green':scope.row.InstanceState==='STOPPED'?'red':'orange'"
            >{{instanceStatus[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="带宽">
          <template slot-scope="scope">
            <p>{{scope.row.Bandwidth}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="projectName" label="所在地">
          <template slot-scope="scope">
            <p>{{scope.row.Location}}</p>
          </template>
        </el-table-column>

        <el-table-column label="健康状态">
          <template slot-scope="scope">
            <p
              :class="scope.row.RestrictState==='NORMAL'?'green':scope.row.RestrictState==='EXPIRED'?'red':'orange'"
            >{{RestrictState[scope.row.RestrictState]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="告警策略数">
          <template slot-scope="scope">
            <p
              :class="scope.row.RestrictState==='NORMAL'?'green':scope.row.RestrictState==='EXPIRED'?'red':'orange'"
            >{{RestrictState[scope.row.RestrictState]}}</p>
          </template>
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
import Loading from "@/components/public/Loading";
import { ALL_CITY, Physics_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      //加载是否显示
      loadShow: true,
      //下拉框
      searchOptions: [
        {
          value: "DirectConnectId",
          label: "专线ID"
        }
      ],
      searchValue: "",
      //文字过滤
      instanceStatus: {
        PENDING: "申请中",
        REJECTED: "申请驳回",
        TOPAY: "待付款",
        PAID: "已付款",
        ALLOCATED: "建设中",
        AVAILABLE: "已开通",
        DELETING: "删除中",
        DELETED: "待回收",
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
    //inp输入值
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
        Version: "2018-04-10",
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        // param['Filters.0.Name'] = this.searchValue
        param["DirectConnectIds.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(Physics_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.DirectConnectSet;
        } else {
          this.$message.error(data.Response.Error.Message);
        }
        this.ProTableData = this.TbaleData;
        this.loadShow = false;
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
        name: "Physicsdetails",
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
</style>
