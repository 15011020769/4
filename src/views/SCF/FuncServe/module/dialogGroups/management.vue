<template>
  <div class="management">
    <el-dialog
      :visible.sync="manageDialog"
      width="45%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span>命名空间管理</span><i class="el-icon-close" @click="close(2)"></i></div>
      <span style="margin-right: 25px;">所属地域</span>
      <span>北京</span>
      <div>
        <el-table :data="spaceControl" class="box" :header-cell-style='{"font-size":"12px","font-weight" : "bolder","height": "40px"}' :cell-class-name="tableCellClassName">
          <el-table-column prop="funcName" label="命名空间" show-overflow-tooltip min-width="180">
            <template slot-scope="scope">
              <el-input size="mini" v-model='spaceControl[scope.$index].space' :disabled="scope.$index==0" style="width: 150px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="watch" label="描述" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              <el-input size="mini" v-model='spaceControl[scope.$index].desc' :disabled="scope.$index==0" style="width: 150px;"></el-input>
            </template>                  
          </el-table-column>
          <el-table-column prop="id" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, spaceControl)" type="text" size="small" v-if="scope.$index!=0">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-link type="primary" class="linkSpaceFull" @click="linkPush" v-if="this.listNum==5">新增命名空间（共5个命名空间，已满额）</el-link>
          <el-link type="primary" class="linkSpace" @click="linkPush" v-else>新增命名空间({{this.listNum}}/5)</el-link>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="close(1)">提交</el-button>
        <el-button size="mini" @click="close(2)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      spaceControl: [{
        space: '',
        desc: ''
      }],
      listNum: 1
    };
  },
  props: ["manageDialog"],
  computed: {
  },
  methods: {
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 1){
        return 'inputHight'
      }
    },
    deleteRow(index, rows) {
      if(index!==0) {
        rows.splice(index, 1);
      }
      this.listNum--;
    },
    linkPush() {
      if(this.listNum<5) {
        this.listNum++;
        let obj = {
            space: '',
            desc: ''
        };
        this.spaceControl.push(obj);
      }else {

      }
    },
    close(value) {
      this.$emit("magementClose",value);
    }
  },
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
  .linkSpaceFull {
    display: inline-block;
    margin-top: 10px;
    font-size: 12px;
    color: #bbb;
  }
  .linkSpace {
    display: inline-block;
    margin-top: 10px;
    font-size: 12px;
    color: #006eff;
    cursor: pointer;
  }
  .linkSpace:hover {
    border-bottom: 1px solid #006eff;
  }
</style>
<style>
  .inputHight /deep/.el-input.is-disabled .el-input__inner{
    height: 100px!important;     
  }
  .inputHight /deep/.el-input .el-input__inner{
    height: 100px!important;     
  }
</style>
