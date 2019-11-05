<template>
  <div class="deleterRow">
    <el-dialog
      :visible.sync="deleteDialog"
      width="45%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>您确定要删除函数 wangyan001 吗？</span><i class="el-icon-close" @click="close(2)"></i></div>
      <span style='font-size: 12px;'>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="close(1)">确认</el-button>
        <el-button size="mini" @click="close(2)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      
    };
  },
  props: ["deleteDialog"],
  computed: {
  },
  methods: {
    close(value) {
      this.$emit("deleteClose",value);
    }
  }
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
</style>
