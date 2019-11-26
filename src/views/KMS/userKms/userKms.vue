<template>
  <div>
    <div class="topConTit">
      <span class="titFont">密钥列表</span>
      <span class="taibeiCheck">{{thisAddress}}</span>
    </div>
    <div class="mainContent">
      <div class="mainContBtn newClear">
        <div class=""></div>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      thisAddress:'中国台北'
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  content:"";
  clear:both;
}
.topConTit{
  width:100%;
  height:50px;
  line-height:50px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  span.titFont{
    font-size:16px;
    font-weight:600;
  }
  span.taibeiCheck{
    width:78px;
    height:22px;
    text-align: center;
    line-height:22px;
    color:#006eff;
    border:1px solid #006eff;
    background-color:#fff;
    margin-left:20px;
    display: inline-block;
  }
}
.mainContent{
  width:100%;
  padding:20px;
  .mainContBtn{
    margin-bottom:20px;
  }
}
</style>