<template>
  <div class="wrap">
      <div class="accounted">
         <div class="accountedData">
            <p>昨日恶意占比</p>
            <p>---</p>
         </div>
         <div class="accountedData">
            <p>昨日请求量</p>
            <p>---</p>
         </div>
         <div class="accountedData">
            <p>昨日验证量</p>
            <p>---</p>
         </div>
         <div class="accountedData">
            <p>昨日通过量</p>
            <p>---</p>
         </div>
         <div class="accountedData">
            <p>昨日恶意拦截量</p>
            <p>---</p>
         </div>
         <div class="accountedData" style="border:none">
            <p>昨日票据校验量</p>
            <p>---</p>
         </div>
      </div>
      <div class="accData">
          <div class="charts">123</div>
      </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style scoped lang="scss">
   .wrap{
     width: 100%;
     height: 100%;
     padding: 20px;
       .accounted{
        width: 100%;
        background: white;
        display: flex;
        padding: 20px;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        .accountedData{
          flex: 1;
          border-right:1px solid #ccc; 
          padding-left: 10px;
          p{
            padding: 13px;
          }
        }
     }
     .accData{
       width: 100%;
       background: skyblue;
       .charts{
         width: 100%;
         background: white;
         margin-top: 20px;
         box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
       }
     }
   }
</style>