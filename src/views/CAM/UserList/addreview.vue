<template>
  <div>
    <div class="add-top">
      <hr />
      <el-table :data="tableData" style="width: 100%;border:1px solid #ddd">
        <el-table-column label="组名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <hr />
    </div>
  </div>
</template>
<script>
import addreview from "./addreview";
export default {
  components: {
    addreview
  },
  data() {
    return {
      tableData: [
        { 
          name: "王小虎",
        },
      ]
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
<style lang="scss">
</style>