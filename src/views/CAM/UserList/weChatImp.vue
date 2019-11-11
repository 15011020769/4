<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">新建企业微信子用户</span>
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
      <div style="width: 800px; padding-left: 20px;">
        <div class="tea-form" style="padding-bottom: 20px;">
          <div class="tea-form__item">
            <div class="tea-form__label">
              <label>企业名称</label>
            </div>
            <div class="tea-form__controls">
              <select class="tea-select" placeholder="请选择">
                <option hidden>请选择</option>
                <option value="加载中...">加载中...</option>
              </select>
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
    min-height: 300px;
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
      display: table;
      font-size: 12px;
      line-height: 1.5;
      .tea-form__item {
        display: table-row;
        .tea-form__label {
          display: table-cell;
          vertical-align: baseline;
          color: #888;
          padding-right: 20px;
          padding-top: 6px;
          padding-bottom: 6px;
          width: 1px;
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
          .tea-select {
            display: inline-block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            vertical-align: middle;
            height: 30px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 0;
            -webkit-transition: 0.2s ease-in-out;
            transition: 0.2s ease-in-out;
            -webkit-transition-property: color, background-color, border;
            transition-property: color, background-color, border;
            background: 100% no-repeat #fff;
            color: #000;
            cursor: pointer;
            line-height: 30px;
            padding: 0 24px 0 10px;
            width: 200px;
            -webkit-appearance: none;
            -moz-appearance: none;
            -ms-appearance: none;
            appearance: none;
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
