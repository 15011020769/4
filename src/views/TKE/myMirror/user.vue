<template>
    <div class="room">
        <div class="top-left">
            <el-button type="primary" size="mini" class="botton-size">新建</el-button>
            <el-button disabled size="mini" class="botton-size">删除</el-button>
        </div>
        <div class="top-right"></div>
    </div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style scoped>
    .room{
        position: absolute;
        left: 60px;
        top: 40px;
        width: 921px;
        height: 30px;
    }
    .botton-size{
        width: 70px;
        text-align: center;
        margin-left:10px;
        height: 30px;
    }
</style>
