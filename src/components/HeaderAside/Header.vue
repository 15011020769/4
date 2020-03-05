<template>
  <div class="portal-header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#2C303A "
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item index="1" class="logo">
        <img
          src="~@/assets/logo_5.svg"
          @click="logoClick"
          alt
          style="width: 140px; height: 60px;"
        />
      </el-menu-item>
      <el-menu-item index="2" @mouseenter.native="show=true" @mouseleave.native="show=false">
        <!-- 产品中心 -->
        <div>{{ $t("COM.center") }}</div>
      </el-menu-item>
      <!-- 定价 -->
      <el-menu-item index="10">{{ $t("COM.price") }}</el-menu-item>
      <!-- 文档中心 -->
      <el-menu-item index="3">{{ $t("COM.document") }}</el-menu-item>
      <!-- 用户中心 -->
      <el-submenu index="6" class="right-item user-info">
        <template slot="title">{{ $t("COM.userCenter") }}</template>
        <!-- 费用中心 -->
        <el-menu-item index="6-2" class="count-li">{{
          $t("COM.bill")
        }}</el-menu-item>
        <!-- 消息中心 -->
        <el-menu-item index="6-6" class="count-li">{{
          $t("COM.info")
        }}</el-menu-item>
        <!-- 返回 -->
        <el-menu-item index="6-4" class="count-li">{{
          $t("COM.back")
        }}</el-menu-item>
        <!-- 退出 -->
        <el-menu-item index="6-3" class="count-li">{{
          $t("COM.h")
        }}</el-menu-item>
      </el-submenu>
      <!-- 控制台 -->
      <el-menu-item index="8" class="right-item">{{
        $t("COM.console")
      }}</el-menu-item>
    </el-menu>

    <transition name="hehe">
      <div class="PRO-style" v-if="show" :key="1" @mouseenter="show=true" @mouseleave.stop="show=false">
        <product-center></product-center>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  clearLoginInfo
} from '@/utils'
import productCenter from './ProductCenter'
export default {
  data () {
    return {
      activeIndex: '', // 默认选中的一个导航菜单
      loginStatus: false,
      username: '',
      account: '',
      unread: 0, // 未读消息
      centerDialogVisible: false,
      show: false,
      show2: true
    }
  },
  components: {
    productCenter
  },
  created () {

  },
  mounted () {
    this.loginStatus = !!this.$cookie.get('token')
    this.username = this.$cookie.get('username') || '我的工作台'
  },
  methods: {
    Show () {
      this.show = true
    },
    Show2 (e) {
      if (
        e.toElement.className ===
          'el-autocomplete-suggestion__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default' ||
          e.toElement.className === 'name' ||
          e.toElement.className === 'el-scrollbar' ||
          e.toElement.className === 'el-menu-item is-active' ||
          e.toElement.className ===
          'el-autocomplete-suggestion__wrap el-scrollbar__wrap' ||
          e.toElement.className === 'el-scrollbar__bar is-vertical'
      ) {
        this.show = true
      } else {
        this.show = false
      }
    },

    logoClick () {
      // 点击进入门户首页
      window.location.href = process.env.VUE_APP_sysUrl + 'index.html#/homepage'
    },

    // 判断用户是否有权限
    accessControl (url) {
      // 如果uuid存在 则进入控制台 否则进入登录界面
      if (this.$cookie.get('uuid')) {
        if (this.$cookie.get('userType') === '0') {
          // '您无权查看该链接', '提示'
          this.$confirm(this.$t('cvm.cvm.buyClick.a'), this.$t('cvm.cvm.buyClick.b'), {
            showCancelButton: false,
            showConfirmButton: false,
            type: 'warning',
            center: true
          }).then(() => {}).catch(() => {})
        } else if (this.$cookie.get('userType') === '1') {
          window.location.href = process.env.VUE_APP_sysUrl + url
        }
      } else {
        window.location.href = process.env.VUE_APP_loginUrl
      }
    },

    // 菜单点击跳转
    handleSelect (key, keyPath) {
      // 文档中心
      if (key === '3') {
        // 内测中，敬请期待！
        this.$message('内测中，敬请期待！')
        window.location.href = process.env.VUE_APP_sysUrl + 'index.html#/documentcenter'
      }

      // 登录
      if (key === '7') {
        window.location.href = process.env.VUE_APP_loginUrl
      }

      // 控制台
      if (key === '8') {
        this.accessControl('product/CVM/index.html#/cloudHost')
      }

      // 注册
      if (key === '9') {
        window.location.href = process.env.VUE_APP_registerUrl
      }

      // 定价
      if (key === '10') {
        window.location.href = process.env.VUE_APP_sysUrl + 'index.html#/price'
      }

      // 费用中心
      if (key === '6-2') {
        this.accessControl('product/BILL/index.html')
      }

      // 消息中心
      if (key === '6-6') {
        this.accessControl('/product/MGC/index.html#/message')
        // 内测中，敬请期待！
        // this.$message('内测中，敬请期待！');
      }

      // 返回
      if (key === '6-4') {
        if (this.$cookie.get('subAccountName') && this.$cookie.get('subAccountName') !== '') {
          var params = {
            'QcloudUin': this.$cookie.get('uin'),
            'SubAccountname': this.$cookie.get('subAccountName')
          }
        } else {
          var params = {
            'QcloudUin': this.$cookie.get('uin')
          }
        }
        this.axios
          .post(`${process.env.VUE_APP_adminUrl}taifucloud/account/manage/forword`, params)
          .then(({
            data
          }) => {
            console.log(data)
            if (data.RetCode === '00') {
              window.location.href = data.Data.url
            } else {
              this.$message.error('返回異常，請重試')
            }
          })
      }

      // 退出
      if (key === '6-3') {
        // '确定进行[退出]操作?', '提示'
        this.$confirm(this.$t('COM.hintContent'), this.$t('COM.hintTitle'), {
          // 确定
          confirmButtonText: '確定',
          // 取消
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (this.$cookie.get('subAccountName') && this.$cookie.get('subAccountName') !== '') {
              this.subAccount() // 子账号退出
            } else {
              this.mainAccount() // 主账号退出
            }
          })
          .catch(() => {
            this.$message.error('退出異常，請重試')
          })
      }
    },

    // 主账号退出
    mainAccount () {
      let params = {
        'QcloudUin': this.$cookie.get('uin')
      }
      this.axios
        .post(`${process.env.VUE_APP_adminUrl}taifucloud/account/manage/logoutActive`, params)
        .then((data) => {
          console.log(data)
          console.log(typeof data)
          if (data.RetCode === '00') {
            // 退出我们的系统
            clearLoginInfo()
            this.loginStatus = !!this.$cookie.get('uuid')
            // 退出台湾的系统成功 跳转到登录
            window.location.href = process.env.VUE_APP_loginUrl
          } else {
            this.$message.error('退出異常，請重試')
          }
        })
    },

    // 子账号退出
    subAccount () {
      let params = {
        'QcloudUin': this.$cookie.get('uin'),
        'SubAccountname': this.$cookie.get('subAccountName')
      }
      this.axios
        .post(`${process.env.VUE_APP_adminUrl}taifucloud/account-sub/manage/logoutActive`, params)
        .then(({
          data
        }) => {
          if (data.RetCode === '00') {
            // 退出我们的系统
            clearLoginInfo()
            this.loginStatus = !!this.$cookie.get('uuid')
            // 退出台湾的系统成功 跳转到登录
            window.location.href = process.env.VUE_APP_loginUrl
          } else {
            this.$message.error('退出異常，請重試')
          }
        })
    }
  }
}

</script>

<style lang="scss" scoped>
.portal-header {
  .el-menu-demo {
    border: 0 !important;
  }

  .el-menu-item {
    font-size: 16px;
    color: white;
    border-bottom: 0;
    background-color: rgb(44, 48, 58) !important;

    &:hover {
      background-color: rgb(61, 65, 75) !important;
    }

    .el-button {
      background-color: #00a4ff;
      color: #ffffff;
      border: 0;
    }
  }

  ::v-deep .is-active {
    border-bottom: 0 solid #fff !important;
  }

  .logo {
    width: 230px;
    text-align: left;
    border-bottom: 0 !important;
    cursor: default;
    line-height: 0;

    img {
      cursor: pointer;
    }

    &:hover {
      background-color: #2c303a !important;
    }

    &:focus {
      border-bottom: 0;
    }
  }

  .right-item {
    float: right;
  }

  .user-info {
    ::v-deep .el-submenu__title {
      margin-right: 20px !important;
      border-bottom: 0 solid #fff !important;

      &:hover {
        background-color: rgb(61, 65, 75) !important;
      }
    }
  }

  .PRO-style {
    width: 800px;
    height: 470px;
    background-color: #202020;
    color: #fff;
    display: show;
    overflow: hidden;
    position: fixed;
    top: 60px;
    left: 200px;
    z-index: 10000;
  }
}

.count-li {
  text-align: left;
  padding-left: 20px !important;

  &:hover {
    background-color: #3d414b !important;
  }
}

.span-read {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  padding: 0 7px;
  margin-left: 10px;
  font-size: 12px;
  color: #fff;
  background: #fdc733;
  border-radius: 100px;
}
</style>

<style>
/* 暂时在此处处理下拉框的宽度，后期若有变化，再处理 */
.el-menu--popup {
  min-width: 138px !important;
}

.el-menu--horizontal {
  border-bottom: 0 solid #fff !important;
}
</style>
<style lang="scss">
