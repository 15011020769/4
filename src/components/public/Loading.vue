<template>
  <div class="wrap" v-show="show">
    <div class="box">
      <i class="el-icon-loading"></i>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  },
  props: {
    show: {
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    width: 200px;
    margin: 0 auto;
    text-align: center;
  }
  p {
    color: #65a5f9;
    margin-top: 10px;
  }
  i {
    color: #65a5f9;
    font-size: 40px;
  }
}
</style>