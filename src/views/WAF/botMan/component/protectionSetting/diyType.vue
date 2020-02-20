<!--
 * @Author: your name
 * @Date: 2020-02-19 17:26:56
 * @LastEditTime: 2020-02-20 17:11:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/diyType.vue
 -->
<template>
  <div>
    <el-tabs @tab-click="tabChange">
      <el-tab-pane name="xy" label="协议特征" />
      <el-tab-pane name="ip" label="ip情报特征" />
      <el-tab-pane name="diy" label="自定义会话特征" />
    </el-tabs>
    <PublicTable v-if="tabsFlag !== 'diy'" :tabsFlag="tabsFlag" />
    <DiyTable v-if="tabsFlag === 'diy'" />
  </div>
</template>
<script>
import PublicTable from './module/ipOrxyTable'
import DiyTable from './module/diyTable'
export default {
  data() {
    return {
      tabsFlag: 'diy'
    }
  },

  components: {
    PublicTable,
    DiyTable
  },
  methods: {
    tabChange(tabs) {
      this.tabsFlag = tabs.name
    }
  }
}
</script>

<style lang="scss" scoped>

</style>