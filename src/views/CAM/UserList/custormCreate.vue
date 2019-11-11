<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">自定义用户创建</span>
    </div>
    <div class="container">
      <div class="breadnav">
          <div class="tea-step__item is-current">
            <div class="tea-step__num">1</div>
            <div class="tea-step__content">
              <div class="tea-step__title">填写用户信息</div>
            </div>
            <div class="el-icon-arrow-right" style="width:30px;height: 30px;margin:0 30px;text-align: center;line-height: 30px;"></div>
          </div>
          <div class="tea-step__item">
            <div class="tea-step__num">2</div>
            <div class="tea-step__content">
              <div class="tea-step__title">设置用户权限</div>
              </div>
            <div class="el-icon-arrow-right" style="width:30px;height: 30px;margin:0 30px;text-align: center;line-height: 30px;"></div>
          </div>
          <div class="tea-step__item">
            <div class="tea-step__num">3</div>
            <div class="tea-step__content">
              <div class="tea-step__title">审阅信息和权限</div>
            </div>
          </div>
      </div>
      <div class="tea-alert">
        <div class="tea-alert__info">因子用户登录使用用户名，用户名一经确定将无法更改。在创建用户后，您可以查看并下载密钥等相关信息。</div>
      </div>
      <div class="tea-form">
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>设置用户信息</label>
          </div>
          <div class="tea-form__controls">
            <div class="tea-table tea-table--bordered tea-table--scrollable">
              <div class="tea-table__header">
                <table class="tea-table__box">
                  <colgroup>
                    <col style="width: 220px;">
                    <col style="width: 15%;">
                    <col style="width: 320px;">
                    <col style="width: 18%;">
                    <col style="width: 15%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="">
                        <div>用户名
                          <span class="text-danger required-text-danger">*</span>
                        </div>
                      </th>
                      <th class="">
                        <div>
                          <span class="tea-text-overflow">备注</span>
                        </div>
                      </th>
                      <th class="">
                        <div>
                          <span class="tea-text-overflow">手机</span>
                        </div>
                      </th>
                      <th class="">
                        <div>
                          <span class="tea-text-overflow">邮箱</span>
                        </div>
                      </th>
                      <th class="">
                        <div>
                          <span class="tea-text-overflow"></span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="tea-table__body">
                <table class="tea-table__box">
                  <colgroup><col style="width: 220px;"><col style="width: 15%;"><col style="width: 320px;"><col style="width: 18%;"><col style="width: 15%;"></colgroup>
                  <tbody>
                    <tr>
                      <td class="">
                        <div>
                          <input class="tea-input" name="list[0].name" value="">
                        </div>
                      </td>
                      <td class=""><div><input class="tea-input" value=""></div></td>
                      <td>
                        <div>
                          <div style="display: flex; flex-flow: row wrap;">
                            <select class="tea-select" placeholder="请选择" style="width: 150px; margin-right: 4px;">
                              <option value="">111</option>
                              <option value="">222</option>
                            </select>
                            <input class="tea-input size-s"  value="">
                          </div>
                        </div>
                      </td>
                      <td class=""><div><input class="tea-input"  value=""></div></td>
                      <td class=""><div><button class="tea-btn tea-btn--link">删除</button></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="display: flex; align-items: center; padding: 10px 10px 10px 0px;">
              <button class="tea-btn tea-btn--weak">新增用户</button>
              <div class="tea-form__text" style="margin-left: 10px;">(单次最多创建10个用户)</div>
            </div>
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>接收微信消息</label>
          </div>
          <div class="tea-form__controls tea-form__controls--text">
            <div>
              <label class="tea-switch">
                <input readonly="" type="checkbox" class="tea-switch__input">
                <span class="tea-switch__toggle"></span>
              </label>
            </div>
            <div class="tea-form__help-text">
              <p>1.邮箱将收到一封包含二维码的邮件，微信扫码并关注公众号即可接收通知<br>2.前往 消息中心-&gt;消息订阅 设置微信为接收方式后即可接收消息。</p>
            </div>
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>访问方式</label>
          </div>
          <div class="tea-form__controls tea-form__controls--text">
            <div style="padding-bottom: 10px;">
              <label class="tea-form-check">
                <input readonly="" type="checkbox" class="tea-checkbox">
                <span class="tea-form-check__label">编程访问</span>
              </label>
            <div class="tea-form__text" style="color: rgb(153, 153, 153); padding: 5px 0px 0px 20px; font-size: 12px;">启用SecretId和SecretKey，支持腾讯云API、SDK和其他开发工具访问</div>
            </div>
            <div style="padding-bottom: 10px;">
              <label class="tea-form-check">
                <input readonly="" type="checkbox" class="tea-checkbox">
                <span class="tea-form-check__label">腾讯云控制台访问</span>
              </label>
              <div class="tea-form__text" style="color: rgb(153, 153, 153); padding: 5px 0px 0px 20px; font-size: 12px;">启用密码，允许用户登录到腾讯云控制台</div>
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
      goback () {
        this.$router.push({name: 'NewUser'})
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
      font-size: 18px;
      font-weight: bolder;
      margin-left: 20px;
    }
  }
  .container {
    width:96%;
    min-height: 500px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
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
        .tea-step__num{
            background-color: #006eff;
            border: 2px solid #006eff;
            color:#fff;
        }
        .tea-step__content {
          .tea-step__title {
            color:#000;
          }
        }
        
      }
    }
    .tea-alert, .tea-alert__info {
        font-size: 12px;
        line-height: inherit;
    }
    .tea-alert {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
    }
    .tea-form {
        display: table;
        font-size: 12px;
        line-height: 1.5;
        .tea-form__item {
            display: table-row;
            .tea-form__label {
              vertical-align: baseline;
              color: #888;
              padding-right: 20px;
              padding-top: 12px;
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
              label:after {
                  display: inline-block;
                  content: "*";
                  color: #e1504a;
                  line-height: 1;
                  position: absolute;
                  margin: 5px 0 0 3px;
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
                
                  .tea-btn--weak {
                    background-color: #fff;
                    border-color: #ddd;
                    color: #000;
                }
                .tea-form__text {
                    font-size: 12px;
                    color: #444;
                    vertical-align: middle;
                }
                .tea-table.tea-table--bordered {
                    border: 1px solid #ddd;
                    border-bottom: none;
                }
                .tea-table {
                    background-color: #fff;
                    overflow: inherit;
                    .tea-table__header {
                        border-bottom: 1px solid #ddd;
                        overflow: hidden;
                        background-color: #fff;
                        .tea-table__box {
                            border-collapse: collapse;
                            border-spacing: 0;
                            table-layout: fixed;
                            width: 100%;
                            position: relative;
                            thead {
                                background-color: transparent;
                                border: 0;
                                color: #666;
                                font-size: 12px;
                                font-weight: 700;
                                margin-right: 0;
                                width: 100%;
                                display: table-header-group;
                                vertical-align: middle;
                                tr {
                                  background-color: #fff;
                                  outline: 0;
                                  th {
                                    position: relative;
                                    padding: 10px;
                                    text-align: left;
                                    vertical-align: middle;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    -webkit-box-sizing: initial;
                                    box-sizing: initial;
                                    div {
                                        display: inline-block;
                                        vertical-align: middle;
                                        font-size: 12px;
                                        width: 100%;
                                        padding: 0;
                                        word-wrap: break-word;
                                        .required-text-danger {
                                          vertical-align: -4px;
                                          font-size: 16px;
                                          margin-left: 3px;
                                          line-height: 5px;
                                          display: inline-block;
                                          height: 5px;
                                        }
                                        .text-danger {
                                          color: #e54545 !important;
                                        }
                                    }
                                  }
                                }
                            }
                        }
                    }
                    .tea-table__body {
                        border-bottom: 1px solid #e5e5e5;
                        overflow: auto;
                        .tea-table__box {
                            border-collapse: collapse;
                            border-spacing: 0;
                            table-layout: fixed;
                            width: 100%;
                            position: relative;
                            tr{
                              td {
                                  border-bottom: 1px solid #e5e5e5;
                                  color: #444;
                                  padding-top: 14px;
                                  padding-bottom: 14px;
                                  height: auto;
                                  text-align: left;
                                  vertical-align: middle;
                                  font-size: 0;
                                  padding-left: 10px;
                                  padding-right: 10px;
                                  -webkit-box-sizing: initial;
                                  box-sizing: initial;
                                  div {
                                    display: inline-block;
                                    vertical-align: middle;
                                    font-size: 12px;
                                    width: 100%;
                                    padding: 0;
                                    word-wrap: break-word;
                                    .tea-input {
                                        vertical-align: middle;
                                        width: 200px;
                                        max-width: 100%;
                                    }
                                    .tea-input, .tea-textarea {
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
                                        -webkit-transition: .2s ease-in-out;
                                        transition: .2s ease-in-out;
                                        -webkit-transition-property: color,background-color,border;
                                        transition-property: color,background-color,border;
                                    }
                                    .tea-input.size-s, .tea-select.size-s, .tea-textarea.size-s {
                                        width: 100px;
                                        min-width: 0;
                                    }
                                    
                                    
                                    .tea-btn--link {
                                        margin-right: 8px;
                                        color: #006eff;
                                        display: inline-block;
                                        text-align: center;
                                        height: auto;
                                        vertical-align: middle;
                                        text-decoration: none;
                                        line-height: 1.5;
                                        background-color: transparent;
                                        border: none;
                                    }
                                  }
                              }
                            } 
                            tr:last-child td {
                                border-bottom: none;
                            }
                            
                        }
                    }
                }
                
            }
            .tea-form__controls--text {
              padding-top: 10px;
              .tea-switch {
                    position: relative;
                    display: inline-block;
                    vertical-align: middle;
                    width: 35px;
                    height: 20px;
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
                    .tea-switch__input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        opacity: 0;
                    }
                    .tea-switch__toggle {
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        border-radius: 26px;
                        overflow: hidden;
                        background-color: #888;
                        padding: 0;
                        -webkit-transition-duration: .4s;
                        transition-duration: .4s;
                        -webkit-transition-property: background-color;
                        transition-property: background-color;
                        font-size: 0;
                        cursor: pointer;
                    }
                    .tea-switch__toggle:before {
                        content: "";
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        width: 16px;
                        height: 16px;
                        border-radius: 100%;
                        background-color: #fff;
                        pointer-events: none;
                        -webkit-transition-timing-function: cubic-bezier(.54,1.85,.5,1);
                        transition-timing-function: cubic-bezier(.54,1.85,.5,1);
                        -webkit-transition-duration: .4s;
                        transition-duration: .4s;
                        -webkit-transition-property: left;
                        transition-property: left;
                        -webkit-box-shadow: 0 3px 6px rgba(0,0,0,.3);
                        box-shadow: 0 3px 6px rgba(0,0,0,.3);
                    }
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
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        vertical-align: middle;
                        outline: 0;
                        -webkit-appearance: none;
                        border: 1px solid #bbb;
                        background-color: #fff;
                        position: absolute;
                        top:0;
                        left: 0;
                    }
                    .tea-form-check__label {
                        line-height: 16px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-left: 5px;
                    }
                    .tea-form__text {
                        font-size: 12px;
                        color: #444;
                        vertical-align: middle;
                    }
                }
              }
              .tea-form__help-text {
                  font-size: 12px;
                  color: #888;
                  vertical-align: middle;
                  margin-top: 8px;
              }
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
