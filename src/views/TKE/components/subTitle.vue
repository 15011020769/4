 <!-- 集群详情标题组件 -->
<template>
  <div class="tke-sub-title"> {{title}}</div>
</template>

<script>
export default {
  name: "subTitle",
  data() {
    return {};
  },
  props: {
    title: {
      required: true
    }
  },
  methods: {
   
  }
};
</script>

<style scoped lang='scss'>
.tke-sub-title{
    font-size: 16px;
    font-weight: 700;
    color: #000;
    padding-bottom: 20px;
}
</style>
