<template>
    <div class="newdialog">
         <el-dialog
            title="自定義清單字段"
            :visible.sync="dialogVisible"
            width="40%">
            <div class="content">
              <div class="explain" style="margin-bottom:20px;">
                <p>
                  請選擇您想顯示的清單詳細訊息，最多勾選7個字段，已勾選7個
                </p>
              </div>
              <div class="checkbox">
                <el-checkbox-group v-model="checkedlist" disabled="事件">
                  <el-checkbox v-for="option in cities" :label="option" :key="option">
                    {{option}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">確 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  const options = ['事件', '地域',"狀態","影響物件","開始時間","更新時間","事件類型"];
  export default {
    data() {
      return {
        checkedlist: [ '事件', '地域',"狀態","影響物件","開始時間","更新時間","事件類型"],
        cities: options,
      };
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
  };
</script>
<style lang="scss" scoped>

  .newdialog{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.32);
    // position: fixed;
    right:0;
    bottom:0;
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
