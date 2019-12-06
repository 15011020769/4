<template>
  <div class="wrap">
      <div class="head">
           <Headcom title="用户详情" :backShow='true' />
      </div>
      <div class="details">
           <div class="details-left">
               <div class="leftHead" style="display:flex">
                  <p style="flex:1">name</p>
                  <p style="width:30px;">修改</p>
               </div>
               <div class="leftBody">
                   <div class="bodyLeft" style="flex:1;">
                      <p><span style="color:#666">账号ID</span><span style="padding-left:30px;">100012344563</span></p>
                      <p><span style="color:#666">备注</span><span style="padding-left:30px;">-</span></p>
                      <p><span style="color:#666">访问方式</span><span style="padding-left:30px;">控制台访问 编程访问</span></p>
                   </div>
                   <div class="bodyRight" style="flex:1">
                      <p><span style="color:#666">手机</span><span style="padding-left:30px;">-</span></p>
                      <p><span style="color:#666">邮箱</span><span style="padding-left:30px;">-</span></p>
                      <p><span style="color:#666">微信</span><span style="padding-left:30px;">-</span></p>
                      <p><span style="color:#666">是否允许微信接收通知</span><span style="padding-left:30px;">否</span></p>
                   </div>
               </div>
           </div>
           <div class="details-right">
                <div class="rightHead">
                   <p>快捷操作</p>
                </div>
                <div class="rightBody">
                   <el-button size="small">订阅消息</el-button>
                   <el-button size="small" class="delete">删除用户</el-button>
                </div>
           </div>
      </div>
  </div>
</template>
<script>
import Headcom from './components/Head';
export default {
  data(){
     return{};
  },
   components:{
     Headcom
   }
}
</script>
<style lang="scss" scoped>
   .details{
     width:100%;
     display: flex;
     justify-content: center;
     padding: 40px;
     box-sizing: border-box;
     .details-left{
      width: 70%;
       background: white;
       padding: 10px 10px 20px 10px;
       box-shadow:0 2px 3px 0 rgba(0,0,0,.2);
       .leftHead{
         width: 100%;
         background: white;
         padding:10px 10px 10px 10px;
         box-sizing: border-box;
       }
       .leftBody{
          flex: 1;
          display: flex;
          background: white;
         
         .bodyLeft{
            padding: 10px;
            box-sizing: border-box;
            p{
               padding: 0 0 25px 0;
               box-sizing: border-box;
            }
          }
          .bodyRight{
            padding: 10px;
            box-sizing: border-box;
            border-left: 1px solid #ccc;
            p{
               padding: 0 0 25px 0;
               box-sizing: border-box;
            }
          }
       }
     }
     .details-right{
       width:15%;
       background: skyblue;
       margin-left: 50px;
       display: flex;
       flex-direction: column;
       box-shadow:0 2px 3px 0 rgba(0,0,0,.2);
       .rightHead{
         width: 100%;
         background: white;
         padding: 10px 10px 0px 10px;
         p{
           font-weight: bold;
           padding:10px 10px 10px 10px;
           box-sizing: border-box;
         }
       }
       .rightBody{
         flex: 1;
         background: white;
         display: flex;
         flex-direction: column;
         align-items: center;
         .delete{
           margin-left: -1px;
           margin-top: 15px;
         }
       }
     }
   }
</style>