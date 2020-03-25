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
    <p class="p-2">
      4、兩段式的執行方法，前一段指向代碼包中不包含後綴的文件名，後一段指向文件中的入口函數名。需要確保代碼包中的文件名後綴與語言環境匹配，如 Python 環境為 .py 文件，Node.js 環境為 .js 文件
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
  border-top: 1px solid #e7e7e7;
  padding: 20px 0;
  font-size: 12px;
  .p-1{
    color: rgb(153, 153, 153);
    font-weight: 600;
  }
  .p-2{
    margin-top: 7px;
    color: rgb(153, 153, 153);
  }
}
</style>
