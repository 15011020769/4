<template>
    <div class="newdialog">
      <el-dialog
            title="配置指标统计方式"
            :visible.sync="dialogVisible"
            width="40%">
            <div class="content">
                <div class="explain" style="margin-bottom:20px;">
                    <p>
                    请对指标指定统计方法和统计周期
                    </p>
                </div>
                <div class="table">
                    <el-table :data="gridData">
                        <el-table-column property="date" label="指标" width="190"></el-table-column>
                        <el-table-column property="name" label="统计方法" width="130"></el-table-column>
                        <el-table-column property="address" label="统计周期" width="100"></el-table-column>
                        <el-table-column property="address" label="操作"></el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            gridData:[],
        }
    },
    components:{

    },
    props:{
      dialogVisible:{
        default:false,
        type:Boolean
      }
    },
    methods: {
      cancel(){
        this.$emit("cancel")
      },
      save(){
        this.$emit("save")
      }
    }
}
</script>
<style lang="scss" scoped>
    
  .newdialog{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.32);
  }
  .checkbox >>> .el-checkbox{
    display: block;
    margin:0;
  }
  .explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
</style>