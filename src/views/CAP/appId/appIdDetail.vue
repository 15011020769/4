
<template>
    <div class="appidDetials">
       <Herd title="APPID详情" :backShow="true" @_back="back" />
         <div class="appidTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="验证数据" name="first">
          <Validata/>
        </el-tab-pane>
        <el-tab-pane label="外观配置" name="second">
           <Configuration/>           
        </el-tab-pane>
        <el-tab-pane label="安全配置" name="third">
           <Security/>
        </el-tab-pane>
        <el-tab-pane label="基础配置" name="fourth">
           <Basis/>
        </el-tab-pane>
      </el-tabs>
    </div>
    </div>
</template>
<script>
import Herd from '@/components/public/Head'
import Validata from './component/validationData'
import Configuration from './component/configuration'
import Security from './component/security'
import Basis from './component/basis'
export default {
   components:{
     Herd,
     Validata,
     Configuration,
     Security,
     Basis
   },
   data() {
      return {
         activeName: 'first'
      }
   },
   mounted() {

   },
   methods:{
       back(){
          this.$router.go(-1);
       },
       handleClick(tab, event) {}
   },
}
</script>
<style lang="scss" scoped>
  .appidDetials{
     .appidTabs{
         background: #fff;
     }
  }
</style>
