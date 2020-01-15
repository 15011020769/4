<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.vpnwg') }}</div>
    <div class="CM-box">
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
          id="exportTable"
          style="width: 100%;"
          v-loading="loadShow"
          :empty-text="$t('CVM.clBload.zwsj')"
        >
          <el-table-column prop :label="$t('CVM.clBload.zjm') ">
            <template slot-scope="scope">
              <p>
                <a
                  @click="jump(scope.row.VpnGatewayId)"
                  style="cursor:pointer;"
                >{{scope.row.VpnGatewayId}}</a>
              </p>
              {{ scope.row.VpnGatewayName}}
            </template>
          </el-table-column>
          <el-table-column prop :label="$t('CVM.clBload.jk')">
            <template slot-scope="scope">
              <div class="a" @click="jump(scope.row.VpnGatewayId)"></div>
              <!-- <a @click="jump(scope.row.VpnGatewayId)" style="cursor:pointer;">
                <i class="el-icon-share"></i>
              </a>-->
            </template>
          </el-table-column>
          <el-table-column prop :label="$t('CVM.clBload.zt')">
            <template slot-scope="scope">
              <p
                :class="scope.row.State == 'PENDING' ? 'orange' : scope.row.State == 'AVAILABLE' ? 'green' : 'red'"
              >{{vpcConnState[scope.row.State]}}</p>
            </template>
          </el-table-column>

          <el-table-column prop :label="$t('CVM.clBload.sswl')">
            <template slot-scope="scope">
              <p style="color: #65a5f9;">{{scope.row.VpcId}}</p>
              <p>{{ scope.row.vpnGwName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop :label="$t('CVM.clBload.cjsj')">
            <template slot-scope="scope">
              <p>{{scope.row.CreatedTime}}</p>
            </template>
          </el-table-column>
          <!-- 
          <el-table-column label="健康状态"></el-table-column>
          <el-table-column prop label="告警策略数"></el-table-column>-->
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
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ALL_CITY, VPN_LIST, ALL_PROJECT } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      loadShow: true, //加载是否显示
      //下拉框
      searchOptions: [
        {
          value: "vpn-gateway-id",
          label: "ID"
        },
        {
          value: "vpn-gateway-name",
          label: "名称"
        }
      ],
      //文字过滤
      vpcConnState: {
        PENDING: "生產中",
        AVAILABLE: "運行中",
        DELETING: "刪除中"
      },
      searchValue: "",
      instanceStatus: {
        PENDING: "創建中",
        LAUNCH_FAILED: "創建失敗",
        RUNNING: "運行中",
        STOPPED: "已關機",
        STARTING: "開機中",
        STOPPING: "關機中",
        REBOOTING: "重啟中",
        SHUTDOWN: "待回收",
        TERMINATING: "銷毀中"
      },
      RestrictState: {
        NORMAL: "健康",
        EXPIRED: "過期",
        PROTECTIVELY_ISOLATED: "隔離"
      },
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
          "VPN網關" + ".xlsx"
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
    },
    //inp输入值
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.currpage = 1;
        this.GetTabularData();
      }
    },
    //点击搜索
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.currpage = 1;
        this.GetTabularData();
      } else {
        this.$message.error("請輸入正確搜索信息");
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
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(VPN_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.VpnGatewaySet;
          this.ProTableData = this.TbaleData;
          this.TotalCount = data.Response.TotalCount;
          this.loadShow = false;
        } else {
          let ErrTips = {
            "InvalidVpnGatewayId.Malformed": "无效的VPN网关,VPN实例ID不合法",
            "InvalidVpnGatewayId.NotFound":
              "无效的VPN网关,VPN实例不存在，请再次核实您输入的资源信息是否正确"
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
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.tooltip {
  float: left;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-left: -340px;
  margin-top: -4px;
  cursor: pointer;
}
.CM-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
