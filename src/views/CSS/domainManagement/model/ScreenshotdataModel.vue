<template>
  <div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="isShow"
        width="30%"
        :before-close="handleClose">
        <div class="newClear">
          <p class="tip">模板选择（如需添加新模板，请前往<a>【 功能模板】<i class="el-icon-share"></i></a>中进行设置）</p>
          <div class="tableCon">
            <el-table
              :data="ScreenshotData"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="name" label="模板名称"></el-table-column>
              <el-table-column prop="id" label="模板ID"></el-table-column>
              <el-table-column prop="dateTime" label="截图间隔(秒)"></el-table-column>
              <el-table-column prop="selec" label="智能鉴黄"></el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveScreenEdit">保存</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:{
      required:false,
      type:Boolean
    }
  },
  data(){
    return{
      ScreenshotData:[
        {
          name:'123',
          id:'123',
          dateTime:'123',
          selec:'123'
        },
        {
          name:'123',
          id:'123',
          dateTime:'123',
          selec:'123'
        }
      ],//表格
    }
  },
  methods:{
    //checkbox
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {

      }
    },
    //关闭弹框
    handleClose(){
      this.$emit("closeScreenshotModel",false)
    },
    //保存
    saveScreenEdit(){
      this.$emit("closeScreenshotModel",false)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__header{
  font-size:14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
.tip{
  font-size: 12px;
}
.tableCon{
  width:100%;
  border:1px solid #ddd;
}
::v-deep thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
</style>