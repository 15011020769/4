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
                :class="{active:colorIndex==i}"
                @click="screenSelect(i)"
              >
                <p :class="{open:colorIndex==i}">{{v.title}}</p>
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
              <el-slider v-model="value2" :step="50" show-stops></el-slider>
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
            <ul>
              <li>智能验证引擎</li>
              <li>
                开启验证码智能验证引擎，将根据你业务的实时风险情况下发不同类型的验证码。
                把简单验证码下发给真实用户，把复杂验证码下发给恶意访问
              </li>
            </ul>
            <div class="verification">
              <div class="verification-switch">
                <el-switch
                  v-model="switch1"
                  active-color="#006ef0"
                  inactive-color="#e4e7ed"
                  @change="switch1Change"
                ></el-switch>
                <span class="close" v-if="!switch1">已关闭智能引擎，可自行指定验证码类型</span>
                <span class="open" v-if="switch1">已开启智能引擎，将自动感知恶意调整验证码</span>
              </div>
              <div class="choose-select">
                <div
                  class="choose-button"
                  v-for="(v,i) in verificationData "
                  :key="i"
                  :class="{active:true}"
                >
                  <p>{{v.title}}</p>
                  <p>{{v.content}}</p>
                </div>
              </div>
              <el-row>
                <el-button type="primary">立即保存</el-button>
                <span>保存本页面所有的设置</span>
              </el-row>
            </div>
          </div>
          <div class="model-level">
            <ul>
              <li>智能免验证 <span class="open">内测中</span></li>
              <li>为可信用户跳过验证环节，秒过验证码，体验更优秀</li>
            </ul>
            <div class="verification-switch">
              <el-switch
                v-model="switch2"
                active-color="#006ef0"
                inactive-color="#e4e7ed"
                @change="switch2Change"
              ></el-switch>
              <span class="close" v-if="!switch2">已关闭免验证，所有访问都需完成验证码</span>
              <span class="open" v-if="switch2">已开启免验证，可信用户将跳过验证码环节</span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
  </div>
</template>
<script>
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
      value2: 0,
      switch1: false,
      switch2: false
    };
  },
  methods: {
    screenSelect(i) {
      this.colorIndex = i;
    },
    switch2Change() {},
    switch1Change() {}
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
        span:nth-of-type(1){
          font-weight: 600;
        }
        span:nth-of-type(2){
          font-size:14px;
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
          ul {
            width: 85%;
            margin-bottom: 30px;
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
              line-height: 2.6;
            }
            p:nth-of-type(2) {
              color: #666;
            }
          }
          .verification {
            .choose-select {
              margin-bottom: 30px;
            }
            & >>> .el-row span {
              margin-left: 10px;
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
          padding-left: 20px;
          ul {
            margin-bottom: 30px;
            li {
              padding: 10px 0px;
              span{
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
.active {
  border-color: #006ef0 !important;
}
.close {
  color: #666;
}
.open {
  color: #006ef0;
}
</style>