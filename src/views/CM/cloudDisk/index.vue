<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.cloudDisk.yyp') }}</div>
    <div class="tool">
      <Cities :cities="cities" class="city" :Cityvalue.sync="selectedRegion" @changeCity="changeCity" />

      <!-- 搜索 -->
      <SEARCH :searchOptions="searchOptions" :searchValue="searchValue" @changeValue="changeValue"
        :searchInput="searchInput" @changeinput="changeinput" @clicksearch="clicksearch" @exportExcel="exportExcel">
      </SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="TbaleData1" height="550" style="width: 100%" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop :label="$t('CVM.cloudDisk.mc')">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.DiskId)" style="cursor:pointer;">{{scope.row.DiskId}}</a>
            </p>
            {{ scope.row.DiskName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <!-- <i @click="jump(scope.row.DiskId)" style="cursor:pointer;"><i class="el-icon-share"></i></a> -->
            <div class="a" @click="jump(scope.row.DiskId)"></div>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudDisk.dx')">
          <template slot-scope="scope">{{scope.row.DiskSize}}</template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.cloudDisk.yplx')">
          <template slot-scope="scope">
            <p>{{DiskType[scope.row.DiskType]}}</p>
            <p>{{DiskUsage[scope.row.DiskUsage]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudDisk.glyzj')">
          <template slot-scope="scope">
            <p>{{scope.row.InstanceId}}</p>
            <p>{{scope.row.InstanceName}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class='pagtotal'>共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount">
        </el-pagination>
      </div>
    </div>



    <div class="Table-SY" v-show="false">
      <el-table :data="TbaleData1" height="550" style="width: 100%" id="exportTable" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop label="ID">
          <template slot-scope="scope">
            {{scope.row.DiskId}}
          </template>
        </el-table-column>
        <el-table-column prop label="名稱">
          <template slot-scope="scope">
            {{ scope.row.DiskName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudDisk.dx')">
          <template slot-scope="scope">{{scope.row.DiskSize}}</template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.cloudDisk.yplx')">
          <template slot-scope="scope">
            <p>{{DiskType[scope.row.DiskType]}}</p>
            <p>{{DiskUsage[scope.row.DiskUsage]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="ID">
          <template slot-scope="scope">
            <p>
              {{scope.row.InstanceId}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop label="主機名">
          <template slot-scope="scope">
            {{ scope.row.InstanceName}}
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
  } from '@/components/ErrorTips'
  import {
    ALL_CITY,
    DISK_LIST,
    CVM_LIST,
    ALL_PROJECT
  } from "@/constants";
  export default {
    data() {
      return {
        loadShow: true,
        searchOptions: [{
            value: "disk-id",
            label: "雲硬碟ID"
          },
          {
            value: "disk-name",
            label: "雲盤名稱"
          }
        ],
        searchValue: "",
        DiskUsage: {
          SYSTEM_DISK: "系統盤",
          DATA_DISK: "數據盤"
        },
        cities: [],
        selectedRegion: "ap-taipei", // 默认选中城市
        selectedCity: {}, // 切换城市
        DiskType: {
          CLOUD_BASIC: "普通雲硬碟",
          CLOUD_PREMIUM: "高效能雲硬碟",
          CLOUD_SSD: "SSD雲硬碟"
        },
        searchInput: "",
        TbaleData: [], // 表格数据
        TbaleData1: [],
        TotalCount: 0,
        pagesize: 10, // 分页条数
        currpage: 1, // 当前页码
        VpcList: [] //vpc列表
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
            this.$t("CVM.cloudDisk.yyp") + ".xlsx"
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
      //inp发生变化
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
          this.$message({
            message: "請輸入正確搜索訊息",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      },
      // 添加项目列表的表格数据
      GetTabularData() {
        const param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2017-03-12",
          Offset: this.currpage * this.pagesize - this.pagesize,
          Limit: this.pagesize
        };
        if (this.searchValue !== "" && this.searchInput !== "") {
          param["Filters.0.Name"] = this.searchValue;
          param["Filters.0.Values.0"] = this.searchInput;
        }
        // 获取表格数据
        this.axios.post(DISK_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.TbaleData = data.Response.DiskSet;
            this.TotalCount = data.Response.TotalCount

          } else {
            let ErrTips = {
              'InvalidFilter': '指定的Filter不被支持',
              'InvalidParameterValue': '無效參數值。參數值格式錯誤或者參數值不被支持等',
              'MissingParameter': '參數缺失。請求沒有帶必選參數'
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }).then(() => {
          this.Getvpc()
        })
      },

      // 添加项目列表的表格数据
      Getvpc() {
        const param = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        // 获取表格数据
        this.axios
          .post(CVM_LIST, param)
          .then(data => {
            if (data.Response.Error == undefined) {
              this.VpcList = data.Response.InstanceSet
              this.TbaleData.forEach(item => {
                this.VpcList.forEach(element => {
                  if (item.InstanceId === element.InstanceId) {
                    item.InstanceName = element.InstanceName
                  }
                });
              });
              this.loadShow = false;
              this.TbaleData1 = this.TbaleData
            } else {
              let ErrTips = {
                'InternalServerError': '操作內部錯誤',
                'InvalidFilter': '無效的過濾器',
                'InvalidFilterValue.LimitExceeded': 'Filter參數值數量超過限制',
                'InvalidHostId.Malformed': '無效CDH ID。指定的CDH ID格式錯誤。例如ID長度錯誤host-1122',
                'InvalidInstanceId.Malformed': '無效實例ID。指定的實例ID格式錯誤。例如實例ID長度錯誤ins-1122',
                'InvalidParameter': '無效參數。參數不合要求或者參數不被支持等',
                'InvalidParameterValue': '無效參數值。參數值格式錯誤或者參數值不被支持等',
                'InvalidParameterValue.LimitExceeded': '參數值數量超過限制',
                'InvalidZone.MismatchRegion': '指定的zone不存在',
              }
              let ErrOr = Object.assign(ErrorTips, ErrTips)
              this.$message({
                message: ErrOr[data.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
      },
      //分页
      handleCurrentChange(val) {
        this.loadShow = true;
        this.currpage = val;
        this.GetTabularData();
      },
      jump(id) {
        this.$router.push({
          name: "Diskdetails",
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
