<template>
  <div class="createMessage-wrap">
    <Header :backShow="backShow" />

  </div>
</template>

<script>
import Header from "@/components/public/Head";

export default {
  data() {
    return {
        backShow:true,
    }
  },
  components: { Header },
  methods: {}
};
</script>>

<style lang="scss" scoped>
.createMessage-wrap >>> .el-button,
.createMessage-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
</style>