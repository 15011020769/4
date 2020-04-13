<template>
  <div class="domainManagement-wrap">
    <HeadCom title="範本配置"></HeadCom>
     <div class="conTabs">
      <el-tabs v-model="activeName" v-loading="loading">
        <el-tab-pane label="錄製配置" name="first">
          <div class="wrapper">
            <transcribe :isDelayLive="1" />
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="回調配置"
          name="second"
        >
          <div class="wrapper">
            <callback />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import HeadCom from '@/components/public/Head'
import Transcribe from '../../transcribe/content.vue'
import Callback from '../../callback/content'
export default {
  components: {
    HeadCom,
    Transcribe,
    Callback,
  },
  data() {
    return {
      activeName: 'first',
      loading: false, // 加载
    }
  }
}
</script>

<style lang="scss" scoped>
.conTabs {
  margin: 20px 30px;
  padding: 15px;
  background: #fff;
}
</style>
