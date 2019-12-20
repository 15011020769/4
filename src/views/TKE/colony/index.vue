<template>
  <div class="colony-wrap">
    <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-show="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;" v-show="btnload" icon="el-icon-loading"></el-button>
    </HeadCom>
    <div class="colony-main">
      <div class="colony-fun">
        <el-button type="primary">新建</el-button>
        <!-- 搜索 -->
        <div class="search">
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
      </div>
      <div class="colony-table">
        <el-table
          :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
          style="width: 100%"
          height="450"
          id="exportTable"
          v-loading="loading"
        >
          <el-table-column prop="date" label="ID/名称"></el-table-column>
          <el-table-column prop="name" label="监控"></el-table-column>
          <el-table-column prop="address" label="kubernetes版本"></el-table-column>
          <el-table-column prop="address" label="类型/状态"></el-table-column>
          <el-table-column prop="address" label="节点数"></el-table-column>
          <el-table-column prop="address" label="台富雲标签"></el-table-column>
          <el-table-column prop="address" label="操作"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 30, 40,50,100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "colony",
  data() {
    return {
      loading: true, //表格加载
      btnload: true, //地域按钮加载状态
      region: "", //地区
      tableData: [], //表格数据
      //搜索下拉框
      searchOptions: [
        {
          value: "project-id",
          label: "項目ID"
        },
        {
          value: "instance-id",
          label: "實例ID"
        },
        {
          value: "instance-name",
          label: "實例名稱"
        },
        {
          value: "private-ip-address",
          label: "內網IP"
        },
        {
          value: "public-ip-address ",
          label: "公網IP"
        }
      ],
      search: "", // 搜索
      searchInput: "",
      searchValue: "", //inp输入的值
      //分页
      pagesize: 20, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {
    this._region();
    this.init();
  },
  methods: {
    //获取列表
    init() {
      this.loading = true;
      const params = {
        Region: "ap-taipei",
        Version: "2018-05-25"
      };
      this.axios.post("tke2/DescribeClusters", params).then(res => {
        console.log(res);
        this.loading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    },
    //获取地域
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
        this.btnload = false;
      });
    },
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
          '集群管理' + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //选择搜索条件
    changeValue(val) {
      this.searchValue = val;
    },
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.init();
      }
    },
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.init();
      } else {
        this.$message.error("請輸入正確搜索信息");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.colony-wrap >>> .el-button,
.colony-wrap >>> .el-input__inner {
  height: 30px !important;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.colony-wrap {
  .colony-main {
    padding: 20px;
    box-sizing: border-box;

    .search {
      float: right;
      height: 100%;
    }

    .colony-table {
      background: white;
      margin-top: 10px;
    }
    .page {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>