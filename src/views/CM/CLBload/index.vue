<template>
  <div class="CM-wrap">
    <!-- <Loading :show="loadShow" /> -->
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.clBload.fzjh') }}</div>
    <div class="tool">
      <Cities :cities="cities" class="city" :Cityvalue.sync="selectedRegion" @changeCity="changeCity" />
      <!-- 搜索 -->
      <SEARCH :searchOptions="searchOptions" :searchValue="searchValue" @changeValue="changeValue"
        :searchInput="searchInput" @changeinput="changeinput" @clicksearch="clicksearch" @exportExcel="exportExcel">
      </SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="TbaleData" height="550" style="width: 100%" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop :label="$t('CVM.clBload.zjm') " width="120">
          <template slot-scope="scope">
            <p v-for="(i,index) in scope.row.LoadBalancerVips" :key="index">
              <a @click="jump(scope.row.LoadBalancerId,i,scope.row.LoadBalancerType,scope.row.NumericalVpcId)"
                style="cursor:pointer;">{{scope.row.LoadBalancerId}}</a>
            </p>
            {{ scope.row.LoadBalancerName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')" width="80">
          <template slot-scope="scope">
            <div v-for="(i,index) in scope.row.LoadBalancerVips" :key="index">
              <div class="a"
                @click="jump(scope.row.LoadBalancerId,i,scope.row.LoadBalancerType,scope.row.NumericalVpcId)">
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p v-show="scope.row.Isolation==1" style="color:red">
              隔離中
            </p>
            <p :class="scope.row.Status=='1'?'green':'orange'" v-show="scope.row.Isolation!=1">
              {{instanceStatus[scope.row.Status]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="VIP">
          <template slot-scope="scope">
            <p v-for="(i,index) in scope.row.LoadBalancerVips"  :key="index">{{i}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.wllx')">
          <template slot-scope="scope">{{LoadBalancerType[scope.row.LoadBalancerType]}}</template>
        </el-table-column>

        <el-table-column prop="VpcId" :label="$t('CVM.clBload.sswl')"></el-table-column>
        <el-table-column prop="CreateTime" :label="$t('CVM.clBload.cjsj')"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class='pagtotal'>共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount">
        </el-pagination>
      </div>
    </div>



    <div class="Table-SY" v-show="false">
      <el-table :data="TbaleData" height="550" style="width: 100%" id="exportTable" v-loading="loadShow"
        :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop label="ID" width="120">
          <template slot-scope="scope">
            {{scope.row.LoadBalancerId}}
          </template>
        </el-table-column>
        <el-table-column prop label="主機名" width="120">
          <template slot-scope="scope">
            {{ scope.row.LoadBalancerName}}
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.zt')">
          <template slot-scope="scope">
            <p :class="scope.row.Status=='1'?'green':'orange'">{{instanceStatus[scope.row.Status]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="VIP">
          <template slot-scope="scope">
            <p v-for="(i,index) in scope.row.LoadBalancerVips" :key="index">{{i}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.wllx')">
          <template slot-scope="scope">{{LoadBalancerType[scope.row.LoadBalancerType]}}</template>
        </el-table-column>
        <el-table-column prop="VpcId" :label="$t('CVM.clBload.sswl')"></el-table-column>
        <el-table-column prop="CreateTime" :label="$t('CVM.clBload.cjsj')"></el-table-column>
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
    CLB_LIST
  } from "@/constants";
  export default {
    data() {
      return {
        loadShow: true, //加载是否显示
        searchOptions: [{
          value: "LoadBalancerIds.0",
          label: "實例ID"
        }], //下拉框数据
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
        TotalCount: 0,
        pagesize: 10, // 分页条数
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
            this.$t("CVM.clBload.fzjh") + ".xlsx"
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
      //搜索框的值
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
          Region: localStorage.getItem('regionv2'),
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
            this.TotalCount = data.Response.TotalCount;
            this.loadShow = false;
          } else {
            console.log('sss')
            let ErrTips = {
              'FailedOperation': '操作失敗',
              'InternalError': '必須包含開始時間和結束時間，且必須為整形時間戳（精確到秒）',
              'InvalidParameterValue.MaxResult': '內部錯誤',
              'InvalidParameter': '參數錯誤',
              'InvalidParameter.FormatError': '參數格式錯誤',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.InvalidFilter': 'Filter參數輸入錯誤',
              'InvalidParameterValue.Length': '參數長度錯誤',
              'UnauthorizedOperation': '未授權操作',
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
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
      handleCurrentChange(val) {
        this.currpage = val;
        this.GetTabularData();
      },
      //跳转
      jump(id, vip, Status, VpcId) {
        this.$router.push({
          name: "CLBloaddetails",
          query: {
            id,
            vip,
            Status,
            VpcId
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
