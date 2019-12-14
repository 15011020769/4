<template>
  <div>
    <div class="dominList">
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
<style lang="scss" scoped>
.newClear:after{
  display: inline-block;
  content:'';
  clear:both;
}
.dominList{
  width:100%;
  min-height:100px;
  background-color:#fff;
  margin-top:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
}
</style>