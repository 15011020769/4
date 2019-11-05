<template>
  <div class="Detail">

    <!-- 标题 -->
    <div class="details-title">
      <router-link class="el-icon-back" to='/Variables' tag='i'></router-link>
      <h2>{{ $route.query.TemplateId }}</h2>
    </div>

    <!-- 搜索 -->
    <div class="tools-div">
      <el-button class="create-btn" type="primary" size="small">修改参数</el-button>
      <el-button class="create-btn" type="default" size="small">另存为模板</el-button>
      <el-button class="create-btn" type="default" size="small">导入参数</el-button>
      <el-button class="create-btn" type="default" size="small">导出参数</el-button>
    </div>

    <!-- 表格 -->
    <div class="Detail-table">
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="参数名">
          <template slot-scope="scope">
            <p>
              <span>{{ scope.row.Name }}&nbsp;</span>
              <el-popover placement="right-start" width="350" trigger="hover" :content="scope.row.Description">
                <i slot="reference" class="iconfont">&#xe72b;</i>
              </el-popover>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="是否重启" prop="NeedReboot">
        </el-table-column>
        <el-table-column label="参数默认值" prop="Default">
        </el-table-column>
        <el-table-column label="参数当前值" prop="CurrentValue">
        </el-table-column>
        <el-table-column label="参数可修改值">
          <template slot-scope="scope">
            <p>
              [{{ scope.row.Min }} - {{ scope.row.Max }}]
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>

export default {
  data() {
    return {
      tableData: [], // 表格列表数据
      tableLoading: false, // 表格加载动画
      detailObj: {  // 查看详情
        detailShow: false,
        detailInfo: {}
      },
    };
  },
  components: {

  },
  mounted() {
    this.getDataList();

  },
  methods: {
    // 获取Detail列表
    getDataList() {
      this.tableLoading = true;
      var params = {
        Region: "ap-guangzhou",
        Version: "2017-03-20",
        TemplateId: String(this.$route.query.TemplateId)
      };
      this.axios
        .post("cdb2/DescribeParamTemplateInfo", params)
        .then(data => {
          this.tableLoading = false;
          this.tableData = data.Response.Items;
        });
    },

    // 删除
    deleteFun(info) {
      this.$confirm(`删除参数模板 ${info.Name}?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          Version: '2017-03-20',
          Region: 'ap-guangzhou',
          TemplateId: info.TemplateId
        }
        this.axios
          .post('cdb2/DeleteParamTemplate', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDataList()
          })
      }).catch(() => {

      })
    }
  },
  filters: {

  }
};
</script>

<style lang="scss" scoped>
.Detail {
  .details-title {
    background: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    & > i {
      font-size: 16px;
      font-weight: 900;
      line-height: 30px;
      width: 26px;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      margin-left: -6px;
      margin-right: 24px;
      vertical-align: middle;
      overflow: hidden;
      color: #006eff;
      cursor: pointer;
    }
    & > h2 {
      font-size: 16px;
      font-weight: 700;
      color: #171d25;
      height: 30px;
      line-height: 30px;
    }
  }

  .tools-div {
    margin: 20px 20px 10px 20px;
    height: 32px;
    .create-btn {
      float: left;
    }
    .search-1 {
      float: right;
    }
  }
  .Detail-table {
    margin: 0 20px 20px 20px;
    background: #fff;
    .iconfont{
      cursor: pointer;
    }
    .color-1 {
      color: #0abf5b;
    }
    .ope-div {
      span:not(:first-child) {
        margin-left: 8px;
      }
      span {
        color: #217cf3;
        cursor: pointer;
      }
    }
  }
  .Detail-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
