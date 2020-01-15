<template>
  <div class="Cam wrap">
    <HeadCom title="身份提供商" />
    <div class="cam_button" style="margin-top:20px;">
      <el-row class="cam-lt">
        <el-button type="primary" size="small" @click="NewUser">新建提供商</el-button>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="cam-box" style="height:520px;padding:0;margin-bottom:20px;">
      <el-table
        height="450"
        v-loading="loading"
        ref="multipleTable"
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        tooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column prop="name" :label="$t('CAM.strategy.peopleName')" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="description"
          :label="$t('CAM.strategy.peopleType')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('CAM.userList.createTime')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="modifyTime"
          :label="$t('CAM.strategy.lastCreateTime')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <!-- &lt;!&ndash;<template slot-scope="scope">
          <el-button size="mini" type="text" ></el-button>
          <el-button size="mini" type="text" ></el-button>
          </template>&ndash;&gt;-->
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle" style="height:70px;display:flex;align-items:center;">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
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
import HeadCom from "../UserListNew/components/Head";
import { LIST_Providers } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      loading: true,
      TotalCount: 0,
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  mounted() {
    this.init();
  },
  components: {
    HeadCom
  },
  methods: {
    //分页

    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    },
    // 初始化方法。
    init() {
      this.loading = true;
      let params = {
        Version: "2019-01-16"
      };
      this.axios
        .post(LIST_Providers, params)
        .then(data => {
          if (data.Response.Error === undefined) {
            this.tableData = data.Response.SAMLProviderSet;
            this.TotalCount = data.Response.TotalCount;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    NewUser() {
      this.$router.push({ name: "NewIdentityProvider" });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .content {
    padding: 20px;
    .operation {
      margin-bottom: 10px;
    }
    .search {
      overflow: hidden;
      padding: 10px 0;
      .search-left {
        float: left;
        .searchBox {
          display: inline-block;
        }
      }
      .search-right {
        float: right;
        margin-top: 10px;
        :hover {
          cursor: pointer;
        }
        i {
          padding: 0 3px;
        }
      }
    }
    .cam-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
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
  .Right-style {
    display: flex;
    justify-content: flex-end;
  }
  .pagstyle {
    padding: 5px;
    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }
  .abs {
    display: inline-block;
    width: 100px;
    height: 300px;
    line-height: 150px;
    text-align: center;
  }
  .container-left {
    width: 44%;
    display: inline-block;
  }
  .cam_button {
    width: 96%;
    height: 40px;
    margin: 10px auto;
  }
  .cam-lt {
    float: left;
  }
  .head-container {
    float: right;
  }
  .cam_button {
    position: relative;
  }
  .suo {
    position: absolute;
  }
  .cam-box {
    width: 96%;
    padding: 20px;
    background-color: #fff;
    margin: 0 auto;
  }
  .block {
    text-align: right;
    padding-top: 10px;
  }
  .btn-fr {
    float: right;
  }
  .pad {
    padding: 0 20px 0 20px;
  }
  .bor-box {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    //max-width: 1360px;
    margin-left: auto;
  }
  .bor-box p {
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .bor-box .num-item {
    text-indent: -10px;
    padding-left: 18px;
    margin-bottom: 0;
  }
}
</style>
