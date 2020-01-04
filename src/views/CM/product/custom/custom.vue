<template>
    <div class="newdialog">
      <div>
         <el-dialog
            title="自定义列表字段"
            :visible.sync="dialogVisible"
            width="40%">
            <div class="content">
              <div class="explain" style="margin-bottom:20px;">
                <p>
                  请选择您想显示的列表详细信息，最多勾选10个字段，已勾选10个
                </p>
              </div>
              <div class="checkbox">
                <el-checkbox-group v-model="checkedlist">
                <el-checkbox v-for="option in cities" :label="option" :key="option">
                  {{option}}
                </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  const options = ['事件', '类型', '产品类型', '地域',"影响对象","对象详情","状态","开始时间","更新时间","告警配置"];
  export default {
    data() {
      return {
        checkedlist: [  '类型', '产品类型', '地域',"影响对象","对象详情","状态","开始时间","更新时间","告警配置"],
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