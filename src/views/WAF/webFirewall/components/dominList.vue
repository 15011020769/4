<template>
  <div>
    <div class="dominList">
      <div class="dominListTitle">
        域名列表
      </div>
      <div class="dominListBtn newClear">
        <el-button class="addDomin">添加域名</el-button>
        <el-button :disabled="true">删除</el-button>
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
  display: inline-block;
  content:'';
  clear:both;
}
::v-deep button{
  border-radius: 0;
  height:30px;
  line-height: 30px;
  padding:0 16px;
  border:none;
  outline: none;
}
::v-deep input{
  height: 30px;
  line-height: 30px;
}
.dominList{
  width:100%;
  min-height:100px;
  background-color:#fff;
  margin-top:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  .dominListTitle{
    font-size:14px;
    color:#000;
    font-weight: 600;
    margin-bottom:20px;
  }
  .dominListBtn{
    margin-bottom:12px;
    .addDomin{
      background-color:#006eff;
      color:#fff;
    }
  }
}
</style>