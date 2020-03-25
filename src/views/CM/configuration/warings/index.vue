<template>
    <div class="newdialog">
      <el-dialog
            title="配置警告規則"
            :visible.sync="dialogVisibles"
            width="40%">
            <div class="content">
                <div class="explain" style="margin-bottom:20px;">
                    <p>
                    您可到 <a href=""> 用戶和權限</a>   修改組成員
                    </p>
                </div>
                <div class="table">
                    <p>
                        <span style="font-white:600">告警觸發條件</span>
                        <span>滿足任壹條件即可觸發告警</span>
                    </p>
                     <div class="plan" style="margin-bottom:20px;">
                        <p>
                            妳還未添加告警觸發條件
                        </p>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dele">取 消</el-button>
                <el-button type="primary" @click="yes">確 定</el-button>
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
      dialogVisibles:{
        default:false,
        type:Boolean
      }
    },
    methods: {
      dele(){
        this.$emit("dele")
      },
      yes(){
        this.$emit("yes")
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
  .table{
      p{
          display:flex;
          justify-content: space-between;
          span:first-child{
              font-weight: 600;
          }
          span:last-child{
              font-size: 13px;
          }
      }
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
.plan {
    padding: 10px 30px 10px 20px;
    vertical-align: -webkit-baseline-middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    text-align: center;
    p {
        font-size: 11px;
        line-height: 18px;
        text-align: center;
    }
   }
   .plan:hover{
        cursor: pointer;
        background: #e5f0ff;
   }
</style>
