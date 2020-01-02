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
<style lang="scss" scoped>
  .appid {
    .appidTabs {
      margin-left: 20px;
      margin-right: 20px;
    }
  }

</style>
