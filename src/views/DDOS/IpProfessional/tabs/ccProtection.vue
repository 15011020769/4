<template>
  <div id="ccProtection">
    <div class="ccProtectPartOne">
      123
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  }
}
</script>
<style lang="scss">
#ccProtection{
  .newClear:after{
    display:block;
    clear:both;
    content:'';
  }
  .ccProtectPartOne{
    width:100%;
    height:80px;
  }
}
</style>