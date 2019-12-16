<template>
  <div class="header">
    <i class="el-icon-back" v-show="backShow" @click="back"></i>
    {{title}}
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "headerCom",
  data() {
    return {};
  },
  props: {
    backShow: {
      default: false
    },
    title: {
      required: true
    }
  },
  methods: {
    back() {
      this.$emit("_back");
    }
  }
};
</script>

<style scoped lang='scss'>
.header {
  background: white;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;

  i {
    color: #006eff;
    font-size: 16px;
    margin-right: 12px;
    font-weight: bold;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
  }
  i:hover {
    background: #f2f2f2;
  }
}
</style>