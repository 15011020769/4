<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">新建用户</span>
      <span class="title-right">
        <span>CAM用户使用说明</span>
      </span>
    </div>
    <div class="container">
      <p class="title">选择用户类型</p>
      <p class="explain">请根据您业务需要，选择合适的用户类型</p>
      <ul class="category">
        <li class="noline">
          <img src="" alt="">
          <p class="sub-title">子用户</p>
          <p class="sub-content">新建账号协助您</p>
          <ul>
           <li>
             <span>可访问腾讯雲</span>
            
            </li>
            <li>
              <span>可批量创建</span>
            
            </li>
            <li>
              <span>可接收消息通知</span>
            
            </li>
          </ul>
          <div class="buttons">
             <p><el-button type="primary" plain @click="custormCreate">自定义创建</el-button></p>
            <p><el-button type="primary" plain>微信邀请</el-button></p>
            <el-button type="primary" plain @click="weChatImp">企业微信导入</el-button>
          </div>
        </li>
        <li class="line"></li>
        <li class="noline">
          <img src="" alt="">
          <p class="sub-title">协作者</p>
          <p class="sub-content">添加现存账号协助您</p>
          <ul>
           <li>
             <span>可访问腾讯雲</span>
            </li>
            <li>
              <span>可接收消息通知</span>
            </li>
          </ul>
          <div class="buttons">
             <p><el-button type="primary" plain @click="create">创建</el-button></p>
          </div>
        </li>
        <li class="line"></li>
        <li class="noline">
          <img src="" alt="">
          <p class="sub-title">消息接收人</p>
          <p class="sub-content">仅用于接收消息通知</p>
          <ul>
           <li>
             <span>不可访问腾讯雲</span>
            </li>
            <li>
              <span>可接收消息通知</span>
            </li>
          </ul>
          <div class="buttons">
             <p><el-button type="primary" plain @click="messageCreate">创建</el-button></p>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
  
</template>
<script>
 export default {
    methods: {
      custormCreate() {
        this.$router.push({name: 'custormCreate'})
      },
      goback () {
        this.$router.push({name: 'UserList'})
      },
      create () {
        this.$router.push({name: 'create'})
      },
      messageCreate () {
        this.$router.push({name: 'messageCreate'})
      },
      weChatImp () {
        this.$router.push({name: 'weChatImp'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;

    .title-left {
      display: inline-block;
      vertical-align: middle;
      font-size: 18px;
      font-weight: 700;
      margin-left: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
      line-height: 30px;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .container {
    width:96%;
    height:570px;
    min-height: 500px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    ul.category{
      width:90%;
      margin: 52px auto 0;
      display: flex;
      align-items: flex-start;
      text-align: center;
      justify-content: center;
      li.noline {
        flex:1;
        padding: 5px 50px 0;
        p.sub-title {
          margin-top: 12px;
          line-height: 20px;
          font-size: 14px;
          color: #000;
          font-weight: 400;
        }
        p.sub-content {
          margin-top: 12px;
          line-height: 18px;
          font-size: 12px;
          color: #666;
        }
        
        ul {
          margin: 12px auto 0;
          min-height: 60px;
          height:75px;
          padding:0 0 0 100px;
          text-align: left !important;
          li {
            position: relative;
            padding-left: 15px;
            line-height: 20px;
            font-size: 12px;
            color: #666;
            border-right:0;
            span {
              display: inline-block;
              margin-left: -22px;
            }
          }
          li:after{
            content: "";
            display: block;
            position: absolute;
            top: 13px;
            left: -17px;
            width: 3px;
            height: 3px;
            background-color: #666;
            box-sizing: border-box;
            overflow: hidden;
          }
        }
      }
      li.line{
        height: 320px;
        width: 1px;
        background:#ddd;
      }
    }
    .buttons {
      margin-top:25px;
      p {
        margin-bottom:10px;
      }
      .el-button--primary.is-plain {
        color: #0075FF;
        border: 1px solid #006EFF;
        background: #fff;
        display: block;
        margin: 0 auto;
        padding: 0 30px;
        max-width: 150px;
        height: 30px;
        line-height: 28px;
        font-size: 12px;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 0;
        overflow: hidden;
      }
      .el-button--primary.is-plain:hover{
        color: #fff;
        background-color: #006EFF;
        text-decoration: none;
      }
    }
  }
  .cam_button{
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt{
    float: left;
  }
  .head-container{
    float: right;
  }
  .cam_button{
    position: relative;
  }
  .suo{
    position: absolute;
    right: 0;
  }

}
</style>
