<template>
  <div>
    <div>

    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:{
      required:false,
      type:Boolean
    }
  },
  data(){
    return{

    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display: block;
  clear:both;
}
</style>