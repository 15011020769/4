<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">{{ $t('CVM.dxcc') }}</div>
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
        id="exportTable"
        style="width: 100%"
      >
        <el-table-column prop :label="$t('CVM.objectStorage.bkmc')">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.Name)" style="cursor:pointer;">{{scope.row.Name}}</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.clBload.jk')">
          <template slot-scope="scope">
            <!-- <i @click="jump(scope.row.Name)" style="cursor:pointer;"><i class="el-icon-share"></i></a> -->
            <div class="a" @click="jump(scope.row.Name)"></div>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CVM.objectStorage.dy')">
          <template slot-scope="scope">
            <p>{{scope.row.zone.zone}}</p>
          </template>
        </el-table-column>

        <el-table-column prop :label="$t('CVM.clBload.cjsj')">
          <template slot-scope="scope">
            <p>{{scope.row.CreationDate}}</p>
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
import FileSaver from "file-saver";
import XLSX from "xlsx";
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ALL_CITY, OBJ_LIST, CVM_PROJECT } from "@/constants";
export default {
  data() {
    return {
      //加载是否显示
      loadShow: true,
      //搜索下拉框
      searchOptions: [
        {
          value: "bucket",
          label: "存储桶名称"
        }
      ],
      //默认
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
      cities: [],
      selectedRegion: "ap-taipei", // 默认选中城市
      selectedCity: {}, // 切换城市
      search: "", // 搜索
      searchInput: "",
      TbaleData: [],
      TbaleData2: [], // 表格数据
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
          "對象存儲" + ".xlsx"
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
    //inp输入内容
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
      this.loadShow = true;
      const param = {
        Version: "2017-03-12"
      };
      // 获取表格数据
      this.axios.post(OBJ_LIST, param).then(data => {
        var self = this;
        if (this.searchValue !== "" && this.searchInput !== "") {
          self.TbaleData2.splice(0, self.TbaleData2.length);
          data.Buckets.Bucket.forEach(function(elem, index) {
            if (elem.Name.indexOf(self.searchInput) >= 0) {
              self.TbaleData2.push(elem);
              self.TbaleData = self.TbaleData2;
            } else {
              return 0;
            }
          });
        } else {
          this.TbaleData = data.Buckets.Bucket;
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
        name: "CMobjdetails",
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
