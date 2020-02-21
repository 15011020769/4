<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">MySQL</div>
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
        <el-table-column prop :label="$t('CVM.cloudDisk.mc')">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.InstanceId)" style="cursor:pointer;">{{scope.row.InstanceId}}</a>
            </p>
            <p>{{ scope.row.InstanceName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <div class="a" @click="jump(scope.row.InstanceId)"></div>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.Status===1?'green':scope.row.Status===5?'red':'orange'">
              {{RestrictState[scope.row.Status]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudMysql.nw')">
          <template slot-scope="scope">
            <p>{{scope.row.Vip}}/{{scope.row.Vport}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.wllx')">
          <template slot-scope="scope">
            <p>{{ $t('CVM.cloudMysql.wl') }}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.cloudMysql.lx')">
          <template slot-scope="scope">
            <p>{{InstanceTypeState[scope.row.InstanceType]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="projectName" :label="$t('CVM.table.x6')">
          <template slot-scope="scope">
            <p>{{scope.row.projectName}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount">1</el-pagination>
      </div>
    </div>

    <div class="Table-SY" v-show="false">
      <el-table :data="ProTableData" height="550" style="width: 100%" id="exportTable" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop label="ID">
          <template slot-scope="scope">
            {{scope.row.InstanceId}}
          </template>
        </el-table-column>

        <el-table-column prop label="名稱">
          <template slot-scope="scope">
            <p>{{ scope.row.InstanceName}}</p>
          </template>
        </el-table-column>


        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.Status===1?'green':scope.row.Status===5?'red':'orange'">
              {{RestrictState[scope.row.Status]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudMysql.nw')">
          <template slot-scope="scope">
            <p>{{scope.row.Vip}}/{{scope.row.Vport}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.wllx')">
          <template slot-scope="scope">
            <p>{{ $t('CVM.cloudMysql.wl') }}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.cloudMysql.lx')">
          <template slot-scope="scope">
            <p>{{InstanceTypeState[scope.row.InstanceType]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="projectName" :label="$t('CVM.table.x6')">
          <template slot-scope="scope">
            <p>{{scope.row.projectName}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import Cities from "@/components/public/CITY";
  import SEARCH from "@/components/public/SEARCH";
  import Loading from "@/components/public/Loading";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_CITY,
    MYSQL_LIST,
    ALL_PROJECT
  } from "@/constants";
  export default {
    data() {
      return {
        loadShow: true, //加载是否显示
        searchOptions: [{
          value: "InstanceIds.0",
          label: "實例 ID"
        }], //下拉框
        searchValue: "", //inp值
        //文字过滤
        TaskStatusStatus: {
          0: "沒有任務",
          1: "升級中",
          2: "數據導入中",
          3: "開放Slave中",
          4: "外網訪問開通中",
          5: "批量操作執行中",
          6: "回檔中",
          7: "外網訪問關閉中",
          8: "密碼修改中",
          9: "實例名修改中",
          10: "重啟中",
          12: "自建遷移中",
          13: "刪除庫表中",
          14: "災備實例創建同步中",
          15: "升級待切換",
          16: "升級切換中",
          17: "升級切換完成"
        },
        RestrictState: {
          0: "創建中",
          1: "運行中",
          4: "隔離中",
          5: "已隔離"
        },
        InstanceTypeState: {
          1: "主實例",
          2: "災備實例",
          3: "只讀實例"
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
            new Blob([wbout], {
              type: "application/octet-stream"
            }),
            "MySQL" + ".xlsx"
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
          localStorage.setItem("regionv1", this.selectedCity.regionCode);
          localStorage.setItem("regionv2", this.selectedRegion);
        });
      },
      // 切换城市
      changeCity(city) {
        this.selectedCity = city;
        localStorage.setItem("regionv1", this.selectedCity.regionCode);
        localStorage.setItem("regionv2", this.selectedCity.Region);
        this.GetTabularData();
      },
      //选择搜索条件
      changeValue(val) {
        this.searchValue = val;
      },
      changeinput(val) {
        this.searchInput = val;
        this.currpage = 1;
        if (this.searchInput === "") {
          this.loadShow = true;
          this.GetTabularData();
        }
      },
      //点击搜索按钮
      clicksearch(val) {
        this.searchInput = val;
        this.currpage = 1;
        if (this.searchInput !== "" && this.searchValue !== "") {
          this.loadShow = true;
          this.GetTabularData();
        } else {
          this.$message.error("請輸入正確搜索信息");
        }
      },
      // 添加项目列表的表格数据
      GetTabularData() {
        const param = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-20",
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
        this.axios
          .post(MYSQL_LIST, param)
          .then(data => {
            if (data.Response.Error == undefined) {
              this.TbaleData = data.Response.Items;
              this.TotalCount = data.Response.TotalCount;
            } else {
              let ErrTips = {
                CdbError: "後端錯誤或者流程錯誤",
                "InternalError.DatabaseAccessError": "資料庫內部錯誤",
                "InternalError.DesError": "系統內部錯誤",
                InvalidParameter: "參數錯誤",
                "InvalidParameter.InstanceNotFound": "實例不存在",
                "OperationDenied.WrongStatus": "後端任務狀態非法"
              };
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[data.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
          .then(() => {
            // 获取项目列表
            this.axios.post(ALL_PROJECT, paramS).then(data => {
              this.ProjectData = data.data;
              for (let i = 0; i < this.TbaleData.length; i++) {
                for (let j = 0; j < this.ProjectData.length; j++) {
                  if (
                    this.TbaleData[i].ProjectId == this.ProjectData[j].projectId
                  ) {
                    this.TbaleData[i].projectName = this.ProjectData[
                      j
                    ].projectName;
                  }
                  if (this.TbaleData[i].ProjectId == 0) {
                    this.TbaleData[i].projectName = "默認項目";
                  }
                }
              }
              this.loadShow = false;
              this.ProTableData = this.TbaleData;
            });
          });
      },
      //分页
      handleCurrentChange(val) {
        this.loadShow = true
        this.currpage = val;
        this.GetTabularData();
      },
      //跳转
      jump(id) {
        this.$router.push({
          name: "CMMysqldetails",
          query: {
            id
          }
        });
      }
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
