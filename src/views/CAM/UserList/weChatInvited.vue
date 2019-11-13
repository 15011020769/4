<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">微信邀请</span>
    </div>
    <div class="container">
      <div class="breadnav">
        <div class="tea-step__item is-current">
          <div class="tea-step__num">1</div>
          <div class="tea-step__content">
            <div class="tea-step__title">预设信息</div>
          </div>
          <div
            class="el-icon-arrow-right"
            style="width:30px;height: 30px;margin:0 30px;text-align: center;line-height: 30px;"
          ></div>
        </div>
        <div class="tea-step__item">
          <div class="tea-step__num">2</div>
          <div class="tea-step__content">
            <div class="tea-step__title">设置用户权限</div>
          </div>
          <div
            class="el-icon-arrow-right"
            style="width:30px;height: 30px;margin:0 30px;text-align: center;line-height: 30px;"
          ></div>
        </div>
        <div class="tea-step__item">
          <div class="tea-step__num">3</div>
          <div class="tea-step__content">
            <div class="tea-step__title">生成邀请二维码</div>
          </div>
        </div>
      </div>

      <div class="tea-form">
        <div>
          <h3 style="margin-bottom: 12px;">邀请设置</h3>
          <div class="tea-form__item">
            <div class="tea-form__label">
              <label>邀请用户数</label>
            </div>
            <div class="tea-form__controls tea-form__controls--text">
              <input class="tea-input" name="num" value />
              <span class style="font-size: 12px; margin-left: 5px; vertical-align: middle;">个</span>
            </div>
          </div>
          <div class="tea-form__item">
            <div class="tea-form__label">
              <label>邀请有效时长</label>
            </div>
            <div class="tea-form__controls tea-form__controls--text">
              <input class="tea-input" name="time" value />
              <span class style="font-size: 12px; margin-left: 5px; vertical-align: middle;">小时</span>
            </div>
          </div>
          <div
            style="padding-top: 20px; border-top: 1px solid rgb(221, 221, 221); margin-top: 20px;"
          >
            <h3 style="margin-bottom: 12px;">账号设置</h3>
            <div class="tea-form__item">
              <div class="tea-form__label">
                <label>访问类型</label>
              </div>
              <div class="tea-form__controls tea-form__controls--text">
                <div style="padding-bottom: 10px;">
                  <label class="tea-form-check">
                    <input readonly type="checkbox" class="tea-checkbox" />
                    <span class="tea-form-check__label">编程访问</span>
                  </label>
                  <div
                    class="tea-form__text"
                    style="color: rgb(153, 153, 153); padding: 5px 0px 0px 20px; font-size: 12px;"
                  >启用SecretId和SecretKey，支持腾讯云API、SDK和其他开发工具访问</div>
                </div>
                <div style="padding-bottom: 10px;">
                  <label class="tea-form-check">
                    <input readonly type="checkbox" class="tea-checkbox" disabled checked />
                    <span class="tea-form-check__label">腾讯云控制台访问</span>
                  </label>
                  <div
                    class="tea-form__text"
                    style="color: rgb(153, 153, 153); padding: 5px 0px 0px 20px; font-size: 12px;"
                  >启用密码，允许用户登录到腾讯云控制台</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        
      </div>
      <div style="padding-top: 20px; border-top: 1px solid rgb(221, 221, 221); margin-top: 20px;">
        <button class="tea-btn">下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goback() {
      this.$router.push({ name: "NewUser" });
    }
  }
};
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
      font-size: 18px;
      font-weight: bolder;
      margin-left: 20px;
    }
  }
  .container {
    width: 96%;
    min-height: 500px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
    .tea-btn {
      height: 30px;
      min-width: 24px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      line-height: 30px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      outline: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-decoration: none;
      font-size: 12px;
      vertical-align: middle;
      white-space: nowrap;
    }
    .breadnav {
      margin: 0px auto 20px;
      padding: 20px 0px 20px;
      border-bottom: 1px solid rgb(221, 221, 221);
      .tea-step__item {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        .tea-step__num {
          display: inline-block;
          position: relative;
          width: 30px;
          height: 30px;
          border: 2px solid #ddd;
          background-color: #fff;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          line-height: 28px;
          border-radius: 50%;
          margin-right: 10px;
          text-align: center;
          color: #bbb;
          font-size: 16px;
        }
        .tea-step__content {
          display: inline-block;
          vertical-align: middle;
          font-size: 16px;
          .tea-step__title {
            font-weight: 700;
            max-width: 10em;
            color: #bbb;
          }
        }
        .tea-step__num:before {
          font-size: 16px;
          font-weight: 700;
        }
      }
      .is-current {
        .tea-step__num {
          background-color: #006eff;
          border: 2px solid #006eff;
          color: #fff;
        }
        .tea-step__content {
          .tea-step__title {
            color: #000;
          }
        }
      }
    }

    .tea-form {
      .tea-form__item {
        display: table-row;
        .tea-form__label {
          vertical-align: baseline;
          color: #888;
          padding-right: 20px;
          padding-top: 6px;
          padding-bottom: 6px;
          width: 1px;
          display: table-cell;
          label {
            display: inline-block;
            white-space: nowrap;
            font-size: 12px;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }
        .tea-form__controls {
          color: #000;
          word-break: break-word;
          padding-right: 24px;
          width: 100%;
          display: table-cell;
          vertical-align: top;
          padding-bottom: 16px;
          position: relative;
          padding-top: 6px;
          .tea-input {
            vertical-align: middle;
            width: 200px;
            display: inline-block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            vertical-align: middle;
            height: 30px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 0;
            color: #444;
            -webkit-transition: 0.2s ease-in-out;
            transition: 0.2s ease-in-out;
            -webkit-transition-property: color, background-color, border;
            transition-property: color, background-color, border;
          }
          .tea-form-check {
                position: relative;
                display: inline-block;
                vertical-align: middle;
                padding-left: 21px;
                margin-top: 0;
                margin-right: 18px;
                min-height: 16px;
                .tea-checkbox {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                input[type=checkbox] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    vertical-align: middle;
                    outline: 0;
                    -webkit-appearance: none;
                    border: 1px solid #bbb;
                    background-color: #fff;
                }
            }
        }
      }
    }
  }
  .cam_button {
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt {
    float: left;
  }
  .head-container {
    float: right;
  }
  .cam_button {
    position: relative;
  }
  .suo {
    position: absolute;
    right: 0;
  }
}
</style>  
