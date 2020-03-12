<!--
 * @Author: your name
 * @Date: 2020-02-19 17:26:56
 * @LastEditTime: 2020-02-28 12:36:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/diyType.vue
 -->
<template>
  <div>
    <el-tabs :value="active" @tab-click="tabChange">
      <el-tab-pane name="xy" :label="t('协议特征', 'WAF.xytz')" />
      <el-tab-pane name="ip" :label="t('ip情报特征', 'WAF.qbtz')" />
      <el-tab-pane name="diy" :label="t('自定义会话特征', 'WAF.zdyhhtz')" />
    </el-tabs>
    <PublicTable
      :ipSearch="ipSearch"
      v-if="tabsFlag !== 'diy'"
      :tabsFlag="tabsFlag"
    />
    <DiyTable :ipSearch="ipSearch" v-if="tabsFlag === 'diy'" />
  </div>
</template>
<script>
import PublicTable from './module/ipOrxyTable'
import DiyTable from './module/diyTable'
import { type } from 'os'
export default {
  data () {
    return {
      tabsFlag: 'diy',
      active: 'diy'
    }
  },

  props: {
    ipSearch: {
      type: String,
      default: ''
    }
  },

  components: {
    PublicTable,
    DiyTable
  },
  methods: {
    tabChange (tabs) {
      this.tabsFlag = tabs.name
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
