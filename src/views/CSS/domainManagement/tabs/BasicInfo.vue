<template>
  <div>
    <div class="basicinfo">
      <h1>基本信息</h1>
      <div class="newClear">

      </div>
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
  display:block;
  content:'';
  clear:both;
}
.basicinfo{
  width:100%;
  min-height:100px;
  background-color:#fff;
  border:1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
  }
}
</style>