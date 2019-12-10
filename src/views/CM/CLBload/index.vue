<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.clBload.fzjh') }}</div>
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
        :data="TbaleData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        height="550"
        style="width: 100%"
      >
        <el-table-column prop :label="$t('CVM.clBload.zjm') " width="120">
          <template slot-scope="scope">
            <p v-for="i in scope.row.LoadBalancerVips">
              <a
                @click="jump(scope.row.LoadBalancerId,i)"
                style="cursor:pointer;"
              >{{scope.row.LoadBalancerId}}</a>
            </p>
            {{ scope.row.LoadBalancerName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')" width="80">
          <template slot-scope="scope">
            <div class="a" @click="jump(scope.row.LoadBalancerId,i)"></div>
            <!-- <i @click="jump(scope.row.LoadBalancerId,i)" style="cursor:pointer;"><i class="el-icon-share"></i></a> -->
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.Status=='1'?'green':'orange'">{{instanceStatus[scope.row.Status]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="VIP">
          <template slot-scope="scope">
            <p v-for="i in scope.row.LoadBalancerVips">{{i}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.wllx')">
          <template slot-scope="scope">{{LoadBalancerType[scope.row.LoadBalancerType]}}</template>
        </el-table-column>

        <el-table-column prop="VpcId" :label="$t('CVM.clBload.sswl')"></el-table-column>
        <el-table-column prop="CreateTime" :label="$t('CVM.clBload.cjsj')"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 30, 40,50,100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
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
import { ALL_CITY, CLB_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      loadShow: true, //加载是否显示
      searchOptions: [
        {
          value: "LoadBalancerIds.0",
          label: "實例ID"
        }
      ], //下拉框数据
      searchValue: "", //下拉框默认选中的值
      instanceStatus: {
        0: "創建中",
        1: "正常"
      }, //文字过滤
      LoadBalancerType: {
        OPEN: "公網",
        INTERNAL: "內網"
      }, //文字过滤
      cities: [], //城市列表
      selectedRegion: "ap-taipei", // 默认选中城市
      selectedCity: {}, // 切换城市
      searchInput: "", //输入框的值
      TbaleData: [], // 表格数据
      pagesize: 20, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  created() {
    this.GetCity(); //获取城市
    this.GetTabularData(); //列表数据
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
    //搜索框的值
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
        this.$message.error("請輸入正確搜索信息");
      }
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
        Version: "2018-03-17",
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
      this.axios.post(CLB_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.LoadBalancerSet;
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
    jump(id, vip) {
      this.$router.push({
        name: "CLBloaddetails",
        query: {
          id,
          vip
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
  background-size: 267px 176px;
  background-repeat: no-repeat;
  background-position: -47px -71px;
  height: 15px;
  width: 16px;
  cursor: pointer;
}
</style>
