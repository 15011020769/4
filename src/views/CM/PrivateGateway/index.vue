<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.zxwg') }}</div>
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
        @exportExcel="exportExcel"
      ></SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table
        :data="ProTableData"
        height="550"
        style="width: 100%"
        id="exportTable"
        v-loading="loadShow"
      >
        <el-table-column prop :label="$t('CVM.cloudDisk.mc')">
          <template slot-scope="scope">
            <p>
              <a
                @click="jump(scope.row.DirectConnectGatewayId)"
                style="cursor:pointer;"
              >{{scope.row.DirectConnectGatewayId}}</a>
            </p>
            {{ scope.row.DirectConnectGatewayName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <div class="a" @click="jump(scope.row.DirectConnectGatewayName)"></div>
            <!-- <a @click="jump(scope.row.InstanceId)"  :style="note">
              <img src="./../../../assets/CAM/images/cvm-20199061519.svg" style="width:160px;height:160px">
            </a>-->
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.sswl')">
          <template slot-scope="scope">
            <p
              :class="scope.row.InstanceState==='RUNNING'?'green':scope.row.InstanceState==='STOPPED'?'red':'orange'"
            >{{scope.row.VpcId}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.cjsj')">
          <template slot-scope="scope">
            <p>{{scope.row.CreateTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.wglc')">
          <template slot-scope="scope">
            <p>{{instanceStatus[scope.row.GatewayType]}}</p>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="projectName" label="所属项目"></el-table-column> -->

        <!-- <el-table-column label="健康状态">
          <template slot-scope="scope">
            <p :class="scope.row.RestrictState==='NORMAL'?'green':scope.row.RestrictState==='EXPIRED'?'red':'orange'">
              {{RestrictState[scope.row.RestrictState]}}</p>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ALL_CITY, DCG_LIST, ALL_PROJECT } from "@/constants";
export default {
  data() {
    return {
      loadShow: true, //加载是否显示
      //搜索下拉框
      searchOptions: [
        {
          value: "direct-connect-gateway-id",
          label: "ID"
        },
        {
          value: "direct-connect-gateway-name",
          label: "網關名稱"
        }
      ],
      //inp输入的值
      searchValue: "",
      //文字过滤
      instanceStatus: {
        NORMAL: "標準型",
        NAT: "NAT型"
      },

      //城市列表
      cities: [],
      selectedRegion: "ap-taipei", // 默认选中城市
      selectedCity: {}, // 切换城市
      search: "", // 搜索
      searchInput: "",
      TbaleData: [], // 表格数据
      ProjectData: [], // 项目列表数据
      ProTableData: [], // 添加完项目列表的表格数据
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
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
    //导出表格
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "專線網關" + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
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
      // console.log(this.searchValue)
    },
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.currpage = 1;
        this.GetTabularData();
      }
    },
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.currpage = 1;
        this.GetTabularData();
      } else if (this.searchInput !== "" || this.searchValue !== "") {
        this.currpage = 1;
        this.GetTabularData();
        this.$message.error("请输入正确搜索信息");
      } else {
        this.$message.error("请输入正确搜索信息");
      }
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      this.loadShow = true;
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
      // 获取表格数据
      this.axios.post(DCG_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.ProTableData = data.Response.DirectConnectGatewaySet;
          this.TotalCount = data.Response.TotalCount;
        } else {
          this.$message.error(data.Response.Error.Message);
          // this.ProTableData = []
        }
        this.loadShow = false;
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
        name: "PrivateGatewaydetails",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
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
