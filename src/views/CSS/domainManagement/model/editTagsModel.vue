<template>
  <div>
    <div>
      <el-dialog title="编辑标签" :visible.sync="editModel" width="45%" :before-close="handleClose">
        <div>
          <div class="tableCon">
            <el-table
              :data="tags.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              style="width: 100%;margin: 18px 0 20px;"
            >
              <el-table-column prop="Key" label="标签键">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Key"
                    autocomplete="off"
                    class="inputKey"
                    placeholder="请输入标签键"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Value" label="标签值">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Value"
                    autocomplete="off"
                    class="inputKey"
                    placeholder="请输入标签值"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="operate" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tags)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="tabListPage">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalItems"
            ></el-pagination>
          </div>
          <a v-on:click="addRow(tags)">添加</a>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editTagsSure">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: Boolean
  },
  data() {
    return {
      dialogModel: "", //弹框
      tags: [
        {
          Key: "123",
          Value: "123"
        },
        {
          Key: "123",
          Value: "123"
        }
      ], //表格绑定数据
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      flag: false,
      tableDataEnd: []
    };
  },
  computed: {
    editModel() {
      this.dialogModel = this.isShow;
      return this.isShow;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      // this.$axios.get("/src/assets/demo.json", {}).then(res => {
        // console.log(res.data.tableData);
        // this.tags = res.data.tableData;
        // this.allData = this.tableDataBegin;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tags.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tags[index]);
          }
        } else {
          this.tableDataEnd = this.tags;
        }
      // });
    },
    //关闭弹框按钮
    handleClose() {
      this.dialogModel = false;
      this.$emit("closeEditTagsModel", this.dialogModel);
    },
    //确定按钮
    editTagsSure() {
      this.dialogModel = false;
      this.$emit("closeEditTagsModel", this.dialogModel);
    },
    // 生产一个新的obj对象
    copyObj: function() {
      var des = {
        Key: "",
        Value: ""
      };
      return des;
    },
    addRow(tagsN,event){
				//新增一行
      tagsN.push({
        Key: "",
        Value: ""
      })
      this.tags=tagsN;
      },
    // 删除一行
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.totalItems-=1;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  clear: both;
  display: block;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  color: #000;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.tabListPage {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  text-align: right;
  padding-top: 8px;
}
.tableCon {
  height: 450px;
  border: 1px solid #ddd;
  overflow-y: auto;
  background-color: #fff;
  ::v-deep input {
    width: 180px;
    height: 30px;
    border-radius: 0;
  }
  ::v-deep table {
    margin-bottom: 0;
  }
}
</style>