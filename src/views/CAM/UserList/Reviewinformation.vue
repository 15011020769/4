<template>
  <div>
    <div class="tea-alert">
      <div class="tea-alert__info">请检查您的设置信息，访问管理将按照如下信息为您创建用户。</div>
    </div>
    <div>
      <h3 class="user-title">用户信息</h3>
      <el-table :data="tableData" style="width: 100%;  border:1px solid #ddd;padding-top: 8px;">
        <el-table-column label="用户名" width>
          <template slot-scope="scope">
            <span>{{ scope.row.user }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width>
          <template slot-scope="scope">
            <span>{{ scope.row.iphone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width>
          <template slot-scope="scope">
            <span>{{ scope.row.mailbox }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width>
          <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width>
          <template slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <h3 class="visit">访问信息</h3>
      <div class="user-modular">
        <label for>
          访问方式
          <i>*</i>
        </label>
        <span>编程访问，控制台访问</span>
      </div>
      <div class="user-modular">
        <label for>控制台密码类型</label>
        <span>自动生成密码</span>
      </div>
      <div class="user-modular">
        <label for>需要重置密码</label>
        <span>是</span>
      </div>
    </div>
    <div>
      <h3 class="user-title">权限信息</h3>
      <el-table :data="tableData" style="width: 100%;  border:1px solid #ddd;padding-top: 8px;">
        <el-table-column label="策略名" width>
          <template slot-scope="scope">
            <span>{{ scope.row.strategy }}</span>x
          </template>
        </el-table-column>
        <el-table-column label="策略描述" width>
          <template slot-scope="scope">
            <span>{{ scope.row.describe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width>
          <template slot-scope="scope">
            <span>{{ scope.row.edit }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="40">
        </el-pagination>
      </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [
        {
          // 用户信息
          user: "123123",
          iphone: "+86 1211212121212",
          mailbox: "2016-05-02",
          remarks: "王小虎",
          operation: "上海市普陀区金沙江路 1518 弄",
          //权限信息
          strategy: "",
          describe: "",
          edit: ""
        }
      ]
    };
  },

  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style lang="scss" scoped>
.tea-alert {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.tea-alert,
.tea-alert__info {
  font-size: 12px;
  line-height: inherit;
}
.user-title {
  margin: 10px 0 10px 0;
  font-weight: 600;
}
.user-modular {
  margin-bottom: 20px;
}
.user-modular label {
  width: 100px;
  display: inline-block;
  color: #888;
}
.user-modular i {
  color: red;
}
.visit {
  margin: 20px 0 20px 0;
  font-weight: 600;
}
.block{
    text-align: right;
    margin-top: 10px;
}
</style>
