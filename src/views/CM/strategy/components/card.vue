<template>
  <div class="card">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>{{cardName}}</h3>
      </div>
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  prop: {
    cardName: {
      type: String
    }
  },
  data() {
    return {
      backShow: true
    };
  },
  components: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  background: rgb(235, 235, 235);
}
// .card >>> .{

// }
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>