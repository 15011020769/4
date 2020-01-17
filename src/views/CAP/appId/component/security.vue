<template>
  <div class="wrap">
    <div class="wrap-in">
      <div class="defense-model">
        <div class="title">
          <span>防御模型</span>
          <span class="close">(根据业务场景特性，平衡安全和体验，配置最合适您需求的防御体系)</span>
        </div>
        <div class="model-choose-level">
          <div class="model-choose">
            <ul>
              <li>场景选择</li>
              <li>根据您选择的场景适配不同的风控策略，达到最优防御效果</li>
            </ul>
            <div class="choose-select">
              <div
                class="choose-button"
                v-for="(v,i) in modelSelectData "
                :key="i"
                :class="{active:securityData.SceneType==i+1}"
                @click="screenSelect(i)"
              >
                <p :class="{open:securityData.SceneType==i+1}">{{v.title}}</p>
                <p>{{v.content}}</p>
              </div>
            </div>
          </div>
          <div class="model-level">
            <ul>
              <li>恶意拦截等级</li>
              <li>选择风控策略的过滤程度，调整安全和体验的侧重</li>
            </ul>
            <div class="block">
              <el-slider v-model="securityData.EvilInterceptGrade" :step="50" show-stops :format-tooltip="timestepToolTip"></el-slider>
              <div class="block-content">
                <div class="block-left">
                  <p>体验优先</p>
                  <p>停用部分容易误伤的策略安全优先</p>
                </div>
                <div class="block-right">
                  <p>安全优先</p>
                  <p>开启所有安全策略</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="defense-model">
        <div class="title">
          <span>验证策略</span>
          <span>(根据你的选择的场景适配不同的风控策略，达到最优的防御效果)</span>
        </div>
        <div class="model-choose-level">
          <div class="model-choose">
            <ul class="setHeight">
              <li>智能验证引擎</li>
              <li>
                开启验证码智能验证引擎，将根据你业务的实时风险情况下发不同类型的验证码。
                把简单验证码下发给真实用户，把复杂验证码下发给恶意访问
              </li>
            </ul>
            <div class="verification">
              <div class="verification-switch">
                <el-switch
                  v-model="securityData.SmartEngine"
                  active-color="#006ef0"
                  inactive-color="#e4e7ed"
                  @change="switch1Change"
                ></el-switch>
                <span class="close" v-if="!securityData.SmartEngine">已关闭智能引擎，可自行指定验证码类型</span>
                <span class="open" v-if="securityData.SmartEngine">已开启智能引擎，将自动感知恶意调整验证码</span>
              </div>
              <div class="choose-select">
                <div
                  class="choose-button"
                  v-for="(v,i) in verificationData "
                  :key="i"
                  :class="{active:securityData.CapType==i+13,active2:securityData.SmartEngine}"
                  @click="capTypeSelect(i)"
                >
                  <p
                    :class="{open:securityData.CapType==i+13,open2:securityData.SmartEngine}"
                  >{{v.title}}</p>
                  <p>{{v.content}}</p>
                </div>
              </div>
              <el-row>
                <el-button type="primary" @click="fastSave">立即保存</el-button>
                <span v-if="!showTime">保存本页面所有的设置</span>
                <span class="close" v-if="showTime">{{time}} 已保存</span>
              </el-row>
            </div>
          </div>
          <div class="model-level">
            <ul class="setHeight">
              <li>
                智能免验证
                <span class="open">内测中</span>
              </li>
              <li>为可信用户跳过验证环节，秒过验证码，体验更优秀</li>
            </ul>
            <div class="verification-switch">
              <el-switch
                v-model="securityData.SmartVerify"
                active-color="#006ef0"
                inactive-color="#e4e7ed"
                @change="switch2Change"
              ></el-switch>
              <span class="close" v-if="!securityData.SmartVerify">已关闭免验证，所有访问都需完成验证码</span>
              <span class="open" v-if="securityData.SmartVerify">已开启免验证，可信用户将跳过验证码环节</span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { UPDATEAPPID_INFO, APPID_DESCRIBE } from "@/constants/CAP.js";
import moment from "moment";
export default {
  data() {
    return {
      colorIndex: "",
      modelSelectData: [
        { title: "账号场景", content: "登陆、注册、找回密码等" },
        { title: "短信场景", content: "发送短信、邮箱验证码等" },
        { title: "活动场景", content: "秒杀、领券、抢红包等" },
        { title: "其他场景", content: "评论、投票、发帖等" }
      ],
      verificationData: [
        { title: "滑动验证码", content: "简洁体验，快速通过" },
        { title: "VTT验证码", content: "极致防护，倍享安全" }
      ],
      toolmsg: ['体验优先',  '平衡','安全优先'],
      timestep:100,
      CaptchaAppId: "",
      time: "",
      showTime: false,
      securityData: {
        AppName: "", //应用名
        DomainLimit: "", //域名限制
        SceneType: "", //场景类型
        CapType: "", //验证码类型
        EvilInterceptGrade: 0, //风险级别
        SmartVerify: "", //智能检测
        SmartEngine: "", //开启智能引擎
        CaptchaLanguage: "",
        TrafficThreshold: "", //流量限制
        TopFullScreen: "", //是否全屏
        SchemeColor: "" //web风格
      }
    };
  },
  created() {
    this.CaptchaAppId = this.$route.query.Id;
    this.findData();
  },
  methods: {

    //自定义slider标签
    timestepToolTip(index) {
			return this.toolmsg[index / 50]
		},
    //场景选择
    screenSelect(i) {
      this.securityData.SceneType = i + 1;
    },

    capTypeSelect(i) {
      // this.securityData.CapType=i
      this.securityData.CapType = i + 13;
    },
    //智能验证引擎 switch
    switch1Change() {},

    //智能免验证 switch
    switch2Change() {},

    //立即保存
    fastSave() {
      const params = {
        Version: "2019-07-22",
        CaptchaAppId: this.CaptchaAppId,
        AppName: this.securityData.AppName,
        CapType: this.securityData.CapType,
        DomainLimit: this.securityData.DomainLimit,
        EvilInterceptGrade: this.securityData.EvilInterceptGrade,
        SceneType: this.securityData.SceneType,
        SchemeColor: this.securityData.SchemeColor,
        SmartEngine: this.securityData.SmartEngine == false ? 0 : 1,
        SmartVerify: this.securityData.SmartVerify == false ? 0 : 1,
        TopFullScreen: this.securityData.TopFullScreen,
        TrafficThreshold: this.securityData.TrafficThreshold,
        CaptchaLanguage: this.securityData.CaptchaLanguage,
        MailAlarm: ""
      };

      this.axios.post(UPDATEAPPID_INFO, params).then(res => {
        if(res.Response.Error === undefined){
            // console.log(res)
            if (res.Response.CaptchaCode == 0) {
              var setTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              this.time = setTime;
              this.showTime = true;
              setTimeout(() => {
                this.showTime = false;
              }, 3000);
              this.$message({
                message: "保存成功",
                type: "success"
              });
            }
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
      });
    },
    //根据id获得基础数据
    findData() {
      const params = {
        Version: "2019-07-22",
        CaptchaAppId: this.CaptchaAppId
      };
      this.axios.post(APPID_DESCRIBE, params).then(res => {
        if(res.Response.Error === undefined){
            if (res.Response.CaptchaCode == 0) {
              this.securityData.AppName = res.Response.AppName;
              this.securityData.DomainLimit = res.Response.DomainLimit; //域名限制
              this.securityData.SceneType = res.Response.SceneType; //场景类型
              this.securityData.CapType = res.Response.CapType; //验证码类型
              this.securityData.SchemeColor = res.Response.SchemeColor;
              this.securityData.TopFullScreen = res.Response.TopFullScreen;
              this.securityData.TrafficThreshold = res.Response.TrafficThreshold;
              this.securityData.EvilInterceptGrade =
                res.Response.EvilInterceptGrade; //风险级别
              this.securityData.CaptchaLanguage = res.Response.Language; //风险级别
              this.securityData.SmartVerify =
                res.Response.SmartVerify == 1 ? true : false; //智能检测
              this.securityData.SmartEngine =
                res.Response.SmartEngine == 1 ? true : false; //开启智能引擎
              this.securityData.TrafficThreshold = res.Response.TrafficThreshold; //流量限制
              this.securityData.TopFullScreen = res.Response.TopFullScreen; //是否全屏
              this.securityData.SchemeColor = res.Response.SchemeColor; //web风格

              this.colorIndex = res.Response.SceneType - 1; //默认选中场景等级
            }
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
      });
    }
  }
};
</script>
<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  padding: 20px;
  .wrap-in {
    background: white;
    .defense-model {
      padding: 20px;
      border-bottom: solid 1px #dddddd;
      .title {
        font-size: 15px;
        margin-bottom: 30px;
        span:nth-of-type(1) {
          font-weight: 600;
        }
        span:nth-of-type(2) {
          font-size: 14px;
          margin-left: 6px;
        }
      }
      .model-choose-level {
        display: flex;
        padding: 0px 20px;
        font-size: 14px;
        .model-choose {
          flex: 1;
          border-right: solid 1px #ccc;
         box-sizing: border-box;
          padding: 0px 20px;
          ul {
            width: 85%;
            // height: 100px;
            margin-bottom: 40px;
            li {
              padding: 10px 0px;
            }
            li:nth-of-type(1) {
              font-size: 17px;
            }
            li:nth-of-type(2) {
              color: #666;
            }
          }
          .choose-select {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
          }
          .choose-button {
            border: solid 1px #ccc;
            width: 46%;
            padding: 12px 20px;
            cursor: pointer;
            margin-bottom: 12px;
            p {
              line-height: 2.4;
            }
            p:nth-of-type(1) {
              font-size: 16px;
            }
            p:nth-of-type(2) {
              color: #666;
            }
          }
          .verification {
            .choose-select {
              margin-bottom: 30px;
            }
            & >>> .el-row > span {
              margin-left: 30px;
            }
            .verification-switch {
              margin-bottom: 30px;
              span {
                margin-left: 10px;
              }
            }
          }
        }

        .model-level {
          flex: 1;
          padding-left: 40px;
          ul {
            //  height: 100px;
            margin-bottom: 40px;
            li {
              padding: 10px 0px;
              span {
                margin-left: 30px;
              }
            }
            li:nth-of-type(1) {
              font-size: 17px;
            }
            li:nth-of-type(2) {
              color: #666;
            }
          }
          .verification-switch {
            span {
              margin-left: 10px;
            }
          }
          .block {
            padding-top: 40px;
            .block-content {
              display: flex;
              justify-content: space-between;
              & > div > p {
                line-height: 2;
              }
              & > div > p:nth-of-type(2) {
                color: #666;
              }
              .block-right {
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
}
.setHeight{
  height: 100px;
}
.active,
.active2 {
  border-color: #006ef0 !important;
}
.close {
  color: #666;
}
.open,
.open2 {
  color: #006ef0;
}
</style>