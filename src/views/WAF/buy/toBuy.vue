<template>
  <div>
    <div class="topHead"></div>
    <div class="wrapper">
      <div class="content">
        <h1>欢迎使用web应用防火墙</h1>
        <h2>Web应用防火墙是一款基于网站防护的一站式安全服务平台，可以为网站开发者提供网站入侵防护、业务访问风险、网站传播护航等安全服务</h2>
        <div class="boxAll newClear">
          <div class="boxC">

          </div>
          <div class="boxC">

          </div>
          <div class="boxC">

          </div>
          <div class="boxC">
            
          </div>
        </div>
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
  content:'';
  display:block;
  clear:both;
}
.topHead{
  width:100%;
  height:50px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
.wrapper{
  width:100%;
  padding:20px;
  .content{
    box-shadow: 0 2px 3px #e2e9ee;
    border:1px solid #ddd;
    background-color:#fff;
    padding:80px 0;
    h1{
      font-size:16px;
      font-weight:600;
      color:#000;
      text-align:center;
    }
    h2{
      font-size:14px;
      text-align:center;
      color:#666;
      margin-top:20px;
    }
    .boxAll{
      margin:40px 0 40px;
      text-align:center;
      width:920px;
      margin:0 auto;
    }
    .boxC{
      border:1px solid #ddd;
      padding:20px;
      width:200px;
      height:210px;
      float:left;
      margin-right:20px;
    }
  }
}
</style>