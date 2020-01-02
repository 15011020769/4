<template>
  <div class="appid">
    <Herd title="APPID列表" />
    <div class="appidTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="APPID列表" name="first">
          <first />
        </el-tab-pane>
        <el-tab-pane label="套餐包管理" name="second">
          <second />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import Herd from '@/components/public/Head'
  import second from './model/second'
  import first from './model/first'
  export default {
    data() {
      return {
        activeName: 'first'
      }
    },
    components: {
      Herd,
      first,
      second
    },
    methods: {
      handleClick(tab, event) {

      }
    },
  }

</script>
<style lang="scss">
  .el-tabs__content {
    background: #f2f2f2
  }

  .el-tabs__header {
    padding: 0 20px;
    margin: 0;
  }

</style>
<style lang="scss" scoped>
  .appid {


    .appidTabs {
      background: #fff;

    }
  }

</style>
