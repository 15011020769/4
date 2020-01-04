<template>
  <div class="wrap">
    <el-dialog
      title="自定义列表字段"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <div class="dialog">
        <div class="explain">
          <p>所购短信配额没有使用限时，用完为止</p>
        </div>
        <div class="dialog-main">
          <el-checkbox-group v-model="checkList">
            <p>
              <el-checkbox label="策略名称"></el-checkbox>
              <el-checkbox label="触发条件"></el-checkbox>
              <el-checkbox label="所属项目"></el-checkbox>
              <el-checkbox label="策略类型" disabled></el-checkbox>
              <el-checkbox label="已启用/实例数" disabled></el-checkbox>
              <el-checkbox label="最后修改"></el-checkbox>
              <el-checkbox label="告警渠道"></el-checkbox>
            </p>
            <p>
              
              <el-checkbox label="告警启停" disabled></el-checkbox>
              <el-checkbox label="操作" disabled></el-checkbox>
            </p>
          </el-checkbox-group>
        </div>
      </div>
      <p slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "msg",
  data() {
    return {
      checkList: ["选中且禁用", "复选框 A"],
      msgPrice: 0,
      num: 100,
      //购买短信 类型
      liIndex: 0,
      btnArr: ["基础告警", "云拨测告警", "自定义监控告警", "自定义消息"]
    };
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$emit("save");
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner,
.wrap >>> .el-input-number__increase,
.wrap >>> .el-input-number__decrease {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap >>> .el-input-number__increase,
.wrap >>> .el-input-number__decrease {
  top: 5px;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
}
.wrap >>> .el-checkbox{
  margin-left:31px;
}
.wrap {
  .dialog-main >>> .el-button {
    font-size: 12px;
    padding: 0 10px;
    box-sizing: border-box;
    margin: 0;
    margin-left: -1px;
  }
  .dialog-main {
    .el-checkbox-group {
      width: 100%;
      height: 210px;
      display: flex;
      p{
        display: flex;
        flex-direction: column;
        .el-checkbox{
          line-height: 30px;
        }
      }
      
     
    }
  }
  .active {
    border-color: #006eff;
    background: #fff;
    color: #006eff;
    z-index: 100;
    position: relative;
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
.dialog-footer {
  text-align: center;
}
</style>  