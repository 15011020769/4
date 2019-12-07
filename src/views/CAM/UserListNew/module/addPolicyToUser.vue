<template>
  <div class="wrap">
       <div class="head">
          <Headcom title="添加到用户组" :backShow="true" @_back="_back" />
       </div>
  </div>
</template>
<script>
import Headcom from '../components/Head'
export default {
    components:{
      Headcom //头部组件
    }
}
</script>
<style lang="scss" scoped>
  
</style>