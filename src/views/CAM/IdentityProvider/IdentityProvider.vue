<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">身份提供者</span>
    </div>
    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary" size="small" @click="NewUser">新建供应商</el-button>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="cam-box">
      <el-table
        height="450"
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;"
      >
        <el-table-column prop="name" label="提供商名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="提供商类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modifyTime" label="最后更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <!-- &lt;!&ndash;<template slot-scope="scope">
          <el-button size="mini" type="text" ></el-button>
          <el-button size="mini" type="text" ></el-button>
          </template>&ndash;&gt;-->
        </el-table-column>
      </el-table>
      <div
        style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
      >
        <div>
          <span style="font-size:12px;color:#888">已选 0 项，共 0 项</span>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage2"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="40"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      loading: true
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化方法。
    init() {
      let params = {
        Action: "ListSAMLProviders",
        Version: "2019-01-16"
      };
      let url = "cam2/ListSAMLProviders";
      this.axios
        .post(url, params)
        .then(data => {
          this.tableData = data.Response.SAMLProviderSet;
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
