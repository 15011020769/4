<template>
  <div class="openHint">
    <p class="p-1">
      执行方法表明了调用云函数时需要从哪个文件中的哪个函数开始执行。
    </p>
    <p class="p-2">
      1、一段式格式為"[文件名]"，Golang 環境時使用，例如 "main";
    </p>
    <p class="p-2">
      2、兩段式格式為"[文件名].[函數名]"，Python，Node.js，PHP 環境時使用，例如 "index.main_handler";
    </p>
    <p class="p-2">
      3、三段式格式為"[package].[class]::[method]",JAVA 環境時使用，例如 "example.Hello::mainHandler";
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.openHint{
  border-top: 2px solid #e7e7e7;
  padding: 20px 15px;
  .p-1{
    color: rgb(153, 153, 153);
    font-weight: 600;
  }
  .p-2{
    margin-top: 10px;
    color: rgb(153, 153, 153);
  }
}
</style>
