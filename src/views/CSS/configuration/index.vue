<template>
  <div class="configuration-wrap">
    <Header :backShow="false" title="範本配置" />
    <div class="content">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="detailsTabs">
        <el-tab-pane label="录制配置" name="first">
          <first />
        </el-tab-pane>
        <el-tab-pane label="回调配置" name="two">
          <two />
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import first from './model/first'
  import two from './model/two'
  export default {
    name: 'configuration',
    data() {
      return {
        activeName: 'first'
      }
    },
    components: {
      Header,
      first,
      two
    },
    methods: {
      handleClick() {

      }
    },
  }

</script>

<style lang="scss" scoped>
  .configuration-wrap {
    .content {
      background: #fff;
      margin: 20px;

      .detailsTabs {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }

</style>
