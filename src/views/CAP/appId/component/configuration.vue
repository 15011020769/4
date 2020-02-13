<template>
  <div class="wrap">
    <div class="confDetials">
      <div class="detials">
        <div class="title">基础外观 (修改验证码主题色、语言等，让验证码与你的网站更加融洽)</div>
        <div class="content">
          <el-form ref="form" label-width="100px">
            <el-form-item label="主题色">
              <el-row type="flex">
                <span style="padding-left:30px;">{{captcha.SchemeColor}}</span>
                <el-color-picker v-model="captcha.SchemeColor" style="margin-left:10px;"></el-color-picker>
                <el-button type="primary" style="margin-left:10px;" @click="reset">重置</el-button>
              </el-row>
              <p style="padding-left:30px;">主题色会影响验证码滑块、打击提醒、错误提醒等内容颜色</p>
            </el-form-item>
            <el-form-item label="默认语言">
              <el-select v-model="captcha.Language" placeholder="自适应" style="padding-left:30px;">
                <el-option label="自适应" :value="1"></el-option>
                <el-option label="简体验证码" :value="2052"></el-option>
                <el-option label="繁体验证码" :value="1028"></el-option>
                <el-option label="英文验证码" :value="1033"></el-option>
              </el-select>
              <p style="padding-left:30px;">验证码提示文案的语言，目前VTT类型只支持简体中文</p>
            </el-form-item>
            <el-button type="primary" style="margin-left:30px;margin-top:10px;" @click="save">立刻保存</el-button> 
            <span style="padding-left:30px;" v-show="timeShow">{{this.time}} <span>已保存</span></span>
          </el-form>
        </div>
      </div>
      <div class="detials" style="border:none; display: flex;justify-content: center;">
        <iframe
          id="tcaptcha"
          scrolling="no"
          src="/captcha.html"
          frameborder="no"
          border="0"
          width="360"
          height="360"
          ref="tcaptcha"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import {UPDATEAPPID_INFO,APPID_DESCRIBE} from '@/constants/CAP.js'
export default {
  data() {
    return {
      themeColor: '',
      Id: this.$route.query.Id,
      time: this.getDateString(new Date()),
      timeShow:false,
      captcha: {},
      message: {
        color: '',
        langid: 1,
        capType: 15
      }
    }
  },
  watch: {
    'captcha.SchemeColor'(n) {
      this.message.color = n
      this.initCaptcha()
    },
    'captcha.Language'(n) {
      this.message.langid = n
      this.initCaptcha()
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    initCaptcha() {
      this.$refs.tcaptcha.contentWindow.postMessage({
        ...this.message,
        color: this.message.color.substr(1)
      }, '*')
    },
    //获取当前APPID信息
    init(){
       let params = {
         Version:'2019-07-22',
         CaptchaAppId: this.Id
       }
       this.axios.post(APPID_DESCRIBE,params).then(res => {
         if(res.Response.Error === undefined){
            this.captcha = res.Response
            this.themeColor = res.Response.SchemeColor
            this.message.color = res.Response.SchemeColor
            this.message.langid = res.Response.Language
            this.initCaptcha()
         }else{
            let ErrTips = {
               "InternalError":'内部错误',
               "MissingParameter":'缺少参数错误',
               "UnauthorizedOperation.ErrAuth":'鉴权失败',
               "UnauthorizedOperation.Unauthorized":'未开通权限'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
         }
       })
    },
    //重置颜色
    reset() {
      this.captcha.SchemeColor = this.themeColor
      this.initCaptcha()
    },
    //立刻保存
    save(){
       this.timeShow = true;
       let params = {
          Version: '2019-07-22',
          CaptchaAppId: this.Id,
          AppName: this.captcha.AppName,
          DomainLimit: this.captcha.DomainLimit,
          SceneType: this.captcha.SceneType,
          CapType: this.captcha.CapType,
          EvilInterceptGrade: this.captcha.EvilInterceptGrade,
          SmartVerify: this.captcha.SmartVerify,
          SmartEngine: this.captcha.SmartEngine,
          SchemeColor: this.captcha.SchemeColor,
          MailAlarm: this.captcha.CaptchaMsg,
          TopFullScreen: this.captcha.TopFullScreen,
          TrafficThreshold: this.captcha.TrafficThreshold,
          CaptchaLanguage: this.captcha.Language
       }
       this.axios.post(UPDATEAPPID_INFO,params).then(res => {
         if(res.Response.Error === undefined){
          this.$message({
              message: 保存成功,
              type: "success",
              showClose: true,
              duration: 0
            });
          setTimeout(()=>{
              this.timeShow = false
            }, 5000);
         }else{
            let ErrTips = {
               "InternalError":'内部错误',
               "MissingParameter":'缺少参数错误',
               "UnauthorizedOperation.ErrAuth":'鉴权失败',
               "UnauthorizedOperation.Unauthorized":'未开通权限'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
         }
       })
    },
  
    //格式化当前时间
    getDateString(date){
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s:date.getSeconds()
      };
      for (const i in o) {
        o[i] = (o[i] + "").length == 1 ? "0" + o[i] : o[i];
      }
      return o.y + "-" + o.M + "-" + o.d + " " + o.h + ":" + o.m + ":" + o.s;
    },
    
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-button {
  border-radius: 0;
}
.wrap >>> .el-color-picker__trigger{
   margin-bottom: -14px;
}
.wrap {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .confDetials {
    width: 100%;
    background: white;
    display: flex;
    padding: 10px;
    .detials {
      flex: 1;
      border-right: 1px solid #ccc;
      .title {
        width: 100%;
        font-size: 15px;
        padding: 5px;
      }
      .content {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 80px;
      }
    }
  }
}
</style>