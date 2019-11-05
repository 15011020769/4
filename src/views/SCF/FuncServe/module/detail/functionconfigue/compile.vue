<template>
  <div class="compile">
    <el-dialog
      :visible.sync="compiledialog"
      width="40%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>您已经选择1个云资源</span><i class="el-icon-close" @click="close(2)"></i></div>
      <span>新增标签</span>
      <div style="border: 1px solid #eee;border-bottom: none;">
        <el-table :data="tiplist" style="min-height: 200px;">
          <el-table-column label="标签键" min-width="100">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="添加标签键" v-model='tiplist[scope.$index].space'></el-input>
          </template>
          </el-table-column>
          <el-table-column label="标签值" min-width="180">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="" v-model='tiplist[scope.$index].desc'></el-input>
          </template>                  
          </el-table-column>
          <el-table-column label="删除" min-width="40">
          <template slot-scope="scope">
            <span class="delete" @click="deleteItem(scope.$index, tiplist)">删除</span>
          </template>                  
          </el-table-column>
        </el-table>
      </div>
      <span @click="addItem" class="addname">添加</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="close(1)">提交</el-button>
        <el-button size="mini" @click="close(2)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tiplist: [{
        space: '',
        desc: ''
      },{
        space: '',
        desc: ''
      }],
    };
  },
  props: ["compiledialog"],
  computed: {
  },
  methods: {
    close(value) {
      this.$emit("changeClose",value);
    },
    deleteItem(index,rows) {
      rows.splice(index, 1);
    },
    addItem() {
      let data = {
        space: '',
        desc: ''
      }
      this.tiplist.push(data)
    }
  }
};
</script>

<style scoped lang="scss">
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bolder;
  }
  .title-wrap>i {
    font-size: 16px;
    font-weight: 900;
  }
  .el-icon-close {
    padding: 5px;
    color: #9c9c9c;
  }
  .el-icon-close:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  .delete {
    padding: 5px;
    font-size: 12px;
    color: #006eff;
  }
  .delete:hover {
    background: #ddd;
    cursor: pointer;
  }
  .addname {
    display: block;
    margin: 10px;
    color: #006eff;
    font-size: 12px;
    cursor: pointer;
  }
</style>
