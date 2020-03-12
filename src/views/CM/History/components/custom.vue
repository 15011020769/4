<template>
  <div class="newdialog">
    <div>
      <el-dialog title="自定义列表字段" :visible.sync="dialogVisible1" width="40%">
        <div class="content">
          <div class="explain" style="margin-bottom:20px;">
            <p>请选择您想显示的列表详细信息，最多勾选10个字段，已勾选10个</p>
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkedlistNo">
              <el-checkbox v-for="opt in cis" :label="opt" :key="opt" disabled>{{opt}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="checkedlist">
              <el-checkbox v-for="option in cities" :label="option" :key="option">{{option}}</el-checkbox>
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
const opts = ["发生时间", "告警对象", "告警内容"];

const options = [
  "持续时长",
  "告警渠道",
  "告警状态",
  "结束时间",
  "告警类型",
  "策略类型",
  "策略名称",
  "所属网络",
  "所属项目",
  "所属实例组"
];
export default {
  data() {
    return {
      checkedlist: [
        "持续时长",
        "告警渠道",
        "告警状态",
        "结束时间",
        "告警类型",
        "策略类型",
        "策略名称",
        "所属网络",
        "所属项目",
        "所属实例组"
      ],
      checkedlistNo: ["发生时间", "告警对象", "告警内容"],
      cis: opts,
      cities: options,
      num: 13 //个数
    };
  },
  props: {
    dialogVisible1: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$emit("save1",this.checkedlist);
    }
  }
};
</script>
<style lang="scss" scoped>
.checkbox >>> .el-checkbox .is-disabled .is-checked {
  width: 30%;
}
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-checkbox-group .el-checkbox,
.el-checkbox-group .is-checked,
.el-checkbox-group .el-checkbox {
  width: 30%;
  padding: 5px 0;
  color:#444;
  font-size: 14px;
}

.checkbox >>>.el-checkbox .is-checked{
    width: 30%;
}
el-checkbox is-checked
.newdialog {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.32);
}
.checkbox >>> .el-checkbox {
  display: block;
  margin: 0;
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