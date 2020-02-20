<template>
    <div class='room-out'>
        <el-card class="box-card">
            <p class="box-info">以下内容来自Docker Hub，详情请访问：<a href="https://hub.docker.com/_/nginx" target="_blank">https://hub.docker.com/_/nginx</a></p>
            <div class="room">
                <div class="item-left">
                    <ul>
                        <li>仓库名称</li>
                        <li>类型</li>
                        <li>来源</li>
                        <li>获取镜像</li>
                        <li>仓库地址</li>
                        <li>描述</li>
                    </ul>
                </div>
                <div class="item-right">
                    <ul>
                        <li>仓库名称</li>
                        <li>类型</li>
                        <li>来源</li>
                        <li>获取镜像</li>
                        <li>仓库地址</li>
                        <li>描述</li>
                    </ul>
                </div>
            </div>
        </el-card>
    </div>
</template>
<style lang="scss" scoped>
  .item-left{
    ul{
        margin-bottom: 20px;
        li{
        padding-top:30px;
        font-size: 12px;
        color:#888;
        }
    }
  }

  .box-card {
    width: 100%;
    .box-info{
        font-size: 14px;
        font-weight: 700;
        margin-top:30px;
        margin-bottom:10px;
    }
    .room{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .item-left{
            width: 70%;
            border: 1px solid #ddd;
            height: auto;
        }
        .item-right{
            width: 20%;
            border: 1px solid #ddd;
            height: 200px;
        }
    }
  }
  .room-out{
      padding:20px;
  }
</style>
