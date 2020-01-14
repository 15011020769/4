<template>
  <div class="wrap">
       <div class="confDetials">
             <div class="detials">
                 <div class="title">基础外观 (修改验证码主题色、语言等，让验证码与你的网站更加融洽)</div>
                 <div class="content">
                    <el-form ref="form" :model="form" label-width="100px">
 
  <el-form-item label="主题色">
    <span style="padding-left:30px;">#cccc</span>
    <el-select v-model="form.region" placeholder="请选择活动区域" style="margin-left:10px; width:60px" >
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
    <el-button type="primary" style="margin-left:10px;">主要按钮</el-button>
    <p style="padding-left:30px;">主题色会影响验证码滑块、打击提醒、错误提醒等内容颜色</p>
  </el-form-item>
  <el-form-item label="默认语言">
    <el-select v-model="form.region" placeholder="请选择活动区域" style="padding-left:30px;">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
    <p style="padding-left:30px;">验证码提示文案的语言，目前VTT类型只支持简体中文</p>
  </el-form-item>
<el-button type="primary" style="margin-left:30px;margin-top:10px;">立刻保存</el-button>
</el-form>
                 </div>
             </div> 
             <div class="detials" style="border:none">
              
             </div>
       </div>
  </div>
</template>
<script>
export default {
   data() {
     return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
     }
   },
}
</script>
<style lang="scss" scoped>
.wrap >>> .el-button{
  border-radius: 0;
}
   .wrap{
     width: 100%;
     padding: 20px;
     box-sizing: border-box;
     .confDetials{
       width: 100%;
       background: white;
       display: flex;
       padding: 10px;
       .detials{
         flex: 1;
         border-right: 1px solid #ccc;
         .title{
           width: 100%;
           font-size: 15px;
           padding: 5px;
         }
         .content{
           display: flex;
           justify-content: center;
           width: 100%;
           padding: 80px;
         }
       }
     }
   }
</style>