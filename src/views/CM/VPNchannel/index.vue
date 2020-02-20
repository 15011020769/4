<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.td') }}</div>
    <div class="tool">
      <Cities :cities="cities" class="city" :Cityvalue.sync="selectedRegion" @changeCity="changeCity" />
      <!-- 搜索 -->
      <SEARCH :searchOptions="searchOptions" :searchValue="searchValue" @changeValue="changeValue"
        :searchInput="searchInput" @changeinput="changeinput" @clicksearch="clicksearch" @exportExcel="exportExcel">
      </SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="ProTableData" height="550" style="width: 100%" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop :label="$t('CVM.clBload.zjm') ">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.VpnConnectionId)" style="cursor:pointer;">{{scope.row.VpnConnectionId}}</a>
            </p>
            {{ scope.row.VpnConnectionName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <div class="a" @click="jump(scope.row.VpnConnectionId)"></div>
            <!-- <a
                @click="jump(scope.row.VpnConnectionId)"
                style="cursor:pointer;"
            ><i class="el-icon-share"></i></a>-->
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.State == 'PENDING' ? 'orange' : scope.row.State == 'AVAILABLE' ? 'green' : 'red'">
              {{vpcConnState[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.sswl')">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpcId}}</p>
            <p>{{scope.row.VpcName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.vpnwg')">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpnGatewayId}}</p>
            <p>{{scope.row.vpnGwName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.ddwg')	">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.CustomerGatewayId}}</p>
            <p>{{scope.row.userGwName}}</p>
          </template>
        </el-table-column>

      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount"></el-pagination>
      </div>
    </div>





    <div class="Table-SY">
      <el-table :data="ProTableData" height="550" id="exportTable" style="width: 100%" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop label="ID">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.VpnConnectionId)" style="cursor:pointer;">{{scope.row.VpnConnectionId}}</a>
            </p>

          </template>
        </el-table-column>

        <el-table-column prop label="名稱">
          <template slot-scope="scope">

            {{ scope.row.VpnConnectionName}}
          </template>
        </el-table-column>





        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.State == 'PENDING' ? 'orange' : scope.row.State == 'AVAILABLE' ? 'green' : 'red'">
              {{vpcConnState[scope.row.State]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.sswl')">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpcId}}</p>
            <p>{{scope.row.VpcName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.vpnwg')">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.VpnGatewayId}}</p>
            <p>{{scope.row.vpnGwName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.ddwg')	">
          <template slot-scope="scope">
            <p style="color: #65a5f9;">{{scope.row.CustomerGatewayId}}</p>
            <p>{{scope.row.userGwName}}</p>
          </template>
        </el-table-column>

      </el-table>
    </div>




  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import Cities from "@/components/public/CITY";
  import SEARCH from "@/components/public/SEARCH";
  import Loading from "@/components/public/Loading";
  import {
    ALL_CITY,
    VPNTD_LIST,
    ALL_PROJECT
  } from "@/constants";
  export default {
    data() {
      return {
        loadShow: true, //加载是否显示
        //下拉框
        searchOptions: [{
            value: "vpn-connection-id",
            label: "ID"
          },
          {
            value: "vpn-connection-name",
            label: "名稱"
          }
        ],
        searchValue: "",
        //文字过滤
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
        vpcConnState: {
          PENDING: "生產中",
          AVAILABLE: "運行中",
          DELETING: "刪除中"
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
            new Blob([wbout], {
              type: "application/octet-stream"
            }),
            "VPN通道" + ".xlsx"
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
      //输入框输入值
      changeinput(val) {
        this.searchInput = val;
        if (this.searchInput === "") {
          this.currpage = 1;
          this.GetTabularData();
        }
      },
      //点击搜索按钮
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
        this.axios.post(VPNTD_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.TbaleData = data.Response.VpnConnectionSet;
            this.ProTableData = this.TbaleData;
            this.TotalCount = data.Response.TotalCount;
            this.loadShow = false;
          } else {
            let ErrTips = {
              "InvalidParameter.Coexist": "參數不支持同時指定",
              "InvalidParameterValue.Malformed": "入參格式不合法",
              ResourceNotFound: "資源不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //分页
      handleSizeChange(val) {
        this.loadShow = true
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
