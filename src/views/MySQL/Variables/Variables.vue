<template>
  <div class="Variables">

    <!-- 标题 -->
    <div class="Title">
      <div>
        <div class="Variables-tit">
          <h2>参数模板</h2>
        </div>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="tools-div">
      <el-button class="create-btn" type="primary" size="small">创建模板</el-button>
    </div>

    <!-- 表格 -->
    <div class="Variables-table">
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="模板名称" prop="Name">
        </el-table-column>
        <el-table-column label="DB版本" prop="">
          <template slot-scope="scope">
            <p>MySQL{{ scope.row.EngineVersion }}</p>
          </template>
        </el-table-column>
        <el-table-column label="模板描述" prop="Description">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="ope-div">
              <span @click="$router.push({name: 'VariablesDetail', query: {TemplateId: scope.row.TemplateId}})">查看修改</span>
              <span @click="deleteFun(scope.row)">删除</span>
              <span>导出</span>
            </div>
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
    // 获取Variables列表
    getDataList() {
      this.tableLoading = true;
      var params = {
        Region: "ap-guangzhou",
        Version: "2017-03-20"
      };
      this.axios
        .post("cdb2/DescribeParamTemplates", params)
        .then(data => {
          this.tableLoading = false;
          this.tableData = data.Response.Items;
        });
    },

     // 删除
    deleteFun (info) {
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
.Variables {
  .Variables-tit {
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
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
  .Variables-table {
    margin: 0 20px 20px 20px;
    background: #fff;

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
  .Variables-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
