<template>
  <div class="overview-wrap">
    <HeaderCom :title="$t('CSS.builder.22')" />
    <div class="overview-main">
      <el-row style="text-align: center;">
        <el-col :span="24" >
          <img src="./image/cbimage.png" alt="">
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-col :span="24">
          <div class="text-top">{{$t('CSS.builder.23')}}</div>
          <div class="text-content">
            <p >{{$t('CSS.builder.24')}}</p>
            <p>{{$t('CSS.builder.25')}}</p>
            </div>
          <div>
            <el-checkbox v-model="checked" >
              同意
            </el-checkbox>
            <a href="../../index.html#/footerContent/termService" >《{{$t('CSS.builder.26')}}》</a>
            <span :class="{ 'active': checked }">和</span>
              <a href="../../index.html#/priceDocument/cssPrice">《{{$t('CSS.builder.27')}}》</a>
          </div>
          <div class="button">
            <el-button type="primary" :disabled="!checked" style="border-radius: 0;width:150px;height:40px">
              {{$t('CSS.builder.28')}}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import HeaderCom from '@/components/public/Head'

export default {
  name: 'live',
  data () {
    return {
      checked: false
    }
  },
  components: {
    HeaderCom
  },
  methods: {
    open() {
      this.axios.post('live2/OpenLiveService', {"Version": "2018-08-01"})
      .then(res => {
        if (!res || res.Response.Error) {
          this.$message({
            message: '开通失败',
            type: 'error',
            showClose: true,
            duration: 0
          })
          return
        }
        this.$alert('您已開通台富雲直播服務，新用戶專享20GB流量包已發放至您的帳號，歡迎使用直播功能。', '提示', {
          confirmButtonText: '確定',
          center: true,
          callback: () => {
            this.$router.push({
              name: 'overview',
              params: {first: true, intercept: false}
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-wrap{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(242, 242, 242);
  top: 60px;
}
.overview-main{
  height: calc(100% - 100px);
  background: #fff;
  max-width: 1360px;
  margin: 20px auto;
  // margin-top: 20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.text-top{
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bolder;
}
.text-content{
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: bolder;
  p: {
    line-height: 30px;
  }
}
.button{
  margin-top: 30px;
  margin-bottom: 50px;

}
.active{
  color: #65a5f9;
}
.message-box {
  width: auto;
}
</style>
