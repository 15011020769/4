<template>
  <div class="newdialog">
    <div>
      <el-dialog title="自定義清單字段" :visible.sync="dialogVisible1" width="40%">
        <div class="content">
          <div class="explain" style="margin-bottom:20px;">
            <p>請選擇您想顯示的清單詳細訊息，最多勾選10個字段，已勾選10個</p>
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
          <el-button type="primary" @click="save">確 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const opts = ["發生時間", "告警物件", "告警內容"];

const options = [
  "持續時長",
  "告警管道",
  "告警狀態",
  "結束時間",
  "告警類型",
  "策略類型",
  "策略名稱",
  "所屬網路",
  "所屬專案",
  "所屬實例組"
];
export default {
  data() {
    return {
      checkedlist: [
        "持續時長",
        "告警管道",
        "告警狀態",
        "結束時間",
        "告警類型",
        "策略類型",
        "策略名稱",
        "所屬網路",
        "所屬專案",
        "所屬實例組"
      ],
      checkedlistNo: ["發生時間", "告警物件", "告警內容"],
      cis: opts,
      cities: options,
      num: 13 //個數
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
