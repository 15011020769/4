<template>
  <div class="wrap">
    <div class="head">
      <Headcom title="添加到用户组" :backShow="true" />
    </div>
    <!-- <div class="policyToUser">
      <div class="step">
        <el-steps
          :active="active"
          direction="vertical"
          simple
          :space="200"
          style="margin-right: 50%"
          finish-status="success"
        >
          <el-step title="设置用户组"></el-step>
          <el-step title="审阅用户组"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1">22222</div>
      <div v-show="active==2">111</div>
      <div>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==1 || active==2"
        >上一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >下一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >完成</el-button>
      </div>
    </div> -->
  </div>
</template>
<script>
import Headcom from "../components/Head";
export default {
  components: {
    Headcom //头部组件
  },

  data() {
    return {
      // active: 1
    };
  },
  methods: {
    // prev() {
    //   --this.active;
    //   if (this.active < 0) this.active = 0;
    // },
    // next() {
    //   if (this.active++ > 3) this.active = 0;
    // }
  }
};
</script>
<style lang="scss" scoped>
.policyToUser {
  width: 85%;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
}
</style>