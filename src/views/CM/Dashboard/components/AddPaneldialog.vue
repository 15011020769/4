<template>
  <div class="dialog">
    <el-dialog title="创建监控面板" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      // dialogFormVisible: false //监控面板的开关
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
<style lang="sass" scoped>

</style>