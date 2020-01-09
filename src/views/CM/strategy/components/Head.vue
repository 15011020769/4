<template>
  <div class="header">
    <div style="display: flex;">
      <i style="color: #006eff;" class="el-icon-back" v-show="backShow" @click="back"></i>
      {{title}}
    </div>

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
      this.$router.push("/strategy");
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
  display: flex;
  flex-direction: column;
  //   align-items: center;

  i {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 20px;
    color: #006eff;
    font-size: 17px;
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