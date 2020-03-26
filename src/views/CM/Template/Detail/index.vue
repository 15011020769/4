<template>
  <div class='detail-container'>
    <div class="header">
      <div class="header1">
        <div class="header2">
          <span class="goback" @click="goBack()">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title" v-loading="loadShow">{{groupName}}</h2>
        </div>
      </div>
    </div>

    <!-- 詳情子菜單導航 -->
    <div class="detial-nav">
      <!-- <router-link class="nav-item" :to="{name:'TemplateInfo'}">範本信息</router-link> -->
      <!-- <router-link class="nav-item" :to="{name:'TemplateUpdate'}">變更日志</router-link> -->
      <router-link class="nav-item" :to="{path:`/Template/Detail/${groupId}/Info`}">範本信息</router-link>
      <router-link class="nav-item" :to="{path:`/Template/Detail/${groupId}/Update`}">變更日志</router-link>
    </div>

    <!-- 子頁面 -->
    <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
    </keep-alive>
  </div>
</template>

<script>
import { GET_CONDITIONSTEMPLATELIST } from '@/constants/CM-yhs.js'
import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共錯誤碼
export default {
  name: 'TemplateDetail',
  data () {
    return {
      loadShow: false,
      groupId: '',
      groupName: ''
    }
  },
  components: {
    Loading
  },
  created () {
    this.groudId = this.$route.params.id
    this.getGroupName()
  },
  methods: {
    async getGroupName () {
      this.loadShow = true
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupID: this.groudId
      }
      await this.axios.post(GET_CONDITIONSTEMPLATELIST, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.TemplateGroupList
          msg.forEach(ele => {
            this.groupName = ele.GroupName
            this.groupId = ele.GroupID
          })
          this.loadShow = false
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 返回上壹層
    goBack () {
      this.$router.push({
        name: 'Template'
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.detail-container{
  .container-min{
    padding: 20px;
    box-sizing: border-box;
  }
}
.header{
  color: rgb(0, 0, 0);
  // border-bottom: 1px solid rgb(221, 221, 221);
  padding: 9px 20px;
  background: rgb(255, 255, 255);
  .header1{
    display: flex;
    align-items: center;
    .header2{
      flex: 1;
      display: flex;
      align-items: center;
      .goback{
        margin-right: 10px;
        cursor: pointer;
        i{
          font-size: 16px;
          color: #006eff;
          font-weight: 800;
          height: 30px;
          line-height: 30px;
          display: inline-block;
          margin-right: 5px;
        }
        &:hover {
            color: #006eff;
        }
      }
      .header-title{
        font-size: 16px;
        font-weight: 700;
        height: 30px;
        line-height: 30px;
        margin-right: 20px;
        ::v-deep .el-loading-spinner .circular {
          width: 20px;
          height: 20px;
          margin-top: 10px;
        }
      }
    }
  }
  // &.headers {
  //   border-bottom: none;
  // }
}
.detial-nav {
    padding: 0 20px;
    background: #fff;
    position: relative;
    display: flex;

    &:after {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ddd;
    }

    .nav-item {
        height: 30px;
        line-height: 30px;
        margin-right: 20px;
        padding: 0 10px;
        font-size: 14px;
        color: #000;
        display: inline-block;
        position: relative;
        z-index: 2;

        &:after {
            position: absolute;
            content: "";
            bottom: 0;
            left: 0;
            width: 0;
            border-bottom: 2px solid transparent;
        }

        &.router-link-active {
            font-weight: 800;
        }

        &.router-link-active:after,
        &:hover:after {
            width: 100%;
            border-bottom-color: #006eff;
            -webkit-transition: border-color .15s ease-in-out, width .15s ease-in-out, height .15s ease-in-out;
            transition: border-color .15s ease-in-out, width .15s ease-in-out, height .15s ease-in-out;
        }
    }
}
// 子頁面切換動畫
.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s;
    transition: transform .2s;
}

.fade-enter,
.fade-leave-to {
    transform: translateY(5px);
    opacity: 0;
}
</style>
