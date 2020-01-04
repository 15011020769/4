<template>
    <el-card class="box-card">
        <p class="box-info">基本信息</p>
        <div class="text item">
            <ul>
                <li>仓库名称</li>
                <li>类型</li>
                <li>仓库地址</li>
                <li>描述</li>
                <li>创建时间</li>
            </ul>
        </div>
    </el-card>
</template>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    width: 100px;
    ul>li{
        padding-top:30px;
        font-size: 12px;
        color:#888;
    }
  }

  .box-card {
    width: 95%;
    position: absolute;
    top:40px;
    left:20px;
    .box-info{
        font-size: 14px;
        font-weight: 700;
    }
  }
</style>
