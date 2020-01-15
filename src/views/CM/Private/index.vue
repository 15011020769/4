<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.zxtd') }}</div>
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
        :data="ProTableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        height="550"
        style="width: 100%"
        id="exportTable"
        v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')"
      >
        <el-table-column prop :label="$t('CVM.Physics.tdmc') ">
          <template slot-scope="scope">
            <p>
              <a
                @click="jump(scope.row.DirectConnectTunnelId)"
                style="cursor:pointer;"
              >{{scope.row.DirectConnectTunnelId}}</a>
            </p>
            {{ scope.row.DirectConnectTunnelName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <div class="a" @click="jump(scope.row.DirectConnectTunnelId)"></div>
            <!-- <i @click="jump(scope.row.DirectConnectTunnelId)" style="cursor:pointer;"><i class="el-icon-share"></i></a> -->
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p
              :class="scope.row.State==='RUNNING'?'green':scope.row.InstanceState==='STOPPED'?'red':'orange'"
            >{{instanceStatus[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.sywl')">
          <template slot-scope="scope">
            <p>{{scope.row.VpcId}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.cjsj')">
          <template slot-scope="scope">
            <p>{{scope.row.CreatedTime}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="健康状态">
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
        >1</el-pagination>
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
import { ALL_CITY, Private_LIST, ALL_PROJECT } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      //加载是否显示
      loadShow: true,
      //搜索下拉框
      searchOptions: [
        {
          value: "DirectConnectIds",
          label: "通道ID"
        }
      ],
      searchValue: "", //inp值
      //文字过滤
      instanceStatus: {
        AVAILABLE: "就緒或者已連接",
        PENDING: "申請中",
        ALLOCATING: "配置中",
        ALLOCATED: "配置完成",
        ALTERING: "修改中",
        DELETING: "刪除中",
        DELETED: "刪除完成",
        COMFIRMING: "待接受",
        REJECTED: "拒絕"
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
      TotalCount: 0,
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
          "專線通道" + ".xlsx"
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
    //输入框输入内容
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.GetTabularData();
        this.currpage = 1;
      }
    },
    //点击搜索按钮
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.GetTabularData();
        this.currpage = 1;
      } else {
        this.$message.error("請輸入正確搜索信息");
      }
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      this.loadShow = true;
      const param = {
        Region: this.selectedRegion,
        Version: "2018-04-10",
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        param["Filters.0.Name"] = "direct-connect-tunnel-id";
        param["Filters.0.Values.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(Private_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.DirectConnectTunnelSet;
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            ResourceNotFound: "资源不存在",
            "ResourceNotFound.DirectConnectTunnelIdIsNotExist": "专用通道不存在"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.ProTableData = this.TbaleData;
        this.loadShow = false;
      });
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
        param["Filters.0.Name"] = "direct-connect-tunnel-id";
        param["Filters.0.Values.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios.post(Private_LIST, param).then(data => {
        console.log();
        if (data.Response.Error == undefined) {
          console.log(data.Response.DirectConnectTunnelSet);
          this.TbaleData = data.Response.DirectConnectTunnelSet;
          this.TotalCount = data.Response.DirectConnectTunnelSet.length;
        } else {
          this.$message.error(data.Response.Error.Message);
        }
        this.ProTableData = this.TbaleData;
        this.loadShow = false;
      });
    },

    handleCurrentChange(val) {
      this.currpage = val;
      this.GetTabularData();
    },
    jump(id) {
      this.$router.push({
        name: "Privatedetails",
        query: {
          id
        }
      });
    }
  },
  //分页

  handleCurrentChange(val) {
    this.currpage = val;
    this.GetTabularData();
  },
  //跳转
  jump(id) {
    this.$router.push({
      name: "Privatedetails",
      query: {
        id
      }
    });
  }
};
</script>

<style scoped lang="scss">
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
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
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
