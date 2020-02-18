
<template>
    <div class="appidDetials">
       <Herd :title="$t('CAP.yzmxq')" :backShow="true" @_back="back" />
         <div class="appidTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('CAP.yzxq')" name="first">
          <Validata/>
        </el-tab-pane>
        <el-tab-pane :label="$t('CAP.wgpz')" name="second">
           <Configuration/>           
        </el-tab-pane>
        <el-tab-pane :label="$t('CAP.aqpz')" name="third">
           <Security/>
        </el-tab-pane>
        <el-tab-pane :label="$t('CAP.jcpz')" name="fourth">
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
         activeName: 'first',
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
        &>>> .el-tabs__header {
          padding: 0 20px;
           margin: 0;
         }
        &>>>.el-tab-pane{
           background: #f2f2f2
        } 
     }
  }
  
</style>
