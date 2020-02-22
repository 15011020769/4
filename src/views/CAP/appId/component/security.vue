<template>
  <div class="wrap">
    <div class="wrap-in">
      <div class="defense-model">
        <div class="title">
          <span>{{$t('CAP.fymx')}}</span>
          <span class="close">({{$t('CAP.gjywcj')}})</span>
        </div>
        <div class="model-choose-level">
          <div class="model-choose">
            <ul>
              <li>{{$t('CAP.cjxz')}}</li>
              <li>{{$t('CAP.gjnxzdcj')}}</li>
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
              <li>{{$t('CAP.eyljdj')}}</li>
              <li>{{$t('CAP.xzfkcl')}}</li>
            </ul>
            <div class="block">
              <el-slider v-model="securityData.EvilInterceptGrade" :step="50" show-stops :format-tooltip="timestepToolTip"></el-slider>
              <div class="block-content">
                <div class="block-left">
                  <p>{{$t('CAP.tyyx')}}</p>
                  <p>{{$t('CAP.tybf')}}</p>
                </div>
                <div class="block-right">
                  <p>{{$t('CAP.aqyx')}}</p>
                  <p>{{$t('CAP.kqsyaq')}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="defense-model">
        <div class="title">
          <span>{{$t('CAP.yzcl')}}</span>
          <span>({{$t('CAP.gjnxzdcj')}})</span>
        </div>
        <div class="model-choose-level">
          <div class="model-choose">
            <ul class="setHeight">
              <li>{{$t('CAP.znyzyq')}}</li>
              <li>
                {{$t('CAP.kqyzmznyq')}}
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
                <span class="close" v-if="!securityData.SmartEngine">{{$t('CAP.ygbznyq')}}</span>
                <span class="open" v-if="securityData.SmartEngine">{{$t('CAP.ykqznyq')}}</span>
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
                <span v-if="!showTime">{{$t('CAP.bcympz')}}</span>
                <span class="close" v-if="showTime">{{time}} 已保存</span>
              </el-row>
            </div>
          </div>
          <div class="model-level">
            <ul class="setHeight">
              <li>
                {{$t('CAP.znmyz')}}
                <span class="open">{{$t('CAP.ncz')}}</span>
              </li>
              <li>{{$t('CAP.wkxyh')}}</li>
            </ul>
            <div class="verification-switch">
              <el-switch
                v-model="securityData.SmartVerify"
                active-color="#006ef0"
                inactive-color="#e4e7ed"
                @change="switch2Change"
              ></el-switch>
              <span class="close" v-if="!securityData.SmartVerify">{{$t('CAP.ykqqq')}}</span>
              <span class="open" v-if="securityData.SmartVerify">{{$t('CAP.ygbqqq')}}</span>
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
        { title: "賬號場景", content: "登入、註冊、找回密碼等" },
        { title: "簡訊場景", content: "發送簡訊、郵箱驗證碼等" },
        { title: "活動場景", content: "秒殺、領券、搶紅包等" },
        { title: "其他場景", content: "評論、投票、發帖等" }
      ],
      verificationData: [
        { title: "滑動驗證碼", content: "簡潔體驗，快速通過" },
        { title: "VTT驗證碼", content: "極致防護，倍享安全" }
      ],
      toolmsg: ['體驗優先',  '平衡','安全優先'],
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